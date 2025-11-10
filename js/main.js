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

    // Preload images for better performance
    const imagePreloads = images.slice(1).map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    // Rotate images every 5 seconds with fade effect
    // Use requestAnimationFrame for smoother transitions
    let lastRotation = Date.now();
    const rotationInterval = 5000; // 5 seconds

    function rotateImages() {
        const now = Date.now();
        if (now - lastRotation >= rotationInterval) {
            currentIndex = (currentIndex + 1) % images.length;
            // Set the next image on the inactive layer
            inactiveLayer.style.backgroundImage = `url('${images[currentIndex]}')`;

            // Fade in the inactive layer
            inactiveLayer.style.opacity = '1';
            activeLayer.style.opacity = '0';

            // Swap layers
            [activeLayer, inactiveLayer] = [inactiveLayer, activeLayer];
            lastRotation = now;
        }
        requestAnimationFrame(rotateImages);
    }

    // Only start rotation if page is visible (save resources when tab is hidden)
    if (document.visibilityState === 'visible') {
        requestAnimationFrame(rotateImages);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            lastRotation = Date.now();
            requestAnimationFrame(rotateImages);
        }
    });
});

// ================================
// HOME PAGE PHOTO ALBUMS PREVIEW
// ================================

let albumsScrollInterval;
let albumImagesCache = {}; // Cache of album images for rotation

async function loadHomePageAlbums() {
    const albumsContainer = document.getElementById('home-albums-scroll');
    if (!albumsContainer) return; // Only run on home page

    // Show skeleton loaders immediately
    albumsContainer.innerHTML = `
        <div class="album-card-skeleton">
            <div class="skeleton skeleton-cover"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
        <div class="album-card-skeleton">
            <div class="skeleton skeleton-cover"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
        <div class="album-card-skeleton">
            <div class="skeleton skeleton-cover"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
    `;

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

        // Use cover images from API response (already available, no need to fetch)
        // This significantly reduces API calls and improves performance
        albums.forEach(album => {
            if (album.coverImage) {
                albumImagesCache[album.slug] = [album.coverImage];
            }
        });

        // Clear loading state (remove spinner if present)
        albumsContainer.innerHTML = '';

        // Create album cards for all albums
        // Cards will use cached images or fallback to fetching if needed
        albums.forEach(album => {
            // Ensure we have an image (use coverImage from API or fetch if missing)
            if (!albumImagesCache[album.slug] || albumImagesCache[album.slug].length === 0) {
                // Fallback fetch for albums without cover images
                fetchAlbumImages(album).then(() => {
                    // Re-render this card after image loads
                    const existingCard = albumsContainer.querySelector(`[data-album-slug="${album.slug}"]`);
                    if (existingCard && albumImagesCache[album.slug] && albumImagesCache[album.slug].length > 0) {
                        const coverDiv = existingCard.querySelector('.home-album-cover');
                        if (coverDiv) {
                            coverDiv.style.backgroundImage = `url('${albumImagesCache[album.slug][0]}')`;
                        }
                    }
                });
            }
            const card = createHomeAlbumCard(album);
            albumsContainer.appendChild(card);
        });

        // Initialize carousel
        initCarousel(albumsContainer);

    } catch (error) {
        console.error('Error loading albums:', error);
        albumsContainer.innerHTML = '<p style="color: var(--color-error); text-align: center; padding: var(--spacing-xl);">Failed to load albums. Please try again later.</p>';
    }
}

async function fetchAlbumImages(album) {
    // Use cover image from API response if available (already optimized)
    // This avoids unnecessary API calls since the albums endpoint already provides coverImage
    if (album.coverImage) {
        albumImagesCache[album.slug] = [album.coverImage];
        return;
    }
    
    // Fallback: fetch if no cover image provided
    try {
        const response = await fetch(`/api/photos?show=${encodeURIComponent(album.slug)}`);
        if (!response.ok) {
            albumImagesCache[album.slug] = [];
            return;
        }

        const data = await response.json();
        const photos = data.photos || [];

        // Pick one random image for this album
        if (photos.length > 0) {
            const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
            albumImagesCache[album.slug] = [randomPhoto.thumbnail || randomPhoto.url];
        } else {
            albumImagesCache[album.slug] = [];
        }
    } catch (error) {
        console.error(`Error fetching images for ${album.slug}:`, error);
        albumImagesCache[album.slug] = [];
    }
}

