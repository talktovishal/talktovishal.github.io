# Chapter 4 Work Plan

> Temporary planning file. Delete this file after Chapter 4 is reviewed, completed, frozen, and published.

## Working Agreement

We will complete this plan one checklist item at a time so every change remains easy to understand and review.

### Review-markup lifecycle

Each lesson change has two separate passes:

1. **Proposal pass:** keep removed or replaced text visible with a strike-through and render proposed text in green. Use `<del class="review-remove">...</del>` and `<ins class="review-add">...</ins>` for inline copy. Use equivalent `.review-remove` and `.review-add` wrappers when a whole paragraph, figure, panel, or section is being replaced.
2. **Approval pass:** after the author approves the proposal, permanently remove the struck-through version, unwrap the green version so it returns to normal lesson styling, rerun the focused checks, and mark the checklist item `[x]`.

For interactive changes, never leave two working copies of controls with duplicate IDs or event listeners. The old version may remain only as an inert struck-through snapshot with IDs removed and controls disabled; the green version is the only live implementation. For a JavaScript algorithm change that cannot coexist safely, show its old observed result struck through and its proposed result in green in a temporary comparison near the affected output.

Keep active proposals in a temporary review queue near the top of this long chapter. Sort the queue by the order in which the affected material appears in the lesson, name the affected section, and link to the live surface. Contextual redline may also remain beside the changed content, but the author must not have to scroll through the chapter to discover what changed.

This does **not** authorize reordering Chapter 4. The lesson keeps its existing section order. We reorder only the implementation queue: after the already-active A1 review is resolved, choose remaining work by the first place it affects the chapter and proceed from the overview to the references. Priority labels describe impact; they do not determine review order.

Do not combine the proposal and approval passes. Do not start another checklist item while the current item is `[~]` and awaiting review.

For each item:

1. Select one checklist item and mark only that item `[~]`.
2. Implement only that item in review-markup mode and avoid unrelated cleanup.
3. Preserve the author's words, phrases, examples, and voice unless the item explicitly identifies a correctness, clarity, duplication, or prerequisite problem.
4. Run focused math, browser, interaction, and responsive checks for the affected slice.
5. Summarize exactly what changed, what remains visible for comparison, and what was preserved.
6. Pause for author review before cleanup or before starting the next item.
7. After approval, perform the cleanup pass, rerun focused validation, mark the item `[x]`, and then choose the next item.
8. Update this checklist immediately when an item is approved, rejected, blocked, or changes scope.

Status key:

- `[ ]` Not started
- `[~]` In progress or awaiting review
- `[x]` Approved and complete
- `[!]` Blocked or needs a decision

Items 2-4 below were implemented before this review-markup lifecycle was adopted and remain `[~]`. They must be reviewed one at a time. If the existing result is difficult to verify, reconstruct its before/after presentation in review mode before asking for approval.

## Current Position

- **Completed and approved:** A0 (reusable review-diff styling), A1 (stable next-word training with concrete completion feedback), A4 (Chapter 1 continuity and synchronized `p`/`q` example), A5 (refocused Words as vectors around the operation Chapter 4 needs), A6 (Chapter 3 tokenization-to-embedding bridge), Items 1 (copy and markup defects), 5 (loss names, units, and precision), 7 (scalar-vector-matrix-tensor bridge), and 13 (probability-section required path).
- **Approved local slice:** A3's Build the forward pass revision is approved and cleaned up; later A3 slices remain deferred to Softmax and Backpropagation.
- **Active and awaiting review:** Item 8, one matrix multiplication by hand.
- **Next after Item 8 approval and cleanup:** Item 10, clarify input embeddings versus output scoring weights.
- **Later enhancement:** evaluate a floating scratch calculator separately after the core walkthroughs are approved.
- **Already implemented before this workflow, to review later in chapter order:** Items 2-4 when the queue reaches Softmax and Gradients.

## Master Implementation Order: Top to Bottom

A1 was completed as the one exception already underway when this ordering rule was adopted. Continue with this chapter-location queue rather than task-number order:

1. **Overview and course continuity:** A6.
2. **Surprise and the next word:** A4, 5, 13.
3. **Words as vectors:** A5, 7, A7 where it first affects the vector panel.
4. **Build the forward pass:** A3 where the responsibility split begins, then 8, 10, 11, 26 for the forward-pass clip.
5. **Softmax and assigning blame:** 2, 3, 6, 14, then the softmax portion of A3 and A7.
6. **Gradients and loss:** 4, 15, 23, A8.
7. **Backpropagation:** 9, 16-22, A9, then the backpropagation clips from 26.
8. **Act 1 - generalization and overfitting:** 24-25 where they affect this trainer, then 27.
9. **Act 2 - train a next-word model:** A1 (complete), then A2, 24-25 where they affect this trainer, 28-31, A10, and 32.
10. **References:** 33.
11. **Whole-chapter verification and release:** 34-36.

When a cross-cutting item touches several sections, stage and review its local effects as the queue reaches each section rather than forcing the author to jump backward and forward through the chapter.

