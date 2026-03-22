// /api/ai.js — xAI proxy with Supabase-based rate limiting
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function getRateLimit(userId, userToken) {
  // If no userId, fall back to IP-based limit (for non-logged-in users)
  if (!userId) return null;

  const today = new Date().toISOString().split('T')[0];

  // Get user from Supabase (also check pro expiry)
  const r = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=tier,ai_requests_today,last_request_date,pro_expires_at`, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    }
  });
  const users = await r.json();
  let user = users[0];

  if (!user) return null;

  // Check if Pro has expired — downgrade to Free
  if (user.tier === 'pro' && user.pro_expires_at) {
    const expiry = new Date(user.pro_expires_at);
    if (expiry < new Date()) {
      await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: 'free', pro_expires_at: null })
      });
      user.tier = 'free';
      user.pro_expires_at = null;
      console.log(`User ${userId} Pro expired — auto-downgraded`);
    }
  }

  // Reset if new day
  if (user.last_request_date !== today) {
    await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ai_requests_today: 0, last_request_date: today })
    });
    user.ai_requests_today = 0;
    user.last_request_date = today;
  }

  const limit = user.tier === 'pro' ? 100 : 10;

  if (user.ai_requests_today >= limit) {
    return { allowed: false, current: user.ai_requests_today, limit, tier: user.tier };
  }

  // Increment usage
  await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ai_requests_today: user.ai_requests_today + 1, last_request_date: today })
  });

  return { allowed: true, current: user.ai_requests_today + 1, limit, tier: user.tier };
}

// Simple in-memory IP fallback (for guests)
const ipStore = new Map();
function checkIpLimit(ip) {
  const today = new Date().toISOString().split('T')[0];
  const key = `${ip}::${today}`;
  const count = ipStore.get(key) || 0;
  if (count >= 3) return false; // guests get 3 requests
  ipStore.set(key, count + 1);
  return true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id, X-User-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const userId = req.headers['x-user-id'];
  const userToken = req.headers['x-user-token'];
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';

  // Rate limit check
  if (userId && SUPABASE_URL) {
    const rateCheck = await getRateLimit(userId, userToken);
    if (rateCheck && !rateCheck.allowed) {
      return res.status(429).json({
        error: 'rate_limit',
        message: rateCheck.tier === 'pro'
          ? `Pro limit reached (${rateCheck.limit}/day). Contact support.`
          : `Daily limit reached (${rateCheck.limit}/day). Upgrade to Pro for 100 requests/day.`,
        current: rateCheck.current,
        limit: rateCheck.limit
      });
    }
  } else {
    // Guest: IP-based limit (3/day)
    if (!checkIpLimit(ip)) {
      return res.status(429).json({
        error: 'rate_limit',
        message: 'Sign up for free to get 10 requests/day, or upgrade to Pro for 100/day.',
        current: 3,
        limit: 3
      });
    }
  }

  const { prompt, max_tokens = 1200 } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const XAI_KEY = process.env.XAI_API_KEY;
  if (!XAI_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${XAI_KEY}` },
      body: JSON.stringify({ model: 'grok-3-mini', max_tokens, messages: [{ role: 'user', content: prompt }] })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'AI error' });
    const usageCount = rateCheck ? rateCheck.current : null;
    const usageLimit = rateCheck ? rateCheck.limit : null;
    return res.status(200).json({ result: data.choices?.[0]?.message?.content || '', usage: usageCount, limit: usageLimit });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
