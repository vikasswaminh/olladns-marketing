// @start
const fs = require('fs');

const SLUG = 'dns-over-https-doh-complete-guide';
const CATEGORY = 'Guide';
const AUTHOR = 'olladns Security Team';

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let raw = fs.readFileSync('BLOG5.txt', 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2013]/g, '-')
  .replace(/[\u2014]/g, '—')
  .replace(/[\u2022]/g, '•')
  .trim();

const lines = raw.split('\n');

const title = lines[0].trim();
const readTime = lines[1].split('·')[0].trim();
const date = lines[1].match(/Updated (\d{4}-\d{2}-\d{2})/)[1];

const tldrStart = lines.indexOf('TLDR');
const takeawaysStart = lines.indexOf('Key Takeaways');
const introStart = lines.findIndex(l => l.startsWith('DNS Over HTTPS (DoH): The Protocol'));
const faqStart = lines.findIndex(l => l.startsWith('Frequently Asked Question'));
const honestTakeStart = lines.findIndex(l => l.startsWith('The Honest Take:'));
const bottomLineStart = lines.findIndex(l => l.startsWith('The Bottom Line:'));

const tldrText = lines.slice(tldrStart + 1, takeawaysStart)
  .filter(l => !/^(title|description|category|keywords|date|readTime):/.test(l))
  .join(' ').trim();
const takeawaysRaw = lines.slice(takeawaysStart + 1, introStart).filter(l => /^\*\s*/.test(l));
let bodyLines = lines.slice(introStart, honestTakeStart >= 0 ? honestTakeStart : undefined);
// Remove the raw tab-separated protocol comparison table; we render a styled one instead.
bodyLines = bodyLines.filter(l => !(l.includes('\t') && (/^(Protocol|DoH|DoT|DoQ)\b/.test(l.trim()) || /\t(Yes—|No—|Mostly—|Slower|Moderate|Faster)\b/.test(l))));
const honestTakeEnd = faqStart > honestTakeStart ? faqStart : undefined;
const honestTakeLines = honestTakeStart >= 0 ? lines.slice(honestTakeStart + 1, honestTakeEnd) : [];
const faqEnd = bottomLineStart > faqStart ? bottomLineStart : undefined;
const faqLines = faqStart >= 0 ? lines.slice(faqStart + 1, faqEnd).filter(l => l.trim() !== '') : [];
const bottomLines = bottomLineStart >= 0 ? lines.slice(bottomLineStart) : [];

const faqs = [];
let currentFaq = null;
faqLines.forEach(line => {
  const trimmed = line.trim();
  if (/^(Does|Do|Can|Is|Will|Should|Which|What|Where|When|How)\b/.test(trimmed)) {
    if (currentFaq) faqs.push(currentFaq);
    currentFaq = { q: trimmed.replace(/\?$/, '?'), a: [] };
  } else if (currentFaq) {
    currentFaq.a.push(trimmed);
  }
});
if (currentFaq) faqs.push(currentFaq);

const sectionTitles = [
  "DNS Over HTTPS (DoH): The Protocol That's Quietly Solving One of DNS's Oldest Problems",
  "Why DNS Visibility Became Dangerous",
  "What DNS Over HTTPS Actually Does (And doesn't)",
  "How DoH Differs from DoT and DoQ",
  "DoH Won the Visibility Battle, But for Complicated Reasons",
  "Privacy Win and the Security Blind Spot",
  "Why \"Just Enable DoH\" Isn't the Whole Story",
  "How Encryption Actually Protects DNS",
  "What DoH Doesn't Protect Against",
  "Deployment Realities: How Organizations Actually Implement DoH",
  "The Standards-Based Future: What's Actually Shipping",
  "A Real-World Deployment Checklist",
  "The Reality of DoH in Hostile Environments",
  "Common DoH Misconceptions"
];

const normalized = sectionTitles.map(t => t.toLowerCase().replace(/\s+/g, ' ').trim());

function isMajorSection(line) {
  const clean = line.trim().toLowerCase().replace(/\s+/g, ' ');
  return normalized.includes(clean);
}

const sections = [];
let current = null;
let paragraphBuffer = [];

function flushParagraph() {
  if (!paragraphBuffer.length) return;
  const text = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
  paragraphBuffer = [];
  if (!text || !current) return;
  current.paragraphs.push(text);
}

function startSection(heading) {
  flushParagraph();
  if (current) sections.push(current);
  const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
  current = { heading, id, paragraphs: [] };
}

function addSubheading(heading) {
  flushParagraph();
  if (!current) startSection('Introduction');
  current.paragraphs.push({ type: 'h3', text: heading });
}

for (let i = 0; i < bodyLines.length; i++) {
  const line = bodyLines[i];
  const trimmed = line.trim();
  const prevBlank = i === 0 || bodyLines[i - 1].trim() === '';

  if (!trimmed) {
    flushParagraph();
    continue;
  }

  if (isMajorSection(trimmed)) {
    startSection(trimmed);
    continue;
  }

  if (prevBlank && trimmed.length >= 10 && trimmed.length <= 80 && /^[A-Z]/.test(trimmed) && !/[:.!?]$/.test(trimmed) && !/^\d+\./.test(trimmed) && !/^[\*•\-]/.test(trimmed)) {
    addSubheading(trimmed);
    continue;
  }

  if (!current) startSection('Introduction');
  current.paragraphs.push(trimmed);
}
flushParagraph();
if (current) sections.push(current);

