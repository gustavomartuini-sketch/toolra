# Toolra.ai — Deployment Guide

## Project Structure
```
toolra/
├── public/
│   └── index.html      ← Main app (all frontend)
├── api/
│   ├── ai.js           ← xAI proxy + rate limiting
│   └── currency.js     ← ExchangeRate API proxy
├── vercel.json         ← Routing config
└── .env.example        ← Environment variable template
```

## Deploy to Vercel (15 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial Toolra setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/toolra.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to vercel.com → Sign in with GitHub
2. Click "Add New Project"
3. Import your `toolra` repository
4. Click "Deploy" (no build settings needed)

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `XAI_API_KEY` | Your xAI API key from console.x.ai |
| `EXCHANGERATE_API_KEY` | Your key from exchangerate-api.com |

### 4. Add Custom Domain
1. Vercel → Settings → Domains → Add domain
2. Enter: `toolra.ai` (or your domain)
3. Add DNS records at your registrar:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`

## Rate Limiting
- Free users: 10 AI requests/day (tracked via localStorage + IP)
- Upgrading to Pro: set `PRO_SECRET` env var, pass as `X-Pro-Token` header

## Estimated Monthly Costs
| Service | Free tier | Paid |
|---------|-----------|------|
| Vercel | 100K req/month free | $20/mo (Pro) |
| xAI API | Pay per use | ~$0.0007/request |
| ExchangeRate | 1,500 req/month free | $10/mo |
| Domain | — | ~$14/year |

**Total MVP cost: ~$15-20/month**
**Break-even: 2 Pro subscribers ($12/mo each)**
