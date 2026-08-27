const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('blog/what-is-dns-how-domain-name-system-works/index.html', 'utf8');
const $ = cheerio.load(html);

const remaining = [7, 9, 10, 11, 12, 13, 14, 15];

remaining.forEach(num => {
  // Find the section with class="section-num">0${num}</span>
  let sec = null;
  $('.post-section').each((i, el) => {
    const numText = $(el).find('.section-num').text();
    if (parseInt(numText) === num) {
      sec = $(el);
    }
  });
  
  if (sec) {
    console.log(`--- SECTION ${num}: ${sec.find('h2').text()} ---`);
    console.log(sec.children().not('.section-num, h2').text().substring(0, 150) + '...');
    // Log if it has ul/ol
    const list = sec.find('ul, ol');
    if (list.length) {
      console.log(`Contains list with ${list.find('li').length} items.`);
    }
    console.log('');
  }
});
