# backend/app/config.py
# This file defines the configuration class for our Flask application.
# It reads configuration variables (DB credentials, API keys) from environment variables.

import os
import tempfile
import secrets
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Load environment variables from .env file in the backend directory
# (relative to this config.py file, which is located in backend/app/config.py)
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(dotenv_path=dotenv_path)

class Config:
    IS_VERCEL = bool(os.getenv('VERCEL'))
    IS_PRODUCTION = IS_VERCEL or os.getenv('FLASK_ENV', '').lower() == 'production'
    DEFAULT_SECRET_KEY = 'default-paperplane-key-1234'

    # Secret Key for signing cookies and sessions
    SECRET_KEY = os.getenv('SECRET_KEY') or (
        secrets.token_urlsafe(32) if not IS_PRODUCTION else DEFAULT_SECRET_KEY
    )
    TOKEN_SALT = os.getenv('TOKEN_SALT', 'giftai-auth-token')
    TOKEN_MAX_AGE_SECONDS = int(os.getenv('TOKEN_MAX_AGE_SECONDS', '86400'))

    # Administrator Account Credentials
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

    # Rate Limiting Configuration
    LIMIT_AI_GENERATION = os.getenv('LIMIT_AI_GENERATION', '10 per minute')
    LIMIT_AUTH = os.getenv('LIMIT_AUTH', '10 per 5 minutes')
    LIMIT_ADMIN = os.getenv('LIMIT_ADMIN', '30 per minute')
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            'CORS_ORIGINS',
            'https://giftai-bice.vercel.app,http://localhost:5173,http://127.0.0.1:5173'
        ).split(',')
        if origin.strip()
    ]
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', str(1024 * 1024)))

    # Detect if we are in development/debug mode
    _flask_env = os.getenv('FLASK_ENV', 'development').lower()
    _flask_debug = os.getenv('FLASK_DEBUG', 'False').lower() in ['true', '1', 't']
    _is_dev = (_flask_env == 'development') or _flask_debug

    if _is_dev:
        LIMIT_FORGOT_PASSWORD = os.getenv('LIMIT_FORGOT_PASSWORD', '50 per minute')
        LIMIT_LOGIN = os.getenv('LIMIT_LOGIN', '50 per minute')
        LIMIT_VALIDATE_OTP = os.getenv('LIMIT_VALIDATE_OTP', '100 per minute')
        LIMIT_RESET_PASSWORD = os.getenv('LIMIT_RESET_PASSWORD', '100 per minute')
    else:
        LIMIT_FORGOT_PASSWORD = os.getenv('LIMIT_FORGOT_PASSWORD', '5 per 15 minutes')
        LIMIT_LOGIN = os.getenv('LIMIT_LOGIN', '5 per 15 minutes')
        LIMIT_VALIDATE_OTP = os.getenv('LIMIT_VALIDATE_OTP', '20 per 15 minutes')
        LIMIT_RESET_PASSWORD = os.getenv('LIMIT_RESET_PASSWORD', '10 per 15 minutes')



    # Database Configuration
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME', 'paper_plane_db')
    DB_SSL_REQUIRED = os.getenv('DB_SSL_REQUIRED', 'false').lower() in ['true', '1', 't']
    DB_CONNECT_TIMEOUT = int(os.getenv('DB_CONNECT_TIMEOUT', '10'))

    @staticmethod
    def _is_non_local_database_host(host):
        if not host:
            return False
        normalized = host.strip().lower()
        return normalized not in {'localhost', '127.0.0.1', '::1'}

    @staticmethod
    def _build_mysql_uri():
        host = os.getenv('DB_HOST', '')
        user = os.getenv('DB_USER', '')
        password = os.getenv('DB_PASSWORD', '')
        port = os.getenv('DB_PORT', '3306')
        name = os.getenv('DB_NAME', '')

        if not (host and user and name):
            return None
        normalized_host = host.strip().lower()
        if normalized_host in {'localhost', '127.0.0.1', '::1'}:
            return None

        return f"mysql+pymysql://{quote_plus(user)}:{quote_plus(password)}@{host}:{port}/{quote_plus(name)}"

    # Build SQLAlchemy Database URI dynamically.
    # Vercel's deployment filesystem is read-only, so the SQLite fallback must
    # live in /tmp unless an external DATABASE_URI is configured.
    EXTERNAL_DATABASE_URI = os.getenv('DATABASE_URI') or _build_mysql_uri()
    if EXTERNAL_DATABASE_URI:
        SQLALCHEMY_DATABASE_URI = EXTERNAL_DATABASE_URI
        DATABASE_MODE = 'external'
    elif os.getenv('VERCEL'):
        sqlite_dir = os.path.join(tempfile.gettempdir(), 'giftai')
        os.makedirs(sqlite_dir, exist_ok=True)
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(sqlite_dir, 'app.db')}"
        DATABASE_MODE = 'vercel-tmp-sqlite'
    else:
        SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
        DATABASE_MODE = 'local-sqlite'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Configure SQLAlchemy with pool_pre_ping=True and pool_recycle=300 for Aiven MySQL compatibility
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
    }
    if DATABASE_MODE == 'external':
        SQLALCHEMY_ENGINE_OPTIONS.update({
            "pool_recycle": 300,
            "pool_timeout": 30,
            "connect_args": {
                "connect_timeout": DB_CONNECT_TIMEOUT,
                "read_timeout": DB_CONNECT_TIMEOUT,
                "write_timeout": DB_CONNECT_TIMEOUT,
            }
        })
        if DB_SSL_REQUIRED:
            SQLALCHEMY_ENGINE_OPTIONS["connect_args"]["ssl"] = {}

    # AI Service Credentials
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    BREVO_API_KEY = os.getenv('BREVO_API_KEY')
    BREVO_SENDER_EMAIL = os.getenv('BREVO_SENDER_EMAIL', 'hello@greetly.ai')
    BREVO_SENDER_NAME = os.getenv('BREVO_SENDER_NAME', 'Greetly AI')

    
