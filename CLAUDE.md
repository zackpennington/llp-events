# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LLP Events is a static marketing website for a Louisville-based concert promotion company. The site showcases two flagship shows: **Louisville Loves Emo** and **Louisville Loves Nu-Metal**. This is a pure HTML/CSS/JavaScript site with no build process or frameworks.

## Tech Stack

- **Pure HTML5**: Semantic markup, no templating
- **CSS3**: Custom properties, animations, gradients
- **Vanilla JavaScript**: Scroll animations, interactions, no frameworks
- **Deployment**: Vercel (configured via vercel.json)

## Development Commands

### Local Development
```bash
npm run dev          # Starts Python HTTP server on port 8000
# OR
python3 -m http.server 8000
# OR
npx serve
```

Visit `http://localhost:8000` to view the site.

### Deployment
- Push to GitHub → Vercel auto-deploys
- No build step required

## Project Structure

```
llp-events/
├── index.html          # Main landing page with hero, shows overview, contact
├── photos.html         # Photo gallery page with album browsing
├── emo.html           # Louisville Loves Emo show page
├── numetal.html       # Louisville Loves Nu-Metal show page
├── api/
│   ├── subscribe.js   # Resend API serverless function for newsletter signups
│   ├── contact.js     # Resend API serverless function for contact form (with Cloudflare Turnstile)
│   └── photos.js      # Vercel Blob API for listing show photos
├── css/
│   ├── style.css      # Core styles with unified CSS variables (nav, hero, sections, responsive)
│   ├── photos.css     # Photo gallery styles (album cards, grid, lightbox theme)
│   ├── shows.css      # Show-specific pages styling
│   └── resend-form.css # Newsletter form styling
├── js/
│   ├── main.js        # Scroll animations, parallax, interactions
│   ├── photos.js      # Photo gallery logic (album selection, boxy.js integration)
│   ├── contact.js     # Contact form handler with Turnstile verification
│   └── newsletter.js  # Newsletter signup handler
├── images/
│   ├── lle-logo.png   # Louisville Loves Emo logo
│   └── numetal-logo.png # Louisville Loves Nu-Metal logo
├── favicon.svg        # SVG favicon (generated from logo)
└── vercel.json        # Static deployment config + serverless functions + image optimization
```

## Design System

### Color Palette (Unified CSS Variables)
All colors are defined in `css/style.css` `:root` and used consistently throughout:

**Base Colors:**
- `--color-black: #000000`
- `--color-charcoal: #1a1a1a`
- `--color-slate: #2a2a2a`
- `--color-white: #ffffff`
- `--color-light-gray: #e0e0e0`

**Brand Colors:**
- `--color-primary-red: #b0212a` (Main brand color)
- `--color-bright-red: #d42d3a` (Hover states, accents)
- `--color-orange: #ff6b35` (Secondary accent)

**Form State Colors:**
- `--color-error: #ff6b6b`
- `--color-success: #22c55e`

**Spacing:**
- `--spacing-xs` through `--spacing-xl` (0.25rem to 3rem)

**Border Radius:**
- `--radius-sm` through `--radius-full` (4px to 50%)

**Box Shadows:**
- `--shadow-sm/md/lg` (black shadows)
- `--shadow-red-sm/md/lg` (red glows for interactive elements)

**Overlays:**
- `--overlay-light/medium/dark/nav` (rgba black overlays)

### Typography
- **Display**: Impact, Haettenschweiler (`--font-display`)
- **Body**: System font stack (`--font-primary`)
- **Style**: Uppercase, heavy letter-spacing, high contrast

### Key Design Patterns
1. **Hero Sections**: Full viewport height, gradient backgrounds, animated text
2. **Scroll Animations**: Elements fade/slide in using Intersection Observer
3. **Hover Effects**: Cards tilt on mousemove, buttons have red glow transitions
4. **Social Icons**: Red by default (not just on hover)
5. **Unified Transitions**: All use `--transition-smooth` (0.4s cubic-bezier)

## Architecture Notes

### Page Flow
1. **index.html**: Landing → Shows grid → Stats → About → Contact
2. **emo.html / numetal.html**: Hero with logo → Event details → Experience → Gallery → CTA

### JavaScript Features
- Intersection Observer for scroll-triggered animations
- Parallax effect on hero content
- 3D tilt effect on show cards
- Smooth scroll for anchor links
- Custom cursor glow effect (desktop only)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 968px
- Desktop: > 968px

## Content Management

### Adding Images
1. Place images in `images/` directory
2. Update `src` attributes in HTML
3. Replace `.image-placeholder` divs with `<img>` tags
4. Optimize images before upload (WebP recommended)

### Updating Shows
- Modify event details in `emo.html` and `numetal.html`
- Update "Next Show" dates in event-info-card sections
- Add lineup/genre information as needed

### Social Links
Update href attributes in footer sections:
- index.html:286-288
- emo.html footer
- numetal.html footer

## Backend Integration

### Email Services (Resend API)
- **Newsletter**: `/api/subscribe.js` - Sends signups to `info@llp-events.com`
- **Contact Form**: `/api/contact.js` - Sends contact messages to `info@llp-events.com`

### Security
- **Cloudflare Turnstile**: Bot protection on contact form
- **Conditional Loading**: Turnstile only loads in production (not localhost)

