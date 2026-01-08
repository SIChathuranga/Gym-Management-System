/**
 * Firebase Configuration for MFitness Gym Management System
 * ==========================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Create a new project or select existing one
 * 3. Go to Project Settings > General > Your apps
 * 4. Click on Web icon (</>)  to add a web app
 * 5. Copy your Firebase configuration and replace below
 * 6. Enable Authentication: Go to Authentication > Sign-in method > Enable Email/Password
 * 7. Enable Firestore: Go to Firestore Database > Create database
 */

// Firebase configuration - REPLACE WITH YOUR OWN CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Initialize Firebase
let app, auth, db;

// Check if Firebase SDK is loaded
if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log('✅ Firebase initialized successfully!');
} else {
    console.error('❌ Firebase SDK not loaded. Please include Firebase scripts.');
}

// ============================================
// AUTHENTICATION HELPERS
// ============================================

/**
 * Get current user's ID token for API requests
 */
async function getAuthToken() {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = await getAuthToken();

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await response.json();
}

/**
 * Check authentication state and update UI
 */
function setupAuthStateListener() {
    auth.onAuthStateChanged((user) => {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (user) {
            // User is signed in
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (userName) userName.textContent = user.displayName || user.email.split('@')[0];

            // Load user profile
            loadUserProfile(user.uid);
        } else {
            // User is signed out
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    });
}

/**
 * Load user profile from Firestore
 */
async function loadUserProfile(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error loading profile:', error);
        return null;
    }
}

// Initialize auth listener when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof auth !== 'undefined') {
        setupAuthStateListener();
    }
});
