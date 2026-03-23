// /api/ai.js — xAI proxy with Supabase rate limiting + Upstash Redis abuse protection
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://certain-bee-82490.upstash.io';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAUI6AAIncDFiM2U3N2EwODQwYWM0NWViYWU2YzRkMTUwN2E3YTNkOXAxODI0OTA';

// ── Upstash Redis helpers ───────────────────────────────────────────
async function redisCmd(...args) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const r = await fetch(`${UPSTASH_URL}/${args.join('/')}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const d = await r.json();
    return d.result;
  } catch { return null; }
}

async function redisIncr(key) {
  return redisCmd('INCR', encodeURIComponent(key));
}

async function redisExpire(key, seconds) {
  return redisCmd('EXPIRE', encodeURIComponent(key), seconds);
}

async function redisGet(key) {
  return redisCmd('GET', encodeURIComponent(key));
}

// ── Guest abuse check (IP + device fingerprint via Redis) ────────────
async function checkGuestAbuse(ip, deviceId) {
  const LIMIT = 3;
  const today = new Date().toISOString().split('T')[0];
  const secondsUntilMidnight = 86400 - (Math.floor(Date.now() / 1000) % 86400);

  // Check IP
  const ipKey = `guest:ip:${ip}:${today}`;
  const ipCount = await redisIncr(ipKey);
  if (ipCount === 1) await redisExpire(ipKey, secondsUntilMidnight);
  if (ipCount > LIMIT) return { allowed: false, reason: 'ip_limit' };

  // Check device fingerprint
  if (deviceId && deviceId.length > 5) {
    const devKey = `guest:dev:${deviceId}:${today}`;
    const devCount = await redisIncr(devKey);
    if (devCount === 1) await redisExpire(devKey, secondsUntilMidnight + 86400); // keep 2 days
    if (devCount > LIMIT) return { allowed: false, reason: 'device_limit' };
  }

  return { allowed: true, current: ipCount, limit: LIMIT };
}

// Fallback in-memory (when Redis not configured)
const memStore = new Map();
function checkGuestMemory(ip, deviceId) {
  const today = new Date().toISOString().split('T')[0];
  const LIMIT = 3;
  for (const key of [`ip:${ip}:${today}`, `dev:${deviceId}:${today}`]) {
    if (!key.includes('undefined')) {
      const n = (memStore.get(key) || 0) + 1;
      memStore.set(key, n);
      if (n > LIMIT) return { allowed: false };
    }
  }
  return { allowed: true, current: 1, limit: LIMIT };
}

// ── Supabase rate limit (logged-in users) ──────────────────────────
async function getRateLimit(userId) {
  if (!userId) return null;
  const today = new Date().toISOString().split('T')[0];

  const r = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=tier,ai_requests_today,last_request_date,pro_expires_at`, {
    headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
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
  if (current >= limit) return { allowed: false, current, limit, tier: user.tier };

  const newCount = current + 1;
  await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ai_requests_today: newCount, last_request_date: today })
  });

  return { allowed: true, current: newCount, limit, tier: user.tier };
}

// ── Main handler ──────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id, X-User-Token, X-Device-Id');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const userId   = req.headers['x-user-id'];
  const deviceId = req.headers['x-device-id'];
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

  let rateInfo = null;

  if (userId && SUPABASE_URL) {
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
    // Guest — use Redis if available, else in-memory
    const guestCheck = UPSTASH_URL
      ? await checkGuestAbuse(ip, deviceId)
      : checkGuestMemory(ip, deviceId);

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
      usage: rateInfo?.current ?? null,
      limit: rateInfo?.limit ?? null,
      tier: rateInfo?.tier ?? null
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
