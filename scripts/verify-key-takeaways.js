const fs = require('fs');
const path = require('path');

const files = [
  'blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html',
  'blog/what-is-dns-how-domain-name-system-works/index.html',
  'blog/dns-firewall-explained-how-dns-firewalls-protect-networks/index.html',
  'blog/cyrillic-homoglyphs/index.html',
  'blog/dns-cheapest-zero-trust-control/index.html',
  'blog/inside-dga-classifier/index.html',
  'blog/mcp-tools-openapi/index.html',
  'blog/scoped-api-keys/index.html'
];

for (const f of files) {
  const content = fs.readFileSync(path.resolve(f), 'utf8');
  const ktNew = (content.match(/class="kt-wrap"/g) || []).length;
  const ktOld = (content.match(/id="key-takeaways-title"/g) || []).length;
  const tocNew = (content.match(/href="#key-takeaways-title"/g) || []).length;
  const cssMatch = content.match(/site\.css\?v=(\d+)/);
  const css = cssMatch ? `v${cssMatch[1]}` : 'NONE';
  console.log(`${f} | kt-wrap=${ktNew} | legacy-kt=${ktOld} | toc-link=${tocNew} | css=${css}`);
}
