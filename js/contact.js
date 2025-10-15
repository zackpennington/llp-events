// Turnstile error callback (global scope)
window.onTurnstileError = function() {
    console.warn('Turnstile verification failed or timed out');
    // Optionally hide the Turnstile widget on persistent errors
    const turnstileWrapper = document.querySelector('.turnstile-wrapper');
    if (turnstileWrapper) {
        const errorCount = (turnstileWrapper.dataset.errorCount || 0);
        turnstileWrapper.dataset.errorCount = parseInt(errorCount) + 1;

        // After 3 errors, hide Turnstile to prevent spam
        if (parseInt(turnstileWrapper.dataset.errorCount) > 3) {
            turnstileWrapper.style.display = 'none';
            console.warn('Turnstile disabled due to repeated errors');
        }
    }
};

// Contact form handling with Turnstile
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const formMessage = document.getElementById('contact-form-message');
    const formBody = document.getElementById('contact-form-body');
    const successBody = document.getElementById('contact-success-body');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        const turnstileToken = turnstileResponse ? turnstileResponse.value : '';

        // Validate fields
        if (!name || !email || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        if (message.length < 10) {
            showMessage('Message must be at least 10 characters', 'error');
            return;
        }

        // Only require Turnstile in production (not on localhost)
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (!turnstileToken && !isLocalhost) {
            showMessage('Please complete the verification', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    turnstileToken
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Show success message
                formBody.style.display = 'none';
                successBody.style.display = 'block';
            } else {
                showMessage(data.error || 'Failed to send message. Please try again.', 'error');
                // Reset Turnstile
                if (window.turnstile) {
                    window.turnstile.reset();
                }
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showMessage('An error occurred. Please try again.', 'error');
            // Reset Turnstile
            if (window.turnstile) {
                window.turnstile.reset();
            }
        } finally {
            setLoading(false);
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function setLoading(loading) {
        submitBtn.disabled = loading;
        submitBtn.textContent = loading ? 'Sending...' : 'Send Message';
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message form-message-${type}`;
        formMessage.style.display = 'block';

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});
