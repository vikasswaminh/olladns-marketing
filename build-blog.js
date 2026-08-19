const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'blog-posts');
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
    return post.image.startsWith('http') || post.image.startsWith('/') ? post.image : `../${post.image}`;
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

const cardsHtml = posts.map(p => `
      <a class="blog-card" href="blog-posts/${p.slug}.html">
        <div class="thumb">
          <img src="${imageUrl(p)}" alt="${escapeHtml(p.title)}" loading="lazy"/>
        </div>
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
  <link rel="stylesheet" href="site.css?v=light-2026-06-05"/>
  <style>
    .blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .blog-card{padding:0;border:1px solid var(--line);border-radius:var(--r-md);background:var(--panel);display:flex;flex-direction:column;transition:.15s;overflow:hidden}
    .blog-card:hover{border-color:var(--line-2)}
    .blog-card .thumb{aspect-ratio:16/10;background:var(--bg-2);position:relative;overflow:hidden;border-bottom:1px solid var(--line)}
    .blog-card .thumb img{width:100%;height:100%;object-fit:cover;display:block}
    .blog-card .body{padding:22px;display:flex;flex-direction:column;gap:12px;flex:1}
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
        <a class="btn primary lg" href="contact.html">Subscribe <span data-ic="arrow"></span></a>
      </div>
    </div>
  </div>
</section>

<div id="site-footer"></div>

<script src="chrome.js"></script>
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

const postPageTemplate = (post, index) => {
  const prev = prevPost(index);
  const next = nextPost(index);
  const prevLink = prev ? `<a href="${prev.slug}.html">← ${escapeHtml(prev.title)}</a>` : `<a href="../blog.html">← All posts</a>`;
  const nextLink = next ? `<a href="${next.slug}.html">${escapeHtml(next.title)} →</a>` : '';
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
  <meta property="og:url" content="https://olladns.com/blog-posts/${post.slug}.html"/>
  <meta property="og:image" content="${ogImage.startsWith('http') ? ogImage : 'https://olladns.com' + (ogImage.startsWith('/') ? '' : '/') + ogImage.replace(/^\.\.\//, '')}"/>
  <meta property="article:published_time" content="${post.date}"/>
  <meta property="article:author" content="${escapeHtml(post.author)}"/>
  <meta property="article:section" content="${escapeHtml(post.category)}"/>
  <link rel="canonical" href="https://olladns.com/blog-posts/${post.slug}.html"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="../site.css?v=light-2026-06-05"/>
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
    .post-body pre{background:var(--bg-1);border:1px solid var(--line);border-radius:var(--r-md);padding:18px;overflow:auto;margin:22px 0}
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

<section class="page-hero" style="padding-bottom:40px">
  <div class="grid-bg"></div>
  <div class="container" style="position:relative">
    <span class="eyebrow"><a href="../blog.html" style="color:inherit">Blog</a></span>
    <h1 class="gradient-text">${escapeHtml(post.title)}</h1>
    <div class="post-meta">
      <span class="tag">${escapeHtml(post.category)}</span>
      <span>${escapeHtml(post.displayDate)}</span>
      <span>${escapeHtml(post.readTime)}</span>
      <span>by ${escapeHtml(post.author)}</span>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <article class="post-body">
      <div class="post-thumb">
        <img src="${imageUrl(post, { hero: true })}" alt="${escapeHtml(post.title)}"/>
      </div>

      ${post.content}

      <div class="post-author">
        <span class="dot">${escapeHtml(post.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase())}</span>
        <span>Written by <strong style="color:var(--text)">${escapeHtml(post.author)}</strong> · ${escapeHtml(post.category)}</span>
      </div>

      <div class="post-nav">
        ${prevLink}
        ${nextLink}
      </div>
    </article>
  </div>
</section>

<div id="site-footer"></div>

<script src="../chrome.js"></script>
<script>
  mountChrome('blog');
</script>
</body>
</html>
`;
};

posts.forEach((post, index) => {
  fs.writeFileSync(path.join(POSTS_DIR, `${post.slug}.html`), postPageTemplate(post, index), 'utf-8');
});

// Update _redirects with /blog/{slug} -> /blog-posts/{slug}.html
let redirects = '';
if (fs.existsSync(REDIRECTS_FILE)) {
  redirects = fs.readFileSync(REDIRECTS_FILE, 'utf-8');
  // Remove old blog-posts redirects to avoid duplicates
  redirects = redirects.split('\n').filter(line => !line.trim().startsWith('/blog/')).join('\n');
  if (!redirects.endsWith('\n')) redirects += '\n';
}

const blogRedirects = posts.map(p => `/blog/${p.slug}        /blog-posts/${p.slug}.html       302`).join('\n');
redirects += '\n# Blog article redirects (auto-generated by build-blog.js)\n' + blogRedirects + '\n';
fs.writeFileSync(REDIRECTS_FILE, redirects, 'utf-8');

console.log(`Generated ${posts.length} blog posts in blog-posts/`);
console.log('Updated blog.html listing');
console.log('Updated _redirects');