function buildHtml(items) {
  const out = [];
  let buffer = [];
  let listBuffer = [];
  let listType = null;

  function flushBuffer() {
    if (buffer.length) {
      const text = buffer.join(' ').replace(/\s+/g, ' ').trim();
      if (text) out.push(`<p>${escHtml(text)}</p>`);
      buffer = [];
    }
  }

  function flushList() {
    if (listBuffer.length) {
      const tag = listType === 'ol' ? 'ol' : 'ul';
      out.push(`<${tag}>\n${listBuffer.map(t => `<li>${escHtml(t)}</li>`).join('\n')}\n</${tag}>`);
      listBuffer = [];
      listType = null;
    }
  }

  items.forEach((item, index) => {
    if (typeof item === 'object' && item.type === 'h3') {
      flushList();
      flushBuffer();
      out.push(`<h3>${escHtml(item.text)}</h3>`);
      return;
    }

    const trimmed = item.trim();
    if (!trimmed) {
      flushList();
      flushBuffer();
      return;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
    if (olMatch) {
      flushBuffer();
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listBuffer.push(olMatch[2]);
      return;
    }

    if (/^[\*•\-]\s*/.test(trimmed)) {
      flushBuffer();
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listBuffer.push(trimmed.replace(/^[\*•\-]\s*/, ''));
      return;
    }

    flushList();
    buffer.push(trimmed);
  });
  flushBuffer();
  flushList();
  return out.join('\n');
}

const tocHtml = sections.map(s => `              <li><a href="#${s.id}">${escHtml(s.heading)}</a></li>`).join('\n');

function renderSection(sec, idx) {
  let html = "";

  // SECTION 1: DNS Over HTTPS (DoH): The Protocol That's Quietly Solving...
  if (sec.heading.toLowerCase().includes('quietly solving')) {
    html = `<blockquote class="post-quote" style="margin-top: 32px; font-size: 20px; line-height: 1.6; color: var(--text);">
      <p>Imagine if every time you typed a web address into your browser, someone was standing outside your window watching you do it. They couldn't see what you were reading once the page loaded—your browser's encryption handled that—but they could see every single domain name you requested.</p>
    </blockquote>
    <p style="font-size: 18px; font-weight: 500; color: var(--accent); margin-bottom: 24px;">That used to be the reality of how DNS worked. It still is, for most of the world.</p>
    <p>DNS Over HTTPS (DoH) is the protocol quietly fixing that. And while it's been around for a few years now, most people still don't realize it's even possible to encrypt DNS traffic at all, let alone how much of a difference it makes to both security and privacy the moment you understand what's happening beneath the surface.</p>`;
  }

  // SECTION 2: Why DNS Visibility Became Dangerous
  else if (sec.heading.toLowerCase().includes('became dangerous')) {
    html = `<p>Here's something that might surprise you: your Internet Service Provider can see every single domain you visit. So can anyone running a DNS resolver you use. So can someone with network access between your device and that resolver.</p>
    <p>The reason is brutally simple: DNS traffic, until DoH came along, traveled in plaintext.</p>
    
    <h3 style="margin-top: 32px; font-size: 18px;">Who is watching your plaintext DNS?</h3>
    <div class="attack-surface-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 24px 0 32px;">
      <div class="surface-card" style="background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px;">
        <div class="surface-num">01</div>
        <h4 style="margin: 0 0 8px; font-size: 16px;">Internet Service Providers</h4>
        <p style="margin: 0; font-size: 15px; color: var(--text-2);">ISPs have been caught selling DNS query data or mining it to build profiles of user behavior.</p>
      </div>
      <div class="surface-card" style="background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px;">
        <div class="surface-num">02</div>
        <h4 style="margin: 0 0 8px; font-size: 16px;">Authoritarian Governments</h4>
        <p style="margin: 0; font-size: 15px; color: var(--text-2);">Weaponized DNS visibility to identify and suppress dissidents by tracking domain access.</p>
      </div>
      <div class="surface-card" style="background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px;">
        <div class="surface-num">03</div>
        <h4 style="margin: 0 0 8px; font-size: 16px;">Advertisers</h4>
        <p style="margin: 0; font-size: 15px; color: var(--text-2);">Purchased DNS data to build impossibly detailed profiles of user behavior and intimate traits.</p>
      </div>
      <div class="surface-card" style="background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px;">
        <div class="surface-num">04</div>
        <h4 style="margin: 0 0 8px; font-size: 16px;">Hostile Actors</h4>
        <p style="margin: 0; font-size: 15px; color: var(--text-2);">Used DNS visibility to identify which security tools users were installing by watching them query security vendor domains.</p>
      </div>
    </div>
    <p>DNS visibility is behavioral exposure at the most intimate level. And yet, for decades, this was just how DNS worked. Full stop. No encryption. No privacy.</p>`;
  }

  // SECTION 3: What DNS Over HTTPS Actually Does
  else if (sec.heading.toLowerCase().includes('what dns over https actually does')) {
    html = `<p>Let's start with the technical fundamentals, because "wrapping DNS in HTTPS" sounds simple but involves some genuinely important nuances.</p>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 32px; margin-bottom: 32px;">
      <div style="background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 28px;">
        <h3 style="margin-top: 0; font-size: 18px; color: var(--accent);">Traditional DNS (Port 53)</h3>
        <ul class="dns-flow" style="list-style: none; padding: 0; margin: 20px 0 0; display: flex; flex-direction: column; gap: 16px;">
          <li style="display: flex; gap: 12px;"><span style="color: var(--muted);">1.</span> <span style="font-size: 15px; color: var(--text-2);">Device asks resolver for IP in plaintext</span></li>
          <li style="display: flex; gap: 12px;"><span style="color: var(--muted);">2.</span> <span style="font-size: 15px; color: var(--text-2);">Query travels unencrypted over network</span></li>
          <li style="display: flex; gap: 12px;"><span style="color: var(--muted);">3.</span> <span style="font-size: 15px; color: var(--text-2);">Resolver replies in plaintext</span></li>
          <li style="display: flex; gap: 12px;"><span style="color: var(--muted);">4.</span> <span style="font-size: 15px; color: var(--accent); font-weight: 600;">Anyone monitoring sees everything</span></li>
        </ul>
      </div>
      <div style="background: var(--panel); border: 1px solid var(--accent-line); border-radius: var(--r-lg); padding: 28px; position: relative;">
        <div style="position: absolute; top: -12px; right: 24px; background: var(--accent); color: #fff; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: .05em;">With DoH</div>
        <h3 style="margin-top: 0; font-size: 18px;">DoH (Port 443)</h3>
        <ul class="dns-flow" style="list-style: none; padding: 0; margin: 20px 0 0; display: flex; flex-direction: column; gap: 16px;">
          <li style="display: flex; gap: 12px;"><span style="color: var(--accent);">1.</span> <span style="font-size: 15px; color: var(--text-2);">Device encrypts query inside HTTPS</span></li>
          <li style="display: flex; gap: 12px;"><span style="color: var(--accent);">2.</span> <span style="font-size: 15px; color: var(--text-2);">Query looks like normal web traffic</span></li>
          <li style="display: flex; gap: 12px;"><span style="color: var(--accent);">3.</span> <span style="font-size: 15px; color: var(--text-2);">Resolver processes and replies securely</span></li>
          <li style="display: flex; gap: 12px;"><span style="color: var(--accent);">4.</span> <span style="font-size: 15px; color: var(--text); font-weight: 600;">Only you and the resolver know the domain</span></li>
        </ul>
      </div>
    </div>
    
    <p>But here's the critical part that often gets glossed over in explanations: DoH doesn't stop the resolver you're using from seeing your queries.</p>
    <p>What it does is make your queries visible <strong>only</strong> to the DoH resolver you've configured to use, and removes visibility from your ISP, your network administrator, any tool sitting on your home Wi-Fi, anyone routing your traffic. But the resolver still knows.</p>`;
  }

  // SECTION 4: How DoH Differs from DoT and DoQ
  else if (sec.heading.toLowerCase().includes('differs from dot')) {
    html = `<p>DoH is not the only encrypted DNS protocol. It competes primarily with two others:</p>`;
    html += `
      <div class="technique-row" style="background: transparent; border: none; padding: 0; box-shadow: none;">
        <div class="technique-visual">
          <div class="visual-card">
            <div class="visual-label">Protocol</div>
            <div class="concept-ic" style="margin: 0 auto 10px auto;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
            <h4 style="margin:0; font-size:18px;">DNS over TLS (DoT)</h4>
          </div>
        </div>
        <div class="technique-text">
          <p>Wraps DNS queries in TLS encryption, but uses a dedicated port (853) instead of blending in with HTTPS traffic. This makes it easier for network administrators to identify and manage DNS traffic, but also easier for firewalls to block if they want to force fallback to plain-text DNS.</p>
        </div>
      </div>
      <div class="technique-row reverse" style="background: transparent; border: none; padding: 0; box-shadow: none;">
        <div class="technique-visual">
          <div class="visual-card">
            <div class="visual-label">Protocol</div>
            <div class="concept-ic" style="margin: 0 auto 10px auto;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
            <h4 style="margin:0; font-size:18px;">DNS over QUIC (DoQ)</h4>
          </div>
        </div>
        <div class="technique-text">
          <p>The newest standard, built on the UDP-based QUIC protocol. It offers the same encryption but with lower latency and better performance on poor networks, as it avoids the "head-of-line blocking" problem inherent to TCP-based protocols like DoT and DoH.</p>
        </div>
      </div>
    `;
  }

  // SECTION 6: Privacy Win and the Security Blind Spot
  else if (sec.heading.toLowerCase().includes('privacy win and the security blind spot')) {
    html = `<p>DoH presents a classic trade-off between user privacy and organizational security.</p>`;
    html += `<div class="concept-grid" style="margin-top: 32px;">
      <div class="concept-card" style="border-top: 4px solid var(--accent);">
        <h4 style="color: var(--accent); font-size: 18px; margin-bottom: 16px;">The Privacy Win</h4>
        <p>For the average user sitting in a coffee shop, DoH is a massive win. It prevents the local Wi-Fi provider, rogue actors on the network, and the upstream ISP from tracking which domains the user visits or manipulating the responses. It secures the "last mile" of DNS resolution.</p>
      </div>
      <div class="concept-card" style="border-top: 4px solid var(--muted);">
        <h4 style="font-size: 18px; margin-bottom: 16px;">The Security Complication</h4>
        <p>For an enterprise security team, that exact same encryption is a nightmare if unmanaged. If a user's browser silently upgrades to DoH and bypasses the corporate DNS resolver, the security team loses their primary mechanism for blocking phishing links, detecting malware command-and-control traffic, and enforcing content policies.</p>
      </div>
    </div>`;
  }

  // SECTION 7: Why "Just Enable DoH" Isn't the Whole Story
  else if (sec.heading.toLowerCase().includes("isn't the whole story")) {
    html = `<p>If encryption is good, why not just turn it on everywhere immediately? Because DNS is foundational, changing how it works breaks implicit assumptions built into networks over decades.</p>`;
    html += `<ul class="trend-list" style="margin-top: 32px;">
      <li>
        <span class="trend-num">01</span>
        <div>
          <h4 style="margin: 0 0 8px; font-size: 16px;">Discovery and Configuration</h4>
          <p style="font-size: 15px; color: var(--text-2);">Traditional DNS is discovered automatically via DHCP when a device joins a network. DoH often requires explicit configuration or relies on complex discovery mechanisms (like the DDR standard) that are not yet universally supported.</p>
        </div>
      </li>
      <li>
        <span class="trend-num">02</span>
        <div>
          <h4 style="margin: 0 0 8px; font-size: 16px;">Resolver Selection Isn't Neutral</h4>
          <p style="font-size: 15px; color: var(--text-2);">When a browser switches to DoH, it must decide which resolver to use. If it uses a public provider (like Cloudflare), the user's data is now centralized with that provider instead of their ISP. This centralization has sparked intense debate about who controls internet traffic.</p>
        </div>
      </li>
      <li>
        <span class="trend-num">03</span>
        <div>
          <h4 style="margin: 0 0 8px; font-size: 16px;">Internal Network Problems</h4>
          <p style="font-size: 15px; color: var(--text-2);">Enterprises rely on internal DNS for things like <code>intranet.corp</code>. If a browser bypasses local DNS and sends that query to a public DoH resolver, the internal site breaks.</p>
        </div>
      </li>
    </ul>`;
  }

  // SECTION 8: How Encryption Actually Protects DNS
  else if (sec.heading.toLowerCase().includes('how encryption actually protects')) {
    html = `<p>Encrypting DNS isn't just about hiding what websites you visit from your ISP. It addresses several distinct threat vectors:</p>`;
    html += `<div class="concept-grid">
      <div class="concept-card">
        <div class="concept-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
        <h4>Man-in-the-Middle Attacks</h4>
        <p>Because traditional DNS is plain text, anyone on the network path can spoof responses and redirect users to malicious servers. DoH ensures responses are authenticated and haven't been tampered with.</p>
      </div>
      <div class="concept-card">
        <div class="concept-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg></div>
        <h4>ISP-Level Surveillance</h4>
        <p>Many ISPs mine plain-text DNS traffic to build profiles of user behavior for advertising. DoH blinds the ISP to which specific domains a user is querying, restoring privacy.</p>
      </div>
      <div class="concept-card">
        <div class="concept-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>
        <h4>Government Data Collection</h4>
        <p>In jurisdictions that mandate sweeping data retention, plain-text DNS provides a nearly complete log of citizen activity. DoH disrupts this mass collection by hiding the metadata.</p>
      </div>
      <div class="concept-card">
        <div class="concept-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
        <h4>Censorship Circumvention</h4>
        <p>Authoritarian regimes frequently use DNS filtering to block access to specific websites or news sources. By using an independent DoH resolver, users can bypass local DNS blocks entirely.</p>
      </div>
    </div>`;
  }

  // SECTION 10: Deployment Realities
  else if (sec.heading.toLowerCase().includes('deployment realities')) {
    html = `<p>The reality of deploying DoH varies wildly depending on who is doing it.</p>`;
    html += `<div class="tech-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 32px;">
      <div class="tech-card" style="background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px;">
        <h4 style="margin: 0 0 10px; font-size: 16px;">For Individual Users</h4>
        <p style="margin: 0; font-size: 15px; color: var(--text-2); line-height: 1.6;">Easy, but confusing. Browsers often enable it automatically, but users rarely understand which resolver they are actually using or the privacy implications of that choice.</p>
      </div>
      <div class="tech-card" style="background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px;">
        <h4 style="margin: 0 0 10px; font-size: 16px;">The Certificate Authority Problem</h4>
        <p style="margin: 0; font-size: 15px; color: var(--text-2); line-height: 1.6;">If you run an internal DoH resolver, every endpoint must trust the TLS certificate of that resolver. Pushing custom root certificates to every BYOD device is a logistical nightmare.</p>
      </div>
      <div class="tech-card" style="background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px;">
        <h4 style="margin: 0 0 10px; font-size: 16px;">MDM Complexity</h4>
        <p style="margin: 0; font-size: 15px; color: var(--text-2); line-height: 1.6;">Configuring DoH at the OS level (e.g., via Apple profiles) is the best way to ensure coverage, but it requires mature Mobile Device Management infrastructure.</p>
      </div>
      <div class="tech-card" style="background: var(--panel); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px;">
        <h4 style="margin: 0 0 10px; font-size: 16px;">The Filtering Complication</h4>
        <p style="margin: 0; font-size: 15px; color: var(--text-2); line-height: 1.6;">To filter malware, the designated DoH resolver must be capable of inspecting queries and applying policy, not just blindly resolving them.</p>
      </div>
    </div>`;
  }

  // SECTION 12: A Real-World Deployment Checklist
  else if (sec.heading.toLowerCase().includes('deployment checklist')) {
    html = `<p>Rolling out DoH effectively requires coordination across network, identity, and security teams. Here is how organizations are doing it in practice:</p>`;
    html += `<ul class="checklist">
      <li>
        <span class="check-ck">1</span>
        <div>
          <h4>Define the Endpoint Strategy First</h4>
          <p>Decide how you will push DoH settings. MDM (Mobile Device Management) profiles for macOS and iOS, and Group Policy or Intune for Windows, are the only ways to ensure DoH is used universally across corporate devices without user intervention.</p>
        </div>
      </li>
      <li>
        <span class="check-ck">2</span>
        <div>
          <h4>Establish the Designated Resolver</h4>
          <p>You must have a designated corporate DoH resolver (like olladns) that applies your security policies. If you simply turn DoH on without specifying the resolver, browsers may default to public providers, bypassing your corporate filtering entirely.</p>
        </div>
      </li>
      <li>
        <span class="check-ck">3</span>
        <div>
          <h4>Handle Internal Domains</h4>
          <p>This is the most common failure point. Ensure your DoH configuration explicitly bypasses the encrypted resolver for internal domains (e.g., <code>*.corp.internal</code>) and routes those queries to your internal plain-text DNS servers, otherwise internal apps will break.</p>
        </div>
      </li>
      <li>
        <span class="check-ck">4</span>
        <div>
          <h4>Disable Browser Overrides</h4>
          <p>Use enterprise policies to lock the browser's DNS settings. If a user can manually change Chrome or Firefox to use a different DoH provider, they can bypass all corporate security controls and filtering policies.</p>
        </div>
      </li>
    </ul>`;
  }

  // SECTION 14: Common DoH Misconceptions
  else if (sec.heading.toLowerCase().includes('common doh misconceptions')) {
    html = `<p>Because DoH sits at the intersection of privacy advocacy and enterprise security, it has generated significant confusion. Let's clear up the most persistent myths:</p>`;
    html += `<div class="accordion">
      <details class="faq-item">
        <summary>
          <span>"DoH hides everything from my employer"</span>
          <span class="faq-icon" style="color: var(--accent); font-size: 18px; font-weight: 300; flex: none; width: 28px; height: 28px; border: 1.5px solid var(--accent-line); border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--accent-soft); transition: transform .2s;">+</span>
        </summary>
        <div class="accordion-body">
          <p>False. If you are using a corporate device or a corporate network, your employer likely mandates the use of their own DoH resolver or decrypts HTTPS traffic using a proxy. DoH encrypts the traffic on the wire, but it doesn't hide the destination from the entity operating the resolver.</p>
        </div>
      </details>
      <details class="faq-item">
        <summary>
          <span>"DoH makes malware invisible"</span>
          <span class="faq-icon" style="color: var(--accent); font-size: 18px; font-weight: 300; flex: none; width: 28px; height: 28px; border: 1.5px solid var(--accent-line); border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--accent-soft); transition: transform .2s;">+</span>
        </summary>
        <div class="accordion-body">
          <p>Partially true, but mostly false. While legacy network monitoring tools can't passively sniff DoH traffic, modern security architectures (like Protective DNS) integrate the inspection directly into the resolver itself. Malware using DoH is just as visible to the designated resolver as plain-text DNS.</p>
        </div>
      </details>
      <details class="faq-item">
        <summary>
          <span>"DoH is slower than regular DNS"</span>
          <span class="faq-icon" style="color: var(--accent); font-size: 18px; font-weight: 300; flex: none; width: 28px; height: 28px; border: 1.5px solid var(--accent-line); border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--accent-soft); transition: transform .2s;">+</span>
        </summary>
        <div class="accordion-body">
          <p>In theory, the overhead of HTTPS encryption adds latency. In practice, modern connection pooling, HTTP/2 multiplexing, and robust resolver caching mean the performance difference is negligible, and often faster than slow ISP-provided plain-text resolvers.</p>
        </div>
      </details>
    </div>`;
  }

  // OTHER SECTIONS
  else {
    html = buildHtml(sec.paragraphs);
  }

  return `
          <section class="post-section" id="${sec.id}">
            <span class="section-num">${String(idx + 1).padStart(2, '0')}</span>
            <h2>${escHtml(sec.heading)}</h2>
            ${html}
          </section>`;
}

let sectionsHtml = sections.map((s, i) => renderSection(s, i)).join('\n');

if (faqs.length) {
  const faqHtml = `
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
${faqs.map(f => {
    const answer = buildHtml(f.a);
    return `            <details class="faq-item" style="background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--r-md); overflow: hidden;">
              <summary style="font-size: 16px; font-weight: 600; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; color: var(--text); padding: 18px 22px;">
                <span>${escHtml(f.q)}</span>
                <span class="faq-icon" style="color: var(--accent); font-size: 18px; font-weight: 300; flex: none; width: 28px; height: 28px; border: 1.5px solid var(--accent-line); border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--accent-soft); transition: transform .2s;">+</span>
              </summary>
              <div style="padding: 14px 22px 18px; font-size: 15.5px; line-height: 1.7; color: var(--text-2); border-top: 1px solid var(--line);">
                ${answer}
              </div>
            </details>`;
  }).join('\n')}
          </div>`;

  sectionsHtml += `
          <section class="post-section" id="frequently-asked-questions">
            <span class="section-num">${sections.length + 1}</span>
            <h2>Frequently Asked Questions</h2>
            ${faqHtml}
          </section>`;
}

if (bottomLines.length) {
  const bottomHeading = bottomLines[0].trim();
  const bottomParas = bottomLines.slice(1).map(l => l.trim()).filter(Boolean);
  const bottomId = bottomHeading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
  const bottomHtml = buildHtml(bottomParas);
  sectionsHtml += `
          <section class="post-bottom-line" style="margin-top: 40px; padding: 32px; background: var(--bg-1); border: 1px solid var(--line); border-radius: var(--r-lg);">
            <h2 style="font-size: 22px; color: var(--accent); margin-top: 0;">${escHtml(bottomHeading)}</h2>
            <div style="font-size: 16px; line-height: 1.7; color: var(--text-2);">
              ${bottomHtml}
            </div>
          </section>`;
}

if (honestTakeLines.length) {
  sectionsHtml += `
          <section class="post-section" id="the-honest-take">
            <span class="section-num">${sections.length + 3}</span>
            <h2>The Honest Take: What DoH Is and Isn't</h2>
            <div class="conclusion-box" style="background: linear-gradient(180deg, var(--accent-soft), rgba(218, 41, 28, .02)); border: 2px solid var(--accent); border-radius: var(--r-lg); padding: 48px 32px; margin-top: 24px;">
              <p style="font-size: 20px; line-height: 1.7; color: var(--text); font-weight: 600; margin-top: 0;">DoH is not a silver bullet, nor is it the end of network security visibility. It is a necessary evolution of a protocol that was designed for a friendlier internet.</p>
              <p style="font-size: 18px; line-height: 1.7; color: var(--text-2); margin-top: 24px; font-weight: 500;">For individual users, it provides crucial protection against local surveillance and manipulation. For enterprises, it requires a shift in architecture: moving DNS security from passive network inspection to active, endpoint-aware encrypted resolution.</p>
              <p style="font-size: 22px; line-height: 1.7; color: var(--accent); margin-top: 24px; font-weight: 800; text-transform: uppercase;">The goal is no longer to stop DNS encryption—it is to manage it.</p>
              <div class="conclusion-cta" style="margin-top: 40px;">
                <a href="https://olladns.com/product.html" class="btn" style="background: var(--accent); color: #fff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 18px; font-weight: 700; display: inline-block; box-shadow: 0 4px 12px rgba(218, 41, 28, 0.3);">See olladns Protective DNS</a>
              </div>
            </div>
          </section>`;
}

const takeawaysHtml = takeawaysRaw.map(l => {
  const text = l.replace(/^\*\s*/, '').trim();
  const match = text.match(/^(.+?)\s*[—–-]\s*(.+)$/);
  if (match) {
    return `        <li style="margin-bottom: 8px;"><strong>${escHtml(match[1].trim())}:</strong> ${escHtml(match[2].trim())}</li>`;
  }
  return `        <li style="margin-bottom: 8px;">${escHtml(text)}</li>`;
}).join('\n');

const tldrHtml = `
        <div class="post-tldr" style="margin-bottom: 32px;">
          <div class="tldr-head">
            <span class="tldr-label">TL;DR</span>
            <h3 style="font-size: 20px; margin: 0; color: var(--text);">DNS Over HTTPS in 60 Seconds</h3>
          </div>
          <ul class="tldr-list">
            <li><span class="ck">✓</span> ${escHtml(tldrText)}</li>
          </ul>
        </div>
        <div class="what-found" style="margin: 0 0 40px 0;">
          <div class="what-found-head">
            <span class="tldr-label">Key Takeaways</span>
            <h3 style="font-size: 20px; margin: 0; color: var(--text);">What You'll Learn</h3>
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 15.5px; line-height: 1.7; color: var(--text-2);">
${takeawaysHtml}
          </ul>
        </div>`;

const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const ogTitle = `${escHtml(title)} &middot; olladns Blog`;
const description = "DNS Over HTTPS encrypts DNS queries so ISPs and network operators can't see your domain lookups. Learn how DoH works, why it matters, deployment challenges, and how it compares to DoT and DoQ.";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${ogTitle}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${description}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://olladns.com/blog/${SLUG}/">
  <meta property="og:image" content="data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'1280'%20height%3D'720'%3E%3Crect%20fill%3D'%2523f4f4f5'%20width%3D'1280'%20height%3D'720'%2F%3E%3Ctext%20fill%3D'%2523DA291C'%20font-family%3D'sans-serif'%20font-size%3D'28'%20font-weight%3D'600'%20x%3D'640'%20y%3D'370'%20text-anchor%3D'middle'%3EDoH%3C%2Ftext%3E%3C%2Fsvg%3E">
  <meta property="article:published_time" content="${date}">
  <meta property="article:author" content="${AUTHOR}">
  <meta property="article:section" content="${CATEGORY}">
  <link rel="canonical" href="https://olladns.com/blog/${SLUG}/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700;900&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/site.css?v=20260827">
  <style>
    .post-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 64px;
      align-items: start;
      padding-top: 56px
    }

    .post-toc {
      position: sticky;
      top: 100px;
      max-height: calc(100vh - 120px);
      overflow: auto;
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .post-toc h4 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: var(--muted);
      margin: 0 0 14px
    }

    .post-toc ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px
    }

    .post-toc a {
      display: block;
      font-size: 13.5px;
      color: var(--text-2);
      padding: 7px 12px;
      border-radius: 6px;
      border-left: 2px solid transparent;
      transition: .15s
    }

    .post-toc a:hover {
      color: var(--accent);
      background: var(--bg-2)
    }

    .post-toc a.active {
      color: var(--accent);
      background: var(--accent-soft);
      border-left-color: var(--accent);
      font-weight: 600
    }

    .post-meta {
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
      margin-top: 18px;
      color: var(--muted);
      font-size: 14px
    }

    .post-meta .tag {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: .08em
    }

    .post-thumb {
      aspect-ratio: 16/9;
      background: var(--bg-2);
      border-radius: var(--r-md);
      overflow: hidden;
      border: 1px solid var(--line);
      margin-bottom: 36px
    }

    .post-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block
    }

    .post-body {
      max-width: none;
      margin: 0;
      min-width: 0;
    }


    .post-body h2 {
      font-size: 24px;
      margin: 42px 0 16px;
      color: var(--text)
    }

    .post-body h3 {
      font-size: 18px;
      margin: 32px 0 12px;
      color: var(--text)
    }

    .post-body p {
      font-size: 15.5px;
      line-height: 1.7;
      color: var(--text-2);
      margin: 0 0 18px
    }

    .post-body .lede {
      font-size: 18px;
      color: var(--text);
      line-height: 1.7;
      margin-bottom: 28px
    }

    .post-body ul,
    .post-body ol {
      margin: 0 0 20px;
      padding-left: 24px;
      color: var(--text-2);
      font-size: 15.5px;
      line-height: 1.7
    }

    .post-body li {
      margin-bottom: 8px
    }

    .post-tldr {
      background: linear-gradient(145deg, var(--panel), var(--bg-1));
      border: 1px solid var(--accent-line);
      border-left: 4px solid var(--accent);
      border-radius: var(--r-md);
      padding: 24px 32px;
      margin-bottom: 40px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    
    .post-tldr h3 {
      margin: 0 0 12px 0;
      color: var(--accent);
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .post-tldr h3::before {
      content: '⚡';
      font-size: 16px;
    }

    .post-tldr p {
      margin: 0;
      font-size: 16px;
      line-height: 1.7;
      color: var(--text);
    }

    .post-body code {
      font-family: var(--mono);
      font-size: 13px;
      background: var(--bg-2);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text)
    }

    .post-body pre {
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 18px;
      overflow-x: auto;
      margin: 22px 0
    }

    .post-body pre code {
      background: transparent;
      padding: 0
    }

    .post-body blockquote {
      border-left: 3px solid var(--accent);
      margin: 24px 0;
      padding-left: 20px;
      color: var(--muted);
      font-style: italic
    }

    .post-author {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 32px;
      color: var(--muted);
      font-size: 14px
    }

    .post-author .dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-soft);
      color: var(--accent);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 13px
    }

    .post-nav {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-top: 56px;
      padding-top: 24px;
      border-top: 1px solid var(--line)
    }

    .post-nav a {
      color: var(--accent);
      font-size: 14px;
      font-weight: 500
    }

    .post-nav a:hover {
      text-decoration: underline
    }

    .post-section {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      padding: 32px 36px;
      margin-bottom: 24px;
      scroll-margin-top: 92px;
    }

    .section-num {
      display: inline-block;
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: .08em;
      margin-bottom: 10px;
    }

    .tldr-label {
      font-family: var(--mono); font-size: 11px;
      font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; background: var(--accent);
      color: #fff; padding: 5px 12px; border-radius: 999px;
    }

    .tldr-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }

    .tldr-list {
      margin: 0;
      padding-left: 20px;
      font-size: 15.5px;
      line-height: 1.7;
      color: var(--text-2);
    }

    .tldr-list li {
      margin-bottom: 8px;
    }

    .what-found {
      background: var(--panel); border: 1px solid var(--line);
      border-radius: var(--r-lg); padding: 26px;
      margin: 28px 0 36px; box-shadow: var(--shadow);
    }

    .what-found-head {
      display: flex;
      align-items: center;
      gap: 10px; margin-bottom: 14px;
    }

    .faq-item summary::-webkit-details-marker { display: none; }

    .faq-item[open] .faq-icon { transform: rotate(45deg); }

    .faq-item:not([open]) .faq-icon { transform: rotate(0deg); }

    .post-quote {
      border-left: 3px solid var(--accent);
      margin: 28px 0;
      padding: 6px 0 6px 24px;
      background: transparent
    }

    .post-quote p {
      font-size: 20px;
      color: var(--text);
      font-style: italic;
      margin: 0;
      line-height: 1.55
    }
    
    .attack-surface-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin: 26px 0
    }

    .surface-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .surface-num {
      font-family: var(--mono);
      font-size: 24px;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 10px
    }

    .concept-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
      margin: 24px 0
    }

    .concept-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 24px;
      transition: .15s
    }

    .concept-ic {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: var(--accent-soft);
      color: var(--accent);
      display: grid;
      place-items: center;
      border: 1px solid var(--accent-line);
      margin-bottom: 14px
    }

    .concept-card h4 {
      margin: 0 0 10px;
      font-size: 16px
    }

    .concept-card p {
      margin: 0;
      font-size: 15px;
      color: var(--text-2);
      line-height: 1.65
    }

    .technique-row {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 28px;
      align-items: start;
      margin: 36px 0;
      padding: 26px;
      background: var(--bg-1);
      border: 1px solid var(--line);
      border-radius: var(--r-lg)
    }

    .technique-row.reverse {
      grid-template-columns: 300px 1fr
    }

    .technique-text h3 {
      margin-top: 0;
      font-size: 21px
    }
    
    .technique-text p {
      font-size: 15.5px;
      line-height: 1.7;
      color: var(--text-2);
    }

    .technique-visual {
      display: grid;
      place-items: center
    }

    .visual-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 20px;
      text-align: center;
      width: 100%
    }

    .visual-label {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 6px
    }

    .checklist {
      list-style: none;
      margin: 26px 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px
    }

    .checklist>li {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 18px
    }
    
    .checklist>li h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: var(--text);
    }
    
    .checklist>li p {
      margin: 0;
    }

    .check-ck {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      display: grid;
      place-items: center;
      font-size: 12px;
      flex: none;
      margin-top: 1px;
      font-weight: bold;
    }

    .accordion {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 26px 0
    }

    .accordion details {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      overflow: hidden
    }

    .accordion summary {
      cursor: pointer;
      padding: 18px 20px;
      font-weight: 600;
      color: var(--text);
      font-size: 16px;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      transition: .15s
    }

    .accordion summary:hover {
      background: var(--bg-1)
    }

    .accordion-body {
      padding: 0 20px 20px
    }

    .accordion-body p {
      margin: 0;
      font-size: 15.5px;
      line-height: 1.7
    }

    table.protocol-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 14px;
    }

    table.protocol-table th,
    table.protocol-table td {
      border: 1px solid var(--line);
      padding: 12px 14px;
      text-align: left;
      color: var(--text-2);
    }

    table.protocol-table th {
      background: var(--bg-1);
      color: var(--text);
      font-weight: 600;
    }

    @media (max-width:1000px) {
      .post-layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 40px
      }
      .post-toc {
          position: static;
          max-height: none;
          overflow: visible;
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: var(--r-lg);
          padding: 24px;
          margin-bottom: 32px;
        }
      .post-toc h4 {
        margin-bottom: 10px
      }
      .post-body { max-width: none; }
      
      .concept-grid {
        grid-template-columns: 1fr
      }

      .tech-grid {
        grid-template-columns: 1fr !important;
      }

      .technique-row,
      .technique-row.reverse {
        grid-template-columns: 1fr
      }
    }

    .trend-list {
      list-style: none;
      margin: 26px 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 14px
    }

    .trend-list>li {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--r-md);
      padding: 20px
    }

    .trend-num {
      font-family: var(--mono);
      font-size: 18px;
      font-weight: 700;
      color: var(--accent);
      flex: none;
      width: 32px
    }
    
    @media (max-width: 768px) {
      .post-section { padding: 20px; }
      table.protocol-table { font-size: 12.5px; }
    }
  </style>
