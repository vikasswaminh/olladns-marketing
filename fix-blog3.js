const fs = require('fs');
const cheerio = require('cheerio');

function fixBlog3(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // ─── 1. REMOVE DUPLICATE attack-surface-grid from Section 8 ───
  // Section 8 already has a great compare-table. Our script injected an extra grid. Remove it.
  const sec8 = $('#where-dns-filtering-sits-relative-to-your-other-defenses');
  if (sec8.length) {
    sec8.find('.attack-surface-grid').remove();
    console.log('Removed duplicate attack-surface-grid from Section 8');
  }

  // ─── 2. ADD KEY TAKEAWAYS after TL;DR ───
  // Check if Key Takeaways box already exists after TL;DR
  const tldr = $('.post-tldr');
  const afterTldr = tldr.next('.what-found');
  
  if (!afterTldr.length) {
    const keyTakeawaysHtml = `
      <div class="what-found" style="margin: 0 0 40px 0;">
        <div class="what-found-head">
          <span class="tldr-label">Key Takeaways</span>
          <h3 style="font-size: 20px; margin: 0; color: var(--text);">What You'll Learn</h3>
        </div>
        <ul style="margin: 0; padding-left: 20px; font-size: 15.5px; line-height: 1.7; color: var(--text-2);">
          <li style="margin-bottom: 8px;"><strong>The Mechanism:</strong> Exactly how a filtering resolver intercepts and blocks a domain query before a connection ever opens.</li>
          <li style="margin-bottom: 8px;"><strong>Phishing Defence:</strong> Why DNS is the single best choke point to stop phishing — before the page even renders.</li>
          <li style="margin-bottom: 8px;"><strong>Malware C2 Blocking:</strong> How filtering cuts off malware's ability to call home to command-and-control servers.</li>
          <li style="margin-bottom: 8px;"><strong>Deployment:</strong> A 6-step framework for rolling out filtering without disrupting your team's legitimate work.</li>
          <li style="margin-bottom: 0;"><strong>Evaluation:</strong> The five questions to ask any DNS filtering provider before signing a contract.</li>
        </ul>
      </div>
    `;
    tldr.after(keyTakeawaysHtml);
    console.log('Added Key Takeaways after TL;DR');
  } else {
    console.log('Key Takeaways already exists after TL;DR');
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Done: ' + filePath);
}

fixBlog3('blog/dns-filtering-explained/index.html');
fixBlog3('blog-posts/dns-filtering-explained.html');
