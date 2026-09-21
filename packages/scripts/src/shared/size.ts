import path from 'node:path';

/**
 * Size-budget domain logic for `sui size` / `sui check size`.
 *
 * Everything in this module is pure: parsing the budget file, resolving a
 * workspace package's *published* entry points, turning raw measurements into
 * verdicts, and rendering the report. I/O (reading dist files, running the
 * bundler, packing) lives in `./size-measure`, so the rules stay unit-testable
 * without building the packages.
 *
 * Why "published entry points": `packages/{ui,aria}/package.json` `exports`
 * resolve to `./src/*.ts` for in-repo development, so a naive bundle would
 * measure TypeScript source. The publishConfig map is the only truthful
 * description of what a consumer downloads, so resolution is derived from it
 * (see `resolvePublishedSpecifier`) instead of a hand-maintained path table.
 */

/** Metrics in display priority order (smallest/most relevant first). */
export const sizeMetrics = ['brotli', 'gzip', 'raw'] as const;

export type SizeMetric = (typeof sizeMetrics)[number];

export type SizeCheckKind = 'bundle' | 'file' | 'pack';

/** Whether a bundle check measures the consumer's real app cost or the library layer alone. */
export type DependencyPolicy = 'bundled' | 'external';

export type SizeStatus = 'fail' | 'ok' | 'skip' | 'warn';

export interface SizeBudgetMap {
  readonly brotli?: number;
  readonly gzip?: number;
  readonly raw?: number;
}

export type SizeMetrics = Partial<Record<SizeMetric, number>>;

export interface SizeCheckBase {
  readonly budget: SizeBudgetMap;
  /** `false` marks an informational check: reported, but can never fail the gate. */
  readonly gate: boolean;
  readonly id: string;
  readonly kind: SizeCheckKind;
}

export interface SizeFileCheck extends SizeCheckBase {
  readonly kind: 'file';
  readonly path: string;
}

export interface SizePackCheck extends SizeCheckBase {
  readonly kind: 'pack';
  readonly packageDir: string;
}

export interface SizeBundleCheck extends SizeCheckBase {
  readonly kind: 'bundle';
  readonly deps: DependencyPolicy;
  readonly entry: string;
  /** Named import clause, for example `{ SButton }`. `null` measures the whole barrel. */
  readonly import: string | null;
}

export type SizeCheck = SizeBundleCheck | SizeFileCheck | SizePackCheck;

export interface SizeDeltaThresholds {
  readonly failBytes: number;
  readonly failRatio: number;
  readonly warnBytes: number;
  readonly warnRatio: number;
}

export interface SizeBudgetFile {
  readonly checks: readonly SizeCheck[];
  readonly delta: SizeDeltaThresholds;
  readonly engine: SizeEngineFingerprint;
}

export interface SizeEngineFingerprint {
  readonly bundler: string;
  readonly external: readonly string[];
  readonly version: string;
}

export interface SizeMetricDelta {
  readonly baseline: number;
  readonly bytes: number;
  readonly current: number;
  readonly metric: SizeMetric;
  readonly ratio: number;
  readonly status: SizeStatus;
}

export interface SizeMeasurement {
  readonly budget: SizeBudgetMap;
  readonly gate: boolean;
  readonly id: string;
  readonly kind: SizeCheckKind;
  readonly metrics: SizeMetrics;
}

export interface SizeCheckVerdict extends SizeMeasurement {
  readonly deltas: readonly SizeMetricDelta[];
  readonly notes: readonly string[];
  readonly status: SizeStatus;
}

export interface SizeSummary {
  readonly fail: number;
  readonly ok: number;
  readonly skip: number;
  readonly warn: number;
}

export interface SizeBaselineInfo {
  readonly comparable: boolean;
  readonly generatedAt: string | null;
  readonly path: string;
}

export interface SizeReport {
  readonly baseline: SizeBaselineInfo | null;
  readonly checks: readonly SizeCheckVerdict[];
  readonly commit: string | null;
  readonly delta: SizeDeltaThresholds;
  readonly engine: SizeEngineFingerprint;
  readonly generatedAt: string;
  readonly node: string;
  readonly summary: SizeSummary;
}

