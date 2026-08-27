const fs = require('fs');
const path = 'blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html';
let html = fs.readFileSync(path, 'utf8');

const missingBlock = `
<body data-screen-label="Marketing — Blog Post">
  <div id="site-nav"></div>

  <section class="page-hero" style="padding-top: 40px;">
    <div class="grid-bg"></div>
    <div class="container" style="position:relative">
      <span class="eyebrow"><a href="/blog/" style="color:inherit">DNS Security</a></span>
      <h1 style="max-width: none;">What Is DNS Security?<br>A Complete Guide to Protecting Your Network in 2026</h1>
      <p class="post-hero-desc">DNS is the layer every attacker must touch and almost nobody watches. Here's what DNS
        security means, how attacks exploit it, and how to close the gap — without slowing your team down.</p>
      <div class="post-meta">
        <span class="tag">Guide</span>
        <span class="sep">•</span>
        <span>Aug 20, 2026</span>
`;

// It deleted everything from <body to <span>Aug 20, 2026</span>
// So I need to find `    </style>\n</head>\n\n        <span class="sep">•</span>\n        <span>24 min read</span>`
// and insert the missing block between `</head>` and `<span class="sep">•">`.

html = html.replace(/<\/head>\s*<span class="sep">•<\/span>/, '</head>' + missingBlock + '        <span class="sep">•</span>');

fs.writeFileSync(path, html);
console.log('Restored deleted block');
