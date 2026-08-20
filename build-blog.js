const fs = require('fs');
const path = require('path');

const dnsSecurityContent = require('./dns-security-content.js');

const DNS_SECURITY_SLUG = 'what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026';

const POSTS_DIR = path.join(__dirname, 'blog-posts');
const BLOG_DIR = path.join(__dirname, 'blog');
const BLOG_JSON = path.join(__dirname, 'blog.json');
const BLOG_HTML = path.join(__dirname, 'blog.html');
const REDIRECTS_FILE = path.join(__dirname, '_redirects');

const posts = JSON.parse(fs.readFileSync(BLOG_JSON, 'utf-8'));

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function svgThumb(label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'><rect fill='%23f4f4f5' width='640' height='400'/><text fill='%23DA291C' font-family='sans-serif' font-size='18' font-weight='600' x='320' y='205' text-anchor='middle'>${escapeHtml(label)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function svgHero(label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'><rect fill='%23f4f4f5' width='1280' height='720'/><text fill='%23DA291C' font-family='sans-serif' font-size='28' font-weight='600' x='640' y='370' text-anchor='middle'>${escapeHtml(label)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function imageUrl(post, { width = 640, height = 400, hero = false } = {}) {
  if (post.image) {
    return post.image.startsWith('http') || post.image.startsWith('/') ? post.image : `/${post.image}`;
  }
  return hero ? svgHero(post.imageLabel || post.category) : svgThumb(post.imageLabel || post.category);
}

function prevPost(index) {
  return index < posts.length - 1 ? posts[index + 1] : null;
}

function nextPost(index) {
  return index > 0 ? posts[index - 1] : null;
}

if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

const cardsHtml = posts.map(p => `
      <a class="blog-card" href="/blog/${p.slug}/">
        <div class="body">
          <div class="tag">${escapeHtml(p.category)}</div>
          <h4>${escapeHtml(p.title)}</h4>
          <p>${escapeHtml(p.excerpt)}</p>
          <div class="foot">
            <span class="date">${escapeHtml(p.displayDate)}</span>
            <span class="more">Read more <span data-ic="arrow" style="width:12px;height:12px"></span></span>
          </div>
        </div>
      </a>`).join('\n');

const blogListing = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Blog · olladns</title>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="description" content="The olladns blog — threat research, product updates, and practical guides for security teams."/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/site.css?v=20260821"/>
  <style>
    .blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .blog-card{padding:22px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--panel);display:flex;flex-direction:column;transition:.15s;overflow:hidden}
    .blog-card:hover{border-color:var(--line-2)}
    .blog-card .body{display:flex;flex-direction:column;gap:12px;flex:1}
    .blog-card .tag{font-family:var(--mono);font-size:11px;color:var(--accent);text-transform:uppercase;letter-spacing:.08em}
    .blog-card h4{font-size:18px;line-height:1.35;margin:0;color:var(--text)}
    .blog-card p{font-size:13.5px;color:var(--muted);line-height:1.6;margin:0}
    .blog-card .foot{display:flex;align-items:center;justify-content:space-between;margin-top:auto;gap:12px}
    .blog-card .date{font-size:12.5px;color:var(--muted)}
    .blog-card .more{color:var(--accent);font-size:13px;font-weight:500;display:inline-flex;align-items:center;gap:5px}
    .blog-card .more:hover{text-decoration:underline}
    @media (max-width:900px){.blog-grid{grid-template-columns:repeat(2,1fr)}}
    @media (max-width:600px){.blog-grid{grid-template-columns:1fr}}
  </style>
</head>
<body data-screen-label="Marketing — Blog">

<div id="site-nav"></div>

<section class="page-hero">
  <div class="grid-bg"></div>
  <div class="container" style="position:relative">
    <span class="eyebrow">Blog</span>
    <h1 class="gradient-text">Threat research, product notes, and field guides.</h1>
    <p class="lede" style="font-size:19px">What we&rsquo;re learning while building DNS security for AI-native teams.</p>
  </div>
</section>

<section class="section" style="padding-top:48px">
  <div class="container">
    <div class="blog-grid">
${cardsHtml}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cta-block">
      <h2>Want new posts in your inbox?</h2>
      <p class="lede">A short email when we ship something worth reading. No roundups, no recycled press releases.</p>
      <div class="cta">
        <a class="btn primary lg" href="/contact.html">Subscribe <span data-ic="arrow"></span></a>
      </div>
    </div>
  </div>
</section>

<div id="site-footer"></div>

<script src="/chrome.js?v=20260821"></script>
<script>
  mountChrome('blog');
  document.querySelectorAll('[data-ic]').forEach(el=>{
    el.innerHTML = icon(el.getAttribute('data-ic'),{size:12,sw:1.8});
  });
</script>
</body>
</html>
`;

fs.writeFileSync(BLOG_HTML, blogListing, 'utf-8');

// Directory-based listing under /blog/
fs.writeFileSync(
  path.join(BLOG_DIR, 'index.html'),
  blogListing
);

const tocLinks = [
  { id: 'the-layer-nobody-watches', label: 'The Layer Nobody Watches' },
  { id: 'what-dns-does', label: 'What DNS Actually Does' },
  { id: 'what-is-dns-security', label: 'What Is DNS Security?' },
  { id: 'why-dns-attack-surface', label: 'Why DNS Is an Attack Surface' },
  { id: 'attack-techniques', label: 'Attack Techniques' },
  { id: 'firewall-not-enough', label: 'Why Firewalls Are Not Enough' },
  { id: 'building-blocks', label: 'Core Building Blocks' },
  { id: 'real-world-stakes', label: 'Real-World Stakes' },
  { id: 'deployment', label: 'Real Deployment' },
  { id: 'checklist', label: 'Evaluation Checklist' },
  { id: 'myths', label: 'Common Myths' },
  { id: 'future', label: 'Where DNS Security Is Headed' },
  { id: 'conclusion', label: 'Conclusion' },
  { id: 'faq', label: 'FAQ' }
];

function postHead(post) {
  const ogImage = imageUrl(post, { hero: true });
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(post.title)} · olladns Blog</title>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="description" content="${escapeHtml(post.excerpt)}"/>
  <meta property="og:title" content="${escapeHtml(post.title)} · olladns Blog"/>
  <meta property="og:description" content="${escapeHtml(post.excerpt)}"/>
  <meta property="og:type" content="article"/>
  <meta property="og:url" content="https://olladns.com/blog/${post.slug}/"/>
  <meta property="og:image" content="${ogImage.startsWith('data:') ? ogImage : ogImage.startsWith('http') ? ogImage : 'https://olladns.com' + ogImage}"/>
  <meta property="article:published_time" content="${post.date}"/>
  <meta property="article:author" content="${escapeHtml(post.author)}"/>
  <meta property="article:section" content="${escapeHtml(post.category)}"/>
  <link rel="canonical" href="https://olladns.com/blog/${post.slug}/"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/site.css?v=20260821"/>`;
}

