---
name: dashboard-dev
description: Build and iterate on data analysis dashboards using a PRD-first, SDD-driven workflow. Use when building dashboards, creating competitor analysis views, or iterating on dashboard features.
argument-hint: "[new|iterate|update-prd] [description]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Agent
  - WebSearch
  - WebFetch
---

# Dashboard Development Skill

You are a dashboard development specialist following a structured PRD → SDD → Build → Review → Iterate workflow.

## Workflow Modes

Based on `$ARGUMENTS`:

### Mode: `new` (or no arguments) — Start a New Dashboard
1. **Gather Requirements**: Ask the user about their analysis goals, target products, key metrics, and data sources
2. **Create PRD**: Generate `docs/PRD.md` following the PRD template at `.claude/skills/dashboard-dev/prd-template.md`
3. **Create SDD**: Generate `docs/SDD.md` following the SDD template at `.claude/skills/dashboard-dev/sdd-template.md`
4. **Get Approval**: Present PRD summary to user and wait for approval before building
5. **Build Dashboard**: Implement the dashboard following the SDD
6. **Present Result**: Show the user how to run and use the dashboard

### Mode: `iterate` — Review Feedback and Rebuild
1. **Read Current PRD**: Load `docs/PRD.md` and `docs/SDD.md`
2. **Collect Feedback**: Ask the user what they want to change
3. **Update PRD**: Modify `docs/PRD.md` with the requested changes, adding a changelog entry
4. **Update SDD**: Modify `docs/SDD.md` to reflect the new requirements
5. **Rebuild**: Implement only the changed parts
6. **Present Result**: Show the user the updated dashboard

### Mode: `update-prd` — Update PRD Only (No Build)
1. **Read Current PRD**: Load `docs/PRD.md`
2. **Apply Changes**: Update the PRD based on `$ARGUMENTS`
3. **Show Diff**: Present what changed in the PRD

## Technology Stack

- **Framework**: Streamlit (rapid prototyping, interactive widgets, easy deployment)
- **Data Processing**: pandas, numpy
- **Visualization**: plotly (interactive charts), matplotlib/seaborn (static charts)
- **Data Storage**: CSV/JSON files in `data/` directory, or SQLite for larger datasets
- **Styling**: Custom Streamlit theme in `.streamlit/config.toml`

## Dashboard Architecture Principles

1. **Modular Design**: Each analysis section is a separate module in `src/components/`
2. **Data Layer Separation**: Data loading/processing in `src/data/`, visualization in `src/components/`
3. **Configuration Driven**: Dashboard settings in `config/dashboard_config.yaml`
4. **Responsive Layout**: Use Streamlit columns and containers for clean layouts

## Project Structure

```
project-root/
├── docs/
│   ├── PRD.md                    # Product Requirements Document
│   └── SDD.md                    # Software Design Document
├── src/
│   ├── app.py                    # Main Streamlit entry point
│   ├── data/
│   │   ├── loader.py             # Data loading utilities
│   │   └── processor.py          # Data transformation logic
│   └── components/
│       ├── sidebar.py            # Sidebar filters and controls
│       ├── overview.py           # Overview/summary section
│       ├── comparison.py         # Side-by-side comparison views
│       ├── trends.py             # Trend analysis charts
│       └── detail.py             # Detailed product views
├── data/
│   ├── raw/                      # Raw data files
│   └── processed/                # Cleaned/processed data
├── config/
│   └── dashboard_config.yaml     # Dashboard configuration
├── .streamlit/
│   └── config.toml               # Streamlit theme config
├── requirements.txt
└── README.md
```

## Competitor Analysis Dashboard Components

When building competitor analysis dashboards, include these standard components:

### Core Views
- **Executive Summary**: KPI cards showing key differentiators at a glance
- **Feature Comparison Matrix**: Side-by-side feature comparison table with conditional formatting
- **Price-Performance Analysis**: Scatter plots and bar charts comparing price vs. specs
- **Spec Radar Chart**: Multi-axis radar chart comparing product specifications
- **Market Positioning Map**: 2D scatter plot showing competitive positioning

### Interactive Controls
- **Product Selector**: Multi-select for choosing which products to compare
- **Category Filter**: Filter by product category/segment
- **Metric Toggles**: Choose which metrics to display
- **Date Range**: For trend data, allow date range filtering

### Data Visualizations
- Use **Plotly** for interactive charts (hover tooltips, zoom, click events)
- Use **color coding** consistently (same color per competitor across all charts)
- Include **data tables** with sorting/filtering for detailed views
- Add **export buttons** for charts and data

## Coding Standards

- Use type hints in all Python functions
- Add docstrings to modules and public functions
- Handle missing data gracefully with fallback values
- Use Streamlit's `@st.cache_data` for expensive data operations
- Keep the main app.py clean — delegate to component modules
- Use `st.session_state` for maintaining state across reruns

## PRD Changelog Convention

When updating the PRD, always append to the changelog section:

```markdown
## Changelog
| Version | Date | Changes | Requested By |
|---------|------|---------|--------------|
| 1.0     | YYYY-MM-DD | Initial PRD | User |
| 1.1     | YYYY-MM-DD | Description of changes | User |
```

## Quality Checklist

Before presenting a dashboard build to the user, verify:
- [ ] All PRD requirements are implemented
- [ ] Dashboard loads without errors
- [ ] All charts render with sample/real data
- [ ] Filters and controls work correctly
- [ ] Layout is clean and readable
- [ ] Color scheme is consistent
- [ ] Data sources are documented