export interface WorkspacePackageManifest {
  readonly dependencies: readonly string[];
  readonly dir: string;
  readonly exports: Readonly<Record<string, unknown>>;
  readonly name: string;
  readonly peerDependencies: readonly string[];
}

export const defaultDeltaThresholds: SizeDeltaThresholds = {
  failBytes: Number.POSITIVE_INFINITY,
  failRatio: Number.POSITIVE_INFINITY,
  warnBytes: 512,
  warnRatio: 0.01
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSizeMetric = (value: string): value is SizeMetric => (sizeMetrics as readonly string[]).includes(value);

const readNonEmptyString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`size budget: "${field}" must be a non-empty string.`);
  }

  return value;
};

const readOptionalString = (value: unknown, field: string): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  return readNonEmptyString(value, field);
};

const readFiniteNumber = (value: unknown, field: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(`size budget: "${field}" must be a number >= 0.`);
  }

  return value;
};

const readBoolean = (value: unknown, field: string, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value !== 'boolean') {
    throw new Error(`size budget: "${field}" must be a boolean.`);
  }

  return value;
};

const readBudgetMap = (value: unknown, field: string): SizeBudgetMap => {
  if (value === undefined) {
    return {};
  }

  if (!isRecord(value)) {
    throw new Error(`size budget: "${field}" must be an object of byte budgets.`);
  }

  return Object.fromEntries(
    Object.entries(value).map(([metric, bytes]) => {
      if (!isSizeMetric(metric)) {
        throw new Error(`size budget: "${field}.${metric}" is not one of ${sizeMetrics.join(' | ')}.`);
      }

      return [metric, readFiniteNumber(bytes, `${field}.${metric}`)];
    })
  );
};

const readCheckKind = (value: unknown, field: string): SizeCheckKind => {
  if (value !== 'bundle' && value !== 'file' && value !== 'pack') {
    throw new Error(`size budget: "${field}" must be one of bundle | file | pack.`);
  }

  return value;
};

const readDependencyPolicy = (value: unknown, field: string): DependencyPolicy => {
  if (value === undefined) {
    return 'bundled';
  }

  if (value !== 'bundled' && value !== 'external') {
    throw new Error(`size budget: "${field}" must be one of bundled | external.`);
  }

  return value;
};

const parseSizeCheck = (value: unknown, index: number): SizeCheck => {
  if (!isRecord(value)) {
    throw new Error(`size budget: "checks[${index}]" must be an object.`);
  }

  const id = readNonEmptyString(value.id, `checks[${index}].id`);
  const kind = readCheckKind(value.kind, `checks[${index}].kind`);
  const base = {
    budget: readBudgetMap(value.budget, `checks[${index}].budget`),
    gate: readBoolean(value.gate, `checks[${index}].gate`, true),
    id,
    kind
  };

  if (kind === 'file') {
    return { ...base, kind, path: readNonEmptyString(value.path, `checks[${index}].path`) };
  }

  if (kind === 'pack') {
    return { ...base, kind, packageDir: readNonEmptyString(value.packageDir, `checks[${index}].packageDir`) };
  }

  return {
    ...base,
    deps: readDependencyPolicy(value.deps, `checks[${index}].deps`),
    entry: readNonEmptyString(value.entry, `checks[${index}].entry`),
    import: readOptionalString(value.import, `checks[${index}].import`),
    kind
  };
};

