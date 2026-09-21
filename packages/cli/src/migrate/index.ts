/**
 * `vean migrate` — project migrations for Vean releases.
 *
 * One migration ships today (`rebrand`, the SoybeanUI → Vean rename). The
 * registry shape exists so a later breaking change can add an entry without
 * reshaping the command.
 */
import { rebrandManualSteps, rebrandSuggestions, runRebrandMigration } from './rebrand';
import type { MigrateSuggestion, RebrandMigrateOptions, RebrandMigrateReport } from './rebrand';

export const MIGRATION_IDS = ['rebrand'] as const;

export type MigrationId = (typeof MIGRATION_IDS)[number];

export const DEFAULT_MIGRATION_ID: MigrationId = 'rebrand';

export interface MigrationInfo {
  id: MigrationId;
  /** Short title, shown in `vean migrate --help`. */
  title: string;
  /** Which rewrites the migration performs. */
  description: string;
}

export const MIGRATIONS: readonly MigrationInfo[] = [
  {
    id: 'rebrand',
    title: 'SoybeanUI → Vean',
    description:
      'Rewrites @soybeanjs/* specifiers to @vean/*, plus opt-in runtime contracts (--runtime-contract), CLI references (--cli) and hostnames (--new-domain).'
  }
];

export function isMigrationId(value: string): value is MigrationId {
  return MIGRATION_IDS.some(id => id === value);
}

/**
 * Run a migration. Every migration currently takes the rebrand option set;
 * a migration with its own options would widen this signature.
 */
export async function runMigration(id: MigrationId, options: RebrandMigrateOptions): Promise<RebrandMigrateReport> {
  switch (id) {
    case 'rebrand':
      return runRebrandMigration(options);
  }
}

/** Manual steps for a migration, derived from what the run actually found. */
export function migrationManualSteps(
  id: MigrationId,
  options: RebrandMigrateOptions,
  report: RebrandMigrateReport
): string[] {
  switch (id) {
    case 'rebrand':
      return rebrandManualSteps(options, report);
  }
}

/** Opt-in flags the project's own content argues for. */
export function migrationSuggestions(
  id: MigrationId,
  options: RebrandMigrateOptions,
  report: RebrandMigrateReport
): MigrateSuggestion[] {
  switch (id) {
    case 'rebrand':
      return rebrandSuggestions(options, report);
  }
}

export { normalizeHostname, normalizeRepoSlug } from './rules';
export { previewDiff, truncateLine } from './preview';
export type { MigrateRuleHit, MigrateRuleOptions } from './rules';
export type { ProjectSignals, TierMarkers } from './detect';
export type {
  ConfigRenameOutcome,
  MigrateRefusal,
  MigrateSuggestion,
  MigratedFile,
  RebrandMigrateOptions,
  RebrandMigrateReport
} from './rebrand';
