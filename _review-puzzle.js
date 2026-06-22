#!/usr/bin/env node
/* =============================================================
   Palabreo — daily answer reviewer helper
   Usage:  node _review-puzzle.js [YYYY-MM-DD]   (default: tomorrow)
           node _review-puzzle.js --pool         (dump full answer pools)

   IMPORTANT — this reviewer EXECUTES THE GAME'S OWN picker functions,
   pulled verbatim out of index.html, so it can never drift from what
   players actually see. (A previous version REIMPLEMENTED the pickers
   and silently drifted: it used an old Trenza ordering and skipped the
   BLOCKED_ANSWERS filter, so it reported grids/answers the live game
   never serves — e.g. a phantom "NUEVA ×4" week. Don't reintroduce a
   local reimplementation; always extract from index.html.)

   What it extracts and runs as-is:
     • data:  SOLUTIONS, SOL_Q, WAFFLES, WF_WORDS, BLOCKED_ANSWERS,
              BLOCKED_WAFFLE_WORDS, _WAFFLE_ORDER
     • funcs: fnv, mix, _isoShift, _baseWord, _baseQuordle, wordForDate,
              quordleAnswers, _gridWords, _daynum, waffleData, retoForDate
   The per-variant globals the game sets in applyVariant() (SOLS,
   RETO_MIN, RETO_MAX) are set here to the same VARIANTS values
   (clásico: SOLUTIONS/55-80 · cuarteto: SOL_Q/55-80 · trenza: -/85-90).
   ============================================================= */
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

