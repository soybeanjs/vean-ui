# COMPONENT TESTS

This scoped AGENTS file is a routing bridge for assistants editing `packages/ui/test/specs/components/**`.

Before editing files here:

1. Load the project skill at `.agents/skills/vean-ui-develop/` — start with `SKILL.md`, then `surfaces.md` (Testing section). If the tests change is part of component work, also load `layers.md` for the relevant implementation layer.
2. For `**/*.ts` edits, also load the global `typescript-functional-style` skill.
3. If the task is part of component delivery, apply `process.md` (finish checklist) at the end.

Use this file only as routing and local path context. Normative component rules live in the skill.

## LOCAL CONTEXT

- Component tests should track the current delivery model: implementation changes often require synchronized updates across docs, playground examples, generated API data, and tests
- When a public API or behavior changes, verify that the corresponding docs page now uses `UsageCode`, `PlaygroundGallery`, and `ComponentApi`, and that generated API data has been refreshed via `pnpm sui gen api` when needed
- For demo-driven assertions, remember that `apps/docs/src/examples/ui/{component}/index.vue` is now a thin `PlaygroundGallery` entry point and child demos no longer carry local title headings by default
