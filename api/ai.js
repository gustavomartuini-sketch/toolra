// /api/ai.js — xAI proxy with Supabase rate limiting + abuse protection
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ── Supabase rate limit (logged-in users) ──────────────────────────────
async function getRateLimit(userId) {
  if (!userId) return null;
  const today = new Date().toISOString().split('T')[0];

  const r = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=tier,ai_requests_today,last_request_date,pro_expires_at`, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    }
  });
  const users = await r.json();
  let user = users[0];
  if (!user) return null;

  // Auto-downgrade expired Pro
  if (user.tier === 'pro' && user.pro_expires_at && new Date(user.pro_expires_at) < new Date()) {
    await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'free', pro_expires_at: null })
    });
    user.tier = 'free';
  }

  // Reset on new day
  if (user.last_request_date !== today) {
    await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ai_requests_today: 0, last_request_date: today })
    });
    user.ai_requests_today = 0;
  }

  const limit = user.tier === 'pro' ? 100 : 10;
  const current = user.ai_requests_today || 0;

  if (current >= limit) {
    return { allowed: false, current, limit, tier: user.tier };
  }

  // Increment before calling AI
  const newCount = current + 1;
  await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ai_requests_today: newCount, last_request_date: today })
  });

  return { allowed: true, current: newCount, limit, tier: user.tier };
}

// ── Guest abuse protection: IP + device fingerprint ────────────────────
// Uses in-memory store (resets on server restart, but Vercel functions are ephemeral anyway)
// For production scale: move to KV store (Vercel KV, Upstash, etc.)
const guestStore = new Map();

function checkGuestLimit(ip, deviceId) {
  const today = new Date().toISOString().split('T')[0];
  const GUEST_LIMIT = 3;

  // Check by IP
  const ipKey = `ip::${ip}::${today}`;
  const ipCount = guestStore.get(ipKey) || 0;
  if (ipCount >= GUEST_LIMIT) return { allowed: false, reason: 'ip' };

  // Check by device fingerprint (if provided)
  if (deviceId) {
    const devKey = `dev::${deviceId}::${today}`;
    const devCount = guestStore.get(devKey) || 0;
    if (devCount >= GUEST_LIMIT) return { allowed: false, reason: 'device' };
    guestStore.set(devKey, devCount + 1);
  }

  guestStore.set(ipKey, ipCount + 1);
  return { allowed: true, current: ipCount + 1, limit: GUEST_LIMIT };
}

// ── Main handler ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id, X-User-Token, X-Device-Id');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const userId   = req.headers['x-user-id'];
  const deviceId = req.headers['x-device-id']; // browser fingerprint
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

  let rateInfo = null;

  if (userId && SUPABASE_URL) {
    // Logged-in user — Supabase is source of truth
    rateInfo = await getRateLimit(userId);
    if (rateInfo && !rateInfo.allowed) {
      return res.status(429).json({
        error: 'rate_limit',
        message: rateInfo.tier === 'pro'
          ? `Pro limit reached (${rateInfo.limit}/day). Resets at midnight.`
          : `Daily limit reached (${rateInfo.limit}/day). Upgrade to Pro for 100/day.`,
        current: rateInfo.current,
        limit: rateInfo.limit
      });
    }
  } else {
    // Guest — IP + device fingerprint check
    const guestCheck = checkGuestLimit(ip, deviceId);
    if (!guestCheck.allowed) {
      return res.status(429).json({
        error: 'rate_limit',
        message: 'Sign up free for 10 requests/day, or upgrade to Pro for 100/day.',
        current: 3,
        limit: 3
      });
    }
    rateInfo = { current: guestCheck.current, limit: guestCheck.limit, tier: 'guest' };
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

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || '',
      usage: rateInfo ? rateInfo.current : null,
      limit: rateInfo ? rateInfo.limit : null,
      tier: rateInfo ? rateInfo.tier : null
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
