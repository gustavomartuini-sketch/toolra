// /api/webhook-crypto.js — NowPayments webhook
// Sets pro_expires_at = NOW() + 31 days on successful payment

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function db(endpoint, options = {}) {
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
  return r;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { payment_status, price_amount, pay_currency, order_id, payment_id } = req.body || {};

  // Only process finished/confirmed payments
  if (!['finished', 'confirmed'].includes(payment_status)) {
    return res.status(200).json({ status: 'ignored', payment_status });
  }

  // Generate pro token
  const crypto = await import('crypto');
  const token = crypto.randomBytes(16).toString('hex').toUpperCase();

  // Set expiry = 31 days from now
  const expiresAt = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();

  // Store token in pro_tokens table
  await db('pro_tokens', {
    method: 'POST',
    body: JSON.stringify({
      token,
      payment_id: payment_id || order_id,
      amount: price_amount,
      created_at: new Date().toISOString(),
      expires_at: expiresAt
    })
  });

  console.log(`Pro token created: ${token} | expires: ${expiresAt} | payment: ${payment_id}`);

  return res.status(200).json({ status: 'ok', token, expires_at: expiresAt });
}
