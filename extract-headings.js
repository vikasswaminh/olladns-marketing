const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('blog/what-is-dns-how-domain-name-system-works/index.html', 'utf8');
const $ = cheerio.load(html);

const sections = [];
$('.post-section').each((i, el) => {
  const h2 = $(el).children('h2').text();
  sections.push({
    id: i + 1,
    title: h2
  });
});

console.log(JSON.stringify(sections, null, 2));
