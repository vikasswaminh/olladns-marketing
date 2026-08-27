const fs = require('fs');
const cheerio = require('cheerio');

function deduplicate(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // ─── Remove ALL TL;DR boxes, then re-insert exactly ONE ───
  const allTldr = $('.post-tldr');
  console.log('Found ' + allTldr.length + ' TL;DR boxes');
  
  // Save the first one's HTML (or build fresh)
  const freshTldr = `
    <div class="post-tldr" style="margin-bottom: 24px;">
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
  `;

  const freshKeyTakeaways = `
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

  // Remove ALL existing TL;DR and what-found boxes
  $('.post-tldr').remove();
  $('.what-found').remove();
  console.log('Removed all TL;DR and what-found boxes');

  // Find the article and insert fresh ones before the first section
  const article = $('article.post-body');
  const firstSection = article.find('.post-section').first();
  
  if (firstSection.length) {
    firstSection.before(freshTldr + freshKeyTakeaways);
    console.log('Inserted 1 TL;DR + 1 Key Takeaways before first section');
  }

  // Verify count
  console.log('TL;DR count after fix:', $('.post-tldr').length);
  console.log('what-found count after fix:', $('.what-found').length);

  fs.writeFileSync(filePath, $.html());
  console.log('Saved: ' + filePath);
}

deduplicate('blog/dns-filtering-explained/index.html');
deduplicate('blog-posts/dns-filtering-explained.html');
