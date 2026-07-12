# backend/app/services/brevo_service.py
import requests
from flask import current_app

def send_transactional_email(to_email, to_name, subject, html_content):
    """
    Sends an email using Brevo's transactional email API.
    """
    api_key = current_app.config.get('BREVO_API_KEY')
    sender_email = current_app.config.get('BREVO_SENDER_EMAIL', 'hello@greetly.ai')
    sender_name = current_app.config.get('BREVO_SENDER_NAME', 'Greetly AI')
    
    if not api_key or api_key == "your_brevo_api_key_here":
        return False, "BREVO_API_KEY is not configured."

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json"
    }

    payload = {
        "sender": {"name": sender_name, "email": sender_email},
        "to": [{"email": to_email, "name": to_name}],
        "subject": subject,
        "htmlContent": html_content
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        if response.status_code in [200, 201, 202]:
            return True, response.json()
        else:
            return False, f"Brevo API Error: {response.text}"
            
    except Exception as e:
        return False, str(e)
