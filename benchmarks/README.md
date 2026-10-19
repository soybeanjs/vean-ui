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
| accordion/10    |          4.4 |       3.1 |     2.3 |     1.3 |
| accordion/50    |         17.1 |      12.8 |     4.2 |     5.5 |
| select-open/20  |          7.7 |       9.8 |     5.5 |     1.8 |
| select-open/100 |         24.5 |      32.5 |     6.2 |     4.7 |

### Interaction

| shape                   | `@vean/aria` | `reka-ui` | Base UI | bits-ui |
| ----------------------- | -----------: | --------: | ------: | ------: |
| accordion-toggle/10     |          1.6 |       1.1 |     0.9 |     0.3 |
| select-gesture-open/100 |         29.8 |      35.0 |     6.3 |     4.9 |

### What the numbers say

- **Aria is not the slowest to mount, but it is the slowest at scale.** It beats
  `reka-ui` on `select-open/100` (24.5 vs 32.5) and loses to it on
  `accordion/50` (17.1 vs 12.8). Both libraries sit 2–4× above Base UI.
- **reka-ui's item path degrades faster than ours.** It wins the accordion and
  loses the select, and the select gap widens with N (20 options: aria ahead by
  2.1 ms; 100 options: ahead by 8.0 ms). That is our one structural advantage over
  the closest peer, and it is worth understanding before it is claimed.
- **Aria's per-item cost is roughly linear and high**: 10 → 50 items costs 12.7 ms
  in `accordion`, 20 → 100 options costs 16.8 ms in `select`.
- **`select-gesture-open/100` tracks `select-open/100` almost exactly** (29.8 vs
  24.5), so the gesture itself adds ~5 ms on top of the render. Interaction here
  is render-bound, not event-bound.
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
