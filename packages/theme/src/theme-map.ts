import { colord } from '@soybeanjs/colord';
import { isPaletteLevelRef, resolveRadiusValue, resolveSizeValue, resolveSpacingValue } from './shared';
import { DEFAULT_OPTIONS } from './defaults';
import { literalTokens } from './literals';
import { colorAlpha, isNeutralFamily, isSimpleColorName } from './palette';
import { feedbackScheme, splitLevelRef } from './schemes';
import {
  ALPHA_RULES,
  ALPHA_TOKENS,
  BORDER_ALPHA_TOKENS,
  CHART_RAMP,
  CHART_TOKENS,
  CORE_RULES,
  STATUS_FOREGROUND_LEVELS,
  STATUS_NAMES,
  STATUS_SUFFIXES,
  isSemanticToken
} from './semantic';
import type { StatusName } from './semantic';
import type {
  AlphaToken,
  FeedbackSchemeKey,
  LiteralToken,
  PaletteKey,
  PaletteLevel,
  SemanticToken,
  SurfaceStyle,
  ThemeMap,
  ThemeMode,
  ThemeOptions,
  TokenRule,
  TokenValue
} from './types';

/**
 * Resolve the theme map (docs/theme.md §1, §3, §4.2).
 *
 * Pipeline: declared level rules → region mirrors → overrides → literal
 * (non-colour) layer. **No measurement pass**: every token's level is declared
 * in `CORE_RULES` (or derived from the feedback scheme), so the same options
 * always produce the same map and nothing in the output depends on what the
 * palette happens to measure — there is no contrast guard (docs/theme.md §4.3).
 */

/**
 * resolve a `level` rule to a token value, honoring the neutral-`primary`
 * override.
 */
function resolveLevelRule(
  rule: Extract<TokenRule, { kind: 'level' }>,
  context: { mode: ThemeMode; base: PaletteKey; primary: PaletteKey }
): TokenValue {
  const { mode, base, primary } = context;
  // 中性色板是品牌色时，填充与它上面的文字都要换档（`primary` 与 `primary-foreground`
  // 各自声明 `neutral` 分支）：判据是"这条规则声明了 neutral"，而不是它的取色来源。
  const neutral = rule.neutral !== undefined && isNeutralFamily(primary);
  const level = neutral && rule.neutral ? rule.neutral : rule;
  const nominal = mode === 'light' ? level.light : level.dark;
  const palette = rule.source === 'base' ? base : primary;

  return nominal === 'white' ? { kind: 'simple', name: 'white' } : { kind: 'palette', palette, level: nominal };
}

/**
 * the `surfaceStyle: 'flat'` extremes: the pre-refactor look where the raised
 * surfaces sit on the page tone instead of being separated from it.
 */
function flatOverrides(mode: ThemeMode, base: PaletteKey): Partial<Record<SemanticToken, TokenValue>> {
  const extreme = (level: PaletteLevel): TokenValue => ({ kind: 'palette', palette: base, level });

  return {
    background: mode === 'light' ? { kind: 'simple', name: 'white' } : extreme(950),
    card: mode === 'light' ? { kind: 'simple', name: 'white' } : extreme(900),
    popover: mode === 'light' ? { kind: 'simple', name: 'white' } : extreme(900)
  };
}

/**
 * the palette of a status role, taken from the feedback scheme so schemes stay
 * swappable (`red.500` → palette `red`).
 */
function statusPalette(schemeValue: string | undefined, fallback: PaletteKey): PaletteKey {
  const palette = schemeValue?.split('.')[0];

  return (palette || fallback) as PaletteKey;
}

/**
 * build the declared token map of one mode.
 */
