const fs = require('fs');

function centerHero(path) {
  let html = fs.readFileSync(path, 'utf8');

  // Center the entire container in the hero so the eyebrow, title, description, and meta are all centered nicely
  html = html.replace('<div class="container" style="position:relative">', '<div class="container" style="position:relative; text-align: center; display: flex; flex-direction: column; align-items: center;">');

  fs.writeFileSync(path, html);
}

centerHero('blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html');
centerHero('blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html');

console.log('Centered hero content');
