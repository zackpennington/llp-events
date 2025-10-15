# LLP Events Deployment Guide

## Environment Variables

This project uses Resend for email subscriptions. You need to configure the following environment variable:

### Local Development

Create a `.env` file in the root directory:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

### Vercel Deployment

Add the environment variable in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** Your Resend API key
   - **Environment:** Production, Preview, Development

## API Endpoints

### POST /api/subscribe

Subscribes a user to the mailing list via Resend.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Successfully subscribed!"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message here"
}
```

## Testing Locally

To test the newsletter form locally with Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Run local development server with serverless functions
vercel dev
```

This will start a local server (usually on port 3000) that supports the serverless functions.

## Resend Configuration

1. Sign up for Resend at https://resend.com
2. Get your API key from the dashboard
3. **Important:** Update the `from` email in `/api/subscribe.js` to use your verified domain:
   ```javascript
   from: 'LLP Events <noreply@yourdomain.com>'
   ```
4. Verify your domain in Resend dashboard for production use

## Email Template

The welcome email template is located in `/api/subscribe.js`. Customize the HTML content to match your branding.

## Security Notes

- Never commit the `.env` file to version control
- The API key is included in the serverless function as a fallback, but should be removed before production
- Use Vercel environment variables for production deployment
