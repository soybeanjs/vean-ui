import { createTranslator, localeFromPath, type Locale } from './i18n';
import { collectRoutes, localizedPath, type DocsRoute } from './plugin/routes';

export type { Locale };

export interface SiteContext {
  /** Bare path with the locale prefix stripped (`/zh/components/button` -> `/components/button`). */
  barePath: string;
  /** Public path including the locale prefix. */
  fullPath: string;
  locale: Locale;
  /** The route this path resolves to, or `null` for an unknown path (404). */
  route: DocsRoute | null;
  /** Dotted-key translator over `src/locales/*.json`. */
  t: (key: string) => string;
}

const routeIndex = new Map<string, DocsRoute>();

/** Built once per build: `localizedPath` -> route, so page lookups are O(1). */
export async function getRouteIndex(): Promise<Map<string, DocsRoute>> {
  if (routeIndex.size) {
    return routeIndex;
  }

  for (const route of await collectRoutes()) {
    routeIndex.set(localizedPath(route), route);
  }

  return routeIndex;
}

/** Resolves an arbitrary request pathname to its route + translator. */
export async function resolveSiteContext(pathname: string): Promise<SiteContext> {
  const index = await getRouteIndex();
  const fullPath = pathname.replace(/\/+$/, '') || '/';
  const locale = localeFromPath(fullPath);
  const barePath = fullPath === '/zh' ? '/' : fullPath.replace(/^\/zh(?=\/|$)/u, '') || '/';

  return {
    barePath,
    fullPath,
    locale,
    route: index.get(fullPath) ?? null,
    t: createTranslator(locale)
  };
}

/** Same-origin alternate locale URL for the current page (locale toggler target). */
export function alternateLocalePath(barePath: string, current: Locale): string {
  const other: Locale = current === 'en' ? 'zh' : 'en';

  if (other === 'en') {
    return barePath;
  }

  return barePath === '/' ? '/zh' : `/zh${barePath}`;
}
