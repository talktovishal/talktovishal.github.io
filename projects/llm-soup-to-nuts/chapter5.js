// Chapter 5: Transformers and attention.
// All the small demos are self-built and fully offline. A tiny set of hand-designed
// token vectors makes the query/key/value mechanism, the attention heatmap, and the
// multi-head idea visible and deterministic. Other demos (generation loop, decoding,
// KV cache) are pure illustration. The final section loads a REAL small GPT model with
// transformers.js so learners can see genuine next-token probabilities.

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function dot(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i += 1) total += a[i] * b[i];
  return total;
}

function softmax(values) {
  const max = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - max));
  const sum = exps.reduce((s, e) => s + e, 0) || 1;
  return exps.map((e) => e / sum);
}

function emptyState(text) {
  const el = document.createElement("div");
  el.className = "empty-state";
  el.textContent = text;
  return el;
}

// ---------------------------------------------------------------------------
// The tiny self-built attention world: "Sarah fed the cat because it"
// Each token gets a hand-designed query, key, and value vector across four
// interpretable channels: [ subject, verb, function-word, animate ].
// In a real Transformer these come from learned projections W_Q, W_K, W_V of the
// token embedding. Here they are set by hand so the mechanism is easy to see, and
// tuned so the pronoun "it" attends most strongly to "cat".
// ---------------------------------------------------------------------------

const DIM = 4;
const CHANNELS = ["subject", "verb", "function", "animate"];
const TOKENS = [
  { word: "Sarah",   q: [0.0, 1.4, 0.0, 0.2], k: [1.6, 0.0, 0.0, 0.15], v: [1.0, 0.0, 0.0, 0.3] },
  { word: "fed",     q: [0.3, 0.0, 0.2, 1.4], k: [0.0, 1.6, 0.0, 0.0],  v: [0.0, 1.0, 0.0, 0.0] },
  { word: "the",     q: [0.0, 0.0, 0.0, 1.4], k: [0.0, 0.0, 1.4, 0.0],  v: [0.0, 0.0, 1.0, 0.0] },
  { word: "cat",     q: [0.6, 0.6, 0.0, 0.2], k: [0.0, 0.0, 0.0, 1.8],  v: [0.0, 0.0, 0.0, 1.0] },
  { word: "because", q: [0.0, 0.8, 0.4, 0.0], k: [0.0, 0.0, 1.2, 0.0],  v: [0.0, 0.0, 0.8, 0.0] },
  { word: "it",      q: [0.1, 0.0, 0.3, 1.8], k: [0.0, 0.0, 0.5, 0.1],  v: [0.0, 0.0, 0.3, 0.3] }
];

const SCALE = Math.sqrt(DIM);

// Attention weights for one query token over all key tokens.
function attentionRow(queryIndex, causal) {
  const q = TOKENS[queryIndex].q;
  const rawScores = TOKENS.map((tok, j) => {
    if (causal && j > queryIndex) return null;
    return dot(q, tok.k) / SCALE;
  });
  const visibleIdx = rawScores.map((s, j) => (s === null ? null : j)).filter((j) => j !== null);
  const visibleScores = visibleIdx.map((j) => rawScores[j]);
  const visibleWeights = softmax(visibleScores);
  const weights = rawScores.map(() => 0);
  visibleIdx.forEach((j, pos) => { weights[j] = visibleWeights[pos]; });
  const output = Array(DIM).fill(0);
  visibleIdx.forEach((j) => {
    for (let d = 0; d < DIM; d += 1) output[d] += weights[j] * TOKENS[j].v[d];
  });
  return { rawScores, weights, output, visibleIdx };
}

// ---------------------------------------------------------------------------
// State + DOM
// ---------------------------------------------------------------------------

const state = {
  // Generation loop
  genStep: 0,
  // Decoding
  hasDecoded: false,
  decodeTally: {},
  decodeRolls: 0,
  // QKV attention
  queryIndex: 5, // default: "it"
  causal: false,
  hasExploredQkv: false,
  // Attention stepper
  qkvStep: 0,
  qkvPlayTimer: null,
  // Self-attention theatre
  satStep: 0,
  satCausal: false,
  satPlayTimer: null,
  satAnims: [],
  // Attention heatmap
  hasViewedHeatmap: false,
  // Multi-head attention
  mhQueryIndex: 5,
  hasViewedMultihead: false,
  // Real model
  model: null,
  modelLoading: false
};

const dom = {};
const satNodes = {};
function grab(id) { return document.getElementById(id); }

// ---------------------------------------------------------------------------
// The autoregressive generation loop
// ---------------------------------------------------------------------------

const GEN_PREFIX = "Write an email apologizing to Sarah for the gardening mishap.";
const GEN_TOKENS = ["Dear", " Sarah", ",", " I", " hope", " this", " message", " finds", " you", " well", "."];

function renderGenLoop() {
  const out = dom.genOutput;
  if (!out) return;
  out.replaceChildren();
  if (state.genStep === 0) {
    dom.genStatus.textContent = "waiting";
    out.append(emptyState("Press \u201cGenerate next token\u201d to write the email one token at a time."));
    return;
  }
  const prefix = document.createElement("p");
  prefix.className = "genloop-prefix";
  prefix.textContent = GEN_PREFIX;
  out.append(prefix);

  const stream = document.createElement("p");
  stream.className = "genloop-stream";
  for (let i = 0; i < state.genStep; i += 1) {
    const chip = document.createElement("span");
    chip.className = "genloop-token";
    if (i === state.genStep - 1) chip.classList.add("is-new");
    chip.textContent = GEN_TOKENS[i];
    stream.append(chip);
  }
  out.append(stream);

  const meta = document.createElement("p");
  meta.className = "genloop-meta microcopy";
  const last = GEN_TOKENS[state.genStep - 1].trim() || "(space)";
  if (state.genStep >= GEN_TOKENS.length) {
    meta.textContent = `Forward pass #${state.genStep} emitted "${last}". That was the last token \u2014 the email is done after ${state.genStep} passes.`;
    dom.genStatus.textContent = "done";
  } else {
    meta.textContent = `Forward pass #${state.genStep} emitted "${last}". It is appended, and pass #${state.genStep + 1} will read the longer prompt to choose the next token.`;
    dom.genStatus.textContent = `pass ${state.genStep}`;
  }
  out.append(meta);
}

// ---------------------------------------------------------------------------
// Decoding playground
// ---------------------------------------------------------------------------

const DECODE_BASE = [
  { t: "Dear", p: 0.40 },
  { t: "Title", p: 0.13 },
  { t: "To", p: 0.08 },
  { t: "Hello", p: 0.07 },
  { t: "Hi", p: 0.05 },
  { t: "Greetings", p: 0.04 },
  { t: "I", p: 0.03 },
  { t: "My", p: 0.02 },
  { t: "(something else)", p: 0.18 }
];

function temperedDistribution(temp) {
  const adj = DECODE_BASE.map((d) => Math.pow(d.p, 1 / temp));
  const sum = adj.reduce((a, b) => a + b, 0) || 1;
  return DECODE_BASE.map((d, i) => ({ t: d.t, p: adj[i] / sum }));
}

function renormalize(dist) {
  const sum = dist.reduce((total, d) => total + d.p, 0) || 1;
  return dist.map((d) => ({ ...d, p: d.p / sum }));
}

