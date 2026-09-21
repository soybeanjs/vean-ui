import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { readSourceFile } from '../shared/ast';
import {
  collectCatalogGroups,
  emitComponentsModule,
  emitNamespacedModule,
  getBarrelComponentDirectories,
  isFamilyExport,
  isStyledExport
} from '../shared/catalog';
import type { CatalogGroup, IsGroupExport } from '../shared/catalog';
import { formatPaths } from '../shared/format';
import {
  hashGenerationInputs,
  hashPathSet,
  readGenerationFingerprint,
  writeGenerationFingerprint
} from '../shared/generation-cache';

export type CatalogTarget = 'aria' | 'ui';

interface CatalogDocument {
  /** output file, relative to the package src dir */
  file: string;
  code: string;
}

interface CatalogTargetConfig {
  /** package src dir that owns the barrel, relative to the repo root */
  srcDir: string;
  isGroupExport: IsGroupExport;
  buildDocuments: (groups: CatalogGroup[]) => CatalogDocument[];
}

const CONFIG: Record<CatalogTarget, CatalogTargetConfig> = {
  aria: {
    srcDir: 'packages/aria/src',
    isGroupExport: isFamilyExport,
    buildDocuments: groups => [
      { file: 'constants/components.ts', code: emitComponentsModule(groups) },
      { file: 'namespaced/index.ts', code: emitNamespacedModule(groups) }
    ]
  },
  ui: {
    srcDir: 'packages/ui/src',
    isGroupExport: isStyledExport,
    buildDocuments: groups => [{ file: 'constants/components.ts', code: emitComponentsModule(groups) }]
  }
};

/** Output-file shapes only (used before groups are known); `code` stays empty. */
const OUTPUT_SHAPES: Record<CatalogTarget, string[]> = {
  aria: ['constants/components.ts', 'namespaced/index.ts'],
  ui: ['constants/components.ts']
};

/**
 * Write only when the content actually differs.
 *
 * A no-op write still bumps the file's mtime, which the dev server's watcher
 * treats as a change: the SSR module runner partially re-evaluates the graph
 * and can leave two live copies of a module with different context symbols
 * (observed as `ThemeConsumer must be used within UiThemeContext` after
 * `sui check generated`). Skipping identical writes keeps `sui gen` /
 * `sui check generated` safe to run against a running dev server.
 */
async function writeFileIfChanged(filePath: string, code: string): Promise<boolean> {
  const existing = await readFile(filePath, 'utf8').catch(() => null);

  if (existing === code) {
    return false;
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, code, 'utf8');

  return true;
}

interface CatalogPassInputs {
  /** output files (absolute) this target owns */
  outputPaths: string[];
  cacheFilePath: string;
  inputHash: string;
}

/**
 * Fingerprint one catalog pass: the barrel plus every component index it
 * feeds in, and the output files it owns. The fingerprint cache lives under
 * `node_modules/.cache/sui` (never committed), like the api/changelog passes.
 */
async function createCatalogPassInputs(target: CatalogTarget, rootDir: string): Promise<CatalogPassInputs> {
  const config = CONFIG[target];
  const srcDir = path.join(rootDir, config.srcDir);
  const barrelPath = path.join(srcDir, 'index.ts');
  const componentDirs = getBarrelComponentDirectories(await readSourceFile(barrelPath));
  const inputPaths = [
    barrelPath,
    ...componentDirs.map(componentDir => path.join(srcDir, 'components', componentDir, 'index.ts'))
  ];

  return {
    outputPaths: OUTPUT_SHAPES[target].map(file => path.join(srcDir, file)),
    cacheFilePath: path.join(rootDir, 'node_modules/.cache/sui', `gen-catalog-${target}.json`),
    inputHash: await hashGenerationInputs(inputPaths, rootDir)
  };
}

/**
 * True when re-running the pass would reproduce the on-disk files byte for
 * byte: recorded inputs unchanged AND output files still matching the last
 * formatted output. A missing/corrupt fingerprint falls back to the full pass.
 */
async function isCatalogPassUpToDate(passInputs: CatalogPassInputs): Promise<boolean> {
  const fingerprint = await readGenerationFingerprint(passInputs.cacheFilePath);

  if (fingerprint?.inputs !== passInputs.inputHash) {
    return false;
  }

  const outputs = await hashPathSet(passInputs.outputPaths, process.cwd());

  return outputs !== null && outputs === fingerprint.outputs;
}

/** Regenerates catalog files from the package barrel. Returns the written file paths. */
export async function generateCatalog(
  target: CatalogTarget,
  rootDir: string = process.cwd(),
  options: { format?: boolean } = {}
): Promise<string[]> {
  const config = CONFIG[target];
  const srcDir = path.join(rootDir, config.srcDir);
  const format = options.format ?? true;
  const passInputs = await createCatalogPassInputs(target, rootDir);

  if (await isCatalogPassUpToDate(passInputs)) {
    return [];
  }

  const groups = await collectCatalogGroups({
    index: await readSourceFile(path.join(srcDir, 'index.ts')),
    readComponentIndex: componentDir => readSourceFile(path.join(srcDir, 'components', componentDir, 'index.ts')),
    isGroupExport: config.isGroupExport
  });
  const documents = config.buildDocuments(groups);

  const written = (
    await Promise.all(
      documents.map(async document => {
        const outputPath = path.join(srcDir, document.file);

        return (await writeFileIfChanged(outputPath, document.code)) ? outputPath : null;
      })
    )
  ).filter(filePath => filePath !== null);

  // Canonicalize with the workspace formatter BEFORE fingerprinting: the
  // stored output hash must describe the final committed bytes, not the raw
  // emission (otherwise every run would see a "changed" file after `vp fmt`).
  // Tests skip the external formatter to stay hermetic; the fingerprint is
  // taken on whatever content the run produced, so skipping stays consistent.
  if (format) {
    await formatPaths(
      passInputs.outputPaths.map(outputPath => path.relative(rootDir, outputPath)),
      { cwd: rootDir }
    );
  }

  const outputs = await hashPathSet(passInputs.outputPaths, rootDir);

  if (outputs !== null) {
    await writeGenerationFingerprint(passInputs.cacheFilePath, { inputs: passInputs.inputHash, outputs });
  }

  return written;
}
