const fs = require('fs');
const data = JSON.parse(fs.readFileSync('blog.json','utf8'));
const newPost = {
  title: 'DNS Over HTTPS (DoH): Complete Guide to Secure DNS',
  slug: 'dns-over-https-doh-complete-guide',
  category: 'Guide',
  date: '2026-08-26',
  displayDate: 'Aug 26, 2026',
  author: 'olladns Security Team',
  readTime: '22 min read',
  excerpt: "DNS Over HTTPS encrypts DNS queries so ISPs and network operators can't see your domain lookups. Learn how DoH works, why it matters, deployment challenges, and how it compares to DoT and DoQ.",
  image: '',
  imageLabel: 'DoH',
  content: ''
};
if (!data.find(p => p.slug === newPost.slug)) {
  data.unshift(newPost);
}
const sec = data.find(x => x.slug === 'what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026');
if (sec) { sec.date = '2026-08-20'; sec.displayDate = 'Aug 20, 2026'; sec.category = 'Guide'; }
fs.writeFileSync('blog.json', JSON.stringify(data, null, 2));
console.log('top posts:');
data.slice(0,5).forEach(p => console.log(p.date, p.displayDate, p.slug));
