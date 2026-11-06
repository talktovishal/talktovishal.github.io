# Chapter 4 Work Plan

## Approval On 2026-11-06

- The author approved all three implemented proposals and supplied `IGNORE_FROZEN` for approval cleanup. Removed the review queue, struck-through copy, addition wrappers, and unused review styles; approved content now has normal styling. Frozen attributes remain in place.
- Approval checks pass: four numerical tests; 33 displayed derivation equations; MSE 0.4814 after one descent step; backward trace navigation; all nine 3D stages; loss 1.4232188693 -> 1.3097769738 after the update; exact undo. No runtime or KaTeX errors, review markup, or overflow at actual widths 375 and 1200. The backpropagation section retains its ten intended direct children.
- This approval covers the Section 5 layout, optional 3D lab, and controlled backward motion. Unimplemented findings below remain follow-up work; PDF work is still deferred. Keep this plan while those items remain open.

## Gradient Exercise Setup And Derivation

- [x] Author approved the Section 5 setup, complete MSE derivation, A-F labels, coordinate grid, and consolidated live lab on 2026-10-09.
- [x] Removed redlines, the retired walkthrough snapshot, review queue, review stylesheet link, and unused review CSS. Approved content now has normal styling.
- Preserved all six data points, default parameters, live-lab control IDs, and training behavior. Other frozen sections remain untouched.
- Section 5 was refrozen at the author's request on 2026-10-10. This does not declare the remaining Section 6 corrections complete; PDF work remains deferred.

## Focused Validation

- All six table/plot coordinates and 18 ledger values match the live dataset. Both analytic gradients match central finite differences at the default and two non-default lines.
- A-F refinement checked: half-unit grid positions match the coordinate transform, live table labels match the graph, and all labels stay in bounds without overlaps at rendered widths 301, 375, and 1200. Mobile screenshot, JavaScript syntax, and editor diagnostics pass; one update still yields MSE 0.481.
- Consecutive Step descent actions show actual MSE 0.5563 -> 0.4814 -> 0.4203. Slider changes and Reset clear the comparison; automatic training stops after 37 steps at MSE 0.0044. The rounded no-change case reports unchanged loss consistently. The live A-F ledger includes all six squared-error contributions.
- Approval cleanup rechecked: no review markup remains; section children are heading, derivation, vector bridge, live lab, and two quizzes. Step descent still gives MSE 0.5563 -> 0.4814, and Reset clears the comparison.
- At actual rendered widths of 301, 375, and 1200 pixels, the approved content has no horizontal overflow or KaTeX errors. The square-rule proof was also checked open during the proposal pass.
- Desktop/mobile screenshots and SVG bounds checks pass; mobile labels do not overlap. Direct children of the restructured section and derivation match the intended order. No runtime errors were captured.

## Gradient Derivation Layout Review

- [x] Approved 2026-11-06: the six-step derivation uses ruled equation groups, aligned per-point rows, and distinct subtotals, without changing its content or calculations.
- The author redirected work to this Section 5 layout on 2026-11-05 and supplied `IGNORE_FROZEN`. The separate proposals were subsequently approved together on 2026-11-06.
- Removed the layout review card during approval cleanup; the frozen attributes and approved layout remain.
- Verification: compare the complete derivation source with the approved version, allowing only the subtotal styling class; check all six steps and all 18 point values; inspect equation bounds, label/value row alignment, and page overflow at desktop and narrow mobile widths with the optional square proof open.
- Passed: the complete derivation source matches the approved version exactly after removing the new subtotal class. All six steps, 33 displayed equations (including the open square proof), and 18 point values remain intact.
- At actual rendered widths 301, 375, 800, and 1200, no equation, point ledger, or page overflow was found. Label/value rows align, column and row separators render, and subtotals have their distinct boundary. No KaTeX errors were present; desktop and mobile viewport captures show the new grouping.
- Step descent still applies slope -0.32 and intercept 0.20, reducing MSE from 0.5563 to 0.4814. The existing four backpropagation trace controls and their review card remain intact. No JavaScript, mathematical content, or PDF output was changed in this layout pass.

