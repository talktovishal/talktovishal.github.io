// Chapter 6: making attention fast.
// Every panel is self-built, offline, and reveal-gated: nothing renders until the
// learner touches the control that drives it.

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function emptyState(text) {
  const el = document.createElement("div");
  el.className = "empty-state";
  el.textContent = text;
  return el;
}

function fmt(n) {
  return n.toLocaleString("en-US");
}

// Human-readable byte size, staying in binary units the way GPU memory is quoted.
function bytes(n) {
  const units = ["B", "KiB", "MiB", "GiB", "TiB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  const digits = v >= 100 ? 0 : v >= 10 ? 1 : 2;
  return `${v.toFixed(digits)} ${units[i]}`;
}

const state = {
  hasCost: false,
  hasKv: false,
  hasMem: false,
  hasShare: false,
  hasMask: false,
  hasMoe: false,
  tileStep: 0,
  tileStarted: false
};

const dom = {};
function grab(id) { return document.getElementById(id); }

// ---------------------------------------------------------------------------
// 1. The two costs: how the pair count grows
// ---------------------------------------------------------------------------

const COST_REFERENCE = [
  { label: "1K tokens", n: 1024 },
  { label: "8K tokens", n: 8192 },
  { label: "32K tokens", n: 32768 },
  { label: "128K tokens", n: 131072 }
];

function pairCount(n) {
  return (n * (n + 1)) / 2;
}

function renderCost() {
  const n = Number(dom.ctxLen.value);
  dom.ctxLenLabel.textContent = fmt(n);
  const el = dom.costGrid;
  if (!el) return;
  el.replaceChildren();
  if (!state.hasCost) {
    el.append(emptyState("Move the context-length slider to compare the number of attention scores."));
    return;
  }
  dom.costPill.textContent = `${fmt(n)} tokens`;

  const rows = COST_REFERENCE.map((ref) => ({ ...ref, current: false }));
  rows.push({ label: "Your setting", n, current: true });
  const maxLog = Math.log10(pairCount(131072));

  rows.forEach((row) => {
    const scores = pairCount(row.n);
    const wrap = document.createElement("div");
    wrap.className = `cost-row${row.current ? " is-current" : ""}`;
    const label = document.createElement("span");
    label.className = "cost-label";
    label.textContent = row.current ? `${row.label} (${fmt(row.n)})` : row.label;
    const track = document.createElement("span");
    track.className = "cost-track";
    const fill = document.createElement("span");
    fill.className = "cost-fill";
    fill.style.width = `${clamp((Math.log10(scores) / maxLog) * 100, 3, 100)}%`;
    track.append(fill);
    const value = document.createElement("strong");
    value.className = "cost-value";
    value.textContent = `${fmt(Math.round(scores))} scores`;
    wrap.append(label, track, value);
    el.append(wrap);
  });

  const note = document.createElement("p");
  note.className = "microcopy";
  const doubled = pairCount(n * 2) / pairCount(n);
  note.innerHTML = `At ${fmt(n)} tokens one head computes about <strong>${fmt(Math.round(pairCount(n)))}</strong> scores per pass. Doubling the context to ${fmt(n * 2)} would multiply that by about <strong>${doubled.toFixed(1)}&times;</strong>, not by 2.`;
  el.append(note);
}

// ---------------------------------------------------------------------------
// 2. KV cache: work saved, then memory owed
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
    val.textContent = `${fmt(units)} units`;
    row.append(name, track, val);
    return row;
  };
  el.append(makeRow("Without cache", noCache, !cacheOn, "nocache"));
  el.append(makeRow("With KV cache", withCache, cacheOn, "cache"));
  const summary = document.createElement("p");
  summary.className = "microcopy kv-summary";
  const ratio = (noCache / withCache).toFixed(1);
  summary.innerHTML = `For ${n} tokens, the cache does about <strong>${ratio}&times; less work</strong>. Without it, the total grows with the square of the length; with it, it grows in a straight line.`;
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
    note.className = "kv-trace-note microcopy";
    note.textContent = `Only the first ${shown} steps are shown, but the pattern continues through all ${n} generated tokens.`;
    trace.append(note);
  }
}

const HEAD_DIM = 128;
const BYTES_PER_NUMBER = 2;

