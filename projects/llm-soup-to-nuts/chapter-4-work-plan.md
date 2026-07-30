# Chapter 4 Work Plan

> Temporary planning file. Delete this file after Chapter 4 is reviewed, completed, frozen, and published.

## Working Agreement

We will complete this plan one checklist item at a time so every change remains easy to understand and review.

For each item:

1. Implement only that item and avoid unrelated cleanup.
2. Preserve the author's words, phrases, examples, and voice unless the item explicitly identifies a correctness, clarity, duplication, or prerequisite problem.
3. Run focused math, browser, interaction, and responsive checks for the affected slice.
4. Summarize exactly what changed and what was preserved.
5. Pause for review before starting the next item.
6. Update this checklist immediately when an item is approved or when its scope changes.

Status key:

- `[ ]` Not started
- `[~]` In progress or awaiting review
- `[x]` Approved and complete
- `[!]` Blocked or needs a decision

## Phase 1: Correctness and Clean Baseline

- [x] **1. Repair obvious copy and markup defects**

  Fix incomplete sentences, missing spaces, inconsistent indentation, accidental formatting artifacts, and similar proofreading defects. Known examples include the incomplete sentence `Where a piece of calculus shows up, I will define it on .`, the unindented paragraph near the start of Section 1, and missing spacing around `sampling.Why`.

  Preserve all conceptual content and authorial phrasing unless grammar makes the intended meaning unclear.

  Completion checks:
  - HTML diagnostics pass.
  - `git diff --check` passes.
  - No teaching content is reordered or removed.
  - A focused browser read confirms the corrected paragraphs render normally.

- [~] **2. Correct the logits explanation**

  Replace the statement that negative logits break the math. Logits may be any real number, including negative numbers. Softmax is needed because logits are raw relative scores, not positive normalized probabilities.

  Preserve the existing explanation of exponentiation and normalization.

  Completion checks:
  - Prose accurately distinguishes logits from probabilities.
  - The worked negative-logit example remains intact.
  - The live softmax panel still matches the prose.

- [~] **3. Correct temperature-dependent gradients**

  Distinguish between the gradient with respect to the scaled score and the gradient with respect to the original logit. If softmax uses `z/T`, then:

  $$
  \frac{\partial L}{\partial (z_i/T)} = q_i-y_i
  $$

  while:

  $$
  \frac{\partial L}{\partial z_i}=\frac{q_i-y_i}{T}
  $$

  Decide whether the live panel should display blame on the scaled score or the true gradient on the original logit, then label it unambiguously and update JavaScript and prose together.

  Completion checks:
  - Values agree at `T=1`.
  - Values correctly scale at low and high temperatures.
  - Formula, panel labels, quiz feedback, and JavaScript use the same convention.

- [~] **4. Correct averaged MSE gradients**

  Make the formulas match the displayed mean squared error:

  $$
  \frac{\partial L}{\partial m}
  =\frac{2}{N}\sum_i(\hat y_i-y_i)x_i
  $$

  $$
  \frac{\partial L}{\partial b}
  =\frac{2}{N}\sum_i(\hat y_i-y_i)
  $$

  Clearly distinguish the derivative for one data point from the average gradient over all points.

  Completion checks:
  - Formula matches `lineLossAndGradients()`.
  - One-point worked example is explicitly labeled as one point.
  - Live gradient numbers reproduce the formula.

- [ ] **5. Standardize loss names and units**

  Label each displayed quantity precisely:
  - entropy or cross-entropy in bits;
  - cross-entropy loss in nats;
  - mean squared error;
  - perplexity as `2^bits` or `e^nats` depending on the logarithm base.

  Add a short bridge explaining that MSE and cross-entropy are different objectives and their raw numeric values should not be compared directly.

  Completion checks:
  - Every loss metric has a clear name and, where applicable, unit.
  - Bits/nats/perplexity conversions remain consistent.
  - No learner-facing panel presents incomparable losses as if they shared a scale.