function buildNominalMap(options: {
  mode: ThemeMode;
  base: PaletteKey;
  primary: PaletteKey;
  feedback: FeedbackSchemeKey;
  surfaceStyle: SurfaceStyle;
}): Partial<Record<SemanticToken, TokenValue>> {
  const { mode, base, primary, feedback, surfaceStyle } = options;
  const entries: [SemanticToken, TokenValue][] = [];

  Object.entries(CORE_RULES).forEach(([name, rule]) => {
    const token = name as SemanticToken;

    if (rule.kind === 'level') {
      entries.push([token, resolveLevelRule(rule, { mode, base, primary })]);

      return;
    }

    if (rule.kind === 'simple') {
      entries.push([token, { kind: 'simple', name: mode === 'light' ? rule.light : rule.dark }]);

      return;
    }

    // `mirror` 在镜像阶段解析
  });

  const statusValues = (mode === 'light' ? feedbackScheme(feedback).light : feedbackScheme(feedback).dark) ?? {};

  STATUS_NAMES.forEach((name: StatusName) => {
    const schemeValue = statusValues[name];
    const palette = statusPalette(schemeValue, base);
    const solidLevel = (schemeValue ? splitLevelRef(schemeValue).level : 500) as PaletteLevel;

    entries.push([name, { kind: 'palette', palette, level: solidLevel }]);

    // 实心上的文字按模式翻档：填充在暗色下会**变浅**（`{c}.500` → `{c}.400`），
    // 文字若恒定近白就把间隙压没了（实测 1.34–2.65:1，全部低于 3:1 的 UI 底线）。
    // 详见 STATUS_FOREGROUND_LEVELS 的注释。
    entries.push([
      `${name}-foreground` as SemanticToken,
      { kind: 'palette', palette: base, level: STATUS_FOREGROUND_LEVELS[mode] }
    ]);
  });

  // 图表系列：primary 色板的固定五档（CHART_RAMP），模式无关 —— 色板层本身不区分模式。
  // primary 选中性色板时图表即为一条中性灰阶，与"中性即品牌色"的设定一致。
  CHART_TOKENS.forEach(token => {
    entries.push([token, { kind: 'palette', palette: primary, level: CHART_RAMP[token] }]);
  });

  const nominal = Object.fromEntries(entries) as Partial<Record<SemanticToken, TokenValue>>;

  return surfaceStyle === 'flat' ? { ...nominal, ...flatOverrides(mode, base) } : nominal;
}

/**
 * assert the map carries every semantic token.
 *
 * A missing key means a stage silently dropped it (the pre-refactor
 * `sidebarDerive: false` bug class), so it fails loudly instead of emitting a
 * half-themed stylesheet.
 */
function requireComplete(map: Partial<Record<SemanticToken, TokenValue>>): Record<SemanticToken, TokenValue> {
  const missing = (Object.keys({ ...CORE_RULES }) as SemanticToken[])
    .concat(
      STATUS_NAMES.flatMap(name => STATUS_SUFFIXES.map(suffix => `${name}${suffix}` as SemanticToken)),
      [...CHART_TOKENS]
    )
    .filter(token => map[token] === undefined);

  if (missing.length > 0) {
    throw new Error(`[@vean/theme] theme map is missing tokens: ${missing.join(', ')}`);
  }

  return map as Record<SemanticToken, TokenValue>;
}

/**
 * resolve the region mirrors from the declared global tokens.
 */
function resolveMirrors(
  map: Partial<Record<SemanticToken, TokenValue>>,
  mode: ThemeMode
): Partial<Record<SemanticToken, TokenValue>> {
  const rules = Object.entries(CORE_RULES).filter(([, rule]) => rule.kind === 'mirror');

  return rules.reduce<Partial<Record<SemanticToken, TokenValue>>>(
    (acc, [token, rule]) => {
      if (rule.kind !== 'mirror') {
        return acc;
      }

      const target = (mode === 'light' ? rule.light : rule.dark) as SemanticToken;
      const value = map[target];

      return value ? { ...acc, [token]: value } : acc;
    },
    { ...map }
  );
}

/**
 * the literal (non-color) layer: dimension, elevation shadows, motion, layering
 * and typography tokens (docs/theme.md §3.11).
 */
function buildLiterals(options: ThemeOptions): Record<LiteralToken, string> {
  return literalTokens({
    size: resolveSizeValue(options.size),
    radius: resolveRadiusValue(options.radius),
    spacingUnit: resolveSpacingValue(options.spacing),
    font: options.font,
    prefix: options.prefix ?? DEFAULT_OPTIONS.prefix
  });
}

/**
 * whether an override value is the `token.${name}` reference form (docs/theme.md §4.2).
 */
function isTokenRefForm(value: string): boolean {
  return value.startsWith('token.');
}

/**
 * parse a `token.${name}` reference into the target semantic token, or
 * `undefined` when the name is outside the contract (`token.ghost`).
 *
 * A **self-reference** (`token.primary` on `primary`) is rejected here so it
 * never becomes a map entry — same path as any other unrepresentable value.
 */
function parseTokenRef(value: string, source: SemanticToken): SemanticToken | undefined {
  if (!isTokenRefForm(value)) {
    return undefined;
  }

  const name = value.slice('token.'.length);

  if (!isSemanticToken(name) || name === source) {
    return undefined;
  }

  return name as SemanticToken;
}

