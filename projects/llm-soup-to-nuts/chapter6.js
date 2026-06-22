// Chapter 6: Training and alignment.
// Interactive panels for the full training arc:
// stages, teacher forcing, scaling laws, memory, evaluation, preferences, and test-time compute.

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function formatBig(n) {
  if (n >= 1e12) return `${(n / 1e12).toFixed(n >= 10e12 ? 0 : 1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(n >= 10e9 ? 0 : 1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 10e6 ? 0 : 1)}M`;
  return `${Math.round(n).toLocaleString()}`;
}

function formatRatio(n) {
  if (n >= 10) return n.toFixed(0);
  if (n >= 1) return n.toFixed(1);
  if (n >= 0.01) return n.toFixed(2);
  return n.toExponential(1);
}

function formatFlops(c) {
  const exp = Math.floor(Math.log10(c));
  const mantissa = c / Math.pow(10, exp);
  return `${mantissa.toFixed(1)}e${exp} FLOPs`;
}

function notice(text) {
  const el = document.createElement("div");
  el.className = "empty-state";
  el.textContent = text;
  return el;
}

function detailRow(label, value) {
  const row = document.createElement("div");
  row.className = "detail-row";
  const span = document.createElement("span");
  span.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value;
  row.append(span, strong);
  return row;
}

const state = {
  stage: "pretraining",
  teacherStep: 2,
  computeExp: 21,
  sizeFraction: 0.5,
  memLogParams: 9,
  shardGpus: 1,
  evalLoss: 1.2,
  rewardDiff: 1.5,
  dpoBeta: 0.1,
  reasoningSteps: 3,
  hasScaled: false,
  hasMemory: false
};

const dom = {};
function grab(id) { return document.getElementById(id); }

// ---------------------------------------------------------------------------
// Stage map
// ---------------------------------------------------------------------------

const STAGES = {
  pretraining: {
    title: "Pretraining",
    body: "The model reads huge token streams and pays cross-entropy loss on the real next token. The text supplies its own labels.",
    signal: "Self-supervised next-token prediction.",
    output: "A base model: broad and powerful, but not yet trained to reliably follow instructions."
  },
  sft: {
    title: "Instruction tuning",
    body: "The base model continues training on request-and-response examples. The loss is still next-token cross-entropy, but the data now carries a desired response.",
    signal: "Supervised examples of what a good answer looks like.",
    output: "A model that better understands instructions, formats, and conversational roles."
  },
  preference: {
    title: "Preference alignment",
    body: "The model sees prompts with preferred and rejected outputs. The training pressure increases likelihood for preferred responses while keeping the policy close to a reference model.",
    signal: "Chosen vs rejected responses, rankings, or scalar preference ratings.",
    output: "A model nudged toward helpful, honest, harmless behavior, though evaluation still matters."
  },
  testtime: {
    title: "Test-time compute",
    body: "The weights stay fixed. We spend extra inference tokens or passes, for example by asking for step-by-step reasoning before the final answer.",
    signal: "More computation during generation, not more parameter updates.",
    output: "Potentially better reasoning on hard tasks, with higher latency and token cost."
  }
};

function renderStage() {
  document.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.stage === state.stage);
  });
  const item = STAGES[state.stage];
  dom.stageReadout.replaceChildren(
    detailRow("stage", item.title),
    detailRow("training signal", item.signal),
    detailRow("what changes", item.output)
  );
  const p = document.createElement("p");
  p.className = "insight-note";
  p.textContent = item.body;
  dom.stageReadout.append(p);
}

// ---------------------------------------------------------------------------
// Teacher forcing trace
// ---------------------------------------------------------------------------

const TRAIN_TOKENS = ["So", "long", "and", "thanks", "for", "all"];
const TRAIN_PROBS = [0.5, 0.4, 0.25, 0.35, 0.44];