function decodingDistribution() {
  const mode = dom.decodeMode.value;
  const temp = Number(dom.decodeTemp.value);
  const topK = Number(dom.topKSlider.value);
  const topP = Number(dom.topPSlider.value);
  const sorted = temperedDistribution(temp).slice().sort((a, b) => b.p - a.p);

  if (mode === "greedy") {
    return { full: sorted, kept: [{ ...sorted[0], p: 1 }], label: "top 1 token" };
  }

  if (mode === "topk") {
    const keptRaw = sorted.slice(0, topK);
    return { full: sorted, kept: renormalize(keptRaw), label: `top ${topK} tokens` };
  }

  if (mode === "topp") {
    const keptRaw = [];
    let mass = 0;
    for (const item of sorted) {
      keptRaw.push(item);
      mass += item.p;
      if (mass >= topP) break;
    }
    return { full: sorted, kept: renormalize(keptRaw), label: `mass >= ${topP.toFixed(2)}` };
  }

  return { full: sorted, kept: sorted, label: "all tokens" };
}

function strategyName() {
  const mode = dom.decodeMode.value;
  if (mode === "topk") return "top-k";
  if (mode === "topp") return "top-p";
  if (mode === "temperature") return "temperature sampling";
  return "greedy";
}

function renderDecodeBars() {
  const temp = Number(dom.decodeTemp.value);
  dom.decodeTempLabel.textContent = temp.toFixed(1);
  dom.topKLabel.textContent = String(dom.topKSlider.value);
  dom.topPLabel.textContent = Number(dom.topPSlider.value).toFixed(2);
  const { full, kept, label } = decodingDistribution();
  dom.decodeDistPill.textContent = `temperature ${temp.toFixed(1)}`;
  dom.candidatePill.textContent = label;
  const bars = dom.decodeBars;
  const candidateSet = dom.candidateSet;
  bars.replaceChildren();
  candidateSet.replaceChildren();
  if (!state.hasDecoded) {
    bars.append(emptyState("Choose a decoding strategy or press \u201cPick a token\u201d to reveal the distribution."));
    candidateSet.append(emptyState("The kept tokens will appear here after the first decoding action."));
    return;
  }
  const keptNames = new Set(kept.map((d) => d.t));
  full.forEach((d) => {
    const row = document.createElement("div");
    row.className = "attn-bar-row";
    if (!keptNames.has(d.t)) row.classList.add("is-muted");
    const label = document.createElement("span");
    label.className = "attn-token";
    label.textContent = d.t;
    const track = document.createElement("span");
    track.className = "attn-track";
    const fill = document.createElement("span");
    fill.className = "attn-fill";
    fill.style.width = `${clamp(d.p * 100, 0, 100)}%`;
    track.append(fill);
    const value = document.createElement("strong");
    value.className = "attn-value";
    value.textContent = `${(d.p * 100).toFixed(0)}%`;
    row.append(label, track, value);
    bars.append(row);
  });

  kept.forEach((d, index) => {
    const chip = document.createElement("div");
    chip.className = "candidate-chip";
    const name = document.createElement("strong");
    name.textContent = d.t;
    const detail = document.createElement("span");
    detail.textContent = dom.decodeMode.value === "greedy"
      ? "chosen every time"
      : `${(d.p * 100).toFixed(0)}% after renormalizing`;
    chip.append(name, detail);
    if (index === 0) chip.classList.add("is-top");
    candidateSet.append(chip);
  });
}

function pickToken() {
  state.hasDecoded = true;
  const { kept } = decodingDistribution();
  let chosen;
  if (dom.decodeMode.value === "greedy") {
    chosen = kept[0].t;
  } else {
    const r = Math.random();
    let acc = 0;
    chosen = kept[kept.length - 1].t;
    for (const d of kept) { acc += d.p; if (r <= acc) { chosen = d.t; break; } }
  }
  state.decodeTally[chosen] = (state.decodeTally[chosen] || 0) + 1;
  state.decodeRolls += 1;
  renderDecodeBars();
  renderDecodeTally();
}

function renderDecodeTally() {
  const el = dom.decodeTally;
  el.replaceChildren();
  if (state.decodeRolls === 0) {
    el.append(emptyState("Your picks will tally up here. Try greedy, then switch to sampling."));
    return;
  }
  const entries = Object.entries(state.decodeTally).sort((a, b) => b[1] - a[1]);
  const head = document.createElement("p");
  head.className = "microcopy";
  head.textContent = `${state.decodeRolls} pick${state.decodeRolls === 1 ? "" : "s"} so far (${strategyName()}):`;
  el.append(head);
  entries.forEach(([token, count]) => {
    const row = document.createElement("div");
    row.className = "tally-row";
    const name = document.createElement("span");
    name.className = "tally-token";
    name.textContent = token;
    const bar = document.createElement("span");
    bar.className = "tally-count";
    bar.textContent = `${count} (${Math.round((count / state.decodeRolls) * 100)}%)`;
    row.append(name, bar);
    el.append(row);
  });
}

// ---------------------------------------------------------------------------
// The attention stepper: one operation per press, fully reversible.
// Every number is derived from TOKENS, so it can never drift from the panels
// and the worked example in the prose.
// ---------------------------------------------------------------------------

const STEP_QUERY = 5; // "it"
const STEP_COUNT = 6;

// The hand-picked embedding and W_Q from the prose, kept here so the stepper's
// first two beats show the same arithmetic the worked example does.
const STEP_EMBEDDING = [0.2, 0.1, 0.5, 0.9];
const STEP_WQ = [
  [0.0, 0.0, 0.5, 0.5],
  [1.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.4, 0.7],
  [0.0, 0.0, 0.0, 1.5]
];

const STEP_TITLES = [
  "The token arrives as one vector",
  "Project it into a query",
  "Score the query against every key",
  "Scale the scores down",
  "Turn the scores into weights",
  "Blend the values"
];

function fixed(n, places) {
  return Number(n).toFixed(places);
}

function stepLedger(rows, totalRow) {
  const wrap = document.createElement("div");
  wrap.className = "step-ledger";
  rows.forEach(([label, value, strong]) => {
    const row = document.createElement("div");
    row.className = `step-row${strong ? " is-strong" : ""}`;
    const name = document.createElement("span");
    name.innerHTML = label;
    const val = document.createElement("code");
    val.textContent = value;
    row.append(name, val);
    wrap.append(row);
  });
  if (totalRow) {
    const row = document.createElement("div");
    row.className = "step-row is-total";
    const name = document.createElement("span");
    name.innerHTML = totalRow[0];
    const val = document.createElement("code");
    val.textContent = totalRow[1];
    row.append(name, val);
    wrap.append(row);
  }
  return wrap;
}

function stepNote(html) {
  const p = document.createElement("p");
  p.className = "step-note";
  p.innerHTML = html;
  return p;
}

function renderStepTrack() {
  const track = dom.qkvStepTrack;
  if (!track) return;
  track.replaceChildren();
  STEP_TITLES.forEach((title, index) => {
    const li = document.createElement("li");
    const n = index + 1;
    li.className = `qkv-step-pip${state.qkvStep === n ? " is-current" : ""}${state.qkvStep > n ? " is-done" : ""}`;
    li.textContent = String(n);
    li.title = title;
    track.append(li);
  });
}

