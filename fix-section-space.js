const fs = require('fs');

function processHtml(path) {
  let html = fs.readFileSync(path, 'utf8');

  // First, we must restore what the fuzzy tool deleted in blog/what-is-dns.../index.html
  // It deleted from `      background: var(--bg-2);` to `      font-family: var(--mono);`
  // We need to look for where it merged them:
  // `.post-body code {\n      font-family: var(--mono);\n      font-size: 13px;\n      font-size: 12px;`
  // And replace it with the correct CSS block, WITH margin-bottom: 40px for .post-section.

  html = html.replace(
    /\.post-body code \{\s*font-family: var\(--mono\);\s*font-size: 13px;\s*font-size: 12px;/,
    `.post-body code {
      font-family: var(--mono);
      font-size: 13px;
      background: var(--bg-2);
      padding: 2px 7px;
      border-radius: 5px;
      color: var(--text)
    }

    .post-section {
      position: relative;
      margin-bottom: 40px;
      padding-top: 8px;
      scroll-margin-top: 92px
    }

    .section-num {
      display: block;
      font-family: var(--mono);
      font-size: 12px;`
  );

  // Now for blog-posts/...html, which didn't have the fuzzy replace run on it yet:
  // It still has margin-bottom: 72px;
  html = html.replace(
    /\.post-section \{\s*position: relative;\s*margin-bottom: 72px;\s*padding-top: 8px;\s*scroll-margin-top: 92px\s*\}/,
    `.post-section {
      position: relative;
      margin-bottom: 40px;
      padding-top: 8px;
      scroll-margin-top: 92px
    }`
  );

  fs.writeFileSync(path, html);
}

processHtml('blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html');
processHtml('blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html');

console.log('Fixed section spacing and restored deleted css');
