# Palabreo word-list audit — 2026-06-08 (report only, no changes)

## Context
The Racimo dictionary cleanup (English/proper-noun/junk blocklists,
multi-clitic stripping, single-clitic generation, vosotros removal) was
**not** applied to Palabreo — Palabreo has its own separate lists and only
its *selection algorithm* (waffle anti-repeat) was changed. This audits
Palabreo's four word lists, using Racimo's freshly-cleaned Spanish
dictionary (162,480 words, names/English/junk already removed) as a
"is-this-Spanish?" reference.

Palabreo has two kinds of lists:
- **Answer pools** — what the game picks as the daily solution: `SOLUTIONS`
  (Clásico, 700) and `SOL_Q` (Cuarteto, 769).
- **Guess-validation lists** — what the game *accepts when you type it*:
  `VALID5_STR` (8,614, used by Cuarteto + Trenza) and `VALID_STR` (14,022,
  Clásico).

## About "PLANE"
PLANE is **not** a Cuarteto answer — it's not in `SOL_Q` (or `SOLUTIONS`).
It's in the **guess list** `VALID5_STR`, so the game accepted it when typed.
And technically `plane` *is* valid Spanish (present subjunctive of *planar*,
"que plane"), so it's in the Racimo reference too — it reads English but
isn't strictly contamination. It would only be removed under a stricter
"drop English look-alikes" policy.

## Answer pools — essentially clean

| Pool | Size | Valid Spanish | Issues |
|---|---:|---:|---|
| `SOL_Q` (Cuarteto) | 769 | **769 (100%)** | none |
| `SOLUTIONS` (Clásico) | 700 | 694 (99%) | **6 vosotros answers** |

The only blemish: **6 Clásico answer words are vosotros forms** —
`estáis`, `habéis`, `hacéis`, `podéis`, `sabéis`, `tenéis`. Under the new
audience policy these should be replaced as *answers* (they'd be removed
from the pool and a replacement word picked).

## Guess-validation lists — ~1–3% contamination

| List | Size | Valid Spanish | Candidates to remove |
|---|---:|---:|---:|
| `VALID5_STR` (5-letter) | 8,614 | 8,504 (98%) | **110** |
| `VALID_STR` (Clásico 6) | 14,022 | 13,583 (96%) | **439** |

Breakdown of the candidates:

| Category | VALID5 | VALID_STR | Examples |
|---|---:|---:|---|
| Vosotros forms | 43 | 376 | amáis, aréis, aseis, abráis, aguáis, airéis |
| Proper names | ~40 | ~40 | adela, alain, allan, alton, cairo, cosme, dalai, altman, bannon, donald, eloise |
| English words | ~15 | ~10 | smile, blood, close, alone, doodle, circus, collie |
| Junk / interjections | ~10 | ~10 | noooo, nooooo, alama, alola, aioria, dimila, calana |

(The names/English/junk here are the **same classes I purged from Racimo** —
they were just never filtered out of Palabreo's imported guess lists. The
"valid Spanish" 96–98% are correctly accepted and shouldn't be touched.)

## Recommendation

1. **Replace the 6 vosotros Clásico answers** (estáis/habéis/hacéis/podéis/
   sabéis/tenéis) — clearest issue, they're served as solutions.
2. **Scrub the guess lists** of names + English + junk (~127 words total
   across both). Low risk: every removed word is verifiably not in the
   cleaned Spanish reference.
3. **Vosotros in guess lists** (419 forms): optional. Removing them matches
   the Racimo audience policy, but a *guess* list is meant to be permissive,
   and a player typing `tenéis` getting "not a word" might feel wrong. Your
   call — I'd lean toward removing them for consistency.
4. **`plane`-type English look-alikes** that are technically valid Spanish:
   leave unless you want the stricter policy. `plane` would only go under
   that stricter rule.

No files were changed. Tell me which of 1–4 to apply and I'll do it with the
same before/after validation, and add a Palabreo cleaning step so it persists.
