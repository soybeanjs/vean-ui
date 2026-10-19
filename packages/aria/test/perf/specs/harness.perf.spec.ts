import { afterAll, describe, expect, it } from 'vitest';
import { assertWithinCeiling, benchmark, formatBenchmarks } from '../shared/benchmark';
import type { BenchmarkStats } from '../shared/benchmark';

/**
 * Tests for the benchmark harness itself.
 *
 * The real targets live in `components.perf.spec.ts` and `pure.perf.spec.ts`.
 * This file exists because a timing harness that silently measures nothing is
 * worse than no harness at all: every ceiling below would pass, and the perf
 * tier would look green while measuring the wrong thing. Each assertion here
 * pins one property that, if it broke, would make the other files meaningless.
 */
const stats: BenchmarkStats[] = [];

afterAll(() => {
  // Printed once per file so a CI log shows the numbers even when every ceiling
  // passed. A perf tier whose output you cannot read is a perf tier nobody uses.
  console.log(`\n${formatBenchmarks(stats)}\n`);
});

const record = (value: BenchmarkStats): BenchmarkStats => {
  stats.push(value);

  return value;
};

/** ~1 ms of work that no engine can optimize away. */
const spinForOneMillisecond = (): void => {
  const until = performance.now() + 1;

  while (performance.now() < until) {
    // spin
  }
};

describe('benchmark harness', () => {
  it('separates a fast path from a slow path', async () => {
    const fast = record(await benchmark('harness/fast', () => undefined, { iterations: 30, warmup: 2 }));
    const slow = record(await benchmark('harness/slow', spinForOneMillisecond, { iterations: 10, warmup: 1 }));

    // If the harness cannot see a 1 ms difference, it cannot see a regression.
    expect(slow.p50).toBeGreaterThan(fast.p50);
    expect(slow.p50).toBeGreaterThanOrEqual(1);
  });

  it('keeps percentiles ordered and inside the sample range', async () => {
    const result = record(await benchmark('harness/percentiles', spinForOneMillisecond, { iterations: 20, warmup: 2 }));

    expect(result.min).toBeLessThanOrEqual(result.p50);
    expect(result.p50).toBeLessThanOrEqual(result.p95);
    expect(result.p95).toBeLessThanOrEqual(result.max);
    expect(result.mean).toBeGreaterThanOrEqual(result.min);
    expect(result.mean).toBeLessThanOrEqual(result.max);
  });

  it('records the sample size so a percentile can be read in context', async () => {
    const result = record(await benchmark('harness/sample-size', () => undefined, { iterations: 7, warmup: 3 }));

    expect(result).toMatchObject({ batch: 1, iterations: 7, warmup: 3 });
  });

  it('divides batched samples back to a per-call figure', async () => {
    // `batch` is what lifts a microsecond-scale function above the ~100 µs
    // `performance.now()` clamp. The arithmetic has to undo the multiplication or
    // every batched number in `pure.perf.spec.ts` reads 200× too slow.
    const single = record(
      await benchmark('harness/batch-1', spinForOneMillisecond, { batch: 1, iterations: 10, warmup: 1 })
    );
    const batched = record(
      await benchmark('harness/batch-5', spinForOneMillisecond, { batch: 5, iterations: 10, warmup: 1 })
    );

    expect(batched.p50).toBeGreaterThan(single.p50 * 0.5);
    expect(batched.p50).toBeLessThan(single.p50 * 2);
  });

  it('treats a batch below 1 as one call', async () => {
    const result = record(await benchmark('harness/batch-floor', () => undefined, { batch: 0 }));

    expect(result.batch).toBe(1);
  });

  it('throws when a result exceeds its ceiling', async () => {
    const slow = record(await benchmark('harness/ceiling-slow', spinForOneMillisecond, { iterations: 10 }));

    expect(() => assertWithinCeiling(slow, 0.5)).toThrow(/exceeds the 0.5 ms ceiling/);
    expect(() => assertWithinCeiling(slow, 5000)).not.toThrow();
  });

  it('renders a header that names the unit and the batch size', async () => {
    const result = record(await benchmark('harness/render', () => undefined, { batch: 3, iterations: 5 }));

    const table = formatBenchmarks([result]);

    expect(table).toContain('milliseconds per call');
    expect(table).toContain('batch');
    expect(table).toContain('harness/render');
  });

  it('reports an empty run instead of an empty table', () => {
    expect(formatBenchmarks([])).toBe('no benchmarks ran');
  });
});
