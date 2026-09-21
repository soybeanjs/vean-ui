# THEME ENGINE — @vean/theme

## AI ASSISTANT BRIDGE

For any AI assistant editing files under `packages/theme/`:

1. Read [docs/theme.md](../../docs/theme.md) **§0 first** — it is the AI-agent handbook for this package (code map, engine API, hard rules, common tasks, verification commands). §1–2 explain the difference from the legacy engine; §3+ is the current spec.
2. For `**/*.{ts,tsx,js,jsx}` edits, also load the global `typescript-functional-style` skill.

The remaining content here is package-local context an agent would otherwise get wrong. Normative token/engine rules live in `docs/theme.md`.

**Package:** `packages/theme/` → publishes as `@vean/theme`
**Role:** Theme engine. Turns a declarative contract (palette table + alias rules + literals) into a `ThemeMap` and emits CSS. **Pure functions: no DOM reads, no color measurement, no value correction.**

## BUILD ORDER

- This package has **no dev/src export indirection** — `exports` always resolves to `./dist/*`, unlike aria/ui/cli. After editing `src/`, run `pnpm build:libs` (root) before any downstream typecheck, test, or docs dev server, or consumers read stale output.
- `pnpm build` = `vp pack` + `pnpm build:palette`; the second step runs `scripts/emit-palette.mts` to write `dist/palette.css` (the Layer 1 static table). Format is a build-time choice: `PALETTE_FORMAT=hsl|oklch pnpm build`.

## THE THREE LAYERS

| Layer         | Where                                                   | Truth                                                                                                  |
| ------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Palette (L1)  | `src/palette.ts` + `src/emit.ts` (`generatePaletteCss`) | 26 colors × 11 levels, raw channels, static at build time. Never recomputed.                           |
| Semantic (L2) | `src/semantic.ts` (`CORE_RULES`, family arrays)         | Each token is a **reference** to a palette level, light/dark each. `src/theme-map.ts` is the pipeline. |
| Literals      | `src/literals.ts`, `src/defaults.ts`                    | Radius / spacing / layering / line width / font.                                                       |

`src/semantic.ts` is the single source of truth for token semantics — the engine, the UnoCSS mapping, and the acceptance tests all read from it. Adding a token means adding it there; UnoCSS and emission follow automatically (both are driven by `SEMANTIC_TOKENS`).

## HARD RULES

- **Change a level in `CORE_RULES`, never in emission logic or the snapshot.** The engine will not correct you — after changing a level, update the map snapshot deliberately (`cd packages/theme && pnpm exec vitest run -u`, per [docs/theme.md](../../docs/theme.md) §0.7), then confirm the default theme's per-value assertions still hold.
- **Radius rungs must emit as a positive multiple of the seed**: `calc(var(--radius) * k)`; `test/engine-features.spec.ts` asserts that shape with a regex, so an absolute length slips through only by failing the test. Radius rungs come from `LITERAL_DEFAULTS` filtered by `RADIUS_RUNG_KEYS` (`2xs`…`4xl`, 9 rungs).
- **The spacing family emits exactly one variable** — `spacing-unit` (= `SPACING_GRID`). The 18 rungs (`6xs`…`9xl`) are **coefficients** in `SPACING_GRID_COEFFICIENTS`, not tokens, and they feed `theme.spacing` in the UnoCSS mapping instead of the literal layer. Changing the unit therefore moves every rung and numeric utility class at once. The name/value parity guard against upstream UnoCSS lives in the `@vean/unocss` adapter tests, not here.
- **Control heights are deliberately not a literal family** (see [docs/space-control-scale.md](../../docs/space-control-scale.md) §3.1): the 8 heights equal the numeric scale (`h-5`…`h-14`) and have zero in-repo consumers. `engine-features.spec.ts` asserts no `literal` key contains `control`.
- **Do not hand-write palette lists or level arrays** — keys come from `@soybeanjs/colord` (`tailwindPaletteKeys`, `tailwindNeutralPaletteKeys`, `paletteColorLevels`).
- **Semantic tokens are unprefixed** (`--background`, `--card`, `--radius`, `--chart-1`). The library's own component-scoped variables keep the `--vean-` namespace (`--vean-sidebar-width`, `--vean-scrollbar-*`). A `var(--vean-background)` is a **stale reference** that silently drops the declaration; `test/token-usage.spec.ts` scans the whole workspace for this, so realign rather than adding an exception.
- **`control` is ambiguous**: it is a _slot name_ (switch / checkbox / radio-group / carousel / form / input / textarea / tags-input / input-number), unrelated to fill tokens. Bulk renames must skip it.
- **No `!important`** — the static layer uses `:where()` to sit at zero specificity so a plain selector wins.
- **One writer only**: the `__VEAN_THEME` envelope is owned by the provider's debounced writer. Do not write localStorage from components.
- **Contrast is not guaranteed by the engine.** Levels are declared, and `overrides` apply verbatim; the engine neither measures nor reports. Swapping to a light primary (yellow / lime / emerald…) requires verifying text readability yourself.

## CONSUMERS (do not bypass)

1. **Class names (preferred)** — UnoCSS utilities: `bg-card`, `text-card-foreground`, `border-input`, `bg-destructive/10`, `bg-primary-500/30`.
2. **Full color in CSS** — must be wrapped: `hsl(var(--primary) / 0.5)`. A bare `var(--primary)` as a color fails silently (the channel is not a color, and UnoCSS drops the alpha).
3. **Color values in JS** — use `resolveTokenColor` / `resolveThemeColors` / `resolveColorRef`. The output contains **no** full-color twin variables (`--{token}-solid` does not exist).

The emission contract lives in `packages/unocss/src/theme.ts` (the single UnoCSS adapter — see that package's `AGENTS.md`), and the runtime UI wiring in `packages/ui/src/theme/`.

## TESTS

`test/` covers four concerns, all happy-dom: `engine-map` (map resolution + emission + snapshot), `engine-features` (`resolveSizeValue` / `resolveSpacingValue` / guard helpers), `runtime` (storage envelope + first-paint script), `token-usage` (the unprefixed-vocabulary scan across the workspace). Run with `pnpm --filter @vean/theme test`.
