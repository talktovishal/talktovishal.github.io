const teachingCorpora = [
  {
    id: "tiny-classroom",
    title: "Tiny classroom",
    source: "Original teaching corpus with repeated patterns.",
    recommendedContext: "the model",
    holdout: "The model sees the words. The next guess is better when the context is familiar.",
    text: [
      "We teach a tiny model with a tiny story.",
      "The model reads words.",
      "The model counts words.",
      "When the model sees a word, it asks what word came next before.",
      "A bigram model remembers one word.",
      "A trigram model remembers two words.",
      "Tiny models make tiny guesses, and every guess comes from counting."
    ].join(" ")
  },
  {
    id: "classroom-dialogue",
    title: "Classroom dialogue",
    source: "Original dialogue corpus for clear next-token patterns.",
    recommendedContext: "the student",
    holdout: "The student tests the model. The teacher explains the pattern.",
    text: [
      "The teacher writes a sentence on the board.",
      "The student reads the sentence.",
      "The student counts the tokens.",
      "The teacher asks the student to predict the next token.",
      "The student tests the model.",
      "The model predicts the next token.",
      "The teacher explains the pattern.",
      "The student changes the sentence and tests again.",
      "The model improves when the pattern is familiar.",
      "The model fails when the context is new."
    ].join(" ")
  },
  {
    id: "weather-assistant",
    title: "Weather assistant",
    source: "Original assistant-style corpus.",
    recommendedContext: "the forecast",
    holdout: "The forecast says rain tomorrow. The assistant recommends an umbrella.",
    text: [
      "The forecast says rain today.",
      "The forecast says rain tomorrow.",
      "The assistant recommends an umbrella.",
      "The assistant checks the forecast before answering.",
      "The morning forecast mentions clouds.",
      "The evening forecast mentions wind.",
      "When the forecast says rain, the assistant recommends an umbrella.",
      "When the forecast says sun, the assistant recommends sunglasses.",
      "The assistant gives a short answer.",
      "The user asks for the weather tomorrow."
    ].join(" ")
  }
];

const SEP = "\u0001";
const CUSTOM_CORPUS_ID = "custom";
const MAX_VISIBLE_TOKENS = 90;
const LARGE_CORPUS_THRESHOLD = 3000;
const DEFAULT_STUCK_CONTEXT = "softly said";
const externalCorpora = Array.isArray(window.LESSON_CORPORA) ? window.LESSON_CORPORA : [];
const corpora = [...externalCorpora, ...teachingCorpora];
const nNames = {
  1: "unigram",
  2: "bigram",
  3: "trigram"
};

const dom = {
  corpusSelect: document.getElementById("corpusSelect"),
  corpusDetails: document.getElementById("corpusDetails"),
  sourceDetails: document.getElementById("sourceDetails"),
  corpusInput: document.getElementById("corpusInput"),
  lowercaseToggle: document.getElementById("lowercaseToggle"),
  punctuationToggle: document.getElementById("punctuationToggle"),
  backoffToggle: document.getElementById("backoffToggle"),
  nChoices: Array.from(document.querySelectorAll("input[name=\"nChoice\"]")),
  nLabel: document.getElementById("nLabel"),
  alphaSlider: document.getElementById("alphaSlider"),
  alphaLabel: document.getElementById("alphaLabel"),
  strategySelect: document.getElementById("strategySelect"),
  tokenCount: document.getElementById("tokenCount"),
  vocabCount: document.getElementById("vocabCount"),
  windowCount: document.getElementById("windowCount"),
  contextInput: document.getElementById("contextInput"),
  generateButton: document.getElementById("generateButton"),
  resetButton: document.getElementById("resetButton"),
  activeSettings: document.getElementById("activeSettings"),
  predictionStatus: document.getElementById("predictionStatus"),
  predictionBars: document.getElementById("predictionBars"),
  formulaLine: document.getElementById("formulaLine"),
  generatedOutput: document.getElementById("generatedOutput"),
  tokenRail: document.getElementById("tokenRail"),
  tokenLegend: document.getElementById("tokenLegend"),
  memoryTokenRail: document.getElementById("memoryTokenRail"),
  memoryTokenLabel: document.getElementById("memoryTokenLabel"),
  vocabRail: document.getElementById("vocabRail"),
  vocabLabel: document.getElementById("vocabLabel"),
  windowLabel: document.getElementById("windowLabel"),
  windowCountLabel: document.getElementById("windowCountLabel"),
  windowInspector: document.getElementById("windowInspector"),
  ngramCards: document.getElementById("ngramCards"),
  ngramTitle: document.getElementById("ngramTitle"),
  countsMode: document.getElementById("countsMode"),
  prevWindowButton: document.getElementById("prevWindowButton"),
  playWindowButton: document.getElementById("playWindowButton"),
  nextWindowButton: document.getElementById("nextWindowButton"),
  contextSelect: document.getElementById("contextSelect"),
  tokenSelect: document.getElementById("tokenSelect"),
  chainSvg: document.getElementById("chainSvg"),
  graphMode: document.getElementById("graphMode"),
  probabilityMode: document.getElementById("probabilityMode"),
  probabilityTable: document.getElementById("probabilityTable"),
  selectedProbability: document.getElementById("selectedProbability"),
  rerunTopButton: document.getElementById("rerunTopButton"),
  rerunSampleButton: document.getElementById("rerunSampleButton"),
  rerunBothButton: document.getElementById("rerunBothButton"),
  topRunCount: document.getElementById("topRunCount"),
  sampleRunCount: document.getElementById("sampleRunCount"),
  topPickOutput: document.getElementById("topPickOutput"),
  sampleOutput: document.getElementById("sampleOutput"),
  backoffStatus: document.getElementById("backoffStatus"),
  backoffLadder: document.getElementById("backoffLadder"),
  smoothingStatus: document.getElementById("smoothingStatus"),
  smoothingPanel: document.getElementById("smoothingPanel"),
  stuckContextInput: document.getElementById("stuckContextInput"),
  stuckSummary: document.getElementById("stuckSummary"),
  tryStuckButton: document.getElementById("tryStuckButton"),
  holdoutInput: document.getElementById("holdoutInput"),
  holdoutPresetSelect: document.getElementById("holdoutPresetSelect"),
  evaluateButton: document.getElementById("evaluateButton"),
  evalSettings: document.getElementById("evalSettings"),
  evaluationPanel: document.getElementById("evaluationPanel"),
  perplexitySummary: document.getElementById("perplexitySummary"),
  surprisePanel: document.getElementById("surprisePanel")
};

const state = {
  activeCorpusId: corpora[0].id,
  customCorpusMeta: null,
  activeIndex: 0,
  isPlayingWindows: false,
  selectedToken: "",
  topRuns: 0,
  sampleRuns: 0,
  topComparison: null,
  sampleComparison: null,
  tokens: [],
  vocab: [],
  models: {},
  generatedTokens: [],
  generatedSeedCount: 0
};

let animationTimer = null;
let inputTimer = null;
let codeCellTimer = null;
let modelRefreshTimer = null;
let continuationTimer = null;

function currentN() {
  const selected = dom.nChoices.find((choice) => choice.checked);
  return Number(selected ? selected.value : 3);
}

function currentAlpha() {
  return Number(dom.alphaSlider.value);
}

function currentOptions() {
  return {
    lowercase: dom.lowercaseToggle.checked,
    keepPunctuation: dom.punctuationToggle.checked
  };
}

function currentStuckContext() {
  return dom.stuckContextInput.value.trim() || DEFAULT_STUCK_CONTEXT;
}

function currentSettings() {
  const n = currentN();
  return {
    n,
    modelName: nNames[n],
    alpha: currentAlpha(),
    backoff: dom.backoffToggle.checked,
    strategy: dom.strategySelect.value,
    lowercase: dom.lowercaseToggle.checked,
    keepPunctuation: dom.punctuationToggle.checked,
    selectedToken: state.selectedToken
  };
}

