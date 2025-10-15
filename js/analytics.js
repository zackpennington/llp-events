// Analytics tracking utility for LLP Events
// Wraps Vercel Analytics track() function for custom events

/**
 * Track custom events with Vercel Analytics
 * Uses the global webVitals object injected by Vercel's script
 * @param {string} eventName - Name of the event (max 255 chars)
 * @param {object} data - Optional custom data (strings, numbers, booleans, null only)
 */
export function trackEvent(eventName, data = {}) {
    try {
        // Wait for Vercel Analytics to load
        if (window.va && typeof window.va === 'function') {
            window.va('event', { name: eventName, data });
            console.log(`[Analytics] Tracked: ${eventName}`, data);
        } else {
            // Fallback: just log in development
            console.log(`[Analytics] Would track: ${eventName}`, data);
        }
    } catch (error) {
        console.error('[Analytics] Error tracking event:', error);
    }
}

// Predefined tracking functions for common events
export const Analytics = {
    // Ticket purchase events
    ticketClick: (show, type = 'single') => {
        trackEvent('Ticket Click', { show, type });
    },

    // Newsletter events
    newsletterSignup: (email) => {
        trackEvent('Newsletter Signup', {
            email: email ? 'provided' : 'missing' // Don't send PII
        });
    },

    newsletterSuccess: () => {
        trackEvent('Newsletter Success');
    },

    // Contact form events
    contactFormSubmit: () => {
        trackEvent('Contact Form Submit');
    },

    contactFormSuccess: () => {
        trackEvent('Contact Form Success');
    },

    // Navigation events
    showPageView: (show) => {
        trackEvent('Show Page View', { show });
    },

    // CTA events
    ctaClick: (location, action) => {
        trackEvent('CTA Click', { location, action });
    }
};
