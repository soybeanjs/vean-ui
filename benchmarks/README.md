# Cross-library benchmark

The same two component shapes — an accordion of N items, a select with N options —
built the cheapest way each library allows, then mounted and exercised in one
Chromium instance, in one process, in one run.

Four libraries, three frameworks:

| library      | framework | why it is in the comparison                                                         |
| ------------ | --------- | ----------------------------------------------------------------------------------- |
| `@vean/aria` | Vue       | the thing being judged                                                              |
| `reka-ui`    | Vue       | the closest peer: same runtime, same headless-primitive philosophy                  |
| Base UI      | React     | the reference implementation this family of libraries is currently measured against |
| bits-ui      | Svelte    | a different framework, so a framework-level difference becomes visible              |

```bash
pnpm --filter @vean/benchmarks bench
```

About 10 seconds on an M-series laptop. Prints two aligned tables, plus the same
numbers as Markdown.

## Why one run, not four

Four separate runs would put four different amounts of background load behind the
numbers — a browser start, a Vite server, whatever else the machine was doing —
and the comparison would silently become a comparison of those runs. One process,
one browser, interleaved cases: the only thing that varies is the library.

That is also why the three framework plugins live in one Vite config. It is not a
tidy arrangement; it is the arrangement that makes the numbers mean anything.

## Why the harness is hand-rolled

`vitest bench` (tinybench) drives its loop from **Node**. It cannot time work that
happens inside the browser, so every sample would read as the cost of crossing the
CDP boundary. `benchmarks/harness.ts` runs the loop in the browser and only reports
results outward. Same reason `packages/aria/test/perf` does not use it.

## Reading the numbers

`p50` is the honest central value. `p95` catches the outliers that a user actually
notices. `mean` is printed because it disagrees with `p50` when there is a tail,
and a large gap between them is itself the finding.

`batch` is `1` throughout: at these magnitudes (hundreds of µs to tens of ms) the
~100 µs clamp on `performance.now()` is not the limiting factor, and batching would
mean mounting N times per sample, which is not the thing being measured.

## Correctness rules the adapters encode

These are not style choices. Each one was a measurement that read wrong until it
was fixed:

- **Select shapes mount open.** Closed selects render zero options in all four
  libraries. Comparing them closed compares four 5-node mounts and reads as a tie.
- **Each adapter names its own trigger and its own gesture.** A shared
  `[role="button"]` selector and a shared pointer sequence both silently missed on
  some libraries — a plain `<button>` has no `role`, and Base UI opens on `click`
  while the other three open on `pointerdown`. A benchmark that measures nothing
  looks like a tie, which is worse than having no benchmark.
- **Interaction cases time open, not open+close.** Base UI keeps options mounted
  past the commit that flips `aria-expanded`; the others remove them by that
  commit. Timing both would report _when_ teardown happens as _how much_ it costs.
- **Every mount routes through each framework's own commit point** — Vue
  `nextTick`, React `flushSync`, Svelte `flushSync`. Without it the clock stops
  before the DOM reflects the change and every library looks equally fast.
- **`@vean/aria` mounts inside `ConfigProvider`.** Without it every mount logs an
  injection warning, and 20 warning constructions per benchmark is overhead the
  other three libraries do not have — as well as being the dishonest shape, since
  a real consumer mounts the provider.
- **`warmup` is 30, not 3.** Base UI needs ~20 mounts to leave its ramp: probed
  over 120 consecutive mounts bucketed 20 at a time, its `select-open/100` p50 per
  bucket goes 11.5 → 6.4 → 6.7 → 7.2 → 6.2 → 6.4. A 3-mount warmup measured it
  mid-ramp and reported its warmup curve as a library difference — the first
  version of this table showed Base UI at 10.6 ms on `accordion/50` where the
  steady state is 4.2 ms. Every library here is past its ramp by 30.

## Latest run

Chromium headless, M-series macOS, 20 samples per row, `p50` in milliseconds.
Three consecutive runs agreed within ~5%; reproduce with `pnpm bench`.

### Mount

| shape           | `@vean/aria` | `reka-ui` | Base UI | bits-ui |
| --------------- | -----------: | --------: | ------: | ------: |
| accordion/10    |          4.1 |       3.3 |     2.6 |     1.3 |
| accordion/50    |         16.4 |      13.3 |     4.2 |     5.7 |
| select-open/20  |          7.9 |      10.2 |     5.8 |     1.9 |
| select-open/100 |         25.6 |      33.3 |     7.0 |     6.0 |

### Interaction

| shape                   | `@vean/aria` | `reka-ui` | Base UI | bits-ui |
| ----------------------- | -----------: | --------: | ------: | ------: |
| accordion-toggle/10     |          1.5 |       1.1 |     1.0 |     0.2 |
| select-gesture-open/100 |         31.4 |      36.4 |     6.8 |     5.0 |

### What the numbers say

- **Aria is not the slowest to mount, but it is the slowest at scale.** It beats
  `reka-ui` on `select-open/100` (25.6 vs 33.3) and loses to it on `accordion/50`
  (16.4 vs 13.3). Both libraries sit 2–4× above Base UI.
- **reka-ui's item path degrades faster than ours.** It wins the accordion and
  loses the select, and the select gap widens with N (20 options: aria ahead by
  2.3 ms; 100 options: ahead by 7.7 ms). That is our one structural advantage over
  the closest peer, and it is worth understanding before it is claimed.