function tokenize(text, options = currentOptions()) {
  const source = options.lowercase ? String(text).toLowerCase() : String(text);
  const pattern = options.keepPunctuation
    ? /[a-z0-9]+(?:'[a-z0-9]+)?|[.!?,;:]/gi
    : /[a-z0-9]+(?:'[a-z0-9]+)?/gi;
  return source.match(pattern) || [];
}

function keyFor(tokens) {
  return tokens.join(SEP);
}

function labelForTokens(tokens) {
  return tokens.length ? tokens.join(" ") : "any context";
}

function clipLabel(value, max = 16) {
  const text = String(value);
  return text.length <= max ? text : `${text.slice(0, max - 1)}...`;
}

function buildModel(tokens, n) {
  const contexts = new Map();
  const ngrams = [];
  const ngramCounts = new Map();

  for (let index = 0; index <= tokens.length - n; index += 1) {
    // Slide an n-token window across the corpus.
    const ngramTokens = tokens.slice(index, index + n);
    // The final token is the answer; everything before it is the context.
    const contextTokens = n === 1 ? [] : ngramTokens.slice(0, -1);
    const next = ngramTokens[ngramTokens.length - 1];
    const contextKey = keyFor(contextTokens);
    const fullKey = keyFor(ngramTokens);

    if (!contexts.has(contextKey)) {
      contexts.set(contextKey, {
        key: contextKey,
        contextTokens,
        counts: new Map(),
        total: 0
      });
    }

    const context = contexts.get(contextKey);
    // Store how often each next token followed this exact context.
    context.total += 1;
    context.counts.set(next, (context.counts.get(next) || 0) + 1);

    if (!ngramCounts.has(fullKey)) {
      ngramCounts.set(fullKey, {
        fullKey,
        tokens: ngramTokens,
        contextTokens,
        next,
        count: 0
      });
    }

    ngramCounts.get(fullKey).count += 1;

    ngrams.push({
      index,
      key: contextKey,
      tokens: ngramTokens,
      contextTokens,
      next
    });
  }

  const topNgrams = Array.from(ngramCounts.values())
    .sort((a, b) => b.count - a.count || labelForTokens(a.tokens).localeCompare(labelForTokens(b.tokens)))
    .slice(0, 40);

  return { n, contexts, ngrams, topNgrams };
}

function syncControlLabels() {
  const n = currentN();
  const alpha = currentAlpha();
  dom.nLabel.textContent = nNames[n];
  dom.alphaLabel.value = alpha.toFixed(1);
  dom.alphaLabel.textContent = alpha.toFixed(1);
}

function invalidateGeneratedComparisons() {
  state.topComparison = null;
  state.sampleComparison = null;
}

function rebuildModel() {
  const n = currentN();

  state.tokens = tokenize(dom.corpusInput.value);
  state.vocab = Array.from(new Set(state.tokens)).sort((a, b) => a.localeCompare(b));
  state.models = {
    1: buildModel(state.tokens, 1),
    2: buildModel(state.tokens, 2),
    3: buildModel(state.tokens, 3)
  };
  state.activeIndex = clamp(state.activeIndex, 0, Math.max(0, state.models[n].ngrams.length - 1));

  syncControlLabels();

  renderAll();
  updateWindowPlayback();
}

function renderAll() {
  syncControlLabels();
  renderStats();
  renderTokens();
  renderMemoryTokenRail();
  renderWindowInspector();
  renderNgramCards();
  renderContextChoices();
  renderPredictions();
  renderGenerationComparison();
  renderBackoffAndSmoothing();
  renderEvaluation();
}

function renderStats() {
  const n = currentN();
  const windows = Math.max(0, state.tokens.length - n + 1);
  const corpus = getActiveCorpus();
  dom.tokenCount.textContent = formatNumber(state.tokens.length);
  dom.vocabCount.textContent = formatNumber(state.vocab.length);
  dom.windowCount.textContent = formatNumber(windows);
  dom.corpusDetails.textContent = `${corpus.title} | ${formatNumber(state.tokens.length)} tokens | ${formatNumber(state.vocab.length)} unique tokens. ${corpus.source || corpus.sourceName || ""}`;
  const memoryName = `${nNames[n][0].toUpperCase()}${nNames[n].slice(1)}`;
  const memoryDescription = {
    1: "looks only at which tokens are common overall",
    2: "uses one previous token as context",
    3: "uses two previous tokens as context"
  }[n];
  const choiceDescription = dom.strategySelect.value === "top"
    ? "always takes the strongest next-token bar"
    : "samples from the next-token bars, so frequent tokens are more likely";
  dom.activeSettings.textContent = `${memoryName} memory ${memoryDescription}. Next-token choice ${choiceDescription}.`;

  dom.sourceDetails.replaceChildren();
  const sourceParts = [
    corpus.author ? `Author: ${corpus.author}` : "",
    corpus.license || "",
    state.tokens.length > LARGE_CORPUS_THRESHOLD ? "Large corpus: token stream shows a moving preview." : ""
  ].filter(Boolean);
  dom.sourceDetails.append(document.createTextNode(sourceParts.join(" | ")));

  if (corpus.sourceUrl) {
    dom.sourceDetails.append(document.createTextNode(" "));
    const link = document.createElement("a");
    link.href = corpus.sourceUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Open source";
    dom.sourceDetails.append(link);
  }
}

function renderTokens() {
  const maxVisible = MAX_VISIBLE_TOKENS;
  const total = state.tokens.length;
  let start = 0;

  if (total > maxVisible) {
    start = 0;
  }

  const end = Math.min(total, start + maxVisible);
  dom.tokenRail.replaceChildren();
  dom.windowLabel.textContent = total > maxVisible
    ? `first ${maxVisible} tokens`
    : `${formatNumber(total)} tokens`;

  if (!total) {
    dom.tokenRail.append(emptyState("Add training text to create tokens."));
    dom.tokenLegend.textContent = "";
  } else {
    const previewTokens = state.tokens.slice(start, end);
    const previewCounts = new Map();
    previewTokens.forEach((token) => {
      previewCounts.set(token, (previewCounts.get(token) || 0) + 1);
    });
    const repeatedTokens = Array.from(previewCounts.entries())
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([token], index) => [token, (index % 8) + 1]);
    const colorByToken = new Map(repeatedTokens);
    let repeatedVisible = 0;
    for (let visibleIndex = start; visibleIndex < end; visibleIndex += 1) {
      const token = state.tokens[visibleIndex];
      const repeatColor = colorByToken.get(token) || 0;
      const repeated = repeatColor > 0;
      if (repeated) repeatedVisible += 1;
      dom.tokenRail.append(makeTokenChip(token, {
        repeated,
        repeatColor,
        muted: false
      }));
    }

    if (end < total) dom.tokenRail.append(makeTokenChip(`+${total - end} more`, { muted: true }));
    dom.tokenLegend.textContent = `Matching colors mean matching tokens in this preview. Vocabulary below keeps each unique token once. ${formatNumber(repeatedVisible)} repeated token instances appear here.`;
  }

  dom.vocabRail.replaceChildren();
  dom.vocabLabel.textContent = `${formatNumber(state.vocab.length)} unique`;
  state.vocab.slice(0, 48).forEach((token) => {
    const chip = document.createElement("span");
    chip.className = "vocab-chip";
    chip.textContent = token;
    dom.vocabRail.append(chip);
  });
  if (state.vocab.length > 48) {
    const chip = document.createElement("span");
    chip.className = "vocab-chip muted-chip";
    chip.textContent = `+${state.vocab.length - 48} more`;
    dom.vocabRail.append(chip);
  }
}

function makeTokenChip(text, options = {}) {
  const chip = document.createElement("span");
  chip.className = "token-chip";
  if (options.inWindow) chip.classList.add("in-window");
  if (options.nextToken) chip.classList.add("next-token");
  if (options.repeated) {
    chip.classList.add("repeated-token", `repeat-color-${options.repeatColor || 1}`);
  }
  if (options.muted) chip.classList.add("muted-chip");
  chip.textContent = text;
  return chip;
}

function renderMemoryTokenRail() {
  const n = currentN();
  const maxVisible = MAX_VISIBLE_TOKENS;
  const total = state.tokens.length;
  const contextBefore = 12;
  let start = 0;

  if (total > maxVisible) {
    start = Math.max(0, state.activeIndex - contextBefore);
  }

  const end = Math.min(total, start + maxVisible);
  dom.memoryTokenRail.replaceChildren();
  dom.memoryTokenLabel.textContent = total > maxVisible
    ? `${nNames[n]} preview near window ${state.activeIndex + 1}`
    : `${nNames[n]} window`;

  if (!total) {
    dom.memoryTokenRail.append(emptyState("Add training text to create tokens."));
    return;
  }

  if (start > 0) dom.memoryTokenRail.append(makeTokenChip("...", { muted: true }));

  for (let visibleIndex = start; visibleIndex < end; visibleIndex += 1) {
    const inWindow = visibleIndex >= state.activeIndex && visibleIndex < state.activeIndex + n;
    const nextToken = visibleIndex === state.activeIndex + n - 1;
    dom.memoryTokenRail.append(makeTokenChip(state.tokens[visibleIndex], {
      inWindow,
      nextToken
    }));
  }

  if (end < total) dom.memoryTokenRail.append(makeTokenChip(`+${total - end} more`, { muted: true }));

  if (total > maxVisible) {
    window.requestAnimationFrame(() => {
      dom.memoryTokenRail.scrollTop = 0;
      dom.memoryTokenRail.scrollLeft = 0;
    });
  }
}

function renderWindowInspector() {
  const n = currentN();
  const model = state.models[n];
  const active = model.ngrams[state.activeIndex];
  const total = model.ngrams.length;

  dom.windowCountLabel.textContent = total ? `window ${state.activeIndex + 1} of ${total}` : "window 0";
  dom.windowInspector.replaceChildren();

  if (!active) {
    dom.windowInspector.append(emptyState("There are not enough tokens for this model yet."));
    return;
  }

  const row = document.createElement("div");
  row.className = "window-row";

  if (n === 1) {
    row.append(makeWindowToken("any context", "context-token"));
  } else {
    active.contextTokens.forEach((token) => row.append(makeWindowToken(token, "context-token")));
  }

  const arrow = document.createElement("span");
  arrow.className = "window-arrow";
  arrow.textContent = "->";
  row.append(arrow);
  row.append(makeWindowToken(active.next, "next-token-label"));

  const note = document.createElement("p");
  note.className = "window-note";
  note.textContent = n === 1
    ? "The unigram model ignores history and counts the next token directly."
    : `Gold tokens are context. The warm token is what came next after "${labelForTokens(active.contextTokens)}".`;

  dom.windowInspector.append(row, note);
}

function makeWindowToken(text, className) {
  const token = document.createElement("span");
  token.className = className;
  token.textContent = text;
  return token;
}

function renderNgramCards() {
  const n = currentN();
  const model = state.models[n];
  const active = model.ngrams[state.activeIndex];
  const activeKey = active ? keyFor(active.tokens) : "";

  dom.countsMode.textContent = nNames[n];
  dom.ngramTitle.textContent = `3. Count repeated ${nNames[n]} windows`;
  dom.ngramCards.replaceChildren();

  if (!model.ngrams.length) {
    dom.ngramCards.append(emptyState("There are not enough tokens for this model yet."));
    return;
  }

  model.topNgrams.slice(0, 14).forEach((row) => {
    const card = document.createElement("div");
    card.className = "ngram-card";
    if (row.fullKey === activeKey) card.classList.add("active");

    const text = document.createElement("div");
    text.className = "ngram-text";

    if (n === 1) {
      text.append(makeWindowToken("any", "context-token"));
    } else {
      row.contextTokens.forEach((token) => text.append(makeWindowToken(token, "context-token")));
    }

    const arrow = document.createElement("span");
    arrow.className = "window-arrow";
    arrow.textContent = "->";
    text.append(arrow, makeWindowToken(row.next, "next-token-label"));

    const count = document.createElement("span");
    count.className = "count-badge";
    count.textContent = `x${row.count}`;

    card.append(text, count);
    dom.ngramCards.append(card);
  });
}

function contextTokensFromText(text, order, options = currentOptions()) {
  if (order === 1) return [];
  return tokenize(text, options).slice(-(order - 1));
}

function getRowsForOrder(order, contextTokens, alpha, model = state.models[order], vocab = state.vocab) {
  const key = keyFor(contextTokens);
  const context = model ? model.contexts.get(key) : null;
  const counts = context ? context.counts : new Map();
  const total = context ? context.total : 0;
  const candidates = alpha > 0 ? vocab : Array.from(counts.keys());

  if (!candidates.length || (total === 0 && alpha === 0)) {
    return {
      order,
      key,
      contextTokens,
      seen: Boolean(context),
      total,
      denominator: 0,
      rows: []
    };
  }

  const denominator = total + alpha * vocab.length;
  const rows = candidates
    .map((token) => {
      const count = counts.get(token) || 0;
      return {
        token,
        count,
        probability: denominator === 0 ? 0 : (count + alpha) / denominator
      };
    })
    .sort((a, b) => b.probability - a.probability || a.token.localeCompare(b.token));

  return {
    order,
    key,
    contextTokens,
    seen: Boolean(context),
    total,
    denominator,
    rows
  };
}

function getPrediction(order, contextText, alpha = currentAlpha(), backoff = dom.backoffToggle.checked, models = state.models, vocab = state.vocab) {
  const targetOrder = Number(order);
  const ladder = [];

  if (!vocab.length) {
    return {
      order: targetOrder,
      usedOrder: targetOrder,
      usedBackoff: false,
      ladder,
      seen: false,
      total: 0,
      denominator: 0,
      rows: [],
      contextTokens: contextTokensFromText(contextText, targetOrder)
    };
  }

  if (!backoff) {
    const contextTokens = contextTokensFromText(contextText, targetOrder);
    const result = getRowsForOrder(targetOrder, contextTokens, alpha, models[targetOrder], vocab);
    result.usedOrder = targetOrder;
    result.usedBackoff = false;
    result.ladder = [{
      order: targetOrder,
      context: labelForTokens(contextTokens),
      seen: result.seen,
      total: result.total,
      used: true
    }];
    return result;
  }

  let fallback = null;
  for (let candidateOrder = targetOrder; candidateOrder >= 1; candidateOrder -= 1) {
    const contextTokens = contextTokensFromText(contextText, candidateOrder);
    const exact = getRowsForOrder(candidateOrder, contextTokens, alpha, models[candidateOrder], vocab);
    const canUse = exact.seen && exact.total > 0;
    ladder.push({
      order: candidateOrder,
      context: labelForTokens(contextTokens),
      seen: exact.seen,
      total: exact.total,
      used: false
    });

    if (canUse) {
      exact.usedOrder = candidateOrder;
      exact.usedBackoff = candidateOrder !== targetOrder;
      exact.ladder = ladder.map((item) => ({
        ...item,
        used: item.order === candidateOrder
      }));
      return exact;
    }

    if (!fallback || exact.rows.length > fallback.rows.length) fallback = exact;
  }

  const result = fallback || getRowsForOrder(1, [], alpha, models[1], vocab);
  result.usedOrder = result.order || 1;
  result.usedBackoff = result.usedOrder !== targetOrder;
  result.ladder = ladder.map((item, index) => ({
    ...item,
    used: index === ladder.length - 1
  }));
  return result;
}

function renderContextChoices() {
  const n = currentN();
  const model = state.models[n];
  const currentLabel = labelForTokens(contextTokensFromText(dom.contextInput.value, n));
  const choices = [];

  if (n === 1) {
    choices.push({ label: "any context", value: "" });
  } else if (model) {
    Array.from(model.contexts.values())
      .filter((context) => context.contextTokens.length === n - 1)
      .sort((a, b) => b.total - a.total || labelForTokens(a.contextTokens).localeCompare(labelForTokens(b.contextTokens)))
      .slice(0, 80)
      .forEach((context) => {
        const label = labelForTokens(context.contextTokens);
        choices.push({ label: `${label} (${context.total})`, value: label });
      });
  }

  if (n > 1 && currentLabel !== "any context" && !choices.some((choice) => choice.value === currentLabel)) {
    choices.unshift({ label: `${currentLabel} (current)`, value: currentLabel });
  }

  dom.contextSelect.replaceChildren();
  choices.forEach((choice) => {
    const option = document.createElement("option");
    option.value = choice.value;
    option.textContent = choice.label;
    dom.contextSelect.append(option);
  });
  dom.contextSelect.value = n === 1 ? "" : currentLabel;
}

function updateTokenChoices(prediction) {
  const previous = state.selectedToken;
  dom.tokenSelect.replaceChildren();

  if (!prediction.rows.length) {
    state.selectedToken = "";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No token available";
    dom.tokenSelect.append(option);
    return;
  }

  prediction.rows.slice(0, 40).forEach((row) => {
    const option = document.createElement("option");
    option.value = row.token;
    option.textContent = `${row.token} (${percent(row.probability)})`;
    dom.tokenSelect.append(option);
  });

  state.selectedToken = prediction.rows.some((row) => row.token === previous)
    ? previous
    : prediction.rows[0].token;
  dom.tokenSelect.value = state.selectedToken;
}

function renderPredictions() {
  const n = currentN();
  const alpha = currentAlpha();
  const prediction = getPrediction(n, dom.contextInput.value, alpha, dom.backoffToggle.checked);
  const rows = prediction.rows.slice(0, 8);
  const contextLabel = labelForTokens(prediction.contextTokens);
  const status = prediction.rows.length
    ? prediction.usedBackoff
      ? `backed off to ${nNames[prediction.usedOrder]}`
      : prediction.seen
        ? "exact context"
        : "smoothed guess"
    : "unseen context";

  dom.predictionStatus.textContent = status;
  dom.probabilityMode.textContent = prediction.rows.length ? `${nNames[prediction.usedOrder]} rows` : "no rows";
  dom.graphMode.textContent = contextLabel;
  dom.predictionBars.replaceChildren();
  updateTokenChoices(prediction);

  if (!rows.length) {
    dom.predictionBars.append(emptyState("No count for this context. Try lower memory, add smoothing, or enable backoff."));
    dom.formulaLine.textContent = `The model has not seen "${contextLabel}" in this corpus.`;
    renderChainSvg(prediction, contextLabel);
    renderProbabilityTable(prediction);
    renderSelectedProbability(prediction);
    return;
  }

  const maxProbability = rows[0].probability || 1;

  rows.forEach((row) => {
    const line = document.createElement("div");
    line.className = "bar-row";

    const token = document.createElement("span");
    token.className = "bar-token";
    token.textContent = row.token;

    const track = document.createElement("span");
    track.className = "bar-track";
    const fill = document.createElement("span");
    fill.className = "bar-fill";
    fill.style.width = `${Math.max(4, (row.probability / maxProbability) * 100)}%`;
    track.append(fill);

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = percent(row.probability);

    line.append(token, track, value);
    dom.predictionBars.append(line);
  });

  const top = rows[0];
  dom.formulaLine.textContent = `For "${contextLabel}", P("${top.token}") = (${top.count} + ${alpha.toFixed(1)}) / (${prediction.total} + ${alpha.toFixed(1)} * ${state.vocab.length}) = ${percent(top.probability)}.`;
  renderChainSvg(prediction, contextLabel);
  renderProbabilityTable(prediction);
  renderSelectedProbability(prediction);
}

function renderProbabilityTable(prediction) {
  dom.probabilityTable.replaceChildren();

  if (!prediction.rows.length) {
    dom.probabilityTable.append(emptyState("No probabilities to display yet."));
    return;
  }

  const table = document.createElement("div");
  table.className = "probability-grid";

  ["Token", "Count", "Probability"].forEach((label) => {
    const head = document.createElement("strong");
    head.textContent = label;
    table.append(head);
  });

  prediction.rows.slice(0, 10).forEach((row) => {
    const token = document.createElement("span");
    token.className = "prob-token";
    if (row.token === state.selectedToken) token.classList.add("selected");
    token.textContent = row.token;

    const count = document.createElement("span");
    if (row.token === state.selectedToken) count.classList.add("selected");
    count.textContent = String(row.count);

    const probability = document.createElement("span");
    if (row.token === state.selectedToken) probability.classList.add("selected");
    probability.textContent = percent(row.probability);

    table.append(token, count, probability);
  });

  dom.probabilityTable.append(table);
}

function renderSelectedProbability(prediction) {
  if (!prediction.rows.length || !state.selectedToken) {
    dom.selectedProbability.textContent = "Choose a context with observed continuations to inspect one token.";
    return;
  }

  const row = prediction.rows.find((item) => item.token === state.selectedToken);
  if (!row) {
    dom.selectedProbability.textContent = `"${state.selectedToken}" has zero probability in the displayed rows.`;
    return;
  }

  dom.selectedProbability.textContent = `"${state.selectedToken}" appeared ${row.count} time${row.count === 1 ? "" : "s"} after this context, so its probability is ${percent(row.probability)}.`;
}

function renderChainSvg(prediction, contextLabel) {
  const svg = dom.chainSvg;
  svg.replaceChildren();
  const ns = "http://www.w3.org/2000/svg";
  const rows = prediction.rows.slice(0, 5);
  const bounds = {
    width: 640,
    height: 320,
    padding: 34
  };

  const defs = svgEl(ns, "defs");
  const marker = svgEl(ns, "marker", {
    id: "arrowHead",
    viewBox: "0 0 10 10",
    refX: "8",
    refY: "5",
    markerWidth: "6",
    markerHeight: "6",
    orient: "auto-start-reverse"
  });
  marker.append(svgEl(ns, "path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#087c7c" }));
  defs.append(marker);
  svg.append(defs);

  if (!rows.length) {
    const text = svgEl(ns, "text", { x: String(bounds.width / 2), y: String(bounds.height / 2), class: "chain-label" });
    text.textContent = "No probability map yet";
    svg.append(text);
    return;
  }

  const rowHeight = 38;
  const rowWidth = 224;
  const rowX = bounds.width - bounds.padding - rowWidth;
  const rowTop = bounds.padding;
  const rowBottom = bounds.height - bounds.padding - rowHeight;
  const rowStep = rows.length > 1 ? (rowBottom - rowTop) / (rows.length - 1) : 0;
  const context = {
    x: bounds.padding,
    y: bounds.height / 2 - 34,
    width: 178,
    height: 68
  };
  const contextAnchorX = context.x + context.width;
  const contextAnchorY = context.y + context.height / 2;

  rows.forEach((row, index) => {
    const y = rowTop + rowStep * index;
    const rowAnchorY = y + rowHeight / 2;
    const midX = contextAnchorX + (rowX - contextAnchorX) * 0.48;
    const width = Math.max(2, 2 + row.probability * 14);
    const edge = svgEl(ns, "path", {
      d: `M ${contextAnchorX} ${contextAnchorY} C ${midX} ${contextAnchorY}, ${midX} ${rowAnchorY}, ${rowX - 18} ${rowAnchorY}`,
      class: "chain-edge",
      "stroke-width": String(width),
      fill: "none",
      "marker-end": "url(#arrowHead)"
    });
    edge.style.opacity = String(Math.max(0.32, 0.45 + row.probability));
    svg.append(edge);
  });

  svg.append(makeSvgBox(ns, context.x, context.y, context.width, context.height, "context", clipLabel(contextLabel, 20), "context"));

  rows.forEach((row, index) => {
    const y = rowTop + rowStep * index;
    const group = makeSvgBox(ns, rowX, y, rowWidth, rowHeight, row.token === state.selectedToken ? "next selected" : "next", clipLabel(row.token, 18), `${row.count} · ${percent(row.probability)}`);
    svg.append(group);
  });
}

