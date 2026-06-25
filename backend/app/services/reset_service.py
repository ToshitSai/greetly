# backend/app/services/reset_service.py
# Reusable reset OTP service.
# Supports SHA-256 secure hashing, Resend API sending, rate limiting, and database validation.

import os
import secrets
import string
import hashlib
import urllib.request
import urllib.error
import json
from datetime import datetime, timedelta
from app.models import db, Customer
from app.models.otp_verification import OTPVerification
from werkzeug.security import generate_password_hash

def hash_otp(otp_str):
    """Hashes the OTP using SHA-256 before storing or comparing."""
    return hashlib.sha256(otp_str.encode('utf-8')).hexdigest()

def cleanup_expired_otps(user_id=None):
    """Deletes expired OTP records from the database to prevent accumulation."""
    try:
        now = datetime.utcnow()
        if user_id:
            db.session.query(OTPVerification).filter(
                OTPVerification.user_id == user_id,
                OTPVerification.expires_at < now
            ).delete()
        else:
            db.session.query(OTPVerification).filter(
                OTPVerification.expires_at < now
            ).delete()
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"[CLEANUP ERROR] Failed to clean expired OTPs: {str(e)}", flush=True)

def generate_and_send_otp(customer):
    """
    Validates rate limits, generates a cryptographically secure 6-digit OTP,
    hashes it, stores it, and sends the raw OTP via Resend.
    """
    now = datetime.utcnow()
    
    # 1. Enforce rate limiting: Max 5 requests per hour
    one_hour_ago = now - timedelta(hours=1)
    hourly_count = OTPVerification.query.filter(
        OTPVerification.user_id == customer.id,
        OTPVerification.created_at >= one_hour_ago
    ).count()
    if hourly_count >= 5:
        return False, "Rate limit exceeded. Maximum 5 OTP requests per hour."

    # 2. Enforce rate limiting: 60-second cooldown
    last_record = OTPVerification.query.filter_by(
        user_id=customer.id
    ).order_by(OTPVerification.created_at.desc()).first()
    if last_record and (now - last_record.created_at < timedelta(seconds=60)):
        return False, "Please wait 60 seconds before requesting another code."

    # 3. Clean up expired OTPs for this user
    cleanup_expired_otps(customer.id)

    # 4. Invalidate any previous active OTPs for the user
    OTPVerification.query.filter_by(user_id=customer.id, used=False).update({"used": True})
    db.session.commit()

    # 5. Generate secure 6-digit OTP
    otp = ''.join(secrets.choice(string.digits) for _ in range(6))
    hashed_otp = hash_otp(otp)

    # 6. Save OTP record to database
    otp_record = OTPVerification(
        user_id=customer.id,
        otp=hashed_otp,
        expires_at=now + timedelta(minutes=10)
    )
    db.session.add(otp_record)
    db.session.commit()

    # 7. Check if API key is present
    api_key = os.getenv("RESEND_API_KEY")
    is_dev = os.getenv("FLASK_ENV", "development").lower() != "production"

    if not api_key:
        # Dev console logging
        print("\n" + "="*60, flush=True)
        print(f"[SECURITY RESET OTP - DEV CONSOLE LOG] Code: {otp} for {customer.email}", flush=True)
        print("="*60 + "\n", flush=True)
        
        if is_dev:
            # In development, we return success so developers can test the rest of the flow
            return True, otp
        else:
            return False, "Email service is temporarily unavailable. Please try again later."

    # 8. Send raw OTP via Resend API
    from_email = os.getenv("RESEND_FROM_EMAIL", "WishForge <onboarding@resend.dev>")
    subject = "WishForge Password Reset Code"
    body = f"""Hello,

Your WishForge verification code is:

{otp}

This code expires in 10 minutes.

If you did not request this password reset, simply ignore this email.

Regards,
WishForge Team"""

    payload = {
        "from": from_email,
        "to": [customer.email],
        "subject": subject,
        "text": body
    }
    
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            response.read() # Read response body
            # If in dev mode, we still log it for convenience
            if is_dev:
                print(f"[DEV DEBUG] Raw OTP emailed: {otp} for {customer.email}", flush=True)
            return True, otp
    except Exception as e:
        print(f"[RESEND EXCEPTION] Email sending failed: {str(e)}", flush=True)
        # Log temp OTP to console so developers don't get locked out by transient Resend issues
        print(f"[DEV DEBUG FALLBACK] Transient email fail. Code: {otp} for {customer.email}", flush=True)
        return False, "Email service is temporarily unavailable. Please try again later."

def verify_otp_record(email, otp_val):
    """
    Verifies if the OTP record exists, matches, is not expired,
    and has not breached attempts limit.
    """
    if not email or not otp_val:
        return False, "Email and verification code are required."

    email_clean = email.strip().lower()
    customer = Customer.query.filter_by(email=email_clean).first()
    if not customer:
        return False, "Invalid email address or verification code."

    # Clean up expired records
    cleanup_expired_otps(customer.id)

    # Find the latest active unused record
    otp_record = OTPVerification.query.filter_by(
        user_id=customer.id,
        used=False
    ).order_by(OTPVerification.created_at.desc()).first()

    if not otp_record:
        return False, "No active verification code found."

    # Check lock limits
    if otp_record.attempts >= 5:
        return False, "Verification locked. Too many failed attempts. Please request a new code."

    # Check expiration
    if datetime.utcnow() > otp_record.expires_at:
        return False, "Verification code has expired. Please request a new one."

    # Check OTP hash
    hashed_input = hash_otp(otp_val.strip())
    if otp_record.otp != hashed_input:
        otp_record.attempts += 1
        db.session.commit()
        remaining = 5 - otp_record.attempts
        if remaining <= 0:
            return False, "Verification locked. Too many failed attempts. Please request a new code."
        return False, f"Invalid verification code. {remaining} attempts remaining."

    return True, otp_record

def validate_password_strength(password):
    """Enforces minimum 8 chars, uppercase, lowercase, and numeric complexity."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter."
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter."
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number."
    return True, ""

def reset_user_password(email, otp_val, new_password):
    """Verifies OTP, validates password strength, updates password, and consumes OTP."""
    # 1. Verify OTP
    is_valid, result = verify_otp_record(email, otp_val)
    if not is_valid:
        return False, result

    otp_record = result
    
    # 2. Validate Password Strength
    pass_ok, pass_msg = validate_password_strength(new_password)
    if not pass_ok:
        return False, pass_msg

    # 3. Update Password
    customer = Customer.query.get(otp_record.user_id)
    if not customer:
        return False, "Customer profile not found."

    customer.password_hash = generate_password_hash(new_password)
    customer.password_reset_required = False
    
    # Consume OTP and invalidate all other pending codes for the user
    OTPVerification.query.filter_by(user_id=customer.id, used=False).update({"used": True})
    db.session.commit()

    return True, "Password reset successfully."
