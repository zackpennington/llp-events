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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ================================
// NAVIGATION BACKGROUND ON SCROLL
// ================================

let lastScrollTop = 0;

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

    lastScrollTop = scrollTop;
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
// PERFORMANCE OPTIMIZATION
// ================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers if needed
const debouncedScrollHandler = debounce(() => {
    // Additional scroll handling if needed
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

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

    console.log('Setting initial hero background:', images[currentIndex]);

    let activeLayer = bgLayer1;
    let inactiveLayer = bgLayer2;

    // Rotate images every 5 seconds with fade effect
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        console.log('Rotating hero background to:', images[currentIndex]);

        // Set the next image on the inactive layer
        inactiveLayer.style.backgroundImage = `url('${images[currentIndex]}')`;

        // Fade in the inactive layer
        inactiveLayer.style.opacity = '1';
        activeLayer.style.opacity = '0';

        // Swap layers
        [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
    }, 5000);
});
