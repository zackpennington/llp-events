// ================================
// SCROLL ANIMATIONS
// ================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Observe all elements with data-scroll attribute
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach(el => observer.observe(el));
});

// ================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================

document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;

    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);

    if (target) {
        event.preventDefault();
        const nav = document.querySelector('.nav');
        const navHeight = nav ? nav.offsetHeight : 0;

        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    // If target not found, allow default behavior
});

// ================================
// NAVIGATION BACKGROUND ON SCROLL
// ================================

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return; // Exit if nav not loaded yet

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow when scrolled
    if (scrollTop > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// ================================
// PARALLAX EFFECT FOR HERO
// ================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ================================
// SHOW CARD TILT EFFECT - REMOVED
// ================================

// Card tilt effect removed per user request

// ================================
// LOADING ANIMATION
// ================================

// Loading animation removed - was causing unwanted page flash

// ================================
// DYNAMIC FOOTER YEAR
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.innerHTML = `© ${currentYear} LLP Events. Louisville, KY. All rights reserved.<br>All site photography by Janelle Choiniere.`;
    }
});

// ================================
// CURSOR GLOW EFFECT (OPTIONAL)
// ================================

// Cursor glow removed per user request

// ================================
// DYNAMIC GRADIENT ANIMATION
// ================================

// Gradient animation removed - using rotating background images instead

// ================================
// FAQ ACCORDION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// ================================
// HERO BACKGROUND IMAGE ROTATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) {
        console.error('Hero section not found');
        return;
    }

    // Array of background images
    const images = [
        'images/100-pure-energy.jpg',
        'images/brianincrowd.jpg',
        'images/cheerleaders.jpg',
        'images/confetti.jpg',
        'images/balloons.jpg',
        'images/numetalmask.jpg',
        'images/crowdsurf.jpg',
        'images/10k-fans-rocked.jpg'
    ];

    let currentIndex = 0;

    // Create two layers for crossfade effect
    const bgLayer1 = document.createElement('div');
    const bgLayer2 = document.createElement('div');

    [bgLayer1, bgLayer2].forEach(layer => {
        layer.style.position = 'absolute';
        layer.style.top = '0';
        layer.style.left = '0';
        layer.style.width = '100%';
        layer.style.height = '100%';
        layer.style.backgroundSize = 'cover';
        layer.style.backgroundPosition = 'center';
        layer.style.transition = 'opacity 1s ease-in-out';
        layer.style.zIndex = '0';
    });

    bgLayer1.style.opacity = '1';
    bgLayer2.style.opacity = '0';
    bgLayer1.style.backgroundImage = `url('${images[0]}')`;

    heroSection.insertBefore(bgLayer1, heroSection.firstChild);
    heroSection.insertBefore(bgLayer2, heroSection.firstChild);

    let activeLayer = bgLayer1;
    let inactiveLayer = bgLayer2;

    // Rotate images every 5 seconds with fade effect
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        // Set the next image on the inactive layer
        inactiveLayer.style.backgroundImage = `url('${images[currentIndex]}')`;

        // Fade in the inactive layer
        inactiveLayer.style.opacity = '1';
        activeLayer.style.opacity = '0';

        // Swap layers
        [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
    }, 5000);
});
