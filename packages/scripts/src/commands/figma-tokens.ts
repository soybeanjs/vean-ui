import { colord } from '@soybeanjs/colord';
import {
  LITERAL_DEFAULTS,
  PALETTE_KEYS,
  PALETTE_LEVELS,
  SPACING_GRID_COEFFICIENTS,
  SPACING_RUNGS,
  paletteColor,
  resolveThemeColors,
  resolveThemeMap,
  simpleColor
} from '@vean/theme';
import type { LiteralToken, PaletteKey, SimpleColorName, ThemeMode } from '@vean/theme';

/**
 * Design-token export for Figma (docs/figma.md).
 *
 * Ported from the same `resolveThemeMap` / `resolveThemeColors` the CSS emitter
 * uses, so the design artifact and the stylesheet can never disagree — the
 * engine's own JS resolution exists for exactly this ("exporting a theme to a
 * non-CSS target", packages/theme/src/resolve.ts).
 *
 * Two deliberate projection decisions, both documented in docs/figma.md:
 *
 * 1. **Values are resolved, not referenced.** The CSS layer aliases semantic
 *    tokens to palette channels (`--background: var(--zinc-50)`); here every
 *    token carries its final color. A DTCG alias (`{"$value": "{palette.zinc.50}"}`)
 *    is valid and would keep the file re-themable in Figma, but it also makes the
 *    import depend on resolution order and on Figma's alias handling. Shipping a
 *    compound, always-importable file first; an alias mode is the follow-up.
 * 2. **No alpha companions.** The CSS contract splits the border family into a
 *    channel variable plus a numeric one (`hsl(var(--border) / var(--border-alpha))`)
 *    because naked channels are what CSS needs. Figma colors carry alpha
 *    natively, so the color token already holds it and a second numeric variable
 *    would be a knob nothing reads.
 *
 * A third projection: the radius ladder is `calc(var(--radius) * <coefficient>)`
 * in CSS, which no design tool can express. It is flattened to `px` against the
 * default seed (and the default root font size), which is also why the export
 * always uses the engine defaults rather than a caller-supplied theme.
 */

/** precision used for DTCG sRGB components, so the file has no float noise. */
const SRGB_PRECISION = 6;

/** precision used for flattened lengths (px). */
const LENGTH_PRECISION = 3;

/** a DTCG color value, per the Format Module 2025.10 (`$type: "color"`). */
export type FigmaColorValue = {
  colorSpace: 'srgb';
  components: number[];
  alpha: number;
  hex: string;
};

/** a DTCG dimension value. Figma's importer only accepts `px`. */
export type FigmaDimensionValue = {
  value: number;
  unit: 'px';
};

export type FigmaTokenType = 'color' | 'dimension' | 'fontFamily' | 'number';

export type FigmaTokenValue = FigmaColorValue | FigmaDimensionValue | number | string;

export type FigmaToken = {
  $type: FigmaTokenType;
  $value: FigmaTokenValue;
};

/** a DTCG group: nested groups of tokens. Figma reads a name per group segment. */
export type FigmaTokenGroup = {
  [name: string]: FigmaToken | FigmaTokenGroup;
};

/** the files Figma's per-mode import consumes, plus the flat CSS mirror. */
export type FigmaTokenDocuments = {
  /** the light-mode document. */
  light: FigmaTokenGroup;
  /** the dark-mode document: identical shape, different `color` group. */
  dark: FigmaTokenGroup;
  /** resolved custom properties, `:root` light / `.dark` dark. */
  css: string;
};

const roundTo = (value: number, precision: number): number => {
  const factor = 10 ** precision;

  return Math.round(value * factor) / factor;
};

const toHexChannel = (channel: number): string => Math.round(channel).toString(16).padStart(2, '0');

/**
 * convert a resolved CSS color into a DTCG sRGB color value.
 *
 * Figma's importer accepts HSL and sRGB; sRGB byte components are what a Figma
 * color variable holds. `hex` is the spec's fallback field, which the format
 * module requires to be 6-digit "to avoid conflicts with the provided alpha
 * value" — so it is rebuilt opaque from the same bytes rather than taken from
 * `colord`'s `toHex()`, which widens to 8 digits once alpha drops below 1.
 */
function toColorToken(cssColor: string): FigmaToken {
  const color = colord(cssColor);

  if (!color.isValid()) {
    throw new Error(`[sui gen figma] "${cssColor}" is not a parsable color.`);
  }

  const { r, g, b, alpha } = color.toRgb();

  return {
    $type: 'color',
    $value: {
      colorSpace: 'srgb',
      components: [
        roundTo(r / 255, SRGB_PRECISION),
        roundTo(g / 255, SRGB_PRECISION),
        roundTo(b / 255, SRGB_PRECISION)
      ],
      alpha: roundTo(alpha, SRGB_PRECISION),
      hex: `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`
    }
  };
}

