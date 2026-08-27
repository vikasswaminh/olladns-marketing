const fs = require('fs');
const cheerio = require('cheerio');

function upgradeBlog3(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // ─── 1. FIX META TAGS (wrong og tags from Blog 2 copy) ───
  $('meta[property="og:title"]').attr('content', 'DNS Filtering Explained: How It Stops Phishing and Malware · olladns Blog');
  $('meta[property="og:description"]').attr('content', 'DNS filtering blocks malicious domains before a connection ever forms. Here\'s exactly how it stops phishing and malware, how it\'s built, and how to deploy it right.');
  $('meta[property="og:url"]').attr('content', 'https://olladns.com/blog/dns-filtering-explained/');
  $('link[rel="canonical"]').attr('href', 'https://olladns.com/blog/dns-filtering-explained/');

  // ─── 2. CENTER THE HERO ───
  const heroContainer = $('section.page-hero .container');
  heroContainer.css('text-align', 'center');
  heroContainer.css('display', 'flex');
  heroContainer.css('flex-direction', 'column');
  heroContainer.css('align-items', 'center');

  // ─── 3. ADD PREMIUM CSS ───
  const premiumCss = `
    /* Premium Blog 3 styles */
    .post-section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      padding: 32px 36px;
      margin-bottom: 24px;
      scroll-margin-top: 92px;
    }
    .concept-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin: 24px 0;
    }
    .concept-card, .surface-card, .tech-card {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 24px;
      transition: border-color .15s;
    }
    .concept-card:hover, .surface-card:hover, .tech-card:hover {
      border-color: var(--accent-line);
    }
    .concept-ic {
      width: 42px; height: 42px;
      border-radius: 10px;
      background: var(--accent-soft);
      color: var(--accent);
      display: grid;
      place-items: center;
      border: 1px solid var(--accent-line);
      margin-bottom: 14px;
    }
    .concept-card h4, .surface-card h4, .tech-card h4 {
      margin: 0 0 10px; font-size: 16px;
    }
    .concept-card p, .surface-card p, .tech-card p {
      margin: 0; font-size: 15px; color: var(--text-2); line-height: 1.65;
    }
    .attack-surface-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin: 26px 0;
    }
    .surface-num {
      font-family: var(--mono);
      font-size: 24px; font-weight: 700;
      color: var(--accent); margin-bottom: 10px;
    }
    .dns-flow {
      display: flex; flex-direction: column; gap: 12px;
      margin: 28px 0; padding: 26px;
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
    }
    .flow-step { display: flex; align-items: center; gap: 16px; }
    .flow-dot {
      width: 12px; height: 12px; border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 4px var(--accent-soft);
      flex: none;
    }
    .flow-card {
      flex: 1; background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-md); padding: 16px 18px;
    }
    .flow-card h4 { margin: 0 0 4px; font-size: 15px; }
    .flow-card p { margin: 0; font-size: 14px; color: var(--muted); line-height: 1.55; }
    .flow-arrow { padding-left: 5px; color: var(--dim); font-size: 14px; }
    .post-quote {
      border-left: 3px solid var(--accent);
      margin: 28px 0; padding: 6px 0 6px 24px;
    }
    .post-quote p {
      font-size: 20px; color: var(--text);
      font-style: italic; margin: 0; line-height: 1.55;
    }
    .what-found {
      background: var(--panel); border: 1px solid var(--line);
      border-radius: var(--r-lg); padding: 26px;
      margin: 28px 0 36px; box-shadow: var(--shadow);
    }
    .what-found-head {
      display: flex; align-items: center;
      gap: 10px; margin-bottom: 14px;
    }
    .tldr-label {
      font-family: var(--mono); font-size: 11px;
      font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; background: var(--accent);
      color: #fff; padding: 5px 12px; border-radius: 999px;
    }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-item[open] .faq-icon { transform: rotate(45deg); }
    .faq-item:not([open]) .faq-icon { transform: rotate(0deg); }
    @media (max-width: 768px) {
      .concept-grid, .attack-surface-grid { grid-template-columns: 1fr; }
      .post-section { padding: 20px; }
    }
  `;

  // Inject CSS before </style> in the existing style block
  const existingStyle = $('style').last();
  existingStyle.html(existingStyle.html() + premiumCss);

  // ─── 4. ADD TL;DR BOX (after hero, before article) ───
  const tldrHtml = `
    <div class="post-tldr" style="margin-bottom: 32px;">
      <div class="tldr-head">
        <span class="tldr-label">TL;DR</span>
        <h3 style="font-size: 20px; margin: 0; color: var(--text);">DNS Filtering in 60 Seconds</h3>
      </div>
      <ul class="tldr-list">
        <li><span class="ck">✓</span> DNS filtering intercepts every lookup before a connection opens — stopping threats at the earliest possible point.</li>
        <li><span class="ck">✓</span> It works by resolving queries through a protective resolver that checks each domain against threat intelligence in milliseconds.</li>
        <li><span class="ck">✓</span> Phishing sites, malware C2 servers, and lookalike domains are blocked before the browser ever loads a byte.</li>
        <li><span class="ck">✓</span> Unlike endpoint tools, DNS filtering covers every device on a network with zero software to install.</li>
        <li><span class="ck">✓</span> It complements firewalls and EDR — it doesn't replace them — but it catches threats earlier.</li>
      </ul>
    </div>
    <div class="what-found" style="margin: 0 0 40px 0;">
      <div class="what-found-head">
        <span class="tldr-label">Key Takeaways</span>
        <h3 style="font-size: 20px; margin: 0; color: var(--text);">What You'll Learn</h3>
      </div>
      <ul style="margin: 0; padding-left: 20px; font-size: 15.5px; line-height: 1.7; color: var(--text-2);">
        <li style="margin-bottom: 8px;"><strong>The Mechanism:</strong> Exactly how a filtering resolver intercepts and blocks a query before a connection forms.</li>
        <li style="margin-bottom: 8px;"><strong>Phishing Defence:</strong> Why DNS is the best choke point to stop phishing — before the page renders.</li>
        <li style="margin-bottom: 8px;"><strong>Malware C2 Blocking:</strong> How filtering cuts off malware's ability to call home to command-and-control servers.</li>
        <li style="margin-bottom: 8px;"><strong>Deployment:</strong> How to roll it out without disrupting your team's legitimate work.</li>
        <li style="margin-bottom: 0;"><strong>Evaluation:</strong> What to look for when choosing a DNS filtering provider.</li>
      </ul>
    </div>
  `;

  // Find the article start and insert TLDR before first section
  const article = $('article.post-body');
  const firstSection = article.find('.post-section').first();
  if (firstSection.length) {
    firstSection.before(tldrHtml);
  }

  // ─── 5. SECTION BOXES already handled by CSS above ───
  // Remove individual margin-bottom from sections (CSS handles it)
  $('.post-section').each(function(i, el) {
    $(el).css('margin-bottom', '');
  });

  // ─── 6. TRANSFORM SECTION 3 (What DNS Filtering Actually Is) - add a flow diagram ───
  const sec3 = $('#what-dns-filtering-actually-is-mechanically');
  if (sec3.length) {
    const flowHtml = `
      <div class="dns-flow" style="margin-top: 24px;">
        <div class="flow-step"><span class="flow-dot"></span>
          <div class="flow-card"><h4>Device sends a DNS query</h4><p>User types a URL or clicks a link. The device queries its configured DNS resolver.</p></div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step"><span class="flow-dot"></span>
          <div class="flow-card"><h4>Filtering resolver receives the query</h4><p>Instead of a plain ISP resolver, the query lands at a protective resolver that checks every domain.</p></div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step"><span class="flow-dot"></span>
          <div class="flow-card"><h4>Domain is checked against threat intelligence</h4><p>The resolver cross-references the domain against blocklists, ML models, and reputation databases — in milliseconds.</p></div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step"><span class="flow-dot"></span>
          <div class="flow-card"><h4>Decision: Allow or Block</h4><p>Clean domains resolve normally. Malicious, suspicious, or policy-violating domains return a blocked response.</p></div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step"><span class="flow-dot"></span>
          <div class="flow-card"><h4>Connection never opens</h4><p>The browser receives a block page or empty response. No data is exchanged with the malicious server.</p></div>
        </div>
      </div>
    `;
    sec3.append(flowHtml);
  }

  // ─── 7. TRANSFORM SECTION 6 (Building Blocks) - concept grid ───
  const sec6 = $('#the-building-blocks-what-s-actually-inside-a-filtering-decision');
  if (sec6.length) {
    const gridHtml = `
      <div class="concept-grid" style="margin-top: 24px;">
        <div class="concept-card">
          <div class="concept-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg></div>
          <h4>Blocklists & Allowlists</h4>
          <p>Curated lists of known-malicious and known-safe domains. Updated continuously from threat intelligence feeds.</p>
        </div>
        <div class="concept-card">
          <div class="concept-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg></div>
          <h4>Domain Age & Reputation</h4>
          <p>Newly registered domains are treated with higher suspicion. Phishing infrastructure is typically freshly created.</p>
        </div>
        <div class="concept-card">
          <div class="concept-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
          <h4>ML Classifiers</h4>
          <p>Machine learning models analyze domain patterns, query behaviour, and network signals to flag suspicious activity in real time.</p>
        </div>
        <div class="concept-card">
          <div class="concept-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18M9 21V9"></path></svg></div>
          <h4>Category Policies</h4>
          <p>Admins can block entire categories (gambling, adult, social media) in addition to known threats — useful for compliance.</p>
        </div>
      </div>
    `;
    sec6.append(gridHtml);
  }

  // ─── 8. TRANSFORM SECTION 8 (Defense Layers) - surface grid ───
  const sec8 = $('#where-dns-filtering-sits-relative-to-your-other-defenses');
  if (sec8.length) {
    const gridHtml = `
      <div class="attack-surface-grid" style="margin-top: 24px;">
        <div class="surface-card">
          <span class="surface-num">01</span>
          <h4>DNS Filtering</h4>
          <p>Blocks malicious domains <em>before</em> a connection opens. Earliest and cheapest intervention point.</p>
        </div>
        <div class="surface-card">
          <span class="surface-num">02</span>
          <h4>Firewall / NGF</h4>
          <p>Inspects traffic <em>once a connection is established</em>. DNS filtering acts earlier — the connection never forms.</p>
        </div>
        <div class="surface-card">
          <span class="surface-num">03</span>
          <h4>Endpoint Detection (EDR)</h4>
          <p>Inspects files and processes <em>after</em> they land on a device. Catches what slips past the network layer.</p>
        </div>
        <div class="surface-card">
          <span class="surface-num">04</span>
          <h4>Email Gateway</h4>
          <p>Scans messages <em>after</em> delivery. DNS filtering stops phishing links from resolving even if email lands in the inbox.</p>
        </div>
      </div>
    `;
    sec8.append(gridHtml);
  }

  // ─── 9. TRANSFORM SECTION 12 FAQ - accordion with separate boxes ───
  const secFaq = $('#frequently-asked-questions');
  if (secFaq.length) {
    const existingContent = secFaq.find('h3, p').toArray();
    const faqPairs = [];
    let currentQ = null;
    existingContent.forEach(el => {
      if ($(el).is('h3')) {
        if (currentQ) faqPairs.push(currentQ);
        currentQ = { q: $(el).text(), a: '' };
      } else if (currentQ && $(el).is('p')) {
        currentQ.a = $(el).html();
      }
    });
    if (currentQ) faqPairs.push(currentQ);

    if (faqPairs.length > 0) {
      let faqHtml = '<div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">';
      faqPairs.forEach(({ q, a }) => {
        faqHtml += `
          <details class="faq-item" style="background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--r-md); overflow: hidden;">
            <summary style="font-size: 16px; font-weight: 600; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; color: var(--text); padding: 18px 22px;">
              <span>${q}</span>
              <span class="faq-icon" style="color: var(--accent); font-size: 18px; font-weight: 300; flex: none; width: 28px; height: 28px; border: 1.5px solid var(--accent-line); border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--accent-soft); transition: transform .2s;">+</span>
            </summary>
            <div style="padding: 14px 22px 18px; font-size: 15.5px; line-height: 1.7; color: var(--text-2); border-top: 1px solid var(--line);">
              <p style="margin: 0;">${a}</p>
            </div>
          </details>
        `;
      });
      faqHtml += '</div>';

      // Remove old h3/p and append accordion
      secFaq.find('h3, p').remove();
      secFaq.append(faqHtml);
    }
  }

  // ─── 10. ADD BACKLINKS ───
  const backlinks = [
    { phrase: 'DNS filtering', href: 'https://olladns.com/product.html', title: 'olladns DNS Filtering' },
    { phrase: 'protective DNS', href: 'https://olladns.com/product.html', title: 'olladns Protective DNS' },
    { phrase: 'protective resolver', href: 'https://olladns.com/product.html', title: 'olladns Protective DNS Resolver' },
    { phrase: 'DNS firewall', href: 'https://olladns.com/blog/dns-firewall-explained-how-dns-firewalls-protect-networks/', title: 'DNS Firewall Explained' },
    { phrase: 'DNS security', href: 'https://olladns.com/blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/', title: 'What Is DNS Security?' },
    { phrase: 'lookalike domain', href: 'https://olladns.com/blog/cyrillic-homoglyphs/', title: 'Lookalike Domains & Cyrillic Homoglyphs' },
    { phrase: 'command-and-control', href: 'https://olladns.com/security.html', title: 'Block C2 with olladns' },
    { phrase: 'zero trust', href: 'https://olladns.com/blog/dns-cheapest-zero-trust-control/', title: 'DNS as Zero Trust Control' },
  ];

  const linked = new Set();
  $('.post-section').each(function(i, sec) {
    let sectionHtml = $(sec).html();
    backlinks.forEach(({ phrase, href, title }) => {
      if (linked.has(phrase)) return;
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?<![a-zA-Z>])${escapedPhrase}(?![a-zA-Z<])`, 'i');
      if (re.test(sectionHtml)) {
        sectionHtml = sectionHtml.replace(re, match => {
          linked.add(phrase);
          return `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--accent-line);">${match}</a>`;
        });
      }
    });
    $(sec).html(sectionHtml);
  });

  fs.writeFileSync(filePath, $.html());
  console.log('Blog 3 upgraded: ' + filePath);
  console.log('Backlinks added: ' + [...linked].join(', '));
}

upgradeBlog3('blog/dns-filtering-explained/index.html');
upgradeBlog3('blog-posts/dns-filtering-explained.html');
