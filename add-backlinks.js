const fs = require('fs');
const cheerio = require('cheerio');

/**
 * Backlink map: keyword/phrase → { href, title }
 * These are internal olladns links to be injected contextually throughout the article.
 */
const backlinks = [
  // Product pages
  { phrase: 'protective DNS resolver', href: '/product.html', title: 'See olladns Protective DNS' },
  { phrase: 'protective DNS resolvers', href: '/product.html', title: 'See olladns Protective DNS' },
  { phrase: 'protective resolver', href: '/product.html', title: 'olladns Protective DNS Resolver' },
  { phrase: 'DNS filtering', href: '/blog/dns-filtering-explained/', title: 'DNS Filtering Explained' },
  { phrase: 'DNS firewall', href: '/blog/dns-firewall-explained-how-dns-firewalls-protect-networks/', title: 'DNS Firewall Explained' },
  { phrase: 'DNS firewalls', href: '/blog/dns-firewall-explained-how-dns-firewalls-protect-networks/', title: 'How DNS Firewalls Work' },
  { phrase: 'DNS security', href: '/blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/', title: 'What Is DNS Security? A Complete Guide' },
  { phrase: 'zero trust', href: '/blog/dns-cheapest-zero-trust-control/', title: 'DNS: The Cheapest Zero-Trust Control' },
  { phrase: 'DGA', href: '/blog/inside-dga-classifier/', title: 'Inside Our DGA Classifier' },
  { phrase: 'domain generation algorithms', href: '/blog/inside-dga-classifier/', title: 'Inside Our DGA Classifier' },
  { phrase: 'Cyrillic homoglyphs', href: '/blog/cyrillic-homoglyphs/', title: 'Cyrillic Homoglyphs and DNS Phishing' },
  { phrase: 'lookalike domain', href: '/blog/cyrillic-homoglyphs/', title: 'How Lookalike Domains Work' },
  { phrase: 'lookalike domains', href: '/blog/cyrillic-homoglyphs/', title: 'How Lookalike Domains Work' },
  { phrase: 'phishing domain', href: '/security.html', title: 'olladns DNS Security' },
  { phrase: 'phishing page', href: '/security.html', title: 'olladns DNS Security' },
  { phrase: 'phishing pages', href: '/security.html', title: 'olladns DNS Security' },
  { phrase: 'command-and-control', href: '/security.html', title: 'Block C2 Traffic with olladns' },
  { phrase: 'malware command-and-control', href: '/security.html', title: 'Block C2 with olladns' },
  { phrase: 'pricing', href: '/pricing.html', title: 'olladns Pricing' },
  { phrase: 'developers', href: '/developers.html', title: 'olladns Developer API' },
  { phrase: 'API', href: '/developers.html', title: 'olladns Developer API' },
  { phrase: 'solutions', href: '/solutions.html', title: 'olladns Solutions' },
];

function insertBacklinks(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // Track which phrases we've already linked (link each only once per page)
  const linked = new Set();

  // Process text nodes inside the main article body only
  const article = $('article, .post-body, [class*="post-section"]');
  
  // We'll do string replacement on the full HTML, but only inside the article area
  // Work on each post-section individually to avoid touching TOC/nav
  $('.post-section').each((secIdx, section) => {
    // Convert the section HTML to string, do replacements, then put back
    let sectionHtml = $(section).html();
    
    backlinks.forEach(({ phrase, href, title }) => {
      if (linked.has(phrase)) return;
      
      // Make sure the phrase exists and is NOT already inside an <a> tag
      // Use a regex that doesn't match inside HTML tags or existing links
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?<!<[^>]*)\\b(${escapedPhrase})\\b(?![^<]*<\\/a>)`, 'i');
      
      if (regex.test(sectionHtml)) {
        sectionHtml = sectionHtml.replace(regex, (match) => {
          linked.add(phrase);
          return `<a href="${href}" title="${title}" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--accent-line);">${match}</a>`;
        });
      }
    });
    
    $(section).html(sectionHtml);
  });

  fs.writeFileSync(filePath, $.html());
  console.log(`Added ${linked.size} backlinks in ${filePath}`);
  console.log('Linked phrases:', [...linked].join(', '));
}

insertBacklinks('blog/what-is-dns-how-domain-name-system-works/index.html');
insertBacklinks('blog-posts/what-is-dns-how-domain-name-system-works.html');
