import { SPACING_GRID, THEME_RADIUS, THEME_SIZE, THEME_SPACING, DARK_SELECTOR } from './defaults';
import { isPaletteKey, isPaletteLevel } from './palette';
import type {
  DarkSelectorValue,
  PaletteLevelRef,
  ThemeMode,
  ThemeRadiusValue,
  ThemeSizeValue,
  ThemeSpacing,
  ThemeSpacingValue
} from './types';

/**
 * Small pure helpers shared by the engine: base-token resolution, dark selector
 * resolution and override parsing.
 */

/** resolve a size token into a CSS length. */
export function resolveSizeValue(size: ThemeSizeValue | undefined, fallback: ThemeSizeValue = 'md'): string {
  const value = size ?? fallback;

  if (value in THEME_SIZE) {
    return `${THEME_SIZE[value as keyof typeof THEME_SIZE]}px`;
  }

  return value;
}

/** resolve a radius token into a CSS length seed. */
export function resolveRadiusValue(radius: ThemeRadiusValue | undefined, fallback: ThemeRadiusValue = 'md'): string {
  const value = radius ?? fallback;

  if (value in THEME_RADIUS) {
    return THEME_RADIUS[value as keyof typeof THEME_RADIUS];
  }

  return value;
}

/** whether a value is a spacing preset key. */
export function isThemeSpacing(value: unknown): value is ThemeSpacing {
  return typeof value === 'string' && Object.hasOwn(THEME_SPACING, value);
}

/**
 * resolve a spacing token into the CSS length of the grid unit.
 *
 * `1` emits the bare grid (`0.25rem`), so the default alias block stays exactly
 * what it was before the unit existed; anything else is a `calc()` on that same
 * grid. Either way the value is a rem length, which is what keeps the family
 * scaling with the density knob.
 */
export function resolveSpacingValue(
  spacing: ThemeSpacingValue | undefined,
  fallback: ThemeSpacingValue = 'default'
): string {
  const value = spacing ?? fallback;
  const scale = typeof value === 'number' ? value : isThemeSpacing(value) ? THEME_SPACING[value] : undefined;

  if (scale === undefined || !Number.isFinite(scale) || scale <= 0) {
    return SPACING_GRID;
  }

  return scale === 1 ? SPACING_GRID : `calc(${SPACING_GRID} * ${scale})`;
}

/**
 * resolve a dark selector value into the CSS rule it produces.
 *
 * - `class` → `.dark`
 * - `media` → `@media (prefers-color-scheme: dark)`
 * - anything else is used verbatim (e.g. `[data-theme="dark"]`)
 */
export function getDarkSelector(value: DarkSelectorValue): string {
  if (value === 'class' || value === 'media') {
    return DARK_SELECTOR[value as 'class' | 'media'];
  }

  return value;
}

/**
 * resolve a dark selector into the **class name** the runtime should toggle.
 *
 * - `class` (the keyword) → `dark`
 * - `media` → `null` (the media query follows the OS; toggling a class would be
 *   a no-op at best and could misfire other `.dark` rules at worst)
 * - any other selector is used verbatim with the leading dot stripped
 */
export function darkClassName(selector: DarkSelectorValue): string | null {
  if (selector === 'media') {
    return null;
  }

  if (selector === 'class') {
    return 'dark';
  }

  return selector.replace(/^\./, '');
}

/**
 * resolve the `color-scheme` a mode's block should advertise, or `null` when the
 * block carries none.
 *
 * In `media` mode a single pinned value would be wrong: the dark tokens live
 * under `@media (prefers-color-scheme: dark)`, so the light block advertises both
 * schemes (`light dark`) and the UA picks, exactly as `color-scheme` intends. In
 * class / custom-selector mode each block pins its own scheme.
 *
 * One function for three readers — the CSS emitter, the first-paint script and
 * the runtime class watcher. They must agree: `color-scheme` drives the
 * UA-drawn surfaces (canvas, scrollbars, form controls, autofill), and an
 * **inline** style outranks every selector, so a stale inline value written at
 * first paint silently wins over the `.dark` block forever after.
 */
export function resolveColorScheme(mode: ThemeMode, darkSelector: DarkSelectorValue): string | null {
  if (darkSelector === 'media') {
    return mode === 'light' ? 'light dark' : null;
  }

  return mode === 'light' ? 'light' : 'dark';
}

/**
 * the `color-scheme` the **document** should carry for a resolved mode.
 *
 * Deliberately not the same question as {@link resolveColorScheme}: that one
 * answers "what does *this block* declare", and the media-mode dark block
 * declares nothing because it already sits inside
 * `@media (prefers-color-scheme: dark)`. The document has no such hole — in
 * media mode it must advertise `light dark` for **both** resolved modes,
 * otherwise the OS flipping while the app is open would leave a pinned inline
 * value behind (and an inline style outranks the media query's own block).
 *
 * So the two must not be folded together: one is per-block, this is per-document.
 */
export function resolveDocumentColorScheme(mode: ThemeMode, darkSelector: DarkSelectorValue): string {
  if (darkSelector === 'media') {
    return 'light dark';
  }

  return mode === 'light' ? 'light' : 'dark';
}

/**
 * whether a string is a `palette.level` reference.
 *
 * Membership, not just shape: a reference that names no built-in palette level
 * (`not-a-palette.999`, `zinc.999`) has no channel to alias, so accepting it
 * would emit a dangling `var(--zinc-999)` — and the JS resolver would return
 * nothing for the same token, breaking the "JS and CSS never disagree"
 * invariant (docs/design/theme.md §3.1). Both halves come from colord's tables.
 */
export function isPaletteLevelRef(value: string): value is PaletteLevelRef {
  const [palette, level] = value.split('.');

  return isPaletteKey(palette) && isPaletteLevel(Number(level));
}
