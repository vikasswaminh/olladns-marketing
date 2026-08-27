const fs = require('fs');
const file = 'blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<div class="section-box">\s*<section class="post-section"/g, '<section class="post-section"');
content = content.replace(/<\/section>\s*<\/div>/g, '</section>');
fs.writeFileSync(file, content);
console.log('Done');
