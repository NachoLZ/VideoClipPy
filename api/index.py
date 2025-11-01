"""
Vercel serverless function wrapper for Flask app.
This file is required for Vercel to properly route API requests to the Flask backend.
"""

import sys
import os

# Add parent directory to path so we can import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# Vercel expects a variable named 'app' or a handler function
# The Flask app instance is already named 'app', so we're good

