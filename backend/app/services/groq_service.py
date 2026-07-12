# backend/app/services/groq_service.py

import os
from groq import Groq
from flask import current_app

def generate_message_with_ai(prompt, occasion_name, tone_name, recipient_name, relationship, exclude_texts=None, extra_note=None):
    """
    Calls the Groq API to generate a greeting message.
    Returns: (message_text, ai_used_boolean, debug_info_dict)
    """
    api_key = current_app.config.get('GROQ_API_KEY')
    if not api_key or api_key == "your_groq_api_key_here":
        return None, False, {"error_msg": "GROQ_API_KEY is not configured.", "response_status": 500}

    try:
        client = Groq(api_key=api_key)
        
        system_prompt = f"You are a warm, creative greeting-message writer. Write a {tone_name} greeting message for a {occasion_name}, addressed to {recipient_name}, who is the user's {relationship}. Keep it under 80 words. Make it feel personal and heartfelt, not generic."
        
        if extra_note:
            system_prompt += f" Additional context: {extra_note}."
            
        if exclude_texts:
            system_prompt += " Do NOT generate a message identical to these previous ones: " + " | ".join(exclude_texts)
            
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=150
        )
        
        message_text = response.choices[0].message.content.strip()
        # Clean up quotes if generated
        if message_text.startswith('"') and message_text.endswith('"'):
            message_text = message_text[1:-1]
            
        return message_text, True, {"model_used": "llama3-8b-8192"}
        
    except Exception as e:
        error_msg = str(e)
        status_code = getattr(e, 'status_code', 500)
        return None, False, {"error_msg": error_msg, "response_status": status_code}
