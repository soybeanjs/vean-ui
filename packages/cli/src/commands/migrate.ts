import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import {
  DEFAULT_MIGRATION_ID,
  MIGRATIONS,
  MIGRATION_IDS,
  isMigrationId,
  migrationManualSteps,
  migrationSuggestions,
  normalizeHostname,
  normalizeRepoSlug,
  previewDiff,
  runMigration,
  truncateLine
} from '../migrate';
import type { MigrationId, RebrandMigrateOptions, RebrandMigrateReport } from '../migrate';

export const migrateOptionsSchema = v.object({
  migration: v.picklist(MIGRATION_IDS),
  cwd: v.string(),
  write: v.boolean(),
  runtimeContract: v.boolean(),
  cli: v.boolean(),
  newDomain: v.optional(v.string()),
  newCdn: v.optional(v.string()),
  repoSlug: v.optional(v.string()),
  force: v.boolean(),
  quiet: v.boolean()
});

function fail(message: string): never {
  console.error(`\n  ✖ ${message}\n`);
  process.exit(1);
}

function resolveHostname(value: unknown, flag: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const hostname = typeof value === 'string' ? normalizeHostname(value) : null;

  if (!hostname) {
    fail(`${flag} expects a bare hostname such as veanui.com (without protocol, path or trailing slash)`);
  }

  return hostname;
}

function resolveRepoSlug(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const slug = typeof value === 'string' ? normalizeRepoSlug(value) : null;

  if (!slug) {
    fail(`--repo-slug expects owner/repo (got ${JSON.stringify(value)})`);
  }

  return slug;
}

function printConfigRename(report: RebrandMigrateReport): void {
  if (!report.configRename) {
    return;
  }

  const { from, to, status } = report.configRename;
  const outcome =
    status === 'renamed'
      ? `renamed ${from} → ${to}`
      : status === 'would-rename'
        ? `would rename ${from} → ${to}`
        : `${from} kept — merge it into ${to} by hand, then delete ${from}`;

  console.log(`\n  Config:  ${outcome}`);
}

/** What the preflight found, so a refusal explains itself. */
function printSignals(report: RebrandMigrateReport): void {
  const { signals } = report;

  if (signals.legacyPackages.length > 0) {
    console.log(`  Legacy:  ${signals.legacyPackages.join(', ')} (package.json)`);
  }

  if (signals.hasLegacyCliConfig) {
    console.log('  Legacy:  sbean.json');
  }

  if (signals.hasCurrentCliConfig) {
    console.log('  Current: vean.json already present');
  }
}

function printRefusal(report: RebrandMigrateReport): void {
  const { markers } = report.signals;

  console.log('\n  ✖ Nothing to migrate: no SoybeanUI-era trace found.');
  console.log(
    `    Looked for @soybeanjs/* dependencies and specifiers, sbean.json, data-soybean-* / --soybean-* contracts and sbean invocations in ${report.scannedFiles} text file${report.scannedFiles === 1 ? '' : 's'}.`
  );

  if (markers.hostnames > 0) {
    console.log(
      `    Only old hostnames matched (${markers.hostnames} reference${markers.hostnames === 1 ? '' : 's'}).`
    );
  }

  console.log('\n    The project may already be migrated. Check --cwd, or re-run with --force to rewrite it anyway.');
  console.log();
}

