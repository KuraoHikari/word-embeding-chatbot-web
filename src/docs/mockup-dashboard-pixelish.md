# PAGE: Comparison Dashboard

Outer padding: 32px
Section spacing: 32px
Card spacing: 20px

---

[STICKY HEADER — Height 88px]

---

| Breadcrumb: Compare / Dashboard |
| |
| Title: FastText Baseline vs Hybrid Retrieval |
| |
| [Export CSV] [Export JSON] [Back] |

---

---

SECTION: KPI GRID (Desktop: 4 columns, gap 16px)
(Mobile: 2 columns)

---

| Records |
| A: 120 |
| B: 120 |

---

| Avg Latency |
| A: 820ms |
| B: 640ms (▼ 22%) |

---

| Avg Overall Score |
| A: 0.68 |
| B: 0.74 (▲ 8%) |

---

| Failure Rate |
| A: 18% |
| B: 11% |

---

Hover on KPI:

- tooltip shows p50 / p95

---

[TABS SECTION]

Tabs:
| Overview | Retrieval | RAGAS | Queries | Schema |

Active tab indicator: underline + primary color

=====================================================================
TAB: Overview
=====================================================================

SECTION: AREA CHART — Latency Over Queries

[CARD]

---

| Title: Latency per Query |
| |
| [Area Chart Placeholder] |
| |
| Legend: |
| ● Baseline (blue) |
| ● Hybrid (green) |

---

Chart states:

- Loading: skeleton chart bars
- Empty: "No processing_time found"
- Error: "Latency field missing in one dataset"

---

SECTION: TOKEN USAGE (Stacked Area / Bar)

[CARD]

---

| Title: Token Usage Comparison |
| |
| [Stacked Chart Placeholder] |

---

---

SECTION: SUMMARY TABLE

[CARD]

---

## | Metric | A | B | Δ |

| avg latency | 820ms | 640ms | -180ms |
| p95 latency | 1200ms | 950ms | -250ms |
| avg tokens | 1450 | 1502 | +52 |
| avg overall | 0.68 | 0.74 | +0.06 |

---

Table states:

- Loading: 5 skeleton rows
- Empty: "Metrics unavailable"

=====================================================================
TAB: RAGAS
=====================================================================

SECTION: KPI MINI GRID (4 columns)

---

| Context Relevance |
| A: 0.70 | B: 0.76 |

---

| Faithfulness |
| A: 0.65 | B: 0.72 |

---

| Answer Relevance |
| A: 0.69 | B: 0.75 |

---

| Overall Score |
| A: 0.68 | B: 0.74 |

---

---

SECTION: MULTI AREA CHART

[CARD]

---

| Title: Overall Score Trend |
| |
| [Area Chart Placeholder] |
| |
| Toggle: |
| [x] overall |
| [ ] context |
| [ ] faithfulness |
| [ ] answer relevance |

---

---

SECTION: DISTRIBUTION

[CARD]

---

| Title: Score Distribution |
| |
| [Bar buckets 0-1] |

---

=====================================================================
TAB: Queries (Drilldown)
=====================================================================

LAYOUT GRID:
Desktop: 3fr / 9fr
Mobile: stacked

---

## LEFT SIDEBAR (Filters)

Search input
Sort dropdown
Checkbox filters:

- Only regressions
- Only wins
- Only high latency
- Only missing RAGAS

## Scrollable list:

| Query #12 (Δ +0.12) |
| Query #45 (Δ -0.08) |
| Query #90 (High latency) |

---

---

## RIGHT PANEL (Selected Query Detail)

[CARD — Query Header]

---

| Query: "Apa itu hybrid search?" |
| createdAt: ... |
| recordId: ... |

---

GRID 2 columns (Desktop)

---

| BASELINE           | HYBRID              |
| ------------------ | ------------------- |
| Retrieval Top 3    | Retrieval Top 3     |
| - Doc1 (0.78)      | - Doc5 (0.82 final) |
| - Doc2 (0.73)      | - Doc3 (0.79 final) |
| - Doc3 (0.71)      | - Doc8 (0.77 final) |
|                    |                     |
| Answer             | Answer              |
| "...."             | "...."              |
|                    |                     |
| Tokens: 1420       | Tokens: 1501        |
|                    |                     |
| RAGAS              | RAGAS               |
| context: 0.70      | context: 0.80       |
| faithfulness: 0.62 | faithfulness: 0.74  |
| overall: 0.66      | overall: 0.78       |

---

States:

- No selection: "Select a query from the left."
- Loading: skeleton 2 column blocks
- Error: "Query not found in dataset B"

=====================================================================
TAB: Schema & Logs
=====================================================================

SECTION: NORMALIZED FIELD MAPPING

---

## | Baseline Field | Normalized Field |

| similarity_score | retrieval.score |
| model_approach | metadata.model_type |

---

---

## | Hybrid Field | Normalized Field |

| final_score | retrieval.score |
| mmr_reranked_results | retrieval.reranked_count |

---

---

SECTION: PARSING WARNINGS

---

| Warning: 3 records missing RAGAS |
| Warning: mismatch array length |

---

---

SECTION: RAW JSON VIEWER

- Collapsible
- Scrollable
- Read-only
