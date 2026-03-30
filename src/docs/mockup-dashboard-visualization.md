# Dashboard — RAG Experiment Comparison

## Page Goal

Menampilkan perbandingan:

- Performance (latency, tokens)
- Retrieval (top-k, rerank, threshold)
- Quality (RAGAS: context_relevance, faithfulness, answer_relevance, overall_score)
- Per-query drilldown (lihat kasus terbaik/terburuk)

---

## Layout

[Sticky Header]

- Left: Breadcrumb "Compare / Dashboard"
- Title: "Comparison Dashboard"
- Subtitle: "FastText Baseline (A) vs FastText Hybrid (B)"
- Right actions:
  - (Button) "Export CSV"
  - (Button) "Export JSON (normalized)"
  - (Button) "Share snapshot"
  - (Button) "Back to Upload"

[Top Row: KPI Cards (Grid 2–4 columns)]
Card 1: "Records"

- A count / B count
- Coverage warning if mismatch

Card 2: "Avg Latency"

- A avg processing_time
- B avg processing_time
- Diff badge: faster/slower

Card 3: "Avg RAGAS Overall"

- A avg overall_score
- B avg overall_score
- Diff badge

Card 4: "Failure Rate"

- define: overall_score < threshold OR ragas fields missing OR answer empty
- A vs B

---

## Tabs (shadcn Tabs)

Tabs:

1. Overview
2. Retrieval
3. RAGAS
4. Queries (Drilldown)
5. Schema & Logs

---

# Tab 1 — Overview

## Section: Area Chart (shadcn chart / area)

Title: "Latency per Query (A vs B)"

- X: query index / timestamp / createdAt bucket
- Y: processing_time (ms)
- Series: A, B
- Tooltip: query text (truncate), processing_time, tokens_used

[Right side toggles]

- (Switch) "Smooth"
- (Switch) "Show p50/p95 band"
- (Select) bucket: none / per 10 queries / per day

## Section: Bar Chart

Title: "Tokens Used (Prompt vs Completion)"

- Stacked bar per model:
  - prompt_tokens, completion_tokens
- If baseline/hybrid uses different naming: normalize

## Section: Table — Summary Metrics

Columns:

- Metric
- Model A
- Model B
- Delta
  Rows (examples):
- avg processing_time
- p95 processing_time
- avg tokens_used
- avg complexity score
- avg similarity (if exists)
- avg hybrid_search_results (if exists)
- avg mmr_reranked_results (if exists)

---

# Tab 2 — Retrieval

## Section: KPI Cards

- "Avg retrieved docs (top-k)"
- "Avg reranked docs (MMR)"
- "Similarity threshold"
- "MMR lambda"

## Section: Area Chart

Title: "Retrieved vs Reranked Count (B only) + Baseline top-k (A)"

- X: query index
- Y: doc counts
- Series:
  - A: retrieved_count (baseline results length)
  - B: hybrid_search_results
  - B: mmr_reranked_results

## Section: Table — Top Retrieved Snippets Comparison (per selected query)

Left: Query selector (Select / Search)
Main content: 2 columns

- Column A: top-3 retrieved snippets (rank, doc_index, score/similarity)
- Column B: top-3 reranked snippets (rank, doc_index, final_score + components)

## Section: “Diversity / Redundancy” Panel

- show duplicates or near-duplicates in top results (simple heuristic)
- B: show diversity_penalty distribution (if available)

---

# Tab 3 — RAGAS

## Section: KPI Cards

- context_relevance (avg)
- faithfulness (avg)
- answer_relevance (avg)
- overall_score (avg)

## Section: Multi Area Chart

Title: "RAGAS Scores Over Queries"

- X: query index
- Y: score 0..1
- Series (toggleable): overall_score, context_relevance, faithfulness, answer_relevance
- Compare A vs B (two lines per metric) OR choose single metric compare

## Section: Distribution Chart (Histogram-like bar)

Title: "Overall Score Distribution"
Buckets: 0–0.2, 0.2–0.4, 0.4–0.6, 0.6–0.8, 0.8–1.0

- Show A and B side-by-side

## Section: “Biggest Wins / Regressions” Table

Columns:

- Query
- A overall
- B overall
- Delta
- A answer (truncate)
- B answer (truncate)
- Flags: "missing RAGAS", "empty answer", "high latency"

---

# Tab 4 — Queries (Drilldown)

## Left Sidebar

- Search input: "Cari query…"
- Filters:
  - Only regressions (B < A)
  - Only wins (B > A)
  - Only missing RAGAS
  - Only high latency
- Sort:
  - Delta overall (desc/asc)
  - Latency (desc)
  - Faithfulness (asc)

## Main Panel — Selected Query Detail (Card)

Header:

- Query text (full)
- Meta:
  - createdAt
  - record id
  - conversationId

Body (2 columns compare):

### Column A — Baseline

- Pipeline summary:
  - approach: baseline
  - steps list (if exists)
- Retrieval preview:
  - top 3 docs + similarity_score
- Generation:
  - answer
  - tokens_used
- RAGAS:
  - context_relevance, faithfulness, answer_relevance, overall_score

### Column B — Hybrid

- Pipeline summary:
  - hybrid_search_results, mmr_reranked_results, mmr_lambda, similarity_threshold
  - weights_used (fasttext/bm25/context)
- Retrieval preview:
  - top 3 docs + final_score + detailed_scores
- Generation:
  - answer
  - tokens_used
- RAGAS:
  - same metrics

Footer actions:

- (Button) "Mark as Example"
- (Button) "Copy Query JSON (normalized)"
- (Button) "Compare Retrieved Text Diff"

---

# Tab 5 — Schema & Logs

## Section: Normalized Schema Preview

- Show mapping table:
  - baseline.metadata.model_type -> "fasttext_baseline"
  - hybrid.metadata.model_type -> "fasttext_hybrid"
  - baseline.results[*].similarity_score -> normalized.retrieval.score
  - hybrid.results[*].final_score -> normalized.retrieval.score

## Section: Parsing Warnings

- List warnings per file:
  - missing keys
  - type mismatch
  - empty arrays

## Section: Raw JSON Viewer (Read-only)

- Collapsible panels:
  - raw record sample A
  - raw record sample B
