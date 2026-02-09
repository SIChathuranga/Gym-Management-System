"""
Firebase Configuration for Gym Management System
-------------------------------------------------
You need to download your Firebase service account key from:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as 'serviceAccountKey.json' in the backend folder

For Render deployment:
1. Set FIREBASE_CREDENTIALS as an environment variable with the JSON content
2. Set SECRET_KEY with a strong random string
3. Set DEBUG to 'false'
4. Add your Vercel URL to CORS_ADDITIONAL_ORIGINS

For frontend Firebase config, update the firebaseConfig in firebase-config.js
"""

import os
import json
from dotenv import load_dotenv

load_dotenv()

# Firebase Admin SDK configuration
# For local development: use serviceAccountKey.json file
# For production (Render): use FIREBASE_CREDENTIALS environment variable
FIREBASE_CREDENTIALS_PATH = os.getenv('FIREBASE_CREDENTIALS_PATH', 'serviceAccountKey.json')

# If FIREBASE_CREDENTIALS env var is set (JSON string), use it
FIREBASE_CREDENTIALS_JSON = os.getenv('FIREBASE_CREDENTIALS')

# Flask configuration
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
    
# CORS configuration
# Add your Vercel URL to CORS_ORIGINS for production
CORS_ORIGINS = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

# Add additional origins from environment variable (comma-separated)
# Example: CORS_ADDITIONAL_ORIGINS=https://your-app.vercel.app,https://custom-domain.com
additional_origins = os.getenv('CORS_ADDITIONAL_ORIGINS', '')
if additional_origins:
    CORS_ORIGINS.extend([origin.strip() for origin in additional_origins.split(',') if origin.strip()])
