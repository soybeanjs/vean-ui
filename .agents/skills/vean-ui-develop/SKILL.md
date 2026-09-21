---
name: vean-ui-develop
description: Builds, updates, and audits Vean components with aria/UI split, delivery phases, and generation workflow. Invoke when adding, migrating, extending, standardizing, fixing, or auditing components, or when work touches packages/aria/src/components, packages/ui/src/components, apps/docs/src/examples, apps/docs/src/content, or packages/ui/test/specs/components.
---

# Vean Component Development

This skill is the single, self-contained source of truth for Vean component work. It owns pattern classification, phase order, layer rules, delivery surfaces, generation workflow, and the finish-stage checklist. Load it for any task that creates, migrates, extends, standardizes, fixes, or audits a Vean component.

For detailed rules, see [layers.md](layers.md) (aria admission, implementation layers), [surfaces.md](surfaces.md) (delivery surfaces), [e2e.md](e2e.md) (browser e2e testing), [process.md](process.md) (finish checklist and commit convention), and [audit.md](audit.md) (assessment methodology, seven check dimensions, and regression flows for already-shipped components). For request shapes that trigger this skill, see [EXAMPLES.md](EXAMPLES.md). TypeScript functional style and Vue SFC structure are owned by the global `typescript-functional-style` and `vue-sfc-structure` skills — load them directly; this skill does not restate their content.

## Repository context

- Monorepo: pnpm workspaces (private root + 13 child workspaces: 10 packages + 2 apps + `skills/`)
- Stack: Vue 3 + TypeScript (strict) + UnoCSS + `@soybeanjs/cva`
- Architecture: aria / styled separation. Compile-time dependency is `packages/ui` -> `packages/aria`; aria never imports UI.
- `@vean/aria` (`packages/aria/`): Logic, state, a11y, structure. Zero styles.
- `@vean/ui` (`packages/ui/`): Styled wrappers. UnoCSS + `cv()` / `scv()`. `S`-prefixed components.
- `@vean/docs` (`apps/docs/`): ubean SSG (`mode: 'ssg'`) with file routing, content collections, and built-in i18n (`en` + `zh`). NOT VitePress.

## Quick start

