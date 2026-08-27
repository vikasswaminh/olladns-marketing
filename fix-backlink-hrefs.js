const fs = require('fs');

function fixBacklinkHrefs(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  const replacements = [
    ['/product.html', 'https://olladns.com/product.html'],
    ['/security.html', 'https://olladns.com/security.html'],
    ['/pricing.html', 'https://olladns.com/pricing.html'],
    ['/developers.html', 'https://olladns.com/developers.html'],
    ['/solutions.html', 'https://olladns.com/solutions.html'],
    ['/blog/dns-filtering-explained/', 'https://olladns.com/blog/dns-filtering-explained/'],
    ['/blog/dns-firewall-explained-how-dns-firewalls-protect-networks/', 'https://olladns.com/blog/dns-firewall-explained-how-dns-firewalls-protect-networks/'],
    ['/blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/', 'https://olladns.com/blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/'],
    ['/blog/dns-cheapest-zero-trust-control/', 'https://olladns.com/blog/dns-cheapest-zero-trust-control/'],
    ['/blog/inside-dga-classifier/', 'https://olladns.com/blog/inside-dga-classifier/'],
    ['/blog/cyrillic-homoglyphs/', 'https://olladns.com/blog/cyrillic-homoglyphs/'],
  ];

  // Replace all occurrences inside the accent-style backlinks we inserted
  // The backlinks have style="color: var(--accent)..." so we target those
  let count = 0;
  replacements.forEach(([relative, absolute]) => {
    // Find all anchor tags with our style that contain the relative href
    const before = html;
    html = html.split('href="' + relative + '"').join('href="' + absolute + '" target="_blank" rel="noopener noreferrer"');
    if (html !== before) {
      count++;
      console.log('Replaced: ' + relative + ' -> ' + absolute);
    }
  });

  fs.writeFileSync(filePath, html);
  console.log('Total replacements: ' + count + ' in ' + filePath);
}

fixBacklinkHrefs('blog/what-is-dns-how-domain-name-system-works/index.html');
fixBacklinkHrefs('blog-posts/what-is-dns-how-domain-name-system-works.html');
