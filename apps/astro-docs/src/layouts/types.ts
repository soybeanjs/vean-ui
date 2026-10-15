import type { Locale } from '../i18n';
import type { OutlineItem } from '../plugin/markdown';

/**
 * Shared layout contract. Every layout takes the same page context so the single
 * injected route (`src/templates/DocPage.astro`) can pick a layout by route kind
 * without knowing which one it is.
 */
export interface PageLayoutProps {
  locale: Locale;
  /** Bare path with the locale prefix stripped. */
  path: string;
  /** Public path including the locale prefix. */
  fullPath: string;
  /** `<title>` for this page. */
  title?: string;
  /** `<meta name="description">` for this page. */
  description?: string;
  /** Right-hand outline; empty for pages that do not reserve outline space. */
  outline?: OutlineItem[];
}

/** Pages that reserve the right-hand outline column (mirrors `layouts/default.vue`). */
export const OUTLINE_EXCLUDED_PATHS = ['/', '/releases', '/playground', '/theme-editor'];

/** Pages that render the left sider (mirrors `layouts/default.vue`). */
export const SIDEBAR_SECTIONS = ['/overview', '/components', '/chart', '/aria'];

export function shouldReserveOutlineSpace(barePath: string): boolean {
  return !OUTLINE_EXCLUDED_PATHS.includes(barePath);
}

export function shouldShowSidebar(barePath: string): boolean {
  return SIDEBAR_SECTIONS.some(section => barePath.startsWith(section));
}
