// Singer Lineup Page Logic
let singerData = [];
let currentSingerEmail = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCSVData();
    setupEventListeners();
});

// Load and parse CSV data
async function loadCSVData() {
    try {
        const response = await fetch('/data/singer-lineup.csv');
        const csvText = await response.text();
        singerData = parseCSV(csvText);
        console.log('Loaded singer data:', singerData.length, 'rows');
    } catch (error) {
        console.error('Error loading CSV data:', error);
        showError('Unable to load singer data. Please try again later.');
    }
}

// Parse CSV text into array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const values = parseCSVLine(line);
        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });

        data.push(row);
    }

    return data;
}

// Parse a single CSV line (handles quoted values with commas)
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current);
    return values;
}

// Setup event listeners
function setupEventListeners() {
    const emailForm = document.getElementById('email-form');
    const logoutBtn = document.getElementById('logout-btn');

    emailForm.addEventListener('submit', handleEmailSubmit);
    logoutBtn.addEventListener('click', handleLogout);
}

// Handle email form submission
function handleEmailSubmit(e) {
    e.preventDefault();

    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim().toLowerCase();

    if (!email) {
        showError('Please enter your email address.');
        return;
    }

    // Check if email exists in data
    const singerSongs = singerData.filter(song =>
        song.singer_email.toLowerCase() === email
    );

    if (singerSongs.length === 0) {
        showError('Email not found. Please check your email and try again.');
        return;
    }

    // Email found - show lineup
    currentSingerEmail = email;
    displayLineup(email, singerSongs);
}

// Display the lineup view
function displayLineup(email, songs) {
    // Get singer name from email (simple extraction)
    const singerName = extractNameFromEmail(email);

    // Update header
    document.getElementById('singer-name').textContent = singerName;
    document.getElementById('singer-email').textContent = email;

    // Display songs
    displaySongs(songs);

    // Switch views
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('lineup-view').style.display = 'flex';
}

// Extract name from email (simple heuristic)
function extractNameFromEmail(email) {
    const namePart = email.split('@')[0];
    const parts = namePart.split(/[._-]/);

    return parts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

// Display songs in the container, grouped by show
function displaySongs(songs) {
    const container = document.getElementById('songs-container');
    container.innerHTML = '';

    if (songs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>No Songs Assigned</h2>
                <p>You don't have any songs assigned at this time.</p>
            </div>
        `;
        return;
    }

    // Group songs by show
    const songsByShow = {};
    songs.forEach(song => {
        const show = song.show || 'Unassigned';
        if (!songsByShow[show]) {
            songsByShow[show] = [];
        }
        songsByShow[show].push(song);
    });

    // Display each show group
    Object.keys(songsByShow).sort().forEach(show => {
        const showSection = createShowSection(show, songsByShow[show]);
        container.appendChild(showSection);
    });
}

// Create a show section with header and songs
function createShowSection(showName, songs) {
    const section = document.createElement('div');
    section.className = 'show-section';

    const header = document.createElement('div');
    header.className = 'show-header';
    header.innerHTML = `
        <h2 class="show-title">${escapeHTML(showName)}</h2>
        <span class="show-count">${songs.length} ${songs.length === 1 ? 'song' : 'songs'}</span>
    `;
    section.appendChild(header);

    const songsContainer = document.createElement('div');
    songsContainer.className = 'show-songs';

    songs.forEach(song => {
        const songCard = createSongCard(song);
        songsContainer.appendChild(songCard);
    });

    section.appendChild(songsContainer);
    return section;
}

// Create a song card element
function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'song-card';

    // Parse co-singers (remove quotes and split)
    const coSingers = song.co_singers
        ? song.co_singers.replace(/^"|"$/g, '').split(',').map(s => s.trim())
        : [];

    const coSingersHTML = coSingers.length > 0
        ? `<div class="co-singers">
            ${coSingers.map(singer => `<span class="co-singer-tag">${singer}</span>`).join('')}
           </div>`
        : '<span>Solo</span>';

    card.innerHTML = `
        <h3 class="song-title">${escapeHTML(song.song_title)}</h3>
        <p class="song-artist">by ${escapeHTML(song.original_artist)}</p>
        <div class="song-details">
            <div class="detail-row">
                <span class="detail-label">Cover Band:</span>
                <span class="detail-value">${escapeHTML(song.cover_band)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Singing With:</span>
                <div class="detail-value">${coSingersHTML}</div>
            </div>
        </div>
    `;

    return card;
}

// Handle logout
function handleLogout() {
    currentSingerEmail = null;

    // Clear email input
    document.getElementById('email-input').value = '';

    // Hide error message
    hideError();

    // Switch views
    document.getElementById('lineup-view').style.display = 'none';
    document.getElementById('login-view').style.display = 'flex';
}

// Show error message
function showError(message) {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

// Hide error message
function hideError() {
    const errorEl = document.getElementById('error-message');
    errorEl.style.display = 'none';
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
