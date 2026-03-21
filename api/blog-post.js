// /api/blog-post.js — Static SEO blog content for all 107 tools

const posts = {
  // Doc Converters
  'word-to-pdf': { title: 'How to Convert Word to PDF Free Online', category: 'Doc Converters', tool: 'Word to PDF', desc: 'Convert Word documents to PDF instantly in your browser — no install needed.' },
  'excel-to-pdf': { title: 'How to Convert Excel to PDF Free Online', category: 'Doc Converters', tool: 'Excel to PDF', desc: 'Convert Excel spreadsheets to PDF format while keeping formatting perfectly intact.' },
  'ppt-to-pdf': { title: 'How to Convert PowerPoint to PDF Free Online', category: 'Doc Converters', tool: 'PowerPoint to PDF', desc: 'Convert .pptx presentations to PDF in seconds — no PowerPoint needed.' },
  'pdf-to-excel': { title: 'How to Convert PDF to Excel Free Online', category: 'Doc Converters', tool: 'PDF to Excel', desc: 'Extract tables and data from PDF files to Excel spreadsheet instantly.' },
  'pdf-to-ppt': { title: 'How to Convert PDF to PowerPoint Free Online', category: 'Doc Converters', tool: 'PDF to PowerPoint', desc: 'Turn PDF slides into editable PowerPoint presentations.' },
  'html-to-pdf': { title: 'How to Convert HTML to PDF Free Online', category: 'Doc Converters', tool: 'HTML to PDF', desc: 'Convert HTML files and web content to PDF documents instantly.' },
  'md-to-pdf': { title: 'How to Convert Markdown to PDF Free Online', category: 'Doc Converters', tool: 'Markdown to PDF', desc: 'Convert .md Markdown files to clean, professional PDF documents.' },
  'epub-to-pdf': { title: 'How to Convert EPUB to PDF Free Online', category: 'Doc Converters', tool: 'EPUB to PDF', desc: 'Convert e-books from EPUB format to PDF for easy reading anywhere.' },
  'csv-to-excel': { title: 'How to Convert CSV to Excel Free Online', category: 'Doc Converters', tool: 'CSV to Excel', desc: 'Open and convert CSV files to .xlsx Excel format instantly.' },
  'excel-to-csv': { title: 'How to Convert Excel to CSV Free Online', category: 'Doc Converters', tool: 'Excel to CSV', desc: 'Export Excel spreadsheet data to CSV format for universal compatibility.' },
  'txt-to-pdf': { title: 'How to Convert TXT to PDF Free Online', category: 'Doc Converters', tool: 'TXT to PDF', desc: 'Convert plain text files to formatted PDF documents in one click.' },
  'rtf-to-pdf': { title: 'How to Convert RTF to PDF Free Online', category: 'Doc Converters', tool: 'RTF to PDF', desc: 'Convert Rich Text Format files to PDF instantly in your browser.' },
  // PDF Tools
  'merge-pdf': { title: 'How to Merge PDF Files Free Online', category: 'PDF Tools', tool: 'Merge PDF', desc: 'Combine multiple PDF files into one document in seconds — no upload to servers.' },
  'split-pdf': { title: 'How to Split PDF Free Online', category: 'PDF Tools', tool: 'Split PDF', desc: 'Extract specific pages or split a PDF into separate files instantly.' },
  'compress-pdf': { title: 'How to Compress PDF Free Online', category: 'PDF Tools', tool: 'Compress PDF', desc: 'Reduce PDF file size without losing quality — up to 80% smaller files.' },
  'rotate-pdf': { title: 'How to Rotate PDF Pages Free Online', category: 'PDF Tools', tool: 'Rotate PDF', desc: 'Fix PDF orientation by rotating pages 90°, 180°, or 270°.' },
  'pdf-to-jpg': { title: 'How to Convert PDF to JPG Free Online', category: 'PDF Tools', tool: 'PDF to JPG', desc: 'Convert every PDF page to high-quality JPG images instantly.' },
  'jpg-to-pdf': { title: 'How to Convert JPG to PDF Free Online', category: 'PDF Tools', tool: 'JPG to PDF', desc: 'Turn JPG images into a single PDF document in one click.' },
  'pdf-watermark': { title: 'How to Add Watermark to PDF Free Online', category: 'PDF Tools', tool: 'PDF Watermark', desc: 'Stamp custom text watermarks on every page of your PDF.' },
  'pdf-page-numbers': { title: 'How to Add Page Numbers to PDF Free', category: 'PDF Tools', tool: 'Add Page Numbers', desc: 'Add automatic page numbers to every page of your PDF document.' },
  'protect-pdf': { title: 'How to Password Protect PDF Free Online', category: 'PDF Tools', tool: 'Protect PDF', desc: 'Add password protection to any PDF document to keep it secure.' },
  'unlock-pdf': { title: 'How to Unlock PDF Free Online', category: 'PDF Tools', tool: 'Unlock PDF', desc: 'Remove password protection from PDF files instantly.' },
  'pdf-organizer': { title: 'How to Rearrange PDF Pages Free Online', category: 'PDF Tools', tool: 'PDF Page Organizer', desc: 'Reorder, delete, or duplicate pages in your PDF with drag and drop.' },
  'pdf-to-text': { title: 'How to Extract Text from PDF Free Online', category: 'PDF Tools', tool: 'PDF to Text', desc: 'Extract all text content from any PDF file instantly.' },
  // Visual & Media
  'image-compressor': { title: 'How to Compress Images Free Online', category: 'Visual & Media', tool: 'Image Compressor', desc: 'Reduce image file size up to 90% without visible quality loss.' },
  'image-converter': { title: 'How to Convert Image Formats Free Online', category: 'Visual & Media', tool: 'Image Converter', desc: 'Convert between JPG, PNG, WebP, and AVIF formats instantly.' },
  'ocr-tool': { title: 'Free OCR Tool — Extract Text from Images Online', category: 'Visual & Media', tool: 'Image to Text OCR', desc: 'Extract text from images, screenshots, and scanned documents using AI.' },
  'qr-code-generator': { title: 'Free QR Code Generator Online', category: 'Visual & Media', tool: 'QR Code Generator', desc: 'Generate QR codes for URLs, text, contacts, or any content instantly.' },
  'color-palette-extractor': { title: 'How to Extract Color Palette from Image Free', category: 'Visual & Media', tool: 'Color Palette Extractor', desc: 'Extract the dominant colors from any image to build a color palette.' },
  'image-watermark': { title: 'How to Add Watermark to Image Free Online', category: 'Visual & Media', tool: 'Watermark Adder', desc: 'Add text or logo watermarks to images without any software.' },
  'heic-to-jpg': { title: 'How to Convert HEIC to JPG Free Online', category: 'Visual & Media', tool: 'HEIC to JPG', desc: 'Convert iPhone HEIC photos to JPG for universal compatibility.' },
  'png-to-jpg': { title: 'How to Convert PNG to JPG Free Online', category: 'Visual & Media', tool: 'PNG to JPG', desc: 'Convert PNG images to JPG format with quality control.' },
  'jpg-to-png': { title: 'How to Convert JPG to PNG Free Online', category: 'Visual & Media', tool: 'JPG to PNG', desc: 'Convert JPG images to lossless PNG format.' },
  'webp-to-jpg': { title: 'How to Convert WebP to JPG Free Online', category: 'Visual & Media', tool: 'WebP to JPG/PNG', desc: 'Convert WebP images to standard JPG or PNG format.' },
  'svg-to-png': { title: 'How to Convert SVG to PNG Free Online', category: 'Visual & Media', tool: 'SVG to PNG', desc: 'Convert vector SVG files to PNG raster images at any resolution.' },
  'gif-to-mp4': { title: 'How to Convert GIF to MP4 Free Online', category: 'Visual & Media', tool: 'GIF to MP4', desc: 'Convert animated GIF files to MP4 video format.' },
  'mp4-to-gif': { title: 'How to Convert MP4 to GIF Free Online', category: 'Visual & Media', tool: 'MP4 to GIF', desc: 'Turn video clips into animated GIFs for social media.' },
  'image-resizer': { title: 'How to Resize Images Free Online', category: 'Visual & Media', tool: 'Image Resizer', desc: 'Resize any image to exact pixel dimensions or by percentage.' },
  'image-to-base64': { title: 'How to Convert Image to Base64 Free Online', category: 'Visual & Media', tool: 'Image to Base64', desc: 'Encode images to Base64 strings for use in HTML and CSS.' },
  // Audio & Video
  'mp4-to-mp3': { title: 'How to Convert MP4 to MP3 Free Online', category: 'Audio & Video', tool: 'MP4 to MP3', desc: 'Extract audio from any video file and save as MP3 instantly.' },
  'mp3-to-wav': { title: 'How to Convert MP3 to WAV Free Online', category: 'Audio & Video', tool: 'MP3 to WAV', desc: 'Convert MP3 audio files to lossless WAV format.' },
  'wav-to-mp3': { title: 'How to Convert WAV to MP3 Free Online', category: 'Audio & Video', tool: 'WAV to MP3', desc: 'Compress WAV audio files to smaller MP3 format.' },
  'm4a-to-mp3': { title: 'How to Convert M4A to MP3 Free Online', category: 'Audio & Video', tool: 'M4A to MP3', desc: 'Convert Apple M4A audio files to universally compatible MP3.' },
  'mov-to-mp4': { title: 'How to Convert MOV to MP4 Free Online', category: 'Audio & Video', tool: 'MOV to MP4', desc: 'Convert Apple QuickTime MOV videos to universal MP4 format.' },
  'ogg-to-mp3': { title: 'How to Convert OGG to MP3 Free Online', category: 'Audio & Video', tool: 'OGG to MP3', desc: 'Convert OGG audio files to MP3 format instantly.' },
  'audio-trimmer': { title: 'Free Audio Trimmer Online — Cut MP3 and WAV', category: 'Audio & Video', tool: 'Audio Trimmer', desc: 'Cut and trim audio files with precise start/end points.' },
  'video-compressor': { title: 'Free Video Compressor Online', category: 'Audio & Video', tool: 'Video Compressor', desc: 'Reduce video file size without significant quality loss.' },
  // Code & Data
  'json-formatter': { title: 'Free JSON Formatter and Validator Online', category: 'Code & Data', tool: 'JSON Formatter', desc: 'Format, validate and beautify JSON data with syntax highlighting.' },
  'base64-encoder-decoder': { title: 'Free Base64 Encoder Decoder Online', category: 'Code & Data', tool: 'Base64 Encoder/Decoder', desc: 'Encode text to Base64 or decode Base64 strings instantly.' },
  'markdown-editor': { title: 'Free Online Markdown Editor with Live Preview', category: 'Code & Data', tool: 'Markdown Editor', desc: 'Write Markdown with a real-time preview panel side by side.' },
  'csv-to-json': { title: 'How to Convert CSV to JSON Free Online', category: 'Code & Data', tool: 'CSV to JSON', desc: 'Convert CSV data files to JSON format for APIs and applications.' },
  'fake-data-generator': { title: 'Free Fake Data Generator Online', category: 'Code & Data', tool: 'Fake Data Generator', desc: 'Generate realistic test data — names, emails, addresses and more.' },
  'regex-tester': { title: 'Free Regex Tester Online — Test Regular Expressions', category: 'Code & Data', tool: 'Regex Tester', desc: 'Test and debug regular expressions with live match highlighting.' },
  'json-to-csv': { title: 'How to Convert JSON to CSV Free Online', category: 'Code & Data', tool: 'JSON to CSV', desc: 'Convert JSON arrays to CSV spreadsheet format for Excel.' },
  'json-to-xml': { title: 'How to Convert JSON to XML Free Online', category: 'Code & Data', tool: 'JSON to XML', desc: 'Convert JSON data to XML format for legacy systems and APIs.' },
  'xml-to-json': { title: 'How to Convert XML to JSON Free Online', category: 'Code & Data', tool: 'XML to JSON', desc: 'Parse and convert XML documents to clean JSON format.' },
  'yaml-to-json': { title: 'How to Convert YAML to JSON Free Online', category: 'Code & Data', tool: 'YAML to JSON', desc: 'Convert YAML configuration files to JSON format.' },
  'json-to-yaml': { title: 'How to Convert JSON to YAML Free Online', category: 'Code & Data', tool: 'JSON to YAML', desc: 'Convert JSON data to YAML format for configuration files.' },
  'html-to-markdown': { title: 'How to Convert HTML to Markdown Free Online', category: 'Code & Data', tool: 'HTML to Markdown', desc: 'Convert HTML web content to clean Markdown syntax.' },
  'sql-formatter': { title: 'Free SQL Formatter Online — Beautify SQL Queries', category: 'Code & Data', tool: 'SQL Formatter', desc: 'Format and indent SQL queries for better readability.' },
  'number-base-converter': { title: 'Free Number Base Converter — Binary Hex Decimal', category: 'Code & Data', tool: 'Number Base Converter', desc: 'Convert numbers between Binary, Hexadecimal, Decimal, and Octal.' },
  'unit-converter': { title: 'Free Unit Converter Online — Length Weight Temperature', category: 'Code & Data', tool: 'Unit Converter', desc: 'Convert between units of length, weight, temperature, speed, and more.' },
  'hash-generator': { title: 'Free Hash Generator Online — MD5 SHA256', category: 'Code & Data', tool: 'Hash Generator', desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hash checksums.' },
  'url-encoder-decoder': { title: 'Free URL Encoder Decoder Online', category: 'Code & Data', tool: 'URL Encoder/Decoder', desc: 'Encode or decode URLs and percent-encoded characters.' },
  'html-encoder-decoder': { title: 'Free HTML Encoder Decoder Online', category: 'Code & Data', tool: 'HTML Encoder/Decoder', desc: 'Convert HTML entities to characters and vice versa.' },
  'jwt-decoder': { title: 'Free JWT Decoder Online — Inspect JWT Tokens', category: 'Code & Data', tool: 'JWT Decoder', desc: 'Decode and inspect JWT tokens to view header, payload, and expiry.' },
  'color-converter': { title: 'Free Color Converter Online — HEX RGB HSL', category: 'Code & Data', tool: 'Color Converter', desc: 'Convert colors between HEX, RGB, HSL, and other CSS formats.' },
  'zip-file-creator': { title: 'Free ZIP File Creator Online', category: 'Code & Data', tool: 'ZIP Creator', desc: 'Compress multiple files into a single ZIP archive in your browser.' },
  // Text & Language
  'ai-text-summarizer': { title: 'Free AI Text Summarizer Online', category: 'Text & Language', tool: 'AI Summarizer', desc: 'Condense any text into a clear, structured summary using AI.' },
  'ai-translator': { title: 'Free AI Translator — Translate to 100+ Languages', category: 'Text & Language', tool: 'AI Translator', desc: 'Translate text to over 100 languages with natural, fluent tone.' },
  'grammar-checker': { title: 'Free AI Grammar Checker Online', category: 'Text & Language', tool: 'Grammar & Style Checker', desc: 'Fix grammar errors and improve writing style with AI.' },
  'tone-rewriter': { title: 'Free AI Tone Rewriter Online', category: 'Text & Language', tool: 'Tone Rewriter', desc: 'Rewrite any text as formal, casual, persuasive, or empathetic.' },
  'meeting-notes-cleaner': { title: 'Free AI Meeting Notes Cleaner Online', category: 'Text & Language', tool: 'Meeting Notes Cleaner', desc: 'Turn messy meeting notes into structured action items with AI.' },
  'contract-analyzer': { title: 'AI Contract Analyzer — Find Risky Clauses Free', category: 'Text & Language', tool: 'Contract Analyzer', desc: 'Analyze contracts with AI to identify risky clauses in plain language.' },
  'seo-meta-tag-generator': { title: 'Free SEO Meta Tag Generator Online', category: 'Text & Language', tool: 'SEO Meta Generator', desc: 'Generate optimized title tags and meta descriptions with AI.' },
  'job-description-writer': { title: 'Free AI Job Description Writer Online', category: 'Text & Language', tool: 'Job Description Writer', desc: 'Write compelling job postings that attract top talent in seconds.' },
  // Finance & Data
  'csv-data-analyzer': { title: 'Free CSV Data Analyzer Online', category: 'Finance & Data', tool: 'CSV Analyzer', desc: 'Upload a CSV spreadsheet and get instant charts and data insights.' },
  'invoice-generator': { title: 'Free Invoice Generator Online — PDF Invoices', category: 'Finance & Data', tool: 'Invoice Generator', desc: 'Create professional PDF invoices in under 60 seconds.' },
  'live-currency-converter': { title: 'Free Live Currency Converter Online', category: 'Finance & Data', tool: 'Currency Converter', desc: 'Convert between 170+ currencies with live exchange rates including crypto.' },
  'real-estate-roi-calculator': { title: 'Real Estate ROI Calculator Free Online', category: 'Finance & Data', tool: 'Real Estate ROI', desc: 'Calculate cap rate, cash flow, and net yield on any property.' },
  'crypto-pnl-calculator': { title: 'Free Crypto P&L Calculator Online', category: 'Finance & Data', tool: 'Crypto P&L Calculator', desc: 'Analyze spot and hedge positions with scenario modeling.' },
  'compound-interest-calculator': { title: 'Free Compound Interest Calculator Online', category: 'Finance & Data', tool: 'Compound Interest', desc: 'Visualize how investments grow over time with compound interest.' },
  'loan-payment-calculator': { title: 'Free Loan Payment Calculator Online', category: 'Finance & Data', tool: 'Loan Calculator', desc: 'Calculate monthly loan payments, total interest, and amortization.' },
  'financial-report-summarizer': { title: 'AI Financial Report Summarizer Free Online', category: 'Finance & Data', tool: 'Financial Report Summarizer', desc: 'Extract key metrics and insights from financial reports using AI.' },
  // AI Generator
  'ai-email-writer': { title: 'Free AI Email Writer Online', category: 'AI Generator', tool: 'AI Email Writer', desc: 'Write professional emails in seconds with AI.' },
  'linkedin-post-generator': { title: 'Free AI LinkedIn Post Generator Online', category: 'AI Generator', tool: 'LinkedIn Post Generator', desc: 'Turn any topic into an engaging LinkedIn post with hooks.' },
  'business-name-generator': { title: 'Free AI Business Name Generator Online', category: 'AI Generator', tool: 'Business Name Generator', desc: 'Generate creative, memorable business name ideas with AI.' },
  'product-description-writer': { title: 'Free AI Product Description Writer Online', category: 'AI Generator', tool: 'Product Description Writer', desc: 'Write SEO-optimized product copy that converts visitors to buyers.' },
  'cold-email-writer': { title: 'AI Cold Email Sequence Writer Free Online', category: 'AI Generator', tool: 'Cold Email Sequence', desc: 'Write cold email sequences that actually get responses.' },
  'tweet-thread-writer': { title: 'Free AI Tweet Thread Writer Online', category: 'AI Generator', tool: 'Tweet Thread Writer', desc: 'Convert any idea into a viral Twitter/X thread with AI.' },
  'ad-copy-generator': { title: 'Free AI Ad Copy Generator Online', category: 'AI Generator', tool: 'Ad Copy Generator', desc: 'Generate high-converting ad copy for Facebook, Google, and TikTok.' },
  'faq-generator': { title: 'Free AI FAQ Generator Online', category: 'AI Generator', tool: 'FAQ Generator', desc: 'Generate complete FAQ sections for any product or page.' },
  // Developer
  'strong-password-generator': { title: 'Free Strong Password Generator Online', category: 'Developer Tools', tool: 'Password Generator', desc: 'Generate cryptographically strong random passwords instantly.' },
  'word-character-counter': { title: 'Free Word and Character Counter Online', category: 'Developer Tools', tool: 'Word Counter', desc: 'Count words, characters, sentences, and estimated reading time.' },
  'url-link-shortener': { title: 'Free URL Link Shortener Online', category: 'Developer Tools', tool: 'Link Shortener', desc: 'Shorten long URLs instantly with no signup required.' },
  'world-timezone-converter': { title: 'Free World Timezone Converter Online', category: 'Developer Tools', tool: 'Timezone Converter', desc: 'Convert times between 400+ world timezones instantly.' },
  'ai-background-remover': { title: 'Free AI Background Remover Online', category: 'Developer Tools', tool: 'Background Remover', desc: 'Remove image backgrounds instantly with AI — no Photoshop needed.' },
  'disposable-temp-email': { title: 'Free Disposable Temp Email Generator', category: 'Developer Tools', tool: 'Temp Email', desc: 'Get a temporary email address instantly to protect your privacy.' },
  'mortgage-payment-calculator': { title: 'Free Mortgage Payment Calculator Online', category: 'Utility Tools', tool: 'Mortgage Calculator', desc: 'Calculate monthly mortgage payments, total cost, and interest.' },
  // Career
  'ai-resume-builder': { title: 'Free AI Resume Builder Online', category: 'Career Tools', tool: 'AI Resume Builder', desc: 'Build a professional, ATS-optimized resume with AI in minutes.' },
  'ai-cover-letter-generator': { title: 'Free AI Cover Letter Generator Online', category: 'Career Tools', tool: 'AI Cover Letter', desc: 'Generate a tailored cover letter for any job in seconds.' },
  'ai-interview-coach': { title: 'AI Interview Coach — Practice Questions Online', category: 'Career Tools', tool: 'AI Interview Coach', desc: 'Practice interview questions with AI feedback for any role.' },
  'video-subtitle-generator': { title: 'Free AI Video Subtitle Generator Online', category: 'Career Tools', tool: 'AI Subtitle Generator', desc: 'Generate SRT or VTT subtitles for any video using AI.' },
  'job-salary-estimator': { title: 'Free Job Salary Estimator Online', category: 'Career Tools', tool: 'Salary Estimator', desc: 'Get AI-powered salary estimates for any role and location.' },
};

function makeContent(slug, post) {
  return `<h1>${post.title}</h1>
<p>${post.desc} All processing happens in your browser — your files never leave your device.</p>
<h2>How to Use ${post.tool}</h2>
<ol>
<li><strong>Open Toolra</strong> — Go to <a href="/">toolra.app</a> and find <em>${post.tool}</em> in the ${post.category} section.</li>
<li><strong>Upload or paste</strong> — Click the upload zone or enter your content directly.</li>
<li><strong>Convert instantly</strong> — Results appear in seconds, processed entirely in your browser.</li>
<li><strong>Download</strong> — Save your output file with one click.</li>
</ol>
<h2>Why Use Toolra for ${post.tool}?</h2>
<ul>
<li><strong>100% Free</strong> — No hidden fees or paywalls for basic use</li>
<li><strong>No Installation</strong> — Works in any modern browser, zero downloads</li>
<li><strong>Privacy First</strong> — Files stay on your device, never uploaded to servers</li>
<li><strong>Fast</strong> — Most operations complete in under 5 seconds</li>
<li><strong>107+ Tools</strong> — Access all Toolra tools from one platform</li>
</ul>
<h2>Frequently Asked Questions</h2>
<p><strong>Is ${post.tool} really free?</strong><br>Yes, completely free with no watermarks or signup required.</p>
<p><strong>Is my file safe?</strong><br>All processing happens locally in your browser. Nothing is uploaded to any server.</p>
<p><strong>Does this work on mobile?</strong><br>Yes, Toolra works on iOS and Android browsers without any app download.</p>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const slug = req.query.slug || '';
  
  const post = posts[slug];
  
  if (!post) {
    // Try to generate with xAI for unknown slugs
    const XAI_KEY = process.env.XAI_API_KEY;
    if (XAI_KEY && slug) {
      try {
        const toolName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const r = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${XAI_KEY}` },
          body: JSON.stringify({
            model: 'grok-3-mini',
            max_tokens: 800,
            messages: [{ role: 'user', content: `Write a short SEO blog post about "${toolName}" as a free online tool. Include: H1 title, brief intro, 4-step how-to, 3 benefits. HTML format, no CSS.` }]
          })
        });
        const data = await r.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return res.json({ title: toolName + ' — Free Online Tool', content, category: 'Tools', slug });
        }
      } catch(e) {}
    }
    return res.status(404).json({ error: 'Post not found' });
  }
  
  return res.json({
    title: post.title,
    content: makeContent(slug, post),
    category: post.category,
    slug
  });
}
