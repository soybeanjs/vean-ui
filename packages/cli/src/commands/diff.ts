import fs from 'fs/promises';
import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import { getConfig } from '../utils/get-config';
import { transformImports, transformIcons } from '../utils/transformers/transform-import';
import type { TransformContext } from '../utils/transformers/transform-import';
import { resolveTargetPath } from '../utils/updaters/update-files';
import {
  readRegistryWithIncludes,
  createRegistryItem,
  resolveRegistryItemName,
  getItemPackage
} from '../registry/loader';

export const diffOptionsSchema = v.object({
  component: v.string(),
  cwd: v.string()
});

export const diff = new Command()
  .name('diff')
  .description('show the diff between your local and registry components')
  .argument('<component>', 'component name to diff')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async (component: string, opts) => {
    const options = v.parse(diffOptionsSchema, {
      component,
      cwd: path.resolve(opts.cwd)
    });

    const config = await getConfig(options.cwd);

    if (!config) {
      console.error('No vean.json found. Run "vean init" first.');
      process.exit(1);
    }

    const registryFile = path.join(config.resolvedPaths.cwd, 'registry.json');

    let result;
    try {
      result = await readRegistryWithIncludes(registryFile, {
        cwd: config.resolvedPaths.cwd
      });
    } catch {
      console.error('No registry.json found. Run "vean build" first.');
      process.exit(1);
    }

    // Resolve bare aliases to their namespaced item name (EC-E04).
    const resolvedName = resolveRegistryItemName(options.component, result.registry.items);
    const item = result.registry.items.find(i => i.name === resolvedName);

    if (!item) {
      console.error(`Component "${options.component}" not found in registry.`);
      process.exit(1);
    }

    const rootDir = result.usesInclude ? path.dirname(registryFile) : config.resolvedPaths.cwd;

    const registryItem = await createRegistryItem(item, rootDir);

    if (!registryItem.files?.length) {
      console.log(`Component "${options.component}" has no files to diff.`);
      process.exit(0);
    }

    const transformCtx: TransformContext = {
      uiAlias: '#ui',
      iconLibrary: config.iconLibrary
    };

    console.log();
    console.log(`  Diff: ${options.component}`);
    console.log();

    let hasDiff = false;

    for (const regFile of registryItem.files) {
      if (!regFile.content) {
        console.log(`  ⚠ ${regFile.path}: no content in registry`);
        console.log();
        continue;
      }

      // Resolve the local file path (per-package dir, EC-E03)
      const localPath = resolveTargetPath(regFile, {
        uiDir: config.resolvedPaths.ui,
        packages: config.resolvedPaths.packages,
        package: item.package ?? getItemPackage(item.name)
      });

      // Check if local file exists
      let localContent: string | null = null;
      try {
        localContent = await fs.readFile(localPath, 'utf-8');
      } catch {
        console.log(`  ⊕ ${path.basename(regFile.path)} (new file — not in local project)`);
        console.log();
        hasDiff = true;
        continue;
      }

      // Transform registry content to match user's aliases for comparison
      const transformedRegContent = transformImports(regFile.content, transformCtx);
      const transformedRegContentWithIcons = transformIcons(transformedRegContent, config.iconLibrary);

      // Compare
      if (normalizeContent(transformedRegContentWithIcons) !== normalizeContent(localContent)) {
        hasDiff = true;
        console.log(`  ✗ ${path.basename(regFile.path)} (differs from registry)`);

        // Show a simple line-by-line diff
        const regLines = transformedRegContentWithIcons.split('\n');
        const localLines = localContent.split('\n');
        const maxLines = Math.max(regLines.length, localLines.length);

        let addedCount = 0;
        let removedCount = 0;

        for (let i = 0; i < maxLines; i++) {
          const regLine = regLines[i] ?? '';
          const localLine = localLines[i] ?? '';

          if (regLine !== localLine) {
            if (!localLine) {
              console.log(`    + ${regLine}`);
              addedCount++;
            } else if (!regLine) {
              console.log(`    - ${localLine}`);
              removedCount++;
            } else {
              console.log(`    - ${localLine}`);
              console.log(`    + ${regLine}`);
              removedCount++;
              addedCount++;
            }
          }
        }

        console.log(`    ${addedCount} addition(s), ${removedCount} removal(s)`);
        console.log();
      } else {
        console.log(`  ✔ ${path.basename(regFile.path)} (up to date)`);
        console.log();
      }
    }

    if (!hasDiff) {
      console.log('  ✔ All files up to date with registry.');
    }

    console.log();
  });

/**
 * Normalize content for comparison (trim whitespace).
 */
function normalizeContent(content: string): string {
  return content
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}
