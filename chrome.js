/* Marketing: small icon + shared component helpers */
(function(){
  const NS = "http://www.w3.org/2000/svg";
  function svg(d, opts={}){
    const size = opts.size || 16;
    const sw = opts.sw || 1.7;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  }
  const ICONS = {
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'shield-check':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    'shield-alert':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    ai:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>',
    globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20"/>',
    activity:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    devices:'<rect x="2" y="6" width="14" height="10" rx="2"/><path d="M22 9v8a2 2 0 0 1-2 2h-4"/><line x1="2" y1="19" x2="14" y2="19"/>',
    plug:'<path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0V8z"/><path d="M12 18v4"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    list:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/>',
    cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9z"/>',
    check:'<polyline points="20 6 9 17 4 12"/>',
    x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    arrow:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    chev:'<polyline points="9 18 15 12 9 6"/>',
    chevd:'<polyline points="6 9 12 15 18 9"/>',
    play:'<polygon points="6 4 20 12 6 20 6 4"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    bolt:'<polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2"/>',
    sparkle:'<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
    lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M7 11V8a5 5 0 0 1 10 0v3"/>',
    map:'<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
    school:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    server:'<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><line x1="6" y1="7" x2="6.01" y2="7"/><line x1="6" y1="17" x2="6.01" y2="17"/>',
    building:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M8 10h.01M8 14h.01M12 6h.01M12 10h.01M12 14h.01M16 6h.01M16 10h.01M16 14h.01"/>',
    truck:'<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    quote:'<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 .985 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>',
    cloud:'<path d="M17.5 19a4.5 4.5 0 1 0-.7-8.97A6 6 0 0 0 5 12.5 4.5 4.5 0 0 0 6.5 19z"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    twitter:'<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2-6-1.6-6-9-6-9 1 1 2 1.5 3 1.5C2 7 4 1 7 3c2.6 2 5.5 3 9 3 0-1 1-3 3-3 1 0 3 1 3 1z"/>',
    github:'<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    linkedin:'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    quoteicon:'<path d="M3 21c3 0 7-1 7-8V5"/>',
  };
  window.icon = (name, opts={}) => svg(ICONS[name] || ICONS.shield, opts);

  // Smart nav with active state
  window.renderNav = (active) => {
    const links = [
      {key:'product', label:'Product', href:'product.html'},
      {key:'solutions', label:'Solutions', href:'solutions.html'},
      {key:'pricing', label:'Pricing', href:'pricing.html'},
      {key:'customers', label:'Customers', href:'customers.html'},
      {key:'resources', label:'Resources', href:'resources.html'},
      {key:'company', label:'Company', href:'company.html'},
    ];
    return `
      <nav class="nav">
        <div class="container nav-inner">
          <a href="index.html" class="brand">
            <div class="brand-mark">${icon('shield-check',{size:18,sw:2.4})}</div>
            <span>olladns</span>
          </a>
          <div class="nav-links">
            ${links.map(l=>`<a class="nav-link ${active===l.key?'active':''}" href="${l.href}">${l.label}</a>`).join('')}
          </div>
          <div class="nav-cta">
            <a class="nav-link" href="../index.html">Sign in</a>
            <a class="btn primary" href="contact.html">Request demo ${icon('arrow',{size:14})}</a>
          </div>
        </div>
      </nav>`;
  };

  window.renderFooter = () => `
    <footer class="footer">
      <div class="container">
        <div class="footer-inner">
          <div>
            <a href="index.html" class="brand">
              <div class="brand-mark">${icon('shield-check',{size:18,sw:2.4})}</div>
              <span>olladns</span>
            </a>
            <p style="margin-top:18px;font-size:13.5px;max-width:32ch;color:var(--muted)">
              AI-driven DNS security for security teams. Block phishing, malware, and zero-day threats before they hit your network.
            </p>
            <div class="flex" style="margin-top:18px;gap:14px;color:var(--muted)">
              <a href="#" aria-label="Twitter">${icon('twitter',{size:18})}</a>
              <a href="#" aria-label="GitHub">${icon('github',{size:18})}</a>
              <a href="#" aria-label="LinkedIn">${icon('linkedin',{size:18})}</a>
            </div>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li><a href="product.html">Features</a></li>
              <li><a href="product.html#querylog">Query Log</a></li>
              <li><a href="product.html#ai">AI Detection</a></li>
              <li><a href="product.html#roaming">Roaming Clients</a></li>
              <li><a href="pricing.html">Pricing</a></li>
              <li><a href="../index.html">Live Demo</a></li>
            </ul>
          </div>
          <div>
            <h5>Solutions</h5>
            <ul>
              <li><a href="solutions.html#msp">MSPs</a></li>
              <li><a href="solutions.html#enterprise">Enterprise</a></li>
              <li><a href="solutions.html#k12">K-12 / Education</a></li>
              <li><a href="solutions.html#healthcare">Healthcare</a></li>
              <li><a href="solutions.html#smb">Small Business</a></li>
            </ul>
          </div>
          <div>
            <h5>Resources</h5>
            <ul>
              <li><a href="resources.html">Library</a></li>
              <li><a href="resources.html#docs">Docs</a></li>
              <li><a href="resources.html#blog">Blog</a></li>
              <li><a href="changelog.html">Changelog</a></li>
              <li><a href="security.html">Trust &amp; Security</a></li>
              <li><a href="security-policy.html">Report a vulnerability</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="company.html">About</a></li>
              <li><a href="company.html#careers">Careers</a></li>
              <li><a href="company.html#press">Press</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="contact.html">Partners</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© 2026 olladns, Inc. · Made with attention in Brooklyn &amp; Berlin</div>
          <div class="links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">DPA</a>
            <a href="#">Status</a>
          </div>
        </div>
      </div>
    </footer>`;

  // Render shared chrome on every page
  window.mountChrome = (active) => {
    const navMount = document.getElementById('site-nav');
    const footMount = document.getElementById('site-footer');
    if(navMount) navMount.outerHTML = renderNav(active);
    if(footMount) footMount.outerHTML = renderFooter();
  };
})();