function renderKvMemory() {
  const layers = Number(dom.memLayers.value);
  const kvHeads = Number(dom.memKvHeads.value);
  const seq = Number(dom.memSeq.value);
  dom.memLayersLabel.textContent = String(layers);
  dom.memKvHeadsLabel.textContent = String(kvHeads);
  dom.memSeqLabel.textContent = fmt(seq);

  const el = dom.memLedger;
  if (!el) return;
  el.replaceChildren();
  if (!state.hasMem) {
    el.append(emptyState("Move any slider above to price out the cache."));
    return;
  }
  dom.memPill.textContent = `${fmt(seq)} tokens`;

  const perToken = 2 * layers * kvHeads * HEAD_DIM * BYTES_PER_NUMBER;
  const total = perToken * seq;

  const rows = [
    ["Key and value vectors", "2"],
    ["Layers", fmt(layers)],
    ["Key/value heads", fmt(kvHeads)],
    ["Dimensions per head", fmt(HEAD_DIM)],
    ["Bytes per number", String(BYTES_PER_NUMBER)],
    ["Bytes per token", bytes(perToken)],
    ["Sequence length", `${fmt(seq)} tokens`]
  ];
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "mem-row";
    const name = document.createElement("span");
    name.textContent = label;
    const val = document.createElement("strong");
    val.textContent = value;
    row.append(name, val);
    el.append(row);
  });

  const totalRow = document.createElement("div");
  totalRow.className = "mem-row is-total";
  const totalName = document.createElement("span");
  totalName.textContent = "Cache for one conversation";
  const totalVal = document.createElement("strong");
  totalVal.textContent = bytes(total);
  totalRow.append(totalName, totalVal);
  el.append(totalRow);

  const note = document.createElement("p");
  note.className = "microcopy";
  const eight = bytes(total * 8);
  note.innerHTML = `That is for <em>one</em> user. Serving eight conversations at this length at once needs about <strong>${eight}</strong> of cache before you have stored a single model weight.`;
  el.append(note);
}

// ---------------------------------------------------------------------------
// 3. Grouped-query attention: which heads share a KV set
// ---------------------------------------------------------------------------

const QUERY_HEADS = 32;

function renderHeadShare() {
  const requested = Number(dom.kvGroups.value);
  // Only divisors of the head count give evenly sized groups, which is what real
  // implementations require.
  const divisors = [];
  for (let d = 1; d <= QUERY_HEADS; d += 1) {
    if (QUERY_HEADS % d === 0) divisors.push(d);
  }
  const groups = divisors.reduce((best, d) =>
    Math.abs(d - requested) < Math.abs(best - requested) ? d : best, divisors[0]);
  dom.kvGroupsLabel.textContent = String(groups);

  const el = dom.headShare;
  if (!el) return;
  el.replaceChildren();
  if (!state.hasShare) {
    el.append(emptyState("Move the group slider to see which query heads share a key/value set."));
    return;
  }

  let name = "grouped-query attention";
  if (groups === QUERY_HEADS) name = "plain multi-head attention";
  else if (groups === 1) name = "multi-query attention";
  dom.sharePill.textContent = name;

  const perGroup = QUERY_HEADS / groups;
  const strip = document.createElement("div");
  strip.className = "head-share-strip";
  for (let h = 0; h < QUERY_HEADS; h += 1) {
    const group = Math.floor(h / perGroup);
    const chip = document.createElement("div");
    chip.className = "head-chip";
    chip.dataset.group = String(group % 4);
    const title = document.createElement("strong");
    title.textContent = `Q${h + 1}`;
    const sub = document.createElement("span");
    sub.textContent = `KV${group + 1}`;
    chip.append(title, sub);
    strip.append(chip);
  }
  el.append(strip);

  const ledger = document.createElement("div");
  ledger.className = "mem-ledger";
  const saving = QUERY_HEADS / groups;
  [
    ["Query heads", fmt(QUERY_HEADS)],
    ["Key/value sets stored", fmt(groups)],
    ["Query heads per set", fmt(perGroup)],
    ["Cache size vs multi-head", `${saving.toFixed(saving < 10 ? 1 : 0)}\u00d7 smaller`]
  ].forEach(([label, value], index, arr) => {
    const row = document.createElement("div");
    row.className = `mem-row${index === arr.length - 1 ? " is-total" : ""}`;
    const n = document.createElement("span");
    n.textContent = label;
    const v = document.createElement("strong");
    v.textContent = value;
    row.append(n, v);
    ledger.append(row);
  });
  el.append(ledger);

  const note = document.createElement("p");
  note.className = "microcopy";
  note.innerHTML = `This is <strong>${name}</strong>. All ${QUERY_HEADS} query heads still compute their own scores and their own blend; only the number of key/value sets they read from has changed.`;
  el.append(note);
}

