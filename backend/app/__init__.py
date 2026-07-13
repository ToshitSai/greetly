# backend/app/__init__.py
# This file initializes the Flask application using the Application Factory pattern.
# It configures CORS, binds SQLAlchemy database operations, and registers API blueprints.

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from app.config import Config
from app.models import db

# Instantiate the global rate limiter
limiter = Limiter(key_func=get_remote_address)

def create_app(config_class=Config):
    # Instantiate Flask
    app = Flask(__name__)
    
    # Load settings from Config class
    app.config.from_object(config_class)

    if app.config.get("IS_PRODUCTION") and app.config.get("SECRET_KEY") == app.config.get("DEFAULT_SECRET_KEY"):
        raise RuntimeError("SECRET_KEY must be configured for production deployments.")
    
    # Enable CORS for frontend integration
    CORS(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", [])}})
    
    # Initialize the database with the app context
    db.init_app(app)
    
    # Initialize Flask-Limiter with the app
    limiter.init_app(app)

    @app.after_request
    def apply_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; "
            "script-src 'self'; connect-src 'self' https://api.groq.com https://api.openai.com https://api.brevo.com https://generativelanguage.googleapis.com; "
            "font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        )
        if response.content_type and response.content_type.startswith("application/json"):
            response.headers.setdefault("Cache-Control", "no-store")
        return response
    
    # Global exception handler for handling internal errors cleanly
    @app.errorhandler(500)
    def handle_internal_server_error(e):
        return jsonify({
            "success": False,
            "error": "An internal server error occurred. Please contact the administrator."
        }), 500

    @app.errorhandler(404)
    def handle_not_found_error(e):
        return jsonify({
            "success": False,
            "error": "The requested resource could not be found."
        }), 404

    @app.errorhandler(429)
    def handle_rate_limit_exceeded(e):
        from flask import request
        print(f"\n[RATE LIMIT TRIGGERED] Limit breached on path: {request.path} | IP: {request.remote_addr} | Description: {str(e.description)}", flush=True)
        return jsonify({
            "success": False,
            "error": f"Rate limit exceeded: {str(e.description)}"
        }), 429

    # Import and register routing blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.customer_routes import customer_bp
    from app.routes.recipient_routes import recipient_bp
    from app.routes.message_routes import message_bp
    from app.routes.tone_routes import tone_bp
    from app.routes.occasion_routes import occasion_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.email_routes import email_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(customer_bp, url_prefix='/api')
    app.register_blueprint(recipient_bp, url_prefix='/api')
    app.register_blueprint(message_bp, url_prefix='/api')
    app.register_blueprint(tone_bp, url_prefix='/api')
    app.register_blueprint(occasion_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    app.register_blueprint(email_bp, url_prefix='/api')

    # Basic server check route
    @app.route('/hello', methods=['GET'])
    def hello():
        return jsonify({
            "success": True,
            "message": "Hello, world! Flask backend is fully configured and running."
        }), 200

    @app.route('/api/status', methods=['GET'])
    def api_status():
        from sqlalchemy import text

        database_ok = False
        database_error = None
        try:
            with db.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            database_ok = True
        except Exception as exc:
            database_error = str(exc)

        return jsonify({
            "success": database_ok,
            "service": "Greetly Backend API",
            "version": "1.0.0",
            "environment": "vercel" if app.config.get("DATABASE_MODE") == "vercel-tmp-sqlite" else "server",
            "database": {
                "ok": database_ok,
                "mode": app.config.get("DATABASE_MODE"),
                "persistent": app.config.get("DATABASE_MODE") == "external",
                "configured_external_uri": bool(app.config.get("EXTERNAL_DATABASE_URI")),
                "error": database_error
            },
            "ai": {
                "provider": "Groq API",
                "configured": bool(app.config.get("GROQ_API_KEY"))
            }
        }), 200 if database_ok else 503

    return app
