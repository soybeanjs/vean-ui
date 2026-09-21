/**
 * `vean migrate rebrand` — rewrite a project from SoybeanUI (`@soybeanjs/*`)
 * to Vean (`@vean/*`).
 *
 * The run is staged: every file is read and rewritten **in memory** first, the
 * preflight then decides whether the project is a SoybeanUI consumer at all, and
 * only with `write` does anything reach the disk. Preview and apply therefore
 * share one code path, and a refused project is never modified.
 */
import fs from 'fs/promises';
import path from 'path';
import {
  CURRENT_CLI_CONFIG,
  EMPTY_MARKERS,
  LEGACY_CLI_CONFIG,
  addMarkers,
  countMarkers,
  readProjectSignals,
  shouldMigrate
} from './detect';
import type { ProjectSignals, TierMarkers } from './detect';
import { PACKAGE_RENAMES, applyRules, buildRules } from './rules';
import type { MigrateRuleHit, MigrateRuleOptions } from './rules';
import { collectTextFiles } from './walk';

export interface RebrandMigrateOptions extends MigrateRuleOptions {
  /** Project root to rewrite. */
  cwd: string;
  /** Apply the changes to disk; without it the run is a preview. */
  write: boolean;
  runtimeContract: boolean;
  cli: boolean;
  /** Migrate even when the project shows no SoybeanUI-era trace. */
  force: boolean;
}

export interface MigratedFile {
  /** Absolute path of the rewritten file. */
  file: string;
  /** Path relative to the migration root, for reports. */
  relative: string;
  before: string;
  after: string;
  hits: MigrateRuleHit[];
}

export interface ConfigRenameOutcome {
  from: string;
  to: string;
  /** `would-rename` is a preview; `target-exists` needs a human decision. */
  status: 'renamed' | 'would-rename' | 'target-exists';
}

export interface MigrateRefusal {
  reason: 'not-soybean-ui-project';
}

export interface RebrandMigrateReport {
  root: string;
  /** Text files considered for rewriting. */
  scannedFiles: number;
  /** Files whose text would change — nothing is written when `refusal` is set. */
  files: MigratedFile[];
  /** Per-rule match totals, highest first. */
  totals: MigrateRuleHit[];
  configRename: ConfigRenameOutcome | null;
  signals: ProjectSignals;
  /** Set when the preflight rejected the project; the project was left untouched. */
  refusal: MigrateRefusal | null;
}

/** A flag the project's own content says is worth adding. */
export interface MigrateSuggestion {
  flag: string;
  detail: string;
}

interface MigrateFileResult {
  migrated: MigratedFile | null;
  markers: TierMarkers;
}

const OPT_IN_TIERS: readonly {
  tier: keyof TierMarkers;
  flag: string;
  enabled: (options: RebrandMigrateOptions) => boolean;
}[] = [
  { tier: 'runtimeContract', flag: '--runtime-contract', enabled: options => options.runtimeContract },
  { tier: 'cli', flag: '--cli', enabled: options => options.cli },
  {
    tier: 'hostnames',
    flag: '--new-domain <host>',
    enabled: options => Boolean(options.newDomain ?? options.newCdn ?? options.repoSlug)
  }
];

const TIER_DETAILS: Readonly<Record<keyof TierMarkers, (count: number, plural: string) => string>> = {
  packages: (count, plural) => `${count} old package specifier${plural} in the project`,
  runtimeContract: (count, plural) => `${count} data-soybean-* / --soybean-* reference${plural} in the project`,
  cli: (count, plural) => `${count} sbean reference${plural} in the project`,
  hostnames: (count, plural) => `${count} old-hostname reference${plural} in the project`
};

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);

    return true;
  } catch {
    return false;
  }
}

async function migrateFile(
  file: string,
  root: string,
  rules: ReturnType<typeof buildRules>
): Promise<MigrateFileResult> {
  let before: string;

  try {
    before = await fs.readFile(file, 'utf8');
  } catch {
    return { migrated: null, markers: EMPTY_MARKERS };
  }

  // Decoded NUL bytes mean the file is not text, whatever its extension says.
  if (before.includes('\u0000')) {
    return { migrated: null, markers: EMPTY_MARKERS };
  }

  const { text: after, hits } = applyRules(before, rules);

  if (after === before) {
    return { migrated: null, markers: countMarkers(before) };
  }

  return {
    migrated: { file, relative: path.relative(root, file) || path.basename(file), before, after, hits },
    markers: countMarkers(before)
  };
}

/** Rename the config file, which no text rule can do; an existing target wins. */
async function planConfigRename(root: string, options: { cli: boolean }): Promise<ConfigRenameOutcome | null> {
  if (!options.cli || !(await exists(path.join(root, LEGACY_CLI_CONFIG)))) {
    return null;
  }

  if (await exists(path.join(root, CURRENT_CLI_CONFIG))) {
    return { from: LEGACY_CLI_CONFIG, to: CURRENT_CLI_CONFIG, status: 'target-exists' };
  }

  return { from: LEGACY_CLI_CONFIG, to: CURRENT_CLI_CONFIG, status: 'would-rename' };
}

