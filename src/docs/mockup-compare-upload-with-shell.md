# APP SHELL — Word Embedding Chatbot

Layout:

- Desktop: Sidebar fixed (w 240–280px) + Content area
- Tablet/Mobile: Sidebar collapsible (drawer)

=============================================================
LEFT SIDEBAR (Persistent)
=============================================================

[Brand/Header]

- Icon + App name: "Word Embedding Chatbot"

[Nav Items]

- Home
- My Chatbots
- Create Chatbot
- Ask AI
- Inbox

[Divider]

[Section: Compare Experiments] (NEW)

- Compare Results (active)
  - Upload JSON
  - Dashboard
  - Query Drilldown
  - Schema & Logs

[Footer]

- Settings
- Help
- User profile block:
  - Name + email
  - Chevron dropdown

Sidebar States:

- Active item: background highlight + left indicator
- Hover: subtle tint
- Collapsed: icons only + tooltip

=============================================================
TOP NAVBAR (Content Header)
=============================================================

Height: 56–64px, sticky

Left:

- Breadcrumb: "Chatbot / Compare Results"
- (Optional) Back button icon

Middle:

- Page title (contextual)
  - "Compare Results"

Right actions:

- [Create New Chatbot] (existing global CTA)
- (On compare pages) secondary actions:
  - [Docs] [Support]

=============================================================
PAGE: Compare Results → Upload JSON
=============================================================

Content width: max 1100–1200px, centered
Outer padding: 24–32px

---

## [PAGE HEADER]

Title: "Upload Experiment Results"
Subtitle: "Upload 2 JSON files to compare FastText baseline vs FastText hybrid retrieval."

Right actions (page-level):

- [Download Sample JSON]
- [Reset]

---

[MAIN GRID]
Desktop: 7fr / 5fr
Gap: 24px

=============================================================
LEFT COLUMN — Upload Panel
=============================================================

[CARD] "Upload Files"
Desc: "Drop files into slots A and B. We'll validate schema and compute preview metrics."

DROPZONE GRID (2 columns desktop, stacked mobile)

---

| Dropzone A | Dropzone B |
| Label: "FastText Baseline" | Label: "FastText Hybrid" |
| Helper: "JSON file output" | Helper: "JSON file output" |
| | |
| ┌──────────────────────────────┐ | ┌──────────────────────────────┐ |
| | ⬆ Drag & Drop JSON Here | | | ⬆ Drag & Drop JSON Here | |
| | or click to browse | | | or click to browse | |
| └──────────────────────────────┘ | └──────────────────────────────┘ |

---

Dropzone States:

1. EMPTY: dashed border + helper text
2. HOVER: border primary + subtle bg
3. LOADING (Parsing): spinner + "Parsing..."
4. SUCCESS:
   - ✓ filename
   - chips: [records: N] [ragas: yes/no] [model_type detected]
   - actions: [Preview] [Remove]
5. ERROR:
   - ✖ invalid json / schema mismatch
   - action: [Remove]

---

## [VALIDATION BANNER]

- If only 1 file: "Upload 2 files to enable comparison."
- If schema mismatch: "Schema differs. Some visualizations may be disabled."
- If JSON invalid: "Invalid JSON. Expected keys: results, metadata, (optional) ragas_evaluation."

---

## [COMPARE SETTINGS]

Grid 2 columns desktop:

Left block:

- (Select) Comparison Depth:
  - Summary Only
  - - Retrieval Details
  - - Generation & RAGAS

Right block:

- Filters:
  - (Input) Keyword query contains
  - (Input) Latency threshold (ms)
  - (Input) Min overall_score (0..1)

---

## [PRIMARY CTA]

Button (full width):

- [Generate Comparison] (disabled until A+B valid)
  Loading state: spinner + "Generating..."
  Success: navigate → Dashboard tab

=============================================================
RIGHT COLUMN — Quick Preview
=============================================================

[CARD] "Quick Snapshot"

State: EMPTY

- "Upload both files to see preview."

State: LOADING

- skeleton KPIs + spinner

State: SUCCESS (mini KPI grid)

- Records: A vs B
- Avg latency: A vs B + delta badge
- Avg overall score: A vs B + delta badge
- RAGAS availability badges:
  - A: available/missing
  - B: available/missing

[Mini callout]

- "Proceed to Dashboard for charts, distributions, and query drilldowns."
