// /api/subscribe.js — NowPayments subscription checkout
// Creates a payment link for the Pro subscription

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.NOWPAYMENTS_API_KEY || 'TVSX2QD-GZK4WH1-J4FCJEV-63W29PW';
  const PLAN_ID = '693338432';

  try {
    // Create subscription payment link
    const r = await fetch('https://api.nowpayments.io/v1/sub-partner/payment', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription_id: PLAN_ID,
        pay_currency: 'usdttrc20', // default USDT TRC20
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      // Try invoice endpoint as fallback
      const r2 = await fetch('https://api.nowpayments.io/v1/invoice', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_amount: 12,
          price_currency: 'usd',
          pay_currency: 'usdttrc20',
          order_description: 'Toolra Pro Monthly Subscription',
          success_url: `${req.headers.origin || 'https://toolra.app'}/pro-success`,
          cancel_url: `${req.headers.origin || 'https://toolra.app'}`,
          is_fixed_rate: false,
          is_fee_paid_by_user: false,
        }),
      });
      const data2 = await r2.json();
      if (data2.invoice_url) {
        return res.status(200).json({ url: data2.invoice_url, type: 'invoice' });
      }
      return res.status(400).json({ error: data2.message || 'Failed to create payment' });
    }

    return res.status(200).json({ url: data.payment_url || data.invoice_url, type: 'subscription' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
