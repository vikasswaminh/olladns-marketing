const fs = require('fs');
const cheerio = require('cheerio');

function refineDesign(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // Helper to extract html
  function getHtml(node) {
    return $(node).html();
  }

  // --- REWORK SECTION 9 ---
  // ID: encrypting-dns-doh-dot-and-doq
  const sec9 = $('#encrypting-dns-doh-dot-and-doq');
  if (sec9.length) {
    const grid = sec9.find('.concept-grid');
    if (grid.length) {
      const cards = grid.find('.surface-card').toArray();
      let newHtml = '';
      
      cards.forEach((card, i) => {
        const title = $(card).find('h4').text();
        const desc = $(card).find('p').html();
        
        const reverseClass = (i % 2 !== 0) ? ' reverse' : '';
        
        newHtml += `
          <div class="technique-row${reverseClass}" style="background: transparent; border: none; padding: 0; box-shadow: none;">
            <div class="technique-visual">
              <div class="visual-card">
                <div class="visual-label">Protocol</div>
                <div class="concept-ic" style="margin: 0 auto 10px auto;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                <h4 style="margin:0; font-size:18px;">${title}</h4>
              </div>
            </div>
            <div class="technique-text">
              <p>${desc}</p>
            </div>
          </div>
        `;
      });
      grid.replaceWith(newHtml);
    }
  }

  // --- REWORK SECTION 15 (FAQ) ---
  // ID: frequently-asked-questions
  const sec15 = $('#frequently-asked-questions');
  if (sec15.length) {
    const grid = sec15.find('.concept-grid');
    if (grid.length) {
      const cards = grid.find('.tech-card').toArray();
      let faqHtml = '<div class="faq-accordion" style="margin-top: 32px;">';
      
      cards.forEach(card => {
        const q = $(card).find('h4').text();
        const a = $(card).find('p').html();
        
        faqHtml += `
          <details class="faq-item" style="border-bottom: 1px solid var(--line); padding: 16px 0;">
            <summary style="font-size: 18px; font-weight: 600; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; color: var(--text);">
              <span>${q}</span>
              <span class="faq-icon" style="color: var(--accent); font-size: 24px; font-weight: 400;">+</span>
            </summary>
            <div style="padding-top: 12px; font-size: 15.5px; line-height: 1.7; color: var(--text-2);">
              <p style="margin:0;">${a}</p>
            </div>
          </details>
        `;
      });
      faqHtml += '</div>';
      
      grid.replaceWith(faqHtml);
    }
  }

  // Add small CSS snippet for FAQ to hide the default triangle and toggle the + to an x
  const styleBlock = $('style');
  if (styleBlock.length) {
    let css = styleBlock.html();
    if (!css.includes('.faq-item summary::-webkit-details-marker')) {
      css += `
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item[open] .faq-icon { transform: rotate(45deg); transition: 0.2s; }
        .faq-item:not([open]) .faq-icon { transform: rotate(0deg); transition: 0.2s; }
      `;
      styleBlock.html(css);
    }
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Refined design in ' + filePath);
}

refineDesign('blog/what-is-dns-how-domain-name-system-works/index.html');
refineDesign('blog-posts/what-is-dns-how-domain-name-system-works.html');

