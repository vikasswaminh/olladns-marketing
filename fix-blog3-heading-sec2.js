const fs = require('fs');
const cheerio = require('cheerio');

function fixBlog3HeadingAndSec2(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // ─── 1. Fix h1 to 2 lines ───
  const h1 = $('h1');
  if (h1.length) {
    const currentText = h1.html();
    if (currentText && !currentText.includes('<br>')) {
      // Split at the colon to create 2 natural lines
      const newHtml = currentText.replace(
        'DNS Filtering Explained: How It Stops Phishing and Malware',
        'DNS Filtering Explained:<br>How It Stops Phishing and Malware'
      );
      h1.html(newHtml);
      console.log('H1 updated to 2 lines');
    }
  }

  // ─── 2. Fix Section 2 blank space ───
  // The blank space is trailing whitespace/newlines inside the section after the last <p>
  // Add a small bottom-padding: 0 override on the section, or trim empty text nodes
  const sec2 = $('.post-section').filter(function() {
    return parseInt($(this).find('.section-num').text()) === 2;
  });
  
  if (sec2.length) {
    // Remove trailing whitespace/empty text nodes
    const secHtml = sec2.html();
    // Trim extra newlines after the last </p>
    const cleaned = secHtml.replace(/(<\/p>)\s+$/, '$1');
    sec2.html(cleaned);
    // Also ensure padding-bottom is not excessive
    const currentStyle = sec2.attr('style') || '';
    if (!currentStyle.includes('padding-bottom')) {
      sec2.css('padding-bottom', '28px');
    }
    console.log('Section 2 blank space cleaned');
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Fixed in ' + filePath);
}

fixBlog3HeadingAndSec2('blog/dns-filtering-explained/index.html');
fixBlog3HeadingAndSec2('blog-posts/dns-filtering-explained.html');
