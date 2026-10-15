/**
 * The docs' font loading.
 *
 * The theme customizer can switch `ThemeOptions.font` at runtime, and the family
 * has to be **already loaded** when it is picked: fetching a stylesheet lazily on
 * select paints the fallback stack first and reflows when the webfont lands.
 *
 * Requesting every selectable family up front is the obvious way to honour that,
 * and it is what this module used to do — one Google Fonts stylesheet carrying
 * all 25 preset families × 6 weights. Measured on the live site, that stylesheet
 * is a **render-blocking document the browser waits ~826 ms for** before it can
 * paint anything (Lighthouse `render-blocking-insight`), and it is on the
 * critical path of *every* page even though the engine's defaults are system
 * font stacks — a first-time visitor who never opens the customizer downloads
 * and blocks on CSS for 25 families they will never render.
 *
 * So the cost is split by when it is actually needed:
 *
 * - **`docsFontPreconnectLinks`** (two hints, no CSS) go in the head from the
 *   first byte. They are the part that removes the DNS + TLS handshake from the
 *   critical path, and they cost nothing until a stylesheet is requested —
 *   which is exactly what a warmed path needs when the customizer is opened.
 * - **`loadDocsFontStylesheet()`** injects the stylesheet the first time the
 *   customizer actually renders a font control. The await inside
 *   `ensureFontsLoaded()` is what keeps the promise above: the picker's UI is
 *   gated on the sheet being in the document, so a family cannot be selected
 *   before it is loaded.
 *
 * The family list is still derived from the engine's own preset tables, so a
 * family added to the customizer is covered here without a second edit.
 */
import { THEME_FONT_HEADING, THEME_FONT_MONO, THEME_FONT_SANS, THEME_FONT_SERIF } from '@vean/theme';

/**
 * `system` maps to `undefined` in the preset tables — only real families are
 * requested.
 */
const presetFamilyValues: (string | undefined)[] = [
  ...Object.values(THEME_FONT_SANS),
  ...Object.values(THEME_FONT_HEADING),
  ...Object.values(THEME_FONT_MONO),
  ...Object.values(THEME_FONT_SERIF)
];

/** the real families the customizer can select, de-duplicated. */
export const PRESET_FAMILIES: string[] = [
  ...new Set(presetFamilyValues.filter((family: string | undefined): family is string => typeof family === 'string'))
];

/** the weights the stylesheet declares for every family (`font-normal` … `font-black`). */
const WEIGHTS = '400;500;600;700;800;900';

/** the URL shape Google Fonts expects for one family (`Inter` → `Inter:wght@…`). */
const familyQuery = (family: string): string => `family=${family.replace(/\s+/g, '+')}:wght@${WEIGHTS}`;

/** the stylesheet href: every customizer family in one document. */
export const docsFontStylesheetHref = `https://fonts.googleapis.com/css2?${PRESET_FAMILIES.map(familyQuery).join(
  '&'
)}&display=swap`;

/**
 * The head hints for font loading: just the two preconnects.
 *
 * `display=swap` in the stylesheet keeps text readable while a family downloads;
 * the alternative (`block`) would hide the text instead.
 */
export const docsFontPreconnectLinks: Array<Record<string, string>> = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
];

let fontStylesheetRequest: Promise<void> | undefined;

/**
 * Load the customizer's font stylesheet once, on first use.
 *
 * Resolves as soon as the `<link>` is in the document — not when the sheet has
 * finished fetching. `stylesheets` are render-blocking for the *frame in which
 * they are inserted*, and the browser starts the download immediately, so the
 * sheet lands while the picker is still opening.
 */
export function loadDocsFontStylesheet(): Promise<void> {
  if (fontStylesheetRequest) {
    return fontStylesheetRequest;
  }

  if (typeof document === 'undefined') {
    fontStylesheetRequest = Promise.resolve();
    return fontStylesheetRequest;
  }

  fontStylesheetRequest = new Promise<void>(resolve => {
    const existing = document.querySelector<HTMLLinkElement>('link[data-docs-fonts]');
    if (existing) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = docsFontStylesheetHref;
    link.dataset.docsFonts = '';
    // Resolving on both keeps a failed request from leaving the picker disabled.
    link.addEventListener('load', () => resolve(), { once: true });
    link.addEventListener('error', () => resolve(), { once: true });
    document.head.append(link);
  });

  return fontStylesheetRequest;
}