function postFoot(post) {
  return `
<div id="site-footer"></div>

<script src="/chrome.js?v=20260821"></script>
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
}

function postHero(post) {
  return `
<section class="page-hero" style="padding-bottom:40px">
  <div class="grid-bg"></div>
  <div class="container" style="position:relative">
    <span class="eyebrow"><a href="/blog/" style="color:inherit">Blog</a></span>
    <h1 class="gradient-text">${escapeHtml(post.title)}</h1>
    <div class="post-meta">
      <span class="tag">${escapeHtml(post.category)}</span>
      <span>${escapeHtml(post.displayDate)}</span>
      <span>${escapeHtml(post.readTime)}</span>
      <span>by ${escapeHtml(post.author)}</span>
    </div>
  </div>
</section>`;
}

function postAuthor(post) {
  return `
      <div class="post-author">
        <span class="dot">${escapeHtml(post.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase())}</span>
        <span>Written by <strong style="color:var(--text)">${escapeHtml(post.author)}</strong> · ${escapeHtml(post.category)}</span>
      </div>`;
}

function postNav(index) {
  const prev = prevPost(index);
  const next = nextPost(index);
  const prevLink = prev ? `<a href="/blog/${prev.slug}/">← ${escapeHtml(prev.title)}</a>` : `<a href="/blog/">← All posts</a>`;
  const nextLink = next ? `<a href="/blog/${next.slug}/">${escapeHtml(next.title)} →</a>` : '';
  return `
      <div class="post-nav">
        ${prevLink}
        ${nextLink}
      </div>`;
}

function genericPostTemplate(post, index) {
  return `${postHead(post)}
  <style>
    .post-meta{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:18px;color:var(--muted);font-size:14px}
    .post-meta .tag{font-family:var(--mono);font-size:11px;color:var(--accent);text-transform:uppercase;letter-spacing:.08em}
    .post-thumb{aspect-ratio:16/9;background:var(--bg-2);border-radius:var(--r-md);overflow:hidden;border:1px solid var(--line);margin-bottom:36px}
    .post-thumb img{width:100%;height:100%;object-fit:cover;display:block}
    .post-body{max-width:720px;margin:0 auto}
    .post-body h2{font-size:24px;margin:42px 0 16px;color:var(--text)}
    .post-body h3{font-size:18px;margin:32px 0 12px;color:var(--text)}
    .post-body p{font-size:15.5px;line-height:1.7;color:var(--text-2);margin:0 0 18px}
    .post-body .lede{font-size:18px;color:var(--text);line-height:1.7;margin-bottom:28px}
    .post-body ul,.post-body ol{margin:0 0 20px;padding-left:24px;color:var(--text-2);font-size:15.5px;line-height:1.7}
    .post-body li{margin-bottom:8px}
    .post-body code{font-family:var(--mono);font-size:13px;background:var(--bg-2);padding:2px 6px;border-radius:4px;color:var(--text)}
    .post-body pre{background:var(--bg-1);border:1px solid var(--line);border-radius:var(--r-md);padding:18px;overflow-x:auto;margin:22px 0}
    .post-body pre code{background:transparent;padding:0}
    .post-body blockquote{border-left:3px solid var(--accent);margin:24px 0;padding-left:20px;color:var(--muted);font-style:italic}
    .post-author{display:flex;align-items:center;gap:12px;margin-top:32px;color:var(--muted);font-size:14px}
    .post-author .dot{width:32px;height:32px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;font-weight:700;font-size:13px}
    .post-nav{display:flex;justify-content:space-between;gap:16px;margin-top:56px;padding-top:24px;border-top:1px solid var(--line)}
    .post-nav a{color:var(--accent);font-size:14px;font-weight:500}
    .post-nav a:hover{text-decoration:underline}
  </style>
</head>
<body data-screen-label="Marketing — Blog Post">

<div id="site-nav"></div>

${postHero(post)}

<section class="section" style="padding-top:0">
  <div class="container">
    <article class="post-body">
      <div class="post-thumb">
        <img src="${imageUrl(post, { hero: true })}" alt="${escapeHtml(post.title)}"/>
      </div>

      ${post.content}

      ${postAuthor(post)}
      ${postNav(index)}
    </article>
  </div>
</section>

${postFoot(post)}`;
}

function dnsSecurityTemplate(post, index) {
  const tocHtml = tocLinks.map(l => `<li><a href="#${l.id}">${escapeHtml(l.label)}</a></li>`).join('\n');

  return `${postHead(post)}
  <style>
    .post-hero-desc{max-width:68ch;margin-top:18px;font-size:18px;color:var(--text-2);line-height:1.6}
    .post-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:18px;color:var(--muted);font-size:14px}
    .post-meta .tag{font-family:var(--mono);font-size:11px;color:var(--accent);text-transform:uppercase;letter-spacing:.08em}
    .post-meta .sep{color:var(--muted);user-select:none;margin:0 4px}
    .post-layout{display:grid;grid-template-columns:240px 1fr;gap:48px;align-items:start}
    .post-toc{position:sticky;top:88px;max-height:calc(100vh - 120px);overflow:auto;padding-right:8px}
    .post-toc h4{font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin:0 0 12px}
    .post-toc ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
    .post-toc a{display:block;font-size:13px;color:var(--text-2);padding:5px 10px;border-radius:6px;border-left:2px solid transparent}
    .post-toc a:hover{color:var(--accent);background:var(--bg-2)}
    .post-body{max-width:none;margin:0;min-width:0}
    .post-body h2{font-size:26px;margin:0 0 16px;color:var(--text)}
    .post-body h3{font-size:18px;margin:0 0 12px;color:var(--text)}
    .post-body p{font-size:15.5px;line-height:1.7;color:var(--text-2);margin:0 0 18px}
    .post-body code{font-family:var(--mono);font-size:13px;background:var(--bg-2);padding:2px 6px;border-radius:4px;color:var(--text)}
    .post-section{position:relative;margin-bottom:64px;padding-top:8px;scroll-margin-top:88px}
    .section-num{display:block;font-family:var(--mono);font-size:12px;color:var(--accent);margin-bottom:8px;letter-spacing:.06em}
    .post-tldr{background:linear-gradient(180deg,rgba(31,79,216,.06),rgba(31,79,216,.02));border:1px solid rgba(31,79,216,.18);border-radius:var(--r-lg);padding:26px;margin-bottom:56px}
    .tldr-head{display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap}
    .tldr-label{font-family:var(--mono);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;background:var(--accent);color:#fff;padding:4px 10px;border-radius:999px}
    .post-tldr h3{font-size:20px;margin:0}
    .post-tldr p{margin:0}
    .post-quote{border-left:3px solid var(--accent);margin:24px 0;padding:4px 0 4px 22px;background:transparent}
    .post-quote p{font-size:18px;color:var(--text);font-style:italic;margin:0}
    .dns-flow{display:flex;flex-direction:column;gap:10px;margin:28px 0;padding:24px;background:var(--bg-1);border:1px solid var(--line);border-radius:var(--r-lg)}
    .flow-step{display:flex;align-items:center;gap:16px}
    .flow-dot{width:12px;height:12px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px var(--accent-soft);flex:none}
    .flow-card{flex:1;background:var(--panel);border:1px solid var(--line);border-radius:var(--r-md);padding:16px 18px}
    .flow-card h4{margin:0 0 4px;font-size:14px}
    .flow-card p{margin:0;font-size:13.5px;color:var(--muted)}
    .flow-arrow{padding-left:5px;color:var(--dim);font-size:13px}
    .concept-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin:24px 0}
    .concept-card,.surface-card,.tech-card,.proto-card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r-md);padding:22px;transition:.15s}
    .concept-card:hover,.surface-card:hover,.tech-card:hover,.proto-card:hover{border-color:var(--line-2)}
    .concept-ic{width:40px;height:40px;border-radius:8px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;border:1px solid var(--accent-line);margin-bottom:12px}
    .concept-card h4,.surface-card h4,.tech-card h4,.proto-card h4{margin:0 0 8px;font-size:15px}
    .concept-card p,.surface-card p,.tech-card p,.proto-card p{margin:0;font-size:14px;color:var(--text-2);line-height:1.6}
    .attack-surface-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:24px 0}
    .surface-num{font-family:var(--mono);font-size:22px;font-weight:700;color:var(--accent);margin-bottom:8px}
    .technique-row{display:grid;grid-template-columns:1fr 280px;gap:28px;align-items:center;margin:36px 0;padding:26px;background:var(--bg-1);border:1px solid var(--line);border-radius:var(--r-lg)}
    .technique-row.reverse{grid-template-columns:280px 1fr}
    .technique-text h3{margin-top:0}
    .technique-visual{display:grid;place-items:center}
    .visual-card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r-md);padding:18px;text-align:center;width:100%}
    .visual-label{font-size:12px;color:var(--muted);margin-bottom:6px}
    .visual-domain{font-family:var(--mono);font-size:13px;color:var(--text);background:var(--bg-2);border:1px solid var(--line);border-radius:6px;padding:8px 10px;margin-bottom:8px;word-break:break-all}
    .visual-arrow{color:var(--accent);font-size:13px;margin:4px 0}
    .visual-label.poisoned{color:var(--accent)}
    .code-box{background:var(--bg-1);border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;margin:28px 0}
    .code-head{display:flex;align-items:center;gap:8px;padding:10px 16px;background:var(--bg-2);border-bottom:1px solid var(--line);font-family:var(--mono);font-size:11px;color:var(--muted)}
    .code-box pre{margin:0;padding:18px;background:#0b0f19;overflow-x:auto}
    .code-box pre code{color:#e5e7eb;background:transparent;font-size:13px;line-height:1.7}
    .code-caption{padding:12px 16px;margin:0;font-size:13px;color:var(--muted);background:var(--panel);border-top:1px solid var(--line)}
    .table-wrap{width:100%;overflow-x:auto;margin:24px 0;border-radius:var(--r-md);border:1px solid var(--line)}
    .post-table{width:100%;border-collapse:separate;border-spacing:0;background:var(--panel);font-size:14px;min-width:680px}
    .post-table th,.post-table td{padding:14px 16px;text-align:left;border-bottom:1px solid var(--line)}
    .post-table thead th{background:var(--bg-1);font-size:12px;letter-spacing:.02em;color:var(--muted);text-transform:uppercase;font-weight:600}
    .post-table tbody tr:last-child td{border-bottom:0}
    .tech-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0}
    .tech-card{display:flex;flex-direction:column}
    .tech-ic{width:38px;height:38px;border-radius:8px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;border:1px solid var(--accent-line);margin-bottom:12px;font-size:18px}
    .proto-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0}
    .proto-sub{font-family:var(--mono);font-size:11px;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;margin:-6px 0 10px}
    .timeline{position:relative;margin:24px 0;padding-left:24px}
    .timeline::before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:var(--line)}
    .timeline-item{position:relative;display:grid;grid-template-columns:110px 1fr;gap:18px;margin-bottom:24px}
    .timeline-item::before{content:"";position:absolute;left:-21px;top:6px;width:10px;height:10px;border-radius:50%;background:var(--accent);border:2px solid var(--bg-0)}
    .timeline-date{font-family:var(--mono);font-size:12px;color:var(--accent);font-weight:600}
    .timeline-body h4{margin:0 0 6px;font-size:15px}
    .timeline-body p{margin:0}
    .roadmap{list-style:none;margin:24px 0;padding:0;display:flex;flex-direction:column;gap:16px}
    .roadmap li{display:flex;gap:16px;background:var(--panel);border:1px solid var(--line);border-radius:var(--r-md);padding:20px}
    .roadmap-num{width:32px;height:32px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;font-family:var(--mono);font-size:13px;font-weight:700;flex:none}
    .roadmap h4{margin:0 0 4px;font-size:15px}
    .roadmap p{margin:0;font-size:14px;color:var(--text-2);line-height:1.6}
    .checklist{list-style:none;margin:24px 0;padding:0;display:flex;flex-direction:column;gap:12px}
    .checklist li{display:flex;gap:12px;align-items:flex-start;background:var(--panel);border:1px solid var(--line);border-radius:var(--r-md);padding:16px 18px}
    .check-ck{width:20px;height:20px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-size:11px;flex:none;margin-top:2px}
    .accordion{display:flex;flex-direction:column;gap:10px;margin:24px 0}
    .accordion details{background:var(--panel);border:1px solid var(--line);border-radius:var(--r-md);overflow:hidden}
    .accordion summary{cursor:pointer;padding:16px 18px;font-weight:600;color:var(--text);font-size:15px;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:14px}
    .accordion summary::-webkit-details-marker{display:none}
    .accordion summary::after{content:"+";font-family:var(--mono);color:var(--accent);font-size:18px;flex:none}
    .accordion details[open] summary::after{content:"−"}
    .accordion-q{flex:1;min-width:0;display:inline}
    .accordion-q code{margin:0 1px}
    .accordion-body{padding:0 18px 18px}
    .accordion-body p{margin:0}
    .trend-list{list-style:none;margin:24px 0;padding:0;display:flex;flex-direction:column;gap:14px}
    .trend-list li{display:flex;gap:16px;align-items:flex-start;background:var(--panel);border:1px solid var(--line);border-radius:var(--r-md);padding:18px}
    .trend-num{font-family:var(--mono);font-size:18px;font-weight:700;color:var(--accent);flex:none;width:28px}
    .trend-list p{margin:0}
    .conclusion-box{background:linear-gradient(180deg,rgba(218,41,28,.06),rgba(218,41,28,.02));border:1px solid var(--accent-line);border-radius:var(--r-lg);padding:28px}
    .conclusion-box p:last-child{margin-bottom:0}
    .faq-section .accordion{margin-bottom:0}
    .post-author{display:flex;align-items:center;gap:12px;margin-top:48px;color:var(--muted);font-size:14px}
    .post-author .dot{width:32px;height:32px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;font-weight:700;font-size:13px}
    .post-nav{display:flex;justify-content:space-between;gap:16px;margin-top:56px;padding-top:24px;border-top:1px solid var(--line)}
    .post-nav a{color:var(--accent);font-size:14px;font-weight:500}
    .post-nav a:hover{text-decoration:underline}
    @media (max-width:1000px){
      .post-layout{grid-template-columns:minmax(0,1fr)}
      .post-toc{display:none}
      .post-body{min-width:0}
      .concept-grid,.attack-surface-grid,.tech-grid,.proto-grid{grid-template-columns:1fr}
      .tech-grid{grid-template-columns:1fr}
      .technique-row,.technique-row.reverse{grid-template-columns:1fr}
      .timeline-item{grid-template-columns:80px 1fr}
    }
  </style>