function createHomeAlbumCard(album) {
    const card = document.createElement('a');
    card.className = 'home-album-card';
    card.href = `/photos#${album.slug}`;
    card.dataset.albumSlug = album.slug;
    card.dataset.imageIndex = '0';

    const images = albumImagesCache[album.slug] || [];
    const initialImage = images[0] || album.coverImage;

    const coverImageHtml = initialImage
        ? `<div class="home-album-cover" style="background-image: url('${initialImage}');"></div>`
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

    // Build metadata lines
    // Line 1: Photographer
    const photographerHtml = album.photographer
        ? `<p class="album-metadata">${album.photographer}</p>`
        : '';

    // Line 2: Venue - Date
    const venueDateParts = [];
    if (album.venue) venueDateParts.push(album.venue);
    if (dateStr) venueDateParts.push(dateStr);
    const venueDateHtml = venueDateParts.length > 0
        ? `<p class="album-metadata">${venueDateParts.join(' - ')}</p>`
        : '';

    card.innerHTML = `
        ${coverImageHtml}
        <div class="home-album-info">
            <h3>${album.name}</h3>
            ${photographerHtml}
            ${venueDateHtml}
        </div>
    `;

    return card;
}

function initCarousel(container) {
    const scrollContainer = container.closest('.albums-scroll-container');
    if (!scrollContainer) return;

    // State management
    let currentPage = 0;
    let totalPages = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-button prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous albums');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-button next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next albums');

    scrollContainer.appendChild(prevBtn);
    scrollContainer.appendChild(nextBtn);

    // Create indicators container
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    indicatorsContainer.setAttribute('role', 'tablist');
    indicatorsContainer.setAttribute('aria-label', 'Photo album carousel pages');
    scrollContainer.appendChild(indicatorsContainer);

    // Calculate pages and create indicators
    function initIndicators() {
        const cardWidth = window.innerWidth >= 640 ? 300 : 280;
        const gap = 32;
        const cardsPerPage = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        const totalCards = container.children.length;
        totalPages = Math.ceil(totalCards / cardsPerPage);

        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Go to page ${i + 1} of ${totalPages}`);
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            indicator.dataset.page = i;

            indicator.addEventListener('click', () => goToPage(i));
            indicatorsContainer.appendChild(indicator);
        }
        updateIndicators();
    }

    // Calculate scroll amount
    function getScrollAmount() {
        const cardWidth = window.innerWidth >= 640 ? 300 : 280;
        const gap = 32;
        const cardsToScroll = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
        return cardsToScroll * (cardWidth + gap);
    }

    // Update indicators state
    function updateIndicators() {
        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            const isActive = index === currentPage;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }

    // Go to specific page
    function goToPage(pageIndex) {
        currentPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
        const scrollAmount = getScrollAmount() * currentPage;

        container.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });

        updateIndicators();
        updateButtons();
    }

    // Scroll to next
    function scrollNext() {
        if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        }
    }

    // Scroll to previous
    function scrollPrev() {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    }

    // Button click handlers
    prevBtn.addEventListener('click', () => {
        scrollPrev();
    });

    nextBtn.addEventListener('click', () => {
        scrollNext();
    });

    // Keyboard navigation
    scrollContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollNext();
        }
    });

    // Touch/swipe support
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                scrollNext(); // Swipe left
            } else {
                scrollPrev(); // Swipe right
            }
        }
    }

    // Update current page on scroll (for touch/manual scroll)
    let scrollTimeout;
    container.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollAmount = getScrollAmount();
            const newPage = Math.round(container.scrollLeft / scrollAmount);
            if (newPage !== currentPage) {
                currentPage = newPage;
                updateIndicators();
                updateButtons();
            }
        }, 150);
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initIndicators();
            goToPage(currentPage);
        }, 250);
    });

    // Initialize
    initIndicators();
    updateButtons();

    // Make container focusable for keyboard navigation
    scrollContainer.setAttribute('tabindex', '0');
}

// ================================
// ABOUT SECTION IMAGE ROTATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const aboutImage = document.querySelector('.about-image');
    if (!aboutImage) return;

    // Array of about section images
    const images = [
        'images/whowearelarge.jpg',
        'images/zack_brian_corey.png'
    ];

    let currentIndex = 0;

    // Preload second image
    const aboutImgPreload = new Image();
    aboutImgPreload.src = images[1];

    // Rotate images every 4 seconds with faster fade effect
    // Only rotate when page is visible
    let lastAboutRotation = Date.now();
    const aboutRotationInterval = 4000;

    function rotateAboutImage() {
        const now = Date.now();
        if (now - lastAboutRotation >= aboutRotationInterval && document.visibilityState === 'visible') {
            currentIndex = (currentIndex + 1) % images.length;

            // Fade out
            aboutImage.style.opacity = '0';

            // Change image after fade
            setTimeout(() => {
                aboutImage.src = images[currentIndex];
                // Fade in
                aboutImage.style.opacity = '1';
            }, 200); // Faster fade transition
            
            lastAboutRotation = now;
        }
        requestAnimationFrame(rotateAboutImage);
    }

    requestAnimationFrame(rotateAboutImage);
});

// Load albums on page load
document.addEventListener('DOMContentLoaded', loadHomePageAlbums);
