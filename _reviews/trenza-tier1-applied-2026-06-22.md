# Palabreo Trenza — Tier 1 variety fix APPLIED (2026-06-22)

Editorial-variety fix (NOT contamination). No word is blocked — RUEDA, NUEVA, SERLO, LLEVE,
IDEAL, ROLLO, OIRLO all stay valid and guessable; they are just **served less often**.
**Not deployed yet** — run `Palabreo/_deploy.command` to push live. Reversible: the change is a
single self-contained `_WAFFLE_ORDER` block in `index.html` (restore the prior block to undo).

## What changed
`Palabreo/index.html` — `_WAFFLE_ORDER` scheduler rewritten:
1. **Two-tier appearance cap.** Heavy pool-dominant words (≥15% of grids → RUEDA, NUEVA, SERLO,
   LLEVE) capped at **2** per rotation; every other word capped at **3**. (Your suggested
   heavy≈2 — but the audit showed keeping the *normal* cap at 8 ballooned same-week duplicates
   to 70%, so the general cap had to come down too. You chose "fewer repeats.")
2. **Cooldown ordering** (target gap ~12 days, most-constrained word first) — eliminates the
   IDEAL back-to-back-days problem.

`Palabreo/_review-puzzle.js` — new **`--week [YYYY-MM-DD]`** mode under an **EDITORIAL VARIETY**
heading (kept separate from contamination): flags any Trenza word served twice within the
upcoming 7 days, and lists words that can recur within a week anywhere in the rotation.

## Before → After (measured over a full year)

| Metric | Before | After |
|---|---|---|
| RUEDA frequency | 46×/yr (~every 8 days) | **27×/yr (~every 14 days)** |
| IDEAL | served on **back-to-back days** | 3×/rotation, **min gap 7 days** |
| Any word on adjacent days | 1 (IDEAL) | **0** |
| Weeks with a duplicate Trenza word | 25% | **22%** (improved) |
| Grids in rotation (cycle) | 65 | 27 |

## Tradeoffs (you asked)
- **Board rotation shortened 65 → 27 days** — a given grid now reappears about monthly instead
  of every ~9 weeks. This is the price of capping the pool-dominant words with the *current*
  grid pool; Tier 2 (regenerating/expanding `WAFFLES` so no word exceeds ~3% of grids) is what
  lets us lengthen the cycle again while keeping low repetition.
- **A few words can still recur within a week** (unavoidable in a 27-day cycle): currently
  NORTE, LLAMA, PAGAR, ROBOT, ETAPA. These are now **flagged** by `--week`, e.g. the upcoming
  week shows `LLAMA ×2 (06-22, 06-24)`. Allowed but visible, per your spec.
- No contamination change; all answers verified still in the canonical dictionary (guessable).

## How to use the new reviewer
```
cd Palabreo && node _review-puzzle.js --week 2026-06-22
```
Add this to the weekly review; report RUEDA-style overuse under "editorial variety," not
contamination.
