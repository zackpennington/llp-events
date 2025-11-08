import { list } from '@vercel/blob';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Helper to check if we're in production
function isProduction() {
  return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
}

// Helper to create optimized image URL (only in production)
function getOptimizedImageUrl(originalUrl, width, quality = 75) {
  if (!isProduction()) {
    return originalUrl; // In dev, use direct URLs
  }
  return `/_vercel/image?url=${encodeURIComponent(originalUrl)}&w=${width}&q=${quality}`;
}

// Load album metadata from JSON files in data/albums/
function loadAlbumMetadata() {
  try {
    const albumsDir = join(process.cwd(), 'data', 'albums');
    const files = readdirSync(albumsDir).filter(f => f.endsWith('.json'));

    const albums = files.map(file => {
      const filePath = join(albumsDir, file);
      const fileContent = readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    });

    return albums;
  } catch (error) {
    console.error('Error loading album metadata:', error);
    return [];
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Cache for 1 hour, stale-while-revalidate for 24 hours
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { show, cursor } = req.query;

  try {
    // If no show specified, list all show folders at root level
    if (!show) {
      // Load album metadata
      const albumMetadata = loadAlbumMetadata();
      const metadataBySlug = {};
      albumMetadata.forEach(album => {
        metadataBySlug[album.slug] = album;
      });

      const result = await list({
        mode: 'folded',
        limit: 100
      });

      // Extract show names from folder paths (folders at root level)
      const albumsWithCovers = await Promise.all(
        result.folders
          .filter(folder => folder !== 'shows/') // Exclude any legacy "shows/" folder
          .map(async (folder) => {
            const showSlug = folder.replace('/', '');

            // Fetch images from this folder for random cover selection
            const folderContents = await list({
              prefix: folder,
              limit: 100 // Get more images to have better random selection
            });

            // Filter to get only image files (not folders)
            const imageBlobs = folderContents.blobs.filter(blob =>
              isImageFile(blob.pathname) && !blob.pathname.endsWith('/')
            );

            // Select random image for cover
            const randomImage = imageBlobs.length > 0
              ? imageBlobs[Math.floor(Math.random() * imageBlobs.length)]
              : null;

            // Get metadata for this album or use defaults
            const metadata = metadataBySlug[showSlug] || {
              name: formatShowName(showSlug),
              date: null,
              photographer: null,
              venue: null,
              description: null,
              featured: true
            };

            // Use Vercel Image Optimization for cover images (640px width, WebP/AVIF) - only in production
            const coverImageUrl = randomImage
              ? getOptimizedImageUrl(randomImage.url, 640)
              : null;

            return {
              slug: showSlug,
              name: metadata.name,
              date: metadata.date,
              photographer: metadata.photographer,
              venue: metadata.venue,
              description: metadata.description,
              featured: metadata.featured,
              path: folder,
              coverImage: coverImageUrl,
              photoCount: imageBlobs.length
            };
          })
      );

      // Sort albums by date (most recent first), then by name
      albumsWithCovers.sort((a, b) => {
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        if (a.date) return -1;
        if (b.date) return 1;
        return a.name.localeCompare(b.name);
      });

      return res.status(200).json({ albums: albumsWithCovers });
    }

    // List photos for specific show
    const result = await list({
      prefix: `${show}/`,
      limit: 100,
      cursor: cursor || undefined
    });

    // Transform blobs with Vercel Image Optimization for thumbnails (only in production)
    const photos = result.blobs
      .filter(blob => isImageFile(blob.pathname))
      .map(blob => ({
        id: blob.pathname,
        url: blob.url,
        // Optimized thumbnail: 400px width, quality 75, auto WebP/AVIF (production only)
        thumbnail: getOptimizedImageUrl(blob.url, 400),
        // Full size for lightbox (no optimization)
        fullSize: blob.url,
        filename: blob.pathname.split('/').pop()
      }));

    return res.status(200).json({
      show,
      photos,
      hasMore: result.hasMore || false,
      cursor: result.cursor || null,
      count: photos.length
    });

  } catch (error) {
    console.error('Error fetching photos:', error);
    return res.status(500).json({
      error: 'Failed to fetch photos',
      message: error.message
    });
  }
}

/**
 * Check if file is an image based on extension
 */
function isImageFile(pathname) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
  const ext = pathname.toLowerCase().slice(pathname.lastIndexOf('.'));
  return imageExtensions.includes(ext);
}

/**
 * Format show slug into readable name
 * Examples:
 *   "emo-2024-03-15" → "Emo - March 15, 2024"
 *   "llnm1-janelle" → "Louisville Loves Nu-Metal #1 - Janelle"
 *   "llnm1-vic" → "Louisville Loves Nu-Metal #1 - Vic"
 *   "lle2" → "Louisville Loves Emo #2"
 */
function formatShowName(slug) {
  const parts = slug.split('-');

  // Check for date-based format (e.g., "emo-2024-03-15")
  if (parts.length >= 4) {
    const [type, year, month, day] = parts;
    const date = new Date(`${year}-${month}-${day}`);

    if (!isNaN(date.getTime())) {
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      return `${typeName} - ${formattedDate}`;
    }
  }

  // Handle LLP show abbreviations (e.g., "llnm1", "lle2", "llnm1-janelle")
  const showAbbreviations = {
    'llnm': 'Louisville Loves Nu-Metal',
    'lle': 'Louisville Loves Emo',
    'llp': 'LLP Events'
  };

  // Extract show type, edition number, and photographer/descriptor
  // Matches: "llnm1" or "llnm1-janelle" or "lle2-photos"
  const match = slug.match(/^(llnm|lle|llp)(\d+)?(?:-(.+))?/i);

  if (match) {
    const showType = match[1].toLowerCase();
    const edition = match[2];
    const descriptor = match[3]; // photographer name, "photos", etc.
    const showName = showAbbreviations[showType];

    if (showName) {
      let formattedName = showName;

      // Add edition number if present
      if (edition) {
        formattedName += ` ${edition}`;
      }

      // Add photographer/descriptor if present (capitalize first letter)
      if (descriptor && descriptor !== 'photos') {
        const capitalizedDescriptor = descriptor.charAt(0).toUpperCase() + descriptor.slice(1);
        formattedName += ` - ${capitalizedDescriptor}`;
      }

      return formattedName;
    }
  }

  // Fallback: just capitalize and replace hyphens with spaces
  return slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