function renderQkvStepper() {
  const body = dom.qkvStepBody;
  if (!body) return;
  body.replaceChildren();
  renderStepTrack();

  if (state.qkvStep === 0) {
    dom.qkvStepPill.textContent = "press Next";
    body.append(emptyState("Press \u201cNext step\u201d to walk one attention row from the raw embedding to the blended output."));
    return;
  }

  dom.qkvStepPill.textContent = `step ${state.qkvStep} of ${STEP_COUNT}`;

  const q = TOKENS[STEP_QUERY].q;
  const raw = TOKENS.map((t) => dot(q, t.k));
  const scaled = raw.map((r) => r / SCALE);
  const weights = softmax(scaled);
  const output = Array(DIM).fill(0);
  TOKENS.forEach((t, j) => {
    for (let d = 0; d < DIM; d += 1) output[d] += weights[j] * t.v[d];
  });

  const heading = document.createElement("h4");
  heading.className = "step-heading";
  heading.textContent = `Step ${state.qkvStep}. ${STEP_TITLES[state.qkvStep - 1]}`;
  body.append(heading);

  if (state.qkvStep === 1) {
    body.append(stepLedger([
      ["Token", "it"],
      ["Its embedding <code>x</code>", `[ ${STEP_EMBEDDING.map((v) => fixed(v, 1)).join(", ")} ]`, true]
    ]));
    body.append(stepNote(
      "This is <em>all</em> the token has when it walks into the attention head: one row of numbers. No query, no key, no value yet - just <code>x</code>."
    ));
    return;
  }

  if (state.qkvStep === 2) {
    const rows = q.map((val, out) => {
      const terms = STEP_EMBEDDING
        .map((x, i) => `${fixed(x, 1)}(${fixed(STEP_WQ[i][out], 1)})`)
        .join(" + ");
      return [`q<sub>${out + 1}</sub> = ${terms}`, fixed(val, 2)];
    });
    body.append(stepLedger(rows, ["Query for <code>it</code>", `[ ${q.map((v) => fixed(v, 1)).join(", ")} ]`]));
    body.append(stepNote(
      `Four dot products against the four columns of <code>W<sub>Q</sub></code>. The fourth number is much the largest, which is this head's way of saying "I am hunting for something <em>animate</em>." The key and value come from the same <code>x</code> through <code>W<sub>K</sub></code> and <code>W<sub>V</sub></code>.`
    ));
    return;
  }

  if (state.qkvStep === 3) {
    const rows = TOKENS.map((t, j) => [
      `q &middot; k<sub>${t.word}</sub>`,
      fixed(raw[j], 2),
      j === 3
    ]);
    body.append(stepLedger(rows));
    body.append(stepNote(
      `Six dot products, one per token. <code>cat</code> scores <strong>${fixed(raw[3], 2)}</strong> because its key leans on the same animate channel the query is asking about; <code>fed</code> scores <strong>${fixed(raw[1], 2)}</strong> because a verb has nothing to offer a pronoun. These are raw scores - not yet weights.`
    ));
    return;
  }

  if (state.qkvStep === 4) {
    const rows = TOKENS.map((t, j) => [
      `${fixed(raw[j], 2)} &divide; &#8730;${DIM}`,
      fixed(scaled[j], 2),
      j === 3
    ]);
    body.append(stepLedger(rows));
    body.append(stepNote(
      `Every score is divided by <code>&#8730;${DIM} = ${fixed(SCALE, 0)}</code>. The <em>ranking</em> does not change at all - <code>cat</code> still wins. What changes is the spread, which stops the softmax on the next step from collapsing onto a single token.`
    ));
    return;
  }

  if (state.qkvStep === 5) {
    const expSum = scaled.reduce((s, v) => s + Math.exp(v), 0);
    const rows = TOKENS.map((t, j) => [
      `e<sup>${fixed(scaled[j], 2)}</sup> &divide; ${fixed(expSum, 3)}`,
      `${fixed(weights[j] * 100, 1)}%`,
      j === 3
    ]);
    body.append(stepLedger(rows, ["Total", `${fixed(weights.reduce((s, w) => s + w, 0) * 100, 1)}%`]));
    body.append(stepNote(
      `Softmax exponentiates each scaled score and divides by their total, so the six numbers now add to 100%. <code>cat</code> takes <strong>${fixed(weights[3] * 100, 1)}%</strong> of the attention. The model has, in effect, decided what <code>it</code> refers to.`
    ));
    return;
  }

  const rows = TOKENS.map((t, j) => [
    `${fixed(weights[j] * 100, 1)}% &times; v<sub>${t.word}</sub>`,
    `[ ${t.v.map((v) => fixed(weights[j] * v, 2)).join(", ")} ]`,
    j === 3
  ]);
  body.append(stepLedger(rows, ["Sum: the new vector for <code>it</code>", `[ ${output.map((v) => fixed(v, 2)).join(", ")} ]`]));
  body.append(stepNote(
    `Each value vector is scaled by its weight and the six are added up. Compare this output with the plain embedding from step 1: the <em>animate</em> channel has jumped to <strong>${fixed(output[3], 2)}</strong>, borrowed almost entirely from <code>cat</code>. That is the whole trick. The token <code>it</code> now carries the cat with it.`
  ));
}

function setQkvStep(next) {
  state.qkvStep = clamp(next, 0, STEP_COUNT);
  renderQkvStepper();
}

function stopQkvPlay() {
  if (state.qkvPlayTimer) {
    clearInterval(state.qkvPlayTimer);
    state.qkvPlayTimer = null;
  }
  if (dom.qkvStepPlay) dom.qkvStepPlay.textContent = "Play";
}

function toggleQkvPlay() {
  if (state.qkvPlayTimer) {
    stopQkvPlay();
    return;
  }
  // Reduced-motion users get the finished state rather than a timed sequence.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setQkvStep(STEP_COUNT);
    return;
  }
  if (state.qkvStep >= STEP_COUNT) setQkvStep(0);
  dom.qkvStepPlay.textContent = "Pause";
  state.qkvPlayTimer = setInterval(() => {
    if (state.qkvStep >= STEP_COUNT) {
      stopQkvPlay();
      return;
    }
    setQkvStep(state.qkvStep + 1);
  }, 2200);
}

// ---------------------------------------------------------------------------
// "Self-attention, in motion": the whole 6-token operation as a drivable scene.
//
// Built on inline SVG plus the browser's Web Animations API. No animation
// library: the matrix is 6x6, and WAAPI already gives us cancellation, timing
// and reduced-motion handling for free, which keeps the page self-contained.
// ---------------------------------------------------------------------------

const SVGNS = "http://www.w3.org/2000/svg";

const SAT = {
  rowTop: 62,
  rowGap: 58,
  rowH: 40,
  tokX: 8,
  tokW: 104,
  cell: 15,
  cellGap: 2,
  qX: 128,
  kX: 204,
  vX: 280,
  gridX: 386,
  gridCellW: 42,
  gridGap: 2,
  outX: 690,
  outW: 150
};

const SAT_STAGES = [
  {
    title: "Six tokens arrive, one vector each",
    caption: "Nothing has happened yet. Each token is a single row of numbers - the embedding from the previous layer. No queries, no keys, no values."
  },
  {
    title: "Each vector fans out into a query, a key and a value",
    caption: "Watch the dots: every token sends its one vector into three learned matrices and gets three vectors back. Same input, three different questions. This is the step people skip, and it is the one that makes the rest make sense."
  },
  {
    title: "Every query meets every key",
    caption: "Thirty-six dot products, all at once. Each dot flying into the grid is one query meeting one key, and the number it leaves behind is that pair's score after dividing by \u221ad. Bright cells are strong matches. This grid is why attention is called quadratic: six tokens make 36 cells, but a thousand tokens make a million."
  },
  {
    title: "Cover the future",
    caption: "With the mask on, the upper-right half goes dark: those pairs would let a token read words it has not generated yet. Their scores are set to negative infinity, so softmax will give them exactly zero weight."
  },
  {
    title: "Softmax turns each row into weights",
    caption: "Every row is now a set of percentages adding to 100%. Read across a row to see where that token chose to look. The 'it' row is the one to watch."
  },
  {
    title: "The weights blend the values",
    caption: "Finally the value vectors flow right, each scaled by its weight, and land as one new vector per token. Every output on the right is a mixture of the whole sentence - which is exactly what 'context-aware' means."
  }
];