- [ ] **6. Explain numerically stable softmax**

  Add the implementation form already used in `chapter4.js`:

  $$
  q_i=\frac{e^{z_i-\max(z)}}{\sum_j e^{z_j-\max(z)}}
  $$

  Explain that subtracting the same maximum from every logit does not change the final probabilities; it prevents exponentials from overflowing.

  Completion checks:
  - Prose matches the `softmax()` helper.
  - One short numeric intuition is included.
  - The main softmax explanation is not made substantially denser.

## Phase 2: Missing Mathematical Foundations

- [ ] **7. Add a scalar-vector-matrix-tensor bridge**

  Introduce these objects using the chapter's network rather than a detached glossary:
  - one loss value is a scalar;
  - one embedding or hidden state is a vector;
  - stacked embeddings and layer weights are matrices;
  - multiple examples processed together form a higher-dimensional tensor.

  Explain shape notation in plain language before using symbols such as `V x d` or `5 x 3`.

  Completion checks:
  - Every object is connected to a visible network quantity.
  - No broad tensor theory is added without immediate use.
  - The learner can identify the scalar, vectors, and matrices in the tiny network.

- [ ] **8. Teach one matrix multiplication by hand**

  Follow the attached PDF's useful ladder: check compatible shapes, select one row and one column, compute their dot product, place that value in one output cell, then repeat conceptually.

  Use a small network-shaped example rather than a generic large matrix.

  Completion checks:
  - Show `(n x m)(m x k) -> (n x k)` in plain language.
  - Compute at least one output entry fully.
  - Connect the operation to hidden activations or output logits.

- [ ] **9. Introduce transpose, element-wise multiplication, and outer products before backprop needs them**

  Explain:
  - transpose swaps rows and columns;
  - element-wise multiplication combines matching positions;
  - a blame column times a signal row creates a full weight-gradient matrix (outer product).

  Use the same shapes and symbols that appear later in backpropagation.

  Completion checks:
  - Learners encounter `W^T`, `delta x^T`, and element-wise activation slopes before the macro backprop formulas.
  - Shape compatibility is visible.
  - No determinant, inverse, eigenvalue, or unrelated linear-algebra material is added.

- [ ] **10. Clarify input embeddings versus output scoring weights**

  Explain that:
  - input embedding rows represent context tokens;
  - the hidden state summarizes the context;
  - output weights or output vectors score candidate next words;
  - some production models tie input and output matrices, but that is optional context.

  Correct any sentence implying the input embedding table alone ranks next-word candidates in this chapter's network.

  Completion checks:
  - Vector section and forward-pass section use compatible terminology.
  - The live network's actual `W2` scoring path is represented honestly.

- [ ] **11. Motivate bias, activation, and logit before relying on the names**

  Preserve the existing valve and opinion-maker analogies. Ensure each term first solves a visible problem:
  - bias is a learned constant that shifts when a neuron activates;
  - activation provides the non-linear bend that stacked linear layers lack;
  - logit is a raw pre-probability score.

  Completion checks:
  - Each term has a plain-language purpose before formal notation.
  - The explanation remains concise enough to preserve forward momentum.

## Phase 3: Strengthen the Main Narrative

- [ ] **12. Make the chapter midpoint explicit: Make a guess -> Make it learn**

  Keep the current section order, but add a visible narrative transition:
  - Part A builds the forward guess: probability, vectors, network, softmax, loss.
  - Part B makes the model learn: gradients, backpropagation, updates, full training.

  Completion checks:
  - No major page redesign is required.
  - The learner can state what has been built at the midpoint and what remains.

- [ ] **13. Refine the probability section's required path**

  Keep the running `the cat -> sat/ran/slept` example, live counts, entropy, cross-entropy, perplexity, and worked arithmetic as the required spine.

  Move only genuinely optional depth—historical compression interpretation or extended proof material—behind clearly labeled disclosures if the main path remains too dense.

  Completion checks:
  - No valuable explanation is deleted.
  - Optional depth preserves the author's voice and full reasoning.
  - The required path reaches the live cause/effect panel without excessive delay.