function makeSvgBox(ns, x, y, width, height, nodeClass, label, sublabel) {
  const group = svgEl(ns, "g");
  const clipId = `boxClip-${Math.random().toString(36).slice(2)}`;
  const defs = svgEl(ns, "defs");
  const clipPath = svgEl(ns, "clipPath", { id: clipId });
  clipPath.append(svgEl(ns, "rect", {
    x: String(x + 10),
    y: String(y + 4),
    width: String(Math.max(0, width - 20)),
    height: String(Math.max(0, height - 8))
  }));
  defs.append(clipPath);
  group.append(defs);
  group.append(svgEl(ns, "rect", {
    x: String(x),
    y: String(y),
    width: String(width),
    height: String(height),
    rx: "10",
    class: `chain-box ${nodeClass}`
  }));

  const text = svgEl(ns, "text", {
    x: String(x + 14),
    y: String(y + height / 2 - 6),
    class: "chain-label box-label",
    "clip-path": `url(#${clipId})`
  });
  text.textContent = label;

  const small = svgEl(ns, "text", {
    x: String(x + 14),
    y: String(y + height / 2 + 14),
    class: "chain-small box-small",
    "clip-path": `url(#${clipId})`
  });
  small.textContent = sublabel;

  group.append(text, small);
  return group;
}

