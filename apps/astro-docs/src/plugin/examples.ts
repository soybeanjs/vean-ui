import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Access to the *same* example SFCs the ubean docs site uses. The astro app links
 * `apps/docs/src/examples` so both sites render byte-identical source.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
export const DOCS_ROOT = path.resolve(here, '../../../docs');
export const EXAMPLES_ROOT = path.join(DOCS_ROOT, 'src/examples');

const orderPattern = /^(\d{2})-(.+)$/;

export interface ExampleEntry {
  name: string;
  order: number | null;
  rawFileName: string;
  code: string;
}

function parseExampleName(fileName: string): { name: string; order: number | null } {
  const match = fileName.match(orderPattern);

  if (!match) {
    return { name: fileName, order: null };
  }

  return { name: match[2], order: Number(match[1]) };
}

/** Mirror of `comparePlaygroundExamples` in the ubean site's `src/constants/globs.ts`. */
function compareExamples(a: ExampleEntry, b: ExampleEntry): number {
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

const cache = new Map<string, ExampleEntry[]>();

/** All example SFCs for a component, sorted exactly like the ubean playground. */
export async function loadExamples(component: string): Promise<ExampleEntry[]> {
  const cached = cache.get(component);

  if (cached) {
    return cached;
  }

  const dir = path.join(EXAMPLES_ROOT, component);
  let fileNames: string[] = [];

  try {
    fileNames = await readdir(dir);
  } catch {
    cache.set(component, []);
    return [];
  }

  const entries = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.vue'))
      .map(async fileName => {
        const base = fileName.slice(0, -4);

        if (base === 'index' || base.startsWith('_')) {
          return null;
        }

        const { name, order } = parseExampleName(base);
        const code = await readFile(path.join(dir, fileName), 'utf8');

        return { name, order, rawFileName: base, code } satisfies ExampleEntry;
      })
  );

  const result = entries.filter((entry): entry is ExampleEntry => entry !== null).sort(compareExamples);
  cache.set(component, result);

  return result;
}

export async function loadExampleCode(component: string, exampleName: string): Promise<string | undefined> {
  const entries = await loadExamples(component);
  const found = entries.find(entry => entry.name === exampleName) ?? entries.find(entry => entry.name === 'basic');

  return found?.code;
}
