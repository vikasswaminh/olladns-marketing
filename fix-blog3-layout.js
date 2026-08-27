const fs = require('fs');

function fixBlog3Layout(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Remove the stray whitespace/empty stuff before TL;DR
  // The pattern: <!-- ═══════════ SECTION 01 ═══════════ --> followed by blank lines before the TL;DR
  html = html.replace(
    /<!-- ═══════════ SECTION 01 ═══════════ -->\s*\n\s*\n\s*\n\s*\n/,
    '<!-- ═══════════ SECTION 01 ═══════════ -->\n'
  );

  // 2. Remove the s02-split wrapper div (just unwrap it, keep the contents)
  // The s02-split div wraps section 02. Remove the opening div tag
  html = html.replace(/<div class="s02-split">\s*\n/, '');
  // Remove the closing </div> that closes s02-split (comes right after </section> of section 02)
  // It's at line 943 area - after the section closes
  html = html.replace(/<\/section>\s*\n\s*<\/div>\s*\n(\s*\n\s*<!-- ═══════════ SECTION 03)/, '</section>\n\n$1');

  fs.writeFileSync(filePath, html);
  console.log('Fixed layout in ' + filePath);
}

fixBlog3Layout('blog/dns-filtering-explained/index.html');
fixBlog3Layout('blog-posts/dns-filtering-explained.html');
