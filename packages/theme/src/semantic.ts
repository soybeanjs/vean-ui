import type { PaletteLevel, TokenRule } from './types';

/**
 * The semantic token vocabulary: names, level rules and the region mirrors.
 *
 * This module is the **single source of truth** for token semantics — the
 * engine, the UnoCSS mapping and the acceptance tests all read from here
 * (docs/design/theme.md §3).
 *
 * Names are the shadcn vocabulary, unprefixed: `background` / `card` /
 * `popover` for the elevation axis, `muted` / `accent` / `secondary` for fills,
 * `foreground*` for text, `border` / `input` / `ring` for lines.
 */

/**
 * the four status roles.
 */
export const STATUS_NAMES = ['destructive', 'success', 'warning', 'info'] as const;

/**
 * a status role name.
 */
export type StatusName = (typeof STATUS_NAMES)[number];

/**
 * the roles that carry a full 50–950 palette ramp (`--{role}-{level}`),
 * referencing the palette that backs the role: `primary` follows the primary
 * palette, the statuses follow the active feedback scheme's palette.
 */
export const ROLE_RAMP_ROLES = ['primary', ...STATUS_NAMES] as const;
export type RoleRampRole = (typeof ROLE_RAMP_ROLES)[number];

/**
 * the two token suffixes every status exposes: the solid fill and the text
 * drawn on it (docs/design/theme.md §3.6).
 *
 * A status is a **solid role**: `--destructive` is the fill and
 * `--destructive-foreground` the on-solid text, exactly as in shadcn. The
 * derived `-text` / `-subtle` / `-border` roles of the first v2 vocabulary are
 * gone — a softer status treatment is composed from the fill
 * (`bg-destructive/10 text-destructive border-destructive/30`) or from the
 * role's own ramp (`--destructive-600`). Pressed states use the fill with an
 * alpha modifier (`active:bg-destructive/90`).
 */
export const STATUS_SUFFIXES = ['', '-foreground'] as const;

/**
 * a status token name, e.g. `destructive-foreground`.
 */
export type StatusToken = `${StatusName}${(typeof STATUS_SUFFIXES)[number]}`;

/**
 * the chart series derivation: each `chart-N` is a level of the **primary**
 * palette (docs/design/theme.md §3.8).
 *
 * A chart series is a monochrome ramp of the brand hue rather than a palette of
 * its own, so re-colouring the charts is the same knob as re-colouring the brand:
 * `primary: 'indigo'` → `--chart-1: var(--indigo-600)`. Levels step 600 → 200
 * (series 1 → 5) so adjacent series stay ordered by lightness alone, and they
 * are mode-free — the palette layer they reference is mode-free too.
 */
export const CHART_RAMP = {
  'chart-1': 600,
  'chart-2': 500,
  'chart-3': 400,
  'chart-4': 300,
  'chart-5': 200
} as const satisfies Record<string, PaletteLevel>;

/**
 * a chart token name.
 */
export type ChartToken = keyof typeof CHART_RAMP;

/**
 * the chart tokens in declaration order.
 */
export const CHART_TOKENS = Object.keys(CHART_RAMP) as ChartToken[];

/**
 * the elevation axis, ordered from "closest to the page" to "furthest": the
 * invariant `lum(background) < lum(card) ≤ lum(popover)` must hold in both
 * modes (docs/design/theme.md §3.1).
 */
export const SURFACE_TOKENS = ['background', 'card', 'popover'] as const;

/**
 * the fill (interactive) axis plus its content roles.
 */
export const FILL_TOKENS = ['muted', 'accent', 'accent-foreground', 'secondary', 'secondary-foreground'] as const;

/**
 * the text roles (the `foreground` ladder).
 *
 * `foreground` / `muted-foreground` are the two tiers of neutral text
 * (docs/design/theme.md §3.3); the weaker emphasis levels are expressed as an alpha on
 * the same token (`text-muted-foreground/70`), so there is no third tier.
 *
 * `card-foreground` / `popover-foreground` exist because shadcn's raised
 * surfaces are addressed by name (`text-card-foreground`,
 * `text-popover-foreground`): they are **mirrors** of `foreground` in both
 * modes, so a surface still carries exactly one text value and the guard
 * verifies each pair against its own surface.
 */