This is the controlling work order. The chapter itself is not reordered.

## Audit Addendum: Newly Verified Tasks

- [x] **A0. Add reusable review-diff styling** — approved and cleaned up

  Add the temporary visual language required by this workflow before changing lesson content:
  - `.review-remove` remains readable but visibly struck through;
  - `.review-add` is clearly green and readable in light and responsive layouts;
  - inline `<del>` and `<ins>` do not disturb paragraph flow;
  - block wrappers preserve spacing and do not create nested-card layouts;
  - inert old controls cannot receive focus or submit actions.

  Keep this styling available through all Chapter 4 review cycles, but make it easy to remove after the chapter is approved. Remove A0's sample markup after its review; retain the reusable classes until the final chapter cleanup. If shared `styles.css` is used, bump its cache token on every lesson page as required by the deployment guide.

  Completion checks:
  - A tiny text and block example renders correctly at desktop and mobile widths.
  - Strike-through and green additions remain distinguishable without relying on color alone.
  - No duplicate IDs, focusable removed controls, console errors, or horizontal overflow are introduced.

- [x] **A1. Stabilize the next-word trainer and convergence rule** — approved and cleaned up

  Fix the root cause of the verified deterministic learning failure. With the current fixed rate of `0.2`, the model improves through roughly epoch 5 and then degrades: loss moved from `4.1135` initially to `1.4139` at epoch 5, but rose to `2.3445` by epoch 60. The current plateau rule also counts a worsening loss as progress toward "converged."

  Evaluate the smallest honest remedy, such as a lower rate, a decaying rate, best-checkpoint restoration, and a convergence test that distinguishes improvement, plateau, and divergence. Keep the browser model simple enough to teach vanilla stochastic gradient descent.

  Completion checks:
  - The same seeded run improves reliably at the default code-cell length.
  - The 15-, 30-, and 60-second paths never finish with a materially worse model than the best model reached during that run.
  - The completion message states the starting loss, kept loss, best epoch, and number of later passes that did not beat it; unexplained terms such as "plateau" and "best checkpoint" stay out of the learner-facing status.
  - Loss, perplexity, watched contexts, and generated samples agree with the restored/final weights.

- [ ] **A2. Make the final code cell report an honest baseline and useful curve**

  The current `startLoss` is captured after the first training epoch, which hides the true random-initialization baseline. Change the exercise so it records epoch 0 before training, exposes enough of the curve to show what happened, and does not promise monotonic improvement unless the implementation guarantees it.

  Completion checks:
  - `startLoss` and starting perplexity come from epoch 0.
  - The returned result makes improvement or regression visible rather than reporting only two potentially misleading endpoints.
  - Running the code cell still reveals and refreshes the nearby next-word panels.
  - The quiz, comments, rendered output, and live trainer describe the same behavior.

- [ ] **A3. Reorder the conceptual responsibilities of softmax, gradients, and backprop** — forward-pass slice approved and cleaned up; later Softmax/Backpropagation slices not started

  Keep the broad chapter flow but stop deriving gradient rules before the learner knows what a gradient is. Use this responsibility split as the starting proposal:
  - forward pass: carry the example through raw logits and preview that normalization comes next;
  - softmax: turn logits into probabilities and calculate cross-entropy;
  - gradients: explain derivative, gradient, chain rule, and gradient descent with the line-fitting lab;
  - backprop: derive `q - y`, apply the temperature chain-rule factor, and send that error backward.

  Completion checks:
  - No displayed value, derivative, or quiz depends on gradient vocabulary before the gradient section motivates it.
  - The softmax panel may preview later learning only in plain language, not with unexplained derivative notation.
  - Cross-references still make the complete compute order clear.
  - Existing correct temperature math is preserved when moved.

- [x] **A4. Make Chapter 1 continuity explicit without re-teaching perplexity** — approved and cleaned up

  Chapter 1 now teaches per-token surprise, logarithm bases, bits/nats, perplexity, held-out evaluation, and overfitting in depth. Refocus Chapter 4's opening probability section on what is new here: a true distribution `p`, a model distribution `q`, the entropy floor, cross-entropy as training loss, and the gap between unavoidable and avoidable surprise.

  Completion checks:
  - The section opens with a concise recall of Chapter 1 rather than presenting perplexity as new.
  - The `the cat -> sat/ran/slept` counts and live sliders remain the running example.
  - Every occurrence of the two distributions keeps the same word order and labels `p` as evidence and `q` as the model's current belief; the by-hand formula shows that `p` supplies frequency weights and `q` supplies surprise.
  - The default `p`/`q` comparison, metrics, and narrative render on load; moving any count or guess slider continues to recompute them live.
  - Each word keeps one consistent color across its evidence slider, model slider, and computed evidence bar, including when a context preset changes row order.
  - New concepts receive full explanation; repeated Chapter 1 material is shortened or placed behind optional disclosure without deleting unique reasoning.