function makeSvgNode(ns, x, y, radius, nodeClass, label, sublabel) {
  const group = svgEl(ns, "g");
  group.append(svgEl(ns, "circle", {
    cx: String(x),
    cy: String(y),
    r: String(radius),
    class: `chain-node ${nodeClass}`
  }));

  const text = svgEl(ns, "text", {
    x: String(x),
    y: String(y - 8),
    class: "chain-label"
  });
  text.textContent = label;

  const small = svgEl(ns, "text", {
    x: String(x),
    y: String(y + 18),
    class: "chain-small"
  });
  small.textContent = sublabel;

  group.append(text, small);
  return group;
}

function svgEl(ns, name, attrs = {}) {
  const element = document.createElementNS(ns, name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function generateContinuation() {
  const result = generateTokensWithModels(state.models, state.vocab, currentN(), dom.contextInput.value, {
    alpha: currentAlpha(),
    backoff: dom.backoffToggle.checked,
    strategy: dom.strategySelect.value,
    steps: 18,
    options: currentOptions()
  });
  state.generatedTokens = result.tokens;
  state.generatedSeedCount = result.seedCount;
  renderGenerated(dom.generatedOutput, state.generatedTokens, state.generatedSeedCount);
  renderGenerationComparison();
}

function scheduleContinuationRefresh() {
  window.clearTimeout(continuationTimer);
  continuationTimer = window.setTimeout(() => {
    generateContinuation();
  }, 120);
}

function generateTokens(corpus, n, seedText, config = {}) {
  const options = config.options || currentOptions();
  const tokens = tokenize(corpus, options);
  const vocab = Array.from(new Set(tokens)).sort((a, b) => a.localeCompare(b));
  const models = {
    1: buildModel(tokens, 1),
    2: buildModel(tokens, 2),
    3: buildModel(tokens, 3)
  };
  return generateTokensWithModels(models, vocab, n, seedText, config);
}

function generateTokensWithModels(models, vocab, n, seedText, config = {}) {
  const options = config.options || currentOptions();
  const sequence = tokenize(seedText, options).slice();
  const seedCount = sequence.length;
  const alpha = Number(config.alpha ?? 0);
  const backoff = config.backoff !== false;
  const strategy = config.strategy || "sample";
  const steps = Number(config.steps ?? 18);

  if (!vocab.length) return { tokens: [], seedCount: 0 };

  if (!sequence.length) {
    const firstRows = getRowsForOrder(1, [], alpha, models[1], vocab).rows;
    const first = chooseToken(firstRows, strategy);
    if (first) sequence.push(first);
  }

  for (let step = 0; step < steps; step += 1) {
    const contextText = sequence.join(" ");
    const prediction = getPrediction(n, contextText, alpha, backoff, models, vocab);
    const next = chooseToken(prediction.rows, strategy);
    if (!next) break;
    sequence.push(next);
    if ([".", "?", "!"].includes(next) && sequence.length - seedCount > 8) break;
  }

  return { tokens: sequence, seedCount };
}

function chooseToken(rows, strategy) {
  if (!rows.length) return null;
  if (strategy === "top") return rows[0].token;

  const total = rows.reduce((sum, row) => sum + row.probability, 0);
  if (total <= 0) return rows[Math.floor(Math.random() * rows.length)].token;

  let ticket = Math.random() * total;
  for (const row of rows) {
    ticket -= row.probability;
    if (ticket <= 0) return row.token;
  }
  return rows[rows.length - 1].token;
}

function renderGenerated(container, tokens, seedCount) {
  container.replaceChildren();

  if (!tokens.length) {
    container.append(emptyState("No generated tokens yet."));
    return;
  }

  tokens.forEach((token, index) => {
    const chip = document.createElement("span");
    chip.className = index < seedCount ? "seed-token" : "new-token";
    chip.textContent = token;
    container.append(chip);
  });
}

function renderGenerationComparison(options = {}) {
  const shouldTop = options.top !== false;
  const shouldSample = options.sample !== false;

  if (shouldTop || !state.topComparison) {
    state.topComparison = generateTokensWithModels(state.models, state.vocab, currentN(), dom.contextInput.value, {
      alpha: currentAlpha(),
      backoff: dom.backoffToggle.checked,
      strategy: "top",
      steps: 18,
      options: currentOptions()
    });
    if (options.count) state.topRuns += 1;
  }

  if (shouldSample || !state.sampleComparison) {
    state.sampleComparison = generateTokensWithModels(state.models, state.vocab, currentN(), dom.contextInput.value, {
      alpha: currentAlpha(),
      backoff: dom.backoffToggle.checked,
      strategy: "sample",
      steps: 18,
      options: currentOptions()
    });
    if (options.count) state.sampleRuns += 1;
  }

  dom.topRunCount.textContent = `${state.topRuns} run${state.topRuns === 1 ? "" : "s"}`;
  dom.sampleRunCount.textContent = `${state.sampleRuns} run${state.sampleRuns === 1 ? "" : "s"}`;
  renderGenerated(dom.topPickOutput, state.topComparison.tokens, state.topComparison.seedCount);
  renderGenerated(dom.sampleOutput, state.sampleComparison.tokens, state.sampleComparison.seedCount);
}

function renderBackoffAndSmoothing() {
  const n = currentN();
  const alpha = currentAlpha();
  const contextText = currentStuckContext();
  const exactPrediction = getPrediction(n, contextText, alpha, false);
  const activePrediction = getPrediction(n, contextText, alpha, dom.backoffToggle.checked);
  const backoffPrediction = getPrediction(n, contextText, alpha, true);
  const ladderPrediction = getPrediction(n, contextText, 0, true);
  const ladder = ladderPrediction.ladder.length ? ladderPrediction.ladder : exactPrediction.ladder;
  const fallbackItem = ladder.find((item) => item.used && item.seen && item.order !== n)
    || ladder.find((item) => item.seen && item.order < n);
  const exactContext = labelForTokens(contextTokensFromText(contextText, n));

  dom.backoffStatus.textContent = dom.backoffToggle.checked
    ? activePrediction.usedBackoff
      ? `using ${nNames[activePrediction.usedOrder]}`
      : "exact context"
    : "off";
  dom.smoothingStatus.textContent = `alpha ${alpha.toFixed(1)}`;
  dom.backoffLadder.replaceChildren();
  dom.smoothingPanel.replaceChildren();

  if (dom.stuckSummary) {
    let summary = "";
    if (exactPrediction.seen) {
      summary = `The exact ${nNames[n]} context "${exactContext}" appears ${formatNumber(exactPrediction.total)} time${exactPrediction.total === 1 ? "" : "s"}, so backoff is not needed for this example.`;
    } else if (dom.backoffToggle.checked && activePrediction.usedBackoff && fallbackItem) {
      summary = `The exact ${nNames[n]} context "${exactContext}" is missing, so backoff uses the ${nNames[fallbackItem.order]} context "${fallbackItem.context}" with ${formatNumber(fallbackItem.total)} matching window${fallbackItem.total === 1 ? "" : "s"}.`;
    } else if (!dom.backoffToggle.checked && fallbackItem) {
      summary = `The exact ${nNames[n]} context "${exactContext}" is missing. With backoff off, the model stops there; the ladder shows that "${fallbackItem.context}" has ${formatNumber(fallbackItem.total)} shorter-context match${fallbackItem.total === 1 ? "" : "es"}.`;
    } else {
      summary = `The exact ${nNames[n]} context "${exactContext}" is missing, and no shorter context has matching evidence in this corpus.`;
    }

    if (alpha > 0) {
      summary += ` Alpha ${alpha.toFixed(1)} adds a pseudocount to each of the ${formatNumber(state.vocab.length)} known vocabulary tokens.`;
    }
    dom.stuckSummary.textContent = summary;
  }

  ladder.forEach((item) => {
    const row = document.createElement("div");
    row.className = "ladder-row";
    const isUsed = dom.backoffToggle.checked ? item.used : item.order === n;
    const isAvailableFallback = !dom.backoffToggle.checked && item.used && item.seen && item.order !== n;
    if (isUsed) row.classList.add("used");
    if (isAvailableFallback) row.classList.add("candidate");

    const name = document.createElement("strong");
    name.textContent = nNames[item.order];

    const context = document.createElement("span");
    context.textContent = item.context;

    const result = document.createElement("em");
    let resultText = item.seen ? `${formatNumber(item.total)} matching window${item.total === 1 ? "" : "s"}` : "not seen";
    if (dom.backoffToggle.checked && item.used && item.seen) resultText += " - used";
    if (!dom.backoffToggle.checked && item.order === n && !item.seen) resultText += " - stopped here";
    if (isAvailableFallback) resultText += " - available with backoff";
    result.textContent = resultText;

    row.append(name, context, result);
    dom.backoffLadder.append(row);
  });

  if (!ladder.length) {
    dom.backoffLadder.append(emptyState("No backoff path available yet."));
  }

  const comparisonAlpha = alpha > 0 ? alpha : 0.1;
  const noSmoothing = getPrediction(n, contextText, 0, dom.backoffToggle.checked);
  const withSmoothing = getPrediction(n, contextText, comparisonAlpha, dom.backoffToggle.checked);
  const panel = document.createElement("div");
  panel.className = "smoothing-compare";
  panel.append(makeSmoothingColumn("No smoothing", noSmoothing, 0));
  panel.append(makeSmoothingColumn(`Alpha ${comparisonAlpha.toFixed(1)}`, withSmoothing, comparisonAlpha));
  dom.smoothingPanel.append(panel);
}

function makeSmoothingColumn(title, prediction, alpha) {
  const column = document.createElement("div");
  column.className = "smoothing-column";

  const heading = document.createElement("h4");
  heading.textContent = title;
  column.append(heading);

  const rows = prediction.rows.slice(0, 5);
  const note = document.createElement("p");
  note.className = "column-note";

  if (!rows.length) {
    note.textContent = "No matching evidence means every next token has probability 0.";
    column.append(note);
    column.append(emptyState("Zero probability."));
    return column;
  }

  if (prediction.total === 0) {
    note.textContent = `Flat distribution: ${formatNumber(state.vocab.length)} known tokens share the probability mass equally.`;
  } else {
    note.textContent = `Denominator: ${formatNumber(prediction.total)} + ${alpha.toFixed(1)} * ${formatNumber(state.vocab.length)} = ${formatNumber(Number(prediction.denominator.toFixed(1)))}.`;
  }
  column.append(note);

  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "mini-row";
    const token = document.createElement("span");
    token.textContent = row.token;
    const value = document.createElement("strong");
    value.textContent = percent(row.probability);
    item.append(token, value);
    column.append(item);
  });

  return column;
}

