/**
 * Main Application Module for MFitness Gym Management System
 * ===========================================================
 */

// ============================================
// COMMENTS/TESTIMONIALS
// ============================================

/**
 * Load approved comments/testimonials
 */
async function loadComments() {
    try {
        const snapshot = await db.collection('comments')
            .where('approved', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(6)
            .get();

        const comments = [];
        snapshot.forEach(doc => {
            comments.push({ id: doc.id, ...doc.data() });
        });

        displayComments(comments);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

/**
 * Submit a new comment
 */
async function submitComment(text, rating) {
    const user = auth.currentUser;
    if (!user) {
        showNotification('Please login to leave a comment', 'error');
        return;
    }

    try {
        showLoader();

        // Get user profile for name
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userName = userDoc.exists ? userDoc.data().name : user.displayName || 'Anonymous';

        await db.collection('comments').add({
            userId: user.uid,
            userName: userName,
            userEmail: user.email,
            text: text,
            rating: rating,
            approved: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideLoader();
        showNotification('Thank you! Your comment will appear after approval.', 'success');

        // Reset form
        const form = document.getElementById('commentForm');
        if (form) form.reset();

    } catch (error) {
        hideLoader();
        console.error('Error submitting comment:', error);
        showNotification('Error submitting comment. Please try again.', 'error');
    }
}

/**
 * Display comments in the UI
 */
function displayComments(comments) {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    if (comments.length === 0) {
        container.innerHTML = '<p class="text-center">Be the first to leave a review!</p>';
        return;
    }

    const html = comments.map(comment => `
        <div class="testimonial-card" data-aos="fade-up">
            <div class="testimonial-card__avatar">
                ${comment.userName.charAt(0).toUpperCase()}
            </div>
            <div class="testimonial-card__content">
                <div class="testimonial-card__stars">
                    ${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}
                </div>
                <p class="testimonial-card__text">"${comment.text}"</p>
                <p class="testimonial-card__author">${comment.userName}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// ============================================
// NOTICES
// ============================================

/**
 * Load active notices
 */
async function loadNotices() {
    try {
        const snapshot = await db.collection('notices')
            .where('active', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();

        const notices = [];
        snapshot.forEach(doc => {
            notices.push({ id: doc.id, ...doc.data() });
        });

        displayNotices(notices);
    } catch (error) {
        console.error('Error loading notices:', error);
    }
}

/**
 * Display notices in the UI
 */
function displayNotices(notices) {
    const container = document.getElementById('noticesContainer');
    if (!container) return;

    if (notices.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    const html = notices.map(notice => `
        <div class="notice-item notice-item--${notice.type || 'info'}">
            <div class="notice-item__icon">
                ${notice.type === 'important' ? '⚠️' : notice.type === 'event' ? '🎉' : 'ℹ️'}
            </div>
            <div class="notice-item__content">
                <h4 class="notice-item__title">${notice.title}</h4>
                <p class="notice-item__text">${notice.message}</p>
                ${notice.date ? `<span class="notice-item__date">${formatNoticeDate(notice.date)}</span>` : ''}
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function formatNoticeDate(date) {
    if (date && date.toDate) {
        return date.toDate().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    return '';
}

// ============================================
// OPERATING HOURS
// ============================================

/**
 * Load operating hours
 */
async function loadOperatingHours() {
    try {
        const doc = await db.collection('settings').doc('operatingHours').get();

        let hours;
        if (doc.exists) {
            hours = doc.data();
        } else {
            // Default hours
            hours = {
                monday: { open: '06:00', close: '22:00', closed: false },
                tuesday: { open: '06:00', close: '22:00', closed: false },
                wednesday: { open: '06:00', close: '22:00', closed: false },
                thursday: { open: '06:00', close: '22:00', closed: false },
                friday: { open: '06:00', close: '22:00', closed: false },
                saturday: { open: '08:00', close: '20:00', closed: false },
                sunday: { open: '08:00', close: '18:00', closed: false }
            };
        }

        displayOperatingHours(hours);
        updateGymStatus(hours);
    } catch (error) {
        console.error('Error loading operating hours:', error);
    }
}

/**
 * Display operating hours
 */
function displayOperatingHours(hours) {
    const container = document.getElementById('hoursContainer');
    if (!container) return;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

    const html = days.map(day => `
        <div class="hours-item ${day === today ? 'hours-item--today' : ''}">
            <span class="hours-item__day">${day.charAt(0).toUpperCase() + day.slice(1)}</span>
            <span class="hours-item__time">
                ${hours[day]?.closed ? 'Closed' : `${formatTime(hours[day]?.open)} - ${formatTime(hours[day]?.close)}`}
            </span>
        </div>
    `).join('');

    container.innerHTML = html;
}

/**
 * Update gym status (Open/Closed)
 */
function updateGymStatus(hours) {
    const statusElement = document.getElementById('gymStatus');
    if (!statusElement) return;

    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[now.getDay()];
    const todayHours = hours[today];

    if (todayHours?.closed) {
        statusElement.innerHTML = '<span class="status status--closed">Closed Today</span>';
        return;
    }

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    if (currentTime >= openTime && currentTime < closeTime) {
        statusElement.innerHTML = `<span class="status status--open">Open Now</span> · Closes at ${formatTime(todayHours.close)}`;
    } else {
        statusElement.innerHTML = `<span class="status status--closed">Closed</span> · Opens at ${formatTime(todayHours.open)}`;
    }
}

function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
}

// ============================================
// CONTACT FORM
// ============================================

/**
 * Submit contact form
 */
async function submitContact(name, email, phone, message) {
    try {
        showLoader();

        await db.collection('contacts').add({
            name: name,
            email: email,
            phone: phone,
            message: message,
            status: 'unread',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideLoader();
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');

        // Reset form
        const form = document.querySelector('.form-grp');
        if (form) form.reset();

    } catch (error) {
        hideLoader();
        console.error('Error submitting contact:', error);
        showNotification('Error sending message. Please try again.', 'error');
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================

function setupMobileNav() {
    const navIcon = document.querySelector('.nav-icon');
    const navMenu = document.querySelector('.header-navigation ul');

    if (navIcon && navMenu) {
        navIcon.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navIcon.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navIcon.classList.remove('active');
            });
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function setupScrollAnimations() {
    const sections = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const animationClass = entry.target.dataset.animate;
                    entry.target.classList.add(animationClass);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================

function setupHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Setup UI
    setupMobileNav();
    setupSmoothScroll();
    setupScrollAnimations();
    setupHeaderScroll();

    // Load dynamic content when Firebase is ready
    if (typeof db !== 'undefined') {
        loadNotices();
        loadComments();
        loadOperatingHours();
    }

    // Contact form handler
    const contactForm = document.querySelector('.form-grp');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('input[placeholder="Name"]')?.value;
            const email = contactForm.querySelector('input[placeholder="Email"]')?.value;
            const phone = contactForm.querySelector('input[placeholder="Phone"]')?.value;
            const message = contactForm.querySelector('textarea')?.value;

            if (name && email && message) {
                await submitContact(name, email, phone, message);
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    }

    // Comment form handler
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const text = document.getElementById('commentText')?.value;
            const rating = parseInt(document.getElementById('commentRating')?.value) || 5;

            if (text) {
                await submitComment(text, rating);
            }
        });
    }
});
