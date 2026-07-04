# Palabreo — JUDIO removed from answer pools

**Date:** 2026-06-28 · **File changed:** `Palabreo/index.html` (only)

## Why
JUDIO is dictionary-valid (gentilicio) but refers to a religious/ethnic identity. Per Dre's
policy, the public-facing **answer** pool avoids identity/religious/ethnic/political terms.
JUDIO stays a **legal guess** (still in `VALID5`); it is only barred as a daily answer.

## Replacement word
**JADEO** (m., *acción y efecto de jadear* — panting/gasping). Neutral, common, DLE-valid,
already in `VALID5`. It matches the same `J _ D _ O` cross pattern as JUDIO, so it drops into
both affected Trenza grids without disturbing any crossing word.

## Edits (5, all in-place → no schedule reshuffle)
1. **Trenza grid idx 81** (serves 2026-07-05): solution `justou.a.idicesi.a.toirme` →
   `justoa.a.idicese.a.toirme`; scramble `judtuo.s.iiocets.r.iiaame` →
   `judtao.s.iiocets.r.ieaame`. Column-0 word JUDIO → JADEO.
2. **Trenza grid idx 266**: solution/scramble updated the same way (column-0 JUDIO → JADEO).
3. **`SOL_Q`** (Cuarteto pool): element `"judio"` → `"jadeo"` (same array slot → length 754
   unchanged, so no Cuarteto date reshuffles).
4. **`BLOCKED_ANSWERS`**: added `'judio'` (safety net; sits next to existing `'judios'`).
5. **`BLOCKED_WAFFLE_WORDS`**: added `'judio'` (Trenza safety net).

Because JADEO occupies the same two grids JUDIO did, the Trenza cooldown scheduler
(`_WAFFLE_ORDER`) is invariant — verified below.

## Validation (all PASS)
- 2026-07-05 Trenza now: **JUSTO · DICES · OIRME · JADEO · SACAR · OISTE**.
- No grid contains `judio`; grids 81 & 266 spell `jadeo`. Both: scramble is a true permutation
  of the solution, blanks aligned, all six woven words in `VALID5`, not pre-solved → solvable.
- Schedule diff over a 400-day window: identical except 07-05 Trenza (judio→jadeo) and the two
  Cuarteto dates that had served judio (2026-07-21, 2027-06-12 → jadeo). `_WAFFLE_ORDER` length
  553 unchanged; `SOL_Q` length 754 unchanged.
- Full 760-day scan: `judio` served **0** times across Cuarteto + Trenza.
- 07-05 words: no proper nouns, no English, no identity terms, none on the known-bad list.
- `judio` remains a valid guess (`VALID5`); `jadeo` also valid.

> Not yet deployed — run `Palabreo/_deploy.command` to publish.
