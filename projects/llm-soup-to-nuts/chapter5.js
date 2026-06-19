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
  // KV cache
  hasKv: false,
  // QKV attention
  queryIndex: 5, // default: "it"
  causal: false,
  hasExploredQkv: false,
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

function renderDecodeBars() {
  const temp = Number(dom.decodeTemp.value);
  dom.decodeTempLabel.textContent = temp.toFixed(1);
  dom.decodeDistPill.textContent = `temperature ${temp.toFixed(1)}`;
  const bars = dom.decodeBars;
  bars.replaceChildren();
  if (!state.hasDecoded) {
    bars.append(emptyState("Nudge the temperature or press \u201cPick a token\u201d to reveal the distribution."));
    return;
  }
  const dist = temperedDistribution(temp).slice().sort((a, b) => b.p - a.p);
  dist.forEach((d) => {
    const row = document.createElement("div");
    row.className = "attn-bar-row";
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
}

function pickToken() {
  state.hasDecoded = true;
  const temp = Number(dom.decodeTemp.value);
  const dist = temperedDistribution(temp);
  let chosen;
  if (dom.decodeMode.value === "greedy") {
    chosen = dist.reduce((best, d) => (d.p > best.p ? d : best), dist[0]).t;
  } else {
    const r = Math.random();
    let acc = 0;
    chosen = dist[dist.length - 1].t;
    for (const d of dist) { acc += d.p; if (r <= acc) { chosen = d.t; break; } }
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
  head.textContent = `${state.decodeRolls} pick${state.decodeRolls === 1 ? "" : "s"} so far (${dom.decodeMode.value === "greedy" ? "greedy" : "sampling"}):`;
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
// KV cache work counter
// ---------------------------------------------------------------------------

function renderKvCache() {
  const n = Number(dom.kvTokens.value);
  dom.kvTokensLabel.textContent = String(n);
  const cacheOn = dom.kvCacheToggle.checked;
  dom.kvStatusPill.textContent = cacheOn ? "cache on" : "cache off";
  const el = dom.kvCompare;
  el.replaceChildren();
  if (!state.hasKv) {
    el.append(emptyState("Slide the length or flip the cache toggle to compare the work."));
    renderKvTrace();
    return;
  }
  const noCache = (n * (n + 1)) / 2;
  const withCache = n;
  const max = noCache;
  const makeRow = (label, units, active, mode) => {
    const row = document.createElement("div");
    row.className = `kv-row${active ? " is-active" : ""}`;
    const name = document.createElement("span");
    name.className = "kv-label";
    name.textContent = label;
    const track = document.createElement("span");
    track.className = "kv-track";
    const fill = document.createElement("span");
    fill.className = `kv-fill is-${mode}`;
    fill.style.width = `${clamp((units / max) * 100, 1.5, 100)}%`;
    track.append(fill);
    const val = document.createElement("strong");
    val.className = "kv-units";
    val.textContent = `${units.toLocaleString()} units`;
    row.append(name, track, val);
    return row;
  };
  el.append(makeRow("Without cache", noCache, !cacheOn, "nocache"));
  el.append(makeRow("With KV cache", withCache, cacheOn, "cache"));
  const summary = document.createElement("p");
  summary.className = "microcopy kv-summary";
  const ratio = (noCache / withCache).toFixed(1);
  summary.innerHTML = `For ${n} tokens, the cache does about <strong>${ratio}\u00d7 less work</strong>. Without it, the total grows with the square of the length; with it, it grows in a straight line.`;
  el.append(summary);
  renderKvTrace();
}

function renderKvTrace() {
  const trace = dom.kvTrace;
  if (!trace) return;
  trace.replaceChildren();
  if (!state.hasKv) {
    trace.append(emptyState("Reveal the cache comparison above to see the first few generation steps."));
    return;
  }
  const n = Number(dom.kvTokens.value);
  const shown = Math.min(n, 10);
  const grid = document.createElement("div");
  grid.className = "kv-trace-grid";
  ["Step", "Without cache", "With KV cache", "Cache contents"].forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "kv-trace-cell is-head";
    cell.textContent = label;
    grid.append(cell);
  });
  for (let step = 1; step <= shown; step += 1) {
    const cells = [
      `#${step}`,
      `Reprocess ${step} token${step === 1 ? "" : "s"}`,
      "Compute 1 new token",
      `Reuse ${Math.max(0, step - 1)} old KV set${step === 2 ? "" : "s"}`
    ];
    cells.forEach((text, index) => {
      const cell = document.createElement("div");
      cell.className = `kv-trace-cell${index === 2 ? " is-cache" : ""}`;
      cell.textContent = text;
      grid.append(cell);
    });
  }
  trace.append(grid);
  if (n > shown) {
    const note = document.createElement("p");
    note.className = "microcopy kv-trace-note";
    note.textContent = `Only the first ${shown} steps are shown, but the pattern continues through all ${n} generated tokens.`;
    trace.append(note);
  }
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
// Head B: "previous token" — looks mostly at the token just before.
function headPrev(qi) {
  const w = TOKENS.map(() => 0);
  if (qi === 0) { w[0] = 1; return w; }
  w[qi - 1] = 0.62;
  w[qi] = 0.22;
  for (let j = 0; j < qi - 1; j += 1) w[j] = 0.16 / Math.max(qi - 1, 1);
  return normalize(w);
}
// Head C: "subject anchor" — always leans on the sentence subject (Sarah).
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
  if (dom.causalToggle) dom.causalToggle.checked = value;
  if (dom.causalToggleHeatmap) dom.causalToggleHeatmap.checked = value;
}

function wireEvents() {
  // Generation loop
  dom.genNextBtn.addEventListener("click", () => {
    if (state.genStep < GEN_TOKENS.length) state.genStep += 1;
    renderGenLoop();
  });
  dom.genResetBtn.addEventListener("click", () => { state.genStep = 0; renderGenLoop(); });

  // Decoding
  dom.decodeMode.addEventListener("change", () => { renderDecodeBars(); renderDecodeTally(); });
  dom.decodeTemp.addEventListener("input", () => { state.hasDecoded = true; renderDecodeBars(); });
  dom.decodePickBtn.addEventListener("click", () => pickToken());
  dom.decodeResetBtn.addEventListener("click", () => {
    state.decodeTally = {}; state.decodeRolls = 0; renderDecodeTally();
  });

  // KV cache
  dom.kvTokens.addEventListener("input", () => { state.hasKv = true; renderKvCache(); });
  dom.kvCacheToggle.addEventListener("change", () => { state.hasKv = true; renderKvCache(); });

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
  });

  // Attention heatmap
  dom.causalToggleHeatmap.addEventListener("change", () => {
    state.hasViewedHeatmap = true;
    setCausal(dom.causalToggleHeatmap.checked);
    renderQkv();
    renderHeatmap();
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
    decodeDistPill: grab("decodeDistPill"),
    decodeBars: grab("decodeBars"),
    decodePickBtn: grab("decodePickBtn"),
    decodeResetBtn: grab("decodeResetBtn"),
    decodeTally: grab("decodeTally"),
    kvTokens: grab("kvTokens"),
    kvTokensLabel: grab("kvTokensLabel"),
    kvCacheToggle: grab("kvCacheToggle"),
    kvStatusPill: grab("kvStatusPill"),
    kvCompare: grab("kvCompare"),
    kvTrace: grab("kvTrace"),
    querySelect: grab("queryTokenSelect"),
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
  renderKvCache();
  renderQkv();
  renderHeatmap();
  renderMultiHead();
  setupSectionSpy();
}

init();