- [ ] **14. Consolidate softmax repetition**

  Preserve:
  - motivation for logits;
  - exponentiate-and-normalize intuition;
  - live temperature panel;
  - one worked numeric example;
  - symbolic definition;
  - one rigorous derivation of `q-y`.

  Move repeated versions of the same cancellation proof into one disclosure or the local backprop calculus refresher.

  Completion checks:
  - Every retained surface adds a distinct layer.
  - `q-y` is derived once and referenced later rather than re-taught cold.

- [ ] **15. Strengthen the gradient transition**

  Explicitly distinguish:
  1. loss measures the mistake;
  2. the gradient calculates how each parameter affects that mistake;
  3. gradient descent uses those gradients to update parameters.

  Connect the two-number line gradient to the later gradient vector containing every neural-network parameter derivative.

  Completion checks:
  - Gradient and gradient descent are not used interchangeably.
  - The line-fitting lab visibly prepares the learner for backpropagation.

## Phase 4: Consolidate Backpropagation

- [ ] **16. Choose one canonical network and notation**

  Audit the networks currently used by:
  - forward-pass panel;
  - videos;
  - 13-step worksheet;
  - micro numerical walkthrough;
  - macro matrix walkthrough;
  - live backprop panel.

  Reuse one network and one notation wherever practical. Where a smaller slice is necessary, explicitly state that it is a cropped view of the canonical network rather than an unrelated model.

  Completion checks:
  - Inputs, hidden units, outputs, activations, target word, and symbols remain consistent across surfaces.
  - Any deliberate simplification is stated before it appears.

- [ ] **17. Make the 13-step worksheet the backprop section's spine**

  Preserve the worksheet, immediate correctness feedback, progressive hints, solution reveal, network diagram, and local calculus refresher.

  Reorder surrounding prose and animations to prepare for or reinforce worksheet steps rather than independently retelling the entire algorithm.

  Completion checks:
  - Learners encounter the worksheet at the point of maximum readiness.
  - The worksheet's numbers match every nearby explanation.
  - No worksheet functionality is lost.

- [ ] **18. Consolidate repeated backprop explanations without deleting depth**

  Preserve:
  - factory analogy;
  - animations;
  - by-hand worksheet;
  - one complete numerical micro-example;
  - matrix scaling;
  - optional transpose proof;
  - golden rules;
  - live backprop panel;
  - vanishing-gradient bridge.

  Move duplicate derivations or repeated `q-y` explanations behind disclosures and add clear cross-references to the canonical derivation.

  Completion checks:
  - Main path is shorter and more coherent.
  - Optional rigor remains complete.
  - Every retained block has a unique teaching job.

- [ ] **19. Add a computational-graph explanation**

  Use a tiny expression such as `y = f(Wx + b)` to show:
  - primitive operations as nodes;
  - values flowing forward;
  - local derivatives flowing backward;
  - each operator knowing its local derivative;
  - PyTorch/TensorFlow automatic differentiation composing those local rules.

  Completion checks:
  - The explanation connects directly to the existing network.
  - Automatic differentiation is distinguished from gradient descent.
  - No framework-specific implementation tutorial is required.

- [ ] **20. Re-anchor matrix shapes during backpropagation**

  Replace abstract `M` and `N` where possible with chapter quantities:
  - output vocabulary size `V`;
  - hidden width;
  - input width;
  - batch size when introduced.

  Connect `W2^T delta` to gathering blame and `delta h^T` to building the weight-gradient grid.

  Completion checks:
  - Every matrix formula has input and output shapes.
  - Shapes match the earlier matrix bridge.

- [ ] **21. Clarify backpropagation versus gradient descent**

  State plainly and repeatedly enough to prevent confusion:
  - backpropagation calculates all gradients;
  - gradient descent applies those gradients to update parameters.

  Completion checks:
  - This distinction appears before the live backprop panel and before the final training loops.
  - The compute-order explanation remains accurate.

