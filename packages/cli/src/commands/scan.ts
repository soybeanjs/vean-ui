/**
 * `vean scan` — auto-generate registry.json from the component source tree.
 *
 * Scans `${UI_SOURCE_PATH}/components/` and produces a registry.json with:
 *   - name, type, files (auto-detected)
 *   - dependencies (npm packages extracted from imports)
 *   - registryDependencies (cross-component imports)
 *   - description, categories (preserved from existing registry.json if available)
 */
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import * as v from 'valibot';
import { Command } from 'commander';
import { UI_SOURCE_PATH } from '../registry/constants';
import { registrySchema } from '../registry/schema';
import type { Registry, RegistryItem, RegistryItemFile } from '../registry/schema';

export const scanOptionsSchema = v.object({
  cwd: v.string(),
  output: v.string(),
  package: v.optional(v.string()),
  merge: v.optional(v.boolean(), true)
});

/** Packages that should NEVER appear in the generated dependencies list. */
const IGNORE_PACKAGES = new Set([
  'vue',
  '@vue/runtime-core',
  '@vue/runtime-dom',
  '@vue/compiler-sfc',
  'typescript',
  'vite',
  'unocss',
  '@unocss/core',
  '@vean/unocss'
]);

export const scan = new Command()
  .name('scan')
  .description('scan the component source tree and generate registry.json')
  .option('-c, --cwd <cwd>', 'workspace root', process.cwd())
  .option('-o, --output <path>', 'output path for registry.json', 'registry.json')
  .option('-p, --package <name>', 'package namespace for generated items (default: ui)', 'ui')
  .option('--no-merge', 'do not merge with existing registry.json (overwrite)')
  .action(async opts => {
    const options = v.parse(scanOptionsSchema, {
      cwd: path.resolve(opts.cwd),
      output: opts.output,
      package: opts.package,
      merge: opts.merge
    });

    // Namespace prefix for generated items — the scanned source tree belongs
    // to one package (defaults to the core `ui` package, EC-E02).
    const pkg = options.package || 'ui';

    const componentsDir = path.join(options.cwd, `${UI_SOURCE_PATH}/components`);

    try {
      await fs.access(componentsDir);
    } catch {
      console.error(`Components directory not found: ${componentsDir}`);
      process.exit(1);
    }

    // Load existing registry (for descriptions, categories, etc.)
    let existingMap = new Map<string, RegistryItem>();
    let existingPackages: Registry['packages'];
    if (options.merge) {
      try {
        const existingRaw = JSON.parse(await fs.readFile(path.resolve(options.cwd, options.output), 'utf-8'));
        const existing = v.parse(registrySchema, existingRaw);
        existingPackages = existing.packages;
        for (const item of existing.items) {
          existingMap.set(item.name, item);
        }
      } catch {
        // No existing registry — start fresh
      }
    }

    // Scan components
    const entries = await fs.readdir(componentsDir, { withFileTypes: true });
    const dirs = entries.filter(
      e => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'AGENTS.md' && e.name !== 'CLAUDE.md'
    );

    const items: RegistryItem[] = [];
    const allComponentNames = new Set(dirs.map(d => d.name));

    for (const dir of dirs) {
      const componentDir = path.join(componentsDir, dir.name);
      const files = await scanFiles(componentDir);

      if (files.length === 0) continue;

      const filePaths = files.map(f => path.relative(options.cwd, f));

      // Read file contents for import analysis
      const fileContents: RegistryItemFile[] = [];
      for (const fp of files) {
        const relPath = path.relative(options.cwd, fp);
        try {
          const content = await fs.readFile(fp, 'utf-8');
          fileContents.push({ path: relPath, type: inferFileType(relPath), content });
        } catch {
          fileContents.push({ path: relPath, type: inferFileType(relPath) });
        }
      }

      // Extract dependencies
      const { externalDeps, registryDeps } = extractDependencies(
        fileContents,
        options.cwd,
        dir.name,
        allComponentNames
      );

      // Merge with existing (namespaced item name — EC-E02)
      const itemName = `${pkg}/${dir.name}`;
      const existing = existingMap.get(itemName);

      // Merge external dependencies: keep existing + add new (avoid losing hand-curated deps)
      const mergedDeps = mergeStringArrays(existing?.dependencies, externalDeps);
      const mergedRegistryDeps = mergeStringArrays(
        existing?.registryDependencies,
        registryDeps.map(dep => `${pkg}/${dep}`)
      );

      const item = {
        name: itemName,
        package: pkg,
        type: existing?.type ?? 'registry:ui',
        description: existing?.description,
        categories: existing?.categories,
        dependencies: mergedDeps.length > 0 ? mergedDeps : existing?.dependencies,
        registryDependencies: mergedRegistryDeps.length > 0 ? mergedRegistryDeps : existing?.registryDependencies,
        files: filePaths.map(fp => ({
          path: fp,
          type: existing?.files?.find(f => f.path === fp)?.type ?? inferFileType(fp)
        })),
        meta: existing?.meta,
        docs: existing?.docs,
        deprecated: existing?.deprecated,
        cssVars: existing?.cssVars,
        css: existing?.css,
        uno: existing?.uno,
        tags: existing?.tags,
        keywords: existing?.keywords
      } satisfies Partial<RegistryItem>;

      items.push(item as RegistryItem);
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    // Build registry
    const registry = {
      name:
        existingMap.size > 0
          ? ((JSON.parse(await fs.readFile(path.resolve(options.cwd, options.output), 'utf-8')) as any).name ?? 'vean')
          : 'vean',
      homepage: 'https://veanui.com',
      packages: existingPackages,
      items
    };

    // Validate
    v.parse(registrySchema, registry);

    // Write
    const outputPath = path.resolve(options.cwd, options.output);
    await fs.writeFile(outputPath, JSON.stringify(registry, null, 2), 'utf-8');

    console.log(`✔ Scanned ${items.length} components → ${options.output}`);
    console.log(
      `  ${items.filter(i => !existingMap.has(i.name)).length} new, ${items.filter(i => existingMap.has(i.name)).length} updated`
    );
  });

// ---------------------------------------------------------------------------
// Scanner helpers
// ---------------------------------------------------------------------------

async function scanFiles(dir: string): Promise<string[]> {
  const result: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await scanFiles(fullPath);
      result.push(...nested);
    } else if (
      entry.isFile() &&
      // Supported file types: vue SFCs, TypeScript/JS (incl. JSX/TSX, ESM/CJS variants),
      // CSS and preprocessors, JSON data files. Exclude .d.ts declaration files.
      /\.(?:vue|tsx?|jsx?|m[tj]s|cjs|css|s[ac]ss|less|json)$/.test(entry.name) &&
      !entry.name.endsWith('.d.ts')
    ) {
      result.push(fullPath);
    }
  }

  return result;
}

