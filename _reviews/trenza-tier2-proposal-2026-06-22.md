# Palabreo Trenza — Tier 2 pool rebalance (PROPOSAL — not yet applied)

Structural fix: a **generation-balanced** `WAFFLES` pool so no normal Spanish word dominates,
instead of leaning on scheduler caps. **No word is blocked** — RUEDA, NUEVA, SERLO, LLEVE, IDEAL…
stay valid and guessable; they just can't be *built into* many grids.

**Status:** staged in `Palabreo/index.html.tier2-staged`. **Live `index.html` is unchanged** —
awaiting your OK to apply. Fully reversible.

## How it was built
- **Generation-time cap = 12 grids per word (≈2.2% of pool).** While generating, once a word has
  been used in 12 grids it can't be used again, so the builder is forced to reach for broader
  vocabulary instead of the easy-to-cross favorites.
- **Vocabulary = 742 vetted "fair answer" words** (the Cuarteto answer pool ∪ existing Trenza
  answers, all in the canonical dictionary, minus the already-excluded blocked words). So every
  grid word is common, real Spanish — no obscure/junky fill, no proper nouns/English/brands.
- Valid waffle construction (all 6 crossings consistent); each grid solvable within the 15-swap
  budget; scramble difficulty matches the originals (~11 swaps, ~5 starting greens).
- **Validation:** 553/553 grids have all 6 answers in the canonical dict (guessable); 0 scrambles
  malformed; 0 unsolvable.

## Before → After

| Metric | Before (original) | After (Tier 2) |
|---|---|---|
| Total Trenza grids | 229 | **553** |
| Grids kept in rotation | 65 (cap-subset) | **553 (all)** |
| Rotation cycle length | 65 days (~9 wk) | **553 days (~1.5 yr)** |
| Distinct answer words used | 402 | **660** |
| Words appearing in >3% of grids | **35** | **0** |
| Max single-word share | RUEDA 31.9% | **2.2%** |
| RUEDA | 73 grids (32%) → ~46×/yr (every ~8d) | **12 grids (2.2%) → ~8×/yr (every ~46d)** |
| NUEVA | 56 grids (24.5%) | **12 grids (2.2%)** |
| SERLO | 39 grids (17.0%) | **12 grids (2.2%)** |
| LLEVE | 37 grids (16.2%) | **12 grids (2.2%)** |
| Same-week duplicate weeks (per yr) | 25% | **0%** |
| Words on adjacent days | 1 (IDEAL) | **0** |

### Top 20 words — BEFORE (over-concentrated)
RUEDA 32% · NUEVA 24% · SERLO 17% · LLEVE 16% · ACABE 10% · ATACO 10% · OJALA 9% · OIRLO 7% ·
SUAVE 7% · NORTE 7% · SERIA 6% · INDIA 6% · EPOCA 5% · SUENA 5% · TIENE 5% · AYUDE 5% · OREJA 4% ·
LUGAR 4% · ACABA 4% · ETAPA 4%

### Top 20 words — AFTER (flat at the cap)
RUEGO · SUAVE · ABAJO · SANTO · ACERO · LLAMA · LEGAL · ETAPA · APAGA · LOCAL · RONDA · LAVAR ·
LLORA · ARENA · EPOCA · SUELO · NIETO · SIETE · NUEVO · FINAL — **all 12 grids each (2.2%)**

### Any word still over the 3% target? **No.** Max is 2.2%.
### Calendar frequency of the biggest repeaters: **~every 46 days** (was ~every 8 days).
### Same-week duplicates still possible? **Effectively no** — 0% over a simulated year; the
cooldown ordering keeps every word's minimum gap ≥15 days.

## Scheduler change (kept a light cooldown, per your ask)
Tier 1's aggressive cap/subset is removed (the balanced pool makes it unnecessary and it would
have shrunk the new pool back down). The scheduler now keeps **all** grids and applies only the
**cooldown ordering** (target gap ~14 days) so nothing clusters. `BLOCKED_WAFFLE_WORDS` is still
honored as a safety net. Diff (abridged):

```diff
- // Tier 1: two-tier caps (heavy=2 / normal=3) + byRarest subset + cooldown
- const NORMAL_CAP=3, HEAVY_CAP=2, HEAVY_POOL_SHARE=0.15;
- const capOf=w=> (gfreq[w]/N>=HEAVY_POOL_SHARE ? HEAVY_CAP : NORMAL_CAP);
- ...byRarest sort... keep grids under per-word cap...
- const GAP_TARGET=12;
+ // Tier 2: pool is generation-balanced; keep ALL grids, light cooldown only
+ const words=[], keep=[];   // keep every grid (minus BLOCKED_WAFFLE_WORDS safety)
+ const GAP_TARGET=14;
  // (same cooldown ordering loop: max-min-gap, most-constrained word first)
```

## Sample of new grids (each line = the 6 answers of one grid)
```
VOCES CRUEL AMADO VACIA CAUSA SALTO      DARAN BEBER ARROZ DEBIA ROBAR NARIZ
SOLAS BESAR ABAJO SABIA LISTA SERIO      TRIBU CUEVA ROLLO TOCAR IDEAL USADO
PASTA DIANA RUEGO PEDIR SUAVE ABAJO      PLAZA PARED SALGA PAPAS ABRIL ALDEA
FACIL NOCHE LLEVA FINAL COCHE LLEGA      DEDOS MORAL SONAR DAMOS DARAN SOLAR
```

## Tier 1 still useful?
Yes — the **cooldown ordering is retained**. What's dropped is the aggressive per-word *cap/subset*
that shortened the rotation; the balanced pool now does that job structurally and far better.

## To apply
Swap the staged file into place, then deploy:
```
mv index.html index.html.pre-tier2 && mv index.html.tier2-staged index.html
# (optional) node _review-puzzle.js --week 2026-06-22   # sanity-check
# then: Palabreo/_deploy.command
```
The reviewer auto-syncs to the new pool (it reads the live game), so the weekly `--week` variety
check keeps working.
