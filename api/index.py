import os
import sys

# Prepend the backend path so the app module can be found
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app
from werkzeug.middleware.proxy_fix import ProxyFix

# Create the Flask application instance
app = create_app()

# Fortify the backend for Cloudflare and Vercel Edge proxies
# This ensures rate limiters and logging use the real client IP (X-Forwarded-For)
app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

# Vercel Serverless environment looks for the 'app' variable by default