- **Aria's per-item cost is roughly linear and high**: 10 → 50 items costs 12.3 ms
  in `accordion`, 20 → 100 options costs 17.7 ms in `select`.
- **`select-gesture-open/100` tracks `select-open/100` closely** (31.4 vs 25.6),
  so the gesture itself adds ~6 ms on top of the render. Interaction here is
  render-bound, not event-bound.
- **Nothing here is a verdict.** Four small, unstyled trees in a headless browser.
  A library can be 4× faster to mount and still lose on bundle size, keyboard
  behaviour, or the maintainability of the wrapper you have to write yourself.

## What this does not measure

- **Bundle size.** A library can mount fast and cost 40 KB. See `sui size --matrix`.
- **Interaction with real input.** The gestures here are untrusted synthetic
  events. Contracts that need a trusted gesture — pointer capture,
  `pointerType === 'touch'`, button filtering — are asserted with a real driver in
  `packages/aria/test/browser/specs/`.
- **Accessibility.** Nothing here reads a screen reader or checks a role.
- **Anything at scale.** These are small, unstyled trees in a headless browser on
  one machine. They rank implementations against each other; they do not predict a
  production page.

## Attribution: why `@vean/aria` mounts slower

The comparison raises an obvious question — aria is 2–4× Base UI on mount — so
this section records where the time goes, measured by building the same tree with
progressively fewer aria layers, 50 items, three rounds each (p50, ms):

| layer built                                              |   p50 |
| -------------------------------------------------------- | ----: |
| plain `div`/`button` + a leaf component                  |  1.00 |
| + `CollapsibleRoot` per item                             |  2.10 |
| + `CollapsibleRoot` + `CollapsibleTrigger`               |  5.20 |
| + `CollapsibleRoot` + `CollapsibleContent`               |  4.40 |
| + `CollapsibleRoot` + trigger + content                  |  9.20 |
| `AccordionItem` only (root + item, plain children)       |  3.30 |
| `AccordionItem` + `AccordionContent`                     |  7.00 |
| `AccordionItem` + `AccordionHeader` + `AccordionTrigger` |  8.60 |
| full item (header + trigger + content)                   | 15.20 |
| `AccordionCompact`                                       | 17.20 |

The ladder above is the pre-fix baseline that located the two costs. Re-measured
entry points after the fixes: `root + trigger` 5.10 → 4.00 ms, `AccordionCompact`
16.70 → 14.80 ms.

Two findings, both structural rather than accidental:

- **`CollapsibleTrigger` cost ~3 ms per 50 items, and it was a four-component
  chain**: `AccordionTrigger` → `CollapsibleTrigger` → `Button` → `Primitive`,
  plus `Icon` in the compact. At 50 items that was 250 component instances for
  what renders as a `<button>` with a `<div>` and an `<svg>` inside. Reka builds
  the same trigger with one `Primitive`.

  **Fixed.** `CollapsibleTrigger` now renders the button semantics inline on a
  single `Primitive` and keeps the `Button` layer's exact DOM — `type="button"`,
  the `disabled`/`aria-disabled`/`data-disabled`/`data-normal` markers,
  `tabindex="-1"` while disabled, and `data-vean-button`, which consumers style.
  Fourteen DOM cases (default, root-disabled, `as`, `class`, `aria-*`, custom
  `data-*`, `asChild`, `asChild` + disabled) are byte-identical to the old chain.
  `AccordionCompact` at 50 items went 16.7 → 14.8 ms.

  The `Button` layer alone measured ~1.2 ms per 50 items, so the chain around it
  costs more than the layer does. The gain also depends on what replaces it:
  `useOmitProps` builds a fresh object on every read and was measured dearer than
  the layer it helps remove. The first version of the rewrite also set
  `tabindex: undefined` on the normal path, which `asChild`'s `mergeProps` copies
  over the caller's own `tabindex` and silently broke the tree menu's single tab
  stop — on an `asChild` element, attributes must be omitted, never set to
  `undefined`.

- **`usePresence` in `CollapsibleContent` measured ~2 ms per 50 closed items**
  even though nothing is animating: it calls `getComputedStyle` on every content
  node at mount, and the measured tree ran 50 `getComputedStyle` calls plus 100
  `getBoundingClientRect` calls (`CollapsibleContent.handleNodeStyle` read the full
  dimensions of every content element on mount, open or closed).

  **Partly fixed.** `handleNodeStyle` now returns early while closed, which took
  the `getBoundingClientRect` count from 100 to 0. The wall clock barely moved
  (4.4 → 4.2 ms), which is the useful part of the finding: inside headless
  Chromium a forced layout on 50 small nodes is nearly free, so the 2 ms was
  instance creation, not measurement. The `getComputedStyle` calls remain —
  `usePresence` needs them to decide whether an exit animation exists.

Both were per-item multipliers on every accordion, every dialog, every row that
embeds a disclosure. Neither was a benchmark artefact — the same shapes are on the
critical path of `TableCompact` and `SelectCompact` mount numbers above. One is
now gone, the other reduced; what remains is mostly per-instance Vue overhead in
components that exist to compose behaviour.

What was ruled out, so it does not get re-investigated: `provide`/`inject` of the
context (2.5 vs 2.3 ms), `useId` (~0), `useControllableState` (~0), and the
`Icon` slots in `AccordionCompact` (16.9 with vs 17.8 without — noise). Raw DOM
layout thrash is also not it: 100 read/write pairs on a 250-node tree measures
0.2 ms.
