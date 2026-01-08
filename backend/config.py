"""
Firebase Configuration for Gym Management System
-------------------------------------------------
You need to download your Firebase service account key from:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as 'serviceAccountKey.json' in the backend folder

For frontend Firebase config, update the firebaseConfig in firebase-config.js
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Firebase Admin SDK configuration
FIREBASE_CREDENTIALS_PATH = os.getenv('FIREBASE_CREDENTIALS_PATH', 'serviceAccountKey.json')

# Flask configuration
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    
# CORS configuration
CORS_ORIGINS = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
