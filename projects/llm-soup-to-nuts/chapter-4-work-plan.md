# Chapter 4 Work Plan - Fresh Full-Chapter Pass

> Temporary planning file. Delete after Chapter 4 is reviewed, completed, frozen, and published.
> This file replaces the previous plan. Every item in that plan was approved and cleaned up; this is a
> new, independent read of the finished chapter looking for anything still wrong, missing, or too complex.

## Working Agreement

Same lifecycle as before, restated so this file stands on its own.

1. **Proposal pass.** Removed or replaced text stays visible with a strike-through (`<del class="review-remove">`,
   or `.review-remove` on a block wrapper); proposed text renders green (`<ins class="review-add">`, or
   `.review-add` on a block wrapper). Never leave two live copies of an interactive control.
2. **Approval pass.** After the author approves an item, delete the struck-through version, unwrap the green
   version, rerun the focused checks, and only then mark the item `[x]`.

Active proposals are mirrored in a temporary review queue at the top of `chapter-4.html`, ordered by where the
change first appears in the chapter, each with a jump link. The chapter itself is **not** reordered.

Status key: `[ ]` not started, `[~]` awaiting review, `[x]` approved and complete, `[!]` blocked.

## Audit Result: What The Fresh Read Found

The chapter is in good shape. Numbers, formulas, reveal-gating, DOM wiring, and the trainer configuration were
re-verified against `chapter4.js` and agree with the prose (`NW_DIM = 12`, `NW_HIDDEN = 24`, `NW_CONTEXT = 2`,
`NW_VOCAB_SIZE = 512`, `NW_RATE = 0.015`, 511 named tokens plus one `<rare>` token, complete passes over the
selected book). No dead element ids, no hardcoded section numbers, no incorrect derivatives found.

What is left is a short list of precision, wording, and dead-weight problems, plus the end-of-chapter release
decision.

## Review Queue - Ordered By Chapter Location

- [x] **F1. Section 1 - spatial slider wording breaks when the panels stack** - approved and cleaned up

  "The left sliders are the evidence ... The right sliders are the model's guesses." On a narrow screen the two
  panels stack vertically, so "left" and "right" point nowhere. Name the panels the learner can actually see
  (`Evidence p` and `Model q`) instead of their desktop positions.

  Completion checks:
  - The instruction is correct at desktop and mobile widths.
  - The panel headings quoted in the copy match the headings on screen exactly.

- [x] **F2. Section 3 - "join the rows" is unexplained jargon, and "(adjoining)" muddies "context word"** - approved and cleaned up

  The section says we "join the rows" and the stepper is titled "Look up and join the two embedding rows", but
  the operation is concatenation and the learner has never been told that. Name the operation once, in plain
  words, then keep using the short form. Separately, "each context (adjoining) word" reads as a typo-like
  aside; the sentence means the two words immediately before the target.

  Completion checks:
  - The first use says what joining physically does (two 2-number rows become one 4-number row).
  - Stepper copy, prose, and the symbols block use the same word for the same operation.

- [x] **F3. Section 3 - the symbols block hardcodes `tanh` while the live panel and Section 6 use ReLU** - approved and cleaned up

  "The whole forward pass, in symbols" states "pass through one hidden layer with a tanh activation" and writes
  h = tanh(W1 e + b1). The interactive walkthrough directly above defaults to **ReLU** (and offers tanh and
  sigmoid), and the canonical backpropagation network in Section 6 uses **ReLU** with a 1-or-0 gate. One chapter
  should not state three different activations for the same network without saying so.

  Fix: write the general activation f that the section already introduced, and add one short line naming which
  activation each surface actually uses and why the choice does not change the shape of the math.

  Completion checks:
  - The symbolic forward pass matches the live panel for every activation choice.
  - Section 6's ReLU gate and the final trainer's tanh hidden layer are both accounted for.

- [x] **F4. Section 3 - the shape bridge gives `H` a meaning that Section 6 contradicts** - approved and cleaned up

  The shape-bridge card defines H as "attention heads in a Transformer block". Section 6 then uses `H` for the
  hidden width (`D=2, H=2, V=5`, and "H=3 hidden neurons" in the live-panel bridge). A learner who pockets the
  map as instructed will read the backprop shapes wrong.

  Fix: keep the model-card meaning but label it unambiguously, and state the local meaning used by the
  backpropagation section.

  Completion checks:
  - No symbol carries two meanings without an explicit note.
  - Chapter 5's model-card vocabulary is preserved.

