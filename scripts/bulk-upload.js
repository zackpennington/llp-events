require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const BASE = '/Users/zack/Library/CloudStorage/GoogleDrive-zackpennington@gmail.com/My Drive/LLP Events/Images and Videos/LLE8:LLNM3';

const albums = [
  { album: 'lle8-corey', paths: [`${BASE}/Corey Nicholson @bycoreyn`] },
  { album: 'lle8-jake', paths: [`${BASE}/Jake Badger @badger_entertainment/LLE8`] },
  { album: 'lle8-janelle', paths: [`${BASE}/Janelle Choiniere @janelleno5/LLE8`] },
  { album: 'lle8-shelby', paths: [`${BASE}/Shelby Osborne @picsnriffs/LLE8`] },
  { album: 'llnm3-hunter', paths: [`${BASE}/Hunter O'Dell @odell_productions/SHOW PHOTOS`] },
  { album: 'llnm3-jake', paths: [`${BASE}/Jake Badger @badger_entertainment/LLNM3 `] },
  {
    album: 'llnm3-janelle',
    paths: [
      `${BASE}/Janelle Choiniere @janelleno5/LLNM3/Crowd`,
      `${BASE}/Janelle Choiniere @janelleno5/LLNM3/KY Hop Water & Bourbon`,
      `${BASE}/Janelle Choiniere @janelleno5/LLNM3/Show`,
    ],
  },
  { album: 'llnm3-shelby', paths: [`${BASE}/Shelby Osborne @picsnriffs/LLNM3`] },
];

const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

function getImages(dirs) {
  const files = [];
  for (const dir of dirs) {
    for (const f of fs.readdirSync(dir)) {
      if (IMAGE_RE.test(f)) files.push(path.join(dir, f));
    }
  }
  return files;
}

async function uploadAlbum({ album, paths }) {
  const files = getImages(paths);
  console.log(`\n=== ${album}: ${files.length} photos ===`);
  let uploaded = 0;
  let errors = 0;

  for (const filePath of files) {
    const filename = path.basename(filePath).toLowerCase();
    try {
      const data = fs.readFileSync(filePath);
      await put(`${album}/${filename}`, data, { access: 'public' });
      uploaded++;
      if (uploaded % 25 === 0 || uploaded === files.length) {
        console.log(`  [${album}] ${uploaded}/${files.length}`);
      }
    } catch (err) {
      errors++;
      console.error(`  [${album}] FAILED: ${filename} - ${err.message}`);
    }
  }

  console.log(`  [${album}] Done: ${uploaded} uploaded, ${errors} errors`);
  return { album, uploaded, errors };
}

(async () => {
  const startAlbum = process.argv[2];
  let toUpload = albums;

  if (startAlbum) {
    const idx = albums.findIndex(a => a.album === startAlbum);
    if (idx === -1) {
      console.error(`Album "${startAlbum}" not found. Available: ${albums.map(a => a.album).join(', ')}`);
      process.exit(1);
    }
    toUpload = albums.slice(idx);
    console.log(`Resuming from ${startAlbum}...`);
  }

  const totalFiles = toUpload.reduce((sum, a) => sum + getImages(a.paths).length, 0);
  console.log(`Uploading ${totalFiles} photos across ${toUpload.length} albums...\n`);

  const results = [];
  for (const album of toUpload) {
    results.push(await uploadAlbum(album));
  }

  console.log('\n=== SUMMARY ===');
  let totalUploaded = 0;
  let totalErrors = 0;
  for (const r of results) {
    console.log(`  ${r.album}: ${r.uploaded} uploaded, ${r.errors} errors`);
    totalUploaded += r.uploaded;
    totalErrors += r.errors;
  }
  console.log(`\nTotal: ${totalUploaded} uploaded, ${totalErrors} errors`);
})();