// ---------------------------------------------------------------------------
// 4. Sliding window: comparing mask shapes
// ---------------------------------------------------------------------------

const MASK_TOKENS = ["Sarah", "fed", "the", "cat", "because", "it", "was", "hungry"];

function buildMaskGrid(windowSize) {
  const n = MASK_TOKENS.length;
  const grid = document.createElement("div");
  grid.className = "mask-grid";
  grid.style.gridTemplateColumns = `repeat(${n}, 15px)`;
  let visible = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const cell = document.createElement("div");
      const causal = j <= i;
      const inWindow = windowSize === null || i - j < windowSize;
      let cls = "mask-cell";
      if (causal && inWindow) {
        cls += j === i ? " is-self" : " is-on";
        visible += 1;
      }
      cell.className = cls;
      grid.append(cell);
    }
  }
  return { grid, visible };
}

function renderMaskCompare() {
  const w = Number(dom.winSize.value);
  dom.winSizeLabel.textContent = String(w);
  const el = dom.maskCompare;
  if (!el) return;
  el.replaceChildren();
  if (!state.hasMask) {
    el.append(emptyState("Move the window slider to compare the two mask shapes."));
    return;
  }
  dom.maskPill.textContent = `window ${w}`;

  const full = buildMaskGrid(null);
  const windowed = buildMaskGrid(w);

  const card = (title, body, built) => {
    const wrap = document.createElement("div");
    wrap.className = "mask-card";
    const h = document.createElement("h4");
    h.textContent = title;
    const p = document.createElement("p");
    p.textContent = body;
    wrap.append(h, built.grid, p);
    return wrap;
  };

  el.append(card(
    "Full causal attention",
    `${full.visible} pairs scored. Every token sees the whole past, so the filled area is a triangle that keeps growing.`,
    full
  ));
  el.append(card(
    `Sliding window (w = ${w})`,
    `${windowed.visible} pairs scored. Each token sees at most ${w} token${w === 1 ? "" : "s"} back, so the filled area is a band of constant width.`,
    windowed
  ));

  const note = document.createElement("p");
  note.className = "microcopy";
  const pct = ((1 - windowed.visible / full.visible) * 100).toFixed(0);
  note.innerHTML = `On this eight-token toy the window skips <strong>${pct}%</strong> of the pairs. On a 100,000-token prompt with a 1,024-token window it skips over 98% of them, which is the whole point.`;
  el.append(note);
}

// ---------------------------------------------------------------------------
// 5. FlashAttention: streaming softmax over tiles
// ---------------------------------------------------------------------------

const TILE_SCORES = [
  [0.4, 1.1],
  [3.2, 0.7],
  [1.5, 2.0]
];