const toDimensionToken = (value: number): FigmaToken => ({
  $type: 'dimension',
  $value: { value, unit: 'px' }
});

const toNumberToken = (value: number): FigmaToken => ({ $type: 'number', $value: value });

const PX_LENGTH = /^([\d.]+)px$/;
const REM_LENGTH = /^([\d.]+)rem$/;

/** resolve an absolute `px` length (the root font size itself). */
function pxLength(length: string): number {
  if (length === '0') {
    return 0;
  }

  const match = PX_LENGTH.exec(length);

  if (!match) {
    throw new Error(`[sui gen figma] the root font size must be an absolute px length, got "${length}".`);
  }

  return roundTo(Number(match[1]), LENGTH_PRECISION);
}

/**
 * resolve a CSS length into `px`.
 *
 * `rem` is resolved against the theme's own root font size (`--size`), which is
 * the same relationship the browser applies — the theme sets the root font-size
 * from that token, so `0.5rem` is `0.5 × size`.
 */
function lengthToPx(length: string, rootFontSizePx: number): number {
  if (length === '0') {
    return 0;
  }

  const px = PX_LENGTH.exec(length);

  if (px) {
    return roundTo(Number(px[1]), LENGTH_PRECISION);
  }

  const rem = REM_LENGTH.exec(length);

  if (!rem) {
    throw new Error(`[sui gen figma] cannot flatten "${length}" into px.`);
  }

  return roundTo(Number(rem[1]) * rootFontSizePx, LENGTH_PRECISION);
}

const RADIUS_CALC = /^calc\(var\(--radius\) \* ([\d.]+)\)$/;

/**
 * the coefficient a radius rung multiplies the seed by, or `null` when the rung
 * is not part of the ladder (`none` / `full`).
 *
 * Read out of `LITERAL_DEFAULTS` rather than restated, so the export follows the
 * ladder if the engine re-tiers it — an unrecognized shape throws instead of
 * silently emitting a wrong radius.
 */
function radiusCoefficient(value: string): number | null {
  if (value === 'var(--radius)') {
    return 1;
  }

  const match = RADIUS_CALC.exec(value);

  return match ? Number(match[1]) : null;
}

