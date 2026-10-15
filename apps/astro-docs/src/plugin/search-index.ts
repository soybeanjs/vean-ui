import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderDoc } from './markdown';
import { collectRoutes, localizedPath, type DocsRoute } from './routes';
import { toHeadingId } from '../shared/heading';
import { DOCS_ROOT } from './examples';

/**
 * Build-time full-text index, mirroring the `__search.json` the ubean build emits
 * (a built-in `@ubean/content` feature: `content.sources` in `ubean.config.ts`).
 *
 * Shape is identical so `search-dialog.vue` could be pointed at either site:
 * `{ [locale]: { id, title, titles, level, content }[] }` where `id` is
 * `<route>#<toHeadingId(title)>` and `titles` holds the ancestor headings.
 */
export interface SearchEntry {
  id: string;
  title: string;
  titles: string[];
  level: number;
  content: string;
}

type SearchIndex = Record<string, SearchEntry[]>;

const CONTENT_ROOT = path.join(DOCS_ROOT, 'src/content');

/** Strip inline markdown syntax so the index holds readable prose, not source. */
function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractEntries(html: string, routePath: string): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const stack: { level: number; title: string }[] = [];
  const parts = html.split(/(?=<h[1-6]\b)/u);
  let pageTitle = routePath;

  for (const part of parts) {
    const heading = /^<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/u.exec(part);

    if (!heading) {
      continue;
    }

    const level = Number(heading[1]);
    const title = plainText(heading[2]);

    if (level === 1 && entries.length === 0) {
      pageTitle = title;
    }

    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    entries.push({
      id: `${routePath}#${toHeadingId(title)}`,
      title,
      titles: stack.map(item => item.title),
      level,
      content: plainText(part.slice(heading[0].length))
    });

    stack.push({ level, title });
  }

  // A page with no headings at all still deserves one entry.
  if (entries.length === 0) {
    entries.push({ id: `${routePath}#${toHeadingId(pageTitle)}`, title: pageTitle, titles: [], level: 1, content: '' });
  }

  return entries;
}

/** Every content route of every locale, flattened to `{locale: entries[]}`. */
export async function buildSearchIndex(): Promise<SearchIndex> {
  const index: SearchIndex = {};

  for (const route of await collectRoutes()) {
    if (!route.isContent || !route.slug) {
      continue;
    }

    const source = await readFile(path.join(CONTENT_ROOT, route.locale, `${route.slug}.md`), 'utf8');
    const rendered = await renderDoc(source);
    const routePath = localizedPath(route);
    const html = rendered.segments.map(segment => (segment.kind === 'html' ? segment.html : ' ')).join('');
    const entries = extractEntries(html, routePath);

    index[route.locale] = [...(index[route.locale] ?? []), ...entries];
  }

  return index;
}

/** Build the index and drop it next to the other static assets. */
export async function writeSearchIndex(outDir: string): Promise<number> {
  const index = await buildSearchIndex();

  await writeFile(path.join(outDir, '__search.json'), JSON.stringify(index));

  return Object.values(index).reduce((sum, entries) => sum + entries.length, 0);
}

export type { DocsRoute };
