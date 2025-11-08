# Photo Album Management

Photo albums are managed through a combination of:
- **Vercel Blob Storage**: Stores the actual image files
- **PagesCMS**: Manages album metadata (name, date, photographer, etc.)

## How It Works

### Image Storage
All photos are stored in Vercel Blob Storage organized by album folders:
- `llnm1-janelle/` - Louisville Loves Nu-Metal 1 photos by Janelle
- `lle1-brandon/` - Louisville Loves Emo 1 photos by Brandon
- etc.

### Album Metadata
Album details (name, date, photographer, description) are stored in `data/albums.json` and managed through PagesCMS.

## Managing Albums with PagesCMS

### Setup
1. Go to [https://pagescms.org](https://pagescms.org)
2. Click "Log in with GitHub"
3. Select this repository: `zackpennington/llp-events`
4. PagesCMS will read the `pages.config.js` file automatically

### Adding a New Album

1. **Upload Photos to Vercel Blob Storage**
   - Go to Vercel dashboard → Storage → Blob
   - Create a new folder (e.g., `lle3-janelle`)
   - Upload photos to that folder

2. **Add Album Metadata via PagesCMS**
   - Log into PagesCMS
   - Click "Photo Albums" collection
   - Click "Add Album"
   - Fill in the fields:
     - **Album Slug**: Must match the folder name in Blob Storage (e.g., `lle3-janelle`)
     - **Album Name**: Display name (e.g., "Louisville Loves Emo 3")
     - **Event Date**: Date of the event (e.g., "2025-09-15")
     - **Photographer**: Name of photographer (optional)
     - **Description**: Short description (optional)
     - **Featured Album**: Check to show prominently
   - Click "Save"
   - PagesCMS will commit the changes to GitHub
   - Vercel will auto-deploy

### Editing Album Details

1. Log into PagesCMS
2. Click "Photo Albums"
3. Click on the album you want to edit
4. Update any fields
5. Click "Save"

### Album Fields

- **slug**: (Required) Must match Blob Storage folder name
- **name**: (Required) Display name shown on website
- **date**: (Required) Event date in YYYY-MM-DD format (used for sorting)
- **photographer**: (Optional) Photographer credit
- **description**: (Optional) Short description
- **featured**: (Optional) Whether to feature this album

## How the Website Uses This Data

The `/api/photos` endpoint:
1. Reads `data/albums.json` for metadata
2. Fetches photos from Vercel Blob Storage
3. Merges metadata with photo data
4. Returns albums sorted by date (most recent first)
5. Randomly selects a cover image from each album on each page load

## Manual Editing (Alternative)

If you prefer to edit `data/albums.json` directly:

```json
{
  "slug": "lle3-janelle",
  "name": "Louisville Loves Emo 3",
  "date": "2025-09-15",
  "photographer": "Janelle Choiniere",
  "description": "Third Louisville Loves Emo show",
  "featured": true
}
```

Then commit and push:
```bash
git add data/albums.json
git commit -m "Add LLE3 album"
git push
```

## Album Naming Convention

**Folder names (slugs):**
- Format: `{show}{number}-{photographer}`
- Examples: `llnm1-janelle`, `lle2-brandon`, `3cfar-janelle`

**Display names:**
- Format: `{Full Show Name} {Number}`
- Examples: "Louisville Loves Nu-Metal 1", "Louisville Loves Emo 2"

## Troubleshooting

**Album not showing on website:**
1. Check that the `slug` in albums.json matches the folder name in Blob Storage exactly
2. Verify photos were uploaded to Blob Storage
3. Check that deployment succeeded in Vercel

**Cover image not loading:**
- The API selects a random image from the folder on each page load
- If no images are found, coverImage will be null
- Check that images are in supported formats (.jpg, .jpeg, .png, .gif, .webp, .avif)