</head>
<body data-screen-label="Marketing — Blog Post">

<div id="site-nav"></div>

<section class="page-hero" style="padding-bottom:40px">
  <div class="grid-bg"></div>
  <div class="container" style="position:relative">
    <span class="eyebrow"><a href="/blog/" style="color:inherit">Guide</a></span>
    <h1 class="gradient-text" style="max-width:800px;font-size:clamp(32px, 4.5vw, 48px);line-height:1.2">${escapeHtml(post.title)}</h1>
    <p class="post-hero-desc">${escapeHtml(post.excerpt)}</p>
    <div class="post-meta">
      <span class="tag">${escapeHtml(post.category)}</span>
      <span class="sep">&bull;</span>
      <span>${escapeHtml(post.displayDate)}</span>
      <span class="sep">&bull;</span>
      <span>${escapeHtml(post.readTime)}</span>
      <span class="sep">&bull;</span>
      <span>By ${escapeHtml(post.author)}</span>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="post-layout">
      <aside class="post-toc" aria-label="Table of contents">
        <h4>On this page</h4>
        <ul>
          ${tocHtml}
        </ul>
      </aside>
      <article class="post-body">
        ${dnsSecurityContent.render()}
        ${postAuthor(post)}
        ${postNav(index)}
      </article>
    </div>
  </div>
