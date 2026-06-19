// Chapter 3: Tokenization. Self-contained logic for the boundary comparison,
// trained tokenizer algorithms (BPE, WordPiece-style, Unigram-style, byte-level),
// and the edge-case inspector. Tokenizers are trained in the browser on a real
// public-domain corpus so the merges and pieces are genuine, not faked.

const fallbackCorpus = {
  id: "fallback",
  title: "Small fallback corpus",
  text: [
    "Tokenization turns text into pieces a model can read.",
    "Common words stay whole while rare words split into smaller chunks.",
    "Subword tokenizers learn their pieces from a training corpus."
  ].join(" ")
};

const corpora = Array.isArray(window.LESSON_CORPORA) && window.LESSON_CORPORA.length
  ? window.LESSON_CORPORA
  : [fallbackCorpus];

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
  corpusSelect: document.getElementById("tokenizerCorpusSelect"),
  corpusStats: document.getElementById("tokenizerCorpusStats"),
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
  edgeCaseWarnings: document.getElementById("edgeCaseWarnings")
};

const state = {
  activeCorpusId: corpora[0].id,
  wordTokens: [],
  tokenizerModels: null,
  hasExploredBoundary: false
};

// --- tokenization helpers ---

function wordAndPunctuationTokens(text) {
  const pattern = /[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?|[^\s]/gu;
  return String(text).toLowerCase().match(pattern) || [];
}

function wordTokensOnly(text) {
  return wordAndPunctuationTokens(text).filter((token) => /^[\p{L}\p{N}]+(?:[\u0027\u2019][\p{L}\p{N}]+)?$/u.test(token));
}

function formatNumber(value) {
  return Number(value).toLocaleString("en-US");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function notice(text) {
  const item = document.createElement("div");
  item.className = "empty-state";
  item.textContent = text;
  return item;
}

function getActiveCorpus() {
  return corpora.find((corpus) => corpus.id === state.activeCorpusId) || corpora[0];
}

function prepareCorpus() {
  const corpus = getActiveCorpus();
  // A few thousand word tokens is plenty to train a small, responsive tokenizer.
  state.wordTokens = wordTokensOnly(corpus.text || "").slice(0, 8000);
  state.tokenizerModels = null;
  renderCorpusStats();
}

function renderCorpusStats() {
  if (!dom.corpusStats) return;
  const corpus = getActiveCorpus();
  const uniquePieces = new Set(state.wordTokens).size;
  dom.corpusStats.replaceChildren();
  [
    [corpus.title || "corpus", "training corpus"],
    [formatNumber(state.wordTokens.length), "word tokens used"],
    [formatNumber(uniquePieces), "distinct words"]
  ].forEach(([value, label]) => {
    const item = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = value;
    const span = document.createElement("span");
    span.textContent = label;
    item.append(strong, span);
    dom.corpusStats.append(item);
  });
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

function encodeAlgo(algorithm, text) {
  const models = ensureTokenizerModels();
  if (algorithm === "bpe") return { tokens: encodeBpe(text, models.bpe), steps: models.bpe.merges, label: "BPE" };
  if (algorithm === "wordpiece") return { tokens: encodeWordPiece(text, models.wordpiece), steps: models.wordpiece.merges, label: "WordPiece-style" };
  if (algorithm === "unigram") return { tokens: encodeUnigram(text, models.unigram), steps: Array.from(models.unigram.probs.entries()).slice(0, 12).map(([pair, count]) => ({ pair, count: Math.round(count * 100000) })), label: "Unigram-style" };
  return { tokens: byteTokens(text), steps: [], label: "Byte-level UTF-8" };
}

function encodeWithCurrentAlgorithm(text) {
  return encodeAlgo(dom.tokenizerAlgorithmSelect.value || "bpe", text);
}

function compareAlgorithms(text) {
  return ["bpe", "wordpiece", "unigram", "byte"].map((algorithm) => {
    const encoded = encodeAlgo(algorithm, text);
    return { algorithm: encoded.label, tokens: encoded.tokens.length };
  });
}

function renderTokenizers() {
  renderBoundaryComparison();
  renderAlgorithm();
}

function renderBoundaryComparison() {
  const text = dom.tokenizerInput.value;
  if (!state.hasExploredBoundary) {
    dom.boundarySummary.textContent = "click the text box";
    dom.boundaryPanel.replaceChildren(notice("Click into the text box above (or edit it) to compare how words, characters, bytes, and BPE split it."));
    return;
  }
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
  if (!dom.tokenizerAlgorithmSelect.value) {
    dom.algorithmSummary.textContent = "choose an algorithm";
    dom.algorithmTokens.replaceChildren(notice("Choose a tokenizer algorithm above to see how it splits the text."));
    dom.tokenizerTrainingPanel.replaceChildren(notice("Choose an algorithm to see the merge or vocabulary steps it learns."));
    return;
  }
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
    container.append(notice("No tokens to show."));
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
  if (!dom.edgeCaseSelect.value) {
    dom.edgeCasePanel.replaceChildren(notice("Choose an edge case above to inspect how the tokenizer handles it."));
    dom.edgeCaseSummary.textContent = "choose a case";
    dom.edgeCaseTokens.replaceChildren();
    dom.edgeCaseWarnings.replaceChildren();
    return;
  }
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
  dom.edgeCaseSummary.textContent = `${encoded.label} | ${encoded.tokens.length} tokens`;
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

// --- runnable code cells ---

function makeApi() {
  return {
    tokenizerText: dom.tokenizerInput.value,
    trainBpeAndEncode,
    encodeText: (text) => encodeWithCurrentAlgorithm(String(text)),
    compareAlgorithms: (text) => compareAlgorithms(String(text ?? dom.tokenizerInput.value))
  };
}

async function runCodeCell(cell) {
  const input = cell.querySelector(".code-input");
  const output = cell.querySelector(".code-output");
  output.className = "code-output is-running";
  output.textContent = "Running...";
  try {
    const api = makeApi();
    const runner = new Function("api", `"use strict"; const { tokenizerText, trainBpeAndEncode, encodeText, compareAlgorithms } = api; return (async () => { ${input.value} })();`);
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
  if (Array.isArray(result)) {
    const cols = result.length ? Object.keys(result[0]) : [];
    appendResultTable(visual, cols, result.map((row) => cols.map((col) => row[col])));
  } else if (result && Array.isArray(result.tokens)) {
    appendMetrics(visual, [["algorithm", result.algorithm || result.label || "tokens"], ["tokens", result.tokens.length], ["merges", result.learnedMerges || 0]]);
    const rail = document.createElement("div");
    rail.className = "tokenizer-chip-rail";
    result.tokens.slice(0, 80).forEach((token) => {
      const chip = document.createElement("span");
      chip.className = "tokenizer-chip";
      if (String(token).startsWith("##")) chip.classList.add("continuation");
      if (String(token).startsWith("0x")) chip.classList.add("byte-token");
      chip.textContent = token;
      rail.append(chip);
    });
    visual.append(rail);
    appendResultTable(visual, ["merge", "count"], (result.firstMerges || []).map((row) => [row.merge, row.count]));
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

// --- wiring ---

function populateCorpusSelect() {
  if (!dom.corpusSelect) return;
  dom.corpusSelect.replaceChildren();
  corpora.forEach((corpus) => {
    const option = document.createElement("option");
    option.value = corpus.id;
    option.textContent = corpus.title || corpus.id;
    dom.corpusSelect.append(option);
  });
  dom.corpusSelect.value = state.activeCorpusId;
}

function wireEvents() {
  if (dom.corpusSelect) {
    dom.corpusSelect.addEventListener("change", () => {
      state.activeCorpusId = dom.corpusSelect.value;
      prepareCorpus();
      renderTokenizers();
      renderEdges();
    });
  }
  dom.tokenizerInput.addEventListener("focus", () => {
    state.hasExploredBoundary = true;
    renderTokenizers();
  });
  dom.tokenizerInput.addEventListener("input", () => {
    state.hasExploredBoundary = true;
    renderTokenizers();
  });
  dom.tokenizerAlgorithmSelect.addEventListener("change", () => {
    renderAlgorithm();
    renderEdges();
  });
  dom.tokenizerVocabSlider.addEventListener("input", () => {
    state.tokenizerModels = null;
    renderTokenizers();
    renderEdges();
  });
  dom.edgeCaseSelect.addEventListener("change", () => renderEdges());
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
  populateCorpusSelect();
  prepareCorpus();
  wireEvents();
  renderTokenizers();
  renderEdges();
  setupSectionSpy();
}

init();
