import axios from 'axios';
import queryString from 'query-string';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
      }

      const clientId = process.env.ZOOM_CLIENT_ID;
      const clientSecret = process.env.ZOOM_CLIENT_SECRET;
      const redirectUri = process.env.ZOOM_REDIRECT_URI;

      if (!clientId || !clientSecret || !redirectUri) {
        return res.status(500).json({ error: 'Zoom credentials not configured' });
      }

      // Exchange code for token
      const response = await axios.post('https://zoom.us/oauth/token', 
        queryString.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
          }
        }
      );

      const { access_token, refresh_token, expires_in } = response.data;

      // Return only the access token to the client
      // Store refresh token securely (you might want to store this in a database)
      res.status(200).json({
        access_token,
        expires_in,
        token_type: 'Bearer'
      });

    } catch (error) {
      console.error('Zoom OAuth error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: 'Failed to exchange authorization code for token',
        details: error.response?.data || error.message
      });
    }
  } else if (req.method === 'GET') {
    // Generate authorization URL
    const clientId = process.env.ZOOM_CLIENT_ID;
    const redirectUri = process.env.ZOOM_REDIRECT_URI;
    const scope = encodeURIComponent('meeting:read meeting:write recording:read user:read');
    
    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    
    res.status(200).json({ authUrl });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 