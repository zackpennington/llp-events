/**
 * Countdown Timer for Show Dates
 * Displays time remaining until show dates
 */

class CountdownTimer {
    constructor(targetDate, elementId, label = '', expiredMessage = null) {
        this.targetDate = new Date(targetDate);
        this.elementId = elementId;
        this.label = label;
        this.expiredMessage = expiredMessage;
        this.intervalId = null;
        this.init();
    }

    init() {
        const element = document.getElementById(this.elementId);
        if (!element) return;

        // Update immediately
        this.update();

        // Update every second
        this.intervalId = setInterval(() => {
            this.update();
        }, 1000);
    }

    update() {
        const element = document.getElementById(this.elementId);
        if (!element) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            return;
        }

        const now = new Date();
        const diff = this.targetDate - now;

        if (diff <= 0) {
            if (this.expiredMessage) {
                element.textContent = this.expiredMessage;
            } else {
                element.textContent = 'Show Time!';
            }
            element.classList.add('countdown-expired');
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        let timeString = '';
        if (days > 0) {
            timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (hours > 0) {
            timeString = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            timeString = `${minutes}m ${seconds}s`;
        } else {
            timeString = `${seconds}s`;
        }

        element.textContent = this.label ? `${this.label}: ${timeString}` : timeString;
        element.classList.remove('countdown-expired');
    }

    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

// Initialize countdown timers for shows
document.addEventListener('DOMContentLoaded', () => {
    // Nu-Metal Show: Dec 5, 2025 at 7pm EST
    const numetalDate = '2025-12-05T19:00:00-05:00';
    const numetalElement = document.getElementById('countdown-numetal');
    if (numetalElement) {
        new CountdownTimer(numetalDate, 'countdown-numetal', '');
    }

    // Emo Show: Dec 6, 2025 at 7pm EST
    const emoDate = '2025-12-06T19:00:00-05:00';
    const emoElement = document.getElementById('countdown-emo');
    if (emoElement) {
        new CountdownTimer(emoDate, 'countdown-emo', '');
    }

    // Hero Countdown: Dec 5, 2025 at 7pm EST (first show)
    const heroCountdownElement = document.getElementById('hero-countdown');
    if (heroCountdownElement) {
        new CountdownTimer(numetalDate, 'hero-countdown', '');
    }

    // Weekend Pass: Already expired/sold out - use past date
    const weekendPassElement = document.getElementById('countdown-weekend-pass');
    if (weekendPassElement) {
        // Set to past date so it shows as expired immediately
        new CountdownTimer('2025-01-01T00:00:00-05:00', 'countdown-weekend-pass', '', "Time's up");
    }
});

