# UI COMPONENTS

This scoped AGENTS file is a routing bridge for assistants editing `packages/ui/src/components/**`.

Before editing files here:

1. Load the project skill at `.agents/skills/vean-ui-develop/` — start with `SKILL.md`, then `layers.md` (UI layer section) and `surfaces.md` (Playground, Docs, Testing sections when the change touches delivery surfaces).
2. For `**/*.{ts,tsx,js,jsx}` edits, also load the global `typescript-functional-style` skill.
3. For `**/*.vue` edits, also load the global `typescript-functional-style` and `vue-sfc-structure` skills.
4. If the task affects public delivery surfaces, also apply `process.md` (finish checklist) at the end.

Use this file only as routing and local path context. Normative component rules live in the skill.

## LOCAL CONTEXT

- UI component barrels should re-export wrapper-facing types with `export type` from `@vean/aria/{component}` sub-paths, matching the newer export constraint used across the repo
- In UI-layer `types.ts`, component-specific aria types should come from `@vean/aria/{component}`, while aria global types such as `ClassValue` should come from `@vean/aria/types`
- Public UI export changes must be reflected in `packages/ui/src/index.ts`, then synced via `pnpm sui gen catalog` to update `packages/ui/src/constants/components.ts`
- Multi-slot wrappers should continue to inject class tokens through `provide{Name}Ui(ui)` and leave ARIA, keyboard, and state logic in aria
- If wrapper changes affect component delivery, also update the matching playground examples, docs pages, API generated data, and tests instead of treating UI files as the only required surface
