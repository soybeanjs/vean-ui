import { getDarkSelector, resolveColorScheme } from './shared';
import { literalVar } from './literals';
import { PALETTE_KEYS, PALETTE_LEVELS, colorChannels, paletteChannel, simpleChannel } from './palette';
import { ALPHA_TOKENS, ROLE_RAMP_ROLES } from './semantic';
import type {
  ColorFormat,
  EmitThemeOptions,
  LiteralToken,
  SemanticToken,
  StyleTarget,
  ThemeMap,
  ThemeMode,
  TokenPrefix,
  TokenValue
} from './types';

/**
 * CSS emission for the refactored engine (docs/theme.md §3, §5).
 *
 * Two artifacts:
 * - `generatePaletteCss` — Layer 1, the static palette table (26 × 11 + white/black)
 * - `emitThemeCss` — Layer 2, the semantic alias block (tiny, regenerated per theme)
 *
 * Color values are **naked channels**: semantic tokens reference palette levels
 * (`var(--zinc-100)`), palette tokens hold channel triples (`240 4.8% 95.9%`),
 * and consumers wrap them as `hsl(var(--…))` (see §3.1 for why).
 */

/**
 * emit options of the theme CSS.
 */
const prefixOf = (prefix: TokenPrefix | undefined): string => (prefix ? `--${prefix}-` : '--');

/**
 * the CSS variable name of a semantic token.
 */
export function tokenVar(token: SemanticToken, prefix: TokenPrefix | undefined): string {
  return `${prefixOf(prefix)}${token}`;
}

/**
 * render a token value as a CSS reference for a declaration.
 *
 * A complete-color override is the one value that is not already a channel: the
 * token layer stores channels and the adapters consume them wrapped
 * (`hsl(var(--vean-x) / <alpha>)`), so the color is encoded into the theme's
 * format here. Emitting it verbatim would invalidate every consumption site and
 * silently drop the token (docs/theme.md §4.2).
 */
function renderValue(value: TokenValue, format: ColorFormat): string {
  if (value.kind === 'palette') {
    return `var(--${value.palette}-${value.level})`;
  }

  if (value.kind === 'simple') {
    return `var(--${value.name})`;
  }

  return colorChannels(value.value, format) ?? value.value;
}

/**
 * the body of one block (declarations without the selector).
 */
function block(declarations: string[]): string {
  return declarations.filter(Boolean).join('\n');
}

/**
 * Layer 1 —— the static palette table.
 *
 * Emits every built-in palette level plus `white` / `black` as naked channels.
 */
export function generatePaletteCss(
  options: { format?: ColorFormat; styleTarget?: StyleTarget; weakSelectors?: boolean } = {}
): string {
  const { format = 'hsl', styleTarget = ':root', weakSelectors = false } = options;
  const selector = weakSelectors ? `:where(${styleTarget})` : styleTarget;
  const declarations = PALETTE_KEYS.flatMap(palette =>
    PALETTE_LEVELS.map(level => {
      const channel = paletteChannel(palette, level, format);

      return channel ? `  --${palette}-${level}: ${channel};` : '';
    })
  );

  declarations.push(`  --white: ${simpleChannel('white', format)};`);
  declarations.push(`  --black: ${simpleChannel('black', format)};`);

  return `${selector} {\n${block(declarations)}\n}`;
}

/**
 * Layer 2 —— the semantic alias block.
 *
 * The dark block only carries tokens whose value differs from light, so the diff
 * stays minimal (and, because everything is a reference, tiny).
 */
export function emitThemeCss(map: ThemeMap, options: EmitThemeOptions = {}): string {
  const { styleTarget = ':root', format = 'hsl', darkSelector = 'class', weakSelectors = false } = options;

  /**
   * `color-scheme` is what makes the UA-drawn surfaces (canvas, scrollbars, form
   * controls, autofill) follow the theme — a `.dark` class alone leaves them
   * light. The policy itself lives in `resolveColorScheme`, shared with the
   * first-paint script and the runtime watcher so the three cannot disagree.
   */
  const colorSchemeDeclaration = (mode: ThemeMode): string[] => {
    const value = resolveColorScheme(mode, darkSelector);

    return value ? [`  color-scheme: ${value};`] : [];
  };
  /** the block selector, optionally weakened to zero specificity. */
  const selectorOf = (mode: ThemeMode): string => {
    const base = mode === 'light' ? styleTarget : getDarkSelector(darkSelector);

    if (!weakSelectors || mode === 'dark') {
      return weakSelectors ? `:where(${base})` : base;
    }

    return `:where(${base})`;
  };
  const literalDeclarations = Object.entries(map.literal).map(
    ([token, value]) => `  ${literalVar(token as LiteralToken, options.prefix ?? false)}: ${value};`
  );

  const colorDeclarations = (mode: ThemeMode): string[] =>
    (Object.keys(map.light) as SemanticToken[]).map(token => {
      const value = map[mode][token];

      return `  ${tokenVar(token, options.prefix)}: ${renderValue(value, format)};`;
    });

  const alphaDeclarations = (mode: ThemeMode): string[] =>
    ALPHA_TOKENS.map(token => `  ${prefixOf(options.prefix)}${token}-alpha: ${map.alpha[token][mode]};`);

  /**
   * role ramps: `--{role}-{level}` referencing the palette that backs the
   * role (primary palette / the active feedback scheme's palette). Mode-free —
   * the palette layer itself does not vary by mode — so they emit once in the
   * light block. A role overridden with a complete color has no backing palette
   * and is skipped.
   */
  const rampDeclarations = ROLE_RAMP_ROLES.flatMap(role => {
    const value = map.light[role];

    if (value.kind !== 'palette') {
      return [];
    }

    return PALETTE_LEVELS.map(
      level => `  ${prefixOf(options.prefix)}${role}-${level}: var(--${value.palette}-${level});`
    );
  });

  const lightDeclarations = [
    ...colorSchemeDeclaration('light'),
    ...colorDeclarations('light'),
    ...rampDeclarations,
    ...alphaDeclarations('light'),
    ...literalDeclarations
  ];

  const darkDeclarations = [
    ...colorSchemeDeclaration('dark'),
    ...(Object.keys(map.light) as SemanticToken[])
      .filter(token => renderValue(map.dark[token], format) !== renderValue(map.light[token], format))
      .map(token => `  ${tokenVar(token, options.prefix)}: ${renderValue(map.dark[token], format)};`),
    ...alphaDeclarations('dark')
  ];

  return [
    `${selectorOf('light')} {\n${block(lightDeclarations)}\n}`,
    `${selectorOf('dark')} {\n${block(darkDeclarations)}\n}`
  ].join('\n\n');
}
