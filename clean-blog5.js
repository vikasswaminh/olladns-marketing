const fs = require('fs');
let raw = fs.readFileSync('BLOG5.txt', 'utf8');
// Normalize curly quotes and dashes
raw = raw
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2013]/g, '-')
  .replace(/[\u2014]/g, '—')
  .replace(/耳/g, '·')
  .replace(/—/g, '—');
fs.writeFileSync('BLOG5.txt', raw, 'utf8');
console.log('cleaned BLOG5.txt');
