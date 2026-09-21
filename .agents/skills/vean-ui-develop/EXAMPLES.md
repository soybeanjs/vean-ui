# Vean Component Development Examples

Common request shapes that should trigger this skill. Each example shows the request, why it triggers the skill, and the expected approach. The companion [SKILL.md](SKILL.md) owns the workflow and guardrails; [layers.md](layers.md) owns implementation layer rules, [surfaces.md](surfaces.md) owns delivery surface rules, [process.md](process.md) owns finish and commit rules, and [audit.md](audit.md) owns the assessment methodology and seven check dimensions for already-shipped components.

## New component

Request:

"根据现有模式新增一个 tree 组件，补齐 aria、UI、playground、docs 和 tests。"

Why it triggers:

- Explicit new Vean component work.
- Full delivery surface is implied.
- Needs pattern classification before coding.

Expected approach:

1. Decide whether `tree` is admitted to aria ([layers.md -> Aria admission](layers.md#aria-admission)), then whether it is multi-slot, compact, or single-class.
2. Load this skill and follow [SKILL.md -> Phase order](SKILL.md#phase-order).
3. Inspect at least one same-pattern aria reference and one UI reference in the repository.
4. Implement aria first (types.ts -> context.ts -> base SFCs -> optional Compact -> index.ts), then UI (styles recipe -> types.ts -> wrapper.vue -> index.ts).
5. Wire exports and run `pnpm sui gen catalog`.
6. Finish playground, docs, tests, and generated API data; run `pnpm sui gen api` and locale translations when public API changes.
7. Validate with `pnpm typecheck`, `pnpm lint`, `pnpm fmt`, and the targeted component test, then apply the finish checklist.

## Migration or normalization

Request:

"把另一个仓库里的 stepper 迁到 vean，并按现有规范重组。"

Why it triggers:

- This is a component migration task, not a generic refactor.
- It requires behavior preservation plus structural normalization.
- It usually spans aria, UI, exports, and delivery surfaces.

Expected approach:

1. Catalog the source implementation's behavior, state, accessibility, slots, and public API that must be preserved.
2. Classify the component pattern and confirm the delivery scope (typically full surface for migration).
3. Rebuild the feature into Vean's aria/UI split following [SKILL.md -> Workflows -> New or migrated component](SKILL.md#new-or-migrated-component).
4. Inspect neighboring same-pattern implementations before writing code.
5. Reuse existing `composables`, `shared`, and `types` first; only add new helpers when the repository and `@vueuse/core` are both insufficient — and state the reason in the result.
6. Finish generated surfaces and outward delivery files (playground, docs, menus, tests).
7. Apply the finish checklist from [process.md -> Finish checklist](process.md#finish-checklist).

## Existing component fix or extension

Request:

"给 dialog 加一个新能力，并同步 playground 和文档；如果需要，补测试。"

Why it triggers:

- This is component-scoped feature work.
- It requires deciding whether the change belongs in aria or UI.
- It explicitly mentions downstream delivery surfaces.

Expected approach:

1. Locate the controlling layer for the new behavior using the boundary rules in [SKILL.md -> Boundary rules](SKILL.md#boundary-rules).
2. Keep accessibility and interaction semantics in aria; keep variant and style work in UI.
3. Inspect the existing dialog implementation and at least one neighboring same-pattern reference.
4. Implement the change in the correct layer; do not leak styles into aria or ARIA/keyboard logic into UI.
5. Update exports, playground, docs, tests, and generated API data when affected.
6. Run the relevant validation commands and apply the finish checklist.

## Standards alignment

Request:

"把 alert 组件对齐到当前仓库规范，补齐缺失的 data-vean-* 属性和测试。"

Why it triggers:

- This is standards alignment on an existing component, not a new feature.
- It requires a gap inventory before editing.
- It may touch multiple layers but stays component-scoped.

Expected approach:

1. List the gap inventory against [layers.md -> Aria](layers.md#aria) and [layers.md -> UI layer](layers.md#ui-layer).
2. Fix architectural boundary, semantic, export, and delivery-surface gaps first.
3. Patch in batches; do not reverse-engineer the pattern from the existing code.
4. Sync affected delivery surfaces (tests, docs, generated data) as needed.
5. Validate and apply the finish checklist.

## Audit and evaluation

Request:

"对 dialog 组件做一次完整的重新评估，对照 6 大对标库，输出检查报告并标记待修复项。"

Why it triggers:

- This is a re-evaluation of an already-shipped component, not an implementation task.
- It requires the seven-dimension assessment flow, not the implementation phase order.
- It produces a graded report of the component's current state.

Expected approach:

1. Load [audit.md](audit.md) for the assessment methodology, seven check dimensions (D1–D7, 106 items), severity levels, and acceptance states.
2. Run the eight-step assessment flow from [audit.md -> Assessment flow](audit.md#assessment-flow). Grade every finding by severity (Blocker / Major / Minor / Enhancement); do not start the next component while a Blocker is open.
3. For D2 industry benchmarking, follow [audit.md -> D2. Industry benchmarking](audit.md#d2-industry-benchmarking) (six libraries) and record concrete findings (for example, `input` should add `showCount`).
4. Apply [audit.md -> Single-component acceptance checklist](audit.md#single-component-acceptance-checklist) before marking the component passed.
5. After each category, run [audit.md -> Cross-component consistency regression](audit.md#cross-component-consistency-regression). After all components, run the full regression.
6. If the audit surfaces fixes, hand off to the appropriate implementation workflow (new, migration, fix or extension, or standards alignment) — do not mix audit reporting with in-place editing in the same pass.

## Surface-scoped work

Request:

"只补 select 组件的 playground 示例和英文文档，不动 aria 和 UI。"

Why it triggers:

- The user explicitly narrowed the delivery scope to playground and docs.
- It still touches Vean component delivery surfaces.

Expected approach:

1. Confirm the narrowed scope; do not widen it without explicit instruction.
2. Follow [surfaces.md -> Playground (examples)](surfaces.md#playground-examples) and [surfaces.md -> Docs](surfaces.md#docs) for the relevant rules.
3. Use prefix-stripped example keys for `<UsageCode>` and `<PlaygroundGallery>`.
4. Update `apps/docs/src/constants/menus.ts` if the component is not yet registered.
5. If public API or changelog mapping changed (unlikely here), run the corresponding `pnpm sui` commands; otherwise skip generation steps.
6. Validate with `pnpm typecheck`, `pnpm lint`, and `pnpm fmt` to ensure the surface edits do not break the build.

## Browser e2e

Request:

"给 select 组件补一组真实浏览器的 e2e 测试，覆盖键盘导航和颜色对比可访问性。"

Why it triggers:

- Real-browser verification is explicitly requested.
- The component relies on platform APIs (ResizeObserver, pointer capture, scrollIntoView) that the happy-dom spec has to mock.
- Color-contrast a11y needs computed styles only a real browser produces.

Expected approach:

1. Load [e2e.md](e2e.md) for the two-tier model, env setup, core scenarios, and assertion standards.
2. Add `packages/ui/test/browser/specs/components/{component}.e2e.spec.ts` using `renderComponent` from `test/browser/shared/render.ts` and `page` / `userEvent` from `vitest/browser`.
3. Cover real pointer interaction, keyboard navigation (without asserting the exact landing option when initial highlight varies), real portal/focus behavior, and axe color-contrast with `withTheme: true`.
4. Do NOT mock `ResizeObserver`, pointer capture, `scrollIntoView`, or `fetch`; do NOT disable the portal.
5. Use role-based locators and `expect.element(...)` retryable assertions.
6. Run `pnpm --filter @vean/ui test:e2e` (run `pnpm exec playwright install chromium` first on a new machine).
