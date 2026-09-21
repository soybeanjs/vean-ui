import { readFileSync } from 'node:fs';
import { cac } from 'cac';
import type { CAC } from 'cac';
import { resolveTranslateOptions } from './shared/translate';
import type { TranslateOptionInput } from './shared/translate';
import type { CatalogTarget } from './commands/catalog';

/**
 * `sui` — Vean repo service CLI (private, never published).
 *
 * Three command groups: `gen` (deterministic, offline), `translate`
 * (DeepL-backed, needs DEEPL_API_KEY), and `check` (verification gates that
 * exit 1 on drift), plus one-off workspace commands (`size`, `stub`,
 * `reorder-imports`, `sync-template-versions`). `size` measures published
 * artifact and consumer-import bytes; `check size` is the same measurement as a
 * gate. Do not merge with the consumer-facing `vean` CLI.
 *
 * Commands are declared here, not hand-dispatched: each action receives parsed
 * options, so no command re-parses `process.argv`, and `--help` / `--version` /
 * unknown-option / missing-argument handling all come from one place.
 *
 * ADR-008 — schema generation lives in the @vean/cli package (closer to the valibot
 * schemas it converts) and is imported directly so `gen schema` reuses the same
 * generator as `pnpm --filter @vean/cli build:schema`.
 */
function readVersion(): string {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
    version?: string;
  };

  return manifest.version ?? '0.0.0';
}

function toCatalogTarget(value: string | undefined): CatalogTarget | null {
  return value === 'aria' || value === 'ui' ? value : null;
}

export function createCli(): CAC {
  const cli = cac('sui');

  cli.usage('<command> [options]');
  cli.example('pnpm sui gen all');
  cli.example('pnpm sui translate api --locale zh-CN');
  cli.example('pnpm sui check generated');
  cli.example('pnpm sui check size');

  cli
    .command('gen <surface> [name]', 'Generate committed artifacts (deterministic, offline)')
    .usage('gen <catalog|api|figma|changelog|schema|skills|all> [name] [--force]')
    .option('--force', 'Regenerate even when the api fingerprint still matches')
    .action(async (surface: string, name: string | undefined, options: { force?: boolean }) => {
      const catalogTarget = toCatalogTarget(name);

      if (name && !catalogTarget) {
        throw new Error(`Unknown catalog target: ${name}. Expected aria | ui.`);
      }

      const { resolveGenTargets, runGenTarget } = await import('./commands/gen');

      for (const target of resolveGenTargets(surface)) {
        await runGenTarget(target, { force: Boolean(options.force), catalogTarget });
      }
    });

  cli
    .command('translate <surface>', 'Fill pending locale entries through DeepL (needs DEEPL_API_KEY)')
    .usage('translate <api|changelog|locale|all> [options]')
    .option('--locale <locale>', 'Single target locale, for example zh-CN. Default: every non-source locale')
    .option('--source-locale <locale>', 'Source locale file, default: en')
    .option('--batch-size <number>', 'Entries per translation request, default: 20')
    .option('--limit <number>', 'Only translate the first N pending entries')
    .option('--overwrite', 'Re-translate entries that already have a target value')
    .option('--dry-run', 'Report pending counts without writing files or calling the API')
    .action(async (surface: string, options: TranslateOptionInput) => {
      const { runTranslate } = await import('./commands/translate');

      await runTranslate(surface, resolveTranslateOptions(options));
    });

  cli
    .command('check <target>', 'Verification gates; exits 1 when the repository is not release-ready')
    .usage('check <generated|deps|size|all>')
    .action(async (target: string) => {
      const { runCheck } = await import('./commands/check');

      await runCheck(target);
    });

  cli
    .command('size', 'Measure published artifact and consumer-import sizes')
    .option('--budget <file>', 'Budget file, default: size-budget.json')
    .option('--baseline <file>', 'Report to compare against, default: .size-cache/size-baseline.json')
    .option('--report-dir <dir>', 'Where size-report.{json,md} are written, default: .size-report')
    .option('--no-write', 'Measure and print without writing report files')
    .action(async (options: { baseline?: string; budget?: string; reportDir?: string; write?: boolean }) => {
      const { runSize } = await import('./commands/size');

      await runSize({
        baselinePath: options.baseline,
        budgetPath: options.budget,
        reportDir: options.reportDir,
        write: options.write
      });
    });

  cli
    .command('stub', 'Switch aria development exports between src and dist')
    .option('--reset', 'Restore the published dist exports')
    .action(async (options: { reset?: boolean }) => {
      const { runStub } = await import('./commands/stub');

      await runStub({ reset: Boolean(options.reset) });
    });

  cli
    .command('reorder-imports [...paths]', 'Reorder Props before Emits in .vue import type blocks')
    .option('--check', 'Report only; exit 1 when files drift')
    .action(async (paths: string[], options: { check?: boolean }) => {
      const { runReorderImports } = await import('./commands/reorder-imports');

      await runReorderImports({ check: Boolean(options.check), targets: paths });
    });

  cli
    .command('sync-template-versions', 'Sync the @soybeanjs/* version constant in project templates')
    .action(async () => {
      const { runSyncTemplateVersions } = await import('./commands/sync-template-versions');

      await runSyncTemplateVersions();
    });

  cli.help();
  cli.version(readVersion());

  return cli;
}
