const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('blog/dns-filtering-explained/index.html', 'utf8'));
const secs = [];
$('.post-section').each(function(i, el) {
  secs.push({
    num: $(el).find('.section-num').text().trim(),
    h2: $(el).find('h2').text().trim().substring(0, 60),
    hasUl: $(el).find('ul').length,
    hasOl: $(el).find('ol').length,
    hasPremiumComponent: $(el).find('.concept-grid,.dns-flow,.technique-row,.attack-surface-grid,.surface-card').length > 0
  });
});
console.log(JSON.stringify(secs, null, 2));