- [x] **F5. Section 6 - the parked hidden walkthrough: rescue, relocate, delete** - approved and cleaned up

  Author decision: keep "Part 2: The Macro View", "The Golden Rules of Backprop", and "A Final Warning", find
  them a proper home; add forward-path and backward-path diagrams to the two-column map; delete the rest; and
  then merge the two duplicated sets of four steps into one.

  - **F5a, rehoused into the visible matrix deep dive** (`#backprop-matrix-rules`), using the worksheet's own
    numbers rather than the parked block's separate example: the scale motivation, a new "forward fits, backward
    clashes" beat that motivates the transpose, the weight-update and blame-passing rule names, and a wiki link
    on the existing "reverse-mode automatic differentiation" mention. Verified against `byHandNetwork`:
    b2 = [0.10, 0, -0.05, 0.02, -0.02] with h = [0.180, 0] gives z = [0.244, 0.036, -0.122, 0.128, -0.038].
  - **F5b, paired diagrams** now sit side by side above the map: forward values falling to the loss, backward
    gradients climbing the same boxes. Arrow labels are single-line operation names; the full equations live in
    the table below.
  - **F5c, deleted:** the 375-line parked block, plus the old single left-to-right strip.
  - **F5d, merged the two four-step columns into one four-row table.** Each row is one stage with the forward
    equation and the derivative of that exact equation side by side, so the stage names, arrows, and headers are
    written once instead of twice. Forward steps are numbered 1-4 down the page; backward steps are numbered
    4-1 so the climb order stays explicit. On narrow screens the head row hides and each row stacks
    forward-then-backward with a dashed divider.

  Review markup has been removed from the chapter, the review queue is deleted, and `review-diff.css` is
  unlinked.

  `<details class="backprop-deep-dive" hidden>` (roughly lines 2683-3043) is invisible to readers and duplicates
  material the visible chapter already teaches better:
  - "A Step-by-Step Backpropagation Walkthrough" / "Part 1: Replay one cropped path" repeats the four scalar
    steps on a *different* network (1 input, 1 hidden, 2 outputs) with different symbols (`net_{h1}` instead of
    `r_1`, scalar `w` instead of `W_{i,h_j}`) and different numbers.
  - "Part 2: The Macro View (Scaling to Matrices)" repeats the visible matrix deep dive.
  - Its headings are Title Case, breaking the chapter's sentence-case voice, and it carries inline `style="..."`
    attributes found nowhere else on the page.
  - "A Final Warning" tells the reader to "look closely at Rule 3" when only two rules are listed.

  Proposal: delete the whole hidden block, and keep only what is genuinely unique - the link to Matt Mazur's
  step-by-step backpropagation tutorial - by moving it into the References section.

  Author decision needed: is this parked draft material you still want, or is it safe to delete?

  Completion checks:
  - The visible backpropagation path is unchanged.
  - The Mazur tutorial survives as a reference.
  - No orphaned CSS, ids, or JavaScript references remain.

- [x] **F6. Section 7 - "Gen. temp" is a compressed label for a concept the learner met one section earlier** - done

  The label now reads "Generation temperature" and a one-line note ties it back to the Softmax section's
  temperature dial and states that it affects generation only, never training.

  The trainer's slider is labelled "Gen. temp". Temperature is taught in Section 4; the abbreviation hides the
  connection at exactly the moment the learner could use it.

  Completion checks:
  - The label names the concept in full.
  - One short line ties it back to the temperature dial in the Softmax section without re-teaching it.

