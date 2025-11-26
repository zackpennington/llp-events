/**
 * Photos Gallery Frontend Logic
 * Handles album listing, photo fetching, and boxy.js integration
 */

class PhotoGallery {
    constructor() {
        this.currentShow = null;
        this.albums = [];
        this.photos = [];
        this.albumCoversCache = {};
        this.currentFilter = 'all';

        // Album slug patterns mapped to filter categories
        this.filterMappings = {
            'emo': slug => slug.startsWith('lle'),
            'nu-metal': slug => slug.startsWith('llnm'),
            'louder-than-life': slug => slug.startsWith('llltl'),
            '3cfar': slug => slug.startsWith('3cfar')
        };

        this.init();
    }

    init() {
        // Check for hash-based navigation (e.g., #emo-2024-03-15)
        const hash = window.location.hash.slice(1);

        if (hash) {
            this.loadPhotos(hash);
        } else {
            this.loadAlbums();
        }

        // Handle browser back/forward navigation
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.slice(1);
            if (newHash) {
                this.loadPhotos(newHash);
            } else {
                this.loadAlbums();
            }
        });

        // Initialize filter bar
        this.initFilterBar();
    }

    /**
     * Initialize filter bar event listeners
     */
    initFilterBar() {
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Update active state
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');

                // Apply filter
                this.currentFilter = tag.dataset.filter;
                this.filterAlbums();
            });
        });
    }

    /**
     * Filter albums based on current filter selection
     */
    filterAlbums() {
        const albumCards = document.querySelectorAll('.album-card');

        albumCards.forEach(card => {
            const slug = card.dataset.show;
            const shouldShow = this.matchesFilter(slug);

            if (shouldShow) {
                card.style.display = '';
                card.classList.remove('filtered-out');
            } else {
                card.style.display = 'none';
                card.classList.add('filtered-out');
            }
        });
    }

    /**
     * Check if album slug matches current filter
     */
    matchesFilter(slug) {
        if (this.currentFilter === 'all') {
            return true;
        }

        const filterFn = this.filterMappings[this.currentFilter];
        return filterFn ? filterFn(slug) : true;
    }

    /**
     * Fetch and display album list
     */
    async loadAlbums() {
        this.showLoading('Loading albums...');

        try {
            const response = await fetch('/api/photos');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.albums = data.albums || [];

            if (this.albums.length === 0) {
                this.showEmptyState('No photo albums yet', 'Check back soon for photos from our shows!');
            } else {
                // Use cover images from API response (already optimized)
                // No need to fetch separately - API already provides coverImage
                this.albums.forEach(album => {
                    if (album.coverImage) {
                        this.albumCoversCache[album.slug] = album.coverImage;
                    }
                });
                this.showAlbums();
            }

        } catch (error) {
            console.error('Error loading albums:', error);
            this.showError('Failed to load albums', 'Please try again later.');
        }
    }

    /**
     * Fetch and display photos for a specific show
     */
    async loadPhotos(showSlug) {
        this.currentShow = showSlug;
        this.showPhotosLoading('Loading photos...');

        try {
            const response = await fetch(`/api/photos?show=${encodeURIComponent(showSlug)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.photos = data.photos || [];

            if (this.photos.length === 0) {
                this.showEmptyState('No photos in this album yet', 'Photos will be added soon!');
            } else {
                this.showPhotos();
            }

        } catch (error) {
            console.error('Error loading photos:', error);
            this.showError('Failed to load photos', 'Please try again later.');
        }
    }

    /**
     * Display album cards
     */
    showAlbums() {
        const albumsSection = document.querySelector('.albums-section');
        const photosSection = document.querySelector('.photos-section');
        const filterSection = document.querySelector('.filter-section');

        albumsSection.classList.remove('hidden');
        photosSection.classList.add('hidden');
        if (filterSection) filterSection.classList.remove('hidden');

        // Reset meta tags to default
        this.resetMetaTags();

        const albumsGrid = document.querySelector('.albums-grid');
        albumsGrid.innerHTML = '';

        this.albums.forEach(album => {
            const card = this.createAlbumCard(album);
            albumsGrid.appendChild(card);
        });

        // Add scroll animations
        this.addScrollAnimations();
    }

    /**
     * Create album card element
     */
    createAlbumCard(album) {
        const card = document.createElement('div');
        card.className = 'album-card fade-in';
        card.dataset.show = album.slug;

        // Use cached random cover or fallback to album.coverImage
        const coverImage = this.albumCoversCache[album.slug] || album.coverImage;
        const coverImageHtml = coverImage
            ? `<div class="album-cover" style="background-image: url('${coverImage}');"></div>`
            : '';

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
            <div class="album-info">
                <h3>${album.name}</h3>
                ${photographerHtml}
                ${venueDateHtml}
                <p class="photo-count">View photos →</p>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.hash = album.slug;
        });

        return card;
    }

    /**
     * Display photo grid
     */
    async showPhotos() {
        const albumsSection = document.querySelector('.albums-section');
        const photosSection = document.querySelector('.photos-section');
        const filterSection = document.querySelector('.filter-section');

        albumsSection.classList.add('hidden');
        photosSection.classList.remove('hidden');
        if (filterSection) filterSection.classList.add('hidden');

        // Update heading and details with album info
        const heading = photosSection.querySelector('h2');
        const detailsContainer = photosSection.querySelector('.album-details');

        // If albums aren't loaded yet, fetch them to get the album info
        if (this.albums.length === 0) {
            try {
                const response = await fetch('/api/photos');
                if (response.ok) {
                    const data = await response.json();
                    this.albums = data.albums || [];
                }
            } catch (error) {
                console.error('Error loading albums for heading:', error);
            }
        }

        const currentAlbum = this.albums.find(a => a.slug === this.currentShow);
        if (currentAlbum) {
            // Update dynamic meta tags for this album
            this.updateMetaTags(currentAlbum);

            heading.textContent = currentAlbum.name;

            // Format date if available
            let dateStr = '';
            if (currentAlbum.date) {
                const date = new Date(currentAlbum.date);
                dateStr = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            // Build details HTML
            let detailsHtml = '';
            if (currentAlbum.photographer) {
                detailsHtml += `<p class="detail-photographer">${currentAlbum.photographer}</p>`;
            }

            // Venue - Date on one line
            const venueDateParts = [];
            if (currentAlbum.venue) venueDateParts.push(currentAlbum.venue);
            if (dateStr) venueDateParts.push(dateStr);
            if (venueDateParts.length > 0) {
                detailsHtml += `<p class="detail-venue-date">${venueDateParts.join(' - ')}</p>`;
            }

            detailsContainer.innerHTML = detailsHtml;
        }

        // Populate photo grid
        const photoGrid = document.querySelector('.photo-grid');
        photoGrid.innerHTML = '';

        // Generate descriptive alt text from album info
        const albumName = currentAlbum ? currentAlbum.name : 'Concert';
        const photographer = currentAlbum && currentAlbum.photographer ? currentAlbum.photographer : 'LLP Events';

        this.photos.forEach((photo, index) => {
            const a = document.createElement('a');
            a.href = photo.fullSize;
            a.className = 'glightbox fade-in';
            a.dataset.gallery = 'album-gallery';

            const img = document.createElement('img');
            img.src = photo.thumbnail;
            // Descriptive alt text: "Show Name photo 1 by Photographer"
            img.alt = `${albumName} photo ${index + 1} by ${photographer}`;
            img.loading = 'lazy';

            a.appendChild(img);
            photoGrid.appendChild(a);
        });

        // Initialize GLightbox
        if (typeof GLightbox !== 'undefined') {
            GLightbox({
                selector: '.glightbox'
            });
        }

        // Add structured data for images
        this.addImageStructuredData(currentAlbum, albumName, photographer);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Add scroll animations
        this.addScrollAnimations();
    }

    /**
     * Update meta tags dynamically for specific album
     */
    updateMetaTags(album) {
        // Format date for description
        let dateStr = '';
        if (album.date) {
            const date = new Date(album.date);
            dateStr = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Build dynamic description
        const photographer = album.photographer ? ` Photos by ${album.photographer}.` : '';
        const venue = album.venue ? ` at ${album.venue}` : '';
        const dateInfo = dateStr ? ` on ${dateStr}` : '';
        const description = `${album.name} photo gallery${venue}${dateInfo}.${photographer} Browse the full collection from this epic show by LLP Events.`;

        // Update page title
        document.title = `${album.name} Photos | LLP Events`;

        // Update meta description
        this.updateMetaTag('name', 'description', description);

        // Update Open Graph tags
        this.updateMetaTag('property', 'og:title', `${album.name} Photos | LLP Events`);
        this.updateMetaTag('property', 'og:description', description);
        this.updateMetaTag('property', 'og:url', `https://www.llp-events.com/photos#${album.slug}`);

        // Use first photo or album cover as OG image
        if (this.photos.length > 0) {
            this.updateMetaTag('property', 'og:image', this.photos[0].fullSize);
        } else if (this.albumCoversCache[album.slug]) {
            this.updateMetaTag('property', 'og:image', this.albumCoversCache[album.slug]);
        }

        // Update canonical URL
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.href = `https://www.llp-events.com/photos#${album.slug}`;
        }
    }

    /**
     * Reset meta tags to default
     */
    resetMetaTags() {
        document.title = 'Photos | LLP Events - Louisville Concert Photo Gallery';

        this.updateMetaTag('name', 'description', 'Relive the energy! Browse photo galleries from LLP Events\' epic emo and nu-metal tribute shows at Headliners Music Hall in Louisville, KY.');
        this.updateMetaTag('property', 'og:title', 'Photos | LLP Events');
        this.updateMetaTag('property', 'og:description', 'Relive the energy! Browse photo galleries from LLP Events\' epic emo and nu-metal tribute shows.');
        this.updateMetaTag('property', 'og:url', 'https://www.llp-events.com/photos');
        this.updateMetaTag('property', 'og:image', 'https://www.llp-events.com/images/og-image.jpg');

        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.href = 'https://www.llp-events.com/photos';
        }
    }

    /**
     * Helper method to update or create meta tags
     */
    updateMetaTag(attribute, key, value) {
        let element = document.querySelector(`meta[${attribute}="${key}"]`);
        if (element) {
            element.setAttribute('content', value);
        } else {
            element = document.createElement('meta');
            element.setAttribute(attribute, key);
            element.setAttribute('content', value);
            document.head.appendChild(element);
        }
    }

    /**
     * Add structured data for image collection
     */
    addImageStructuredData(album, albumName, photographer) {
        // Remove existing dynamic structured data if present
        const existingScript = document.querySelector('script[data-dynamic-schema]');
        if (existingScript) {
            existingScript.remove();
        }

        // Create ImageGallery structured data with individual images
        const imageObjects = this.photos.map((photo, index) => ({
            "@type": "ImageObject",
            "contentUrl": photo.fullSize,
            "thumbnail": photo.thumbnail,
            "name": `${albumName} photo ${index + 1}`,
            "description": `Photo from ${albumName} by ${photographer}`,
            "creator": {
                "@type": "Person",
                "name": photographer
            },
            "copyrightHolder": {
                "@type": "Organization",
                "name": "LLP Events"
            }
        }));

        // Build complete structured data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": `${albumName} Photos`,
            "description": `Photo gallery from ${albumName}`,
            "creator": {
                "@type": "Person",
                "name": photographer
            },
            "about": {
                "@type": "Organization",
                "name": "LLP Events",
                "url": "https://www.llp-events.com"
            },
            "image": imageObjects
        };

        // Add date if available
        if (album && album.date) {
            structuredData.datePublished = album.date;
        }

        // Add venue if available
        if (album && album.venue) {
            structuredData.location = {
                "@type": "Place",
                "name": album.venue
            };
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-schema', 'true');
        script.textContent = JSON.stringify(structuredData, null, 2);
        document.head.appendChild(script);
    }

    /**
     * Show loading state (for albums)
     */
    showLoading(message = 'Loading...') {
        const albumsSection = document.querySelector('.albums-section');
        const photosSection = document.querySelector('.photos-section');
        const albumsGrid = document.querySelector('.albums-grid');

        if (albumsGrid) {
            // Show skeleton loaders instead of spinner for better UX
            albumsGrid.innerHTML = `
                <div class="album-card-skeleton">
                    <div class="skeleton skeleton-cover"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                </div>
                <div class="album-card-skeleton">
                    <div class="skeleton skeleton-cover"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                </div>
                <div class="album-card-skeleton">
                    <div class="skeleton skeleton-cover"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                </div>
            `;
        }

        albumsSection.classList.remove('hidden');
        photosSection.classList.add('hidden');
    }

    /**
     * Show loading state in photos section
     */
    showPhotosLoading(message = 'Loading photos...') {
        const albumsSection = document.querySelector('.albums-section');
        const photosSection = document.querySelector('.photos-section');
        const photoGrid = document.querySelector('.photo-grid');

        if (photoGrid) {
            photoGrid.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
                </div>
            `;
        }

        albumsSection.classList.add('hidden');
        photosSection.classList.remove('hidden');
    }

    /**
     * Show empty state
     */
    showEmptyState(title, message) {
        const albumsSection = document.querySelector('.albums-section');
        const photosSection = document.querySelector('.photos-section');

        const container = this.currentShow ? photosSection : albumsSection;
        const otherContainer = this.currentShow ? albumsSection : photosSection;

        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📸</div>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;

        container.classList.remove('hidden');
        otherContainer.classList.add('hidden');
    }

    /**
     * Show error state
     */
    showError(title, message) {
        const albumsSection = document.querySelector('.albums-section');
        const photosSection = document.querySelector('.photos-section');
        const albumsGrid = document.querySelector('.albums-grid');

        if (albumsGrid) {
            albumsGrid.innerHTML = `
                <div class="error-state">
                    <h3>${title}</h3>
                    <p>${message}</p>
                </div>
            `;
        }

        albumsSection.classList.remove('hidden');
        photosSection.classList.add('hidden');
    }

    /**
     * Add scroll-triggered fade-in animations
     */
    addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize gallery when DOM is ready
function initGallery() {
    new PhotoGallery();

    // Back to albums button handler
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.hash = '';
        });
    }
}

// Check if DOM is already loaded, otherwise wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
} else {
    // DOM is already loaded, initialize immediately
    initGallery();
}