/**
 * parse an override value into a token value, or `undefined` when the value is
 * not part of the vocabulary (`ColorValue`, docs/theme.md §4.2).
 *
 * - a `palette.level` reference stays a reference, so the palette layer can still
 *   be swapped;
 * - a simple palette name (`white` / `black`) keeps its palette-layer reference
 *   (`var(--white)`), which is what the channels live in;
 * - any other **complete color** is kept as-is for the JS resolver and is turned
 *   into channels at emission time — a token is
 *   consumed as `hsl(var(--vean-x) / <alpha>)`, so emitting a complete color
 *   verbatim makes every one of those declarations invalid;
 * - `token.${name}` never reaches this function (handled as a reference in
 *   `applyOverrides`);
 * - anything else (malformed refs, unparseable colors) is ignored: leaving the
 *   nominal value in place is the only non-destructive option, and the
 *   alternative — emitting a dangling `var(--…)` — is a silent failure.
 */
function parseOverride(value: string): TokenValue | undefined {
  if (isPaletteLevelRef(value)) {
    const { palette, level } = splitLevelRef(value);

    return { kind: 'palette', palette, level };
  }

  if (isSimpleColorName(value)) {
    return { kind: 'simple', name: value };
  }

  return colord(value).isValid() ? { kind: 'color', value } : undefined;
}

/**
 * follow a chain of `token.*` references to its non-reference end, or
 * `undefined` when the chain closes on itself (self-ref is already filtered;
 * this catches multi-token cycles).
 */
function resolveRefTarget(
  start: SemanticToken,
  refMap: ReadonlyMap<SemanticToken, SemanticToken>
): SemanticToken | undefined {
  const visited = new Set<SemanticToken>([start]);
  let current = start;

  for (;;) {
    const nextHop = refMap.get(current);

    if (nextHop === undefined) {
      return current;
    }

    if (visited.has(nextHop)) {
      return undefined;
    }

    visited.add(nextHop);
    current = nextHop;
  }
}

/**
 * apply explicit overrides on top of the declared map.
 *
 * An override is user intent and wins outright — with the guard gone there is
 * nothing to correct it against, and nothing to report either (a theme either
 * declares readable levels or it does not, docs/theme.md §4.3).
 *
 * Two passes: colour values first, then `token.*` references (snapshot copy of
 * the target's `TokenValue`). Invalid refs — unknown name, self-reference, or a
 * cycle — are dropped so the nominal (or colour-overridden) value stays.
 */
