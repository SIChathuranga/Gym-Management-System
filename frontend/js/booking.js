/**
 * Booking Module for MFitness Gym Management System
 * ==================================================
 */

// Available time slots
const TIME_SLOTS = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
];

// Session types
const SESSION_TYPES = [
    { id: 'gym', name: 'Gym Access', duration: 120, price: 0 },
    { id: 'personal', name: 'Personal Training', duration: 60, price: 50 },
    { id: 'yoga', name: 'Yoga Class', duration: 60, price: 25 },
    { id: 'cardio', name: 'Cardio Session', duration: 45, price: 15 },
    { id: 'crossfit', name: 'CrossFit Class', duration: 60, price: 30 },
    { id: 'boxing', name: 'Boxing Training', duration: 60, price: 35 }
];

// ============================================
// BOOKING FUNCTIONS
// ============================================

/**
 * Create a new booking
 */
async function createBooking(date, timeSlot, sessionType, notes = '') {
    const user = auth.currentUser;
    if (!user) {
        showNotification('Please login to make a booking', 'error');
        window.location.href = 'login.html';
        return;
    }

    try {
        showLoader();

        const session = SESSION_TYPES.find(s => s.id === sessionType);

        const booking = {
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName || user.email.split('@')[0],
            date: date,
            timeSlot: timeSlot,
            sessionType: sessionType,
            sessionName: session.name,
            duration: session.duration,
            price: session.price,
            notes: notes,
            status: 'confirmed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('bookings').add(booking);

        hideLoader();
        showNotification('Booking confirmed successfully!', 'success');

        // Refresh bookings list
        loadUserBookings();

        // Reset form
        const form = document.getElementById('bookingForm');
        if (form) form.reset();

        return booking;
    } catch (error) {
        hideLoader();
        console.error('Booking error:', error);
        showNotification('Error creating booking. Please try again.', 'error');
        throw error;
    }
}

/**
 * Load user's bookings
 */
async function loadUserBookings() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const snapshot = await db.collection('bookings')
            .where('userId', '==', user.uid)
            .orderBy('date', 'desc')
            .limit(10)
            .get();

        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        displayBookings(bookings);
        return bookings;
    } catch (error) {
        console.error('Error loading bookings:', error);
        return [];
    }
}

/**
 * Cancel a booking
 */
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        showLoader();

        await db.collection('bookings').doc(bookingId).update({
            status: 'cancelled',
            cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideLoader();
        showNotification('Booking cancelled successfully', 'success');
        loadUserBookings();
    } catch (error) {
        hideLoader();
        console.error('Error cancelling booking:', error);
        showNotification('Error cancelling booking. Please try again.', 'error');
    }
}

/**
 * Check slot availability
 */
async function checkSlotAvailability(date, timeSlot) {
    try {
        const snapshot = await db.collection('bookings')
            .where('date', '==', date)
            .where('timeSlot', '==', timeSlot)
            .where('status', '==', 'confirmed')
            .get();

        return snapshot.size < 20; // Max 20 bookings per slot
    } catch (error) {
        console.error('Error checking availability:', error);
        return true;
    }
}

// ============================================
// UI FUNCTIONS
// ============================================

/**
 * Display bookings in the UI
 */
function displayBookings(bookings) {
    const container = document.getElementById('bookingsContainer');
    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state__icon">📅</div>
                <h3>No Bookings Yet</h3>
                <p>Book your first session to get started on your fitness journey!</p>
                <a href="#bookingForm" class="btn btn__primary">Make a Booking</a>
            </div>
        `;
        return;
    }

    const html = bookings.map(booking => `
        <div class="booking-card ${booking.status === 'cancelled' ? 'booking-card--cancelled' : ''}">
            <div class="booking-card__header">
                <span class="booking-card__type">${booking.sessionName}</span>
                <span class="booking-card__status booking-card__status--${booking.status}">${booking.status}</span>
            </div>
            <div class="booking-card__body">
                <div class="booking-card__info">
                    <span class="booking-card__icon">📅</span>
                    <span>${formatDate(booking.date)}</span>
                </div>
                <div class="booking-card__info">
                    <span class="booking-card__icon">⏰</span>
                    <span>${booking.timeSlot}</span>
                </div>
                <div class="booking-card__info">
                    <span class="booking-card__icon">⏱️</span>
                    <span>${booking.duration} minutes</span>
                </div>
                ${booking.price > 0 ? `
                <div class="booking-card__info">
                    <span class="booking-card__icon">💰</span>
                    <span>$${booking.price}</span>
                </div>
                ` : ''}
            </div>
            ${booking.status === 'confirmed' ? `
            <div class="booking-card__footer">
                <button class="btn btn__outline btn__sm" onclick="cancelBooking('${booking.id}')">
                    Cancel Booking
                </button>
            </div>
            ` : ''}
        </div>
    `).join('');

    container.innerHTML = html;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Populate time slots dropdown
 */
function populateTimeSlots() {
    const select = document.getElementById('timeSlot');
    if (!select) return;

    TIME_SLOTS.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        select.appendChild(option);
    });
}

/**
 * Populate session types dropdown
 */
function populateSessionTypes() {
    const select = document.getElementById('sessionType');
    if (!select) return;

    SESSION_TYPES.forEach(session => {
        const option = document.createElement('option');
        option.value = session.id;
        option.textContent = `${session.name} - ${session.duration}min ${session.price > 0 ? `($${session.price})` : '(Included)'}`;
        select.appendChild(option);
    });
}

/**
 * Set minimum date to today
 */
function setMinDate() {
    const dateInput = document.getElementById('bookingDate');
    if (!dateInput) return;

    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
}

// ============================================
// FORM HANDLER
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    populateTimeSlots();
    populateSessionTypes();
    setMinDate();

    // Load bookings if user is logged in
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged((user) => {
            if (user) {
                loadUserBookings();
            }
        });
    }

    // Booking form handler
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const date = document.getElementById('bookingDate').value;
            const timeSlot = document.getElementById('timeSlot').value;
            const sessionType = document.getElementById('sessionType').value;
            const notes = document.getElementById('bookingNotes')?.value || '';

            // Check availability
            const available = await checkSlotAvailability(date, timeSlot);
            if (!available) {
                showNotification('This slot is fully booked. Please choose another time.', 'error');
                return;
            }

            await createBooking(date, timeSlot, sessionType, notes);
        });
    }
});
