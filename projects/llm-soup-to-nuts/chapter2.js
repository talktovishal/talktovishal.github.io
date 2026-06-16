const fallbackCorpus = {
  id: "fallback",
  title: "Small fallback corpus",
  source: "Built-in fallback text.",
  text: [
    "The model learns from text. The student studies language. The teacher explains the model.",
    "Words that appear in similar neighborhoods can learn similar vectors.",
    "A tokenizer turns text into pieces before a neural language model reads it.",
    "A sequence model carries a hidden state forward through time."
  ].join(" ")
};

const sourceCorpora = Array.isArray(window.LESSON_CORPORA) && window.LESSON_CORPORA.length
  ? window.LESSON_CORPORA
  : [fallbackCorpus];

function interleaveCorpusTexts(items, chunkSize = 16000) {
  const chunks = items.map((item) => {
    const text = item.text || "";
    const output = [];
    for (let index = 0; index < text.length; index += chunkSize) {
      output.push(text.slice(index, index + chunkSize));
    }
    return output;
  });
  const maxChunks = Math.max(...chunks.map((chunk) => chunk.length), 0);
  const mixed = [];
  for (let chunkIndex = 0; chunkIndex < maxChunks; chunkIndex += 1) {
    chunks.forEach((chunk, corpusIndex) => {
      if (chunk[chunkIndex]) {
        mixed.push(`\n\n[${items[corpusIndex].title || "Corpus"}]\n\n${chunk[chunkIndex]}`);
      }
    });
  }
  return mixed.join("\n\n");
}

const mixedCorpus = sourceCorpora.length > 1
  ? {
      id: "classic-fiction-mix",
      title: "Balanced classic fiction mix",
      author: "Lewis Carroll, Jane Austen, Arthur Conan Doyle",
      sourceName: "Three public-domain Project Gutenberg texts",
      sourceUrl: "https://www.gutenberg.org/",
      license: "Public domain in the United States",
      recommendedContext: "said the",
      holdout: "Alice met Holmes and Elizabeth in a strange little garden.",
      text: interleaveCorpusTexts(sourceCorpora.filter((item) => !item.excludeFromMix))
    }
  : null;

const corpora = mixedCorpus
  ? [sourceCorpora[0], mixedCorpus, ...sourceCorpora.slice(1)]
  : sourceCorpora;

const EMBEDDING_STOP_WORDS = new Set([
  "the", "and", "a", "an", "to", "of", "in", "it", "was", "i", "you",
  "that", "had", "with", "as", "for", "on", "at", "by", "not", "be",
  "is", "but", "they", "from", "all", "this", "were", "have", "are",
  "or", "one", "said", "so", "if", "out", "up", "down", "there", "what",
  "which", "when", "who", "would", "could", "should", "will", "my", "me",
  "your", "their", "them", "then", "than", "into", "about", "very", "little",
  "now", "no", "do", "did", "been", "has", "more", "much", "some", "any",
  "only", "can", "we", "before", "after", "over", "again", "here", "know",
  "think", "went", "come", "go", "see", "like", "looked", "time", "just",
  "first", "well", "way", "say", "get", "got", "must", "came", "other",
  "too", "upon", "without", "shall", "yet", "however", "being", "even",
  "might", "enough", "perhaps", "asked", "let", "rather", "while", "through",
  "where", "why", "how", "sitting"
]);

const EMBEDDING_KEEP_WORDS = new Set([
  "he", "she", "her", "him", "his", "alice", "rabbit", "mouse", "cat",
  "queen", "king", "duchess", "hatter", "hare", "dormouse", "gryphon",
  "turtle", "caterpillar", "mock", "sister", "dinah", "elizabeth", "darcy",
  "jane", "bingley", "bennet", "wickham", "collins", "holmes", "watson",
  "sherlock", "doctor", "inspector", "police", "london",
  "tweedledum", "tweedledee", "humpty", "dumpty", "knight", "sheep",
  "unicorn", "lily", "kitty"
]);

const EMBEDDING_WATCH_PAIRS = [
  ["she", "her"],
  ["he", "him"],
  ["queen", "king"],
  ["tweedledum", "tweedledee"],
  ["hatter", "hare"],
  ["mock", "turtle"],
  ["rabbit", "mouse"],
  ["gryphon", "turtle"],
  ["elizabeth", "darcy"],
  ["jane", "bingley"],
  ["holmes", "watson"],
  ["sherlock", "holmes"]
];

const EMBEDDING_CONTEXT_HIDE_WORDS = new Set([
  "the", "and", "a", "an", "to", "of", "in", "it", "was", "i", "you",
  "he", "she", "her", "him", "his",
  "that", "had", "with", "as", "for", "on", "at", "by", "not", "be",
  "is", "but", "they", "from", "all", "this", "were", "have", "are",
  "or", "one", "so", "if", "out", "up", "down", "there", "what",
  "which", "when", "who", "would", "could", "should", "will", "my", "me",
  "your", "their", "them", "then", "than", "into", "about", "very", "little",
  "now", "no", "do", "did", "been", "has", "more", "much", "some", "any",
  "only", "can", "we", "before", "after", "over", "again", "here", "just",
  "said", "asked", "thought", "think", "know", "came", "come", "went",
  "get", "got", "looked", "first", "like", "see", "rather", "never",
  "right", "gone", "day"
]);

const edgeCases = {
  multilingual: {
    title: "Multilingual text",
    text: "Hello \u4e16\u754c. \u0645\u0631\u062d\u0628\u0627 \u0628\u0627\u0644\u0639\u0627\u0644\u0645. \u0e2a\u0e27\u0e31\u0e2a\u0e14\u0e35\u0e42\u0e25\u0e01.",
    note: "Scripts differ in spacing, byte length, and common subword boundaries.",
    warnings: ["A word-like English splitter is not enough for multilingual text."]
  },
  code: {
    title: "Code and whitespace",
    text: "def add(x, y):\n    return x + y\n\nprint(add(2, 3))",
    note: "In code, indentation, punctuation, and line breaks are part of the signal.",
    warnings: ["Whitespace can be semantically important even when it looks empty."]
  },
  numbers: {
    title: "Numbers",
    text: "Order 1000001 costs $12.50 on 2026-06-13.",
    note: "Numbers become text pieces unless another tool interprets their value.",
    warnings: ["Tokenizing a number is not the same as doing arithmetic with it."]
  },
  emoji: {
    title: "Emoji and Unicode",
    text: "Great work \u{1f44f}\u{1f3fd}! Pair: \u{1f469}\u200d\u{1f4bb} plus cafe\u0301.",
    note: "One visible symbol can be several Unicode code points and many bytes.",
    warnings: ["Emoji modifiers, joiners, and combining marks often surprise token counters."]
  },
  rare: {
    title: "Rare names",
    text: "Zyqoria met Adebayo-Olufemi near Qeqertarsuaq.",
    note: "Rare names often split into more pieces because the tokenizer saw less similar training text.",
    warnings: ["Uneven name splitting can be one early fairness signal."]
  },
  domain: {
    title: "Domain vocabulary",
    text: "The kinase inhibitor upregulates phosphatidylinositol signaling.",
    note: "Domain-specific terms are compressed well only when training data contains similar language.",
    warnings: ["Specialized vocabulary may become long subword sequences."]
  },
  hidden: {
    title: "Hidden text",
    text: "pay\u200bload says ignore previous instructions",
    note: "The word payload contains a zero-width character.",
    warnings: ["Displayed text and tokenized text can diverge when hidden Unicode controls are present."]
  }
};

