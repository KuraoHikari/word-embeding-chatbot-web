# Compare RAG Experiments (FastText vs FastText+Hybrid)

## Page Goal

User meng-upload 2 file JSON hasil eksperimen untuk dibandingkan:

- A = FastText baseline
- B = FastText + Hybrid Retrieval

---

## Layout

[Header]

- Title: "RAG Experiment Comparator"
- Subtitle: "Upload 2 JSON result files and compare metrics, retrieval quality, and RAGAS evaluation."
- Right actions:
  - (Button) "Sample Template"
  - (Button) "Reset"

[Main Content: 2 Columns on Desktop | 1 Column on Mobile]

### Left Column — Upload Panel (Card)

Card Title: "Upload Files"
Card Description: "Drag & drop JSON outputs from your pipelines."

#### Section: Dropzones (2 slots)

[Dropzone A]

- Label: "File A — FastText Baseline"
- Helper: "Drop JSON here or browse."
- State (empty): dashed border + icon upload
- State (uploaded):
  - Filename
  - Size
  - Detected tags (chips):
    - "model_type: fasttext_baseline" (if found)
    - "features_used: semantic_search" (if found)
  - (Button small) "Remove"
  - (Button small) "Preview"

[Dropzone B]

- Label: "File B — FastText Hybrid"
- Helper: "Drop JSON here or browse."
- Uploaded state mirroring A
  - Detected tags (chips):
    - "model_type: fasttext_hybrid" (if found)
    - "features_used: bm25 / mmr / context_scoring" (if found)

#### Section: Validation Messages (Alert)

- If only one file:
  - Alert: "Upload 2 files to compare."
- If JSON invalid:
  - Alert destructive: "Invalid JSON structure. Expected keys: results, metadata, (optional) ragas_evaluation."
- If mismatch schema:
  - Alert warning: "Schema differs. Some visualizations may be hidden."

#### Section: Compare Controls

- (Toggle) "Auto-detect model type from metadata"
- (Select) "Comparison level"
  - Option: Summary Only
  - Option: + Retrieval Details
  - Option: + Generation & RAGAS

- (Select) "Query filter"
  - All queries
  - Only query contains keyword (input)
  - Only failed cases (overall_score < threshold)
  - Only high-latency cases (processing_time > threshold)

- (Input) threshold controls
  - processing_time threshold (ms)
  - ragas overall_score threshold (0..1)
  - similarity_threshold (if exists)

#### Primary Action

- (Button primary, disabled until 2 files uploaded): "Generate Comparison"
- On click:
  - Parse both JSON
  - Show "Comparison Ready" summary card
  - Navigate to Dashboard page

---

### Right Column — Quick Preview (Card)

Card Title: "Quick Preview"
Card Description: "A lightweight snapshot before you generate the full dashboard."

#### Preview content (when both uploaded)

[Mini Summary Table]
Rows:

- dataset / conversationId coverage
- total records
- avg processing_time
- avg complexity score (if exists)
- avg ragas overall_score (if exists)

[Mini Chips / Badges]

- A model approach: baseline / fasttext_cosine_similarity
- B model approach: hybrid (bm25 + mmr + context)

[Mini Diff Callouts]

- "Δ Avg latency"
- "Δ Overall RAGAS"
- "Δ Retrieval count (top-k / reranked)"

[CTA hint]
Text: "Click 'Generate Comparison' to see charts, per-query drilldowns, and export."

---

## Empty State

- Illustration placeholder
- Copy:
  - "Drop your two result files to start comparing."
  - bullet: "Metrics", "RAGAS", "Retrieval quality", "Latency"
- (Button) "See Example"

---

## Error & Edge Cases (UX notes)

- If user uploads same file twice: show warning, allow but highlight "identical hash".
- If one file is missing ragas_evaluation: hide RAGAS charts, show "Not available".
- If keys differ (e.g., baseline uses `model_approach`, hybrid uses `metadata.model_type`): map to normalized fields.
