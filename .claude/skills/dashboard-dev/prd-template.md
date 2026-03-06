# PRD Template — Dashboard Project

Use this template to create `docs/PRD.md` for each dashboard project.

---

# Product Requirements Document (PRD)

## 1. Overview

### 1.1 Product Name
[Dashboard name]

### 1.2 Purpose
[One paragraph describing the business problem this dashboard solves]

### 1.3 Target Users
[Who will use this dashboard and how frequently]

### 1.4 Success Metrics
[How do we measure if this dashboard is successful]

---

## 2. Analysis Scope

### 2.1 Target Products/Entities
[List all products, competitors, or entities being analyzed]

| # | Product/Entity | Category | Priority |
|---|---------------|----------|----------|
| 1 | | | High/Medium/Low |

### 2.2 Key Metrics to Track
[List all metrics with definitions]

| Metric | Definition | Data Type | Source |
|--------|-----------|-----------|--------|
| | | | |

### 2.3 Data Sources
[Where does the data come from]

| Source | Type | Update Frequency | Access Method |
|--------|------|-------------------|---------------|
| | Manual/API/Scrape | | |

---

## 3. Dashboard Requirements

### 3.1 Views / Pages

#### View 1: [Name]
- **Purpose**: [What question does this view answer]
- **Components**:
  - [ ] Component description
- **Interactions**: [Filters, click-throughs, etc.]

#### View 2: [Name]
[Repeat for each view]

### 3.2 Filters and Controls
| Filter | Type | Options | Default |
|--------|------|---------|---------|
| | Dropdown/Multi-select/Slider/Date | | |

### 3.3 Data Visualizations
| Chart | Type | X-Axis | Y-Axis | Purpose |
|-------|------|--------|--------|---------|
| | Bar/Line/Scatter/Radar/Table | | | |

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Dashboard load time: < [X] seconds
- Chart render time: < [X] seconds

### 4.2 Data Freshness
- Update frequency: [Real-time / Daily / Weekly / Manual]

### 4.3 Export & Sharing
- [ ] Export charts as PNG/SVG
- [ ] Export data as CSV
- [ ] Shareable URL
- [ ] PDF report generation

---

## 5. Constraints & Assumptions

### 5.1 Constraints
- [Technical, budget, time constraints]

### 5.2 Assumptions
- [Assumptions about data availability, user behavior, etc.]

### 5.3 Out of Scope
- [Explicitly state what is NOT included in this version]

---

## 6. Release Plan

| Version | Scope | Target Date |
|---------|-------|-------------|
| v1.0 (MVP) | [Core features] | |
| v1.1 | [Enhancements] | |

---

## Changelog

| Version | Date | Changes | Requested By |
|---------|------|---------|--------------|
| 1.0 | YYYY-MM-DD | Initial PRD | User |