function renderTiles() {
  const strip = dom.tileStrip;
  const running = dom.tileRunning;
  if (!strip || !running) return;
  strip.replaceChildren();
  running.replaceChildren();

  if (!state.tileStarted) {
    strip.append(emptyState("Press \u201cNext tile\u201d to stream the softmax one tile at a time."));
    dom.tilePill.textContent = "press Next";
    return;
  }

  dom.tilePill.textContent = state.tileStep >= TILE_SCORES.length
    ? "all tiles seen"
    : `tile ${state.tileStep + 1} of ${TILE_SCORES.length}`;

  // Replay the online-softmax recurrence up to the current step.
  let runMax = -Infinity;
  let runSum = 0;
  const history = [];
  for (let t = 0; t < state.tileStep; t += 1) {
    const tile = TILE_SCORES[t];
    const tileMax = Math.max(...tile);
    const newMax = Math.max(runMax, tileMax);
    const rescale = runMax === -Infinity ? 0 : Math.exp(runMax - newMax);
    const rescaledSum = runSum * rescale;
    const tileSum = tile.reduce((s, v) => s + Math.exp(v - newMax), 0);
    history.push({ tile, tileMax, prevMax: runMax, newMax, rescale, rescaledSum, tileSum });
    runMax = newMax;
    runSum = rescaledSum + tileSum;
  }

  TILE_SCORES.forEach((tile, index) => {
    const block = document.createElement("div");
    const isActive = index === state.tileStep - 1;
    const isDone = index < state.tileStep - 1;
    block.className = `tile-block${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`;
    const label = document.createElement("strong");
    label.textContent = `Tile ${index + 1}`;
    const scores = document.createElement("span");
    scores.textContent = tile.map((v) => v.toFixed(1)).join(", ");
    const status = document.createElement("span");
    status.textContent = index < state.tileStep ? "in fast memory" : "not read yet";
    block.append(label, scores, status);
    strip.append(block);
  });

  if (state.tileStep === 0) {
    running.append(emptyState("No tile read yet. The running maximum and running sum both start empty."));
    return;
  }

  const last = history[history.length - 1];
  const rows = [
    ["Largest score in this tile", last.tileMax.toFixed(2)],
    ["Running maximum before", last.prevMax === -Infinity ? "none yet" : last.prevMax.toFixed(2)],
    ["Running maximum now", last.newMax.toFixed(2)],
    ["Rescale factor applied to the old sum", last.prevMax === -Infinity ? "n/a (first tile)" : last.rescale.toFixed(4)],
    ["Old sum after rescaling", last.rescaledSum.toFixed(4)],
    ["This tile's contribution", last.tileSum.toFixed(4)]
  ];
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "mem-row";
    const n = document.createElement("span");
    n.textContent = label;
    const v = document.createElement("strong");
    v.textContent = value;
    row.append(n, v);
    running.append(row);
  });

  const totalRow = document.createElement("div");
  totalRow.className = "mem-row is-total";
  const tn = document.createElement("span");
  tn.textContent = "Running sum of exponentials";
  const tv = document.createElement("strong");
  tv.textContent = runSum.toFixed(4);
  totalRow.append(tn, tv);
  running.append(totalRow);

  const note = document.createElement("p");
  note.className = "microcopy";
  if (state.tileStep >= TILE_SCORES.length) {
    // The check that makes the "exact, not approximate" claim inspectable.
    const allScores = TILE_SCORES.flat();
    const trueMax = Math.max(...allScores);
    const trueSum = allScores.reduce((s, v) => s + Math.exp(v - trueMax), 0);
    note.innerHTML = `All tiles seen. The streamed sum is <strong>${runSum.toFixed(4)}</strong>; computing the softmax denominator in one shot over all six scores gives <strong>${trueSum.toFixed(4)}</strong>. Identical, and we never held more than two scores at a time.`;
  } else if (last.prevMax !== -Infinity && last.tileMax > last.prevMax) {
    note.innerHTML = `This tile contained a bigger score than anything seen before, so everything accumulated so far was rescaled by <strong>${last.rescale.toFixed(4)}</strong> to keep the comparison fair. That rescaling is the trick that makes streaming exact.`;
  } else {
    note.textContent = "This tile brought no new maximum, so the running total simply absorbed its contribution.";
  }
  running.append(note);
}

// ---------------------------------------------------------------------------
// 6. Mixture of experts: active vs total
// ---------------------------------------------------------------------------

