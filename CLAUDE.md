# NUC Competitor Analysis

A Dashboard for SPM to analyze up-to-date competitor analysis.

## Project Overview

This repository contains tools and dashboards for competitive analysis related to NUC (Next Unit of Computing) products.

## Development

- Language: Python
- Framework: Streamlit
- Remote control: Enabled via `.claude/settings.json`

## Custom Skills

### `/dashboard-dev` — Dashboard Development Workflow

A reusable skill for building and iterating on dashboards using a structured PRD-first, SDD-driven approach.

**Usage:**
- `/dashboard-dev new` — Start a new dashboard (creates PRD → SDD → builds it)
- `/dashboard-dev iterate` — Collect feedback, update PRD, and rebuild
- `/dashboard-dev update-prd` — Update PRD only without building

**Workflow:**
1. Define requirements in `docs/PRD.md` (based on template)
2. Design architecture in `docs/SDD.md` (based on template)
3. Build the dashboard following the SDD
4. Review with user → collect feedback
5. Update PRD with changes → rebuild

**Templates located at:**
- `.claude/skills/dashboard-dev/prd-template.md`
- `.claude/skills/dashboard-dev/sdd-template.md`
