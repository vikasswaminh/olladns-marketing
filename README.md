# olladns-marketing

Marketing site for **olladns.com** (apex domain). Pure static HTML/CSS/JS. Hosted on Cloudflare Pages.

## Layout

```
index.html          landing
product.html        product overview
pricing.html        plans + comparison + FAQ
solutions.html      verticals: MSP, K-12 edu, healthcare, SMB
customers.html      case studies, logo wall, ROI
resources.html      blog, docs, changelog, trust
company.html        mission, team, hiring
contact.html        demo + sales
site.css            all styles
site.js             page interactions
chrome.js           shared nav + footer injector
tokens.css          design tokens (copy of qdns/packages/tokens/tokens.css)
scripts/sync-tokens.sh   refresh tokens.css from qdns (auth required, local-only)
_redirects          CF Pages redirects
_headers            CF Pages security headers (HSTS, CSP, etc.)
```

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Cloudflare Pages setup

1. Push this repo to GitHub (already done as `vikasswaminh/olladns-marketing`).
2. **CF dashboard → Pages → Create project → Connect to Git** → choose this repo.
3. Build settings:
   - Production branch: `main`
   - Root directory: `.`
   - **Build command:** *(leave empty — site is fully static)*
   - **Build output directory:** `.`
4. **Save and Deploy.** First deploy goes to `<slug>.pages.dev`.
5. **Custom domains** → add both:
   - `olladns.com`
   - `www.olladns.com`
6. Cloudflare auto-issues an Edge cert; both URLs serve from anycast in seconds.

## Design tokens

`tokens.css` is the **single source of truth** for olladns visual identity, maintained in the (private) qdns repo at `packages/tokens/tokens.css`. This repo holds a committed **copy** so CF Pages can serve it without authenticated build steps.

**When tokens change in qdns:**

```bash
export GH_TOKEN=ghp_xxx           # personal token with repo:read on qdns
bash scripts/sync-tokens.sh        # refreshes tokens.css from upstream
git add tokens.css && git commit -m "sync tokens" && git push
```

CF Pages auto-redeploys on push. Token changes propagate within ~30 seconds.

## Brand & domain matrix

| URL | What | Repo |
|---|---|---|
| **olladns.com** (this site) | Marketing | this repo |
| **login.olladns.com** | Dashboard (Alpine SPA) | qdns, `apps/dashboard/` |
| **api.olladns.com** | REST API | qdns, `apps/api/` (LXC) |
| **dns.olladns.com** | DNS resolver (DoT/DoQ/DoH) | qdns infra (LXC) |
