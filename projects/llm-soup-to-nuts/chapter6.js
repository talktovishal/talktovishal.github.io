// Chapter 6: Pretraining LLMs.
// Three self-contained interactives:
//   1. objective comparison: which tokens each training objective predicts;
//   2. a compute-optimal scaling-law explorer (Chinchilla-style approximation);
//   3. a GPU-memory calculator that shows why training must be sharded.
// All math runs in the browser with no downloads.

// --- shared helpers --------------------------------------------------------
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatBig(n) {
  if (n >= 1e12) return `${(n / 1e12).toFixed(n >= 1e13 ? 0 : 1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(n >= 1e10 ? 0 : 1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(Math.round(n));
}

function formatFlops(c) {
  const exp = Math.floor(Math.log10(c));
  const mantissa = c / Math.pow(10, exp);
  return `${mantissa.toFixed(1)} \u00d7 10^${exp} FLOPs`;
}

// --- Section 1: training objectives ---------------------------------------
const SENTENCE = ["the", "cat", "sat", "on", "the", "mat"];
// A fixed pseudo-random mask so the masked-LM view is stable across renders.
const MASKED_POSITIONS = new Set([1, 4]);

const state = {
  objective: "causal",
  causalPos: 3,
  computeExp: 21,
  sizeFraction: 0.5,
  memLogParams: 9, // 10^9 = 1B
  shardGpus: 1
};

const dom = {
  objectiveButtons: Array.from(document.querySelectorAll("[data-objective]")),
  causalControls: document.getElementById("causalControls"),
  causalPosSlider: document.getElementById("causalPosSlider"),
  causalPosLabel: document.getElementById("causalPosLabel"),
  objectiveRail: document.getElementById("objectiveRail"),
  objectiveExplain: document.getElementById("objectiveExplain"),

  computeSlider: document.getElementById("computeSlider"),
  computeLabel: document.getElementById("computeLabel"),
  sizeSlider: document.getElementById("sizeSlider"),
  sizeLabel: document.getElementById("sizeLabel"),
  scalingChart: document.getElementById("scalingChart"),
  scalingReadout: document.getElementById("scalingReadout"),

  memSlider: document.getElementById("memSlider"),
  memLabel: document.getElementById("memLabel"),
  shardSlider: document.getElementById("shardSlider"),
  shardLabel: document.getElementById("shardLabel"),
  memPanel: document.getElementById("memPanel")
};

function renderObjective() {
  const causal = state.objective === "causal";
  dom.causalControls.hidden = !causal;
  dom.objectiveRail.replaceChildren();
  SENTENCE.forEach((word, index) => {
    const chip = document.createElement("span");
    chip.className = "obj-chip";
    let role = "";
    if (causal) {
      if (index < state.causalPos) { chip.classList.add("is-context"); role = "context"; }
      else if (index === state.causalPos) { chip.classList.add("is-target"); role = "predict"; }
      else { chip.classList.add("is-hidden"); role = "future (hidden)"; }
    } else {
      if (MASKED_POSITIONS.has(index)) { chip.classList.add("is-target"); role = "predict"; }
      else { chip.classList.add("is-context"); role = "context"; }
    }
    const text = document.createElement("strong");
    text.textContent = (!causal && MASKED_POSITIONS.has(index)) ? "[mask]" : word;
    const tag = document.createElement("small");
    tag.textContent = role;
    chip.append(text, tag);
    dom.objectiveRail.append(chip);
  });

  if (causal) {
    const target = SENTENCE[state.causalPos];
    const context = SENTENCE.slice(0, state.causalPos).join(" ") || "(nothing yet)";
    dom.objectiveExplain.innerHTML = `<strong>Causal (GPT-style):</strong> predict <code>${target}</code> using only what came before it: <code>${context}</code>. The model never sees future tokens, so the trained model can generate left to right.`;
  } else {
    dom.objectiveExplain.innerHTML = `<strong>Masked (BERT-style):</strong> hide a few tokens, then predict each <code>[mask]</code> from every other token on <em>both</em> sides. This is great for understanding a whole sentence, but it does not directly give a left-to-right generator.`;
  }
}

// --- Section 2: scaling laws (Chinchilla-style approximation) ---------------
// L(N, D) = E + A / N^alpha + B / D^beta, with C ~= 6 N D.
// Using equal exponents makes the compute-optimal ratio D/N a constant, tuned
// here to the famous Chinchilla guideline of roughly 20 tokens per parameter.
const SCALE = { E: 1.69, A: 400, alpha: 0.34, B: 1108, beta: 0.34 };
const D_MIN = 1e8;
const D_MAX = 2e13;

function predictedLoss(N, D) {
  return SCALE.E + SCALE.A / Math.pow(N, SCALE.alpha) + SCALE.B / Math.pow(D, SCALE.beta);
}

// For a fixed compute budget C, model size N is chosen along the isocompute
// curve D = C / (6N). Returns the valid log10(N) range for that budget.
function sizeRangeForCompute(C) {
  const logNmin = Math.log10(C / (6 * D_MAX));
  const logNmax = Math.log10(C / (6 * D_MIN));
  return { logNmin, logNmax };
}

function scalingPointFromFraction(C, fraction) {
  const { logNmin, logNmax } = sizeRangeForCompute(C);
  const logN = logNmin + clamp(fraction, 0, 1) * (logNmax - logNmin);
  const N = Math.pow(10, logN);
  const D = C / (6 * N);
  return { N, D, logN, loss: predictedLoss(N, D) };
}

function optimalForCompute(C) {
  const { logNmin, logNmax } = sizeRangeForCompute(C);
  let best = null;
  const steps = 160;
  for (let i = 0; i <= steps; i += 1) {
    const f = i / steps;
    const point = scalingPointFromFraction(C, f);
    if (!best || point.loss < best.loss) best = { ...point, fraction: f };
  }
  return { ...best, logNmin, logNmax };
}

function renderScaling() {
  const C = Math.pow(10, state.computeExp);
  const chosen = scalingPointFromFraction(C, state.sizeFraction);
  const optimal = optimalForCompute(C);
  dom.computeLabel.textContent = formatFlops(C);
  dom.sizeLabel.textContent = `${formatBig(chosen.N)} params`;

  // Build the loss curve along the isocompute line.
  const { logNmin, logNmax } = optimal;
  const points = [];
  const steps = 80;
  for (let i = 0; i <= steps; i += 1) {
    const f = i / steps;
    const p = scalingPointFromFraction(C, f);
    points.push({ f, logN: p.logN, loss: p.loss });
  }
  const losses = points.map((p) => p.loss);
  const minLoss = Math.min(...losses);
  const maxLoss = Math.max(...losses);

  const W = 520;
  const H = 240;
  const padL = 46;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const xOf = (logN) => padL + ((logN - logNmin) / (logNmax - logNmin)) * (W - padL - padR);
  const yOf = (loss) => padT + ((loss - minLoss) / Math.max(1e-6, maxLoss - minLoss)) * (H - padT - padB);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "scaling-svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Predicted loss along a fixed compute budget as model size changes.");

  // axes
  const axis = document.createElementNS(svgNS, "path");
  axis.setAttribute("d", `M${padL},${padT} L${padL},${H - padB} L${W - padR},${H - padB}`);
  axis.setAttribute("class", "scaling-axis");
  svg.append(axis);
  const yLabel = document.createElementNS(svgNS, "text");
  yLabel.setAttribute("x", padL - 8);
  yLabel.setAttribute("y", padT + 6);
  yLabel.setAttribute("class", "scaling-axis-label");
  yLabel.setAttribute("text-anchor", "end");
  yLabel.textContent = "loss";
  svg.append(yLabel);
  const xLabel = document.createElementNS(svgNS, "text");
  xLabel.setAttribute("x", W - padR);
  xLabel.setAttribute("y", H - padB + 28);
  xLabel.setAttribute("class", "scaling-axis-label");
  xLabel.setAttribute("text-anchor", "end");
  xLabel.textContent = "bigger model, less data \u2192";
  svg.append(xLabel);
  const xLabel2 = document.createElementNS(svgNS, "text");
  xLabel2.setAttribute("x", padL);
  xLabel2.setAttribute("y", H - padB + 28);
  xLabel2.setAttribute("class", "scaling-axis-label");
  xLabel2.setAttribute("text-anchor", "start");
  xLabel2.textContent = "\u2190 smaller model, more data";
  svg.append(xLabel2);

  // loss curve
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", points.map((p, i) => `${i ? "L" : "M"}${xOf(p.logN).toFixed(1)},${yOf(p.loss).toFixed(1)}`).join(" "));
  path.setAttribute("class", "scaling-curve");
  svg.append(path);

  // optimal marker (minimum loss)
  const optX = xOf(optimal.logN);
  const optY = yOf(optimal.loss);
  const optLine = document.createElementNS(svgNS, "line");
  optLine.setAttribute("x1", optX); optLine.setAttribute("y1", padT);
  optLine.setAttribute("x2", optX); optLine.setAttribute("y2", H - padB);
  optLine.setAttribute("class", "scaling-optimal-line");
  svg.append(optLine);
  const optDot = document.createElementNS(svgNS, "circle");
  optDot.setAttribute("cx", optX); optDot.setAttribute("cy", optY);
  optDot.setAttribute("r", 5); optDot.setAttribute("class", "scaling-optimal-dot");
  svg.append(optDot);

  // chosen marker
  const chX = xOf(chosen.logN);
  const chY = yOf(chosen.loss);
  const chDot = document.createElementNS(svgNS, "circle");
  chDot.setAttribute("cx", chX); chDot.setAttribute("cy", chY);
  chDot.setAttribute("r", 6); chDot.setAttribute("class", "scaling-chosen-dot");
  svg.append(chDot);

  dom.scalingChart.replaceChildren(svg);

  // readout
  const ratio = chosen.D / chosen.N;
  const optRatio = optimal.D / optimal.N;
  let verdict;
  if (ratio < optRatio * 0.5) verdict = "This model is too big for its data: it is undertrained. More tokens (or a smaller model) would lower the loss for the same compute.";
  else if (ratio > optRatio * 2) verdict = "This model is small for this much data. A bigger model would use the compute better.";
  else verdict = "This is close to compute-optimal: model size and data are balanced for this budget.";

  dom.scalingReadout.replaceChildren();
  const rows = [
    ["your model", `${formatBig(chosen.N)} params`],
    ["your data", `${formatBig(chosen.D)} tokens`],
    ["tokens per parameter", `${ratio.toFixed(1)} (optimal \u2248 ${optRatio.toFixed(0)})`],
    ["your predicted loss", chosen.loss.toFixed(3)],
    ["best possible at this budget", `${optimal.loss.toFixed(3)} at ${formatBig(optimal.N)} params`]
  ];
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "detail-row";
    const span = document.createElement("span");
    span.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = value;
    row.append(span, strong);
    dom.scalingReadout.append(row);
  });
  const note = document.createElement("p");
  note.className = "insight-note";
  note.textContent = verdict;
  dom.scalingReadout.append(note);
}

// --- Section 3: GPU memory calculator --------------------------------------
const GPU_GB = 80; // an 80 GB data-center GPU
const BYTES_PER_PARAM = {
  weights: 2,   // fp16 weights
  grads: 2,     // fp16 gradients
  optimizer: 8, // Adam: fp32 momentum + variance
  master: 4     // fp32 master copy of weights
};

function renderMemory() {
  const N = Math.pow(10, state.memLogParams);
  const shards = state.shardGpus;
  dom.memLabel.textContent = `${formatBig(N)} params`;
  dom.shardLabel.textContent = `${shards} GPU${shards === 1 ? "" : "s"}`;

  const bytesPerParam = Object.values(BYTES_PER_PARAM).reduce((s, b) => s + b, 0);
  const totalBytes = N * bytesPerParam;
  const totalGB = totalBytes / 1e9;
  const perGpuGB = totalGB / shards;
  const gpusNeeded = Math.ceil(totalGB / GPU_GB);

  dom.memPanel.replaceChildren();
  const breakdown = [
    ["fp16 weights", (N * BYTES_PER_PARAM.weights) / 1e9],
    ["fp16 gradients", (N * BYTES_PER_PARAM.grads) / 1e9],
    ["Adam state (momentum + variance)", (N * BYTES_PER_PARAM.optimizer) / 1e9],
    ["fp32 master weights", (N * BYTES_PER_PARAM.master) / 1e9]
  ];
  breakdown.forEach(([label, gb]) => {
    const row = document.createElement("div");
    row.className = "detail-row";
    const span = document.createElement("span");
    span.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = `${gb.toFixed(gb >= 10 ? 0 : 1)} GB`;
    row.append(span, strong);
    dom.memPanel.append(row);
  });

  const totalRow = document.createElement("div");
  totalRow.className = "detail-row is-total";
  const tSpan = document.createElement("span");
  tSpan.textContent = "total training memory";
  const tStrong = document.createElement("strong");
  tStrong.textContent = `${totalGB.toFixed(totalGB >= 10 ? 0 : 1)} GB`;
  totalRow.append(tSpan, tStrong);
  dom.memPanel.append(totalRow);

  const note = document.createElement("p");
  note.className = "insight-note";
  if (totalGB <= GPU_GB) {
    note.textContent = `This fits on a single ${GPU_GB} GB GPU, with about ${perGpuGB.toFixed(1)} GB per GPU after sharding across ${shards}. Note that weights are only a small slice; the optimizer state is the heavy part.`;
  } else {
    note.textContent = `Training needs about ${totalGB.toFixed(0)} GB, which is ${gpusNeeded} GPUs' worth just to hold the state. Sharding across ${shards} GPUs drops it to ${perGpuGB.toFixed(1)} GB each. This is exactly why ZeRO and FSDP split weights, gradients, and optimizer state across many GPUs.`;
  }
  dom.memPanel.append(note);
}

