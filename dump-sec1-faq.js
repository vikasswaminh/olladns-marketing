const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('blog/what-is-dns-how-domain-name-system-works/index.html', 'utf8');
const $ = cheerio.load(html);

// Check section 1
$('.post-section').each((i, el) => {
  const num = $(el).find('.section-num').text();
  if (parseInt(num) === 1) {
    console.log('--- SECTION 1 ---');
    console.log($(el).html());
  }
  if (parseInt(num) === 15) {
    console.log('\n--- SECTION 15 FAQ ---');
    console.log($(el).html().substring(0, 2000));
  }
});