## Phase 5: Interaction Hardening

- [ ] **22. Give blocked worksheet navigation visible feedback**

  When the learner presses Next before checking or revealing the current step, display a clear message explaining what is needed. Keep Enter-to-check behavior and consider Arrow Left/Right only if it does not conflict with text input.

  Completion checks:
  - Next never appears broken.
  - Keyboard and mouse flows both work.
  - Feedback remains accessible through `aria-live`.

- [ ] **23. Bound gradient auto-training**

  Stop auto-training when any of these occurs:
  - loss converges;
  - maximum steps/time is reached;
  - loss diverges or becomes non-finite;
  - learner presses Stop;
  - page unloads or becomes inactive if appropriate.

  Add a completion or divergence status message.

  Completion checks:
  - High learning rates cannot run indefinitely.
  - Start/Stop/Reset states remain predictable.

- [ ] **24. Audit reset and focus behavior**

  Test and define intentional reset behavior for:
  - probability panel;
  - vector panel;
  - gradient line fit;
  - backprop neuron focus;
  - worksheet;
  - classifier trainer;
  - next-word trainer and generated sentence.

  Completion checks:
  - No stale values survive a reset unexpectedly.
  - Empty-state versus baseline-state behavior is intentional and documented.

- [ ] **25. Simplify training event handling**

  Review dual `pointerdown` and `click` bindings on classifier and next-word training buttons. Keep one reliable cross-input path or explicitly suppress duplicate pointer-generated clicks.

  Completion checks:
  - One physical interaction starts exactly one run.
  - Mouse, keyboard, touch, and automation paths work.
  - Running guards remain intact.

- [ ] **26. Validate video and motion behavior**

  Check all four MP4 files and posters:
  - forward pass;
  - softmax/loss;
  - backprop blame;
  - gradient update.

  Verify controls, keyboard access, poster frames, MIME types, captions, reduced-motion expectations, and readable fallback text when media cannot load.

  Completion checks:
  - Every video loads locally.
  - No autoplay is introduced.
  - Each clip has a unique teaching purpose.

## Phase 6: Strengthen the Final Build

- [ ] **27. Make generalization and overfitting the explicit purpose of Act 1**

  Preserve the classifier, noisy-ring experiment, parameter readout, decision map, train/test split, and existing prose.

  Ensure the learner understands that Act 1 remains because it teaches a distinct concept that earlier training panels do not: generalization.

  Completion checks:
  - The recommended overfitting experiment is prominent.
  - The train-test gap is visually and verbally unmistakable.

- [ ] **28. Strengthen the Act 1 -> Act 2 bridge**

  Explain directly:
  - classifier overfitting means chasing noisy training dots;
  - language-model overfitting means memorizing the tiny corpus;
  - both use the same training loop and fail for the same reason.

  Completion checks:
  - Act 2 feels like the payoff of Act 1, not a second unrelated trainer.

- [ ] **29. Add corpus and training transparency**

  Surface or explain:
  - sentence count;
  - vocabulary size;
  - training examples per epoch;
  - parameter count;
  - embedding width;
  - hidden width;
  - fixed learning rate;
  - deliberate browser-scale limitations.

  Completion checks:
  - Every readout maps to a concept already introduced.
  - No unexplained magic number remains.

- [ ] **30. Explain epochs, stochastic updates, and mini-batches**

  Connect prose to the actual browser implementation:
  - examples are shuffled each epoch;
  - one epoch is one pass through every context/target example;
  - the browser currently updates after one example at a time, which is stochastic gradient descent;
  - production training usually groups examples into mini-batches for efficient parallel computation.

  Completion checks:
  - The explanation matches `nwTrainEpochs()` and the classifier trainer.
  - Batch terminology is not introduced without shapes or examples.