// --- wiring ----------------------------------------------------------------
function setObjective(value) {
  state.objective = value;
  dom.objectiveButtons.forEach((btn) => btn.classList.toggle("is-active", btn.dataset.objective === value));
  renderObjective();
}

function wireEvents() {
  dom.objectiveButtons.forEach((btn) => {
    btn.addEventListener("click", () => setObjective(btn.dataset.objective));
  });
  dom.causalPosSlider.addEventListener("input", () => {
    state.causalPos = Number(dom.causalPosSlider.value);
    dom.causalPosLabel.textContent = `position ${state.causalPos + 1}`;
    renderObjective();
  });
  dom.computeSlider.addEventListener("input", () => {
    state.computeExp = Number(dom.computeSlider.value);
    renderScaling();
  });
  dom.sizeSlider.addEventListener("input", () => {
    state.sizeFraction = Number(dom.sizeSlider.value) / 100;
    renderScaling();
  });
  dom.memSlider.addEventListener("input", () => {
    state.memLogParams = Number(dom.memSlider.value) / 10;
    renderMemory();
  });
  dom.shardSlider.addEventListener("input", () => {
    state.shardGpus = Number(dom.shardSlider.value);
    renderMemory();
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
  wireEvents();
  setObjective("causal");
  state.causalPos = Number(dom.causalPosSlider.value);
  dom.causalPosLabel.textContent = `position ${state.causalPos + 1}`;
  state.sizeFraction = Number(dom.sizeSlider.value) / 100;
  renderScaling();
  state.memLogParams = Number(dom.memSlider.value) / 10;
  renderMemory();
  setupSectionSpy();
}

init();