function printReport(
  migration: MigrationId,
  report: RebrandMigrateReport,
  options: RebrandMigrateOptions,
  quiet: boolean
): void {
  const mode = report.refusal ? 'nothing written' : options.write ? 'applying changes' : 'preview (nothing written)';

  console.log();
  console.log(`  vean migrate ${migration} · ${mode}`);
  console.log(`  Root:    ${report.root}`);
  console.log(`  Scanned: ${report.scannedFiles} text files`);
  console.log(`  Changed: ${report.files.length} text files`);
  printSignals(report);

  if (report.refusal) {
    printRefusal(report);

    return;
  }

  if (report.files.length === 0) {
    console.log('\n  ✔ Nothing to change — the migration is idempotent.');
  } else if (!quiet) {
    for (const file of report.files) {
      console.log();
      console.log(`  ── ${file.relative}  [${file.hits.map(hit => hit.id).join(', ')}]`);

      const { lines, hidden } = previewDiff(file.before, file.after);

      for (const line of lines) {
        console.log(`     ${String(line.line).padStart(4)} - ${truncateLine(line.before)}`);
        console.log(`          + ${truncateLine(line.after)}`);
      }

      if (hidden > 0) {
        console.log(`          … ${hidden} more change${hidden === 1 ? '' : 's'}`);
      }
    }

    console.log();
    for (const total of report.totals) {
      console.log(`    ${total.id.padEnd(24)} ${total.count}`);
    }
  }

  printConfigRename(report);

  if (report.files.length > 0 && !options.write) {
    console.log('\n  Preview only — re-run with --write to apply.');
  }

  const suggestions = migrationSuggestions(migration, options, report);

  if (suggestions.length > 0) {
    console.log('\n  Worth adding:');
    for (const suggestion of suggestions) {
      console.log(`    · ${suggestion.flag.padEnd(22)} ${suggestion.detail}`);
    }
  }

  const steps = migrationManualSteps(migration, options, report);

  if (steps.length > 0) {
    console.log('\n  Still manual:');
    for (const step of steps) {
      console.log(`    · ${step}`);
    }
  }

  console.log();
}

export const migrate = new Command()
  .name('migrate')
  .description('migrate a SoybeanUI-era project (@soybeanjs/*, sbean CLI) to Vean (@vean/*)')
  .argument('[migration]', `migration to run: ${MIGRATION_IDS.join(' | ')}`, DEFAULT_MIGRATION_ID)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('-w, --write', 'apply the changes (the default is a dry run)', false)
  .option('--runtime-contract', 'also rewrite data-soybean-* attributes and --soybean-* CSS variables', false)
  .option('--cli', 'also rewrite sbean CLI references and rename sbean.json to vean.json', false)
  .option('--new-domain <host>', 'also rewrite ui.soybeanjs.cn to this hostname (CDN default becomes assets.<host>)')
  .option('--new-cdn <host>', 'also rewrite the r2.soybeanjs.tech CDN host to this hostname')
  .option('--repo-slug <owner/repo>', 'also rewrite github.com/soybeanjs/vean-ui')
  .option('-f, --force', 'run even when the project shows no SoybeanUI-era trace', false)
  .option('-q, --quiet', 'print the summary only, without per-file previews', false)
  .addHelpText(
    'after',
    () =>
      `\nMigrations:\n${MIGRATIONS.map(info => `  ${info.id.padEnd(10)} ${info.title}\n             ${info.description}`).join('\n')}\n\nExamples:\n  vean migrate rebrand                        preview the rebrand migration\n  vean migrate rebrand --write                apply it\n  vean migrate rebrand --write --runtime-contract --cli\n  vean migrate rebrand -w --new-domain veanui.com --repo-slug soybeanjs/vean-ui\n`
  )
  .action(async (migration: string, opts) => {
    if (!isMigrationId(migration)) {
      fail(`Unknown migration "${migration}". Available: ${MIGRATION_IDS.join(', ')}`);
    }

    const options = v.parse(migrateOptionsSchema, {
      migration,
      cwd: path.resolve(opts.cwd),
      write: Boolean(opts.write),
      runtimeContract: Boolean(opts.runtimeContract),
      cli: Boolean(opts.cli),
      newDomain: resolveHostname(opts.newDomain, '--new-domain'),
      newCdn: resolveHostname(opts.newCdn, '--new-cdn'),
      repoSlug: resolveRepoSlug(opts.repoSlug),
      force: Boolean(opts.force),
      quiet: Boolean(opts.quiet)
    });

    const report = await runMigration(options.migration, options);

    printReport(options.migration, report, options, options.quiet);

    if (report.refusal) {
      process.exit(1);
    }
  });
