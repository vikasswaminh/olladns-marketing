const fs = require('fs');
const cheerio = require('cheerio');

function upgradeRemaining(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // Helper to extract html
  function getHtml(node) {
    return $(node).html();
  }

  // --- 1. Fix Section 6 Background and "Record" Text ---
  // The user requested to remove the "black background colour" from section 6.
  // The background was coming from `.technique-row` having `background: var(--bg-1)`
  // In `site.css`, var(--bg-1) might be a dark color.
  // We will add inline style `background: transparent; border-color: transparent; padding: 0; margin: 36px 0;` 
  // to the `.technique-row` blocks in Section 6 to match the "website colour only".
  
  // Also we fix the "A record Record" issue.
  $('.technique-row').each((i, el) => {
    $(el).attr('style', 'background: transparent; border: none; padding: 0; box-shadow: none;');
    const label = $(el).find('.visual-label');
    const labelText = label.text();
    if (labelText.endsWith(' record Record')) {
      label.text(labelText.replace(' record Record', ' record'));
    }
  });

  // --- 2. Section 13: DNS myths worth retiring ---
  // ID: dns-myths-worth-retiring
  const sec13 = $('#dns-myths-worth-retiring');
  if (sec13.length) {
    const list = sec13.find('ul');
    if (list.length) {
      const items = list.find('li').toArray();
      let gridHtml = '<div class="concept-grid">';
      
      const icon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'; // X icon for myths
      
      items.forEach((item, i) => {
        const strong = $(item).find('strong').first();
        const title = strong.length ? getHtml(strong).replace(/"/g, '') : `Myth ${i+1}`;
        if (strong.length) strong.remove();
        let desc = getHtml(item).trim();
        
        gridHtml += `
          <div class="concept-card">
            <div class="concept-ic">${icon}</div>
            <h4 style="color: var(--accent);">${title}</h4>
            <p>${desc}</p>
          </div>
        `;
      });
      gridHtml += '</div>';
      list.replaceWith(gridHtml);
    }
  }

  // --- 3. Section 15: Frequently Asked Questions ---
  // ID: frequently-asked-questions
  const sec15 = $('#frequently-asked-questions');
  if (sec15.length) {
    // Collect all h3 and p pairs
    const questions = sec15.find('h3').toArray();
    if (questions.length) {
      let gridHtml = '<div class="concept-grid">';
      
      questions.forEach(q => {
        const title = $(q).text();
        const p = $(q).next('p');
        const desc = p.length ? getHtml(p) : '';
        
        gridHtml += `
          <div class="tech-card">
            <h4>${title}</h4>
            <p>${desc}</p>
          </div>
        `;
        
        // Remove original elements
        p.remove();
        $(q).remove();
      });
      gridHtml += '</div>';
      
      sec15.append(gridHtml);
    }
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Upgraded remaining layouts in ' + filePath);
}

upgradeRemaining('blog/what-is-dns-how-domain-name-system-works/index.html');
upgradeRemaining('blog-posts/what-is-dns-how-domain-name-system-works.html');

