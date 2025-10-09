# LLP Events

High-energy concert promotion website for Louisville's premier music events: **Louisville Loves Emo** and **Louisville Loves Nu-Metal**.

## 🎸 About

LLP Events delivers unforgettable, high-energy concert experiences in Louisville, KY. We specialize in creating explosive nights of music that bring together passionate fans and incredible performers.

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/zackpennington/llp-events.git
cd llp-events
```

2. Start the local server:
```bash
npm run dev
```

The site will be available at `http://localhost:8000`

Alternatively, you can use any local server:
```bash
python3 -m http.server 8000
# or
npx serve
```

### Deployment

This site is configured for deployment on **Vercel**:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the static site configuration
3. Deploy with a single click - no build steps required

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📁 Project Structure

```
llp-events/
├── index.html          # Main landing page
├── emo.html           # Louisville Loves Emo show page
├── numetal.html       # Louisville Loves Nu-Metal show page
├── css/
│   ├── style.css      # Main styles
│   └── shows.css      # Show-specific styles
├── js/
│   └── main.js        # Interactive features & animations
├── images/            # Event photos and logos
└── vercel.json        # Deployment configuration
```

## 🎨 Features

- **High-Energy Design**: Dark theme with vibrant gradients and bold typography
- **Scroll Animations**: Smooth reveal effects as you scroll
- **Interactive Elements**: Hover effects, parallax, and dynamic content
- **Responsive**: Optimized for mobile, tablet, and desktop
- **Fast Loading**: Pure HTML/CSS/JS - no build process required
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🖼️ Adding Images

Replace the placeholder images in the `images/` directory with your event photos:

1. Add photos to the `images/` folder
2. Update image references in HTML files
3. Recommended formats: JPG for photos, PNG for logos with transparency
4. Optimize images before uploading for best performance

## 🎯 Customization

### Colors

Theme colors are defined in `css/style.css`:
- Emo: Pink (#ff006e) & Purple (#8338ec)
- Nu-Metal: Red (#d00000) & Orange (#ff6d00)

### Content

Update event details, dates, and descriptions directly in the HTML files.

### Social Links

Add your social media links in `index.html`, `emo.html`, and `numetal.html` footer sections.

## 📝 License

© 2024 LLP Events. All rights reserved.

---

**Built with 🤘 for the Louisville music scene**