function satRowY(i) { return SAT.rowTop + i * SAT.rowGap; }
function satRowMid(i) { return satRowY(i) + SAT.rowH / 2; }
function satVecX(base, d) { return base + d * (SAT.cell + SAT.cellGap); }
function satGridX(j) { return SAT.gridX + j * (SAT.gridCellW + SAT.gridGap); }

function svgEl(name, attrs, cls) {
  const el = document.createElementNS(SVGNS, name);
  Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, String(v)));
  if (cls) el.setAttribute("class", cls);
  return el;
}

function satPrefersReducedMotion() {
  return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

// Colour a vector cell by magnitude so the strips read as data, not decoration.
function satCellShade(value, max) {
  const t = max > 0 ? clamp(Math.abs(value) / max, 0, 1) : 0;
  return t;
}

function buildSatScene() {
  const svg = dom.satSvg;
  if (!svg) return;
  svg.replaceChildren();
  satNodes.tokens = [];
  satNodes.q = [];
  satNodes.k = [];
  satNodes.v = [];
  satNodes.grid = [];
  satNodes.gridText = [];
  satNodes.out = [];
  satNodes.outText = [];

  const headers = svgEl("g", {}, "sat-headers");
  [
    ["x", SAT.tokX + SAT.tokW / 2],
    ["q", satVecX(SAT.qX, 1.5)],
    ["k", satVecX(SAT.kX, 1.5)],
    ["v", satVecX(SAT.vX, 1.5)]
  ].forEach(([label, x]) => {
    headers.append(Object.assign(svgEl("text", { x, y: 34, "text-anchor": "middle" }, "sat-header"), { textContent: label }));
  });
  headers.append(Object.assign(
    svgEl("text", { x: satGridX(2.5) + SAT.gridCellW / 2, y: 22, "text-anchor": "middle" }, "sat-header"),
    { textContent: "scores: query row \u00d7 key column" }
  ));
  TOKENS.forEach((tok, j) => {
    headers.append(Object.assign(
      svgEl("text", { x: satGridX(j) + SAT.gridCellW / 2, y: 40, "text-anchor": "middle" }, "sat-colhead"),
      { textContent: tok.word }
    ));
  });
  headers.append(Object.assign(
    svgEl("text", { x: SAT.outX + SAT.outW / 2, y: 34, "text-anchor": "middle" }, "sat-header"),
    { textContent: "new vector" }
  ));
  svg.append(headers);

  TOKENS.forEach((tok, i) => {
    const y = satRowY(i);

    const g = svgEl("g", {}, "sat-token");
    g.append(svgEl("rect", { x: SAT.tokX, y, width: SAT.tokW, height: SAT.rowH, rx: 8 }, "sat-token-box"));
    g.append(Object.assign(
      svgEl("text", { x: SAT.tokX + SAT.tokW / 2, y: y + 25, "text-anchor": "middle" }, "sat-token-text"),
      { textContent: tok.word }
    ));
    svg.append(g);
    satNodes.tokens.push(g);

    [["q", SAT.qX], ["k", SAT.kX], ["v", SAT.vX]].forEach(([role, baseX]) => {
      const strip = svgEl("g", {}, `sat-strip sat-strip-${role}`);
      const cells = [];
      for (let d = 0; d < DIM; d += 1) {
        const rect = svgEl("rect", {
          x: satVecX(baseX, d),
          y: y + (SAT.rowH - SAT.cell) / 2,
          width: SAT.cell,
          height: SAT.cell,
          rx: 3
        }, `sat-cell sat-cell-${role}`);
        strip.append(rect);
        cells.push(rect);
      }
      svg.append(strip);
      satNodes[role].push({ group: strip, cells, baseX });
    });

    const rowCells = [];
    const rowTexts = [];
    TOKENS.forEach((_, j) => {
      const rect = svgEl("rect", {
        x: satGridX(j), y, width: SAT.gridCellW, height: SAT.rowH, rx: 5
      }, "sat-grid-cell");
      const text = svgEl("text", {
        x: satGridX(j) + SAT.gridCellW / 2, y: y + 25, "text-anchor": "middle"
      }, "sat-grid-text");
      svg.append(rect, text);
      rowCells.push(rect);
      rowTexts.push(text);
    });
    satNodes.grid.push(rowCells);
    satNodes.gridText.push(rowTexts);

    const outG = svgEl("g", {}, "sat-out");
    outG.append(svgEl("rect", { x: SAT.outX, y, width: SAT.outW, height: SAT.rowH, rx: 8 }, "sat-out-box"));
    const outText = svgEl("text", { x: SAT.outX + SAT.outW / 2, y: y + 25, "text-anchor": "middle" }, "sat-out-text");
    outG.append(outText);
    svg.append(outG);
    satNodes.out.push(outG);
    satNodes.outText.push(outText);
  });

  satNodes.fx = svgEl("g", {}, "sat-fx");
  svg.append(satNodes.fx);
}

function satClearFx() {
  state.satAnims.forEach((a) => { try { a.cancel(); } catch (e) { /* already gone */ } });
  state.satAnims = [];
  if (satNodes.fx) satNodes.fx.replaceChildren();
}

function satFly(x1, y1, x2, y2, options) {
  const opts = options || {};
  const dot = svgEl("circle", { cx: x1, cy: y1, r: opts.r || 3.2 }, `sat-dot ${opts.tone || ""}`);
  satNodes.fx.append(dot);
  const anim = dot.animate([
    { transform: "translate(0px, 0px)", opacity: 0 },
    { opacity: 1, offset: 0.15 },
    { opacity: 1, offset: 0.8 },
    { transform: `translate(${x2 - x1}px, ${y2 - y1}px)`, opacity: 0 }
  ], {
    duration: opts.duration || 620,
    delay: opts.delay || 0,
    easing: "cubic-bezier(.42,.02,.34,1)",
    fill: "forwards"
  });
  anim.onfinish = () => dot.remove();
  anim.oncancel = () => dot.remove();
  state.satAnims.push(anim);
  return anim;
}

function satPlayStage(stage) {
  if (satPrefersReducedMotion()) return;

  if (stage === 2) {
    TOKENS.forEach((_, i) => {
      const y = satRowMid(i);
      [["q", SAT.qX], ["k", SAT.kX], ["v", SAT.vX]].forEach(([role, baseX], r) => {
        for (let d = 0; d < DIM; d += 1) {
          satFly(SAT.tokX + SAT.tokW, y, satVecX(baseX, d) + SAT.cell / 2, y, {
            delay: i * 70 + r * 40 + d * 24,
            duration: 560,
            tone: `is-${role}`
          });
        }
      });
    });
    return;
  }

  if (stage === 3) {
    TOKENS.forEach((_, i) => {
      TOKENS.forEach((_, j) => {
        const target = { x: satGridX(j) + SAT.gridCellW / 2, y: satRowMid(i) };
        // One dot from the query of this row, one from the key of this column.
        satFly(satVecX(SAT.qX, DIM - 1) + SAT.cell, satRowMid(i), target.x, target.y, {
          delay: (i * 6 + j) * 26, duration: 620, tone: "is-q"
        });
        satFly(satVecX(SAT.kX, DIM - 1) + SAT.cell, satRowMid(j), target.x, target.y, {
          delay: (i * 6 + j) * 26 + 60, duration: 620, tone: "is-k"
        });
      });
    });
    return;
  }

  if (stage === 6) {
    const rows = TOKENS.map((_, i) => attentionRow(i, state.satCausal));
    rows.forEach((row, i) => {
      row.weights.forEach((w, j) => {
        if (w < 0.06) return;
        // Heavier weights send more dots, so the blend is visibly lopsided.
        const count = Math.max(1, Math.round(w * 8));
        for (let c = 0; c < count; c += 1) {
          satFly(satVecX(SAT.vX, DIM - 1) + SAT.cell, satRowMid(j), SAT.outX, satRowMid(i), {
            delay: i * 130 + c * 55 + j * 18,
            duration: 720,
            r: 2.6 + w * 3,
            tone: "is-v"
          });
        }
      });
    });
  }
}

function renderSat(options) {
  const svg = dom.satSvg;
  if (!svg) return;
  const opts = options || {};
  const step = state.satStep;

  if (!satNodes.tokens || !satNodes.tokens.length) buildSatScene();
  satClearFx();

  svg.classList.toggle("is-idle", step === 0);
  dom.satPill.textContent = step === 0 ? "press Next" : `stage ${step} of ${SAT_STAGES.length}`;

  if (step === 0) {
    dom.satCaption.textContent = "Press \u201cNext stage\u201d to run the whole attention block, from six plain token vectors to six context-aware ones.";
  } else {
    const stage = SAT_STAGES[step - 1];
    dom.satCaption.innerHTML = `<strong>Stage ${step}. ${stage.title}.</strong> ${stage.caption}`;
  }

  const rows = TOKENS.map((_, i) => attentionRow(i, state.satCausal));
  const maxQ = Math.max(...TOKENS.flatMap((t) => t.q.map(Math.abs)));
  const maxK = Math.max(...TOKENS.flatMap((t) => t.k.map(Math.abs)));
  const maxV = Math.max(...TOKENS.flatMap((t) => t.v.map(Math.abs)));
  const maxScore = Math.max(...rows.flatMap((r) => r.rawScores.map((s) => (s === null ? 0 : s))));

  satNodes.tokens.forEach((g, i) => {
    g.classList.toggle("is-on", step >= 1);
    g.style.transitionDelay = step === 1 ? `${i * 60}ms` : "0ms";
  });

  [["q", maxQ], ["k", maxK], ["v", maxV]].forEach(([role, max]) => {
    satNodes[role].forEach((strip, i) => {
      strip.group.classList.toggle("is-on", step >= 2);
      strip.cells.forEach((cell, d) => {
        const value = TOKENS[i][role][d];
        cell.style.setProperty("--shade", step >= 2 ? satCellShade(value, max).toFixed(3) : "0");
        cell.setAttribute("aria-hidden", "true");
      });
    });
  });

  satNodes.grid.forEach((rowCells, i) => {
    rowCells.forEach((cell, j) => {
      const text = satNodes.gridText[i][j];
      const masked = state.satCausal && j > i;
      cell.classList.toggle("is-on", step >= 3);
      cell.classList.toggle("is-masked", step >= 4 && masked);
      cell.classList.toggle("is-weight", step >= 5);
      if (step < 3) {
        cell.style.setProperty("--shade", "0");
        text.textContent = "";
        return;
      }
      if (step >= 5) {
        const w = rows[i].weights[j];
        const hidden = step >= 4 && masked;
        cell.style.setProperty("--shade", hidden ? "0" : w.toFixed(3));
        text.textContent = hidden ? "" : `${Math.round(w * 100)}%`;
        text.classList.toggle("is-light", !hidden && w > 0.34);
      } else {
        const raw = rows[i].rawScores[j];
        const shown = raw === null ? 0 : raw;
        const hidden = step >= 4 && masked;
        cell.style.setProperty("--shade", hidden ? "0" : satCellShade(shown, maxScore).toFixed(3));
        text.textContent = hidden ? "" : shown.toFixed(2);
        text.classList.toggle("is-light", !hidden && shown / maxScore > 0.62);
      }
    });
  });

  satNodes.out.forEach((g, i) => {
    g.classList.toggle("is-on", step >= 6);
    const text = satNodes.outText[i];
    text.textContent = step >= 6
      ? `[${rows[i].output.map((v) => v.toFixed(2)).join(" ")}]`
      : "";
  });

  if (opts.animate) satPlayStage(step);
}

function setSatStep(next, animate) {
  const clamped = clamp(next, 0, SAT_STAGES.length);
  const forward = clamped > state.satStep;
  state.satStep = clamped;
  renderSat({ animate: animate && forward });
}

function stopSatPlay() {
  if (state.satPlayTimer) {
    clearInterval(state.satPlayTimer);
    state.satPlayTimer = null;
  }
  if (dom.satPlay) dom.satPlay.textContent = "Play";
}

function toggleSatPlay() {
  if (state.satPlayTimer) {
    stopSatPlay();
    return;
  }
  if (satPrefersReducedMotion()) {
    setSatStep(SAT_STAGES.length, false);
    return;
  }
  if (state.satStep >= SAT_STAGES.length) setSatStep(0, false);
  dom.satPlay.textContent = "Pause";
  state.satPlayTimer = setInterval(() => {
    if (state.satStep >= SAT_STAGES.length) {
      stopSatPlay();
      return;
    }
    setSatStep(state.satStep + 1, true);
  }, 2600);
}

// ---------------------------------------------------------------------------
// Query/key/value as weighted lookup
// ---------------------------------------------------------------------------

function renderQkv() {
  if (!state.hasExploredQkv) {
    dom.qkvScores.replaceChildren(emptyState("Pick a query token above to see how much it attends to each token."));
    dom.qkvFormula.textContent = "";
    dom.qkvOutput.replaceChildren(emptyState("The blended output vector appears once you pick a query token."));
    if (dom.qkvMath) dom.qkvMath.replaceChildren(emptyState("The dot-product trace appears after you pick a query token."));
    return;
  }
  const { rawScores, weights, output } = attentionRow(state.queryIndex, state.causal);
  const queryWord = TOKENS[state.queryIndex].word;
  dom.qkvScores.replaceChildren();
  TOKENS.forEach((tok, j) => {
    const masked = state.causal && j > state.queryIndex;
    const row = document.createElement("div");
    row.className = "attn-bar-row";
    if (j === state.queryIndex) row.classList.add("is-query");
    const label = document.createElement("span");
    label.className = "attn-token";
    label.textContent = `${tok.word}${j === state.queryIndex ? " (query)" : ""}`;
    const track = document.createElement("span");
    track.className = "attn-track";
    const fill = document.createElement("span");
    fill.className = "attn-fill";
    fill.style.width = `${masked ? 0 : clamp(weights[j] * 100, 0, 100)}%`;
    track.append(fill);
    const value = document.createElement("strong");
    value.className = "attn-value";
    value.textContent = masked ? "masked" : `${(weights[j] * 100).toFixed(0)}%`;
    const score = document.createElement("span");
    score.className = "attn-score";
    score.textContent = masked ? "" : `score ${rawScores[j].toFixed(2)}`;
    row.append(label, track, value, score);
    dom.qkvScores.append(row);
  });

  dom.qkvFormula.textContent = `For query "${queryWord}": score(key) = (q \u00b7 k) / \u221a${DIM}, then softmax turns the scores into the weights above.`;

  const ranked = weights
    .map((w, j) => ({ word: TOKENS[j].word, w }))
    .filter((item) => item.w > 0.001)
    .sort((a, b) => b.w - a.w)
    .slice(0, 3)
    .map((item) => `${item.word} ${(item.w * 100).toFixed(0)}%`)
    .join(", ");
  dom.qkvOutput.replaceChildren();
  const head = document.createElement("p");
  head.className = "microcopy";
  head.innerHTML = `The new vector for <strong>${queryWord}</strong> is a blend of value vectors, mostly from: ${ranked}.`;
  const vec = document.createElement("code");
  vec.className = "vector-readout-line";
  vec.textContent = `output = [ ${output.map((n) => n.toFixed(2)).join(", ")} ]  over [ ${CHANNELS.join(", ")} ]`;
  dom.qkvOutput.append(head, vec);
  renderQkvMath(rawScores, weights);
}

function formatVector(vec) {
  return `[${vec.map((n) => n.toFixed(2)).join(", ")}]`;
}

function renderQkvMath(rawScores, weights) {
  const wrap = dom.qkvMath;
  if (!wrap) return;
  wrap.replaceChildren();
  const grid = document.createElement("div");
  grid.className = "qkv-math-grid";
  ["Token", "Key vector", "q dot key", "Scaled score", "Weight"].forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "qkv-math-cell is-head";
    cell.textContent = label;
    grid.append(cell);
  });
  const visibleWeights = weights.filter((w) => w > 0);
  const strongest = Math.max(...visibleWeights, 0);
  TOKENS.forEach((tok, j) => {
    const masked = state.causal && j > state.queryIndex;
    const dotScore = masked ? null : rawScores[j] * SCALE;
    const cells = [
      tok.word,
      formatVector(tok.k),
      masked ? "masked" : dotScore.toFixed(2),
      masked ? "masked" : rawScores[j].toFixed(2),
      masked ? "0%" : `${(weights[j] * 100).toFixed(1)}%`
    ];
    cells.forEach((text, index) => {
      const cell = document.createElement("div");
      const strong = !masked && weights[j] === strongest && index === 4;
      cell.className = `qkv-math-cell${j === state.queryIndex ? " is-query" : ""}${strong ? " is-strong" : ""}`;
      if (index === 1) {
        const code = document.createElement("code");
        code.textContent = text;
        cell.append(code);
      } else {
        cell.textContent = text;
      }
      grid.append(cell);
    });
  });
  wrap.append(grid);
}

