// /api/subscribe.js — NowPayments invoice with userId in order_id
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.NOWPAYMENTS_API_KEY || 'TVSX2QD-GZK4WH1-J4FCJEV-63W29PW';
  const { userId, userEmail } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const origin = req.headers.origin || 'https://toolra.app';
  try {
    const r = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price_amount: 12,
        price_currency: 'usd',
        pay_currency: 'usdttrc20',
        order_id: userId,
        order_description: 'Toolra Pro | user:' + userId,
        success_url: origin + '/pro-success?uid=' + userId,
        cancel_url: origin,
        is_fixed_rate: false,
        is_fee_paid_by_user: false,
      }),
    });
    const data = await r.json();
    if (!data.invoice_url) return res.status(400).json({ error: data.message || 'Failed' });
    return res.status(200).json({ url: data.invoice_url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}