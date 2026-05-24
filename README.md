# olladns-marketing

Marketing site for olladns.com — static HTML, hosted on Cloudflare Pages.

## Layout

```
index.html        landing
product.html      product overview
pricing.html      plans + pricing table
solutions.html    by-vertical (MSP, edu, healthcare, SMB)
customers.html    case studies
resources.html    docs + blog + changelog
company.html      about / team / careers
contact.html      demo + sales
site.css          all styles
site.js           page interactions
chrome.js         shared nav + footer injector
tokens.css        SYNCED from qdns repo at build time (do not edit)
scripts/sync-tokens.sh  pulls tokens.css before build
_redirects        CF Pages redirects
_headers          CF Pages security headers
```

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Cloudflare Pages setup

1. Push this repo to GitHub.
2. CF dashboard → **Pages** → **Create project** → **Connect to Git** → choose this repo.
3. Build settings:
   - Production branch: `main`
   - Root directory: `.`
   - **Build command:** `bash scripts/sync-tokens.sh`
   - **Build output directory:** `.`
4. Deploy.
5. After deploy: **Custom domains** → add `olladns.com` AND `www.olladns.com`.
6. Cloudflare auto-issues an Edge cert and serves from anycast.

## Design tokens

`tokens.css` is the **canonical** olladns design system, single-sourced in the qdns repo at `packages/tokens/tokens.css`. The build script (`sync-tokens.sh`) pulls it fresh on every CF Pages build, so any token change in qdns propagates automatically on the next push.

**Never edit `tokens.css` locally** — change the source in qdns and redeploy here.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Hero + value props + product preview + social proof |
| `product.html` | Deep dive on features (query log, threats, AI detection, policies) |
| `pricing.html` | 3-tier plans (Starter / Pro / Enterprise) + feature matrix + FAQ |
| `solutions.html` | Verticals: MSP, K-12 education, healthcare, SMB |
| `customers.html` | Case studies + logo wall + ROI snippets |
| `resources.html` | Blog, docs, changelog, trust/security, library |
| `company.html` | Mission, team, investors, hiring, press |
| `contact.html` | Demo request, sales contact, support hubs |

## Brand

`olladns` (lowercase). Pairs with: dashboard at `login.olladns.com`, REST API at `api.olladns.com`, DNS resolvers at `dns.olladns.com`. This site is the apex `olladns.com`.