### Environment Variables (Vercel Dashboard)
Required for email integration:
- `RESEND_API_KEY` - Your Resend API key
- `TURNSTILE_SECRET_KEY` - Cloudflare Turnstile secret key

## Photo Gallery System

### Overview
The site features a dynamic photo gallery at `/photos` that displays albums from past shows. Photos are stored in Vercel Blob Storage and automatically optimized for web delivery.

### Architecture
```
/photos
├── /api/photos.js          # Serverless function to list photos from Blob storage
├── /css/photos.css         # Gallery-specific styles matching site theme
├── /js/photos.js           # Frontend logic for album/photo display
└── photos.html             # Gallery page with SEO optimization
```

### Photo Storage Structure
Photos are organized in Vercel Blob Storage using folders at the root level:

```
llnm1-janelle/          # Louisville Loves Nu-Metal #1 - Janelle
  ├── photo-001.jpg
  ├── photo-002.jpg
  └── photo-003.jpg
llnm1-vic/              # Louisville Loves Nu-Metal #1 - Vic
  ├── photo-001.jpg
  └── photo-002.jpg
lle2/                   # Louisville Loves Emo #2
  └── *.jpg
[folder-name]/
  └── *.jpg/png/webp
```

**Naming Convention:**
The API automatically recognizes and formats common folder patterns:
- `llnm1-janelle` → "Louisville Loves Nu-Metal #1 - Janelle"
- `llnm1-vic` → "Louisville Loves Nu-Metal #1 - Vic"
- `llnm2`, `lle3`, etc. → "Louisville Loves Nu-Metal #2", "Louisville Loves Emo #3"
- `emo-2024-03-15` → "Emo - March 15, 2024" (date-based format)
- Any other format → Capitalized words (e.g., `my-show` → "My Show")

### Uploading Photos

Photos are uploaded directly to Vercel Blob Storage using Vercel CLI or dashboard:

**Via Vercel CLI:**
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Upload photos to an album folder
vercel blob put photo-001.jpg --path llnm1-janelle/photo-001.jpg --token $BLOB_READ_WRITE_TOKEN
vercel blob put photo-002.jpg --path llnm1-vic/photo-001.jpg --token $BLOB_READ_WRITE_TOKEN
```

**Via Vercel Dashboard:**
1. Go to project → Storage → Blob
2. Create new folder for the album (e.g., `llnm2-photos`, `lle3-janelle`)
3. Upload photos to that folder

**Best Practices:**
- Use descriptive filenames (e.g., `crowd-01.jpg`, `stage-performance.jpg`)
- Upload original high-resolution photos - Vercel Image API handles optimization
- Supported formats: JPEG, PNG, WebP, AVIF
- Recommended max size: 10MB per photo (will be optimized on delivery)

### Image Optimization

Images are automatically optimized using Vercel's Image Optimization API (`/_vercel/image`):

**Features:**
- Automatic format conversion (AVIF → WebP → JPEG)
- Responsive sizing (640px thumbnails, 1920px full-size)
- CDN caching (24 hours)
- Lazy loading on frontend

**Configuration:**
Settings in `vercel.json`:
```json
"images": {
  "sizes": [640, 828, 1200, 1920],
  "formats": ["image/avif", "image/webp"],
  "minimumCacheTTL": 86400
}
```

### Gallery Features
- **Album View**: Lists all show albums organized by date
- **Photo Grid**: Responsive grid layout (1-4 columns based on screen size)
- **Lightbox**: boxy.js library for full-screen photo viewing with touch gestures
- **Deep Linking**: URLs like `/photos#emo-2024-03-15` link directly to albums
- **Mobile Optimized**: Touch gestures, lazy loading, optimized thumbnails

### API Endpoints

**List Albums:**
```
GET /api/photos
Returns: { albums: [{ slug, name, path }] }
```

**List Photos in Album:**
```
GET /api/photos?show=llnm1-janelle
Returns: { show, photos: [{ id, thumbnail, fullSize, filename }], count }
```

### Analytics
Photo page views are tracked via Vercel Analytics (`/_vercel/insights/script.js`)

## Deployment Notes

- Vercel auto-deploys from main branch
- Set environment variables in Vercel dashboard for email functionality
- Serverless functions located in `/api/` directory
- Site is SEO-optimized with meta tags
- Favicon uses SVG (modern browsers) with ICO fallback

## Recent Changes

### CSS Unification (2025)
- Expanded CSS variables in `:root` to include:
  - Form state colors (error/success)
  - Border radius system (sm/md/lg/xl/full)
  - Box shadow system (black + red glow variants)
  - Overlay opacity levels (light/medium/dark/nav)
- Replaced 50+ hardcoded values in `style.css` with CSS variables
- Replaced 30+ hardcoded values in `resend-form.css` with CSS variables
- **Social icons now red by default** (not just on hover)
- All transitions now use `--transition-smooth` for consistency

### Bug Fixes
- Fixed navbar null reference error (added null check in `main.js`)
- Created `favicon.svg` from logo (removed missing PNG references)
- Made Turnstile load conditionally (production only)
- Updated recipient email to `info@llp-events.com`
- Increased navbar logo height to 65px for better visual presence
