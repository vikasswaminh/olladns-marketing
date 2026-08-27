const fs = require('fs');
const cheerio = require('cheerio');

function applyBoxes(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // --- SECTION 1: Wrap paragraphs in a premium "origin story" box ---
  const sec1 = $('#the-problem-dns-was-invented-to-solve');
  if (sec1.length) {
    const paras = sec1.find('p').toArray();
    if (paras.length >= 1) {
      // Build a 3-step timeline-style box
      const timelineItems = [
        {
          year: '~1970s',
          title: 'The HOSTS.TXT Era',
          text: $(paras[0]).html()
        },
        {
          year: '~1980s',
          title: 'ARPANET Hits a Wall',
          text: $(paras[1]).html()
        },
        {
          year: '1983',
          title: 'DNS is Born',
          text: $(paras[2]).html()
        }
      ];

      let boxHtml = `
        <div style="
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: var(--r-lg);
          padding: 28px 32px;
          margin: 24px 0;
        ">
          <div style="font-size: 12px; font-family: var(--mono); color: var(--accent); text-transform: uppercase; letter-spacing: .1em; font-weight: 700; margin-bottom: 20px;">Origin Story</div>
      `;

      timelineItems.forEach((item, i) => {
        const isLast = i === timelineItems.length - 1;
        boxHtml += `
          <div style="display: flex; gap: 20px; margin-bottom: ${isLast ? '0' : '24px'}; position: relative;">
            <div style="flex: none; width: 80px;">
              <div style="
                font-family: var(--mono);
                font-size: 12px;
                color: var(--accent);
                font-weight: 700;
                background: var(--accent-soft);
                border: 1px solid var(--accent-line);
                border-radius: 6px;
                padding: 5px 8px;
                text-align: center;
              ">${item.year}</div>
            </div>
            <div style="${!isLast ? 'border-bottom: 1px dashed var(--line); padding-bottom: 24px;' : ''} flex: 1;">
              <h4 style="margin: 0 0 8px; font-size: 16px; color: var(--text);">${item.title}</h4>
              <p style="margin: 0; font-size: 15px; line-height: 1.65; color: var(--text-2);">${item.text}</p>
            </div>
          </div>
        `;
      });

      boxHtml += `</div>`;

      // Remove old paragraphs
      paras.forEach(p => $(p).remove());
      sec1.append(boxHtml);
    }
  }

  // --- SECTION 15: Convert accordion to separate boxed FAQ items ---
  const sec15 = $('#frequently-asked-questions');
  if (sec15.length) {
    const accordion = sec15.find('.faq-accordion');
    if (accordion.length) {
      const items = accordion.find('details.faq-item').toArray();
      let newFaqHtml = '<div style="display: flex; flex-direction: column; gap: 12px; margin-top: 32px;">';

      items.forEach(item => {
        const q = $(item).find('summary span').first().text().trim();
        const a = $(item).find('div p').html() || '';

        newFaqHtml += `
          <details class="faq-item" style="
            background: var(--panel);
            border: 1px solid var(--line);
            border-radius: var(--r-md);
            padding: 0;
            overflow: hidden;
            transition: border-color .15s;
          ">
            <summary style="
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              list-style: none;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: var(--text);
              padding: 18px 22px;
            ">
              <span>${q}</span>
              <span class="faq-icon" style="
                color: var(--accent);
                font-size: 24px;
                font-weight: 300;
                line-height: 1;
                flex: none;
                width: 28px;
                height: 28px;
                border: 1.5px solid var(--accent-line);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--accent-soft);
                font-size: 18px;
                transition: transform .2s;
              ">+</span>
            </summary>
            <div style="
              padding: 0 22px 18px;
              font-size: 15.5px;
              line-height: 1.7;
              color: var(--text-2);
              border-top: 1px solid var(--line);
              padding-top: 14px;
            ">
              <p style="margin: 0;">${a}</p>
            </div>
          </details>
        `;
      });

      newFaqHtml += '</div>';
      accordion.replaceWith(newFaqHtml);
    }
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Applied boxes in ' + filePath);
}

applyBoxes('blog/what-is-dns-how-domain-name-system-works/index.html');
applyBoxes('blog-posts/what-is-dns-how-domain-name-system-works.html');
