const fs = require('fs');

function processHtml(path) {
  let html = fs.readFileSync(path, 'utf8');

  // 1. Change date to Aug 20
  html = html.replace('<span>Aug 19, 2026</span>', '<span>Aug 20, 2026</span>');

  // 2. Add <br> to h1 to split into 2 lines
  html = html.replace('<h1>What Is DNS Security? A Complete Guide to Protecting Your Network in 2026</h1>', '<h1>What Is DNS Security?<br>A Complete Guide to Protecting Your Network in 2026</h1>');

  // 3. Add inline style to page-hero to reduce top padding
  html = html.replace('<section class="page-hero">', '<section class="page-hero" style="padding-top: 40px;">');

  fs.writeFileSync(path, html);
}

processHtml('blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html');
processHtml('blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html');

console.log('Fixed hero section');