// ---------------------------------------------------------------------------
// The full self-attention heatmap
// ---------------------------------------------------------------------------

function renderHeatmap() {
  const causal = state.causal;
  const grid = dom.heatmap;
  grid.replaceChildren();
  if (!state.hasViewedHeatmap) {
    dom.heatmapStatus.textContent = "toggle the mask";
    grid.style.gridTemplateColumns = "1fr";
    grid.append(emptyState("Toggle the causal mask to build the attention map for every token at once."));
    return;
  }
  dom.heatmapStatus.textContent = causal ? "causal mask on" : "full attention";
  grid.style.gridTemplateColumns = `auto repeat(${TOKENS.length}, 1fr)`;

  const corner = document.createElement("div");
  corner.className = "heat-corner";
  corner.textContent = "query \\ key";
  grid.append(corner);
  TOKENS.forEach((tok) => {
    const head = document.createElement("div");
    head.className = "heat-head heat-col";
    head.textContent = tok.word;
    grid.append(head);
  });

  TOKENS.forEach((qtok, i) => {
    const rowHead = document.createElement("div");
    rowHead.className = "heat-head heat-row";
    rowHead.textContent = qtok.word;
    grid.append(rowHead);
    const { weights } = attentionRow(i, causal);
    const rowMax = Math.max(...weights.filter((w, j) => !(causal && j > i)), 0.0001);
    TOKENS.forEach((ktok, j) => {
      const cell = document.createElement("div");
      cell.className = "heat-cell";
      const masked = causal && j > i;
      if (masked) {
        cell.classList.add("is-masked");
        cell.textContent = "";
      } else {
        const w = weights[j];
        const intensity = w / rowMax;
        cell.style.background = `rgba(198, 95, 30, ${(0.08 + intensity * 0.86).toFixed(3)})`;
        if (intensity >= 0.7) cell.classList.add("is-strong");
        cell.textContent = `${(w * 100).toFixed(0)}`;
        cell.title = `${qtok.word} attends to ${ktok.word}: ${(w * 100).toFixed(1)}%`;
      }
      grid.append(cell);
    });
  });
}

