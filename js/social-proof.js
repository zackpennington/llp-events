/**
 * Social Proof Toast Notifications
 * Shows random "Someone just bought tickets" notifications
 */

(function() {
    'use strict';

    // Cities within ~50 miles of Louisville, KY
    const CITIES = [
        'Louisville, KY',
        'Jeffersonville, IN',
        'New Albany, IN',
        'Clarksville, IN',
        'Shepherdsville, KY',
        'Elizabethtown, KY',
        'Frankfort, KY',
        'Bardstown, KY',
        'Shelbyville, KY',
        'La Grange, KY',
        'Bedford, KY',
        'Madison, IN',
        'Scottsburg, IN',
        'Salem, IN',
        'Corydon, IN',
        'Sellersburg, IN',
        'Radcliff, KY',
        'Fort Knox, KY',
        'Mount Washington, KY',
        'Prospect, KY',
        'Middletown, KY',
        'St. Matthews, KY',
        'Jeffersontown, KY',
        'Lyndon, KY',
        'Anchorage, KY',
        'Pewee Valley, KY',
        'Crestwood, KY',
        'Buckner, KY',
        'Taylorsville, KY',
        'Simpsonville, KY',
        'Finchville, KY',
        'Eminence, KY',
        'Carrollton, KY',
        'Campbellsburg, KY',
        'Charlestown, IN',
        'Henryville, IN',
        'Georgetown, IN',
        'Floyds Knobs, IN',
        'Brooks, KY',
        'Hillview, KY',
        'Valley Station, KY',
        'Pleasure Ridge Park, KY',
        'Okolona, KY',
        'Fern Creek, KY',
        'Highview, KY',
        'Fairdale, KY'
    ];

    const SHOWS = [
        { name: 'Louisville Loves Nu-Metal', date: 'Dec 5' },
        { name: 'Louisville Loves Emo', date: 'Dec 6' }
    ];

    // Time phrases for variety
    const TIME_PHRASES = [
        'just now',
        'moments ago',
        'a few seconds ago',
        'just a moment ago'
    ];

    let toastContainer = null;
    let toastTimeout = null;

    /**
     * Get a random item from an array
     */
    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Get a random number between min and max (inclusive)
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Create the toast container if it doesn't exist
     */
    function ensureContainer() {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'social-proof-container';
            toastContainer.setAttribute('aria-live', 'polite');
            toastContainer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(toastContainer);
        }
        return toastContainer;
    }

    /**
     * Create and show a toast notification
     */
    function showToast() {
        const container = ensureContainer();

        // Remove any existing toast
        const existingToast = container.querySelector('.social-proof-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Weighted city: 40% Louisville, 60% other cities
        const city = Math.random() < 0.4 ? 'Louisville, KY' : getRandomItem(CITIES);
        const show = getRandomItem(SHOWS);
        // Weighted random: 60% chance 1-2, 30% chance 3-4, 10% chance 5-8
        const roll = Math.random();
        let quantity;
        if (roll < 0.6) {
            quantity = getRandomInt(1, 2);
        } else if (roll < 0.9) {
            quantity = getRandomInt(3, 4);
        } else {
            quantity = getRandomInt(5, 8);
        }
        const timePhrase = getRandomItem(TIME_PHRASES);
        const ticketWord = quantity === 1 ? 'ticket' : 'tickets';

        const toast = document.createElement('div');
        toast.className = 'social-proof-toast';
        toast.innerHTML = `
            <div class="social-proof-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4h2a2 2 0 0 1 0 4H2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4h-2a2 2 0 0 1 0-4h2z"/>
                </svg>
            </div>
            <div class="social-proof-content">
                <div class="social-proof-message">
                    Someone in <strong>${city}</strong> just purchased <strong>${quantity} ${ticketWord}</strong> to ${show.name}
                </div>
                <div class="social-proof-time">${timePhrase}</div>
            </div>
            <button class="social-proof-close" aria-label="Dismiss notification">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;

        // Add close button functionality
        const closeBtn = toast.querySelector('.social-proof-close');
        closeBtn.addEventListener('click', () => {
            hideToast(toast);
        });

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('social-proof-toast--visible');
        });

        // Auto-hide after 5 seconds
        toastTimeout = setTimeout(() => {
            hideToast(toast);
        }, 5000);
    }

    /**
     * Hide a toast with animation
     */
    function hideToast(toast) {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toastTimeout = null;
        }

        toast.classList.remove('social-proof-toast--visible');
        toast.classList.add('social-proof-toast--hiding');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }

    /**
     * Schedule the next toast at a random interval
     */
    function scheduleNextToast() {
        // Random interval between 15-45 seconds
        const minInterval = 15000;
        const maxInterval = 45000;
        const interval = getRandomInt(minInterval, maxInterval);

        setTimeout(() => {
            showToast();
            scheduleNextToast();
        }, interval);
    }

    /**
     * Initialize the social proof system
     */
    function init() {
        // Don't run on localhost in development (optional - remove if you want to test locally)
        // if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        //     return;
        // }

        // Wait a bit before showing the first toast (8-15 seconds after page load)
        const initialDelay = getRandomInt(8000, 15000);

        setTimeout(() => {
            showToast();
            scheduleNextToast();
        }, initialDelay);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
