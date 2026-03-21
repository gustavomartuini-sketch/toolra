// /api/auth.js — Auth + Pro expiry enforcement

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function dbService(endpoint, options = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {}),
    },
  });
  return r.json();
}

async function supabaseAuth(endpoint, body) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

// Check if pro has expired and downgrade if needed
async function checkAndDowngradePro(userId) {
  const users = await dbService(`users?id=eq.${userId}&select=tier,pro_expires_at`);
  const user = users[0];
  if (!user) return null;

  // If Pro but expired → downgrade to Free
  if (user.tier === 'pro' && user.pro_expires_at) {
    const expiry = new Date(user.pro_expires_at);
    if (expiry < new Date()) {
      await dbService(`users?id=eq.${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ tier: 'free', pro_expires_at: null })
      });
      console.log(`User ${userId} Pro expired — downgraded to Free`);
      return { ...user, tier: 'free', pro_expires_at: null };
    }
  }
  return user;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.body || req.query || {};

  // REGISTER
  if (action === 'register') {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const data = await supabaseAuth('signup', { email, password });
    if (data.error) return res.status(400).json({ error: data.error.message });
    return res.status(200).json({
      user: { id: data.user?.id, email: data.user?.email },
      token: data.access_token,
      message: 'Check your email to confirm your account'
    });
  }

  // LOGIN
  if (action === 'login') {
    const { email, password } = req.body;
    const data = await supabaseAuth('token?grant_type=password', { email, password });
    if (data.error) return res.status(401).json({ error: 'Incorrect email or password' });

    // Check & downgrade if Pro expired
    const userProfile = await checkAndDowngradePro(data.user.id) || { tier: 'free' };

    return res.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        tier: userProfile.tier,
        pro_expires_at: userProfile.pro_expires_at
      },
      token: data.access_token,
      refresh_token: data.refresh_token,
    });
  }

  // ACTIVATE PRO TOKEN
  if (action === 'upgrade') {
    const { userId, token: proToken } = req.body;
    if (!userId || !proToken) return res.status(400).json({ error: 'Missing fields' });

    // Validate token
    const tokens = await dbService(`pro_tokens?token=eq.${proToken}&used=eq.false&select=*`);
    if (!tokens.length) return res.status(400).json({ error: 'Invalid or already used token' });

    const tokenData = tokens[0];

    // Set pro_expires_at = 31 days from now
    const expiresAt = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();

    // Upgrade user
    await dbService(`users?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        tier: 'pro',
        upgraded_at: new Date().toISOString(),
        pro_expires_at: expiresAt
      })
    });

    // Mark token used
    await dbService(`pro_tokens?token=eq.${proToken}`, {
      method: 'PATCH',
      body: JSON.stringify({ used: true, used_at: new Date().toISOString(), used_by: userId })
    });

    return res.status(200).json({
      success: true,
      tier: 'pro',
      pro_expires_at: expiresAt,
      message: `Pro active until ${new Date(expiresAt).toLocaleDateString('en', { year:'numeric', month:'long', day:'numeric' })}`
    });
  }

  // CHECK EXPIRY (called on each AI request)
  if (action === 'check-expiry') {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });

    const token = authHeader.replace('Bearer ', '');
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${token}` }
    });
    const userData = await userRes.json();
    if (!userData.id) return res.status(401).json({ error: 'Invalid token' });

    const user = await checkAndDowngradePro(userData.id);
    return res.status(200).json({
      tier: user?.tier || 'free',
      pro_expires_at: user?.pro_expires_at || null
    });
  }

  // GET PROFILE — used by frontend after login/restore to get tier with service key
  if (action === 'getProfile') {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const userProfile = await checkAndDowngradePro(userId);
    if (!userProfile) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({
      tier: userProfile.tier || 'free',
      pro_expires_at: userProfile.pro_expires_at || null
    });
  }

  return res.status(400).json({ error: 'Invalid action' });
}
