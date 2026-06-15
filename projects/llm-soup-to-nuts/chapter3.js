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
  backpropPanel: document.getElementById("backpropPanel"),
  forwardCtxA: document.getElementById("forwardCtxA"),
  forwardCtxB: document.getElementById("forwardCtxB"),
  activationSelect: document.getElementById("activationSelect"),
  networkSvg: document.getElementById("networkSvg"),
  forwardSummary: document.getElementById("forwardSummary"),
  forwardPanel: document.getElementById("forwardPanel"),
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
  nwEpochsSlider: document.getElementById("nwEpochsSlider"),
  nwEpochsLabel: document.getElementById("nwEpochsLabel"),
  nwTempSlider: document.getElementById("nwTempSlider"),
  nwTempLabel: document.getElementById("nwTempLabel"),
  nwTrainButton: document.getElementById("nwTrainButton"),
  nwTrainStepButton: document.getElementById("nwTrainStepButton"),
  nwResetButton: document.getElementById("nwResetButton"),
  nwGenerateButton: document.getElementById("nwGenerateButton"),
  nwGeneratePanel: document.getElementById("nwGeneratePanel"),
  nwProgress: document.getElementById("nwProgress"),
  nwProgressText: document.getElementById("nwProgressText"),
  nwProgressBar: document.getElementById("nwProgressBar")
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
    labels: ["ran", "sat", "barked"],
    counts: [9, 4, 2],
    guesses: [45, 35, 20]
  },
  bird: {
    title: "the bird",
    labels: ["sang", "flew", "sat"],
    counts: [5, 5, 3],
    guesses: [60, 25, 15]
  }
};

