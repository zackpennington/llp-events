// Vercel Serverless Function for Contact Form with Turnstile Protection
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, turnstileToken } = req.body;

    // Validate required fields
    if (!name || !email || !message || !turnstileToken) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' });
    }

    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message is too long (max 5000 characters)' });
    }

    const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!TURNSTILE_SECRET_KEY || !RESEND_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error. Please contact support.' });
    }

    // Verify Turnstile token
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: turnstileToken
      })
    });

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      return res.status(400).json({ error: 'Verification failed. Please try again.' });
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'LLP Events Contact Form <noreply@mail.llp-events.com>',
        to: 'info@llp-events.com',
        reply_to: email,
        subject: `Contact Form: ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #000000;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border: 2px solid rgba(176, 33, 42, 0.3); border-radius: 8px;">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(176, 33, 42, 0.2);">
                        <h1 style="margin: 0; color: #b0212a; font-family: Impact, 'Haettenschweiler', 'Arial Black', sans-serif; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">
                          NEW CONTACT FORM SUBMISSION
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                              <strong style="color: #b0212a; font-size: 14px; text-transform: uppercase;">Name:</strong><br>
                              <span style="color: #e0e0e0; font-size: 16px;">${name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                              <strong style="color: #b0212a; font-size: 14px; text-transform: uppercase;">Email:</strong><br>
                              <a href="mailto:${email}" style="color: #e0e0e0; font-size: 16px; text-decoration: none;">${email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0;">
                              <strong style="color: #b0212a; font-size: 14px; text-transform: uppercase;">Message:</strong><br>
                              <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6; margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(176, 33, 42, 0.2);">
                        <p style="margin: 0; color: #888888; font-size: 14px;">
                          Submitted from llp-events.com contact form
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({
        error: 'Failed to send message. Please try again.',
        details: data
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'An error occurred. Please try again.',
      details: error.message
    });
  }
}
