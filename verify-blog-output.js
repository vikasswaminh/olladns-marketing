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

console.log('\n--- DNS Firewall Post Structure ---');
const fwPath = 'blog/dns-firewall-explained-how-dns-firewalls-protect-networks/index.html';
const fwHtml = fs.readFileSync(fwPath, 'utf8');
const fwChecks = [
  ['has <article class="post-body">', /<article[^>]*class=['"][^'"]*post-body/],
  ['sticky TOC container (.post-toc)', /class=['"][^'"]*post-toc/],
  ['TL;DR box (.post-tldr)', /class=['"][^'"]*post-tldr/],
  ['numbered sections (.post-section)', /class=['"][^'"]*post-section/],
  ['section numbers (.section-num)', /class=['"][^'"]*section-num/],
  ['DNS flow diagram (.dns-flow)', /class=['"][^'"]*dns-flow/],
  ['technique rows (.technique-row)', /class=['"][^'"]*technique-row/],
  ['code box (.code-box)', /class=['"][^'"]*code-box/],
  ['concept grid (.concept-grid)', /class=['"][^'"]*concept-grid/],
  ['attack surface grid (.attack-surface-grid)', /class=['"][^'"]*attack-surface-grid/],
  ['tech grid (.tech-grid)', /class=['"][^'"]*tech-grid/],
  ['comparison table (<table>)', /<table[\s>]/],
  ['roadmap list (.roadmap)', /class=['"][^'"]*roadmap/],
  ['checklist (.checklist)', /class=['"][^'"]*checklist/],
  ['accordion details (<details>)', /<details[\s>]/],
  ['trend list (.trend-list)', /class=['"][^'"]*trend-list/],
  ['conclusion box (.conclusion-box)', /class=['"][^'"]*conclusion-box/],
  ['post author (.post-author)', /class=['"][^'"]*post-author/],
  ['post navigation (.post-nav)', /class=['"][^'"]*post-nav/],
  ['og:image present', /property=['"]og:image/]
];
for (const [label, re] of fwChecks) {
  const m = fwHtml.match(re);
  console.log(label + ':', m ? (Array.isArray(m) ? m.length : 1) : 'MISSING');
}
const fwSections = (fwHtml.match(/<section[^>]*class=['"][^'"]*post-section/g) || []).length;
const fwH2s = (fwHtml.match(/<h2[\s>]/g) || []).length;
const fwDetails = (fwHtml.match(/<details[\s>]/g) || []).length;
const fwTables = (fwHtml.match(/<table[\s>]/g) || []).length;
console.log('sections:', fwSections, '| h2:', fwH2s, '| details:', fwDetails, '| tables:', fwTables);

console.log('\n--- Generated Post Files ---');
const posts = JSON.parse(fs.readFileSync('blog.json', 'utf8'));
for (const p of posts) {
  const flat = `blog-posts/${p.slug}.html`;
  const dir = `blog/${p.slug}/index.html`;
  const flatExists = fs.existsSync(flat);
  const dirExists = fs.existsSync(dir);
  const isDns = p.slug === 'what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026';
  const isFw = p.slug === 'dns-firewall-explained-how-dns-firewalls-protect-networks';
  console.log(p.slug, '| flat:', flatExists ? 'yes' : 'NO', '| dir:', dirExists ? 'yes' : 'NO', isDns ? '(DNS template)' : isFw ? '(firewall template)' : '(generic template)');
}

console.log('\n--- Listing Pages ---');
// The listings feature the three newest posts; older posts are catalog-only.
const listed = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
for (const p of ['blog.html', 'blog/index.html']) {
  const html = fs.readFileSync(p, 'utf8');
  const cards = (html.match(/class=['"][^'"]*blog-card/g) || []).length;
  console.log(p, 'cards:', cards);
  for (const post of listed) {
    if (!html.includes(`href="/blog/${post.slug}/"`)) console.log('  MISSING card for:', post.slug);
  }
}

console.log('\n--- Nav Chain (older -> newer) ---');
const chain = [
  'what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026',
  'what-is-dns-how-domain-name-system-works',
  'dns-firewall-explained-how-dns-firewalls-protect-networks'
];
for (let i = 0; i < chain.length - 1; i++) {
  const older = chain[i], newer = chain[i + 1];
  for (const file of [`blog/${newer}/index.html`, `blog-posts/${newer}.html`]) {
    const html = fs.readFileSync(file, 'utf8');
    console.log(`${file} prev-> ${older.slice(0, 24)}:`, html.includes(`href="/blog/${older}/"`) ? 'ok' : 'MISSING');
  }
  for (const file of [`blog/${older}/index.html`, `blog-posts/${older}.html`]) {
    const html = fs.readFileSync(file, 'utf8');
    console.log(`${file} next-> ${newer.slice(0, 24)}:`, html.includes(`href="/blog/${newer}/"`) ? 'ok' : 'MISSING');
  }
}