export const TEXT_TOKENS = [
  'foreground',
  'muted-foreground',
  'card-foreground',
  'popover-foreground',
  'carbon-foreground'
] as const;

/**
 * the line / focus roles.
 */
export const LINE_TOKENS = ['border', 'input', 'ring'] as const;

/**
 * the brand roles.
 */
export const BRAND_TOKENS = ['primary', 'primary-foreground'] as const;

/**
 * the inverted surface (its content role is `carbon-foreground`). The name
 * `carbon` is the historical one (restored by decision); the value semantics —
 * mode-flipped high-contrast surface — are unchanged.
 */
export const CARBON_TOKENS = ['carbon'] as const;

/**
 * the modal mask (the dimmed layer behind a modal surface).
 *
 * It is a **surface-agnostic black**: the token holds the black channels and
 * carries its concentration in the numeric companion (`--mask-alpha`, 0.25 light
 * / 0.30 dark), so one token replaces the `bg-black/25 dark:bg-black/30`
 * duplication that every modal overlay used to restate (docs/design/theme.md §3.1 / §3.10).
 */
export const MASK_TOKENS = ['mask'] as const;

/**
 * the region (region axis) roles: the sidebar mirrors global roles and adds the
 * two shadcn pairs that make a sidebar self-sufficient (docs/design/theme.md §3.9).
 */
export const REGION_TOKENS = [
  'sidebar',
  'sidebar-foreground',
  'sidebar-border',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-ring'
] as const;

/**
 * a region token name.
 */
export type RegionToken = (typeof REGION_TOKENS)[number];

/**
 * the border family: the tokens that carry a numeric alpha companion.
 *
 * All three hold a **translucent white** in dark mode (the pre-refactor
 * hairline: `oklch(100% 0 0 / 0.1)` for the lines, `/ 0.15` for `input`); a
 * naked channel cannot carry alpha inside one variable, so each pairs with
 * `--{token}-alpha` and consumers compose them
 * (`hsl(var(--border) / var(--border-alpha))`, docs/design/theme.md §3.4).
 *
 * `borderOpacity` scales this whole family and nothing else.
 */
export const BORDER_ALPHA_TOKENS = ['border', 'sidebar-border', 'input'] as const;

/**
 * every token that owns a numeric alpha companion: the border family plus the
 * mask.
 *
 * The mechanism is the same (channels in the token variable, concentration in
 * `-alpha`), which is what makes `bg-mask` and `border-border` both themeable
 * without restating an alpha in component code.
 */
export const ALPHA_TOKENS = [...BORDER_ALPHA_TOKENS, ...MASK_TOKENS] as const;

/**
 * an alpha-bearing token name.
 */
export type AlphaToken = (typeof ALPHA_TOKENS)[number];

/**
 * every non-status, non-chart token, in declaration order.
 */
export const CORE_TOKENS = [
  ...SURFACE_TOKENS,
  ...MASK_TOKENS,
  ...FILL_TOKENS,
  ...TEXT_TOKENS,
  ...LINE_TOKENS,
  ...BRAND_TOKENS,
  ...CARBON_TOKENS,
  ...REGION_TOKENS
] as const;

/**
 * a core (non-status, non-chart) token name.
 */
export type CoreToken = (typeof CORE_TOKENS)[number];

/**
 * every semantic token name: core + status × 2 roles + charts.
 */
export type SemanticToken = CoreToken | StatusToken | ChartToken;

/**
 * whether a string is a token of the current contract.
 *
 * The runtime companion of the `SemanticToken` type: the type is erased at
 * runtime, so every entry point that accepts a token **name** from the outside
 * (a persisted envelope, a hand-written `overrides` object) has to check
 * membership before the value can reach the emitter — an unknown key would
 * otherwise be spread into the mode map and emitted as a declaration for a token
 * that does not exist (and, when only one mode is overridden, make the emitter
 * read `undefined` for the other mode and throw, docs/design/theme.md §6.2).
 */
export const isSemanticToken = (value: string): value is SemanticToken =>
  (SEMANTIC_TOKENS as readonly string[]).includes(value);

/**
 * all semantic tokens, in declaration order — the completeness contract used by
 * the acceptance tests (`SEMANTIC_TOKENS.every(token => token in map)`).
 */
