const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'chapter4.js'), 'utf8');
const canonical = vm.runInNewContext(source.slice(source.indexOf('const byHandNetwork ='), source.indexOf('const byHandValues =')) + '\nJSON.parse(JSON.stringify(byHandNetwork))');
const engine = import('data:text/javascript;base64,' + fs.readFileSync(path.join(__dirname, 'chapter4-3d.js')).toString('base64'));

test('reproduces the worksheet and keeps its closed ReLU gate', async () => {
  const { createTrainingModel, evaluateTrainingModel } = await engine;
  const pass = evaluateTrainingModel(createTrainingModel(canonical));
  assert.ok(Math.abs(pass.loss - 1.4232188692785068) < 1e-12);
  assert.ok(Math.abs(pass.probabilities[0] - 0.24093722196068257) < 1e-8);
  assert.equal(pass.gate[1], 0);
  assert.equal(pass.delta[1], 0);
  assert.ok(Math.abs(pass.gradients.w1[0][0] + 0.26219619053503795) < 1e-10);
});

test('all 23 derivatives match finite differences with both ReLU gate configurations', async () => {
  const { createTrainingModel, evaluateTrainingModel } = await engine;
  for (const openSecondGate of [false, true]) {
    const model = createTrainingModel(canonical);
    if (openSecondGate) model.w1[1][1] = 0.8;
    const pass = evaluateTrainingModel(model);
    let count = 0;
    for (const key of ['input', 'w1', 'b1', 'w2', 'b2']) {
      model[key].forEach((value, index) => {
        (Array.isArray(value) ? value.map((_, column) => column) : [null]).forEach(column => {
          const plus = structuredClone(model), minus = structuredClone(model);
          if (column === null) { plus[key][index] += 1e-6; minus[key][index] -= 1e-6; }
          else { plus[key][index][column] += 1e-6; minus[key][index][column] -= 1e-6; }
          const numerical = (evaluateTrainingModel(plus).loss - evaluateTrainingModel(minus).loss) / 2e-6;
          const analytic = column === null ? pass.gradients[key][index] : pass.gradients[key][index][column];
          assert.ok(Math.abs(numerical - analytic) < 1e-8, `${key}[${index}][${column}]`);
          count += 1;
        });
      });
    }
    assert.equal(count, 23);
  }
});

test('updates a copy with one shared gradient and lowers the canonical loss', async () => {
  const { createTrainingModel, evaluateTrainingModel, applyTrainingUpdate } = await engine;
  const model = createTrainingModel(canonical);
  const baseline = JSON.stringify(model);
  const gradients = evaluateTrainingModel(model).gradients;
  const updated = applyTrainingUpdate(model, 0.1);
  assert.equal(JSON.stringify(model), baseline);
  assert.ok(Math.abs(updated.w1[0][0] - 0.4262196190535038) < 1e-12);
  assert.ok(Math.abs(updated.input[0] - (model.input[0] - 0.1 * gradients.input[0])) < 1e-12);
  assert.ok(evaluateTrainingModel(updated).loss < evaluateTrainingModel(model).loss);
});

test('stable softmax remains finite for large shared logits', async () => {
  const { createTrainingModel, evaluateTrainingModel } = await engine;
  const model = createTrainingModel(canonical);
  model.b2 = model.b2.map(value => value + 1000);
  const pass = evaluateTrainingModel(model);
  assert.ok(Number.isFinite(pass.loss));
  assert.ok(Math.abs(pass.probabilities.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
  assert.ok(Math.abs(pass.loss - 1.4232188692785068) < 1e-10);
});