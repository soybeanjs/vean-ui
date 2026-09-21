import { existsSync, statSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { UI_SOURCE_PATH } from '../registry/constants';
import { fetchRegistryItem } from '../registry/fetcher';
import { readRegistryWithIncludes, resolveRegistryItemName, getItemPackage } from '../registry/loader';
import type { RegistryItem, RegistryItemFile } from '../registry/schema';
import type { Config } from './get-config';
import { updateDependencies } from './updaters/update-dependencies';
import { updateFiles } from './updaters/update-files';
import type { UpdateFilesOptions } from './updaters/update-files';

export interface AddComponentsOptions {
  overwrite: boolean;
  path?: string;
  dryRun?: boolean;
  diff?: boolean;
  silent?: boolean;
}

const WRITABLE_FILE_TYPES = new Set(['registry:ui', 'registry:style', 'registry:lib', 'registry:theme']);
const SOURCE_ROOT = findWorkspaceSourceRoot();

/**
 * ADR-006 — A registry item resolved by the BFS phase, ready for the
 * topological-sort + write phase. Carries the transformed name (graph
 * identity, matching the BFS `processed`/`queued` sets), the effective
 * dependency names (transformed, filtered to the resolved set), the source
 * item, and the file-level-expanded files (with barrels included).
 */
export interface ResolvedRegistryItem {
  /** Transformed name — the BFS graph identity (post-namespace resolution). */
  name: string;
  /** Transformed dep names that were actually resolved by the BFS. */
  dependencies: string[];
  item: RegistryItem;
  expandedFiles: RegistryItemFile[];
}

/**
 * ADR-006 — Deterministic topological sort of resolved registry items.
 *
 * Dependencies are emitted before dependents; ties are broken alphabetically
 * by item name so identical `vean add` invocations produce identical write
 * order (and therefore identical diffs). Cyclic nodes (already flagged as
 * invalid by `validateRegistryDependencies`) fall back to alphabetical order
 * at the tail — the sort stays total and deterministic regardless.
 *
 * Pure: no I/O, no shared state. Operates on the in-memory resolved list.
 */
export function topologicallySortItems(items: ResolvedRegistryItem[]): ResolvedRegistryItem[] {
  const byName = new Map(items.map(item => [item.name, item]));
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, Set<string>>();

  for (const item of items) {
    inDegree.set(item.name, 0);
    dependents.set(item.name, new Set());
  }

  for (const item of items) {
    for (const dep of item.dependencies) {
      // Skip self-loops and deps that didn't resolve (missing or unloaded).
      if (dep === item.name || !byName.has(dep)) {
        continue;
      }
      // Edge: dep -> item.name. Dedupe via Set so a multi-referenced dep
      // only counts once toward the dependent's in-degree.
      const dependentsOfDep = dependents.get(dep);
      if (dependentsOfDep && !dependentsOfDep.has(item.name)) {
        dependentsOfDep.add(item.name);
        inDegree.set(item.name, (inDegree.get(item.name) ?? 0) + 1);
      }
    }
  }

  const ordered: string[] = [];
  // Process in waves: each wave is the set of nodes whose in-degree is 0.
  // Within a wave, sort alphabetically for deterministic tiebreaking.
  let wave = items
    .filter(item => (inDegree.get(item.name) ?? 0) === 0)
    .map(item => item.name)
    .sort((a, b) => a.localeCompare(b));

  while (wave.length > 0) {
    ordered.push(...wave);
    const nextWave: string[] = [];
    for (const name of wave) {
      for (const dependent of dependents.get(name) ?? []) {
        const next = (inDegree.get(dependent) ?? 0) - 1;
        inDegree.set(dependent, next);
        if (next === 0) {
          nextWave.push(dependent);
        }
      }
    }
    wave = [...new Set(nextWave)].sort((a, b) => a.localeCompare(b));
  }

  // Cyclic nodes (if any) appended alphabetically — total + deterministic.
  if (ordered.length < items.length) {
    const orderedSet = new Set(ordered);
    const remaining = items
      .map(item => item.name)
      .filter(name => !orderedSet.has(name))
      .sort((a, b) => a.localeCompare(b));
    ordered.push(...remaining);
  }

  return ordered.map(name => byName.get(name)!);
}

/**
 * Add components to a project — the core copy-paste engine.
 *
 * Supports multiple modes:
 * - Normal: write files to disk, install dependencies
 * - dry-run: preview what would be written without modifying files
 * - diff: show differences between existing files and registry
 *
 * First tries the local registry.json, then falls back to remote fetching
 * from https://veanui.com/r/<package>/<component>.json
 * (e.g. https://veanui.com/r/ui/button.json).
 */
export async function addComponents(
  componentNames: string[],
  config: Config,
  options: AddComponentsOptions
): Promise<void> {
  const targetDir = options.path ? path.resolve(config.resolvedPaths.cwd, options.path) : config.resolvedPaths.ui;
  const silent = options.silent ?? false;

  const transformCtx = {
    uiAlias: '#ui',
    iconLibrary: config.iconLibrary
  };

  const updateOpts: UpdateFilesOptions = {
    overwrite: options.overwrite,
    transformCtx,
    dryRun: options.dryRun,
    diff: options.diff,
    silent,
    // EC-E03: per-package output dirs, so admin/chart items land in their
    // own directory instead of the core `src/ui`.
    packages: config.resolvedPaths.packages
  };

  const allDeps: string[] = [];
  const allDevDeps: string[] = [];

  // Try local registry first
  const registryFile = path.join(config.resolvedPaths.cwd, 'registry.json');
  let localItems: RegistryItem[] | null = null;

  try {
    const result = await readRegistryWithIncludes(registryFile, {
      cwd: config.resolvedPaths.cwd
    });
    localItems = result.registry.items;
  } catch {
    // No local registry — will use remote
  }

  let added = 0;
  const addedFiles: string[] = [];
  const resolved: ResolvedRegistryItem[] = [];

  const resolveRegistryDependencyName = (dependencyName: string, item: RegistryItem): string => {
    if (dependencyName.startsWith('@') || dependencyName.includes('/')) {
      return dependencyName;
    }

    // Bare dependency — derive the owning package from the item's `package`
    // field (namespaced registry, EC-E02), falling back to the legacy
    // registryNamespace metadata for remote registries.
    if (typeof item.package === 'string' && item.package) {
      return `${item.package}/${dependencyName}`;
    }

    const registryNamespace = typeof item.meta?.registryNamespace === 'string' ? item.meta.registryNamespace : null;

    if (
      !registryNamespace ||
      registryNamespace === '@vean' ||
      registryNamespace === '@soybean' ||
      registryNamespace === '@sbean'
    ) {
      return dependencyName;
    }

    return `${registryNamespace}/${dependencyName}`;
  };

  const queue = [...componentNames];
  const queued = new Set<string>(componentNames);
  const processed = new Set<string>();

  // Phase 1 — BFS resolution: load items, expand files, queue dependencies.
  // No writes happen here; writes are deferred to Phase 3 so the write
  // order can be topologically sorted (ADR-006) for deterministic diffs.
  while (queue.length > 0) {
    const componentName = queue.shift();

    if (!componentName || processed.has(componentName)) {
      continue;
    }

    const item = await loadRegistryItem(componentName, localItems, config);

    if (!item) {
      if (!silent) {
        console.warn(`  ⚠ Component "${componentName}" not found in local or remote registry.`);
        console.warn(`    Run "vean search" to see available components.`);
      }
      continue;
    }

    // Canonical (namespaced) identity — `loadRegistryItem` resolves bare
    // aliases to their namespaced item name (EC-E04).
    const resolvedName = item.name;
    processed.add(resolvedName);
    queued.add(resolvedName);

    const expandedFiles = item.files?.length ? await expandRegistryItemFiles(item.files) : [];

    // Include barrel index.ts from component source directories
    await includeBarrelFiles(expandedFiles, SOURCE_ROOT);

    // Filter explicit registryDependencies: skip those already covered by
    // file-level expansion (e.g. when only context.ts from a component was
    // pulled, don't re-add the entire component).
    const explicitDeps = (item.registryDependencies ?? []).filter(
      dep => !isDependencyCoveredByFiles(dep, expandedFiles)
    );
    const registryDependencies = [...explicitDeps, ...inferRegistryDependencies(expandedFiles)];

    // Record the transformed dep names for the topological-sort phase. These
    // are filtered to the resolved set after BFS completes (a dep queued
    // here may fail to load and never join the resolved set).
    const transformedDeps = registryDependencies.map(dep => resolveRegistryDependencyName(dep, item));

    resolved.push({
      name: resolvedName,
      dependencies: transformedDeps,
      item,
      expandedFiles
    });

    for (const dependencyName of registryDependencies) {
      const resolvedDependencyName = resolveRegistryDependencyName(dependencyName, item);

      if (processed.has(resolvedDependencyName) || queued.has(resolvedDependencyName)) {
        continue;
      }

      queue.push(resolvedDependencyName);
      queued.add(resolvedDependencyName);
    }
  }

  // Phase 2 — Topological sort (ADR-006). Filter recorded deps to the
  // resolved set first so missing/unloaded deps don't pollute the graph.
  const resolvedNames = new Set(resolved.map(entry => entry.name));
  const resolvedForSort = resolved.map(entry => ({
    ...entry,
    dependencies: entry.dependencies.filter(dep => dep !== entry.name && resolvedNames.has(dep))
  }));
  const sortedItems = topologicallySortItems(resolvedForSort);

  // Phase 3 — Write. Iterating in topological order so identical `vean add`
  // runs produce identical file-write order (and therefore identical diffs).
  for (const { item, expandedFiles } of sortedItems) {
    collectPackageDependencies(item, allDeps, allDevDeps);

    const filesToAdd = expandedFiles.filter(file => WRITABLE_FILE_TYPES.has(file.type));

    if (filesToAdd.length > 0) {
      // Route each item to its package directory (EC-E03); `--path` overrides
      // all packages to a single base dir (backward compatible).
      const pkg = item.package ?? getItemPackage(item.name);
      const itemDir = options.path ? targetDir : (config.resolvedPaths.packages[pkg] ?? config.resolvedPaths.ui);
      const filesAdded = await updateFiles(filesToAdd, itemDir, { ...updateOpts, package: pkg });
      added += filesAdded.length;
      addedFiles.push(...filesAdded);
    }
  }

  // Handle dry-run mode
  if (options.dryRun) {
    if (!silent) {
      console.log('\n📋 Dry-run preview: The following changes would be made:\n');
      if (addedFiles.length > 0) {
        console.log('📝 Files:');
        for (const file of addedFiles) {
          console.log(`   + ${file}`);
        }
      }
      if (allDeps.length > 0 || allDevDeps.length > 0) {
        console.log('\n📦 Dependencies:');
        if (allDeps.length > 0) {
          console.log(`   + ${allDeps.join(', ')}`);
        }
        if (allDevDeps.length > 0) {
          console.log(`   + ${allDevDeps.join(', ')} (dev)`);
        }
      }
      console.log(`\n✨ Use without --dry-run to apply these changes.`);
    }
    return;
  }

  // Install collected dependencies
  if (allDeps.length > 0 || allDevDeps.length > 0) {
    await updateDependencies(allDeps, allDevDeps, config);
  }

  if (!silent) {
    console.log(`\n✔ Added ${added} file(s) to ${path.relative(config.resolvedPaths.cwd, targetDir)}`);
  }
}

async function loadRegistryItem(
  componentName: string,
  localItems: RegistryItem[] | null,
  config: Config
): Promise<RegistryItem | null> {
  if (localItems) {
    // Resolve bare aliases against the local registry first (EC-E04).
    // Ambiguous names throw AmbiguousComponentNameError.
    const resolvedName = resolveRegistryItemName(componentName, localItems);
    const localItem = localItems.find(item => item.name === resolvedName);

    if (localItem) {
      return localItem;
    }
  }

  return fetchRegistryItem(componentName, config);
}

function collectPackageDependencies(item: RegistryItem, dependencies: string[], devDependencies: string[]) {
  for (const dependency of item.dependencies ?? []) {
    if (!dependencies.includes(dependency)) {
      dependencies.push(dependency);
    }
  }

  for (const dependency of item.devDependencies ?? []) {
    if (!devDependencies.includes(dependency)) {
      devDependencies.push(dependency);
    }
  }
}

export async function expandRegistryItemFiles(files: RegistryItemFile[]): Promise<RegistryItemFile[]> {
  if (!SOURCE_ROOT) {
    return files;
  }

  const expandedFiles = new Map(files.map(file => [normalizePath(file.path), file]));
  const queue = [...files];

  while (queue.length > 0) {
    const currentFile = queue.shift();

    if (!currentFile?.content) {
      continue;
    }

    const dependencyPaths = resolveSourceDependencyPaths(currentFile);

    for (const dependencyPath of dependencyPaths) {
      const normalizedDependencyPath = normalizePath(path.relative(SOURCE_ROOT, dependencyPath));

      if (expandedFiles.has(normalizedDependencyPath)) {
        continue;
      }

      const content = await readSourceFile(dependencyPath);

      if (!content) {
        continue;
      }

      const dependencyFile: RegistryItemFile = {
        path: normalizedDependencyPath,
        type: inferRegistryFileType(normalizedDependencyPath),
        content
      };

      expandedFiles.set(normalizedDependencyPath, dependencyFile);
      queue.push(dependencyFile);
    }
  }

  return [...expandedFiles.values()];
}

/**
 * Include barrel index.ts files from component source directories
 * that are referenced by the expanded files.
 */
async function includeBarrelFiles(expandedFiles: RegistryItemFile[], sourceRoot: string | null): Promise<void> {
  if (!sourceRoot) return;

  // Collect unique component source directories
  const dirs = new Set<string>();
  for (const file of expandedFiles) {
    const normalizedPath = normalizePath(file.path);
    if (normalizedPath.includes('/components/') && normalizedPath.endsWith('.vue')) {
      dirs.add(path.dirname(normalizedPath));
    }
  }

  // Check each directory for an index.ts
  for (const dir of dirs) {
    const indexPath = path.join(sourceRoot, dir, 'index.ts');
    if (!isExistingFile(indexPath)) continue;

    const normalizedPath = normalizePath(path.relative(sourceRoot, indexPath));
    if (expandedFiles.some(f => normalizePath(f.path) === normalizedPath)) continue;

    const content = await readSourceFile(indexPath);
    if (!content) continue;

    const barrelFile: RegistryItemFile = {
      path: normalizedPath,
      type: 'registry:lib',
      content
    };

    expandedFiles.push(barrelFile);

    // Expand barrel's own dependencies (e.g. ./types)
    const depPaths = resolveSourceDependencyPaths(barrelFile);
    for (const dep of depPaths) {
      const depNormalized = normalizePath(path.relative(sourceRoot, dep));
      if (expandedFiles.some(f => normalizePath(f.path) === depNormalized)) continue;
      const depContent = await readSourceFile(dep);
      if (!depContent) continue;
      expandedFiles.push({
        path: depNormalized,
        type: inferRegistryFileType(depNormalized),
        content: depContent
      });
    }
  }
}

function inferRegistryDependencies(files: RegistryItemFile[]): string[] {
  const dependencies = new Set<string>();

  for (const file of files) {
    if (!file.content) {
      continue;
    }

    const importSpecifiers = extractImportSpecifiers(file.content);

    for (const specifier of importSpecifiers) {
      const dependencyName = resolveRegistryDependencyFromSpecifier(file.path, specifier);

      if (!dependencyName) {
        continue;
      }

      // Skip if file-level expansion already added files from this component
      if (!isDependencyCoveredByFiles(dependencyName, files)) {
        dependencies.add(dependencyName);
      }
    }
  }

  return [...dependencies];
}

/**
 * Check whether a registry dependency is already covered by files that
 * file-level expansion has pulled in.  If at least one file from
 * `components/{depName}/` is in the expanded set, the dependency is
 * considered covered — no need to pull the entire component.
 */
function isDependencyCoveredByFiles(depName: string, files: RegistryItemFile[]): boolean {
  return files.some(f => {
    const normalizedPath = normalizePath(f.path);
    const componentsMarker = '/components/';
    const markerIndex = normalizedPath.indexOf(componentsMarker);

    if (markerIndex < 0) {
      return false;
    }

    const componentRelativePath = normalizedPath.slice(markerIndex + componentsMarker.length);

    return componentRelativePath.startsWith(`${depName}/`);
  });
}

function resolveRegistryDependencyFromSpecifier(filePath: string, specifier: string): string | null {
  if (specifier === '@/theme' || specifier.startsWith('@/theme/')) {
    return 'theme';
  }

  if (!specifier.startsWith('.')) {
    return null;
  }

  const sourceRootPath = getComponentSourcePath(filePath);

  if (!sourceRootPath) {
    return null;
  }

  const resolvedPath = normalizePath(
    path.posix.normalize(path.posix.join(path.posix.dirname(sourceRootPath), specifier))
  );
  const componentsMarker = '/components/';
  const markerIndex = resolvedPath.indexOf(componentsMarker);

  if (markerIndex < 0) {
    return null;
  }

  const componentRelativePath = resolvedPath.slice(markerIndex + componentsMarker.length);
  const [componentName] = componentRelativePath.split('/');

  if (!componentName) {
    return null;
  }

  return componentName;
}

function resolveSourceDependencyPaths(file: RegistryItemFile): string[] {
  return extractImportSpecifiers(file.content ?? '')
    .map(specifier => resolveSourceDependencyPath(file.path, specifier))
    .filter((dependencyPath): dependencyPath is string => Boolean(dependencyPath));
}

function resolveSourceDependencyPath(filePath: string, specifier: string): string | null {
  if (!SOURCE_ROOT) {
    return null;
  }

  const sourceFilePath = path.join(SOURCE_ROOT, filePath);

  if (specifier.startsWith('.')) {
    return resolveWithExtensions(path.resolve(path.dirname(sourceFilePath), specifier));
  }

  if (specifier === '@/theme') {
    return resolveWithExtensions(path.join(SOURCE_ROOT, `${UI_SOURCE_PATH}/theme/index`));
  }

  if (specifier.startsWith('@/theme/')) {
    return resolveWithExtensions(path.join(SOURCE_ROOT, `${UI_SOURCE_PATH}/theme`, specifier.slice('@/theme/'.length)));
  }

  if (specifier.startsWith('@/styles/')) {
    return resolveWithExtensions(
      path.join(SOURCE_ROOT, `${UI_SOURCE_PATH}/styles`, specifier.slice('@/styles/'.length))
    );
  }

  if (specifier.startsWith('@/components/')) {
    return resolveWithExtensions(
      path.join(SOURCE_ROOT, `${UI_SOURCE_PATH}/components`, specifier.slice('@/components/'.length))
    );
  }

  return null;
}

function resolveWithExtensions(basePath: string): string | null {
  // Strip Vite query params (?raw, ?inline, ?url, etc.)
  const cleaned = basePath.split('?')[0];

  /** Extensions to try (most-to-least common in Vean projects). */
  const candidates = [
    `${cleaned}.ts`,
    `${cleaned}.vue`,
    `${cleaned}.tsx`,
    `${cleaned}.js`,
    `${cleaned}.jsx`,
    `${cleaned}.mts`,
    `${cleaned}.mjs`,
    `${cleaned}.css`,
    `${cleaned}.scss`,
    `${cleaned}.less`,
    path.join(cleaned, 'index.ts'),
    path.join(cleaned, 'index.vue'),
    path.join(cleaned, 'index.tsx'),
    path.join(cleaned, 'index.js'),
    cleaned
  ];

  return candidates.find(candidate => isExistingFile(candidate)) ?? null;
}

function inferRegistryFileType(filePath: string): RegistryItemFile['type'] {
  const normalizedPath = normalizePath(filePath);

  if (/\.(css|scss|sass|less)$/.test(normalizedPath)) {
    return 'registry:style';
  }

  if (normalizedPath.includes('/styles/')) {
    return 'registry:style';
  }

  if (normalizedPath.includes('/theme/')) {
    return 'registry:theme';
  }

  if (/\.(vue|tsx|jsx)$/.test(normalizedPath)) {
    return 'registry:ui';
  }

  return 'registry:lib';
}

function extractImportSpecifiers(source: string): string[] {
  const importMatches = source.matchAll(/(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g);
  const dynamicImportMatches = source.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g);

  return [...importMatches, ...dynamicImportMatches].map(match => match[1]);
}

function getComponentSourcePath(filePath: string): string | null {
  const normalizedPath = normalizePath(filePath);
  const componentMarker = UI_SOURCE_PATH;

  if (!normalizedPath.startsWith(componentMarker)) {
    return null;
  }

  return normalizedPath.slice(componentMarker.length + 1);
}

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

async function readSourceFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function findWorkspaceSourceRoot(): string | null {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));

  while (true) {
    if (existsSync(path.join(currentDir, UI_SOURCE_PATH))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

function isExistingFile(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }

  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}
