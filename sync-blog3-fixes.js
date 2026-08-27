const fs = require('fs');

// Sync the same fixes to the blog-posts backup
let html = fs.readFileSync('blog-posts/dns-filtering-explained.html', 'utf8');

// Fix h1
html = html.replace(
  '<h1 class="gradient-text">DNS Filtering Explained:<br>How It Stops Phishing and Malware</h1>',
  '<h1 class="gradient-text" style="font-size: clamp(26px, 3.8vw, 46px); line-height: 1.2; max-width: 700px;">DNS Filtering Explained:<br>How It Stops Phishing and Malware</h1>'
);

// Fix section 2: move stats inside the section box
html = html.replace(
  /(<\/p>)<\/section>\s*<div class="s02-stats">([\s\S]*?)<\/div>\s*<\/div>/,
  (match, endP, statsContent) => {
    return `${endP}\n              <div class="s02-stats" style="display:grid; grid-template-columns: repeat(3,1fr); gap:16px; margin-top:24px;">${statsContent}</div>\n            </section>\n          </div>`;
  }
);

fs.writeFileSync('blog-posts/dns-filtering-explained.html', html);
console.log('blog-posts synced');
