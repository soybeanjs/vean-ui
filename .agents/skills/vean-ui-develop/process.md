# Vean Process Rules

Finish-stage checklist and git commit convention. The companion [SKILL.md](SKILL.md) owns pattern classification, phase order, and guardrails; [layers.md](layers.md) owns implementation layer rules; [surfaces.md](surfaces.md) owns delivery surface rules.

## Finish checklist

Apply only at the finish stage, after implementation is complete. If still classifying, finding references, splitting layers, or building the body, this checklist is for preview only — not the current execution order.

Check in reverse: validate first, then delivery surfaces, then exports, then layer boundaries. Do not proceed to the next group until the previous one passes.

### Validation

- `pnpm typecheck` has run.
- `pnpm lint` has run.
- `pnpm fmt` has run.
- Relevant `pnpm test` or targeted component test has run.
- Any unrun item has a clearly stated reason.

### Delivery surfaces

- Playground examples demonstrate major public capabilities; no implemented-but-undemonstrated capability (imperative APIs, controlled bindings, advanced options each have a demo).
- Chinese and English docs are structurally synced.
- `apps/docs/src/constants/menus.ts` is updated.
- If public API changed, `pnpm sui gen api` has run.
- Non-English API descriptions synced via `pnpm sui translate api`, or the untranslated reason is stated.
- If changelog mapping, version log display, or release page was touched, `pnpm sui gen changelog` has run.
- Non-English changelog copy synced via `pnpm sui translate changelog`, or the untranslated reason is stated.
- For a release with breaking changes: add a `breaking` note with `docPath` in `packages/scripts/src/commands/changelog-notes.ts`, and write the upgrade guide at `apps/docs/src/content/{en,zh}/<docPath>.md` (the generator fails if either locale is missing). The sidebar and releases page pick the guide up automatically from `getUpgradeGuides()`.
  - Key the note by the **release line** (`v0.50.0` covers `v0.50.0-beta.1` … `v0.50.0`): it renders on the newest published release of that line, so it goes live on the current prerelease and moves to the stable release the moment it is published — no key edit and no lost translation.
  - One release shows one breaking notice: a curated `breaking` note replaces the generated count banner on the releases page, and the alert links the upgrade guide.
- Component tests cover rendering, state, disabled, and accessibility core scenarios.

### Exports and generated files

- `packages/aria/src/index.ts` and `packages/ui/src/index.ts` are updated.
- `pnpm sui gen catalog` has run (updates `packages/aria/src/constants/components.ts`, `packages/aria/src/namespaced/index.ts`, and `packages/ui/src/constants/components.ts`).
- Component name data, namespaced data, and API generation outputs all come from scripts; no generated files were hand-edited.

### Aria

- `types.ts`, `context.ts`, SFCs, and `index.ts` follow the layer rules.
- New or migrated families pass [Aria admission](layers.md#aria-admission). Anatomy shells are not used as templates.
- Context values stay reactive.
- No visual token styles, no `@vean/ui` imports. Geometric layout-contract inline styles follow admission R8.
- Stable aggregation structure has been correctly sunk into `{Name}Compact`.
- Slot root elements carry the correct `data-vean-{name}` attributes.
- UI-only families (admission refused) own structure and assembly in the wrapper and compose admitted aria primitives for behavior.
- Shared types are imported from `packages/aria/src/types/`; no family-local redeclaration of shared types, and barrels/namespaced do not re-export duplicates.
- Referenced dependency families exist in-repo — no intermediate state referencing a missing component, no type contract downgraded locally (see [layers.md -> High-frequency regression points](layers.md#high-frequency-regression-points)).
- Color classes in the UI recipe live in compound variants only, never on the variant base.

### UI

- The matching `packages/ui/src/styles/*.ts` first line is `// @unocss-include`.
- `slots` keys match aria `UiSlot`.
- Wrapper merges `props.ui` and `props.class` directly through the recipe.
- `useOmitProps` / `usePickProps` usage has a clear reason.
- No ARIA logic, no business semantics leaked into the UI layer.

### A11y and RTL

- ARIA, role, and keyboard interaction all live in aria.
- State reflects correctly to both `aria-*` and `data-state`.
- Directional components have `dir` propagation and RTL style flipping.

### Result reporting

- If a new composable, shared helper, type, or third-party dependency was added instead of reusing `packages/aria/src/shared/`, repository utilities, existing runtime deps, or `@vueuse/core`, the reason is explicitly stated.

Any unfinished item must be listed explicitly in the delivery notes.

## Git commit convention

Applies when writing commit messages, changelogs, or release summaries.

Use Conventional Commits. Format must be:

`<type>(<scope>): <subject>`

Example: `fix(dialog): prevent nested popup from closing on outside click`

### Core rules

- `type`, `scope`, and `subject` are all required.
- `type` and `scope` use lowercase kebab-case.
- `subject` is concise, specific, and outcome-oriented.
- `subject` does not end with a period.
- Prefer one commit per component or per clear domain.
- If a change spans aria, UI, docs, examples, and tests but centers on one component, keep a single component scope.

### Recommended types

- `feat`: user-visible new capability, new prop, new slot, new event
- `fix`: bug fix or behavior correction
- `perf`: performance optimization
- `refactor`: internal refactor with no intended behavior change
- `docs`: documentation changes
- `chore`: dependency, tooling, config, workflow, maintenance changes

### Scope rules

**1. Prefer exact component name**

If the change centers on a single component, use the component name as scope, even if docs, examples, and tests are also touched.

Examples:

- `feat(button): add loading slot`
- `fix(dialog): restore focus after nested close`
- `docs(table): document remote pagination`

**2. Use a domain scope only when a single-component scope would mislead**

Suitable for shared infrastructure or truly cross-domain changes:

- `ui`, `aria`, `composables`, `shared`, `types`, `theme`, `styles`, `docs`, `examples`, `resolver`, `nuxt`, `deps`, `projects`, `workflow`, `build`, `test`, `config`

**3. Avoid vague scopes**

- Write `dialog`, not `components`.
- For a single component's docs, prefer `docs(button)` over `docs(docs)`.
- Do not degrade to `ui` or `aria` when a precise component applies.

### Subject rules

The subject answers "what did this scope actually change?"

Prefer:

- Imperative verbs
- Clear object or API surface
- Real result or effect

Recommended verbs: `add`, `fix`, `remove`, `rename`, `support`, `prevent`, `simplify`, `refactor`, `optimize`, `document`, `update`

Good subjects:

- `add loading slot and loading prop`
- `prevent outside click from closing nested popup`
- `document async validation example`
- `update deps`

Avoid:

- `update code`
- `fix issues`
- `improve component`
- `misc changes`

### Granularity

- Prefer one commit per component.
- Changes spanning aria and UI for the same component stay in one component-scope commit.
- If the same change also includes that component's docs or examples, still keep one component-scope commit.
- If two unrelated components changed, split into two commits.
- For repo-wide refactors that cannot be split, use shared scopes like `ui`, `aria`, `projects`.

### Decision check

- Is the format strictly `<type>(<scope>): <subject>`?
- Does `type` use a recommended type?
- Is `scope` precise to a single component?
- Should this work be split into multiple component-level commits?
- Does `subject` describe the change concretely, not vaguely?
- Will this commit still make sense when it appears alone in the changelog?
