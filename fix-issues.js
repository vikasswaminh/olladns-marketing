const fs = require('fs');
const cheerio = require('cheerio');

function fixIssues(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Fix date: Aug 20 -> Aug 21
  html = html.replace(/Aug 20, 2026/g, 'Aug 21, 2026');
  html = html.replace(/2026-08-20/g, '2026-08-21');

  // 2. Fix code-box pre background from black #0b0f19 to website var
  html = html.replace(/background: #0b0f19;/g, 'background: var(--bg-1);');
  // Also fix the code text color since bg is now light
  html = html.replace(/\.code-box pre code \{[\s\S]*?color: #e5e7eb;[\s\S]*?background: transparent;/g, (match) => {
    return match.replace('color: #e5e7eb;', 'color: var(--text);');
  });

  fs.writeFileSync(filePath, html);
  console.log('Fixed date and code-box in ' + filePath);
}

fixIssues('blog/what-is-dns-how-domain-name-system-works/index.html');
fixIssues('blog-posts/what-is-dns-how-domain-name-system-works.html');
