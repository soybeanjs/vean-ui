import path from 'node:path';
import process from 'node:process';
import { docsTargets } from '../shared/docs-targets';
import { formatPaths } from '../shared/format';
import { generateApiData } from './api';
import { generateApiLocaleTemplates } from './api-i18n';
import { generateCatalog } from './catalog';
import type { CatalogTarget } from './catalog';
import { generateChangelogData } from './changelog';
import { generateChangelogLocaleTemplates } from './changelog-i18n';
import { generateFigmaAssets } from './figma';
import { generateSkillsDistribution } from './skills';

/**
 * `sui gen` produces every committed generated surface and never touches the
 * network: translation lives in `sui translate`. Because generation is
 * deterministic (content-aware writes, stable `generatedAt`), `sui check
 * generated` can verify the committed data by regenerating it and diffing.
 */
export type GenTarget = 'catalog' | 'api' | 'figma' | 'changelog' | 'schema' | 'skills';

// `figma` follows `api` because it projects the API data it reads.
const genTargets: GenTarget[] = ['catalog', 'api', 'figma', 'changelog', 'schema', 'skills'];
const catalogTargets: CatalogTarget[] = ['aria', 'ui'];

/**
 * Every committed path the `gen` targets write. `sui check generated` diffs
 * exactly this set, so a new generator must add its outputs here.
 */
export const generatedDataPaths = [
  'packages/aria/src/constants/components.ts',
  'packages/aria/src/namespaced/index.ts',
  'packages/ui/src/constants/components.ts',
  'apps/docs/src/generated',
  'apps/docs/public/figma',
  'apps/docs/public/schema',
  'skills'
];

export function resolveGenTargets(requested: string): GenTarget[] {
  if (requested === 'all') {
    return genTargets;
  }

  const target = genTargets.find(genTarget => genTarget === requested);

  if (!target) {
    throw new Error(
      `Unknown gen target: ${requested}. Expected one of: catalog | api | figma | changelog | schema | skills | all.`
    );
  }

  return [target];
}

function toRelativePath(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}

async function runCatalogGen(catalogTarget: CatalogTarget | null): Promise<void> {
  const targets = catalogTarget ? [catalogTarget] : catalogTargets;

  // `generateCatalog` skips the whole pass (including formatting) when its
  // fingerprint proves the outputs are already current, so an up-to-date repo
  // never has its source files touched — a running dev server must not see
  // mtime-only rewrites of watched modules.
  const outputs = (await Promise.all(targets.map(target => generateCatalog(target)))).flat();

  outputs.forEach(output => {
    console.log(`generated ${toRelativePath(output)}`);
  });
}

async function runApiGen(force: boolean): Promise<void> {
  for (const target of docsTargets) {
    await generateApiData(path.join(target.generatedDir, 'api'), { force });
    await generateApiLocaleTemplates(target);
  }

  await formatPaths(
    docsTargets.flatMap(target => {
      const relative = toRelativePath(target.generatedDir);

      return [`${relative}/api/`, `${relative}/api-locales/`];
    })
  );
}

async function runChangelogGen(): Promise<void> {
  for (const target of docsTargets) {
    await generateChangelogData(path.join(target.generatedDir, 'changelog'), target.contentDir);
    await generateChangelogLocaleTemplates(target);
  }

  await formatPaths(
    docsTargets.flatMap(target => {
      const relative = toRelativePath(target.generatedDir);

      return [`${relative}/changelog/`, `${relative}/changelog-locales/`];
    })
  );
}

async function runFigmaGen(): Promise<void> {
  // `generateFigmaAssets` writes only what changed. The output directory is
  // excluded from the formatter (see the root `vite.config.ts`), so what it
  // writes is what stays on disk and a clean repo is a true no-op.
  const outputs = await generateFigmaAssets();

  outputs.forEach(output => {
    console.log(`generated ${toRelativePath(output)}`);
  });
}

async function runSchemaGen(): Promise<void> {
  const { generateSchemaData } = await import('../../../cli/scripts/schema');

  await generateSchemaData('apps/docs/public/schema');
  await formatPaths(['apps/docs/public/schema/']);
}

async function runSkillsGen(): Promise<void> {
  await generateSkillsDistribution();
  await formatPaths(['skills']);
}

/** Run one generation target. `force` only affects `api`, whose extraction is expensive. */
export async function runGenTarget(
  target: GenTarget,
  options: { force?: boolean; catalogTarget?: CatalogTarget | null } = {}
): Promise<void> {
  switch (target) {
    case 'catalog':
      await runCatalogGen(options.catalogTarget ?? null);
      return;
    case 'api':
      await runApiGen(Boolean(options.force));
      return;
    case 'figma':
      await runFigmaGen();
      return;
    case 'changelog':
      await runChangelogGen();
      return;
    case 'schema':
      await runSchemaGen();
      return;
    default:
      await runSkillsGen();
  }
}

export async function runGenAll(options: { force?: boolean } = {}): Promise<void> {
  for (const target of genTargets) {
    await runGenTarget(target, { force: options.force });
  }
}
