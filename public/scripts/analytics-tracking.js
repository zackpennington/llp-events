// Analytics event tracking for LLP Events
// Attaches click tracking to buttons and CTAs

import { Analytics, trackEvent } from './analytics.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Analytics] Initializing event tracking...');

    // Track ticket purchase button clicks
    const ticketButtons = document.querySelectorAll('a[href*="tixr.com"]');
    ticketButtons.forEach(button => {
        button.addEventListener('click', () => {
            const href = button.getAttribute('href');
            let show = 'unknown';
            let type = 'single';

            if (href.includes('nu-metal')) {
                show = 'Louisville Loves Nu-Metal';
            } else if (href.includes('emo')) {
                show = 'Louisville Loves Emo';
            } else if (href.includes('2-day-pass')) {
                show = 'Weekend Pass';
                type = 'weekend';
            } else {
                const card = button.closest('.show-card');
                const title = card?.querySelector('.show-card-title');
                if (title) show = title.textContent.trim();
            }

            Analytics.ticketClick(show, type);
        });
    });

    // Track hero CTA clicks
    const heroCTAs = document.querySelectorAll('.hero-cta-group .cta-button');
    heroCTAs.forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('Hero CTA Click');
        });
    });

    // Track "Get Updates" / "Join Mailing List" CTA clicks
    const updateCTAs = document.querySelectorAll('a[href*="#contact"]');
    updateCTAs.forEach(button => {
        button.addEventListener('click', () => {
            const location = button.closest('.about-section') ? 'about' : 'nav';
            trackEvent('Get Updates CTA Click', { location });
        });
    });

    // Track "Apply to Our Shows" button
    const applyButton = document.querySelector('a[href*="forms.google.com"]');
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            trackEvent('Apply to Shows CTA Click');
        });
    }

    // Track social media link clicks
    document.querySelectorAll('.social-link, .footer-social-link').forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href') || '';
            let platform = 'unknown';
            if (href.includes('instagram')) platform = 'instagram';
            else if (href.includes('tiktok')) platform = 'tiktok';
            else if (href.includes('facebook')) platform = 'facebook';
            const location = link.closest('footer') ? 'footer' : 'social-section';
            Analytics.socialClick(platform, location);
        });
    });

    // Track playlist link clicks
    document.querySelectorAll('.playlist-links .social-link').forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href') || '';
            const label = link.closest('.social-link-item')?.querySelector('.social-handle')?.textContent?.trim() || 'unknown';
            let platform = 'unknown';
            if (href.includes('spotify')) platform = 'spotify';
            else if (href.includes('apple.com')) platform = 'apple-music';
            Analytics.playlistClick(platform, label);
        });
    });

    // Track partner logo clicks
    document.querySelectorAll('.sponsor-item a').forEach(link => {
        link.addEventListener('click', () => {
            const alt = link.querySelector('img')?.getAttribute('alt') || 'unknown';
            Analytics.partnerClick(alt);
        });
    });

    // Track "View All Photos" CTA
    const photoCTA = document.querySelector('.view-all-photos .cta-button');
    if (photoCTA) {
        photoCTA.addEventListener('click', () => {
            trackEvent('View All Photos Click');
        });
    }

    // Track navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            Analytics.navClick(link.textContent.trim());
        });
    });

    // Track FAQ accordion interactions
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const question = button.querySelector('span')?.textContent?.trim() || 'unknown';
            Analytics.faqToggle(question);
        });
    });

    console.log(`[Analytics] Tracking ${ticketButtons.length} ticket buttons`);
});

// Export for use in other scripts if needed
export { Analytics };