// ---------------------------------------------------------------------------
// Multi-head attention (three hand-designed heads)
// ---------------------------------------------------------------------------

function normalize(weights) {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  return weights.map((w) => w / sum);
}

// Head A: meaning / coreference (the real attention pattern, "it" -> "cat").
function headMeaning(qi) {
  return attentionRow(qi, false).weights;
}
// Head B: "previous token" - looks mostly at the token just before.
function headPrev(qi) {
  const w = TOKENS.map(() => 0);
  if (qi === 0) { w[0] = 1; return w; }
  w[qi - 1] = 0.62;
  w[qi] = 0.22;
  for (let j = 0; j < qi - 1; j += 1) w[j] = 0.16 / Math.max(qi - 1, 1);
  return normalize(w);
}
// Head C: "subject anchor" - always leans on the sentence subject (Sarah).
function headSubject(qi) {
  const w = TOKENS.map(() => 0);
  if (qi === 0) { w[0] = 1; return w; }
  w[0] = 0.58;
  w[qi] = 0.20;
  let rest = 0.22;
  let others = 0;
  for (let j = 1; j <= qi; j += 1) if (j !== qi) others += 1;
  for (let j = 1; j <= qi; j += 1) if (j !== qi) w[j] = rest / Math.max(others, 1);
  return normalize(w);
}

const MH_HEADS = [
  { title: "Head 1 \u00b7 meaning", note: "tracks what a word refers to", fn: headMeaning },
  { title: "Head 2 \u00b7 previous token", note: "looks at the token just before", fn: headPrev },
  { title: "Head 3 \u00b7 subject anchor", note: "leans on the sentence's subject", fn: headSubject }
];

function renderMultiHead() {
  const wrap = dom.mhHeads;
  wrap.replaceChildren();
  if (!state.hasViewedMultihead) {
    wrap.append(emptyState("Pick a query token above to compare three attention heads side by side."));
    return;
  }
  const qi = state.mhQueryIndex;
  MH_HEADS.forEach((head) => {
    const panel = document.createElement("div");
    panel.className = "mh-head";
    const title = document.createElement("div");
    title.className = "mh-head-title";
    title.textContent = head.title;
    const note = document.createElement("p");
    note.className = "mh-head-note";
    note.textContent = head.note;
    panel.append(title, note);
    const bars = document.createElement("div");
    bars.className = "attn-bars mh-bars";
    const weights = head.fn(qi);
    TOKENS.forEach((tok, j) => {
      const row = document.createElement("div");
      row.className = "attn-bar-row";
      if (j === qi) row.classList.add("is-query");
      const label = document.createElement("span");
      label.className = "attn-token";
      label.textContent = tok.word;
      const track = document.createElement("span");
      track.className = "attn-track";
      const fill = document.createElement("span");
      fill.className = "attn-fill";
      fill.style.width = `${clamp(weights[j] * 100, 0, 100)}%`;
      track.append(fill);
      const value = document.createElement("strong");
      value.className = "attn-value";
      value.textContent = `${(weights[j] * 100).toFixed(0)}%`;
      row.append(label, track, value);
      bars.append(row);
    });
    panel.append(bars);
    wrap.append(panel);
  });
}