const embeddingRows = {
  cat: [0.62, -0.22, 0.48, 0.12],
  dog: [0.58, -0.18, 0.52, 0.19],
  mat: [-0.31, 0.73, -0.28, 0.44],
  rug: [-0.24, 0.69, -0.18, 0.56]
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
  network: null,
  data: null,
  dataSeed: 41,
  networkSeed: 17,
  networkHistory: [],
  networkTrainingRun: 0,
  isNetworkTraining: false,
  hasExploredProbability: false,
  hasExploredGradient: false,
  hasTrainedNetwork: false
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

function probabilityRow(label, value, detail, className = "") {
  const row = createElement("div", `probability-row ${className}`.trim());
  const name = createElement("strong", "", label);
  const track = createElement("div", "probability-track");
  const fill = createElement("span");
  fill.style.width = `${clamp(value * 100, 0, 100)}%`;
  track.append(fill);
  row.append(name, track, createElement("em", "", detail));
  return row;
}

function applyProbabilityPreset() {
  const preset = probabilityPresets[dom.probabilityContextSelect.value];
  state.probabilityPreset = dom.probabilityContextSelect.value;
  preset.labels.forEach((label, index) => {
    dom.countLabels[index].textContent = label;
    dom.guessLabels[index].textContent = label;
    dom.countSliders[index].value = preset.counts[index];
    dom.guessSliders[index].value = preset.guesses[index];
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
    dom.probabilityPanel.append(probabilityRow(label, target[index], detail));
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

function renderGradient() {
  const { w, b } = readLineParams();
  if (!state.hasExploredGradient) {
    dom.gradientStatus.textContent = "press Step";
    renderLineFitPlaceholder();
    dom.gradientMetrics.replaceChildren(createElement("div", "empty-state", "Move the slope, intercept, or rate slider \u2014 or press Step \u2014 to fit the line and see the gradients."));
    dom.gradientExplanation.replaceChildren();
    return;
  }
  const info = lineLossAndGradients(w, b);
  dom.gradientStatus.textContent = `loss ${formatNumber(info.loss, 3)}`;
  renderLineFitSvg(w, b);
  renderMetricCards(dom.gradientMetrics, [
    {
      label: "loss",
      value: formatNumber(info.loss, 4),
      note: "mean squared error"
    },
    {
      label: "dLoss / dSlope",
      value: formatNumber(info.dw, 4),
      note: info.dw > 0 ? "descent lowers slope" : "descent raises slope"
    },
    {
      label: "dLoss / dIntercept",
      value: formatNumber(info.db, 4),
      note: info.db > 0 ? "descent lowers intercept" : "descent raises intercept"
    }
  ]);
  const p = createElement("p");
  p.textContent = `Next descent step: slope = slope - stepSize * ${formatNumber(info.dw, 3)}, intercept = intercept - stepSize * ${formatNumber(info.db, 3)}. That small subtraction is the parameter update.`;
  dom.gradientExplanation.replaceChildren(p);
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
}

function resetGradient() {
  stopAutoGradient();
  dom.slopeSlider.value = -40;
  dom.interceptSlider.value = 20;
  dom.lineRateSlider.value = 8;
  renderGradient();
}

function stopAutoGradient() {
  if (state.autoLineTimer) {
    window.clearInterval(state.autoLineTimer);
    state.autoLineTimer = null;
  }
  dom.gradientAutoButton.textContent = "Auto train";
}

function toggleAutoGradient() {
  if (state.autoLineTimer) {
    stopAutoGradient();
    return;
  }
  dom.gradientAutoButton.textContent = "Stop";
  state.autoLineTimer = window.setInterval(() => {
    stepGradientDescent();
    const { w, b } = readLineParams();
    const { loss } = lineLossAndGradients(w, b);
    if (loss < 0.005) stopAutoGradient();
  }, 180);
}

function renderSoftmax() {
  const logits = [
    Number(dom.logitA.value) / 100,
    Number(dom.logitB.value) / 100,
    Number(dom.logitC.value) / 100
  ];
  const temperature = Number(dom.temperatureSlider.value) / 100;
  const scaled = logits.map((value) => value / temperature);
  const probabilities = softmax(scaled);
  const correctName = dom.correctClassSelect.value;
  const correctIndex = softmaxNames.indexOf(correctName);
  const loss = -Math.log(Math.max(probabilities[correctIndex], 1e-9));

  dom.logitALabel.textContent = formatNumber(logits[0], 2);
  dom.logitBLabel.textContent = formatNumber(logits[1], 2);
  dom.logitCLabel.textContent = formatNumber(logits[2], 2);
  dom.temperatureLabel.textContent = formatNumber(temperature, 2);
  dom.softmaxTempLabel.textContent = `temp ${formatNumber(temperature, 2)}`;
  dom.softmaxLossLabel.textContent = `loss ${formatNumber(loss, 3)}`;

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

  dom.backpropPanel.replaceChildren();
  probabilities.forEach((probability, index) => {
    const target = index === correctIndex ? 1 : 0;
    const gradient = probability - target;
    const className = index === correctIndex ? "is-answer" : gradient > 0.2 ? "is-too-high" : "";
    const row = createElement("div", `blame-row ${className}`.trim());
    const track = createElement("div", "softmax-track");
    const fill = createElement("span");
    fill.style.width = `${Math.min(Math.abs(gradient) * 100, 100)}%`;
    track.append(fill);
    const direction = gradient < 0 ? "raise score" : gradient > 0 ? "lower score" : "leave alone";
    row.append(
      createElement("strong", "", softmaxNames[index]),
      track,
      createElement("em", "", `${formatNumber(gradient, 3)}: ${direction}`)
    );
    dom.backpropPanel.append(row);
  });
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

function renderForwardPass() {
  const wordA = dom.forwardCtxA.value;
  const wordB = dom.forwardCtxB.value;
  const activationName = dom.activationSelect.value;
  const embA = forwardEmbeddings[wordA];
  const embB = forwardEmbeddings[wordB];
  const input = [embA[0], embA[1], embB[0], embB[1]];
  const z1 = forwardB1.map((bias, j) => bias + input.reduce((sum, value, i) => sum + value * forwardW1[i][j], 0));
  const hidden = z1.map((value) => activation(activationName, value));
  const logits = forwardB2.map((bias, k) => bias + hidden.reduce((sum, value, j) => sum + value * forwardW2[j][k], 0));
  const probs = softmax(logits);
  const bestIndex = probs.indexOf(Math.max(...probs));
  dom.forwardSummary.textContent = `predict "${forwardCandidates[bestIndex]}"`;
  renderNetworkSvg([wordA, wordB], hidden, forwardCandidates, probs);
  dom.forwardPanel.replaceChildren(
    lookupRow(`look up ${wordA}`, `[${embA.map((value) => formatNumber(value, 2)).join(", ")}]`),
    lookupRow(`look up ${wordB}`, `[${embB.map((value) => formatNumber(value, 2)).join(", ")}]`),
    lookupRow(`${activationName} hidden`, `[${hidden.map((value) => formatNumber(value, 2)).join(", ")}]`),
    lookupRow("output logits", `[${logits.map((value) => formatNumber(value, 2)).join(", ")}]`),
    lookupRow("softmax", forwardCandidates.map((word, i) => `${word} ${formatPercent(probs[i])}`).join(", "))
  );
}

function renderNetworkSvg(contextWords, hidden, candidates, probs) {
  const svg = dom.networkSvg;
  svg.replaceChildren();
  const inputNodes = contextWords.map((word, index) => ({
    x: 88,
    y: 95 + index * 110,
    label: word,
    value: index === 0 ? "context 1" : "context 2",
    isWord: true
  }));
  const hiddenNodes = hidden.map((value, index) => ({
    x: 280,
    y: 60 + index * 90,
    label: `h${index + 1}`,
    value: formatNumber(value, 2)
  }));
  const bestIndex = probs.indexOf(Math.max(...probs));
  const outputNodes = candidates.map((word, index) => ({
    x: 474,
    y: 60 + index * 90,
    label: word,
    value: formatPercent(probs[index]),
    isWord: true,
    isBest: index === bestIndex
  }));
  inputNodes.forEach((source) => {
    hiddenNodes.forEach((target) => {
      svg.append(createSvgElement("line", {
        class: "network-edge",
        x1: source.x + 40,
        y1: source.y,
        x2: target.x - 24,
        y2: target.y
      }));
    });
  });
  hiddenNodes.forEach((source) => {
    outputNodes.forEach((target) => {
      svg.append(createSvgElement("line", {
        class: target.isBest ? "network-edge is-active" : "network-edge",
        x1: source.x + 24,
        y1: source.y,
        x2: target.x - 40,
        y2: target.y
      }));
    });
  });
  const drawNode = (node, kind) => {
    const group = createSvgElement("g");
    if (node.isWord) {
      group.append(createSvgElement("rect", {
        class: `network-node ${kind}${node.isBest ? " is-best" : ""}`,
        x: node.x - 40,
        y: node.y - 21,
        width: 80,
        height: 42,
        rx: 11
      }));
    } else {
      group.append(createSvgElement("circle", { class: `network-node ${kind}`, cx: node.x, cy: node.y, r: 25 }));
    }
    const label = createSvgElement("text", { class: "network-label", x: node.x, y: node.y - 2 });
    label.textContent = node.label;
    const value = createSvgElement("text", { class: "network-value", x: node.x, y: node.y + 15 });
    value.textContent = node.value;
    group.append(label, value);
    svg.append(group);
  };
  inputNodes.forEach((node) => drawNode(node, "is-input"));
  hiddenNodes.forEach((node) => drawNode(node, "is-hidden"));
  outputNodes.forEach((node) => drawNode(node, "is-output"));
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
    dom.trainingProgressText.textContent = `Epoch ${done} of ${total}. Loss, accuracy, and the decision map update as the network learns.`;
  } else if (phase === "complete") {
    dom.trainingProgress.querySelector("strong").textContent = "Training complete";
    dom.trainingProgressText.textContent = `Finished ${total} epochs. Click once again when you want another run.`;
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
    dom.lossHistory.replaceChildren(createElement("div", "empty-state", "Loss history appears once training starts."));
    dom.generalizationPanel.replaceChildren(createElement("p", "", "Train the network to compare train and test accuracy."));
    drawDecisionMapPlaceholder();
    return;
  }
  const summary = networkSummary();
  dom.networkStatus.textContent = state.network.epochs === 0 ? "untrained" : "trained";
  dom.networkEpochLabel.textContent = `${state.network.epochs} epochs`;
  renderMetricCards(dom.networkMetrics, [
    {
      label: "train loss",
      value: formatNumber(summary.trainLoss, 3),
      note: "cross-entropy"
    },
    {
      label: "train accuracy",
      value: formatPercent(summary.trainAccuracy),
      note: "examples used for updates"
    },
    {
      label: "test accuracy",
      value: formatPercent(summary.testAccuracy),
      note: "held-out examples"
    },
    {
      label: "gap",
      value: formatPercent(summary.generalizationGap),
      note: "train minus test"
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
      const red = Math.round(238 * (1 - p1) + 39 * p1);
      const green = Math.round(244 * (1 - p1) + 102 * p1);
      const blue = Math.round(214 * (1 - p1) + 74 * p1);
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
  drawCanvasLegend(context);
}

function drawPoints(context, points, toX, toY, isTest) {
  points.forEach((point) => {
    const x = toX(point.x);
    const y = toY(point.y);
    context.beginPath();
    context.arc(x, y, isTest ? 4.4 : 5.4, 0, Math.PI * 2);
    context.fillStyle = point.label === 0 ? "#c65f1e" : "#27664a";
    context.strokeStyle = isTest ? "#ffffff" : "#111111";
    context.lineWidth = isTest ? 2 : 1.2;
    if (!isTest) context.fill();
    context.stroke();
  });
}

function drawCanvasLegend(context) {
  context.fillStyle = "rgba(255, 255, 255, 0.88)";
  context.fillRect(14, 14, 190, 56);
  context.strokeStyle = "rgba(17, 17, 17, 0.16)";
  context.strokeRect(14, 14, 190, 56);
  context.fillStyle = "#111111";
  context.font = "700 15px system-ui, sans-serif";
  context.fillText("filled: train", 28, 38);
  context.fillText("rings: test", 28, 59);
}

// ---------- Tiny neural next-word model (a miniature fixed-window language model) ----------
const NW_SENTENCES = [
  "the cat sat on the mat",
  "the cat ran in the sun",
  "the dog sat on the mat",
  "the dog ran in the rain",
  "a cat sat by the dog",
  "a dog sat by the cat",
  "the cat saw a bird",
  "the dog saw a bird",
  "the bird sat on the cat",
  "the bird ran from the dog",
  "the cat slept on the mat",
  "the dog slept in the sun"
];
const NW_START = "<s>";
const NW_END = ".";
const NW_DIM = 8;
const NW_HIDDEN = 16;
const NW_CONTEXT = 2;
const NW_RATE = 0.2;

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
  return nwModel.V * NW_DIM + inputDim * NW_HIDDEN + NW_HIDDEN + NW_HIDDEN * nwModel.V + nwModel.V;
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
  dom.nwEpochsSlider.disabled = isRunning;
  dom.nwTrainButton.textContent = isRunning ? "Training..." : "Train next-word model";
}

function setNwProgress(done, total, phase) {
  const safeTotal = Math.max(1, total);
  dom.nwProgressBar.style.width = `${clamp(done / safeTotal, 0, 1) * 100}%`;
  dom.nwProgress.classList.toggle("is-running", phase === "running");
  dom.nwProgress.classList.toggle("is-complete", phase === "complete");
  const strong = dom.nwProgress.querySelector("strong");
  if (phase === "running") {
    strong.textContent = "Training in progress";
    dom.nwProgressText.textContent = `Epoch ${done} of ${total}. Loss, perplexity, and the prediction bars update as it learns.`;
  } else if (phase === "complete") {
    strong.textContent = "Training complete";
    dom.nwProgressText.textContent = `Finished ${total} epochs. Try a context, or generate a sentence.`;
  } else {
    strong.textContent = "Ready to train";
    dom.nwProgressText.textContent = "One click runs the selected epochs and updates the predictions live.";
  }
}

async function trainNextWordAnimated(epochs) {
  if (nwState.isTraining) return nextWordSummary();
  const total = clamp(Math.round(Number(epochs) || 1), 1, 600);
  const runId = nwState.run + 1;
  nwState.run = runId;
  setNwTrainingControls(true);
  setNwProgress(0, total, "running");
  try {
    const chunk = total <= 40 ? 2 : 8;
    let done = 0;
    while (done < total) {
      if (nwState.run !== runId) break;
      const next = Math.min(chunk, total - done);
      nwTrainEpochs(next);
      done += next;
      renderNextWordLab();
      setNwProgress(done, total, "running");
      await wait(30);
    }
    if (nwState.run === runId) setNwProgress(total, total, "complete");
  } finally {
    if (nwState.run === runId) setNwTrainingControls(false);
  }
  return nextWordSummary();
}

function beginNextWordTraining(event) {
  event?.preventDefault();
  if (nwState.isTraining) return;
  nwState.hasTrained = true;
  trainNextWordAnimated(Number(dom.nwEpochsSlider.value));
}

function beginNextWordStep(event) {
  event?.preventDefault();
  if (nwState.isTraining) return;
  nwState.hasTrained = true;
  trainNextWordAnimated(10);
}

function resetNextWord() {
  nwState.run += 1;
  nwState.hasTrained = false;
  setNwTrainingControls(false);
  nwModel = makeNextWordModel(nwState.seed);
  nwHistory = [nwEvaluate(nwModel).loss];
  setNwProgress(0, Number(dom.nwEpochsSlider.value), "ready");
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
  dom.nwEpochsLabel.textContent = dom.nwEpochsSlider.value;
  dom.nwTempLabel.textContent = formatNumber(Number(dom.nwTempSlider.value) / 100, 2);
  if (!nwState.hasTrained) {
    dom.nwStatus.textContent = "untrained";
    dom.nwMetrics.replaceChildren(createElement("div", "empty-state", "Press Train (or Train one step) to train the model and reveal its metrics."));
    dom.nwLossHistory.replaceChildren(createElement("div", "empty-state", "Loss history appears once training starts."));
    renderNwPrediction();
    return;
  }
  const evaluation = nwEvaluate(nwModel);
  dom.nwStatus.textContent = nwModel.epochs === 0 ? "untrained" : `${nwModel.epochs} epochs`;
  renderMetricCards(dom.nwMetrics, [
    { label: "train loss", value: formatNumber(evaluation.loss, 3), note: "cross-entropy in nats" },
    { label: "perplexity", value: formatNumber(evaluation.perplexity, 2), note: "effective word choices" },
    { label: "epochs", value: String(nwModel.epochs), note: "passes over the corpus" },
    { label: "vocabulary", value: String(nwModel.V), note: "words it can predict" },
    { label: "parameters", value: String(nextWordParamCount()), note: "weights it tunes" },
    { label: "context", value: `${NW_CONTEXT} words`, note: "fixed window" }
  ]);
  renderNwPrediction();
  renderNwLossHistory();
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

function runCodeCell(cell) {
  const input = cell.querySelector(".code-input");
  const output = cell.querySelector(".code-output");
  output.className = "code-output is-running";
  output.textContent = "Running...";
  try {
    const api = { trainTinyNetwork, networkSummary, trainNextWordModel, nextWordSummary, generateSentence };
    const runner = new Function("api", `"use strict"; const { trainTinyNetwork, networkSummary, trainNextWordModel, nextWordSummary, generateSentence } = api; return (() => { ${input.value} })();`);
    const result = runner(api);
    output.className = "code-output is-success";
    renderCodeResult(output, result);
  } catch (error) {
    output.className = "code-output is-error";
    output.textContent = `${error.name}: ${error.message}`;
  }
}

function renderCodeResult(output, result) {
  const visual = createElement("div", "output-visual");
  const entries = Object.entries(result || {});
  const metrics = createElement("div", "output-metrics");
  entries.slice(0, 6).forEach(([label, value]) => {
    const item = createElement("div", "output-metric");
    item.append(createElement("strong", "", String(value)), createElement("span", "", label));
    metrics.append(item);
  });
  visual.append(metrics);
  const pre = createElement("pre", "output-raw-preview");
  pre.textContent = JSON.stringify(result, null, 2);
  visual.append(pre);
  output.replaceChildren(visual);
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
    slider.addEventListener("input", () => { state.hasExploredGradient = true; renderGradient(); });
  });
  dom.gradientStepButton.addEventListener("click", () => { state.hasExploredGradient = true; stepGradientDescent(); });
  dom.gradientAutoButton.addEventListener("click", () => { state.hasExploredGradient = true; toggleAutoGradient(); });
  dom.gradientResetButton.addEventListener("click", resetGradient);
  [dom.logitA, dom.logitB, dom.logitC, dom.temperatureSlider].forEach((slider) => {
    slider.addEventListener("input", renderSoftmax);
  });
  dom.correctClassSelect.addEventListener("change", renderSoftmax);
  [dom.forwardCtxA, dom.forwardCtxB].forEach((select) => {
    select.addEventListener("change", renderForwardPass);
  });
  dom.activationSelect.addEventListener("change", renderForwardPass);
  dom.datasetSelect.addEventListener("change", () => resetNetwork({ newData: true }));
  dom.hiddenUnitsSlider.addEventListener("input", () => resetNetwork());
  dom.networkRateSlider.addEventListener("input", renderNetworkControls);
  dom.epochBatchSlider.addEventListener("input", renderNetworkControls);
  dom.trainOneEpochButton.addEventListener("pointerdown", beginOneEpochTraining);
  dom.trainOneEpochButton.addEventListener("click", beginOneEpochTraining);
  dom.trainBatchButton.addEventListener("pointerdown", beginBatchTraining);
  dom.trainBatchButton.addEventListener("click", beginBatchTraining);
  dom.resetNetworkButton.addEventListener("click", () => resetNetwork());
  dom.newDataButton.addEventListener("click", () => resetNetwork({ newData: true }));
  [dom.nwContextSelectA, dom.nwContextSelectB].forEach((select) => {
    select.addEventListener("change", renderNwPrediction);
  });
  dom.nwEpochsSlider.addEventListener("input", renderNextWordLab);
  dom.nwTempSlider.addEventListener("input", renderNextWordLab);
  dom.nwTrainButton.addEventListener("pointerdown", beginNextWordTraining);
  dom.nwTrainButton.addEventListener("click", beginNextWordTraining);
  dom.nwTrainStepButton.addEventListener("pointerdown", beginNextWordStep);
  dom.nwTrainStepButton.addEventListener("click", beginNextWordStep);
  dom.nwResetButton.addEventListener("click", resetNextWord);
  dom.nwGenerateButton.addEventListener("click", handleGenerate);
  document.querySelectorAll(".chapter3-code-cell .run-button").forEach((button) => {
    button.addEventListener("click", () => runCodeCell(button.closest(".chapter3-code-cell")));
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
  resetNetwork();
  populateContextSelects();
  resetNextWord();
  setupSectionSpy();
}

init();
