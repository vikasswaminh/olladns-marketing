const fs = require('fs');

function processHtml(path) {
  let html = fs.readFileSync(path, 'utf8');

  // 1. Close the post-tldr and its ul before Key Takeaways
  html = html.replace(
    /(\s*)<!-- Key Takeaways -->/,
    '$1</ul>\n$1</div>\n\n$1<!-- Key Takeaways -->'
  );

  // 2. Close the what-found box before the first section
  html = html.replace(
    /(\s*)(<li><span class="ck">✓<\/span><span>Modern stack reduces phishing, ransomware, and data exfiltration\.<\/span><\/li>\s*<\/ul>)\s*<section class="post-section" id="the-layer-nobody-watches">/,
    '$1$2\n$1</div>\n\n$1<section class="post-section" id="the-layer-nobody-watches">'
  );

  // 3. Style the Table of Contents to be a nice box
  html = html.replace(
    /\.post-toc \{\s*position: sticky;\s*top: 88px;\s*max-height: calc\(100vh - 120px\);\s*overflow: auto;\s*padding-right: 10px\s*\}/,
    `.post-toc {
      position: sticky;
      top: 100px;
      max-height: calc(100vh - 120px);
      overflow: auto;
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }`
  );

  // 4. Remove any duplicate post-toc style in media queries that might conflict
  html = html.replace(
    /\.post-toc \{\s*position: static;\s*max-height: none;\s*overflow: visible;\s*background: var\(--bg-1\);\s*border: 1px solid var\(--line\);\s*border-radius: var\(--r-md\);\s*padding: 18px\s*\}/,
    `.post-toc {
          position: static;
          max-height: none;
          overflow: visible;
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: var(--r-lg);
          padding: 24px;
          margin-bottom: 32px;
        }`
  );

  fs.writeFileSync(path, html);
}

processHtml('blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html');
processHtml('blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html');

console.log('Fixed boxes cleanly.');
