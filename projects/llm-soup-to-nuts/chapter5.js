// Chapter 5: Transformers and attention.
// The attention demos are self-built and fully offline: a tiny set of hand-designed
// token vectors makes the query/key/value mechanism and the attention heatmap
// visible and deterministic. The final section loads a REAL small GPT model with
// transformers.js (downloaded on demand) so learners can see genuine next-token
// probabilities from an 82M-parameter Transformer.

// --- tiny self-built attention world ---------------------------------------
// Sentence: "the cat sat on the mat". Each token gets a hand-designed query,
// key, and value vector across four interpretable channels:
//   [ function-word, subject, action, place ].
// In a real Transformer these come from learned projections W_Q, W_K, W_V of the
// token embedding. Here we set them by hand so the mechanism is easy to see.
const DIM = 4;
const CHANNELS = ["function", "subject", "action", "place"];
const TOKENS = [
  { word: "the",  q: [0.2, 0.5, 0.0, 0.0], k: [1.0, 0.0, 0.0, 0.0], v: [0.9, 0.1, 0.0, 0.1] },
  { word: "cat",  q: [0.1, 0.2, 0.7, 0.0], k: [0.0, 1.0, 0.0, 0.1], v: [0.1, 0.9, 0.1, 0.0] },
  { word: "sat",  q: [0.0, 0.9, 0.1, 0.4], k: [0.0, 0.1, 1.0, 0.0], v: [0.0, 0.2, 0.9, 0.1] },
  { word: "on",   q: [0.0, 0.0, 0.2, 0.9], k: [0.6, 0.0, 0.0, 0.5], v: [0.6, 0.0, 0.1, 0.6] },
  { word: "the",  q: [0.0, 0.2, 0.0, 0.6], k: [1.0, 0.0, 0.0, 0.0], v: [0.9, 0.1, 0.0, 0.1] },
  { word: "mat",  q: [0.0, 0.1, 0.3, 0.3], k: [0.0, 0.3, 0.0, 1.0], v: [0.1, 0.3, 0.0, 0.9] }
];

const SCALE = Math.sqrt(DIM);

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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

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
  // weighted sum of value vectors = the new representation for this token
  const output = Array(DIM).fill(0);
  visibleIdx.forEach((j) => {
    for (let d = 0; d < DIM; d += 1) output[d] += weights[j] * TOKENS[j].v[d];
  });
  return { rawScores, weights, output, visibleIdx };
}

const state = {
  queryIndex: 2, // default: "sat"
  causal: false,
  model: null,
  modelLoading: false,
  hasExploredQkv: false,
  hasViewedHeatmap: false
};

const dom = {
  querySelect: document.getElementById("queryTokenSelect"),
  qkvScores: document.getElementById("qkvScores"),
  qkvFormula: document.getElementById("qkvFormula"),
  qkvOutput: document.getElementById("qkvOutput"),
  causalToggle: document.getElementById("causalToggle"),
  causalToggleHeatmap: document.getElementById("causalToggleHeatmap"),
  heatmap: document.getElementById("attentionHeatmap"),
  heatmapStatus: document.getElementById("heatmapStatus"),
  loadModelButton: document.getElementById("loadModelButton"),
  modelStatus: document.getElementById("modelStatus"),
  modelPanel: document.getElementById("modelPanel"),
  promptInput: document.getElementById("promptInput"),
  predictButton: document.getElementById("predictButton"),
  generateButton: document.getElementById("generateButton"),
  nextTokenBars: document.getElementById("nextTokenBars"),
  generatedText: document.getElementById("generatedText")
};

// --- Section 1: query/key/value as weighted lookup -------------------------

function notice(text) {
  const el = document.createElement("div");
  el.className = "empty-state";
  el.textContent = text;
  return el;
}

function renderQkv() {
  if (!state.hasExploredQkv) {
    dom.qkvScores.replaceChildren(notice("Pick a query token above to see how much it attends to each token."));
    dom.qkvFormula.textContent = "";
    dom.qkvOutput.replaceChildren(notice("The blended output vector appears once you pick a query token."));
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

  dom.qkvFormula.textContent = `For query "${queryWord}": score(key) = (q · k) / \u221a${DIM}, then softmax turns the scores into the weights above.`;

  // Output readout: dominant contributors + the blended value vector.
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
}

// --- Section 2: the full self-attention heatmap ----------------------------

function renderHeatmap() {
  const causal = state.causal;
  const grid = dom.heatmap;
  grid.replaceChildren();
  if (!state.hasViewedHeatmap) {
    dom.heatmapStatus.textContent = "toggle the mask";
    grid.style.gridTemplateColumns = "1fr";
    grid.append(notice("Toggle the causal mask to build the attention map for every token at once."));
    return;
  }
  dom.heatmapStatus.textContent = causal ? "causal mask on" : "full attention";
  grid.style.gridTemplateColumns = `auto repeat(${TOKENS.length}, 1fr)`;

  // top-left corner
  const corner = document.createElement("div");
  corner.className = "heat-corner";
  corner.textContent = "query \\ key";
  grid.append(corner);
  // column headers (keys)
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
        // Normalize color by the row's strongest weight so the dominant cell in
        // each row reads clearly, while the printed number stays the true percent.
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

// --- Section 4: real next-token probabilities via transformers.js ----------

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
    setModelStatus(`Could not load the model: ${error.message}. This section needs an internet connection the first time. The attention demos above still work offline.`, "error");
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
  dom.nextTokenBars.replaceChildren(makeNotice("Running a forward pass through the Transformer..."));
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
    dom.nextTokenBars.replaceChildren(makeNotice(`Prediction failed: ${error.message}`));
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
    const { tokenizer, model } = state.model;
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

function makeNotice(text) {
  const item = document.createElement("div");
  item.className = "empty-state";
  item.textContent = text;
  return item;
}

// --- wiring ----------------------------------------------------------------

function populateQuerySelect() {
  dom.querySelect.replaceChildren();
  TOKENS.forEach((tok, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1}. ${tok.word}`;
    dom.querySelect.append(option);
  });
  dom.querySelect.value = String(state.queryIndex);
}

function setCausal(value) {
  state.causal = value;
  if (dom.causalToggle) dom.causalToggle.checked = value;
  if (dom.causalToggleHeatmap) dom.causalToggleHeatmap.checked = value;
}

function wireEvents() {
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
  dom.causalToggleHeatmap.addEventListener("change", () => {
    state.hasViewedHeatmap = true;
    setCausal(dom.causalToggleHeatmap.checked);
    renderQkv();
    renderHeatmap();
  });
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
  populateQuerySelect();
  wireEvents();
  renderQkv();
  renderHeatmap();
  setupSectionSpy();
}

init();
