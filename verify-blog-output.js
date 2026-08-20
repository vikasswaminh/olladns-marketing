const fs = require('fs');

const dnsPath = 'blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html';
const dnsHtml = fs.readFileSync(dnsPath, 'utf8');

const checks = [
  ['has <article class="post-body">', /<article[^>]*class=['"][^'"]*post-body/],
  ['sticky TOC container (.post-toc)', /class=['"][^'"]*post-toc/],
  ['concept grid cards (.concept-grid)', /class=['"][^'"]*concept-grid/],
  ['attack surface grid (.attack-surface-grid)', /class=['"][^'"]*attack-surface-grid/],
  ['tech grid (.tech-grid)', /class=['"][^'"]*tech-grid/],
  ['protocol comparison grid (.proto-grid)', /class=['"][^'"]*proto-grid/],
  ['DNS flow diagram (.dns-flow)', /class=['"][^'"]*dns-flow/],
  ['timeline component (.timeline)', /class=['"][^'"]*timeline/],
  ['roadmap list (.roadmap)', /class=['"][^'"]*roadmap/],
  ['checklist (.checklist)', /class=['"][^'"]*checklist/],
  ['accordion details (<details>)', /<details[\s>]/],
  ['comparison table (<table>)', /<table[\s>]/],
  ['FAQ section (#faq)', /id=['"]faq/],
  ['conclusion box (.conclusion-box)', /class=['"][^'"]*conclusion-box/],
  ['post author (.post-author)', /class=['"][^'"]*post-author/],
  ['post navigation (.post-nav)', /class=['"][^'"]*post-nav/]
];

console.log('--- DNS Security Post Structure ---');
for (const [label, re] of checks) {
  const m = dnsHtml.match(re);
  const val = m ? (Array.isArray(m) ? m.length : 1) : 'MISSING';
  console.log(label + ':', val);
}

const h2s = (dnsHtml.match(/<h2[\s>]/g) || []).length;
const h3s = (dnsHtml.match(/<h3[\s>]/g) || []).length;
const details = (dnsHtml.match(/<details[\s>]/g) || []).length;
const tables = (dnsHtml.match(/<table[\s>]/g) || []).length;
const sections = (dnsHtml.match(/<section[^>]*class=['"][^'"]*post-section/g) || []).length;
console.log('sections:', sections, '| h2:', h2s, '| h3:', h3s, '| details:', details, '| tables:', tables);

console.log('\n--- Generated Post Files ---');
const posts = JSON.parse(fs.readFileSync('blog.json', 'utf8'));
for (const p of posts) {
  const flat = `blog-posts/${p.slug}.html`;
  const dir = `blog/${p.slug}/index.html`;
  const flatExists = fs.existsSync(flat);
  const dirExists = fs.existsSync(dir);
  const isDns = p.slug === 'what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026';
  console.log(p.slug, '| flat:', flatExists ? 'yes' : 'NO', '| dir:', dirExists ? 'yes' : 'NO', isDns ? '(DNS template)' : '(generic template)');
}

console.log('\n--- Listing Pages ---');
for (const p of ['blog.html', 'blog/index.html']) {
  const html = fs.readFileSync(p, 'utf8');
  const cards = (html.match(/class=['"][^'"]*blog-card/g) || []).length;
  console.log(p, 'cards:', cards);
}
