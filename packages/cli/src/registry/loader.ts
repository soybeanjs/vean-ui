import fs from 'fs/promises';
import path from 'path';
import * as v from 'valibot';
import { registrySchema, registryItemSchema } from './schema';
import type { Registry, RegistryItem } from './schema';

const MAX_INCLUDE_DEPTH = 32;

export type RegistryLoadResult = {
  registry: Registry;
  usesInclude: boolean;
};

/**
 * Thrown when a bare (unprefixed) component reference matches an item in a
 * non-core package. Per the add-namespace rule, only the core `ui` package is
 * addressable without a prefix — other packages require `<package>/<name>`.
 */
export class PackageNamespaceRequiredError extends Error {
  readonly pkg: string;

  constructor(name: string, pkg: string) {
    super(`Component "${name}" is from the "${pkg}" package — use the namespaced form: "vean add ${pkg}/${name}".`);
    this.name = 'PackageNamespaceRequiredError';
    this.pkg = pkg;
  }
}

/**
 * Thrown when a bare (unprefixed) component reference matches items in more
 * than one package. Callers should surface the candidate namespaces so the
 * user can pick the namespaced form (EC-E04).
 */
export class AmbiguousComponentNameError extends Error {
  readonly candidates: string[];

  constructor(name: string, candidates: string[]) {
    super(
      `Component "${name}" is ambiguous across packages: ${candidates.join(', ')}. ` +
        `Use the namespaced form (e.g. "${candidates[0]}").`
    );
    this.name = 'AmbiguousComponentNameError';
    this.candidates = candidates;
  }
}

/**
 * The component segment of a (possibly namespaced) item name.
 * `ui/accordion` → `accordion`; `@acme/foo` → `foo`; `accordion` → `accordion`.
 */
export function getItemBasename(itemName: string): string {
  const slash = itemName.lastIndexOf('/');
  return slash >= 0 ? itemName.slice(slash + 1) : itemName;
}

/**
 * The package namespace of an item name. Registry-namespace references
 * (`@acme/foo`) and bare names default to the core `ui` package.
 * `admin/layout` → `admin`; `@acme/foo` → `ui`; `accordion` → `ui`.
 */
export function getItemPackage(itemName: string): string {
  if (itemName.startsWith('@')) return 'ui';
  const slash = itemName.indexOf('/');
  return slash > 0 ? itemName.slice(0, slash) : 'ui';
}

/**
 * Resolve a user-supplied component reference to a canonical registry item name.
 *
 * Supports three forms (EC-E04 / EC-E05):
 *   - `@acme/foo`   registry-namespace — passes through unchanged (fetcher owns it)
 *   - `admin/layout` namespaced package reference — passes through unchanged
 *   - `bubble`      bare alias — resolves ONLY to the core `ui` package
 *                   (`ui/bubble`). A bare name matching a non-core package
 *                   throws {@link PackageNamespaceRequiredError}; ambiguous
 *                   matches throw {@link AmbiguousComponentNameError}.
 *
 * Returns the input unchanged when no local match exists so callers can fall
 * back to remote resolution with the original reference.
 */
export function resolveRegistryItemName(name: string, items: RegistryItem[]): string {
  if (name.startsWith('@') || name.includes('/')) {
    return name;
  }

  const matches = items.filter(item => getItemBasename(item.name) === name);

  if (matches.length === 0) {
    return name;
  }

  // Bare names address the core `ui` package only; other packages require the
  // `<package>/` prefix (EC-E05).
  const uiMatches = matches.filter(item => getItemPackage(item.name) === 'ui');

  if (uiMatches.length === 1) {
    return uiMatches[0].name;
  }

  if (matches.length === 1) {
    throw new PackageNamespaceRequiredError(name, getItemPackage(matches[0].name));
  }

  throw new AmbiguousComponentNameError(name, matches.map(match => match.name).sort());
}

/**
 * Read registry.json, resolving any `include` references.
 */
export async function readRegistryWithIncludes(
  registryFile: string,
  options: { cwd: string }
): Promise<RegistryLoadResult> {
  const rootFile = path.resolve(options.cwd, registryFile);
  const content = await fs.readFile(rootFile, 'utf-8');
  const rootRegistry = JSON.parse(content) as Registry;

  // Validate basic structure
  v.parse(registrySchema, rootRegistry);

  const usesInclude = !!rootRegistry.include?.length;

  if (!usesInclude) {
    return { registry: rootRegistry, usesInclude: false };
  }

  // Merge included registries
  const mergedItems = [...rootRegistry.items];
  const included = await resolveIncludes(rootRegistry.include!, path.dirname(rootFile), 0);

  for (const inc of included) {
    for (const item of inc.items) {
      if (!mergedItems.find(i => i.name === item.name)) {
        mergedItems.push(item);
      }
    }
  }

  return {
    registry: {
      ...rootRegistry,
      items: mergedItems,
      include: undefined
    },
    usesInclude: true
  };
}

async function resolveIncludes(includes: string[], baseDir: string, depth: number): Promise<Registry[]> {
  if (depth > MAX_INCLUDE_DEPTH) {
    throw new Error('Max include depth exceeded');
  }

  const results: Registry[] = [];

  for (const includePath of includes) {
    const fullPath = path.resolve(baseDir, includePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const parsed = JSON.parse(content);
    const registry = v.parse(registrySchema, parsed);

    if (registry.include?.length) {
      const nested = await resolveIncludes(registry.include, path.dirname(fullPath), depth + 1);
      results.push(...nested);
    }

    results.push(registry);
  }

  return results;
}

/**
 * Create a registry item with resolved file contents.
 */
export async function createRegistryItem(item: RegistryItem, rootDir: string): Promise<RegistryItem> {
  const files = item.files
    ? await Promise.all(
        item.files.map(async file => {
          const filePath = path.resolve(rootDir, file.path);
          try {
            const content = await fs.readFile(filePath, 'utf-8');
            return { ...file, content };
          } catch {
            console.warn(`  ⚠ File not found: ${file.path}`);
            return file;
          }
        })
      )
    : [];

  return v.parse(registryItemSchema, {
    ...item,
    files
  });
}

/**
 * Create a registry catalog (without file contents, just metadata).
 */
export function createRegistryCatalog(result: RegistryLoadResult, rootDir: string): Registry {
  return {
    ...result.registry,
    items: result.registry.items.map(item => ({
      ...item,
      files: item.files?.map(f => ({
        path: path.relative(rootDir, path.resolve(rootDir, f.path)),
        type: f.type
      }))
    }))
  };
}
