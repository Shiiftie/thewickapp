export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts/lists/5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      }
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({ count: data.totalSubscribers || 0 });
    } else {
      return res.status(200).json({ count: 0 });
    }
  } catch (err) {
    return res.status(200).json({ count: 0 });
  }
}
