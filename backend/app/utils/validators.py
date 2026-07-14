# backend/app/utils/validators.py
# This file handles request payload validation logic for all API controllers.
# It checks field formats, required keys, and types to protect route handlers.

import re
from marshmallow import ValidationError
from app.schemas import CustomerRegisterSchema, MessageGenerationSchema, MessageEditSchema

PASSWORD_REGEX = re.compile(r'^.{6,128}$')

def validate_customer_data(data):
    """Validates parameters for registering a customer."""
    if not data:
        return "Request body cannot be empty"
        
    schema = CustomerRegisterSchema()
    try:
        schema.load(data)
    except ValidationError as err:
        return f"Validation error: {err.messages}"
    return None

def validate_password_strength(password):
    """Require a password with reasonable length."""
    if not password:
        return "Password is required."
    if not PASSWORD_REGEX.match(password):
        return "Password must be between 6 and 128 characters long."
    return None

def validate_recipient_data(data):
    """Validates parameters for adding a recipient."""
    if not data:
        return "Request body cannot be empty"
        
    customer_id = data.get('customer_id')
    name = data.get('name')
    relationship = data.get('relationship')
    
    if not customer_id:
        return "customer_id is a required field"
    if not isinstance(customer_id, int):
        return "customer_id must be an integer"
    if not name or not name.strip():
        return "Name is a required field"
    if not relationship or not relationship.strip():
        return "Relationship is a required field"
        
    return None

def validate_message_generation(data):
    """Validates parameters for message generation requests."""
    if not data:
        return "Request body cannot be empty"
        
    schema = MessageGenerationSchema()
    try:
        schema.load(data)
    except ValidationError as err:
        return f"Validation error: {err.messages}"
        
    return None

def validate_message_edit(data):
    """Validates parameters for editing a message."""
    if not data:
        return "Request body cannot be empty"
        
    schema = MessageEditSchema()
    try:
        schema.load(data)
    except ValidationError as err:
        return f"Validation error: {err.messages}"
        
    return None
