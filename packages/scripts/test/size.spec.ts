import { existsSync } from 'node:fs';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildFixtureSource,
  collectExternalSpecifiers,
  evaluateSizeCheck,
  extractBaseline,
  formatBytes,
  isBaselineComparable,
  parseSizeBudget,
  renderMarkdownReport,
  resolvePublishedSpecifier,
  summarizeVerdicts
} from '../src/shared/size';
import type { SizeCheckVerdict, SizeMeasurement, SizeReport, WorkspacePackageManifest } from '../src/shared/size';
import {
  discoverWorkspacePackages,
  measureBundleMetrics,
  measureFileMetrics,
  readManifest
} from '../src/shared/size-measure';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const uiDistEntry = join(repoRoot, 'packages/ui/dist/index.js');
const uiStyles = join(repoRoot, 'packages/ui/dist/styles.css');

const createManifest = (overrides: Partial<WorkspacePackageManifest> = {}): WorkspacePackageManifest => ({
  dependencies: [],
  dir: '/repo/packages/demo',
  exports: {
    '.': { import: './dist/index.js' },
    './composables': './dist/composables/index.js',
    './*': './dist/components/*/index.js'
  },
  name: '@demo/pkg',
  peerDependencies: [],
  ...overrides
});

const createMeasurement = (overrides: Partial<SizeMeasurement> = {}): SizeMeasurement => ({
  budget: {},
  gate: true,
  id: 'demo/check',
  kind: 'bundle',
  metrics: { brotli: 1000 },
  ...overrides
});

const createVerdict = (overrides: Partial<SizeCheckVerdict> = {}): SizeCheckVerdict => ({
  ...createMeasurement(),
  deltas: [],
  notes: [],
  status: 'ok',
  ...overrides
});

describe('parseSizeBudget', () => {
  it('applies defaults for the engine, the gate flag and the delta thresholds', () => {
    const budget = parseSizeBudget({ checks: [{ id: 'a', kind: 'file', path: 'dist/a.js' }] });

    expect(budget.engine).toEqual({ bundler: 'esbuild', external: [], version: '' });
    expect(budget.checks[0]).toEqual({ budget: {}, gate: true, id: 'a', kind: 'file', path: 'dist/a.js' });
    expect(budget.delta).toEqual({
      failBytes: Number.POSITIVE_INFINITY,
      failRatio: Number.POSITIVE_INFINITY,
      warnBytes: 512,
      warnRatio: 0.01
    });
  });

  it('reads bundle, pack and file checks', () => {
    const budget = parseSizeBudget({
      checks: [
        { id: 'b', kind: 'bundle', entry: 'dist/index.js', import: '{ SButton }', deps: 'external', gate: false },
        { id: 'p', kind: 'pack', packageDir: 'packages/ui', budget: { raw: 100 } }
      ],
      delta: { warnRatio: 0.02 },
      engine: { version: '1.2.3' }
    });

    expect(budget.checks[0]).toMatchObject({ deps: 'external', gate: false, import: '{ SButton }' });
    expect(budget.checks[1]).toMatchObject({ budget: { raw: 100 }, kind: 'pack' });
    expect(budget.delta.warnRatio).toBe(0.02);
    expect(budget.engine.version).toBe('1.2.3');
  });

  it('rejects a budget file that would silently measure nothing', () => {
    expect(() => parseSizeBudget({ checks: [] })).toThrow(/"checks" must be a non-empty array/);
    expect(() => parseSizeBudget({})).toThrow(/"checks" must be a non-empty array/);
    expect(() => parseSizeBudget({ checks: [{ id: 'a', kind: 'nope' }] })).toThrow(
      /must be one of bundle \| file \| pack/
    );
    expect(() => parseSizeBudget({ checks: [{ id: 'a', kind: 'file' }] })).toThrow(/"checks\[0\]\.path" must be/);
    expect(() =>
      parseSizeBudget({
        checks: [
          { id: 'a', kind: 'file', path: 'x' },
          { id: 'a', kind: 'file', path: 'y' }
        ]
      })
    ).toThrow(/duplicate check id/);
    expect(() => parseSizeBudget({ checks: [{ id: 'a', kind: 'file', path: 'x', budget: { huge: 1 } }] })).toThrow(
      /is not one of/
    );
    expect(() => parseSizeBudget({ checks: [{ id: 'a', kind: 'file', path: 'x', budget: { gzip: -1 } }] })).toThrow(
      /must be a number >= 0/
    );
  });
});

