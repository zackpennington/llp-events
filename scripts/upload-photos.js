const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const folder = process.argv[2];
const album = process.argv[3];

if (!folder || !album) {
  console.error('Usage: node scripts/upload-photos.js <folder> <album-name>');
  console.error('Example: node scripts/upload-photos.js ./my-photos lle3-janelle');
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
  process.exit(1);
}

(async () => {
  const files = fs.readdirSync(folder).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f));

  if (files.length === 0) {
    console.error(`No image files found in ${folder}`);
    process.exit(1);
  }

  console.log(`Uploading ${files.length} photos to ${album}/...\n`);

  let uploaded = 0;
  for (const file of files) {
    const data = fs.readFileSync(path.join(folder, file));
    const { url } = await put(`${album}/${file}`, data, { access: 'public' });
    uploaded++;
    console.log(`[${uploaded}/${files.length}] ${file} → ${url}`);
  }

  console.log(`\nDone! Uploaded ${uploaded} photos to ${album}/`);
})();
