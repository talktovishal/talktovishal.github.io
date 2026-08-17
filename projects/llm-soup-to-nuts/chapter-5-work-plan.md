# Chapter 5 rewrite: work plan

Living checklist for the Chapter 5 rewrite and the Chapter 6 split. Delete this file only
after every item is approved, review markup is removed, and both chapters are frozen.

Status legend: `todo` / `in review` / `approved`.

---

## Decisions already made

- **Chapter 5** owns the attention *mechanism* and ends when a learner can hand-compute one
  attention row and read a real GPT-2 attention map.
- **Chapter 6** (new) owns *cost*: KV cache, GQA/MLA, sliding window, FlashAttention, MoE,
  linear attention.
- **Chapter 7** is the old Chapter 6 (pretraining and alignment), renumbered.
- Companion Colab notebooks are **linked, not embedded**, so the HTML stays self-contained.

## The one running example

`Sarah fed the cat because it was hungry`, query token `it`, four channels
`[subject, verb, function, animate]`, `d = 4` so the scale is `sqrt(4) = 2`.

Verified in the browser on 2026-08-16 (`#qkvScores` and `#qkvMath`):

| token   | key vector                 | q·k  | /2   | weight |
|---------|----------------------------|------|------|--------|
| Sarah   | `[1.60, 0.00, 0.00, 0.15]` | 0.43 | 0.22 | 11.4%  |
| fed     | `[0.00, 1.60, 0.00, 0.00]` | 0.00 | 0.00 | 9.2%   |
| the     | `[0.00, 0.00, 1.40, 0.00]` | 0.42 | 0.21 | 11.3%  |
| **cat** | `[0.00, 0.00, 0.00, 1.80]` | 3.24 | 1.62 | **46.3%** |
| because | `[0.00, 0.00, 1.20, 0.00]` | 0.36 | 0.18 | 11.0%  |
| it      | `[0.00, 0.00, 0.50, 0.10]` | 0.33 | 0.17 | 10.8%  |

Blended output: `[0.11, 0.09, 0.23, 0.53]`.

**Every** new surface - stepper, worksheet, code cell, notebook - must reproduce these
numbers exactly. Any change to the token vectors invalidates this table and the prose.

## Verified numbers in Chapter 6

Checked live in the browser, 2026-08-16:

- Cost panel: 8,192 tokens gives 33,558,528 scores (`n(n+1)/2`).
- KV cache work: 32 generated tokens costs 528 units uncached vs 32 cached (16.5x).
- KV cache memory (Llama-3-8B shape: 32 layers, 8 KV heads, `d_head` 128, 2 bytes):
  128 KiB per token, **1.00 GiB** at 8,192 tokens, 8.00 GiB for eight concurrent users.
- GQA: 32 query heads over 8 groups = 4 heads per set, 4.0x smaller cache.
- Sliding window on the 8-token toy: 36 pairs full causal, 21 pairs at `w = 3` (42% skipped).
- FlashAttention stepper: streamed denominator 1.7492 equals the one-shot value 1.7492.
  This is the on-page proof of the "exact, not approximate" claim - do not break it.
- MoE at 256 experts + 1 shared, top-8: 9 of 257 active = 3.5%, matching DeepSeek V3's
  671B total / 37B active story.

---

## Phase A - scaffolding

| # | Item | Status |
|---|------|--------|
| A1 | Extract the four reference PDFs to `tmp/pdfs/`. `8 (1).pdf` turned out to be Jurafsky & Martin SLP3 ch.8 "Transformers"; `LLMs - chapter.pdf` is image-only and did not extract (the earlier `chapter5_source.txt` covers it). | approved |
| A2 | Renumber Chapter 6 -> Chapter 7 (`chapter-7.html`, `chapter7.css`, `chapter7.js`), fix its brand, TOC, nav, script/style refs, and lead paragraph. | approved |
| A3 | Move the KV-cache and "recent improvements" material out of Chapter 5; delete the orphaned JS and re-point the TOC, eyebrow numbering, and bottom nav. | approved |
| A4 | Build Chapter 6 as a real chapter (not a stub): 9 sections, 7 quizzes, 8 reveal-gated panels, `chapter6.css`, `chapter6.js`. | approved |
| A5 | Update the overview chapter map and the "still in progress" copy on `index.html`. | approved |

## Phase B - Chapter 5, the attention rewrite

Implement top to bottom, one reviewable item at a time.