- [x] **A5. Refocus the vector section around the network operation Chapter 4 actually needs** — approved and cleaned up

  Chapter 2 already teaches vector direction, cosine similarity, embedding training, PCA, and the warning that individual dimensions are not human-labelled traits. Remove or correct Chapter 4's renewed "furriness/royalty" dimension story and its implication that this model ranks candidate words directly with the input embedding rows.

  Rebuild the required path around:
  - token ID selects an input embedding row;
  - two rows are concatenated into the network input;
  - neurons use dot products with learned weight rows;
  - the hidden state is scored by `W2` plus bias to create logits;
  - input/output weight tying is optional context, not the behavior of this toy.

  Completion checks:
  - The prose agrees with `z = W2 h + b2` and the live implementation.
  - No single embedding dimension is presented as a literal interpretable trait.
  - Chapter 2's useful vector intuition is recalled, not duplicated at full length.

- [x] **A6. Add the Chapter 3 tokenization-to-embedding bridge near the opening** — approved and cleaned up

  State early that the browser toy deliberately uses one whole word per token, while Chapter 3 showed that production tokenizers usually produce subword token IDs. Show the actual transition:

  `text -> toy word tokens -> token IDs -> embedding rows -> network`

  Completion checks:
  - The opening no longer jumps directly from words to vectors as if tokenization did not exist.
  - The simplification is explicit and does not imply that real LLM vocabularies contain only words.
  - Later uses of "word," "token," "token ID," and "embedding row" remain consistent.

- [ ] **A7. Apply learner-initiated reveal consistently** — vector-panel slice rejected; retain its populated cat/dog baseline because the starting comparison is useful evidence. Later slices not started.

  Audit the vector, forward-pass, softmax, and logit-gradient outputs that currently render their answers on load while probability, line fitting, and trainers begin blank. Define a meaningful trigger for each output and retain live updates after the first interaction.

  Completion checks:
  - Every gated placeholder names the exact nearby control that reveals it.
  - Readout labels that make controls feel responsive may remain live before reveal.
  - Running a nearby code cell reveals the corresponding visual when applicable.
  - Deliberate baseline exceptions are documented rather than accidental.

- [ ] **A8. Replace uncontrolled looping motion with learner-controlled motion**

  The gradient-descent GIF loops automatically, unlike the chapter's controlled MP4 clips and step buttons. Replace it with a paused poster plus controls, a manual stepper, or another static-first implementation that provides replay and reduced-motion behavior.

  Completion checks:
  - Nothing important autoplays or loops indefinitely.
  - The first frame teaches something before interaction.
  - Keyboard controls, caption/transcript, and reduced-motion behavior are available.

- [ ] **A9. Repair the verified mobile backprop formula clipping**

  At the narrow test viewport, three backprop `.formula-stack` blocks are wider than their containers while the page hides horizontal overflow. The affected examples include the two-class softmax calculation, the output-weight gradient, and the hidden-weight gradient.

  Completion checks:
  - Each affected formula wraps legibly or scrolls within its own clearly bounded container.
  - The backprop section and document have no hidden/clipped content at mobile widths.
  - KaTeX, code formulas, tables, SVG labels, and worksheet controls remain contained.

- [ ] **A10. Correct stale finale copy and precision claims**

  Update text that no longer matches the implementation, including the closing instruction to "push the epochs slider" and the reference to "twelve sentences." The current UI uses a time-budget selector and the live corpus contains 72 sentences. Also audit over-broad statements such as cross-entropy being "the difference" between distributions and `-log2(q)` being a literal integer bit count rather than an ideal information/code length.

  Completion checks:
  - Every named control exists with the exact displayed label.
  - Corpus size, parameter count, context width, learning rate, and training behavior match the live implementation.
  - Cross-entropy, entropy gap/KL interpretation, and ideal code-length wording are mathematically precise but remain approachable.

- [ ] **A11. Evaluate an optional floating scratch calculator**

  After the core worked examples and reversible steppers are approved, evaluate a small learner-controlled calculator for checking arithmetic without leaving the page. It must be optional, keyboard accessible, movable or collapsible without covering lesson content, and must not replace the lesson's own worked steps.

  Completion checks:
  - The calculator solves a demonstrated learner need rather than adding generic chrome.
  - It never obscures controls, formulas, or diagrams at desktop or mobile widths.
  - Learners can dismiss it and complete the chapter without it.

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

- [x] **5. Standardize loss names and units** — approved and cleaned up

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

- [x] **7. Add a scalar-vector-matrix-tensor bridge** — approved and cleaned up

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

- [~] **8. Teach one matrix multiplication by hand** — awaiting author review

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

- [x] **13. Refine the probability section's required path** — approved and cleaned up

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

- [ ] **26. Validate video and motion behavior** — the forward-pass clip is being reconsidered under A3; validate only clips that remain after review

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

Current item: review **Item 8: Teach one matrix multiplication by hand**. After approval and cleanup, continue to **Item 10: Clarify input embeddings versus output scoring weights**. The vector panel remains a documented populated-baseline exception.

Items 2-4 are older changes awaiting review. Review them separately when the top-to-bottom queue reaches their affected sections; do not bundle them into another item.