function renderTeacher() {
  const step = Number(dom.teacherStepSlider.value);
  state.teacherStep = step;
  dom.teacherStepLabel.textContent = `position ${step + 1}`;
  const prefix = TRAIN_TOKENS.slice(0, step + 1);
  const target = TRAIN_TOKENS[step + 1];
  const probability = TRAIN_PROBS[step];
  const loss = -Math.log(probability);
  dom.teacherTrace.replaceChildren();

  const rail = document.createElement("div");
  rail.className = "token-rail";
  TRAIN_TOKENS.forEach((token, index) => {
    const chip = document.createElement("span");
    chip.className = "token-chip";
    if (index <= step) chip.classList.add("is-context");
    if (index === step + 1) chip.classList.add("is-target");
    chip.textContent = token;
    rail.append(chip);
  });
  dom.teacherTrace.append(rail);
  dom.teacherTrace.append(
    detailRow("true prefix", prefix.join(" ")),
    detailRow("target token", target),
    detailRow("model probability on target", probability.toFixed(2)),
    detailRow("loss for this position", `${loss.toFixed(2)} nats`)
  );
  const note = document.createElement("p");
  note.className = "microcopy";
  note.textContent = "Teacher forcing means the next training row uses the true corpus history, even if the model would have guessed wrong here.";
  dom.teacherTrace.append(note);
}

// ---------------------------------------------------------------------------
// Scaling laws
// ---------------------------------------------------------------------------

const SCALE = { E: 1.69, A: 400, alpha: 0.34, B: 1108, beta: 0.34 };
const D_MIN = 1e8;
const D_MAX = 2e13;

function predictedLoss(N, D) {
  return SCALE.E + SCALE.A / Math.pow(N, SCALE.alpha) + SCALE.B / Math.pow(D, SCALE.beta);
}

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
  let best = null;
  for (let i = 0; i <= 180; i += 1) {
    const p = scalingPointFromFraction(C, i / 180);
    if (!best || p.loss < best.loss) best = { ...p, fraction: i / 180 };
  }
  return best;
}

