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
| B4 | **Reversible QKV stepper.** Six beats: embedding -> project -> raw scores -> scaled scores -> softmax weights -> value blend. Back/Next/Play/Replay, one arithmetic operation per row, `prefers-reduced-motion` falls back to static frames. | todo |
| B5 | **By-hand worksheet.** Learner types one dot product, the scaled score, one softmax term, and one output component. Immediate feedback, progressive hints, reveal-after-try. | todo |
| B6 | Why divide by `sqrt(d)`: show softmax saturating without it, with a live `d` slider. | todo |
| B7 | Heatmap and causal mask: colocate the mask toggle with the heatmap it drives. | todo |
| B8 | Positional information: absolute vs RoPE as a rotation of `q` and `k` before the dot product. | todo |
| B9 | Multi-head: three legible heads, plus the split -> concat -> output-projection shape bookkeeping. | todo |
| B10 | **Live GPT-2 attention viewer.** Opt-in transformers.js; type a sentence, pick a layer and head, see the true attention matrix. Needs a preset that reproduces the coreference case, and a graceful offline fallback. | todo |
| B11 | Code cells: softmax, scaled dot-product attention reproducing 46%, and the causal mask - each gated behind a predict-first `.code-quiz`. | todo |
| B12 | Colab notebook 1: same sentence, same vectors, numpy attention -> multi-head -> a real GPT-2 attention map. | todo |
| B13 | References: inline concept links plus a curated further-reading list. | todo |

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