## Section 6 Read-Only Review

- [x] Reviewed the explanation, scalar and matrix derivations, nudge experiment, 13-step worksheet, and live backpropagation lab. The author subsequently unlocked Section 6 and its pass map for the correction pass.
- Resolved, update notation: the introduction and embedding handoff now use the loss gradient and explicitly separate learning-rate scaling from subtraction. The author approved this correction on 2026-10-10.
- P2, live update table: after a step, rendering recomputes the next proposal but labels its columns only old/new. After the first default step, the actual h2-to-sat weight is -0.652 while the table's new value is -0.698. Label it as the next proposed update or preserve the last applied comparison beside the action.
- Resolved 2026-11-06, motion: replaced the five indefinite SVG edge animations with learner-controlled playback that respects reduced motion.
- P2, keyboard access: hidden-neuron selection uses click listeners on SVG groups without focusability, button semantics, or keyboard handlers.
- Lower-priority cleanup: the matrix deep dive repeats the vanishing-gradient heading, and the worksheet's exponential hint rounds `exp(0.244)` to 1.277 instead of 1.276. The correct unrounded calculation is used by the answer checker.
- Verified: all live parameter gradients agree with central finite differences for ReLU, tanh, and sigmoid (maximum absolute error 1.2e-11). All 13 rounded worksheet answers pass; the nudge reduces loss by 0.001366. The loss sparkline correctly slopes downward. At actual widths 375 and 1200, there are no page overflow, KaTeX errors, or visible SVG text-bounds violations.
- Keep the detailed derivation and worksheet: they explain and rehearse different jobs rather than duplicating a replay-only walkthrough.

## Section 6 Correction Queue

Implement one item at a time, in order of its first appearance in the lesson. Preserve red/green evidence until that item is approved; do not begin the next item while one is awaiting review.

Section 6 and its nested pass map were refrozen at the author's request on 2026-10-10. The author supplied `IGNORE_FROZEN` on 2026-11-05 to resume the correction pass. The frozen attributes remain in place; work still proceeds one reviewable item at a time.

- [x] Approved 2026-10-10: corrected the opening loss-gradient notation and carried the learning rate into the embedding handoff. Removed the redlines, review queue, review stylesheet link, and scoped redline-padding rule; the approved explanation now has normal styling.
- [x] Approved and cleaned up 2026-11-06: optional "Inside one training step" 3D lab after the worksheet, explicitly requested with `IGNORE_FROZEN` on 2026-11-05.
- [x] Approved and cleaned up 2026-11-06: learner-controlled motion that respects reduced motion in the live backward graph, retaining a meaningful static baseline.
- [ ] Make hidden-neuron selection keyboard-accessible with focus visibility, semantics, and Enter/Space activation.
- [ ] Label the live table as the next proposed update, distinct from the weight change already applied.

The author requested committing and pushing all pending site changes on 2026-10-10. The other three corrections remain queued for separate review; the minor copy findings and PDF work are not included in this approval pass.

Item 1 approval validation: the live worksheet gives embedding gradient -0.2097569524 and updated coordinate 0.5209756952 at learning rate 0.10, matching the displayed 0.521. Both formulas render, no review markup remains, and the Section 6 direct-child structure is unchanged. At actual widths 301, 375, and 1200, there are no local/page overflows, KaTeX errors, or captured runtime errors. The lesson and work plan have clean editor diagnostics; unrelated existing Markdown warnings remain in the root project guide.

### Approved 3D Lab

