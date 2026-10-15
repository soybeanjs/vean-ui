import type { Component } from 'vue';

/**
 * Astro-side loaders for the docs' own Vue components and playground examples.
 *
 * `astro:content` only handles Astro content collections, and the docs site renders
 * *Vue* SFCs (`apps/docs/src/examples/**`), so the loaders are built from
 * `import.meta.glob` here instead — the same mechanism ubean uses, pointed at the
 * shared source tree via the `src/examples` symlink.
 */

/**
 * Only the *example* SFCs are globbed. The per-component `index.vue` files are the
 * ubean-only gallery wrappers (they import `playground-gallery.vue`) and are
 * filtered out below, so they never enter the build graph.
 */
/**
 * The glob has to stay inside the project root (`src/examples` is a symlink into
 * `apps/docs/src/examples`); a pattern resolving outside it silently yields an
 * empty index. The per-component `index.vue` files are the ubean-only gallery
 * wrappers and are excluded here as well as in `buildIndex()`.
 */
// The glob patterns must be **inline literals**: Vite's `import.meta.glob` only
// performs the (limited) static evaluation that resolves a variable when the
// argument is written out here. Passing a shared `const` silently produced an empty
// index — every `<UsageCode>` and `<PlaygroundGallery>` segment then rendered as
// "not found" with no warning.
const exampleComponents = import.meta.glob<{ default: Component }>([
  '../examples/**/*.vue',
  '!../examples/**/index.vue'
]);
const exampleSources = import.meta.glob<string>(['../examples/**/*.vue', '!../examples/**/index.vue'], {
  query: '?raw',
  import: 'default'
});

const exampleKeyPattern = /\/examples\/(?:[^/]+\/)?([^/]+)\/([^/]+)\.vue$/;
const orderPattern = /^(\d{2})-(.+)$/;

export interface ExampleEntry {
  name: string;
  order: number | null;
  rawFileName: string;
  loadComponent: () => Promise<Component>;
  loadCode: () => Promise<string>;
}

interface IndexedExample extends Omit<ExampleEntry, 'loadComponent' | 'loadCode'> {
  componentLoader: () => Promise<{ default: Component }>;
  codeLoader: (() => Promise<string>) | undefined;
}

function parseExampleName(fileName: string): { name: string; order: number | null } {
  const match = fileName.match(orderPattern);

  return match ? { name: match[2], order: Number(match[1]) } : { name: fileName, order: null };
}

/** Mirror of `comparePlaygroundExamples` in `apps/docs/src/constants/globs.ts`. */
function compareExamples(a: IndexedExample, b: IndexedExample): number {
  if (a.order !== null && b.order !== null && a.order !== b.order) {
    return a.order - b.order;
  }

  const aIsBasic = a.name === 'basic';
  const bIsBasic = b.name === 'basic';

  if (aIsBasic !== bIsBasic) {
    return aIsBasic ? -1 : 1;
  }

  if (a.order !== null || b.order !== null) {
    if (a.order === null) return 1;
    if (b.order === null) return -1;
  }

  return a.name.localeCompare(b.name);
}

let index: Map<string, IndexedExample[]> | undefined;

function buildIndex(): Map<string, IndexedExample[]> {
  const built = new Map<string, IndexedExample[]>();

  for (const [key, componentLoader] of Object.entries(exampleComponents)) {
    const match = key.match(exampleKeyPattern);

    if (!match) {
      continue;
    }

    const [, componentName, rawFileName] = match;

    if (rawFileName === 'index' || rawFileName.startsWith('_')) {
      continue;
    }

    const { name, order } = parseExampleName(rawFileName);
    const entries = built.get(componentName) ?? [];

    entries.push({ name, order, rawFileName, componentLoader, codeLoader: exampleSources[key] });
    built.set(componentName, entries);
  }

  for (const entries of built.values()) {
    entries.sort(compareExamples);
  }

  return built;
}

/** All examples of a component, ordered exactly like the ubean playground gallery. */
export function loadExamples(component: string): IndexedExample[] {
  index ??= buildIndex();

  return index.get(component) ?? [];
}

/** The playground gallery island's payload: example metadata plus lazy loaders. */
export function createGalleryPayload(component: string) {
  return loadExamples(component).map(entry => ({
    name: entry.name,
    rawFileName: entry.rawFileName,
    loadComponent: entry.componentLoader,
    loadCode: entry.codeLoader
  }));
}

/** Raw source of one example — what `<UsageCode>` renders above the fold. */
export async function loadExampleCode(component: string, exampleName: string): Promise<string | undefined> {
  const entries = loadExamples(component);
  const found = entries.find(entry => entry.name === exampleName) ?? entries.find(entry => entry.name === 'basic');

  return found?.codeLoader?.();
}
