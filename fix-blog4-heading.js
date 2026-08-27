const fs = require('fs');

function fixHeading(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace the h1 content to split into 2 lines at the colon
  html = html.replace(
    /DNS Firewall\s*\n?\s*Explained: How DNS Firewalls Protect Networks/,
    'DNS Firewall Explained:<br>How DNS Firewalls Protect Networks'
  );

  fs.writeFileSync(filePath, html);
  console.log('Heading fixed in ' + filePath);
}

fixHeading('blog/dns-firewall-explained-how-dns-firewalls-protect-networks/index.html');
fixHeading('blog-posts/dns-firewall-explained-how-dns-firewalls-protect-networks.html');