- [x] **F8. Section 6 - one set of four steps in the map, diagrams at the head of their columns, numbers and
  notation audited**

  - The map's two four-step columns are merged into one four-row table; each row is one stage with the forward
    equation and the derivative of that exact equation beside it.
  - The forward and backward diagrams now sit in the table's first row, in the same three-column grid, so each
    diagram is exactly above its own column. They are proper node-and-edge network graphs, not box chains:
    2 input circles, 2 hidden circles, 5 word-score boxes, Softmax, loss, and target, with every connection
    drawn and the traced route bold. The forward graph carries the values (x = 0.50/0.20, h = 0.180/0,
    z per word, q_sat = 0.241, L = 1.423) and the two traced weights; the backward graph carries the gradients
    (delta per word, -0.524 at h1, gate shut at h2) and the two traced weight gradients. They reuse the
    existing `.backprop-focus-*` diagram classes so the styling matches the section's other network figure.
    The two content columns were equalized to 1.4fr each so both graphs render at the same scale; on narrow
    screens each figure scrolls internally rather than shrinking the labels away.
  - The "Canonical example checkpoints" box was deleted because the diagrams now carry every one of its
    numbers; its only unique line, the numeric weight update, moved into the update-rule block
    (`W_h1,x1: 0.400 -> 0.426` and `W_sat,h1: 0.800 -> 0.814` at eta = 0.10).
  - Full numeric audit of Section 6 against `byHandNetwork`: every displayed value is correct, including
    r1 = 0.180, r2 = -0.010, z, q, L = 1.423, delta, -0.137, -0.524, 0.275, -0.262, -0.105, the gradW2 grid,
    the softmax denominator 5.297, and both weight updates.
  - Notation audit: symbols are consistent everywhere. Two defects found and fixed:
    - the mobile SVG showed abbreviated word labels "sleep", "purr", "meow" while every other surface used
      slept, purred, meowed;
    - the live backprop trace used `z` for the hidden pre-activation, colliding with `z` for logits. It now
      reads `f'(r)`, `dL/dr`, and `input x dL/dr`, matching the rest of the section. The live-panel bridge now
      also states that the panel's activation is switchable while the worksheet stays on ReLU.

  Section 6 still tells the four-stage story in three places, each with a distinct job: the map is the
  reference, the four scalar story steps are the derivation, and the collapsed matrix deep dive is the scaled
  version. Only the map's internal duplication was removed.

- [~] **F7. Whole chapter - release decision and final validation** - validation done, chapter published locally,
  two decisions left for the author

  Done:
  - Full interaction matrix passed at 1280px and 375px: probability sliders and context select, vector inputs
    and row lookup, forward stepper (Back/Next/Replay) with context and activation changes, matrix panel,
    softmax stepper, gradient step and stepper, backprop nudge and reset, gradient step in the live panel,
    the by-hand worksheet check/solution/next, all 16 disclosures, and all 7 quizzes. No console errors, no
    KaTeX errors, zero horizontal overflow on every page at both widths.
  - Review surface removed: `review-diff.css` unlinked, review queue deleted, no `.review-add` or
    `.review-remove` markup left in the chapter.
  - Chapter 4 published locally: "In Progress" banner removed; `Ch 4` added to the top nav on the overview and
    Chapters 1, 2, and 3; a Chapter 4 card added to the overview chapter map; Chapter 3's next-chapter card
    turned from a "Coming soon" placeholder into a real link; the overview readiness copy updated to
    "Chapters 1 to 4 are ready to read now."
  - Cache tokens: only `chapter4.css` and `chapter4.js` changed, and only `chapter-4.html` links them, so their
    tokens were bumped there. `styles.css` is untouched, so no site-wide bump is needed.

  Left for the author:
  - **Freeze?** Marking every Chapter 4 `<section>` with `frozen="yes"` locks the chapter against further edits
    without explicit authorization. Held back deliberately in case more tuning is wanted.
  - **Push?** The local commit is ready. Pushing to `master` publishes Chapter 4 to the live GitHub Pages site.

  Note: an untracked OneDrive conflict copy, `chapter-4-Vishal's MacBook Pro.html`, is sitting in the folder.
  It was deliberately left alone and out of the commit.

  After F1-F6 are approved:
  - rerun the interaction matrix (every slider, select, stepper, worksheet step, quiz, disclosure, trainer run,
    generation, and reset) plus overflow checks at 1200px and 375px;
  - decide whether to keep or remove the "In Progress" banner and whether to relink Chapter 4 in the overview
    chapter map;
  - unlink `review-diff.css` and delete the review queue;
  - freeze the reviewed sections;
  - bump the `?v=` cache tokens on every page if a shared stylesheet changed;
  - delete this plan, commit, push to `master`, and verify the live GitHub Pages URL.

## Verified Clean In This Pass - No Action Needed

- Section 1's worked cross-entropy arithmetic (1.24 bits, entropy floor 1.19 bits, perplexity 2.36) and the
  optional depth disclosure.
- Section 2's dot product and cosine values (0.48 and about 0.997) and the scalar/vector/matrix/tensor bridge.
- Section 4's stable-softmax worked numbers (1.000, 0.407, 0.061, total 1.468, q = 0.681/0.277/0.041,
  loss 0.383 nats) and the bits-to-nats bridge.
- Section 6's scalar derivatives, path sums, ReLU gate, and update arithmetic.
- The learner-initiated reveal contract: gradient, backprop-nudge, and trainer panels start blank; the
  probability, vector, forward, and softmax panels are declared deliberate baselines in nearby prose.
- Every empty-state string names a control that really sits above its panel.
- Trainer constants, parameter count, corpus list, and shuffling/SGD description.
- The References section, including *Math for Deep Learning* by Ronald T. Kneusel.