// ---------------------------------------------------------------------------
// Real next-token probabilities via transformers.js
// ---------------------------------------------------------------------------

const MODEL_ID = "Xenova/distilgpt2";
const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";

function setModelStatus(text, mode) {
  dom.modelStatus.textContent = text;
  dom.modelStatus.className = `model-status${mode ? ` is-${mode}` : ""}`;
}

async function loadModel() {
  if (state.model || state.modelLoading) return;
  state.modelLoading = true;
  dom.loadModelButton.disabled = true;
  dom.loadModelButton.textContent = "Loading...";
  setModelStatus("Importing transformers.js and downloading the distilGPT-2 weights. The first load fetches the model once, then the browser caches it.", "loading");
  try {
    const { AutoTokenizer, AutoModelForCausalLM, env } = await import(TRANSFORMERS_URL);
    env.allowLocalModels = false;
    const progress = (data) => {
      if (data && data.status === "progress" && data.file) {
        setModelStatus(`Downloading ${data.file}: ${Math.round(data.progress || 0)}%`, "loading");
      }
    };
    const tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID, { progress_callback: progress });
    const model = await AutoModelForCausalLM.from_pretrained(MODEL_ID, { progress_callback: progress });
    state.model = { tokenizer, model };
    setModelStatus("Model ready. It runs entirely in your browser now, with no server calls.", "ready");
    dom.loadModelButton.textContent = "Model loaded";
    dom.modelPanel.hidden = false;
    predictNextTokens();
  } catch (error) {
    setModelStatus(`Could not load the model: ${error.message}. This section needs an internet connection the first time. Every demo above still works offline.`, "error");
    dom.loadModelButton.disabled = false;
    dom.loadModelButton.textContent = "Try again";
  } finally {
    state.modelLoading = false;
  }
}

async function nextTokenDistribution(prompt) {
  const { tokenizer, model } = state.model;
  const inputs = await tokenizer(prompt);
  const { logits } = await model(inputs);
  const dims = logits.dims;
  const vocab = dims[dims.length - 1];
  const seq = dims[dims.length - 2];
  const data = logits.data;
  const start = (seq - 1) * vocab;
  let max = -Infinity;
  for (let i = 0; i < vocab; i += 1) max = Math.max(max, data[start + i]);
  const exps = new Float64Array(vocab);
  let sum = 0;
  for (let i = 0; i < vocab; i += 1) { const e = Math.exp(data[start + i] - max); exps[i] = e; sum += e; }
  const ranked = Array.from({ length: vocab }, (_, i) => i)
    .sort((a, b) => exps[b] - exps[a])
    .slice(0, 8)
    .map((i) => ({ token: tokenizer.decode([i]), p: exps[i] / sum }));
  return ranked;
}

async function predictNextTokens() {
  if (!state.model) return;
  const prompt = dom.promptInput.value.trim() || "The cat sat on the";
  dom.predictButton.disabled = true;
  dom.nextTokenBars.replaceChildren(emptyState("Running a forward pass through the Transformer..."));
  try {
    const ranked = await nextTokenDistribution(prompt);
    dom.nextTokenBars.replaceChildren();
    ranked.forEach((item) => {
      const row = document.createElement("div");
      row.className = "attn-bar-row";
      const label = document.createElement("span");
      label.className = "attn-token next-token";
      label.textContent = JSON.stringify(item.token);
      const track = document.createElement("span");
      track.className = "attn-track";
      const fill = document.createElement("span");
      fill.className = "attn-fill";
      fill.style.width = `${clamp(item.p * 100, 1, 100)}%`;
      track.append(fill);
      const value = document.createElement("strong");
      value.className = "attn-value";
      value.textContent = `${(item.p * 100).toFixed(1)}%`;
      row.append(label, track, value);
      dom.nextTokenBars.append(row);
    });
  } catch (error) {
    dom.nextTokenBars.replaceChildren(emptyState(`Prediction failed: ${error.message}`));
  } finally {
    dom.predictButton.disabled = false;
  }
}

async function generateContinuation() {
  if (!state.model) return;
  const prompt = dom.promptInput.value.trim() || "The cat sat on the";
  dom.generateButton.disabled = true;
  dom.generatedText.textContent = "Generating one token at a time...";
  try {
    let text = prompt;
    for (let step = 0; step < 12; step += 1) {
      const ranked = await nextTokenDistribution(text);
      text += ranked[0].token;
    }
    dom.generatedText.textContent = text;
  } catch (error) {
    dom.generatedText.textContent = `Generation failed: ${error.message}`;
  } finally {
    dom.generateButton.disabled = false;
  }
}

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------