function evaluateModels(corpus, holdout, config = {}) {
  const options = config.options || currentOptions();
  const trainTokens = tokenize(corpus, options);
  const testTokens = tokenize(holdout, options);
  const vocab = Array.from(new Set(trainTokens)).sort((a, b) => a.localeCompare(b));
  const models = {
    1: buildModel(trainTokens, 1),
    2: buildModel(trainTokens, 2),
    3: buildModel(trainTokens, 3)
  };
  return evaluateTokenizedModels(models, vocab, testTokens, config);
}

function evaluateTokenizedModels(models, vocab, testTokens, config = {}) {
  const alpha = Number(config.alpha ?? 0);
  const backoff = config.backoff !== false;
  const vocabSet = new Set(vocab);

  return [1, 2, 3].map((order) => {
    let nll = 0;
    let observed = 0;
    let impossible = 0;
    let unknown = 0;
    const start = Math.max(0, order - 1);

    for (let index = start; index < testTokens.length; index += 1) {
      const contextTokens = order === 1 ? [] : testTokens.slice(Math.max(0, index - order + 1), index);
      const actual = testTokens[index];
      observed += 1;

      if (!vocabSet.has(actual)) {
        unknown += 1;
        impossible += 1;
        continue;
      }

      const prediction = getPrediction(order, contextTokens.join(" "), alpha, backoff, models, vocab);
      const match = prediction.rows.find((row) => row.token === actual);

      if (!match || match.probability <= 0) {
        impossible += 1;
      } else {
        nll += -Math.log(match.probability);
      }
    }

    const perplexity = observed && impossible === 0 ? Math.exp(nll / observed) : Infinity;
    return {
      model: nNames[order],
      order,
      tokensScored: observed,
      impossible,
      unknown,
      perplexity: Number.isFinite(perplexity) ? Number(perplexity.toFixed(2)) : "infinity"
    };
  });
}

function renderEvaluation() {
  const results = evaluateTokenizedModels(state.models, state.vocab, tokenize(dom.holdoutInput.value), {
    alpha: currentAlpha(),
    backoff: dom.backoffToggle.checked
  });
  const finite = results.filter((row) => typeof row.perplexity === "number");
  const best = finite.length ? finite.reduce((a, b) => (a.perplexity <= b.perplexity ? a : b)) : null;
  const maxFinite = finite.length ? Math.max(...finite.map((row) => row.perplexity)) : 1;
  const selectedResult = results.find((row) => row.order === currentN()) || results[results.length - 1];

  dom.evalSettings.textContent = `alpha ${currentAlpha().toFixed(1)} | backoff ${dom.backoffToggle.checked ? "on" : "off"}`;
  dom.evaluationPanel.replaceChildren();

  results.forEach((row) => {
    const item = document.createElement("div");
    item.className = "eval-row";
    if (best && row.model === best.model) item.classList.add("best");

    const label = document.createElement("strong");
    label.textContent = row.model;

    const track = document.createElement("span");
    track.className = "eval-track";
    const fill = document.createElement("span");
    fill.className = "eval-fill";
    if (typeof row.perplexity === "number") {
      fill.style.width = `${Math.max(7, (row.perplexity / maxFinite) * 100)}%`;
    } else {
      fill.style.width = "100%";
      fill.classList.add("infinite");
    }
    track.append(fill);

    const value = document.createElement("span");
    value.className = "eval-value";
    value.textContent = row.perplexity === "infinity" ? "infinity" : String(row.perplexity);

    const meta = document.createElement("em");
    const unknownNote = row.unknown ? `, ${row.unknown} outside vocabulary` : "";
    meta.textContent = `${row.tokensScored} scored, ${row.impossible} impossible${unknownNote}`;

    item.append(label, track, value, meta);
    dom.evaluationPanel.append(item);
  });

  if (dom.perplexitySummary && selectedResult) {
    if (selectedResult.perplexity === "infinity" && selectedResult.unknown > 0) {
      dom.perplexitySummary.textContent = `${nNames[selectedResult.order]} is infinite because ${selectedResult.unknown} scored token${selectedResult.unknown === 1 ? "" : "s"} never appeared in the training vocabulary. Smoothing only gives probability to known vocabulary tokens.`;
    } else if (selectedResult.perplexity === "infinity" && selectedResult.impossible > 0) {
      dom.perplexitySummary.textContent = `${nNames[selectedResult.order]} is infinite because ${selectedResult.impossible} scored token${selectedResult.impossible === 1 ? "" : "s"} received probability 0. Backoff can help with unseen contexts; smoothing can help with known tokens that have zero count.`;
    } else if (selectedResult.perplexity !== "infinity") {
      dom.perplexitySummary.textContent = `${nNames[selectedResult.order]} has finite perplexity ${selectedResult.perplexity}, meaning every scored holdout token received some non-zero probability. Lower values mean less average surprise.`;
    } else {
      dom.perplexitySummary.textContent = "";
    }
  }

  renderSurpriseTrace();
}

