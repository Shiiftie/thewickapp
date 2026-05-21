export default async function handler(req, res) {
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
      return res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } else if (response.status === 204) {
      return res.status(204).json({ success: true, message: 'Contact updated' });
    } else {
      const data = await response.json();
      if (data.code === 'duplicate_parameter') {
        return res.status(400).json({ error: 'duplicate', message: 'Already subscribed' });
      }
      return res.status(400).json({ error: 'Failed to subscribe' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
