const fs = require('fs');
const cheerio = require('cheerio');

function upgrade7to11(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  function getHtml(node) {
    return $(node).html();
  }

  // --- SECTION 7: Who runs the resolvers you use ---
  // ID: who-runs-the-resolvers-you-use
  const sec7 = $('#who-runs-the-resolvers-you-use');
  if (sec7.length) {
    const paras = sec7.find('p').toArray();
    // Keep the first p as intro
    // Convert the next three p into a concept grid
    if (paras.length >= 4) {
      let gridHtml = '<div class="concept-grid">';
      
      const p1 = $(paras[1]);
      gridHtml += `
        <div class="concept-card">
          <h4>ISP Resolvers</h4>
          <p>${getHtml(p1).replace(/^By default, most home and mobile connections use whatever resolver the ISP provides automatically\.\s*/, '')}</p>
        </div>
      `;
      p1.remove();

      const p2 = $(paras[2]);
      gridHtml += `
        <div class="concept-card">
          <h4>Public Resolvers</h4>
          <p>${getHtml(p2).replace(/^Public resolvers changed that for many people\.\s*/, '')}</p>
        </div>
      `;
      p2.remove();

      const p3 = $(paras[3]);
      gridHtml += `
        <div class="concept-card" style="grid-column: 1 / -1; border-color: var(--accent-line); background: var(--bg-1);">
          <h4 style="color: var(--accent);">Protective Resolvers (olladns)</h4>
          <p>${getHtml(p3).replace(/^Then there is the category that matters most in business: protective DNS resolvers, the category olladns operates in\.\s*/, '')}</p>
        </div>
      `;
      p3.remove();

      gridHtml += '</div>';
      $(paras[0]).after(gridHtml);
    }
  }

  // --- SECTION 9: Encrypting DNS: DoH, DoT, and DoQ ---
  // ID: encrypting-dns-doh-dot-and-doq
  const sec9 = $('#encrypting-dns-doh-dot-and-doq');
  if (sec9.length) {
    const paras = sec9.find('p').toArray();
    if (paras.length >= 4) {
      let gridHtml = '<div class="concept-grid">';
      
      for (let i = 1; i <= 3; i++) {
        const p = $(paras[i]);
        const strong = p.find('strong').first();
        if (strong.length) {
          const title = strong.text();
          strong.remove();
          const desc = getHtml(p).trim();
          gridHtml += `
            <div class="surface-card">
              <span class="surface-num">0${i}</span>
              <h4>${title}</h4>
              <p>${desc}</p>
            </div>
          `;
          p.remove();
        }
      }
      gridHtml += '</div>';
      $(paras[0]).after(gridHtml);
    }
  }

  // --- SECTION 10: DNS as a security layer, not just plumbing ---
  // ID: dns-as-a-security-layer-not-just-plumbing
  const sec10 = $('#dns-as-a-security-layer-not-just-plumbing');
  if (sec10.length) {
    const paras = sec10.find('p').toArray();
    if (paras.length >= 2) {
      const p1 = $(paras[0]);
      // Extract the comparison into a quote block
      const htmlContent = getHtml(p1);
      const parts = htmlContent.split('A firewall inspects');
      if (parts.length > 1) {
        p1.html(parts[0].trim());
        const quote = `<blockquote class="post-quote"><p>A firewall inspects${parts[1]}</p></blockquote>`;
        p1.after(quote);
      }
    }
  }

  // --- SECTION 11: When DNS breaks ---
  // ID: when-dns-breaks
  const sec11 = $('#when-dns-breaks');
  if (sec11.length) {
    const paras = sec11.find('p').toArray();
    if (paras.length >= 1) {
      const p1 = $(paras[0]);
      const htmlContent = getHtml(p1);
      const quote = `<blockquote class="post-quote" style="border-left-color: var(--muted);"><p style="color: var(--muted);">${htmlContent}</p></blockquote>`;
      p1.replaceWith(quote);
    }
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Upgraded 7-11 layouts in ' + filePath);
}

upgrade7to11('blog/what-is-dns-how-domain-name-system-works/index.html');
upgrade7to11('blog-posts/what-is-dns-how-domain-name-system-works.html');

