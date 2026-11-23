# Chapter 5 work plan: follow one token through a Transformer

**Status, November 22, 2026: published.** The author approved Option 1 below, and the GPT-2 walkthrough is now [Chapter 5](chapter-5.html). The earlier hand-designed draft, its exercises, notebooks and the previous implementation record (`chapter-5-work-plan-baseline.md`) are archived outside the published folder in `archive/chapter-5-draft-2026-11-22/` and remain in git history. Still open: the author's review of the two new stops (14 and 15), then freezing the chapter.

## Option 1 merge plan, simplified (approved and published)

The author chose Option 1: the GPT-2 walkthrough becomes the chapter. The current draft is archived as a backup, not merged back in. A future chapter will build a Transformer from scratch in notebooks. Guiding rule from the author: **add only what improves understanding; never make the approved walkthrough more complicated.**

### Frozen: the 13 approved stops
- Their lessons, pictures, experiments, quick checks, the map, the sticky top-right Back/Next, the full-width layout and the light palette do not change.
- Proof, not promise: [chapter5-baseline.py](../../../tmp/chapter5-baseline.py) recorded the visible text of every stop plus fingerprints of the map and every picture, at desktop and phone widths ([baseline](../../../tmp/chapter5-walkthrough-baseline.json)). After each step of work it must report "All approved stops unchanged", apart from the single sentence listed below.
- The one intended edit: the last line of Prediction currently says "Press Replay to start over". Because two short stops will follow, it will say "Press Next" instead.