- The author explicitly requested the spatial lab with `IGNORE_FROZEN`, then approved it with the other two proposals on 2026-11-06. All three review cards and local comparison markup have been removed.
- The opt-in Three.js scene separates inputs, weighted sums, ReLU outputs, logits, probabilities, and loss in depth. Nine reversible stages, finite Play/Pause, camera orbit/zoom, layer spacing, expandable view, node/connection selection, and a screen-facing arithmetic inspector expose the same computation. Backward labels distinguish loss gradients from forward values; projected labels are filtered to avoid collisions and clipping.
- The lab copies `byHandNetwork`, not the wider live lab's model. Its two embedding coordinates, four input weights, two hidden biases, ten output weights, and five output biases are 23 trainable values. The observed target stays sat. Tracing and camera movement never train; a separate action applies one simultaneous gradient step. Parameter perturbation, before/current comparison, undo, and reset operate only on this private copy.
- Dependencies are local and load only after Open: Three.js 0.170.0 (including OrbitControls), Lucide 0.468.0, bundled with esbuild 0.24.0 into `assets/vendor/backprop-three.js` (about 692 KB). Both upstream licenses accompany the bundle. Temporary build dependencies and the entry module are in workspace-root `tmp/backprop-3d`; no runtime CDN or framework migration was added.
- Repeatable numerical check from the workspace root: `node --test personal-site/projects/llm-soup-to-nuts/chapter4-3d.test.cjs`. Four tests pass: canonical worksheet checkpoints; all 23 gradients against finite differences with either ReLU gate configuration; nonmutating simultaneous update; stable Softmax with a large shared logit offset.
- Browser checks pass: all nine stages preserve the model; weight 0.40 -> 0.41 changes loss 1.4232188693 -> 1.4205993052; reset restores the canonical model; rate 0.10 gives loss 1.3097769738 and one recorded step; before/current and undo restore the exact snapshots. The original worksheet remains unchanged.
- Finite playback completed all nine stages under controlled browser timers without training. Pause and Close cancel playback, and reopening retains exactly one paused lab. Reduced motion disables timed playback while retaining direct stage selection. WebGL-disabled fallback retains all nine arithmetic stages, perturbation, update, and undo; rate 0.25 gives loss 1.1449224734.
- Desktop/mobile screenshots and canvas-pixel checks confirm nonblank 3D output. Camera zoom and controlled animation frames produce different pixels without changing the loss. The tested actual viewport widths were 375 and 1200, with no document or lab overflow; mobile defaults to following the current calculation, and its inspector stacks below the scene.
- Light and dark system themes both render correctly. Native canvas clicks select a calculation without changing the model; the canvas retains focus, and native Escape exits the expanded lab after a click. Focus-wrap handlers also pass. The lab remains directly after the worksheet, all three review cards are ordered correctly, frozen attributes remain, and no duplicate IDs or page runtime errors were found.
- Limits: expanded-view keyboard behavior is implemented with native controls, focus containment, and Escape, but full screen-reader and physical touch-device testing is not complete. Background-tab throttling requires controlled timers for deterministic animation checks. The approved lab is not included in the deferred PDF.

### Approved Controlled Motion

- Replaced the five automatic SMIL loops with a still baseline and Back/Next/Play/Pause/Replay controls on the existing graph. The three stages show the loss gradients, the weighted output contributions arriving at the selected hidden neuron, and its activation gate. No second live graph or new weight-update implementation was introduced.
- Play performs one finite pass. Circles carry the actual weighted contributions, use the existing positive/negative sign colors, and scale with magnitude. Back and Replay are static. Reduced motion disables timed playback and leaves every stage available through Back/Next.
- Approval cleanup on 2026-11-06 removed the top review card and local red/green evidence. The new controls and explanation remain with normal styling. The other queued corrections remain untouched.
- Verified in the browser: still initial state; exact particle values `+0.2330164555`, `+0.0808508147`, and `-0.0861891722`; right-to-left travel; finite completion; immediate Pause cleanup; static Back/Replay; no weight changes from tracing; cancellation when context, target, activation, or weights change; reset restores initial weights. A normal gradient step still reduces loss from `0.491612646` to `0.349681820`.
- Reduced-motion checks passed, including cancellation when the preference changes, static contribution stages, and the closed ReLU gate yielding zero. New controls are native buttons; direct keyboard delivery could not be verified because the hidden automation page received no keydown events despite focus. Existing hidden-neuron keyboard selection remains a separate pending item.
- Layout checks passed at actual widths 375 and 1200: no page or changed-panel overflow, SVG text inside its viewBox, unique new control IDs, and the exact intended direct-child list of the visual panel. No page runtime or KaTeX errors were observed. A mobile viewport screenshot was usable; the desktop screenshot was stale, so desktop verification relies on DOM measurements. JavaScript syntax and edited lesson-file diagnostics passed.

