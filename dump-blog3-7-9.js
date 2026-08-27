const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('blog/dns-filtering-explained/index.html', 'utf8'));

// Check if TL;DR has Key Takeaways after it
const tldr = $('.post-tldr');
console.log('=== TL;DR exists:', tldr.length > 0);
console.log('=== What comes after TL;DR:', tldr.next().attr('class') || tldr.next()[0]?.name);

// Sections 7-9
$('.post-section').each(function(i, el) {
  const num = parseInt($(el).find('.section-num').text().trim());
  if (num >= 7 && num <= 9) {
    console.log('\n--- SECTION ' + num + ': ' + $(el).find('h2').text().trim() + ' ---');
    console.log($(el).html().substring(0, 600));
  }
});
