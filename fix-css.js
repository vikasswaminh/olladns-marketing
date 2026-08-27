const fs = require('fs');

const fwHtml = fs.readFileSync('blog/dns-firewall-explained-how-dns-firewalls-protect-networks/index.html', 'utf8');
const fwStyleMatch = fwHtml.match(/<style>([\s\S]*?)<\/style>/);
const fwCss = fwStyleMatch[1];

const dnsPath = 'blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html';
let dnsHtml = fs.readFileSync(dnsPath, 'utf8');

// Replace the entire <style> block with the one from the firewall blog
dnsHtml = dnsHtml.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + fwCss + '\n  </style>');

fs.writeFileSync(dnsPath, dnsHtml);

const dnsFlatPath = 'blog-posts/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026.html';
let dnsFlatHtml = fs.readFileSync(dnsFlatPath, 'utf8');
dnsFlatHtml = dnsFlatHtml.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + fwCss + '\n  </style>');
fs.writeFileSync(dnsFlatPath, dnsFlatHtml);

console.log('CSS Replaced successfully');
