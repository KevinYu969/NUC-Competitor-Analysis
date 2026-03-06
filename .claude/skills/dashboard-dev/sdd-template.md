# SDD Template — Dashboard Project

Use this template to create `docs/SDD.md` for each dashboard project.

---

# Software Design Document (SDD)

## 1. System Overview

### 1.1 Architecture Summary
[High-level description of the dashboard architecture]

### 1.2 Technology Stack
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | Streamlit | | Dashboard framework |
| Data Processing | pandas | | Data manipulation |
| Visualization | plotly | | Interactive charts |
| Storage | CSV/SQLite | | Data persistence |

### 1.3 System Diagram
```
[ASCII diagram of data flow]
User → Streamlit App → Data Layer → Data Source
                    → Components → Plotly Charts
```

---

## 2. Project Structure

```
[File tree showing all modules with brief descriptions]
```

---

## 3. Module Design

### 3.1 Entry Point — `src/app.py`
- **Responsibility**: Main Streamlit application, page routing, layout
- **Key Functions**:
  - `main()`: Application entry point
- **Dependencies**: All component modules

### 3.2 Data Layer — `src/data/`

#### `src/data/loader.py`
- **Responsibility**: Load data from various sources
- **Key Functions**:
  | Function | Input | Output | Description |
  |----------|-------|--------|-------------|
  | | | | |

#### `src/data/processor.py`
- **Responsibility**: Clean, transform, and aggregate data
- **Key Functions**:
  | Function | Input | Output | Description |
  |----------|-------|--------|-------------|
  | | | | |

### 3.3 Components — `src/components/`

#### `src/components/sidebar.py`
- **Responsibility**: Sidebar filters and navigation
- **Renders**: Product selector, category filters, metric toggles

#### `src/components/overview.py`
- **Responsibility**: Executive summary view
- **Renders**: KPI cards, summary charts

#### `src/components/comparison.py`
- **Responsibility**: Side-by-side product comparison
- **Renders**: Comparison tables, radar charts, bar charts

#### `src/components/trends.py`
- **Responsibility**: Trend and time-series analysis
- **Renders**: Line charts, area charts

#### `src/components/detail.py`
- **Responsibility**: Detailed single-product view
- **Renders**: Full spec sheet, positioning info

[Add/remove component sections as needed based on PRD]

---

## 4. Data Model

### 4.1 Core Data Schema
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| | | | |

### 4.2 Data Flow
```
Raw Data → loader.py → DataFrame → processor.py → Processed DataFrame → Components → Charts
```

### 4.3 Caching Strategy
- Use `@st.cache_data` for data loading functions (TTL: configurable)
- Use `@st.cache_resource` for expensive model/connection objects
- Cache invalidation: manual refresh button in sidebar

---

## 5. UI/UX Design

### 5.1 Layout Structure
```
┌──────────────────────────────────────────────┐
│                   Header                      │
├──────────┬───────────────────────────────────┤
│          │                                    │
│ Sidebar  │          Main Content              │
│ Filters  │                                    │
│          │  ┌─────────┐  ┌─────────┐         │
│          │  │ KPI Card│  │ KPI Card│  ...     │
│          │  └─────────┘  └─────────┘         │
│          │                                    │
│          │  ┌────────────────────────┐        │
│          │  │     Chart Area         │        │
│          │  └────────────────────────┘        │
│          │                                    │
│          │  ┌────────────────────────┐        │
│          │  │     Data Table         │        │
│          │  └────────────────────────┘        │
├──────────┴───────────────────────────────────┤
│                   Footer                      │
└──────────────────────────────────────────────┘
```

### 5.2 Color Scheme
| Element | Color | Usage |
|---------|-------|-------|
| Primary | | Brand/headers |
| Competitor 1 | | Charts/highlights |
| Competitor 2 | | Charts/highlights |
| Background | | Page background |
| Text | | Body text |

### 5.3 Theme Configuration (`.streamlit/config.toml`)
```toml
[theme]
primaryColor = "#"
backgroundColor = "#"
secondaryBackgroundColor = "#"
textColor = "#"
```

---

## 6. Configuration

### `config/dashboard_config.yaml`
```yaml
dashboard:
  title: ""
  version: ""

data:
  source_path: "data/"
  cache_ttl: 3600

display:
  default_products: []
  charts_per_row: 2
  color_palette: []
```

---

## 7. Dependencies

### `requirements.txt`
```
streamlit>=1.30.0
pandas>=2.0.0
plotly>=5.18.0
pyyaml>=6.0
openpyxl>=3.1.0
```

---

## 8. Build & Run

### Development
```bash
pip install -r requirements.txt
streamlit run src/app.py
```

### Configuration
- Set environment variables in `.env` (if needed)
- Modify `config/dashboard_config.yaml` for dashboard settings

---

## 9. Change Log

| Version | Date | Module(s) Changed | Description |
|---------|------|-------------------|-------------|
| 1.0 | YYYY-MM-DD | All | Initial implementation |
