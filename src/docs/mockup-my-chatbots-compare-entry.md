# PAGE: My Chatbots (with Compare Results Entry)

App Shell:

- Left Sidebar (existing)
- Top Navbar (existing)
- Main Content: "My Chatbots" with chatbot cards grid

=====================================================================
LEFT SIDEBAR (Persistent)
=====================================================================

- Home (active)
- My Chatbots (active when on this page)
- Create Chatbot
- Ask AI
- Inbox

---

Footer:

- Settings
- Help
- User Profile

=====================================================================
TOP NAVBAR (Sticky)
=====================================================================
Left:

- Breadcrumb: "Chatbot / My Chatbots"

Right:

- [ + Create New Chatbot ] (existing CTA)
  Optional:
- (Icon button) Notifications
- (Icon button) Profile dropdown

=====================================================================
MAIN CONTENT
=====================================================================

## [PAGE HEADER]

Title: "My Chatbots"
Subtitle: "Manage your AI chatbots"
Right (optional secondary actions):

- [Compare Results] (opens Compare Hub / recent comparisons)

---

---

## SECTION: CHATBOT CARDS GRID

Grid:

- Desktop: 2–3 columns
- Tablet: 2 columns
- Mobile: 1 column
  Gap: 20–24px

CARD STRUCTURE (per chatbot)
┌───────────────────────────────────────────────────────────┐
| [chatbot icon] Chatbot Name |
| (Status chip) Active / Inactive |
| |
| Description (2–3 lines clamp) |
| |
| Meta row: |
| - Model: gpt-3.5-turbo |
| - Updated: 2/23/2026 |
| |
| Actions row: |
| [View Details] [Compare Experiments] (icon buttons) |
| [✎ edit] [🗑 delete] |
└───────────────────────────────────────────────────────────┘

NEW BUTTON: "Compare Experiments"

- Variant: secondary outline or ghost (to not compete with View Details)
- Icon: bar-chart / compare arrows
- Tooltip: "Compare 2 experiment JSON outputs for this chatbot"

---

## BUTTON BEHAVIOR & FLOW

[Compare Experiments] click opens:
Option A (recommended): Compare Setup Modal (lightweight)
Option B: Navigate to new page "Chatbot / {name} / Compare Results / Upload"

---

## Option A: Compare Setup Modal (pixel-ish)

MODAL Title: "Compare Experiments"
Subtitle: "Upload two JSON result files and generate a comparison dashboard."

Body:

- Chatbot context chip: [Chatbot: Omni Hottilier]
- Two drop slots (mini):
  - File A: FastText Baseline
  - File B: FastText Hybrid
- Toggle:
  - "Remember this comparison under this chatbot" (on by default)
- CTA:
  - [Generate Comparison] (disabled until both valid)
- Secondary:
  - [Cancel]
  - [Advanced settings] → expands thresholds & depth options

Modal States:

- Empty: instructions
- Loading: parsing spinner
- Error: invalid schema banner
- Success: "Comparison ready" → [Open Dashboard]

---

## Option B: Navigate to Compare Upload Page

Route example:

- /chatbots/{id}/compare/upload

User lands on Upload JSON page (shell + sidebar + navbar),
already scoped to selected chatbot.

---

## SECTION: RECENT COMPARISONS (Optional on My Chatbots)

Below cards grid (or right sidebar on wide screens):

[CARD] "Recent Comparisons"
List items:

- "Omni Hottilier — Baseline vs Hybrid — 2/23/2026"
  - [Open Dashboard]
  - Status chips: "RAGAS available" / "Missing RAGAS"
- "Omni Hottilier proposed — Baseline vs Hybrid — 2/23/2026"
  - [Open Dashboard]

Empty state:

- "No comparisons yet."
- CTA: "Open a chatbot → Compare Experiments"

---

## EMPTY STATE (No Chatbots)

Illustration + text:

- "No chatbots yet."
  Buttons:
- [Create New Chatbot]
- [Import / Upload config] (optional)

---

## ERROR STATES (Page)

- Failed to load list:
  - Banner: "Could not load chatbots. Retry."
  - [Retry] button
- Permission issues:
  - Banner: "You don't have access to this chatbot."