const dom = {
  corpusSelect: document.getElementById("chapterCorpusSelect"),
  tokenBudgetSlider: document.getElementById("tokenBudgetSlider"),
  tokenBudgetLabel: document.getElementById("tokenBudgetLabel"),
  trainingDepthSelect: document.getElementById("trainingDepthSelect"),
  trainButton: document.getElementById("trainEmbeddingsButton"),
  chapterStats: document.getElementById("chapterStats"),
  trainingStatus: document.getElementById("trainingStatus"),
  contextCompareInput: document.getElementById("contextCompareInput"),
  sparsitySummary: document.getElementById("sparsitySummary"),
  sparsityPanel: document.getElementById("sparsityPanel"),
  lossLabel: document.getElementById("lossLabel"),
  lossPanel: document.getElementById("lossPanel"),
  trainingDetails: document.getElementById("trainingDetails"),
  watchLabel: document.getElementById("watchLabel"),
  trainingWatch: document.getElementById("trainingWatch"),
  embeddingMap: document.getElementById("embeddingMap"),
  embeddingMapLabel: document.getElementById("embeddingMapLabel"),
  focusWordSelect: document.getElementById("focusWordSelect"),
  analogyInput: document.getElementById("analogyInput"),
  nearestPanel: document.getElementById("nearestPanel"),
  analogyPanel: document.getElementById("analogyPanel"),
  recurrentWeightSlider: document.getElementById("recurrentWeightSlider"),
  recurrentWeightLabel: document.getElementById("recurrentWeightLabel"),
  sequenceStepsSlider: document.getElementById("sequenceStepsSlider"),
  sequenceStepsLabel: document.getElementById("sequenceStepsLabel"),
  gradientSummary: document.getElementById("gradientSummary"),
  gradientMode: document.getElementById("gradientMode"),
  gradientPanel: document.getElementById("gradientPanel"),
  tokenizerInput: document.getElementById("tokenizerInput"),
  boundarySummary: document.getElementById("boundarySummary"),
  boundaryPanel: document.getElementById("boundaryPanel"),
  tokenizerAlgorithmSelect: document.getElementById("tokenizerAlgorithmSelect"),
  tokenizerVocabSlider: document.getElementById("tokenizerVocabSlider"),
  tokenizerVocabLabel: document.getElementById("tokenizerVocabLabel"),
  tokenizerTrainingPanel: document.getElementById("tokenizerTrainingPanel"),
  algorithmSummary: document.getElementById("algorithmSummary"),
  algorithmTokens: document.getElementById("algorithmTokens"),
  edgeCaseSelect: document.getElementById("edgeCaseSelect"),
  edgeCasePanel: document.getElementById("edgeCasePanel"),
  edgeCaseSummary: document.getElementById("edgeCaseSummary"),
  edgeCaseTokens: document.getElementById("edgeCaseTokens"),
  edgeCaseWarnings: document.getElementById("edgeCaseWarnings"),
  comparisonPanel: document.getElementById("comparisonPanel"),
  compareWordSelect: document.getElementById("compareWordSelect"),
  compareAnalogyInput: document.getElementById("compareAnalogyInput"),
  compareTrained: document.getElementById("compareTrained"),
  compareGlove: document.getElementById("compareGlove"),
  compareAnalogyResult: document.getElementById("compareAnalogyResult")
};

const DEFAULT_CHAPTER_CORPUS_ID = "alice-both-books";
const initialChapterCorpus = corpora.find((corpus) => corpus.id === DEFAULT_CHAPTER_CORPUS_ID) || corpora[0];

const state = {
  activeCorpusId: initialChapterCorpus.id,
  text: initialChapterCorpus.text,
  tokens: [],
  wordTokens: [],
  ngrams: null,
  embeddingModel: null,
  tokenizerModels: null,
  embeddingRun: 0,
  embeddingJob: 0,
  hasCheckedSparsity: false,
  hasExploredGradient: false,
  hasComparedVectors: false
};