describe('resolvePublishedSpecifier', () => {
  it('prefers an exact exports key over the wildcard pattern', () => {
    const manifest = createManifest();

    expect(resolvePublishedSpecifier(manifest, '@demo/pkg')).toBe(join(manifest.dir, 'dist/index.js'));
    expect(resolvePublishedSpecifier(manifest, '@demo/pkg/composables')).toBe(
      join(manifest.dir, 'dist/composables/index.js')
    );
  });

  it('expands wildcard patterns the way Node resolves them', () => {
    expect(resolvePublishedSpecifier(createManifest(), '@demo/pkg/button')).toBe(
      join('/repo/packages/demo', 'dist/components/button/index.js')
    );
  });

  it('ignores other packages and subpaths no pattern covers', () => {
    const withoutPattern = createManifest({ exports: { '.': './dist/index.js' } });

    expect(resolvePublishedSpecifier(withoutPattern, '@other/pkg')).toBeNull();
    expect(resolvePublishedSpecifier(withoutPattern, '@demo/pkg/button')).toBeNull();
  });

  it('resolves the real workspace packages to their published dist output, never to src', () => {
    const manifests = discoverWorkspacePackages(repoRoot);
    const ui = readManifest(join(repoRoot, 'packages/ui'));
    const aria = readManifest(join(repoRoot, 'packages/aria'));

    expect(manifests.length).toBeGreaterThan(0);

    if (!ui || !aria) {
      throw new Error('expected packages/ui and packages/aria manifests to be readable');
    }

    expect(resolvePublishedSpecifier(ui, '@vean/ui')).toBe(join(repoRoot, 'packages/ui/dist/index.js'));
    expect(resolvePublishedSpecifier(ui, '@vean/ui/button')).toBe(
      join(repoRoot, 'packages/ui/dist/components/button/index.js')
    );
    expect(resolvePublishedSpecifier(aria, '@vean/aria/composables')).toBe(
      join(repoRoot, 'packages/aria/dist/composables/index.js')
    );

    // The in-repo `exports` maps point at `./src/*.ts`; a regression here would
    // silently make every measurement describe TypeScript source.
    const resolved = manifests
      .map(manifest => resolvePublishedSpecifier(manifest, manifest.name))
      .filter((target): target is string => target !== null);

    expect(resolved.length).toBeGreaterThan(0);
    expect(resolved.filter(target => target.includes(`${sep}src${sep}`) || target.endsWith('.ts'))).toEqual([]);
  });
});

describe('collectExternalSpecifiers', () => {
  const manifests = [createManifest({ dependencies: ['vue', 'date-fns'], peerDependencies: ['vue'] })];

  it('keeps only the engine list when dependencies are bundled', () => {
    expect(collectExternalSpecifiers({ engineExternal: ['vue'], manifests, policy: 'bundled' })).toEqual(['vue']);
  });

  it('externalizes every declared dependency for library-layer checks', () => {
    expect(collectExternalSpecifiers({ engineExternal: ['vue'], manifests, policy: 'external' })).toEqual([
      'date-fns',
      'vue'
    ]);
  });
});

describe('buildFixtureSource', () => {
  it('re-exports named imports so tree-shaking cannot empty the fixture', () => {
    const source = buildFixtureSource({ entryPath: '/repo/dist/index.js', importClause: '{ SButton }' });

    expect(source).toContain('import { SButton } from "/repo/dist/index.js";');
    expect(source).toContain('export { SButton };');
  });

  it('re-exports the alias, not the imported name', () => {
    expect(buildFixtureSource({ entryPath: '/x.js', importClause: '{ SDialog as D }' })).toContain('export { D };');
  });

  it('measures the whole barrel when no clause is given', () => {
    const source = buildFixtureSource({ entryPath: '/repo/dist/index.js', importClause: null });

    expect(source).toContain('import * as __barrel from "/repo/dist/index.js";');
    expect(source).toContain('export default __barrel;');
  });

  it('rejects a clause it cannot turn into live bindings', () => {
    expect(() => buildFixtureSource({ entryPath: '/x.js', importClause: '{}' })).toThrow(/not a valid named import/);
    expect(() => buildFixtureSource({ entryPath: '/x.js', importClause: '{ 1bad }' })).toThrow(
      /not a valid named import/
    );
  });
});