</section>

${postFoot(post)}`;
}

const postPageTemplate = (post, index) => {
  if (post.slug === DNS_SECURITY_SLUG) {
    return dnsSecurityTemplate(post, index);
  }
  return genericPostTemplate(post, index);
};

posts.forEach((post, index) => {
  fs.writeFileSync(path.join(POSTS_DIR, `${post.slug}.html`), postPageTemplate(post, index), 'utf-8');
  // Directory-based page under /blog/{slug}/
  const postDir = path.join(BLOG_DIR, post.slug);
  fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(
    path.join(postDir, 'index.html'),
    postPageTemplate(post, index)
  );
});

// Update _redirects: remove any old blog rules
let redirects = '';
if (fs.existsSync(REDIRECTS_FILE)) {
  redirects = fs.readFileSync(REDIRECTS_FILE, 'utf-8');
  redirects = redirects.split('\n').filter(line => !line.trim().startsWith('/blog')).join('\n');
  if (!redirects.endsWith('\n')) redirects += '\n';
}

fs.writeFileSync(REDIRECTS_FILE, redirects, 'utf-8');

console.log(`Generated ${posts.length} blog posts in blog-posts/ and blog/{slug}/`);
console.log('Updated blog.html and blog/index.html listing');
console.log('Updated _redirects');
