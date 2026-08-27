const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('blog/what-is-dns-how-domain-name-system-works/index.html', 'utf8');
const $ = cheerio.load(html);

[13, 14, 15].forEach(num => {
  $('.post-section').each((i, el) => {
    const numText = $(el).find('.section-num').text();
    if (parseInt(numText) === num) {
      console.log(`--- SECTION ${num} ---`);
      console.log($(el).html());
    }
  });
});