function populateSelect(select, selectedIndex) {
  if (!select) return;
  select.replaceChildren();
  TOKENS.forEach((tok, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1}. ${tok.word}`;
    select.append(option);
  });
  select.value = String(selectedIndex);
}

function setCausal(value) {
  state.causal = value;
  state.satCausal = value;
  if (dom.causalToggle) dom.causalToggle.checked = value;
  if (dom.causalToggleHeatmap) dom.causalToggleHeatmap.checked = value;
  if (dom.satCausal) dom.satCausal.checked = value;
}

// ---------------------------------------------------------------------------
// Runnable code cells: real attention + softmax math the learner can run
// ---------------------------------------------------------------------------

function ce(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text !== undefined) el.textContent = text;
  return el;
}

function renderChapter5CodeResult(output, result) {
  const data = result && typeof result === "object" ? result : { value: result };
  const status = ce("div", "output-status");
  status.append(ce("strong", "", "Ran successfully"), ce("span", "", "real browser computation"));
  const visual = ce("div", "output-visual");

  if (Array.isArray(data.bars)) {
    const list = ce("div", "code-bar-list");
    const maxVal = Math.max(...data.bars.map((b) => Number(b.value) || 0), 1e-9);
    data.bars.forEach((b) => {
      const value = Number(b.value) || 0;
      const row = ce("div", "code-bar-row");
      const track = ce("span", "code-bar-track");
      const fill = ce("span", "code-bar-fill");
      fill.style.width = `${clamp((value / maxVal) * 100, 0, 100)}%`;
      track.append(fill);
      row.append(
        ce("span", "code-bar-label", String(b.label)),
        track,
        ce("span", "code-bar-value", `${(value * 100).toFixed(1)}%`)
      );
      list.append(row);
    });
    visual.append(list);
  }

  const entries = Object.entries(data).filter(([key]) => key !== "bars");
  const scalarEntries = entries.filter(([, value]) => typeof value === "number" || typeof value === "string");
  if (scalarEntries.length) {
    const metrics = ce("div", "output-metrics");
    scalarEntries.slice(0, 6).forEach(([key, value]) => {
      const shown = typeof value === "number" && !Number.isInteger(value) ? value.toFixed(3) : String(value);
      const item = ce("div", "output-metric");
      item.append(ce("strong", "", shown), ce("span", "", key));
      metrics.append(item);
    });
    visual.append(metrics);
  }

  const raw = ce("details", "output-raw");
  raw.append(ce("summary", "", "Raw result object"));
  const pre = ce("pre");
  pre.textContent = JSON.stringify(result, null, 2);
  raw.append(pre);
  visual.append(raw);

  output.replaceChildren(status, visual);
}

function runChapter5CodeCell(cell) {
  const input = cell.querySelector(".code-input");
  const output = cell.querySelector(".code-output");
  output.className = "code-output is-running";
  output.textContent = "Running...";
  try {
    const api = {
      softmax,
      dot,
      DIM,
      tokens: TOKENS.map((t) => ({ word: t.word, q: t.q.slice(), k: t.k.slice(), v: t.v.slice() }))
    };
    const runner = new Function(
      "api",
      `"use strict"; const { softmax, dot, DIM, tokens } = api; return (() => { ${input.value} })();`
    );
    const result = runner(api);
    output.className = "code-output is-success";
    renderChapter5CodeResult(output, result);
  } catch (error) {
    output.className = "code-output is-error";
    output.textContent = `${error.name}: ${error.message}`;
  }
}

function wireEvents() {
  // Generation loop
  dom.genNextBtn.addEventListener("click", () => {
    if (state.genStep < GEN_TOKENS.length) state.genStep += 1;
    renderGenLoop();
  });
  dom.genResetBtn.addEventListener("click", () => { state.genStep = 0; renderGenLoop(); });

  // Decoding
  dom.decodeMode.addEventListener("pointerdown", () => { state.hasDecoded = true; renderDecodeBars(); });
  dom.decodeMode.addEventListener("change", () => { state.hasDecoded = true; renderDecodeBars(); renderDecodeTally(); });
  dom.decodeTemp.addEventListener("input", () => { state.hasDecoded = true; renderDecodeBars(); });
  dom.topKSlider.addEventListener("input", () => { state.hasDecoded = true; renderDecodeBars(); });
  dom.topPSlider.addEventListener("input", () => { state.hasDecoded = true; renderDecodeBars(); });
  dom.decodePickBtn.addEventListener("click", () => pickToken());
  dom.decodeResetBtn.addEventListener("click", () => {
    state.decodeTally = {}; state.decodeRolls = 0; renderDecodeTally();
  });

  // Attention stepper
  dom.qkvStepNext.addEventListener("click", () => { stopQkvPlay(); setQkvStep(state.qkvStep + 1); });
  dom.qkvStepBack.addEventListener("click", () => { stopQkvPlay(); setQkvStep(state.qkvStep - 1); });
  dom.qkvStepPlay.addEventListener("click", () => toggleQkvPlay());
  dom.qkvStepReset.addEventListener("click", () => { stopQkvPlay(); setQkvStep(0); });

  // Self-attention theatre
  dom.satNext.addEventListener("click", () => { stopSatPlay(); setSatStep(state.satStep + 1, true); });
  dom.satBack.addEventListener("click", () => { stopSatPlay(); setSatStep(state.satStep - 1, false); });
  dom.satPlay.addEventListener("click", () => toggleSatPlay());
  dom.satReset.addEventListener("click", () => { stopSatPlay(); setSatStep(0, false); });
  dom.satCausal.addEventListener("change", () => {
    stopSatPlay();
    state.satCausal = dom.satCausal.checked;
    // The mask is only meaningful once the grid exists, so jump there if needed.
    if (state.satStep > 0 && state.satStep < 4) state.satStep = 4;
    if (state.satStep === 0) state.satStep = 4;
    state.hasViewedHeatmap = true;
    setCausal(dom.satCausal.checked);
    renderQkv();
    renderHeatmap();
    renderSat({ animate: false });
  });

  // QKV attention
  dom.querySelect.addEventListener("change", () => {
    state.hasExploredQkv = true;
    state.queryIndex = Number(dom.querySelect.value);
    renderQkv();
  });
  dom.causalToggle.addEventListener("change", () => {
    state.hasExploredQkv = true;
    state.hasViewedHeatmap = true;
    setCausal(dom.causalToggle.checked);
    renderQkv();
    renderHeatmap();
    renderSat({ animate: false });
  });

  // Attention heatmap
  dom.causalToggleHeatmap.addEventListener("change", () => {
    state.hasViewedHeatmap = true;
    setCausal(dom.causalToggleHeatmap.checked);
    renderQkv();
    renderHeatmap();
    renderSat({ animate: false });
  });

  // Multi-head attention
  dom.mhQuerySelect.addEventListener("change", () => {
    state.hasViewedMultihead = true;
    state.mhQueryIndex = Number(dom.mhQuerySelect.value);
    renderMultiHead();
  });

  // Real model
  dom.loadModelButton.addEventListener("click", () => loadModel());
  dom.predictButton.addEventListener("click", () => predictNextTokens());
  dom.generateButton.addEventListener("click", () => generateContinuation());

  // Runnable code cells
  document.querySelectorAll(".chapter5-code-cell .run-button").forEach((button) => {
    button.addEventListener("click", () => runChapter5CodeCell(button.closest(".chapter5-code-cell")));
  });
}

function setupSectionSpy() {
  const links = Array.from(document.querySelectorAll(".lesson-toc a[href^='#'], .topnav a[href^='#']"));
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

function init() {
  Object.assign(dom, {
    genOutput: grab("genOutput"),
    genStatus: grab("genStatus"),
    genNextBtn: grab("genNextBtn"),
    genResetBtn: grab("genResetBtn"),
    decodeMode: grab("decodeMode"),
    decodeTemp: grab("decodeTemp"),
    decodeTempLabel: grab("decodeTempLabel"),
    topKSlider: grab("topKSlider"),
    topKLabel: grab("topKLabel"),
    topPSlider: grab("topPSlider"),
    topPLabel: grab("topPLabel"),
    decodeDistPill: grab("decodeDistPill"),
    candidatePill: grab("candidatePill"),
    candidateSet: grab("candidateSet"),
    decodeBars: grab("decodeBars"),
    decodePickBtn: grab("decodePickBtn"),
    decodeResetBtn: grab("decodeResetBtn"),
    decodeTally: grab("decodeTally"),
    querySelect: grab("queryTokenSelect"),
    qkvStepTrack: grab("qkvStepTrack"),
    qkvStepBody: grab("qkvStepBody"),
    qkvStepPill: grab("qkvStepPill"),
    qkvStepBack: grab("qkvStepBack"),
    qkvStepNext: grab("qkvStepNext"),
    qkvStepPlay: grab("qkvStepPlay"),
    qkvStepReset: grab("qkvStepReset"),
    satSvg: grab("satSvg"),
    satPill: grab("satPill"),
    satCaption: grab("satCaption"),
    satBack: grab("satBack"),
    satNext: grab("satNext"),
    satPlay: grab("satPlay"),
    satReset: grab("satReset"),
    satCausal: grab("satCausal"),
    causalToggle: grab("causalToggle"),
    qkvScores: grab("qkvScores"),
    qkvFormula: grab("qkvFormula"),
    qkvOutput: grab("qkvOutput"),
    qkvMath: grab("qkvMath"),
    causalToggleHeatmap: grab("causalToggleHeatmap"),
    heatmap: grab("attentionHeatmap"),
    heatmapStatus: grab("heatmapStatus"),
    mhQuerySelect: grab("mhQuerySelect"),
    mhHeads: grab("mhHeads"),
    loadModelButton: grab("loadModelButton"),
    modelStatus: grab("modelStatus"),
    modelPanel: grab("modelPanel"),
    promptInput: grab("promptInput"),
    predictButton: grab("predictButton"),
    generateButton: grab("generateButton"),
    nextTokenBars: grab("nextTokenBars"),
    generatedText: grab("generatedText")
  });

  populateSelect(dom.querySelect, state.queryIndex);
  populateSelect(dom.mhQuerySelect, state.mhQueryIndex);
  wireEvents();

  renderGenLoop();
  renderDecodeBars();
  renderDecodeTally();
  renderQkvStepper();
  renderSat({ animate: false });
  renderQkv();
  renderHeatmap();
  renderMultiHead();
  setupSectionSpy();
}

init();
