import os
import sys

# Prepend the backend path so the app module can be found
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app
from app.models import db
from werkzeug.middleware.proxy_fix import ProxyFix

# Create the Flask application instance
app = create_app()

with app.app_context():
    db.create_all()

    from app.utils.migrations import run_migrations
    from app.seed.seed_tones import seed as seed_tones
    from app.seed.seed_occasions import seed as seed_occasions

    run_migrations(app)
    seed_tones(app)
    seed_occasions(app)

# Fortify the backend for Cloudflare and Vercel Edge proxies
# This ensures rate limiters and logging use the real client IP (X-Forwarded-For)
app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

# Vercel Serverless environment looks for the 'app' variable by default
