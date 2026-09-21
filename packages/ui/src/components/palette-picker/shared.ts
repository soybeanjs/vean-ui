import { colord } from '@soybeanjs/colord';
import {
  generateNearestPalette,
  paletteColorLevels,
  simplePalette,
  tailwindPalette,
  tailwindPaletteKeys
} from '@soybeanjs/colord/palette';
import type { PaletteColorLevel, SimplePaletteKey, TailwindPaletteKey } from '@soybeanjs/colord/palette';
import type { ColorFormat, ColorValue } from '@vean/theme';
import type { PaletteSelectValue } from './types';

/**
 * the simple palette keys — taken from colord's own table (same order), so the
 * picker and the color library can never disagree about the set.
 */
export const SIMPLE_KEYS = Object.keys(simplePalette) as readonly SimplePaletteKey[];

/**
 * the tailwind palette keys.
 */
export const TAILWIND_KEYS: readonly TailwindPaletteKey[] = tailwindPaletteKeys;

/**
 * the default level used when a tailwind key is selected.
 */
export const DEFAULT_LEVEL: PaletteColorLevel = 500;

export const isTailwindKey = (value: string): value is TailwindPaletteKey => Object.hasOwn(tailwindPalette, value);

export const isSimpleKey = (value: string): value is SimplePaletteKey =>
  (SIMPLE_KEYS as readonly string[]).includes(value);

/**
 * parse a `${key}.${level}` color value into its parts, or `null`.
 */
export function parseTailwindValue(value: string): { key: TailwindPaletteKey; level: PaletteColorLevel } | null {
  const [key, level] = value.split('.');

  if (!isTailwindKey(key)) {
    return null;
  }

  const numeric = Number(level);

  if (!paletteColorLevels.includes(numeric as PaletteColorLevel)) {
    return null;
  }

  return { key, level: numeric as PaletteColorLevel };
}

/**
 * derive the top-selector value from a `ColorValue`.
 */
export function deriveSelectValue(value: ColorValue): PaletteSelectValue {
  const str = String(value);
  const [key] = str.split('.');

  if (isTailwindKey(key)) {
    return key;
  }

  if (isSimpleKey(str)) {
    return str;
  }

  return 'custom';
}

/**
 * derive the tailwind level from a `ColorValue`, defaulting to {@link DEFAULT_LEVEL}.
 */
export function deriveTailLevel(value: ColorValue): PaletteColorLevel {
  return parseTailwindValue(String(value))?.level ?? DEFAULT_LEVEL;
}

/**
 * derive the nearest tailwind palette level for a raw color, defaulting to
 * {@link DEFAULT_LEVEL}. Used to keep the custom palette selection in sync
 * with the color chosen in the color picker.
 */
export function deriveNearestLevel(color: string, format: ColorFormat): PaletteColorLevel {
  if (!colord(color).isValid()) {
    return DEFAULT_LEVEL;
  }

  try {
    // `generateNearestPalette` exposes `level` as a numeric type but yields a
    // string at runtime (object-key iteration), so coerce it back to a number.
    return Number(generateNearestPalette(color, outputFormatOf(format)).level) as PaletteColorLevel;
  } catch {
    return DEFAULT_LEVEL;
  }
}

/**
 * serialize a raw color into the `ColorValue` string form for the given format.
 */
export function serializeColor(color: string, format: ColorFormat): ColorValue {
  return (format === 'oklch' ? colord(color).toOklchString() : colord(color).toHslString()) as ColorValue;
}

/**
 * the `@soybeanjs/colord` output format key matching a theme {@link ColorFormat}.
 */
export const outputFormatOf = (format: ColorFormat): 'oklchString' | 'hslString' =>
  format === 'oklch' ? 'oklchString' : 'hslString';

/**
 * the `PaletteColorItem` field matching a theme {@link ColorFormat}.
 */
export const itemColorKeyOf = (format: ColorFormat): 'oklch' | 'hsl' => (format === 'oklch' ? 'oklch' : 'hsl');

/**
 * resolve a `ColorValue` to a CSS color string for swatch rendering.
 */
export function toCssColor(value: ColorValue): string {
  const str = String(value);

  if (str === 'inherit' || str === 'current' || str === 'transparent') {
    return 'transparent';
  }

  const parsed = parseTailwindValue(str);

  if (parsed) {
    return tailwindPalette[parsed.key][parsed.level].hsl;
  }

  if (str === 'black') {
    return simplePalette.black.hex;
  }

  if (str === 'white') {
    return simplePalette.white.hex;
  }

  return colord(str).toHex();
}

/**
 * resolve a simple palette key to a CSS color string for swatch rendering.
 */
export function simpleCssColor(key: SimplePaletteKey): string {
  const value = simplePalette[key];

  if (typeof value === 'string') {
    return 'transparent';
  }

  return value.hex;
}
