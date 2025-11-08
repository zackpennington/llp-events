/**
 * Photos Gallery Frontend Logic
 * Handles album listing, photo fetching, and boxy.js integration
 */

class PhotoGallery {
    constructor() {
        this.currentShow = null;
        this.albums = [];
        this.photos = [];
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

        albumsSection.classList.remove('hidden');
        photosSection.classList.add('hidden');

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

        const coverImageHtml = album.coverImage
            ? `<div class="album-cover" style="background-image: url('${album.coverImage}');"></div>`
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
        const metadata = [];
        if (dateStr) metadata.push(dateStr);
        if (album.photographer) metadata.push(album.photographer);
        const metadataHtml = metadata.length > 0
            ? `<p class="album-metadata">${metadata.join(' • ')}</p>`
            : '';

        const venueHtml = album.venue
            ? `<p class="album-metadata">${album.venue}</p>`
            : '';

        card.innerHTML = `
            ${coverImageHtml}
            <div class="album-info">
                <h3>${album.name}</h3>
                ${metadataHtml}
                ${venueHtml}
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

        albumsSection.classList.add('hidden');
        photosSection.classList.remove('hidden');

        // Update heading with show name
        const heading = photosSection.querySelector('h2');

        // If albums aren't loaded yet, fetch them to get the album name
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
            heading.textContent = currentAlbum.name;
        }

        // Populate photo grid
        const photoGrid = document.querySelector('.photo-grid');
        photoGrid.innerHTML = '';

        this.photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.thumbnail;
            img.alt = photo.filename;
            img.loading = 'lazy';
            img.className = 'fade-in';

            // Set data attribute for boxy.js to use full-size image
            img.dataset.boxy = photo.fullSize;

            photoGrid.appendChild(img);
        });

        // Initialize boxy.js lightbox
        if (typeof Boxy !== 'undefined') {
            new Boxy();
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Add scroll animations
        this.addScrollAnimations();
    }

    /**
     * Show loading state (for albums)
     */
    showLoading(message = 'Loading...') {
        const albumsSection = document.querySelector('.albums-section');
        const photosSection = document.querySelector('.photos-section');
        const albumsGrid = document.querySelector('.albums-grid');

        if (albumsGrid) {
            albumsGrid.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
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