export const SEMANTIC_TOKENS = [
  ...CORE_TOKENS,
  ...STATUS_NAMES.flatMap(name => STATUS_SUFFIXES.map(suffix => `${name}${suffix}` as StatusToken)),
  ...CHART_TOKENS
] as readonly SemanticToken[];

/**
 * level rules of the core tokens.
 *
 * A rule is one of: a palette level (`{ source: 'base', light: 100, dark: 950 }`),
 * a mirror of another semantic token (`{ mirror: { light: 'background', … } }`),
 * a simple palette key (`white` / `black`), an on-solid pair decided by the
 * guard, or a raw channel fragment.
 */
export const CORE_RULES: Record<CoreToken, TokenRule> = {
  // —— elevation axis ——
  // 亮色页面取 {b}.50（近白，而非重构前的 `white`）：唯一一处对重构前外观的有意偏离
  background: { kind: 'level', source: 'base', light: 50, dark: 950 },
  card: { kind: 'level', source: 'base', light: 'white', dark: 900 },
  // 暗色与 card 同档：重构前 card / popover 同为 {b}.900，层级靠阴影而非提亮分离
  popover: { kind: 'level', source: 'base', light: 'white', dark: 900 },
  mask: { kind: 'simple', light: 'black', dark: 'black' },
  // —— fills ——
  // 弱档（`{b}.100` / `{b}.800`）留给静态弱化面与瞬时交互面：`muted` 与 `accent` 同档是有意的
  // （对齐 shadcn 默认），瞬时可见性由配方的 alpha 阶梯承担（docs/design/theme.md §3.2）。
  muted: { kind: 'level', source: 'base', light: 100, dark: 800 },
  accent: { kind: 'level', source: 'base', light: 100, dark: 800 },
  'accent-foreground': { kind: 'level', source: 'base', light: 900, dark: 50 },
  // 强档（亮 `{b}.200`）留给**静态实心填充**：`secondary` 是次级按钮 / badge / tag / alert
  // 的静止面，亮色下直接压在白 `card` 上（弱档只有 Δ11，白底上读不出"这是个填充"），所以抬一档。
  // **只抬亮色**：暗色的弱档（`{b}.800`）在 `card`（`{b}.900`）上已经有 Δ15，chip 读得出来，
  // 再抬到 `{b}.700` 会跳成 Δ43 的亮块，与暗色克制的表面阶梯不符 —— 两模式独立定档有先例
  // （`primary` 选中性色板时也是亮 800 / 暗 200）。
  // 代价（亮色，有意接受）：与 `border` / `input` 同档，`bg-secondary` 元素身上的 `border-border`
  // 会与填充同色；库内这类元素本来就用 `border-secondary-foreground/50`（tag / alert）或
  // `border-secondary`（stepper），唯一需要跟着改的是"靠 `bg-border` 与 `bg-secondary` 对比表达
  // 完成度"的地方（`stepper` 的 completed separator，已改用 `secondary-foreground`）。
  secondary: { kind: 'level', source: 'base', light: 200, dark: 800 },
  'secondary-foreground': { kind: 'level', source: 'base', light: 900, dark: 50 },
  // —— text ladder ——
  foreground: { kind: 'level', source: 'base', light: 900, dark: 50 },
  // 600 而非 500：`{b}.500` 在 `muted`（`{b}.100`）上只有 4.39:1，读不到 AA 的 4.5
  'muted-foreground': { kind: 'level', source: 'base', light: 600, dark: 400 },
  // 卡片 / 浮层文字 = 全局正文（shadcn 的同名 token 也是同一个值）：镜像而非独立定档，
  // 因此"表面上的文字"始终只有一档，换 base 色板不会让两级分叉
  'card-foreground': { kind: 'mirror', light: 'foreground', dark: 'foreground' },
  'popover-foreground': { kind: 'mirror', light: 'foreground', dark: 'foreground' },
  'carbon-foreground': { kind: 'level', source: 'base', light: 50, dark: 900 },
  // —— lines / focus ——
  // border / sidebar-border / input 三者暗色都是半透明白（重构前的发丝线），
  // 走 ALPHA_TOKENS 的数值伴生变量；亮色则是色板级别
  border: { kind: 'level', source: 'base', light: 200, dark: 'white' },
  input: { kind: 'level', source: 'base', light: 200, dark: 'white' },
  // 亮色 / 暗色都取 500：`{p}.400` 在 `background`（`{b}.50`）上只有 2.86:1、
  // `{p}.900` 叠在 `card` 上只有 1.55:1，两者都过不了 UI 边界需要的 3:1
  ring: { kind: 'level', source: 'primary', light: 500, dark: 500 },
  // —— brand ——
  // 500 是 shadcn 谱系的习惯档位（旧引擎同为 500）。
  primary: {
    kind: 'level',
    source: 'primary',
    light: 500,
    dark: 500,
    neutral: { light: 800, dark: 200 }
  },
  // 实心上的文字：亮暗都取 base 最浅档（贴白）。唯一的例外是 primary 选中性色板时——
  // 那一支的暗色填充会变成浅档（`{p}.200`），白字读不出来，所以取最深档。
  'primary-foreground': {
    kind: 'level',
    source: 'base',
    light: 50,
    dark: 50,
    neutral: { light: 50, dark: 950 }
  },
  // —— carbon surface（反相表面，原 `inverse`，§12-9 复原旧名）——
  carbon: { kind: 'level', source: 'base', light: 800, dark: 100 },
  // —— region (mirrors global roles) ——
  sidebar: { kind: 'mirror', light: 'background', dark: 'muted' },
  'sidebar-foreground': { kind: 'mirror', light: 'foreground', dark: 'foreground' },
  'sidebar-border': { kind: 'mirror', light: 'border', dark: 'border' },
  'sidebar-accent': { kind: 'mirror', light: 'accent', dark: 'accent' },
  'sidebar-accent-foreground': {
    kind: 'mirror',
    light: 'accent-foreground',
    dark: 'accent-foreground'
  },
  'sidebar-primary': { kind: 'mirror', light: 'primary', dark: 'primary' },
  'sidebar-primary-foreground': {
    kind: 'mirror',
    light: 'primary-foreground',
    dark: 'primary-foreground'
  },
  'sidebar-ring': { kind: 'mirror', light: 'ring', dark: 'ring' }
};

