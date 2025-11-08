export default {
  title: 'LLP Events',
  description: 'Content management for LLP Events website',

  // GitHub repository configuration
  // Will be auto-detected from .git folder

  collections: [
    {
      name: 'albums',
      label: 'Photo Albums',
      description: 'Manage photo album metadata (images stored in Vercel Blob Storage)',
      path: 'data/albums.json',
      type: 'data',
      format: 'json',
      fields: [
        {
          name: 'slug',
          label: 'Album Slug',
          type: 'string',
          description: 'Must match the folder name in Vercel Blob Storage (e.g., llnm1-janelle)',
          required: true
        },
        {
          name: 'name',
          label: 'Album Name',
          type: 'string',
          description: 'Display name for the album (e.g., Louisville Loves Nu-Metal 1)',
          required: true
        },
        {
          name: 'date',
          label: 'Event Date',
          type: 'date',
          description: 'Date of the event (YYYY-MM-DD)',
          required: true
        },
        {
          name: 'photographer',
          label: 'Photographer',
          type: 'string',
          description: 'Name of the photographer',
          required: false
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          description: 'Short description of the event/album',
          required: false
        },
        {
          name: 'featured',
          label: 'Featured Album',
          type: 'boolean',
          description: 'Show this album prominently on the photos page',
          default: true
        }
      ]
    }
  ]
}
