const fs = require('fs');

const SLUG = 'dns-over-https-doh-complete-guide';
const CATEGORY = 'Guide';
const AUTHOR = 'olladns Security Team';

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let raw = fs.readFileSync('BLOG5.txt', 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2013]/g, '-')
  .replace(/[\u2014]/g, '—')
  .replace(/[\u2022]/g, '•')
  .trim();

const lines = raw.split('\n');

const title = lines[0].trim();
const readTime = lines[1].split('·')[0].trim();
const date = lines[1].match(/Updated (\d{4}-\d{2}-\d{2})/)[1];

const tldrStart = lines.indexOf('TLDR');
const takeawaysStart = lines.indexOf('Key Takeaways');
const introStart = lines.findIndex(l => l.startsWith('DNS Over HTTPS (DoH): The Protocol'));
const faqStart = lines.findIndex(l => l.startsWith('Frequently Asked Question'));

const tldrText = lines.slice(tldrStart + 1, takeawaysStart).join(' ').trim();
const takeawaysRaw = lines.slice(takeawaysStart + 1, introStart).filter(l => /^\*\s*/.test(l));
const bodyLines = lines.slice(introStart, faqStart >= 0 ? faqStart : undefined);
const faqLines = faqStart >= 0 ? lines.slice(faqStart + 1).filter(l => l.trim() !== '') : [];

const faqs = [];
let currentFaq = null;
faqLines.forEach(line => {
  const trimmed = line.trim();
  if (/^(Does|Do|Can|Is|Will|Should|Which|What|Where|When|How)\b/.test(trimmed)) {
    if (currentFaq) faqs.push(currentFaq);
    currentFaq = { q: trimmed.replace(/\?$/, '?'), a: [] };
  } else if (currentFaq) {
    currentFaq.a.push(trimmed);
  }
});
if (currentFaq) faqs.push(currentFaq);

function isLikelyHeading(text, prevBlank) {
  if (!text) return false;
  if (text.startsWith('•') || text.startsWith('*')) return false;
  if (/^\d+\./.test(text)) return false;
  if (text.length > 90) return false;
  if (text.length < 10) return false;
  // Ends with no period, question mark, exclamation, colon
  if (/[:.!?]$/.test(text)) return false;
  // Starts capitalized, mostly title case words or short uppercase phrases
  const words = text.split(/\s+/);
  const capitalized = words.filter(w => /^[A-Z][a-z]+/.test(w) || /^[A-Z]+$/.test(w)).length;
  if (capitalized < words.length * 0.5 && !/^[A-Z\s\-]+$/.test(text)) return false;
  return true;
}

const sections = [];
let current = null;
let paragraphBuffer = [];

function flushParagraph() {
  if (!paragraphBuffer.length) return;
  const text = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
  paragraphBuffer = [];
  if (!text || !current) return;
  current.paragraphs.push(text);
}

function startSection(heading) {
  flushParagraph();
  if (current) sections.push(current);
  const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
  current = { heading, id, paragraphs: [] };
}

for (let i = 0; i < bodyLines.length; i++) {
  const line = bodyLines[i];
  const trimmed = line.trim();
  const prevBlank = i === 0 || bodyLines[i - 1].trim() === '';

  if (!trimmed) {
    flushParagraph();
    continue;
  }

  // Major heading: first paragraph, or a short standalone line on blank-line boundary
  if (i === 0 || (prevBlank && isLikelyHeading(trimmed))) {
    startSection(trimmed);
    continue;
  }

  // If somehow no section yet, create introduction
  if (!current) startSection('Introduction');

  current.paragraphs.push(trimmed);
}
flushParagraph();
if (current) sections.push(current);

