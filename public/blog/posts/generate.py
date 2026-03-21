import json, os

tools = [
  ("word-to-pdf", "Word to PDF", "docs", "Convert Word to PDF Free Online — No Install Needed"),
  ("excel-to-pdf", "Excel to PDF", "docs", "Convert Excel to PDF Free — Keep Formatting Perfectly"),
  ("ppt-to-pdf", "PowerPoint to PDF", "docs", "Convert PowerPoint to PDF Free Online in Seconds"),
  ("pdf-to-excel", "PDF to Excel", "docs", "Convert PDF to Excel Free — Extract Tables Instantly"),
  ("pdf-to-ppt", "PDF to PowerPoint", "docs", "Convert PDF to PowerPoint Free — Editable Slides"),
  ("html-to-pdf", "HTML to PDF", "docs", "Convert HTML to PDF Free Online — Web Page to PDF"),
  ("md-to-pdf", "Markdown to PDF", "docs", "Convert Markdown to PDF Free — Clean Professional Output"),
  ("epub-to-pdf", "EPUB to PDF", "docs", "Convert EPUB to PDF Free Online — E-Book Converter"),
  ("csv-to-excel", "CSV to Excel", "docs", "Convert CSV to Excel Free — Open CSV in Excel Instantly"),
  ("excel-to-csv", "Excel to CSV", "docs", "Convert Excel to CSV Free Online — Export Spreadsheet Data"),
  ("txt-to-pdf", "TXT to PDF", "docs", "Convert TXT to PDF Free Online — Plain Text to PDF"),
  ("rtf-to-pdf", "RTF to PDF", "docs", "Convert RTF to PDF Free Online — Rich Text to PDF"),
  ("merge-pdf", "Merge PDF", "pdf", "Merge PDF Files Free Online — Combine PDFs in Seconds"),
  ("split-pdf", "Split PDF", "pdf", "Split PDF Free Online — Extract Pages Instantly"),
  ("compress-pdf", "Compress PDF", "pdf", "Compress PDF Free Online — Reduce PDF Size Without Losing Quality"),
  ("rotate-pdf", "Rotate PDF", "pdf", "Rotate PDF Pages Free Online — Fix PDF Orientation"),
  ("pdf-to-jpg", "PDF to JPG", "pdf", "Convert PDF to JPG Free Online — High Quality Images"),
  ("jpg-to-pdf", "JPG to PDF", "pdf", "Convert JPG to PDF Free Online — Images to PDF in One Click"),
  ("pdf-watermark", "PDF Watermark", "pdf", "Add Watermark to PDF Free Online — Text Watermark Tool"),
  ("pdf-page-numbers", "Add Page Numbers to PDF", "pdf", "Add Page Numbers to PDF Free Online"),
  ("protect-pdf", "Protect PDF", "pdf", "Password Protect PDF Free Online — Secure Your Documents"),
  ("unlock-pdf", "Unlock PDF", "pdf", "Unlock PDF Free Online — Remove PDF Password Instantly"),
  ("pdf-organizer", "PDF Page Organizer", "pdf", "Rearrange PDF Pages Free Online — Drag and Drop Organizer"),
  ("pdf-to-text", "PDF to Text", "pdf", "Extract Text from PDF Free — PDF to Text Converter"),
  ("image-compressor", "Image Compressor", "visual", "Compress Images Free Online — Reduce Image Size Up to 90%"),
  ("image-converter", "Image Format Converter", "visual", "Convert Image Format Free — JPG PNG WebP Converter Online"),
  ("ocr-tool", "Image to Text OCR", "visual", "Free OCR Tool Online — Extract Text from Any Image"),
  ("qr-code-generator", "QR Code Generator", "visual", "Free QR Code Generator Online — Create QR Codes Instantly"),
  ("color-palette-extractor", "Color Palette Extractor", "visual", "Extract Color Palette from Image Free Online"),
  ("image-watermark", "Watermark Adder", "visual", "Add Watermark to Image Free Online — Text and Logo"),
  ("heic-to-jpg", "HEIC to JPG Converter", "visual", "Convert HEIC to JPG Free Online — iPhone Photo Converter"),
  ("png-to-jpg", "PNG to JPG Converter", "visual", "Convert PNG to JPG Free Online — Fast and Easy"),
  ("jpg-to-png", "JPG to PNG Converter", "visual", "Convert JPG to PNG Free Online — Lossless Quality"),
  ("webp-to-jpg", "WebP to JPG Converter", "visual", "Convert WebP to JPG PNG Free Online"),
  ("svg-to-png", "SVG to PNG Converter", "visual", "Convert SVG to PNG Free Online — Vector to Raster"),
  ("gif-to-mp4", "GIF to MP4 Converter", "visual", "Convert GIF to MP4 Free Online — Animated GIF to Video"),
  ("mp4-to-gif", "MP4 to GIF Converter", "visual", "Convert MP4 to GIF Free Online — Video to Animated GIF"),
  ("image-resizer", "Image Resizer", "visual", "Resize Image Free Online — Change Image Size in Pixels"),
  ("image-to-base64", "Image to Base64 Encoder", "visual", "Convert Image to Base64 Free Online — Encode for Web"),
  ("mp4-to-mp3", "MP4 to MP3 Converter", "media", "Convert MP4 to MP3 Free Online — Extract Audio from Video"),
  ("mp3-to-wav", "MP3 to WAV Converter", "media", "Convert MP3 to WAV Free Online — Lossless Audio Converter"),
  ("wav-to-mp3", "WAV to MP3 Converter", "media", "Convert WAV to MP3 Free Online — Compress Audio Files"),
  ("m4a-to-mp3", "M4A to MP3 Converter", "media", "Convert M4A to MP3 Free Online — Apple Audio to MP3"),
  ("mov-to-mp4", "MOV to MP4 Converter", "media", "Convert MOV to MP4 Free Online — QuickTime Video Converter"),
  ("ogg-to-mp3", "OGG to MP3 Converter", "media", "Convert OGG to MP3 Free Online — Audio File Converter"),
  ("audio-trimmer", "Audio Trimmer", "media", "Free Audio Trimmer Online — Cut and Trim MP3 WAV Files"),
  ("video-compressor", "Video Compressor", "media", "Free Video Compressor Online — Reduce Video File Size"),
  ("json-formatter", "JSON Formatter Validator", "code", "Free JSON Formatter and Validator Online — Beautify JSON"),
  ("base64-encoder-decoder", "Base64 Encoder Decoder", "code", "Base64 Encoder Decoder Free Online — Convert Strings"),
  ("markdown-editor", "Markdown Editor Preview", "code", "Free Online Markdown Editor with Live Preview"),
  ("csv-to-json", "CSV to JSON Converter", "code", "Convert CSV to JSON Free Online — Data Format Converter"),
  ("fake-data-generator", "Fake Data Generator", "code", "Free Fake Data Generator Online — Generate Test Data"),
  ("regex-tester", "Regex Tester Online", "code", "Free Regex Tester Online — Test Regular Expressions Live"),
  ("json-to-csv", "JSON to CSV Converter", "code", "Convert JSON to CSV Free Online — JSON Array to Spreadsheet"),
  ("json-to-xml", "JSON to XML Converter", "code", "Convert JSON to XML Free Online — Data Format Converter"),
  ("xml-to-json", "XML to JSON Converter", "code", "Convert XML to JSON Free Online — Parse XML Data"),
  ("yaml-to-json", "YAML to JSON Converter", "code", "Convert YAML to JSON Free Online — Config File Converter"),
  ("json-to-yaml", "JSON to YAML Converter", "code", "Convert JSON to YAML Free Online — Developer Tool"),
  ("html-to-markdown", "HTML to Markdown Converter", "code", "Convert HTML to Markdown Free Online"),
  ("sql-formatter", "SQL Formatter Beautifier", "code", "Free SQL Formatter Online — Beautify and Format SQL Queries"),
  ("number-base-converter", "Number Base Converter", "code", "Free Number Base Converter — Binary Hex Decimal Octal"),
  ("unit-converter", "Unit Converter Online", "code", "Free Unit Converter — Length Weight Temperature Speed Data"),
  ("hash-generator", "Hash Generator MD5 SHA256", "code", "Free Hash Generator Online — MD5 SHA1 SHA256 Checksum"),
  ("url-encoder-decoder", "URL Encoder Decoder", "code", "URL Encoder Decoder Free Online — Percent Encoding Tool"),
  ("html-encoder-decoder", "HTML Encoder Decoder", "code", "HTML Encoder Decoder Free Online — HTML Entities Tool"),
  ("jwt-decoder", "JWT Token Decoder", "code", "Free JWT Decoder Online — Decode and Inspect JWT Tokens"),
  ("color-converter", "Color Format Converter", "code", "Color Converter Free Online — HEX RGB HSL CSS Colors"),
  ("zip-file-creator", "ZIP File Creator", "code", "Create ZIP File Free Online — Compress Multiple Files"),
  ("ai-text-summarizer", "AI Text Summarizer", "text", "Free AI Text Summarizer Online — Summarize Any Text Instantly"),
  ("ai-translator", "AI Language Translator", "text", "Free AI Translator — Translate Text to 100+ Languages"),
  ("grammar-checker", "AI Grammar Checker", "text", "Free AI Grammar Checker Online — Fix Writing Errors"),
  ("tone-rewriter", "AI Tone Rewriter", "text", "Free AI Tone Rewriter — Formal Casual Persuasive Rewrite"),
  ("meeting-notes-cleaner", "Meeting Notes Cleaner", "text", "Free AI Meeting Notes Cleaner — Structured Action Items"),
  ("contract-analyzer", "AI Contract Analyzer", "text", "AI Contract Analyzer Online — Find Risky Clauses Fast"),
  ("seo-meta-tag-generator", "SEO Meta Tag Generator", "text", "Free SEO Meta Tag Generator — AI Title Description Tool"),
  ("job-description-writer", "AI Job Description Writer", "text", "Free AI Job Description Writer — Write JDs in Seconds"),
  ("csv-data-analyzer", "CSV Data Analyzer", "finance", "Free CSV Data Analyzer Online — Visualize Spreadsheet Data"),
  ("invoice-generator", "Invoice Generator PDF", "finance", "Free Invoice Generator Online — Create Professional PDF Invoices"),
  ("live-currency-converter", "Live Currency Converter", "finance", "Free Live Currency Converter — Real-Time Exchange Rates"),
  ("real-estate-roi-calculator", "Real Estate ROI Calculator", "finance", "Real Estate ROI Calculator — Investment Return Analysis"),
  ("crypto-pnl-calculator", "Crypto P&L Calculator", "finance", "Free Crypto P&L Calculator — Spot and Hedge Position Analysis"),
  ("compound-interest-calculator", "Compound Interest Calculator", "finance", "Free Compound Interest Calculator — Investment Growth Tool"),
  ("loan-payment-calculator", "Loan Payment Calculator", "finance", "Free Loan Calculator Online — Monthly Payment Estimator"),
  ("financial-report-summarizer", "Financial Report Summarizer", "finance", "AI Financial Report Summarizer — Analyze Annual Reports Fast"),
  ("ai-email-writer", "AI Email Writer", "ai", "Free AI Email Writer Online — Write Professional Emails Fast"),
  ("linkedin-post-generator", "LinkedIn Post Generator", "ai", "Free AI LinkedIn Post Generator — Viral Content Creator"),
  ("business-name-generator", "Business Name Generator", "ai", "Free AI Business Name Generator — Brand Name Ideas"),
  ("product-description-writer", "AI Product Description Writer", "ai", "Free AI Product Description Writer — SEO Optimized Copy"),
  ("cold-email-writer", "Cold Email Sequence Writer", "ai", "AI Cold Email Writer — Sequences That Actually Convert"),
  ("tweet-thread-writer", "Tweet Thread Writer", "ai", "Free AI Tweet Thread Writer — Viral Twitter Content"),
  ("ad-copy-generator", "Ad Copy Generator", "ai", "Free AI Ad Copy Generator — Facebook Google TikTok Ads"),
  ("faq-generator", "AI FAQ Generator", "ai", "Free AI FAQ Generator — Create FAQs for Any Product Page"),
  ("strong-password-generator", "Strong Password Generator", "dev", "Free Strong Password Generator Online — Secure Random Passwords"),
  ("word-character-counter", "Word and Character Counter", "dev", "Free Word Counter Online — Words Characters Sentences Read Time"),
  ("url-link-shortener", "URL Link Shortener", "dev", "Free URL Shortener Online — Shorten Long Links Instantly"),
  ("world-timezone-converter", "World Timezone Converter", "dev", "Free Timezone Converter Online — Convert World Time Zones"),
  ("ai-background-remover", "AI Background Remover", "dev", "Free AI Background Remover Online — Remove Image Background"),
  ("disposable-temp-email", "Disposable Temp Email", "dev", "Free Temporary Email Address Generator — Disposable Email"),
  ("mortgage-payment-calculator", "Mortgage Payment Calculator", "utility", "Free Mortgage Calculator Online — Monthly Payment Estimator"),
  ("ai-resume-builder", "AI Resume Builder", "career", "Free AI Resume Builder — Professional Resume in Minutes"),
  ("ai-cover-letter-generator", "AI Cover Letter Generator", "career", "Free AI Cover Letter Generator — Tailored Cover Letters"),
  ("ai-interview-coach", "AI Interview Practice Coach", "career", "AI Interview Coach — Practice Questions with AI Feedback"),
  ("video-subtitle-generator", "AI Video Subtitle Generator", "career", "Free AI Subtitle Generator — Auto Captions for Videos"),
  ("job-salary-estimator", "Job Salary Estimator", "career", "Free AI Salary Estimator — Salary Range for Any Role"),
]

