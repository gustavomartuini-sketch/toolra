// /api/webhook-crypto.js — order_id=userId, direkt Pro yap
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function dbService(endpoint, options = {}) {
  const r = await fetch(SUPABASE_URL + '/rest/v1/' + endpoint, {
    ...options,
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {}),
    },
  });
  return r.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { payment_status, order_id, payment_id, price_amount } = req.body || {};
  console.log('Webhook:', payment_status, order_id);

  if (!['finished', 'confirmed', 'partially_paid'].includes(payment_status)) {
    return res.status(200).json({ status: 'ignored', payment_status });
  }

  const userId = order_id;
  if (!userId) return res.status(400).json({ error: 'No userId in order_id' });

  const expiresAt = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();

  try {
    await dbService('users?id=eq.' + userId, {
      method: 'PATCH',
      body: JSON.stringify({ tier: 'pro', pro_expires_at: expiresAt, upgraded_at: new Date().toISOString() }),
    });
    console.log('✅ Upgraded user', userId, 'to Pro until', expiresAt);
    return res.status(200).json({ status: 'ok', userId, pro_expires_at: expiresAt });
  } catch (e) {
    console.error('Webhook error:', e);
    return res.status(500).json({ error: e.message });
  }
}