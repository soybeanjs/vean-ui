/**
 * `vean migrate rebrand` — rule engine, preflight, file walk and end-to-end rewrites.
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { countMarkers, legacyPackagesOf, shouldMigrate } from '../src/migrate/detect';
import type { ProjectSignals } from '../src/migrate/detect';
import { previewDiff, truncateLine } from '../src/migrate/preview';
import { rebrandManualSteps, rebrandSuggestions, runRebrandMigration } from '../src/migrate/rebrand';
import type { RebrandMigrateOptions } from '../src/migrate/rebrand';
import { applyRules, buildRules, normalizeHostname, normalizeRepoSlug } from '../src/migrate/rules';
import { collectTextFiles } from '../src/migrate/walk';

let root: string;

async function createProject(files: Record<string, string>): Promise<void> {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'vean-migrate-'));

  for (const [relative, content] of Object.entries(files)) {
    const file = path.join(root, relative);

    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, content, 'utf8');
  }
}

async function readProjectFile(relative: string): Promise<string> {
  return fs.readFile(path.join(root, relative), 'utf8');
}

function options(overrides: Partial<RebrandMigrateOptions> = {}): RebrandMigrateOptions {
  return {
    cwd: root,
    write: false,
    runtimeContract: false,
    cli: false,
    force: false,
    ...overrides
  };
}

function signals(markers: Partial<ProjectSignals['markers']>): ProjectSignals {
  const merged = { packages: 0, runtimeContract: 0, cli: 0, hostnames: 0, ...markers };

  return {
    legacyPackages: [],
    hasLegacyCliConfig: false,
    hasCurrentCliConfig: false,
    markers: merged,
    isLegacyProject: merged.packages > 0 || merged.runtimeContract > 0 || merged.cli > 0
  };
}

beforeEach(() => {
  root = '';
});

afterEach(async () => {
  if (root) {
    await fs.rm(root, { recursive: true, force: true });
  }
});

describe('migrate rules', () => {
  it('rewrites package specifiers without touching sibling packages', () => {
    const source = [
      "import { SButton } from '@soybeanjs/ui';",
      "import { AccordionRoot } from '@soybeanjs/headless/accordion';",
      "import { presetUi } from '@soybeanjs/ui-uno';",
      "import { createTheme } from '@soybeanjs/theme/ssr';",
      "import { skills } from '@soybeanjs/ui-skills';",
      "import { cva } from '@soybeanjs/cva';",
      "import { colord } from '@soybeanjs/colord';"
    ].join('\n');

    const { text, hits } = applyRules(source, buildRules({}));

    expect(text).toContain("from '@vean/ui';");
    expect(text).toContain("from '@vean/aria/accordion';");
    expect(text).toContain("from '@vean/unocss';");
    expect(text).toContain("from '@vean/theme/ssr';");
    expect(text).toContain("from '@vean/skills';");
    expect(text).not.toContain('@vean/ui-uno');
    expect(text).toContain('@soybeanjs/cva');
    expect(text).toContain('@soybeanjs/colord');
    expect(hits.map(hit => hit.id)).toEqual(['pkg:headless', 'pkg:ui-uno', 'pkg:ui-skills', 'pkg:ui', 'pkg:theme']);
  });

  it('leaves removed sibling packages such as @soybeanjs/ui-x alone', () => {
    const { text } = applyRules("import x from '@soybeanjs/ui-x';", buildRules({}));

    expect(text).toBe("import x from '@soybeanjs/ui-x';");
  });

  it('rewrites the Nuxt dist exclusion, escaped and raw', () => {
    const source = 'exclude: [/headless\\/dist\\//], other: "headless/dist/index.js"';
    const { text } = applyRules(source, buildRules({}));

    expect(text).toBe('exclude: [/aria\\/dist\\//], other: "aria/dist/index.js"');
  });

  it('keeps runtime contracts opt-in', () => {
    const source = '<div data-soybean-dialog-content>var(--soybean-layout-height)</div>';

    expect(applyRules(source, buildRules({})).text).toContain('data-soybean-dialog-content');
    expect(applyRules(source, buildRules({ runtimeContract: true })).text).toBe(
      '<div data-vean-dialog-content>var(--vean-layout-height)</div>'
    );
  });

  it('keeps CLI rewrites opt-in and preserves the runner command', () => {
    const source = 'npx sbean add button && pnpm dlx sbean init && cat sbean.json';

    expect(buildRules({}).some(rule => rule.id.startsWith('cli:'))).toBe(false);
    expect(applyRules(source, buildRules({ cli: true })).text).toBe(
      'npx vean add button && pnpm dlx vean init && cat vean.json'
    );
  });

  it('rewrites hostnames only when asked', () => {
    const source = 'https://ui.soybeanjs.cn/r/ui/button.json https://r2.soybeanjs.tech/soybeanjs/logo.svg';

    expect(buildRules({}).some(rule => rule.id.startsWith('domain:'))).toBe(false);
    expect(applyRules(source, buildRules({ newDomain: 'veanui.com' })).text).toBe(
      'https://veanui.com/r/ui/button.json https://assets.veanui.com/soybeanjs/logo.svg'
    );
    expect(applyRules(source, buildRules({ newDomain: 'veanui.com', newCdn: 'cdn.example.com' })).text).toBe(
      'https://veanui.com/r/ui/button.json https://cdn.example.com/soybeanjs/logo.svg'
    );
  });

  it('applies --repo-slug and --new-cdn on their own', () => {
    const repo = 'https://github.com/soybeanjs/soybean-ui/tree/main/docs';
    const cdn = 'https://r2.soybeanjs.tech/soybeanjs/logo.svg';

    expect(applyRules(repo, buildRules({ repoSlug: 'soybeanjs/vean-ui' })).text).toBe(
      'https://github.com/soybeanjs/vean-ui/tree/main/docs'
    );
    expect(applyRules(cdn, buildRules({ newCdn: 'cdn.example.com' })).text).toBe(
      'https://cdn.example.com/soybeanjs/logo.svg'
    );
    expect(applyRules(cdn, buildRules({})).text).toBe(cdn);
  });

  it('normalizes hostnames and repository slugs', () => {
    expect(normalizeHostname('https://veanui.com/')).toBe('veanui.com');
    expect(normalizeHostname('not a host')).toBeNull();
    expect(normalizeRepoSlug('https://github.com/soybeanjs/vean-ui')).toBe('soybeanjs/vean-ui');
    expect(normalizeRepoSlug('soybeanjs')).toBeNull();
  });
});

describe('migrate preflight', () => {
  it('counts the legacy markers in file text', () => {
    const text = [
      "import { SButton } from '@soybeanjs/ui';",
      "import { cva } from '@soybeanjs/cva';",
      '<div data-soybean-dialog-content>',
      'var(--soybean-layout-height)',
      'npx sbean add button',
      'https://ui.soybeanjs.cn/r/ui/button.json'
    ].join('\n');

    expect(countMarkers(text)).toEqual({ packages: 1, runtimeContract: 2, cli: 1, hostnames: 1 });
  });

  it('reads legacy dependencies out of the manifest', () => {
    expect(
      legacyPackagesOf({
        dependencies: { '@soybeanjs/ui': '^0.40.0', vue: '^3.5.0' },
        devDependencies: { '@soybeanjs/headless': '^0.40.0', '@soybeanjs/cva': '^0.0.9' }
      })
    ).toEqual(['@soybeanjs/headless', '@soybeanjs/ui']);
    expect(legacyPackagesOf(null)).toEqual([]);
  });

  it('accepts legacy projects, explicit host rewrites, and --force', () => {
    const hostnameOnly = signals({ hostnames: 2 });

    expect(shouldMigrate(signals({ packages: 1 }), { force: false })).toBe(true);
    expect(shouldMigrate(hostnameOnly, { force: false })).toBe(false);
    expect(shouldMigrate(hostnameOnly, { force: false, newDomain: 'veanui.com' })).toBe(true);
    expect(shouldMigrate(hostnameOnly, { force: false, repoSlug: 'soybeanjs/vean-ui' })).toBe(true);
    expect(shouldMigrate(signals({}), { force: true })).toBe(true);
  });
});

describe('migrate file walk', () => {
  it('collects text files, including dot-directories, and skips the rest', async () => {
    await createProject({
      'package.json': '{}',
      '.github/workflows/ci.yml': 'name: CI',
      'src/App.vue': '<template><div /></template>',
      'assets/logo.svg': '<svg />',
      'empty.ts': '',
      'node_modules/dep/index.js': "import '@soybeanjs/ui';",
      'dist/bundle.js': "import '@soybeanjs/ui';",
      'pnpm-lock.yaml': "'@soybeanjs/ui@0.40.0': {}"
    });

    const files = await collectTextFiles(root);
    const relatives = files.map(file => path.relative(root, file));

    expect(relatives).toEqual(['.github/workflows/ci.yml', 'package.json', 'src/App.vue']);
  });
});

describe('migrate preview', () => {
  it('shows the first differing lines and counts the rest', () => {
    const before = ['a', 'b', 'c', 'd', 'e'].join('\n');
    const after = ['a', 'B', 'c', 'D', 'E'].join('\n');
    const { lines, hidden } = previewDiff(before, after, 2);

    expect(lines).toEqual([
      { line: 2, before: 'b', after: 'B' },
      { line: 4, before: 'd', after: 'D' }
    ]);
    expect(hidden).toBe(1);
  });

  it('clamps long lines and expands tabs', () => {
    expect(truncateLine('\timport x from "y";  ')).toBe('  import x from "y";');
    expect(truncateLine('x'.repeat(200))).toHaveLength(108);
  });
});

describe('runRebrandMigration', () => {
  it('reports changes without writing during a dry run', async () => {
    await createProject({ 'src/main.ts': "import { SButton } from '@soybeanjs/ui';\n" });

    const report = await runRebrandMigration(options());

    expect(report.scannedFiles).toBe(1);
    expect(report.files).toHaveLength(1);
    expect(report.totals).toEqual([{ id: 'pkg:ui', count: 1 }]);
    expect(report.refusal).toBeNull();
    await expect(readProjectFile('src/main.ts')).resolves.toContain('@soybeanjs/ui');
  });

  it('writes changes and stays idempotent', async () => {
    await createProject({ 'src/main.ts': "import { SButton } from '@soybeanjs/ui';\n" });

    await runRebrandMigration(options({ write: true }));

    await expect(readProjectFile('src/main.ts')).resolves.toContain("'@vean/ui'");

    // Nothing left to rewrite — and nothing left to detect either, so the second
    // run reports the project as already migrated instead of silently succeeding.
    const second = await runRebrandMigration(options({ write: true }));

    expect(second.files).toEqual([]);
    expect(second.totals).toEqual([]);
    expect(second.refusal).toEqual({ reason: 'not-soybean-ui-project' });
    await expect(readProjectFile('src/main.ts')).resolves.toBe("import { SButton } from '@vean/ui';\n");
  });

  it('never rewrites lock files, build output or dependencies', async () => {
    await createProject({
      'node_modules/dep/index.js': "import '@soybeanjs/ui';",
      'pnpm-lock.yaml': "'@soybeanjs/ui@0.40.0': {}"
    });

    const report = await runRebrandMigration(options({ write: true }));

    expect(report.scannedFiles).toBe(0);
    await expect(readProjectFile('pnpm-lock.yaml')).resolves.toContain('@soybeanjs/ui');
    await expect(readProjectFile('node_modules/dep/index.js')).resolves.toContain('@soybeanjs/ui');
  });

  it('refuses a project with no SoybeanUI-era trace, and writes nothing', async () => {
    await createProject({ 'src/main.ts': 'export const button = 1;\n' });

    const report = await runRebrandMigration(options({ write: true }));

    expect(report.refusal).toEqual({ reason: 'not-soybean-ui-project' });
    expect(report.signals.isLegacyProject).toBe(false);
    await expect(readProjectFile('src/main.ts')).resolves.toBe('export const button = 1;\n');
  });

  it('refuses a hostname-only project unless that rewrite was requested', async () => {
    await createProject({ 'README.md': 'Docs: https://ui.soybeanjs.cn/r/ui/button.json\n' });

    expect((await runRebrandMigration(options())).refusal).not.toBeNull();
    expect((await runRebrandMigration(options({ newDomain: 'veanui.com' }))).refusal).toBeNull();
    expect((await runRebrandMigration(options({ force: true }))).refusal).toBeNull();
  });

  it('detects a legacy project from package.json alone', async () => {
    await createProject({
      'package.json': '{ "dependencies": { "@soybeanjs/ui": "^0.40.0" } }',
      'src/main.ts': 'export const button = 1;\n'
    });

    const report = await runRebrandMigration(options());

    expect(report.signals.legacyPackages).toEqual(['@soybeanjs/ui']);
    expect(report.signals.isLegacyProject).toBe(true);
    expect(report.refusal).toBeNull();
  });

  it('renames the CLI config file when --cli is used', async () => {
    await createProject({ 'sbean.json': '{ "uiDir": "src/ui" }' });

    const dryRun = await runRebrandMigration(options({ cli: true }));

    expect(dryRun.configRename).toEqual({
      from: 'sbean.json',
      to: 'vean.json',
      status: 'would-rename'
    });
    await expect(readProjectFile('sbean.json')).resolves.toBeDefined();

    const written = await runRebrandMigration(options({ cli: true, write: true }));

    expect(written.configRename?.status).toBe('renamed');
    await expect(readProjectFile('vean.json')).resolves.toContain('src/ui');
  });

  it('keeps an existing vean.json instead of overwriting it', async () => {
    await createProject({
      'sbean.json': '{ "uiDir": "src/legacy" }',
      'vean.json': '{ "uiDir": "src/ui" }'
    });

    const report = await runRebrandMigration(options({ cli: true, write: true }));

    expect(report.configRename).toEqual({
      from: 'sbean.json',
      to: 'vean.json',
      status: 'target-exists'
    });
    expect(report.signals.hasCurrentCliConfig).toBe(true);
    await expect(readProjectFile('sbean.json')).resolves.toBeDefined();
    await expect(readProjectFile('vean.json')).resolves.toContain('src/ui');
  });

  it('leaves the config file alone without --cli', async () => {
    await createProject({ 'sbean.json': '{}' });

    const report = await runRebrandMigration(options({ write: true }));

    expect(report.configRename).toBeNull();
    await expect(readProjectFile('sbean.json')).resolves.toBeDefined();
  });

  it('sorts rule totals by match count', async () => {
    await createProject({
      'src/main.ts': [
        "import { SButton } from '@soybeanjs/ui';",
        "import { SIcon } from '@soybeanjs/ui';",
        "import { createTheme } from '@soybeanjs/theme';"
      ].join('\n')
    });

    const report = await runRebrandMigration(options());

    expect(report.totals[0]).toEqual({ id: 'pkg:ui', count: 2 });
    expect(report.totals[1]).toEqual({ id: 'pkg:theme', count: 1 });
  });
});

describe('rebrandSuggestions', () => {
  it('proposes the opt-in flags the project itself calls for', async () => {
    await createProject({
      'src/main.ts': "import { SButton } from '@soybeanjs/ui';\n",
      'src/styles.css': '[data-soybean-dialog-content] { color: red; }\n',
      'sbean.json': '{}'
    });

    const report = await runRebrandMigration(options());
    const suggestions = rebrandSuggestions(options(), report);

    expect(suggestions.map(suggestion => suggestion.flag)).toEqual(['--runtime-contract', '--cli']);
    expect(suggestions[1].detail).toContain('sbean.json is still present');
  });

  it('proposes --write for a pending config rename', async () => {
    await createProject({ 'sbean.json': '{}' });

    const withCli = options({ cli: true });
    const report = await runRebrandMigration(withCli);

    expect(rebrandSuggestions(withCli, report)).toEqual([
      { flag: '--write', detail: 'renames sbean.json to vean.json' }
    ]);
  });

  it('drops a suggestion once its flag is used', async () => {
    await createProject({
      'src/main.ts': "import { SButton } from '@soybeanjs/ui';\n",
      'src/styles.css': '[data-vean-dialog-content] { color: red; }\n'
    });

    const enabled = options({ runtimeContract: true });
    const report = await runRebrandMigration(enabled);

    expect(rebrandSuggestions(enabled, report)).toEqual([]);
  });
});

describe('rebrandManualSteps', () => {
  it('spells out the dependency swap the manifest actually needs', async () => {
    await createProject({
      'package.json': '{ "dependencies": { "@soybeanjs/ui": "^0.40.0", "@soybeanjs/headless": "^0.40.0" } }',
      'src/main.ts': "import { SButton } from '@soybeanjs/ui';\n"
    });

    const report = await runRebrandMigration(options());

    expect(rebrandManualSteps(options(), report)).toEqual([
      'Swap the declared dependencies and reinstall (lock files are never rewritten): pnpm remove @soybeanjs/headless @soybeanjs/ui && pnpm add @vean/aria @vean/ui'
    ]);
  });

  it('only lists the framework steps the run actually triggered', async () => {
    await createProject({
      'src/main.ts': "import { SButton } from '@soybeanjs/ui';\n",
      'uno.config.ts': "import { presetUi } from '@soybeanjs/ui-uno';\n"
    });

    const report = await runRebrandMigration(options());
    const steps = rebrandManualSteps(options(), report);

    expect(steps.some(step => step.includes('UnoCSS'))).toBe(true);
    expect(steps.some(step => step.includes('Nuxt'))).toBe(false);
    expect(steps.some(step => step.includes('DNS'))).toBe(false);
  });

  it('adds the hostname hand-over steps once a host rewrite is requested', async () => {
    await createProject({ 'README.md': 'Docs: https://ui.soybeanjs.cn/r/ui/button.json\n' });

    const hostnameOptions = options({ newDomain: 'veanui.com' });
    const report = await runRebrandMigration(hostnameOptions);
    const steps = rebrandManualSteps(hostnameOptions, report);

    expect(steps.some(step => step.includes('301'))).toBe(true);
    expect(steps.some(step => step.includes('dependency'))).toBe(false);
  });
});