function renderScaling() {
  const C = Math.pow(10, Number(dom.computeSlider.value));
  state.computeExp = Number(dom.computeSlider.value);
  state.sizeFraction = Number(dom.sizeSlider.value) / 100;
  const chosen = scalingPointFromFraction(C, state.sizeFraction);
  const optimal = optimalForCompute(C);
  dom.computeLabel.textContent = formatFlops(C);
  dom.sizeLabel.textContent = formatBig(chosen.N);

  if (!state.hasScaled) {
    dom.scalingChart.replaceChildren(notice("Move the compute or model-size slider to plot the loss curve and find the compute-optimal point."));
    dom.scalingReadout.replaceChildren();
    return;
  }

  const { logNmin, logNmax } = sizeRangeForCompute(C);
  const points = [];
  for (let i = 0; i <= 90; i += 1) points.push(scalingPointFromFraction(C, i / 90));
  const losses = points.map((p) => p.loss);
  const minLoss = Math.min(...losses);
  const maxLoss = Math.max(...losses);
  const W = 540;
  const H = 250;
  const padL = 48;
  const padR = 18;
  const padT = 18;
  const padB = 42;
  const xOf = (logN) => padL + ((logN - logNmin) / (logNmax - logNmin)) * (W - padL - padR);
  const yOf = (loss) => padT + ((loss - minLoss) / Math.max(1e-6, maxLoss - minLoss)) * (H - padT - padB);
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "scaling-svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Predicted loss along a fixed compute budget as model size changes.");

  const axis = document.createElementNS(svgNS, "path");
  axis.setAttribute("d", `M${padL},${padT} V${H - padB} H${W - padR}`);
  axis.setAttribute("class", "scaling-axis");
  svg.append(axis);

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", points.map((p, i) => `${i ? "L" : "M"}${xOf(p.logN).toFixed(1)},${yOf(p.loss).toFixed(1)}`).join(" "));
  path.setAttribute("class", "scaling-curve");
  svg.append(path);

  const optLine = document.createElementNS(svgNS, "line");
  optLine.setAttribute("x1", xOf(optimal.logN));
  optLine.setAttribute("x2", xOf(optimal.logN));
  optLine.setAttribute("y1", padT);
  optLine.setAttribute("y2", H - padB);
  optLine.setAttribute("class", "scaling-optimal-line");
  svg.append(optLine);

  const optDot = document.createElementNS(svgNS, "circle");
  optDot.setAttribute("cx", xOf(optimal.logN));
  optDot.setAttribute("cy", yOf(optimal.loss));
  optDot.setAttribute("r", 5);
  optDot.setAttribute("class", "scaling-optimal-dot");
  svg.append(optDot);

  const chosenDot = document.createElementNS(svgNS, "circle");
  chosenDot.setAttribute("cx", xOf(chosen.logN));
  chosenDot.setAttribute("cy", yOf(chosen.loss));
  chosenDot.setAttribute("r", 6);
  chosenDot.setAttribute("class", "scaling-chosen-dot");
  svg.append(chosenDot);

  const xLabel = document.createElementNS(svgNS, "text");
  xLabel.setAttribute("x", W / 2);
  xLabel.setAttribute("y", H - 12);
  xLabel.setAttribute("class", "scaling-axis-label");
  xLabel.setAttribute("text-anchor", "middle");
  xLabel.textContent = "model size along a fixed compute budget";
  svg.append(xLabel);

  const yLabel = document.createElementNS(svgNS, "text");
  yLabel.setAttribute("x", 16);
  yLabel.setAttribute("y", 24);
  yLabel.setAttribute("class", "scaling-axis-label");
  yLabel.textContent = "loss";
  svg.append(yLabel);

  dom.scalingChart.replaceChildren(svg);
  dom.scalingReadout.replaceChildren(
    detailRow("your model", `${formatBig(chosen.N)} params`),
    detailRow("your data", `${formatBig(chosen.D)} tokens`),
    detailRow("tokens per parameter", `${formatRatio(chosen.D / chosen.N)} (optimal near ${formatRatio(optimal.D / optimal.N)})`),
    detailRow("your predicted loss", chosen.loss.toFixed(3)),
    detailRow("best loss at this budget", `${optimal.loss.toFixed(3)} at ${formatBig(optimal.N)} params`)
  );
  const verdict = document.createElement("p");
  verdict.className = "insight-note";
  const ratio = chosen.D / chosen.N;
  const optRatio = optimal.D / optimal.N;
  if (ratio < optRatio * 0.5) verdict.textContent = "This model is too big for its data. More tokens, or a smaller model, would use the same compute better.";
  else if (ratio > optRatio * 2) verdict.textContent = "This model is small for this much data. A bigger model would use the compute better.";
  else verdict.textContent = "This is close to compute-optimal: model size and data are balanced for this budget.";
  dom.scalingReadout.append(verdict);
}

// ---------------------------------------------------------------------------
// Memory
// ---------------------------------------------------------------------------

const GPU_GB = 80;
const BYTES_PER_PARAM = {
  weights: 2,
  gradients: 2,
  adam: 8,
  master: 4
};