</head>

<body data-screen-label="Marketing &mdash; Blog Post">

  <div id="site-nav"></div>

  <section class="page-hero" style="padding-top: 24px; padding-bottom:40px">
    <div class="grid-bg"></div>
    <div class="container" style="position: relative; text-align: center; display: flex; flex-direction: column; align-items: center;">
      <span class="eyebrow"><a href="/blog/" style="color:inherit">Blog</a></span>
      <h1 class="gradient-text" style="font-size: clamp(26px, 3.8vw, 46px); line-height: 1.2; max-width: 700px;">${escHtml(title)}</h1>
      <div class="post-meta">
        <span class="tag">${CATEGORY}</span>
        <span>${displayDate}</span>
        <span>${readTime}</span>
        <span>by ${AUTHOR}</span>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">

      <div class="post-layout">
        <aside class="post-toc" aria-label="Table of contents">
          <h4>Table of Contents</h4>
          <ul>
            ${tocHtml}
          </ul>
        </aside>

        <article class="post-body">
${tldrHtml}
${sectionsHtml}

          <div class="post-nav">
            <a href="/blog/dns-filtering-explained/">&larr; DNS Filtering Explained</a>
            <a href="/blog/dns-firewall-explained-how-dns-firewalls-protect-networks/">DNS Firewall Explained &rarr;</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <div id="site-footer"></div>

  <script src="/chrome.js?v=20260827"></script>
  <script>
    mountChrome('blog');

    document.addEventListener('click', function (e) {
      const link = e.target.closest('.post-toc a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
      if (history.pushState) history.pushState(null, '', link.getAttribute('href'));
    });
  </script>

</body>
</html>`;

fs.mkdirSync('blog/' + SLUG, { recursive: true });
fs.writeFileSync('blog/' + SLUG + '/index.html', html);
fs.writeFileSync('blog-posts/' + SLUG + '.html', html);

console.log('Generated:', 'blog/' + SLUG + '/index.html');
console.log('Generated:', 'blog-posts/' + SLUG + '.html');
console.log('Date:', date, 'Display:', displayDate);
console.log('Sections:', sections.length);
sections.forEach((s, i) => {
  const subs = s.paragraphs.filter(p => typeof p === 'object' && p.type === 'h3').map(p => p.text);
  console.log(`  ${i + 1}. ${s.heading}`);
  subs.forEach(sub => console.log(`     - ${sub}`));
});
// @end
