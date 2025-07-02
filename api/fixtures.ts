import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = '11cb8225-0dfc-494e-a48b-32957bbd2887';
const API_URL = 'https://api.cricapi.com/v1/currentMatches?apikey=' + API_KEY + '&offset=0';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch fixtures' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error });
  }
} 