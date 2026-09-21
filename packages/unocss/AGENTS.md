# UNOCSS PRESET — @vean/unocss

## AI ASSISTANT BRIDGE

For any AI assistant editing files under `packages/unocss/`:

1. Read [docs/theme.md](../../docs/theme.md) **§0.4 (consumption)** and **§5 (the adapter)** before changing the mapping. The token contract itself belongs to `@vean/theme` — see [packages/theme/AGENTS.md](../theme/AGENTS.md).
2. For `**/*.{ts,tsx,js,jsx}` edits, also load the global `typescript-functional-style` skill.

**Package:** `packages/unocss/` → publishes as `@vean/unocss`
**Role:** The **single UnoCSS adapter** over `@vean/theme`. Token ownership stays in the theme package; this package only maps it into UnoCSS.

## BUILD

- No dev/src indirection: `exports` always resolves to `./dist/*`. After editing `src/`, run `pnpm build:libs` before downstream typecheck / test / docs dev.
- `vp pack` needs a local `raw-css-loader` plugin (declared in `vite.config.ts`) because `styles.css?raw` and `reset.css?raw` are imported as strings. Adding another `?raw` asset is fine; do not switch these to a Vue/Vite-only import style — the package builds for `platform: 'node'`.

## THE TWO RULES EVERY EMITTED UTILITY DEPENDS ON

1. **Colors must be `hsl(var(--vean-x) / <alpha-value>)`.** A bare `var()` makes UnoCSS drop the opacity modifier **silently** — so the function wrapper and the `<alpha-value>` slot are both mandatory. `buildThemeColors` / `buildThemePreflight` own this; `cssColorRef` is the variant for references that need a fixed alpha.
2. **The palette layer and the default alias block ship in the preflight**, so `--zinc-100` / `--background` resolve with **no runtime JS**. A themed (non-default) configuration is then injected on top by the provider. `uiCSS: true` is what adds that static layer — the docs app and `packages/ui/uno.config.ts` both set it. `apps/nuxt` deliberately omits it and instead loads the **built** stylesheet via `css: ['@vean/ui/styles.css']` in `nuxt.config.ts`, so there are two accepted ways to ship component styles; pick per consumer rather than assuming `uiCSS` is required.

## SPACING: THE ONE MAPPING THAT IS EASY TO GET WRONG

`buildThemeEntries` registers the **whole** spacing grid into `theme.spacing`, not just the named rungs. UnoCSS's preset-mini computes numeric spacing as `n × 0.25rem` **unless** `theme.spacing[n]` exists — and `directionSize` (padding / margin) plus `handleGap` consult it.

Registering only the named rungs would leave ~98% of the library's spacing (every `p-4`, `gap-2.5`) on the hard-coded `0.25rem` and ignore the `spacing` option entirely. So `p-4`, `gap-md`, and `spacing.DEFAULT` are all derived from the single `--spacing-unit` reference; coefficient `1` emits the bare unit reference. Keep it that way.

Keep the enumeration step finer than the unit (`SPACING_GRID_SUBDIVISIONS`): walking only the unit's multiples leaves every half step to preset-mini's `n × 0.25rem`, which is numerically identical at the default unit but **frozen** once a consumer moves `spacing` (`p-0.625` emitted `0.15625rem` while `p-0.75` scaled — 77 such usages across `packages/ui`). Extra keys emit no CSS until used.

The name/value parity guard against upstream UnoCSS lives in `test/theme.spec.ts` (it imports `theme as unoTheme` from `@unocss/preset-mini` to compare), which is why that guard is here and not in the theme package.

## API

- `presetUi(options?)` returns **an array of presets**, not a single preset: `presetWind3` + `presetAnimations` + `presetScrollbar` + optional `presetWebFonts` + the `vean-uno` self preset. It is designed to be spread as the entire `presets` array.
- `presetWind3` is always first and required — utility classes come from it, and the `darkSelector` option is translated by `resolveWind3Dark` into wind3's `dark` form (`'class'` / `'media'` / a custom selector).
- `uiCSS` / `globalCSS` / `resetCSS` are all **off by default**; each one adds a preflight section. `styles.css` (the library's own component styles) is always attached to the self preset's preflights.
- `presetVean({ cwd })` is a separate bridge that reads `vean.json` and forwards its `uno` block plus the four font roles into `presetUi`. Its font catalog is built from the engine's own `THEME_FONT_*` tables, so a family the engine knows resolves here without a second list.

## ANTI-PATTERNS

- **NO token vocabulary of its own** — every color key, literal, and rung comes from `@vean/theme` (`SEMANTIC_TOKENS`, `PALETTE_KEYS`, `RADIUS_RUNG_KEYS`, `SPACING_GRID_COEFFICIENTS`). Hand-written token or palette lists drift from the contract.
- **NO bundling of `@vean/theme` or `unocss`** — both are `neverBundle` in `vite.config.ts`.
- **NO minification of preflight CSS here** — preflight bodies are small; final minification happens in the consumer's build (`Vite build.cssMinify` / the uno CLI).
- **NO changes to the theme layer's semantics.** If a token needs a different level, that is `CORE_RULES` in `packages/theme` — this package must follow, never compensate.
