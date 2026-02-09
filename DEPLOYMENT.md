# 🚀 Deployment Guide - MFitness Gym Management System

This guide walks you through deploying the MFitness application with:
- **Frontend** → Vercel (Static HTML/CSS/JS)
- **Backend** → Render (Python Flask API)

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Account** - Both Vercel and Render can deploy from GitHub
2. **Firebase Project** - With Authentication and Firestore enabled
3. **Firebase Service Account Key** - Downloaded from Firebase Console

---

## 🔥 Step 1: Set Up Firebase (If Not Done)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** → Sign-in method → Enable Email/Password
4. Enable **Firestore Database** → Create database (Start in test mode for now)
5. Go to **Project Settings** → **Service Accounts**
6. Click "Generate new private key" → Save as `serviceAccountKey.json`
7. Go to **Project Settings** → **General** → **Your apps** → Add a Web app
8. Copy the Firebase config and update `frontend/js/firebase-config.js`

---

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Prepare Your Repository

1. Make sure your code is pushed to GitHub
2. The `backend` folder should be a separate directory in your repo

### 2.2 Create a Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `mfitness-backend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |

### 2.3 Set Environment Variables

In Render Dashboard → Your Service → **Environment**:

| Variable | Value |
|----------|-------|
| `SECRET_KEY` | Generate a random string (e.g., use `python -c "import secrets; print(secrets.token_hex(32))"`) |
| `DEBUG` | `false` |
| `FIREBASE_CREDENTIALS` | Paste the **entire content** of your `serviceAccountKey.json` file |
| `CORS_ADDITIONAL_ORIGINS` | Leave blank for now (you'll add Vercel URL later) |

### 2.4 Deploy

1. Click **Create Web Service**
2. Wait for deployment (takes 2-5 minutes)
3. Copy your Render URL (e.g., `https://mfitness-backend-xxxx.onrender.com`)

### 2.5 Verify Backend is Running

Visit: `https://YOUR_RENDER_URL.onrender.com/api/health`

You should see:
```json
{
  "status": "healthy",
  "firebase": "connected",
  "timestamp": "..."
}
```

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend API URL

Before deploying, update the API URL in `frontend/js/firebase-config.js`:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://YOUR_RENDER_URL.onrender.com/api';  // ← Replace with your actual Render URL
```

Commit and push this change.

### 3.2 Deploy to Vercel

**Option A: Using Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Other |
| **Root Directory** | `frontend` |
| **Build Command** | Leave empty (static files) |
| **Output Directory** | `.` (root of frontend) |

5. Click **Deploy**

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend folder
cd frontend

# Deploy
vercel

# Follow the prompts
```

### 3.3 Get Your Vercel URL

After deployment, copy your Vercel URL (e.g., `https://mfitness-xxxx.vercel.app`)

---

## 🔗 Step 4: Connect Frontend & Backend (CORS)

### 4.1 Update Render Environment Variable

1. Go to Render Dashboard → Your Backend Service → **Environment**
2. Add/Update the variable:

| Variable | Value |
|----------|-------|
| `CORS_ADDITIONAL_ORIGINS` | `https://your-app.vercel.app` (your Vercel URL) |

3. Click **Save Changes** (this will trigger a redeploy)

### 4.2 Verify Connection

1. Open your Vercel frontend URL
2. Open browser Developer Tools → Console
3. You should see: `✅ Firebase initialized successfully!`
4. Try registering a user or submitting a contact form

---

## ✅ Step 5: Final Verification Checklist

- [ ] Backend health check returns "healthy"
- [ ] Frontend loads without console errors
- [ ] Firebase is connected on frontend
- [ ] User registration works
- [ ] User login works
- [ ] Contact form submission works
- [ ] Booking system works (if logged in)

---

## 🔧 Troubleshooting

### CORS Errors
- Ensure `CORS_ADDITIONAL_ORIGINS` is set correctly in Render
- Make sure the URL doesn't have a trailing slash
- Redeploy the backend after changing environment variables

### Firebase Connection Failed (Backend)
- Verify `FIREBASE_CREDENTIALS` contains the complete JSON content
- Check Render logs for specific error messages

### Firebase Connection Failed (Frontend)
- Update `firebaseConfig` in `firebase-config.js` with your Firebase project config
- Ensure Firebase Authentication and Firestore are enabled

### 502/503 Errors on Render
- Free tier services may take 30-60 seconds to wake up from sleep
- Check Render logs for Python errors

---

## 📝 Environment Variables Summary

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Flask secret key for sessions |
| `DEBUG` | Set to `false` for production |
| `FIREBASE_CREDENTIALS` | Complete serviceAccountKey.json content |
| `CORS_ADDITIONAL_ORIGINS` | Your Vercel frontend URL |

### Frontend
- No environment variables needed - configuration is in `firebase-config.js`

---

## 🎉 Congratulations!

Your MFitness Gym Management System is now deployed with:
- 🌐 **Frontend**: Fast, globally distributed via Vercel CDN
- 🔥 **Backend**: Scalable Python API on Render
- 📊 **Database**: Firebase Firestore (cloud-hosted)
- 🔐 **Authentication**: Firebase Auth

**Happy Fitness Management! 💪**
