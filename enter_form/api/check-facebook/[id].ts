import axios from 'axios';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const setCors = (res: VercelResponse) => {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
};

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing Facebook ID' });
  }

  try {
    const response = await axios.get(`https://www.facebook.com/${id}`, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (response.status === 200) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false, status: response.status });
  } catch (error: any) {
    if (error.response?.status === 404) {
      return res.json({ exists: false });
    }

    const status = error.response?.status;

    return res.json({
      exists: true,
      message:
        status === 302
          ? 'Facebook usually redirects to login when public profiles are hit from server environments.'
          : 'Could not verify definitively.',
      status,
    });
  }
}