export function parseSizeBudget(value: unknown): SizeBudgetFile {
  if (!isRecord(value)) {
    throw new Error('size budget: the budget file must contain a JSON object.');
  }

  if (!Array.isArray(value.checks) || value.checks.length === 0) {
    throw new Error('size budget: "checks" must be a non-empty array.');
  }

  const checks = value.checks.map((check, index) => parseSizeCheck(check, index));
  const duplicated = checks.map(check => check.id).filter((id, index, ids) => ids.indexOf(id) !== index);

  if (duplicated.length > 0) {
    throw new Error(`size budget: duplicate check id(s): ${Array.from(new Set(duplicated)).join(', ')}.`);
  }

  const rawDelta = isRecord(value.delta) ? value.delta : {};
  const rawEngine = isRecord(value.engine) ? value.engine : {};
  const rawExternal = Array.isArray(rawEngine.external) ? rawEngine.external : [];

  return {
    checks,
    delta: {
      failBytes:
        rawDelta.failBytes === undefined
          ? defaultDeltaThresholds.failBytes
          : readFiniteNumber(rawDelta.failBytes, 'delta.failBytes'),
      failRatio:
        rawDelta.failRatio === undefined
          ? defaultDeltaThresholds.failRatio
          : readFiniteNumber(rawDelta.failRatio, 'delta.failRatio'),
      warnBytes:
        rawDelta.warnBytes === undefined
          ? defaultDeltaThresholds.warnBytes
          : readFiniteNumber(rawDelta.warnBytes, 'delta.warnBytes'),
      warnRatio:
        rawDelta.warnRatio === undefined
          ? defaultDeltaThresholds.warnRatio
          : readFiniteNumber(rawDelta.warnRatio, 'delta.warnRatio')
    },
    engine: {
      bundler: rawEngine.bundler === undefined ? 'esbuild' : readNonEmptyString(rawEngine.bundler, 'engine.bundler'),
      external: rawExternal.map((specifier, index) => readNonEmptyString(specifier, `engine.external[${index}]`)),
      version: rawEngine.version === undefined ? '' : readNonEmptyString(rawEngine.version, 'engine.version')
    }
  };
}

const pickExportTarget = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value;
  }

  if (!isRecord(value)) {
    return null;
  }

  return (
    (['import', 'module', 'default', 'require'] as const)
      .map(field => value[field])
      .find((target): target is string => typeof target === 'string') ?? null
  );
};

const matchExportPattern = (
  exportsMap: Readonly<Record<string, unknown>>,
  subpath: string
): { key: string; wildcard: string } | null => {
  const matches = Object.keys(exportsMap)
    .filter(key => key.includes('*'))
    .map(key => {
      const star = key.indexOf('*');

      return { key, prefix: key.slice(0, star), suffix: key.slice(star + 1) };
    })
    .filter(
      ({ prefix, suffix }) =>
        subpath.startsWith(prefix) && subpath.endsWith(suffix) && subpath.length >= prefix.length + suffix.length
    )
    .sort((left, right) => right.prefix.length - left.prefix.length);

  const best = matches[0];

  if (!best) {
    return null;
  }

  return {
    key: best.key,
    wildcard: subpath.slice(best.prefix.length, subpath.length - best.suffix.length)
  };
};

/**
 * Resolve an import specifier to the file a *published* install would load,
 * using standard exports-map rules (exact key first, then the longest matching
 * `*` pattern) over `publishConfig.exports ?? exports`.
 *
 * Returns `null` when the specifier is not part of the published surface.
 */
