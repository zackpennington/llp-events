/**
 * Countdown Timer for Show Dates
 * Displays time remaining until show dates
 */

class CountdownTimer {
    constructor(targetDate, elementId, label = '') {
        this.targetDate = new Date(targetDate);
        this.elementId = elementId;
        this.label = label;
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
            element.textContent = this.label ? `${this.label} - Show Time!` : 'Show Time!';
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
            timeString = `${days}d ${hours}h ${minutes}m`;
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
    const emoDate = '2025-12-06T20:00:00-05:00';
    const emoElement = document.getElementById('countdown-emo');
    if (emoElement) {
        new CountdownTimer(emoDate, 'countdown-emo', '');
    }
});

