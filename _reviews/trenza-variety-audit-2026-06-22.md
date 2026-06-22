# Palabreo Trenza — word-variety audit (2026-06-22)

**Question from Dre:** is RUEDA (and words like it) overused, why, and what soft anti-repeat
rule keeps Trenza varied without blocking normal Spanish words?

**Method:** the Trenza schedule is fully deterministic, so I ran the *live game's own*
scheduler (extracted from `index.html`) and enumerated every grid/word served. Structure:
the game keeps **65 of the 229 grids** in rotation, indexed by absolute day number — so the
**entire Trenza set repeats every 65 days (~9 weeks)**, and a word's calendar frequency =
(times it appears in the 65-grid cycle).

---

## 1. Which words repeat too often

Per 65-day cycle (≈ how often you'd see it; ×N over a year ≈ N×5.6):

| Word | Appears/cycle | ≈ every | Same-week min gap | Pool grids (of 229) |
|------|:---:|:---:|:---:|:---:|
| IDEAL | 8× | 8 d | **1 d** ⚠ | 8 (3%) |
| NUEVA | 8× | 8 d | 4 d | 58 (25%) |
| SERLO | 8× | 8 d | 6 d | 41 (18%) |
| RUEDA | 8× | 8 d | 6 d | 73 (32%) |
| ATACO | 8× | 8 d | 6 d | 23 (10%) |
| INDIA | 8× | 8 d | 6 d | 13 (6%) |
| LLEVE | 8× | 8 d | 7 d | 37 (16%) |
| ROLLO | 7× | 9 d | 4 d | 9 (4%) |
| OIRLO | 7× | 9 d | 5 d | 16 (7%) |
| EPOCA / SUAVE | 6× | 11 d | 7 d | 13 / 16 |

There's a hard ceiling of **8 appearances per cycle** (the generator's `CAP=8`). Seven words
sit exactly at it. 127 words appear only once — so the long tail is fine; the problem is a
small head of ~11 words.

**Real-world check** (rolling 7-day windows across 2026): **25% of weeks contain a repeated
Trenza word.** The words that most often show up *twice in the same 7 days*: IDEAL (48
weeks/yr), ROLLO (30), NUEVA (30), PRIMA (24), AHORA (24), ALTOS (18).

## 2. Is RUEDA actually overused — or does it just feel that way?

Both. RUEDA is **tied at the ceiling (8×, ~every 8 days)** and is the **single most common word
in the grid pool (32%)**, so you genuinely see it almost weekly. But it is **not uniquely**
overused — six other words match it at 8×. And for the specific "twice in one week" annoyance,
RUEDA is actually *mild* (min gap 6 days; only ~6 weeks/yr show it twice). The worst same-week
offender is **IDEAL**, which is served on **back-to-back days** in the cycle. Your instinct is
right; it's just a *class* of ~7–11 words, and RUEDA is the most frequent overall but not the
most clustered.

## 3. Is there a generator bias? Yes — three compounding causes

1. **Letter-compatibility / grid-construction bias (root cause).** A few common, vowel-rich,
   easy-to-cross words dominate the 229-grid pool: **RUEDA 32%, NUEVA 25%, SERLO 18%, LLEVE
   16%.** They fit waffle crossings easily, so the generator produced them over and over.
2. **Pool size + cap interaction.** Because heavy words are in so many grids, capping them at 8
   excludes most grids, leaving only **65 in rotation → a short 9-week cycle**, so everything
   recurs quickly.
3. **`byRarest` keeps all grids of rare words.** A globally rare word (IDEAL — only 8 grids) has
   *all* of its grids kept, so it also reaches 8× and can land on consecutive days. So even
   "rare" words can cluster.

## 4. Other words like RUEDA you may not have noticed

Over-served (8×/7×): **IDEAL, NUEVA, SERLO, ATACO, INDIA, LLEVE, ROLLO, OIRLO**. Worst for
*same-week duplicates*: **IDEAL, ROLLO, NUEVA, PRIMA, AHORA, ALTOS**. (IDEAL is the one I'd flag
first — it's served on adjacent days.)

## 5. Recommended soft anti-repeat rule

Key finding from simulation: **just lowering the cap doesn't help** — it shrinks the cycle
proportionally, so RUEDA's *calendar* cadence stays ~8–10 days. Two levers actually work:

### Tier 1 — scheduler tweak (ship now, no new grids, low risk)
- **Two-tier cap.** Keep `CAP=8` for normal words, but cap **heavy words (≥15% of pool:
  RUEDA, NUEVA, SERLO, LLEVE) at ~2**. Simulated result: RUEDA drops from ~every 8 days to
  **~every 21 days**, with ~141 distinct grids still in rotation.
- **Cooldown ordering.** Replace the current min-gap greedy with a cooldown scheduler that
  places the heaviest-remaining word first and enforces a target gap (~10–14 days). This kills
  the same-week clustering (the IDEAL adjacent-day case).
- **Honest trade-off:** the rotation cycle shortens to ~6 weeks (fewer grids survive the
  tighter cap), so the *set* recurs a bit sooner even as individual heavy words get rarer.

This directly implements your rule: heavy words no longer weekly; near-zero "twice in a week."

### Tier 2 — the durable fix (bigger, recommended follow-up)
**Rebalance the grid pool.** Regenerate/extend `WAFFLES` with grids built from a broader
vocabulary and **cap each word at generation (e.g. ≤6 of the pool's grids, <3%)**, so no word
dominates. This lengthens the cycle with *fresh* words and structurally lowers heavy-word
frequency — the only way to get both a long cycle *and* infrequent heavy words. It reshuffles
which grid lands on which date (harmless; state is per-date).

### Plus — reviewer flag (free, already possible)
The fixed `_review-puzzle.js` can list each week's six-day Trenza words and flag any word
served **twice within the upcoming 7 days**, so forced reuses surface in the weekly review.

**My recommendation:** do **Tier 1 now** (two-tier cap + cooldown order; ~30 min, reversible)
to stop the weekly RUEDA/IDEAL feeling immediately, and schedule **Tier 2** (pool rebalance) as
a follow-up for a real long-term variety upgrade. Per your preference, **no normal Spanish word
is ever blocked** — RUEDA, NUEVA, etc. stay fully valid and guessable; they're just served less
often.

---
*Numbers from `/tmp` simulations against the live `WAFFLES`/`_WAFFLE_ORDER`. No game files were
changed by this audit — analysis only.*
