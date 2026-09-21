# @vean/theme

English | [中文](./README.zh-CN.md)

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/theme)](https://www.npmjs.com/package/@vean/theme)
[![npm downloads](https://img.shields.io/npm/dt/@vean/theme)](https://www.npmjs.com/package/@vean/theme)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

> The full design spec, token contract, and AI-agent handbook live in [docs/theme.md](../../docs/theme.md) (this README only covers package-level usage).

The Vean theme engine: **a static palette layer plus a semantic alias layer** — a declarative mapping table with no measurement and no correction.

> Status: ✅ Implemented (the first-generation engine is retired; this package is the only implementation, and [docs/theme.md](../../docs/theme.md) is the design authority).
> Adapters and runtime (UnoCSS preset, `SConfigProvider`, first-paint script, persistence, customizer panel) live in `@vean/unocss` and `@vean/ui`, not in this package.

## 📦 Installation

```bash
pnpm add @vean/theme
```

## 🧩 Three-Layer Model

| Layer        | Contents                                                                   | Output                                                                               |
| :----------- | :------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Palette**  | 26 palettes × 11 levels from `@soybeanjs/colord`, plus `white`/`black`     | `generatePaletteCss()` / `dist/palette.css` (static, cacheable forever)              |
| **Semantic** | 41 semantic tokens + 5 role ramps; values are **palette-level references** | `resolveThemeMap()` → `emitThemeCss()` (159 declarations ≈5.7 KB raw / gzip ≈1.2 KB) |
| **Literal**  | size / radius / spacing unit / layering / border width / font families     | emitted together with the semantic layer                                             |

Color variables are always **bare channels** (`--zinc-50: 0 0% 98%`); semantic tokens are only references (`--background: var(--zinc-50)`). Therefore:

- the palette layer can ship as a static artifact (switching a theme never recomputes it);
- the semantic layer is tiny — switching a theme only swaps references;
- when you need a full color, use `resolveTokenColor()` (a pure function; works in SSR / workers / canvas) — it reads the **same mapping table** as the CSS, so the two never diverge;
- consumers must always wrap values in a function: `hsl(var(--primary) / 0.5)` (a bare `var()` silently drops alpha).

## ⚙️ Core Mechanics

**No contrast guardrails**: every token's level is declared in `CORE_RULES` and `overrides` apply verbatim — the engine neither measures nor corrects. Readability is the theme author's responsibility; the customizer panel and `axe` are where it gets checked.

Surface levels are **fixed declarations** (`CORE_RULES`); there is no runtime "shift everything one step darker" knob: fine-tune an individual token with `overrides`, or go globally darker/lighter by changing the `base` palette or `surfaceStyle`.

## 📐 Dimension Scales

Two literal scales ([space-control-scale.md](../../docs/space-control-scale.md)):

| Scale            | Slots                                     | Value                                                                                                                                                                                                                                                                                                          |
| :--------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--spacing-unit` | — (the only spacing variable)             | Grid unit: `0.25rem` (default) or `calc(0.25rem * factor)`. The 18 slots are **coefficients** of this unit (mapped in UnoCSS's `theme.spacing`, no CSS variables emitted; at the default unit they equal UnoCSS's same-named values and extend downward).                                                      |
| `--radius-*`     | `2xs` … `4xl` (9 slots) + `none` / `full` | Positive-coefficient multiples of the seed (`calc(var(--radius) * 0.25…2.25)`, `md` = the seed itself); changing the seed moves the whole scale, and no seed can produce a negative slot — negative `border-radius` is an invalid value, so the declaration is dropped and the corner silently becomes square. |

On the UnoCSS side, spacing is exposed through both named and numeric keys (`gap-md` / `p-2xl` / `mt-3xs`), while radii are taken over as a whole family (`rounded-2xs` … `rounded-4xl`, `none` / `full`, plus `rounded` = the seed; `rounded-3xl` / `rounded-4xl` also come back to the theme — upstream fixed lengths don't move with the seed, and leaving them upstream would break the scale at `2xl`). Control heights are not theme-mapped: use UnoCSS's numeric `h-*` (20–56px, i.e. `h-5`…`h-14`, scaled by `size`). **Named slots and numeric classes share one source** (`gap-md` and `gap-4` both produce `calc(var(--spacing-unit) * 4)`), so the single `spacing` option drives both; `w-*` / `h-*` / `size-*` go through `theme.width` / `theme.height` and are unaffected by spacing.

## 🚀 Quick Start

```ts
import { resolveThemeMap, emitThemeCss, generatePaletteCss } from '@vean/theme';

// 1) Layer 1 (static, produced once at build time)
const paletteCss = generatePaletteCss({ format: 'hsl' });

// 2) Layer 2 (recomputed with the theme config)
const map = resolveThemeMap({ base: 'zinc', primary: 'indigo', surfaceStyle: 'layered' });
const themeCss = emitThemeCss(map); // token names carry no prefix by default; pass { prefix: 'acme' } when you need a namespace

// 3) When you need a full color (canvas / charts / color math)
import { resolveTokenColor } from '@vean/theme';
const primary = resolveTokenColor({ primary: 'indigo' }, 'primary', 'dark');
```

The UnoCSS-side color mapping (channel + `<alpha-value>` — the only shape in which alpha works):

```ts
const ref = (name: string, format: 'hsl' | 'oklch') => `${format}(var(${name}) / <alpha-value>)`;

theme.colors = {
  background: ref('--background', 'hsl'),
  'muted-foreground': ref('--muted-foreground', 'hsl'),
  'primary-500': ref('--primary-500', 'hsl'), // role ramp (50–950, follows the primary palette / scheme)
  indigo: { 500: ref('--indigo-500', 'hsl') }
};
```

## 🎛 Options

| Option                         | Default                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------------------------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base` / `primary`             | `zinc` / `indigo`       | Any of the 26 built-in palettes (`primary` switches to "near-black in light / near-white in dark" when set to a neutral palette)                                                                                                                                                                                                                                                                                                                               |
| `feedback`                     | `classic`               | Status-color scheme (see `FEEDBACK_SCHEMES`); chart colors have no scheme and derive from `primary` (`CHART_RAMP`)                                                                                                                                                                                                                                                                                                                                             |
| `overrides`                    | —                       | Per-token overrides as `{ light, dark }` (`TokenOverride`: `stone.950` / `white` / `hsl(...)` / `oklch(...)` / `token.primary` referencing another semantic token), highest priority; when emitting full colors the value is encoded as a channel in the theme format, alpha lands in the companion variable of the border family, and references copy the target value at resolution time (self-references / cycles are ignored like any other invalid value) |
| `surfaceStyle`                 | `layered`               | `flat` returns to the "page and container share one color, layered by borders and shadows" shape                                                                                                                                                                                                                                                                                                                                                               |
| `prefix`                       | `false`                 | Prefix for semantic variables; token names map one-to-one to shadcn by default (`--background` / `--card` / `--ring`…), and hosts that need a namespace pass a string                                                                                                                                                                                                                                                                                          |
| `size` / `radius` / `spacing`  | `md` / `md` / `default` | Root font size (density scaling, all dimensions) / radius seed (the 9-slot scale is `calc()`-derived from the seed; `md` is the seed) / **spacing grid unit** (presets `compact` 0.75 · `default` 1 · `relaxed` 1.25 · `spacious` 1.5, or any factor; moves padding / margin / gap / inset only — never font size, control height, or radius)                                                                                                                  |
| `borderOpacity`                | `1`                     | Multiplier for decorative border alpha                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `format`                       | `hsl`                   | Palette-layer format (`oklch` is smaller)                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `styleTarget` / `darkSelector` | `:root` / `class`       | Light-block selector / dark expression (`media` → `@media (prefers-color-scheme: dark)`)                                                                                                                                                                                                                                                                                                                                                                       |

## 🧪 Commands

```bash
pnpm --filter @vean/theme test        # layer invariants, emission contract, JS↔CSS parity, family split, dimension scales, budget
pnpm --filter @vean/theme typecheck
pnpm --filter @vean/theme build       # vp pack + dist/palette.css
```

## 📌 Not Yet Included

Custom palette registration (beyond the built-in 26) is deferred — use `overrides` to cover individual tokens for now. See `apps/docs/src/content/{en,zh}/ui/migration/` for the upgrade guide and docs-site content.

## 📖 Documentation

Design spec and AI-agent handbook: [docs/theme.md](../../docs/theme.md) · scale rationale: [docs/space-control-scale.md](../../docs/space-control-scale.md) · docs site: [veanui.com](https://veanui.com)

## 📄 License

MIT