function inferFileType(filePath: string): RegistryItemFile['type'] {
  const normalized = filePath.replace(/\\/g, '/');

  if (/\.(css|scss|sass|less)$/.test(normalized)) return 'registry:style';
  if (normalized.includes('/styles/')) return 'registry:style';
  if (normalized.includes('/theme/')) return 'registry:theme';
  if (/\.(vue|tsx|jsx)$/.test(normalized)) return 'registry:ui';
  return 'registry:lib';
}

function extractImportSpecifiers(source: string): string[] {
  const staticMatches = source.matchAll(/(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g);
  const dynamicMatches = source.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g);
  return [...staticMatches, ...dynamicMatches].map(m => m[1]);
}

function extractDependencies(
  files: RegistryItemFile[],
  rootDir: string,
  componentName: string,
  allComponents: Set<string>
): { externalDeps: string[]; registryDeps: string[] } {
  const external = new Set<string>();
  const registry = new Set<string>();

  for (const file of files) {
    if (!file.content) continue;

    const specs = extractImportSpecifiers(file.content);

    for (const spec of specs) {
      if (spec.startsWith('.')) {
        // Relative import — check if it points to another component
        const dep = resolveRegistryDep(file.path, spec, rootDir, componentName, allComponents);
        if (dep && isComponentEntryImport(file.path, spec, rootDir)) {
          registry.add(dep);
        }
      } else if (!spec.startsWith('@/') && !spec.startsWith('node:')) {
        // External package
        const pkgName = extractPackageName(spec);
        if (pkgName && !IGNORE_PACKAGES.has(pkgName) && !pkgName.startsWith('@types/')) {
          external.add(pkgName);
        }
      }
    }
  }

  // Remove self-reference
  registry.delete(componentName);

  return {
    externalDeps: [...external].sort(),
    registryDeps: [...registry].sort()
  };
}

function resolveRegistryDep(
  filePath: string,
  specifier: string,
  rootDir: string,
  ownComponent: string,
  allComponents: Set<string>
): string | null {
  // Resolve the relative import to a posix-normalized path
  const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(filePath.replace(/\\/g, '/')), specifier));

  // Check if it goes through /components/<name>/
  const componentsMarker = '/components/';
  const idx = normalized.indexOf(componentsMarker);
  if (idx < 0) return null;

  const after = normalized.slice(idx + componentsMarker.length);
  const [depName] = after.split('/');
  if (!depName || depName === ownComponent) return null;
  if (!allComponents.has(depName)) return null;

  return depName;
}

/**
 * Resolve a relative import specifier to the actual file on disk.
 * Returns the resolved absolute path, or null if not found.
 */
function resolveActualFile(filePath: string, specifier: string, rootDir: string): string | null {
  const absDir = path.resolve(rootDir, path.dirname(filePath));
  const resolved = path.resolve(absDir, specifier);

  const candidates = [
    `${resolved}.ts`,
    `${resolved}.vue`,
    `${resolved}.js`,
    path.join(resolved, 'index.ts'),
    path.join(resolved, 'index.vue'),
    path.join(resolved, 'index.js'),
    resolved
  ];

  return candidates.find(c => existsSync(c)) ?? null;
}

/**
 * Check whether a relative cross-component import should create a registry
 * dependency.  Only .vue files and index.ts (barrel) count as "real" component
 * dependencies — other .ts files (context.ts, types.ts, hooks.ts, …) are utility
 * imports that file-level expansion handles on its own.
 */
function isComponentEntryImport(filePath: string, specifier: string, rootDir: string): boolean {
  const actualFile = resolveActualFile(filePath, specifier, rootDir);
  if (!actualFile) return false;

  const normalized = actualFile.replace(/\\/g, '/');
  return normalized.endsWith('.vue') || normalized.endsWith('/index.ts');
}

function extractPackageName(specifier: string): string | null {
  // Scoped package: @scope/name
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    return null;
  }
  // Regular package: name
  const parts = specifier.split('/');
  return parts[0] || null;
}

function mergeStringArrays(existing: string[] | undefined, scanned: string[]): string[] {
  if (!existing) return scanned;
  const set = new Set(existing);
  for (const item of scanned) set.add(item);
  return [...set].sort();
}
