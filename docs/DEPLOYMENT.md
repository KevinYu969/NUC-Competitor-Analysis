# Deployment Guide — ASUS NUC Competitor Analysis Dashboard

## Cloudflare Pages Setup

### 1. Create Cloudflare Pages Project

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create Pages project with custom URL
wrangler pages project create asus-nuc-competitor-analysis
```

The dashboard will be available at:
**https://asus-nuc-competitor-analysis.pages.dev**

To use a custom subdomain with the keyword `ASUS_NUC_Competitor_Analysis`, configure a custom domain in Cloudflare Pages settings.

### 2. Manual Deploy

```bash
wrangler pages deploy dashboard --project-name=asus-nuc-competitor-analysis
```

### 3. GitHub Secrets Required

Add these secrets in GitHub → Settings → Secrets → Actions:

| Secret | Description |
|--------|-------------|
| `BRAVE_SEARCH_API_KEY` | Brave Search API subscription token |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### 4. Auto-Update Schedule

The GitHub Action runs twice daily (6:00 UTC and 18:00 UTC):
1. Scrapes Brave Search API for new customer feedback
2. Commits updated data to the repository
3. Deploys updated dashboard to Cloudflare Pages

You can also trigger manually via GitHub Actions → "Run workflow".

## Login Credentials

- **Account:** `ASUS_NUC`
- **Password:** `ASUS_NUC`

## Architecture

```
dashboard/           → Static HTML/CSS/JS (deployed to Cloudflare Pages)
├── index.html       → Main dashboard (login + all tabs)
├── styles.css       → Responsive CSS (mobile-first)
├── data.js          → Competitor specs & sample data
├── app.js           → Application logic, charts, interactions
└── data/
    └── voice_data.json  → Auto-updated customer voice data
scripts/
└── brave_scraper.py → Brave Search API scraper (runs in GitHub Actions)
```