cat_names = {
  "docs": "Document Converters",
  "pdf": "PDF Tools", 
  "visual": "Visual & Media",
  "media": "Audio & Video",
  "code": "Code & Data",
  "text": "Text & Language",
  "finance": "Finance & Data",
  "ai": "AI Generator",
  "dev": "Developer Tools",
  "utility": "Utility Tools",
  "career": "Career Tools",
}

def make_blog(slug, name, cat, title):
    cat_label = cat_names.get(cat, cat)
    kw = name.lower()
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | Toolra Blog</title>
<meta name="description" content="Learn how to use Toolra's free {name} tool online. No installation, no signup required. Fast, private, and completely free.">
<meta name="keywords" content="{kw}, free {kw} online, {kw} tool, toolra {kw}">
<link rel="canonical" href="https://toolra.app/blog/{slug}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="Use Toolra's free {name} tool online — no install, no signup. Fast, private, browser-based.">
<meta property="og:url" content="https://toolra.app/blog/{slug}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "Free {name} tool online. No installation required.",
  "url": "https://toolra.app/blog/{slug}",
  "publisher": {{"@type": "Organization", "name": "Toolra", "url": "https://toolra.app"}},
  "datePublished": "2026-03-21",
  "dateModified": "2026-03-21"
}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500@display=swap" rel="stylesheet">
<style>
:root{{--bg:#0a0a0a;--bg2:#111;--bg3:#1a1a1a;--text:#f0ede8;--text2:#8a8580;--text3:#555250;--accent:#e8d5b0;--border:rgba(255,255,255,.07);--border2:rgba(255,255,255,.13);--green:#4ade80}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.7;min-height:100vh}}
nav{{display:flex;align-items:center;justify-content:space-between;padding:18px 40px;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(10,10,10,.9);backdrop-filter:blur(12px);z-index:100}}
.logo{{font-family:'Instrument Serif',serif;font-size:20px;color:var(--accent);text-decoration:none}}
.nav-links{{display:flex;gap:24px}}
.nav-links a{{color:var(--text2);text-decoration:none;font-size:14px;transition:color .2s}}
.nav-links a:hover{{color:var(--text)}}
.cta-btn{{background:var(--accent);color:#0a0a0a;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;font-family:inherit}}
main{{max-width:780px;margin:0 auto;padding:60px 24px 80px}}
.breadcrumb{{font-size:13px;color:var(--text3);margin-bottom:32px}}
.breadcrumb a{{color:var(--text3);text-decoration:none}}
.breadcrumb a:hover{{color:var(--text2)}}
.cat-tag{{display:inline-block;font-size:11px;font-weight:600;padding:4px 12px;background:rgba(232,213,176,.1);color:var(--accent);border-radius:20px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px}}
h1{{font-family:'Instrument Serif',serif;font-size:clamp(28px,5vw,44px);font-weight:400;line-height:1.15;letter-spacing:-.5px;margin-bottom:20px}}
h1 em{{font-style:italic;color:var(--accent)}}
.meta{{font-size:13px;color:var(--text3);margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid var(--border)}}
h2{{font-family:'Instrument Serif',serif;font-size:24px;font-weight:400;margin:40px 0 16px;color:var(--text)}}
h3{{font-size:16px;font-weight:600;margin:28px 0 10px;color:var(--text)}}
p{{color:var(--text2);margin-bottom:16px;font-size:15px}}
ul,ol{{color:var(--text2);margin:12px 0 16px 20px;font-size:15px}}
li{{margin-bottom:8px}}
.tool-cta{{background:var(--bg2);border:1px solid var(--border2);border-radius:16px;padding:32px;text-align:center;margin:48px 0;position:relative;overflow:hidden}}
.tool-cta::before{{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent)}}
.tool-cta h2{{font-size:22px;margin:0 0 10px;font-family:'Instrument Serif',serif}}
.tool-cta p{{margin-bottom:20px;font-size:14px}}
.tool-cta a{{display:inline-block;background:var(--accent);color:#0a0a0a;padding:13px 32px;border-radius:12px;font-weight:600;text-decoration:none;font-size:15px;transition:opacity .2s}}
.tool-cta a:hover{{opacity:.85}}
.faq-item{{border-bottom:1px solid var(--border);padding:20px 0}}
.faq-item:last-child{{border-bottom:none}}
.faq-q{{font-weight:500;font-size:15px;color:var(--text);margin-bottom:8px}}
.faq-a{{font-size:14px;color:var(--text2)}}
.tip-box{{background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.15);border-radius:12px;padding:16px 20px;margin:24px 0;font-size:14px;color:var(--text2)}}
.tip-box strong{{color:var(--green)}}
footer{{text-align:center;padding:32px;font-size:13px;color:var(--text3);border-top:1px solid var(--border)}}
footer a{{color:var(--text3);text-decoration:none}}
</style>
</head>
<body>
<nav>
  <a href="/" class="logo">Toolra<span style="font-style:italic;color:var(--text3)">.ai</span></a>
  <div class="nav-links">
    <a href="/">Tools</a>
    <a href="/blog">Blog</a>
  </div>
  <a href="/" class="cta-btn">Try Free →</a>
</nav>

<main>
  <div class="breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / {name}</div>
  <div class="cat-tag">{cat_label}</div>
  <h1>{title.split(' — ')[0]}<br><em>{title.split(' — ')[1] if ' — ' in title else ''}</em></h1>
  <div class="meta">By Toolra Team · March 2026 · 4 min read</div>

  <p>Need to {name.lower()}? You're in the right place. Toolra's free <strong>{name}</strong> tool works entirely in your browser — no installation, no account required, and your files never leave your device.</p>

  <div class="tool-cta">
    <h2>Try {name} Free →</h2>
    <p>100% free · No signup · Works in your browser</p>
    <a href="/">Use {name} Now</a>
  </div>

  <h2>How to {name} Online — Step by Step</h2>
  <ol>
    <li><strong>Open Toolra</strong> — Go to <a href="/" style="color:var(--accent)">toolra.app</a> and find <em>{name}</em> in the {cat_label} section.</li>
    <li><strong>Upload your file</strong> — Click the upload zone or drag and drop your file directly.</li>
    <li><strong>Convert instantly</strong> — The conversion happens in your browser in seconds.</li>
    <li><strong>Download your result</strong> — Click the download button to save your converted file.</li>
  </ol>

  <div class="tip-box">
    <strong>💡 Pro Tip:</strong> All processing happens locally in your browser. Your files are never uploaded to any server, ensuring complete privacy.
  </div>

  <h2>Why Use Toolra for {name}?</h2>
  <ul>
    <li><strong>100% Free</strong> — No hidden fees, no premium paywalls for basic conversions</li>
    <li><strong>No Installation</strong> — Works directly in Chrome, Firefox, Safari, or any modern browser</li>
    <li><strong>Privacy First</strong> — Files stay on your device, nothing is sent to servers</li>
    <li><strong>Fast</strong> — Most conversions complete in under 5 seconds</li>
    <li><strong>No Signup Required</strong> — Start using immediately, no account needed</li>
    <li><strong>107+ Tools</strong> — Access all other Toolra tools from the same platform</li>
  </ul>

  <h2>When Would You Need to {name}?</h2>
  <p>There are many common situations where a {name.lower()} tool becomes essential:</p>
  <ul>
    <li>Sharing documents in a universal format that anyone can open</li>
    <li>Converting files for professional presentations or reports</li>
    <li>Preparing attachments for email or client submissions</li>
    <li>Archiving documents in a standardized format</li>
    <li>Working with files from different software ecosystems</li>
  </ul>

  <h2>Frequently Asked Questions</h2>
  <div class="faq-item">
    <div class="faq-q">Is the {name} tool really free?</div>
    <div class="faq-a">Yes, completely free. No credit card, no signup, no watermarks on output files. Toolra's free tier includes unlimited use of the {name} tool.</div>
  </div>
  <div class="faq-item">
    <div class="faq-q">Is my file safe when I use this tool?</div>
    <div class="faq-a">Your files never leave your device. All processing happens locally in your browser using JavaScript — there's no upload to any server.</div>
  </div>
  <div class="faq-item">
    <div class="faq-q">What file size is supported?</div>
    <div class="faq-a">Toolra supports files up to 100MB for most conversions. For larger files, consider using our Pro plan which removes size limits.</div>
  </div>
  <div class="faq-item">
    <div class="faq-q">Does this work on mobile?</div>
    <div class="faq-a">Yes. Toolra is fully responsive and works on iOS and Android browsers without any app download.</div>
  </div>
  <div class="faq-item">
    <div class="faq-q">How is Toolra different from other online converters?</div>
    <div class="faq-a">Unlike most converters that upload your files to their servers, Toolra processes everything locally in your browser. This means faster conversions, better privacy, and no file size worries from server limits.</div>
  </div>

  <div class="tool-cta">
    <h2>Ready to {name}?</h2>
    <p>Join thousands of users who use Toolra for free file conversions every day.</p>
    <a href="/">Start Converting Free →</a>
  </div>

  <h2>Other Tools You Might Need</h2>
  <p>Toolra offers 107+ free tools across 11 categories. After using {name}, you might also find these useful:</p>
  <ul>
    <li><a href="/" style="color:var(--accent)">PDF Merge</a> — Combine multiple PDFs into one</li>
    <li><a href="/" style="color:var(--accent)">Image Compressor</a> — Reduce image file size</li>
    <li><a href="/" style="color:var(--accent)">AI Summarizer</a> — Summarize any text with AI</li>
    <li><a href="/" style="color:var(--accent)">Currency Converter</a> — Live exchange rates</li>
    <li><a href="/" style="color:var(--accent)">Password Generator</a> — Strong random passwords</li>
  </ul>

</main>

<footer>
  <p>© 2026 <a href="/">Toolra.app</a> — Free Online Tools for Everyone</p>
</footer>
</body>
</html>'''

# Generate all blog posts
os.makedirs('/home/claude/toolra/public/blog/posts', exist_ok=True)

for slug, name, cat, title in tools:
    html = make_blog(slug, name, cat, title)
    path = f'/home/claude/toolra/public/blog/posts/{slug}.html'
    with open(path, 'w') as f:
        f.write(html)

print(f"Generated {len(tools)} blog posts")

# Also save slugs for sitemap
slugs = [t[0] for t in tools]
with open('/home/claude/toolra/blog_slugs.json', 'w') as f:
    json.dump(slugs, f)
print("Slugs saved")