function buildHtml(items) {
  const out = [];
  let buffer = [];
  let listBuffer = [];
  let listType = null;

  function flushBuffer() {
    if (buffer.length) {
      const text = buffer.join(' ').replace(/\s+/g, ' ').trim();
      if (text) out.push(`<p>${escHtml(text)}</p>`);
      buffer = [];
    }
  }

  function flushList() {
    if (listBuffer.length) {
      const tag = listType === 'ol' ? 'ol' : 'ul';
      out.push(`<${tag}>\n${listBuffer.map(t => `<li>${escHtml(t)}</li>`).join('\n')}\n</${tag}>`);
      listBuffer = [];
      listType = null;
    }
  }

  items.forEach(item => {
    const trimmed = item.trim();
    if (!trimmed) {
      flushList();
      flushBuffer();
      return;
    }

    // Subheading inside a section: short, standalone, not a list
    if (trimmed.length < 70 && !/^[\*•\-\d]/.test(trimmed) && /^[A-Z][A-Za-z0-9\s\-:()&'!]{2,69}$/.test(trimmed)) {
      flushList();
      flushBuffer();
      out.push(`<h3>${escHtml(trimmed)}</h3>`);
      return;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
    if (olMatch) {
      flushBuffer();
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listBuffer.push(olMatch[2]);
      return;
    }

    if (/^[\*•\-]\s*/.test(trimmed)) {
      flushBuffer();
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listBuffer.push(trimmed.replace(/^[\*•\-]\s*/, ''));
      return;
    }

    flushList();
    buffer.push(trimmed);
  });

  flushList();
  flushBuffer();
  return out.join('\n');
}

const tocHtml = sections.map(s => `              <li><a href="#${s.id}">${escHtml(s.heading)}</a></li>`).join('\n');

function renderSection(sec, idx) {
  let html = buildHtml(sec.paragraphs);

  if (sec.heading.toLowerCase().includes('differs') || sec.id.includes('dot') || sec.id.includes('doq')) {
    html += `
          <table class="protocol-table">
            <thead>
              <tr><th>Protocol</th><th>Port</th><th>Blends with web traffic?</th><th>Connection speed</th><th>Network admin visible?</th><th>Blockable?</th></tr>
            </thead>
            <tbody>
              <tr><td>DoH</td><td>443 (HTTPS)</td><td>Yes—perfectly</td><td>Slower initial</td><td>No—looks like web</td><td>Very difficult</td></tr>
              <tr><td>DoT</td><td>853 (or 443)</td><td>No—dedicated port</td><td>Moderate</td><td>Yes—distinctive traffic</td><td>Easy with port rules</td></tr>
              <tr><td>DoQ</td><td>443 (QUIC)</td><td>Mostly—blends with HTTP/3</td><td>Faster</td><td>Difficult—newer</td><td>Harder than DoT</td></tr>
            </tbody>
          </table>`;
  }

  return `
          <section class="post-section" id="${sec.id}">
            <span class="section-num">${idx + 1}</span>
            <h2>${escHtml(sec.heading)}</h2>
            ${html}
          </section>`;
}

let sectionsHtml = sections.map((s, i) => renderSection(s, i)).join('\n');

if (faqs.length) {
  const faqHtml = `
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
${faqs.map(f => {
    const answer = buildHtml(f.a);
    return `            <details class="faq-item" style="background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--r-md); overflow: hidden;">
              <summary style="font-size: 16px; font-weight: 600; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; color: var(--text); padding: 18px 22px;">
                <span>${escHtml(f.q)}</span>
                <span class="faq-icon" style="color: var(--accent); font-size: 18px; font-weight: 300; flex: none; width: 28px; height: 28px; border: 1.5px solid var(--accent-line); border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--accent-soft); transition: transform .2s;">+</span>
              </summary>
              <div style="padding: 14px 22px 18px; font-size: 15.5px; line-height: 1.7; color: var(--text-2); border-top: 1px solid var(--line);">
                ${answer}
              </div>
            </details>`;
  }).join('\n')}
          </div>`;

  sectionsHtml += `
          <section class="post-section" id="frequently-asked-questions">
            <span class="section-num">${sections.length + 1}</span>
            <h2>Frequently Asked Questions</h2>
            ${faqHtml}
          </section>`;
}

const takeawaysHtml = takeawaysRaw.map(l => {
  const text = l.replace(/^\*\s*/, '').trim();
  const match = text.match(/^(.+?)\s*[—–-]\s*(.+)$/);
  if (match) {
    return `        <li style="margin-bottom: 8px;"><strong>${escHtml(match[1].trim())}:</strong> ${escHtml(match[2].trim())}</li>`;
  }
  return `        <li style="margin-bottom: 8px;">${escHtml(text)}</li>`;
}).join('\n');

const tldrHtml = `
        <div class="post-tldr" style="margin-bottom: 32px;">
          <div class="tldr-head">
            <span class="tldr-label">TL;DR</span>
            <h3 style="font-size: 20px; margin: 0; color: var(--text);">DNS Over HTTPS in 60 Seconds</h3>
          </div>
          <ul class="tldr-list">
            <li><span class="ck">✓</span> ${escHtml(tldrText)}</li>
          </ul>
        </div>
        <div class="what-found" style="margin: 0 0 40px 0;">
          <div class="what-found-head">
            <span class="tldr-label">Key Takeaways</span>
            <h3 style="font-size: 20px; margin: 0; color: var(--text);">What You'll Learn</h3>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 15.5px; line-height: 1.7; color: var(--text-2);">
${takeawaysHtml}
          </ul>
        </div>`;

const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const ogTitle = `${escHtml(title)} &middot; olladns Blog`;
const description = "DNS Over HTTPS encrypts DNS queries so ISPs and network operators can't see your domain lookups. Learn how DoH works, why it matters, deployment challenges, and how it compares to DoT and DoQ.";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${ogTitle}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${description}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://olladns.com/blog/${SLUG}/">
  <meta property="og:image" content="data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'1280'%20height%3D'720'%3E%3Crect%20fill%3D'%2523f4f4f5'%20width%3D'1280'%20height%3D'720'%2F%3E%3Ctext%20fill%3D'%2523DA291C'%20font-family%3D'sans-serif'%20font-size%3D'28'%20font-weight%3D'600'%20x%3D'640'%20y%3D'370'%20text-anchor%3D'middle'%3EDoH%3C%2Ftext%3E%3C%2Fsvg%3E">
  <meta property="article:published_time" content="${date}">
  <meta property="article:author" content="${AUTHOR}">
  <meta property="article:section" content="${CATEGORY}">
  <link rel="canonical" href="https://olladns.com/blog/${SLUG}/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700;900&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/site.css?v=20260827">
  <style>
    .post-meta {
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
      margin-top: 18px;
      color: var(--muted);
      font-size: 14px
    }

    .post-meta .tag {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: .08em
    }

    .post-thumb {
      aspect-ratio: 16/9;
      background: var(--bg-2);
      border-radius: var(--r-md);
      overflow: hidden;
      border: 1px solid var(--line);
      margin-bottom: 36px
    }

    .post-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block
    }

    .post-body {
      max-width: 720px;
      margin: 0 auto
    }

    .post-body h2 {
      font-size: 24px;
      margin: 42px 0 16px;
      color: var(--text)
    }

    .post-body h3 {
      font-size: 18px;
      margin: 32px 0 12px;
      color: var(--text)
    }

    .post-body p {
      font-size: 15.5px;
      line-height: 1.7;
      color: var(--text-2);
      margin: 0 0 18px
    }

    .post-body .lede {
      font-size: 18px;
      color: var(--text);
      line-height: 1.7;
      margin-bottom: 28px
    }

    .post-body ul,
    .post-body ol {
      margin: 0 0 20px;
      padding-left: 24px;
      color: var(--text-2);
      font-size: 15.5px;
      line-height: 1.7
    }

    .post-body li {
      margin-bottom: 8px
    }

    .post-body code {
      font-family: var(--mono);
      font-size: 13px;
      background: var(--bg-2);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text)
    }

    .post-body pre {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 18px;
      overflow-x: auto;
      margin: 22px 0
    }

    .post-body pre code {
      background: transparent;
      padding: 0
    }

    .post-body blockquote {
      border-left: 3px solid var(--accent);
      margin: 24px 0;
      padding-left: 20px;
      color: var(--muted);
      font-style: italic
    }

    .post-author {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 32px;
      color: var(--muted);
      font-size: 14px
    }

    .post-author .dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-soft);
      color: var(--accent);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 13px
    }

    .post-nav {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 56px;
      padding-top: 24px;
      border-top: 1px solid var(--line)
    }

    .post-nav a {
      color: var(--accent);
      font-size: 14px;
      font-weight: 500
    }

    .post-nav a:hover {
      text-decoration: underline
    }

    .post-section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      padding: 32px 36px;
      margin-bottom: 24px;
      scroll-margin-top: 92px;
    }

    .section-num {
      display: inline-block;
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: .08em;
      margin-bottom: 10px;
    }

    .tldr-label {
      font-family: var(--mono); font-size: 11px;
      font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; background: var(--accent);
      color: #fff; padding: 5px 12px; border-radius: 999px;
    }

    .tldr-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }

    .tldr-list {
      margin: 0;
      padding-left: 20px;
      font-size: 15.5px;
      line-height: 1.7;
      color: var(--text-2);
    }

    .tldr-list li {
      margin-bottom: 8px;
    }

    .what-found {
      background: var(--panel); border: 1px solid var(--line);
      border-radius: var(--r-lg); padding: 26px;
      margin: 28px 0 36px; box-shadow: var(--shadow);
    }

    .what-found-head {
      display: flex;
      align-items: center;
      gap: 10px; margin-bottom: 14px;
    }

    .faq-item summary::-webkit-details-marker { display: none; }

    .faq-item[open] .faq-icon { transform: rotate(45deg); }

    .faq-item:not([open]) .faq-icon { transform: rotate(0deg); }

    table.protocol-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 14px;
    }

    table.protocol-table th,
    table.protocol-table td {
      border: 1px solid var(--line);
      padding: 12px 14px;
      text-align: left;
      color: var(--text-2);
    }

    table.protocol-table th {
      background: var(--bg-1);
      color: var(--text);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .post-section { padding: 20px; }
      table.protocol-table { font-size: 12.5px; }
    }
  </style>
