const fs = require('fs');
const cheerio = require('cheerio');

function moveAndRewriteTakeaways(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // Find the Key Takeaways box
  const takeawaysBox = $('.what-found');
  
  if (takeawaysBox.length) {
    // Rewrite the content to 5 bullet points
    const pointsHtml = `
      <ul style="margin: 0; padding-left: 20px; font-size: 15.5px; line-height: 1.7; color: var(--text-2);">
        <li style="margin-bottom: 8px;"><strong>Foundational & Fast:</strong> DNS is the internet's invisible address book, translating names to numbers via an elegantly delegated hierarchy in milliseconds.</li>
        <li style="margin-bottom: 8px;"><strong>Earliest Intervention:</strong> Because a DNS lookup happens before almost anything else on a network, it is a high-leverage chokepoint for catching trouble.</li>
        <li style="margin: 0 0 8px 0;"><strong>Stops Threats Pre-Connection:</strong> It can block phishing sites, command-and-control callbacks, and lookalike domains before a device even connects.</li>
        <li style="margin-bottom: 8px;"><strong>Crucial Context:</strong> Understanding the mechanics of DNS is the essential foundation for grasping why DNS-layer security exists in the first place.</li>
        <li style="margin-bottom: 0;"><strong>Simple & Effective:</strong> Implementing DNS security controls tends to be one of the simplest, fastest, and most quietly effective strategies a security team can deploy.</li>
      </ul>
    `;
    
    // Replace the inner content (the old paragraph)
    const head = takeawaysBox.find('.what-found-head').clone();
    takeawaysBox.empty().append(head).append(pointsHtml);
    
    // Adjust margin on takeawaysBox so it flows well right after TLDR
    takeawaysBox.css('margin', '0 0 56px 0');
    
    // Move it to immediately after the TLDR box
    const tldrBox = $('.post-tldr');
    if (tldrBox.length) {
      takeawaysBox.insertAfter(tldrBox);
    }
  }

  // Also remove the empty <section class="post-section" id="the-takeaway"> that held the old box
  $('#the-takeaway').remove();

  fs.writeFileSync(filePath, $.html());
  console.log('Moved and rewrote Key Takeaways in ' + filePath);
}

moveAndRewriteTakeaways('blog/what-is-dns-how-domain-name-system-works/index.html');
moveAndRewriteTakeaways('blog-posts/what-is-dns-how-domain-name-system-works.html');