export function resolvePublishedSpecifier(manifest: WorkspacePackageManifest, specifier: string): string | null {
  if (specifier !== manifest.name && !specifier.startsWith(`${manifest.name}/`)) {
    return null;
  }

  const subpath = specifier === manifest.name ? '.' : `.${specifier.slice(manifest.name.length)}`;
  const exactTarget = pickExportTarget(manifest.exports[subpath]);

  if (exactTarget) {
    return path.join(manifest.dir, exactTarget.replace(/^\.\//, ''));
  }

  const match = matchExportPattern(manifest.exports, subpath);

  if (!match) {
    return null;
  }

  const target = pickExportTarget(manifest.exports[match.key]);

  if (!target) {
    return null;
  }

  return path.join(manifest.dir, target.replaceAll('*', match.wildcard).replace(/^\.\//, ''));
}

/** External specifiers for a bundle check: engine list alone, or every declared dependency too. */
export function collectExternalSpecifiers(options: {
  engineExternal: readonly string[];
  manifests: readonly WorkspacePackageManifest[];
  policy: DependencyPolicy;
}): string[] {
  if (options.policy === 'bundled') {
    return [...options.engineExternal];
  }

  return Array.from(
    new Set([
      ...options.engineExternal,
      ...options.manifests.flatMap(manifest => [...manifest.dependencies, ...manifest.peerDependencies])
    ])
  ).sort((left, right) => left.localeCompare(right));
}

const identifierPattern = /^[A-Za-z_$][\w$]*$/;

const parseImportedNames = (clause: string): string[] =>
  clause
    .replaceAll(/[{}]/g, '')
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)
    .map(
      part =>
        part
          .split(/\s+as\s+/)
          .pop()
          ?.trim() ?? ''
    );

/**
 * The fixture an esbuild run measures. Re-exporting the imported bindings keeps
 * them live, so tree-shaking cannot reduce the measurement to an empty file.
 */
export function buildFixtureSource(options: { entryPath: string; importClause: string | null }): string {
  const specifier = options.entryPath.replaceAll('\\', '/');

  if (options.importClause === null) {
    return `import * as __barrel from ${JSON.stringify(specifier)};\nexport default __barrel;\n`;
  }

  const names = parseImportedNames(options.importClause);
  const invalid = names.filter(name => !identifierPattern.test(name));

  if (names.length === 0 || invalid.length > 0) {
    throw new Error(`size budget: "${options.importClause}" is not a valid named import clause.`);
  }

  return `import { ${options.importClause.replaceAll(/[{}]/g, '').trim()} } from ${JSON.stringify(specifier)};\nexport { ${names.join(', ')} };\n`;
}

const compareGrowth = (options: { bytes: number; ratio: number; thresholds: SizeDeltaThresholds }): SizeStatus => {
  if (options.bytes <= 0) {
    return 'ok';
  }

  if (options.ratio > options.thresholds.failRatio && options.bytes > options.thresholds.failBytes) {
    return 'fail';
  }

  if (options.ratio > options.thresholds.warnRatio && options.bytes > options.thresholds.warnBytes) {
    return 'warn';
  }

  return 'ok';
};

const evaluateBudget = (measurement: SizeMeasurement): { notes: string[]; status: SizeStatus } => {
  const breaches = Object.entries(measurement.budget).flatMap(([metric, limit]) => {
    const current = isSizeMetric(metric) ? measurement.metrics[metric] : undefined;

    if (current === undefined || limit === undefined || current <= limit) {
      return [];
    }

    return [
      `${metric} ${formatBytes(current)} is over budget ${formatBytes(limit)} (+${formatPercent((current - limit) / limit)})`
    ];
  });

  return { notes: breaches, status: breaches.length > 0 ? 'fail' : 'ok' };
};

const evaluateDeltas = (options: {
  baseline: SizeMetrics | null;
  compare: boolean;
  measurement: SizeMeasurement;
  thresholds: SizeDeltaThresholds;
}): SizeMetricDelta[] => {
  if (!options.compare || !options.baseline) {
    return [];
  }

  const baseline = options.baseline;

  return sizeMetrics.flatMap(metric => {
    const current = options.measurement.metrics[metric];
    const previous = baseline[metric];

    if (current === undefined || previous === undefined || previous === 0) {
      return [];
    }

    const bytes = current - previous;
    const ratio = bytes / previous;

    return [
      {
        baseline: previous,
        bytes,
        current,
        metric,
        ratio,
        status: compareGrowth({ bytes, ratio, thresholds: options.thresholds })
      }
    ];
  });
};

const worstStatus = (statuses: readonly SizeStatus[]): SizeStatus => {
  if (statuses.includes('fail')) {
    return 'fail';
  }

  if (statuses.includes('warn')) {
    return 'warn';
  }

  return statuses.length > 0 ? 'ok' : 'skip';
};

export function evaluateSizeCheck(options: {
  baseline: SizeMetrics | null;
  compareBaseline: boolean;
  measurement: SizeMeasurement;
  thresholds: SizeDeltaThresholds;
}): SizeCheckVerdict {
  const budget = evaluateBudget(options.measurement);
  const deltas = evaluateDeltas({
    baseline: options.baseline,
    compare: options.compareBaseline,
    measurement: options.measurement,
    thresholds: options.thresholds
  });
  const notes = [...budget.notes, ...deltas.filter(delta => delta.status !== 'ok').map(describeDelta)];
  const status = worstStatus([budget.status, ...deltas.map(delta => delta.status)]);

  if (options.measurement.gate || status !== 'fail') {
    return { ...options.measurement, deltas, notes, status };
  }

  return {
    ...options.measurement,
    deltas,
    notes: [...notes, 'informational check (gate: false) — reported only'],
    status: 'warn'
  };
}

const describeDelta = (delta: SizeMetricDelta): string =>
  `${delta.metric} ${formatSignedBytes(delta.bytes)} (${formatSignedPercent(delta.ratio)})`;

export function summarizeVerdicts(verdicts: readonly SizeCheckVerdict[]): SizeSummary {
  const count = (status: SizeStatus): number => verdicts.filter(verdict => verdict.status === status).length;

  return { fail: count('fail'), ok: count('ok'), skip: count('skip'), warn: count('warn') };
}

/** Primary metric for the headline table: transfer-facing bytes per check kind. */
export function primaryMetric(verdict: SizeCheckVerdict): SizeMetric | null {
  const preferred: readonly SizeMetric[] =
    verdict.kind === 'bundle' ? ['brotli', 'gzip', 'raw'] : ['gzip', 'raw', 'brotli'];

  return preferred.find(metric => verdict.metrics[metric] !== undefined) ?? null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function formatSignedBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  return `${bytes > 0 ? '+' : '-'}${formatBytes(Math.abs(bytes))}`;
}

export function formatSignedPercent(ratio: number): string {
  if (ratio === 0) {
    return '0%';
  }

  return `${ratio > 0 ? '+' : '-'}${formatPercent(Math.abs(ratio))}`;
}

export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

const statusBadge = (status: SizeStatus): string => ({ fail: '❌', ok: '✅', skip: '➖', warn: '⚠️' })[status];

const metricLabel = (verdict: SizeCheckVerdict): string => {
  const metric = primaryMetric(verdict);

  if (!metric) {
    return 'n/a';
  }

  return `${metric} ${formatBytes(verdict.metrics[metric] ?? 0)}`;
};

const deltaLabel = (verdict: SizeCheckVerdict): string => {
  const metric = primaryMetric(verdict);
  const delta = verdict.deltas.find(entry => entry.metric === metric);

  if (!delta) {
    return '—';
  }

  return `${formatSignedBytes(delta.bytes)} (${formatSignedPercent(delta.ratio)})`;
};

const budgetLabel = (verdict: SizeCheckVerdict): string => {
  const metric = primaryMetric(verdict);
  const budget = metric ? verdict.budget[metric] : undefined;

  return budget === undefined ? '—' : formatBytes(budget);
};

const markdownDetailTable = (verdict: SizeCheckVerdict): string[] => {
  const rows = sizeMetrics
    .filter(metric => verdict.metrics[metric] !== undefined)
    .map(metric => {
      const current = verdict.metrics[metric] ?? 0;
      const budget = verdict.budget[metric];
      const delta = verdict.deltas.find(entry => entry.metric === metric);

      return `| ${metric} | ${formatBytes(current)} | ${delta ? `${formatSignedBytes(delta.bytes)} (${formatSignedPercent(delta.ratio)})` : '—'} | ${budget === undefined ? '—' : formatBytes(budget)} |`;
    });

  return [
    `<details><summary>${verdict.id} — all metrics</summary>`,
    '',
    '| Metric | Size | Δ vs baseline | Budget |',
    '| --- | ---: | ---: | ---: |',
    ...rows,
    '',
    '</details>'
  ];
};

export function renderMarkdownReport(report: SizeReport): string {
  const { fail, ok, skip, warn } = report.summary;
  const lines = [
    '## 📦 Bundle size',
    '',
    `\`✅ ${ok} ok\` · \`⚠️ ${warn} warn\` · \`❌ ${fail} fail\`${skip > 0 ? ` · \`➖ ${skip} skip\`` : ''}`,
    '',
    '| Check | Size | Δ vs baseline | Budget | |',
    '| --- | ---: | ---: | ---: | :-: |',
    ...report.checks.map(
      verdict =>
        `| \`${verdict.id}\`${verdict.gate ? '' : ' *(info)*'} | ${metricLabel(verdict)} | ${deltaLabel(verdict)} | ${budgetLabel(verdict)} | ${statusBadge(verdict.status)} |`
    ),
    '',
    ...report.checks
      .filter(verdict => verdict.notes.length > 0)
      .flatMap(verdict => [`**\`${verdict.id}\`** — ${verdict.notes.join('; ')}`, '']),
    ...report.checks.flatMap(verdict => [...markdownDetailTable(verdict), '']),
    `<sub>baseline: ${report.baseline ? `${report.baseline.path}${report.baseline.comparable ? '' : ' (engine differs — deltas shown for information only)'}` : 'unavailable (budgets only)'} · engine: ${report.engine.bundler} ${report.engine.version || 'unknown'} · warn > ${formatPercent(report.delta.warnRatio)} and > ${formatBytes(report.delta.warnBytes)} · measured on ${report.node}</sub>`
  ];

  return `${lines.join('\n')}\n`;
}

export function renderConsoleReport(report: SizeReport): string {
  const rows = report.checks.map(verdict => [
    `${statusBadge(verdict.status)} ${verdict.id}${verdict.gate ? '' : ' (info)'}`,
    metricLabel(verdict),
    deltaLabel(verdict),
    budgetLabel(verdict)
  ]);
  const widths = [0, 1, 2, 3].map(column =>
    Math.max(...rows.map(row => row[column].length), ['Check', 'Size', 'Δ vs baseline', 'Budget'][column].length)
  );
  const formatRow = (row: readonly string[]): string =>
    row.map((cell, column) => (column === 0 ? cell.padEnd(widths[column]) : cell.padStart(widths[column]))).join('  ');

  return [
    formatRow(['Check', 'Size', 'Δ vs baseline', 'Budget']),
    widths.map(width => '-'.repeat(width)).join('  '),
    ...rows.map(formatRow)
  ].join('\n');
}

/** Read the metrics out of a previously written report, so it doubles as a baseline. */
export function extractBaseline(value: unknown): {
  checks: Map<string, SizeMetrics>;
  generatedAt: string | null;
  engine: Partial<SizeEngineFingerprint>;
} {
  if (!isRecord(value) || !Array.isArray(value.checks)) {
    return { checks: new Map(), engine: {}, generatedAt: null };
  }

  const checks = new Map<string, SizeMetrics>(
    value.checks.flatMap(entry => {
      if (!isRecord(entry) || typeof entry.id !== 'string' || !isRecord(entry.metrics)) {
        return [];
      }

      const metrics = Object.fromEntries(
        Object.entries(entry.metrics).filter(
          (pair): pair is [SizeMetric, number] => isSizeMetric(pair[0]) && typeof pair[1] === 'number'
        )
      );

      return [[entry.id, metrics] as const];
    })
  );
  const engine = isRecord(value.engine) ? value.engine : {};

  return {
    checks,
    engine: {
      bundler: typeof engine.bundler === 'string' ? engine.bundler : undefined,
      external: Array.isArray(engine.external)
        ? engine.external.filter((item): item is string => typeof item === 'string')
        : undefined,
      version: typeof engine.version === 'string' ? engine.version : undefined
    },
    generatedAt: typeof value.generatedAt === 'string' ? value.generatedAt : null
  };
}

export function isBaselineComparable(options: {
  baselineEngine: Partial<SizeEngineFingerprint>;
  engine: SizeEngineFingerprint;
}): boolean {
  const { baselineEngine, engine } = options;

  return baselineEngine.bundler === engine.bundler && (baselineEngine.version ?? '') === engine.version;
}