/* ---- robust extractors (bracket-aware, so they never mis-cut) ---- */
function _matchFrom(s, openIdx) {
  // openIdx points at an opening bracket; return index just past its match.
  const pairs = { "(": ")", "[": "]", "{": "}" };
  const stack = [];
  for (let i = openIdx; i < s.length; i++) {
    const c = s[i];
    if (c === "(" || c === "[" || c === "{") stack.push(pairs[c]);
    else if (c === ")" || c === "]" || c === "}") {
      if (stack.pop() !== c) throw new Error("bracket mismatch at " + i);
      if (stack.length === 0) return i + 1;
    }
  }
  throw new Error("unbalanced brackets from " + openIdx);
}
function grabFunction(name) {
  const at = html.indexOf("function " + name + "(");
  if (at < 0) { console.error("EXTRACTION FAILED (function): " + name); process.exit(1); }
  const brace = html.indexOf("{", html.indexOf(")", at));
  return html.slice(at, _matchFrom(html, brace));
}
function grabAssignment(lhs) {
  // matches `const LHS = <expr>;` where <expr> may be [...], new Set([...]),
  // (function(){...})(), etc. Ends at the first top-level ';'.
  const at = html.indexOf(lhs);
  if (at < 0) { console.error("EXTRACTION FAILED (const): " + lhs); process.exit(1); }
  let i = html.indexOf("=", at) + 1;
  let depth = 0;
  for (; i < html.length; i++) {
    const c = html[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (c === ";" && depth === 0) { i++; break; }
  }
  return html.slice(at, i);
}

const src = [
  "let SOLS, RETO_MIN, RETO_MAX;",
  grabAssignment("const SOLUTIONS="),
  grabAssignment("const SOL_Q="),
  grabAssignment("const WAFFLES="),
  grabAssignment("const BLOCKED_ANSWERS"),
  grabAssignment("const BLOCKED_WAFFLE_WORDS"),
  grabAssignment("const WF_WORDS="),
  grabFunction("fnv"),
  grabFunction("mix"),
  grabFunction("_isoShift"),
  grabFunction("_baseWord"),
  grabFunction("_baseQuordle"),
  grabFunction("wordForDate"),
  grabFunction("quordleAnswers"),
  grabFunction("_gridWords"),
  grabAssignment("const _WAFFLE_ORDER="),
  grabFunction("_daynum"),
  grabFunction("waffleData"),
  grabFunction("retoForDate"),
].join("\n");

const G = eval(
  src +
  ";({ SOLUTIONS, SOL_Q, WAFFLES, WF_WORDS, _WAFFLE_ORDER, wordForDate, quordleAnswers, waffleData, retoForDate," +
  "  setMode:(s,lo,hi)=>{SOLS=s;RETO_MIN=lo;RETO_MAX=hi;} })"
);

/* ---- per-variant helpers (mirror VARIANTS in index.html) ---- */
function clasico(iso) { G.setMode(G.SOLUTIONS, 55, 80); return { word: G.wordForDate(iso), reto: G.retoForDate(iso) }; }
function cuarteto(iso) { G.setMode(G.SOL_Q, 55, 80); return { words: G.quordleAnswers(iso), reto: G.retoForDate(iso) }; }
function trenza(iso) {
  G.setMode([], 85, 90);
  const wsol = G.waffleData(iso).split("|")[0];
  const words = G.WF_WORDS.map((idxs) => idxs.map((i) => wsol[i]).join(""));
  return { wsol, words, reto: G.retoForDate(iso) };
}

if (process.argv[2] === "--pool") {
  console.log("CLASICO pool (" + G.SOLUTIONS.length + " 6-letter answers):\n" + G.SOLUTIONS.join(" "));
  console.log("\nCUARTETO pool (" + G.SOL_Q.length + " 5-letter answers):\n" + G.SOL_Q.join(" "));
  console.log("\nTRENZA grids: " + G.WAFFLES.length);
  process.exit(0);
}

/* ---- --week: editorial-variety check on Trenza repetition ----
   Flags (a) any Trenza word served twice within the upcoming 7-day window, and
   (b) words recurring too often across the whole rotation (min gap < 14 days).
   This is a VARIETY check, not contamination — the words stay valid/guessable. */
function _isoAdd(iso, k) {
  const p = iso.split("-");
  const d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]) + k * 86400000);
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0");
}
if (process.argv[2] === "--week") {
  let start = process.argv[3];
  if (!start) start = _isoAdd(new Date().toISOString().slice(0, 10), 1);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) { console.error("Bad date: " + start); process.exit(1); }

  // (a) upcoming 7-day window
  const byWord = {};
  console.log("PALABREO — Trenza editorial-variety check, week of " + start + "\n");
  for (let k = 0; k < 7; k++) {
    const iso = _isoAdd(start, k);
    const words = trenza(iso).words.map((w) => w.toUpperCase());
    console.log("  " + iso + "  " + words.join(" · "));
    words.forEach((w) => { (byWord[w] = byWord[w] || []).push(iso); });
  }
  const dupes = Object.entries(byWord).filter(([, ds]) => ds.length >= 2);
  console.log("\nEDITORIAL VARIETY (not contamination):");
  if (dupes.length === 0) {
    console.log("  ✓ No Trenza word repeats within this 7-day window.");
  } else {
    console.log("  ⚠ Words served TWICE+ within the 7-day window (allowed, but flagged):");
    dupes.sort((a, b) => b[1].length - a[1].length)
      .forEach(([w, ds]) => console.log("    " + w + " ×" + ds.length + "  (" + ds.join(", ") + ")"));
  }

  // (b) rotation-wide recurrence (min gap < 14 days over the full cycle)
  const N = G._WAFFLE_ORDER.length;
  function daynum(iso) { const p = iso.split("-"); return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  const pos = {};
  const base = daynum(start);
  for (let off = 0; off < N; off++) {
    trenza(_isoAdd(start, off)).words.forEach((w) => { (pos[w.toUpperCase()] = pos[w.toUpperCase()] || []).push(off); });
  }
  function minGap(a) { if (a.length < 2) return Infinity; const s = [...a].sort((x, y) => x - y); let g = Infinity; for (let i = 1; i < s.length; i++) g = Math.min(g, s[i] - s[i - 1]); return Math.min(g, N - s[s.length - 1] + s[0]); }
  const recurring = Object.entries(pos).map(([w, a]) => ({ w, c: a.length, gap: minGap(a) }))
    .filter((r) => r.c >= 2 && r.gap < 7).sort((a, b) => a.gap - b.gap || b.c - a.c);
  console.log("\n  Words that can recur within a week somewhere in the " + N + "-day rotation (min gap < 7d):");
  if (recurring.length === 0) console.log("    ✓ none");
  else recurring.forEach((r) => console.log("    " + r.w.padEnd(7) + " " + r.c + "x/rotation, every ~" + Math.round(N / r.c) + "d (min gap " + r.gap + "d)"));
  process.exit(0);
}

let dateStr = process.argv[2];
if (!dateStr) {
  const d = new Date(Date.now() + 24 * 3600 * 1000);
  dateStr = d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
  console.error("Bad date: " + dateStr + " (want YYYY-MM-DD)");
  process.exit(1);
}

const c = clasico(dateStr);
const q = cuarteto(dateStr);
const t = trenza(dateStr);

console.log("PALABREO ANSWER REVIEW — " + dateStr);
console.log("Clásico  (6 letras): " + c.word.toUpperCase() + "   (reto: " + c.reto + ")");
console.log("Cuarteto (5 letras): " + q.words.map((w) => w.toUpperCase()).join(", ") + "   (reto: " + q.reto + ")");
console.log("Trenza   (5 letras): " + t.words.map((w) => w.toUpperCase()).join(", ") + "   (reto: " + t.reto + ")");
console.log("\nGrid Trenza:");
for (let r = 0; r < 5; r++) console.log("  " + t.wsol.slice(r * 5, r * 5 + 5).toUpperCase().replace(/\./g, "·").split("").join(" "));
