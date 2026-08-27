const fs = require('fs');
const path = 'blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html';
let html = fs.readFileSync(path, 'utf8');

html = html.replace('<h1>What Is DNS Security?<br>A Complete Guide to Protecting Your Network in 2026</h1>', '<h1 style="max-width: none;">What Is DNS Security?<br>A Complete Guide to Protecting Your Network in 2026</h1>');

fs.writeFileSync(path, html);
console.log('Patched blog-posts');
