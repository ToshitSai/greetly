# backend/app/routes/email_routes.py
from flask import Blueprint, request
from app.utils.response_helper import success_response, error_response
from app.utils.auth_helper import token_required
from app.services.brevo_service import send_transactional_email

email_bp = Blueprint('email_routes', __name__)

@email_bp.route('/send-email', methods=['POST'])
@token_required
def send_email():
    """
    POST /api/send-email
    Sends a generated message via email.
    """
    data = request.get_json()
    if not data:
        return error_response("Invalid payload", 400)
        
    to_email = data.get('to_email')
    message_text = data.get('message_text')
    subject = data.get('subject', 'Your Greetly Message!')
    to_name = data.get('to_name', 'Friend')

    if not to_email or not message_text:
        return error_response("to_email and message_text are required.", 400)

    html_content = f"""
    <html>
        <body style="font-family: sans-serif; padding: 20px;">
            <h2>You've received a Greetly message!</h2>
            <p style="font-size: 16px; border-left: 4px solid #FF5A5F; padding-left: 15px; margin-top: 20px;">
                {message_text.replace(chr(10), '<br>')}
            </p>
        </body>
    </html>
    """

    success, result = send_transactional_email(to_email, to_name, subject, html_content)
    
    if success:
        return success_response({"message": "Email sent successfully", "brevo_response": result}, 200)
    else:
        return error_response(f"Failed to send email: {result}", 500)
