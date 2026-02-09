# MFitness Gym Management System

A modern, full-featured gym management system with Python Flask backend, Firebase integration, and a stunning responsive UI.

![MFitness](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Firebase Setup](#-firebase-setup)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Security Rules](#-security-rules)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### User Features
- 🔐 **Authentication** - User registration and login with Firebase Auth
- 👤 **Profile Management** - Edit profile, view bookings, track fitness goals
- 📅 **Gym Booking** - Book sessions, personal training, yoga, and more
- 💬 **Testimonials** - Leave reviews and ratings
- 📞 **Contact Form** - Get in touch with the gym
- 🕐 **Operating Hours** - View gym schedule

### Admin Features
- 📢 **Notice Management** - Post and manage gym announcements
- 🕐 **Operating Hours** - Set and update weekly schedules
- ⭐ **Review Moderation** - Approve or reject user reviews
- 📊 **Dashboard Statistics** - View member counts, bookings, messages

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Python 3.8+, Flask |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **Styling** | Custom CSS with CSS Variables |

---

## 📁 Project Structure

```
Gym-Management-System/
│
├── backend/
│   ├── app.py                  # Main Flask application
│   ├── config.py               # Configuration settings
│   ├── requirements.txt        # Python dependencies
│   └── serviceAccountKey.json  # Firebase credentials (you create this)
│
├── frontend/
│   ├── index.html              # Homepage
│   ├── login.html              # Login page
│   ├── registration.html       # Registration page
│   ├── booking.html            # Booking page
│   ├── profile.html            # User profile
│   ├── admin.html              # Admin dashboard
│   ├── index.css               # Complete stylesheet
│   │
│   └── js/
│       ├── firebase-config.js  # Firebase initialization
│       ├── auth.js             # Authentication functions
│       ├── booking.js          # Booking functionality
│       └── main.js             # Main app logic
│
└── README.md                   # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Python 3.8+** installed ([Download Python](https://www.python.org/downloads/))
- **pip** (Python package manager, comes with Python)
- **Git** (optional, for version control)
- **Firebase Account** (free tier is sufficient)
- **Modern Web Browser** (Chrome, Firefox, Edge)

### Verify Python Installation

```bash
# Check Python version
python --version
# or
python3 --version

# Check pip version
pip --version
```

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: `mfitness-gym` (or your preferred name)
4. Disable Google Analytics (optional) → Click **"Create Project"**
5. Wait for project creation → Click **"Continue"**

### Step 2: Enable Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get Started"**
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"** → Click **"Save"**

### Step 3: Create Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose your preferred location → Click **"Enable"**

### Step 4: Get Web App Configuration

1. Click the **gear icon ⚙️** → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click the **web icon `</>`**
4. Enter app nickname: `mfitness-web`
5. Click **"Register app"**
6. Copy the **firebaseConfig** object (you'll need this for frontend)

```javascript
// Example config - your values will be different
const firebaseConfig = {
    apiKey: "AIzaSyB...",
    authDomain: "mfitness-gym.firebaseapp.com",
    projectId: "mfitness-gym",
    storageBucket: "mfitness-gym.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};
```

### Step 5: Get Service Account Key (for Backend)

1. Click **gear icon ⚙️** → **"Project settings"**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the popup
5. Save the downloaded JSON file as `serviceAccountKey.json`
6. Move this file to the `backend/` folder

> ⚠️ **IMPORTANT**: Never commit `serviceAccountKey.json` to version control!

---

## ⚙️ Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies installed:**
- `Flask` - Web framework
- `flask-cors` - Cross-origin resource sharing
- `firebase-admin` - Firebase Admin SDK
- `python-dotenv` - Environment variables
- `gunicorn` - Production WSGI server

### Step 4: Configure Environment Variables (Optional)

Create a `.env` file in the `backend/` folder:

```env
# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this
DEBUG=True

# Firebase Configuration
FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json
```

### Step 5: Run the Backend Server

```bash
# Development mode
python app.py

# Or with Flask CLI
flask run --host=0.0.0.0 --port=5000
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Step 6: Test the Server

Open your browser and visit: `http://localhost:5000/api/health`

**Expected Response:**
```json
{
    "status": "healthy",
    "message": "MFitness API is running"
}
```

---

## 🌐 Frontend Setup

### Step 1: Configure Firebase

1. Open `frontend/js/firebase-config.js`
2. Replace the placeholder config with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 2: Update API Base URL (if needed)

If your backend runs on a different URL, update in `firebase-config.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Step 3: Run the Frontend

**Option A: VS Code Live Server (Recommended)**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

**Option B: Python HTTP Server**
```bash
cd frontend
python -m http.server 5500
```

**Option C: Open Directly**
- Simply double-click `index.html` to open in browser
- Note: Some features may not work due to CORS restrictions

### Step 4: Access the Application

- **Homepage**: `http://localhost:5500/index.html`
- **Login**: `http://localhost:5500/login.html`
- **Registration**: `http://localhost:5500/registration.html`
- **Profile**: `http://localhost:5500/profile.html`
- **Booking**: `http://localhost:5500/booking.html`
- **Admin**: `http://localhost:5500/admin.html`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

---

### 🔒 Authentication Endpoints

#### Health Check
```http
GET /api/health
```
**Response:**
```json
{
    "status": "healthy",
    "message": "MFitness API is running"
}
```

---

### 👤 User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```
**Response:**
```json
{
    "uid": "abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "age": 25,
    "profession": "professional",
    "isAdmin": false,
    "membershipStatus": "active",
    "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
    "name": "John Doe Updated",
    "phone": "+1234567890",
    "age": 26,
    "profession": "athlete",
    "fitnessGoals": "Build muscle and improve endurance"
}
```

---

### 📅 Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
    "date": "2024-01-15",
    "timeSlot": "06:00 - 08:00",
    "sessionType": "gym",
    "notes": "Focus on leg day"
}
```
**Response:**
```json
{
    "message": "Booking created successfully",
    "bookingId": "booking123"
}
```

#### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```
**Response:**
```json
[
    {
        "id": "booking123",
        "date": "2024-01-15",
        "timeSlot": "06:00 - 08:00",
        "sessionType": "gym",
        "sessionName": "Gym Access",
        "status": "confirmed",
        "createdAt": "2024-01-10T10:00:00Z"
    }
]
```

#### Cancel Booking
```http
DELETE /api/bookings/<booking_id>
Authorization: Bearer <token>
```

#### Check Slot Availability
```http
GET /api/bookings/availability?date=2024-01-15&timeSlot=06:00 - 08:00
```
**Response:**
```json
{
    "date": "2024-01-15",
    "timeSlot": "06:00 - 08:00",
    "available": true,
    "currentBookings": 5,
    "maxCapacity": 20
}
```

---

### 💬 Contact Endpoints

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json
```
**Request Body:**
```json
{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "message": "I have a question about membership"
}
```

---

### ⭐ Comments/Reviews Endpoints

#### Get Approved Comments
```http
GET /api/comments
```
**Response:**
```json
[
    {
        "id": "comment123",
        "userName": "John Doe",
        "text": "Great gym with excellent facilities!",
        "rating": 5,
        "createdAt": "2024-01-05T10:00:00Z"
    }
]
```

#### Submit Comment (requires auth)
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
    "text": "Amazing trainers and equipment!",
    "rating": 5
}
```

---

### 📢 Notices Endpoints

#### Get Active Notices
```http
GET /api/notices
```
**Response:**
```json
[
    {
        "id": "notice123",
        "title": "New Year Promotion",
        "message": "30% off all memberships!",
        "type": "important",
        "createdAt": "2024-01-01T00:00:00Z"
    }
]
```

#### Create Notice (Admin only)
```http
POST /api/notices
Authorization: Bearer <admin_token>
Content-Type: application/json
```
**Request Body:**
```json
{
    "title": "Holiday Hours",
    "message": "Gym will close early on Dec 25",
    "type": "info"
}
```

---

### 🕐 Operating Hours Endpoints

#### Get Operating Hours
```http
GET /api/hours
```
**Response:**
```json
{
    "monday": { "open": "06:00", "close": "22:00", "closed": false },
    "tuesday": { "open": "06:00", "close": "22:00", "closed": false },
    "wednesday": { "open": "06:00", "close": "22:00", "closed": false },
    "thursday": { "open": "06:00", "close": "22:00", "closed": false },
    "friday": { "open": "06:00", "close": "22:00", "closed": false },
    "saturday": { "open": "08:00", "close": "20:00", "closed": false },
    "sunday": { "open": "08:00", "close": "18:00", "closed": false }
}
```

#### Update Operating Hours (Admin only)
```http
PUT /api/hours
Authorization: Bearer <admin_token>
Content-Type: application/json
```
**Request Body:**
```json
{
    "monday": { "open": "06:00", "close": "22:00", "closed": false },
    "sunday": { "open": "00:00", "close": "00:00", "closed": true }
}
```

---

### 🔧 Admin Endpoints

#### Get All Pending Comments
```http
GET /api/admin/comments
Authorization: Bearer <admin_token>
```

#### Approve Comment
```http
PUT /api/admin/comments/<comment_id>/approve
Authorization: Bearer <admin_token>
```

#### Delete Comment
```http
DELETE /api/admin/comments/<comment_id>
Authorization: Bearer <admin_token>
```

#### Get All Contact Messages
```http
GET /api/admin/contacts
Authorization: Bearer <admin_token>
```

#### Get All Bookings
```http
GET /api/admin/bookings
Authorization: Bearer <admin_token>
```

---

## 🗄 Database Schema

### Firestore Collections

#### `users`
```javascript
{
    uid: string,              // Firebase Auth UID
    name: string,             // Full name
    email: string,            // Email address
    phone: string,            // Phone number
    age: number,              // Age
    profession: string,       // "student", "professional", "athlete", etc.
    isAdmin: boolean,         // Admin flag
    membershipStatus: string, // "pending", "active", "expired"
    profileImage: string,     // Profile image URL (optional)
    fitnessGoals: string,     // User's fitness goals
    createdAt: timestamp,     // Account creation time
    lastLogin: timestamp      // Last login time
}
```

#### `bookings`
```javascript
{
    userId: string,           // User's UID
    userEmail: string,        // User's email
    userName: string,         // User's name
    date: string,             // Booking date (YYYY-MM-DD)
    timeSlot: string,         // Time slot (e.g., "06:00 - 08:00")
    sessionType: string,      // "gym", "personal", "yoga", etc.
    sessionName: string,      // Display name
    duration: number,         // Duration in minutes
    price: number,            // Price in dollars
    notes: string,            // Additional notes
    status: string,           // "confirmed", "cancelled", "completed"
    createdAt: timestamp,     // Booking creation time
    cancelledAt: timestamp    // Cancellation time (if cancelled)
}
```

#### `comments`
```javascript
{
    userId: string,           // User's UID
    userName: string,         // User's name
    userEmail: string,        // User's email
    text: string,             // Comment text
    rating: number,           // Rating (1-5)
    approved: boolean,        // Approval status
    createdAt: timestamp,     // Submission time
    approvedAt: timestamp,    // Approval time
    approvedBy: string        // Admin UID who approved
}
```

#### `notices`
```javascript
{
    title: string,            // Notice title
    message: string,          // Notice message
    type: string,             // "info", "important", "event"
    active: boolean,          // Visibility status
    createdBy: string,        // Admin UID
    createdAt: timestamp      // Creation time
}
```

#### `contacts`
```javascript
{
    name: string,             // Sender's name
    email: string,            // Sender's email
    phone: string,            // Sender's phone (optional)
    message: string,          // Message content
    status: string,           // "unread", "read", "responded"
    createdAt: timestamp      // Submission time
}
```

#### `settings/operatingHours`
```javascript
{
    monday: { open: string, close: string, closed: boolean },
    tuesday: { open: string, close: string, closed: boolean },
    wednesday: { open: string, close: string, closed: boolean },
    thursday: { open: string, close: string, closed: boolean },
    friday: { open: string, close: string, closed: boolean },
    saturday: { open: string, close: string, closed: boolean },
    sunday: { open: string, close: string, closed: boolean },
    updatedAt: timestamp,
    updatedBy: string
}
```

---

## 🛡 Security Rules

### Firestore Security Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
    match /databases/{database}/documents {
        
        // Helper function to check if user is admin
        function isAdmin() {
            return request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
        }
        
        // Users collection
        match /users/{userId} {
            allow read: if request.auth != null && 
                        (request.auth.uid == userId || isAdmin());
            allow write: if request.auth != null && request.auth.uid == userId;
        }
        
        // Bookings collection
        match /bookings/{bookingId} {
            allow read: if request.auth != null && 
                        (resource.data.userId == request.auth.uid || isAdmin());
            allow create: if request.auth != null;
            allow update, delete: if request.auth != null && 
                                   resource.data.userId == request.auth.uid;
        }
        
        // Comments collection
        match /comments/{commentId} {
            allow read: if resource.data.approved == true || isAdmin();
            allow create: if request.auth != null;
            allow update, delete: if isAdmin();
        }
        
        // Notices collection
        match /notices/{noticeId} {
            allow read: if resource.data.active == true || isAdmin();
            allow write: if isAdmin();
        }
        
        // Contacts collection
        match /contacts/{contactId} {
            allow create: if true;  // Anyone can submit contact form
            allow read, update, delete: if isAdmin();
        }
        
        // Settings collection
        match /settings/{settingId} {
            allow read: if true;  // Public read
            allow write: if isAdmin();
        }
    }
}
```

---

## 🔑 Making a User Admin

### Option 1: Via Firebase Console

1. Go to Firebase Console → Firestore Database
2. Find the user in the `users` collection
3. Click on the user document
4. Add/edit field: `isAdmin: true` (boolean)
5. Click "Update"

### Option 2: Via Python Script

Create a file `make_admin.py`:

```python
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Replace with actual user UID
USER_UID = 'your-user-uid-here'

