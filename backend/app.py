"""
MFitness Gym Management System - Backend API
=============================================
Flask backend with Firebase Firestore integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime
import os

from config import Config, CORS_ORIGINS, FIREBASE_CREDENTIALS_PATH

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=CORS_ORIGINS)

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase initialized successfully!")
except Exception as e:
    print(f"⚠️ Firebase initialization failed: {e}")
    print("Please ensure serviceAccountKey.json is in the backend folder")
    db = None

# ============================================
# HELPER FUNCTIONS
# ============================================

def get_current_timestamp():
    return datetime.utcnow().isoformat()

def verify_token(token):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        return None

def get_user_from_request():
    """Extract and verify user from Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split('Bearer ')[1]
    return verify_token(token)

# ============================================
# AUTH ROUTES
# ============================================

@app.route('/api/users/profile', methods=['GET'])
def get_user_profile():
    """Get user profile by UID"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        user_doc = db.collection('users').document(user['uid']).get()
        if user_doc.exists:
            return jsonify(user_doc.to_dict())
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/profile', methods=['POST', 'PUT'])
def update_user_profile():
    """Create or update user profile"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        data['updatedAt'] = get_current_timestamp()
        data['uid'] = user['uid']
        data['email'] = user.get('email', '')
        
        db.collection('users').document(user['uid']).set(data, merge=True)
        return jsonify({'success': True, 'message': 'Profile updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# BOOKING ROUTES
# ============================================

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """Get all bookings for a user"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        bookings = db.collection('bookings').where('userId', '==', user['uid']).stream()
        result = [{'id': doc.id, **doc.to_dict()} for doc in bookings]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a new booking"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        data['userId'] = user['uid']
        data['userEmail'] = user.get('email', '')
        data['createdAt'] = get_current_timestamp()
        data['status'] = 'pending'
        
        doc_ref = db.collection('bookings').add(data)
        return jsonify({'success': True, 'id': doc_ref[1].id, 'message': 'Booking created successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings/<booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    """Cancel a booking"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        booking_ref = db.collection('bookings').document(booking_id)
        booking = booking_ref.get()
        
        if not booking.exists:
            return jsonify({'error': 'Booking not found'}), 404
        
        if booking.to_dict().get('userId') != user['uid']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        booking_ref.update({'status': 'cancelled', 'cancelledAt': get_current_timestamp()})
        return jsonify({'success': True, 'message': 'Booking cancelled successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# CONTACT FORM ROUTES
# ============================================

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Submit contact form (no auth required)"""
    try:
        data = request.json
        data['createdAt'] = get_current_timestamp()
        data['status'] = 'unread'
        
        db.collection('contacts').add(data)
        return jsonify({'success': True, 'message': 'Message sent successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# COMMENTS/TESTIMONIALS ROUTES
# ============================================

@app.route('/api/comments', methods=['GET'])
def get_comments():
    """Get approved comments/testimonials (public)"""
    try:
        comments = db.collection('comments').where('approved', '==', True).order_by('createdAt', direction=firestore.Query.DESCENDING).limit(10).stream()
        result = [{'id': doc.id, **doc.to_dict()} for doc in comments]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/comments', methods=['POST'])
def add_comment():
    """Add a new comment"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        data['userId'] = user['uid']
        data['userEmail'] = user.get('email', '')
        data['createdAt'] = get_current_timestamp()
        data['approved'] = False  # Requires admin approval
        
        db.collection('comments').add(data)
        return jsonify({'success': True, 'message': 'Comment submitted for approval'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# NOTICES ROUTES
# ============================================

@app.route('/api/notices', methods=['GET'])
def get_notices():
    """Get active notices (public)"""
    try:
        notices = db.collection('notices').where('active', '==', True).order_by('createdAt', direction=firestore.Query.DESCENDING).limit(5).stream()
        result = [{'id': doc.id, **doc.to_dict()} for doc in notices]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notices', methods=['POST'])
def create_notice():
    """Create a new notice (admin only)"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Check if user is admin
    try:
        user_doc = db.collection('users').document(user['uid']).get()
        if not user_doc.exists or not user_doc.to_dict().get('isAdmin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.json
        data['createdBy'] = user['uid']
        data['createdAt'] = get_current_timestamp()
        data['active'] = True
        
        db.collection('notices').add(data)
        return jsonify({'success': True, 'message': 'Notice created successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# OPERATING HOURS ROUTES
# ============================================

@app.route('/api/hours', methods=['GET'])
def get_operating_hours():
    """Get gym operating hours (public)"""
    try:
        hours_doc = db.collection('settings').document('operatingHours').get()
        if hours_doc.exists:
            return jsonify(hours_doc.to_dict())
        # Return default hours if not set
        return jsonify({
            'monday': {'open': '06:00', 'close': '22:00', 'closed': False},
            'tuesday': {'open': '06:00', 'close': '22:00', 'closed': False},
            'wednesday': {'open': '06:00', 'close': '22:00', 'closed': False},
            'thursday': {'open': '06:00', 'close': '22:00', 'closed': False},
            'friday': {'open': '06:00', 'close': '22:00', 'closed': False},
            'saturday': {'open': '08:00', 'close': '20:00', 'closed': False},
            'sunday': {'open': '08:00', 'close': '18:00', 'closed': False}
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/hours', methods=['PUT'])
def update_operating_hours():
    """Update gym operating hours (admin only)"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        user_doc = db.collection('users').document(user['uid']).get()
        if not user_doc.exists or not user_doc.to_dict().get('isAdmin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.json
        data['updatedAt'] = get_current_timestamp()
        data['updatedBy'] = user['uid']
        
        db.collection('settings').document('operatingHours').set(data)
        return jsonify({'success': True, 'message': 'Operating hours updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# ADMIN ROUTES
# ============================================

@app.route('/api/admin/comments', methods=['GET'])
def admin_get_comments():
    """Get all comments for admin review"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        user_doc = db.collection('users').document(user['uid']).get()
        if not user_doc.exists or not user_doc.to_dict().get('isAdmin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        comments = db.collection('comments').order_by('createdAt', direction=firestore.Query.DESCENDING).stream()
        result = [{'id': doc.id, **doc.to_dict()} for doc in comments]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/comments/<comment_id>/approve', methods=['PUT'])
def approve_comment(comment_id):
    """Approve a comment"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        user_doc = db.collection('users').document(user['uid']).get()
        if not user_doc.exists or not user_doc.to_dict().get('isAdmin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        db.collection('comments').document(comment_id).update({
            'approved': True,
            'approvedAt': get_current_timestamp(),
            'approvedBy': user['uid']
        })
        return jsonify({'success': True, 'message': 'Comment approved'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/bookings', methods=['GET'])
def admin_get_bookings():
    """Get all bookings for admin"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        user_doc = db.collection('users').document(user['uid']).get()
        if not user_doc.exists or not user_doc.to_dict().get('isAdmin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        bookings = db.collection('bookings').order_by('createdAt', direction=firestore.Query.DESCENDING).stream()
        result = [{'id': doc.id, **doc.to_dict()} for doc in bookings]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/contacts', methods=['GET'])
def admin_get_contacts():
    """Get all contact submissions for admin"""
    user = get_user_from_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        user_doc = db.collection('users').document(user['uid']).get()
        if not user_doc.exists or not user_doc.to_dict().get('isAdmin', False):
            return jsonify({'error': 'Admin access required'}), 403
        
        contacts = db.collection('contacts').order_by('createdAt', direction=firestore.Query.DESCENDING).stream()
        result = [{'id': doc.id, **doc.to_dict()} for doc in contacts]
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# HEALTH CHECK
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'firebase': 'connected' if db else 'disconnected',
        'timestamp': get_current_timestamp()
    })

# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    app.run(debug=True, port=5000)
