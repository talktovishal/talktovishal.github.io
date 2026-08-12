const dom = {
  probabilityContextSelect: document.getElementById("probabilityContextSelect"),
  probabilityContextLabel: document.getElementById("probabilityContextLabel"),
  countSliders: [
    document.getElementById("countA"),
    document.getElementById("countB"),
    document.getElementById("countC")
  ],
  countLabels: [
    document.getElementById("countALabel"),
    document.getElementById("countBLabel"),
    document.getElementById("countCLabel")
  ],
  countValues: [
    document.getElementById("countAValue"),
    document.getElementById("countBValue"),
    document.getElementById("countCValue")
  ],
  guessSliders: [
    document.getElementById("guessA"),
    document.getElementById("guessB"),
    document.getElementById("guessC")
  ],
  guessLabels: [
    document.getElementById("guessALabel"),
    document.getElementById("guessBLabel"),
    document.getElementById("guessCLabel")
  ],
  guessValues: [
    document.getElementById("guessAValue"),
    document.getElementById("guessBValue"),
    document.getElementById("guessCValue")
  ],
  probabilityPanel: document.getElementById("probabilityPanel"),
  entropyPanel: document.getElementById("entropyPanel"),
  entropyLabel: document.getElementById("entropyLabel"),
  entropyNarrative: document.getElementById("entropyNarrative"),
  vectorAx: document.getElementById("vectorAx"),
  vectorAy: document.getElementById("vectorAy"),
  vectorBx: document.getElementById("vectorBx"),
  vectorBy: document.getElementById("vectorBy"),
  vectorSvg: document.getElementById("vectorSvg"),
  vectorSummary: document.getElementById("vectorSummary"),
  dotProductLabel: document.getElementById("dotProductLabel"),
  vectorMetrics: document.getElementById("vectorMetrics"),
  embeddingLookupSelect: document.getElementById("embeddingLookupSelect"),
  embeddingLookupPanel: document.getElementById("embeddingLookupPanel"),
  slopeSlider: document.getElementById("slopeSlider"),
  interceptSlider: document.getElementById("interceptSlider"),
  lineRateSlider: document.getElementById("lineRateSlider"),
  slopeLabel: document.getElementById("slopeLabel"),
  interceptLabel: document.getElementById("interceptLabel"),
  lineRateLabel: document.getElementById("lineRateLabel"),
  gradientStepButton: document.getElementById("gradientStepButton"),
  gradientAutoButton: document.getElementById("gradientAutoButton"),
  gradientResetButton: document.getElementById("gradientResetButton"),
  lineFitSvg: document.getElementById("lineFitSvg"),
  gradientStatus: document.getElementById("gradientStatus"),
  gradientMetrics: document.getElementById("gradientMetrics"),
  gradientExplanation: document.getElementById("gradientExplanation"),
  gradientRunNote: document.getElementById("gradientRunNote"),
  gradientStepTitle: document.getElementById("gradient-step-title"),
  gradientStepCopy: document.getElementById("gradientStepCopy"),
  gradientStepCount: document.getElementById("gradientStepCount"),
  gradientStepPanel: document.getElementById("gradientStepPanel"),
  gradientBackButton: document.getElementById("gradientBackButton"),
  gradientPlayButton: document.getElementById("gradientPlayButton"),
  gradientNextButton: document.getElementById("gradientNextButton"),
  gradientReplayButton: document.getElementById("gradientReplayButton"),
  gradientStepButtons: Array.from(document.querySelectorAll("[data-gradient-step]")),
  logitA: document.getElementById("logitA"),
  logitB: document.getElementById("logitB"),
  logitC: document.getElementById("logitC"),
  temperatureSlider: document.getElementById("temperatureSlider"),
  logitALabel: document.getElementById("logitALabel"),
  logitBLabel: document.getElementById("logitBLabel"),
  logitCLabel: document.getElementById("logitCLabel"),
  temperatureLabel: document.getElementById("temperatureLabel"),
  softmaxTempLabel: document.getElementById("softmaxTempLabel"),
  softmaxLossLabel: document.getElementById("softmaxLossLabel"),
  correctClassSelect: document.getElementById("correctClassSelect"),
  softmaxPanel: document.getElementById("softmaxPanel"),
  softmaxNarrative: document.getElementById("softmaxNarrative"),
  softmaxStepTitle: document.getElementById("softmax-step-title"),
  softmaxStepCopy: document.getElementById("softmaxStepCopy"),
  softmaxStepCount: document.getElementById("softmaxStepCount"),
  softmaxStepPanel: document.getElementById("softmaxStepPanel"),
  softmaxBackButton: document.getElementById("softmaxBackButton"),
  softmaxPlayButton: document.getElementById("softmaxPlayButton"),
  softmaxNextButton: document.getElementById("softmaxNextButton"),
  softmaxReplayButton: document.getElementById("softmaxReplayButton"),
  softmaxStepButtons: Array.from(document.querySelectorAll("[data-softmax-step]")),
  forwardCtxA: document.getElementById("forwardCtxA"),
  forwardCtxB: document.getElementById("forwardCtxB"),
  activationSelect: document.getElementById("activationSelect"),
  forwardCtxAReadout: document.getElementById("forwardCtxAReadout"),
  forwardCtxBReadout: document.getElementById("forwardCtxBReadout"),
  forwardActivationReadout: document.getElementById("forwardActivationReadout"),
  networkSvg: document.getElementById("networkSvg"),
  forwardSummary: document.getElementById("forwardSummary"),
  forwardPanel: document.getElementById("forwardPanel"),
  matrixMultiplyPanel: document.getElementById("matrixMultiplyPanel"),
  scoringRolesPanel: document.getElementById("scoringRolesPanel"),
  forwardStepTitle: document.getElementById("forward-step-title"),
  forwardStepCopy: document.getElementById("forwardStepCopy"),
  forwardStepCount: document.getElementById("forwardStepCount"),
  forwardDetailBadge: document.getElementById("forwardDetailBadge"),
  forwardBackButton: document.getElementById("forwardBackButton"),
  forwardPlayButton: document.getElementById("forwardPlayButton"),
  forwardNextButton: document.getElementById("forwardNextButton"),
  forwardReplayButton: document.getElementById("forwardReplayButton"),
  forwardStepButtons: Array.from(document.querySelectorAll("[data-forward-step]")),
  backpropCtxA: document.getElementById("backpropCtxA"),
  backpropCtxB: document.getElementById("backpropCtxB"),
  backpropTrueWord: document.getElementById("backpropTrueWord"),
  backpropActivation: document.getElementById("backpropActivation"),
  backpropRateSlider: document.getElementById("backpropRateSlider"),
  backpropRateLabel: document.getElementById("backpropRateLabel"),
  backpropStepButton: document.getElementById("backpropStepButton"),
  backpropResetButton: document.getElementById("backpropResetButton"),
  backpropSvg: document.getElementById("backpropSvg"),
  backpropSummary: document.getElementById("backpropSummary"),
  backpropMetrics: document.getElementById("backpropMetrics"),
  backpropLossSpark: document.getElementById("backpropLossSpark"),
  backpropTracePanel: document.getElementById("backpropTracePanel"),
  byHandLab: document.getElementById("byHandLab"),
  byHandProgress: document.getElementById("byHandProgress"),
  byHandSvg: document.getElementById("byHandSvg"),
  byHandMiniFacts: document.getElementById("byHandMiniFacts"),
  byHandStepTag: document.getElementById("byHandStepTag"),
  byHandPrompt: document.getElementById("byHandPrompt"),
  byHandInstruction: document.getElementById("byHandInstruction"),
  byHandEquation: document.getElementById("byHandEquation"),
  byHandAnswer: document.getElementById("byHandAnswer"),
  byHandFeedback: document.getElementById("byHandFeedback"),
  byHandHintPanel: document.getElementById("byHandHintPanel"),
  byHandCheckButton: document.getElementById("byHandCheckButton"),
  byHandHintButton: document.getElementById("byHandHintButton"),
  byHandSolutionButton: document.getElementById("byHandSolutionButton"),
  byHandPrevButton: document.getElementById("byHandPrevButton"),
  byHandNextButton: document.getElementById("byHandNextButton"),
  byHandResetButton: document.getElementById("byHandResetButton"),
  datasetSelect: document.getElementById("datasetSelect"),
  hiddenUnitsSlider: document.getElementById("hiddenUnitsSlider"),
  hiddenUnitsLabel: document.getElementById("hiddenUnitsLabel"),
  networkRateSlider: document.getElementById("networkRateSlider"),
  networkRateLabel: document.getElementById("networkRateLabel"),
  epochBatchSlider: document.getElementById("epochBatchSlider"),
  epochBatchLabel: document.getElementById("epochBatchLabel"),
  trainOneEpochButton: document.getElementById("trainOneEpochButton"),
  trainBatchButton: document.getElementById("trainBatchButton"),
  resetNetworkButton: document.getElementById("resetNetworkButton"),
  newDataButton: document.getElementById("newDataButton"),
  trainingProgress: document.getElementById("trainingProgress"),
  trainingProgressText: document.getElementById("trainingProgressText"),
  trainingProgressBar: document.getElementById("trainingProgressBar"),
  decisionCanvas: document.getElementById("decisionCanvas"),
  networkStatus: document.getElementById("networkStatus"),
  networkEpochLabel: document.getElementById("networkEpochLabel"),
  networkMetrics: document.getElementById("networkMetrics"),
  lossHistory: document.getElementById("lossHistory"),
  generalizationPanel: document.getElementById("generalizationPanel"),
  nwContextSelectA: document.getElementById("nwContextSelectA"),
  nwContextSelectB: document.getElementById("nwContextSelectB"),
  nwContextLabel: document.getElementById("nwContextLabel"),
  nwPredictPanel: document.getElementById("nwPredictPanel"),
  nwMetrics: document.getElementById("nwMetrics"),
  nwLossHistory: document.getElementById("nwLossHistory"),
  nwStatus: document.getElementById("nwStatus"),
  nwBudgetSelect: document.getElementById("nwBudgetSelect"),
  nwTempSlider: document.getElementById("nwTempSlider"),
  nwTempLabel: document.getElementById("nwTempLabel"),
  nwTrainButton: document.getElementById("nwTrainButton"),
  nwTrainStepButton: document.getElementById("nwTrainStepButton"),
  nwResetButton: document.getElementById("nwResetButton"),
  nwGenerateButton: document.getElementById("nwGenerateButton"),
  nwGeneratePanel: document.getElementById("nwGeneratePanel"),
  nwProgress: document.getElementById("nwProgress"),
  nwProgressText: document.getElementById("nwProgressText"),
  nwProgressBar: document.getElementById("nwProgressBar"),
  nwWatchPanel: document.getElementById("nwWatchPanel"),
  nwCorpusPreview: document.getElementById("nwCorpusPreview"),
  nwCorpusCount: document.getElementById("nwCorpusCount"),
  nwTrainingSentenceCount: document.getElementById("nwTrainingSentenceCount"),
  nwTrainingExampleCount: document.getElementById("nwTrainingExampleCount"),
  nwTrainingExampleCountInline: document.getElementById("nwTrainingExampleCountInline"),
  nwTrainingVocabCount: document.getElementById("nwTrainingVocabCount"),
  nwTrainingParamCount: document.getElementById("nwTrainingParamCount")
};

const probabilityPresets = {
  cat: {
    title: "the cat",
    labels: ["sat", "ran", "slept"],
    counts: [8, 3, 1],
    guesses: [55, 30, 15]
  },
  dog: {
    title: "the dog",
    labels: ["ran", "sat", "saw"],
    counts: [7, 5, 2],
    guesses: [40, 35, 25]
  },
  bird: {
    title: "the bird",
    labels: ["sat", "ran", "saw"],
    counts: [5, 4, 2],
    guesses: [55, 30, 15]
  }
};

const probabilityWordColors = {
  sat: "var(--teal)",
  ran: "var(--green)",
  slept: "var(--gold)",
  saw: "var(--violet)"
};

const embeddingRows = {
  cat: [0.70, -0.30],
  dog: [0.60, -0.20],
  mat: [-0.30, 0.70],
  rug: [-0.20, 0.60]
};

const lineData = [
  { x: -0.92, y: -0.54 },
  { x: -0.58, y: -0.18 },
  { x: -0.18, y: 0.06 },
  { x: 0.26, y: 0.31 },
  { x: 0.62, y: 0.68 },
  { x: 0.94, y: 0.88 }
];

const softmaxNames = ["sat", "ran", "slept"];

const state = {
  probabilityPreset: "cat",
  autoLineTimer: null,
  autoLineRun: null,
  network: null,
  data: null,
  dataSeed: 41,
  networkSeed: 17,
  networkHistory: [],
  networkTrainingRun: 0,
  isNetworkTraining: false,
  hasExploredProbability: true,
  hasExploredGradient: false,
  hasTrainedNetwork: false,
  gradientWalkthroughStep: 0,
  gradientWalkthroughTimer: null,
  softmaxStep: 0,
  softmaxPlayTimer: null,
  forwardFocus: null,
  forwardCandidateFocus: null,
  forwardStep: 0,
  forwardPlayTimer: null,
  backprop: null,
  byHand: { index: 0, hints: {}, solved: {}, revealed: {}, answers: {}, feedback: {} }
};

