const fs = require('fs');
const cheerio = require('cheerio');

function applySectionBoxes(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // 1. Wrap every .post-section in a styled card box
  $('.post-section').each((i, el) => {
    $(el).css(
      'background', 'var(--panel)'
    );
    $(el).css('border', '1px solid var(--line)');
    $(el).css('border-radius', 'var(--r-lg)');
    $(el).css('padding', '32px 36px');
    $(el).css('margin-bottom', '24px');
    $(el).css('padding-top', '28px');
    // Remove the previous margin-bottom from the post-section class in favor of the new one
  });

  // 2. Ensure FAQ items are separate individual boxes (already done but re-confirm the style)
  const sec15 = $('#frequently-asked-questions');
  if (sec15.length) {
    // Make the FAQ section box different (no duplicate box inside box)
    // Just ensure the details items have the box style
    sec15.find('details.faq-item').each((i, el) => {
      $(el).css('background', 'var(--bg-1)');
      $(el).css('border', '1px solid var(--line)');
      $(el).css('border-radius', 'var(--r-md)');
      $(el).css('overflow', 'hidden');
    });
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Section boxes applied in ' + filePath);
}

applySectionBoxes('blog/what-is-dns-how-domain-name-system-works/index.html');
applySectionBoxes('blog-posts/what-is-dns-how-domain-name-system-works.html');