# Update user document
db.collection('users').document(USER_UID).update({
    'isAdmin': True
})

print(f'User {USER_UID} is now an admin!')
```

Run it:
```bash
python make_admin.py
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue: "Module not found" error**
```bash
# Make sure you're in the virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Issue: "Firebase credentials not found"**
- Ensure `serviceAccountKey.json` is in the `backend/` folder
- Check the path in `config.py`

**Issue: CORS errors**
- Make sure Flask-CORS is installed
- Check that CORS is properly configured in `app.py`

### Frontend Issues

**Issue: "Firebase not defined"**
- Check that Firebase CDN scripts are loaded in HTML
- Verify the Firebase config in `firebase-config.js`

**Issue: "Unauthorized" errors**
- Make sure you're logged in
- Check that the token is being sent in requests

### Firebase Issues

**Issue: "Permission denied"**
- Check Firestore security rules
- Ensure user is authenticated
- Verify admin status for admin endpoints

---

## 🚀 Production Deployment

### Backend (with Gunicorn)

```bash
# Install gunicorn
pip install gunicorn

# Run in production
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables for Production

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
FIREBASE_CREDENTIALS_PATH=/path/to/serviceAccountKey.json
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Authors

- Sanindu Imasha Chathuranga - All Rights Reserved.

## 🙏 Credits

- **Images**: [Unsplash](https://unsplash.com/)
- **Firebase**: Google
- **Icons**: Various open source icon sets

---

Made with ❤️ for fitness enthusiasts

**Need Help?** Open an issue or contact the development team.
