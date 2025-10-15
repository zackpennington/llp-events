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

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ================================
// DYNAMIC FOOTER YEAR
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.textContent = `© ${currentYear} LLP Events. Louisville, KY. All rights reserved.`;
    }
});

// ================================
// CURSOR GLOW EFFECT (OPTIONAL)
// ================================

// Cursor glow removed per user request

// ================================
// DYNAMIC GRADIENT ANIMATION
// ================================

const animateGradients = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .hero {
            background-size: 200% 200%;
            animation: gradientShift 15s ease infinite;
        }
    `;
    document.head.appendChild(style);
};

animateGradients();

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
    if (!heroSection) return;

    // Array of background images
    const images = [
        'images/100-pure-energy.jpg',
        'images/brianinthecrowd.jpg',
        'images/cheerleaders.jpg',
        'images/confetti.jpg',
        'images/balloons.jpg'
    ];

    let currentIndex = 0;

    // Set initial background image
    heroSection.style.backgroundImage = `url('${images[currentIndex]}')`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
    heroSection.style.transition = 'background-image 1s ease-in-out';

    // Rotate images every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        heroSection.style.backgroundImage = `url('${images[currentIndex]}')`;
    }, 5000);
});
