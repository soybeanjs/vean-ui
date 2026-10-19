/**
 * Cross-library benchmark harness.
 *
 * Framework-agnostic on purpose: the same timing core runs a Vue, React and a
 * Svelte mount, so a difference in the numbers is a difference in the library
 * and not a difference in the measuring code. Only the adapter (how to mount and
 * dispose one library's component) varies.
 *
 * `vitest bench` is not used here for the same reason as in
 * `packages/aria/test/perf`: tinybench drives its loop from Node, so it cannot
 * time work that happens in the browser.
 */

export interface BenchmarkOptions {
  /** Calls per sample. A sample is `batch` calls, divided by `batch`. */
  batch?: number;
  /** Run between samples, outside the timed region. */
  cleanup?: () => Promise<unknown> | unknown;
  /** Measured samples. */
  iterations?: number;
  /** Discarded samples, to warm the JIT and the layout cache. */
  warmup?: number;
}

export interface BenchmarkStats {
  batch: number;
  iterations: number;
  max: number;
  mean: number;
  min: number;
  name: string;
  p50: number;
  p95: number;
  warmup: number;
}

/**
 * Chromium clamps `performance.now()` to ~100 µs, so a 5 µs call reads as
 * `0.000` or `0.100`. `batch` runs a call N times per sample and divides, which
 * is the only way to get a usable figure below the clamp.
 */
export async function benchmark(
  name: string,
  run: () => Promise<unknown> | unknown,
  options: BenchmarkOptions = {}
): Promise<BenchmarkStats> {
  const batch = Math.max(1, options.batch ?? 1);
  const iterations = options.iterations ?? 20;
  const warmup = options.warmup ?? 3;
  const cleanup = options.cleanup;

  for (let index = 0; index < warmup; index++) {
    await run();
    await cleanup?.();
  }

  const samples: number[] = [];

  for (let index = 0; index < iterations; index++) {
    const start = performance.now();

    for (let call = 0; call < batch; call++) await run();

    samples.push((performance.now() - start) / batch);
    await cleanup?.();
  }

  const sorted = [...samples].sort((first, second) => first - second);
  const round = (value: number): number => Math.round(value * 1000) / 1000;
  const sum = samples.reduce((total, value) => total + value, 0);

  return {
    batch,
    iterations: samples.length,
    max: round(sorted[sorted.length - 1] ?? 0),
    mean: round(sum / Math.max(1, samples.length)),
    min: round(sorted[0] ?? 0),
    name,
    p50: round(nearestRank(sorted, 50)),
    p95: round(nearestRank(sorted, 95)),
    warmup
  };
}

/** Nearest-rank percentile: no interpolation, so every reported value is a real sample. */
function nearestRank(sorted: readonly number[], percentile: number): number {
  if (sorted.length === 0) return 0;

  const rank = Math.ceil((percentile / 100) * sorted.length) - 1;

  return sorted[Math.min(sorted.length - 1, Math.max(0, rank))] ?? 0;
}

export function formatBenchmarks(stats: readonly BenchmarkStats[]): string {
  if (stats.length === 0) return 'no benchmarks ran';

  const header = ['name', 'p50', 'p95', 'mean', 'min', 'n', 'batch'];
  const rows = stats.map(entry =>
    [
      entry.name,
      entry.p50.toFixed(3),
      entry.p95.toFixed(3),
      entry.mean.toFixed(3),
      entry.min.toFixed(3),
      String(entry.iterations),
      String(entry.batch)
    ].join('\t')
  );
  const widths = header.map((cell, column) =>
    Math.max(cell.length, ...rows.map(row => (row.split('\t')[column] ?? '').length))
  );
  const render = (row: readonly string[]): string =>
    row.map((cell, column) => cell.padEnd(widths[column] ?? 0)).join('  ');

  return [
    `${stats.length} benchmark(s), milliseconds per call:`,
    '',
    render(header),
    ...rows.map(row => render(row.split('\t')))
  ].join('\n');
}

export function renderMarkdown(stats: readonly BenchmarkStats[]): string {
  const header = '| benchmark | p50 (ms) | p95 (ms) | mean (ms) | n | batch |';
  const divider = '| --- | ---: | ---: | ---: | ---: | ---: |';
  const rows = stats.map(
    entry =>
      `| \`${entry.name}\` | ${entry.p50.toFixed(3)} | ${entry.p95.toFixed(3)} | ${entry.mean.toFixed(3)} | ${entry.iterations} | ${entry.batch} |`
  );

  return [header, divider, ...rows].join('\n');
}