function applyOverrides(
  map: Record<SemanticToken, TokenValue>,
  overrides: Partial<Record<SemanticToken, string>> | undefined,
  mode: ThemeMode
): {
  map: Record<SemanticToken, TokenValue>;
  alpha: Partial<Record<AlphaToken, number>>;
} {
  /**
   * Only contract tokens may enter the map. `overrides` is a public field typed
   * as `Partial<Record<SemanticToken, …>>`, but the type is erased: a persisted
   * envelope written by another vocabulary (or a plain JS caller) can carry any
   * key. Spreading one in emits a declaration for a token that does not exist,
   * and - because overrides may cover a single mode - leaves the *other* mode
   * without that key, which makes the emitter's dark-block diff read `undefined`
   * and throw (docs/theme.md §6.2).
   */
  const entries = (Object.entries(overrides ?? {}) as [SemanticToken, string][]).filter(([token]) =>
    isSemanticToken(token)
  );

  if (entries.length === 0) {
    return { map, alpha: {} };
  }

  /**
   * A fully transparent color (`transparent`, or `… / 0`) is representable only
   * where the token owns an alpha companion (the border family, where it means
   * "invisible border"). Anywhere else the channels alone would render as black,
   * so the override is ignored instead of silently painting the wrong color.
   */
  const isAlphaToken = (token: string): boolean => (ALPHA_TOKENS as readonly string[]).includes(token);

  const refEntries = entries
    .map(([token, value]) => [token, parseTokenRef(value, token)] as const)
    .filter((entry): entry is readonly [SemanticToken, SemanticToken] => entry[1] !== undefined);
  const colourEntries = entries.filter(([, value]) => !isTokenRefForm(value));

  const overridden = Object.fromEntries(
    colourEntries
      .map(([token, value]) => [token, parseOverride(value)] as const)
      .filter((entry): entry is readonly [SemanticToken, TokenValue] => entry[1] !== undefined)
      .filter(([token, value]) => value.kind !== 'color' || isAlphaToken(token) || (colorAlpha(value.value) ?? 1) > 0)
  ) as Partial<Record<SemanticToken, TokenValue>>;

  /**
   * An override that targets the border family and carries its own alpha
   * (`oklch(100% 0 0 / 0.1)`) patches that token's numeric companion: the
   * channels cannot hold the alpha (see `colorChannels`), and this is what the
   * documented `border` override in the theming guide means. Without the patch
   * the transparency would be silently dropped.
   */
  const directAlpha = Object.fromEntries(
    colourEntries
      .filter(([token]) => isAlphaToken(token))
      .map(([token, value]) => [token, colorAlpha(value)] as const)
      .filter((entry): entry is readonly [AlphaToken, number] => entry[1] !== undefined && entry[1] < 1)
  ) as Partial<Record<AlphaToken, number>>;

  const refMap = new Map(refEntries);
  const resolvedRefs = refEntries.flatMap(([source]) => {
    const target = resolveRefTarget(source, refMap);
    const value = target === undefined ? undefined : (overridden[target] ?? map[target]);

    return value === undefined ? [] : ([[source, value]] as const);
  });

  /**
   * When the source owns an alpha companion, the ref copies the target's
   * effective alpha (explicit colour override, else the target's design rule).
   * A non-alpha target leaves the source on its own `ALPHA_RULES` default —
   * `input: 'token.primary'` must not inherit mask/border concentration by
   * accident.
   */
  const refAlpha = refEntries.flatMap(([source]) => {
    if (!isAlphaToken(source)) {
      return [];
    }

    const target = resolveRefTarget(source, refMap);

    if (target === undefined || !isAlphaToken(target)) {
      return [];
    }

    const alpha = target in directAlpha ? directAlpha[target as AlphaToken] : ALPHA_RULES[target as AlphaToken][mode];

    return alpha === undefined ? [] : ([[source, alpha]] as const);
  });

  return {
    map: { ...map, ...overridden, ...Object.fromEntries(resolvedRefs) },
    alpha: { ...directAlpha, ...Object.fromEntries(refAlpha) }
  };
}

/**
 * resolve the full theme map for the given options.
 */
export function resolveThemeMap(options: ThemeOptions = {}): ThemeMap {
  const base = (options.base ?? DEFAULT_OPTIONS.base) as PaletteKey;
  const primary = (options.primary ?? DEFAULT_OPTIONS.primary) as PaletteKey;
  const surfaceStyle: SurfaceStyle = options.surfaceStyle ?? DEFAULT_OPTIONS.surfaceStyle;
  const feedback = (options.feedback ?? DEFAULT_OPTIONS.feedback) as FeedbackSchemeKey;
  const borderOpacity = options.borderOpacity ?? DEFAULT_OPTIONS.borderOpacity;
  const literal = buildLiterals(options);

  const buildMode = (
    mode: ThemeMode
  ): {
    map: Record<SemanticToken, TokenValue>;
    alpha: Partial<Record<AlphaToken, number>>;
  } => {
    const nominal = buildNominalMap({
      mode,
      base,
      primary,
      feedback,
      surfaceStyle
    });

    // 区域镜像从（已声明的）全局值派生，随后才是用户覆盖
    const mirrored = resolveMirrors(nominal, mode);

    const overridden = applyOverrides(
      requireComplete(mirrored),
      mode === 'light' ? options.overrides?.light : options.overrides?.dark,
      mode
    );

    return { map: overridden.map, alpha: overridden.alpha };
  };

  const light = buildMode('light');
  const dark = buildMode('dark');

  return {
    light: light.map,
    dark: dark.map,
    // `borderOpacity` 是"发丝线浓度"旋钮，只作用于边框族；mask 的浓度是它自己的
    // 设计值（0.25 / 0.30），跟着走会让"调淡边框"顺带调淡模态遮罩
    alpha: Object.fromEntries(
      Object.entries(ALPHA_RULES).map(([token, values]) => {
        const scale = (BORDER_ALPHA_TOKENS as readonly string[]).includes(token) ? borderOpacity : 1;
        const key = token as AlphaToken;

        return [
          key,
          {
            light: (light.alpha[key] ?? values.light) * scale,
            dark: (dark.alpha[key] ?? values.dark) * scale
          }
        ];
      })
    ) as ThemeMap['alpha'],
    literal
  };
}