1. **Classify the task before editing.**
   - Aria admission: behavioral family, UI-only (refused), or compose an existing primitive. See [layers.md -> Aria admission](layers.md#aria-admission).
   - Component pattern: multi-slot base, compact aggregation, or single-class.
   - Scenario: new component, migration or normalization, standards alignment, or audit and evaluation.
   - Delivery scope: aria only, UI only, or full surface.
2. **Find concrete local references.**
   - Inspect at least one neighboring same-pattern aria implementation and one UI implementation before editing.
   - For migration, preserve behavior, state, accessibility, slots, and public API before restructuring.
3. **Reuse existing building blocks first.**
   - Prefer `packages/aria/src/composables/`, `packages/aria/src/shared/`, and `packages/aria/src/types/`.
   - Use `@vueuse/core` composables as-is; do not reimplement them in-repo. Date math goes through `packages/aria/src/date/`; positioning, virtualization, carousel, and schema-standard integrations use the existing runtime deps (`@floating-ui/dom`, `@tanstack/vue-virtual`, `embla-carousel`, `@standard-schema/spec`); drag/drop and motion are self-maintained in-repo (`composables/use-sortable-list.ts`, `shared/collapse-motion.ts`).
   - Only add a new composable, helper, type, or third-party dependency when `shared`/`composables`/`types`, existing runtime deps, and `@vueuse/core` are all insufficient — and state that reason in the result.

Example: "migrate a compound widget into Vean" usually means migration scenario + multi-slot or compact pattern + full delivery surface.

Example: "audit the `dialog` component against industry baselines" means audit scenario + follow [audit.md](audit.md) for the assessment flow, seven check dimensions, and regression rules.

## Component patterns

### Multi-slot base component

- Aria exposes multiple slot primitives.
- Uses `UiSlot` and `UiClass<UiSlot>`.
- UI injects classes through `provide{Name}Ui(ui)`.
- Examples: accordion, dialog.

### Compact aggregation

- Use when structure is stable and data-driven.
- Aria owns iteration, default content, structure, and non-style orchestration via `{Name}Compact`.
- UI wrappers stay thin: only variants, class injection, prop/listener forwarding, and slot forwarding.
- Exposes `{Name}CompactProps` / `{Name}CompactEmits` / `{Name}CompactSlots`.
- Current examples: accordion, card, date-field, dialog, editable, hover-card, layout, navigation-menu, pagination, popover, stepper, table flows.

### Single-class component

- No UiContext.
- UI composes classes directly from variants and `props.class` via `{name}Variants({...}, props.class)`.
- Examples: button, link.

## Workflows

### New or migrated component

0. **Admit or refuse aria.** Apply [layers.md -> Aria admission](layers.md#aria-admission). If refused, skip step 1 and implement UI-only or compose an existing family.
1. **Build aria first** (admitted families only).
   - `types.ts` -> `context.ts` -> base slot SFCs -> optional `{Name}Compact` -> `index.ts`.
2. **Build UI second.**
   - `packages/ui/src/styles/{name}.ts` -> `types.ts` -> wrapper `.vue` -> `index.ts`.
3. **Complete exports and generated surfaces.**
   - Update `packages/aria/src/index.ts` and `packages/ui/src/index.ts`.
   - Run `pnpm sui gen catalog`.
   - Do not hand-edit generated files.
4. **Complete delivery surfaces** unless the user explicitly narrows scope.
   - `apps/docs/src/examples/ui/{component}/`
   - `apps/docs/src/content/en/ui/components/{component}.md`
   - `apps/docs/src/content/zh/ui/components/{component}.md`
   - `apps/docs/src/constants/menus.ts`
   - `packages/ui/test/specs/components/{component}.spec.ts`
   - Run `pnpm sui gen api` when public API changes; for non-English locales run `pnpm sui translate api`.
   - Run `pnpm sui gen changelog` when changelog mapping or release-facing surfaces change; for non-English locales run `pnpm sui translate changelog`.

### Existing component fix or extension

1. Decide whether the change belongs to aria logic or UI wrapping.
2. Preserve the boundary:
   - No styles in aria (not even `hidden`, `sr-only`).
   - No ARIA, `role`, `tabindex`, or keyboard semantics in UI.
   - No reverse dependency from `packages/aria` to `packages/ui`.
3. Check whether playground, docs, tests, exports, or generated API data must move with the change.
4. If a new composable, helper, or type is introduced, explain why existing repository utilities and `@vueuse/core` were insufficient.

### Audit and evaluation of shipped components

1. Load [audit.md](audit.md) for the full assessment methodology, seven check dimensions (D1–D7, 106 items), severity levels, acceptance states, and regression rules.
2. Run the eight-step assessment flow from [audit.md -> Assessment flow](audit.md#assessment-flow). Grade every finding by severity; do not start the next component while a Blocker is open.
3. For D2 industry benchmarking, follow [audit.md -> Industry benchmarking](audit.md#d2-industry-benchmarking) (six libraries) and record concrete findings.
4. Apply the [audit.md -> Single-component acceptance checklist](audit.md#single-component-acceptance-checklist) before marking the component passed.
5. After each category, run the cross-component consistency regression from [audit.md -> Cross-component consistency regression](audit.md#cross-component-consistency-regression). After all components, run the full regression.

## Phase order

Execute in this order. Do not skip ahead until the current phase is done.

### Phase 0: Classify pattern, scenario, and scope

- Determine component pattern, task scenario, and whether this is full delivery.
- For a new family: apply [layers.md -> Aria admission](layers.md#aria-admission) before `types.ts`. If the family is not admitted, implement UI-only or compose an existing family.
- Do not write code first and reverse-engineer the pattern.

### Phase 1: Find reference implementations

- Inspect at least one same-pattern aria reference and one UI reference.
- Migration (scenario B): catalog behavior, state, a11y, slots, and public API that must be preserved.
- Standards alignment (scenario C): list the gap inventory.
- Audit and evaluation (scenario D): the gap inventory is the assessment itself — follow [audit.md](audit.md) instead of the implementation phases below.

### Phase 2: Implement aria

- Skip this phase when admission refused the family (UI-only or compose existing).
- Default order: `types.ts` -> `context.ts` -> base slot SFCs -> optional `{Name}Compact` -> `index.ts`.
- See [layers.md -> Aria](layers.md#aria) for layer rules.

### Phase 3: Implement UI

- Default order: `packages/ui/src/styles/{name}.ts` -> `types.ts` -> wrapper `.vue` -> `index.ts`.
- See [layers.md -> UI layer](layers.md#ui-layer) for layer rules.

### Phase 4: Wire exports and generated files

- Update `packages/aria/src/index.ts` and `packages/ui/src/index.ts`.
- Run `pnpm sui gen catalog`.
- Do not hand-edit generated files.

### Phase 5: Complete delivery surfaces

- Playground (examples): see [surfaces.md -> Playground (examples)](surfaces.md#playground-examples).
- Docs: see [surfaces.md -> Docs](surfaces.md#docs).
- Tests: see [surfaces.md -> Testing](surfaces.md#testing). For interactive components, also add a browser e2e spec — see [e2e.md](e2e.md).
- If public API changed, run `pnpm sui gen api`; for non-English locales run `pnpm sui translate api`.
- If changelog mapping or release surfaces changed, run `pnpm sui gen changelog`; for non-English locales run `pnpm sui translate changelog`.

### Phase 6: Validate and finish

- Run `pnpm typecheck`, `pnpm lint`, `pnpm fmt`, and the narrowest relevant test: `pnpm vitest packages/ui/test/specs/components/{component}.spec.ts`.
- If a command cannot run, state the blocker explicitly.
- Apply [process.md -> Finish checklist](process.md#finish-checklist) only now.

## Boundary rules

- Compile-time dependency must remain `packages/ui` -> `packages/aria`. Never import `@vean/ui` from `packages/aria`.
- Aria owns logic, state, accessibility, structure aggregation, and default semantics. Structure aggregation does not by itself admit a new family — see [layers.md -> Aria admission](layers.md#aria-admission).
- UI owns variants, UnoCSS classes, `ui` injection, and wrapper composition.
- Do not add visual token styles or utility classes in aria (not even `hidden`, `sr-only`). Geometric layout-contract inline styles are allowed (admission R8).
- Do not put ARIA, `role`, `tabindex`, keyboard interaction, or state semantics in `packages/ui/src/components`.
- Do not hand-edit generated files; update source exports and rerun scripts.
- Avoid adding new helpers before checking existing repository utilities and `@vueuse/core`.

## Guardrails

- Use `UiClass<UiSlot>` (from `packages/aria/src/types`), not `Record<UiSlot, ClassValue>`.
- Props always `extends /** @vue-ignore */ HTMLAttributes` to suppress IDE noise; if based on `Primitive`, `extends PrimitiveWithBaseProps`.
- Context values must be reactive: `ComputedRef` or `ShallowRef`. Use `toContext(props, keys)` (from aria `shared/vue`) for prop-derived fields; `fromContext(context, keys)` snapshots back to plain values when needed.
- `use{Name}Ui('root')` -> `ComputedRef<ClassValue>` (single slot); `use{Name}Ui()` -> full map.
- For multi-slot wrappers, pass `props.ui` and `{ root: props.class }` directly into the `scv()` recipe call.
- Multi-slot: only export `provide{Name}Ui` from aria barrel; never export `use{Name}Ui`.
- `packages/ui/src/styles/{name}.ts` first line must be `// @unocss-include`. Shared class tokens live in `_*.ts` files (`_field.ts`, `_overlay.ts`); recipes compose those tokens or inherit a sibling recipe via `extend` / `alias` / `extendBase`.
- Aria families built on another family alias inner slots that have no domain semantics, and wrap inner primitives in a domain SFC when the slot has a11y, context, UI, or `data-vean-{family-slot}` of its own. See [layers.md -> Composing an existing family](layers.md#step-31-composing-an-existing-family). Compact only assembles; it does not define the contract of a publicly exported primitive.
- `slots` keys in style recipe must match aria `{Name}UiSlot` exactly.
- `useOmitProps` must include `class` to avoid double-binding.
- UI component names use `S` prefix (`SButton`, `SDialog`); aria names do not (`Button`, `Dialog`).
- Never use `as any` / `@ts-ignore` / `@ts-expect-error`.
- Never modify `typed-router.d.ts` (auto-generated).

## Full delivery surface

New components check every entry that applies; existing component changes sync affected entries. Aria paths apply only when the family passed [Aria admission](layers.md#aria-admission); UI-only components skip the aria directory and barrel.

- `packages/aria/src/components/{component}/` (admitted families)
- `packages/ui/src/components/{component}/`
- `packages/aria/src/index.ts` (admitted families)
- `packages/ui/src/index.ts`
- `apps/docs/src/examples/ui/{component}/`
- `apps/docs/src/content/en/ui/components/{component}.md`
- `apps/docs/src/content/zh/ui/components/{component}.md`
- `apps/docs/src/constants/menus.ts`
- `packages/ui/test/specs/components/{component}.spec.ts`

## Generated surfaces

Run these after the corresponding source changes. Never hand-edit generated outputs.

- `pnpm sui gen catalog` — regenerates the component catalogs: `packages/aria/src/constants/components.ts`, `packages/aria/src/namespaced/index.ts` (from `packages/aria/src/index.ts`), and `packages/ui/src/constants/components.ts` (from `packages/ui/src/index.ts`). Pass `aria` or `ui` to regenerate only one.
- `pnpm sui gen api` — regenerates `apps/docs/src/generated/api/*.json` and `apps/docs/src/generated/api-locales/*.json` base data.
- `pnpm sui gen changelog` — regenerates `apps/docs/src/generated/changelog/*.json` and `apps/docs/src/generated/changelog-locales/*.json` base data.
- `pnpm sui gen schema` / `pnpm sui gen skills` — regenerates the vean JSON Schemas / the skills distribution.
- `pnpm sui gen all` — regenerates every surface above.
- `pnpm sui translate <api|changelog|locale|all>` — refreshes the surface it translates and then fills pending entries through DeepL (`--locale`, `--dry-run`, `--limit`, `--overwrite`). This is the only command that needs `DEEPL_API_KEY`.
- `pnpm sui check generated` — regenerates every surface and diffs it against git; CI runs it, so committed generated data cannot drift unnoticed.
- `pnpm sui check deps` — dependency gate: banned imports plus the aria/ui runtime dependency whitelists.

Generation is content-aware: a document whose payload did not change keeps its committed `generatedAt` and is not rewritten, so a no-op run leaves `git status` clean. On top of that, `gen api` skips the TypeDoc extraction entirely (~40s → ~0.15s) when a fingerprint of its inputs and its on-disk output still matches the last run; the fingerprint lives in `node_modules/.cache/sui/`. `--force` bypasses it.

## Build and validation commands

```bash
pnpm dev:docs         # Documentation site (ubean dev)
pnpm build            # libs (theme, unocss) -> aria -> ui -> cli via Vite Plus pack
pnpm build:libs       # theme -> unocss
pnpm lint             # vp lint --fix && package Vue lint
pnpm fmt              # vp fmt
pnpm test             # recursive workspace tests (pnpm -r run test)
pnpm test:e2e         # Vitest Browser Mode + Playwright Chromium
pnpm typecheck        # recursive workspace type checks
pnpm release          # Publish packages (soy release)
pnpm stub             # switch aria exports to src (`--reset` restores dist)
```

- Pre-commit hook (Vite Plus, `.vite-hooks/pre-commit`): `vp staged`.
- CI: PR/push typecheck, lint, unit tests, and browser e2e; tag-triggered build/release.
- Formatter: Vite Plus `vp fmt`.

## Result reporting

In the final handoff, make the following explicit when relevant:

- Component pattern, scenario, and scope.
- Which delivery surfaces were changed or intentionally left unchanged.
- Which generation and validation commands were run.
- Any blocker that prevented validation or full delivery.
- Why a new composable, shared helper, or type was introduced instead of reusing repository utilities or `@vueuse/core`.
