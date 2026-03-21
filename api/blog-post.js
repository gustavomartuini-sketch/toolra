// /api/blog-post.js — AI-generated daily blog post
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { slug } = req.query;
  const KEY = process.env.XAI_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'API key not configured' });

  // Map slugs to topics
  const topics = {
    'how-to-merge-pdf-free': 'How to merge PDF files for free online without software',
    'compress-pdf-without-losing-quality': 'How to compress PDF files without losing quality',
    'ai-summarizer-productivity': 'How AI summarizers save hours every week for professionals',
    'pdf-to-jpg-guide': 'Complete guide to converting PDF pages to JPG images',
    'free-invoice-generator': 'How to create professional invoices for free online',
    'ai-email-writer-tips': 'Tips for writing better emails 10x faster with AI',
    'image-compression-guide': 'Complete guide to image compression without quality loss',
    'qr-code-generator-guide': 'Everything about QR codes in 2026 - creation and use cases',
    'crypto-pnl-calculator': 'How to calculate crypto P&L with hedge positions explained',
  };

  const topic = topics[slug];
  if (!topic) return res.status(404).json({ error: 'Post not found' });

  try {
    const r = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
      body: JSON.stringify({
        model: 'grok-3-mini',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Write a comprehensive, SEO-optimized blog post about: "${topic}". 
          
          Requirements:
          - Title (H1)
          - Introduction paragraph (engaging, 2-3 sentences)
          - 4-5 sections with H2 headings
          - Each section 2-3 paragraphs
          - Include practical tips and actionable advice
          - Mention Toolra.app where relevant as the free tool to use
          - End with a clear call to action to try the tool
          - Tone: helpful, clear, professional but friendly
          - Length: 600-800 words
          
          Return as clean HTML (only body content, no html/head/body tags). Use <h1>, <h2>, <p>, <ul>, <li>, <strong> tags only.`
        }]
      })
    });
    const data = await r.json();
    const html = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ html, slug, topic });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