- [ ] **31. Add a short optimizer bridge**

  Keep vanilla gradient descent as the required mechanism. Add concise optional context:
  - momentum smooths and accumulates direction;
  - RMSprop adapts step sizes using recent squared gradients;
  - Adam combines momentum-like averages with adaptive scaling;
  - AdamW separates weight decay from the gradient update.

  Completion checks:
  - No full optimizer derivation is required.
  - Explain the problem each optimizer addresses.
  - Do not imply the browser model uses Adam when it does not.

- [ ] **32. Strengthen the Chapter 5 transition**

  End with the fixed two-word context as the exact limitation. Explain that attention changes how context is gathered while retaining the same embeddings, logits, softmax, cross-entropy, backpropagation, and optimization loop.

  Completion checks:
  - Chapter 5 feels inevitable rather than merely next.

## Phase 7: References, Verification, and Completion

- [ ] **33. Add the attached PDF as a recommended reference**

  Add *Math for Deep Learning* by Ronald T. Kneusel to further reading. Describe the most relevant chapters:
  - linear algebra and matrix multiplication;
  - differential and matrix calculus;
  - backpropagation;
  - gradient descent and optimizers.

  Do not reproduce copyrighted figures or extended text.

- [ ] **34. Review all formulas and repeated numbers**

  Verify every formula, worked value, label, quiz explanation, worksheet answer, video caption, and live output against `chapter4.js`.

  Include at least:
  - entropy/cross-entropy/perplexity;
  - dot product/cosine;
  - forward-pass weights and logits;
  - stable softmax;
  - temperature gradients;
  - MSE gradients;
  - backprop micro-example;
  - matrix shapes and transposes;
  - trainer parameter counts;
  - final-model perplexity.

- [ ] **35. Run the complete interaction test matrix**

  Test:
  - every slider and select;
  - every quiz and disclosure;
  - all worksheet steps, hints, checks, reveals, navigation, and reset;
  - gradient auto-training including extreme rates;
  - backprop focus and reset;
  - all classifier controls and training states;
  - all next-word controls, training, generation, and reset;
  - editable code cell;
  - videos and posters;
  - desktop and mobile overflow;
  - local links and console errors.

- [ ] **36. Final voice, flow, and release review**

  Read the chapter linearly as a curious high-school learner.

  Confirm:
  - author voice and phrasing remain intact;
  - every term is motivated before being named;
  - formulas follow worked intuition;
  - repeated surfaces each add unique value;
  - the chapter's two-part spine is visible;
  - no draft or unfinished control appears ready prematurely;
  - all intended sections are frozen only after review and approval.

  Once approved:
  - freeze every completed Chapter 4 section;
  - remove the In Progress treatment if publishing;
  - restore navigation links as appropriate;
  - delete this temporary planning file;
  - commit, push, and verify the live GitHub Pages deployment.

## Topics from the Attached PDF: Include, Mention, or Defer

### Include in the Main Path

- Matrix multiplication as repeated dot products.
- Shape compatibility.
- Transpose.
- Element-wise multiplication and outer products where backprop uses them.
- Gradient as a vector of partial derivatives.
- Computational graphs and automatic differentiation.
- Clear distinction between backpropagation and gradient descent.
- SGD/epoch/mini-batch intuition tied to the browser trainer.

### Mention Briefly or Make Optional

- Momentum.
- RMSprop.
- Adam and AdamW.
- Tensors beyond matrices and batches.
- Vanishing gradients as a bridge to skip connections and normalization.

### Defer from This Chapter

- Broad descriptive statistics and hypothesis testing.
- Determinants and matrix inverses.
- Eigenvalues and eigenvectors.
- PCA and SVD.
- Jacobians and Hessians in full generality.
- CNN-specific data flow.
- Full optimizer derivations.

## Recommended Starting Point

Begin with **Item 1: Repair obvious copy and markup defects**. It is a narrow, low-risk change that establishes a clean baseline. After implementation and focused validation, pause for review before starting Item 2.
