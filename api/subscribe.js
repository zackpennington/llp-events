// Vercel Serverless Function for Resend Email Subscription
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_hXPa4tzc_52JYJG8SNr8YFAccouGS7mS4';

    // Send welcome email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'LLP Events <noreply@llpevents.com>',
        to: email,
        subject: 'Welcome to LLP Events! 🎸',
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
                        <h1 style="margin: 0; color: #ffffff; font-family: Impact, 'Haettenschweiler', 'Arial Black', sans-serif; font-size: 36px; letter-spacing: 2px; text-transform: uppercase;">
                          LLP EVENTS
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #b0212a; font-family: Impact, 'Haettenschweiler', 'Arial Black', sans-serif; font-size: 28px; text-transform: uppercase; letter-spacing: 1px;">
                          WELCOME TO THE MOSH PIT!
                        </h2>
                        <p style="margin: 0 0 20px 0; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                          Thanks for joining the LLP Events mailing list! You're now in the know for:
                        </p>
                        <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #e0e0e0; font-size: 16px; line-height: 1.8;">
                          <li>Concert announcements & presale access</li>
                          <li>Exclusive merch drops</li>
                          <li>Contests & giveaways</li>
                          <li>Band applications & more</li>
                        </ul>
                        <p style="margin: 0 0 30px 0; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                          Get ready for Louisville's most explosive concerts featuring <strong style="color: #b0212a;">Louisville Loves Emo</strong> and <strong style="color: #b0212a;">Louisville Loves Nu-Metal</strong>!
                        </p>

                        <!-- CTA Button -->
                        <table role="presentation" style="margin: 0 auto;">
                          <tr>
                            <td style="border-radius: 6px; background: #b0212a;">
                              <a href="https://llp-events.vercel.app" style="display: inline-block; padding: 15px 40px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px; letter-spacing: 1px; text-transform: uppercase;">
                                VIEW UPCOMING SHOWS
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(176, 33, 42, 0.2);">
                        <p style="margin: 0 0 10px 0; color: #888888; font-size: 14px;">
                          © 2025 LLP Events. Louisville, KY.
                        </p>
                        <p style="margin: 0; color: #666666; font-size: 12px;">
                          You're receiving this because you signed up for the LLP Events mailing list.
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
        error: 'Failed to subscribe. Please try again.',
        details: data
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed!'
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      error: 'An error occurred. Please try again.',
      details: error.message
    });
  }
}
