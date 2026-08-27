const fs = require('fs');

function processHtml(path) {
  let html = fs.readFileSync(path, 'utf8');

  // 1. Remove the premature closing tags before the first section
  html = html.replace(/<\/div>\s*<\/div>\s*<\/section>\s*(<div class="section-box">\s*)?<section class="post-section" id="the-layer-nobody-watches">/, '<section class="post-section" id="the-layer-nobody-watches">');

  // 2. Remove the duplicated what-found section with the logo between section 2 and 3
  const regexWhatFound = /<div class="what-found">\s*<div class="what-found-head">\s*<svg[\s\S]*?<\/svg>\s*<h4>What We Found<\/h4>\s*<\/div>[\s\S]*?<\/div>/;
  html = html.replace(regexWhatFound, '');

  // 3. Remove <div class="section-box"> wrappers around sections
  html = html.replace(/<div class="section-box">\s*(<section class="post-section"[\s\S]*?<\/section>)\s*<\/div>/g, '$1');

  // 4. Update max-width in CSS for post-body to none, like the reference blog
  html = html.replace(/\.post-body\s*{\s*max-width:\s*780px/, '.post-body {\n      max-width: none');

  // 5. Update post-layout grid to match reference
  html = html.replace(/grid-template-columns:\s*260px\s+minmax\(0,\s*1fr\)/, 'grid-template-columns: 240px 1fr');

  fs.writeFileSync(path, html);
}

processHtml('blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html');
processHtml('blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html');

console.log('Fixed everything cleanly.');