## Visual And Continuity Review

Read-only follow-up after refreezing. These remain recommendations, not approved implementation items. Later `IGNORE_FROZEN` authorizations covered the Section 6 motion correction, Section 5 readability refinement, and optional post-worksheet 3D lab above; all three were approved on 2026-11-06. The other visual candidates and continuity findings have not been implemented.

### Confirmed Clarity Findings

- P2, Section 2 opening: "Entropy tells us how wrong our guess was" names the wrong quantity. Cross-entropy measures the model's average surprise; entropy is the evidence's uncertainty floor. Correct the bridge without changing the preceding explanation.
- P2, Section 3 handoff to Section 4: `buildForwardStep()` promises that the next section uses "these exact three logits," but the panels are independent. In the browser, the default forward pass gives `sat 0.987, ran -0.388, slept 0.262`, while Softmax starts at `1.70, 0.80, -1.10`. Either carry the actual logits through or clearly introduce a separate worked example; do not imply a numeric handoff that does not occur.

### Visual Candidates In Chapter Order

- Section 1, high value: extend the existing evidence/model lab with per-word cross-entropy contributions and a shared-scale entropy-floor comparison. Show each frequency times its surprise, then the total; retain the same word colors and existing sliders. The current renderer has evidence probability bars and aggregate metric cards, but no contribution graphic or visible model distribution. Do not introduce a second set of controls.
- Section 2, highest-value small addition: supplement `#number-shapes` with a labeled static diagram of the existing two context matrices stacked into a batch. Keep every running value and label the example, word-position, and coordinate axes. Highlight one number across those three choices so `2 x 2 x 2` becomes inspectable. Prefer readable tables and brackets over a perspective cube that hides cells; no animation is needed.
- Section 3, useful extension: add the selected activation's curve inside the existing Activation step, marking the live preactivation and output. This would make ReLU clipping and tanh/sigmoid saturation visible instead of showing only arithmetic cards. Reuse the curve in backpropagation to explain its local slope after derivatives have been introduced; do not expose derivative notation early or add another walkthrough.
- Section 6, improve rather than add: replace the existing endless dashed motion as part of the queued motion correction. Use the same live graph to show one named contribution, the sum at the selected hidden neuron, its activation gate, and the resulting gradient. Keep gradient calculation distinct from the learner's update action. Learner-controlled stages, a static baseline, and reduced-motion support matter more than additional network pictures.
- Section 7, high value: extend the existing corpus preview with a small learner-controlled two-token window and highlighted next-token target from the actual selected book. Show the original spelling and mapped `<rare>` token when relevant. Distinguish creating overlapping examples in text order from shuffling their training order. This fills a gap between the prose and dataset counts without duplicating the architecture diagram or requiring a training run.

### Review Checks And Limits

- Confirmed the numeric handoff mismatch and five indefinite backward-edge animations in the live DOM. Checked the tensor block, entropy renderer, activation step, and corpus preview against their source and rendered contents; the proposed representations are not already present there.
- At actual browser widths 375 and 1200, the page had no horizontal overflow. The inspected tensor, activation, entropy, and corpus panels also fit at 375px; no KaTeX error elements were present. Captured the existing tensor explanation for visual inspection.
- This was a focused visual/continuity review, not a fresh full mathematics, accessibility, training, or PDF regression run. No lesson HTML, JavaScript, or CSS was changed during that review. The publication pass includes the earlier refreezing commit `77414fc` alongside the three newly approved changes.
