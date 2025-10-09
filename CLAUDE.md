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
├── emo.html           # Louisville Loves Emo show page
├── numetal.html       # Louisville Loves Nu-Metal show page
├── css/
│   ├── style.css      # Core styles (nav, hero, sections, responsive)
│   └── shows.css      # Show-specific pages styling
├── js/
│   └── main.js        # Scroll animations, parallax, interactions
├── images/
│   ├── lle-logo.png   # Louisville Loves Emo logo
│   └── numetal-logo.png # Louisville Loves Nu-Metal logo
└── vercel.json        # Static deployment config
```

## Design System

### Color Palette
- **Base**: Dark theme (#000000, #1a1a1a, #2a2a2a)
- **Emo Theme**: Pink (#ff006e) + Purple (#8338ec)
- **Nu-Metal Theme**: Red (#d00000) + Orange (#ff6d00)
- **Accent**: Electric Blue (#00f5ff)

### Typography
- **Display**: Impact, Haettenschweiler (bold headers)
- **Body**: System font stack (readable text)
- **Style**: Uppercase, heavy letter-spacing, high contrast

### Key Design Patterns
1. **Hero Sections**: Full viewport height, gradient backgrounds, animated text
2. **Scroll Animations**: Elements fade/slide in using Intersection Observer
3. **Hover Effects**: Cards tilt on mousemove, buttons have gradient transitions
4. **Placeholders**: Gray boxes with pattern overlays for images (user will replace)

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

## Deployment Notes

- Vercel auto-deploys from main branch
- No environment variables needed
- All assets are static (no API calls)
- Site is SEO-optimized with meta tags
