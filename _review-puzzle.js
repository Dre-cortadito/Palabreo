#!/usr/bin/env node
/* =============================================================
   Palabreo — daily answer reviewer helper
   Usage:  node _review-puzzle.js [YYYY-MM-DD]   (default: tomorrow)
           node _review-puzzle.js --pool         (dump full answer pools for a one-time audit)

   Extracts the live game code from index.html (answer pools + the
   deterministic daily pickers for the three modes) and prints
   tomorrow's answers so an editor (or Claude on a schedule) can
   check they are fair, real Spanish words BEFORE they go live.

   No dependencies — evals the pure functions straight from
   index.html, so it can never drift from the real game.
   ============================================================= */
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

function grab(re, label) {
  const m = html.match(re);
  if (!m) { console.error("EXTRACTION FAILED: " + label); process.exit(1); }
  return m[0];
}

const src = [
  grab(/const SOLUTIONS=\[[\s\S]*?\];/, "SOLUTIONS"),
  grab(/const SOL_Q=\[[\s\S]*?\];/, "SOL_Q"),
  grab(/const WAFFLES=\[[\s\S]*?\];/, "WAFFLES"),
  grab(/function fnv\(iso\)\{[\s\S]*?return h; \}/, "fnv"),
  grab(/function mix\(h\)\{[\s\S]*?\}/, "mix"),
].join("\n");

function _loadGame() {
  return eval(src + ";({ SOLUTIONS, SOL_Q, WAFFLES, fnv, mix })");
}
const { SOLUTIONS, SOL_Q, WAFFLES, fnv, mix } = _loadGame();

/* Same deterministic pickers as the game (per-variant pools). */
const wordForDate = (iso) => SOLUTIONS[mix(fnv("w" + iso)) % SOLUTIONS.length];
function quordleAnswers(iso) {
  const out = []; const base = mix(fnv("q" + iso)); let i = 0;
  while (out.length < 4 && i < 200) {
    const w = SOL_Q[mix(base + i * 2654435761) % SOL_Q.length];
    if (!out.includes(w)) out.push(w); i++;
  }
  return out;
}
const waffleData = (iso) => WAFFLES[mix(fnv("f" + iso)) % WAFFLES.length];
const WF_WORDS = [[0,1,2,3,4],[10,11,12,13,14],[20,21,22,23,24],[0,5,10,15,20],[2,7,12,17,22],[4,9,14,19,24]];
const retoForDate = (iso, MIN, MAX) => MIN + (mix(fnv("r" + iso)) % (((MAX - MIN) / 5) + 1)) * 5;

if (process.argv[2] === "--pool") {
  console.log("CLASICO pool (" + SOLUTIONS.length + " 6-letter answers):\n" + SOLUTIONS.join(" "));
  console.log("\nCUARTETO pool (" + SOL_Q.length + " 5-letter answers):\n" + SOL_Q.join(" "));
  console.log("\nTRENZA grids: " + WAFFLES.length);
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

const wsol = waffleData(dateStr).split("|")[0];
const trenzaWords = WF_WORDS.map((idxs) => idxs.map((i) => wsol[i]).join(""));

console.log("PALABREO ANSWER REVIEW — " + dateStr);
console.log("Clásico  (6 letras): " + wordForDate(dateStr).toUpperCase() +
            "   (reto: " + retoForDate(dateStr, 55, 80) + ")");
console.log("Cuarteto (5 letras): " + quordleAnswers(dateStr).map((w) => w.toUpperCase()).join(", ") +
            "   (reto: " + retoForDate(dateStr, 55, 80) + ")");
console.log("Trenza   (5 letras): " + trenzaWords.map((w) => w.toUpperCase()).join(", ") +
            "   (reto: " + retoForDate(dateStr, 85, 90) + ")");
console.log("\nGrid Trenza:");
for (let r = 0; r < 5; r++) console.log("  " + wsol.slice(r * 5, r * 5 + 5).toUpperCase().replace(/\./g, "·").split("").join(" "));
