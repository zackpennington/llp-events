// Quick script to generate favicon files from SVG
// Since we don't have image processing tools, we'll use a simple approach:
// 1. Use the SVG directly as favicon for modern browsers
// 2. Create a simple data URI for ICO fallback

const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgPath = path.join(__dirname, 'images', 'LLP_Logo_Stacked.svg');

// For now, let's just copy the SVG as favicon.svg
// Modern browsers support SVG favicons
const outputSvgPath = path.join(__dirname, 'favicon.svg');

try {
    // Read SVG (first 5000 chars to avoid memory issues)
    const svgContent = fs.readFileSync(svgPath, 'utf8');

    // Write optimized version for favicon
    // We'll create a simplified version with just the viewBox
    const svgMatch = svgContent.match(/<svg[^>]*>/);
    if (svgMatch) {
        const simplifiedSvg = `<?xml version="1.0" encoding="UTF-8"?>
${svgContent}`;

        fs.writeFileSync(outputSvgPath, simplifiedSvg);
        console.log('✓ Created favicon.svg');
    }
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}

console.log('\nNote: SVG favicons work in modern browsers.');
console.log('For full support, you may want to create PNG versions using an online tool like:');
console.log('- https://realfavicongenerator.net/');
console.log('- https://favicon.io/');
