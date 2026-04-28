#!/usr/bin/env node
// Generates show cards and JSON-LD blocks in index.html and shows.html
// from a single source of truth in data/shows.json.
//
// Usage: node scripts/build-shows.js
// Re-run after editing data/shows.json. Safe to run repeatedly.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/shows.json'), 'utf8'));

function indent(str, spaces) {
  const pad = ' '.repeat(spaces);
  return str
    .split('\n')
    .map((line) => (line.length ? pad + line : line))
    .join('\n');
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceBlock(content, marker, replacement, baseIndent) {
  const start = `<!-- BUILD:${marker}:START -->`;
  const end = `<!-- BUILD:${marker}:END -->`;
  const re = new RegExp(
    `(${escapeRegex(start)}\\n)([\\s\\S]*?)(\\n[ \\t]*${escapeRegex(end)})`,
  );
  if (!re.test(content)) {
    throw new Error(`Markers ${marker} not found`);
  }
  return content.replace(re, `$1${indent(replacement, baseIndent)}$3`);
}

function renderCard(show, { includeCountdown }) {
  const venue = DATA.venues[show.venue];
  const tags = show.tags
    .map((t) => `                <span class="genre-tag">${t}</span>`)
    .join('\n');
  const countdown = includeCountdown
    ? `\n            <div id="${show.countdownId}" class="countdown-timer"></div>`
    : '';
  const ticketComment = show.cta.ticketUrl
    ? `\n            <!-- ticket link: ${show.cta.ticketUrl} -->`
    : '';
  const ctaButton =
    show.cta.state === 'active' && show.cta.ticketUrl
      ? `<a href="${show.cta.ticketUrl}" class="show-cta-button" target="_blank" rel="noopener">${show.cta.text}</a>`
      : `<span class="show-cta-button disabled">${show.cta.text}</span>`;

  const posterClass = show.icon.fullPoster ? ' show-icon-poster--full' : '';
  const imgAttrs = show.icon.fullPoster ? '' : ' width="96" height="96"';

  return `<!-- ${show.title} -->
<div class="show-card" data-scroll>
    <div class="show-icon-poster${posterClass}">
        <img src="${show.icon.src}" alt="${show.icon.alt}"${imgAttrs}>
    </div>
    <div class="show-info-panel">
        <div class="show-date-badge">${show.dateBadge}</div>
        <div class="show-details">
            <div class="show-venue">${venue.displayName} • ${venue.city}</div>${countdown}
            <div class="show-genre-tags">
${tags}
            </div>
        </div>
        <h3 class="show-card-title">${show.title}</h3>
        <p class="show-description">
            ${show.description}
        </p>
        <div class="show-cta-group">${ticketComment}
            ${ctaButton}
        </div>
    </div>
</div>`;
}

function renderAllCards(opts) {
  return DATA.shows.map((s) => renderCard(s, opts)).join('\n\n');
}

function renderPastShow(item) {
  return `<div class="past-show-item">
    <h3>${item.title}</h3>
    <p class="past-show-editions">${item.editions}</p>
    <p>${item.description}</p>
</div>`;
}

function renderAllPastShows() {
  return DATA.pastShows.map(renderPastShow).join('\n');
}

function renderMusicEvent(show, { includeContext }) {
  const venue = DATA.venues[show.venue];
  const ev = {};
  if (includeContext) ev['@context'] = 'https://schema.org';
  Object.assign(ev, {
    '@type': 'MusicEvent',
    name: show.title,
    description: show.description,
    image: DATA.defaults.image,
    startDate: show.startDate,
    endDate: show.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': venue.schemaType,
      name: venue.displayName,
      address: { '@type': 'PostalAddress', ...venue.address },
    },
    organizer: {
      '@type': 'Organization',
      name: DATA.defaults.organizer.name,
      url: DATA.defaults.organizer.url,
    },
    performer: { '@type': 'MusicGroup', name: DATA.defaults.performer },
    offers: {
      '@type': 'Offer',
      url: show.offer?.url || DATA.defaults.offerUrl,
      price: show.offer?.price || DATA.defaults.offerPrice,
      priceCurrency: show.offer?.priceCurrency || DATA.defaults.offerPriceCurrency,
      validFrom: show.offer?.validFrom || DATA.defaults.offerValidFrom,
      availability: show.offer?.availability || 'https://schema.org/PreOrder',
    },
  });
  return ev;
}

function renderJsonLdArray() {
  const arr = DATA.shows.map((s) => renderMusicEvent(s, { includeContext: true }));
  return JSON.stringify(arr, null, 4);
}

function renderJsonLdSeries() {
  const series = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: DATA.series.name,
    description: DATA.series.description,
    url: DATA.series.url,
    location: {
      '@type': 'City',
      name: 'Louisville',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Louisville',
        addressRegion: 'KY',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: DATA.defaults.organizer.name,
      url: DATA.defaults.organizer.url,
    },
    subEvent: DATA.shows.map((s) => renderMusicEvent(s, { includeContext: false })),
  };
  return JSON.stringify(series, null, 4);
}

function build(file, { cardIndent, includeCountdown, jsonLdRenderer, jsonLdIndent }) {
  const filePath = path.join(ROOT, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const cards = renderAllCards({ includeCountdown });
  content = replaceBlock(content, 'SHOWS-CARDS', cards, cardIndent);

  const jsonLdBlock = `<script type="application/ld+json">\n${jsonLdRenderer()}\n</script>`;
  content = replaceBlock(content, 'SHOWS-JSONLD', jsonLdBlock, jsonLdIndent);

  fs.writeFileSync(filePath, content);
  console.log(`✓ Built ${file}`);
}

build('index.html', {
  cardIndent: 12,
  includeCountdown: true,
  jsonLdRenderer: renderJsonLdArray,
  jsonLdIndent: 4,
});

build('shows.html', {
  cardIndent: 16,
  includeCountdown: false,
  jsonLdRenderer: renderJsonLdSeries,
  jsonLdIndent: 4,
});

(function buildPastShows() {
  const file = path.join(ROOT, 'shows.html');
  let content = fs.readFileSync(file, 'utf8');
  content = replaceBlock(content, 'PAST-SHOWS', renderAllPastShows(), 20);
  fs.writeFileSync(file, content);
  console.log('✓ Built shows.html (past shows)');
})();
