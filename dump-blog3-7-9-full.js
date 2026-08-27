const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('blog/dns-filtering-explained/index.html', 'utf8'));

$('.post-section').each(function(i, el) {
  const num = parseInt($(el).find('.section-num').text().trim());
  if (num >= 7 && num <= 9) {
    console.log('\n--- SECTION ' + num + ' FULL ---');
    console.log($(el).html());
  }
});
