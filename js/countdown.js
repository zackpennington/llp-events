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
                element.style.display = 'none';
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

// Initialize countdown timers for 2026 shows
document.addEventListener('DOMContentLoaded', () => {
    const shows = [
        { date: '2026-06-13T19:00:00-04:00', id: 'countdown-itloud' },
        { date: '2026-08-15T19:00:00-04:00', id: 'countdown-grunge' },
        { date: '2026-09-16T19:00:00-04:00', id: 'countdown-ltl' },
        { date: '2026-09-23T19:00:00-04:00', id: 'countdown-bandb' },
        { date: '2026-12-05T19:00:00-05:00', id: 'countdown-emo' },
    ];

    shows.forEach(show => {
        if (document.getElementById(show.id)) {
            new CountdownTimer(show.date, show.id, '');
        }
    });

    // Hero countdown: first upcoming show (It Loud - Jun 13)
    const heroCountdownElement = document.getElementById('hero-countdown');
    if (heroCountdownElement) {
        new CountdownTimer(shows[0].date, 'hero-countdown', '');
    }
});

