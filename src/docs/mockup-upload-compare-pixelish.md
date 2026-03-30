# PAGE: Upload & Compare Experiments

Viewport assumptions:

- Desktop ≥ 1280px
- Tablet 768–1279px
- Mobile ≤ 767px

Spacing scale:

- Outer padding: 32px
- Section gap: 24px
- Card padding: 20px
- Grid gap: 16px

---

[HEADER — Full Width — Height ±96px]

---

| Title: RAG Experiment Comparator |
| Subtitle: Compare FastText vs Hybrid Retrieval |
| |
| [Sample Template] [Reset All] |

---

Divider
Margin-top: 16px

---

[MAIN GRID — Desktop: 2 Columns (7fr / 5fr) — Gap 24px]
[Tablet: 1 column stacked]
[Mobile: 1 column]

=============================================================
LEFT COLUMN (Upload Panel)
=============================================================

[CARD — Upload Files — Full Width]

---

| Card Title: Upload Experiment Files |
| Card Desc: Upload 2 JSON outputs to compare |

---

SECTION: DROPZONES GRID (Desktop: 2 columns, gap 16px)
(Mobile: stacked)

---

| Dropzone A | Dropzone B |
| Label: FastText Baseline | Label: FastText Hybrid |
| | |
| ┌──────────────────────────────┐ | ┌──────────────────────────────┐ |
| | ⬆ Drag & Drop JSON Here | | | ⬆ Drag & Drop JSON Here | |
| | or click to browse | | | or click to browse | |
| └──────────────────────────────┘ | └──────────────────────────────┘ |
| | |
| Helper: Expected array of results | Helper: Must include metadata |

---

DROPZONE STATES:

1. EMPTY STATE

- Dashed border
- Neutral icon
- Light gray background

2. HOVER STATE

- Border primary
- Background subtle primary tint

3. LOADING STATE (Parsing)

---

| Parsing file... |
| [progress bar indeterminate] |

---

4. SUCCESS STATE

---

| ✓ filename.json |
| Size: 1.2MB |
| |
| Badges: |
| [model: fasttext_baseline] |
| [records: 120] |
| [ragas: available] |
| |
| [Preview] [Remove] |

---

5. ERROR STATE

---

| ✖ Invalid JSON structure |
| Missing key: results[] |
| |
| [Remove File] |

---

---

SECTION: VALIDATION ALERT (Full Width under dropzones)

- Warning (1 file only):
  "Upload 2 files to enable comparison."

- Destructive:
  "Schema mismatch detected. Some charts may be disabled."

---

SECTION: COMPARISON SETTINGS (Grid 2 columns desktop)

---

| Comparison Depth | Filters |
| | |
| (Select) | (Input) Query contains keyword |
| - Summary Only | |
| - + Retrieval | (Input) Latency threshold (ms) |
| - + RAGAS | |
| | (Input) Min overall score |

---

---

## PRIMARY ACTION (Full width)

## | [ Generate Comparison ] (disabled until 2 valid files) |

Button states:

- Disabled: opacity 50%
- Loading: spinner left
- Success: navigates to dashboard

=============================================================
RIGHT COLUMN (Quick Preview Panel)
=============================================================

[CARD — Quick Snapshot]

---

## | Title: Quick Comparison Snapshot |

## STATE: EMPTY

| No files uploaded yet |
| Upload both files to preview |

---

## STATE: LOADING

| Computing summary metrics... |
| [spinner centered] |

---

STATE: SUCCESS

GRID 2x2 metrics:

---

| Records A | Records B |
| 120 | 120 |

---

| Avg Lat A | Avg Lat B |
| 820ms | 640ms |

---

| Avg Overall A | Avg Overall B |
| 0.68 | 0.74 |

---

| Δ Overall | Δ Latency |
| +0.06 | -180ms |

---

Footer:
"Click Generate Comparison for full dashboard."