function wordAndPunctuationTokens(text, keepWhitespace = false) {
  const pattern = keepWhitespace
    ? /\s+|[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?|[^\s]/gu
    : /[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?|[^\s]/gu;
  return String(text).toLowerCase().match(pattern) || [];
}

function wordTokensOnly(text) {
  return wordAndPunctuationTokens(text).filter((token) => /^[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?$/u.test(token));
}

function formatNumber(value) {
  return Number(value).toLocaleString("en-US");
}

function percent(value) {
  return `${(value * 100).toFixed(value >= 0.1 ? 1 : 2)}%`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function makeRng(seed = 1234567) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function sigmoid(value) {
  if (value > 18) return 1;
  if (value < -18) return 0;
  return 1 / (1 + Math.exp(-value));
}

function dot(a, b) {
  let total = 0;
  for (let index = 0; index < a.length; index += 1) total += a[index] * b[index];
  return total;
}

function cosine(a, b) {
  let ab = 0;
  let aa = 0;
  let bb = 0;
  for (let index = 0; index < a.length; index += 1) {
    ab += a[index] * b[index];
    aa += a[index] * a[index];
    bb += b[index] * b[index];
  }
  if (!aa || !bb) return 0;
  return ab / Math.sqrt(aa * bb);
}

function getActiveCorpus() {
  return corpora.find((corpus) => corpus.id === state.activeCorpusId) || corpora[0];
}

function tokenBudget() {
  return Number(dom.tokenBudgetSlider.value);
}

function trainingDepth() {
  const selected = dom.trainingDepthSelect?.selectedOptions?.[0];
  const epochs = Number(dom.trainingDepthSelect?.value || 8);
  return {
    epochs: Number.isFinite(epochs) ? epochs : 8,
    label: selected ? selected.textContent.trim() : "Recommended - 8 epochs"
  };
}

function prepareCorpus() {
  const corpus = getActiveCorpus();
  state.text = corpus.text || "";
  state.tokens = wordAndPunctuationTokens(state.text).slice(0, tokenBudget());
  state.wordTokens = state.tokens.filter((token) => /^[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?$/u.test(token));
  state.ngrams = buildNgramEvidence(state.wordTokens);
  state.tokenizerModels = null;
  state.embeddingModel = null;
  renderStats();
  renderSparsity();
  renderTrainingPlaceholder("Ready. Press Train word vectors to learn from this corpus and budget.");
  renderEmbeddingPlaceholder("No word vectors yet. Press Train word vectors above, then come back here.");
}

function renderStats() {
  const vocab = new Set(state.wordTokens);
  const corpus = getActiveCorpus();
  dom.tokenBudgetLabel.textContent = String(tokenBudget());
  dom.tokenBudgetLabel.value = String(tokenBudget());
  dom.chapterStats.replaceChildren();
  [
    ["corpus", corpus.title],
    ["word tokens", formatNumber(state.wordTokens.length)],
    ["vocabulary", formatNumber(vocab.size)],
    ["source", corpus.author || corpus.sourceName || corpus.source || "selected text"]
  ].forEach(([label, value]) => {
    const item = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = value;
    const span = document.createElement("span");
    span.textContent = label;
    item.append(strong, span);
    dom.chapterStats.append(item);
  });
}

function buildNgramEvidence(tokens) {
  const unigram = new Map();
  const bigramContexts = new Map();
  const trigramContexts = new Map();

  tokens.forEach((token) => unigram.set(token, (unigram.get(token) || 0) + 1));
  for (let index = 0; index < tokens.length - 1; index += 1) {
    addContextCount(bigramContexts, [tokens[index]], tokens[index + 1]);
  }
  for (let index = 0; index < tokens.length - 2; index += 1) {
    addContextCount(trigramContexts, [tokens[index], tokens[index + 1]], tokens[index + 2]);
  }

  return { unigram, bigramContexts, trigramContexts };
}

function addContextCount(map, contextTokens, next) {
  const key = contextTokens.join(" ");
  if (!map.has(key)) map.set(key, { total: 0, counts: new Map() });
  const row = map.get(key);
  row.total += 1;
  row.counts.set(next, (row.counts.get(next) || 0) + 1);
}

function topContinuation(row) {
  if (!row || !row.counts.size) return "";
  return Array.from(row.counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
}

function renderSparsity() {
  if (!state.ngrams) return;
  const lines = dom.contextCompareInput.value.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  dom.sparsitySummary.textContent = `${lines.length} phrase${lines.length === 1 ? "" : "s"}`;
  if (!state.hasCheckedSparsity) {
    dom.sparsityPanel.replaceChildren(notice("Click into the phrases above (or edit them) to check which contexts the model has actually seen."));
    return;
  }
  dom.sparsityPanel.replaceChildren();

  lines.forEach((line) => {
    const words = wordTokensOnly(line);
    const trigramContext = words.slice(-2).join(" ");
    const bigramContext = words.slice(-1).join(" ");
    const trigram = state.ngrams.trigramContexts.get(trigramContext);
    const bigram = state.ngrams.bigramContexts.get(bigramContext);
    const row = document.createElement("div");
    row.className = "evidence-row";
    const label = document.createElement("strong");
    label.textContent = line;
    const exact = document.createElement("span");
    exact.textContent = `exact phrase: ${trigramContext || "(none)"} -> ${formatNumber(trigram?.total || 0)} hit${trigram?.total === 1 ? "" : "s"}`;
    const fallback = document.createElement("span");
    fallback.textContent = `fallback word: ${bigramContext || "(none)"} -> ${formatNumber(bigram?.total || 0)} hit${bigram?.total === 1 ? "" : "s"}`;
    const next = document.createElement("em");
    if (trigram) {
      next.textContent = `uses exact phrase, next: ${topContinuation(trigram)}`;
    } else if (bigram) {
      next.textContent = `exact missing, so fallback next: ${topContinuation(bigram)}`;
    } else {
      next.textContent = "exact missing, fallback missing too";
    }
    row.append(label, exact, fallback, next);
    dom.sparsityPanel.append(row);
  });
}

function buildEmbeddingTrainingData() {
  const counts = new Map();
  state.wordTokens.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
  const focusLimit = 260;
  const contextLimit = 650;
  const maxPairs = 500000;
  const windowSize = 4;
  const vocab = Array.from(counts.entries())
    .filter(([word, count]) => isEmbeddingFocusWord(word, count))
    .map(([word, count]) => ({ word, count, score: embeddingFocusScore(word, count) }))
    .sort((a, b) => b.score - a.score || b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, focusLimit)
    .map((item, id) => ({ ...item, id }));
  const contextVocab = Array.from(counts.entries())
    .filter(([word, count]) => count >= 3 && !/^\d+$/u.test(word))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, contextLimit)
    .map(([word, count], id) => ({ word, count, id }));
  const idByWord = new Map(vocab.map((item) => [item.word, item.id]));
  const contextIdByWord = new Map(contextVocab.map((item) => [item.word, item.id]));

  // Frequent-word subsampling (Word2Vec style): thin out very common glue words
  // so that content words land closer together inside each context window. Words
  // in the keep-list (protagonists and pronouns we watch) are never thinned, so
  // the teaching watch-pairs keep enough evidence to learn from.
  const totalTokens = Math.max(1, state.wordTokens.length);
  const subsampleThreshold = 1e-3;
  const subsampleRng = makeRng(20240517);
  const keptStream = state.wordTokens.filter((word) => {
    if (EMBEDDING_KEEP_WORDS.has(word)) return true;
    const frequency = (counts.get(word) || 0) / totalTokens;
    if (frequency <= subsampleThreshold) return true;
    const keepProbability = (Math.sqrt(frequency / subsampleThreshold) + 1) * (subsampleThreshold / frequency);
    return subsampleRng() < keepProbability;
  });

  const pairs = [];
  for (let index = 0; index < keptStream.length; index += 1) {
    const center = idByWord.get(keptStream[index]);
    if (center === undefined) continue;
    for (let offset = -windowSize; offset <= windowSize; offset += 1) {
      if (offset === 0) continue;
      const contextIndex = index + offset;
      if (contextIndex < 0 || contextIndex >= keptStream.length) continue;
      const context = contextIdByWord.get(keptStream[contextIndex]);
      if (context === undefined) continue;
      pairs.push([center, context]);
      if (pairs.length >= maxPairs) break;
    }
    if (pairs.length >= maxPairs) break;
  }
  const contextProfiles = Array.from({ length: vocab.length }, () => new Map());
  pairs.forEach(([center, context]) => {
    const profile = contextProfiles[center];
    profile.set(context, (profile.get(context) || 0) + 1);
  });
  return { vocab, contextVocab, idByWord, contextIdByWord, pairs, contextProfiles, windowSize, focusLimit, contextLimit, maxPairs, streamTokens: totalTokens, keptTokens: keptStream.length };
}

function isEmbeddingFocusWord(word, count) {
  if (EMBEDDING_KEEP_WORDS.has(word)) return count >= 2;
  if (count < 5 || word.length < 3 || /^\d+$/u.test(word)) return false;
  return !EMBEDDING_STOP_WORDS.has(word);
}

function embeddingFocusScore(word, count) {
  const priority = EMBEDDING_KEEP_WORDS.has(word) ? 10000 : 0;
  return priority + count * Math.log(word.length + 1);
}

function notice(text) {
  const item = document.createElement("div");
  item.className = "empty-state";
  item.textContent = text;
  return item;
}

function renderTrainingPlaceholder(message) {
  const depth = trainingDepth();
  dom.lossLabel.textContent = "not trained";
  dom.trainingStatus.textContent = message;
  dom.lossPanel.replaceChildren(notice("Press Train word vectors to see the loss after each pass through the data."));
  dom.trainingDetails.replaceChildren();
  [
    ["next step", "press Train word vectors"],
    ["words it trains", "up to 260 focus words"],
    ["numbers in each vector", "36, chosen for this browser demo"],
    ["training depth", `${depth.epochs} epochs when you press the button`],
    ["context evidence", "common words still help train the focus words"],
    ["what changes", "the map and neighbor list below"],
    ["not automatic", "changing the corpus marks vectors as untrained"]
  ].forEach(([labelText, valueText]) => {
    const row = document.createElement("div");
    row.className = "detail-row";
    const label = document.createElement("span");
    label.textContent = labelText;
    const value = document.createElement("strong");
    value.textContent = valueText;
    row.append(label, value);
    dom.trainingDetails.append(row);
  });
  if (dom.watchLabel && dom.trainingWatch) {
    dom.watchLabel.textContent = "not trained";
    dom.trainingWatch.replaceChildren(notice("During training, this will show a few word pairs moving from random similarity toward learned similarity."));
  }
  dom.trainButton.disabled = false;
  dom.trainButton.textContent = "Train word vectors";
}

function renderEmbeddingPlaceholder(message) {
  dom.embeddingMapLabel.textContent = "not trained yet";
  dom.embeddingMap.replaceChildren(notice(message));
  dom.focusWordSelect.replaceChildren();
  const option = document.createElement("option");
  option.value = "";
  option.textContent = "Train word vectors first";
  dom.focusWordSelect.append(option);
  dom.focusWordSelect.disabled = true;
  dom.nearestPanel.replaceChildren(notice("After training, choose a word to see nearby trained words."));
  dom.analogyPanel.replaceChildren(notice("After training, try vector math with words from the trained vocabulary."));
}

function startEmbeddingTraining() {
  const job = state.embeddingJob + 1;
  state.embeddingJob = job;
  dom.trainButton.disabled = true;
  dom.trainButton.textContent = "Training...";
  dom.lossLabel.textContent = "training";
  dom.trainingStatus.textContent = "Training now. The page is learning content-focused word vectors from the selected text.";
  dom.lossPanel.replaceChildren(notice("Preparing vocabulary and word-neighborhood pairs."));
  if (dom.watchLabel && dom.trainingWatch) {
    dom.watchLabel.textContent = "preparing";
    dom.trainingWatch.replaceChildren(notice("Preparing watch pairs from the current trained vocabulary."));
  }
  setTrainingControlsDisabled(true);
  window.setTimeout(() => {
    trainEmbeddings(job).catch((error) => {
      console.error(error);
      setTrainingControlsDisabled(false);
      renderTrainingPlaceholder("Training failed. Try a smaller text amount, then press Train word vectors again.");
      renderEmbeddingPlaceholder("No vectors were trained because the training run failed.");
    });
  }, 20);
}

async function trainEmbeddings(job) {
  const started = window.performance ? window.performance.now() : Date.now();
  const training = buildEmbeddingTrainingData();
  if (!training.vocab.length || !training.pairs.length) {
    state.embeddingModel = null;
    setTrainingControlsDisabled(false);
    renderTrainingPlaceholder("Not enough repeated words for vector training. Increase the text amount or choose another corpus.");
    renderEmbeddingPlaceholder("No vectors were trained because the selected text has too few repeated words.");
    return;
  }
  const dimensions = 36;
  const rng = makeRng(42);
  const input = training.vocab.map(() => Array.from({ length: dimensions }, () => (rng() - 0.5) * 0.08));
  const output = training.contextVocab.map(() => Array.from({ length: dimensions }, () => (rng() - 0.5) * 0.08));
  const cumulative = buildNegativeDistribution(training.contextVocab);
  const losses = [];
  const learningRate = 0.035;
  const negativeSamples = 5;
  const depth = trainingDepth();
  const epochs = depth.epochs;
  const watchPairs = makeWatchPairs(training.idByWord);
  let watchRows = buildWatchRows(input, training.idByWord, watchPairs);
  renderTrainingProgress({ ...training, dimensions, epochs, trainingDepthLabel: depth.label, negativeSamples, losses, epoch: 0, watchRows });
  await yieldToBrowser();

  // Visiting the pairs in a fresh random order each epoch stops the updates from
  // marching in the book's word order, which gives noticeably steadier vectors.
  const order = Array.from({ length: training.pairs.length }, (_, index) => index);

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    if (job !== state.embeddingJob) return;
    let loss = 0;
    const epochLearningRate = learningRate * (1 - epoch / (epochs + 2));
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const swap = order[i];
      order[i] = order[j];
      order[j] = swap;
    }
    for (let pairIndex = 0; pairIndex < order.length; pairIndex += 1) {
      const [center, context] = training.pairs[order[pairIndex]];
      loss += trainSgnsPair(input, output, center, context, 1, epochLearningRate);
      for (let sample = 0; sample < negativeSamples; sample += 1) {
        let negative = sampleNegative(cumulative, rng());
        if (negative === context) negative = (negative + 1) % training.contextVocab.length;
        loss += trainSgnsPair(input, output, center, negative, 0, epochLearningRate);
      }
    }
    losses.push(loss / Math.max(1, training.pairs.length * (negativeSamples + 1)));
    watchRows = buildWatchRows(input, training.idByWord, watchPairs);
    renderTrainingProgress({ ...training, dimensions, epochs, trainingDepthLabel: depth.label, negativeSamples, losses, epoch: epoch + 1, watchRows });
    await yieldToBrowser();
  }

  if (job !== state.embeddingJob) return;
  const vectors = input.map((vector) => normalizedVector(vector));
  const points = projectVectors(vectors, training.vocab);
  const ended = window.performance ? window.performance.now() : Date.now();
  state.embeddingRun += 1;
  state.embeddingModel = {
    ...training,
    vectors,
    points,
    losses,
    dimensions,
    epochs,
    trainingDepthLabel: depth.label,
    negativeSamples,
    durationMs: ended - started,
    run: state.embeddingRun,
    watchPairs,
    watchRows
  };
  setTrainingControlsDisabled(false);
  populateFocusWords();
  renderTraining();
  renderEmbeddingExplorer();
}

function setTrainingControlsDisabled(disabled) {
  dom.corpusSelect.disabled = disabled;
  dom.tokenBudgetSlider.disabled = disabled;
  dom.trainingDepthSelect.disabled = disabled;
}

function yieldToBrowser() {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

function markEmbeddingSettingsChanged() {
  state.embeddingJob += 1;
  state.embeddingModel = null;
  renderTrainingPlaceholder("Ready. Press Train word vectors to learn with the current corpus, text amount, and training depth.");
  renderEmbeddingPlaceholder("No word vectors yet for these settings. Press Train word vectors above, then inspect them here.");
}

function makeWatchPairs(idByWord) {
  const available = EMBEDDING_WATCH_PAIRS.filter(([left, right]) => (
    idByWord.has(left) && idByWord.has(right)
  ));
  return available.slice(0, 8);
}

function buildWatchRows(vectors, idByWord, watchPairs) {
  return watchPairs.map(([left, right]) => {
    const similarity = cosine(vectors[idByWord.get(left)], vectors[idByWord.get(right)]);
    return { left, right, similarity };
  });
}

function normalizedVector(vector) {
  const copy = vector.slice();
  normalize(copy);
  return copy;
}

function buildNegativeDistribution(vocab) {
  const weights = vocab.map((item) => Math.pow(item.count, 0.75));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let running = 0;
  return weights.map((weight) => {
    running += weight / total;
    return running;
  });
}

function sampleNegative(cumulative, sample) {
  for (let index = 0; index < cumulative.length; index += 1) {
    if (sample <= cumulative[index]) return index;
  }
  return cumulative.length - 1;
}

function trainSgnsPair(input, output, centerId, contextId, label, learningRate) {
  const center = input[centerId];
  const context = output[contextId];
  const prediction = sigmoid(dot(center, context));
  const gradient = learningRate * (label - prediction);
  const centerCopy = center.slice();
  for (let dim = 0; dim < center.length; dim += 1) {
    center[dim] += gradient * context[dim];
    context[dim] += gradient * centerCopy[dim];
  }
  return label ? -Math.log(Math.max(prediction, 1e-9)) : -Math.log(Math.max(1 - prediction, 1e-9));
}

function projectVectors(vectors, vocab) {
  if (!vectors.length) return [];
  const dimensions = vectors[0].length;
  const means = Array(dimensions).fill(0);
  vectors.forEach((vector) => vector.forEach((value, dim) => { means[dim] += value; }));
  means.forEach((_, dim) => { means[dim] /= vectors.length; });
  const centered = vectors.map((vector) => vector.map((value, dim) => value - means[dim]));
  const cov = Array.from({ length: dimensions }, () => Array(dimensions).fill(0));
  centered.forEach((vector) => {
    for (let row = 0; row < dimensions; row += 1) {
      for (let col = 0; col < dimensions; col += 1) cov[row][col] += vector[row] * vector[col];
    }
  });
  const v1 = powerIteration(cov, 28);
  const lambda1 = dot(v1, multiplyMatrixVector(cov, v1));
  const cov2 = cov.map((row, r) => row.map((value, c) => value - lambda1 * v1[r] * v1[c]));
  const v2 = powerIteration(cov2, 28);
  const raw = centered.map((vector, id) => ({
    word: vocab[id].word,
    count: vocab[id].count,
    id,
    x: dot(vector, v1),
    y: dot(vector, v2)
  }));
  const xs = raw.map((point) => point.x);
  const ys = raw.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return raw.map((point) => ({
    ...point,
    x: 6 + 88 * ((point.x - minX) / Math.max(1e-9, maxX - minX)),
    y: 8 + 84 * ((point.y - minY) / Math.max(1e-9, maxY - minY))
  }));
}

function multiplyMatrixVector(matrix, vector) {
  return matrix.map((row) => row.reduce((sum, value, index) => sum + value * vector[index], 0));
}

function powerIteration(matrix, iterations) {
  let vector = Array(matrix.length).fill(0).map((_, index) => (index % 3) + 1);
  normalize(vector);
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    vector = multiplyMatrixVector(matrix, vector);
    normalize(vector);
  }
  return vector;
}

function normalize(vector) {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  for (let index = 0; index < vector.length; index += 1) vector[index] /= norm;
}

function populateFocusWords() {
  const previous = dom.focusWordSelect.value;
  dom.focusWordSelect.replaceChildren();
  state.embeddingModel.vocab.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.word;
    option.textContent = `${item.word} - seen ${item.count}x`;
    dom.focusWordSelect.append(option);
  });
  dom.focusWordSelect.disabled = false;
  const defaultFocus = ["alice", "rabbit", "queen", "elizabeth", "holmes"].find((word) => (
    state.embeddingModel.idByWord.has(word)
  ));
  dom.focusWordSelect.value = state.embeddingModel.idByWord.has(previous)
    ? previous
    : defaultFocus || state.embeddingModel.vocab[0]?.word || "";
}

function renderTrainingProgress(model) {
  dom.lossLabel.textContent = model.epoch
    ? `epoch ${model.epoch} / ${model.epochs}`
    : "starting";
  dom.trainingStatus.textContent = model.epoch
    ? `Training epoch ${model.epoch} of ${model.epochs}. The loss and watched word pairs update after each pass.`
    : `Prepared ${formatNumber(model.pairs.length)} word-neighborhood pairs for ${model.vocab.length} focus words. Starting ${model.trainingDepthLabel}.`;
  renderLossRows(model.losses, model.epochs);
  renderTrainingDetails(model, "training");
  renderWatchRows(model.watchRows, model.epoch ? `epoch ${model.epoch}` : "initial");
}

function renderTraining() {
  const model = state.embeddingModel;
  dom.lossLabel.textContent = model.losses.length ? `loss ${model.losses.at(-1).toFixed(3)}` : "not trained";
  const seconds = (model.durationMs / 1000).toFixed(2);
  dom.trainingStatus.textContent = `Done. Run ${model.run}: trained ${formatNumber(model.pairs.length)} word-neighborhood pairs for ${model.vocab.length} focus words in ${seconds}s. The map and neighbor list now use these vectors.`;
  dom.trainButton.disabled = false;
  dom.trainButton.textContent = "Retrain word vectors";
  renderLossRows(model.losses, model.epochs);
  renderTrainingDetails(model, "trained");
  renderWatchRows(model.watchRows, "trained");
}

function renderLossRows(losses, epochs) {
  dom.lossPanel.replaceChildren();
  if (!losses.length) {
    dom.lossPanel.append(notice(`Waiting for epoch 1 of ${epochs}.`));
    return;
  }
  const maxLoss = Math.max(...losses, 1);
  losses.forEach((loss, index) => {
    const row = document.createElement("div");
    row.className = "loss-row";
    const label = document.createElement("span");
    label.textContent = `epoch ${index + 1}`;
    const track = document.createElement("span");
    track.className = "loss-track";
    const fill = document.createElement("span");
    fill.style.width = `${clamp((loss / maxLoss) * 100, 4, 100)}%`;
    track.append(fill);
    const value = document.createElement("strong");
    value.textContent = loss.toFixed(3);
    row.append(label, track, value);
    dom.lossPanel.append(row);
  });
}

function renderTrainingDetails(model, stateLabel) {
  dom.trainingDetails.replaceChildren();
  [
    ["method", "skip-gram with negative sampling"],
    ["trained vocabulary", `${model.vocab.length} focus words`],
    ["context vocabulary", `${model.contextVocab.length} common context words`],
    ["numbers in each vector", `${model.dimensions}, chosen before training`],
    ["nearby window", `${model.windowSize} words left and right`],
    ["frequent-word thinning", model.keptTokens && model.streamTokens
      ? `kept ${formatNumber(model.keptTokens)} of ${formatNumber(model.streamTokens)} tokens`
      : "on, so common glue words crowd the windows less"],
    ["pair order", "reshuffled every epoch"],
    ["training passes", `${model.epochs} epochs (${model.trainingDepthLabel})`],
    ["negative examples", `${model.negativeSamples} made-up pairs per real pair`],
    ["training pairs", formatNumber(model.pairs.length)],
    ["state", stateLabel],
    ["map note", "PCA only draws the map; neighbors use full vectors"]
  ].forEach(([labelText, valueText]) => {
    const row = document.createElement("div");
    row.className = "detail-row";
    const label = document.createElement("span");
    label.textContent = labelText;
    const value = document.createElement("strong");
    value.textContent = valueText;
    row.append(label, value);
    dom.trainingDetails.append(row);
  });
}

function renderWatchRows(rows, label) {
  if (!dom.watchLabel || !dom.trainingWatch) return;
  dom.watchLabel.textContent = label;
  dom.trainingWatch.replaceChildren();
  if (!rows.length) {
    dom.trainingWatch.append(notice("No watch pairs were available in this corpus and text amount."));
    return;
  }
  rows.forEach((item) => {
    const row = document.createElement("div");
    row.className = "watch-row";
    const labelText = document.createElement("span");
    labelText.textContent = `${item.left} / ${item.right}`;
    const track = document.createElement("span");
    track.className = "watch-track";
    const fill = document.createElement("span");
    fill.style.width = `${clamp((item.similarity + 1) * 50, 3, 100)}%`;
    track.append(fill);
    const value = document.createElement("strong");
    value.textContent = item.similarity.toFixed(3);
    row.append(labelText, track, value);
    dom.trainingWatch.append(row);
  });
}

function nearestWords(word, limit = 8) {
  const model = state.embeddingModel;
  if (!model) {
    return {
      focus: word || "not trained",
      neighbors: [],
      note: "Train word vectors first."
    };
  }
  const id = model.idByWord.get(String(word));
  if (id === undefined) return { focus: word, neighbors: [] };
  const vector = model.vectors[id];
  return {
    focus: word,
    neighbors: model.vocab
      .filter((item) => item.id !== id)
      .map((item) => ({
        word: item.word,
        count: item.count,
        similarity: cosine(vector, model.vectors[item.id])
      }))
      .sort((a, b) => b.similarity - a.similarity || a.word.localeCompare(b.word))
      .slice(0, limit)
  };
}

function wordVector(word) {
  const model = state.embeddingModel;
  if (!model) return { word: word || "(none)", note: "Train word vectors above first.", vector: [] };
  const id = model.idByWord.get(String(word));
  if (id === undefined) return { word, note: "That word is not in the trained vocabulary.", vector: [] };
  const entry = model.vocab.find((item) => item.id === id);
  return {
    word,
    dimensions: model.dimensions,
    count: entry ? entry.count : 0,
    vector: Array.from(model.vectors[id], (n) => Number(n.toFixed(3)))
  };
}

function renderEmbeddingExplorer() {
  const model = state.embeddingModel;
  if (!model) {
    renderEmbeddingPlaceholder("No word vectors yet. Press Train word vectors above, then come back here.");
    return;
  }
  const focus = dom.focusWordSelect.value || model.vocab[0]?.word || "";
  const mapPoints = chooseMapPoints(model, focus);
  dom.embeddingMapLabel.textContent = `showing ${mapPoints.length} of ${model.vocab.length} focus words`;
  dom.embeddingMap.replaceChildren();
  const labeledWords = mapLabelWords(model, focus);
  mapPoints.forEach((point) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "embedding-point";
    button.title = point.word;
    button.dataset.word = point.word;
    if (point.word === focus) button.classList.add("is-selected");
    if (labeledWords.has(point.word)) button.classList.add("is-labeled");
    button.style.left = `${point.x}%`;
    button.style.top = `${point.y}%`;
    button.textContent = point.word;
    button.addEventListener("click", () => {
      dom.focusWordSelect.value = point.word;
      renderEmbeddingExplorer();
    });
    dom.embeddingMap.append(button);
  });
  window.requestAnimationFrame(resolveEmbeddingLabelCollisions);
  renderNearest(focus);
  renderAnalogy();
  renderComparison();
}

