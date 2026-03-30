# APP SHELL — Word Embedding Chatbot (Compare Results)

=============================================================
LEFT SIDEBAR (Persistent)
=============================================================
Same as upload page.

Active:

- Compare Results
  - Dashboard (active)

=============================================================
TOP NAVBAR (Sticky)
=============================================================

Breadcrumb: "Chatbot / Compare Results / Dashboard"

Right actions (page-level):

- [Export CSV] [Export Normalized JSON] [Back to Upload]

Optional status chip in navbar:

- "A: FastText Baseline"
- "B: FastText Hybrid"

=============================================================
PAGE: Compare Results → Dashboard
=============================================================

---

## [PAGE HEADER]

Title: "Comparison Dashboard"
Subtitle: "Visualize metrics, retrieval quality, and RAGAS scores between A and B."

---

[KPI GRID]
Desktop: 4 columns | Mobile: 2 columns
Gap: 16px

---

| Records |
| A: 120 | B: 120 |
| note: coverage ok / mismatch |

---

| Avg Latency |
| A: 820ms | B: 640ms (▼ 22%) |
| tooltip: p50 / p95 |

---

| Avg RAGAS Overall |
| A: 0.68 | B: 0.74 (▲ 8%) |

---

| Failure Rate |
| A: 18% | B: 11% |
| definition shown on hover |

---

KPI States:

- Loading: skeleton cards
- Empty: "No metrics available"
- Error: "Required fields missing"

---

## [TABS — inside content]

Tabs:
| Overview | Retrieval | RAGAS | Queries | Schema & Logs |

(Sticky tabs optional)

=====================================================================
TAB: Overview
=====================================================================

GRID: 2 columns desktop, stacked mobile (gap 16–24px)

LEFT: [CARD] Area Chart — "Latency per Query"

- X: query index / timestamp bucket
- Y: processing_time
- Lines/areas: A vs B
  States:
- Loading: chart skeleton
- Empty: "processing_time not found"
- Error: "Field type mismatch"

RIGHT: [CARD] Area/Bar — "Token Usage"

- prompt vs completion tokens
  States same

FULL WIDTH: [CARD] Summary Metrics Table
Columns: Metric | A | B | Δ
Rows:

- avg latency, p95 latency
- avg tokens, p95 tokens (optional)
- avg overall_score (if exists)
- missing ragas %
  States:
- Loading: 6 skeleton rows
- Empty: "No comparable metrics"

=====================================================================
TAB: Retrieval
=====================================================================

ROW 1: KPI mini grid (4)

- Avg retrieved docs (A)
- Avg hybrid_search_results (B)
- Avg reranked docs (B)
- similarity threshold / mmr lambda (if exists)

ROW 2: [CARD] Area Chart — "Docs Count Over Queries"
Series:

- A: retrieved_count
- B: hybrid_count
- B: reranked_count

ROW 3: [CARD] "Top Snippets Comparison (Selected Query)"
Layout 2 columns:

- Left: Baseline top docs (rank, score, snippet preview)
- Right: Hybrid reranked docs (rank, final score, components)
  State:
- No query selected: "Select a query from Queries tab or dropdown here."
- Missing retrieval: show warning

=====================================================================
TAB: RAGAS
=====================================================================

ROW 1: KPI mini grid (4)

- context_relevance
- faithfulness
- answer_relevance
- overall_score

ROW 2: [CARD] Multi Area Chart — "RAGAS Trend"
Controls:

- metric toggle (overall/context/faithfulness/answer_rel)
- compare mode: (A vs B) / (only B) / (only A)

ROW 3: [CARD] Distribution — "Overall Score Distribution"
Buckets 0–1 (0.2 step)
A vs B bars side-by-side

ROW 4: [CARD] Biggest Wins / Regressions Table
Columns:

- Query (truncate)
- A overall
- B overall
- Δ
- Flags: high latency / missing ragas / empty answer
  States: loading/empty/error

=====================================================================
TAB: Queries (Drilldown)
=====================================================================

Layout:

- Desktop: sidebar list (3fr) + detail panel (9fr)
- Mobile: list first, detail below

LEFT LIST PANEL:

- Search query input
- Filters:
  - Only wins / regressions
  - Only high latency
  - Only missing RAGAS
- Sort:
  - Δ overall desc
  - Latency desc
- Scroll list items show:
  - query title (1 line)
  - delta badge (+/-)
  - latency badge (optional)

RIGHT DETAIL PANEL:

- Query header: full query + ids + time
- Compare grid 2 columns:
  - A column: retrieval preview + answer + tokens + ragas
  - B column: retrieval preview + answer + tokens + ragas
- Footer actions:
  - [Copy normalized record]
  - [Mark as example]
    States:
- No selection: empty illustration + instruction
- Missing record in B: show error banner + still show A

=====================================================================
TAB: Schema & Logs
=====================================================================

[CARD] Mapping Table

- Baseline field → normalized field
- Hybrid field → normalized field

[CARD] Parsing Warnings

- list warnings per file

[CARD] Raw JSON Viewer (read-only)

- collapsible A sample record
- collapsible B sample record
