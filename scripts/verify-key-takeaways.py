import re, pathlib

files = [
  'blog/what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026/index.html',
  'blog/what-is-dns-how-domain-name-system-works/index.html',
  'blog/dns-firewall-explained-how-dns-firewalls-protect-networks/index.html',
  'blog/cyrillic-homoglyphs/index.html',
  'blog/dns-cheapest-zero-trust-control/index.html',
  'blog/inside-dga-classifier/index.html',
  'blog/mcp-tools-openapi/index.html',
  'blog/scoped-api-keys/index.html'
]

for f in files:
    content = pathlib.Path(f).read_text()
    kt = len(re.findall(r'class="kt-wrap"', content))
    toc = len(re.findall(r'href="#key-takeaways-title"', content))
    css = re.search(r'site\.css\?v=(\d+)', content)
    print(f'{f} | kt-wrap={kt} | toc-link={toc} | css=v{css.group(1) if css else "NONE"}')