function mapLabelWords(model, focus) {
  return new Set([focus]);
}

function resolveEmbeddingLabelCollisions() {
  const labeled = Array.from(dom.embeddingMap.querySelectorAll(".embedding-point.is-labeled, .embedding-point.is-selected"))
    .sort((a, b) => Number(b.classList.contains("is-selected")) - Number(a.classList.contains("is-selected")));
  const kept = [];
  labeled.forEach((point) => {
    const rect = point.getBoundingClientRect();
    const overlaps = kept.some((keptRect) => (
      rect.left < keptRect.right + 4 &&
      rect.right + 4 > keptRect.left &&
      rect.top < keptRect.bottom + 4 &&
      rect.bottom + 4 > keptRect.top
    ));
    if (overlaps && !point.classList.contains("is-selected")) {
      point.classList.remove("is-labeled");
    } else {
      kept.push(rect);
    }
  });
}

function chooseMapPoints(model, focus) {
  const chosen = new Map();
  model.points.slice(0, 90).forEach((point) => chosen.set(point.word, point));
  const focusPoint = model.points.find((point) => point.word === focus);
  if (focusPoint) chosen.set(focusPoint.word, focusPoint);
  nearestWords(focus, 8).neighbors.forEach((neighbor) => {
    const point = model.points.find((item) => item.word === neighbor.word);
    if (point) chosen.set(point.word, point);
  });
  return Array.from(chosen.values()).slice(0, 100);
}

