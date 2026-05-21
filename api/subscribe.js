
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: [5],
        updateEnabled: true
      })
    });

    if (response.status === 201) {
      return res.status(200).json({ success: true });
    } else if (response.status === 204) {
      return res.status(200).json({ success: true });
    } else {
      const data = await response.json();
      if (data.code === 'duplicate_parameter') {
        return res.status(200).json({ duplicate: true });
      }
      return res.status(400).json({ error: 'Failed to subscribe' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
