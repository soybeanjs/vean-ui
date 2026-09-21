# ARIA COMPONENTS

This scoped AGENTS file is a routing bridge for assistants editing `packages/aria/src/components/**`.

Before editing files here:

1. Load the project skill at `.agents/skills/vean-ui-develop/` — start with `SKILL.md`, then `layers.md` (Aria section) and `surfaces.md` (Playground, Docs, Testing sections when the change touches delivery surfaces).
2. For `**/*.{ts,tsx,js,jsx}` edits, also load the global `typescript-functional-style` skill.
3. For `**/*.vue` edits, also load the global `typescript-functional-style` and `vue-sfc-structure` skills.
4. If the task affects public delivery surfaces, also apply `process.md` (finish checklist) at the end.

Use this file only as routing and local path context. Normative component rules live in the skill.

## LOCAL CONTEXT

- Public component export changes must be reflected in `packages/aria/src/index.ts`, then synced via `pnpm sui gen catalog` to update `packages/aria/src/constants/components.ts` and `packages/aria/src/namespaced/index.ts`
- Aria component barrels are the source for per-component sub-path exports such as `@vean/aria/dialog`; keep this surface aligned when adding or renaming components
- Stable, data-driven composite structure should prefer aria `*Compact` implementations instead of pushing iteration and default content up into the UI layer. Compact does not admit a new family; new families must pass [Aria admission](../../../../.agents/skills/vean-ui-develop/layers.md#aria-admission). Known-compliant families and violation shapes: [layers.md](../../../../.agents/skills/vean-ui-develop/layers.md#violation-shapes-and-known-compliant-families).
- When this family is built on another, alias inner slots with no domain semantics and wrap slots that own a11y, context, UI, or `data-vean-{family-slot}`. Compact only assembles; it does not define the contract of a publicly exported primitive. Full rule: skill `layers.md` Step 3.1.
- If an aria change affects public docs, demos, or tests, also sync `apps/docs/src/generated/api/`, `apps/docs/src/generated/api-locales/`, and the related delivery surfaces rather than stopping at implementation files
