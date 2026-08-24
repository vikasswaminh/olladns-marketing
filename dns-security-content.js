const fs = require('fs');
const path = require('path');

function getParts() {
  const blogJson = path.join(__dirname, 'blog.json');
  const posts = JSON.parse(fs.readFileSync(blogJson, 'utf8'));
  const post = posts.find(p => p.slug === 'what-is-dns-security-a-complete-guide-to-protecting-your-network-in-2026');
  if (!post) return [];
  const inner = post.content.replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '');
  return inner.split('\r ').map(s => s.trim()).filter(Boolean);
}

function p(parts, i) { return parts[i] || ''; }
function paras(parts, start, end) {
  return parts.slice(start, end).map(s => '<p>' + s + '</p>').join('\n');
}

function render() {
  const parts = getParts();
  if (!parts.length) return '';

  const myths = parts.slice(102, 107).map(s => {
    const match = s.match(/^"([^"]+)"\s*(.*)$/);
    const q = match ? match[1] : s;
    const a = match ? match[2] : '';
    return `<details><summary><span class="accordion-q">${q}</span></summary><div class="accordion-body"><p>${a}</p></div></details>`;
  }).join('\n    ');

  const faqs = [];
  for (let i = 119; i < 143; i += 2) {
    const q = p(parts, i);
    const a = p(parts, i + 1);
    if (!q || !a) break;
    faqs.push(`<details><summary><span class="accordion-q">${q}</span></summary><div class="accordion-body"><p>${a}</p></div></details>`);
  }

  return `
<div class="post-tldr">
  <div class="tldr-head">
    <span class="tldr-label">TL;DR</span>
    <h3>DNS is security's earliest intervention point</h3>
  </div>
  <p>Every phishing link, malware payload, and data exfiltration attempt starts with a domain lookup. Securing DNS means blocking threats before any connection is established — while keeping your network fast and your operations simple.</p>
  <ul class="tldr-list">
    <li><span class="ck">✓</span><span><strong>Earliest stop:</strong> DNS lookups happen before malicious payloads download or phishing pages load.</span></li>
    <li><span class="ck">✓</span><span><strong>Universal coverage:</strong> every device — managed, IoT, or guest — must resolve domains to communicate.</span></li>
    <li><span class="ck">✓</span><span><strong>Proven attacks:</strong> spoofing, tunneling, DGA-based C2, and lookalike phishing all abuse DNS.</span></li>
    <li><span class="ck">✓</span><span><strong>Modern stack:</strong> protective DNS + DNSSEC + DoH/DoT/DoQ + RPZ + behavioral intelligence.</span></li>
  </ul>
</div>

<section class="post-section" id="the-layer-nobody-watches">
  <span class="section-num">01</span>
  <h2>${p(parts, 1)}</h2>
  ${paras(parts, 2, 8)}
  <blockquote class="post-quote"><p>"Where is this domain?" That question — the DNS lookup — happens before the malicious payload downloads, before the credential-harvesting page loads, before the stolen data leaves your network. Every single time.</p></blockquote>
</section>

<section class="post-section" id="what-dns-does">
  <span class="section-num">02</span>
  <h2>${p(parts, 8)}</h2>
  ${paras(parts, 9, 14)}
  <div class="dns-flow">
    <div class="flow-step"><span class="flow-dot"></span><div class="flow-card"><h4>1. Device asks resolver</h4><p>Your laptop, phone, or server sends a query to its configured DNS resolver.</p></div></div>
    <div class="flow-arrow" aria-hidden="true">↓</div>
    <div class="flow-step"><span class="flow-dot"></span><div class="flow-card"><h4>2. Resolver queries root</h4><p>If the answer isn't cached, the resolver asks a root server where to look next.</p></div></div>
    <div class="flow-arrow" aria-hidden="true">↓</div>
    <div class="flow-step"><span class="flow-dot"></span><div class="flow-card"><h4>3. TLD nameserver</h4><p>The root points to the .com, .org, or .io nameserver responsible for the domain.</p></div></div>
    <div class="flow-arrow" aria-hidden="true">↓</div>
    <div class="flow-step"><span class="flow-dot"></span><div class="flow-card"><h4>4. Authoritative answer</h4><p>The domain's authoritative nameserver returns the IP address. The connection can begin.</p></div></div>
  </div>
</section>

<div class="what-found">
  <div class="what-found-head">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s5-9 10-9 10 9 10 9-5 9-10 9-10-9-10-9Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    <h4>What We Found</h4>
  </div>
  <p>Most organizations inspect email, endpoints, and web traffic closely — but treat DNS as invisible plumbing. That gap is exactly what attackers exploit. The teams that close it gain an early, high-coverage layer of defense that firewalls and antivirus can't replicate.</p>
  <p>DNS security isn't another siloed tool; it's a control point that sits in front of nearly every outbound connection in your environment.</p>
</div>

<section class="post-section" id="what-is-dns-security">
  <span class="section-num">03</span>
  <h2>${p(parts, 14)}</h2>
  <p>${p(parts, 15)}</p>
  <div class="concept-grid">
    <div class="concept-card"><div class="concept-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div><h4>Half one: protect DNS itself</h4><p>${p(parts, 17)}</p></div>
    <div class="concept-card"><div class="concept-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div><h4>Half two: use DNS as a control</h4><p>${p(parts, 18)}</p></div>
  </div>
  <p>${p(parts, 19)}</p>
</section>

<section class="post-section" id="why-dns-attack-surface">
  <span class="section-num">04</span>
  <h2>${p(parts, 20)}</h2>
  ${paras(parts, 21, 23)}
  <div class="attack-surface-grid">
    <div class="surface-card"><div class="surface-num">01</div><h4>Traffic is rarely inspected</h4><p>${p(parts, 23)}</p></div>
    <div class="surface-card"><div class="surface-num">02</div><h4>Port 53 is always open</h4><p>${p(parts, 24)}</p></div>
    <div class="surface-card"><div class="surface-num">03</div><h4>Earlier in the kill chain</h4><p>${p(parts, 25)}</p></div>
    <div class="surface-card"><div class="surface-num">04</div><h4>Cheap, disposable domains</h4><p>${p(parts, 26)}</p></div>
  </div>
  <p>${p(parts, 27)}</p>
</section>

<section class="post-section" id="attack-techniques">
  <span class="section-num">05</span>
  <h2>${p(parts, 28)}</h2>
  <p>${p(parts, 29)}</p>

  <div class="technique-row"><div class="technique-text"><h3>${p(parts, 30)}</h3>${paras(parts, 31, 34)}</div><div class="technique-visual"><div class="visual-card spoof"><div class="visual-label">User requests</div><div class="visual-domain">secure-bank.example</div><div class="visual-arrow">→</div><div class="visual-label poisoned">Attacker IP</div></div></div></div>

  <div class="technique-row reverse"><div class="technique-visual"><div class="visual-card tunnel"><div class="visual-label">Infected device</div><div class="visual-domain">c2f9a8b1e2.exfil.evil.com</div><div class="visual-arrow">DNS query →</div><div class="visual-label">Attacker NS decodes data</div></div></div><div class="technique-text"><h3>${p(parts, 34)}</h3>${paras(parts, 35, 38)}</div></div>

  <div class="code-box">
    <div class="code-head"><span>DNS tunneling query pattern</span></div>
    <pre><code>subdomain.payload.attacker-domain.com
c2f9a8b1e2.exfil.evil.com
reply-from-authoritative.evil.com</code></pre>
    <p class="code-caption">Data encoded in subdomain labels; the attacker's authoritative server decodes each query and replies with hidden commands.</p>
  </div>

  <div class="technique-row"><div class="technique-text"><h3>${p(parts, 38)}</h3>${paras(parts, 39, 41)}</div><div class="technique-visual"><div class="visual-card dga"><div class="visual-label">DGA algorithm seed</div><div class="visual-domain">xk7z9q.malware-c2.net</div><div class="visual-domain">bb3m1p.malware-c2.net</div><div class="visual-domain">nq8v4w.malware-c2.net</div></div></div></div>

  <div class="technique-row reverse"><div class="technique-visual"><div class="visual-card phishing"><div class="visual-label">Phishing kit domain</div><div class="visual-domain">login-micros0ft.online</div><div class="visual-arrow">lives 4–6 hours</div><div class="visual-label">Abandoned before blocklists update</div></div></div><div class="technique-text"><h3>${p(parts, 41)}</h3>${paras(parts, 42, 44)}</div></div>

  <div class="technique-row"><div class="technique-text"><h3>${p(parts, 44)}</h3>${paras(parts, 45, 47)}</div><div class="technique-visual"><div class="visual-card ddos"><div class="visual-label">Small query</div><div class="visual-arrow">amplified →</div><div class="visual-label">Large response</div><div class="visual-domain">Reflects off open resolvers</div></div></div></div>
</section>

<section class="post-section" id="firewall-not-enough">
  <span class="section-num">06</span>
  <h2>${p(parts, 47)}</h2>
  ${paras(parts, 48, 50)}
  <div class="table-wrap">
    <table class="post-table">
      <thead><tr><th>Control</th><th>Sees</th><th>Blind spot</th><th>Where DNS security helps</th></tr></thead>
      <tbody>
        <tr><td><strong>Firewall</strong></td><td>IP addresses, ports</td><td>Rotating IPs, domain names</td><td>Blocks based on domain reputation before any IP is contacted.</td></tr>
        <tr><td><strong>Endpoint / antivirus</strong></td><td>Managed devices</td><td>IoT, guest devices, BYOD</td><td>Every device must resolve names; coverage is universal.</td></tr>
        <tr><td><strong>Email security</strong></td><td>Email-borne links</td><td>SMS, QR codes, chat apps, compromised sites</td><td>Intervenes when any link is resolved, regardless of delivery channel.</td></tr>
      </tbody>
    </table>
  </div>
  ${paras(parts, 53, 55)}
</section>

<section class="post-section" id="building-blocks">
  <span class="section-num">07</span>
  <h2>${p(parts, 55)}</h2>
  <p>${p(parts, 56)}</p>
  <div class="tech-grid">
    <div class="tech-card"><div class="tech-ic">🌐</div><h4>Protective DNS</h4><p>A protective DNS service inspects every lookup in real time against threat intelligence — known malicious domains, algorithmically-generated domains, freshly registered domains with suspicious characteristics, and categories you choose to block — and refuses to resolve the ones that are dangerous. From the user's perspective, the malicious domain simply doesn't load.</p></div>
    <div class="tech-card"><div class="tech-ic">🔏</div><h4>DNSSEC</h4><p>${p(parts, 62)}</p></div>
    <div class="tech-card"><div class="tech-ic">🔐</div><h4>DoH / DoT / DoQ</h4><p>Three protocols encrypt DNS traffic in transit: <code>DoH</code> wraps queries inside <code>HTTPS</code> traffic, blending with regular web browsing; <code>DoT</code> encrypts over a dedicated <code>TLS</code> port, easier for admins to manage but more distinguishable; <code>DoQ</code> uses <code>QUIC</code> transport for faster connections on lossy networks. Encryption in transit is baseline hygiene — closing off an entire category of eavesdropping and manipulation attacks.</p></div>
    <div class="tech-card"><div class="tech-ic">🛠️</div><h4>RPZ</h4><p>Response Policy Zones let a DNS resolver apply custom policy to specific domains — overriding responses for known-bad domains, redirecting to warning pages, or returning <code>NXDOMAIN</code> instead of the real answer. It's the mechanism that makes real-time blocking at the resolver level possible and scalable.</p></div>
    <div class="tech-card"><div class="tech-ic">🧠</div><h4>Threat Intelligence & Behavioral Detection</h4><p>Static blocklists can only block what's already identified as bad — leaving a window between when malicious infrastructure goes live and when it gets listed. Behavioral and statistical detection closes that gap by recognizing patterns: registration characteristics of phishing domains, query patterns consistent with <code>DGA</code>-based malware, and structural similarity to known brands — catching threats within minutes rather than hours.</p></div>
    <div class="tech-card"><div class="tech-ic">⚡</div><h4>Speed & Accuracy</h4><p>Effective protective DNS depends on fast, accurate threat intelligence — how quickly it identifies newly registered malicious domains, and how precisely it distinguishes real threats from legitimate-but-unusual traffic. A high false-positive rate quickly trains users and IT teams to distrust or bypass the system entirely.</p></div>
  </div>

  <h3>Encrypted DNS protocols compared</h3>
  <div class="proto-grid">
    <div class="proto-card"><h4>DoH</h4><p class="proto-sub">DNS over HTTPS</p><p>${p(parts, 68)}</p></div>
    <div class="proto-card"><h4>DoT</h4><p class="proto-sub">DNS over TLS</p><p>${p(parts, 69)}</p></div>
    <div class="proto-card"><h4>DoQ</h4><p class="proto-sub">DNS over QUIC</p><p>${p(parts, 70)}</p></div>
  </div>
  <p>${p(parts, 71)}</p>
</section>

<section class="post-section" id="real-world-stakes">
  <span class="section-num">08</span>
  <h2>${p(parts, 77)}</h2>
  <p>${p(parts, 78)}</p>
  <div class="timeline">
    <div class="timeline-item"><div class="timeline-date">2016</div><div class="timeline-body"><h4>Infrastructure-scale outage</h4><p>${p(parts, 79)}</p></div></div>
    <div class="timeline-item"><div class="timeline-date">Ransomware era</div><div class="timeline-body"><h4>Precursor detection</h4><p>${p(parts, 80)}</p></div></div>
    <div class="timeline-item"><div class="timeline-date">BEC</div><div class="timeline-body"><h4>Lookalike domains</h4><p>${p(parts, 81)}</p></div></div>
  </div>
  <p>${p(parts, 82)}</p>
</section>

<section class="post-section" id="deployment">
  <span class="section-num">09</span>
  <h2>${p(parts, 83)}</h2>
  <p>${p(parts, 84)}</p>
  <ol class="roadmap">
    <li><div class="roadmap-num">1</div><div><h4>Start with visibility</h4><p>${p(parts, 85)}</p></div></li>
    <li><div class="roadmap-num">2</div><div><h4>Deploy at the resolver level</h4><p>${p(parts, 86)}</p></div></li>
    <li><div class="roadmap-num">3</div><div><h4>Roll out policy in tiers</h4><p>${p(parts, 87)}</p></div></li>
    <li><div class="roadmap-num">4</div><div><h4>Integrate DNS logs into your SIEM</h4><p>${p(parts, 88)}</p></div></li>
    <li><div class="roadmap-num">5</div><div><h4>Plan your rollback</h4><p>${p(parts, 89)}</p></div></li>
    <li><div class="roadmap-num">6</div><div><h4>Review exceptions quarterly</h4><p>${p(parts, 90)}</p></div></li>
  </ol>
</section>

<section class="post-section" id="checklist">
  <span class="section-num">10</span>
  <h2>${p(parts, 91)}</h2>
  <p>${p(parts, 92)}</p>
  <ul class="checklist">
    ${parts.slice(93, 100).map(s => `<li><span class="check-ck">✓</span><span>${s}</span></li>`).join('\n    ')}
  </ul>
</section>

<section class="post-section" id="myths">
  <span class="section-num">11</span>
  <h2>${p(parts, 100)}</h2>
  <p>${p(parts, 101)}</p>
  <div class="accordion">
    ${myths}
  </div>
</section>

<section class="post-section" id="future">
  <span class="section-num">12</span>
  <h2>${p(parts, 107)}</h2>
  <p>${p(parts, 108)}</p>
  <ol class="trend-list">
    ${parts.slice(109, 113).map((s, i) => `<li><span class="trend-num">${String(i + 1).padStart(2, '0')}</span><p>${s}</p></li>`).join('\n    ')}
  </ol>
</section>

<section class="post-section faq-section" id="faq">
  <h2>${p(parts, 118)}</h2>
  <div class="accordion">
    ${faqs.join('\n    ')}
  </div>
</section>

<section class="post-section conclusion" id="conclusion">
  <span class="section-num">13</span>
  <h2>${p(parts, 113)}</h2>
  <div class="conclusion-box">
    ${paras(parts, 114, 118)}
    <div class="conclusion-cta">
      <a href="/get-started" class="btn primary lg">Secure your DNS with OllaDNS</a>
      <a href="/blog/" class="btn ghost lg">Explore more guides</a>
    </div>
  </div>
</section>

<section class="post-section final-cta" id="secure-dns">
  <div class="cta-block">
    <h2>Secure your DNS with OllaDNS</h2>
    <p class="lede">Block phishing, malware, and ransomware at the domain layer — before a connection is ever made. Deploy in minutes, protect every device, and get visibility into the traffic other tools miss.</p>
    <div class="cta" style="margin-top:28px;justify-content:center">
      <a href="/get-started" class="btn primary lg">Start protecting your network</a>
      <a href="/" class="btn ghost lg">Learn more about OllaDNS</a>
    </div>
  </div>
</section>
`;
}

module.exports = { render };
