import { list } from '@vercel/blob';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

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

            // Fetch first image from this folder as cover
            const folderContents = await list({
              prefix: folder,
              limit: 10
            });

            // Filter to get only image files (not folders)
            const imageBlobs = folderContents.blobs.filter(blob =>
              isImageFile(blob.pathname) && !blob.pathname.endsWith('/')
            );
            const firstImage = imageBlobs[0];

            return {
              slug: showSlug,
              name: formatShowName(showSlug),
              path: folder,
              coverImage: firstImage
                ? `/_vercel/image?url=${encodeURIComponent(firstImage.url)}&w=400&q=80`
                : null
            };
          })
      );

      return res.status(200).json({ albums: albumsWithCovers });
    }

    // List photos for specific show
    const result = await list({
      prefix: `${show}/`,
      limit: 100,
      cursor: cursor || undefined
    });

    // Transform blobs to optimized photo objects
    // Always use Vercel Image API for optimization
    const photos = result.blobs
      .filter(blob => isImageFile(blob.pathname))
      .map(blob => ({
        id: blob.pathname,
        url: blob.url,
        // Vercel Image API will optimize images on-the-fly
        // 640px thumbnails for grid, 1920px for lightbox
        thumbnail: `/_vercel/image?url=${encodeURIComponent(blob.url)}&w=640&q=75`,
        fullSize: `/_vercel/image?url=${encodeURIComponent(blob.url)}&w=1920&q=85`,
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
