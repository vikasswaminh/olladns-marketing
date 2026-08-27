const fs = require('fs');

function fixStrayDiv(path) {
  let html = fs.readFileSync(path, 'utf8');

  // Match the end of Section 1 and the stray </div> before Section 2
  const regex = /<\/section>\s*<\/div>\s*<section class="post-section" id="what-dns-does">/;
  html = html.replace(regex, '</section>\n\n          <section class="post-section" id="what-dns-does">');

  fs.writeFileSync(path, html);
}

fixStrayDiv('blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html');
fixStrayDiv('blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html');

console.log('Fixed stray div');