describe('evaluateSizeCheck', () => {
  it('fails on a budget breach', () => {
    const verdict = evaluateSizeCheck({
      baseline: null,
      compareBaseline: false,
      measurement: createMeasurement({ budget: { brotli: 900 }, metrics: { brotli: 1000 } }),
      thresholds: parseSizeBudget({ checks: [{ id: 'a', kind: 'file', path: 'x' }] }).delta
    });

    expect(verdict.status).toBe('fail');
    expect(verdict.notes[0]).toContain('over budget');
  });

  it('stays quiet below the delta noise floor', () => {
    const verdict = evaluateSizeCheck({
      baseline: { brotli: 1000 },
      compareBaseline: true,
      measurement: createMeasurement({ metrics: { brotli: 1020 } }),
      thresholds: parseSizeBudget({ checks: [{ id: 'a', kind: 'file', path: 'x' }] }).delta
    });

    expect(verdict.deltas[0]).toMatchObject({ bytes: 20, status: 'ok' });
    expect(verdict.status).toBe('ok');
  });

  it('warns on growth past the warn thresholds and fails past the fail thresholds', () => {
    const thresholds = { failBytes: 2048, failRatio: 0.05, warnBytes: 512, warnRatio: 0.01 };
    const evaluate = (baseline: number, current: number): string =>
      evaluateSizeCheck({
        baseline: { brotli: baseline },
        compareBaseline: true,
        measurement: createMeasurement({ metrics: { brotli: current } }),
        thresholds
      }).status;

    expect(evaluate(100_000, 102_000)).toBe('warn');
    expect(evaluate(100_000, 106_000)).toBe('fail');
    expect(evaluate(100_000, 99_000)).toBe('ok');
    expect(evaluate(1000, 1030)).toBe('ok');
  });

  it('never fails an informational check', () => {
    const verdict = evaluateSizeCheck({
      baseline: null,
      compareBaseline: false,
      measurement: createMeasurement({ budget: { brotli: 1 }, gate: false, metrics: { brotli: 100_000 } }),
      thresholds: parseSizeBudget({ checks: [{ id: 'a', kind: 'file', path: 'x' }] }).delta
    });

    expect(verdict.status).toBe('warn');
    expect(verdict.notes.join(' ')).toContain('informational check');
  });

  it('reports no deltas without a comparable baseline', () => {
    const thresholds = parseSizeBudget({ checks: [{ id: 'a', kind: 'file', path: 'x' }] }).delta;

    expect(
      evaluateSizeCheck({
        baseline: { brotli: 1000 },
        compareBaseline: false,
        measurement: createMeasurement(),
        thresholds
      }).deltas
    ).toEqual([]);
    expect(
      evaluateSizeCheck({ baseline: null, compareBaseline: true, measurement: createMeasurement(), thresholds }).deltas
    ).toEqual([]);
  });
});

