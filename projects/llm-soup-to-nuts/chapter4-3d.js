export function createTrainingModel(source) {
  return {
    input: source.inputs.map(item => item.value),
    w1: source.hiddenWeights.map(row => row.slice()),
    b1: source.hiddenBias.slice(),
    w2: source.words.map(item => item.weights.slice()),
    b2: source.words.map(item => item.bias),
    words: source.words.map(item => item.word),
    target: source.words.findIndex(item => item.word === source.targetWord)
  };
}

export function evaluateTrainingModel(model) {
  const raw = model.b1.map((bias, hiddenIndex) => bias + model.input.reduce(
    (sum, value, inputIndex) => sum + value * model.w1[inputIndex][hiddenIndex], 0));
  const hidden = raw.map(value => Math.max(0, value));
  const logits = model.w2.map((weights, wordIndex) => model.b2[wordIndex]
    + weights.reduce((sum, weight, hiddenIndex) => sum + weight * hidden[hiddenIndex], 0));
  const maximum = Math.max(...logits);
  const exponentials = logits.map(value => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  const probabilities = exponentials.map(value => value / total);
  const loss = maximum + Math.log(total) - logits[model.target];
  const outputGradient = probabilities.map((value, index) => value - Number(index === model.target));
  const contributions = model.w2.map((weights, wordIndex) => weights.map(weight => weight * outputGradient[wordIndex]));
  const arriving = hidden.map((_, hiddenIndex) => contributions.reduce((sum, row) => sum + row[hiddenIndex], 0));
  const gate = raw.map(value => Number(value > 0));
  const delta = arriving.map((value, index) => value * gate[index]);
  const gradients = {
    input: model.input.map((_, inputIndex) => delta.reduce((sum, value, hiddenIndex) => sum + value * model.w1[inputIndex][hiddenIndex], 0)),
    w1: model.input.map(value => delta.map(gradient => value * gradient)),
    b1: delta.slice(),
    w2: outputGradient.map(gradient => hidden.map(value => value * gradient)),
    b2: outputGradient.slice()
  };
  return { raw, hidden, logits, probabilities, loss, outputGradient, contributions, arriving, gate, delta, gradients };
}

export function applyTrainingUpdate(model, rate) {
  const pass = evaluateTrainingModel(model);
  const updated = structuredClone(model);
  for (const key of ['input', 'w1', 'b1', 'w2', 'b2']) {
    updated[key] = model[key].map((value, index) => Array.isArray(value)
      ? value.map((weight, column) => weight - rate * pass.gradients[key][index][column])
      : value - rate * pass.gradients[key][index]);
  }
  return updated;
}

const stages = ['Inputs', 'Weighted sum', 'ReLU', 'Word scores', 'Probability + loss', 'Output gradients', 'Add the routes', 'ReLU backward', 'Parameter gradients'];
const fixed = (value, digits = 4) => Number(value).toFixed(digits).replace(/^-0\.0000$/, '0.0000');
const signed = value => `${value >= 0 ? '+' : ''}${fixed(value)}`;

function parameters(model) {
  const items = [];
  model.input.forEach((_, index) => items.push({ key: 'input', index, label: `Embedding coordinate x${index + 1}` }));
  model.w1.forEach((row, index) => row.forEach((_, column) => items.push({ key: 'w1', index, column, label: `Weight x${index + 1} to h${column + 1}` })));
  model.b1.forEach((_, index) => items.push({ key: 'b1', index, label: `Bias at h${index + 1}` }));
  model.w2.forEach((row, index) => row.forEach((_, column) => items.push({ key: 'w2', index, column, label: `Weight h${column + 1} to ${model.words[index]}` })));
  model.b2.forEach((_, index) => items.push({ key: 'b2', index, label: `Bias at ${model.words[index]}` }));
  return items.map(item => ({ ...item, id: [item.key, item.index, item.column].filter(value => value !== undefined).join(':') }));
}

function parameterValue(model, parameter) {
  return parameter.column === undefined ? model[parameter.key][parameter.index] : model[parameter.key][parameter.index][parameter.column];
}

function assignParameter(model, parameter, value) {
  if (parameter.column === undefined) model[parameter.key][parameter.index] = value;
  else model[parameter.key][parameter.index][parameter.column] = value;
}

export async function mountBackprop3D(root, source) {
  root.dataset.theme = new URLSearchParams(location.search).get('scoutTheme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const initial = createTrainingModel(source);
  const items = parameters(initial);
  const state = { model: structuredClone(initial), step: 0, hidden: 0, word: 0, selected: 'w1:0:0', rate: 0.1, spread: 1, playing: false, timer: null, frame: null, previous: null, before: false, updates: 0, history: [evaluateTrainingModel(initial).loss] };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let graphics = null;
  root.innerHTML = `
    <header class="bp3d-head"><div><p class="bp3d-eyebrow">The worksheet, opened up in space</p><h3>Inside one training step</h3></div><div class="bp3d-head-actions"><button type="button" data-action="fullscreen" title="Expand lab" aria-label="Expand lab">Expand</button><button type="button" data-action="reset" title="Restore the worksheet's numbers">Reset model</button></div></header>
    <div class="bp3d-transport" role="group" aria-label="Training-step timeline"><button type="button" data-action="back" title="Previous calculation" aria-label="Previous calculation">Back</button><button type="button" data-action="play" title="Play calculations once" aria-label="Play calculations once">Play</button><button type="button" data-action="next" title="Next calculation" aria-label="Next calculation">Next</button><button type="button" data-action="replay" title="Return to the inputs" aria-label="Return to the inputs">Replay</button><label class="bp3d-scrub">Calculation <input data-control="step" type="range" min="0" max="8" value="0"><output data-readout="step">1 / 9</output></label></div>
    <div class="bp3d-steps" role="group" aria-label="Choose a calculation">${stages.map((title, index) => `<button type="button" data-stage="${index}"><span>${index + 1}</span>${title}</button>`).join('')}</div>
    <div class="bp3d-workspace"><div class="bp3d-spatial"><div class="bp3d-view-controls"><label>View <select data-control="camera"><option value="overview">Whole network</option><option value="follow">Follow calculation</option></select></label><label>Layer spacing <input data-control="spread" type="range" min="80" max="150" value="100"></label><button type="button" data-action="camera" title="Reset camera" aria-label="Reset camera">Reset view</button><button type="button" data-action="zoom-in" title="Zoom in" aria-label="Zoom in">+</button><button type="button" data-action="zoom-out" title="Zoom out" aria-label="Zoom out">-</button></div><div class="bp3d-viewport" data-viewport></div><p class="bp3d-status" role="status">Loading the local 3D renderer...</p><div class="bp3d-legend"><span><i class="bp3d-positive"></i>Positive</span><span><i class="bp3d-negative"></i>Negative</span><span><i class="bp3d-target"></i>True word: sat</span><span>Numbers and signs also appear in the arithmetic.</span></div><p class="bp3d-reading" data-reading></p></div>
    <aside class="bp3d-inspector" aria-label="Calculation inspector"><p class="bp3d-eyebrow" data-direction></p><h4 data-title></h4><p data-lead></p><label>Trace hidden neuron <select data-control="hidden"><option value="0">h1</option><option value="1">h2</option></select></label><label>Inspect parameter <select data-control="parameter">${items.map(item => `<option value="${item.id}">${item.label}</option>`).join('')}</select></label><div class="bp3d-ledger" data-ledger></div><p class="bp3d-takeaway" data-takeaway></p></aside></div>
    <div class="bp3d-experiment"><div><h4>What if one number changed?</h4><label><span data-parameter-name></span><input data-control="parameter-value" type="number" step="0.01" min="-3" max="3"></label><p data-perturb-result>Changing a parameter recomputes the same forward pass. Reset model restores the worksheet.</p></div><div><h4>Apply the finished gradients</h4><label>Learning rate <input data-control="rate" type="number" min="0.001" max="0.5" step="0.01" value="0.1"></label><div class="bp3d-update-actions"><button type="button" data-action="update">Apply one gradient step</button><button type="button" data-action="undo" title="Undo the last gradient step">Undo update</button></div><p data-update-note>The timeline calculates gradients. Only this button applies them.</p></div></div>
    <div class="bp3d-results" aria-live="polite"><div><span>Cross-entropy</span><strong data-loss></strong><small>nats, for the true word sat</small></div><div><span>Probability of sat</span><strong data-probability></strong><small data-probability-change></small></div><div><span>Gradient steps</span><strong data-updates>0</strong><small>23 trainable numbers per step</small></div><div class="bp3d-compare"><label>Compare <select data-control="comparison"><option value="current">Current model</option><option value="before" disabled>Before last update</option></select></label><p data-comparison-note>No update applied yet.</p></div></div>
    <p class="bp3d-contract">Same two input coordinates, two ReLU neurons, and five candidate words as the worksheet. These are illustrative starting values, not pre-trained language knowledge. The two input coordinates stand for trainable embedding entries; a step updates them, all weights, and all biases together. The observed target stays sat. The geometry separates calculations; it is not a map of where words live in an LLM.</p>`;
  const find = selector => root.querySelector(selector);
  const control = name => find(`[data-control="${name}"]`);
  const action = name => find(`[data-action="${name}"]`);
  const displayModel = () => state.before && state.previous ? state.previous.model : state.model;
  const chosen = () => items.find(item => item.id === state.selected);
  const text = (selector, value) => { find(selector).textContent = value; };

  function stop() {
    clearTimeout(state.timer);
    cancelAnimationFrame(state.frame);
    state.timer = null;
    state.frame = null;
    state.playing = false;
    graphics?.stop();
    setPlayIcon();
  }

  function setPlayIcon() {
    action('play').setAttribute('aria-label', state.playing ? 'Pause calculations' : 'Play calculations once');
    action('play').title = state.playing ? 'Pause calculations' : 'Play calculations once';
    if (graphics) graphics.icon(action('play'), state.playing ? 'Pause' : 'Play');
    else action('play').textContent = state.playing ? 'Pause' : 'Play';
  }

  function rows(entries) {
    const ledger = find('[data-ledger]');
    ledger.replaceChildren();
    for (const [label, value] of entries) {
      const row = document.createElement('div');
      const heading = document.createElement('span');
      const calculation = document.createElement('code');
      heading.textContent = label;
      calculation.textContent = value;
      row.append(heading, calculation);
      ledger.append(row);
    }
  }

  function inspect(model, pass) {
    const hiddenIndex = state.hidden;
    const wordIndex = state.word;
    const neuron = `h${hiddenIndex + 1}`;
    const word = model.words[wordIndex];
    const parameter = chosen();
    const gradient = parameterValue(pass.gradients, parameter);
    const oldValue = parameterValue(model, parameter);
    let lead = '';
    let takeaway = '';
    let entries = [];
    if (state.step === 0) {
      lead = 'The two input coordinates are numbers from an embedding row. Every connection has its own weight; each neuron also has a bias.';
      entries = model.input.map((value, index) => [`Input x${index + 1}`, fixed(value)]);
      entries.push(['Observed target', 'sat: y = 1; every other word: y = 0']);
      takeaway = 'Forward computes a guess. Backward calculates how the loss depends on each trainable number. An update is a separate action.';
    } else if (state.step === 1) {
      lead = `Follow both inputs into ${neuron}. Multiply along each connection, add the contributions, then add the bias.`;
      entries = model.input.map((value, index) => [`x${index + 1} times its weight`, `${fixed(value)} x ${fixed(model.w1[index][hiddenIndex])} = ${signed(value * model.w1[index][hiddenIndex])}`]);
      entries.push(['Sum before bias', fixed(pass.raw[hiddenIndex] - model.b1[hiddenIndex])], ['Add the bias', `${fixed(pass.raw[hiddenIndex] - model.b1[hiddenIndex])} + ${fixed(model.b1[hiddenIndex])}`], [`Pre-activation r${hiddenIndex + 1}`, fixed(pass.raw[hiddenIndex])]);
      takeaway = 'The input numbers are shared, but each hidden neuron combines them with different weights.';
    } else if (state.step === 2) {
      lead = 'ReLU keeps positive inputs and clips negative ones to zero. Compare h1 and h2 to inspect the open and closed gates.';
      entries = pass.raw.map((value, index) => [`h${index + 1} = ReLU(r${index + 1})`, `max(0, ${fixed(value)}) = ${fixed(pass.hidden[index])}`]);
      takeaway = `The selected gate ${pass.gate[hiddenIndex] ? 'is open: its input is positive.' : 'is closed: its output is zero.'} The backward pass will use this exact same gate.`;
    } else if (state.step === 3) {
      lead = `Both hidden values contribute to the raw score for ${word}. Select a word in the scene, or one of its parameters, to inspect that output.`;
      entries = pass.hidden.map((value, index) => [`h${index + 1} times output weight`, `${fixed(value)} x ${fixed(model.w2[wordIndex][index])} = ${signed(value * model.w2[wordIndex][index])}`]);
      entries.push(['Subtotal', fixed(pass.logits[wordIndex] - model.b2[wordIndex])], ['Add output bias', `${fixed(pass.logits[wordIndex] - model.b2[wordIndex])} + ${fixed(model.b2[wordIndex])}`], [`Logit z for ${word}`, fixed(pass.logits[wordIndex])]);
      takeaway = 'These are relative scores, not probabilities yet. The five outputs share the same hidden values.';
    } else if (state.step === 4) {
      const maximum = Math.max(...pass.logits);
      const total = pass.logits.reduce((sum, value) => sum + Math.exp(value - maximum), 0);
      lead = 'Softmax shares one probability budget across all five words. Subtracting the largest logit keeps the exponentials numerically stable.';
      entries = [['Selected logit minus maximum', `${fixed(pass.logits[wordIndex])} - ${fixed(maximum)}`], ['Exponentiate shifted score', fixed(Math.exp(pass.logits[wordIndex] - maximum))], ['Sum of all five exponentials', fixed(total)], [`Probability q for ${word}`, `${fixed(Math.exp(pass.logits[wordIndex] - maximum))} / ${fixed(total)} = ${fixed(pass.probabilities[wordIndex])}`], ['Loss for the true word sat', `-ln(${fixed(pass.probabilities[model.target])}) = ${fixed(pass.loss)}`]];
      takeaway = 'That single loss is the turnaround point. Now ask which trainable numbers could reduce it.';
    } else if (state.step === 5) {
      lead = 'For the loss L = -ln(q_sat), Softmax plus cross-entropy gives dL/dz = q - y. The target indicator y is 1 only for sat.';
      entries = model.words.map((name, index) => [`Loss gradient at ${name}`, `${fixed(pass.probabilities[index])} - ${Number(index === model.target)} = ${signed(pass.outputGradient[index])}`]);
      takeaway = 'A negative gradient asks for a higher logit; a positive gradient asks for a lower one. Gradient descent will subtract these gradients later.';
    } else if (state.step === 6) {
      lead = `Each forward logit contains output weight x ${neuron}. Its local derivative with respect to ${neuron} is that weight. For the same loss L, multiply each arriving q - y by that weight, then add the routes.`;
      entries = model.words.map((name, index) => [`${name}: gradient x weight`, `${signed(pass.outputGradient[index])} x ${fixed(model.w2[index][hiddenIndex])} = ${signed(pass.contributions[index][hiddenIndex])}`]);
      entries.push([`Sum: dL/d${neuron}`, signed(pass.arriving[hiddenIndex])]);
      takeaway = 'The output requests can reinforce or oppose one another. The selected hidden neuron receives their signed sum, not five separate updates.';
    } else if (state.step === 7) {
      lead = `The forward equation was ${neuron} = ReLU(r${hiddenIndex + 1}). For loss L = -ln(q_sat), the arriving gradient must pass through this local derivative.`;
      entries = [['Arriving loss gradient', signed(pass.arriving[hiddenIndex])], ['Forward pre-activation', fixed(pass.raw[hiddenIndex])], ['Local ReLU derivative', `${pass.gate[hiddenIndex]} (${pass.gate[hiddenIndex] ? 'positive input' : 'nonpositive input'})`], ['dL/dr = arriving gradient x gate', `${signed(pass.arriving[hiddenIndex])} x ${pass.gate[hiddenIndex]} = ${signed(pass.delta[hiddenIndex])}`]];
      takeaway = pass.gate[hiddenIndex] ? 'The open gate passes the gradient unchanged toward this neuron\'s incoming weights.' : 'A gradient arrived, but the closed gate blocks it. The incoming weights and hidden bias receive zero gradient for this example.';
    } else {
      lead = `Inspect ${parameter.label.toLowerCase()}. All gradients below belong to the same completed forward pass; nothing has been updated yet.`;
      let rule;
      if (parameter.key === 'w1') rule = `${fixed(model.input[parameter.index])} x ${signed(pass.delta[parameter.column])}`;
      else if (parameter.key === 'w2') rule = `${fixed(pass.hidden[parameter.column])} x ${signed(pass.outputGradient[parameter.index])}`;
      else if (parameter.key === 'b1' || parameter.key === 'b2') rule = `${signed(gradient)} x 1`;
      else rule = pass.delta.map((value, index) => `(${signed(value)} x ${fixed(model.w1[parameter.index][index])})`).join(' + ');
      entries = [['Source rule', parameter.key === 'input' ? 'Sum(hidden gradient x input weight)' : 'Arriving gradient x local input'], ['Calculate the loss gradient', rule], ['Gradient, not update', signed(gradient)], ['Current parameter', fixed(oldValue)], ['Proposed change = -rate x gradient', `${fixed(-state.rate)} x ${signed(gradient)} = ${signed(-state.rate * gradient)}`], ['Proposed new value', `${fixed(oldValue)} - (${fixed(state.rate)} x ${signed(gradient)}) = ${fixed(oldValue - state.rate * gradient)}`]];
      takeaway = 'Apply one gradient step updates all 23 trainable numbers from these gradients simultaneously. Playback never applies an update.';
    }
    text('[data-direction]', state.step < 5 ? 'Forward: inputs toward loss' : 'Backward: loss toward inputs');
    text('[data-title]', `${state.step + 1}. ${stages[state.step]}`);
    text('[data-lead]', lead);
    text('[data-takeaway]', takeaway);
    rows(entries);
  }

  function render(refit = false) {
    const model = displayModel();
    const pass = evaluateTrainingModel(model);
    const baseline = evaluateTrainingModel(initial);
    root.dataset.stage = String(state.step);
    root.dataset.loss = String(pass.loss);
    root.dataset.updates = String(state.updates);
    control('step').value = state.step;
    text('[data-readout="step"]', `${state.step + 1} / ${stages.length}`);
    root.querySelectorAll('[data-stage]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.stage) === state.step)));
    action('back').disabled = state.step === 0;
    action('next').disabled = state.step === 8;
    action('play').disabled = reduced.matches;
    action('update').disabled = state.step !== 8 || state.before;
    action('undo').disabled = !state.previous;
    control('comparison').querySelector('[value="before"]').disabled = !state.previous;
    control('comparison').value = state.before ? 'before' : 'current';
    control('hidden').value = state.hidden;
    control('parameter').value = state.selected;
    control('parameter-value').value = fixed(parameterValue(model, chosen()));
    control('parameter-value').disabled = state.before;
    text('[data-parameter-name]', chosen().label);
    text('[data-loss]', fixed(pass.loss));
    text('[data-probability]', `${fixed(pass.probabilities[model.target] * 100, 2)}%`);
    text('[data-probability-change]', `${signed((pass.probabilities[model.target] - baseline.probabilities[model.target]) * 100)} percentage points from reset`);
    text('[data-updates]', state.updates);
    text('[data-update-note]', state.before ? 'Viewing the previous model. Return to Current model before updating.' : state.step === 8 ? 'The complete gradient is ready. One click updates all parameters together.' : 'Complete the trace, or choose Parameter gradients, before applying an update.');
    const previousLoss = state.previous ? evaluateTrainingModel(state.previous.model).loss : null;
    text('[data-comparison-note]', previousLoss === null ? 'No update applied yet.' : `Last update: loss ${fixed(previousLoss)} to ${fixed(evaluateTrainingModel(state.model).loss)}. ${state.before ? 'The scene shows the before state.' : 'The scene shows the current state.'}`);
    const motionMeaning = ['The two coordinates are the starting evidence for this forward pass.', 'Moving circles carry input-times-weight contributions into each sum.', 'Moving circles carry the computed ReLU outputs.', 'Moving circles carry hidden-value-times-weight contributions into each logit.', 'Moving circles carry logits into Softmax, then the true-word probability into loss.', 'The loss gradient q - y is now displayed at each logit.', 'Moving circles carry (q - y) times the output weight toward the hidden neuron.', 'Moving circles carry the arriving gradient. A closed gate stops it before it can reach the weighted sum.', 'Moving circles carry each hidden gradient times its input weight back toward the embedding coordinates.'];
    text('[data-reading]', `${motionMeaning[state.step]} ${reduced.matches ? 'Reduced motion: use Back, Next, or the timeline for still scenes.' : 'Drag to orbit, or select a connection. Camera controls change the view, never the numbers.'}`);
    inspect(model, pass);
    graphics?.build(model, pass, state, refit);
    setPlayIcon();
  }

  function setStep(step, play = false) {
    stop();
    state.step = Math.max(0, Math.min(8, step));
    render(control('camera').value === 'follow');
    if (play && !reduced.matches) {
      state.playing = true;
      setPlayIcon();
      graphics?.animate(state.step);
      state.timer = setTimeout(() => {
        if (state.step < 8) setStep(state.step + 1, true);
        else { stop(); render(); }
      }, 4000);
    }
  }

  function selectParameter(id) {
    stop();
    state.selected = id;
    const parameter = chosen();
    if (parameter.key === 'w1') state.hidden = parameter.column;
    if (parameter.key === 'b1') state.hidden = parameter.index;
    if (parameter.key === 'w2') { state.hidden = parameter.column; state.word = parameter.index; }
    if (parameter.key === 'b2') state.word = parameter.index;
    render();
  }

  root.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click', () => setStep(Number(button.dataset.stage))));
  action('back').addEventListener('click', () => setStep(state.step - 1));
  action('next').addEventListener('click', () => setStep(state.step + 1));
  action('replay').addEventListener('click', () => setStep(0));
  action('play').addEventListener('click', () => state.playing ? stop() : setStep(state.step === 8 ? 0 : state.step, true));
  action('reset').addEventListener('click', () => {
    stop(); state.model = structuredClone(initial); state.previous = null; state.before = false; state.updates = 0; state.step = 0; state.history = [evaluateTrainingModel(initial).loss];
    text('[data-perturb-result]', 'The worksheet values have been restored.'); render(true);
  });
  action('update').addEventListener('click', () => {
    if (state.step !== 8 || state.before) return;
    stop(); state.previous = { model: structuredClone(state.model), updates: state.updates, history: state.history.slice() };
    state.model = applyTrainingUpdate(state.model, state.rate); state.updates += 1; state.history.push(evaluateTrainingModel(state.model).loss); state.step = 0; render(true);
  });
  action('undo').addEventListener('click', () => {
    if (!state.previous) return;
    stop(); state.model = state.previous.model; state.updates = state.previous.updates; state.history = state.previous.history; state.previous = null; state.before = false; render();
  });
  control('step').addEventListener('input', event => setStep(Number(event.target.value)));
  control('hidden').addEventListener('change', event => { state.hidden = Number(event.target.value); selectParameter(`w1:0:${state.hidden}`); });
  control('parameter').addEventListener('change', event => selectParameter(event.target.value));
  control('comparison').addEventListener('change', event => { stop(); state.before = event.target.value === 'before'; render(); });
  control('rate').addEventListener('change', event => {
    const value = Number(event.target.value);
    state.rate = Number.isFinite(value) ? Math.min(0.5, Math.max(0.001, value)) : 0.1;
    event.target.value = state.rate; stop(); render();
  });
  control('parameter-value').addEventListener('change', event => {
    if (state.before) return;
    const value = Number(event.target.value);
    if (!event.target.value.trim() || !Number.isFinite(value)) { render(); return; }
    const beforeLoss = evaluateTrainingModel(state.model).loss;
    stop(); assignParameter(state.model, chosen(), Math.max(-3, Math.min(3, value))); state.previous = null; state.step = 0;
    const afterLoss = evaluateTrainingModel(state.model).loss;
    text('[data-perturb-result]', `${chosen().label}: loss ${fixed(beforeLoss)} to ${fixed(afterLoss)} (${signed(afterLoss - beforeLoss)}). This was a manual perturbation, not a training step.`); render();
  });
  control('spread').addEventListener('input', event => { stop(); state.spread = Number(event.target.value) / 100; render(true); });
  control('camera').addEventListener('change', () => graphics?.fit());
  action('camera').addEventListener('click', () => graphics?.fit());
  action('zoom-in').addEventListener('click', () => graphics?.zoom(0.8));
  action('zoom-out').addEventListener('click', () => graphics?.zoom(1.25));
  action('fullscreen').addEventListener('click', () => {
    root.classList.toggle('is-expanded');
    const expanded = root.classList.contains('is-expanded');
    root.setAttribute('role', expanded ? 'dialog' : 'region');
    root.setAttribute('aria-label', 'Inside one training step');
    if (expanded) root.setAttribute('aria-modal', 'true');
    else root.removeAttribute('aria-modal');
    action('fullscreen').setAttribute('aria-label', root.classList.contains('is-expanded') ? 'Exit expanded lab' : 'Expand lab');
    action('fullscreen').title = action('fullscreen').getAttribute('aria-label');
    if (!graphics) action('fullscreen').textContent = expanded ? 'Exit' : 'Expand';
    if (graphics) graphics.icon(action('fullscreen'), root.classList.contains('is-expanded') ? 'Minimize' : 'Expand');
    graphics?.resize();
    action('fullscreen').focus();
  });
  root.addEventListener('keydown', event => {
    if (!root.classList.contains('is-expanded')) return;
    if (event.key === 'Escape') { event.preventDefault(); action('fullscreen').click(); }
    if (event.key === 'Tab') {
      const focusable = [...root.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), canvas[tabindex]')].filter(element => element.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  root.addEventListener('bp3d:pause', () => { stop(); render(); });
  reduced.addEventListener('change', () => { stop(); render(); });
  control('parameter').value = state.selected;
  render();
  try {
    const library = await import('./assets/vendor/backprop-three.js');
    graphics = createScene(find('[data-viewport]'), library, control('camera'), selection => {
      if (selection.parameter) selectParameter(selection.parameter);
      else {
        stop();
        if (selection.hidden !== undefined) state.hidden = selection.hidden;
        if (selection.word !== undefined) state.word = selection.word;
        if (selection.stage !== undefined) state.step = selection.stage;
        render();
      }
    });
    [['back','ChevronLeft'],['next','ChevronRight'],['play','Play'],['replay','RotateCcw'],['camera','Focus'],['zoom-in','ZoomIn'],['zoom-out','ZoomOut'],['fullscreen','Expand']].forEach(([name, icon]) => graphics.icon(action(name), icon));
    text('.bp3d-status', '3D ready. The highlighted routes belong to the current calculation.');
    root.dataset.renderer = 'webgl';
    render(true);
  } catch (error) {
    find('[data-viewport]').replaceChildren();
    text('.bp3d-status', '3D is unavailable in this browser. Every calculation, parameter, and update remains available in the arithmetic view.');
    root.dataset.renderer = 'fallback';
    ['camera','zoom-in','zoom-out'].forEach(name => { action(name).disabled = true; });
    control('camera').disabled = true; control('spread').disabled = true;
    console.warn('Backpropagation 3D fallback:', error.message);
  }
  root.dataset.ready = 'true';
}

function createScene(host, library, cameraControl, select) {
  const renderer = new library.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = library.SRGBColorSpace;
  const colors = name => getComputedStyle(host).getPropertyValue(`--cp-${name}`).trim();
  const positive = colors('success');
  const negative = colors('danger');
  const accent = colors('accent');
  const neutral = colors('text-soft');
  renderer.setClearColor(colors('bg'));
  host.append(renderer.domElement);
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Explorable network: two inputs, two hidden neurons, five logits, five probabilities, and one loss. The adjacent inspector provides every calculation.');
  renderer.domElement.addEventListener('webglcontextlost', event => event.preventDefault());
  const scene = new library.Scene();
  const camera = new library.PerspectiveCamera(42, 1, 0.1, 250);
  const controls = new library.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.minDistance = 5;
  controls.maxDistance = 80;
  controls.maxPolarAngle = Math.PI * 0.47;
  const ambient = new library.HemisphereLight(0xffffff, 0x626b75, 2.4);
  scene.add(ambient);
  const light = new library.DirectionalLight(0xffffff, 3);
  light.position.set(-4, 12, 8);
  scene.add(light);
  let world = new library.Group();
  let picks = [];
  let routes = [];
  let particles = [];
  let frame = null;
  let state;
  let displayedModel;
  const raycaster = new library.Raycaster();
  const pointer = new library.Vector2();
  const labelTextures = new Map();
  const labels = [];
  const material = (color, opacity = 1) => new library.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.18, transparent: opacity < 1, opacity });
  const draw = () => {
    if (!host.clientWidth) return;
    camera.updateMatrixWorld(true);
    const occupied = [];
    const scale = host.clientHeight / (2 * Math.tan(library.MathUtils.degToRad(camera.fov / 2)));
    for (const entry of labels.slice().sort((first, second) => second.priority - first.priority)) {
      const projected = entry.sprite.position.clone().project(camera);
      const distance = -entry.sprite.position.clone().applyMatrix4(camera.matrixWorldInverse).z;
      const width = entry.width * scale / distance;
      const height = entry.height * scale / distance;
      const left = (projected.x + 1) * host.clientWidth / 2 - width / 2;
      const top = (1 - projected.y) * host.clientHeight / 2 - height / 2;
      const bounds = { left, top, right: left + width, bottom: top + height };
      entry.sprite.visible = distance > 0 && projected.z > -1 && projected.z < 1
        && left >= 4 && top >= 4 && bounds.right <= host.clientWidth - 4 && bounds.bottom <= host.clientHeight - 4
        && !occupied.some(other => bounds.left < other.right + 4 && bounds.right > other.left - 4 && bounds.top < other.bottom + 4 && bounds.bottom > other.top - 4);
      if (entry.sprite.visible) occupied.push(bounds);
    }
    renderer.render(scene, camera);
  };
  controls.addEventListener('change', draw);

  function clear() {
    stop();
    scene.remove(world);
    world.traverse(object => { object.geometry?.dispose(); if (object.material) object.material.dispose(); });
    labelTextures.forEach(texture => texture.dispose()); labelTextures.clear(); labels.length = 0;
    world = new library.Group(); scene.add(world); picks = []; routes = [];
  }

  function label(text, position, color = colors('text'), width = 1.8, priority = 0) {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 112;
    const context = canvas.getContext('2d');
    context.font = '600 64px Segoe UI'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillStyle = color;
    context.fillText(text, 256, 55, 494);
    const texture = new library.CanvasTexture(canvas); labelTextures.set(texture.uuid, texture);
    const sprite = new library.Sprite(new library.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.position.copy(position); sprite.scale.set(width, width * 112 / 512, 1); world.add(sprite);
    labels.push({ sprite, width: width * Math.min(494, context.measureText(text).width) / 512, height: width * 64 / 512, priority });
  }

  function cube(position, value, title, selection, active, target = false) {
    const mesh = new library.Mesh(new library.BoxGeometry(0.55, 0.55, 0.55), material(target ? colors('warning') : active ? (value < 0 ? negative : positive) : neutral, active ? 1 : 0.4));
    mesh.position.copy(position); world.add(mesh); mesh.userData.selection = selection; picks.push(mesh);
    if (active) {
      const height = Math.min(2, Math.abs(value) * 1.5);
      const bar = new library.Mesh(new library.BoxGeometry(0.16, height, 0.16), material(value < 0 ? negative : positive));
      bar.position.copy(position).add(new library.Vector3(0.4, (value < 0 ? -1 : 1) * height / 2, 0)); world.add(bar);
      label(`${title}  ${fixed(value, 3)}`, position.clone().add(new library.Vector3(0, 0.67, 0)), colors('text'), 2.1, 20);
    }
  }

  function edge(source, target, value, selection, active, phase, closed = false) {
    const middle = source.clone().lerp(target, 0.5); middle.y += 0.35;
    const curve = new library.CatmullRomCurve3([source, middle, target]);
    const tube = new library.Mesh(new library.TubeGeometry(curve, 16, active ? Math.min(0.055, 0.018 + Math.abs(value) * 0.025) : 0.012, 5, false), material(active ? (value < 0 ? negative : positive) : neutral, active ? 0.85 : 0.22));
    tube.userData.selection = selection; world.add(tube); picks.push(tube);
    routes.push({ curve, value, active, phase, closed });
    if (selection.parameter === state.selected && active) {
      const parameter = parameters(displayedModel).find(item => item.id === selection.parameter);
      label(`w = ${fixed(parameterValue(displayedModel, parameter), 3)}`, middle.clone().add(new library.Vector3(0, 0.42, 0)), colors('text'), 1.8, 30);
    }
  }

  function fit() {
    if (!state) return;
    const activeLayer = [0,1,2,3,4,4,3,2,0][state.step];
    const follow = cameraControl.value === 'follow';
    const center = follow ? (activeLayer - 2.5) * 3 * state.spread : 0;
    controls.target.set(center, 1, 0);
    const halfWidth = follow ? 3.1 * state.spread : 7.5 * state.spread + 1.5;
    const depth = follow && activeLayer < 3 ? 2 : 5;
    const corners = [];
    for (const horizontal of [-halfWidth, halfWidth]) for (const vertical of [-0.5, 4.5]) for (const longitudinal of [-depth, depth]) corners.push(new library.Vector3(center + horizontal, vertical, longitudinal));
    for (let distance = 8; distance < 75; distance += 0.5) {
      camera.position.set(center + distance * 0.48, 1 + distance * 0.52, distance * 0.8);
      camera.lookAt(controls.target); camera.updateMatrixWorld(true);
      if (corners.every(corner => { const projected = corner.clone().project(camera); return Math.abs(projected.x) < 0.92 && Math.abs(projected.y) < 0.92; })) break;
    }
    controls.update(); draw();
  }

  function resize() {
    const width = Math.max(host.clientWidth, 1), height = Math.max(host.clientHeight, 1);
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); fit();
  }

  function build(model, pass, nextState, refit) {
    state = nextState; displayedModel = model; clear();
    const positions = [];
    const layerNames = [state.step === 8 ? 'INPUTS: dL/dx' : 'INPUTS x', state.step >= 7 ? 'SUMS: dL/dr' : 'SUMS r', state.step >= 6 ? 'RELU: dL/dh' : 'RELU h', state.step >= 5 ? 'LOGITS: dL/dz' : 'LOGITS z', 'PROBABILITIES q', 'LOSS L'];
    const activeLayers = [[0],[0,1],[1,2],[2,3],[3,4,5],[3,4,5],[2,3],[1,2],[0,1,2,3]][state.step];
    const counts = [2,2,2,5,5,1];
    layerNames.forEach((name, layer) => {
      const layerX = (layer - 2.5) * 3 * state.spread;
      positions[layer] = Array.from({length:counts[layer]}, (_, index) => new library.Vector3(layerX, 1.25, (index - (counts[layer] - 1) / 2) * 1.65));
      const base = new library.Mesh(new library.BoxGeometry(0.7, 0.12, 9), material(colors('surface-soft')));
      base.position.set(layerX, -0.05, 0); world.add(base);
      label(name, new library.Vector3(layerX, 4, 0), activeLayers.includes(layer) ? colors('text') : neutral, 2.3, activeLayers.includes(layer) ? 50 : 10);
      for (const depth of [-4.4, 4.4]) {
        const upright = new library.Mesh(new library.BoxGeometry(0.025, 3.6, 0.025), material(colors('text-soft'), 0.45));
        upright.position.set(layerX, 1.7, depth); world.add(upright);
      }
      const top = new library.Mesh(new library.BoxGeometry(0.025, 0.025, 8.8), material(colors('text-soft'), 0.45));
      top.position.set(layerX, 3.5, 0); world.add(top);
    });
    model.input.forEach((value,index) => cube(positions[0][index], state.step === 8 ? pass.gradients.input[index] : value, `${state.step === 8 ? 'dL/d' : ''}x${index+1}`, {parameter:`input:${index}`}, activeLayers.includes(0)));
    pass.raw.forEach((value,index) => {
      cube(positions[1][index], state.step >= 7 ? pass.delta[index] : value, `${state.step >= 7 ? 'dL/d' : ''}r${index+1}`, {hidden:index,stage:state.step<5?1:7}, activeLayers.includes(1));
      cube(positions[2][index], state.step >= 6 ? pass.arriving[index] : pass.hidden[index], `${state.step >= 6 ? 'dL/d' : ''}h${index+1}`, {hidden:index,stage:state.step<5?2:7}, activeLayers.includes(2));
      edge(positions[1][index],positions[2][index],state.step===7?pass.arriving[index]:pass.hidden[index],{hidden:index},index===state.hidden,2,pass.gate[index]===0);
      if (activeLayers.includes(2)) {
        if (index === state.hidden) label(pass.gate[index] ? 'OPEN: slope 1' : 'CLOSED: slope 0', positions[2][index].clone().add(new library.Vector3(0,1.3,0)), colors('text-soft'), 2.3, 40);
        if (!pass.gate[index]) {
          const gate = new library.Mesh(new library.BoxGeometry(0.1,1.1,0.85),material(colors('border-strong')));
          gate.position.copy(positions[2][index]).add(new library.Vector3(-0.45,0,0)); world.add(gate);
        }
      }
      if (activeLayers.includes(1)) label(`bias ${fixed(model.b1[index],2)}`,positions[1][index].clone().add(new library.Vector3(0,-0.7,0)),neutral,1.6);
    });
    model.words.forEach((word,index) => {
      cube(positions[3][index],state.step>=5?pass.outputGradient[index]:pass.logits[index],word,{word:index,stage:state.step<5?3:5},activeLayers.includes(3),index===model.target);
      cube(positions[4][index],pass.probabilities[index],word,{word:index,stage:4},activeLayers.includes(4),index===model.target);
      edge(positions[3][index],positions[4][index],pass.logits[index],{word:index,stage:4},state.step===4,4);
      if (activeLayers.includes(3) && index === state.word) label(`bias ${fixed(model.b2[index],2)}`,positions[3][index].clone().add(new library.Vector3(0,-0.7,0)),neutral,1.6);
    });
    cube(positions[5][0],pass.loss,'L',{stage:4},activeLayers.includes(5));
    edge(positions[4][model.target],positions[5][0],pass.probabilities[model.target],{stage:4},state.step===4,4);
    model.w1.forEach((weights,inputIndex) => weights.forEach((weight,hiddenIndex) => edge(positions[0][inputIndex],positions[1][hiddenIndex],state.step>=5?pass.delta[hiddenIndex]*weight:model.input[inputIndex]*weight,{parameter:`w1:${inputIndex}:${hiddenIndex}`},hiddenIndex===state.hidden&&(state.step===1||state.step===8),1)));
    model.w2.forEach((weights,wordIndex) => weights.forEach((weight,hiddenIndex) => edge(positions[2][hiddenIndex],positions[3][wordIndex],state.step>=5?pass.contributions[wordIndex][hiddenIndex]:pass.hidden[hiddenIndex]*weight,{parameter:`w2:${wordIndex}:${hiddenIndex}`},hiddenIndex===state.hidden&&(state.step===3||state.step===6||state.step===8),3)));
    if (refit) fit();
    draw();
  }

  function stop() {
    cancelAnimationFrame(frame); frame = null;
    particles.forEach(particle => { world.remove(particle.mesh); particle.mesh.geometry.dispose(); particle.mesh.material.dispose(); }); particles = []; draw();
  }

  function animate(step) {
    stop();
    const phase = step===1?1:step===2||step===7?2:step===3||step===6?3:step===4?4:step===8?1:0;
    routes.filter(route=>route.active&&route.phase===phase&&route.value!==0).forEach(route=>{
      const mesh=new library.Mesh(new library.SphereGeometry(Math.min(0.17,0.055+Math.abs(route.value)*0.08),12,8),material(route.value<0?negative:positive));
      mesh.position.copy(route.curve.getPoint(step>=5?1:0));world.add(mesh);particles.push({mesh,route});
    });
    const started=performance.now();
    const tick=()=>{const progress=Math.min(1,(performance.now()-started)/1800);particles.forEach(({mesh,route})=>mesh.position.copy(route.curve.getPoint(step>=5?1-progress*(step===7&&route.closed?0.12/state.spread:1):progress)));draw();if(progress<1)frame=requestAnimationFrame(tick);else stop();};
    frame=requestAnimationFrame(tick);
  }

  let pressed = null;
  renderer.domElement.addEventListener('pointerdown',event=>{renderer.domElement.focus({preventScroll:true});pressed={x:event.clientX,y:event.clientY};});
  renderer.domElement.addEventListener('pointerup',event=>{
    if(!pressed||Math.hypot(event.clientX-pressed.x,event.clientY-pressed.y)>6)return;
    const bounds=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);
    raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(picks,false)[0];if(hit)select(hit.object.userData.selection);pressed=null;
  });
  const observer = new ResizeObserver(resize); observer.observe(host);
  if (matchMedia('(max-width: 760px)').matches) cameraControl.value = 'follow';
  resize();
  return { build, fit, resize, stop, animate, zoom(factor) { camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target); controls.update(); draw(); }, icon(button,name) { button.replaceChildren(library.createIcon(library[name],{width:18,height:18,'aria-hidden':'true'})); } };
}