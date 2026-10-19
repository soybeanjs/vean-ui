import { describe, it, afterAll } from 'vitest';
import aria from '../adapters/aria';
import baseUi from '../adapters/base-ui';
import bitsUi from '../adapters/bits-ui';
import reka from '../adapters/reka';
import type { Adapter, Mounted } from '../adapters/types';
import { benchmark, formatBenchmarks, renderMarkdown } from '../harness';
import type { BenchmarkStats } from '../harness';

/**
 * Cross-library benchmark: the same two component shapes, four headless
 * libraries, one browser, one run.
 *
 * The shapes are deliberately the cheapest thing each library can build:
 *
 * - an accordion of N items, collapsed;
 * - a select with N options.
 *
 * Nothing is styled, no wrapper of ours is in the path, and every adapter is a
 * local file in this workspace — so a difference in the numbers is a difference
 * in the libraries, not in how they were called.
 *
 * ## The three axes
 *
 * - **mount** — build the tree, write the DOM, force layout, dispose. What a
 *   page pays before it is usable.
 * - **open / toggle** — one gesture that flips a state the library owns, plus the
 *   framework's commit. What the user pays per interaction.
 *
 * Both are worth measuring because they do not correlate: a library can mount
 * cheaply and re-render expensively, or the reverse.
 *
 * ## What these numbers are not
 *
 * They are not bundle size (see `sui size --matrix`), not correctness, and not
 * an accessibility claim. A library can win here and still be the wrong choice.
 *
 * ## Why the select cases mount open
 *
 * Closed selects render zero options in all four libraries — verified by counting
 * `[role=option]` after mount — so a closed case would compare four 5-node mounts
 * and read as a tie. The select mount cases are therefore mounted open, which is
 * the case that actually renders N items. The interaction cases open and close
 * through a real gesture, which is the interesting path.
 */

const adapters: readonly Adapter[] = [aria, reka, baseUi, bitsUi];

const mountResults: BenchmarkStats[] = [];
const gestureResults: BenchmarkStats[] = [];

const mountCases = [
  { label: 'accordion/10', mount: (adapter: Adapter) => adapter.mountAccordion({ items: 10 }) },
  { label: 'accordion/50', mount: (adapter: Adapter) => adapter.mountAccordion({ items: 50 }) },
  { label: 'select-open/20', mount: (adapter: Adapter) => adapter.mountSelect({ open: true, options: 20 }) },
  { label: 'select-open/100', mount: (adapter: Adapter) => adapter.mountSelect({ open: true, options: 100 }) }
] as const;

describe('cross-library mount cost', () => {
  for (const testCase of mountCases) {
    for (const adapter of adapters) {
      it(`${testCase.label} — ${adapter.name}`, async () => {
        let mounted: Mounted | undefined;

        mountResults.push(
          await benchmark(
            `${testCase.label}/${adapter.name}`,
            async () => {
              mounted = await testCase.mount(adapter);
              // Force style + layout inside the measured region; see
              // `packages/aria/test/perf/shared/mount.ts` for why.
              void document.body.getBoundingClientRect();
            },
            {
              cleanup: async () => {
                await mounted?.unmount();
                mounted = undefined;
              },
              // 30 warmup mounts, not 3.
              //
              // Probed with 120 consecutive mounts bucketed 20 at a time: Base UI
              // needs ~20 mounts to leave its ramp (bucket p50s 11.5 → 6.4 → 6.7
              // → 7.2 → 6.2 → 6.4 for select-open/100), so a 3-mount warmup
              // measured it mid-ramp and reported its warmup curve as a library
              // difference. Every library here is past its ramp by 30.
              iterations: 20,
              warmup: 30
            }
          )
        );
      });
    }
  }
});

/**
 * Gestures come from the adapter, not from a shared helper.
 *
 * A first attempt queried `[role="button"]` for the accordion and dispatched a
 * fixed pointer sequence for the select. Both silently missed on some libraries
 * — a plain `<button>` has no `role` attribute, and the four libraries do not
 * agree on whether a select opens on `pointerdown` or on `click` (Base UI is the
 * odd one out) — so the gesture landed on nothing and every interaction row read
 * `0.000`. A benchmark that measures nothing looks like a tie, which is worse
 * than no benchmark at all.
 */

interface GestureCase {
  readonly label: string;
  readonly mount: (adapter: Adapter) => Promise<Mounted>;
  readonly run: (mounted: Mounted) => Promise<void>;
}

const gestureCases: readonly GestureCase[] = [
  {
    label: 'accordion-toggle/10',
    mount: adapter => adapter.mountAccordion({ items: 10 }),
    run: async mounted => {
      mounted.toggleAccordion();
      await mounted.flush();
    }
  },
  {
    /**
     * Open only, not open+close.
     *
     * Closing is not comparable across these four: `aria`, `reka-ui` and
     * `bits-ui` remove the options from the DOM by their next commit, while Base
     * UI keeps them mounted past that point (verified: `aria-expanded` flips to
     * `false` immediately, but `[role=option]` count stays at 3 until a frame or
     * two later). Timing open+close would therefore include a deferred teardown
     * for one library and not the other three — a difference in *when* the work
     * happens reported as a difference in *how much*.
     */
    // Named separately from the mount case of the same size so the two tables
    // never carry two different rows under one name.
    label: 'select-gesture-open/100',
    mount: adapter => adapter.mountSelect({ options: 100 }),
    run: async mounted => {
      mounted.openSelect();
      await mounted.flush();
    }
  }
];

/**
 * A gesture needs a live tree, and the tree must not be built inside the timed
 * region — otherwise each sample measures mount instead of interaction. So the
 * first tree is built before the benchmark, and `cleanup` builds the next one
 * after disposing the previous. `cleanup` runs outside the timed region by
 * construction, which is exactly the contract needed here.
 */
describe('cross-library interaction cost', () => {
  for (const testCase of gestureCases) {
    for (const adapter of adapters) {
      it(`${testCase.label} — ${adapter.name}`, async () => {
        let mounted: Mounted | null = await testCase.mount(adapter);

        gestureResults.push(
          await benchmark(
            `${testCase.label}/${adapter.name}`,
            async () => {
              if (mounted) await testCase.run(mounted);
            },
            {
              cleanup: async () => {
                await mounted?.unmount();
                mounted = await testCase.mount(adapter);
              },
              // Same reason as the mount cases: Base UI is not at steady state
              // until roughly twenty interactions in.
              iterations: 20,
              warmup: 30
            }
          )
        );

        await mounted?.unmount();
      });
    }
  }
});

/**
 * Printed as one table at the end rather than per test: the comparison only reads
 * as a comparison when the rows sit next to each other. `process.on('beforeExit')`
 * is not available here — this file runs in the browser, where `process` is
 * undefined.
 */
afterAll(() => {
  if (mountResults.length > 0) {
    console.log(`\n${formatBenchmarks(mountResults)}\n`);
    console.log(`\n### Mount\n\n${renderMarkdown(mountResults)}\n`);
  }

  if (gestureResults.length > 0) {
    console.log(`\n${formatBenchmarks(gestureResults)}\n`);
    console.log(`\n### Interaction\n\n${renderMarkdown(gestureResults)}\n`);
  }
});