/** the first family of a CSS font stack, which is all Figma can hold. */
function primaryFontFamily(stack: string): string {
  const [first = ''] = stack.split(',');

  return first.trim().replace(/^["']|["']$/g, '');
}

const RADIUS_TOKENS = Object.keys(LITERAL_DEFAULTS).filter(key => key.startsWith('radius-')) as LiteralToken[];

function buildRadiusGroup(literal: Record<LiteralToken, string>, rootFontSizePx: number): FigmaTokenGroup {
  const seedPx = lengthToPx(literal.radius, rootFontSizePx);

  return Object.fromEntries(
    RADIUS_TOKENS.map(token => {
      const coefficient = radiusCoefficient(LITERAL_DEFAULTS[token]);

      return [
        token.slice('radius-'.length),
        coefficient === null
          ? toDimensionToken(lengthToPx(literal[token], rootFontSizePx))
          : toDimensionToken(roundTo(coefficient * seedPx, LENGTH_PRECISION))
      ];
    })
  );
}

function buildSpacingGroup(literal: Record<LiteralToken, string>, rootFontSizePx: number): FigmaTokenGroup {
  const unitPx = lengthToPx(literal['spacing-unit'], rootFontSizePx);

  return {
    unit: toDimensionToken(unitPx),
    ...Object.fromEntries(
      SPACING_RUNGS.map(rung => [
        rung,
        toDimensionToken(roundTo(SPACING_GRID_COEFFICIENTS[rung] * unitPx, LENGTH_PRECISION))
      ])
    )
  };
}

function buildLineGroup(literal: Record<LiteralToken, string>, rootFontSizePx: number): FigmaTokenGroup {
  return {
    border: toDimensionToken(lengthToPx(literal['border-width'], rootFontSizePx)),
    'border-strong': toDimensionToken(lengthToPx(literal['border-width-strong'], rootFontSizePx)),
    ring: toDimensionToken(lengthToPx(literal['ring-width'], rootFontSizePx)),
    'ring-offset': toDimensionToken(lengthToPx(literal['ring-offset-width'], rootFontSizePx))
  };
}

function buildFontGroup(literal: Record<LiteralToken, string>): FigmaTokenGroup {
  return Object.fromEntries(
    (['sans', 'heading', 'mono', 'serif'] as const).map(role => [
      role,
      { $type: 'fontFamily', $value: primaryFontFamily(literal[`font-${role}`]) } satisfies FigmaToken
    ])
  );
}

function buildZGroup(literal: Record<LiteralToken, string>): FigmaTokenGroup {
  return {
    layout: toNumberToken(Number(literal['z-layout'])),
    base: toNumberToken(Number(literal['z-base'])),
    toast: toNumberToken(Number(literal['z-toast'])),
    max: toNumberToken(Number(literal['z-max']))
  };
}

/** Layer 2: the 41 semantic tokens of one mode, as resolved colors. */
function buildColorGroup(mode: ThemeMode): FigmaTokenGroup {
  const colors = resolveThemeColors({}, mode, 'hsl');

  return Object.fromEntries(Object.entries(colors).map(([token, cssColor]) => [token, toColorToken(cssColor)]));
}

/** the two simple colors, which live in the palette layer as `var(--white)`. */
const SIMPLE_COLORS: readonly SimpleColorName[] = ['white', 'black'];

/** Layer 1: every built-in palette level, mode-invariant. */
function buildPaletteGroup(): FigmaTokenGroup {
  const paletteTokens = (key: PaletteKey) =>
    Object.fromEntries(
      PALETTE_LEVELS.map(level => {
        const cssColor = paletteColor(key, level, 'hsl');

        if (!cssColor) {
          throw new Error(`[sui gen figma] palette ${key}.${level} has no color to export.`);
        }

        return [`${level}`, toColorToken(cssColor)];
      })
    );
  const simpleTokens = SIMPLE_COLORS.map(name => [name, toColorToken(simpleColor(name, 'hsl'))] as const);

  return Object.fromEntries([...PALETTE_KEYS.map(key => [key, paletteTokens(key)] as const), ...simpleTokens]);
}

/**
 * build the DTCG document of one mode.
 *
 * The palette and literal layers do not vary by mode, which is why both mode
 * files carry identical token sets: Figma only creates a variable when every
 * imported file defines the same name with the same type.
 */
export function buildFigmaTokenDocument(mode: ThemeMode): FigmaTokenGroup {
  const map = resolveThemeMap();
  const literal = map.literal;
  const rootFontSizePx = pxLength(literal.size);

  return {
    color: buildColorGroup(mode),
    palette: buildPaletteGroup(),
    radius: buildRadiusGroup(literal, rootFontSizePx),
    spacing: buildSpacingGroup(literal, rootFontSizePx),
    size: { root: toDimensionToken(rootFontSizePx) },
    font: buildFontGroup(literal),
    line: buildLineGroup(literal, rootFontSizePx),
    z: buildZGroup(literal)
  };
}

const CSS_BANNER = [
  '/*',
  ' * Generated by `pnpm sui gen figma` — do not edit by hand.',
  ' *',
  ' * The resolved theme as plain custom properties: semantic colors (light in',
  ' * `:root`, dark in `.dark`) followed by the literal layer. Values are complete',
  ' * colors and lengths — not the channel references the library ships — so a',
  ' * CSS-variable importer can turn each one into a Figma variable directly.',
  ' *',
  ' * The full token set, including the palette layer and the DTCG structure, is in',
  ' * `light.json` / `dark.json`.',
  ' */'
].join('\n');

function toCssBlock(selector: string, declarations: Array<[string, string]>): string {
  const body = declarations.map(([name, value]) => `  --${name}: ${value};`).join('\n');

  return `${selector} {\n${body}\n}`;
}

/** the flat CSS mirror of the theme (see `CSS_BANNER`). */
export function buildFigmaTokenCss(): string {
  const map = resolveThemeMap();
  const light = resolveThemeColors({}, 'light', 'hsl');
  const dark = resolveThemeColors({}, 'dark', 'hsl');
  const literalDeclarations = Object.entries(map.literal) as Array<[string, string]>;

  return `${[
    CSS_BANNER,
    toCssBlock(':root', [...Object.entries(light), ...literalDeclarations]),
    toCssBlock(
      '.dark',
      Object.entries(dark).filter(([token, cssColor]) => light[token as keyof typeof light] !== cssColor)
    )
  ].join('\n\n')}\n`;
}

/** build every Figma artifact in one pass, so the three files cannot diverge. */
export function buildFigmaTokenDocuments(): FigmaTokenDocuments {
  return {
    light: buildFigmaTokenDocument('light'),
    dark: buildFigmaTokenDocument('dark'),
    css: buildFigmaTokenCss()
  };
}