function renderNearest(focus) {
  const result = nearestWords(focus, 6);
  dom.nearestPanel.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = `Words used most like "${focus}"`;
  dom.nearestPanel.append(heading);
  if (!result.neighbors.length) {
    dom.nearestPanel.append(notice(result.note || "No nearby trained words were found for this word."));
    return;
  }
  result.neighbors.forEach((neighbor) => {
    const row = document.createElement("div");
    row.className = "neighbor-row";
    const label = document.createElement("span");
    label.textContent = neighbor.word;
    const track = document.createElement("span");
    track.className = "neighbor-track";
    const fill = document.createElement("span");
    fill.style.width = `${clamp((neighbor.similarity + 1) * 50, 3, 100)}%`;
    track.append(fill);
    const value = document.createElement("strong");
    value.textContent = neighbor.similarity.toFixed(3);
    row.append(label, track, value);
    dom.nearestPanel.append(row);
  });
  renderNeighborEvidence(focus, result.neighbors.slice(0, 4));
}

function renderNeighborEvidence(focus, neighbors) {
  const model = state.embeddingModel;
  if (!model) return;
  const focusClues = contextCluesForWord(focus, 8, [focus]);
  const box = document.createElement("div");
  box.className = "neighbor-evidence";
  const title = document.createElement("h3");
  title.textContent = "Why these neighbors?";
  const intro = document.createElement("p");
  intro.textContent = "The model is comparing nearby-word patterns, not dictionary definitions. These clues come from the context window used during training.";
  box.append(title, intro);

  const focusRow = document.createElement("div");
  focusRow.className = "context-clue-row";
  const focusLabel = document.createElement("strong");
  focusLabel.textContent = `${focus} often appeared near`;
  const focusList = document.createElement("span");
  focusList.textContent = focusClues.length
    ? focusClues.map((item) => item.word).join(", ")
    : "mostly common glue words in this small corpus";
  focusRow.append(focusLabel, focusList);
  box.append(focusRow);

  neighbors.forEach((neighbor) => {
    const shared = sharedContextClues(focus, neighbor.word, 5);
    const row = document.createElement("div");
    row.className = "context-clue-row";
    const label = document.createElement("strong");
    label.textContent = `${focus} + ${neighbor.word} share`;
    const value = document.createElement("span");
    value.textContent = shared.length
      ? shared.map((item) => item.word).join(", ")
      : "mostly broad structural context";
    row.append(label, value);
    box.append(row);
  });
  dom.nearestPanel.append(box);
}

function contextCluesForWord(word, limit = 8, excludeWords = []) {
  const model = state.embeddingModel;
  const id = model?.idByWord.get(String(word));
  if (id === undefined) return [];
  const profile = model.contextProfiles[id];
  const excluded = new Set(excludeWords.map((item) => String(item).toLowerCase()));
  return Array.from(profile.entries())
    .map(([contextId, count]) => ({ word: model.contextVocab[contextId].word, count }))
    .filter((item) => (
      !EMBEDDING_CONTEXT_HIDE_WORDS.has(item.word)
      && !excluded.has(item.word)
      && item.word.length > 2
    ))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit);
}

function sharedContextClues(left, right, limit = 5) {
  const model = state.embeddingModel;
  const leftId = model?.idByWord.get(String(left));
  const rightId = model?.idByWord.get(String(right));
  if (leftId === undefined || rightId === undefined) return [];
  const leftProfile = model.contextProfiles[leftId];
  const rightProfile = model.contextProfiles[rightId];
  const excluded = new Set([left, right].map((item) => String(item).toLowerCase()));
  return Array.from(leftProfile.entries())
    .filter(([contextId]) => rightProfile.has(contextId))
    .map(([contextId, leftCount]) => ({
      word: model.contextVocab[contextId].word,
      count: Math.min(leftCount, rightProfile.get(contextId))
    }))
    .filter((item) => (
      !EMBEDDING_CONTEXT_HIDE_WORDS.has(item.word)
      && !excluded.has(item.word)
      && item.word.length > 2
    ))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit);
}