function renderSurpriseTrace() {
  const n = currentN();
  const holdoutTokens = tokenize(dom.holdoutInput.value);
  const vocabSet = new Set(state.vocab);
  const rows = [];
  const start = Math.max(0, n - 1);

  for (let index = start; index < holdoutTokens.length && rows.length < 8; index += 1) {
    const contextTokens = n === 1 ? [] : holdoutTokens.slice(Math.max(0, index - n + 1), index);
    const actual = holdoutTokens[index];
    const prediction = getPrediction(n, contextTokens.join(" "), currentAlpha(), dom.backoffToggle.checked);
    const match = prediction.rows.find((row) => row.token === actual);
    rows.push({
      context: labelForTokens(contextTokens),
      actual,
      unknown: !vocabSet.has(actual),
      probability: match ? match.probability : 0,
      usedOrder: prediction.usedOrder
    });
  }

  dom.surprisePanel.replaceChildren();
  const heading = document.createElement("h4");
  heading.textContent = `Surprise trace for ${nNames[n]}`;
  dom.surprisePanel.append(heading);

  if (!rows.length) {
    dom.surprisePanel.append(emptyState("Add holdout text to inspect token surprise."));
    return;
  }

  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "surprise-row";
    const label = document.createElement("span");
    label.textContent = `${row.context} -> ${row.actual}`;
    const value = document.createElement("strong");
    value.textContent = row.unknown ? "outside vocab" : row.probability ? percent(row.probability) : "zero";
    if (row.unknown || row.probability === 0) value.classList.add("zero");
    const model = document.createElement("em");
    model.textContent = nNames[row.usedOrder];
    item.append(label, value, model);
    dom.surprisePanel.append(item);
  });
}

function countNgramsForApi(input, n = 2) {
  const tokens = Array.isArray(input) ? input : tokenize(String(input));
  const model = buildModel(tokens, Number(n));
  const rows = new Map();

  model.ngrams.forEach((item) => {
    const fullKey = keyFor(item.tokens);
    if (!rows.has(fullKey)) {
      rows.set(fullKey, {
        ngram: labelForTokens(item.tokens),
        context: labelForTokens(item.contextTokens),
        next: item.next,
        count: 0
      });
    }
    rows.get(fullKey).count += 1;
  });

  return Array.from(rows.values())
    .sort((a, b) => b.count - a.count || a.ngram.localeCompare(b.ngram));
}

function predictNextForApi(corpus, n = 3, context = "", limit = 6, config = {}) {
  const options = config.options || currentOptions();
  const tokens = tokenize(String(corpus), options);
  const vocab = Array.from(new Set(tokens)).sort((a, b) => a.localeCompare(b));
  const models = {
    1: buildModel(tokens, 1),
    2: buildModel(tokens, 2),
    3: buildModel(tokens, 3)
  };
  const prediction = getPrediction(Number(n), String(context), Number(config.alpha ?? currentAlpha()), config.backoff ?? dom.backoffToggle.checked, models, vocab);
  const rows = prediction.rows.slice(0, Number(limit)).map((row) => ({
    token: row.token,
    count: row.count,
    probability: Number(row.probability.toFixed(4))
  }));

  if (!config.explain) return rows;

  return {
    requestedModel: nNames[Number(n)],
    usedModel: nNames[prediction.usedOrder],
    usedBackoff: prediction.usedBackoff,
    context: labelForTokens(prediction.contextTokens),
    ladder: prediction.ladder,
    predictions: rows
  };
}

function generateTextForApi(corpus, n = 3, seed = "", config = {}) {
  const result = generateTokens(String(corpus), Number(n), String(seed), {
    ...config,
    options: config.options || currentOptions()
  });
  return result.tokens.join(" ");
}

function explainProbabilityForApi(corpus, n = 3, context = "", token = null, config = {}) {
  const options = config.options || currentOptions();
  const tokens = tokenize(String(corpus), options);
  const vocab = Array.from(new Set(tokens)).sort((a, b) => a.localeCompare(b));
  const models = {
    1: buildModel(tokens, 1),
    2: buildModel(tokens, 2),
    3: buildModel(tokens, 3)
  };
  const alpha = Number(config.alpha ?? currentAlpha());
  const prediction = getPrediction(Number(n), String(context), alpha, config.backoff ?? dom.backoffToggle.checked, models, vocab);
  const target = token ? String(token) : prediction.rows[0]?.token;
  const row = prediction.rows.find((item) => item.token === target);

  if (!row) {
    return {
      context: labelForTokens(prediction.contextTokens),
      token: target,
      probability: 0,
      note: "This token has zero probability under the current settings."
    };
  }

  return {
    model: nNames[prediction.usedOrder],
    context: labelForTokens(prediction.contextTokens),
    token: row.token,
    count: row.count,
    contextTotal: prediction.total,
    vocabulary: vocab.length,
    alpha,
    formula: `(${row.count} + ${alpha.toFixed(1)}) / (${prediction.total} + ${alpha.toFixed(1)} * ${vocab.length})`,
    probability: Number(row.probability.toFixed(4))
  };
}

function makeApi(print) {
  return {
    sampleText: dom.corpusInput.value,
    currentContext: dom.contextInput.value,
    stuckContext: currentStuckContext(),
    selectedToken: state.selectedToken,
    holdoutText: dom.holdoutInput.value,
    settings: currentSettings(),
    simpleTokenize: (text, options = {}) => tokenize(String(text), { ...currentOptions(), ...options }),
    tokenize: (text, options = {}) => tokenize(String(text), { ...currentOptions(), ...options }),
    countNgrams: countNgramsForApi,
    predictNext: predictNextForApi,
    generateText: generateTextForApi,
    evaluateModels,
    explainProbability: explainProbabilityForApi,
    print
  };
}

async function runCodeCell(cell) {
  const input = cell.querySelector(".code-input");
  const output = cell.querySelector(".code-output");
  const logs = [];
  const print = (...values) => {
    logs.push(values.map(formatValue).join(" "));
  };
  const started = window.performance ? window.performance.now() : Date.now();

  setCodeOutputState(output, "running", "Running code...", "The result will appear here.");

  try {
    const api = makeApi(print);
    const runner = new Function(
      "api",
      `"use strict";
const {
  sampleText,
  currentContext,
  stuckContext,
  selectedToken,
  holdoutText,
  settings,
  simpleTokenize,
  tokenize,
  countNgrams,
  predictNext,
  generateText,
  evaluateModels,
  explainProbability,
  print
} = api;
return (async () => {
${input.value}
})();`
    );
    const result = await runner(api);
    const ended = window.performance ? window.performance.now() : Date.now();
    renderCodeOutput(cell, output, result, logs, Math.max(0, ended - started));
  } catch (error) {
    renderCodeError(output, error);
  }
}

function runAllCells() {
  document.querySelectorAll(".code-cell").forEach((cell) => {
    runCodeCell(cell);
  });
}

function prepareCodeCells() {
  document.querySelectorAll(".code-output").forEach((output) => {
    setCodeOutputState(output, "empty", "Ready to run", "Press Run to execute this cell.");
  });
}

function markCodeCellsStale() {
  document.querySelectorAll(".code-output").forEach((output) => {
    if (!output.classList.contains("is-empty")) {
      setCodeOutputState(output, "stale", "Settings changed", "Press Run again to refresh this result.");
    }
  });
}

function setCodeOutputState(output, state, title, message) {
  resetOutputState(output);
  output.classList.add(`is-${state}`);
  const note = document.createElement("div");
  note.className = "output-message";
  const strong = document.createElement("strong");
  strong.textContent = title;
  const span = document.createElement("span");
  span.textContent = message;
  note.append(strong, span);
  output.replaceChildren(note);
}

function resetOutputState(output) {
  output.classList.remove("is-empty", "is-running", "is-success", "is-error", "is-stale");
  output.replaceChildren();
}

function renderCodeOutput(cell, output, result, logs, duration) {
  const rawText = makeRawOutputText(result, logs);
  resetOutputState(output);
  output.classList.add("is-success");
  output.append(makeOutputStatus("Ran successfully", `${Math.max(1, Math.round(duration))} ms`));

  const visual = document.createElement("div");
  visual.className = "output-visual";
  const rendered = renderTypedOutput(cell.dataset.outputType, visual, result);
  if (!rendered) renderRawPreview(visual, result);
  output.append(visual);

  if (logs.length) output.append(makeLogBlock(logs));
  output.append(makeRawDetails(rawText));
}

function renderCodeError(output, error) {
  resetOutputState(output);
  output.classList.add("is-error");
  output.append(makeOutputStatus("Error while running", error.name || "Error"));
  const message = document.createElement("pre");
  message.className = "output-error-text";
  message.textContent = `${error.name}: ${error.message}`;
  output.append(message);
}

function makeOutputStatus(label, detail) {
  const status = document.createElement("div");
  status.className = "output-status";
  const strong = document.createElement("strong");
  strong.textContent = label;
  const span = document.createElement("span");
  span.textContent = detail;
  status.append(strong, span);
  return status;
}

function makeRawOutputText(result, logs = []) {
  const resultText = result === undefined ? "undefined" : formatValue(result);
  return logs.length
    ? `${logs.join("\n")}${resultText ? `\n\nReturn value:\n${resultText}` : ""}`
    : resultText;
}

