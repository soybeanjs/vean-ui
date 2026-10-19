/**
 * A timing harness for the perf tier.
 *
 * `vitest bench` is not usable here: `tinybench` drives its loop from the Node
 * side, so it cannot time work that only happens in a real browser (layout,
 * paint, real focus). That is the same wall base-ui hit, and it is why they
 * ship their own harness. This is the Vue-side equivalent, kept deliberately
 * small: a warmup pass, a measured pass, and percentiles.
 *
 * Rules that keep the numbers trustworthy:
 *
 * - Timings are always `performance.now()` deltas around an `await`, never
 *   accumulated floats — a mount that awaits a microtask must be measured
 *   across the await, not just around the synchronous call.
 * - A warmup pass runs before measuring, so the first-hit cost of Vue's
 *   compiler paths and of the component's own lazy imports does not land in the
 *   sample set.
 * - The result records `iterations` and `warmup`, because a percentile without
 *   its sample size is not a number anyone can act on.
 * - Reported percentiles are computed on the sorted sample array, so `p50` is
 *   the median by construction and `p95` uses the nearest-rank method. No
 *   interpolation: with 50 samples an interpolated p95 is fiction.
 */

export interface BenchmarkOptions {
  /** Iterations discarded before measuring. Default 5. */
  readonly warmup?: number;
  /** Measured iterations. Default 50. */
  readonly iterations?: number;
  /**
   * Calls per timed iteration. Default 1.
   *
   * Required for cheap functions: `performance.now()` is clamped to ~100 µs in
   * Chromium for cross-origin-isolated pages and coarser outside it, so a 5 µs
   * function reads as either `0.000` or `0.100` — quantized noise, not a
   * measurement. Batching turns one sample into `batch × 5 µs`, which clears the
   * clock floor. The result is divided back to a per-call figure before it is
   * reported, so the table stays comparable across benchmarks.
   */
  readonly batch?: number;
  /**
   * Runs after each measured iteration, outside the timed region.
   *
   * Mount benchmarks need this: unmounting 50 components is real work, but it is
   * not the work under test, and skipping it would pile 50 live subtrees into one
   * document so later iterations pay for layout they did not cause.
   */
  readonly cleanup?: () => Promise<unknown> | unknown;
}

export interface BenchmarkStats {
  /** Calls averaged into one reported sample. 1 means one call per sample. */
  readonly batch: number;
  readonly iterations: number;
  readonly max: number;
  readonly mean: number;
  readonly min: number;
  readonly name: string;
  readonly p50: number;
  readonly p95: number;
  readonly warmup: number;
}

const defaultWarmup = 5;
const defaultIterations = 50;

const nearestRank = (sorted: readonly number[], percentile: number): number => {
  if (sorted.length === 0) {
    return 0;
  }

  const rank = Math.ceil((percentile / 100) * sorted.length);

  return sorted[Math.min(Math.max(rank, 1), sorted.length) - 1] ?? 0;
};

const round = (value: number): number => Math.round(value * 1000) / 1000;

/** Timing is reported in milliseconds, at microsecond resolution. */
export async function benchmark(
  name: string,
  run: () => Promise<unknown> | unknown,
  options: BenchmarkOptions = {}
): Promise<BenchmarkStats> {
  const warmup = options.warmup ?? defaultWarmup;
  const iterations = options.iterations ?? defaultIterations;
  const batch = Math.max(1, Math.trunc(options.batch ?? 1));

  for (let index = 0; index < warmup; index++) {
    await run();
    await options.cleanup?.();
  }

  const samples: number[] = [];

  for (let index = 0; index < iterations; index++) {
    const start = performance.now();

    for (let call = 0; call < batch; call++) {
      await run();
    }

    samples.push((performance.now() - start) / batch);

    await options.cleanup?.();
  }

  const sorted = [...samples].sort((left, right) => left - right);
  const total = samples.reduce((sum, value) => sum + value, 0);

  return {
    batch,
    iterations,
    max: round(sorted[sorted.length - 1] ?? 0),
    mean: round(total / Math.max(samples.length, 1)),
    min: round(sorted[0] ?? 0),
    name,
    p50: round(nearestRank(sorted, 50)),
    p95: round(nearestRank(sorted, 95)),
    warmup
  };
}

const padStart = (value: string, width: number): string => value.padStart(width);
const padEnd = (value: string, width: number): string => value.padEnd(width);

/** Aligned table for the console: one row per benchmark, milliseconds everywhere. */
export function formatBenchmarks(stats: readonly BenchmarkStats[]): string {
  if (stats.length === 0) {
    return 'no benchmarks ran';
  }

  const nameWidth = Math.min(Math.max(...stats.map(entry => entry.name.length)), 56);

  return [
    `${stats.length} benchmark(s), milliseconds per call:`,
    '',
    `${padEnd('name', nameWidth)}  ${padStart('p50', 9)}${padStart('p95', 9)}${padStart('mean', 9)}${padStart('min', 9)}${padStart('n', 6)}${padStart('batch', 7)}`,
    ...stats.map(entry =>
      [
        padEnd(entry.name, nameWidth),
        padStart(entry.p50.toFixed(3), 9),
        padStart(entry.p95.toFixed(3), 9),
        padStart(entry.mean.toFixed(3), 9),
        padStart(entry.min.toFixed(3), 9),
        padStart(String(entry.iterations), 6),
        padStart(String(entry.batch), 7)
      ].join('')
    )
  ].join('\n');
}

/**
 * A ceiling assertion for a benchmark.
 *
 * The perf tier is observational by design: absolute timings move with the
 * machine, so a tight threshold would fail on a loaded CI runner for reasons
 * unrelated to the code. These ceilings are deliberately an order of magnitude
 * above the measured value on a development machine, so only a catastrophic
 * regression (an accidental O(n²), a layout thrash in a loop, a lost
 * `memo`) trips them, while every smaller movement stays visible in the printed
 * table instead of becoming a flaky gate.
 */
export function assertWithinCeiling(stats: BenchmarkStats, ceilingMs: number): void {
  if (stats.p95 > ceilingMs) {
    throw new Error(
      `${stats.name}: p95 ${stats.p95.toFixed(3)} ms exceeds the ${ceilingMs} ms ceiling ` +
        `(p50 ${stats.p50.toFixed(3)} ms, n=${stats.iterations}, batch=${stats.batch}).`
    );
  }
}