function renderMoe() {
  const experts = Number(dom.moeExperts.value);
  const topK = Math.min(Number(dom.moeTopK.value), experts);
  const shared = dom.moeShared.checked;
  dom.moeExpertsLabel.textContent = String(experts);
  dom.moeTopKLabel.textContent = String(topK);

  const grid = dom.moeGrid;
  const summary = dom.moeSummary;
  if (!grid || !summary) return;
  grid.replaceChildren();
  summary.replaceChildren();

  if (!state.hasMoe) {
    grid.append(emptyState("Move a slider or flip the shared-expert toggle to route a token."));
    return;
  }
  dom.moePill.textContent = `${topK} of ${experts} active`;

  // A fixed pseudo-random pick so the routing looks like a real router's choice
  // but stays stable while the learner reads it.
  const picked = new Set();
  let seed = experts * 7919 + topK * 104729;
  while (picked.size < topK) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    picked.add(seed % experts);
  }

  if (shared) {
    const chip = document.createElement("div");
    chip.className = "moe-expert is-shared";
    chip.textContent = "S";
    chip.title = "Shared expert: always active";
    grid.append(chip);
  }
  for (let i = 0; i < experts; i += 1) {
    const chip = document.createElement("div");
    const on = picked.has(i);
    chip.className = `moe-expert${on ? " is-active" : ""}`;
    chip.textContent = String(i + 1);
    chip.title = on ? "Selected by the router for this token" : "Idle for this token";
    grid.append(chip);
  }

  const totalUnits = experts + (shared ? 1 : 0);
  const activeUnits = topK + (shared ? 1 : 0);
  const pct = (activeUnits / totalUnits) * 100;
  [
    ["Expert networks stored", fmt(totalUnits)],
    ["Experts run for this token", fmt(activeUnits)],
    ["Share of feed-forward parameters used", `${pct.toFixed(1)}%`],
    ["Capacity gained for the same per-token work", `${(totalUnits / activeUnits).toFixed(1)}\u00d7`]
  ].forEach(([label, value], index, arr) => {
    const row = document.createElement("div");
    row.className = `mem-row${index === arr.length - 1 ? " is-total" : ""}`;
    const n = document.createElement("span");
    n.textContent = label;
    const v = document.createElement("strong");
    v.textContent = value;
    row.append(n, v);
    summary.append(row);
  });

  const note = document.createElement("p");
  note.className = "microcopy";
  note.innerHTML = `Memory still has to hold all ${fmt(totalUnits)} experts. What shrinks is the compute per token: only <strong>${pct.toFixed(1)}%</strong> of these parameters do any work on this particular token.`;
  summary.append(note);
}

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------

function reveal(flag, render) {
  return () => {
    state[flag] = true;
    render();
  };
}

function init() {
  [
    "ctxLen", "ctxLenLabel", "costGrid", "costPill",
    "kvTokens", "kvTokensLabel", "kvCacheToggle", "kvStatusPill", "kvCompare", "kvTrace",
    "memLayers", "memLayersLabel", "memKvHeads", "memKvHeadsLabel", "memSeq", "memSeqLabel",
    "memLedger", "memPill",
    "kvGroups", "kvGroupsLabel", "headShare", "sharePill",
    "winSize", "winSizeLabel", "maskCompare", "maskPill",
    "tileStrip", "tileRunning", "tilePill", "tileBackBtn", "tileNextBtn", "tileResetBtn",
    "moeExperts", "moeExpertsLabel", "moeTopK", "moeTopKLabel", "moeShared",
    "moeGrid", "moeSummary", "moePill"
  ].forEach((id) => { dom[id] = grab(id); });

  if (dom.ctxLen) {
    dom.ctxLen.addEventListener("input", reveal("hasCost", renderCost));
    renderCost();
  }

  if (dom.kvTokens) {
    dom.kvTokens.addEventListener("input", reveal("hasKv", renderKvCache));
    dom.kvCacheToggle.addEventListener("change", reveal("hasKv", renderKvCache));
    renderKvCache();
  }

  if (dom.memLayers) {
    [dom.memLayers, dom.memKvHeads, dom.memSeq].forEach((el) => {
      el.addEventListener("input", reveal("hasMem", renderKvMemory));
    });
    renderKvMemory();
  }

  if (dom.kvGroups) {
    dom.kvGroups.addEventListener("input", reveal("hasShare", renderHeadShare));
    renderHeadShare();
  }

  if (dom.winSize) {
    dom.winSize.addEventListener("input", reveal("hasMask", renderMaskCompare));
    renderMaskCompare();
  }

  if (dom.tileNextBtn) {
    dom.tileNextBtn.addEventListener("click", () => {
      state.tileStarted = true;
      state.tileStep = Math.min(state.tileStep + 1, TILE_SCORES.length);
      renderTiles();
    });
    dom.tileBackBtn.addEventListener("click", () => {
      state.tileStarted = true;
      state.tileStep = Math.max(state.tileStep - 1, 0);
      renderTiles();
    });
    dom.tileResetBtn.addEventListener("click", () => {
      state.tileStarted = false;
      state.tileStep = 0;
      renderTiles();
    });
    renderTiles();
  }

  if (dom.moeExperts) {
    [dom.moeExperts, dom.moeTopK].forEach((el) => {
      el.addEventListener("input", reveal("hasMoe", renderMoe));
    });
    dom.moeShared.addEventListener("change", reveal("hasMoe", renderMoe));
    renderMoe();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
