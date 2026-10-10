# Chapter 4 Work Plan

## Gradient Exercise Setup And Derivation

- [x] Author approved the Section 5 setup, complete MSE derivation, A-F labels, coordinate grid, and consolidated live lab on 2026-10-09.
- [x] Removed redlines, the retired walkthrough snapshot, review queue, review stylesheet link, and unused review CSS. Approved content now has normal styling.
- Preserved all six data points, default parameters, live-lab control IDs, and training behavior. Other frozen sections remain untouched.
- Section 5 remains editable; this approval does not declare the whole chapter finished. PDF work and publication were not requested.

## Focused Validation

- All six table/plot coordinates and 18 ledger values match the live dataset. Both analytic gradients match central finite differences at the default and two non-default lines.
- A-F refinement checked: half-unit grid positions match the coordinate transform, live table labels match the graph, and all labels stay in bounds without overlaps at rendered widths 301, 375, and 1200. Mobile screenshot, JavaScript syntax, and editor diagnostics pass; one update still yields MSE 0.481.
- Consecutive Step descent actions show actual MSE 0.5563 -> 0.4814 -> 0.4203. Slider changes and Reset clear the comparison; automatic training stops after 37 steps at MSE 0.0044. The rounded no-change case reports unchanged loss consistently. The live A-F ledger includes all six squared-error contributions.
- Approval cleanup rechecked: no review markup remains; section children are heading, derivation, vector bridge, live lab, and two quizzes. Step descent still gives MSE 0.5563 -> 0.4814, and Reset clears the comparison.
- At actual rendered widths of 301, 375, and 1200 pixels, the approved content has no horizontal overflow or KaTeX errors. The square-rule proof was also checked open during the proposal pass.
- Desktop/mobile screenshots and SVG bounds checks pass; mobile labels do not overlap. Direct children of the restructured section and derivation match the intended order. No runtime errors were captured.

## Section 6 Read-Only Review

- [x] Reviewed the explanation, scalar and matrix derivations, nudge experiment, 13-step worksheet, and live backpropagation lab. Section 6 and its pass map remain frozen; no corrections have been applied.
- P2, update notation: the introduction uses `theta - eta * nabla(theta)` instead of the loss gradient. Backward 4 calls embedding gradients the exact updates to subtract, omitting the learning-rate factor. Use `theta_new = theta_old - eta * dL/dtheta` consistently and distinguish gradients from parameter changes.
- P2, live update table: after a step, rendering recomputes the next proposal but labels its columns only old/new. After the first default step, the actual h2-to-sat weight is -0.652 while the table's new value is -0.698. Label it as the next proposed update or preserve the last applied comparison beside the action.
- P2, motion: five SVG edge animations loop on load, have no pause control, and remain active with reduced motion enabled.
- P2, keyboard access: hidden-neuron selection uses click listeners on SVG groups without focusability, button semantics, or keyboard handlers.
- Lower-priority cleanup: the matrix deep dive repeats the vanishing-gradient heading, and the worksheet's exponential hint rounds `exp(0.244)` to 1.277 instead of 1.276. The correct unrounded calculation is used by the answer checker.
- Verified: all live parameter gradients agree with central finite differences for ReLU, tanh, and sigmoid (maximum absolute error 1.2e-11). All 13 rounded worksheet answers pass; the nudge reduces loss by 0.001366. The loss sparkline correctly slopes downward. At actual widths 375 and 1200, there are no page overflow, KaTeX errors, or visible SVG text-bounds violations.
- Any implementation pass needs the author to remove the relevant frozen attributes or explicitly authorize `IGNORE_FROZEN`. Keep the detailed derivation and worksheet: they explain and rehearse different jobs rather than duplicating a replay-only walkthrough.