function totalHits(files: readonly MigratedFile[]): MigrateRuleHit[] {
  const totals = new Map<string, number>();

  for (const file of files) {
    for (const hit of file.hits) {
      totals.set(hit.id, (totals.get(hit.id) ?? 0) + hit.count);
    }
  }

  return [...totals.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((left, right) => right.count - left.count || left.id.localeCompare(right.id));
}

/** Flags the project's own content argues for, restricted to the tiers that are off. */
export function rebrandSuggestions(options: RebrandMigrateOptions, report: RebrandMigrateReport): MigrateSuggestion[] {
  const suggestions: MigrateSuggestion[] = [];
  const { markers, hasLegacyCliConfig } = report.signals;

  for (const { tier, flag, enabled } of OPT_IN_TIERS) {
    if (enabled(options)) {
      continue;
    }

    const count = markers[tier];
    // A `sbean.json` on disk is a signal of its own, even when no file mentions it.
    const configOnly = tier === 'cli' && count === 0 && hasLegacyCliConfig;

    if (count === 0 && !configOnly) {
      continue;
    }

    suggestions.push({
      flag,
      detail: configOnly
        ? `${LEGACY_CLI_CONFIG} is still present — this renames it to ${CURRENT_CLI_CONFIG}`
        : TIER_DETAILS[tier](count, count === 1 ? '' : 's')
    });
  }

  if (options.cli && !options.write && report.configRename?.status === 'would-rename') {
    suggestions.push({
      flag: '--write',
      detail: `renames ${report.configRename.from} to ${report.configRename.to}`
    });
  }

  return suggestions;
}

/** Manual steps for a migration, derived from what the project actually contains. */
export function rebrandManualSteps(options: RebrandMigrateOptions, report: RebrandMigrateReport): string[] {
  const { signals, totals } = report;
  const applied = new Set(totals.map(total => total.id));
  const steps: string[] = [];

  if (signals.legacyPackages.length > 0) {
    const legacy = signals.legacyPackages;
    const current = legacy.map(name => PACKAGE_RENAMES.find(rename => rename.legacy === name)?.current ?? name);

    steps.push(
      `Swap the declared dependencies and reinstall (lock files are never rewritten): pnpm remove ${legacy.join(' ')} && pnpm add ${current.join(' ')}`
    );
  } else if (signals.markers.packages > 0) {
    steps.push(
      'Update the dependency declarations that own the rewritten imports, then reinstall (lock files are never rewritten)'
    );
  }

  if (applied.has('path:aria-dist-escaped') || applied.has('path:aria-dist')) {
    steps.push('Nuxt: check "modules" uses "@vean/ui/nuxt" and imports.transform.exclude uses /aria\\/dist\\//');
  }

  if (applied.has('pkg:ui-uno')) {
    steps.push('UnoCSS: import the preset from "@vean/unocss" in uno.config.ts');
  }

  if (signals.hasLegacyCliConfig && report.configRename?.status === 'target-exists') {
    steps.push(`Merge ${LEGACY_CLI_CONFIG} into ${CURRENT_CLI_CONFIG} by hand, then delete ${LEGACY_CLI_CONFIG}`);
  }

  if (options.newDomain ?? options.newCdn ?? options.repoSlug) {
    steps.push(
      'DNS + 301: keep the old host serving path-preserving redirects (/r/*, /schema/*, /components/*.md, /llms*.txt) for at least 12 months',
      'CDN: bind the custom domain to the existing bucket — object path prefixes were not rewritten on purpose',
      'SEO: submit the new sitemap and set the canonical host'
    );
  }

  return steps;
}

/**
 * Rewrite the project, honouring preview-by-default and the opt-in tiers. The
 * preflight runs after the scan (its marker counts are part of it) but before any
 * write, so a refused project is left untouched.
 */
export async function runRebrandMigration(options: RebrandMigrateOptions): Promise<RebrandMigrateReport> {
  const rules = buildRules(options);
  const candidates = await collectTextFiles(options.cwd);
  const files: MigratedFile[] = [];
  const pending: { file: string; after: string }[] = [];
  let markers = EMPTY_MARKERS;

  // Sequential on purpose: a migration reads every text file in the project, and
  // holding them all in memory at once buys nothing.
  for (const candidate of candidates) {
    const { migrated, markers: fileMarkers } = await migrateFile(candidate, options.cwd, rules);

    markers = addMarkers(markers, fileMarkers);

    if (migrated) {
      files.push(migrated);
      pending.push({ file: migrated.file, after: migrated.after });
    }
  }

  const signals = await readProjectSignals(options.cwd, markers);
  const refusal: MigrateRefusal | null = shouldMigrate(signals, options) ? null : { reason: 'not-soybean-ui-project' };
  const plannedRename = await planConfigRename(options.cwd, { cli: options.cli });
  const applying = options.write && !refusal;

  if (applying) {
    await Promise.all(pending.map(entry => fs.writeFile(entry.file, entry.after, 'utf8')));

    if (plannedRename?.status === 'would-rename') {
      await fs.rename(path.join(options.cwd, LEGACY_CLI_CONFIG), path.join(options.cwd, CURRENT_CLI_CONFIG));
    }
  }

  return {
    root: options.cwd,
    scannedFiles: candidates.length,
    files,
    totals: totalHits(files),
    configRename:
      applying && plannedRename?.status === 'would-rename' ? { ...plannedRename, status: 'renamed' } : plannedRename,
    signals,
    refusal
  };
}