| # | Item | Status |
|---|------|--------|
| B1 | Opener and prereqs: keep the coreference hook, forward-point to the real attention map as the payoff. | todo |
| B2 | Motivate attention from Chapter 2's failure before naming it. | todo |
| B3 | **Where Q, K, V come from.** Added the "One vector in, three vectors out" subsection: a `W_Q`/`W_K`/`W_V` fan-out diagram, the plain statement that the three roles are *questions asked of one vector* rather than properties of the token, a fully worked 4x4 projection `x_it = [0.2, 0.1, 0.5, 0.9]` -> `q_it = [0.1, 0.0, 0.3, 1.8]`, and a quick-check quiz. Verified in the browser. | in review |
| B4 | **Reversible QKV stepper.** Six beats: embedding -> project to `q` -> raw scores -> scaled scores -> softmax weights -> value blend. Back/Next/Play/Replay, a step-pip track, one arithmetic operation per row, `prefers-reduced-motion` jumps to the final state instead of animating. All numbers derived live from `TOKENS`, so they cannot drift from the prose or the panels. Verified end to end in the browser. | in review |
| B5 | **By-hand worksheet.** Four steps on a *different* query (`fed`, a verb hunting its object) so it is genuinely the learner's turn: raw dot product 2.52 -> scaled 1.26 -> weight 37.7% -> output animate channel 0.46. Feedback names which direction the answer is off, two progressive hints, reveal only after a try. Exact answers say "Correct"; tolerance-accepted ones say so explicitly. Empty and non-numeric input handled. | in review |
| B6 | **Why divide by sqrt(d).** Prose that names the real failure (softmax saturates, then gradients through the flattened weights vanish) plus a live width slider: unscaled climbs 78.8% -> 99.995% -> 100.000% as `d` goes 4 -> 64 -> 512, while the scaled row holds at 46.3% at every width. | in review |
| B7 | **Heatmap and causal mask.** Replaced the autoplaying `chapter5-causal-mask.gif` with "Self-attention, in motion": a six-stage drivable SVG scene (tokens -> q/k/v projection -> 36 scores -> mask -> softmax -> value blend) built on inline SVG plus the Web Animations API, no library. Particles are colour-coded by role and the blend sends more dots for heavier weights. Mask toggle is colocated and synced with the other two. Verified: the scene's `it` row reads 11/9/11/46/11/11, identical to the static heatmap, and the output vector matches the stepper. | in review |

### Animation approach (settled)

No animation library. Inline SVG + `element.animate()` (WAAPI). Rationale: D3 is ~270 KB
for data joins we do not need on a 6x6 matrix; WAAPI already gives cancellation, reversal,
`currentTime` scrubbing and `playbackRate`. Pattern: build the scene once, one `renderSat(step)`
sets the static state via classes and a `--shade` custom property, `satPlayStage(step)` spawns
short-lived particles. Back re-renders statically rather than reversing, so it feels instant.
All running animations are tracked in `state.satAnims` and cancelled on any step change.
| B8 | Positional information: absolute vs RoPE as a rotation of `q` and `k` before the dot product. | todo |
| B9 | Multi-head: three legible heads, plus the split -> concat -> output-projection shape bookkeeping. | todo |
| B10 | **Live model.** See the finding below - a real in-browser attention map is impossible. Delivered instead: a real key/value tensor inspector (verified against distilGPT-2: 6 layers, 12 heads, d=64, 216 KiB for a 6-token prompt) plus an honest subsection explaining why the map is not here, pointing at the notebook. | in review |
| B11 | Code cells: softmax and scaled dot-product attention, both gated behind predict-first quizzes. A third mask cell was dropped - the animated scene and the heatmap already teach masking interactively, and a code cell would have been a third copy. 14 quizzes on the page in total. | in review |
| B12 | **Colab notebook** at `assets/downloads/chapter5-attention.ipynb`. 26 cells. Part 1 rebuilds the chapter in NumPy and *asserts* it reproduces `q_it = [0.1, 0, 0.3, 1.8]` and `46.3%`. Part 2 loads real GPT-2 with `output_attentions=True`, searches all 144 heads for the strongest `it` -> `cat`, and plots real attention maps. Math verified locally against the chapter. | in review |
| B13 | **References.** Moved the ten efficiency papers (GQA, FlashAttention, MQA, sparse, RMSNorm, SwiGLU, Switch, Mixtral, speculative decoding) to Chapter 6 where they now belong. Added Transformer Explainer and the companion notebook to Chapter 5. | in review |

### Finding: real attention maps cannot be shown in the browser

Verified empirically, not assumed. `AutoModelForCausalLM` for `Xenova/distilgpt2` with
`output_attentions: true` returns only:

```
logits, present.0.key, present.0.value, ... present.5.key, present.5.value
```

No `attentions` key, and the ONNX session's `outputNames` confirms the graph simply does not
export them. Attention weights are computed inside the graph and discarded. The same is true of
fused attention kernels in PyTorch, which is why the notebook passes
`attn_implementation="eager"`.

Consequences, all of them deliberate:
- Chapter 5 says this out loud in a subsection rather than quietly omitting the feature.
- The real attention map lives in the Colab notebook, where PyTorch gives it up freely.
- The browser gets what it genuinely *can* do: the real `present.N.key/value` tensors, which
  doubles as a concrete hand-off into Chapter 6's KV cache section.

## Phase C - Chapter 6 polish

| # | Item | Status |
|---|------|--------|
| C1 | Prose and structure for all nine sections. | in review |
| C2 | Add a small SVG for the KV cache growing step by step (currently prose plus a table). | todo |
| C3 | Add a diagram for MLA's compress-then-project-back path. | todo |
| C4 | Colab notebook 2: KV-cache timing on a real small model, GQA memory math, tiled softmax checked against the naive version. | todo |
| C5 | Decide whether `chapter-5-exercises.html` folds into the main pages or is retired. | todo |

---

## Testing notes specific to these chapters

- Preview at `http://127.0.0.1:8765/personal-site/projects/llm-soup-to-nuts/chapter-6.html?v=N`
  with a cache-busting query; the in-app browser caches aggressively.
- Always `page.setViewportSize` **before** measuring overflow, or `clientWidth` reports 0 and
  every number is garbage. Check 1200x900 and 375x800.
- `.arch-table-wrap` and `.math-formal` legitimately scroll internally; that is not a bug.
  What matters is `document.documentElement.scrollWidth - clientWidth === 0`.
- After any container restructure, assert `[...section.children].map(c => c.className)` rather
  than eyeballing. All 15 Chapter 5 sections must have exactly one direct child.
- Grep for `Section [0-9]` and stale `chapter-6` links after any renumbering.
