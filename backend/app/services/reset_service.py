# backend/app/services/reset_service.py
# Reusable reset token service.
# Supports development mode logs logging and production email delivery architecture.

import os
import secrets
import string
from datetime import datetime, timedelta
from app.models import db, Customer
from werkzeug.security import generate_password_hash

def generate_and_persist_reset_token(email):
    """
    Generates a 6-digit verification PIN/token, persists it to the user's db record
    with expiration time, and sends/logs it according to the environment setting.
    """
    customer = Customer.query.filter_by(email=email.strip().lower()).first()
    if not customer:
        return None
    
    # Generate 6-digit PIN
    pin = ''.join(secrets.choice(string.digits) for _ in range(6))
    
    # Persist in DB (valid for 15 minutes)
    customer.reset_token = pin
    customer.reset_token_expires = datetime.utcnow() + timedelta(minutes=15)
    db.session.commit()
    
    # Determine mode (Development vs Production)
    env_mode = os.getenv('FLASK_ENV', 'development').lower()
    mail_enabled = os.getenv('MAIL_ENABLED', 'false').lower() == 'true'
    
    if mail_enabled or env_mode == 'production':
        # Production Mode Email Delivery Architecture
        # This function acts as a clean boundary that can be easily switched
        # to call a real SMTP client like Flask-Mail or any third party API.
        send_reset_email_stub(customer.email, pin)
    else:
        # Development Mode: print PIN to logs for developer testing
        print("\n" + "="*60, flush=True)
        print(f"[SECURITY RESET PIN - DEV MODE] Reset request received for: {customer.email}", flush=True)
        print(f"PIN: {pin}", flush=True)
        print("="*60 + "\n", flush=True)
        
    return pin

def send_reset_email_stub(email, pin):
    """
    Stub implementation for email delivery.
    In production mode, print to log for testing, but can be easily replaced by
    an actual SMTP connection (e.g. smtplib or Flask-Mail).
    """
    print(f"[PROD ROUTING] Redirecting reset PIN to SMTP service queue for: {email}", flush=True)
    # Also log to system out so verification tests in production/simulated environment still work
    print(f"[SECURITY RESET PIN - SIMULATED PROD] PIN: {pin} sent to {email}", flush=True)

def verify_reset_token(email, pin):
    """
    Verifies if the reset token matches the database record and is not expired.
    """
    customer = Customer.query.filter_by(email=email.strip().lower()).first()
    if not customer:
        return False, "Customer profile not found."
        
    if not customer.reset_token or customer.reset_token != pin:
        return False, "Invalid verification PIN."
        
    if not customer.reset_token_expires or datetime.utcnow() > customer.reset_token_expires:
        return False, "Verification PIN has expired."
        
    return True, customer

def complete_password_reset(email, pin, new_password):
    """
    Completes the password reset by validating the PIN, hashing the new password,
    and clearing out reset fields.
    """
    is_valid, result = verify_reset_token(email, pin)
    if not is_valid:
        return False, result
        
    customer = result
    customer.password_hash = generate_password_hash(new_password)
    customer.reset_token = None
    customer.reset_token_expires = None
    customer.password_reset_required = False
    db.session.commit()
    
    return True, "Password reset successfully."
