# backend/app/routes/customer_routes.py
# This blueprint file implements REST API endpoints for customer management.

from flask import Blueprint, request
from app.utils.response_helper import success_response, error_response
from app.utils.validators import validate_customer_data
from app.services.customer_service import create_customer, get_all_customers, get_customer_by_id
from app.models import Recipient, Message

customer_bp = Blueprint('customer_routes', __name__)

from app.utils.auth_helper import token_required
from flask import g

@customer_bp.route('/customers', methods=['POST'])
@token_required
def add_customer():
    """
    POST /api/customers
    Creates a new customer. (Admin only)
    """
    try:
        if g.role != 'admin':
            return error_response("Access denied. Admin privileges required.", 403)
            
        data = request.get_json()
        
        # 1. Validate payload
        validation_error = validate_customer_data(data)
        if validation_error:
            return error_response(validation_error, 400)
            
        # 2. Save customer
        customer = create_customer(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone')
        )
        return success_response(customer.to_dict(), 201)
        
    except ValueError as ve:
        return error_response(str(ve), 409)  # 409 Conflict for duplicate emails
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", 500)

@customer_bp.route('/customers', methods=['GET'])
@token_required
def list_customers():
    """
    GET /api/customers
    Lists all customer records. (Admin only)
    """
    try:
        if g.role != 'admin':
            return error_response("Access denied. Admin privileges required.", 403)
        customers = get_all_customers()
        return success_response([c.to_dict() for c in customers])
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", 500)

@customer_bp.route('/customers/<int:customer_id>', methods=['GET'])
@token_required
def get_customer(customer_id):
    """
    GET /api/customers/:id
    Retrieves details of a single customer. (Owner or Admin)
    """
    try:
        if g.role != 'admin' and g.user_id != customer_id:
            return error_response("Access denied. You can only view your own profile.", 403)
            
        customer = get_customer_by_id(customer_id)
        if not customer:
            return error_response("Customer not found", 404)
        return success_response(customer.to_dict())
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", 500)

@customer_bp.route('/admin/customers/<int:customer_id>/overview', methods=['GET'])
@token_required
def get_customer_overview(customer_id):
    """
    GET /api/admin/customers/:id/overview
    Returns a single admin-friendly payload with the customer's profile,
    recipients, and recent messages.
    """
    try:
        if g.role != 'admin':
            return error_response("Access denied. Admin privileges required.", 403)

        customer = get_customer_by_id(customer_id)
        if not customer:
            return error_response("Customer not found", 404)

        recipients = Recipient.query.filter_by(customer_id=customer_id).order_by(Recipient.created_at.desc()).all()
        messages = Message.query.filter_by(customer_id=customer_id).order_by(Message.created_at.desc()).limit(50).all()

        return success_response({
            "customer": customer.to_dict(),
            "recipients": [recipient.to_dict() for recipient in recipients],
            "messages": [message.to_dict() for message in messages],
            "counts": {
                "recipients": len(recipients),
                "messages": len(messages)
            }
        })
    except Exception as e:
        return error_response(f"An unexpected error occurred: {str(e)}", 500)
