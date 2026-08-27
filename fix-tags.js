const fs = require('fs');

const dnsPath = 'blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html';
let dnsHtml = fs.readFileSync(dnsPath, 'utf8');

// The incorrect tags are right after the first .what-found div ends
// and before the first post-section
dnsHtml = dnsHtml.replace(/<\/div>\s*<\/div>\s*<\/section>\s*<section class="post-section"/, '</div>\n\n          <section class="post-section"');

fs.writeFileSync(dnsPath, dnsHtml);

const dnsFlatPath = 'blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html';
let dnsFlatHtml = fs.readFileSync(dnsFlatPath, 'utf8');
dnsFlatHtml = dnsFlatHtml.replace(/<\/div>\s*<\/div>\s*<\/section>\s*<section class="post-section"/, '</div>\n\n          <section class="post-section"');
fs.writeFileSync(dnsFlatPath, dnsFlatHtml);

console.log('Fixed early closing tags');
