/**
 * Authentication Module for MFitness Gym Management System
 * =========================================================
 */

// ============================================
// REGISTRATION
// ============================================

async function registerUser(name, email, phone, age, profession, password) {
    try {
        showLoader();

        // Create user with Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update display name
        await user.updateProfile({
            displayName: name
        });

        // Create user profile in Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            name: name,
            email: email,
            phone: phone,
            age: age,
            profession: profession,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            isAdmin: false,
            membershipStatus: 'pending',
            profileImage: null
        });

        hideLoader();
        showNotification('Registration successful! Welcome to MFitness!', 'success');

        // Redirect to home page after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

        return user;
    } catch (error) {
        hideLoader();
        console.error('Registration error:', error);
        showNotification(getErrorMessage(error.code), 'error');
        throw error;
    }
}

// ============================================
// LOGIN
// ============================================

async function loginUser(email, password) {
    try {
        showLoader();

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update last login timestamp
        await db.collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideLoader();
        showNotification('Login successful! Welcome back!', 'success');

        // Check if admin and redirect accordingly
        const userDoc = await db.collection('users').doc(user.uid).get();
        const isAdmin = userDoc.data()?.isAdmin || false;

        setTimeout(() => {
            if (isAdmin) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);

        return user;
    } catch (error) {
        hideLoader();
        console.error('Login error:', error);
        showNotification(getErrorMessage(error.code), 'error');
        throw error;
    }
}

// ============================================
// LOGOUT
// ============================================

async function logoutUser() {
    try {
        await auth.signOut();
        showNotification('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error logging out. Please try again.', 'error');
    }
}

// ============================================
// PASSWORD RESET
// ============================================

async function resetPassword(email) {
    try {
        showLoader();
        await auth.sendPasswordResetEmail(email);
        hideLoader();
        showNotification('Password reset email sent! Check your inbox.', 'success');
    } catch (error) {
        hideLoader();
        console.error('Password reset error:', error);
        showNotification(getErrorMessage(error.code), 'error');
    }
}

// ============================================
// PROFILE UPDATE
// ============================================

async function updateUserProfile(profileData) {
    const user = auth.currentUser;
    if (!user) {
        showNotification('Please login to update profile', 'error');
        return;
    }

    try {
        showLoader();

        // Update display name if changed
        if (profileData.name) {
            await user.updateProfile({
                displayName: profileData.name
            });
        }

        // Update Firestore profile
        await db.collection('users').doc(user.uid).update({
            ...profileData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideLoader();
        showNotification('Profile updated successfully!', 'success');
    } catch (error) {
        hideLoader();
        console.error('Profile update error:', error);
        showNotification('Error updating profile. Please try again.', 'error');
    }
}

// ============================================
// ERROR MESSAGES
// ============================================

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please login instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.'
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// ============================================
// UI HELPERS
// ============================================

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('active');
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('active');
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification__icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="notification__message">${message}</span>
        <button class="notification__close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// FORM HANDLERS
// ============================================

// Registration form handler
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const age = formData.get('age');
            const profession = formData.get('profession') || formData.get('profesion');
            const password = formData.get('password');

            await registerUser(name, email, phone, age, profession, password);
        });
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');

            await loginUser(email, password);
        });
    }

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.querySelector('input[name="email"]').value;
            if (email) {
                resetPassword(email);
            } else {
                showNotification('Please enter your email address first.', 'info');
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});
