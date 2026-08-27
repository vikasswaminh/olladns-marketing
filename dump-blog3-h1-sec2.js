const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('blog/dns-filtering-explained/index.html', 'utf8'));

// Check h1
console.log('=== H1 ===');
console.log($('h1').html());

// Check Section 2
$('.post-section').each(function(i, el) {
  const num = parseInt($(el).find('.section-num').text().trim());
  if (num === 2) {
    console.log('\n=== SECTION 2 ===');
    console.log($(el).html());
  }
});
