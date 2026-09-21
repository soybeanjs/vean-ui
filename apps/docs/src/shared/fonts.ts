import { THEME_FONT_HEADING, THEME_FONT_MONO, THEME_FONT_SANS, THEME_FONT_SERIF } from '@vean/theme';

/**
 * The docs' font loading: one Google Fonts stylesheet carrying every family the
 * theme customizer can select.
 *
 * The customizer swaps `ThemeOptions.font` at runtime, so the family has to be
 * **already loaded** when it is picked — fetching a stylesheet lazily on select
 * would paint the fallback stack first and reflow when the webfont lands. The
 * stylesheet is therefore requested once, at head level, with every preset family
 * declared; the `.woff2` files are still lazy (a browser only downloads the
 * families the page actually renders), so the cost is one small CSS document.
 *
 * The family list is derived from the engine's own preset tables, so a family
 * added to the customizer is covered here without a second edit. The weight list
 * covers the ones the docs actually write (`font-normal` … `font-black`); asking
 * for a weight a family does not have makes Google Fonts reject the whole
 * request, so the range stays inside what every preset ships.
 */
const presetFamilyValues: (string | undefined)[] = [
  ...Object.values(THEME_FONT_SANS),
  ...Object.values(THEME_FONT_HEADING),
  ...Object.values(THEME_FONT_MONO),
  ...Object.values(THEME_FONT_SERIF)
];

/** `system` maps to `undefined` in the preset tables — only real families are loaded. */
const PRESET_FAMILIES: string[] = [
  ...new Set(presetFamilyValues.filter((family: string | undefined): family is string => typeof family === 'string'))
];

/** the weights the docs stylesheet declares for every family (`font-normal` … `font-black`). */
const WEIGHTS = '400;500;600;700;800;900';

/** the URL shape Google Fonts expects for one family (`Inter` → `Inter:wght@…`). */
const familyQuery = (family: string): string => `family=${family.replace(/\s+/g, '+')}:wght@${WEIGHTS}`;

/**
 * The Google Fonts stylesheet URL covering every customizer family.
 *
 * `display=swap` keeps text readable while a family is still downloading; the
 * alternative (`block`) would hide the text instead.
 */
export const docsFontStylesheetUrl = `https://fonts.googleapis.com/css2?${PRESET_FAMILIES.map(familyQuery).join(
  '&'
)}&display=swap`;

/** the head links the docs need for font loading: two preconnects + the stylesheet. */
export const docsFontLinks: Array<Record<string, string>> = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
  { rel: 'stylesheet', href: docsFontStylesheetUrl }
];
