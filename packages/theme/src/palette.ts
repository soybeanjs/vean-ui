import { colord } from '@soybeanjs/colord';
import {
  paletteColorLevels,
  simplePalette,
  tailwindNeutralPaletteKeys,
  tailwindPalette,
  tailwindPaletteKeys
} from '@soybeanjs/colord/palette';
import type { TailwindPaletteKey } from '@soybeanjs/colord/palette';
import type { ColorFormat, PaletteKey, PaletteLevel, SimpleColorName } from './types';

/**
 * a palette entry as published by `@soybeanjs/colord` (`PaletteColorItem` is not
 * re-exported by the package, so the shape is declared structurally here).
 */
interface PaletteColorItem {
  level: number;
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
}

/**
 * Layer 1 (palette) data access.
 *
 * Every built-in palette level is exposed as a **naked channel** triple
 * (`240 4.8% 95.9%`) rather than a complete color, matching the library-wide
 * convention: consumers wrap it as `hsl(var(--zinc-100) / <alpha>)`. Naked
 * channels keep alpha composition available and avoid a second "complete color"
 * variable per token (see docs/theme.md §3.1).
 */

/**
 * the built-in palette keys, in colord order (26 keys).
 *
 * The key list and the family split both come straight from `@soybeanjs/colord`
 * (`tailwindPaletteKeys` / `tailwindNeutralPaletteKeys`): the palette table and
 * its classification live in one place, so a palette added upstream can never
 * drift from the engine's idea of which family it belongs to.
 */
export const PALETTE_KEYS: readonly PaletteKey[] = tailwindPaletteKeys;

/**
 * the neutral palettes: the ones that carry no hue and are used as the
 * page/surface family. A `primary` picked from this set switches the engine to
 * the "near-black in light, near-white in dark" brand form.
 */
export const NEUTRAL_PALETTES: readonly PaletteKey[] = tailwindNeutralPaletteKeys;

/** whether a palette belongs to the neutral family. */
export function isNeutralFamily(palette: string): boolean {
  return (NEUTRAL_PALETTES as readonly string[]).includes(palette);
}

/**
 * the built-in palette levels (11 levels, 50 … 950).
 */
export const PALETTE_LEVELS = paletteColorLevels as readonly PaletteLevel[];

/**
 * whether a value is a built-in palette key.
 */
export function isPaletteKey(value: unknown): value is PaletteKey {
  return typeof value === 'string' && value in tailwindPalette;
}

/**
 * whether a value is a built-in palette level.
 */
export function isPaletteLevel(value: unknown): value is PaletteLevel {
  return typeof value === 'number' && (paletteColorLevels as number[]).includes(value);
}

/**
 * strip the color function wrapper: `hsl(240 4.8% 95.9%)` → `240 4.8% 95.9%`.
 */
export function toChannel(value: string): string {
  return value.replace(/^[a-z]+\(/i, '').replace(/\)$/, '');
}

/**
 * whether a value is one of the simple names the palette layer ships as
 * **channels** (`white` / `black` → `--white` / `--black`), as opposed to the
 * keyword entries of `simplePalette` (`transparent` / `inherit` / `current`),
 * which have no channel form. Derived from colord's table: the keyword entries
 * are strings there, the color entries are objects.
 */
export function isSimpleColorName(value: unknown): value is SimpleColorName {
  return (
    typeof value === 'string' &&
    value in simplePalette &&
    typeof simplePalette[value as keyof typeof simplePalette] !== 'string'
  );
}

/**
 * the alpha of a complete color (`0.1` for `oklch(100% 0 0 / 0.1)`), or
 * `undefined` when colord cannot parse the value.
 */
export function colorAlpha(value: string): number | undefined {
  const color = colord(value);

  return color.isValid() ? color.alpha() : undefined;
}

/**
 * encode a complete color as the **channel triple** the token layer stores and
 * the Adapters consume (`hsl(var(--vean-x) / <alpha>)` needs channels, never a
 * complete color).
 *
 * This is the inverse of `toChannel` and the reason a complete-color override is
 * not emitted verbatim: `oklch(60% 0.2 250)` inside `--primary` would make
 * every consumption site (`hsl(var(--primary) / 1)`) invalid at
 * computed-value time — the declaration is dropped and the token silently
 * disappears (measured in Chromium; docs/theme.md §4.2).
 *
 * Returns `undefined` when colord cannot parse the value.
 */
export function colorChannels(value: string, format: ColorFormat): string | undefined {
  const color = colord(value);

  if (!color.isValid()) {
    return undefined;
  }

  // Alpha is dropped on purpose: a token is a channel triple, and the
  // consumption site composes its own alpha over it
  // (`hsl(var(--vean-x) / <alpha>)`) — keeping the value's own alpha would make
  // that `hsl(… / 0.5 / 1)`, which is invalid. Transparency travels through the
  // token's numeric companion (`ALPHA_TOKENS`) instead.
  const opaque = color.alpha(1);

  return toChannel(format === 'oklch' ? opaque.toOklchString() : opaque.toHslString());
}

/**
 * the colord entry of a palette level, or `undefined` for unknown keys/levels.
 */
function paletteItem(palette: PaletteKey, level: PaletteLevel): PaletteColorItem | undefined {
  return tailwindPalette[palette as TailwindPaletteKey]?.[level];
}

/**
 * the naked channel triple of a palette level, or `undefined` when unknown.
 */
export function paletteChannel(palette: PaletteKey, level: PaletteLevel, format: ColorFormat): string | undefined {
  const item = paletteItem(palette, level);

  return item ? toChannel(item[format]) : undefined;
}

/**
 * the complete color of a palette level, or `undefined` when unknown.
 */
export function paletteColor(palette: PaletteKey, level: PaletteLevel, format: ColorFormat): string | undefined {
  return paletteItem(palette, level)?.[format];
}

/**
 * the naked channel triple of `white` / `black`, or `undefined` when unknown.
 */
export function simpleChannel(name: SimpleColorName, format: ColorFormat): string {
  return toChannel(simplePalette[name][format]);
}

/**
 * the complete color of `white` / `black`.
 */
export function simpleColor(name: SimpleColorName, format: ColorFormat): string {
  return simplePalette[name][format];
}