function renderTypedOutput(type, container, result) {
  if (type === "tokens") return renderTokenOutput(container, result);
  if (type === "ngram-table") return renderNgramOutput(container, result);
  if (type === "probability") return renderProbabilityOutput(container, result);
  if (type === "generation") return renderGenerationOutput(container, result);
  if (type === "backoff") return renderBackoffOutput(container, result);
  if (type === "evaluation") return renderEvaluationOutput(container, result);
  return false;
}

function renderTokenOutput(container, result) {
  if (!result || !Array.isArray(result.firstTokens)) return false;
  appendMetrics(container, [
    ["tokens", formatNumber(result.tokenCount || 0)],
    ["vocabulary", formatNumber(result.vocabularySize || 0)],
    ["preview", `${result.firstTokens.length} tokens`]
  ]);
  appendChipRail(container, result.firstTokens, { markRepeats: true });
  appendOutputInsight(container, "The output is a token stream preview plus the unique vocabulary size from the same tokenizer code.");
  return true;
}

function renderNgramOutput(container, result) {
  if (!result || !Array.isArray(result.mostCommon)) return false;
  appendMetrics(container, [
    ["model", result.model || "n-gram"],
    ["windows", formatNumber(result.totalWindows || 0)],
    ["shown", `${result.mostCommon.length} rows`]
  ]);
  appendResultTable(container, ["context", "next token", "count"], result.mostCommon.map((row) => [
    row.context || "(any context)",
    row.next,
    `x${formatNumber(row.count || 0)}`
  ]));
  appendOutputInsight(container, "Each row is a repeated training window: remembered context on the left, observed next token on the right.");
  return true;
}

function renderProbabilityOutput(container, result) {
  if (!result || !("probability" in result)) return false;
  appendMetrics(container, [
    ["context", result.context || "(any context)"],
    ["token", result.token || "(none)"],
    ["probability", percent(Number(result.probability || 0))]
  ]);

  const bar = document.createElement("div");
  bar.className = "output-probability-row";
  const label = document.createElement("span");
  label.textContent = result.token || "(none)";
  const track = document.createElement("span");
  track.className = "output-probability-track";
  const fill = document.createElement("span");
  fill.style.width = `${Math.max(3, Number(result.probability || 0) * 100)}%`;
  track.append(fill);
  const value = document.createElement("strong");
  value.textContent = percent(Number(result.probability || 0));
  bar.append(label, track, value);
  container.append(bar);

  if (result.formula) {
    const formula = document.createElement("code");
    formula.className = "output-formula";
    formula.textContent = `P(${result.token} | ${result.context}) = ${result.formula}`;
    container.append(formula);
  } else if (result.note) {
    appendOutputInsight(container, result.note);
  }
  return true;
}

function renderGenerationOutput(container, result) {
  if (typeof result !== "string") return false;
  const tokens = tokenize(result);
  appendMetrics(container, [
    ["generated tokens", formatNumber(tokens.length)],
    ["strategy", currentSettings().strategy === "top" ? "top pick" : "sample"],
    ["model", currentSettings().modelName]
  ]);
  appendChipRail(container, tokens, { seedTokens: tokenize(dom.contextInput.value).length });
  appendOutputInsight(container, "The generated string is shown as chips so each chosen token is visible.");
  return true;
}

function renderBackoffOutput(container, result) {
  if (!result || !Array.isArray(result.predictions)) return false;
  appendMetrics(container, [
    ["requested", result.requestedModel || "model"],
    ["used", result.usedModel || "model"],
    ["context", result.context || "(any context)"]
  ]);

  if (Array.isArray(result.ladder) && result.ladder.length) {
    appendResultTable(container, ["model", "context", "evidence"], result.ladder.map((row) => [
      nNames[row.order] || `${row.order}-gram`,
      row.context || "(any context)",
      row.seen ? `${formatNumber(row.total || 0)} match${row.total === 1 ? "" : "es"}${row.used ? " - used" : ""}` : `not seen${row.used ? " - used" : ""}`
    ]));
  }

  if (result.predictions.length) {
    appendProbabilityBars(container, result.predictions);
  } else {
    container.append(emptyState("No next-token probabilities under the current settings."));
  }

  if (!result.predictions.length) {
    appendOutputInsight(container, "The exact context has no usable evidence with the current settings. Backoff or smoothing can give the model another way to continue.");
  } else {
    appendOutputInsight(container, result.usedBackoff
      ? "The model used a shorter context because the exact context had no usable evidence."
      : "The model used the requested context directly.");
  }
  return true;
}

function renderEvaluationOutput(container, result) {
  if (!Array.isArray(result)) return false;
  const finite = result.filter((row) => typeof row.perplexity === "number");
  const best = finite.length ? finite.reduce((a, b) => (a.perplexity <= b.perplexity ? a : b)) : null;
  appendMetrics(container, [
    ["models", formatNumber(result.length)],
    ["best finite", best ? best.model : "none"],
    ["alpha", currentAlpha().toFixed(1)]
  ]);
  appendResultTable(container, ["model", "scored", "impossible", "perplexity"], result.map((row) => [
    row.model,
    formatNumber(row.tokensScored || 0),
    row.unknown ? `${row.impossible} (${row.unknown} outside vocab)` : String(row.impossible),
    row.perplexity === "infinity" ? "infinity" : String(row.perplexity)
  ]));
  appendOutputInsight(container, "Lower finite perplexity means lower average surprise on the held-out text.");
  return true;
}

function renderRawPreview(container, result) {
  const pre = document.createElement("pre");
  pre.className = "output-raw-preview";
  pre.textContent = result === undefined ? "undefined" : formatValue(result);
  container.append(pre);
}

function appendMetrics(container, metrics) {
  const grid = document.createElement("div");
  grid.className = "output-metrics";
  metrics.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "output-metric";
    const strong = document.createElement("strong");
    strong.textContent = value;
    const span = document.createElement("span");
    span.textContent = label;
    item.append(strong, span);
    grid.append(item);
  });
  container.append(grid);
}

function appendChipRail(container, tokens, options = {}) {
  const counts = new Map();
  tokens.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
  const rail = document.createElement("div");
  rail.className = "output-chip-rail";
  tokens.forEach((token, index) => {
    const chip = document.createElement("span");
    chip.className = "output-chip";
    if (options.markRepeats && counts.get(token) > 1) chip.classList.add("repeat");
    if (options.seedTokens && index < options.seedTokens) chip.classList.add("seed");
    chip.textContent = token;
    rail.append(chip);
  });
  container.append(rail);
}

function appendResultTable(container, headings, rows) {
  const table = document.createElement("table");
  table.className = "output-table";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headings.forEach((heading) => {
    const th = document.createElement("th");
    th.textContent = heading;
    headRow.append(th);
  });
  thead.append(headRow);
  const tbody = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(thead, tbody);
  container.append(table);
}

function appendProbabilityBars(container, rows) {
  const list = document.createElement("div");
  list.className = "output-probability-list";
  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "output-probability-row";
    const label = document.createElement("span");
    label.textContent = row.token;
    const track = document.createElement("span");
    track.className = "output-probability-track";
    const fill = document.createElement("span");
    fill.style.width = `${Math.max(3, Number(row.probability || 0) * 100)}%`;
    track.append(fill);
    const value = document.createElement("strong");
    value.textContent = `${percent(Number(row.probability || 0))} | x${formatNumber(row.count || 0)}`;
    item.append(label, track, value);
    list.append(item);
  });
  container.append(list);
}

function appendOutputInsight(container, text) {
  const note = document.createElement("p");
  note.className = "output-insight";
  note.textContent = text;
  container.append(note);
}

function makeLogBlock(logs) {
  const block = document.createElement("details");
  block.className = "output-raw";
  const summary = document.createElement("summary");
  summary.textContent = "View printed logs";
  const pre = document.createElement("pre");
  pre.textContent = logs.join("\n");
  block.append(summary, pre);
  return block;
}

function makeRawDetails(rawText) {
  const details = document.createElement("details");
  details.className = "output-raw";
  const summary = document.createElement("summary");
  summary.textContent = "View raw output";
  const pre = document.createElement("pre");
  pre.textContent = rawText || "undefined";
  details.append(summary, pre);
  return details;
}

function formatValue(value) {
  if (typeof value === "string") return value;
  if (value === undefined) return "undefined";
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
}

function populateCorpusSelect() {
  dom.corpusSelect.replaceChildren();
  corpora.forEach((corpus) => {
    const option = document.createElement("option");
    option.value = corpus.id;
    option.textContent = corpus.title;
    dom.corpusSelect.append(option);
  });

  const custom = document.createElement("option");
  custom.value = CUSTOM_CORPUS_ID;
  custom.textContent = "Custom text";
  dom.corpusSelect.append(custom);
}

function getActiveCorpus() {
  if (state.activeCorpusId === CUSTOM_CORPUS_ID) {
    return state.customCorpusMeta || {
      id: CUSTOM_CORPUS_ID,
      title: "Custom text",
      source: "Edited in the browser.",
      recommendedContext: dom.contextInput.value,
      holdout: dom.holdoutInput.value,
      text: dom.corpusInput.value
    };
  }

  return corpora.find((corpus) => corpus.id === state.activeCorpusId) || corpora[0];
}

function resetTransientState() {
  state.activeIndex = 0;
  state.isPlayingWindows = false;
  state.selectedToken = "";
  state.topRuns = 0;
  state.sampleRuns = 0;
  state.topComparison = null;
  state.sampleComparison = null;
}

