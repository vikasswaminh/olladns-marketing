const fs = require('fs');
const cheerio = require('cheerio');

function upgradeBlog(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // 1. Center the Hero
  $('.page-hero .container').attr('style', 'position:relative; text-align: center; display: flex; flex-direction: column; align-items: center;');
  $('.page-hero').attr('style', 'padding-bottom: 40px; padding-top: 40px;'); // Replace padding-bottom with just top and bottom

  const h1 = $('h1');
  if (h1.length > 0) {
    h1.attr('style', 'max-width: none;');
    const text = h1.text();
    // What Is DNS? How the Domain Name System Works
    if (text.includes('What Is DNS? How the Domain Name System Works')) {
      h1.html('What Is DNS?<br>How the Domain Name System Works');
    }
  }

  // 2. Remove the SVG placeholder image
  $('.post-thumb').remove();

  // 3. Process the post-body for TOC, TLDR, and sections
  const postBody = $('.post-body');
  
  // Extract TLDR
  // The first paragraph inside post-body (which is before the first h2) will become the TLDR
  const firstP = postBody.children('p').first();
  if (firstP.length > 0 && firstP.prevAll('h2').length === 0) {
    const tldrBox = $(`
      <div class="post-tldr">
        <div class="tldr-head">
          <span class="tldr-label">TL;DR</span>
          <h3 id="tldr">The Internet's Address Book</h3>
        </div>
      </div>
    `);
    
    // Move the paragraph into the tldrBox
    firstP.clone().appendTo(tldrBox);
    firstP.remove();

    // Insert the tldrBox at the top of the post-body
    postBody.prepend(tldrBox);
  }

  // Generate TOC and Sections
  const tocLinks = [];
  let sectionCounter = 1;

  // We need to group elements by h2
  // We'll iterate through all children of post-body
  const children = postBody.children().toArray();
  let currentSectionElements = [];
  let currentHeading = null;
  let inSection = false;

  const sectionsToInsert = [];

  for (let i = 0; i < children.length; i++) {
    const el = $(children[i]);
    
    if (el[0].name === 'h2') {
      // If we were already building a section, save it
      if (inSection) {
        sectionsToInsert.push({ heading: currentHeading, elements: currentSectionElements });
      }
      
      inSection = true;
      currentHeading = el;
      currentSectionElements = [];
    } else if (inSection) {
      currentSectionElements.push(el);
    }
  }

  // Push the last section
  if (inSection) {
    sectionsToInsert.push({ heading: currentHeading, elements: currentSectionElements });
  }

  // Now, rewrite the sections
  sectionsToInsert.forEach((section, index) => {
    const h2 = section.heading;
    const text = h2.text();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Add to TOC
    tocLinks.push(`<li><a href="#${id}">${text}</a></li>`);

    const numStr = sectionCounter.toString().padStart(2, '0');
    sectionCounter++;

    // Create the section wrapper
    const sectionWrapper = $(`<section class="post-section" id="${id}"></section>`);
    sectionWrapper.append(`<span class="section-num">${numStr}</span>`);
    
    // Clone h2 without id (id goes to section)
    const newH2 = h2.clone().removeAttr('id');
    newH2.text(text); // reset text in case of inner tags
    sectionWrapper.append(newH2);

    // Append elements
    section.elements.forEach(el => {
      sectionWrapper.append(el.clone());
      el.remove();
    });

    h2.replaceWith(sectionWrapper);
  });

  // 4. Implement post-layout and TOC
  // Wrap post-body contents inside post-layout
  const layout = $(`
    <div class="post-layout">
      <aside class="post-toc" aria-label="Table of contents">
        <h4>On this page</h4>
        <ul>
          ${tocLinks.join('\n          ')}
        </ul>
      </aside>
      <article class="post-body">
      </article>
    </div>
  `);

  // Move the contents of the old post-body into the new post-body
  layout.find('.post-body').append(postBody.contents());

  // Replace the old post-body with the new layout
  postBody.replaceWith(layout);

  // 5. Add Key Takeaways?
  // Let's see if there is a conclusion section to extract Key Takeaways from
  // If the last section is "Conclusion" or similar, we could pull it out, but for now we'll just style the TOC

  // 6. Update the <style> block to include the premium layout CSS
  // We'll append the missing CSS from blog 1 if it doesn't exist
  // To be safe, we can just replace the whole style block with a copy of blog 1's style block, but we don't have it easily available in this script without reading it.
  // Instead, we will read it from blog 1 and inject it here!

  const blog1Path = 'blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html';
  if (fs.existsSync(blog1Path)) {
    const blog1Html = fs.readFileSync(blog1Path, 'utf8');
    const blog1$ = cheerio.load(blog1Html);
    const premiumStyles = blog1$('style').html();
    
    // Replace current style with premium style
    $('style').html(premiumStyles);
  }

  // Write back
  fs.writeFileSync(filePath, $.html());
  console.log('Upgraded ' + filePath);
}

upgradeBlog('blog/what-is-dns-how-domain-name-system-works/index.html');
upgradeBlog('blog-posts/what-is-dns-how-domain-name-system-works.html');

