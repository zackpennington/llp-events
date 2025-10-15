// Analytics event tracking for LLP Events
// Attaches click tracking to buttons and CTAs

import { Analytics } from './analytics.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Analytics] Initializing event tracking...');

    // Track ticket purchase button clicks
    const ticketButtons = document.querySelectorAll('a[href*="tixr.com"]');
    ticketButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const href = button.getAttribute('href');

            // Determine which show
            let show = 'unknown';
            let type = 'single';

            if (href.includes('nu-metal')) {
                show = 'Louisville Loves Nu-Metal';
            } else if (href.includes('emo')) {
                show = 'Louisville Loves Emo';
            } else if (href.includes('2-day-pass')) {
                show = 'Weekend Pass';
                type = 'weekend';
            }

            Analytics.ticketClick(show, type);
        });
    });

    // Track hero CTA clicks
    const heroCTAs = document.querySelectorAll('.hero-cta-group .cta-button');
    heroCTAs.forEach(button => {
        button.addEventListener('click', () => {
            Analytics.ctaClick('hero', 'buy-tickets');
        });
    });

    // Track "Get Updates" CTA clicks
    const updateCTAs = document.querySelectorAll('a[href*="#contact"]');
    updateCTAs.forEach(button => {
        const text = button.textContent.trim();
        if (text.includes('UPDATE') || text.includes('CONTACT')) {
            button.addEventListener('click', () => {
                Analytics.ctaClick('cta-section', 'get-updates');
            });
        }
    });

    // Track "Apply to Our Shows" button
    const applyButton = document.querySelector('a[href*="forms.google.com"]');
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            Analytics.ctaClick('about', 'apply-to-shows');
        });
    }

    console.log(`[Analytics] Tracking ${ticketButtons.length} ticket buttons`);
});

// Export for use in other scripts if needed
export { Analytics };
