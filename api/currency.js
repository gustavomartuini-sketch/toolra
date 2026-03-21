// /api/currency.js — ExchangeRate proxy
// Environment variables needed: EXCHANGERATE_API_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const base = req.query.base || 'USD';

  if (!process.env.EXCHANGERATE_API_KEY) {
    return res.status(500).json({ error: 'Exchange rate API key not configured' });
  }

  try {
    const r = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_API_KEY}/latest/${base}`
    );
    const data = await r.json();
    if (data.result !== 'success') throw new Error(data['error-type'] || 'API error');

    // Cache header — rates valid for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({
      base,
      rates: data.conversion_rates,
      updated: data.time_last_update_utc,
    });
  } catch (err) {
    // Fallback rates if API fails
    const fallback = {
      USD:1, EUR:0.92, GBP:0.79, TRY:33.5, AED:3.67,
      HUF:365, JPY:149, CHF:0.88, SAR:3.75, RUB:89,
      CAD:1.36, AUD:1.53, CNY:7.24, INR:83.5, SGD:1.34,
      BTC:0.0000148, ETH:0.000485,
    };
    return res.status(200).json({ base, rates: fallback, updated: 'fallback', error: err.message });
  }
}