function renderMemory() {
  const N = Math.pow(10, Number(dom.memSlider.value) / 10);
  const shards = Number(dom.shardSlider.value);
  state.memLogParams = Number(dom.memSlider.value) / 10;
  state.shardGpus = shards;
  dom.memLabel.textContent = `${formatBig(N)} params`;
  dom.shardLabel.textContent = `${shards} GPU${shards === 1 ? "" : "s"}`;

  if (!state.hasMemory) {
    dom.memPanel.replaceChildren(notice("Move the model-size or sharding slider to see how training memory splits across GPUs."));
    return;
  }

  const bytesPerParam = Object.values(BYTES_PER_PARAM).reduce((s, b) => s + b, 0);
  const totalGB = (N * bytesPerParam) / 1e9;
  const perGpuGB = totalGB / shards;
  const gpusNeeded = Math.ceil(totalGB / GPU_GB);
  dom.memPanel.replaceChildren(
    detailRow("weights", `${((N * BYTES_PER_PARAM.weights) / 1e9).toFixed(1)} GB`),
    detailRow("gradients", `${((N * BYTES_PER_PARAM.gradients) / 1e9).toFixed(1)} GB`),
    detailRow("Adam state", `${((N * BYTES_PER_PARAM.adam) / 1e9).toFixed(1)} GB`),
    detailRow("master weights", `${((N * BYTES_PER_PARAM.master) / 1e9).toFixed(1)} GB`),
    detailRow("total training state", `${totalGB.toFixed(1)} GB`),
    detailRow("per GPU after sharding", `${perGpuGB.toFixed(1)} GB`),
    detailRow("80GB GPUs for state alone", `${gpusNeeded}`)
  );
  const note = document.createElement("p");
  note.className = "insight-note";
  note.textContent = perGpuGB <= GPU_GB
    ? "The parameter state fits under 80GB per GPU, but activations and buffers still need room."
    : "Even after sharding, the parameter state alone is over 80GB per GPU. More sharding or memory-saving techniques are needed.";
  dom.memPanel.append(note);
}

// ---------------------------------------------------------------------------
// Evaluation and safety
// ---------------------------------------------------------------------------

function renderEvaluation() {
  const loss = Number(dom.evalLossSlider.value);
  state.evalLoss = loss;
  const ppl = Math.exp(loss);
  dom.evalLossLabel.textContent = loss.toFixed(1);
  dom.evalPanel.replaceChildren();
  [
    ["Average loss", `${loss.toFixed(2)} nats`],
    ["Perplexity", `${ppl.toFixed(1)} tokens`],
    ["Plain meaning", `roughly ${ppl.toFixed(1)} effective choices`]
  ].forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "metric-card";
    const strong = document.createElement("strong");
    strong.textContent = value;
    const span = document.createElement("span");
    span.textContent = label;
    card.append(strong, span);
    dom.evalPanel.append(card);
  });
  dom.evalNarrative.textContent = "Use perplexity for same-tokenizer language-model comparisons. For assistants, pair it with task benchmarks, contamination checks, latency, fairness, and safety evaluations.";
}

// ---------------------------------------------------------------------------
// Preferences and DPO
// ---------------------------------------------------------------------------

function renderPreference() {
  const diff = Number(dom.rewardDiffSlider.value);
  const beta = Number(dom.dpoBetaSlider.value);
  state.rewardDiff = diff;
  state.dpoBeta = beta;
  dom.rewardDiffLabel.textContent = diff.toFixed(1);
  dom.dpoBetaLabel.textContent = beta.toFixed(2);
  const p = sigmoid(diff);
  const scaled = sigmoid(beta * diff);

  dom.preferencePanel.replaceChildren();
  const meter = document.createElement("div");
  meter.className = "preference-meter";
  const fill = document.createElement("span");
  fill.style.width = `${clamp(p * 100, 0, 100)}%`;
  meter.append(fill);
  dom.preferencePanel.append(
    detailRow("P(chosen preferred)", `${(p * 100).toFixed(0)}%`),
    detailRow("reward gap", diff.toFixed(1)),
    meter
  );
  const note = document.createElement("p");
  note.className = "microcopy";
  note.textContent = diff > 0
    ? "The chosen response scores higher, so the preference probability is above 50%."
    : "The rejected response scores higher in this toy setting, so the preference probability falls below 50%.";
  dom.preferencePanel.append(note);

  dom.dpoPanel.replaceChildren(
    detailRow("beta", beta.toFixed(2)),
    detailRow("sigmoid(beta * gap)", `${(scaled * 100).toFixed(0)}%`),
    detailRow("training pressure", diff >= 0 ? "increase chosen likelihood" : "the pair disagrees with the chosen label")
  );
  const dpoNote = document.createElement("p");
  dpoNote.className = "insight-note";
  dpoNote.textContent = "Larger beta makes the preference term bite harder, but the reference-model ratio still keeps the trained policy from drifting without limit.";
  dom.dpoPanel.append(dpoNote);
}

