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
// PARALLAX EFFECT FOR HERO - REMOVED
// ================================

// Parallax effect removed - was causing shaky/jumpy text when scrolling

// ================================
// SHOW CARD TILT EFFECT - REMOVED
// ================================

// Card tilt effect removed per user request

// ================================
// LOADING ANIMATION
// ================================

// Loading animation removed - was causing unwanted page flash

// ================================
// DYNAMIC FOOTER YEAR - REMOVED
// ================================

// Footer year update removed - now handled statically in HTML to preserve photographer link

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
            const isExpanded = item.classList.contains('active');

            // Close other items and update their aria-expanded
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isExpanded);
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

// ================================
// HOME PAGE PHOTO ALBUMS PREVIEW
// ================================

async function loadHomePageAlbums() {
    const albumsContainer = document.getElementById('home-albums-scroll');
    if (!albumsContainer) return; // Only run on home page

    try {
        const response = await fetch('/api/photos');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const albums = data.albums || [];

        if (albums.length === 0) {
            albumsContainer.innerHTML = '<p style="color: var(--color-light-gray); text-align: center; padding: var(--spacing-xl);">No photo albums yet. Check back soon!</p>';
            return;
        }

        // Limit to first 8 albums for preview
        const previewAlbums = albums.slice(0, 8);

        // Clear loading state
        albumsContainer.innerHTML = '';

        // Create album cards
        previewAlbums.forEach(album => {
            const card = createHomeAlbumCard(album);
            albumsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading albums:', error);
        albumsContainer.innerHTML = '<p style="color: var(--color-error); text-align: center; padding: var(--spacing-xl);">Failed to load albums. Please try again later.</p>';
    }
}

function createHomeAlbumCard(album) {
    const card = document.createElement('a');
    card.className = 'home-album-card';
    card.href = `/photos#${album.slug}`;

    const coverImageHtml = album.coverImage
        ? `<div class="home-album-cover" style="background-image: url('${album.coverImage}');"></div>`
        : '<div class="home-album-cover" style="background: var(--color-slate);"></div>';

    // Format date if available
    let dateStr = '';
    if (album.date) {
        const date = new Date(album.date);
        dateStr = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Build metadata line
    const metadata = [];
    if (dateStr) metadata.push(dateStr);
    if (album.photographer) metadata.push(album.photographer);
    const metadataHtml = metadata.length > 0
        ? `<p class="album-metadata">${metadata.join(' • ')}</p>`
        : '';

    card.innerHTML = `
        ${coverImageHtml}
        <div class="home-album-info">
            <h3>${album.name}</h3>
            ${metadataHtml}
        </div>
    `;

    return card;
}

// Load albums on page load
document.addEventListener('DOMContentLoaded', loadHomePageAlbums);