/**
 * the numeric alpha companion of every alpha-bearing token.
 *
 * Dark mode draws hairline whites (`oklch(100% 0 0 / 0.1)` before the refactor),
 * which cannot carry alpha inside a single channel variable
 * (`hsl(var(--vean-x) / a)` requires `--vean-x` to be alpha-free), hence a separate
 * numeric variable (docs/design/theme.md §4.4). `borderOpacity` scales the border
 * family; the mask's concentration is a design value of its own (0.25 light /
 * 0.30 dark) and is deliberately not tied to that knob.
 */
export const ALPHA_RULES: Record<AlphaToken, { light: number; dark: number }> = {
  border: { light: 1, dark: 0.1 },
  'sidebar-border': { light: 1, dark: 0.1 },
  input: { light: 1, dark: 0.15 },
  mask: { light: 0.25, dark: 0.3 }
};

/**
 * the level a status's on-solid text takes, per mode.
 *
 * The fill and its content move in **opposite** directions, which is why this
 * cannot be one constant: a status fill *lightens* in dark mode (`{c}.500` →
 * `{c}.400`) so it stands off a dark page, and text that stayed near-white would
 * close the gap instead of opening it — measured at 1.34–2.65:1 across the
 * shipped schemes, every one of them below the 3:1 UI floor. Flipping the text
 * with the mode (light `.50`, dark `.900`) puts all 20 scheme × status
 * combinations above 4.5:1 (worst 6.41:1).
 *
 * Light mode keeps the near-white content of a solid primary — a solid status
 * reads as a high-contrast chip there, and `{b}.900` would turn it into a pale
 * tint, which is a different visual language. That side carries the contrast
 * caveat documented in §3.6 (bright fills like `green.500` / `amber.500` sit at
 * 2.06–3.60:1); use `overrides` where AA matters.
 */
export const STATUS_FOREGROUND_LEVELS: { light: PaletteLevel; dark: PaletteLevel } = {
  light: 50,
  dark: 900
};
