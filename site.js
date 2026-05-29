/* Shared nav + footer renderer for olladns marketing pages */
(function(){
  const NAV = [
    {name:'Product',   href:'product.html'},
    {name:'Solutions', href:'solutions.html'},
    {name:'Pricing',   href:'pricing.html'},
    
    {name:'Resources', href:'resources.html'},
  ];

  function svg(d, w=14, sw=1.8){
    return `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  }
  const ICONS = {
    shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
    chev:   svg('<polyline points="6 9 12 15 18 9"/>'),
    arrow:  svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
    check:  svg('<polyline points="20 6 9 17 4 12"/>'),
    x:      svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
  };

  function mountNav(activePath){
    const here = (activePath || location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const el = document.createElement('header');
    el.className = 'nav';
    el.innerHTML = `
      <div class="nav-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark">${ICONS.shield}</span>
          olladns
        </a>
        <nav class="nav-links">
          ${NAV.map(n => `<a class="nav-link ${n.href===here?'active':''}" href="${n.href}">${n.name}</a>`).join('')}
        </nav>
        <div class="nav-cta">
          <a class="btn btn-ghost" href="../index.html">Sign in</a>
          <a class="btn btn-primary" href="contact.html">Book a demo ${ICONS.arrow}</a>
        </div>
      </div>
    `;
    document.body.prepend(el);
  }

  function mountFooter(){
    const el = document.createElement('footer');
    el.className = 'footer';
    el.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html" style="margin-bottom:18px">
              <span class="brand-mark">${ICONS.shield}</span> olladns
            </a>
            <p style="margin:14px 0 0;color:var(--muted);max-width:36ch;font-size:13.5px;line-height:1.55">
              AI-powered DNS security and content filtering. Protects 14,000+ organizations across 92 countries.
            </p>
            <div class="flex" style="margin-top:18px;gap:10px">
              <a class="btn btn-ghost" style="height:34px;padding:0 12px;font-size:13px" href="contact.html">Get started ${ICONS.arrow}</a>
            </div>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li><a href="product.html">DNS filtering</a></li>
              <li><a href="product.html#ai">AI detection</a></li>
              <li><a href="product.html#roaming">Roaming clients</a></li>
              <li><a href="product.html#integrations">Integrations</a></li>
              <li><a href="../index.html">Live demo</a></li>
            </ul>
          </div>
          <div>
            <h5>Solutions</h5>
            <ul>
              <li><a href="solutions.html#msp">For MSPs</a></li>
              <li><a href="solutions.html#enterprise">For Enterprise</a></li>
              <li><a href="solutions.html#k12">For K-12</a></li>
              <li><a href="solutions.html#healthcare">For Healthcare</a></li>
              <li><a href="solutions.html#finance">For Financial</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              
              <li><a href="resources.html">Blog</a></li>
              <li><a href="resources.html#docs">Documentation</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5>Trust</h5>
            <ul>
              <li><a href="#">SOC 2 Type II</a></li>
              <li><a href="#">ISO 27001</a></li>
              <li><a href="#">GDPR</a></li>
              <li><a href="#">HIPAA BAA</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bot">
          <div><span class="status-dot"></span> All systems operational · 99.999% uptime SLA</div>
          <div>© 2026 olladns, Inc. · <a href="#" style="margin:0 8px">Privacy</a> · <a href="#" style="margin:0 8px">Terms</a> · <a href="#">DPA</a></div>
        </div>
      </div>
    `;
    document.body.append(el);
  }

  /* Hero ticker — counts threat blocks */
  function startTicker(){
    document.querySelectorAll('[data-ticker]').forEach(el => {
      let v = parseInt(el.dataset.ticker || '4218380', 10);
      el.textContent = v.toLocaleString();
      setInterval(()=>{
        v += Math.floor(Math.random()*7)+1;
        el.textContent = v.toLocaleString();
      }, 900);
    });
  }

  /* Mini log generator (hero preview) */
  function startMiniLog(){
    const SAFE = ['cdn.cloudflare.com','outlook.office365.com','slack.com','okta.com','figma.com','azure.microsoft.com','github.com'];
    const BAD  = ['paypal-verify-update.top','login-microsoft-secure.cf','c2-server-relay.icu','crypt0-mining-pool.click','b0tn3t-relay.xyz','tor-exit-c8.relay'];
    const CATS_S = ['Productivity','News','Cloud Storage','Social'];
    const CATS_B = ['Phishing','Malware','Cryptomining','Botnet','Anonymizer'];
    document.querySelectorAll('[data-mini-log]').forEach(host => {
      function pad(n){return n<10?'0'+n:''+n}
      function ts(){const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds())}
      function row(){
        const block = Math.random()<.4;
        const dom = block ? BAD[Math.floor(Math.random()*BAD.length)] : SAFE[Math.floor(Math.random()*SAFE.length)];
        const lat = (Math.random()*8+2).toFixed(1)+'ms';
        return `<div class="row ${block?'block':''}">
          <span class="t">${ts()}</span>
          <span class="badge ${block?'block':'allow'}">${block?'block':'allow'}</span>
          <span class="v ${block?'b':''}">${dom}</span>
          <span class="lat">${lat}</span>
        </div>`;
      }
      // seed
      let html = '';
      for(let i=0;i<14;i++) html += row();
      host.innerHTML = html;
      setInterval(()=>{
        host.insertAdjacentHTML('afterbegin', row());
        // keep length capped
        const rows = host.querySelectorAll('.row');
        if(rows.length > 16) rows[rows.length-1].remove();
      }, 900);
    });
  }

  function init(){
    mountNav();
    mountFooter();
    startTicker();
    startMiniLog();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