</head>

<body data-screen-label="Marketing &mdash; Blog Post">

  <div id="site-nav"></div>

  <section class="page-hero" style="padding-top: 24px; padding-bottom:40px">
    <div class="grid-bg"></div>
    <div class="container" style="position: relative; text-align: center; display: flex; flex-direction: column; align-items: center;">
      <span class="eyebrow"><a href="/blog/" style="color:inherit">Blog</a></span>
      <h1 class="gradient-text" style="font-size: clamp(26px, 3.8vw, 46px); line-height: 1.2; max-width: 700px;">${escHtml(title)}</h1>
      <div class="post-meta">
        <span class="tag">${CATEGORY}</span>
        <span>${displayDate}</span>
        <span>${readTime}</span>
        <span>by ${AUTHOR}</span>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">

      <div class="post-layout">
        <aside class="post-toc" aria-label="Table of contents">
          <div class="toc-box">
            <h4>Table of Contents</h4>
            <ul>
              ${tocHtml}
            </ul>
          </div>
        </aside>

        <article class="post-body">
${tldrHtml}
${sectionsHtml}

          <div class="post-nav">
            <a href="/blog/dns-filtering-explained/">&larr; DNS Filtering Explained</a>
            <a href="/blog/dns-firewall-explained-how-dns-firewalls-protect-networks/">DNS Firewall Explained &rarr;</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <div id="site-footer"></div>

  <script src="/chrome.js?v=20260827"></script>
  <script>
    mountChrome('blog');

    document.addEventListener('click', function (e) {
      const link = e.target.closest('.post-toc a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
      if (history.pushState) history.pushState(null, '', link.getAttribute('href'));
    });
  </script>

</body>
</html>`;

fs.mkdirSync('blog/' + SLUG, { recursive: true });
fs.writeFileSync('blog/' + SLUG + '/index.html', html);
fs.writeFileSync('blog-posts/' + SLUG + '.html', html);

console.log('Generated:', 'blog/' + SLUG + '/index.html');
console.log('Generated:', 'blog-posts/' + SLUG + '.html');
console.log('Date:', date, 'Display:', displayDate);
