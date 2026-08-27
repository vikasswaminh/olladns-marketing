const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('blog/what-is-dns-how-domain-name-system-works/index.html', 'utf8');
const $ = cheerio.load(html);

[7, 9, 10, 11].forEach(num => {
  $('.post-section').each((i, el) => {
    const numText = $(el).find('.section-num').text();
    if (parseInt(numText) === num) {
      console.log(`\n--- SECTION ${num} ---`);
      console.log($(el).html());
    }
  });
});