function renderAnalogy() {
  const model = state.embeddingModel;
  if (!model) {
    dom.analogyPanel.replaceChildren(notice("Train word vectors first. Then try three words from the trained dropdown."));
    return;
  }
  const parts = dom.analogyInput.value.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  dom.analogyPanel.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "Vector math";
  if (parts.length < 3) {
    const note = document.createElement("p");
    note.textContent = "Optional. Enter three trained words, such as word A - word B + word C. Use words from the dropdown so the model has vectors for them.";
    dom.analogyPanel.append(title, note);
    return;
  }
  const [a, b, c] = parts;
  if (![a, b, c].every((word) => model.idByWord.has(word))) {
    const note = document.createElement("p");
    note.textContent = "At least one word was not trained for this corpus and text amount. Try words from the dropdown.";
    dom.analogyPanel.append(title, note);
    return;
  }
  const target = model.vectors[model.idByWord.get(a)].map((value, dim) => (
    value - model.vectors[model.idByWord.get(b)][dim] + model.vectors[model.idByWord.get(c)][dim]
  ));
  const blocked = new Set([a, b, c]);
  const result = model.vocab
    .filter((item) => !blocked.has(item.word))
    .map((item) => ({ word: item.word, similarity: cosine(target, model.vectors[item.id]) }))
    .sort((x, y) => y.similarity - x.similarity)[0];
  const code = document.createElement("code");
  code.textContent = `${a} - ${b} + ${c} -> ${result ? result.word : "no result"}`;
  const note = document.createElement("p");
  note.textContent = result
    ? `Similarity to the result is ${result.similarity.toFixed(3)}. Small corpora often produce rough or surprising analogies.`
    : "No result was available.";
  dom.analogyPanel.append(title, code, note);
}

// --- Side-by-side comparison with real pre-trained GloVe vectors ---
const COMPARE_WORDS = [
  "queen", "king", "cat", "dog", "mouse", "rabbit", "sister", "brother",
  "man", "woman", "garden", "water", "night", "book", "money", "house"
];

function gloveModel() {
  return (window.GLOVE_MINI && window.GLOVE_MINI.vectors) ? window.GLOVE_MINI : null;
}

