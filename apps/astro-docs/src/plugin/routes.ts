import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { chartMenuData } from '../constants/menus';
import { DOCS_ROOT } from './examples';

/** locale code -> content directory name (mirrors `apps/docs/build/docs-routes.ts`). */
export const CONTENT_LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof CONTENT_LOCALES)[number];

/** Static shell pages, mirroring `definePage` routes under `apps/docs/src/pages`. */
export const STATIC_ROUTES = ['/', '/releases', '/aria', '/components', '/playground', '/theme-editor'] as const;

/**
 * Chart demo pages (`src/pages/chart/[name].vue`). These are *param* routes, so
 * ubean only emits them because `crawlLinks` follows the links on `/chart` — the
 * static build has to enumerate them explicitly.
 */
export const CHART_KINDS = chartMenuData.flatMap(group => group.items);

const CONTENT_ROOT = path.join(DOCS_ROOT, 'src/content');

/**
 * Content slug (relative to `{locale}`, no `.md`) -> public route path.
 * Byte-identical copy of `apps/docs/src/shared/content-route.ts` so both sites
 * agree on every URL.
 */
export function resolveContentRoutePath(inputSlug: string): string {
  const slug = inputSlug.replace(/\/index$/u, '').replace(/^index$/u, '');
  const uiComponentsMatch = slug.match(/^ui\/components\/(.+)$/u);

  if (uiComponentsMatch) {
    return `/components/${uiComponentsMatch[1]}`;
  }

  const sectionComponentsMatch = slug.match(/^([^/]+)\/components\/(.+)$/u);

  if (sectionComponentsMatch) {
    return `/${sectionComponentsMatch[1]}/${sectionComponentsMatch[2]}`;
  }

  if (slug === 'ui') {
    return '/overview';
  }

  if (slug.startsWith('ui/')) {
    return `/overview/${slug.slice('ui/'.length)}`;
  }

  return `/${slug}`;
}

export interface DocsRoute {
  /** Public URL path, no locale prefix for the default locale. */
  path: string;
  locale: Locale;
  /** Content slug relative to the locale dir, or `null` for shell pages. */
  slug: string | null;
  /** Whether the page renders markdown content. */
  isContent: boolean;
  /** Playground / usage-code lookup key (`ui/components/button` -> `button`). */
  component: string | null;
  /** Chart kind for `/chart/<kind>` demo pages, or `null`. */
  chart: string | null;
}

async function collectMarkdownSlugs(dir: string, base: string): Promise<string[]> {
  let entries: Awaited<ReturnType<typeof readdir>> = [];

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const nested = await Promise.all(
    entries.map(async entry => {
      const resolved = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectMarkdownSlugs(resolved, base);
      }

      if (entry.isFile() && entry.name.endsWith('.md')) {
        return [path.relative(base, resolved).split(path.sep).join('/').replace(/\.md$/u, '')];
      }

      return [];
    })
  );

  return nested.flat();
}

/** Component key for the example galleries: `ui/components/button` -> `button`. */
export function componentKeyFromSlug(slug: string): string | null {
  const match = slug.match(/^(?:[^/]+)\/components\/(.+)$/u);

  return match ? match[1] : null;
}

/**
 * Every route the ubean SSG build emits: static shells (both locales) plus each
 * content slug per locale. Sorted for deterministic output.
 */
export async function collectRoutes(): Promise<DocsRoute[]> {
  const routes: DocsRoute[] = [];

  for (const locale of CONTENT_LOCALES) {
    const slugs = await collectMarkdownSlugs(path.join(CONTENT_ROOT, locale), path.join(CONTENT_ROOT, locale));

    for (const slug of slugs) {
      routes.push({
        path: resolveContentRoutePath(slug),
        locale,
        slug,
        isContent: true,
        component: componentKeyFromSlug(slug),
        chart: null
      });
    }

    for (const route of STATIC_ROUTES) {
      routes.push({
        path: route,
        locale,
        slug: null,
        isContent: false,
        component: null,
        chart: null
      });
    }

    for (const kind of CHART_KINDS) {
      routes.push({
        path: `/chart/${kind}`,
        locale,
        slug: null,
        isContent: false,
        component: kind,
        chart: kind
      });
    }
  }

  return routes.sort((a, b) => a.locale.localeCompare(b.locale) || a.path.localeCompare(b.path));
}

/** Public URL with the locale prefix applied (`prefix_except_default`, default = en). */
export function localizedPath(route: DocsRoute): string {
  const path = route.locale === 'en' ? route.path : route.path === '/' ? '/zh' : `/zh${route.path}`;

  return path;
}