function loadCorpus(corpusId) {
  if (corpusId === CUSTOM_CORPUS_ID) {
    markCustomCorpus();
    rebuildModel();
    generateContinuation();
    prepareCodeCells();
    return;
  }

  const corpus = corpora.find((item) => item.id === corpusId) || corpora[0];
  state.activeCorpusId = corpus.id;
  state.customCorpusMeta = null;
  dom.corpusSelect.value = corpus.id;
  dom.corpusInput.value = corpus.text;
  dom.contextInput.value = corpus.recommendedContext;
  dom.stuckContextInput.value = corpus.stuckContext || DEFAULT_STUCK_CONTEXT;
  dom.holdoutInput.value = corpus.holdout;
  dom.holdoutPresetSelect.value = "matched";
  resetTransientState();
  rebuildModel();
  generateContinuation();
  prepareCodeCells();
}

function markCustomCorpus() {
  state.activeCorpusId = CUSTOM_CORPUS_ID;
  state.customCorpusMeta = {
    id: CUSTOM_CORPUS_ID,
    title: "Custom text",
    source: "Edited in the browser.",
    recommendedContext: dom.contextInput.value,
    holdout: dom.holdoutInput.value,
    text: dom.corpusInput.value
  };
  dom.corpusSelect.value = CUSTOM_CORPUS_ID;
  dom.corpusDetails.textContent = `Custom text | ${formatNumber(state.tokens.length)} tokens | ${formatNumber(state.vocab.length)} unique tokens. Edited in the browser.`;
}

function applyHoldoutPreset() {
  const corpus = getActiveCorpus();
  if (dom.holdoutPresetSelect.value === "matched") {
    dom.holdoutInput.value = corpus.holdout || corpus.text.slice(0, 280);
  } else if (dom.holdoutPresetSelect.value === "unseen") {
    dom.holdoutInput.value = "The astronaut repaired the telescope while the orchestra tuned their instruments beside the frozen lake.";
  }
}

function scheduleModelRebuild() {
  window.clearTimeout(modelRefreshTimer);
  dom.tokenLegend.textContent = "Updating tokenization and counts...";
  modelRefreshTimer = window.setTimeout(() => {
    window.requestAnimationFrame(() => {
      modelRefreshTimer = window.setTimeout(() => {
        invalidateGeneratedComparisons();
        rebuildModel();
        generateContinuation();
        debounceRunCells();
      }, 0);
    });
  }, 180);
}

function renderInteractiveViews({ includeMemory = false, includeContextChoices = false, includeEvaluation = true } = {}) {
  syncControlLabels();
  renderStats();
  if (includeMemory) {
    renderMemoryTokenRail();
    renderWindowInspector();
    renderNgramCards();
  }
  if (includeContextChoices) renderContextChoices();
  renderPredictions();
  renderBackoffAndSmoothing();
  if (includeEvaluation) renderEvaluation();
}

function wireEvents() {
  [dom.lowercaseToggle, dom.punctuationToggle].forEach((element) => {
    element.addEventListener("change", () => {
      state.activeIndex = 0;
      state.selectedToken = "";
      scheduleModelRebuild();
    });
  });

  dom.nChoices.forEach((choice) => {
    choice.addEventListener("change", () => {
      state.activeIndex = 0;
      state.selectedToken = "";
      invalidateGeneratedComparisons();
      renderInteractiveViews({ includeMemory: true, includeContextChoices: true });
      generateContinuation();
      debounceRunCells();
    });
  });

  dom.alphaSlider.addEventListener("input", () => {
    invalidateGeneratedComparisons();
    renderInteractiveViews();
    scheduleContinuationRefresh();
    debounceRunCells();
  });

  dom.backoffToggle.addEventListener("change", () => {
    invalidateGeneratedComparisons();
    renderInteractiveViews();
    generateContinuation();
    debounceRunCells();
  });

  dom.strategySelect.addEventListener("change", () => {
    invalidateGeneratedComparisons();
    syncControlLabels();
    renderStats();
    generateContinuation();
    debounceRunCells();
  });

  dom.corpusSelect.addEventListener("change", () => loadCorpus(dom.corpusSelect.value));

  dom.prevWindowButton.addEventListener("click", () => stepWindow(-1));
  dom.nextWindowButton.addEventListener("click", () => stepWindow(1));
  dom.playWindowButton.addEventListener("click", () => {
    state.isPlayingWindows = !state.isPlayingWindows;
    updateWindowPlayback();
  });

  dom.contextSelect.addEventListener("change", () => {
    dom.contextInput.value = dom.contextSelect.value;
    state.selectedToken = "";
    invalidateGeneratedComparisons();
    renderPredictions();
    renderBackoffAndSmoothing();
    renderGenerationComparison();
    debounceRunCells();
  });

  dom.tokenSelect.addEventListener("change", () => {
    state.selectedToken = dom.tokenSelect.value;
    renderPredictions();
    debounceRunCells();
  });

  dom.rerunTopButton.addEventListener("click", () => renderGenerationComparison({ top: true, sample: false, count: true }));
  dom.rerunSampleButton.addEventListener("click", () => renderGenerationComparison({ top: false, sample: true, count: true }));
  dom.rerunBothButton.addEventListener("click", () => renderGenerationComparison({ top: true, sample: true, count: true }));

  dom.stuckContextInput.addEventListener("input", () => {
    renderBackoffAndSmoothing();
    debounceRunCells();
  });

  dom.tryStuckButton.addEventListener("click", () => {
    dom.contextInput.value = currentStuckContext();
    state.selectedToken = "";
    invalidateGeneratedComparisons();
    renderContextChoices();
    renderPredictions();
    renderBackoffAndSmoothing();
    renderGenerationComparison();
    debounceRunCells();
  });

  dom.holdoutPresetSelect.addEventListener("change", () => {
    applyHoldoutPreset();
    renderEvaluation();
    debounceRunCells();
  });

  dom.evaluateButton.addEventListener("click", () => {
    renderEvaluation();
    markCodeCellsStale();
  });

  dom.corpusInput.addEventListener("input", () => {
    markCustomCorpus();
    window.clearTimeout(inputTimer);
    inputTimer = window.setTimeout(() => {
      state.activeIndex = 0;
      invalidateGeneratedComparisons();
      rebuildModel();
      generateContinuation();
      debounceRunCells();
    }, 180);
  });

  dom.contextInput.addEventListener("input", () => {
    state.selectedToken = "";
    invalidateGeneratedComparisons();
    renderContextChoices();
    renderPredictions();
    renderBackoffAndSmoothing();
    renderGenerationComparison();
    debounceRunCells();
  });

  dom.holdoutInput.addEventListener("input", () => {
    dom.holdoutPresetSelect.value = "custom";
    renderEvaluation();
    debounceRunCells();
  });

  dom.generateButton.addEventListener("click", () => {
    generateContinuation();
    markCodeCellsStale();
  });

  dom.resetButton.addEventListener("click", () => {
    dom.lowercaseToggle.checked = true;
    dom.punctuationToggle.checked = true;
    dom.backoffToggle.checked = false;
    dom.stuckContextInput.value = DEFAULT_STUCK_CONTEXT;
    dom.nChoices.forEach((choice) => {
      choice.checked = choice.value === "3";
    });
    dom.alphaSlider.value = "0";
    dom.strategySelect.value = "sample";
    loadCorpus(corpora[0].id);
  });

  document.querySelectorAll(".code-cell").forEach((cell) => {
    cell.querySelector(".run-button").addEventListener("click", () => runCodeCell(cell));
  });
}

function debounceRunCells() {
  window.clearTimeout(codeCellTimer);
  codeCellTimer = window.setTimeout(markCodeCellsStale, 240);
}

function stepWindow(delta) {
  const n = currentN();
  const total = state.models[n] ? state.models[n].ngrams.length : 0;
  if (!total) return;
  state.activeIndex = (state.activeIndex + delta + total) % total;
  renderMemoryTokenRail();
  renderWindowInspector();
  renderNgramCards();
}

function updatePlayWindowButton() {
  const icon = document.createElement("span");
  icon.className = "button-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = state.isPlayingWindows ? "&#10074;&#10074;" : "&#9654;";

  const label = document.createElement("span");
  label.textContent = state.isPlayingWindows ? "Pause" : "Play";

  dom.playWindowButton.replaceChildren(icon, label);
  dom.playWindowButton.setAttribute(
    "aria-label",
    state.isPlayingWindows ? "Pause training windows" : "Play training windows"
  );
}

function updateWindowPlayback() {
  if (animationTimer) window.clearInterval(animationTimer);
  animationTimer = null;
  updatePlayWindowButton();

  if (!state.isPlayingWindows) return;

  animationTimer = window.setInterval(() => {
    const n = currentN();
    const total = state.models[n] ? state.models[n].ngrams.length : 0;
    if (!total) return;
    stepWindow(1);
  }, state.tokens.length > LARGE_CORPUS_THRESHOLD ? 1600 : 1100);
}

function emptyState(message) {
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = message;
  return empty;
}

function percent(value) {
  return `${(value * 100).toFixed(value >= 0.1 ? 1 : 2)}%`;
}

function formatNumber(value) {
  return Number(value).toLocaleString("en-US");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setupSectionSpy() {
  const links = Array.from(document.querySelectorAll(".lesson-toc a[href^='#'], .topnav a[href^='#']"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean)
    .filter((section, index, all) => all.indexOf(section) === index);

  if (!links.length || !sections.length) return;

  const activate = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const updateActiveSection = () => {
    const activationLine = 260;
    const active = sections.reduce((current, section) => (
      section.getBoundingClientRect().top <= activationLine ? section : current
    ), sections[0]);
    activate(active.id);
  };

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();
  window.setTimeout(updateActiveSection, 120);
  window.setTimeout(updateActiveSection, 360);
}

populateCorpusSelect();
wireEvents();
loadCorpus(corpora[0].id);
setupSectionSpy();