function gloveNearest(word, limit = 6) {
  const g = gloveModel();
  if (!g || !g.vectors[word]) return [];
  const vec = g.vectors[word];
  return Object.keys(g.vectors)
    .filter((other) => other !== word)
    .map((other) => ({ word: other, similarity: cosine(vec, g.vectors[other]) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

function gloveAnalogy(a, b, c, limit = 3) {
  const g = gloveModel();
  if (!g) return { unavailable: true };
  if (!g.vectors[a] || !g.vectors[b] || !g.vectors[c]) return { missing: true };
  const target = g.vectors[a].map((value, dim) => value - g.vectors[b][dim] + g.vectors[c][dim]);
  const blocked = new Set([a, b, c]);
  return {
    results: Object.keys(g.vectors)
      .filter((word) => !blocked.has(word))
      .map((word) => ({ word, similarity: cosine(target, g.vectors[word]) }))
      .sort((x, y) => y.similarity - x.similarity)
      .slice(0, limit)
  };
}

function renderNeighborRows(container, neighbors, emptyText) {
  container.replaceChildren();
  if (!neighbors || !neighbors.length) {
    container.append(notice(emptyText));
    return;
  }
  neighbors.forEach((neighbor) => {
    const row = document.createElement("div");
    row.className = "neighbor-row";
    const word = document.createElement("span");
    word.textContent = neighbor.word;
    const track = document.createElement("span");
    track.className = "neighbor-track";
    const fill = document.createElement("span");
    fill.style.width = `${clamp(neighbor.similarity * 100, 2, 100)}%`;
    track.append(fill);
    const value = document.createElement("strong");
    value.textContent = neighbor.similarity.toFixed(2);
    row.append(word, track, value);
    container.append(row);
  });
}

function populateCompareWords() {
  if (!dom.compareWordSelect) return;
  const g = gloveModel();
  const previous = dom.compareWordSelect.value;
  const words = COMPARE_WORDS.filter((word) => g && g.vectors[word]);
  dom.compareWordSelect.replaceChildren();
  words.forEach((word) => {
    const option = document.createElement("option");
    option.value = word;
    option.textContent = word;
    dom.compareWordSelect.append(option);
  });
  if (words.includes(previous)) dom.compareWordSelect.value = previous;
}

function renderComparisonPlaceholder() {
  if (!dom.comparisonPanel) return;
  const g = gloveModel();
  if (!g) {
    dom.comparisonPanel.hidden = true;
    return;
  }
  dom.comparisonPanel.hidden = false;
  if (dom.compareTrained) dom.compareTrained.replaceChildren(notice("Pick a word or type an analogy to compare your model with GloVe."));
  if (dom.compareGlove) dom.compareGlove.replaceChildren(notice("Pick a word above to see GloVe's nearest neighbors."));
  if (dom.compareAnalogyResult) dom.compareAnalogyResult.textContent = "Type three words like king - man + woman to compare an analogy.";
}

function renderComparison() {
  if (!dom.comparisonPanel) return;
  const g = gloveModel();
  if (!g) {
    dom.comparisonPanel.hidden = true;
    return;
  }
  if (!state.hasComparedVectors) {
    renderComparisonPlaceholder();
    return;
  }
  dom.comparisonPanel.hidden = false;
  const word = dom.compareWordSelect.value || "queen";
  renderNeighborRows(dom.compareGlove, gloveNearest(word, 6), "Not in the curated GloVe slice.");
  const model = state.embeddingModel;
  if (model && model.idByWord.has(word)) {
    renderNeighborRows(
      dom.compareTrained,
      nearestWords(word, 6).neighbors.map((item) => ({ word: item.word, similarity: item.similarity })),
      "Not in the trained vocabulary."
    );
  } else {
    dom.compareTrained.replaceChildren(notice(
      model ? `"${word}" was not trained in this corpus.` : "Train word vectors above to fill this column."
    ));
  }
  renderComparisonAnalogy();
}

function renderComparisonAnalogy() {
  if (!dom.compareAnalogyResult) return;
  const parts = (dom.compareAnalogyInput.value || "").toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  dom.compareAnalogyResult.replaceChildren();
  if (parts.length < 3) {
    dom.compareAnalogyResult.textContent = "Enter three words, like king - man + woman.";
    return;
  }
  const [a, b, c] = parts;
  const glove = gloveAnalogy(a, b, c, 3);
  let gloveText;
  if (glove.unavailable) gloveText = "GloVe slice is unavailable.";
  else if (glove.missing) gloveText = `GloVe: one of ${a}, ${b}, ${c} is outside the curated slice.`;
  else gloveText = `GloVe (6B): ${a} - ${b} + ${c} -> ${glove.results.map((r) => `${r.word} (${r.similarity.toFixed(2)})`).join(", ")}`;
  const model = state.embeddingModel;
  let trainedText;
  if (model && [a, b, c].every((word) => model.idByWord.has(word))) {
    const target = model.vectors[model.idByWord.get(a)].map((value, dim) => (
      value - model.vectors[model.idByWord.get(b)][dim] + model.vectors[model.idByWord.get(c)][dim]
    ));
    const blocked = new Set([a, b, c]);
    const best = model.vocab
      .filter((item) => !blocked.has(item.word))
      .map((item) => ({ word: item.word, similarity: cosine(target, model.vectors[item.id]) }))
      .sort((x, y) => y.similarity - x.similarity)[0];
    trainedText = best ? `Your model: -> ${best.word} (${best.similarity.toFixed(2)})` : "Your model: no result.";
  } else {
    trainedText = model
      ? "Your model: one of these words is not in its small vocabulary."
      : "Your model: train it above first.";
  }
  const gloveLine = document.createElement("span");
  gloveLine.textContent = gloveText;
  const trainedLine = document.createElement("span");
  trainedLine.className = "compare-trained-line";
  trainedLine.textContent = trainedText;
  dom.compareAnalogyResult.append(gloveLine, document.createElement("br"), trainedLine);
}

function renderGradientPlaceholder() {
  dom.recurrentWeightLabel.textContent = Number(dom.recurrentWeightSlider.value).toFixed(2);
  dom.sequenceStepsLabel.textContent = String(Number(dom.sequenceStepsSlider.value));
  dom.gradientMode.textContent = "waiting";
  dom.gradientSummary.textContent = "Move the weight or step-count slider to watch the learning signal grow or shrink across time steps.";
  dom.gradientPanel.replaceChildren(notice("Move a slider above to chart how the signal changes step by step."));
}

function renderGradient() {
  if (!state.hasExploredGradient) {
    renderGradientPlaceholder();
    return;
  }
  const weight = Number(dom.recurrentWeightSlider.value);
  const steps = Number(dom.sequenceStepsSlider.value);
  dom.recurrentWeightLabel.textContent = weight.toFixed(2);
  dom.sequenceStepsLabel.textContent = String(steps);
  const final = Math.pow(Math.abs(weight), steps);
  const mode = weight < 0.95 ? "vanishing" : weight > 1.05 ? "exploding" : "stable";
  dom.gradientMode.textContent = mode;
  dom.gradientSummary.textContent = `After ${steps} steps, the learning signal becomes ${final.toExponential(2)} in this simple calculation. This is why LSTM and GRU gates mattered.`;
  dom.gradientPanel.replaceChildren();
  const maxValue = Math.max(1, ...Array.from({ length: steps }, (_, index) => Math.pow(Math.abs(weight), index + 1)));
  for (let index = 1; index <= steps; index += 1) {
    const value = Math.pow(Math.abs(weight), index);
    const row = document.createElement("div");
    row.className = "gradient-row";
    const label = document.createElement("span");
    label.textContent = `t-${index}`;
    const track = document.createElement("span");
    track.className = `gradient-track ${mode === "exploding" ? "exploding" : ""}`;
    const fill = document.createElement("span");
    fill.style.width = `${clamp((value / maxValue) * 100, 2, 100)}%`;
    track.append(fill);
    const strong = document.createElement("strong");
    strong.textContent = value < 0.001 || value > 999 ? value.toExponential(1) : value.toFixed(3);
    row.append(label, track, strong);
    dom.gradientPanel.append(row);
  }
}

function trainBpeModel(text, targetPieces = 90) {
  let sequences = wordTokensOnly(text).slice(0, 7000).map((word) => [...Array.from(word), "</w>"]);
  const basePieces = new Set(sequences.flat());
  const merges = [];
  const mergeLimit = Math.max(0, Math.min(160, Number(targetPieces) - basePieces.size));
  for (let step = 0; step < mergeLimit; step += 1) {
    const counts = new Map();
    sequences.forEach((sequence) => {
      for (let index = 0; index < sequence.length - 1; index += 1) {
        const pair = `${sequence[index]} ${sequence[index + 1]}`;
        counts.set(pair, (counts.get(pair) || 0) + 1);
      }
    });
    const best = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    if (!best || best[1] < 2) break;
    const [pair, count] = best;
    const [left, right] = pair.split(" ");
    const merged = `${left}${right}`;
    merges.push({ left, right, merged, pair: `${left} + ${right} -> ${merged.replace("</w>", "")}`, count });
    sequences = sequences.map((sequence) => mergePair(sequence, left, right, merged));
  }
  const pieces = new Set(basePieces);
  merges.forEach((merge) => pieces.add(merge.merged));
  return { merges, pieces };
}

function mergePair(sequence, left, right, merged) {
  const output = [];
  for (let index = 0; index < sequence.length; index += 1) {
    if (sequence[index] === left && sequence[index + 1] === right) {
      output.push(merged);
      index += 1;
    } else {
      output.push(sequence[index]);
    }
  }
  return output;
}

function encodeBpe(text, model) {
  return wordAndPunctuationTokens(text).flatMap((token) => {
    if (!/^[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?$/u.test(token)) return [token];
    let sequence = [...Array.from(token), "</w>"];
    model.merges.forEach((merge) => {
      sequence = mergePair(sequence, merge.left, merge.right, merge.merged);
    });
    return sequence.map((piece) => piece.replace("</w>", "")).filter(Boolean);
  });
}

function trainWordPieceModel(text, targetPieces) {
  const bpe = trainBpeModel(text, targetPieces);
  const vocab = new Set(["[UNK]"]);
  bpe.pieces.forEach((piece) => {
    const clean = piece.replace("</w>", "");
    if (clean) {
      vocab.add(clean);
      vocab.add(`##${clean}`);
    }
  });
  wordTokensOnly(text).forEach((word) => {
    if (word.length <= 8) vocab.add(word);
  });
  return { vocab, merges: bpe.merges };
}

function encodeWordPiece(text, model) {
  return wordAndPunctuationTokens(text).flatMap((token) => {
    if (!/^[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?$/u.test(token)) return [token];
    const chars = Array.from(token);
    const pieces = [];
    let start = 0;
    while (start < chars.length) {
      let end = chars.length;
      let found = "";
      while (end > start) {
        const piece = chars.slice(start, end).join("");
        const candidate = start === 0 ? piece : `##${piece}`;
        if (model.vocab.has(candidate)) {
          found = candidate;
          break;
        }
        end -= 1;
      }
      if (!found) return ["[UNK]"];
      pieces.push(found);
      start = end;
    }
    return pieces;
  });
}

function trainUnigramModel(text, targetPieces) {
  const counts = new Map();
  wordTokensOnly(text).slice(0, 7000).forEach((word) => {
    const chars = Array.from(word);
    for (let start = 0; start < chars.length; start += 1) {
      for (let end = start + 1; end <= Math.min(chars.length, start + 9); end += 1) {
        const piece = chars.slice(start, end).join("");
        counts.set(piece, (counts.get(piece) || 0) + 1);
      }
    }
  });
  const entries = Array.from(counts.entries())
    .sort((a, b) => b[1] * b[0].length - a[1] * a[0].length || a[0].localeCompare(b[0]))
    .slice(0, targetPieces);
  const total = entries.reduce((sum, [, count]) => sum + count, 0) || 1;
  const probs = new Map(entries.map(([piece, count]) => [piece, count / total]));
  Array.from("abcdefghijklmnopqrstuvwxyz0123456789").forEach((char) => {
    if (!probs.has(char)) probs.set(char, 1 / (total * 10));
  });
  return { probs, pieces: new Set(probs.keys()) };
}

function encodeUnigram(text, model) {
  return wordAndPunctuationTokens(text).flatMap((token) => {
    if (!/^[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?$/u.test(token)) return [token];
    const chars = Array.from(token);
    const best = Array(chars.length + 1).fill(Infinity);
    const back = Array(chars.length + 1).fill(null);
    best[0] = 0;
    for (let start = 0; start < chars.length; start += 1) {
      if (!Number.isFinite(best[start])) continue;
      for (let end = start + 1; end <= Math.min(chars.length, start + 9); end += 1) {
        const piece = chars.slice(start, end).join("");
        const prob = model.probs.get(piece);
        if (!prob) continue;
        const score = best[start] - Math.log(prob);
        if (score < best[end]) {
          best[end] = score;
          back[end] = { start, piece };
        }
      }
    }
    const pieces = [];
    let cursor = chars.length;
    while (cursor > 0 && back[cursor]) {
      pieces.unshift(back[cursor].piece);
      cursor = back[cursor].start;
    }
    return pieces.length ? pieces.map((piece, index) => (index ? `##${piece}` : piece)) : chars;
  });
}

function byteTokens(text) {
  return Array.from(new TextEncoder().encode(String(text))).map((byte) => `0x${byte.toString(16).padStart(2, "0")}`);
}

function characterTokens(text) {
  return Array.from(String(text)).map((char) => {
    if (char === " ") return "<space>";
    if (char === "\n") return "<newline>";
    if (char === "\t") return "<tab>";
    return char;
  });
}

function ensureTokenizerModels() {
  const targetPieces = Number(dom.tokenizerVocabSlider.value);
  if (state.tokenizerModels && state.tokenizerModels.targetPieces === targetPieces) return state.tokenizerModels;
  const trainingText = state.wordTokens.join(" ");
  state.tokenizerModels = {
    targetPieces,
    bpe: trainBpeModel(trainingText, targetPieces),
    wordpiece: trainWordPieceModel(trainingText, targetPieces),
    unigram: trainUnigramModel(trainingText, targetPieces)
  };
  return state.tokenizerModels;
}

function encodeWithCurrentAlgorithm(text) {
  const algorithm = dom.tokenizerAlgorithmSelect.value;
  const models = ensureTokenizerModels();
  if (algorithm === "bpe") return { tokens: encodeBpe(text, models.bpe), steps: models.bpe.merges, label: "BPE" };
  if (algorithm === "wordpiece") return { tokens: encodeWordPiece(text, models.wordpiece), steps: models.wordpiece.merges, label: "WordPiece-style" };
  if (algorithm === "unigram") return { tokens: encodeUnigram(text, models.unigram), steps: Array.from(models.unigram.probs.entries()).slice(0, 12).map(([pair, count]) => ({ pair, count: Math.round(count * 100000) })), label: "Unigram-style" };
  return { tokens: byteTokens(text), steps: [], label: "Byte-level UTF-8" };
}

function renderTokenizers() {
  renderBoundaryComparison();
  renderAlgorithm();
}

function renderBoundaryComparison() {
  const text = dom.tokenizerInput.value;
  const models = ensureTokenizerModels();
  const rows = [
    ["Words", wordAndPunctuationTokens(text)],
    ["Characters", characterTokens(text)],
    ["Bytes", byteTokens(text)],
    ["BPE", encodeBpe(text, models.bpe)]
  ];
  const max = Math.max(...rows.map(([, tokens]) => tokens.length), 1);
  dom.boundarySummary.textContent = `${Array.from(text).length} characters`;
  dom.boundaryPanel.replaceChildren();
  rows.forEach(([labelText, tokens]) => {
    const row = document.createElement("div");
    row.className = "boundary-row";
    const label = document.createElement("span");
    label.textContent = labelText;
    const track = document.createElement("span");
    track.className = "boundary-track";
    const fill = document.createElement("span");
    fill.style.width = `${clamp((tokens.length / max) * 100, 3, 100)}%`;
    track.append(fill);
    const strong = document.createElement("strong");
    strong.textContent = `${tokens.length} tokens`;
    row.append(label, track, strong);
    dom.boundaryPanel.append(row);
  });
}

function renderAlgorithm() {
  const targetPieces = Number(dom.tokenizerVocabSlider.value);
  dom.tokenizerVocabLabel.textContent = String(targetPieces);
  dom.tokenizerVocabLabel.value = String(targetPieces);
  state.tokenizerModels = null;
  const encoded = encodeWithCurrentAlgorithm(dom.tokenizerInput.value);
  dom.algorithmSummary.textContent = `${encoded.label} | ${encoded.tokens.length} tokens`;
  renderTokenChips(dom.algorithmTokens, encoded.tokens);
  dom.tokenizerTrainingPanel.replaceChildren();
  if (!encoded.steps.length) {
    const note = document.createElement("div");
    note.className = "detail-row";
    note.append(document.createTextNode("Byte-level encoding uses the UTF-8 bytes directly, so there are no learned merge steps."));
    dom.tokenizerTrainingPanel.append(note);
    return;
  }
  encoded.steps.slice(0, 12).forEach((step, index) => {
    const row = document.createElement("div");
    row.className = "merge-row";
    const label = document.createElement("span");
    label.textContent = `${index + 1}. ${step.pair}`;
    const count = document.createElement("strong");
    count.textContent = `x${formatNumber(step.count || 0)}`;
    row.append(label, count);
    dom.tokenizerTrainingPanel.append(row);
  });
}

function renderTokenChips(container, tokens) {
  container.replaceChildren();
  if (!tokens.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No tokens to show.";
    container.append(empty);
    return;
  }
  tokens.slice(0, 180).forEach((token) => {
    const chip = document.createElement("span");
    chip.className = "tokenizer-chip";
    if (String(token).startsWith("##")) chip.classList.add("continuation");
    if (String(token).startsWith("0x")) chip.classList.add("byte-token");
    chip.textContent = token;
    container.append(chip);
  });
  if (tokens.length > 180) {
    const chip = document.createElement("span");
    chip.className = "tokenizer-chip";
    chip.textContent = `+${tokens.length - 180} more`;
    container.append(chip);
  }
}

function renderEdges() {
  const item = edgeCases[dom.edgeCaseSelect.value] || edgeCases.multilingual;
  const encoded = encodeWithCurrentAlgorithm(item.text);
  dom.edgeCasePanel.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = item.title;
  const sample = document.createElement("pre");
  sample.className = "edge-sample";
  sample.textContent = item.text;
  const note = document.createElement("p");
  note.textContent = item.note;
  dom.edgeCasePanel.append(title, sample, note);
  dom.edgeCaseSummary.textContent = `${encoded.tokens.length} tokens`;
  renderTokenChips(dom.edgeCaseTokens, encoded.tokens);
  dom.edgeCaseWarnings.replaceChildren();
  warningsForText(item.text, item.warnings).forEach((warning) => {
    const p = document.createElement("p");
    p.textContent = warning;
    dom.edgeCaseWarnings.append(p);
  });
}

function warningsForText(text, warnings) {
  const output = [...warnings];
  if (/[\u200B-\u200D\uFEFF\u202A-\u202E]/u.test(text)) output.push("Hidden or directional Unicode controls detected.");
  if (/\n|\t| {2,}/.test(text)) output.push("Whitespace is present and can become meaningful model input.");
  if (/[^\x00-\x7F]/.test(text)) output.push("Non-ASCII characters may use multiple bytes or combining code points.");
  if (/\d/.test(text)) output.push("Numbers are text tokens here, not numeric computation.");
  return output;
}

function trainBpeAndEncode(text, targetPieces = 90) {
  const model = trainBpeModel(state.wordTokens.join(" "), targetPieces);
  const tokens = encodeBpe(text, model);
  return {
    algorithm: "BPE",
    learnedMerges: model.merges.length,
    tokens,
    firstMerges: model.merges.slice(0, 10).map((step) => ({ merge: step.pair, count: step.count }))
  };
}

function embeddingTrainingSummary() {
  const model = state.embeddingModel;
  if (!model) {
    return {
      status: "not trained yet",
      nextStep: "Press Train word vectors above.",
      corpus: getActiveCorpus().title,
      textAmount: `${formatNumber(state.wordTokens.length)} word tokens ready`,
      selectedTrainingDepth: trainingDepth().label
    };
  }
  return {
    status: "trained",
    method: "skip-gram with negative sampling",
    corpus: getActiveCorpus().title,
    trainedWords: model.vocab.length,
    contextWords: model.contextVocab.length,
    wordNeighborhoodPairs: model.pairs.length,
    numbersInEachVector: model.dimensions,
    vectorSizeChoice: "36 is a browser-demo hyperparameter",
    epochs: model.epochs,
    trainingDepth: model.trainingDepthLabel,
    negativeExamplesPerRealPair: model.negativeSamples,
    finalLoss: Number(model.losses.at(-1).toFixed(4))
  };
}

function makeApi() {
  return {
    focusWord: dom.focusWordSelect.value,
    nearestWords,
    wordVector,
    embeddingTrainingSummary
  };
}

async function runCodeCell(cell) {
  const input = cell.querySelector(".code-input");
  const output = cell.querySelector(".code-output");
  output.className = "code-output is-running";
  output.textContent = "Running...";
  try {
    const api = makeApi();
    const runner = new Function("api", `"use strict"; const { focusWord, nearestWords, wordVector, embeddingTrainingSummary } = api; return (async () => { ${input.value} })();`);
    const result = await runner(api);
    output.className = "code-output is-success";
    renderCodeResult(output, result);
  } catch (error) {
    output.className = "code-output is-error";
    output.textContent = `${error.name}: ${error.message}`;
  }
}

function renderCodeResult(output, result) {
  const visual = document.createElement("div");
  visual.className = "output-visual";
  if (result && Array.isArray(result.neighbors)) {
    appendMetrics(visual, [["focus", result.focus], ["neighbors", result.neighbors.length], ["state", result.note ? "not trained" : "trained vectors"]]);
    if (result.neighbors.length) {
      appendResultTable(visual, ["word", "count", "similarity"], result.neighbors.map((row) => [row.word, row.count, row.similarity.toFixed(3)]));
    } else {
      visual.append(notice(result.note || "No nearby words were found."));
    }
  } else if (result && Array.isArray(result.tokens)) {
    appendMetrics(visual, [["algorithm", result.algorithm], ["tokens", result.tokens.length], ["merges", result.learnedMerges || 0]]);
    const rail = document.createElement("div");
    rail.className = "tokenizer-chip-rail";
    result.tokens.slice(0, 80).forEach((token) => {
      const chip = document.createElement("span");
      chip.className = "tokenizer-chip";
      chip.textContent = token;
      rail.append(chip);
    });
    visual.append(rail);
    appendResultTable(visual, ["merge", "count"], (result.firstMerges || []).map((row) => [row.merge, row.count]));
  } else if (result && Array.isArray(result.vector)) {
    appendMetrics(visual, [["word", result.word], ["numbers per vector", result.dimensions || 0], ["times in corpus", result.count || 0]]);
    if (result.vector.length) {
      const wrap = document.createElement("div");
      wrap.className = "vector-readout";
      const code = document.createElement("code");
      code.textContent = `[ ${result.vector.join(", ")} ]`;
      wrap.append(code);
      visual.append(wrap);
    } else if (result.note) {
      visual.append(notice(result.note));
    }
  } else {
    appendMetrics(visual, Object.entries(result || {}).slice(0, 3));
    const pre = document.createElement("pre");
    pre.className = "output-raw-preview";
    pre.textContent = JSON.stringify(result, null, 2);
    visual.append(pre);
  }
  output.replaceChildren(visual);
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

function wireEvents() {
  dom.corpusSelect.addEventListener("change", () => {
    state.activeCorpusId = dom.corpusSelect.value;
    prepareCorpus();
  });
  dom.tokenBudgetSlider.addEventListener("input", () => prepareCorpus());
  dom.trainingDepthSelect.addEventListener("change", () => markEmbeddingSettingsChanged());
  dom.trainButton.addEventListener("click", () => startEmbeddingTraining());
  dom.contextCompareInput.addEventListener("input", () => { state.hasCheckedSparsity = true; renderSparsity(); });
  dom.contextCompareInput.addEventListener("focus", () => { state.hasCheckedSparsity = true; renderSparsity(); });
  dom.focusWordSelect.addEventListener("change", () => renderEmbeddingExplorer());
  dom.analogyInput.addEventListener("input", () => renderAnalogy());
  if (dom.compareWordSelect) dom.compareWordSelect.addEventListener("change", () => { state.hasComparedVectors = true; renderComparison(); });
  if (dom.compareAnalogyInput) dom.compareAnalogyInput.addEventListener("input", () => { state.hasComparedVectors = true; renderComparison(); });
  dom.recurrentWeightSlider.addEventListener("input", () => { state.hasExploredGradient = true; renderGradient(); });
  dom.sequenceStepsSlider.addEventListener("input", () => { state.hasExploredGradient = true; renderGradient(); });
  document.querySelectorAll(".chapter-code-cell .run-button").forEach((button) => {
    button.addEventListener("click", () => runCodeCell(button.closest(".chapter-code-cell")));
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
  corpora.forEach((corpus) => {
    const option = document.createElement("option");
    option.value = corpus.id;
    option.textContent = corpus.title;
    dom.corpusSelect.append(option);
  });
  dom.corpusSelect.value = state.activeCorpusId;
  wireEvents();
  prepareCorpus();
  renderGradientPlaceholder();
  populateCompareWords();
  renderComparisonPlaceholder();
  setupSectionSpy();
}

init();
