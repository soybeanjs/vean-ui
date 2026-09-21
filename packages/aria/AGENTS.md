# ARIA PACKAGE — @vean/aria

## AI ASSISTANT BRIDGE

For any AI assistant editing files under `packages/aria/`:

1. Load the project skill at `.agents/skills/vean-ui-develop/` — start with `SKILL.md`, then `layers.md` (Aria section) as the task requires.
2. For `**/*.{ts,tsx,js,jsx}` edits, also load the global `typescript-functional-style` skill.
3. For `**/*.vue` edits, also load the global `typescript-functional-style` and `vue-sfc-structure` skills.
4. For `packages/aria/src/components/**`, the nearer `packages/aria/src/components/AGENTS.md` narrows the exact component-rule set.

The remaining content in this file is package knowledge and local context. Normative component rules live in the skill.

**Package:** `packages/aria/` → publishes as `@vean/aria`
**Role:** Logic layer. State, a11y, keyboard nav, focus management. Zero visual styles. Also hosts Compact aggregations when structure belongs in aria rather than the UI wrapper. New families must pass [Aria admission](../../.agents/skills/vean-ui-develop/layers.md#aria-admission).

## EXPORTS

Dev mode resolves to `./src/...` (source); publishConfig switches to `./dist/...`.
Core exports include root, `/constants`, `/composables`, `/date`, `/shared`, `/nuxt`, `/resolver`, `/namespaced`, `/types`, plus per-component sub-paths under `./*`.

After public export changes, rerun `pnpm sui gen catalog` so `packages/aria/src/constants/components.ts` and `packages/aria/src/namespaced/index.ts` stay aligned with `packages/aria/src/index.ts`.

## KEY PATTERNS

- **useContext**: Factory returning `[provideX, injectX]` pair via `Symbol` key. Components call `injectX('ComponentName')` — throws if missing provider.
- **useUiContext**: High-fanout bridge to the UI layer. Returns `[provideXUi, useUi]`; ~70 component contexts currently consume it, so changes require direct contract tests plus broad component verification.
- **useControllableState**: Controlled/uncontrolled prop pattern. If initial prop is `undefined`, uses internal `shallowRef`; otherwise returns computed proxy.
- **useForwardElement**: Exposes inner DOM element via `defineExpose`. Prefer over direct DOM access.
- **Compact components**: Stable, data-driven compositions can live in aria as `{Name}Compact` only for a family that already passed Aria admission. Compact does not admit a new family.
- **Composing another family**: Per-slot alias vs domain SFC. Rule lives in `.agents/skills/vean-ui-develop/layers.md` (Step 3.1). Remediations for Autocomplete, Segment, Drawer, and Combobox Anchor/GroupLabel/ItemIndicator are done; remaining aliases are documented Portal/Arrow/Menu-leaf cases.
- **Type export surface**: UI wrappers should prefer per-component sub-path type re-exports such as `@vean/aria/dialog`, not ad hoc deep imports.

## STRUCTURE

```
packages/aria/src/
├── components/   # ~90 families (`_common`/`_icon` internal; catalog authority: generated `src/constants/components.ts`). Base primitives plus Compact aggregations. See components/AGENTS.md
├── composables/  # ~30 reusable hooks. See composables/AGENTS.md
├── shared/       # Pure TS utilities (no Vue). See shared/AGENTS.md
├── constants/    # ARIA attrs, collection markers, component constants
├── date/         # Shared date and calendar helpers
├── locale/       # Locale registry and language bundles
├── nuxt/         # Nuxt auto-registration module
├── resolver/     # unplugin-vue-components resolver
├── types/        # Global types: ClassValue, UiClass, component/DOM/event types
└── index.ts      # Barrel: re-exports components + composables + shared + types
```

## ANTI-PATTERNS

- **NO imports from `@vean/ui`** — circular dependency
- **NO visual token styles** — not even `hidden`, `sr-only`; layout-contract geometry is allowed (admission R8)
- **NO presentation logic** — colors, sizing, spacing belong in UI layer
- **NO new family that fails the deletion test** — see Aria admission; do not clone Empty/List/Badge/Skeleton
- **NO direct DOM mutation** — use Vue refs + `useForwardElement`
- **NO UI-side reimplementation of stable aggregate structure** — if a data-driven composite is reusable, prefer a aria `*Compact`
