const fs = require('fs');
const cheerio = require('cheerio');

function upgradeSections(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // Helper to extract text from a node
  function getText(node) {
    return $(node).text().trim();
  }

  // Helper to get HTML from a node
  function getHtml(node) {
    return $(node).html();
  }

  // --- SECTION 3: Breaking down a domain name ---
  // ID: breaking-down-a-domain-name
  const sec3 = $('#breaking-down-a-domain-name');
  if (sec3.length) {
    const list = sec3.find('ul');
    if (list.length) {
      const items = list.find('li').toArray();
      let gridHtml = '<div class="concept-grid">';
      
      const icons = [
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><path d="M22 6l-10 7L2 6"></path></svg>',
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
      ];

      items.forEach((item, i) => {
        const itemHtml = getHtml(item);
        // The item usually starts with <strong>code</strong> is the ...
        // We will separate the bold text for the title, and the rest for the description
        const strong = $(item).find('strong').first();
        const title = strong.length ? getHtml(strong) : `Part ${i+1}`;
        if (strong.length) strong.remove();
        
        let desc = getHtml(item).replace(/^ is the /, '').replace(/^ - /, '').trim();
        desc = desc.charAt(0).toUpperCase() + desc.slice(1);
        
        gridHtml += `
          <div class="concept-card">
            <div class="concept-ic">${icons[i % icons.length]}</div>
            <h4>${title}</h4>
            <p>${desc}</p>
          </div>
        `;
      });
      gridHtml += '</div>';
      list.replaceWith(gridHtml);
    }
  }

  // --- SECTION 4: Following one lookup, start to finish ---
  // ID: following-one-lookup-start-to-finish
  const sec4 = $('#following-one-lookup-start-to-finish');
  if (sec4.length) {
    const list = sec4.find('h3');
    if (list.length) {
      // The current HTML has h3 for steps, followed by paragraphs
      let flowHtml = '<div class="dns-flow">';
      
      const steps = list.toArray();
      steps.forEach((step, i) => {
        const title = $(step).text();
        const desc = $(step).next('p').html() || '';
        
        flowHtml += `
          <div class="flow-step"><span class="flow-dot"></span>
            <div class="flow-card">
              <h4>${title}</h4>
              <p>${desc}</p>
            </div>
          </div>
        `;
        if (i < steps.length - 1) {
          flowHtml += `<div class="flow-arrow" aria-hidden="true">↓</div>`;
        }
      });
      flowHtml += '</div>';
      
      // Remove all h3 and their following p
      sec4.find('h3').each((i, el) => {
        $(el).next('p').remove();
        $(el).remove();
      });
      
      sec4.append(flowHtml);
    }
  }

  // --- SECTION 6: The record types that make DNS work ---
  // ID: the-record-types-that-make-dns-work
  const sec6 = $('#the-record-types-that-make-dns-work');
  if (sec6.length) {
    const list = sec6.find('ul');
    if (list.length) {
      const items = list.find('li').toArray();
      let newHtml = '';
      
      items.forEach((item, i) => {
        const strong = $(item).find('strong').first();
        const title = strong.length ? getHtml(strong) : `Record`;
        if (strong.length) strong.remove();
        let desc = getHtml(item).replace(/^ - /, '').replace(/^: /, '').trim();
        
        const reverseClass = (i % 2 !== 0) ? ' reverse' : '';
        
        newHtml += `
          <div class="technique-row${reverseClass}">
            <div class="technique-visual">
              <div class="visual-card">
                <div class="visual-label">${title} Record</div>
                <div class="code-box">
                  <pre style="margin:0; padding:12px; font-size:12px;"><code>example.com. 3600 IN ${$(title).text().replace(/[^A-Z]/g, '') || 'A'} ...</code></pre>
                </div>
              </div>
            </div>
            <div class="technique-text">
              <h3>${title}</h3>
              <p>${desc}</p>
            </div>
          </div>
        `;
      });
      list.replaceWith(newHtml);
    }
  }

  // --- SECTION 8: DNS as an attack surface ---
  // ID: dns-as-an-attack-surface
  const sec8 = $('#dns-as-an-attack-surface');
  if (sec8.length) {
    const list = sec8.find('ul');
    if (list.length) {
      const items = list.find('li').toArray();
      let gridHtml = '<div class="attack-surface-grid">';
      
      items.forEach((item, i) => {
        const strong = $(item).find('strong').first();
        const title = strong.length ? getHtml(strong) : `Threat ${i+1}`;
        if (strong.length) strong.remove();
        let desc = getHtml(item).replace(/^ - /, '').replace(/^: /, '').trim();
        
        gridHtml += `
          <div class="surface-card">
            <span class="surface-num">0${i+1}</span>
            <h4>${title}</h4>
            <p>${desc}</p>
          </div>
        `;
      });
      gridHtml += '</div>';
      list.replaceWith(gridHtml);
    }
  }

  // --- SECTION 16: The takeaway ---
  // ID: the-takeaway
  const sec16 = $('#the-takeaway');
  if (sec16.length) {
    let takeawayHtml = `
      <div class="what-found" style="margin-top: 48px;">
        <div class="what-found-head">
          <span class="tldr-label">Key Takeaways</span>
          <h3 id="key-takeaways-title">Essential Points</h3>
        </div>
        <div style="font-size: 15.5px; line-height: 1.7; color: var(--text-2);">
    `;
    
    // Move all paragraphs into the what-found box
    sec16.find('p').each((i, el) => {
      takeawayHtml += `<p style="margin: 0 0 12px 0;">${$(el).html()}</p>`;
    });
    
    takeawayHtml += `</div></div>`;
    
    // Delete original paragraphs and heading, and replace with box
    sec16.empty().append(takeawayHtml);
    
    // Also remove the "The takeaway" from TOC
    $('.post-toc a[href="#the-takeaway"]').parent().remove();
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Upgraded layouts in ' + filePath);
}

upgradeSections('blog/what-is-dns-how-domain-name-system-works/index.html');
upgradeSections('blog-posts/what-is-dns-how-domain-name-system-works.html');

