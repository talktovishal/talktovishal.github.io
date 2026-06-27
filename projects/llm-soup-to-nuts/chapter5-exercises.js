// Chapter 5 exercise-first draft: attention by hand.

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function dot(a, b) {
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function softmax(scores) {
  const max = Math.max(...scores);
  const exps = scores.map((score) => Math.exp(score - max));
  const total = exps.reduce((sum, value) => sum + value, 0) || 1;
  return exps.map((value) => value / total);
}

function createElement(tag, className = "", text = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function createSvgElement(tag, attrs = {}, text = "") {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
  if (text) el.textContent = text;
  return el;
}

function setHtml(el, html) {
  el.innerHTML = html || "";
}

function formatNumber(value, places = 3) {
  const fixed = Number(value).toFixed(places);
  return fixed === "-0.000" ? "0.000" : fixed;
}

function formatAnswerValue(value, places = 3) {
  const rounded = Math.round(value);
  const epsilon = 0.5 * 10 ** -places;
  if (Math.abs(value - rounded) < epsilon) return String(rounded);
  return formatNumber(value, places);
}

function parseNumericAnswer(raw) {
  const cleaned = raw.trim().replace(/[−–—]/g, "-").replace(/,/g, "");
  if (!cleaned) return null;
  const direct = Number(cleaned);
  if (Number.isFinite(direct)) return direct;
  if (!/^[0-9eE+\-*/().\s]+$/.test(cleaned)) return null;
  try {
    const value = Function(`"use strict"; return (${cleaned});`)();
    return Number.isFinite(value) ? value : null;
  } catch (error) {
    return null;
  }
}

function normalizeTextAnswer(raw) {
  return raw.trim().toLowerCase().replace(/["'`]/g, "").replace(/\s+/g, " ");
}

const DIM = 4;
const SCALE = Math.sqrt(DIM);
const CHANNELS = ["subject", "verb", "function", "animate"];
const TOKENS = [
  { word: "Sarah", q: [0.0, 1.4, 0.0, 0.2], k: [1.6, 0.0, 0.0, 0.15], v: [1.0, 0.0, 0.0, 0.3] },
  { word: "fed", q: [0.3, 0.0, 0.2, 1.4], k: [0.0, 1.6, 0.0, 0.0], v: [0.0, 1.0, 0.0, 0.0] },
  { word: "the", q: [0.0, 0.0, 0.0, 1.4], k: [0.0, 0.0, 1.4, 0.0], v: [0.0, 0.0, 1.0, 0.0] },
  { word: "cat", q: [0.6, 0.6, 0.0, 0.2], k: [0.0, 0.0, 0.0, 1.8], v: [0.0, 0.0, 0.0, 1.0] },
  { word: "because", q: [0.0, 0.8, 0.4, 0.0], k: [0.0, 0.0, 1.2, 0.0], v: [0.0, 0.0, 0.8, 0.0] },
  { word: "it", q: [0.1, 0.0, 0.3, 1.8], k: [0.0, 0.0, 0.5, 0.1], v: [0.0, 0.0, 0.3, 0.3] }
];

const IDX = {
  sarah: 0,
  fed: 1,
  the: 2,
  cat: 3,
  because: 4,
  it: 5
};

function attentionRow(queryIndex, causal = false) {
  const q = TOKENS[queryIndex].q;
  const scaledScores = TOKENS.map((token, index) => {
    if (causal && index > queryIndex) return null;
    return dot(q, token.k) / SCALE;
  });
  const visibleIndexes = scaledScores.map((score, index) => (score === null ? null : index)).filter((index) => index !== null);
  const visibleScores = visibleIndexes.map((index) => scaledScores[index]);
  const visibleWeights = softmax(visibleScores);
  const weights = TOKENS.map(() => 0);
  visibleIndexes.forEach((tokenIndex, visibleIndex) => {
    weights[tokenIndex] = visibleWeights[visibleIndex];
  });
  const output = CHANNELS.map(() => 0);
  visibleIndexes.forEach((tokenIndex) => {
    TOKENS[tokenIndex].v.forEach((value, channelIndex) => {
      output[channelIndex] += weights[tokenIndex] * value;
    });
  });
  return { scaledScores, visibleIndexes, weights, output };
}

const itRow = attentionRow(IDX.it, false);
const catCausalRow = attentionRow(IDX.cat, true);
const rawItDenominator = itRow.scaledScores.reduce((sum, score) => sum + Math.exp(score), 0);
const rawCatCausalDenominator = catCausalRow.visibleIndexes.reduce((sum, index) => (
  sum + Math.exp(catCausalRow.scaledScores[index])
), 0);
const tileOneScores = itRow.scaledScores.slice(0, 3);
const tileTwoScores = itRow.scaledScores.slice(3, 6);
const tileOneMax = Math.max(...tileOneScores);
const tileOneStableDenom = tileOneScores.reduce((sum, score) => sum + Math.exp(score - tileOneMax), 0);
const flashGlobalMax = Math.max(tileOneMax, ...tileTwoScores);
const flashStableDenom = tileOneStableDenom * Math.exp(tileOneMax - flashGlobalMax)
  + tileTwoScores.reduce((sum, score) => sum + Math.exp(score - flashGlobalMax), 0);

function vectorText(vector, places = 2) {
  return `[${vector.map((value) => Number(value).toFixed(places)).join(", ")}]`;
}

function scoreText(score) {
  return score === null ? "masked" : formatNumber(score, 3);
}

const headSteps = [
  {
    id: "q-it-animate",
    phase: "Q row",
    prompt: "Step 1: read one channel from the query row.",
    instruction: "The query row for <strong>it</strong> is <code>[0.10, 0.00, 0.30, 1.80]</code>. What is the <strong>animate</strong> channel?",
    answer: TOKENS[IDX.it].q[3],
    tolerance: 0.005,
    solution: "The animate channel is <code>1.800</code>.",
    hints: ["The channels are subject, verb, function, animate.", "Animate is the fourth number in the query row."],
    derivationTitle: "Why are there Q, K, and V rows?",
    derivation: [
      { type: "p", html: "A real attention head starts from token stream vectors <strong>X</strong>, then multiplies by learned matrices." },
      { type: "code", html: "Q = XW<sub>Q</sub>, K = XW<sub>K</sub>, V = XW<sub>V</sub>" },
      { type: "p", html: "This draft shows the projected Q/K/V rows directly so the arithmetic stays small enough to do by hand." }
    ],
    focus: { query: IDX.it, key: IDX.it, panel: "q" }
  },
  {
    id: "it-cat-dot",
    phase: "score",
    prompt: "Step 2: compute the raw dot product for cat.",
    instruction: "Use <code>q_it = [0.10, 0.00, 0.30, 1.80]</code> and <code>k_cat = [0.00, 0.00, 0.00, 1.80]</code>. What is <code>q_it dot k_cat</code>?",
    answer: dot(TOKENS[IDX.it].q, TOKENS[IDX.cat].k),
    tolerance: 0.005,
    solution: "<code>0.10*0 + 0*0 + 0.30*0 + 1.80*1.80 = 3.240</code>",
    hints: ["Only the animate channel contributes for cat.", "Compute <code>1.80 * 1.80</code>."],
    derivationTitle: "Why does this dot product mean relevance?",
    derivation: [
      { type: "p", html: "The query asks for a kind of information. The key announces what a token can offer. Multiplying matching channels rewards agreement." },
      { type: "code", html: "q &middot; k = q<sub>subject</sub>k<sub>subject</sub> + ... + q<sub>animate</sub>k<sub>animate</sub>" }
    ],
    focus: { query: IDX.it, key: IDX.cat, panel: "k" }
  },
  {
    id: "it-cat-scaled",
    phase: "score",
    prompt: "Step 3: scale the cat score.",
    instruction: "The raw <code>it -> cat</code> score is <code>3.240</code>. The key width is <code>d_k = 4</code>, so <code>sqrt(d_k) = 2</code>. What is the scaled score?",
    answer: itRow.scaledScores[IDX.cat],
    tolerance: 0.005,
    solution: "<code>3.240 / 2 = 1.620</code>",
    hints: ["The scale factor is 2.", "Divide the raw dot product by 2."],
    derivationTitle: "Why divide by sqrt(d_k)?",
    derivation: [
      { type: "p", html: "A dot product adds one product per channel. Wider query/key vectors tend to make larger sums." },
      { type: "code", html: "score(i,j) = (q<sub>i</sub> &middot; k<sub>j</sub>) / sqrt(d<sub>k</sub>)" },
      { type: "p", html: "The scaling keeps the later softmax from becoming too sharp just because the vectors are wider." }
    ],
    focus: { query: IDX.it, key: IDX.cat, panel: "score" }
  },
  {
    id: "it-sarah-scaled",
    phase: "score",
    prompt: "Step 4: compare a weaker key.",
    instruction: "Now score <strong>Sarah</strong>. Compute <code>(q_it dot k_Sarah) / 2</code>. Use <code>k_Sarah = [1.60, 0.00, 0.00, 0.15]</code>.",
    answer: itRow.scaledScores[IDX.sarah],
    tolerance: 0.005,
    solution: "<code>(0.10*1.60 + 1.80*0.15) / 2 = 0.215</code>",
    hints: ["The nonzero products are subject and animate.", "The raw dot product is <code>0.160 + 0.270 = 0.430</code>; now divide by 2."],
    focus: { query: IDX.it, key: IDX.sarah, panel: "score" }
  },
  {
    id: "it-softmax-denom",
    phase: "softmax",
    prompt: "Step 5: build the softmax denominator.",
    instruction: "The six scaled scores for <strong>it</strong> are <code>0.215, 0.000, 0.210, 1.620, 0.180, 0.165</code>. Add <code>exp(score)</code> for all six scores. What is the denominator?",
    answer: rawItDenominator,
    tolerance: 0.015,
    solution: `<code>exp(0.215)+exp(0)+exp(0.210)+exp(1.620)+exp(0.180)+exp(0.165) = ${formatNumber(rawItDenominator, 3)}</code>`,
    hints: ["The largest term is <code>exp(1.620)</code>, from cat.", "Add all six exponentials, not just the winner."],
    derivationTitle: "Why exponentiate before dividing?",
    derivation: [
      { type: "p", html: "Softmax needs positive weights that add to 1. Exponentials make the scores positive; dividing by their sum normalizes them." },
      { type: "code", html: "&alpha;<sub>j</sub> = exp(score<sub>j</sub>) / &Sigma;<sub>m</sub> exp(score<sub>m</sub>)" }
    ],
    focus: { query: IDX.it, key: IDX.cat, panel: "softmax" }
  },
  {
    id: "it-cat-weight",
    phase: "softmax",
    prompt: "Step 6: turn cat's score into a weight.",
    instruction: "Use the denominator from the previous step. What attention weight does <strong>cat</strong> get?",
    answer: itRow.weights[IDX.cat],
    tolerance: 0.006,
    solution: `<code>exp(1.620) / ${formatNumber(rawItDenominator, 3)} = ${formatNumber(itRow.weights[IDX.cat], 3)}</code>`,
    hints: ["Cat's numerator is <code>exp(1.620)</code>.", "Divide cat's numerator by the denominator you just built."],
    focus: { query: IDX.it, key: IDX.cat, panel: "weight" }
  },
  {
    id: "cat-value-contribution",
    phase: "values",
    prompt: "Step 7: compute cat's animate contribution.",
    instruction: "The value row for <strong>cat</strong> is <code>[0, 0, 0, 1]</code>. Cat's attention weight is about <code>0.463</code>. How much does cat contribute to the <strong>animate</strong> channel of the output?",
    answer: itRow.weights[IDX.cat] * TOKENS[IDX.cat].v[3],
    tolerance: 0.006,
    solution: `<code>${formatNumber(itRow.weights[IDX.cat], 3)} * 1.000 = ${formatNumber(itRow.weights[IDX.cat] * TOKENS[IDX.cat].v[3], 3)}</code>`,
    hints: ["Use weight times value.", "The animate value for cat is 1."],
    derivationTitle: "Why multiply values by weights?",
    derivation: [
      { type: "p", html: "The weights decide how loudly each value speaks in the output." },
      { type: "code", html: "output = &Sigma;<sub>j</sub> &alpha;<sub>j</sub>v<sub>j</sub>" }
    ],
    focus: { query: IDX.it, key: IDX.cat, panel: "value" }
  },
  {
    id: "sarah-subject-contribution",
    phase: "values",
    prompt: "Step 8: compute Sarah's subject contribution.",
    instruction: "Sarah's attention weight is about <code>0.114</code>, and Sarah's subject value is <code>1.000</code>. How much does Sarah contribute to the <strong>subject</strong> channel?",
    answer: itRow.weights[IDX.sarah] * TOKENS[IDX.sarah].v[0],
    tolerance: 0.006,
    solution: `<code>${formatNumber(itRow.weights[IDX.sarah], 3)} * 1.000 = ${formatNumber(itRow.weights[IDX.sarah] * TOKENS[IDX.sarah].v[0], 3)}</code>`,
    hints: ["This is the same weighted-value rule.", "Small attention weight means a small contribution."],
    focus: { query: IDX.it, key: IDX.sarah, panel: "value" }
  },
  {
    id: "output-animate",
    phase: "values",
    prompt: "Step 9: add the animate channel of the output.",
    instruction: "Three value rows have animate information: Sarah has <code>0.30</code>, cat has <code>1.00</code>, and it has <code>0.30</code>. Add their weighted contributions. What is the output's animate channel?",
    answer: itRow.output[3],
    tolerance: 0.008,
    solution: `<code>(${formatNumber(itRow.weights[IDX.sarah], 3)}*0.30) + (${formatNumber(itRow.weights[IDX.cat], 3)}*1.00) + (${formatNumber(itRow.weights[IDX.it], 3)}*0.30) = ${formatNumber(itRow.output[3], 3)}</code>`,
    hints: ["Only value rows with nonzero animate entries matter.", "Cat contributes the largest piece."],
    focus: { query: IDX.it, key: IDX.cat, panel: "output" }
  },
  {
    id: "winner-token",
    phase: "meaning",
    prompt: "Step 10: name the token that wins attention.",
    instruction: "Which token gets the largest attention weight for the query <strong>it</strong>?",
    type: "text",
    answers: ["cat", "the cat"],
    solution: "The largest attention weight goes to <strong>cat</strong>.",
    hints: ["Look for the largest softmax weight.", "The pronoun's animate query matches cat's animate key most strongly."],
    focus: { query: IDX.it, key: IDX.cat, panel: "winner" }
  }
];

const matrixSteps = [
  {
    id: "score-cell-count",
    phase: "shape",
    prompt: "Step 1: count the score cells.",
    instruction: "There are 6 query rows and 6 key columns. How many cells are in the full <code>QK^T</code> score grid?",
    answer: 36,
    tolerance: 0.001,
    solution: "<code>6 * 6 = 36</code>",
    hints: ["Rows times columns.", "Every token takes a turn as query and scores every token as key."],
    derivationTitle: "Why is QK^T a square grid?",
    derivation: [
      { type: "code", html: "Q shape = N x d<sub>k</sub>" },
      { type: "code", html: "K<sup>T</sup> shape = d<sub>k</sub> x N" },
      { type: "code", html: "QK<sup>T</sup> shape = N x N" }
    ],
    focus: { row: null, col: null, mode: "full" }
  },
  {
    id: "causal-visible-count",
    phase: "mask",
    prompt: "Step 2: count the allowed causal cells.",
    instruction: "With a causal mask, row 1 sees 1 token, row 2 sees 2, and so on through row 6. How many cells are allowed in total?",
    answer: 21,
    tolerance: 0.001,
    solution: "<code>1 + 2 + 3 + 4 + 5 + 6 = 21</code>",
    hints: ["This is the lower triangle, including the diagonal.", "Add the allowed cells row by row."],
    focus: { row: null, col: null, mode: "causal" }
  },
  {
    id: "cat-allowed-count",
    phase: "mask",
    prompt: "Step 3: count what cat can see.",
    instruction: "<strong>cat</strong> is the fourth token. Under the causal mask, how many key columns are allowed for the cat row?",
    answer: 4,
    tolerance: 0.001,
    solution: "Cat can attend to <code>Sarah</code>, <code>fed</code>, <code>the</code>, and <code>cat</code>: 4 allowed keys.",
    hints: ["A token can see itself and all earlier tokens.", "Cat is token 4."],
    focus: { row: IDX.cat, col: IDX.cat, mode: "causal" }
  },
  {
    id: "cat-masked-count",
    phase: "mask",
    prompt: "Step 4: count the blocked future keys.",
    instruction: "Still on the <strong>cat</strong> row. How many future key columns are masked?",
    answer: 2,
    tolerance: 0.001,
    solution: "<code>because</code> and <code>it</code> are future tokens, so 2 columns are masked.",
    hints: ["There are 6 tokens total and 4 allowed for cat.", "The future tokens are because and it."],
    focus: { row: IDX.cat, col: IDX.because, mode: "causal" }
  },
  {
    id: "cat-sarah-score",
    phase: "score",
    prompt: "Step 5: compute one matrix cell.",
    instruction: "For the <strong>cat</strong> query row and <strong>Sarah</strong> key column, compute <code>(q_cat dot k_Sarah) / 2</code>.",
    answer: catCausalRow.scaledScores[IDX.sarah],
    tolerance: 0.005,
    solution: "<code>(0.60*1.60 + 0.20*0.15) / 2 = 0.495</code>",
    hints: ["Use q_cat = [0.60, 0.60, 0, 0.20].", "The raw dot product is 0.990, then divide by 2."],
    focus: { row: IDX.cat, col: IDX.sarah, mode: "causal" }
  },
  {
    id: "cat-row-denom",
    phase: "softmax",
    prompt: "Step 6: build cat's masked denominator.",
    instruction: "The allowed scaled scores in the cat row are <code>0.495, 0.480, 0.000, 0.180</code>. What is the softmax denominator over just those allowed scores?",
    answer: rawCatCausalDenominator,
    tolerance: 0.015,
    solution: `<code>exp(0.495)+exp(0.480)+exp(0)+exp(0.180) = ${formatNumber(rawCatCausalDenominator, 3)}</code>`,
    hints: ["Do not include because or it; they are masked.", "Add four exponentials."],
    focus: { row: IDX.cat, col: IDX.sarah, mode: "causal" }
  },
  {
    id: "cat-sarah-weight",
    phase: "softmax",
    prompt: "Step 7: compute cat-to-Sarah attention.",
    instruction: "Using the masked denominator, what attention weight does the <strong>cat</strong> row assign to <strong>Sarah</strong>?",
    answer: catCausalRow.weights[IDX.sarah],
    tolerance: 0.006,
    solution: `<code>exp(0.495) / ${formatNumber(rawCatCausalDenominator, 3)} = ${formatNumber(catCausalRow.weights[IDX.sarah], 3)}</code>`,
    hints: ["Sarah's numerator is exp(0.495).", "Divide by the masked denominator you just built."],
    focus: { row: IDX.cat, col: IDX.sarah, mode: "causal" }
  },
  {
    id: "future-weight",
    phase: "mask",
    prompt: "Step 8: give a future token its final weight.",
    instruction: "In the masked cat row, what attention weight does the future token <strong>it</strong> receive?",
    answer: 0,
    tolerance: 0.001,
    solution: "A masked future token receives <code>0</code> attention weight.",
    hints: ["Masked future scores become negative infinity before softmax.", "exp(-infinity) is 0."],
    derivationTitle: "Why does the mask become zero weight?",
    derivation: [
      { type: "code", html: "masked score = -&infin;" },
      { type: "code", html: "exp(-&infin;) = 0" },
      { type: "code", html: "future weight = 0 / denominator = 0" }
    ],
    focus: { row: IDX.cat, col: IDX.it, mode: "causal" }
  }
];

const speedSteps = [
  {
    id: "kv-reuse-count",
    phase: "KV cache",
    prompt: "Step 1: count reusable past positions.",
    instruction: "The prefix has 6 tokens. When we append one new token, how many old token positions already have keys and values we can reuse?",
    answer: 6,
    tolerance: 0.001,
    solution: "All 6 old token positions can reuse their cached keys and values.",
    hints: ["The new token is position 7.", "Everything before it is already in the cache."],
    focus: { panel: "kv" }
  },
  {
    id: "without-cache-rows",
    phase: "KV cache",
    prompt: "Step 2: count key/value rows without cache.",
    instruction: "For a 7-token prefix, one head would remake 7 key rows and 7 value rows. How many K/V rows is that?",
    answer: 14,
    tolerance: 0.001,
    solution: "<code>7 K rows + 7 V rows = 14 rows</code>",
    hints: ["Count both K and V.", "This is per head."],
    focus: { panel: "kv" }
  },
  {
    id: "with-cache-rows",
    phase: "KV cache",
    prompt: "Step 3: count new key/value rows with cache.",
    instruction: "With the KV cache on, the old 6 positions are reused. For the new token, how many new K/V rows does one head need to make?",
    answer: 2,
    tolerance: 0.001,
    solution: "<code>1 new K row + 1 new V row = 2 rows</code>",
    hints: ["Only the new token needs fresh K and V.", "One key row plus one value row."],
    derivationTitle: "What does the cache save?",
    derivation: [
      { type: "p", html: "The new query still scores against the cached keys. The cache saves recomputing old key and value projections." },
      { type: "code", html: "past K,V rows: reuse" },
      { type: "code", html: "new token K,V rows: compute once" }
    ],
    focus: { panel: "kv" }
  },
  {
    id: "mha-kv-rows",
    phase: "GQA",
    prompt: "Step 4: count classic multi-head K/V rows.",
    instruction: "Classic multi-head attention has 4 query heads, and each head owns its own K and V set. With 6 tokens, how many stored K/V rows is that?",
    answer: 48,
    tolerance: 0.001,
    solution: "<code>4 heads * 6 tokens * 2 rows (K and V) = 48</code>",
    hints: ["Every head owns both K and V.", "Multiply heads, tokens, and 2."],
    focus: { panel: "gqa", groups: 4 }
  },
  {
    id: "gqa-kv-rows",
    phase: "GQA",
    prompt: "Step 5: count grouped-query K/V rows.",
    instruction: "Grouped-query attention keeps 4 query heads but shares K/V across 2 groups. With 6 tokens, how many stored K/V rows is that?",
    answer: 24,
    tolerance: 0.001,
    solution: "<code>2 KV groups * 6 tokens * 2 rows = 24</code>",
    hints: ["Queries stay at 4 heads; K/V sets shrink to 2 groups.", "Multiply groups, tokens, and 2."],
    focus: { panel: "gqa", groups: 2 }
  },
  {
    id: "mqa-kv-rows",
    phase: "GQA",
    prompt: "Step 6: count multi-query K/V rows.",
    instruction: "Multi-query attention shares one K/V set across all 4 query heads. With 6 tokens, how many stored K/V rows is that?",
    answer: 12,
    tolerance: 0.001,
    solution: "<code>1 KV group * 6 tokens * 2 rows = 12</code>",
    hints: ["All query heads share one K/V set.", "One group, six tokens, two row types."],
    focus: { panel: "gqa", groups: 1 }
  },
  {
    id: "flash-full-cells",
    phase: "FlashAttention",
    prompt: "Step 7: count the full score table.",
    instruction: "If normal attention materializes every score for 6 query tokens and 6 key tokens, how many score cells are in that table?",
    answer: 36,
    tolerance: 0.001,
    solution: "<code>6 * 6 = 36</code>",
    hints: ["This is the same square grid from the matrix lab.", "Rows times columns."],
    focus: { panel: "flash", tile: 0 }
  },
  {
    id: "flash-tile-one-max",
    phase: "FlashAttention",
    prompt: "Step 8: find the first tile max.",
    instruction: "For the <strong>it</strong> row, suppose tile 1 contains scores <code>0.215, 0.000, 0.210</code>. What is the max score in tile 1?",
    answer: tileOneMax,
    tolerance: 0.005,
    solution: `<code>max(0.215, 0.000, 0.210) = ${formatNumber(tileOneMax, 3)}</code>`,
    hints: ["Pick the largest of the three numbers.", "Sarah's score is slightly larger than the score for the."],
    focus: { panel: "flash", tile: 1 }
  },
  {
    id: "flash-global-max",
    phase: "FlashAttention",
    prompt: "Step 9: update the running max.",
    instruction: "Tile 2 contains scores <code>1.620, 0.180, 0.165</code>. After seeing both tiles, what is the running max?",
    answer: flashGlobalMax,
    tolerance: 0.005,
    solution: `<code>max(${formatNumber(tileOneMax, 3)}, 1.620, 0.180, 0.165) = ${formatNumber(flashGlobalMax, 3)}</code>`,
    hints: ["The cat score appears in tile 2.", "The running max is the largest score seen so far."],
    focus: { panel: "flash", tile: 2 }
  },
  {
    id: "flash-denom",
    phase: "FlashAttention",
    prompt: "Step 10: compute the tiled softmax denominator.",
    instruction: "After rescaling tile 1 to the global max, the stable denominator is about <code>tile1_sum * exp(0.215 - 1.620) + exp(0) + exp(0.180 - 1.620) + exp(0.165 - 1.620)</code>. What is it?",
    answer: flashStableDenom,
    tolerance: 0.01,
    solution: `<code>${formatNumber(tileOneStableDenom, 3)} * exp(0.215 - 1.620) + 1 + exp(-1.440) + exp(-1.455) = ${formatNumber(flashStableDenom, 3)}</code>`,
    hints: ["This denominator is in the stable softmax scale, where the global max has exponent 0.", "The raw denominator and stable denominator differ by a common factor, but they produce the same weights."],
    derivationTitle: "Why rescale the old tile?",
    derivation: [
      { type: "p", html: "Stable softmax subtracts the current max before exponentiating. If a later tile has a bigger max, the old exponentials were measured on the wrong scale." },
      { type: "code", html: "old contribution *= exp(old_max - new_max)" },
      { type: "p", html: "That lets FlashAttention stream through tiles without materializing the full score table." }
    ],
    focus: { panel: "flash", tile: 2 }
  },
  {
    id: "flash-cat-weight",
    phase: "FlashAttention",
    prompt: "Step 11: recover cat's exact attention weight.",
    instruction: "In the stable scale, cat is the global max, so its numerator is <code>exp(0) = 1</code>. Divide by the stable denominator you just built. What weight does cat get?",
    answer: 1 / flashStableDenom,
    tolerance: 0.006,
    solution: `<code>1 / ${formatNumber(flashStableDenom, 3)} = ${formatNumber(1 / flashStableDenom, 3)}</code>`,
    hints: ["The global-max score has numerator 1 in stable softmax.", "This should match the ordinary softmax weight from Lab 1."],
    focus: { panel: "flash", tile: 2 }
  }
];

const labConfigs = {
  head: {
    steps: headSteps,
    state: { index: 0, hints: {}, solved: {}, revealed: {}, answers: {}, feedback: {} },
    renderSvg: renderHeadSvg,
    renderFacts: renderHeadFacts
  },
  matrix: {
    steps: matrixSteps,
    state: { index: 0, hints: {}, solved: {}, revealed: {}, answers: {}, feedback: {} },
    renderSvg: renderMatrixSvg,
    renderFacts: renderMatrixFacts
  },
  speed: {
    steps: speedSteps,
    state: { index: 0, hints: {}, solved: {}, revealed: {}, answers: {}, feedback: {} },
    renderSvg: renderSpeedSvg,
    renderFacts: renderSpeedFacts
  }
};

const dom = {};
["head", "matrix", "speed"].forEach((key) => {
  const cap = key[0].toUpperCase() + key.slice(1);
  dom[key] = {
    root: document.getElementById(`${key}Lab`),
    progress: document.getElementById(`${key}Progress`),
    svg: document.getElementById(`${key}Svg`),
    facts: document.getElementById(`${key}Facts`),
    phase: document.getElementById(`${key}Phase`),
    prompt: document.getElementById(`${key}Prompt`),
    instruction: document.getElementById(`${key}Instruction`),
    derivation: document.getElementById(`${key}Derivation`),
    answer: document.getElementById(`${key}Answer`),
    feedback: document.getElementById(`${key}Feedback`),
    hint: document.getElementById(`${key}Hint`),
    check: document.getElementById(`${key}Check`),
    hintButton: document.getElementById(`${key}HintButton`),
    solution: document.getElementById(`${key}Solution`),
    prev: document.getElementById(`${key}Prev`),
    next: document.getElementById(`${key}Next`),
    reset: document.getElementById(`${key}Reset`)
  };
  dom[key].cap = cap;
});

function stepDone(config, step) {
  return Boolean(config.state.solved[step.id] || config.state.revealed[step.id]);
}

function setFeedback(config, step, text, className = "") {
  config.state.feedback[step.id] = { text, className };
}

function checkAnswer(key) {
  const config = labConfigs[key];
  const step = config.steps[config.state.index];
  const raw = dom[key].answer.value;
  config.state.answers[step.id] = raw;

  if (step.type === "text") {
    const normalized = normalizeTextAnswer(raw);
    const accepted = (step.answers || []).map(normalizeTextAnswer);
    if (accepted.includes(normalized)) {
      config.state.solved[step.id] = true;
      setFeedback(config, step, `Correct: ${step.solution}`, "is-correct");
    } else {
      setFeedback(config, step, "Not quite. Try the hint and answer with the token name.", "is-wrong");
    }
    renderLab(key);
    return;
  }

  const value = parseNumericAnswer(raw);
  if (value === null) {
    setFeedback(config, step, "I need a number here. You can type a rounded answer like 0.463, or a simple expression like exp(1.62) / 10.905.", "is-wrong");
    renderLab(key);
    return;
  }

  const diff = Math.abs(value - step.answer);
  if (diff <= step.tolerance) {
    config.state.solved[step.id] = true;
    const entered = formatAnswerValue(value, 3);
    const expected = formatAnswerValue(step.answer, 3);
    const verdict = entered === expected
      ? `Correct: ${entered} matches.`
      : `Correct with rounding: ${entered} is accepted; the target is ${expected}.`;
    setFeedback(config, step, `${verdict} ${step.solution}`, "is-correct");
  } else if (diff <= step.tolerance * 5) {
    setFeedback(config, step, "Very close. Check the rounding or carry one more decimal place.", "is-wrong");
  } else {
    setFeedback(config, step, "Not quite yet. Use the next hint and keep the arithmetic small.", "is-wrong");
  }
  renderLab(key);
}

function showHint(key) {
  const config = labConfigs[key];
  const step = config.steps[config.state.index];
  const current = config.state.hints[step.id] || 0;
  config.state.hints[step.id] = Math.min(step.hints.length, current + 1);
  setFeedback(config, step, "Good - use the hint, then check your answer again.", "");
  renderLab(key);
}

function revealSolution(key) {
  const config = labConfigs[key];
  const step = config.steps[config.state.index];
  config.state.revealed[step.id] = true;
  config.state.answers[step.id] = step.type === "text" ? step.answers[0] : formatAnswerValue(step.answer, 3);
  setFeedback(config, step, `Solution revealed. ${step.solution}`, "is-solution");
  renderLab(key);
}

function moveStep(key, delta) {
  const config = labConfigs[key];
  const step = config.steps[config.state.index];
  if (delta > 0 && !stepDone(config, step)) return;
  config.state.index = clamp(config.state.index + delta, 0, config.steps.length - 1);
  renderLab(key);
  dom[key].answer.focus();
}

function resetLab(key) {
  labConfigs[key].state = { index: 0, hints: {}, solved: {}, revealed: {}, answers: {}, feedback: {} };
  renderLab(key);
}

function renderDerivation(key, step) {
  const wrap = dom[key].derivation;
  if (!step.derivation?.length) {
    wrap.hidden = true;
    wrap.replaceChildren();
    return;
  }
  const details = createElement("details", "lab-derivation");
  const summary = createElement("summary");
  setHtml(summary, step.derivationTitle || "Why this formula?");
  const body = createElement("div", "lab-derivation-body");
  step.derivation.forEach((item) => {
    const node = createElement(item.type === "code" ? "code" : "p");
    setHtml(node, item.html);
    body.append(node);
  });
  details.append(summary, body);
  wrap.hidden = false;
  wrap.replaceChildren(details);
}

function renderLab(key) {
  const config = labConfigs[key];
  const elements = dom[key];
  if (!elements.root) return;
  const step = config.steps[config.state.index];
  const feedback = config.state.feedback[step.id];
  const hintCount = config.state.hints[step.id] || 0;
  const done = stepDone(config, step);

  elements.progress.textContent = `step ${config.state.index + 1} of ${config.steps.length}`;
  elements.phase.textContent = step.phase;
  elements.prompt.textContent = step.prompt;
  setHtml(elements.instruction, step.instruction);
  renderDerivation(key, step);
  elements.answer.value = config.state.answers[step.id] || "";
  elements.answer.placeholder = step.type === "text" ? "Enter the token" : "Enter your value";
  elements.feedback.className = `lab-feedback ${feedback?.className || ""}`.trim();
  setHtml(elements.feedback, feedback?.text || "Enter your answer, then press Check or Enter. Rounding to three decimals is fine.");
  elements.hint.hidden = hintCount === 0;
  setHtml(elements.hint, hintCount > 0 ? step.hints.slice(0, hintCount).join(" ") : "");
  elements.hintButton.disabled = hintCount >= step.hints.length;
  elements.prev.disabled = config.state.index === 0;
  elements.next.disabled = !done || config.state.index === config.steps.length - 1;
  elements.next.textContent = config.state.index === config.steps.length - 1 ? "Finished" : "Next";
  config.renderFacts(key, step);
  config.renderSvg(key, step);
}

function renderFacts(containerKey, step) {
  const facts = Array.isArray(step) ? step : [];
  const wrap = dom[containerKey].facts;
  wrap.replaceChildren(...facts.map((fact) => {
    const item = createElement("div", "lab-fact");
    item.append(createElement("strong", "", fact.value), createElement("span", "", fact.label));
    return item;
  }));
}

function renderHeadFacts(key, step) {
  renderFacts(key, [
    { label: "query", value: "it" },
    { label: "scale", value: "sqrt(4)=2" },
    { label: "cat weight", value: `${formatNumber(itRow.weights[IDX.cat] * 100, 1)}%` },
    { label: "output", value: vectorText(itRow.output, 2) }
  ]);
}

function renderMatrixFacts(key, step) {
  renderFacts(key, [
    { label: "tokens", value: "6" },
    { label: "full cells", value: "36" },
    { label: "causal cells", value: "21" },
    { label: "cat allowed", value: "4" }
  ]);
}

function renderSpeedFacts(key, step) {
  renderFacts(key, [
    { label: "prefix", value: "6 tokens" },
    { label: "heads", value: "4 query heads" },
    { label: "GQA groups", value: "2 KV sets" },
    { label: "flash math", value: "same result" }
  ]);
}

function drawTokenRow(svg, y, queryIndex, focusIndex) {
  TOKENS.forEach((token, index) => {
    const x = 42 + index * 120;
    const classes = [
      "token-pill",
      index === queryIndex ? "is-query" : "",
      index === focusIndex ? "is-focus" : ""
    ].filter(Boolean).join(" ");
    svg.append(createSvgElement("rect", { class: classes, x, y, width: 88, height: 34, rx: 10 }));
    svg.append(createSvgElement("text", { class: "svg-label", x: x + 44, y: y + 22, "text-anchor": "middle" }, token.word));
  });
}

function drawVectorBox(svg, x, y, title, vector, active = false) {
  svg.append(createSvgElement("rect", {
    class: `matrix-cell${active ? " is-active" : ""}`,
    x,
    y,
    width: 242,
    height: 52,
    rx: 8
  }));
  svg.append(createSvgElement("text", { class: "svg-label", x: x + 12, y: y + 20 }, title));
  svg.append(createSvgElement("text", { class: "svg-mono", x: x + 12, y: y + 40 }, vectorText(vector)));
}

function renderHeadSvg(key, step) {
  const svg = dom[key].svg;
  svg.replaceChildren();
  const focus = step.focus || {};
  svg.append(createSvgElement("text", { class: "svg-title", x: 24, y: 28 }, "One attention row for query token \"it\""));
  drawTokenRow(svg, 46, IDX.it, focus.key);
  drawVectorBox(svg, 34, 108, "q_it (question)", TOKENS[IDX.it].q, focus.panel === "q");
  drawVectorBox(svg, 296, 108, `k_${TOKENS[focus.key ?? IDX.cat].word} (label)`, TOKENS[focus.key ?? IDX.cat].k, focus.panel === "k" || focus.panel === "score");
  drawVectorBox(svg, 558, 108, `v_${TOKENS[focus.key ?? IDX.cat].word} (info)`, TOKENS[focus.key ?? IDX.cat].v, focus.panel === "value");

  svg.append(createSvgElement("line", { class: `attention-edge${focus.panel === "score" ? " is-active" : ""}`, x1: 276, y1: 134, x2: 296, y2: 134 }));
  svg.append(createSvgElement("line", { class: `attention-edge${focus.panel === "value" ? " is-active" : ""}`, x1: 538, y1: 134, x2: 558, y2: 134 }));

  svg.append(createSvgElement("text", { class: "svg-title", x: 34, y: 204 }, "Scaled scores and weights"));
  TOKENS.forEach((token, index) => {
    const y = 224 + index * 30;
    const isFocus = index === (focus.key ?? IDX.cat);
    svg.append(createSvgElement("text", { class: "svg-label", x: 36, y: y + 16 }, token.word));
    svg.append(createSvgElement("text", { class: "svg-mono", x: 128, y: y + 16 }, `score ${scoreText(itRow.scaledScores[index])}`));
    const trackX = 245;
    svg.append(createSvgElement("rect", { class: "mini-bar-track", x: trackX, y: y + 5, width: 250, height: 12, rx: 6 }));
    svg.append(createSvgElement("rect", {
      class: `mini-bar-fill${isFocus ? " is-strong" : ""}`,
      x: trackX,
      y: y + 5,
      width: Math.max(2, itRow.weights[index] * 250),
      height: 12,
      rx: 6
    }));
    svg.append(createSvgElement("text", { class: "svg-mono", x: 520, y: y + 16 }, `${formatNumber(itRow.weights[index] * 100, 1)}%`));
  });

  svg.append(createSvgElement("rect", {
    class: `matrix-cell${focus.panel === "output" || focus.panel === "winner" ? " is-active" : ""}`,
    x: 600,
    y: 224,
    width: 138,
    height: 120,
    rx: 8
  }));
  svg.append(createSvgElement("text", { class: "svg-label", x: 615, y: 250 }, "output_it"));
  CHANNELS.forEach((channel, index) => {
    svg.append(createSvgElement("text", { class: "svg-small", x: 615, y: 274 + index * 18 }, `${channel}:`));
    svg.append(createSvgElement("text", { class: "svg-mono", x: 678, y: 274 + index * 18 }, formatNumber(itRow.output[index], 2)));
  });
}

function renderMatrixSvg(key, step) {
  const svg = dom[key].svg;
  svg.replaceChildren();
  const focus = step.focus || {};
  const cell = 54;
  const startX = 135;
  const startY = 88;
  svg.append(createSvgElement("text", { class: "svg-title", x: 24, y: 28 }, "Attention score grid: query rows by key columns"));
  TOKENS.forEach((token, index) => {
    svg.append(createSvgElement("text", { class: "svg-small", x: startX + index * cell + cell / 2, y: 68, "text-anchor": "middle" }, token.word));
    svg.append(createSvgElement("text", { class: "svg-small", x: 112, y: startY + index * cell + 31, "text-anchor": "end" }, token.word));
  });
  TOKENS.forEach((rowToken, row) => {
    TOKENS.forEach((colToken, col) => {
      const masked = focus.mode === "causal" && col > row;
      const active = row === focus.row && col === focus.col;
      const classes = [
        "matrix-cell",
        masked ? "is-masked" : "",
        active ? "is-active" : "",
        row === IDX.it && col === IDX.cat && !active ? "is-strong" : ""
      ].filter(Boolean).join(" ");
      const x = startX + col * cell;
      const y = startY + row * cell;
      svg.append(createSvgElement("rect", { class: classes, x, y, width: cell - 4, height: cell - 4, rx: 7 }));
      let label = "";
      if (masked) {
        label = "0";
      } else {
        const rowData = attentionRow(row, focus.mode === "causal");
        label = `${formatNumber(rowData.weights[col] * 100, 0)}%`;
      }
      svg.append(createSvgElement("text", { class: "svg-mono", x: x + (cell - 4) / 2, y: y + 29, "text-anchor": "middle" }, label));
    });
  });
  svg.append(createSvgElement("text", { class: "svg-small", x: 24, y: 398 }, "Each row is separately softmaxed. With the causal mask, future columns become zero weight."));
}

function renderSpeedSvg(key, step) {
  const svg = dom[key].svg;
  svg.replaceChildren();
  const focus = step.focus || {};
  svg.append(createSvgElement("text", { class: "svg-title", x: 24, y: 28 }, "Efficiency keeps attention exact, but saves work or memory"));

  const panelActive = (name) => focus.panel === name;
  drawKvPanel(svg, 30, 58, panelActive("kv"));
  drawGqaPanel(svg, 292, 58, panelActive("gqa"), focus.groups);
  drawFlashPanel(svg, 554, 58, panelActive("flash"), focus.tile);
}

function drawKvPanel(svg, x, y, active) {
  svg.append(createSvgElement("rect", { class: `tile-box${active ? " is-active" : ""}`, x, y, width: 206, height: 310, rx: 10 }));
  svg.append(createSvgElement("text", { class: "svg-label", x: x + 16, y: y + 28 }, "KV cache"));
  for (let i = 0; i < 6; i += 1) {
    svg.append(createSvgElement("rect", { class: "matrix-cell is-strong", x: x + 18, y: y + 52 + i * 28, width: 76, height: 20, rx: 5 }));
    svg.append(createSvgElement("rect", { class: "matrix-cell is-strong", x: x + 108, y: y + 52 + i * 28, width: 76, height: 20, rx: 5 }));
  }
  svg.append(createSvgElement("text", { class: "svg-small", x: x + 18, y: y + 240 }, "6 old K rows + 6 old V rows reused"));
  svg.append(createSvgElement("rect", { class: "matrix-cell is-active", x: x + 18, y: y + 256, width: 76, height: 24, rx: 5 }));
  svg.append(createSvgElement("rect", { class: "matrix-cell is-active", x: x + 108, y: y + 256, width: 76, height: 24, rx: 5 }));
  svg.append(createSvgElement("text", { class: "svg-small", x: x + 18, y: y + 300 }, "new token: make 1 K and 1 V"));
}

function drawGqaPanel(svg, x, y, active, groups = 4) {
  svg.append(createSvgElement("rect", { class: `tile-box${active ? " is-active" : ""}`, x, y, width: 206, height: 310, rx: 10 }));
  svg.append(createSvgElement("text", { class: "svg-label", x: x + 16, y: y + 28 }, "MHA -> GQA -> MQA"));
  for (let i = 0; i < 4; i += 1) {
    svg.append(createSvgElement("rect", { class: "matrix-cell is-active", x: x + 24 + i * 38, y: y + 58, width: 28, height: 28, rx: 5 }));
    svg.append(createSvgElement("text", { class: "svg-small", x: x + 38 + i * 38, y: y + 76, "text-anchor": "middle" }, "Q"));
  }
  const visibleGroups = groups || 4;
  for (let i = 0; i < visibleGroups; i += 1) {
    const gx = x + 22 + i * (152 / Math.max(visibleGroups, 1));
    svg.append(createSvgElement("rect", { class: "matrix-cell is-strong", x: gx, y: y + 122, width: 34, height: 28, rx: 5 }));
    svg.append(createSvgElement("text", { class: "svg-small", x: gx + 17, y: y + 140, "text-anchor": "middle" }, "KV"));
  }
  svg.append(createSvgElement("text", { class: "svg-small", x: x + 18, y: y + 196 }, "4 query heads stay."));
  svg.append(createSvgElement("text", { class: "svg-small", x: x + 18, y: y + 216 }, `${visibleGroups} shared KV set${visibleGroups === 1 ? "" : "s"}.`));
  svg.append(createSvgElement("text", { class: "svg-small", x: x + 18, y: y + 238 }, "Stored rows = KV sets * tokens * 2."));
}

function drawFlashPanel(svg, x, y, active, tile = 0) {
  svg.append(createSvgElement("rect", { class: `tile-box${active ? " is-active" : ""}`, x, y, width: 206, height: 310, rx: 10 }));
  svg.append(createSvgElement("text", { class: "svg-label", x: x + 16, y: y + 28 }, "FlashAttention"));
  const tileLabels = [
    ["0.215", "0.000", "0.210"],
    ["1.620", "0.180", "0.165"]
  ];
  tileLabels.forEach((labels, tileIndex) => {
    const ty = y + 58 + tileIndex * 92;
    svg.append(createSvgElement("rect", {
      class: `tile-box${tile === tileIndex + 1 ? " is-strong" : ""}`,
      x: x + 18,
      y: ty,
      width: 170,
      height: 64,
      rx: 8
    }));
    svg.append(createSvgElement("text", { class: "svg-small", x: x + 30, y: ty + 18 }, `tile ${tileIndex + 1}`));
    labels.forEach((label, index) => {
      svg.append(createSvgElement("text", { class: "svg-mono", x: x + 34 + index * 50, y: ty + 44 }, label));
    });
  });
  svg.append(createSvgElement("text", { class: "svg-small", x: x + 18, y: y + 244 }, "Keep running max, denominator, output."));
  svg.append(createSvgElement("text", { class: "svg-small", x: x + 18, y: y + 266 }, "Do not store the full score table."));
}

function wireLabs() {
  Object.keys(labConfigs).forEach((key) => {
    const elements = dom[key];
    if (!elements.root) return;
    elements.check.addEventListener("click", () => checkAnswer(key));
    elements.hintButton.addEventListener("click", () => showHint(key));
    elements.solution.addEventListener("click", () => revealSolution(key));
    elements.prev.addEventListener("click", () => moveStep(key, -1));
    elements.next.addEventListener("click", () => moveStep(key, 1));
    elements.reset.addEventListener("click", () => resetLab(key));
    elements.answer.addEventListener("keydown", (event) => {
      if (event.key === "Enter") checkAnswer(key);
    });
    renderLab(key);
  });
}

function setupSectionSpy() {
  const links = Array.from(document.querySelectorAll(".lesson-toc a[href^='#']"));
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (!sections.length) return;
  const activate = (id) => {
    links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`));
  };
  const update = () => {
    const active = sections.reduce((current, section) => (
      section.getBoundingClientRect().top <= 260 ? section : current
    ), sections[0]);
    activate(active.id);
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

wireLabs();
setupSectionSpy();