// ---------------------------------------------------------------------------
// Test-time compute
// ---------------------------------------------------------------------------

function renderTestTime() {
  const steps = Number(dom.reasoningStepsSlider.value);
  state.reasoningSteps = steps;
  dom.reasoningStepsLabel.textContent = String(steps);
  const answerOnly = 18;
  const stepTokens = steps * 14;
  const total = answerOnly + stepTokens;
  dom.testTimePanel.replaceChildren(
    detailRow("answer-only tokens", `${answerOnly}`),
    detailRow("reasoning tokens", `${stepTokens}`),
    detailRow("total output budget", `${total}`),
    detailRow("tradeoff", steps === 0 ? "fast, little intermediate reasoning" : "slower, more room for reasoning")
  );
  const trace = document.createElement("div");
  trace.className = "reasoning-trace";
  if (steps === 0) {
    trace.append(notice("No intermediate reasoning. The model jumps straight to the answer."));
  } else {
    for (let i = 1; i <= steps; i += 1) {
      const row = document.createElement("span");
      row.textContent = `Step ${i}`;
      trace.append(row);
    }
    const final = document.createElement("strong");
    final.textContent = "Final answer";
    trace.append(final);
  }
  dom.testTimePanel.append(trace);
}

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------

function wireEvents() {
  document.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.stage = btn.dataset.stage;
      renderStage();
    });
  });

  dom.teacherStepSlider.addEventListener("input", () => renderTeacher());
  dom.computeSlider.addEventListener("input", () => { state.hasScaled = true; renderScaling(); });
  dom.sizeSlider.addEventListener("input", () => { state.hasScaled = true; renderScaling(); });
  dom.memSlider.addEventListener("input", () => { state.hasMemory = true; renderMemory(); });
  dom.shardSlider.addEventListener("input", () => { state.hasMemory = true; renderMemory(); });
  dom.evalLossSlider.addEventListener("input", () => renderEvaluation());
  dom.rewardDiffSlider.addEventListener("input", () => renderPreference());
  dom.dpoBetaSlider.addEventListener("input", () => renderPreference());
  dom.reasoningStepsSlider.addEventListener("input", () => renderTestTime());
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
    stageReadout: grab("stageReadout"),
    teacherStepSlider: grab("teacherStepSlider"),
    teacherStepLabel: grab("teacherStepLabel"),
    teacherTrace: grab("teacherTrace"),
    computeSlider: grab("computeSlider"),
    computeLabel: grab("computeLabel"),
    sizeSlider: grab("sizeSlider"),
    sizeLabel: grab("sizeLabel"),
    scalingChart: grab("scalingChart"),
    scalingReadout: grab("scalingReadout"),
    memSlider: grab("memSlider"),
    memLabel: grab("memLabel"),
    shardSlider: grab("shardSlider"),
    shardLabel: grab("shardLabel"),
    memPanel: grab("memPanel"),
    evalLossSlider: grab("evalLossSlider"),
    evalLossLabel: grab("evalLossLabel"),
    evalPanel: grab("evalPanel"),
    evalNarrative: grab("evalNarrative"),
    rewardDiffSlider: grab("rewardDiffSlider"),
    rewardDiffLabel: grab("rewardDiffLabel"),
    dpoBetaSlider: grab("dpoBetaSlider"),
    dpoBetaLabel: grab("dpoBetaLabel"),
    preferencePanel: grab("preferencePanel"),
    dpoPanel: grab("dpoPanel"),
    reasoningStepsSlider: grab("reasoningStepsSlider"),
    reasoningStepsLabel: grab("reasoningStepsLabel"),
    testTimePanel: grab("testTimePanel")
  });

  wireEvents();
  renderStage();
  renderTeacher();
  renderScaling();
  renderMemory();
  renderEvaluation();
  renderPreference();
  renderTestTime();
  setupSectionSpy();
}

init();
