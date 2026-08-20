const fs = require('fs');

function reviewDns() {
  const html = fs.readFileSync('blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html', 'utf8');
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const css = styleMatch ? styleMatch[1] : '';

  const findings = [];

  if (!css.includes('overflow-x') && !css.includes('post-table-wrap')) {
    findings.push('WARN: comparison table has no horizontal-scroll wrapper; may overflow on narrow viewports.');
  }

  if (!/pre\s*\{[^}]*overflow/.test(css)) {
    findings.push('WARN: pre blocks lack explicit overflow-x:auto; long lines may break layout.');
  }

  if (!/\.post-toc/.test(css)) findings.push('WARN: .post-toc styles missing.');
  if (!/\.concept-grid/.test(css)) findings.push('WARN: .concept-grid styles missing.');
  if (!/\.attack-surface-grid/.test(css)) findings.push('WARN: .attack-surface-grid styles missing.');
  if (!/\.tech-grid/.test(css)) findings.push('WARN: .tech-grid styles missing.');
  if (!/\.proto-grid/.test(css)) findings.push('WARN: .proto-grid styles missing.');
  if (!/\.dns-flow/.test(css)) findings.push('WARN: .dns-flow styles missing.');
  if (!/\.timeline/.test(css)) findings.push('WARN: .timeline styles missing.');
  if (!/\.roadmap/.test(css)) findings.push('WARN: .roadmap styles missing.');
  if (!/\.checklist/.test(css)) findings.push('WARN: .checklist styles missing.');
  if (!/\.accordion/.test(css)) findings.push('WARN: .accordion styles missing.');
  if (!/\.conclusion-box/.test(css)) findings.push('WARN: .conclusion-box styles missing.');

  const hero = html.match(/<section class="page-hero"/);
  findings.push(hero ? 'OK: hero section present.' : 'ERROR: hero section missing.');

  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"\/>/);
  findings.push(ogImage ? 'OK: og:image present.' : 'ERROR: og:image missing.');

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"\/>/);
  findings.push(canonical ? 'OK: canonical present: ' + canonical[1] : 'ERROR: canonical missing');

  const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  const sectionIds = ids.filter(id => /^[a-z]/.test(id));
  const tocLinks = [...html.matchAll(/<a href="#([^"]+)"/g)].map(m => m[1]);
  const missing = sectionIds.filter(id => !tocLinks.includes(id));
  findings.push(`INFO: section ids=${sectionIds.length}, toc links=${tocLinks.length}, unmatched=[${missing.join(', ') || 'none'}]`);

  const emptySections = [...html.matchAll(/<section[^>]*class="post-section"[^>]*>([\s\S]*?)<\/section>/g)]
    .filter(m => m[1].replace(/<[^>]+>/g, '').trim().length < 20);
  findings.push(emptySections.length ? `WARN: ${emptySections.length} near-empty sections found.` : 'OK: no near-empty sections.');

  return findings;
}

function reviewGeneric() {
  const posts = JSON.parse(fs.readFileSync('blog.json', 'utf8'));
  const generic = posts.find(p => p.slug !== 'what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026');
  if (!generic) {
    return ['INFO: no generic posts in blog.json; skipping generic review.'];
  }
  const html = fs.readFileSync(`blog/${generic.slug}/index.html`, 'utf8');
  const findings = [];
  const checks = [
    ['article body', /<article[^>]*class=['"][^'"]*post-body/],
    ['hero thumb', /class=['"][^'"]*post-thumb/],
    ['post author', /class=['"][^'"]*post-author/],
    ['post nav', /class=['"][^'"]*post-nav/],
    ['generic lede', /class=['"][^'"]*lede/]
  ];
  for (const [label, re] of checks) {
    findings.push((re.test(html) ? 'OK: ' : 'ERROR: ') + label);
  }
  const hasToc = /class=['"][^'"]*post-toc/.test(html);
  findings.push((!hasToc ? 'OK: no DNS-style TOC on generic post.' : 'WARN: generic post has TOC.'));
  findings.push(`INFO: h2=${(html.match(/<h2[\s>]/g) || []).length}, h3=${(html.match(/<h3[\s>]/g) || []).length}`);
  return findings;
}

console.log('=== DNS Security Post Review ===');
console.log(reviewDns().join('\n'));
console.log('\n=== Generic Post Review (dns-cheapest-zero-trust-control) ===');
console.log(reviewGeneric().join('\n'));