describe('baseline handling', () => {
  it('reads a report back as a baseline', () => {
    const baseline = extractBaseline({
      checks: [
        { id: 'a', metrics: { brotli: 10, gzip: 20, nonsense: 30 } },
        { id: 'b', metrics: 'broken' }
      ],
      engine: { bundler: 'esbuild', version: '1.0.0' },
      generatedAt: '2026-01-01T00:00:00.000Z'
    });

    expect(Array.from(baseline.checks.entries())).toEqual([['a', { brotli: 10, gzip: 20 }]]);
    expect(baseline.engine).toEqual({ bundler: 'esbuild', external: undefined, version: '1.0.0' });
    expect(baseline.generatedAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('ignores anything that is not a report', () => {
    expect(extractBaseline(null).checks.size).toBe(0);
    expect(extractBaseline({ checks: 'nope' }).checks.size).toBe(0);
  });

  it('only compares deltas across the same bundler version', () => {
    const engine = { bundler: 'esbuild', external: ['vue'], version: '0.28.2' };

    expect(isBaselineComparable({ baselineEngine: engine, engine })).toBe(true);
    expect(isBaselineComparable({ baselineEngine: { ...engine, version: '0.29.0' }, engine })).toBe(false);
    expect(isBaselineComparable({ baselineEngine: { bundler: 'rolldown', version: '0.28.2' }, engine })).toBe(false);
  });
});

describe('report rendering', () => {
  const report: SizeReport = {
    baseline: { comparable: true, generatedAt: null, path: '.size-cache/size-baseline.json' },
    checks: [
      createVerdict({ budget: { brotli: 2000 }, id: 'consumer/button', metrics: { brotli: 1500 } }),
      createVerdict({
        deltas: [{ baseline: 1000, bytes: 900, current: 1900, metric: 'brotli', ratio: 0.9, status: 'warn' }],
        gate: false,
        id: 'library/button',
        metrics: { brotli: 1900 },
        notes: ['brotli +900 B (+90.0%)'],
        status: 'warn'
      })
    ],
    commit: 'abc1234',
    delta: { failBytes: 2048, failRatio: 0.05, warnBytes: 512, warnRatio: 0.01 },
    engine: { bundler: 'esbuild', external: ['vue'], version: '0.28.2' },
    generatedAt: '2026-01-01T00:00:00.000Z',
    node: 'v24.0.0',
    summary: { fail: 0, ok: 1, skip: 0, warn: 1 }
  };

  it('renders the headline table, the informational marker and the footer', () => {
    const markdown = renderMarkdownReport(report);

    expect(markdown).toContain('## 📦 Bundle size');
    expect(markdown).toContain('| `consumer/button` | brotli 1.5 KB | — | 2.0 KB | ✅ |');
    expect(markdown).toContain('| `library/button` *(info)* |');
    expect(markdown).toContain('1 ok');
    expect(markdown).toContain('engine: esbuild 0.28.2');
  });

  it('counts verdicts by status', () => {
    expect(summarizeVerdicts(report.checks)).toEqual({ fail: 0, ok: 1, skip: 0, warn: 1 });
  });
});

describe('formatBytes', () => {
  it('switches unit at the right boundaries', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(10 * 1024)).toBe('10.0 KB');
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.00 MB');
  });
});

/**
 * These run against real build output, so they are skipped in a checkout that
 * has not run `pnpm build` (CI builds before `pnpm test`).
 */
describe.skipIf(!existsSync(uiStyles) || !existsSync(uiDistEntry))('measurement against real build output', () => {
  it('measures the shipped stylesheet deterministically', () => {
    const first = measureFileMetrics(uiStyles);
    const second = measureFileMetrics(uiStyles);
    const { brotli = 0, gzip = 0, raw = 0 } = first;

    expect(first).toEqual(second);
    expect(raw).toBeGreaterThan(gzip);
    expect(gzip).toBeGreaterThan(brotli);
  });

  it('bundles one component far below the whole barrel', async () => {
    // Two real esbuild passes over the built barrel: ~2.5s locally, but close
    // enough to Vitest's 5s default that a CI runner trips it.
    const manifests = discoverWorkspacePackages(repoRoot);
    const measure = (importClause: string | null): Promise<{ brotli?: number }> =>
      measureBundleMetrics({
        entryPath: uiDistEntry,
        external: ['vue'],
        importClause,
        manifests,
        rootDir: repoRoot
      });
    const component = await measure('{ SButton }');
    const barrel = await measure(null);
    const componentBytes = component.brotli ?? 0;
    const barrelBytes = barrel.brotli ?? 0;

    expect(componentBytes).toBeGreaterThan(1024);
    expect(componentBytes).toBeLessThan(200 * 1024);
    expect(barrelBytes).toBeGreaterThan(componentBytes * 10);
  }, 30_000);
});