### Added around the walkthrough (the chapter frame, outside the lessons)
- Chapter title, a prerequisites box updated for GPT-2, chapter links at the top and bottom, matching the other chapters. The In Progress banner was dropped at publication.
- The four-act sidebar lists the stops and highlights the current one: I Inputs (Overview, Tokens, Token embedding, Position, Add); II Attention (Query, Key, Attention, Value mixture, Combine heads); III Inside a block (Feed-forward, Blocks 2 to 12); IV Output (Prediction, Write the next word, Check yourself).
- Old links keep working: `#qkv` opens Query, `#heatmap` Attention, `#multihead` Combine heads, `#onetoken` Write the next word, `#forward` Overview.
- A short "Go deeper" reading list at the very end of the page, below the walkthrough (confirmed by the author; built from the draft's existing references).

### Added at the end: two short stops
| Stop | Why it helps understanding | What it contains |
| --- | --- | --- |
| 14. Write the next word | Closes the loop: a prediction becomes text by appending a token and running the whole trip again. | GPT-2's real continuation of our sentence, one appended token at a time, with its top guesses at each step; one button; one quick check. Needs one small recapture from the pinned checkpoint. |
| 15. Check yourself | Practice lives in one place, so the approved stops stay untouched. | Three by-hand exercises on real GPT-2 numbers (add one coordinate, compute one softmax share from three scores, blend one value number), each with a typed answer, hints and a reveal; then a short review quiz across the whole trip. |

### Deliberately left out, to avoid extra complexity
- Temperature, top-k and top-p controls; the training/loss stop; model families and modern variations; the optional in-browser model; collapsing lessons behind "Go deeper". These can be revisited later, most naturally in the generation, pretraining or build-from-scratch chapters.

### Archived, not merged (kept outside the published folder and in git history)
- The hand-designed eight-number model and everything computed from it: 2D trace labs, the 3D block lab, the 46% demo, worksheets, code cells, the head-training lab, cross-attention and RoPE labs, the toy notebooks and fixture, and the unlinked `chapter-5-exercises.html`.

### Order of work, each step reviewable
1. Archive the draft. 2. Build "Write the next word" and "Check yourself" in the prototype. 3. Move the walkthrough into `chapter-5.html` with the frame, sidebar, links and reading list. 4. Run the frozen-stop check, then validate the new stops, mobile, keyboard and the Chapter 6/7 links. Done: the check reports only the intended Prediction sentence, and the chapter was published on November 22, 2026 with the author's approval.
**Current review pass (voice and depth rewrite):** The author approved the connected map and the full-width token embedding lesson, then asked for one thorough pass over every stop: more depth (at least as elaborate as their Q/K/V explanation), their own warm first-person voice instead of robotic copy, and a purposeful picture wherever one helps. All 13 stops were rewritten from scratch in one batch. Each stop is independently reviewable through the "Author review" jump list at the top of the [prototype](../../../tmp/chapter5-flow.html). Do not replace or publish the draft until the author approves.

| Stop | Question to resolve | Pictures and learner experiments |
| --- | --- | --- |
| Overview | What are we about to do, and which "percentages" are which? | Six-card journey; attention budget beside the vocabulary budget; real sneak peek (`she`/`he`/`it` after "because"); quick check. |
| Tokens | Why can a word occupy two rows? | Word-to-token tree; `␣fed` vs `fed` IDs; `fed`/`overfed` seat-shift strips; quick check. |
| Token embedding | Why one ID but 768 values? | Approved row/column explorer, voice pass only, plus a quick check on "changing the coordinate changes nothing in the model". |
| Position | How can two identical tokens differ? | Seat fingerprint heatmap; two-cats strips plus their difference (287 of 768 signs flip); why not add the seat number; RoPE note; quick check. |
| Add | What does adding two rows do? | Number-line walk; "team up" and "cancel" coordinate finders; whole-row strips; why add not concatenate; island callout; quick check. |
| Query | What are Q, K and V, and how is a query built? | Three-role cards and the WHO/WHAT rule; real search diagram; four steps; library analogy picture; every token plays all three roles; LayerNorm before/after; real weighted-vote arithmetic; quick check. |
| Key | What does a dot product measure? | 2D arrow sketch; 64 real products; every key's score; isolated key nudge with before/after share; quick check. |
| Attention | How do scores become a budget? | Real ÷8 versus no-÷8 comparison (41.7% vs 99.3% on `Sarah`); masked grid; softmax ledger and allocation bar; attention-sink note; quick check. |
| Values | What information actually moves? | Live share slider with real-vs-simulated blend; contribution ledger and waterfall; WHO-vs-WHAT value nudge; the author's 10-second memory test; "Query asks. Key matches. Value delivers."; one-line formula. |
| Heads | Why twelve heads, and how are they combined? | 12-head attention heatmap with data-driven commentary; concatenation strip; residual add table; quick check. |
| Feed-forward | What happens after attention? | Expand/bend/shrink/add diagram; real GELU dot (starts on the strongest saved unit); 16 detectors on an honest fixed scale; MLP-as-memory note; quick check. |
| Later blocks | What do eleven more blocks do? | Real coordinate path through all 12 blocks; "deeper is not later" grid; quick check. |
| Prediction | How does a row become a guess? | Honest 0-100% bars plus "everything else"; logit gap to odds; every row's top 3 guesses; seeded sampling dice; recap linking every stop; quick check. |

## What the two references change

| Source | What works | What to do in this chapter |
| --- | --- | --- |
| [Georgia Tech's Transformer Explainer](https://poloclub.github.io/transformer-explainer/) | A prompt, its token rows, the blocks, and the output distribution occupy one connected view. The embedding detail decomposes a row into token and position. | Keep the whole graph above a drill-down, with one highlighted stage and token. Use our own forward passes on a pinned trained checkpoint, not copied graphics or toy weights. |
| [Author's QKV explanation](https://chatgpt.com/share/6b039f6d-87e8-83ea-ab1d-b0ff178c9a92) | A search request, a catalog entry and the content you take away do different jobs. The pronoun example, adjustable mixture and recall question let readers test the distinction. | Use original illustrations and the real `cat → it` trace; isolate a change to matching from a change to content. Do not import the example's illustrative percentages. |

## 1. The opening: a map the reader can use again

Open with the prefix **Sarah fed the cat because it** and a question: *The model has a list of words. How can information from `cat` reach `it` before the model guesses the next word?* Keep the short prerequisite links, but put the picture next to this question, before the model specification.

| What the reader does | What the picture shows |
| --- | --- |
| Arrives, without pressing Play | A labeled path: token positions → one row per position → GPT-2’s 12 blocks → the final row scores possible next tokens. Fold repeated blocks, not their contributions, in the visualization. |
| Chooses **Follow `it`** | The sixth row lights up. Three stops show its input numbers, information arriving from earlier rows, and its final vocabulary probabilities. A sentence at each stop says what changed and what did not. Back and Next reverse or advance one stop. |
| Selects the `cat` connection | A local detail shows what is being compared, the share assigned to `cat`, and the content carried back to `it`. A separate output chart answers a different question: what token might come *next*? Never label the `cat` share as a prediction. |
| Clicks a stage heading, a token or a connection | Keep the full map in place. Update the explanation below, preserving the prefix, token and head. No focus/return toggle. |
| Tries a different supported prefix | Recompute from the same model. Distinguish selecting a row to inspect from changing the prefix. Undo restores the comparison. Isolate experimental weight edits from the baseline used in the prose and exercises. |

The prototype uses [GPT-2 small revision 607a30d](https://huggingface.co/openai-community/gpt2/tree/607a30d783dfa663caf39e06633721c8d4cfcd7e). The [capture script](../../../tmp/capture-chapter5-gpt2.py) verifies the source SHA-256, runs all 12 blocks with the checkpoint’s tokenizer, and exports compact traces. All 768 input coordinates are available. The graph shows just a labeled slice; output bars show the top eight probabilities from the 50,257-way softmax. In the base sentence ` was` leads at about 38.86%. The earlier hand-designed model (`chapter5-model.js`, now archived) belonged to the previous draft, exercises and notebook; do not import its numbers into the new path.

## 2. Replace the zero-first experience in “Put the numbers in order”

**Observed in the [current draft lab](chapter-5.html#inputs):** the one-hot rows made an artificial teaching choice look like a property of embeddings. The review prototype replaces those rows, not just the selected coordinate.

1. Keep GPT-2’s tokenization, including spaces, for `Sarah fed the cat because it` and the `overfed` variant.
2. Inspect the real token row for `␣fed` (ID 11672). For coordinate 1 at position 2 the addition is approximately `−0.09520 + 0.02396 = −0.07124`. Allow inspecting any of 768 coordinates.
3. In `The cat saw the cat`, both occurrences of `␣cat` are ID 3797. Hold a coordinate fixed and compare positions 2 and 5. Do not assume a word at the beginning and a word after a space have the same ID.
4. Only then name the shape: six tokens × 768 coordinates for the base sentence, seven × 768 for the split variant. The input row is not contextual yet.

**Pass condition:** on the first instructed action, a novice can point to both addends and their sum without hunting through a selector. They can then predict what stays the same for a repeated word, and explain why adding a seventh token gives another row, not another feature.

## 3. Make QKV the model lesson for conceptual depth

Teach [weighted mixtures](chapter-5.html#attention-intuition), [Q/K/V](chapter-5.html#qkv), and [one attention row](chapter-5.html#attention-row) as one argument. The first owns *why equal shares are insufficient*, the second *how the model decides where to look versus what to take*, and the third *the complete arithmetic*. Do not make the reader start a new story in each section.

| Teaching beat | Worked evidence or learner action |
| --- | --- |
| Why not average everybody equally? | Mix the same six value rows first with equal shares, then with the model's shares. Show each source's contribution to one output feature. A share alone is not the information received. |
| Why learn three different projections? | Use the catalog analogy once, then retire it. Draw one normalized 768-coordinate row branching into Q, K and V. Work one coordinate of a 64-dimensional head with the stored weights and bias. |
| What actually travels from `cat` to `it`? | Inspect the full 64-coordinate dot product, scale by 8, and normalize over all allowed keys. In block 1, head 1, `␣cat` gets about 22.50% at `␣it`. Multiply by the actual selected value coordinate and sum every source. The output is a vector, not a selected word. |
| Can the reader tell routing from content? | In a future isolated experiment, edit just one value coordinate. Hold Q and K fixed and predict the change: attention share × value change. Keep experimental results distinct from unmodified checkpoint traces. |
| Can they transfer it? | Ask which vector is compared and which supplies content for a different query position. Then work one masked row in the existing by-hand exercise. Only now compress the story into `softmax(mask(QKᵀ / sqrt(d_head))) V`. An attention weight is neither proof of coreference nor the probability that `cat` comes next. |

## 4. Carry the same standard through the four acts

Keep the four expandable sidebar acts, stable section anchors, shared course palette, and short navigation labels. Each later mechanism needs a question the previous mechanism could not answer, one worked change, and an explicit handoff:

| Act | Question to answer | Evidence the reader should see |
| --- | --- | --- |
| I. Inputs | How can the same token start differently at two positions? | Compare the two `␣cat` rows and locate their sums at the first block’s entrance. |
| II. Attention | Who can contribute, in what proportion, and with what content? | Follow one route before expanding to the matrix. Change a future token and show an earlier row is unchanged. Compute two heads, then distinguish concatenating their features from averaging attention weights. |
| III. Inside a block | Once information arrives, what happens to the token's original row? | Place original, branch update, and sum side by side. Show normalization on one row, then a feed-forward unit before/after GPT-2’s GELU. |
| IV. Outputs and real models | How does one updated row turn into a token, and how does training differ? | Trace the last row to vocabulary logits and probabilities. Append a chosen ID and run again. Contrast this with scoring six known training targets in one pass. Use the existing notebook and opt-in real model for comparison; keep efficiency in Chapter 6 and pretraining at scale in Chapter 7. |

## Review order and acceptance

All items below are **proposed**, not implemented. Start with the smallest useful experience and stop for author review after each item. Keep a clean reading view available; do not put the entire chapter back into redlines.

- [ ] **R1. Opening map and its first destination.** The author confirmed the [connected flow study](../../../tmp/chapter5-flow.html) and clickable stage headings are the right direction. Retain that design, review one focused stage at a time, and keep chapter integration and the round trip to the input lesson pending.
  - **First-minute review:** Click the `cat → it` ribbon, then switch heads. The share changes, but the vocabulary bars stay still. Switching the sentence, in contrast, loads a different forward pass.
- [ ] **R2. Inputs and shape.** Replace the default zero-only inspection with the aligned addition and repeated-word comparison. Pass the first-action and transfer checks in section 2 before expanding the rest of the map.
  - **Inputs prototype awaiting author review:** [Open the full flow at “fed”](../../../tmp/chapter5-flow.html?at=2). Press Next and watch Inputs widen to about 40% of that same graph. Token rows, Q/K/V routes, matrix cells, ribbons and prediction bars stay connected and selectable. Through Tokens → Token embedding → Position embedding → Add, only the emphasis on the selected row changes. The math stays below on the left; the explanation and Back/Next stay on the right. Test the two `␣cat` occurrences before proceeding to the projections review. The original chapter lab has not been replaced.
- [ ] **R3. Attention and QKV.** Connect the map to the worked route and the two isolated edits. Check that resetting exactly restores the fixture, value-only edits leave this head's weights unchanged, and all allowed shares sum to one. Have a reader explain *why* the value, not the key, is carried back.
  - **Depth and layout gate passed for the prototype:** the author approved [Inputs 2: Token embedding](../../../tmp/chapter5-flow.html?stage=inputs&detail=embedding) as the format. The twelve other stops are now proposed individually in the review queue. Start the attention sequence at [Query](../../../tmp/chapter5-flow.html?lesson=query). Try the isolated key and value edits; only the local simulation changes. The larger integration and exercise items remain open.
- [ ] **R4. Remaining block and output handoffs.** Connect the existing 2D, 3D, and code exercises to the same example. Keep their useful arithmetic; remove a duplicate display only when its teaching job is demonstrably covered. Return from each detail to the correct point on the map.
- [ ] **R5. Read-through and regression.** Have a first-time reader narrate the path from `it` to a next-token score and predict a change before pressing a control. Record where they hesitate. Separately run the existing model/fixture tests and verify desktop and 375px mobile, keyboard-only use, reduced motion, direct section links, and an offline core with no pretrained download. Numerical tests cannot substitute for that read-through.

The original chapter integration, exercises and publication remain separate decisions. The current deliverable is the independently reviewable prototype sequence above.