function formatNumber(value, digits = 3) {
  if (!Number.isFinite(value)) return "n/a";
  return Number(value).toFixed(digits);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "n/a";
  return `${Math.round(value * 100)}%`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createSvgElement(tag, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function normalize(values) {
  const total = values.reduce((sum, value) => sum + Math.max(0, Number(value)), 0);
  if (total <= 0) return values.map(() => 1 / values.length);
  return values.map((value) => Math.max(0, Number(value)) / total);
}

function entropyBits(probabilities) {
  return probabilities.reduce((sum, probability) => {
    if (probability <= 0) return sum;
    return sum - probability * Math.log2(probability);
  }, 0);
}

function crossEntropyBits(target, guess) {
  return target.reduce((sum, probability, index) => {
    if (probability <= 0) return sum;
    return sum - probability * Math.log2(Math.max(guess[index], 1e-9));
  }, 0);
}

function dot(a, b) {
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

function lengthOf(vector) {
  return Math.sqrt(dot(vector, vector));
}

function cosineSimilarity(a, b) {
  const denom = lengthOf(a) * lengthOf(b);
  return denom > 0 ? dot(a, b) / denom : 0;
}

function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}

function softmax(logits) {
  const max = Math.max(...logits);
  const exps = logits.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

function renderMetricCards(container, cards) {
  container.replaceChildren();
  cards.forEach((card) => {
    const item = createElement("div", "metric-card");
    item.append(
      createElement("strong", "", card.value),
      createElement("span", "", card.label)
    );
    if (card.note) item.append(createElement("em", "", card.note));
    container.append(item);
  });
}

function probabilityRow(label, value, detail, className = "", color = "") {
  const row = createElement("div", `probability-row ${className}`.trim());
  const name = createElement("strong", "", label);
  const track = createElement("div", "probability-track");
  const fill = createElement("span");
  fill.style.width = `${clamp(value * 100, 0, 100)}%`;
  if (color) fill.style.background = color;
  track.append(fill);
  row.append(name, track, createElement("em", "", detail));
  return row;
}

function probabilityWordColor(label) {
  return probabilityWordColors[label] || "var(--teal)";
}

function applyProbabilityPreset() {
  const preset = probabilityPresets[dom.probabilityContextSelect.value];
  state.probabilityPreset = dom.probabilityContextSelect.value;
  preset.labels.forEach((label, index) => {
    dom.countLabels[index].textContent = label;
    dom.guessLabels[index].textContent = label;
    dom.countSliders[index].value = preset.counts[index];
    dom.guessSliders[index].value = preset.guesses[index];
    const color = probabilityWordColor(label);
    dom.countSliders[index].style.setProperty("--word-color", color);
    dom.guessSliders[index].style.setProperty("--word-color", color);
  });
  renderProbability();
}

function renderProbability() {
  const preset = probabilityPresets[state.probabilityPreset];
  const counts = dom.countSliders.map((slider) => Number(slider.value));
  const guessesRaw = dom.guessSliders.map((slider) => Number(slider.value));
  const target = normalize(counts);
  const guess = normalize(guessesRaw);
  const total = counts.reduce((sum, value) => sum + value, 0);
  const entropy = entropyBits(target);
  const crossEntropy = crossEntropyBits(target, guess);
  const perplexity = 2 ** crossEntropy;
  const extraSurprise = crossEntropy - entropy;

  dom.probabilityContextLabel.textContent = preset.title;
  preset.labels.forEach((label, index) => {
    dom.countLabels[index].textContent = label;
    dom.guessLabels[index].textContent = label;
    dom.countValues[index].textContent = counts[index];
    dom.guessValues[index].textContent = guessesRaw[index];
  });

  if (!state.hasExploredProbability) {
    dom.entropyLabel.textContent = "\u2014 bits";
    dom.probabilityPanel.replaceChildren(createElement("div", "empty-state", "Move a count or guess slider (or pick a context) to see probabilities, entropy, and surprise."));
    dom.entropyPanel.replaceChildren(createElement("div", "empty-state", "Adjust the sliders to compute entropy, cross-entropy, and perplexity."));
    return;
  }

  dom.entropyLabel.textContent = `${formatNumber(entropy, 2)} bits`;
  dom.probabilityPanel.replaceChildren();
  preset.labels.forEach((label, index) => {
    const detail = `${counts[index]} / ${total || 0} = ${formatPercent(target[index])}`;
    dom.probabilityPanel.append(probabilityRow(label, target[index], detail, "", probabilityWordColor(label)));
  });

  renderMetricCards(dom.entropyPanel, [
    {
      label: "examples",
      value: String(total),
      note: "counted after this context"
    },
    {
      label: "entropy",
      value: `${formatNumber(entropy, 2)} bits`,
      note: "uncertainty in the evidence"
    },
    {
      label: "cross-entropy",
      value: `${formatNumber(crossEntropy, 2)} bits`,
      note: "surprise using the guesses"
    },
    {
      label: "perplexity",
      value: formatNumber(perplexity, 2),
      note: "effective number of choices"
    },
    {
      label: "extra surprise",
      value: `${formatNumber(extraSurprise, 2)} bits`,
      note: "0 means the guesses match perfectly"
    },
    {
      label: "best guess",
      value: preset.labels[guess.indexOf(Math.max(...guess))],
      note: "largest guessed probability"
    }
  ]);

  if (extraSurprise < 0.05) {
    dom.entropyNarrative.textContent = "The guess distribution is very close to the evidence, so cross-entropy is almost as low as the true entropy.";
  } else if (crossEntropy > entropy + 0.7) {
    dom.entropyNarrative.textContent = "The guesses disagree with the evidence. Cross-entropy rises because the model is surprised by outcomes the data says are common.";
  } else {
    dom.entropyNarrative.textContent = "The guesses are partly aligned with the evidence. Move a guessed slider toward the count row and watch cross-entropy shrink.";
  }
}

function readVectorControls() {
  const readComponent = (input, fallback) => {
    const value = Number(input.value);
    if (!Number.isFinite(value)) return fallback;
    const clipped = clamp(value, -1, 1);
    if (clipped !== value) input.value = formatNumber(clipped, 2);
    return clipped;
  };
  const vectorA = [
    readComponent(dom.vectorAx, 0),
    readComponent(dom.vectorAy, 0)
  ];
  const vectorB = [
    readComponent(dom.vectorBx, 0),
    readComponent(dom.vectorBy, 0)
  ];
  return { vectorA, vectorB };
}

function renderVectors() {
  const { vectorA, vectorB } = readVectorControls();
  const vectorDot = dot(vectorA, vectorB);
  const cos = cosineSimilarity(vectorA, vectorB);
  const distance = euclideanDistance(vectorA, vectorB);
  const angle = Math.acos(clamp(cos, -1, 1)) * 180 / Math.PI;
  dom.vectorSummary.textContent = cos > 0.75 ? "similar direction" : cos < -0.25 ? "opposed" : "mixed";
  dom.dotProductLabel.textContent = `dot ${formatNumber(vectorDot, 2)}`;
  renderVectorSvg(vectorA, vectorB);
  renderMetricCards(dom.vectorMetrics, [
    {
      label: "dot(a, b)",
      value: formatNumber(vectorDot, 3),
      note: "direction plus length"
    },
    {
      label: "cosine",
      value: formatNumber(cos, 3),
      note: "direction only"
    },
    {
      label: "distance",
      value: formatNumber(distance, 3),
      note: "space between points"
    },
    {
      label: "angle",
      value: `${formatNumber(angle, 1)} deg`,
      note: "smaller means more aligned"
    }
  ]);
  renderEmbeddingLookup();
}

function renderVectorSvg(vectorA, vectorB) {
  const svg = dom.vectorSvg;
  svg.replaceChildren();
  const width = 520;
  const height = 360;
  const center = { x: width / 2, y: height / 2 };
  const scale = 132;
  const toPoint = ([x, y]) => ({ x: center.x + x * scale, y: center.y - y * scale });
  const a = toPoint(vectorA);
  const b = toPoint(vectorB);

  const defs = createSvgElement("defs");
  const marker = createSvgElement("marker", {
    id: "arrowHead",
    markerWidth: "10",
    markerHeight: "10",
    refX: "8",
    refY: "3",
    orient: "auto",
    markerUnits: "strokeWidth"
  });
  marker.append(createSvgElement("path", { d: "M0,0 L0,6 L9,3 z", fill: "#c65f1e" }));
  defs.append(marker);
  svg.append(defs);

  svg.append(createSvgElement("line", { class: "svg-axis", x1: 36, y1: center.y, x2: width - 36, y2: center.y }));
  svg.append(createSvgElement("line", { class: "svg-axis", x1: center.x, y1: 28, x2: center.x, y2: height - 28 }));
  svg.append(createSvgElement("text", { class: "svg-grid-label", x: width - 62, y: center.y - 8 }));
  svg.lastChild.textContent = "x";
  svg.append(createSvgElement("text", { class: "svg-grid-label", x: center.x + 8, y: 34 }));
  svg.lastChild.textContent = "y";

  const lineA = createSvgElement("line", {
    class: "vector-arrow-a",
    x1: center.x,
    y1: center.y,
    x2: a.x,
    y2: a.y,
    "marker-end": "url(#arrowHead)"
  });
  const lineB = createSvgElement("line", {
    class: "vector-arrow-b",
    x1: center.x,
    y1: center.y,
    x2: b.x,
    y2: b.y
  });
  svg.append(lineA, lineB);
  svg.append(createSvgElement("circle", { class: "vector-point-a", cx: a.x, cy: a.y, r: 8 }));
  svg.append(createSvgElement("circle", { class: "vector-point-b", cx: b.x, cy: b.y, r: 8 }));
  const labelA = createSvgElement("text", { class: "svg-grid-label", x: a.x + 10, y: a.y - 10 });
  labelA.textContent = "A";
  const labelB = createSvgElement("text", { class: "svg-grid-label", x: b.x + 10, y: b.y - 10 });
  labelB.textContent = "B";
  svg.append(labelA, labelB);
}

function renderEmbeddingLookup() {
  const selected = dom.embeddingLookupSelect.value;
  const vector = embeddingRows[selected];
  const others = Object.entries(embeddingRows)
    .filter(([word]) => word !== selected)
    .map(([word, row]) => ({ word, similarity: cosineSimilarity(vector, row) }))
    .sort((a, b) => b.similarity - a.similarity);
  dom.embeddingLookupPanel.replaceChildren();
  dom.embeddingLookupPanel.append(
    lookupRow("matrix row", `${selected} -> [${vector.map((value) => formatNumber(value, 2)).join(", ")}]`),
    lookupRow("nearest row", `${others[0].word} with cosine ${formatNumber(others[0].similarity, 3)}`),
    lookupRow("lookup idea", "The token ID chooses a row. Training changes the row values.")
  );
}

function lookupRow(label, value) {
  const row = createElement("div", "lookup-row");
  row.append(createElement("strong", "", label), createElement("code", "", value));
  return row;
}

function readLineParams() {
  const w = Number(dom.slopeSlider.value) / 100;
  const b = Number(dom.interceptSlider.value) / 100;
  const lr = Number(dom.lineRateSlider.value) / 100;
  dom.slopeLabel.textContent = formatNumber(w, 2);
  dom.interceptLabel.textContent = formatNumber(b, 2);
  dom.lineRateLabel.textContent = formatNumber(lr, 2);
  return { w, b, lr };
}

function lineLossAndGradients(w, b) {
  const n = lineData.length;
  let loss = 0;
  let dw = 0;
  let db = 0;
  lineData.forEach((point) => {
    const prediction = w * point.x + b;
    const error = prediction - point.y;
    loss += error ** 2;
    dw += 2 * error * point.x;
    db += 2 * error;
  });
  return { loss: loss / n, dw: dw / n, db: db / n };
}

const gradientWalkthroughMeta = [
  { title: "Measure the current mistake", copy: "Start from the line's current slope and intercept, then compress all six point errors into one MSE loss." },
  { title: "Calculate one gradient per knob", copy: "Average the six point contributions to learn which uphill direction belongs to the slope and which belongs to the intercept." },
  { title: "Plan the opposite, downhill move", copy: "Multiply each gradient by the learning rate and subtract it from the matching knob. This previews the update without applying it." },
  { title: "Check the predicted result", copy: "Recompute MSE with the planned slider values. A useful step lowers loss; an oversized step can raise it." }
];

function stopGradientWalkthroughPlayback() {
  if (state.gradientWalkthroughTimer) {
    window.clearInterval(state.gradientWalkthroughTimer);
    state.gradientWalkthroughTimer = null;
  }
  if (dom.gradientPlayButton) dom.gradientPlayButton.textContent = "Play";
}

function setGradientWalkthroughStep(nextStep, { keepPlaying = false } = {}) {
  state.gradientWalkthroughStep = clamp(nextStep, 0, gradientWalkthroughMeta.length - 1);
  if (!keepPlaying) stopGradientWalkthroughPlayback();
  renderGradient();
}

function toggleGradientWalkthroughPlayback() {
  if (state.gradientWalkthroughTimer) {
    stopGradientWalkthroughPlayback();
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setGradientWalkthroughStep(gradientWalkthroughMeta.length - 1);
    return;
  }
  if (state.gradientWalkthroughStep >= gradientWalkthroughMeta.length - 1) state.gradientWalkthroughStep = 0;
  dom.gradientPlayButton.textContent = "Pause";
  renderGradient();
  state.gradientWalkthroughTimer = window.setInterval(() => {
    if (state.gradientWalkthroughStep >= gradientWalkthroughMeta.length - 1) {
      stopGradientWalkthroughPlayback();
      return;
    }
    state.gradientWalkthroughStep += 1;
    renderGradient();
  }, 1600);
}

function resetGradientWalkthrough() {
  stopGradientWalkthroughPlayback();
  state.gradientWalkthroughStep = 0;
  renderGradient();
}

function gradientComparisonCard(label, w, b, loss, note, className = "") {
  const card = createElement("article", `gradient-comparison-card ${className}`.trim());
  card.append(
    createElement("span", "gradient-comparison-label", label),
    createElement("code", "", `ŷ = ${formatNumber(w, 2)}x + ${formatNumber(b, 2)}`),
    createElement("strong", "", `MSE ${formatNumber(loss, 4)}`),
    createElement("p", "", note)
  );
  return card;
}

function renderGradientWalkthrough({ w, b, lr, info }) {
  if (!dom.gradientStepPanel) return;
  const step = clamp(state.gradientWalkthroughStep, 0, gradientWalkthroughMeta.length - 1);
  const meta = gradientWalkthroughMeta[step];
  const n = lineData.length;
  const rows = lineData.map((point) => {
    const prediction = w * point.x + b;
    const error = prediction - point.y;
    return { ...point, prediction, error };
  });
  const sumSquaredError = rows.reduce((sum, row) => sum + row.error ** 2, 0);
  const sumErrorTimesX = rows.reduce((sum, row) => sum + row.error * row.x, 0);
  const sumError = rows.reduce((sum, row) => sum + row.error, 0);
  const plannedW = clamp(w - lr * info.dw, -2, 2);
  const plannedB = clamp(b - lr * info.db, -1, 1);
  const appliedW = Math.round(plannedW * 100) / 100;
  const appliedB = Math.round(plannedB * 100) / 100;
  const nextLoss = lineLossAndGradients(appliedW, appliedB).loss;

  dom.gradientStepTitle.textContent = meta.title;
  dom.gradientStepCopy.textContent = meta.copy;
  dom.gradientStepCount.textContent = `step ${step + 1} of ${gradientWalkthroughMeta.length}`;
  dom.gradientBackButton.disabled = step === 0;
  dom.gradientNextButton.disabled = step === gradientWalkthroughMeta.length - 1;
  dom.gradientStepButtons.forEach((button, index) => {
    const active = index === step;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const nodes = [];
  if (step === 0) {
    nodes.push(forwardExplanation("What is being measured?", `The current line is ŷ = ${formatNumber(w, 2)}x + ${formatNumber(b, 2)}. For each of the ${n} dots, subtract the true y from the line's prediction, square that error, then average.`));
    nodes.push(forwardResultRow("Add squared errors", rows.map((row) => formatNumber(row.error ** 2, 3)).join(" + "), sumSquaredError, "Every gap contributes positively after squaring."));
    nodes.push(forwardResultRow("Average the total", `${formatNumber(sumSquaredError, 4)} ÷ ${n}`, info.loss, "This scalar MSE is the mistake we want to lower."));
    nodes.push(createElement("p", "forward-takeaway", `What we learned: the current slope and intercept produce MSE ${formatNumber(info.loss, 4)}. Loss measures the mistake; it does not yet say how either knob should move.`));
  } else if (step === 1) {
    nodes.push(forwardExplanation("Give each knob its own slope", "The slope gradient weights each error by x because changing slope affects distant x-values more. The intercept gradient uses each error directly because changing intercept lifts or lowers the whole line equally."));
    nodes.push(forwardResultRow("Slope gradient", `(2 ÷ ${n}) × ${formatNumber(sumErrorTimesX, 4)}`, info.dw, "∂L/∂slope: the uphill direction for the line's tilt."));
    nodes.push(forwardResultRow("Intercept gradient", `(2 ÷ ${n}) × ${formatNumber(sumError, 4)}`, info.db, "∂L/∂intercept: the uphill direction for the line's height."));
    nodes.push(createElement("p", "forward-takeaway", `What we learned: the gradient vector is [${formatNumber(info.dw, 3)}, ${formatNumber(info.db, 3)}]. Each entry belongs to one trainable knob.`));
  } else if (step === 2) {
    nodes.push(forwardExplanation("Subtract, because the gradient points uphill", `The learning rate η = ${formatNumber(lr, 2)} scales both moves. A negative gradient makes subtraction increase that knob; a positive gradient makes subtraction decrease it.`));
    nodes.push(forwardResultRow("Plan new slope", `${formatNumber(w, 2)} − ${formatNumber(lr, 2)} × ${signedFactor(info.dw, 3)}`, plannedW, `The slider stores two decimals, so applying the step uses ${formatNumber(appliedW, 2)}.`));
    nodes.push(forwardResultRow("Plan new intercept", `${formatNumber(b, 2)} − ${formatNumber(lr, 2)} × ${signedFactor(info.db, 3)}`, plannedB, `The slider stores two decimals, so applying the step uses ${formatNumber(appliedB, 2)}.`));
    nodes.push(createElement("p", "forward-takeaway", "What we learned: gradient descent applies the gradients; backpropagation or calculus must calculate them first."));
  } else {
    nodes.push(forwardExplanation("Did the planned move help?", "Use the exact two-decimal values that the sliders will store, draw the planned line, and recompute the same MSE measurement."));
    const comparison = createElement("div", "gradient-comparison-grid");
    const improved = nextLoss < info.loss;
    comparison.append(
      gradientComparisonCard("before", w, b, info.loss, "Current slider values."),
      gradientComparisonCard("after one step", appliedW, appliedB, nextLoss, improved ? "Lower loss: this step heads downhill." : "Higher loss: this step overshoots.", improved ? "is-improved" : "is-worse")
    );
    nodes.push(comparison);
    const change = nextLoss - info.loss;
    nodes.push(forwardResultRow("Recompute MSE", `${formatNumber(info.loss, 4)} → ${formatNumber(nextLoss, 4)}`, nextLoss, `The change is ${change < 0 ? "a decrease" : "an increase"} of ${formatNumber(Math.abs(change), 4)}.`));
    nodes.push(createElement("p", "forward-takeaway", improved ? "What we learned: this learning rate produces a useful downhill move. Press Step descent below to apply it." : "What we learned: this learning rate is too aggressive for this position. Lower it before applying the step."));
  }
  dom.gradientStepPanel.replaceChildren(...nodes);
}

function renderGradient() {
  const { w, b, lr } = readLineParams();
  const info = lineLossAndGradients(w, b);
  renderGradientWalkthrough({ w, b, lr, info });
  if (!state.hasExploredGradient) {
    dom.gradientStatus.textContent = "press Step";
    renderLineFitPlaceholder();
    dom.gradientMetrics.replaceChildren(createElement("div", "empty-state", "Move the slope, intercept, or step-size slider \u2014 or press Step \u2014 to fit the line and watch each knob move."));
    dom.gradientExplanation.replaceChildren();
    return;
  }
  dom.gradientStatus.textContent = `MSE ${formatNumber(info.loss, 3)}`;
  renderLineFitSvg(w, b);
  renderMetricCards(dom.gradientMetrics, [
    { label: "MSE loss", value: formatNumber(info.loss, 4), note: "mean squared gap (lower fits better)" },
    { label: "slope", value: formatNumber(w, 2), note: "the line's tilt" },
    { label: "intercept", value: formatNumber(b, 2), note: "its height at the centre" }
  ]);
  const nextW = clamp(w - lr * info.dw, -2, 2);
  const nextB = clamp(b - lr * info.db, -1, 1);
  const nextLoss = lineLossAndGradients(nextW, nextB).loss;
  renderGradientDerivation({ w, b, lr, info, nextLoss });
}

function signedFactor(value, digits = 2) {
  const text = formatNumber(Math.abs(value), digits);
  return value < 0 ? `(\u2212${text})` : text;
}

function derivCell(text) {
  const td = createElement("td");
  td.textContent = text;
  return td;
}

function renderGradientDerivation({ w, b, lr, info, nextLoss }) {
  const container = dom.gradientExplanation;
  const n = lineData.length;

  const intro = createElement("div", "step-lead", `Every step is just this calculation, recomputed from all ${n} points for the current line. The prediction is \u0177 = slope\u00b7x + intercept and the error is e = \u0177 \u2212 y:`);

  const wrap = createElement("div", "deriv-table-wrap");
  const table = createElement("table", "deriv-table");
  const thead = createElement("thead");
  const htr = createElement("tr");
  ["x", "y", "\u0177", "e", "e\u00b2", "e\u00b7x"].forEach((h) => htr.append(createElement("th", "", h)));
  thead.append(htr);
  const tbody = createElement("tbody");
  let sumSq = 0;
  let sumEx = 0;
  let sumE = 0;
  lineData.forEach((pt) => {
    const pred = w * pt.x + b;
    const e = pred - pt.y;
    sumSq += e * e;
    sumEx += e * pt.x;
    sumE += e;
    const tr = createElement("tr");
    tr.append(
      derivCell(formatNumber(pt.x, 2)),
      derivCell(formatNumber(pt.y, 2)),
      derivCell(formatNumber(pred, 2)),
      derivCell(formatNumber(e, 3)),
      derivCell(formatNumber(e * e, 4)),
      derivCell(formatNumber(e * pt.x, 3))
    );
    tbody.append(tr);
  });
  const tfoot = createElement("tfoot");
  const ftr = createElement("tr");
  const sumLabel = createElement("td", "row-label", "sums (\u03a3)");
  sumLabel.setAttribute("colspan", "3");
  ftr.append(sumLabel, derivCell(formatNumber(sumE, 3)), derivCell(formatNumber(sumSq, 4)), derivCell(formatNumber(sumEx, 3)));
  tfoot.append(ftr);
  table.append(thead, tbody, tfoot);
  wrap.append(table);

  const loss = sumSq / n;
  const dw = (2 * sumEx) / n;
  const db = (2 * sumE) / n;
  const newW = w - lr * dw;
  const newB = b - lr * db;
  const stack = createElement("div", "formula-stack");
  [
    `MSE loss = (1/${n}) \u00d7 \u03a3e\u00b2 = (1/${n}) \u00d7 ${formatNumber(sumSq, 4)} = ${formatNumber(loss, 4)}`,
    `\u2202(MSE loss)/\u2202slope = (2/${n}) \u00d7 \u03a3(e\u00b7x) = ${formatNumber(dw, 3)}`,
    `\u2202(MSE loss)/\u2202intercept = (2/${n}) \u00d7 \u03a3e = ${formatNumber(db, 3)}`,
    `then nudge each knob by rate \u00d7 gradient:`,
    `new slope = ${formatNumber(w, 2)} \u2212 ${formatNumber(lr, 2)} \u00d7 ${signedFactor(dw, 3)} = ${formatNumber(newW, 3)}`,
    `new intercept = ${formatNumber(b, 2)} \u2212 ${formatNumber(lr, 2)} \u00d7 ${signedFactor(db, 3)} = ${formatNumber(newB, 3)}`
  ].forEach((line) => stack.append(createElement("code", "", line)));

  const reason = createElement("p");
  const settled = Math.abs(info.dw) < 0.01 && Math.abs(info.db) < 0.01;
  if (settled) {
    reason.textContent = "The errors are tiny now, so the sums are near zero and each step barely moves the line - it has essentially fit the dots.";
  } else {
    const heightReason = info.db < -0.01
      ? "sits a little below the dots, so the step lifts it"
      : info.db > 0.01
        ? "sits a little above the dots, so the step lowers it"
        : "is centred on the dots";
    const tiltReason = info.dw < -0.01
      ? "is tilted too shallow, so the step steepens it"
      : info.dw > 0.01
        ? "is tilted too steep, so the step flattens it"
        : "already matches their trend";
    const dir = nextLoss < info.loss ? "down" : "up";
    reason.textContent = `Reading it back: the line ${heightReason}, and it ${tiltReason}. Applying both updates moves the loss from ${formatNumber(info.loss, 4)} to ${formatNumber(nextLoss, 4)} (${dir}).`;
  }

  container.replaceChildren(intro, wrap, stack, reason);
}

function renderLineFitPlaceholder() {
  const svg = dom.lineFitSvg;
  svg.replaceChildren();
  const text = createSvgElement("text", { x: 280, y: 180, "text-anchor": "middle", fill: "#6a6a6a", "font-size": "15" });
  text.textContent = "Adjust a slider or press Step to fit the line.";
  svg.append(text);
}

function renderLineFitSvg(w, b) {
  const svg = dom.lineFitSvg;
  svg.replaceChildren();
  const width = 560;
  const height = 360;
  const pad = 44;
  const toX = (x) => pad + ((x + 1.1) / 2.2) * (width - pad * 2);
  const toY = (y) => height - pad - ((y + 1.1) / 2.2) * (height - pad * 2);
  svg.append(createSvgElement("line", { class: "svg-axis", x1: pad, y1: toY(0), x2: width - pad, y2: toY(0) }));
  svg.append(createSvgElement("line", { class: "svg-axis", x1: toX(0), y1: pad, x2: toX(0), y2: height - pad }));
  const x1 = -1.08;
  const x2 = 1.08;
  svg.append(createSvgElement("line", {
    class: "fit-line",
    x1: toX(x1),
    y1: toY(w * x1 + b),
    x2: toX(x2),
    y2: toY(w * x2 + b)
  }));
  // Mark the intercept: where the line crosses the centre vertical axis (x = 0).
  svg.append(createSvgElement("circle", { class: "intercept-marker", cx: toX(0), cy: toY(b), r: 5 }));
  const interceptLabel = createSvgElement("text", { class: "svg-annot", x: toX(0) + 16, y: toY(b) - 12 });
  interceptLabel.textContent = "intercept";
  svg.append(interceptLabel);
  lineData.forEach((point) => {
    const predictedY = w * point.x + b;
    svg.append(createSvgElement("line", {
      class: "residual-line",
      x1: toX(point.x),
      y1: toY(point.y),
      x2: toX(point.x),
      y2: toY(predictedY)
    }));
    svg.append(createSvgElement("circle", {
      class: "fit-point",
      cx: toX(point.x),
      cy: toY(point.y),
      r: 7
    }));
  });
}

function stepGradientDescent() {
  const { w, b, lr } = readLineParams();
  const { dw, db } = lineLossAndGradients(w, b);
  const nextW = clamp(w - lr * dw, -2, 2);
  const nextB = clamp(b - lr * db, -1, 1);
  dom.slopeSlider.value = Math.round(nextW * 100);
  dom.interceptSlider.value = Math.round(nextB * 100);
  renderGradient();
  return lineLossAndGradients(Number(dom.slopeSlider.value) / 100, Number(dom.interceptSlider.value) / 100);
}

function resetGradient() {
  stopAutoGradient();
  stopGradientWalkthroughPlayback();
  state.gradientWalkthroughStep = 0;
  dom.slopeSlider.value = -40;
  dom.interceptSlider.value = 20;
  dom.lineRateSlider.value = 8;
  renderGradient();
  dom.gradientRunNote.textContent = "Reset to the starting line. Auto train remains bounded to 80 steps or 10 seconds.";
}

function stopAutoGradient(label = "", message = "") {
  if (state.autoLineTimer) {
    window.clearInterval(state.autoLineTimer);
    state.autoLineTimer = null;
  }
  state.autoLineRun = null;
  dom.gradientAutoButton.textContent = "Auto train";
  if (label) dom.gradientStatus.textContent = label;
  if (message) dom.gradientRunNote.textContent = message;
}

function runAutoGradientTick() {
  const run = state.autoLineRun;
  if (!run) return;
  const info = stepGradientDescent();
  run.steps += 1;
  const elapsed = performance.now() - run.startedAt;
  const change = Math.abs(run.previousLoss - info.loss);
  run.stalledSteps = change < 0.000001 ? run.stalledSteps + 1 : 0;
  run.previousLoss = info.loss;

  if (!Number.isFinite(info.loss) || !Number.isFinite(info.dw) || !Number.isFinite(info.db)) {
    stopAutoGradient("diverged", `Stopped after ${run.steps} steps because the loss or gradient became non-finite. Reset or lower the step size before trying again.`);
  } else if (info.loss > Math.max(run.startingLoss * 4, run.startingLoss + 1)) {
    stopAutoGradient("diverged", `Stopped after ${run.steps} steps because MSE rose from ${formatNumber(run.startingLoss, 4)} to ${formatNumber(info.loss, 4)}. Lower the step size before trying again.`);
  } else if (info.loss < 0.005 || Math.max(Math.abs(info.dw), Math.abs(info.db)) < 0.005 || run.stalledSteps >= 8) {
    stopAutoGradient("settled", `Stopped after ${run.steps} steps because the fit settled at MSE ${formatNumber(info.loss, 4)}.`);
  } else if (run.steps >= 80 || elapsed >= 10000) {
    stopAutoGradient("limit reached", `Stopped at the safety limit after ${run.steps} steps and MSE ${formatNumber(info.loss, 4)}. You can adjust the step size and start a fresh run.`);
  } else {
    dom.gradientStatus.textContent = `auto ${run.steps}/80`;
    dom.gradientRunNote.textContent = `Running: step ${run.steps} of at most 80, MSE ${formatNumber(info.loss, 4)}. Press Stop at any time.`;
  }
}

function toggleAutoGradient() {
  if (state.autoLineTimer) {
    const steps = state.autoLineRun?.steps || 0;
    stopAutoGradient("stopped", `Stopped by you after ${steps} automatic step${steps === 1 ? "" : "s"}. Press Auto train to start a fresh bounded run.`);
    return;
  }
  const { w, b } = readLineParams();
  const starting = lineLossAndGradients(w, b);
  state.autoLineRun = {
    steps: 0,
    startedAt: performance.now(),
    startingLoss: starting.loss,
    previousLoss: starting.loss,
    stalledSteps: 0
  };
  dom.gradientAutoButton.textContent = "Stop";
  dom.gradientStatus.textContent = "auto 0/80";
  dom.gradientRunNote.textContent = `Auto train started at MSE ${formatNumber(starting.loss, 4)}. It will stop when the fit settles, diverges, reaches 80 steps, or reaches 10 seconds.`;
  state.autoLineTimer = window.setInterval(runAutoGradientTick, 180);
}

const softmaxStepMeta = [
  { title: "Scale the logits with temperature", copy: "Divide every raw logit by the same temperature. This changes how far apart the scores feel without changing their order." },
  { title: "Subtract the largest scaled score", copy: "Shift every scaled score by the same amount. Their differences stay identical, but the largest shifted score becomes 0." },
  { title: "Exponentiate the shifted scores", copy: "Exponentials turn every shifted score into a positive amount. Larger shifted scores receive larger amounts." },
  { title: "Normalize, then measure the true word", copy: "Divide each positive amount by their total to get probabilities, then read the true word's negative log probability as cross-entropy loss." }
];

function stopSoftmaxPlayback() {
  if (state.softmaxPlayTimer) {
    clearInterval(state.softmaxPlayTimer);
    state.softmaxPlayTimer = null;
  }
  if (dom.softmaxPlayButton) dom.softmaxPlayButton.textContent = "Play";
}

function setSoftmaxStep(nextStep, { keepPlaying = false } = {}) {
  state.softmaxStep = clamp(nextStep, 0, softmaxStepMeta.length - 1);
  if (!keepPlaying) stopSoftmaxPlayback();
  renderSoftmax();
}

function toggleSoftmaxPlayback() {
  if (state.softmaxPlayTimer) {
    stopSoftmaxPlayback();
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setSoftmaxStep(softmaxStepMeta.length - 1);
    return;
  }
  if (state.softmaxStep >= softmaxStepMeta.length - 1) state.softmaxStep = 0;
  dom.softmaxPlayButton.textContent = "Pause";
  renderSoftmax();
  state.softmaxPlayTimer = setInterval(() => {
    if (state.softmaxStep >= softmaxStepMeta.length - 1) {
      stopSoftmaxPlayback();
      return;
    }
    state.softmaxStep += 1;
    renderSoftmax();
  }, 1600);
}

function resetSoftmaxWalkthrough() {
  stopSoftmaxPlayback();
  state.softmaxStep = 0;
  renderSoftmax();
}

function softmaxNumberRows(labels, columns) {
  const table = createElement("div", "softmax-number-table");
  const header = createElement("div", "softmax-number-row softmax-number-head");
  header.append(createElement("strong", "", "candidate"));
  columns.forEach((column) => header.append(createElement("span", "", column.label)));
  table.append(header);
  labels.forEach((label, index) => {
    const row = createElement("div", "softmax-number-row");
    row.append(createElement("strong", "", label));
    columns.forEach((column) => row.append(createElement("code", column.className || "", column.values[index])));
    table.append(row);
  });
  return table;
}

function renderSoftmaxStep({ logits, temperature, scaled, maxScaled, shifted, exponentials, exponentialTotal, probabilities, correctName, correctIndex, loss }) {
  const step = clamp(state.softmaxStep, 0, softmaxStepMeta.length - 1);
  const meta = softmaxStepMeta[step];
  dom.softmaxStepTitle.textContent = meta.title;
  dom.softmaxStepCopy.textContent = meta.copy;
  dom.softmaxStepCount.textContent = `step ${step + 1} of ${softmaxStepMeta.length}`;
  dom.softmaxBackButton.disabled = step === 0;
  dom.softmaxNextButton.disabled = step === softmaxStepMeta.length - 1;
  dom.softmaxStepButtons.forEach((button, index) => {
    const active = index === step;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const nodes = [];
  if (step === 0) {
    nodes.push(forwardExplanation("What temperature does", `For each candidate, compute scaled score s = z ÷ T. Here T = ${formatNumber(temperature, 2)}. The same divisor applies to every logit, so their ranking is unchanged.`));
    nodes.push(softmaxNumberRows(softmaxNames, [
      { label: "raw logit z", values: logits.map((value) => formatNumber(value, 3)) },
      { label: `z ÷ ${formatNumber(temperature, 2)}`, values: scaled.map((value) => formatNumber(value, 3)) }
    ]));
    nodes.push(createElement("p", "forward-takeaway", temperature < 1 ? "Lower temperature spreads the scaled scores farther apart, preparing a sharper distribution." : temperature > 1 ? "Higher temperature pulls the scaled scores closer together, preparing a flatter distribution." : "At T = 1, the scaled scores equal the original logits."));
  } else if (step === 1) {
    nodes.push(forwardExplanation("Why subtract the maximum", `The largest scaled score is m = ${formatNumber(maxScaled, 3)}. Subtract m from every scaled score. The winner becomes 0 and every other value becomes non-positive, which keeps exponentials in a safe numeric range.`));
    nodes.push(softmaxNumberRows(softmaxNames, [
      { label: "scaled score s", values: scaled.map((value) => formatNumber(value, 3)) },
      { label: "s - m", values: shifted.map((value) => formatNumber(value, 3)) }
    ]));
    const beforeGap = scaled[0] - scaled[1];
    const afterGap = shifted[0] - shifted[1];
    nodes.push(forwardResultRow("Gap check", `${formatNumber(scaled[0], 3)} - ${formatNumber(scaled[1], 3)} = ${formatNumber(beforeGap, 3)}; after shifting: ${formatNumber(shifted[0], 3)} - ${formatNumber(shifted[1], 3)}`, afterGap, "The gap is unchanged, so Softmax probabilities will be unchanged."));
  } else if (step === 2) {
    nodes.push(forwardExplanation("Turn scores into positive amounts", "Apply the exponential to each shifted score. Every amount is now positive, and the largest shifted score 0 becomes exactly e⁰ = 1."));
    nodes.push(softmaxNumberRows(softmaxNames, [
      { label: "shifted score", values: shifted.map((value) => formatNumber(value, 3)) },
      { label: "exp(shifted)", values: exponentials.map((value) => formatNumber(value, 3)), className: "is-positive" }
    ]));
    nodes.push(forwardResultRow("Add the positive amounts", exponentials.map((value) => formatNumber(value, 3)).join(" + "), exponentialTotal, "This total becomes the denominator for every probability."));
  } else {
    nodes.push(forwardExplanation("Make a probability distribution", "Divide every positive amount by their shared total. The results are positive, preserve the logit ranking, and add to 1."));
    nodes.push(softmaxNumberRows(softmaxNames, [
      { label: "positive amount", values: exponentials.map((value) => formatNumber(value, 3)) },
      { label: "probability q", values: probabilities.map((value) => formatNumber(value, 3)), className: "is-positive" }
    ]));
    const probabilityTotal = probabilities.reduce((sum, value) => sum + value, 0);
    nodes.push(forwardResultRow("Probability check", probabilities.map((value) => formatNumber(value, 3)).join(" + "), probabilityTotal, "The probabilities add to 1 (up to displayed rounding)."));
    const lossBlock = createElement("section", "softmax-loss-worked");
    lossBlock.append(
      createElement("h4", "", `Cross-entropy reads the true word: “${correctName}”`),
      createElement("p", "", `Softmax gives “${correctName}” probability ${formatNumber(probabilities[correctIndex], 3)}. Loss asks how surprising that true outcome was.`),
      createElement("code", "", `L = -ln(q_true) = -ln(${formatNumber(probabilities[correctIndex], 6)}) = ${formatNumber(loss, 3)} nats`)
    );
    nodes.push(lossBlock, createElement("p", "forward-takeaway", "What we learned: logits are now a probability distribution, and the true word's probability has become one complete cross-entropy loss number. Backpropagation later calculates the derivative of this loss; it does not replace or finish the loss calculation."));
  }
  dom.softmaxStepPanel.replaceChildren(...nodes);
}

function renderSoftmax() {
  const logits = [
    Number(dom.logitA.value) / 100,
    Number(dom.logitB.value) / 100,
    Number(dom.logitC.value) / 100
  ];
  const temperature = Number(dom.temperatureSlider.value) / 100;
  const scaled = logits.map((value) => value / temperature);
  const maxScaled = Math.max(...scaled);
  const shifted = scaled.map((value) => value - maxScaled);
  const exponentials = shifted.map((value) => Math.exp(value));
  const exponentialTotal = exponentials.reduce((sum, value) => sum + value, 0);
  const probabilities = exponentials.map((value) => value / exponentialTotal);
  const correctName = dom.correctClassSelect.value;
  const correctIndex = softmaxNames.indexOf(correctName);
  const loss = -Math.log(Math.max(probabilities[correctIndex], 1e-9));

  dom.logitALabel.textContent = formatNumber(logits[0], 2);
  dom.logitBLabel.textContent = formatNumber(logits[1], 2);
  dom.logitCLabel.textContent = formatNumber(logits[2], 2);
  dom.temperatureLabel.textContent = formatNumber(temperature, 2);
  dom.softmaxTempLabel.textContent = `temp ${formatNumber(temperature, 2)}`;
  dom.softmaxLossLabel.textContent = `cross-entropy ${formatNumber(loss, 3)} nats`;

  dom.softmaxPanel.replaceChildren();
  probabilities.forEach((probability, index) => {
    const row = createElement("div", "softmax-row");
    const track = createElement("div", "softmax-track");
    const fill = createElement("span");
    fill.style.width = `${probability * 100}%`;
    track.append(fill);
    row.append(
      createElement("strong", "", softmaxNames[index]),
      track,
      createElement("em", "", formatPercent(probability))
    );
    dom.softmaxPanel.append(row);
  });
  dom.softmaxNarrative.textContent = `The true word is “${correctName}”. Softmax assigns it ${formatPercent(probabilities[correctIndex])}, so cross-entropy loss is ${formatNumber(loss, 3)} nats. Drag a score or temperature and replay the four steps to see where that number came from.`;
  renderSoftmaxStep({ logits, temperature, scaled, maxScaled, shifted, exponentials, exponentialTotal, probabilities, correctName, correctIndex, loss });
}

function activation(name, value) {
  if (name === "relu") return Math.max(0, value);
  if (name === "sigmoid") return 1 / (1 + Math.exp(-value));
  return Math.tanh(value);
}

const forwardEmbeddings = {
  the: [0.20, 0.10],
  cat: [0.70, -0.30],
  dog: [0.60, -0.20],
  sat: [-0.40, 0.60],
  ran: [-0.30, 0.70]
};
const forwardCandidates = ["sat", "ran", "slept"];
const forwardW1 = [
  [1.1, -0.6, 0.4],
  [0.3, 0.9, -0.7],
  [0.8, -0.5, 0.6],
  [-0.4, 1.0, 0.5]
];
const forwardB1 = [-0.1, 0.2, 0.0];
const forwardW2 = [
  [0.9, -0.4, 0.2],
  [-0.6, 0.8, -0.3],
  [0.5, -0.2, 0.7]
];
const forwardB2 = [0.1, 0.0, -0.1];

const forwardStepMeta = [
  {
    title: "Look up and join the two embedding rows",
    copy: "Start with the two context words. Each token ID selects one row from the embedding table; joining those rows gives the four-number input.",
    badge: "embedding lookup"
  },
  {
    title: "Compute one hidden neuron's dot product",
    copy: "Follow one hidden neuron closely. Multiply each input by its connecting weight, add the four products, then add the neuron's bias.",
    badge: "multiply + add"
  },
  {
    title: "Bend all hidden values with the activation",
    copy: "The activation bends each raw hidden value. This non-linear step is what prevents several layers from collapsing into one multiply-and-add.",
    badge: "activation"
  },
  {
    title: "Turn the hidden state into three logits",
    copy: "Each candidate word has its own output weights and bias. One dot product per candidate produces three raw scores called logits.",
    badge: "output scores"
  },
  {
    title: "Pause at the logits before softmax",
    copy: "The forward network has produced three legal raw scores, but they are not probabilities yet. The next section shows exactly how softmax converts them.",
    badge: "handoff to softmax"
  }
];

function stopForwardPlayback() {
  if (state.forwardPlayTimer) {
    clearInterval(state.forwardPlayTimer);
    state.forwardPlayTimer = null;
  }
  if (dom.forwardPlayButton) dom.forwardPlayButton.textContent = "Play";
}

function setForwardStep(nextStep, { keepPlaying = false } = {}) {
  state.forwardStep = clamp(nextStep, 0, forwardStepMeta.length - 1);
  if (!keepPlaying) stopForwardPlayback();
  renderForwardPass();
}

function toggleForwardPlayback() {
  if (state.forwardPlayTimer) {
    stopForwardPlayback();
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setForwardStep(forwardStepMeta.length - 1);
    return;
  }
  if (state.forwardStep >= forwardStepMeta.length - 1) state.forwardStep = 0;
  dom.forwardPlayButton.textContent = "Pause";
  renderForwardPass();
  state.forwardPlayTimer = setInterval(() => {
    if (state.forwardStep >= forwardStepMeta.length - 1) {
      stopForwardPlayback();
      return;
    }
    state.forwardStep += 1;
    renderForwardPass();
  }, 1600);
}

function resetForwardWalkthrough() {
  stopForwardPlayback();
  state.forwardStep = 0;
  state.forwardCandidateFocus = null;
  renderForwardPass();
}

function renderForwardPass() {
  const wordA = dom.forwardCtxA.value;
  const wordB = dom.forwardCtxB.value;
  const activationName = dom.activationSelect.value;
  const embA = forwardEmbeddings[wordA];
  const embB = forwardEmbeddings[wordB];
  const input = [embA[0], embA[1], embB[0], embB[1]];
  const inputLabels = [`${wordA}.x`, `${wordA}.y`, `${wordB}.x`, `${wordB}.y`];
  const z1 = forwardB1.map((bias, j) => bias + input.reduce((sum, value, i) => sum + value * forwardW1[i][j], 0));
  const hidden = z1.map((value) => activation(activationName, value));
  const logits = forwardB2.map((bias, k) => bias + hidden.reduce((sum, value, j) => sum + value * forwardW2[j][k], 0));
  const bestIndex = logits.indexOf(Math.max(...logits));
  let candidateFocus = state.forwardCandidateFocus;
  if (candidateFocus === null || candidateFocus === undefined) candidateFocus = bestIndex;
  candidateFocus = clamp(candidateFocus, 0, forwardCandidates.length - 1);
  state.forwardCandidateFocus = candidateFocus;
  renderForwardCurrentState({ wordA, wordB, embA, embB, activationName });

  // Default focus = the hidden neuron that pushes hardest on the winning word.
  let focus = state.forwardFocus;
  if (focus === null || focus === undefined) {
    const responsibility = hidden.map((value, j) => Math.abs(value * forwardW2[j][bestIndex]));
    focus = responsibility.indexOf(Math.max(...responsibility));
  }
  focus = clamp(focus, 0, hidden.length - 1);

  // Signed, data-dependent contributions, used to colour and weight the SVG edges.
  const inContrib = [0, 1].map((wordIdx) => (
    hidden.map((_, j) => input[wordIdx * 2] * forwardW1[wordIdx * 2][j] + input[wordIdx * 2 + 1] * forwardW1[wordIdx * 2 + 1][j])
  ));
  const hidContrib = hidden.map((value, j) => logits.map((_, k) => value * forwardW2[j][k]));

  const step = clamp(state.forwardStep, 0, forwardStepMeta.length - 1);
  const meta = forwardStepMeta[step];
  dom.forwardStepTitle.textContent = meta.title;
  dom.forwardStepCopy.textContent = meta.copy;
  dom.forwardStepCount.textContent = `step ${step + 1} of ${forwardStepMeta.length}`;
  dom.forwardDetailBadge.textContent = meta.badge;
  dom.forwardBackButton.disabled = step === 0;
  dom.forwardNextButton.disabled = step === forwardStepMeta.length - 1;
  dom.forwardStepButtons.forEach((button, index) => {
    const active = index === step;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  dom.forwardSummary.textContent = `step ${step + 1}: ${meta.badge}`;
  renderNetworkSvg([wordA, wordB], hidden, forwardCandidates, logits, {
    step,
    focus,
    bestIndex,
    inContrib,
    hidContrib,
    z1,
    embeddings: [embA, embB],
    activationName,
    candidateFocus
  });
  dom.forwardPanel.replaceChildren(...buildForwardStep({
    step, wordA, wordB, embA, embB, input, inputLabels, activationName, z1, hidden, logits, bestIndex, focus, candidateFocus
  }));
  renderMatrixMultiplyPanel({ wordA, wordB, input, inputLabels, z1 });
  renderScoringRolesPanel({ wordA, wordB, embA, embB, hidden, logits, candidateFocus });
}

function activationEffectTag(name, z) {
  if (name === "relu") return z <= 0 ? "clipped to 0" : "kept as is";
  if (name === "sigmoid") return "squashed to (0, 1)";
  return "squashed to (-1, 1)";
}

function activationControlDescription(name) {
  if (name === "relu") return "ReLU -> keep positive, clip negative";
  if (name === "sigmoid") return "sigmoid -> squeeze every value between 0 and 1";
  return "tanh -> squeeze every value between -1 and 1";
}

function renderForwardCurrentState({ wordA, wordB, embA, embB, activationName }) {
  const vectorText = (vector) => `[${vector.map((value) => formatNumber(value, 2)).join(", ")}]`;
  dom.forwardCtxAReadout.textContent = `${wordA} -> ${vectorText(embA)}`;
  dom.forwardCtxBReadout.textContent = `${wordB} -> ${vectorText(embB)}`;
  dom.forwardActivationReadout.textContent = activationControlDescription(activationName);
}

function signedProduct(value, weight) {
  const v = formatNumber(value, 2);
  const w = formatNumber(weight, 2);
  return `${value < 0 ? `(${v})` : v}x${weight < 0 ? `(${w})` : w}`;
}

function sumTerm(value, digits = 3) {
  const text = formatNumber(value, digits);
  return value < 0 ? `(${text})` : text;
}

function forwardStepHead(text) {
  return createElement("p", "forward-step-head", text);
}

function forwardExplanation(title, text) {
  const block = createElement("div", "forward-explanation");
  block.append(createElement("strong", "", title), createElement("p", "", text));
  return block;
}

function forwardDefinition(symbol, name, text) {
  const block = createElement("div", "forward-definition");
  block.append(createElement("code", "", symbol), createElement("strong", "", name), createElement("p", "", text));
  return block;
}

function forwardVectorCard(word, vector) {
  const card = createElement("article", "forward-vector-card");
  card.append(
    createElement("span", "forward-card-kicker", `word: ${word}`),
    createElement("h4", "", `Look up the row for “${word}”`),
    createElement("p", "", `The token ID for “${word}” points to one row in the embedding table E. We write E_${word} to mean “the row in E selected for ${word}.”`),
    createElement("code", "forward-vector-value", `E_${word} = [${vector.map((value) => formatNumber(value, 2)).join(", ")}]`)
  );
  const coordinates = createElement("div", "forward-coordinate-grid");
  vector.forEach((value, index) => {
    const item = createElement("div", "forward-coordinate-item");
    item.append(createElement("strong", "", `coordinate ${index + 1}`), createElement("code", "", formatNumber(value, 2)));
    coordinates.append(item);
  });
  card.append(coordinates);
  return card;
}

function forwardSignClass(value) {
  if (value > 0) return "is-positive";
  if (value < 0) return "is-negative";
  return "is-zero";
}

function forwardContributionLedger(rows) {
  const ledger = createElement("div", "forward-ledger");
  const header = createElement("div", "forward-ledger-row forward-ledger-head");
  header.append(createElement("span", "", "source number"), createElement("span", "", "calculation: input × weight = contribution"));
  ledger.append(header);
  rows.forEach(({ source, input, weight, product }) => {
    const row = createElement("div", "forward-ledger-row");
    const equation = createElement("div", "forward-ledger-equation");
    equation.append(
      createElement("code", "", formatNumber(input, 3)),
      createElement("span", "forward-operator", "×"),
      createElement("code", "", formatNumber(weight, 3)),
      createElement("span", "forward-operator", "="),
      createElement("code", `forward-result ${forwardSignClass(product)}`, formatNumber(product, 3))
    );
    row.append(createElement("strong", "", source), equation);
    ledger.append(row);
  });
  return ledger;
}

function forwardResultRow(label, expression, result, note = "") {
  const row = createElement("div", "forward-result-row");
  row.append(createElement("strong", "", label), createElement("code", "", expression), createElement("code", `forward-result ${forwardSignClass(result)}`, formatNumber(result, 3)));
  if (note) row.append(createElement("small", "", note));
  return row;
}

function activationRuleDescription(name) {
  if (name === "relu") return "ReLU keeps a positive raw value and replaces a negative raw value with 0.";
  if (name === "sigmoid") return "Sigmoid bends every raw value into the range from 0 to 1.";
  return "tanh bends every raw value into the range from -1 to 1.";
}

function activationWorkedExpression(name, raw, result) {
  if (name === "relu") return `max(0, ${formatNumber(raw, 3)}) = ${formatNumber(result, 3)}`;
  return `${name}(${formatNumber(raw, 3)}) = ${formatNumber(result, 3)}`;
}

function forwardParameterRoute(word, vector, weights, focus) {
  const route = createElement("div", "forward-parameter-route");
  const source = createElement("div", "forward-parameter-source");
  source.append(
    createElement("strong", "", `Embedding row E_${word}`),
    createElement("code", "", `[${vector.map((value) => formatNumber(value, 2)).join(", ")}]`),
    createElement("small", "", "two source coordinates")
  );
  const connection = createElement("div", "forward-parameter-connection");
  connection.append(
    createElement("strong", "", `Weights on the connection to h${focus + 1}`),
    createElement("code", "", `[${weights.map((value) => formatNumber(value, 2)).join(", ")}]`),
    createElement("small", "", `coordinate 1 uses ${formatNumber(weights[0], 2)}; coordinate 2 uses ${formatNumber(weights[1], 2)}`)
  );
  const target = createElement("div", "forward-parameter-target");
  target.append(createElement("strong", "", `hidden neuron h${focus + 1}`), createElement("small", "", "receives both weighted coordinates"));
  route.append(source, createElement("span", "forward-route-arrow", "→"), connection, createElement("span", "forward-route-arrow", "→"), target);
  return route;
}

function buildForwardParameterMap(wordA, wordB, embA, embB, focus) {
  const map = createElement("section", "forward-parameter-map");
  map.append(
    createElement("h4", "", `Where the weights and bias for h${focus + 1} live`),
    createElement("p", "", "Each line from a two-number embedding row to the selected neuron stands for two coordinate connections. Each coordinate connection owns one weight.")
  );
  const routes = createElement("div", "forward-parameter-routes");
  routes.append(
    forwardParameterRoute(wordA, embA, [forwardW1[0][focus], forwardW1[1][focus]], focus),
    forwardParameterRoute(wordB, embB, [forwardW1[2][focus], forwardW1[3][focus]], focus)
  );
  const bias = createElement("div", "forward-parameter-bias");
  bias.append(
    createElement("strong", "", `Inside h${focus + 1}: bias`),
    createElement("code", "", `b = ${formatNumber(forwardB1[focus], 2)}`),
    createElement("span", "", "The bias belongs to the neuron itself, not to any one incoming connection.")
  );
  map.append(routes, bias);
  return map;
}

function buildForwardCandidatePicker(candidateFocus, logits) {
  const picker = createElement("div", "forward-candidate-picker");
  picker.setAttribute("role", "group");
  picker.setAttribute("aria-label", "Choose a candidate logit to inspect");
  forwardCandidates.forEach((candidate, index) => {
    const button = createElement("button", index === candidateFocus ? "is-active" : "");
    button.type = "button";
    button.setAttribute("aria-pressed", String(index === candidateFocus));
    button.append(createElement("strong", "", candidate), createElement("span", "", `logit ${formatNumber(logits[index], 3)}`));
    button.addEventListener("click", () => {
      state.forwardCandidateFocus = index;
      state.forwardStep = 3;
      renderForwardPass();
    });
    picker.append(button);
  });
  return picker;
}

function forwardOutputParameterRoute(hiddenIndex, hiddenValue, weight, candidate) {
  const route = createElement("div", "forward-parameter-route");
  const source = createElement("div", "forward-parameter-source");
  source.append(
    createElement("strong", "", `Hidden value h${hiddenIndex + 1}`),
    createElement("code", "", formatNumber(hiddenValue, 3)),
    createElement("small", "", "computed from this input; not a stored parameter")
  );
  const connection = createElement("div", "forward-parameter-connection");
  connection.append(
    createElement("strong", "", `Output weight on h${hiddenIndex + 1} → ${candidate}`),
    createElement("code", "", `w = ${formatNumber(weight, 2)}`),
    createElement("small", "", "trainable parameter stored on this edge")
  );
  const target = createElement("div", "forward-parameter-target");
  target.append(createElement("strong", "", `“${candidate}” scorer`), createElement("small", "", "receives this weighted hidden value"));
  route.append(source, createElement("span", "forward-route-arrow", "→"), connection, createElement("span", "forward-route-arrow", "→"), target);
  return route;
}

function buildForwardOutputParameterMap(candidateIndex, hidden) {
  const candidate = forwardCandidates[candidateIndex];
  const map = createElement("section", "forward-parameter-map forward-output-parameter-map");
  map.append(
    createElement("h4", "", `Where the output weights and bias for “${candidate}” live`),
    createElement("p", "", `The “${candidate}” scorer receives all three hidden values. Each incoming edge owns one output weight; the scorer itself owns one output bias.`)
  );
  const routes = createElement("div", "forward-parameter-routes");
  hidden.forEach((value, hiddenIndex) => {
    routes.append(forwardOutputParameterRoute(hiddenIndex, value, forwardW2[hiddenIndex][candidateIndex], candidate));
  });
  const bias = createElement("div", "forward-parameter-bias");
  bias.append(
    createElement("strong", "", `Inside the “${candidate}” scorer: output bias`),
    createElement("code", "", `b = ${formatNumber(forwardB2[candidateIndex], 2)}`),
    createElement("span", "", "This bias is added after the three weighted hidden contributions.")
  );
  map.append(routes, bias);
  return map;
}

function forwardRecapCard(stepNumber, title, value, explanation) {
  const card = createElement("article", "forward-recap-card");
  card.append(
    createElement("span", "forward-card-kicker", `completed in step ${stepNumber}`),
    createElement("h4", "", title),
    createElement("code", "", value),
    createElement("p", "", explanation)
  );
  return card;
}

function buildForwardHandoffRecap({ wordA, wordB, embA, embB, input, activationName, z1, hidden, logits }) {
  const recap = createElement("div", "forward-recap-grid");
  const activationLabel = activationName === "relu" ? "ReLU" : activationName;
  recap.append(
    forwardRecapCard("1", "Embedding rows selected", `E_${wordA} = [${embA.map((value) => formatNumber(value, 2)).join(", ")}]; E_${wordB} = [${embB.map((value) => formatNumber(value, 2)).join(", ")}]`, "The two token IDs selected these rows from the embedding table."),
    forwardRecapCard("1", "Joined input created", `e = [${input.map((value) => formatNumber(value, 2)).join(", ")}]`, "The rows were placed one after the other to make the network input."),
    forwardRecapCard("2–3", "Hidden state computed", `raw = [${z1.map((value) => formatNumber(value, 3)).join(", ")}] → ${activationLabel} → h = [${hidden.map((value) => formatNumber(value, 3)).join(", ")}]`, "Dot products and biases produced raw hidden inputs; the activation bent them into the hidden state."),
    forwardRecapCard("4", "Candidate logits produced", `z = [${logits.map((value) => formatNumber(value, 3)).join(", ")}]`, "One output-weight path produced one raw score for each candidate word.")
  );
  return recap;
}

function handoffEvidenceCard(title, evidence, explanation, className = "") {
  const card = createElement("article", `forward-handoff-evidence ${className}`.trim());
  card.append(createElement("strong", "", title), createElement("code", "", evidence), createElement("p", "", explanation));
  return card;
}

function buildForwardHandoffEvidence(logits, bestIndex) {
  const evidence = createElement("div", "forward-handoff-evidence-grid");
  const negativeIndex = logits.findIndex((value) => value < 0);
  const sum = logits.reduce((total, value) => total + value, 0);
  const signEvidence = negativeIndex >= 0
    ? `${forwardCandidates[negativeIndex]} logit = ${formatNumber(logits[negativeIndex], 3)}`
    : `all three happen to be positive in this example`;
  const signExplanation = negativeIndex >= 0
    ? "A probability cannot be negative, so the logits cannot yet be probabilities."
    : "Logits are allowed to be negative even though this particular set is positive; probabilities are never negative.";
  evidence.append(
    handoffEvidenceCard("Problem 1: raw scores may be negative", signEvidence, signExplanation, negativeIndex >= 0 ? "is-negative" : ""),
    handoffEvidenceCard("Problem 2: the scores do not form a whole", `${logits.map((value) => sumTerm(value)).join(" + ")} = ${formatNumber(sum, 3)}`, "A probability distribution must add to exactly 1. These raw logits do not."),
    handoffEvidenceCard("What the largest logit tells us", `${forwardCandidates[bestIndex]} is largest at ${formatNumber(logits[bestIndex], 3)}`, `This makes “${forwardCandidates[bestIndex]}” the current leader, but ${formatNumber(logits[bestIndex], 3)} does not mean ${formatNumber(logits[bestIndex] * 100, 1)}% confidence.`)
  );
  return evidence;
}

function buildForwardStep(ctx) {
  const { step, wordA, wordB, embA, embB, input, inputLabels, activationName, z1, hidden, logits, bestIndex, focus, candidateFocus } = ctx;
  const nodes = [];

  if (step === 0) {
    nodes.push(forwardExplanation("Goal of this step", "Turn the two context words into the four input numbers that the first hidden layer can use."));
    const definitions = createElement("div", "forward-definition-grid");
    definitions.append(
      forwardDefinition("E", "embedding table", "A table with one learned row of numbers for every word in this toy vocabulary."),
      forwardDefinition("e", "joined input vector", "The new four-number vector made by placing the two selected embedding rows one after the other.")
    );
    nodes.push(definitions);
    const vectors = createElement("div", "forward-vector-grid");
    vectors.append(forwardVectorCard(wordA, embA), forwardVectorCard(wordB, embB));
    nodes.push(vectors);
    const join = createElement("div", "forward-join-card");
    join.append(
      createElement("h4", "", "Join the rows; do not add them"),
      createElement("p", "", `Put E_${wordB} after E_${wordA}. Every coordinate is kept, in the same order.`)
    );
    const joinFlow = createElement("div", "forward-join-flow");
    joinFlow.append(
      createElement("code", "", `E_${wordA} [${embA.map((value) => formatNumber(value, 2)).join(", ")}]`),
      createElement("span", "", "+ place after +"),
      createElement("code", "", `E_${wordB} [${embB.map((value) => formatNumber(value, 2)).join(", ")}]`),
      createElement("span", "", "→"),
      createElement("code", "forward-join-result", `e = [${input.map((value) => formatNumber(value, 2)).join(", ")}]`)
    );
    join.append(joinFlow, createElement("p", "forward-takeaway", `What we learned: two 2-number embedding rows became one 4-number input vector e.`));
    nodes.push(join);
  } else if (step === 1) {
    const products = input.map((value, i) => value * forwardW1[i][focus]);
    const weightedTotal = products.reduce((sum, value) => sum + value, 0);
    const sourceNames = [`${wordA}, coordinate 1`, `${wordA}, coordinate 2`, `${wordB}, coordinate 1`, `${wordB}, coordinate 2`];
    nodes.push(forwardExplanation(`Goal of this step: calculate the raw input to h${focus + 1}`, `Hidden neuron h${focus + 1} gives each of the four input numbers its own importance, called a weight. Those weights live on the incoming connections shown in the picture. Click another hidden neuron to inspect a different set.`));
    nodes.push(buildForwardParameterMap(wordA, wordB, embA, embB, focus));
    nodes.push(forwardExplanation("What gets learned during training?", "The connection weights and the neuron bias are trainable parameters. They usually begin as small random values. Training repeatedly adjusts them so useful inputs push each neuron in useful ways. This walkthrough freezes one illustrative set of values so you can inspect the calculation."));
    const definitions = createElement("div", "forward-definition-grid");
    definitions.append(
      forwardDefinition("e", "input vector", `The four numbers joined in Step 1: [${input.map((value) => formatNumber(value, 2)).join(", ")}].`),
      forwardDefinition("w", "weight", "A trainable multiplier stored on one coordinate connection. It says how strongly that input coordinate pushes this neuron."),
      forwardDefinition("b", "bias", `A trainable constant stored inside the neuron and added after all incoming contributions. For h${focus + 1}, b = ${formatNumber(forwardB1[focus], 2)}.`)
    );
    nodes.push(definitions);
    nodes.push(forwardContributionLedger(input.map((value, index) => ({ source: sourceNames[index], input: value, weight: forwardW1[index][focus], product: products[index] }))));
    const totals = createElement("div", "forward-result-stack");
    totals.append(
      forwardResultRow("1. Add the four contributions", products.map((value) => sumTerm(value)).join(" + "), weightedTotal, "This sum is the dot product e · w."),
      forwardResultRow("2. Add the bias", `${formatNumber(weightedTotal, 3)} + ${sumTerm(forwardB1[focus], 2)}`, z1[focus], `This is the raw input to h${focus + 1}; the activation has not been applied yet.`)
    );
    nodes.push(totals, createElement("p", "forward-takeaway", `What we learned: h${focus + 1} compresses four input numbers into one raw value, ${formatNumber(z1[focus], 3)}.`));
  } else if (step === 2) {
    nodes.push(forwardExplanation("Goal of this step", `Pass each raw hidden value through ${activationName === "relu" ? "ReLU" : activationName}, the selected activation function. ${activationRuleDescription(activationName)}`));
    nodes.push(forwardDefinition("activation", "the bend between layers", "Without this bend, stacking multiply-and-add layers would still behave like one large linear calculation."));
    const activationGrid = createElement("div", "forward-activation-grid");
    z1.forEach((raw, index) => {
      const card = createElement("article", `forward-activation-card${index === focus ? " is-focus" : ""}`);
      card.append(
        createElement("span", "forward-card-kicker", `hidden neuron h${index + 1}`),
        createElement("p", "", `Raw input from the dot product: ${formatNumber(raw, 3)}`),
        createElement("code", "forward-activation-equation", activationWorkedExpression(activationName, raw, hidden[index])),
        createElement("p", `forward-activation-effect ${forwardSignClass(hidden[index])}`, activationEffectTag(activationName, raw))
      );
      activationGrid.append(card);
    });
    nodes.push(activationGrid, createElement("p", "forward-takeaway", `What we learned: the hidden layer now holds [${hidden.map((value) => formatNumber(value, 3)).join(", ")}]. These three activated numbers form the hidden state sent to the output layer.`));
  } else if (step === 3) {
    const candidate = forwardCandidates[candidateFocus];
    const products = hidden.map((value, hiddenIndex) => value * forwardW2[hiddenIndex][candidateFocus]);
    const weightedTotal = products.reduce((sum, value) => sum + value, 0);
    nodes.push(forwardExplanation("Goal of this step", "Give each candidate next word one raw score. Inspect one candidate path at a time, then compare the three finished logits in the summary."));
    nodes.push(buildForwardCandidatePicker(candidateFocus, logits));
    nodes.push(buildForwardOutputParameterMap(candidateFocus, hidden));
    nodes.push(forwardExplanation("What is learned, and what is computed?", `The three hidden values change with the context, so they are computed signals, not stored parameters. The output weights and output bias are trainable parameters. They usually start as small random values and training adjusts them. This walkthrough freezes one illustrative set.`));
    const definitions = createElement("div", "forward-definition-grid");
    definitions.append(
      forwardDefinition("h", "hidden state", `The three activated values from Step 3: [${hidden.map((value) => formatNumber(value, 3)).join(", ")}].`),
      forwardDefinition("W₂", "output weights", `One trainable weight on each hidden-to-candidate edge. The selected “${candidate}” path uses [${forwardW2.map((row) => formatNumber(row[candidateFocus], 2)).join(", ")}].`),
      forwardDefinition("b₂", "output bias", `One trainable constant inside each candidate scorer. For “${candidate}”, b₂ = ${formatNumber(forwardB2[candidateFocus], 2)}.`),
      forwardDefinition("logit", "raw candidate score", "The weighted hidden-state total plus output bias, before softmax creates probabilities.")
    );
    nodes.push(definitions);
    const card = createElement("article", `forward-candidate-card${candidateFocus === bestIndex ? " is-largest" : ""}`);
    card.append(
      createElement("span", "forward-card-kicker", "worked candidate path"),
      createElement("h4", "", candidate),
      createElement("p", "", `Multiply each hidden value by the weight on its edge into the “${candidate}” scorer.`),
      forwardContributionLedger(hidden.map((value, hiddenIndex) => ({ source: `h${hiddenIndex + 1} → ${candidate}`, input: value, weight: forwardW2[hiddenIndex][candidateFocus], product: products[hiddenIndex] })))
    );
    const totals = createElement("div", "forward-result-stack");
    totals.append(
      forwardResultRow("1. Add the three contributions", products.map((value) => sumTerm(value)).join(" + "), weightedTotal, `This is the hidden-state dot product for “${candidate}”.`),
      forwardResultRow("2. Add the output bias", `${formatNumber(weightedTotal, 3)} + ${sumTerm(forwardB2[candidateFocus], 2)}`, logits[candidateFocus], `Final raw logit for “${candidate}”.`)
    );
    card.append(totals);
    nodes.push(card, buildLogitTable(logits, bestIndex), createElement("p", "forward-takeaway", `What we learned: the selected “${candidate}” path produces logit ${formatNumber(logits[candidateFocus], 3)}. Across all candidates, “${forwardCandidates[bestIndex]}” has the largest raw score, ${formatNumber(logits[bestIndex], 3)}. These scores are still not probabilities.`));
  } else {
    nodes.push(forwardExplanation("What is complete", "The neural network has finished its raw scoring work. It selected embeddings, built a hidden state, and produced one logit per candidate. Nothing in those four steps has converted the scores into probabilities."));
    nodes.push(buildForwardHandoffRecap({ wordA, wordB, embA, embB, input, activationName, z1, hidden, logits }));
    nodes.push(buildLogitTable(logits, bestIndex));
    nodes.push(buildForwardHandoffEvidence(logits, bestIndex));
    const nextProblem = createElement("section", "forward-next-problem");
    nextProblem.append(
      createElement("h4", "", "The next problem: turn scores into probabilities"),
      createElement("p", "", "We need one operation that makes every value positive, makes the full set add to 1, and preserves the ranking so the strongest logit still receives the largest probability."),
      createElement("p", "", "That operation is Softmax. The next section builds it from these exact three logits; no new network weights are involved in that conversion.")
    );
    nodes.push(nextProblem);
    const link = createElement("a", "forward-next-link", "Continue to Softmax and assigning blame");
    link.href = "#softmax";
    nodes.push(link);
  }
  return nodes;
}

function buildLogitTable(logits, bestIndex) {
  const wrap = createElement("div", "deriv-table-wrap");
  const table = createElement("table", "deriv-table forward-logit-table");
  const thead = createElement("thead");
  const headRow = createElement("tr");
  ["candidate", "raw logit", "what it means now"].forEach((title) => headRow.append(createElement("th", "", title)));
  thead.append(headRow);
  const tbody = createElement("tbody");
  logits.forEach((logit, index) => {
    const row = createElement("tr", index === bestIndex ? "is-focus-row" : "");
    row.append(
      createElement("td", "row-label", forwardCandidates[index]),
      createElement("td", "", formatNumber(logit, 3)),
      createElement("td", "row-label", index === bestIndex ? "largest raw score" : "smaller raw score")
    );
    tbody.append(row);
  });
  table.append(thead, tbody);
  wrap.append(table);
  return wrap;
}

function buildActivationTable(name, z1, hidden, focus) {
  const wrap = createElement("div", "deriv-table-wrap");
  const table = createElement("table", "deriv-table forward-activation-table");
  const thead = createElement("thead");
  const headRow = createElement("tr");
  ["neuron", "raw input", `${name}(raw)`, "effect"].forEach((title) => headRow.append(createElement("th", "", title)));
  thead.append(headRow);
  const tbody = createElement("tbody");
  z1.forEach((z, j) => {
    const row = createElement("tr", j === focus ? "is-focus-row" : "");
    row.append(
      createElement("td", "row-label", `h${j + 1}`),
      createElement("td", "", formatNumber(z, 2)),
      createElement("td", "", formatNumber(hidden[j], 2)),
      createElement("td", "row-label", activationEffectTag(name, z))
    );
    tbody.append(row);
  });
  table.append(thead, tbody);
  wrap.append(table);
  return wrap;
}

function buildTeachingMatrix(title, subtitle, rows, options = {}) {
  const block = createElement("div", "matrix-teaching-block");
  block.append(createElement("strong", "matrix-teaching-title", title), createElement("span", "matrix-teaching-subtitle", subtitle));
  const table = createElement("table", "matrix-number-table");
  const tbody = createElement("tbody");
  rows.forEach((rowValues, rowIndex) => {
    const row = createElement("tr", rowIndex === options.highlightRow ? "is-highlight-row" : "");
    if (options.rowLabels) row.append(createElement("th", "", options.rowLabels[rowIndex]));
    rowValues.forEach((value) => row.append(createElement("td", options.highlightAll ? "is-highlight-cell" : "", formatNumber(value, options.digits ?? 2))));
    tbody.append(row);
  });
  table.append(tbody);
  block.append(table);
  return block;
}

function matrixShapeCard(symbol, shape, explanation, className = "") {
  const card = createElement("div", `matrix-shape-card ${className}`.trim());
  card.append(createElement("code", "", symbol), createElement("strong", "", shape), createElement("span", "", explanation));
  return card;
}

function renderMatrixMultiplyPanel({ wordA, wordB, input, inputLabels, z1 }) {
  if (!dom.matrixMultiplyPanel) return;
  const weightRows = forwardB1.map((_, hiddenIndex) => forwardW1.map((row) => row[hiddenIndex]));
  const weightedTotals = weightRows.map((weights) => weights.reduce((sum, weight, inputIndex) => sum + weight * input[inputIndex], 0));
  const panel = dom.matrixMultiplyPanel;
  const nodes = [];

  nodes.push(forwardExplanation("Why matrix multiplication appears here", `Step 2 followed one hidden neuron. The full hidden layer repeats that same dot product for h1, h2, and h3. Matrix multiplication is the compact way to run all three row-by-column calculations together.`));

  const shapes = createElement("div", "matrix-shape-check");
  shapes.append(
    matrixShapeCard("W₁", "3 × 4", "3 hidden-neuron rows; 4 weights in each row"),
    matrixShapeCard("e", "4 × 1", `4 input numbers from “${wordA} ${wordB}”`, "is-input"),
    matrixShapeCard("W₁e", "3 × 1", "1 weighted total for each hidden neuron", "is-output")
  );
  const compatibility = createElement("p", "matrix-shape-rule", "Shape check: (3 × 4)(4 × 1) → (3 × 1). The two inside 4s match, so every four-weight row can pair with the four-number input column.");
  nodes.push(shapes, compatibility);

  const equation = createElement("div", "matrix-equation-visual");
  equation.append(
    buildTeachingMatrix("W₁", "one row per hidden neuron", weightRows, { rowLabels: ["h1", "h2", "h3"], highlightRow: 0 }),
    createElement("span", "matrix-equation-operator", "×"),
    buildTeachingMatrix("e", `joined input for “${wordA} ${wordB}”`, input.map((value) => [value]), { rowLabels: inputLabels, highlightAll: true }),
    createElement("span", "matrix-equation-operator", "="),
    buildTeachingMatrix("weighted totals", "before bias and activation", weightedTotals.map((value) => [value]), { rowLabels: ["h1", "h2", "h3"], highlightRow: 0, digits: 3 })
  );
  nodes.push(equation);

  nodes.push(forwardExplanation("Compute the first output cell: row h1 · column e", "Select the h1 weight row and the only input column. Multiply matching positions, add the four products, and place the result in the h1 output cell."));
  const firstProducts = input.map((value, index) => value * weightRows[0][index]);
  nodes.push(forwardContributionLedger(input.map((value, index) => ({
    source: `${inputLabels[index]} with h1 weight`,
    input: value,
    weight: weightRows[0][index],
    product: firstProducts[index]
  }))));
  const firstResult = createElement("div", "forward-result-stack");
  firstResult.append(
    forwardResultRow("Add the four products", firstProducts.map((value) => sumTerm(value)).join(" + "), weightedTotals[0], "Place this value in output cell h1."),
    forwardResultRow("Repeat with row h2", "row h2 · column e", weightedTotals[1], "This fills output cell h2."),
    forwardResultRow("Repeat with row h3", "row h3 · column e", weightedTotals[2], "This fills output cell h3.")
  );
  nodes.push(firstResult);

  const biasStep = createElement("section", "matrix-bias-step");
  biasStep.append(
    createElement("h4", "", "Bias is a separate step after the matrix multiplication"),
    createElement("p", "", "Matrix multiplication produced the three weighted totals. Now add one learned bias to each matching hidden neuron."),
    createElement("code", "", `[${weightedTotals.map((value) => formatNumber(value, 3)).join(", ")}] + [${forwardB1.map((value) => formatNumber(value, 2)).join(", ")}] = [${z1.map((value) => formatNumber(value, 3)).join(", ")}]`),
    createElement("p", "", "Only after this bias addition does the activation function bend the three raw hidden values.")
  );
  nodes.push(biasStep, createElement("p", "forward-takeaway", `What we learned: W₁e is not new arithmetic. It repeats the dot product from Step 2 once for each hidden-neuron row, producing [${weightedTotals.map((value) => formatNumber(value, 3)).join(", ")}].`));

  panel.replaceChildren(...nodes);
}

function scoringRoleCard(number, title, symbol, values, description, status, className = "") {
  const card = createElement("article", `scoring-role-card ${className}`.trim());
  card.append(
    createElement("span", "scoring-role-number", number),
    createElement("h4", "", title),
    createElement("code", "scoring-role-symbol", symbol)
  );
  const valueList = createElement("div", "scoring-role-values");
  values.forEach((value) => valueList.append(createElement("code", "", value)));
  card.append(valueList, createElement("p", "", description), createElement("strong", "scoring-role-status", status));
  return card;
}

function scoringRoleArrow(label) {
  const arrow = createElement("div", "scoring-role-arrow");
  arrow.append(createElement("span", "", "→"), createElement("small", "", label));
  return arrow;
}

function renderScoringRolesPanel({ wordA, wordB, embA, embB, hidden, logits, candidateFocus }) {
  if (!dom.scoringRolesPanel) return;
  const candidate = forwardCandidates[candidateFocus];
  const outputWeights = forwardW2.map((row) => row[candidateFocus]);
  const flow = createElement("div", "scoring-role-flow");
  flow.append(
    scoringRoleCard(
      "1",
      "Input lookup",
      "embedding table E",
      [
        `${wordA} → [${embA.map((value) => formatNumber(value, 2)).join(", ")}]`,
        `${wordB} → [${embB.map((value) => formatNumber(value, 2)).join(", ")}]`
      ],
      "Token IDs select stored rows that represent the context words entering the network.",
      "Stored learned parameters",
      "is-input-role"
    ),
    scoringRoleArrow("join rows; hidden layer computes"),
    scoringRoleCard(
      "2",
      "Context summary",
      "hidden state h",
      [`h = [${hidden.map((value) => formatNumber(value, 3)).join(", ")}]`],
      `This vector is computed fresh for the current context “${wordA} ${wordB}”. It is not a vocabulary row and is not itself a stored parameter.`,
      "Computed signal",
      "is-hidden-role"
    ),
    scoringRoleArrow(`score candidate “${candidate}”`),
    scoringRoleCard(
      "3",
      "Output scoring",
      `candidate scorer for “${candidate}”`,
      [
        `W₂ weights = [${outputWeights.map((value) => formatNumber(value, 2)).join(", ")}]`,
        `b₂ = ${formatNumber(forwardB2[candidateFocus], 2)} → logit = ${formatNumber(logits[candidateFocus], 3)}`
      ],
      `These separate output parameters compare h with the candidate “${candidate}” and produce its raw logit.`,
      "Stored learned parameters",
      "is-output-role"
    )
  );
  const rule = createElement("p", "scoring-role-rule", "Keep the roles separate: E supplies context-token rows; h is the context-dependent result of computation; W₂ and b₂ score candidate next words. In this toy, the input and output parameter sets are not shared.");
  dom.scoringRolesPanel.replaceChildren(flow, rule);
}

function renderNetworkSvg(contextWords, hidden, candidates, logits, opts = {}) {
  const svg = dom.networkSvg;
  const step = opts.step ?? 4;
  const focus = opts.focus ?? null;
  const bestIndex = opts.bestIndex ?? logits.indexOf(Math.max(...logits));
  const inContrib = opts.inContrib ?? null;
  const hidContrib = opts.hidContrib ?? null;
  const z1 = opts.z1 ?? [];
  const embeddings = opts.embeddings ?? [];
  const activationName = opts.activationName ?? "activation";
  const candidateFocus = opts.candidateFocus ?? bestIndex;
  const activationLabel = activationName === "relu" ? "ReLU" : activationName;
  svg.replaceChildren();
  const inputNodes = contextWords.map((word, index) => ({
    x: 88,
    y: 95 + index * 110,
    label: word,
    value: embeddings[index]
      ? `E [${embeddings[index].map((value) => formatNumber(value, 2)).join(", ")}]`
      : (index === 0 ? "context 1" : "context 2"),
    isWord: true,
    width: 116
  }));
  const hiddenNodes = hidden.map((value, index) => ({
    x: 280,
    y: 60 + index * 90,
    label: `h${index + 1}`,
    value: step < 1
      ? "pending"
      : step === 1
        ? (index === focus ? `raw ${formatNumber(z1[index], 2)}` : "pending")
        : formatNumber(value, 2),
    index
  }));
  const outputNodes = candidates.map((word, index) => ({
    x: 474,
    y: 60 + index * 90,
    label: word,
    value: step >= 3 ? `z ${formatNumber(logits[index], 2)}` : "pending",
    isWord: true,
    isBest: index === bestIndex,
    isSelected: index === candidateFocus,
    index,
    width: 88
  }));
  const edgeWidth = (magnitude) => clamp(1 + magnitude * 3.4, 1, 6).toFixed(2);
  const edgeClass = (weight, hiddenIndex, phase, candidateIndex = null) => {
    const sign = weight >= 0 ? "is-pos" : "is-neg";
    if (phase === "input") {
      if (step !== 1) return `network-edge ${sign} is-muted`;
      return `network-edge ${sign} ${hiddenIndex === focus ? "is-focus" : "is-muted"}`;
    }
    if (step < 3) return `network-edge ${sign} is-muted`;
    if (step === 3) return `network-edge ${sign} ${candidateIndex === candidateFocus ? "is-focus" : "is-muted"}`;
    return `network-edge ${sign} is-focus`;
  };
  const inputLayerLabel = createSvgElement("text", { class: "network-layer-label", x: 88, y: 22 });
  inputLayerLabel.textContent = "context embeddings";
  const hiddenLayerLabel = createSvgElement("text", { class: "network-layer-label", x: 280, y: 22 });
  hiddenLayerLabel.textContent = `hidden layer - ${activationLabel}`;
  const outputLayerLabel = createSvgElement("text", { class: "network-layer-label", x: 474, y: 22 });
  outputLayerLabel.textContent = "candidate logits";
  svg.append(inputLayerLabel, hiddenLayerLabel, outputLayerLabel);
  const parameterLabels = [];
  inputNodes.forEach((source, i) => {
    hiddenNodes.forEach((target, j) => {
      const contribution = inContrib ? inContrib[i][j] : 0;
      const x1 = source.x + (source.width ?? 80) / 2;
      const x2 = target.x - 24;
      svg.append(createSvgElement("line", {
        class: edgeClass(contribution, j, "input"),
        x1,
        y1: source.y,
        x2,
        y2: target.y,
        "stroke-width": edgeWidth(Math.abs(contribution))
      }));
      if (step === 1 && j === focus) {
        const weights = [forwardW1[i * 2][j], forwardW1[i * 2 + 1][j]];
        const label = createSvgElement("text", {
          class: "network-weight-label",
          x: (x1 + x2) / 2,
          y: (source.y + target.y) / 2 - 7
        });
        label.textContent = `${contextWords[i]} w [${weights.map((value) => formatNumber(value, 2)).join(", ")}]`;
        parameterLabels.push(label);
      }
    });
  });
  const outputParameterLabels = [];
  hiddenNodes.forEach((source, j) => {
    outputNodes.forEach((target, k) => {
      const contribution = hidContrib ? hidContrib[j][k] : 0;
      const x1 = source.x + 24;
      const x2 = target.x - (target.width ?? 80) / 2;
      svg.append(createSvgElement("line", {
        class: edgeClass(contribution, j, "output", k),
        x1,
        y1: source.y,
        x2,
        y2: target.y,
        "stroke-width": edgeWidth(Math.abs(contribution))
      }));
      if (step === 3 && k === candidateFocus) {
        const label = createSvgElement("text", {
          class: "network-output-weight-label",
          x: (x1 + x2) / 2,
          y: (source.y + target.y) / 2 - 7
        });
        label.textContent = `w = ${formatNumber(forwardW2[j][k], 2)}`;
        outputParameterLabels.push(label);
      }
    });
  });
  parameterLabels.forEach((label) => svg.append(label));
  outputParameterLabels.forEach((label) => svg.append(label));
  if (step === 1 && focus !== null) {
    const selectedNode = hiddenNodes[focus];
    const biasLabel = createSvgElement("text", {
      class: "network-bias-label",
      x: selectedNode.x,
      y: selectedNode.y + 39
    });
    biasLabel.textContent = `bias b = ${formatNumber(forwardB1[focus], 2)}`;
    svg.append(biasLabel);
  }
  if (step === 3) {
    const selectedOutput = outputNodes[candidateFocus];
    const outputBiasLabel = createSvgElement("text", {
      class: "network-output-bias-label",
      x: selectedOutput.x,
      y: selectedOutput.y + 39
    });
    outputBiasLabel.textContent = `output bias = ${formatNumber(forwardB2[candidateFocus], 2)}`;
    svg.append(outputBiasLabel);
  }
  const drawNode = (node, kind) => {
    const group = createSvgElement("g");
    const isFocusNode = kind === "is-hidden" && node.index === focus && step >= 1;
    if (node.isWord) {
      const width = node.width ?? 80;
      group.append(createSvgElement("rect", {
        class: `network-node ${kind}${node.isBest && step >= 3 ? " is-best" : ""}${node.isSelected && kind === "is-output" && step === 3 ? " is-selected" : ""}${kind === "is-output" && step < 3 ? " is-muted-node" : ""}`,
        x: node.x - width / 2,
        y: node.y - 21,
        width,
        height: 42,
        rx: 11
      }));
    } else {
      group.append(createSvgElement("circle", {
        class: `network-node ${kind}${isFocusNode ? " is-focus" : ""}${kind === "is-hidden" && step < 1 ? " is-muted-node" : ""}`,
        cx: node.x,
        cy: node.y,
        r: 25
      }));
    }
    const label = createSvgElement("text", { class: "network-label", x: node.x, y: node.y - 2 });
    label.textContent = node.label;
    const value = createSvgElement("text", { class: "network-value", x: node.x, y: node.y + 15 });
    value.textContent = node.value;
    group.append(label, value);
    if (kind === "is-hidden") {
      group.style.cursor = "pointer";
      group.addEventListener("click", () => {
        state.forwardFocus = node.index;
        if (state.forwardStep < 1) state.forwardStep = 1;
        renderForwardPass();
      });
    } else if (kind === "is-output") {
      group.style.cursor = "pointer";
      group.addEventListener("click", () => {
        state.forwardCandidateFocus = node.index;
        state.forwardStep = 3;
        renderForwardPass();
      });
    }
    svg.append(group);
  };
  inputNodes.forEach((node) => drawNode(node, "is-input"));
  hiddenNodes.forEach((node) => drawNode(node, "is-hidden"));
  outputNodes.forEach((node) => drawNode(node, "is-output"));
}

/* ---- Backpropagation lab (reuses the forward-pass network) ---- */
function signedFixed(value, digits = 2) {
  if (!Number.isFinite(value)) return "n/a";
  return (value < 0 ? "-" : "+") + Math.abs(value).toFixed(digits);
}

function activationDerivative(name, z) {
  if (name === "relu") return z > 0 ? 1 : 0;
  if (name === "sigmoid") {
    const s = 1 / (1 + Math.exp(-z));
    return s * (1 - s);
  }
  const t = Math.tanh(z);
  return 1 - t * t;
}

function cloneForwardWeights() {
  return {
    w1: forwardW1.map((row) => row.slice()),
    b1: forwardB1.slice(),
    w2: forwardW2.map((row) => row.slice()),
    b2: forwardB2.slice()
  };
}

function initBackpropLab() {
  state.backprop = { weights: cloneForwardWeights(), focus: null, steps: 0, lossHistory: [], pTrueHistory: [] };
  restartBackpropRun();
}

function computeBackpropPass() {
  const { w1, b1, w2, b2 } = state.backprop.weights;
  const wordA = dom.backpropCtxA.value;
  const wordB = dom.backpropCtxB.value;
  const trueWord = dom.backpropTrueWord.value;
  const name = dom.backpropActivation.value;
  const trueIndex = forwardCandidates.indexOf(trueWord);
  const embA = forwardEmbeddings[wordA];
  const embB = forwardEmbeddings[wordB];
  const input = [embA[0], embA[1], embB[0], embB[1]];
  const inputLabels = [`${wordA}.x`, `${wordA}.y`, `${wordB}.x`, `${wordB}.y`];
  const z1 = b1.map((bias, j) => bias + input.reduce((sum, value, i) => sum + value * w1[i][j], 0));
  const hidden = z1.map((value) => activation(name, value));
  const logits = b2.map((bias, k) => bias + hidden.reduce((sum, value, j) => sum + value * w2[j][k], 0));
  const q = softmax(logits);
  const loss = -Math.log(Math.max(q[trueIndex], 1e-9));
  const dz2 = q.map((qi, k) => qi - (k === trueIndex ? 1 : 0));
  const gradW2 = hidden.map((hj) => dz2.map((dk) => hj * dk));
  const gradB2 = dz2.slice();
  const dh = hidden.map((_, j) => dz2.reduce((sum, dk, k) => sum + dk * w2[j][k], 0));
  const dz1 = dh.map((dhj, j) => dhj * activationDerivative(name, z1[j]));
  const gradW1 = input.map((vi) => dz1.map((dj) => vi * dj));
  const gradB1 = dz1.slice();
  return { wordA, wordB, trueWord, name, trueIndex, input, inputLabels, z1, hidden, logits, q, loss, dz2, gradW2, gradB2, dh, dz1, gradW1, gradB1 };
}

function restartBackpropRun() {
  const bp = state.backprop;
  bp.weights = cloneForwardWeights();
  bp.steps = 0;
  bp.focus = null;
  const pass = computeBackpropPass();
  bp.lossHistory = [pass.loss];
  bp.pTrueHistory = [pass.q[pass.trueIndex]];
  renderBackprop();
}

function backpropStep() {
  const bp = state.backprop;
  const pass = computeBackpropPass();
  const lr = Number(dom.backpropRateSlider.value) / 100;
  const { w1, b1, w2, b2 } = bp.weights;
  pass.gradW1.forEach((row, i) => row.forEach((g, j) => { w1[i][j] -= lr * g; }));
  pass.gradB1.forEach((g, j) => { b1[j] -= lr * g; });
  pass.gradW2.forEach((row, j) => row.forEach((g, k) => { w2[j][k] -= lr * g; }));
  pass.gradB2.forEach((g, k) => { b2[k] -= lr * g; });
  bp.steps += 1;
  const after = computeBackpropPass();
  bp.lossHistory.push(after.loss);
  bp.pTrueHistory.push(after.q[after.trueIndex]);
  if (bp.lossHistory.length > 24) { bp.lossHistory.shift(); bp.pTrueHistory.shift(); }
  renderBackprop();
}

function renderBackprop() {
  const bp = state.backprop;
  dom.backpropRateLabel.textContent = formatNumber(Number(dom.backpropRateSlider.value) / 100, 2);
  const pass = computeBackpropPass();
  let focus = bp.focus;
  if (focus === null || focus === undefined) {
    const mags = pass.dz1.map(Math.abs);
    focus = mags.indexOf(Math.max(...mags));
  }
  focus = clamp(focus, 0, pass.hidden.length - 1);
  dom.backpropSummary.textContent = bp.steps === 0 ? "before training" : `${bp.steps} step${bp.steps === 1 ? "" : "s"}`;
  renderBackpropSvg(pass, focus);
  renderBackpropMetrics(pass);
  renderBackpropSpark();
  dom.backpropTracePanel.replaceChildren(...buildBackpropBreakdown(pass, focus));
}

function renderBackpropMetrics(pass) {
  const bp = state.backprop;
  const pTrue = pass.q[pass.trueIndex];
  const n = bp.lossHistory.length;
  const lossDelta = n >= 2 ? bp.lossHistory[n - 1] - bp.lossHistory[n - 2] : null;
  const pDelta = n >= 2 ? bp.pTrueHistory[n - 1] - bp.pTrueHistory[n - 2] : null;
  renderMetricCards(dom.backpropMetrics, [
    {
      value: formatNumber(pass.loss, 3),
      label: "cross-entropy loss (nats)",
      note: lossDelta === null ? "press Step" : (lossDelta <= 0 ? `down ${formatNumber(Math.abs(lossDelta), 3)}` : `up ${formatNumber(lossDelta, 3)}`)
    },
    {
      value: formatPercent(pTrue),
      label: `P("${pass.trueWord}")`,
      note: pDelta === null ? "goal: 100%" : (pDelta >= 0 ? `up ${formatNumber(pDelta * 100, 1)} pts` : `down ${formatNumber(Math.abs(pDelta) * 100, 1)} pts`)
    },
    { value: `${bp.steps}`, label: "gradient steps" }
  ]);
}

function renderBackpropSpark() {
  const svg = dom.backpropLossSpark;
  svg.replaceChildren();
  const hist = state.backprop.lossHistory;
  const W = 320;
  const H = 72;
  const pad = 10;
  if (hist.length < 2) {
    const text = createSvgElement("text", { x: W / 2, y: H / 2 + 4, "text-anchor": "middle" });
    text.textContent = "the loss curve appears as you take steps";
    svg.append(text);
    return;
  }
  const maxL = Math.max(...hist);
  const minL = Math.min(...hist);
  const span = Math.max(maxL - minL, 1e-6);
  const x = (i) => pad + (i / (hist.length - 1)) * (W - 2 * pad);
  const y = (l) => pad + (1 - (l - minL) / span) * (H - 2 * pad);
  const d = hist.map((l, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(l).toFixed(1)}`).join(" ");
  svg.append(createSvgElement("path", { d, class: "spark-line" }));
  svg.append(createSvgElement("circle", { cx: x(0).toFixed(1), cy: y(hist[0]).toFixed(1), r: 3, class: "spark-dot-start" }));
  svg.append(createSvgElement("circle", { cx: x(hist.length - 1).toFixed(1), cy: y(hist[hist.length - 1]).toFixed(1), r: 3.6, class: "spark-dot-end" }));
}

function renderBackpropSvg(pass, focus) {
  const svg = dom.backpropSvg;
  svg.replaceChildren();
  const { hidden, dz1, dz2, trueIndex, input } = pass;
  const { w2 } = state.backprop.weights;
  const inputNodes = [pass.wordA, pass.wordB].map((word, index) => ({
    x: 88, y: 95 + index * 110, label: word, value: index === 0 ? "context 1" : "context 2", isWord: true
  }));
  const hiddenNodes = hidden.map((_, index) => ({
    x: 280, y: 60 + index * 90, label: `h${index + 1}`, value: signedFixed(dz1[index]), index
  }));
  const outputNodes = forwardCandidates.map((word, index) => ({
    x: 474, y: 60 + index * 90, label: word, value: signedFixed(dz2[index]), isWord: true, isTrue: index === trueIndex
  }));
  const edgeWidth = (magnitude) => clamp(1 + magnitude * 4, 1, 6).toFixed(2);
  const addEdge = (x1, y1, x2, y2, signed, focused) => {
    const sign = signed >= 0 ? "is-pos" : "is-neg";
    svg.append(createSvgElement("line", {
      class: focused ? `network-edge ${sign} is-focus` : "network-edge is-muted",
      x1, y1, x2, y2, "stroke-width": focused ? edgeWidth(Math.abs(signed)) : 1.4
    }));
    if (focused) {
      const flow = createSvgElement("line", { class: "backprop-flow", x1, y1, x2, y2 });
      flow.append(createSvgElement("animate", {
        attributeName: "stroke-dashoffset", from: "0", to: "14", dur: "0.7s", repeatCount: "indefinite"
      }));
      svg.append(flow);
    }
  };
  inputNodes.forEach((source, i) => {
    hiddenNodes.forEach((target, j) => {
      addEdge(source.x + 40, source.y, target.x - 24, target.y, dz1[j], j === focus);
    });
  });
  hiddenNodes.forEach((source, j) => {
    outputNodes.forEach((target, k) => {
      addEdge(source.x + 24, source.y, target.x - 40, target.y, dz2[k] * w2[j][k], j === focus);
    });
  });
  const drawNode = (node, kind) => {
    const group = createSvgElement("g");
    const isFocusNode = kind === "is-hidden" && node.index === focus;
    if (node.isWord) {
      group.append(createSvgElement("rect", {
        class: `network-node ${kind}${node.isTrue ? " is-best" : ""}`,
        x: node.x - 40, y: node.y - 21, width: 80, height: 42, rx: 11
      }));
    } else {
      group.append(createSvgElement("circle", {
        class: `network-node ${kind}${isFocusNode ? " is-focus" : ""}`, cx: node.x, cy: node.y, r: 25
      }));
    }
    const label = createSvgElement("text", { class: "network-label", x: node.x, y: node.y - 2 });
    label.textContent = node.label;
    const value = createSvgElement("text", { class: "network-value", x: node.x, y: node.y + 15 });
    value.textContent = node.value;
    group.append(label, value);
    if (kind === "is-hidden") {
      group.style.cursor = "pointer";
      group.addEventListener("click", () => { state.backprop.focus = node.index; renderBackprop(); });
    }
    svg.append(group);
  };
  inputNodes.forEach((node) => drawNode(node, "is-input"));
  hiddenNodes.forEach((node) => drawNode(node, "is-hidden"));
  outputNodes.forEach((node) => drawNode(node, "is-output"));
}

function backpropGateNote(name, deriv) {
  let text;
  if (name === "relu") {
    text = deriv === 0
      ? "ReLU's gate is shut here (its input was <= 0), so the derivative is 0 - no blame reaches this neuron's weights at all."
      : "ReLU's gate is open here (its input was > 0), so the derivative is 1 - the blame passes straight through.";
  } else if (name === "sigmoid") {
    text = "Sigmoid's slope is gentle (at most 0.25), so it always shrinks the blame on the way back.";
  } else {
    text = "tanh's slope is at most 1 and falls toward 0 as the neuron saturates, easing the blame as it passes.";
  }
  return createElement("p", "step-lead", text);
}

function buildBackpropBreakdown(pass, focus) {
  const { q, dz2, trueIndex, trueWord, name, z1, hidden, dh, dz1, input, inputLabels } = pass;
  const lr = Number(dom.backpropRateSlider.value) / 100;
  const { w1, w2 } = state.backprop.weights;
  const nodes = [];

  nodes.push(forwardStepHead("1 - The starting error: probability minus target"));
  const errWrap = createElement("div", "deriv-table-wrap");
  const errTable = createElement("table", "deriv-table forward-activation-table");
  const errHead = createElement("thead");
  const errHeadRow = createElement("tr");
  ["word", "q (pred)", "y (target)", "blame q - y"].forEach((title) => errHeadRow.append(createElement("th", "", title)));
  errHead.append(errHeadRow);
  const errBody = createElement("tbody");
  forwardCandidates.forEach((word, k) => {
    const row = createElement("tr", k === trueIndex ? "is-focus-row" : "");
    row.append(
      createElement("td", "row-label", word),
      createElement("td", "", formatNumber(q[k], 3)),
      createElement("td", "", k === trueIndex ? "1" : "0"),
      createElement("td", "", signedFixed(dz2[k], 3))
    );
    errBody.append(row);
  });
  errTable.append(errHead, errBody);
  errWrap.append(errTable);
  nodes.push(errWrap);

  nodes.push(forwardStepHead(`2 - Hand the blame back to hidden neuron h${focus + 1}`));
  const blameStack = createElement("div", "formula-stack");
  const blameTerms = dz2.map((dk, k) => signedProduct(dk, w2[focus][k])).join(" + ");
  blameStack.append(
    createElement("code", "", "dL/dh = sum(output blame x W2)"),
    createElement("code", "", `dL/dh = ${blameTerms}`),
    createElement("code", "", `dL/dh = ${signedFixed(dh[focus], 3)}`)
  );
  nodes.push(blameStack);

  nodes.push(forwardStepHead(`3 - Shrink it through the ${name} gate`));
  const deriv = activationDerivative(name, z1[focus]);
  const gateStack = createElement("div", "formula-stack");
  gateStack.append(
    createElement("code", "", `${name}'(z) at z = ${formatNumber(z1[focus], 2)}  =  ${formatNumber(deriv, 3)}`),
    createElement("code", "", `dL/dz = dL/dh x ${name}'(z) = ${signedFixed(dh[focus], 3)} x ${formatNumber(deriv, 3)} = ${signedFixed(dz1[focus], 3)}`)
  );
  nodes.push(gateStack);
  nodes.push(backpropGateNote(name, deriv));

  nodes.push(forwardStepHead("4 - Turn that into weight gradients"));
  const gradW2ft = hidden[focus] * dz2[trueIndex];
  const gradW1ft = input[0] * dz1[focus];
  const gradStack = createElement("div", "formula-stack");
  gradStack.append(
    createElement("code", "", `grad W2[h${focus + 1} -> ${trueWord}] = h x blame = ${signedProduct(hidden[focus], dz2[trueIndex])} = ${signedFixed(gradW2ft, 3)}`),
    createElement("code", "", `grad W1[${inputLabels[0]} -> h${focus + 1}] = input x dL/dz = ${signedProduct(input[0], dz1[focus])} = ${signedFixed(gradW1ft, 3)}`)
  );
  nodes.push(gradStack);

  nodes.push(forwardStepHead("5 - The update: each weight steps against its gradient"));
  const updWrap = createElement("div", "deriv-table-wrap");
  const updTable = createElement("table", "deriv-table");
  const updHead = createElement("thead");
  const updHeadRow = createElement("tr");
  ["weight", "old", "- lr x grad", "new"].forEach((title) => updHeadRow.append(createElement("th", "", title)));
  updHead.append(updHeadRow);
  const updBody = createElement("tbody");
  const updateRow = (labelText, old, grad) => {
    const step = -lr * grad;
    const row = createElement("tr");
    row.append(
      createElement("td", "row-label", labelText),
      createElement("td", "", formatNumber(old, 3)),
      createElement("td", "", signedFixed(step, 3)),
      createElement("td", "", formatNumber(old + step, 3))
    );
    return row;
  };
  updBody.append(
    updateRow(`W2 h${focus + 1}->${trueWord}`, w2[focus][trueIndex], gradW2ft),
    updateRow(`W1 ${inputLabels[0]}->h${focus + 1}`, w1[0][focus], gradW1ft)
  );
  updTable.append(updHead, updBody);
  updWrap.append(updTable);
  nodes.push(updWrap);

  nodes.push(backpropReading(pass));
  return nodes;
}

function backpropReading(pass) {
  const bp = state.backprop;
  const pTrue = pass.q[pass.trueIndex];
  const note = createElement("p", "insight-note forward-reading");
  if (bp.steps === 0) {
    note.textContent = `Right now the model gives "${pass.trueWord}" only ${formatPercent(pTrue)}. Press Take a gradient step to push every weight a little against its gradient, then watch this same number climb and the loss fall.`;
  } else {
    note.textContent = `After ${bp.steps} step${bp.steps === 1 ? "" : "s"}, "${pass.trueWord}" is up to ${formatPercent(pTrue)} and the loss is down to ${formatNumber(pass.loss, 3)}. Keep stepping to drive this one example toward a confident, low-loss prediction.`;
  }
  return note;
}

/* ---- By-hand forward/backward worksheet ---- */
const byHandNetwork = {
  inputs: [
    { id: "x1", label: "x1", value: 0.5 },
    { id: "x2", label: "x2", value: 0.2 }
  ],
  hiddenWeights: [
    [0.4, -0.3],
    [-0.1, 0.7]
  ],
  hiddenBias: [0, 0],
  words: [
    { word: "sat", weights: [0.8, -0.2], bias: 0.1 },
    { word: "ran", weights: [0.2, 0.5], bias: 0 },
    { word: "slept", weights: [-0.4, 0.1], bias: -0.05 },
    { word: "purred", weights: [0.6, -0.3], bias: 0.02 },
    { word: "meowed", weights: [-0.1, 0.4], bias: -0.02 }
  ],
  targetWord: "sat",
  learningRate: 0.1
};

function computeByHandValues() {
  const input = byHandNetwork.inputs.map((item) => item.value);
  const hiddenRaw = byHandNetwork.hiddenBias.map((bias, hiddenIndex) => (
    bias + input.reduce((sum, value, inputIndex) => (
      sum + value * byHandNetwork.hiddenWeights[inputIndex][hiddenIndex]
    ), 0)
  ));
  const hidden = hiddenRaw.map((value) => Math.max(0, value));
  const logits = byHandNetwork.words.map((item) => (
    item.bias + hidden.reduce((sum, value, hiddenIndex) => sum + value * item.weights[hiddenIndex], 0)
  ));
  const expLogits = logits.map((value) => Math.exp(value));
  const denominator = expLogits.reduce((sum, value) => sum + value, 0);
  const probabilities = softmax(logits);
  const targetIndex = byHandNetwork.words.findIndex((item) => item.word === byHandNetwork.targetWord);
  const loss = -Math.log(Math.max(probabilities[targetIndex], 1e-9));
  const outputBlame = probabilities.map((probability, index) => probability - (index === targetIndex ? 1 : 0));
  const hiddenBlame = hidden.map((_, hiddenIndex) => (
    outputBlame.reduce((sum, blame, wordIndex) => (
      sum + blame * byHandNetwork.words[wordIndex].weights[hiddenIndex]
    ), 0)
  ));
  const hiddenDelta = hiddenBlame.map((blame, index) => blame * (hiddenRaw[index] > 0 ? 1 : 0));
  const outputGradSatH1 = outputBlame[targetIndex] * hidden[0];
  const inputGradX1H1 = hiddenDelta[0] * input[0];
  const inputGradX2H1 = hiddenDelta[0] * input[1];
  const updatedX1H1 = byHandNetwork.hiddenWeights[0][0] - byHandNetwork.learningRate * inputGradX1H1;
  return {
    input,
    hiddenRaw,
    hidden,
    logits,
    expLogits,
    denominator,
    probabilities,
    targetIndex,
    loss,
    outputBlame,
    hiddenBlame,
    hiddenDelta,
    outputGradSatH1,
    inputGradX1H1,
    inputGradX2H1,
    updatedX1H1
  };
}

const byHandValues = computeByHandValues();

const byHandSteps = [
  {
    id: "h1-raw",
    phase: "forward pass",
    prompt: "Step 1: find the raw value entering hidden neuron h1.",
    instruction: "Use the two incoming edges: x1 x 0.40 plus x2 x -0.10. With x1 = 0.50 and x2 = 0.20, what enters h1 before ReLU?",
    answer: byHandValues.hiddenRaw[0],
    tolerance: 0.005,
    solution: "0.50 x 0.40 + 0.20 x -0.10 = 0.180",
    hints: ["Multiply first: 0.50 x 0.40 = 0.200, and 0.20 x -0.10 = -0.020.", "Now add the two pieces: 0.200 + -0.020."],
    nodes: ["x1", "x2", "h1"],
    edges: ["x1-h1", "x2-h1"]
  },
  {
    id: "h1-relu",
    phase: "forward pass",
    prompt: "Step 2: pass h1 through the ReLU gate.",
    instruction: "ReLU keeps positive numbers and turns negative numbers into 0. The raw h1 value is 0.180. What is h1 after ReLU?",
    answer: byHandValues.hidden[0],
    tolerance: 0.005,
    solution: "ReLU(0.180) = 0.180",
    hints: ["Ask whether 0.180 is above or below zero.", "Positive values pass through ReLU unchanged."],
    nodes: ["h1"],
    edges: []
  },
  {
    id: "h2-raw",
    phase: "forward pass",
    prompt: "Step 3: find the raw value entering hidden neuron h2.",
    instruction: "Now use the second hidden neuron: x1 x -0.30 plus x2 x 0.70. What enters h2 before ReLU?",
    answer: byHandValues.hiddenRaw[1],
    tolerance: 0.005,
    solution: "0.50 x -0.30 + 0.20 x 0.70 = -0.010",
    hints: ["The two products are -0.150 and +0.140.", "Add -0.150 + 0.140."],
    nodes: ["x1", "x2", "h2"],
    edges: ["x1-h2", "x2-h2"]
  },
  {
    id: "h2-relu",
    phase: "forward pass",
    prompt: "Step 4: pass h2 through the ReLU gate.",
    instruction: "The raw h2 value is -0.010. ReLU shuts negative values off. What is h2 after ReLU?",
    answer: byHandValues.hidden[1],
    tolerance: 0.005,
    solution: "ReLU(-0.010) = 0",
    hints: ["ReLU is max(0, value).", "Since -0.010 is below zero, the gate closes."],
    nodes: ["h2"],
    edges: []
  },
  {
    id: "sat-logit",
    phase: "forward pass",
    prompt: "Step 5: calculate the score for the word \"sat\".",
    instruction: "Use z_sat = h1 x 0.80 + h2 x -0.20 + bias 0.10. With h1 = 0.180 and h2 = 0, what is the logit for \"sat\"?",
    answer: byHandValues.logits[0],
    tolerance: 0.005,
    solution: "0.180 x 0.80 + 0 x -0.20 + 0.10 = 0.244",
    hints: ["The h2 branch contributes 0 because h2 is 0.", "0.180 x 0.80 = 0.144, then add the bias 0.10."],
    nodes: ["h1", "h2", "sat"],
    edges: ["h1-sat", "h2-sat"]
  },
  {
    id: "softmax-denominator",
    phase: "forward pass",
    prompt: "Step 6: build the softmax denominator.",
    instruction: "The five logits are 0.244, 0.036, -0.122, 0.128, and -0.038. Add e raised to each logit. What is the denominator?",
    answer: byHandValues.denominator,
    tolerance: 0.015,
    solution: "e^0.244 + e^0.036 + e^-0.122 + e^0.128 + e^-0.038 = 5.297",
    hints: ["The exponentials are about 1.277, 1.037, 0.885, 1.137, and 0.963.", "Add those five positive numbers."],
    nodes: ["sat", "ran", "slept", "purred", "meowed"],
    edges: ["h1-sat", "h1-ran", "h1-slept", "h1-purred", "h1-meowed"]
  },
  {
    id: "sat-probability",
    phase: "forward pass",
    prompt: "Step 7: turn the \"sat\" score into a probability.",
    instruction: "Use q_sat = e^0.244 / 5.297. What probability does the model give the correct word?",
    answer: byHandValues.probabilities[0],
    tolerance: 0.005,
    solution: "q_sat = 1.277 / 5.297 = 0.241",
    hints: ["The numerator for \"sat\" is e^0.244, about 1.277.", "Divide 1.277 by the denominator from the previous step."],
    nodes: ["sat"],
    edges: ["sat-loss"]
  },
  {
    id: "loss",
    phase: "forward pass",
    prompt: "Step 8: calculate the loss.",
    instruction: "For the true word, cross-entropy is -ln(q_true). Use q_sat = 0.241. What is the loss in nats?",
    answer: byHandValues.loss,
    tolerance: 0.01,
    solution: "-ln(0.241) = 1.423",
    hints: ["Use the natural log, not log base 10.", "The model is not very confident yet, so the loss should be bigger than 1."],
    nodes: ["sat", "loss"],
    edges: ["sat-loss"]
  },
  {
    id: "sat-blame",
    phase: "backward pass",
    prompt: "Step 9: find the output blame for \"sat\".",
    instruction: "Softmax plus cross-entropy gives <strong>&delta;<sub>i</sub> = (q<sub>i</sub> - y<sub>i</sub>) / T</strong> on each original logit. This worksheet uses <strong>T = 1</strong>, so the factor is 1. For the true word \"sat\", the target is 1. What blame flows backward from its score?",
    derivationTitle: "Why is output blame probability minus target?",
    derivation: [
      { type: "p", html: "First name the pieces. <strong>z<sub>word</sub></strong> is a raw score, also called a logit. <strong>q<sub>word</sub></strong> is the probability after softmax. <strong>y<sub>word</sub></strong> is the target label: 1 for the correct word and 0 for every other word. <strong>&delta;<sub>word</sub></strong> is the blame sent backward into that word's raw score." },
      { type: "code", html: "q<sub>i</sub> = softmax(z)<sub>i</sub> = e<sup>z<sub>i</sub></sup> / &Sigma;<sub>k</sub> e<sup>z<sub>k</sub></sup>" },
      { type: "code", html: "L = -&Sigma;<sub>j</sub> y<sub>j</sub> log(q<sub>j</sub>)" },
      { type: "p", html: "We want the slope of the loss with respect to one raw score <strong>z<sub>i</sub></strong>. Because softmax shares one denominator, changing <strong>z<sub>i</sub></strong> changes every probability <strong>q<sub>j</sub></strong>, not just <strong>q<sub>i</sub></strong>." },
      { type: "code", html: "&delta;<sub>i</sub> = &part;L / &part;z<sub>i</sub> = &Sigma;<sub>j</sub> (&part;L / &part;q<sub>j</sub>)(&part;q<sub>j</sub> / &part;z<sub>i</sub>)" },
      { type: "p", html: "Now get the cross-entropy derivative with respect to one probability. Focus on one term, <strong>-y<sub>j</sub> log(q<sub>j</sub>)</strong>. The target <strong>y<sub>j</sub></strong> is just a constant multiplier here." },
      { type: "code", html: "&part; / &part;q<sub>j</sub> [-y<sub>j</sub> log(q<sub>j</sub>)] = -y<sub>j</sub> &times; &part;log(q<sub>j</sub>) / &part;q<sub>j</sub>" },
      { type: "p", html: "Why is the log slope <strong>1 / q<sub>j</sub></strong>? Let <strong>u = log(q<sub>j</sub>)</strong>. Natural log means the inverse of exponentiation, so <strong>e<sup>u</sup> = q<sub>j</sub></strong>." },
      { type: "code", html: "e<sup>u</sup> = q<sub>j</sub>" },
      { type: "code", html: "&part; / &part;q<sub>j</sub> [e<sup>u</sup>] = &part; / &part;q<sub>j</sub> [q<sub>j</sub>]" },
      { type: "code", html: "e<sup>u</sup> (&part;u / &part;q<sub>j</sub>) = 1" },
      { type: "code", html: "&part;u / &part;q<sub>j</sub> = 1 / e<sup>u</sup> = 1 / q<sub>j</sub>" },
      { type: "p", html: "Substitute that log slope back into the cross-entropy term." },
      { type: "code", html: "&part;L / &part;q<sub>j</sub> = -y<sub>j</sub> / q<sub>j</sub>" },
      { type: "p", html: "The softmax part has two cases: the probability for the same word rises when its own score rises, while the other probabilities fall because the denominator got bigger." },
      { type: "code", html: "&part;q<sub>j</sub> / &part;z<sub>i</sub> = q<sub>j</sub>(1 - q<sub>i</sub>) if i = j" },
      { type: "code", html: "&part;q<sub>j</sub> / &part;z<sub>i</sub> = -q<sub>j</sub>q<sub>i</sub> if i &ne; j" },
      { type: "p", html: "A compact way to write both cases is:" },
      { type: "code", html: "&part;q<sub>j</sub> / &part;z<sub>i</sub> = q<sub>j</sub>(1<sub>i=j</sub> - q<sub>i</sub>)" },
      { type: "p", html: "Now substitute both derivative pieces into the chain-rule sum." },
      { type: "code", html: "&part;L / &part;z<sub>i</sub> = &Sigma;<sub>j</sub> (-y<sub>j</sub> / q<sub>j</sub>) q<sub>j</sub>(1<sub>i=j</sub> - q<sub>i</sub>)" },
      { type: "code", html: "= &Sigma;<sub>j</sub> -y<sub>j</sub>(1<sub>i=j</sub> - q<sub>i</sub>)" },
      { type: "code", html: "= -y<sub>i</sub> + q<sub>i</sub>&Sigma;<sub>j</sub>y<sub>j</sub>" },
      { type: "p", html: "For one correct next word, the target vector has exactly one 1, so <strong>&Sigma;<sub>j</sub>y<sub>j</sub> = 1</strong>." },
      { type: "code", html: "&part;L / &part;z<sub>i</sub> = q<sub>i</sub> - y<sub>i</sub>" },
      { type: "p", html: "That is the blame on the scaled score. If temperature first made <strong>s<sub>i</sub> = z<sub>i</sub> / T</strong>, one final chain-rule factor gives <strong>&part;L / &part;z<sub>i</sub> = (q<sub>i</sub> - y<sub>i</sub>) / T</strong>. Here <strong>T = 1</strong>, so output blame is predicted probability minus target." }
    ],
    answer: byHandValues.outputBlame[0],
    tolerance: 0.005,
    solution: "&delta;<sub>sat</sub> = 0.241 - 1 = -0.759",
    hints: ["The target <strong>y</strong> is 1 only for the correct word.", "Output blame is predicted probability minus target. Open <strong>Why this formula?</strong> if you want to see where that rule comes from."],
    nodes: ["loss", "sat"],
    edges: ["sat-loss"]
  },
  {
    id: "w2-gradient",
    phase: "backward pass",
    prompt: "Step 10: get the gradient for the h1-to-sat weight.",
    instruction: "This asks: if we nudge the weight from <strong>h1</strong> into the <strong>sat</strong> score, how much does the loss change? That sensitivity is written <strong>&part;L / &part;W<sub>sat,h1</sub></strong>. Use sat blame -0.759 and h1 = 0.180.",
    derivationTitle: "Why does this gradient equal blame times signal?",
    derivation: [
      { type: "p", html: "First name the pieces. <strong>W<sub>sat,h1</sub></strong> is the weight from hidden activation h1 into the raw sat score. <strong>h<sub>1</sub></strong> is the activation that flowed through that weight. <strong>&delta;<sub>sat</sub></strong> is shorthand for <strong>&part;L / &part;z<sub>sat</sub></strong>, the blame already sitting at the sat score." },
      { type: "p", html: "The weight affects the loss only by first changing the raw sat score <strong>z<sub>sat</sub></strong>." },
      { type: "code", html: "z<sub>sat</sub> = W<sub>sat,h1</sub>h<sub>1</sub> + W<sub>sat,h2</sub>h<sub>2</sub> + b<sub>sat</sub>" },
      { type: "p", html: "We want the slope of the loss with respect to this one weight. Follow the path backward: <strong>L &rarr; z<sub>sat</sub> &rarr; W<sub>sat,h1</sub></strong>." },
      { type: "code", html: "&part;L / &part;W<sub>sat,h1</sub> = (&part;L / &part;z<sub>sat</sub>) &times; (&part;z<sub>sat</sub> / &part;W<sub>sat,h1</sub>)" },
      { type: "p", html: "The first slope is the sat blame:" },
      { type: "code", html: "&part;L / &part;z<sub>sat</sub> = &delta;<sub>sat</sub>" },
      { type: "p", html: "For the second slope, treat every other term in <strong>z<sub>sat</sub></strong> as constant. The only term containing <strong>W<sub>sat,h1</sub></strong> is <strong>W<sub>sat,h1</sub>h<sub>1</sub></strong>." },
      { type: "code", html: "&part;z<sub>sat</sub> / &part;W<sub>sat,h1</sub> = h<sub>1</sub>" },
      { type: "code", html: "&part;L / &part;W<sub>sat,h1</sub> = &delta;<sub>sat</sub> &times; h<sub>1</sub>" }
    ],
    answer: byHandValues.outputGradSatH1,
    tolerance: 0.005,
    solution: "&part;L / &part;W<sub>sat,h1</sub> = -0.759 &times; 0.180 = -0.137",
    hints: ["Use the hidden activation <strong>h<sub>1</sub></strong>, not the raw pre-ReLU value. Here they happen to match because ReLU stayed open.", "The chain-rule idea is: output blame times the signal that flowed through this weight. Open <strong>Why this formula?</strong> for the derivation."],
    nodes: ["h1", "sat"],
    edges: ["h1-sat"]
  },
  {
    id: "h1-blame",
    phase: "backward pass",
    prompt: "Step 11: gather all the blame arriving at h1.",
    instruction: "Hidden neuron <strong>h1</strong> helped all five word scores, so its blame is the sum of every output blame times the matching outgoing weight. What is <strong>&part;L / &part;h<sub>1</sub></strong>, the blame on h1 before the ReLU gate?",
    derivationTitle: "Why do we sum blame from every word?",
    derivation: [
      { type: "p", html: "First name the pieces. <strong>h<sub>1</sub></strong> is the hidden activation. <strong>z<sub>word</sub></strong> is a raw score for one output word. <strong>&delta;<sub>word</sub></strong> means <strong>&part;L / &part;z<sub>word</sub></strong>, the blame at that word score. <strong>W<sub>word,h1</sub></strong> is the weight from h1 into that word score." },
      { type: "p", html: "Hidden neuron h1 fans out into every word score. Changing h1 changes sat, ran, slept, purred, and meowed at the same time." },
      { type: "p", html: "When one variable affects the loss through multiple paths, the chain rule adds the path contributions from all paths." },
      { type: "code", html: "&part;L / &part;h<sub>1</sub> = &Sigma;<sub>word</sub> (&part;L / &part;z<sub>word</sub>) &times; (&part;z<sub>word</sub> / &part;h<sub>1</sub>)" },
      { type: "p", html: "The first piece on each path is that word's output blame:" },
      { type: "code", html: "&part;L / &part;z<sub>word</sub> = &delta;<sub>word</sub>" },
      { type: "p", html: "For the second piece, write one output score. The term containing h1 is the outgoing weight times h1." },
      { type: "code", html: "z<sub>word</sub> = W<sub>word,h1</sub>h<sub>1</sub> + W<sub>word,h2</sub>h<sub>2</sub> + b<sub>word</sub>" },
      { type: "code", html: "&part;z<sub>word</sub> / &part;h<sub>1</sub> = W<sub>word,h1</sub>" },
      { type: "code", html: "&part;L / &part;h<sub>1</sub> = &Sigma;<sub>word</sub> &delta;<sub>word</sub> &times; W<sub>word,h1</sub>" }
    ],
    answer: byHandValues.hiddenBlame[0],
    tolerance: 0.008,
    solution: "&part;L / &part;h<sub>1</sub> = (-0.759 &times; 0.80) + (0.196 &times; 0.20) + (0.167 &times; -0.40) + (0.215 &times; 0.60) + (0.182 &times; -0.10) = -0.524",
    hints: ["Use one output-blame value for each word score.", "Pair each output blame with the matching h1 outgoing weight, multiply each pair, then add the path contributions."],
    nodes: ["h1", "sat", "ran", "slept", "purred", "meowed"],
    edges: ["h1-sat", "h1-ran", "h1-slept", "h1-purred", "h1-meowed"]
  },
  {
    id: "w1-gradient",
    phase: "backward pass",
    prompt: "Step 12: turn h1's blame into the x1-to-h1 gradient.",
    instruction: "Now move one edge farther backward. We want the gradient for the weight from <strong>x1</strong> into <strong>h1</strong>, written <strong>&part;L / &part;W<sub>h1,x1</sub></strong>. Because h1's ReLU gate was open, its slope is 1.",
    derivationTitle: "Why does the ReLU gate appear here?",
    derivation: [
      { type: "p", html: "First name the pieces. <strong>r<sub>1</sub></strong> is the raw value going into hidden neuron h1. <strong>h<sub>1</sub></strong> is the value after ReLU. <strong>W<sub>h1,x1</sub></strong> is the input weight from x1 into h1. <strong>x<sub>1</sub></strong> is the input signal." },
      { type: "p", html: "The input weight does not touch h1 directly. It first changes the raw hidden value <strong>r<sub>1</sub></strong>; then ReLU turns <strong>r<sub>1</sub></strong> into <strong>h<sub>1</sub></strong>." },
      { type: "code", html: "r<sub>1</sub> = W<sub>h1,x1</sub>x<sub>1</sub> + W<sub>h1,x2</sub>x<sub>2</sub> + b<sub>h1</sub>" },
      { type: "code", html: "h<sub>1</sub> = ReLU(r<sub>1</sub>)" },
      { type: "p", html: "The chain rule follows the path backward: <strong>L &rarr; h<sub>1</sub> &rarr; r<sub>1</sub> &rarr; W<sub>h1,x1</sub></strong>." },
      { type: "code", html: "&part;L / &part;W<sub>h1,x1</sub> = (&part;L / &part;h<sub>1</sub>) &times; (&part;h<sub>1</sub> / &part;r<sub>1</sub>) &times; (&part;r<sub>1</sub> / &part;W<sub>h1,x1</sub>)" },
      { type: "p", html: "The middle slope is the ReLU gate. ReLU's derivative is 1 when the raw value is positive and 0 when the raw value is negative or zero." },
      { type: "code", html: "&part;h<sub>1</sub> / &part;r<sub>1</sub> = ReLU'(r<sub>1</sub>)" },
      { type: "p", html: "The last slope is <strong>x<sub>1</sub></strong>, because the term containing this weight is <strong>W<sub>h1,x1</sub>x<sub>1</sub></strong>." },
      { type: "code", html: "&part;r<sub>1</sub> / &part;W<sub>h1,x1</sub> = x<sub>1</sub>" },
      { type: "code", html: "&part;L / &part;W<sub>h1,x1</sub> = (&part;L / &part;h<sub>1</sub>) &times; ReLU'(r<sub>1</sub>) &times; x<sub>1</sub>" }
    ],
    answer: byHandValues.inputGradX1H1,
    tolerance: 0.006,
    solution: "&part;L / &part;W<sub>h1,x1</sub> = -0.524 &times; 1 &times; 0.50 = -0.262",
    hints: ["The ReLU slope contributes <strong>1</strong> because h1's raw value was positive.", "Follow the path backward: hidden blame, then the ReLU gate, then the input signal <strong>x<sub>1</sub></strong>."],
    nodes: ["x1", "h1"],
    edges: ["x1-h1"]
  },
  {
    id: "w1-update",
    phase: "gradient update",
    prompt: "Step 13: update the x1-to-h1 weight.",
    instruction: "Gradient descent now uses that gradient to move the weight downhill. The old weight is 0.400, the learning rate is 0.10, and the gradient is -0.262. What is the new <strong>x1 &rarr; h1</strong> weight?",
    derivationTitle: "Why do we subtract the gradient?",
    derivation: [
      { type: "p", html: "First name the pieces. <strong>W</strong> is the weight we are updating. <strong>g</strong> is its gradient, meaning <strong>g = &part;L / &part;W</strong>. <strong>&eta;</strong> is the learning rate, the size of the step." },
      { type: "p", html: "The gradient points uphill: it tells us which direction makes the loss increase fastest." },
      { type: "p", html: "For a tiny change <strong>&Delta;W</strong>, calculus gives this local approximation:" },
      { type: "code", html: "L(W + &Delta;W) &approx; L(W) + g&Delta;W" },
      { type: "p", html: "To move downhill, choose a change that makes <strong>g&Delta;W</strong> negative. Gradient descent chooses the opposite direction of the gradient." },
      { type: "code", html: "&Delta;W = -&eta;g" },
      { type: "p", html: "Substitute that into the local approximation:" },
      { type: "code", html: "L(W + &Delta;W) &approx; L(W) - &eta;g<sup>2</sup>" },
      { type: "p", html: "Since <strong>g<sup>2</sup></strong> is never negative, this small step is aimed downhill." },
      { type: "code", html: "W<sub>new</sub> = W<sub>old</sub> + &Delta;W = W<sub>old</sub> - &eta;g" },
      { type: "code", html: "W<sub>new</sub> = W<sub>old</sub> - &eta;(&part;L / &part;W)" }
    ],
    answer: byHandValues.updatedX1H1,
    tolerance: 0.006,
    solution: "W<sub>new</sub> = 0.400 - 0.10 &times; (-0.262) = 0.426",
    hints: ["Subtracting a negative gradient makes the weight increase.", "First scale the gradient by the learning rate, then subtract that scaled value from the old weight."],
    nodes: ["x1", "h1"],
    edges: ["x1-h1"]
  }
];

function byHandStepDone(index = state.byHand.index) {
  const step = byHandSteps[index];
  return Boolean(state.byHand.solved[step.id] || state.byHand.revealed[step.id]);
}

function byHandKnown(stepId) {
  return Boolean(state.byHand.solved[stepId] || state.byHand.revealed[stepId]);
}

function parseByHandAnswer(raw) {
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

function setByHandFeedback(step, text, className = "") {
  state.byHand.feedback[step.id] = { text, className };
}

function setByHandHtml(element, html) {
  element.innerHTML = html || "";
}

function checkByHandAnswer() {
  const step = byHandSteps[state.byHand.index];
  const raw = dom.byHandAnswer.value;
  const value = parseByHandAnswer(raw);
  state.byHand.answers[step.id] = raw;
  if (value === null) {
    setByHandFeedback(step, "I need a number here. You can type a rounded answer like 0.241, or a simple arithmetic expression like 1.277 / 5.297.", "is-wrong");
    renderByHandLab();
    return;
  }
  const diff = Math.abs(value - step.answer);
  if (diff <= step.tolerance) {
    state.byHand.solved[step.id] = true;
    const entered = formatNumber(value, 3);
    const expected = formatNumber(step.answer, 3);
    const verdict = entered === expected
      ? `Correct: ${entered} matches.`
      : `Correct with rounding: ${entered} is accepted; the target is ${expected}.`;
    setByHandFeedback(step, `${verdict} ${step.solution}`, "is-correct");
  } else if (Math.sign(value) !== Math.sign(step.answer) && Math.abs(step.answer) > step.tolerance && Math.abs(value) > step.tolerance) {
    setByHandFeedback(step, "The size may be in the neighborhood, but the sign is flipped. Trace whether this step is pushing blame up or down.", "is-wrong");
  } else if (diff <= step.tolerance * 5) {
    setByHandFeedback(step, "Very close. Check your rounding and try one more decimal place.", "is-wrong");
  } else {
    setByHandFeedback(step, "Not quite yet. Try the next hint and keep the arithmetic small.", "is-wrong");
  }
  renderByHandLab();
}

function showByHandHint() {
  const step = byHandSteps[state.byHand.index];
  const current = state.byHand.hints[step.id] || 0;
  state.byHand.hints[step.id] = Math.min(step.hints.length, current + 1);
  setByHandFeedback(step, "Good - use the hint, then check your number again.", "");
  renderByHandLab();
}

function revealByHandSolution() {
  const step = byHandSteps[state.byHand.index];
  state.byHand.revealed[step.id] = true;
  state.byHand.answers[step.id] = formatNumber(step.answer, 3);
  setByHandFeedback(step, `Solution revealed. ${step.solution}`, "is-solution");
  renderByHandLab();
}

function moveByHandStep(delta) {
  const next = clamp(state.byHand.index + delta, 0, byHandSteps.length - 1);
  if (delta > 0 && !byHandStepDone()) {
    const step = byHandSteps[state.byHand.index];
    setByHandFeedback(step, "Before moving on, enter a value and press Check, or use Show solution. Next will unlock when this step is resolved.", "is-guidance");
    renderByHandLab();
    return;
  }
  state.byHand.index = next;
  renderByHandLab();
  dom.byHandAnswer.focus();
}

function resetByHandWorksheet() {
  state.byHand = { index: 0, hints: {}, solved: {}, revealed: {}, answers: {}, feedback: {} };
  renderByHandLab();
}

function byHandNodeValue(id) {
  if (id === "x1") return "0.50";
  if (id === "x2") return "0.20";
  if (id === "h1") return byHandKnown("h1-relu") ? `h=${formatNumber(byHandValues.hidden[0], 2)}` : "h=?";
  if (id === "h2") return byHandKnown("h2-relu") ? `h=${formatNumber(byHandValues.hidden[1], 2)}` : "h=?";
  if (id === "loss") return byHandKnown("loss") ? `L=${formatNumber(byHandValues.loss, 3)}` : "loss";
  const wordIndex = byHandNetwork.words.findIndex((item) => item.word === id);
  if (wordIndex >= 0) {
    if (id === "sat" && byHandKnown("sat-probability")) return `q=${formatNumber(byHandValues.probabilities[0], 3)}`;
    if (byHandKnown("softmax-denominator")) return `z=${formatNumber(byHandValues.logits[wordIndex], 3)}`;
    if (id === "sat" && byHandKnown("sat-logit")) return `z=${formatNumber(byHandValues.logits[0], 3)}`;
    return id === "sat" ? "true word" : "word";
  }
  return "";
}

function renderByHandMiniFacts() {
  const facts = [
    { label: "inputs", value: "x1=0.50, x2=0.20" },
    { label: "target", value: "\"sat\"" },
    {
      label: "hidden state",
      value: byHandKnown("h2-relu")
        ? `h=[${formatNumber(byHandValues.hidden[0], 2)}, ${formatNumber(byHandValues.hidden[1], 2)}]`
        : "compute h"
    },
    {
      label: "learning rate",
      value: formatNumber(byHandNetwork.learningRate, 2)
    }
  ];
  dom.byHandMiniFacts.replaceChildren(...facts.map((fact) => {
    const item = createElement("div", "by-hand-fact");
    item.append(createElement("strong", "", fact.value), createElement("span", "", fact.label));
    return item;
  }));
}

function renderByHandSvg(step) {
  const svg = dom.byHandSvg;
  svg.replaceChildren();
  const defs = createSvgElement("defs");
  const forwardMarker = createSvgElement("marker", { id: "byHandForwardArrow", markerWidth: 8, markerHeight: 8, refX: 7, refY: 3, orient: "auto" });
  forwardMarker.append(createSvgElement("path", { d: "M0,0 L7,3 L0,6 Z", fill: "var(--teal)" }));
  const backMarker = createSvgElement("marker", { id: "byHandBackArrow", markerWidth: 8, markerHeight: 8, refX: 7, refY: 3, orient: "auto" });
  backMarker.append(createSvgElement("path", { d: "M0,0 L7,3 L0,6 Z", fill: "#a76500" }));
  defs.append(forwardMarker, backMarker);
  svg.append(defs);

  const nodes = {
    x1: { x: 72, y: 155, kind: "input", label: "x1" },
    x2: { x: 72, y: 275, kind: "input", label: "x2" },
    h1: { x: 280, y: 155, kind: "hidden", label: "h1" },
    h2: { x: 280, y: 275, kind: "hidden", label: "h2" },
    sat: { x: 545, y: 58, kind: "output", label: "sat" },
    ran: { x: 545, y: 128, kind: "output", label: "ran" },
    slept: { x: 545, y: 198, kind: "output", label: "slept" },
    purred: { x: 545, y: 268, kind: "output", label: "purred" },
    meowed: { x: 545, y: 338, kind: "output", label: "meowed" },
    loss: { x: 695, y: 58, kind: "loss", label: "L" }
  };
  const edges = [
    { id: "x1-h1", from: "x1", to: "h1", label: "0.40" },
    { id: "x2-h1", from: "x2", to: "h1", label: "-0.10" },
    { id: "x1-h2", from: "x1", to: "h2", label: "-0.30" },
    { id: "x2-h2", from: "x2", to: "h2", label: "0.70" },
    ...byHandNetwork.words.flatMap((item, wordIndex) => ([
      { id: `h1-${item.word}`, from: "h1", to: item.word, label: formatNumber(item.weights[0], 2) },
      { id: `h2-${item.word}`, from: "h2", to: item.word, label: formatNumber(item.weights[1], 2), skipComplete: wordIndex > 0 }
    ])),
    { id: "sat-loss", from: "sat", to: "loss", label: "loss" }
  ];
  const activeNodes = new Set(step.nodes || []);
  const activeEdges = new Set(step.edges || []);
  const completeNodes = new Set();
  const completeEdges = new Set();
  byHandSteps.forEach((pastStep, index) => {
    if (index >= state.byHand.index || !byHandStepDone(index)) return;
    (pastStep.nodes || []).forEach((node) => completeNodes.add(node));
    (pastStep.edges || []).forEach((edge) => completeEdges.add(edge));
  });

  const addLayerLabel = (x, text) => {
    const label = createSvgElement("text", { class: "by-hand-layer-label", x, y: 28 });
    label.textContent = text;
    svg.append(label);
  };
  addLayerLabel(72, "two inputs");
  addLayerLabel(280, "hidden layer");
  addLayerLabel(545, "five word scores");
  addLayerLabel(695, "loss");

  edges.forEach((edge) => {
    const from = nodes[edge.from];
    const to = nodes[edge.to];
    const isActive = activeEdges.has(edge.id);
    const isComplete = completeEdges.has(edge.id) && !edge.skipComplete;
    const isBackward = isActive && step.phase !== "forward pass";
    const start = isBackward ? to : from;
    const end = isBackward ? from : to;
    const className = [
      "by-hand-edge",
      isActive ? "is-active" : "",
      isComplete ? "is-complete" : "",
      isBackward ? "is-backward" : ""
    ].filter(Boolean).join(" ");
    const attrs = { class: className, x1: start.x, y1: start.y, x2: end.x, y2: end.y };
    if (isActive) attrs["marker-end"] = isBackward ? "url(#byHandBackArrow)" : "url(#byHandForwardArrow)";
    svg.append(createSvgElement("line", attrs));
    if (isActive) {
      const label = createSvgElement("text", {
        class: "by-hand-value",
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2 - 8
      });
      label.textContent = edge.label;
      svg.append(label);
    }
  });

  Object.entries(nodes).forEach(([id, node]) => {
    const group = createSvgElement("g");
    const classes = [
      "by-hand-node",
      `is-${node.kind}`,
      activeNodes.has(id) ? "is-active" : "",
      completeNodes.has(id) ? "is-complete" : ""
    ].filter(Boolean).join(" ");
    if (node.kind === "output") {
      group.append(createSvgElement("rect", {
        class: classes,
        x: node.x - 43,
        y: node.y - 20,
        width: 86,
        height: 40,
        rx: 10
      }));
    } else if (node.kind === "loss") {
      group.append(createSvgElement("rect", {
        class: classes,
        x: node.x - 34,
        y: node.y - 22,
        width: 68,
        height: 44,
        rx: 10
      }));
    } else {
      group.append(createSvgElement("circle", { class: classes, cx: node.x, cy: node.y, r: 27 }));
    }
    const label = createSvgElement("text", { class: "by-hand-label", x: node.x, y: node.y - 2 });
    label.textContent = node.label;
    const value = createSvgElement("text", { class: "by-hand-value", x: node.x, y: node.y + 15 });
    value.textContent = byHandNodeValue(id);
    group.append(label, value);
    svg.append(group);
  });
}

function renderByHandLab() {
  if (!dom.byHandLab) return;
  const step = byHandSteps[state.byHand.index];
  const done = byHandStepDone();
  const feedback = state.byHand.feedback[step.id];
  const hintCount = state.byHand.hints[step.id] || 0;
  dom.byHandProgress.textContent = `step ${state.byHand.index + 1} of ${byHandSteps.length}`;
  dom.byHandStepTag.textContent = step.phase;
  dom.byHandPrompt.textContent = step.prompt;
  setByHandHtml(dom.byHandInstruction, step.instruction);
  if (step.derivation?.length) {
    const details = createElement("details", "by-hand-derivation");
    const summary = createElement("summary");
    setByHandHtml(summary, step.derivationTitle || "Why this formula?");
    const derivationBody = createElement("div", "by-hand-derivation-body");
    step.derivation.forEach((item) => {
      const node = createElement(item.type === "code" ? "code" : "p");
      setByHandHtml(node, item.html);
      derivationBody.append(node);
    });
    details.append(summary, derivationBody);
    dom.byHandEquation.hidden = false;
    dom.byHandEquation.replaceChildren(details);
  } else {
    dom.byHandEquation.hidden = true;
    dom.byHandEquation.replaceChildren();
  }
  dom.byHandAnswer.value = state.byHand.answers[step.id] || "";
  dom.byHandAnswer.placeholder = "Enter your value";
  dom.byHandFeedback.className = `by-hand-feedback ${feedback?.className || ""}`.trim();
  setByHandHtml(dom.byHandFeedback, feedback?.text || "Enter a number, then press Check or Enter. Rounding to three decimals is fine.");
  dom.byHandHintPanel.hidden = hintCount === 0;
  setByHandHtml(dom.byHandHintPanel, hintCount > 0 ? step.hints.slice(0, hintCount).join(" ") : "");
  dom.byHandHintButton.disabled = hintCount >= step.hints.length;
  dom.byHandPrevButton.disabled = state.byHand.index === 0;
  dom.byHandNextButton.disabled = state.byHand.index === byHandSteps.length - 1;
  dom.byHandNextButton.setAttribute("aria-disabled", String(!done || state.byHand.index === byHandSteps.length - 1));
  dom.byHandNextButton.classList.toggle("is-blocked", !done && state.byHand.index < byHandSteps.length - 1);
  dom.byHandNextButton.textContent = state.byHand.index === byHandSteps.length - 1 ? "Finished" : "Next";
  renderByHandMiniFacts();
  renderByHandSvg(step);
}

function mulberry32(seed) {
  return function nextRandom() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomNormal(random) {
  const u = Math.max(random(), 1e-9);
  const v = Math.max(random(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function makePoint(type, random) {
  let x;
  let y;
  let label;
  if (type === "blobs") {
    label = random() < 0.5 ? 0 : 1;
    const center = label === 0 ? [-0.45, -0.35] : [0.45, 0.35];
    x = clamp(center[0] + randomNormal(random) * 0.25, -1, 1);
    y = clamp(center[1] + randomNormal(random) * 0.25, -1, 1);
  } else if (type === "ring") {
    x = random() * 2 - 1;
    y = random() * 2 - 1;
    const radius = Math.sqrt(x * x + y * y);
    label = radius < 0.52 ? 0 : 1;
    if (random() < 0.12) label = 1 - label;
  } else {
    x = random() * 2 - 1;
    y = random() * 2 - 1;
    label = x * y >= 0 ? 0 : 1;
    if (random() < 0.04) label = 1 - label;
  }
  return { x, y, label };
}

function makeDataset(type, seed) {
  const random = mulberry32(seed);
  const train = [];
  const test = [];
  for (let i = 0; i < 90; i += 1) train.push(makePoint(type, random));
  for (let i = 0; i < 90; i += 1) test.push(makePoint(type, random));
  return { type, train, test };
}

function makeNetwork(hiddenUnits, seed) {
  const random = mulberry32(seed);
  const scale1 = 0.9;
  const scale2 = 0.7;
  const w1 = Array.from({ length: 2 }, () => (
    Array.from({ length: hiddenUnits }, () => randomNormal(random) * scale1)
  ));
  const b1 = Array.from({ length: hiddenUnits }, () => 0);
  const w2 = Array.from({ length: hiddenUnits }, () => (
    Array.from({ length: 2 }, () => randomNormal(random) * scale2)
  ));
  const b2 = [0, 0];
  return { hiddenUnits, w1, b1, w2, b2, epochs: 0 };
}

function forwardNet(net, point) {
  const input = [point.x, point.y];
  const z1 = net.b1.map((bias, j) => bias + input[0] * net.w1[0][j] + input[1] * net.w1[1][j]);
  const a1 = z1.map((value) => Math.tanh(value));
  const z2 = net.b2.map((bias, k) => bias + a1.reduce((sum, value, j) => sum + value * net.w2[j][k], 0));
  const probs = softmax(z2);
  return { input, z1, a1, z2, probs };
}

function predictNet(net, point) {
  const { probs } = forwardNet(net, point);
  return probs[1] > probs[0] ? 1 : 0;
}

function evaluateNet(net, points) {
  let loss = 0;
  let correct = 0;
  points.forEach((point) => {
    const { probs } = forwardNet(net, point);
    loss += -Math.log(Math.max(probs[point.label], 1e-9));
    if ((probs[1] > probs[0] ? 1 : 0) === point.label) correct += 1;
  });
  return {
    loss: loss / points.length,
    accuracy: correct / points.length
  };
}

function trainOneExample(net, point, learningRate) {
  const pass = forwardNet(net, point);
  const target = [point.label === 0 ? 1 : 0, point.label === 1 ? 1 : 0];
  const dz2 = pass.probs.map((probability, index) => probability - target[index]);
  const da1 = Array.from({ length: net.hiddenUnits }, (_, j) => (
    dz2.reduce((sum, value, k) => sum + value * net.w2[j][k], 0)
  ));
  const dz1 = da1.map((value, j) => value * (1 - pass.a1[j] ** 2));

  for (let j = 0; j < net.hiddenUnits; j += 1) {
    for (let k = 0; k < 2; k += 1) {
      net.w2[j][k] -= learningRate * pass.a1[j] * dz2[k];
    }
  }
  for (let k = 0; k < 2; k += 1) {
    net.b2[k] -= learningRate * dz2[k];
  }
  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < net.hiddenUnits; j += 1) {
      net.w1[i][j] -= learningRate * pass.input[i] * dz1[j];
    }
  }
  for (let j = 0; j < net.hiddenUnits; j += 1) {
    net.b1[j] -= learningRate * dz1[j];
  }
}

function shuffleInPlace(items, random) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

function networkLearningRate() {
  return Number(dom.networkRateSlider.value) / 100;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function setTrainingProgress(done, total, phase = "ready") {
  const safeTotal = Math.max(1, total);
  const ratio = clamp(done / safeTotal, 0, 1);
  dom.trainingProgressBar.style.width = `${ratio * 100}%`;
  dom.trainingProgress.classList.toggle("is-running", phase === "running");
  dom.trainingProgress.classList.toggle("is-complete", phase === "complete");
  if (phase === "running") {
    dom.trainingProgress.querySelector("strong").textContent = "Training in progress";
    dom.trainingProgressText.textContent = `Epoch ${done} of ${total}. Cross-entropy, accuracy, and the decision map update as the network learns.`;
  } else if (phase === "complete") {
    dom.trainingProgress.querySelector("strong").textContent = "Training complete";
    dom.trainingProgressText.textContent = `Finished ${total} epoch${total === 1 ? "" : "s"}. Click once again when you want another run.`;
  } else {
    dom.trainingProgress.querySelector("strong").textContent = "Ready to train";
    dom.trainingProgressText.textContent = "One click runs the selected epochs and updates the map as it learns.";
  }
}

function setNetworkTrainingControls(isRunning) {
  state.isNetworkTraining = isRunning;
  dom.trainBatchButton.disabled = isRunning;
  dom.trainOneEpochButton.disabled = isRunning;
  dom.resetNetworkButton.disabled = isRunning;
  dom.newDataButton.disabled = isRunning;
  dom.datasetSelect.disabled = isRunning;
  dom.hiddenUnitsSlider.disabled = isRunning;
  dom.networkRateSlider.disabled = isRunning;
  dom.epochBatchSlider.disabled = isRunning;
  dom.trainBatchButton.textContent = isRunning ? "Training..." : "Train selected epochs";
  dom.trainOneEpochButton.textContent = isRunning ? "Running..." : "Train 1 epoch";
}

function trainEpochs(count) {
  const lr = networkLearningRate();
  for (let epoch = 0; epoch < count; epoch += 1) {
    const random = mulberry32(state.dataSeed + state.network.epochs * 31 + 1009);
    const batch = state.data.train.slice();
    shuffleInPlace(batch, random);
    batch.forEach((point) => trainOneExample(state.network, point, lr));
    state.network.epochs += 1;
    const trainEval = evaluateNet(state.network, state.data.train);
    state.networkHistory.push(trainEval.loss);
    if (state.networkHistory.length > 100) state.networkHistory.shift();
  }
}

function trainTinyNetwork(epochs = 40) {
  const steps = clamp(Math.round(Number(epochs) || 1), 1, 300);
  trainEpochs(steps);
  renderNetworkLab();
  return networkSummary();
}

async function trainTinyNetworkAnimated(epochs = 40) {
  if (state.isNetworkTraining) return networkSummary();
  const total = clamp(Math.round(Number(epochs) || 1), 1, 300);
  const runId = state.networkTrainingRun + 1;
  state.networkTrainingRun = runId;
  setNetworkTrainingControls(true);
  setTrainingProgress(0, total, "running");
  try {
    for (let done = 0; done < total; done += 1) {
      if (state.networkTrainingRun !== runId) break;
      trainEpochs(1);
      renderNetworkLab();
      setTrainingProgress(done + 1, total, "running");
      await wait(total <= 5 ? 180 : 45);
    }
    if (state.networkTrainingRun === runId) {
      setTrainingProgress(total, total, "complete");
    }
  } finally {
    if (state.networkTrainingRun === runId) {
      setNetworkTrainingControls(false);
    }
  }
  return networkSummary();
}

function beginOneEpochTraining(event) {
  event?.preventDefault();
  if (state.isNetworkTraining) return;
  state.hasTrainedNetwork = true;
  trainTinyNetworkAnimated(1);
}

function beginBatchTraining(event) {
  event?.preventDefault();
  if (state.isNetworkTraining) return;
  state.hasTrainedNetwork = true;
  trainTinyNetworkAnimated(Number(dom.epochBatchSlider.value));
}

function networkSummary() {
  const trainEval = evaluateNet(state.network, state.data.train);
  const testEval = evaluateNet(state.network, state.data.test);
  return {
    dataset: dom.datasetSelect.value,
    hiddenUnits: state.network.hiddenUnits,
    epochs: state.network.epochs,
    learningRate: networkLearningRate(),
    trainLoss: Number(trainEval.loss.toFixed(4)),
    trainAccuracy: Number(trainEval.accuracy.toFixed(3)),
    testAccuracy: Number(testEval.accuracy.toFixed(3)),
    generalizationGap: Number(Math.abs(trainEval.accuracy - testEval.accuracy).toFixed(3))
  };
}

function resetNetwork({ newData = false } = {}) {
  state.networkTrainingRun += 1;
  state.hasTrainedNetwork = false;
  setNetworkTrainingControls(false);
  if (newData) state.dataSeed += 17;
  state.networkSeed += 13;
  const datasetType = dom.datasetSelect.value;
  state.data = makeDataset(datasetType, state.dataSeed);
  state.network = makeNetwork(Number(dom.hiddenUnitsSlider.value), state.networkSeed);
  state.networkHistory = [evaluateNet(state.network, state.data.train).loss];
  setTrainingProgress(0, Number(dom.epochBatchSlider.value), "ready");
  renderNetworkLab();
}

function renderNetworkControls() {
  dom.hiddenUnitsLabel.textContent = dom.hiddenUnitsSlider.value;
  dom.networkRateLabel.textContent = formatNumber(networkLearningRate(), 2);
  dom.epochBatchLabel.textContent = dom.epochBatchSlider.value;
}

function renderNetworkLab() {
  renderNetworkControls();
  if (!state.hasTrainedNetwork) {
    dom.networkStatus.textContent = "untrained";
    dom.networkEpochLabel.textContent = "0 epochs";
    dom.networkMetrics.replaceChildren(createElement("div", "empty-state", "Press \u201cTrain selected epochs\u201d to train the network and reveal its metrics."));
    dom.lossHistory.replaceChildren(createElement("div", "empty-state", "Cross-entropy history appears once training starts."));
    dom.generalizationPanel.replaceChildren(createElement("p", "", "Train the network to compare train and test accuracy."));
    drawDecisionMapPlaceholder();
    return;
  }
  const summary = networkSummary();
  dom.networkStatus.textContent = state.network.epochs === 0 ? "untrained" : "trained";
  dom.networkEpochLabel.textContent = `${state.network.epochs} epoch${state.network.epochs === 1 ? "" : "s"}`;
  renderMetricCards(dom.networkMetrics, [
    {
      label: "train cross-entropy",
      value: formatNumber(summary.trainLoss, 3),
      note: "nats per example"
    },
    {
      label: "train accuracy",
      value: formatPercent(summary.trainAccuracy),
      note: "solid dots it got right"
    },
    {
      label: "test accuracy",
      value: formatPercent(summary.testAccuracy),
      note: "haloed dots it never saw"
    },
    {
      label: "gap",
      value: formatPercent(summary.generalizationGap),
      note: "train minus test = overfitting"
    },
    {
      label: "parameters",
      value: String(state.network.hiddenUnits * 5 + 2),
      note: "weights and biases"
    },
    {
      label: "learning rate",
      value: formatNumber(summary.learningRate, 2),
      note: "update size"
    }
  ]);
  renderLossHistory();
  renderGeneralization(summary);
  drawDecisionMap();
}

function renderLossHistory() {
  const recent = state.networkHistory.slice(-8);
  const maxLoss = Math.max(...recent, 0.1);
  dom.lossHistory.replaceChildren();
  recent.forEach((loss, index) => {
    const row = createElement("div", "history-row");
    const label = index === recent.length - 1 ? "latest" : `-${recent.length - index - 1}`;
    const track = createElement("div", "history-track");
    const fill = createElement("span");
    fill.style.width = `${clamp((loss / maxLoss) * 100, 2, 100)}%`;
    track.append(fill);
    row.append(createElement("strong", "", label), track, createElement("em", "", formatNumber(loss, 3)));
    dom.lossHistory.append(row);
  });
}

function renderGeneralization(summary) {
  const p = createElement("p");
  if (summary.trainAccuracy > 0.9 && summary.testAccuracy < 0.72) {
    p.textContent = "The model fits the training points much better than the test points. That gap is the overfitting warning sign.";
  } else if (summary.testAccuracy > 0.82 && summary.generalizationGap < 0.16) {
    p.textContent = "The test accuracy is close to the training accuracy. That is the generalization pattern we want: the model learned a reusable boundary.";
  } else if (state.network.epochs === 0) {
    p.textContent = "The network is still random. Train a few epochs and watch the boundary move toward the pattern in the points.";
  } else {
    p.textContent = "Training is in progress. More epochs or a different hidden size may help, but a noisy dataset can keep the test score imperfect.";
  }
  dom.generalizationPanel.replaceChildren(p);
}

function drawDecisionMapPlaceholder() {
  const canvas = dom.decisionCanvas;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f4efe6";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#6a6a6a";
  context.font = "16px system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Press \u201cTrain selected epochs\u201d to draw the decision boundary.", canvas.width / 2, canvas.height / 2);
}

function drawDecisionMap() {
  const canvas = dom.decisionCanvas;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  const toCanvasX = (x) => ((x + 1.05) / 2.1) * width;
  const toCanvasY = (y) => height - ((y + 1.05) / 2.1) * height;
  const fromCanvasX = (x) => (x / width) * 2.1 - 1.05;
  const fromCanvasY = (y) => ((height - y) / height) * 2.1 - 1.05;
  const step = 8;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const point = { x: fromCanvasX(x + step / 2), y: fromCanvasY(y + step / 2), label: 0 };
      const p1 = forwardNet(state.network, point).probs[1];
      // soft coral where it predicts group A, blending to soft teal where it predicts group B
      const red = Math.round(248 * (1 - p1) + 205 * p1);
      const green = Math.round(224 * (1 - p1) + 232 * p1);
      const blue = Math.round(209 * (1 - p1) + 229 * p1);
      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fillRect(x, y, step + 1, step + 1);
    }
  }
  context.strokeStyle = "rgba(17, 17, 17, 0.25)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, toCanvasY(0));
  context.lineTo(width, toCanvasY(0));
  context.moveTo(toCanvasX(0), 0);
  context.lineTo(toCanvasX(0), height);
  context.stroke();
  drawPoints(context, state.data.test, toCanvasX, toCanvasY, true);
  drawPoints(context, state.data.train, toCanvasX, toCanvasY, false);
}

function drawPoints(context, points, toX, toY, isTest) {
  points.forEach((point) => {
    const x = toX(point.x);
    const y = toY(point.y);
    const color = point.label === 0 ? "#c65f1e" : "#15756c";
    if (isTest) {
      // held-out dots get a white halo so they pop on any shade
      context.beginPath();
      context.arc(x, y, 6.8, 0, Math.PI * 2);
      context.strokeStyle = "#ffffff";
      context.lineWidth = 3;
      context.stroke();
      context.beginPath();
      context.arc(x, y, 4.6, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      context.strokeStyle = "rgba(17, 17, 17, 0.55)";
      context.lineWidth = 1;
      context.stroke();
    } else {
      context.beginPath();
      context.arc(x, y, 5.2, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      context.strokeStyle = "rgba(17, 17, 17, 0.45)";
      context.lineWidth = 1;
      context.stroke();
    }
  });
}

// ---------- Tiny neural next-word model (a miniature fixed-window language model) ----------
const NW_SENTENCES = [
  "the cat sat on the mat",
  "the cat ran in the sun",
  "the cat slept under the tree",
  "the cat saw a bird",
  "the cat chased a mouse",
  "the cat jumped over the fence",
  "the cat hid in the bush",
  "the cat rested by the log",
  "the cat played in the garden",
  "the cat sat and slept",
  "the dog sat on the mat",
  "the dog ran in the park",
  "the dog slept near the log",
  "the dog watched a bird",
  "the dog swam in the lake",
  "the dog chased a duck",
  "the dog jumped over the fence",
  "the dog rested by the river",
  "the dog played in the field",
  "the dog ran and played",
  "the bird sat on the tree",
  "the bird flew over the hill",
  "the bird sang in the garden",
  "the bird hid in the nest",
  "the bird saw a cat",
  "the bird rested on the fence",
  "a bird flew near the pond",
  "the bird flew and sang",
  "the fox ran by the river",
  "the fox hid in the bush",
  "the fox watched a rabbit",
  "the fox saw a duck",
  "the fox ran and hid",
  "the owl slept in the tree",
  "the owl flew over the field",
  "the owl saw a mouse",
  "the rabbit ran in the field",
  "the rabbit hid under the log",
  "the rabbit ate in the garden",
  "the mouse ran under the fence",
  "the mouse hid by the bush",
  "the mouse ate by the log",
  "the fish swam in the river",
  "the fish rested under the log",
  "the frog jumped in the pond",
  "the frog sat on the log",
  "the duck swam in the lake",
  "the duck slept by the pond",
  "a duck flew over the river",
  "the girl ran in the park",
  "the girl played in the garden",
  "the girl saw a duck",
  "the girl sang by the river",
  "the girl rested by the pond",
  "the boy ran in the field",
  "the boy jumped over the log",
  "the boy found a frog",
  "the boy watched a bird",
  "the boy played in the park",
  "the boy swam in the lake",
  "a cat slept on the mat",
  "a dog ran in the rain",
  "a bird sang in the tree",
  "a fox hid in the bush",
  "a rabbit ran in the field",
  "a girl played in the garden",
  "a boy swam in the lake",
  "the cat saw a dog",
  "the dog saw a cat",
  "the owl saw a fox",
  "the fox saw a rabbit",
  "the duck saw a frog"
];
const NW_WATCH = [
  ["the", "cat"],
  ["the", "dog"],
  ["saw", "a"],
  ["in", "the"]
];
const NW_START = "<s>";
const NW_END = ".";
const NW_DIM = 12;
const NW_HIDDEN = 24;
const NW_CONTEXT = 2;
const NW_RATE = 0.02;
const NW_DEFAULT_BUDGET_MS = 30000;

let nwData = buildNextWordData();
let nwModel = null;
let nwHistory = [];
const nwState = { isTraining: false, run: 0, seed: 91, hasTrained: false };

function nwLabel(token) {
  if (token === NW_START) return "start";
  if (token === NW_END) return "(end)";
  return token;
}

function buildNextWordData() {
  const vocabSet = new Set([NW_START, NW_END]);
  const sentences = NW_SENTENCES.map((line) => line.trim().split(/\s+/));
  sentences.forEach((words) => words.forEach((word) => vocabSet.add(word)));
  const vocab = Array.from(vocabSet);
  const index = new Map(vocab.map((word, i) => [word, i]));
  const examples = [];
  sentences.forEach((words) => {
    const sequence = [NW_START, NW_START, ...words, NW_END];
    for (let i = NW_CONTEXT; i < sequence.length; i += 1) {
      examples.push({
        context: [index.get(sequence[i - 2]), index.get(sequence[i - 1])],
        target: index.get(sequence[i])
      });
    }
  });
  return { vocab, index, examples };
}

function nextWordParamCount() {
  const inputDim = NW_DIM * NW_CONTEXT;
  const vocabularySize = nwModel?.V ?? nwData.vocab.length;
  return vocabularySize * NW_DIM + inputDim * NW_HIDDEN + NW_HIDDEN + NW_HIDDEN * vocabularySize + vocabularySize;
}

function makeNextWordModel(seed) {
  const random = mulberry32(seed);
  const V = nwData.vocab.length;
  const inputDim = NW_DIM * NW_CONTEXT;
  const emb = Array.from({ length: V }, () => (
    Array.from({ length: NW_DIM }, () => randomNormal(random) * 0.4)
  ));
  const w1 = Array.from({ length: inputDim }, () => (
    Array.from({ length: NW_HIDDEN }, () => randomNormal(random) / Math.sqrt(inputDim))
  ));
  const b1 = Array.from({ length: NW_HIDDEN }, () => 0);
  const w2 = Array.from({ length: NW_HIDDEN }, () => (
    Array.from({ length: V }, () => randomNormal(random) / Math.sqrt(NW_HIDDEN))
  ));
  const b2 = Array.from({ length: V }, () => 0);
  return { V, emb, w1, b1, w2, b2, epochs: 0 };
}

function cloneNextWordModel(model) {
  return {
    V: model.V,
    emb: model.emb.map((row) => row.slice()),
    w1: model.w1.map((row) => row.slice()),
    b1: model.b1.slice(),
    w2: model.w2.map((row) => row.slice()),
    b2: model.b2.slice(),
    epochs: model.epochs
  };
}

function nwForward(model, context) {
  const x = [];
  context.forEach((id) => model.emb[id].forEach((value) => x.push(value)));
  const z1 = model.b1.map((bias, j) => bias + x.reduce((sum, value, i) => sum + value * model.w1[i][j], 0));
  const a1 = z1.map((value) => Math.tanh(value));
  const z2 = model.b2.map((bias, k) => bias + a1.reduce((sum, value, j) => sum + value * model.w2[j][k], 0));
  const probs = softmax(z2);
  return { x, z1, a1, z2, probs };
}

function nwTrainExample(model, example, learningRate) {
  const pass = nwForward(model, example.context);
  const inputDim = NW_DIM * NW_CONTEXT;
  const dz2 = pass.probs.slice();
  dz2[example.target] -= 1;
  const da1 = new Array(NW_HIDDEN).fill(0);
  for (let j = 0; j < NW_HIDDEN; j += 1) {
    for (let k = 0; k < model.V; k += 1) {
      da1[j] += dz2[k] * model.w2[j][k];
      model.w2[j][k] -= learningRate * pass.a1[j] * dz2[k];
    }
  }
  for (let k = 0; k < model.V; k += 1) model.b2[k] -= learningRate * dz2[k];
  const dz1 = da1.map((value, j) => value * (1 - pass.a1[j] ** 2));
  const dx = new Array(inputDim).fill(0);
  for (let i = 0; i < inputDim; i += 1) {
    for (let j = 0; j < NW_HIDDEN; j += 1) {
      dx[i] += dz1[j] * model.w1[i][j];
      model.w1[i][j] -= learningRate * pass.x[i] * dz1[j];
    }
  }
  for (let j = 0; j < NW_HIDDEN; j += 1) model.b1[j] -= learningRate * dz1[j];
  for (let c = 0; c < NW_CONTEXT; c += 1) {
    const id = example.context[c];
    for (let col = 0; col < NW_DIM; col += 1) {
      model.emb[id][col] -= learningRate * dx[c * NW_DIM + col];
    }
  }
}

function nwEvaluate(model) {
  let loss = 0;
  nwData.examples.forEach((example) => {
    const { probs } = nwForward(model, example.context);
    loss += -Math.log(Math.max(probs[example.target], 1e-9));
  });
  const average = loss / nwData.examples.length;
  return { loss: average, perplexity: Math.exp(average) };
}

function nwTrainEpochs(count) {
  for (let epoch = 0; epoch < count; epoch += 1) {
    const random = mulberry32(1234 + nwModel.epochs * 17);
    const batch = nwData.examples.slice();
    shuffleInPlace(batch, random);
    batch.forEach((example) => nwTrainExample(nwModel, example, NW_RATE));
    nwModel.epochs += 1;
    nwHistory.push(nwEvaluate(nwModel).loss);
    if (nwHistory.length > 200) nwHistory.shift();
  }
}

function generateSentence(temperature = 0.8, maxLength = 12) {
  let context = [nwData.index.get(NW_START), nwData.index.get(NW_START)];
  const words = [];
  for (let step = 0; step < maxLength; step += 1) {
    const { z2 } = nwForward(nwModel, context);
    const scaled = z2.map((value) => value / Math.max(temperature, 0.05));
    const probs = softmax(scaled);
    let roll = Math.random();
    let pick = probs.length - 1;
    for (let i = 0; i < probs.length; i += 1) {
      roll -= probs[i];
      if (roll <= 0) { pick = i; break; }
    }
    const word = nwData.vocab[pick];
    if (word === NW_END) break;
    if (word !== NW_START) words.push(word);
    context = [context[1], pick];
  }
  return words.length ? words.join(" ") : "(no words yet — train a little first)";
}

function nextWordSummary() {
  const evaluation = nwEvaluate(nwModel);
  return {
    epochs: nwModel.epochs,
    vocab: nwModel.V,
    parameters: nextWordParamCount(),
    trainLoss: Number(evaluation.loss.toFixed(4)),
    perplexity: Number(evaluation.perplexity.toFixed(2)),
    sample: generateSentence(0.8)
  };
}

function trainNextWordModel(epochs = 120) {
  const steps = clamp(Math.round(Number(epochs) || 1), 1, 600);
  nwState.hasTrained = true;
  nwTrainEpochs(steps);
  renderNextWordLab();
  return nextWordSummary();
}

function setNwTrainingControls(isRunning) {
  nwState.isTraining = isRunning;
  dom.nwTrainButton.disabled = isRunning;
  dom.nwTrainStepButton.disabled = isRunning;
  dom.nwResetButton.disabled = isRunning;
  dom.nwGenerateButton.disabled = isRunning;
  if (dom.nwBudgetSelect) dom.nwBudgetSelect.disabled = isRunning;
  dom.nwTrainButton.textContent = isRunning ? "Training..." : "Train next-word model";
}

function setNwProgress(fraction, phase, headline, detail) {
  dom.nwProgressBar.style.width = `${clamp(fraction, 0, 1) * 100}%`;
  dom.nwProgress.classList.toggle("is-running", phase === "running");
  dom.nwProgress.classList.toggle("is-complete", phase === "complete");
  dom.nwProgress.querySelector("strong").textContent = headline;
  dom.nwProgressText.textContent = detail;
}

async function trainNextWordTimed(budgetMs) {
  if (nwState.isTraining) return nextWordSummary();
  const budget = clamp(Math.round(Number(budgetMs) || NW_DEFAULT_BUDGET_MS), 3000, 120000);
  const budgetS = Math.round(budget / 1000);
  const runId = nwState.run + 1;
  nwState.run = runId;
  nwState.hasTrained = true;
  setNwTrainingControls(true);
  const start = performance.now();
  let elapsed = 0;
  let converged = false;
  let diverged = false;
  let checksWithoutImprovement = 0;
  const startingLoss = nwEvaluate(nwModel).loss;
  let bestLoss = startingLoss;
  let bestModel = cloneNextWordModel(nwModel);
  let bestEpoch = nwModel.epochs;
  try {
    setNwProgress(0, "running", "Training in progress", `0s of ${budgetS}s - warming up...`);
    await wait(16);
    while (elapsed < budget) {
      if (nwState.run !== runId) break;
      const sliceStart = performance.now();
      do {
        nwTrainEpochs(1);
        elapsed = performance.now() - start;
        const epochLoss = nwHistory[nwHistory.length - 1];
        if (!Number.isFinite(epochLoss) || epochLoss > bestLoss + 0.5) {
          diverged = true;
          break;
        }
        if (epochLoss < bestLoss - 5e-4) {
          bestLoss = epochLoss;
          bestModel = cloneNextWordModel(nwModel);
          bestEpoch = nwModel.epochs;
          checksWithoutImprovement = 0;
        } else {
          checksWithoutImprovement += 1;
        }
        if (checksWithoutImprovement >= 12 && elapsed > 2500) {
          converged = true;
          break;
        }
      } while (performance.now() - sliceStart < 45 && elapsed < budget);
      const loss = nwHistory[nwHistory.length - 1];
      const ppl = Math.exp(loss);
      renderNextWordLab();
      setNwProgress(
        elapsed / budget,
        "running",
        "Training in progress",
        `${(elapsed / 1000).toFixed(0)}s of ${budgetS}s - epoch ${nwModel.epochs}, cross-entropy ${loss.toFixed(3)} nats, perplexity ${ppl.toFixed(1)}`
      );
      if (diverged || converged) break;
      await wait(16);
    }
    if (nwState.run === runId) {
      const attemptedEpoch = nwModel.epochs;
      nwModel = cloneNextWordModel(bestModel);
      const finalLoss = nwEvaluate(nwModel).loss;
      const finalPpl = Math.exp(finalLoss);
      const laterEpochs = Math.max(0, attemptedEpoch - bestEpoch);
      const lossSummary = finalLoss < startingLoss - 1e-6
        ? `Cross-entropy fell from ${startingLoss.toFixed(3)} to ${finalLoss.toFixed(3)} nats.`
        : `Cross-entropy stayed at ${finalLoss.toFixed(3)} nats.`;
      const keptSummary = laterEpochs > 0
        ? `Epoch ${bestEpoch} was best; ${laterEpochs} later pass${laterEpochs === 1 ? "" : "es"} did not beat it, so the model kept epoch ${bestEpoch}.`
        : "The final epoch was also the lowest-loss result.";
      nwHistory.push(finalLoss);
      if (nwHistory.length > 200) nwHistory.shift();
      renderNextWordLab();
      setNwProgress(
        1,
        "complete",
        diverged ? "Training stopped safely" : "Training complete",
        `${lossSummary} ${keptSummary} Perplexity is ${finalPpl.toFixed(1)}.`
      );
    }
  } finally {
    if (nwState.run === runId) setNwTrainingControls(false);
  }
  return nextWordSummary();
}

function beginNextWordTraining(event) {
  event?.preventDefault();
  if (nwState.isTraining) return;
  trainNextWordTimed(Number(dom.nwBudgetSelect ? dom.nwBudgetSelect.value : NW_DEFAULT_BUDGET_MS));
}

function beginNextWordStep(event) {
  event?.preventDefault();
  if (nwState.isTraining) return;
  trainNextWordTimed(8000);
}

function resetNextWord() {
  nwState.run += 1;
  nwState.hasTrained = false;
  setNwTrainingControls(false);
  nwModel = makeNextWordModel(nwState.seed);
  nwHistory = [nwEvaluate(nwModel).loss];
  setNwProgress(0, "ready", "Ready to train", "Pick a time budget and press Train - it trains until it converges or the budget runs out, showing live progress.");
  dom.nwGeneratePanel.replaceChildren(
    createElement("p", "", "Train the model, then click generate to sample a sentence one word at a time.")
  );
  renderNextWordLab();
}

function populateContextSelects() {
  const friendly = nwData.vocab.filter((word) => word !== NW_END);
  [dom.nwContextSelectA, dom.nwContextSelectB].forEach((select, position) => {
    select.replaceChildren();
    friendly.forEach((word) => {
      const option = document.createElement("option");
      option.value = word;
      option.textContent = nwLabel(word);
      select.append(option);
    });
    select.value = position === 0 ? "the" : "cat";
  });
}

function renderNwPrediction() {
  const wordA = dom.nwContextSelectA.value;
  const wordB = dom.nwContextSelectB.value;
  dom.nwContextLabel.textContent = `${nwLabel(wordA)} ${nwLabel(wordB)} →`;
  if (!nwState.hasTrained) {
    dom.nwPredictPanel.replaceChildren(createElement("div", "empty-state", "Train the model to see next-word probabilities for this context."));
    return;
  }
  const context = [nwData.index.get(wordA), nwData.index.get(wordB)];
  const { probs } = nwForward(nwModel, context);
  const ranked = probs
    .map((probability, i) => ({ word: nwData.vocab[i], probability }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 6);
  dom.nwPredictPanel.replaceChildren();
  ranked.forEach((row) => {
    dom.nwPredictPanel.append(probabilityRow(nwLabel(row.word), row.probability, formatPercent(row.probability)));
  });
}

function renderNwWatch() {
  if (!dom.nwWatchPanel) return;
  if (!nwState.hasTrained) {
    dom.nwWatchPanel.replaceChildren(createElement("div", "empty-state", "These four contexts sharpen as the model learns. Press Train and watch each one lock onto a sensible next word."));
    return;
  }
  dom.nwWatchPanel.replaceChildren();
  NW_WATCH.forEach(([a, b]) => {
    const ia = nwData.index.get(a);
    const ib = nwData.index.get(b);
    if (ia === undefined || ib === undefined) return;
    const { probs } = nwForward(nwModel, [ia, ib]);
    let best = 0;
    for (let i = 1; i < probs.length; i += 1) if (probs[i] > probs[best]) best = i;
    const row = createElement("div", "watch-row");
    const track = createElement("div", "watch-track");
    const fill = createElement("span");
    fill.style.width = `${clamp(probs[best] * 100, 2, 100)}%`;
    track.append(fill);
    row.append(
      createElement("span", "watch-context", `${nwLabel(a)} ${nwLabel(b)} \u2192`),
      createElement("strong", "watch-word", nwLabel(nwData.vocab[best])),
      track,
      createElement("em", "watch-pct", formatPercent(probs[best]))
    );
    dom.nwWatchPanel.append(row);
  });
}

function renderCorpusPreview() {
  if (!dom.nwCorpusPreview) return;
  dom.nwCorpusPreview.replaceChildren();
  NW_SENTENCES.slice(0, 14).forEach((line) => {
    dom.nwCorpusPreview.append(createElement("code", "", line));
  });
  if (dom.nwCorpusCount) dom.nwCorpusCount.textContent = `${NW_SENTENCES.length} sentences`;
  const numberFormat = new Intl.NumberFormat("en-US");
  if (dom.nwTrainingSentenceCount) dom.nwTrainingSentenceCount.textContent = numberFormat.format(NW_SENTENCES.length);
  if (dom.nwTrainingExampleCount) dom.nwTrainingExampleCount.textContent = numberFormat.format(nwData.examples.length);
  if (dom.nwTrainingExampleCountInline) dom.nwTrainingExampleCountInline.textContent = numberFormat.format(nwData.examples.length);
  if (dom.nwTrainingVocabCount) dom.nwTrainingVocabCount.textContent = numberFormat.format(nwData.vocab.length);
  if (dom.nwTrainingParamCount) dom.nwTrainingParamCount.textContent = numberFormat.format(nextWordParamCount());
}

function renderNwLossHistory() {
  const recent = nwHistory.slice(-8);
  const maxLoss = Math.max(...recent, 0.1);
  dom.nwLossHistory.replaceChildren();
  recent.forEach((loss, index) => {
    const row = createElement("div", "history-row");
    const label = index === recent.length - 1 ? "latest" : `-${recent.length - index - 1}`;
    const track = createElement("div", "history-track");
    const fill = createElement("span");
    fill.style.width = `${clamp((loss / maxLoss) * 100, 2, 100)}%`;
    track.append(fill);
    row.append(createElement("strong", "", label), track, createElement("em", "", formatNumber(loss, 3)));
    dom.nwLossHistory.append(row);
  });
}

function renderNextWordLab() {
  if (!nwModel) return;
  dom.nwTempLabel.textContent = formatNumber(Number(dom.nwTempSlider.value) / 100, 2);
  if (!nwState.hasTrained) {
    dom.nwStatus.textContent = "untrained";
    dom.nwMetrics.replaceChildren(createElement("div", "empty-state", "Press Train next-word model to train the model and reveal its metrics."));
    dom.nwLossHistory.replaceChildren(createElement("div", "empty-state", "Cross-entropy history appears once training starts."));
    renderNwPrediction();
    renderNwWatch();
    return;
  }
  const evaluation = nwEvaluate(nwModel);
  dom.nwStatus.textContent = nwModel.epochs === 0 ? "untrained" : `${nwModel.epochs} epochs`;
  renderMetricCards(dom.nwMetrics, [
    { label: "train cross-entropy", value: formatNumber(evaluation.loss, 3), note: "nats per prediction" },
    { label: "perplexity", value: formatNumber(evaluation.perplexity, 2), note: "effective word choices" },
    { label: "epochs", value: String(nwModel.epochs), note: "epoch of the current weights" },
    { label: "vocabulary", value: String(nwModel.V), note: "words it can predict" },
    { label: "parameters", value: String(nextWordParamCount()), note: "weights it tunes" },
    { label: "context", value: `${NW_CONTEXT} words`, note: "fixed window" }
  ]);
  renderNwPrediction();
  renderNwLossHistory();
  renderNwWatch();
}

function handleGenerate() {
  if (!nwModel) return;
  const temperature = Number(dom.nwTempSlider.value) / 100;
  const sentence = generateSentence(temperature);
  dom.nwGeneratePanel.replaceChildren(
    createElement("p", "generated-line", sentence),
    createElement("span", "generated-note", `sampled at temperature ${formatNumber(temperature, 2)} · click again for another`)
  );
}

// --- Transparent code-cell helpers: one visible step per call ------------
// These let a code cell show the real per-epoch loop instead of hiding it
// behind one opaque call. trainOneEpoch / nwTrainOneEpoch run a single pass
// (the four beats over every example); the read-back helpers report loss,
// accuracy, and perplexity so the cell can collect and return them.
function trainOneEpoch() {
  state.hasTrainedNetwork = true;
  trainEpochs(1);
}

function networkLoss() {
  return Number(evaluateNet(state.network, state.data.train).loss.toFixed(4));
}

function networkAccuracy() {
  return Number(evaluateNet(state.network, state.data.train).accuracy.toFixed(3));
}

function nwTrainOneEpoch() {
  nwState.hasTrained = true;
  nwTrainEpochs(1);
}

function nextWordLoss() {
  return Number(nwEvaluate(nwModel).loss.toFixed(4));
}

function nextWordPerplexity() {
  return Number(nwEvaluate(nwModel).perplexity.toFixed(2));
}

function runCodeCell(cell) {
  const input = cell.querySelector(".code-input");
  const output = cell.querySelector(".code-output");
  output.className = "code-output is-running";
  output.textContent = "Running...";
  try {
    const api = {
      trainOneEpoch, networkLoss, networkAccuracy,
      nwTrainOneEpoch, nextWordLoss, nextWordPerplexity, generateSentence,
      trainTinyNetwork, networkSummary, trainNextWordModel, nextWordSummary
    };
    const runner = new Function("api", `"use strict"; const { trainOneEpoch, networkLoss, networkAccuracy, nwTrainOneEpoch, nextWordLoss, nextWordPerplexity, generateSentence, trainTinyNetwork, networkSummary, trainNextWordModel, nextWordSummary } = api; return (() => { ${input.value} })();`);
    const result = runner(api);
    renderNetworkLab();
    renderNextWordLab();
    output.className = "code-output is-success";
    renderCodeResult(output, result);
  } catch (error) {
    output.className = "code-output is-error";
    output.textContent = `${error.name}: ${error.message}`;
  }
}

function humanizeKey(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase();
}

function formatResultValue(key, value) {
  if (typeof value !== "number") return String(value);
  if (/accuracy|gap/i.test(key)) return formatPercent(value);
  if (Number.isInteger(value)) return String(value);
  return formatNumber(value, Math.abs(value) < 1 ? 3 : 2);
}

function renderOutputLossCurve(values) {
  const losses = values.filter(Number.isFinite);
  if (losses.length < 2) return null;
  const width = 360;
  const height = 126;
  const padX = 28;
  const padY = 24;
  const minLoss = Math.min(...losses);
  const maxLoss = Math.max(...losses);
  const range = Math.max(maxLoss - minLoss, 1e-9);
  const toX = (index) => padX + (index / (losses.length - 1)) * (width - padX * 2);
  const toY = (loss) => padY + ((maxLoss - loss) / range) * (height - padY * 2);

  const panel = createElement("div", "output-loss-curve");
  panel.append(createElement("strong", "", "Cross-entropy from epoch 0"));
  const svg = createSvgElement("svg", {
    class: "output-loss-spark",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": `Cross-entropy falls from ${formatNumber(losses[0], 3)} at epoch 0 to ${formatNumber(losses[losses.length - 1], 3)} after ${losses.length - 1} epochs`
  });
  svg.append(
    createSvgElement("line", { class: "output-loss-axis", x1: padX, y1: height - padY, x2: width - padX, y2: height - padY }),
    createSvgElement("polyline", {
      class: "output-loss-line",
      points: losses.map((loss, index) => `${toX(index)},${toY(loss)}`).join(" ")
    }),
    createSvgElement("circle", { class: "output-loss-start", cx: toX(0), cy: toY(losses[0]), r: 4 }),
    createSvgElement("circle", { class: "output-loss-end", cx: toX(losses.length - 1), cy: toY(losses[losses.length - 1]), r: 4 })
  );
  const startLabel = createSvgElement("text", { class: "output-loss-label", x: padX, y: 14, "text-anchor": "start" });
  startLabel.textContent = `epoch 0: ${formatNumber(losses[0], 3)}`;
  const endLabel = createSvgElement("text", { class: "output-loss-label", x: width - padX, y: height - 6, "text-anchor": "end" });
  endLabel.textContent = `epoch ${losses.length - 1}: ${formatNumber(losses[losses.length - 1], 3)}`;
  svg.append(startLabel, endLabel);
  panel.append(svg);
  return panel;
}

function renderCodeResult(output, result) {
  const data = result && typeof result === "object" ? result : { value: result };
  const status = createElement("div", "output-status");
  status.append(
    createElement("strong", "", "Ran successfully"),
    createElement("span", "", "browser training loop")
  );
  const visual = createElement("div", "output-visual");

  const numericEntries = Object.entries(data).filter(
    ([key, value]) => key !== "sample" && typeof value === "number"
  );
  if (numericEntries.length) {
    const metrics = createElement("div", "output-metrics");
    numericEntries.slice(0, 6).forEach(([key, value]) => {
      const item = createElement("div", "output-metric");
      item.append(
        createElement("strong", "", formatResultValue(key, value)),
        createElement("span", "", humanizeKey(key))
      );
      metrics.append(item);
    });
    visual.append(metrics);
  }

  if (Array.isArray(data.lossCurve)) {
    const curve = renderOutputLossCurve(data.lossCurve);
    if (curve) visual.append(curve);
  }

  if (typeof data.sample === "string") {
    const sentence = createElement("div", "generate-panel");
    sentence.append(
      createElement("p", "generated-line", data.sample),
      createElement("span", "generated-note", "sampled from the model you just trained")
    );
    visual.append(sentence);
  }

  const raw = createElement("details", "output-raw");
  raw.append(createElement("summary", "", "Raw result object"));
  const pre = createElement("pre");
  pre.textContent = JSON.stringify(result, null, 2);
  raw.append(pre);
  visual.append(raw);

  output.replaceChildren(status, visual);
}

function wireEvents() {
  dom.probabilityContextSelect.addEventListener("change", () => { state.hasExploredProbability = true; applyProbabilityPreset(); });
  [...dom.countSliders, ...dom.guessSliders].forEach((slider) => {
    slider.addEventListener("input", () => { state.hasExploredProbability = true; renderProbability(); });
  });
  [dom.vectorAx, dom.vectorAy, dom.vectorBx, dom.vectorBy].forEach((slider) => {
    slider.addEventListener("input", renderVectors);
  });
  dom.embeddingLookupSelect.addEventListener("change", renderEmbeddingLookup);
  [dom.slopeSlider, dom.interceptSlider, dom.lineRateSlider].forEach((slider) => {
    slider.addEventListener("input", () => {
      if (state.autoLineTimer) stopAutoGradient("stopped", "Auto train stopped because you changed a control. Press Auto train to begin a fresh bounded run from these values.");
      state.hasExploredGradient = true;
      renderGradient();
    });
  });
  dom.gradientStepButton.addEventListener("click", () => { state.hasExploredGradient = true; stepGradientDescent(); });
  dom.gradientAutoButton.addEventListener("click", () => { state.hasExploredGradient = true; toggleAutoGradient(); });
  dom.gradientResetButton.addEventListener("click", resetGradient);
  dom.gradientBackButton.addEventListener("click", () => setGradientWalkthroughStep(state.gradientWalkthroughStep - 1));
  dom.gradientNextButton.addEventListener("click", () => setGradientWalkthroughStep(state.gradientWalkthroughStep + 1));
  dom.gradientPlayButton.addEventListener("click", toggleGradientWalkthroughPlayback);
  dom.gradientReplayButton.addEventListener("click", resetGradientWalkthrough);
  dom.gradientStepButtons.forEach((button) => {
    button.addEventListener("click", () => setGradientWalkthroughStep(Number(button.dataset.gradientStep)));
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.gradientWalkthroughTimer) stopGradientWalkthroughPlayback();
    if (document.hidden && state.softmaxPlayTimer) stopSoftmaxPlayback();
    if (document.hidden && state.autoLineTimer) {
      const steps = state.autoLineRun?.steps || 0;
      stopAutoGradient("paused", `Auto train stopped after ${steps} steps because the page became inactive.`);
    }
  });
  window.addEventListener("pagehide", () => {
    stopGradientWalkthroughPlayback();
    stopSoftmaxPlayback();
    stopAutoGradient();
  });
  [dom.logitA, dom.logitB, dom.logitC, dom.temperatureSlider].forEach((slider) => {
    slider.addEventListener("input", renderSoftmax);
  });
  dom.correctClassSelect.addEventListener("change", renderSoftmax);
  dom.softmaxBackButton.addEventListener("click", () => setSoftmaxStep(state.softmaxStep - 1));
  dom.softmaxNextButton.addEventListener("click", () => setSoftmaxStep(state.softmaxStep + 1));
  dom.softmaxPlayButton.addEventListener("click", toggleSoftmaxPlayback);
  dom.softmaxReplayButton.addEventListener("click", resetSoftmaxWalkthrough);
  dom.softmaxStepButtons.forEach((button) => {
    button.addEventListener("click", () => setSoftmaxStep(Number(button.dataset.softmaxStep)));
  });
  [dom.forwardCtxA, dom.forwardCtxB].forEach((select) => {
    select.addEventListener("change", resetForwardWalkthrough);
  });
  dom.activationSelect.addEventListener("change", resetForwardWalkthrough);
  dom.forwardBackButton.addEventListener("click", () => setForwardStep(state.forwardStep - 1));
  dom.forwardNextButton.addEventListener("click", () => setForwardStep(state.forwardStep + 1));
  dom.forwardPlayButton.addEventListener("click", toggleForwardPlayback);
  dom.forwardReplayButton.addEventListener("click", resetForwardWalkthrough);
  dom.forwardStepButtons.forEach((button) => {
    button.addEventListener("click", () => setForwardStep(Number(button.dataset.forwardStep)));
  });
  [dom.backpropCtxA, dom.backpropCtxB, dom.backpropTrueWord, dom.backpropActivation].forEach((select) => {
    select.addEventListener("change", restartBackpropRun);
  });
  dom.backpropRateSlider.addEventListener("input", renderBackprop);
  dom.backpropStepButton.addEventListener("click", backpropStep);
  dom.backpropResetButton.addEventListener("click", restartBackpropRun);
  if (dom.byHandLab) {
    dom.byHandCheckButton.addEventListener("click", checkByHandAnswer);
    dom.byHandHintButton.addEventListener("click", showByHandHint);
    dom.byHandSolutionButton.addEventListener("click", revealByHandSolution);
    dom.byHandPrevButton.addEventListener("click", () => moveByHandStep(-1));
    dom.byHandNextButton.addEventListener("click", () => moveByHandStep(1));
    dom.byHandResetButton.addEventListener("click", resetByHandWorksheet);
    dom.byHandAnswer.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        checkByHandAnswer();
      }
    });
  }
  dom.datasetSelect.addEventListener("change", () => resetNetwork({ newData: true }));
  dom.hiddenUnitsSlider.addEventListener("input", () => resetNetwork());
  dom.networkRateSlider.addEventListener("input", renderNetworkControls);
  dom.epochBatchSlider.addEventListener("input", renderNetworkControls);
  dom.trainOneEpochButton.addEventListener("click", beginOneEpochTraining);
  dom.trainBatchButton.addEventListener("click", beginBatchTraining);
  dom.resetNetworkButton.addEventListener("click", () => resetNetwork());
  dom.newDataButton.addEventListener("click", () => resetNetwork({ newData: true }));
  [dom.nwContextSelectA, dom.nwContextSelectB].forEach((select) => {
    select.addEventListener("change", renderNwPrediction);
  });
  dom.nwTempSlider.addEventListener("input", renderNextWordLab);
  dom.nwTrainButton.addEventListener("click", beginNextWordTraining);
  dom.nwTrainStepButton.addEventListener("click", beginNextWordStep);
  dom.nwResetButton.addEventListener("click", resetNextWord);
  dom.nwGenerateButton.addEventListener("click", handleGenerate);
  document.querySelectorAll(".chapter4-code-cell .run-button").forEach((button) => {
    button.addEventListener("click", () => runCodeCell(button.closest(".chapter4-code-cell")));
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
  applyProbabilityPreset();
  renderVectors();
  renderGradient();
  renderSoftmax();
  renderForwardPass();
  initBackpropLab();
  renderByHandLab();
  resetNetwork();
  renderCorpusPreview();
  populateContextSelects();
  resetNextWord();
  setupSectionSpy();
}

init();
