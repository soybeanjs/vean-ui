# UI STYLED LAYER — @vean/ui

## AI ASSISTANT BRIDGE

For any AI assistant editing files under `packages/ui/`:

1. Load the project skill at `.agents/skills/vean-ui-develop/` — start with `SKILL.md`, then `layers.md` (UI layer section) as the task requires.
2. For `**/*.{ts,tsx,js,jsx}` edits, also load the global `typescript-functional-style` skill.
3. For `**/*.vue` edits, also load the global `typescript-functional-style` and `vue-sfc-structure` skills.
4. For `packages/ui/src/components/**`, the nearer `packages/ui/src/components/AGENTS.md` narrows the exact UI-component rule set.

The remaining content in this file is package knowledge and local context. Normative component rules live in the skill.

**Package:** `packages/ui/` → publishes as `@vean/ui`
**Role:** Styled wrappers over aria primitives. UnoCSS + @soybeanjs/cva.

## COMPONENT PATTERN

Every styled component follows this flow:

1. Import aria component(s) from `@vean/aria`
2. Define the style recipe in `packages/ui/src/styles/{name}.ts` with `cv()` / `scv()` (MUST have `// @unocss-include` at top)
3. In wrapper SFC: `useOmitProps` to separate style props from logic props
4. Inject UI tokens: `provideXUi(ui)` where `ui` = computed slot→class map
5. Merge classes: single-class wrappers use `${name}Variants({...}, props.class)`; multi-slot wrappers pass `props.ui` and `{ root: props.class }` directly into the recipe call
6. Import or re-export wrapper-facing component types from `@vean/aria/{component}` sub-paths, and import aria global types from `@vean/aria/types`, then rerun `pnpm sui gen catalog` after public export changes

## STRUCTURE

```
packages/ui/src/
├── components/   # ~94 family directories / ~140 S-prefixed exports (SButton, SDialog...); catalog authority: generated `constants/components.ts`
│   └── [name]/   # index.ts, *.vue, types.ts
├── styles/       # cv/scv recipe files consumed by wrappers
├── theme/        # size context, ThemeColor/ThemeSize. See theme/AGENTS.md
├── constants/    # UI-layer constants
├── nuxt/         # Nuxt module (auto-registration)
├── resolver/     # unplugin-vue-components resolver
└── index.ts      # Barrel: all components + theme exports
```

## VARIANTS

`@soybeanjs/cva` recipe definitions per component:

- `base` / `slots` — default classes
- `variants` — `color`, `size`, `variant` axes
- `compoundVariants` — conditional combos
- `defaultVariants` — fallback values

Size uses `ThemeSize` (`xs|sm|md|lg|xl|2xl`). Color uses `ThemeColor` (8 values including `primary`, `destructive`, `success`, etc.).

Shared class tokens (not component recipes) live in `_*.ts` files next to recipes: `_field.ts` for form chrome, `_overlay.ts` for floating popup chrome. Recipes reuse those fragments, or inherit a sibling recipe via `extend` / `alias` / `extendBase`. Do not extract a new `_*.ts` unless the same fragment is copied across unrelated recipes.

## INTEGRATIONS

- **Nuxt**: `@vean/ui/nuxt` module for auto component registration
- **unplugin**: `@vean/ui/resolver` for `unplugin-vue-components`
- **CSS**: `@vean/ui/styles.css` — built by `unocss build` step
- **Generated component names**: `packages/ui/src/constants/components.ts` is generated from `packages/ui/src/index.ts`; rerun `pnpm sui gen catalog` after changing public UI exports

## ANTI-PATTERNS

- **NO `<style>` blocks or raw CSS** — UnoCSS classes only
- **NO ARIA/state logic** — belongs in the aria layer
- **NO prop redefinition** — extend aria props via `types.ts`
