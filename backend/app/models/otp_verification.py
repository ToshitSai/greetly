# backend/app/models/otp_verification.py
# This model represents the password reset OTP records, supporting secure hashing and expiration tracking.

from app.models import db
from datetime import datetime

class OTPVerification(db.Model):
    __tablename__ = 'otp_verifications'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)
    otp = db.Column(db.String(64), nullable=False)  # Stores SHA-256 hash (64 hex characters)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    attempts = db.Column(db.Integer, default=0, nullable=False)
    used = db.Column(db.Boolean, default=False, nullable=False)

    # Relationship to Customer model
    user = db.relationship('Customer', backref=db.backref('otp_verifications', cascade='all, delete-orphan', lazy=True))
