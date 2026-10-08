# Vean Delivery Surface Rules

Rules for playground examples, documentation, and tests. The companion [SKILL.md](SKILL.md) owns pattern classification, phase order, and guardrails; [layers.md](layers.md) owns implementation layer rules; [process.md](process.md) owns finish and commit rules.

## Playground (examples)

Applies to `apps/docs/src/examples/**/*.vue` — the demo examples rendered by `<PlaygroundGallery>` on the docs site. There is no separate playground app; examples are a docs delivery surface.

Add examples only after the component body, exports, and major public capabilities are stable.

### Directory structure

Each component's examples live in `apps/docs/src/examples/ui/{component}/`.

Recommended structure:

- `index.vue`
- `01-basic.vue`
- `02-color.vue`
- `03-size.vue`
- `04-disabled.vue`
- `05-custom-styling.vue`

Not every component needs every example, but each file demonstrates only one capability.

### Writing order

1. Write `index.vue` first.
2. Add `01-basic.vue`.
3. Add `02-color.vue`, `03-size.vue`, `04-disabled.vue`, `05-custom-styling.vue` as public capabilities require.

### index.vue

- Standard pattern: import `../../../components/playground-gallery.vue` and render `<PlaygroundGallery component="{component}" />`.
- `component` value uses the directory name itself (e.g. `accordion`, `date-range-picker`).
- Do not manually import and assemble all sub-examples in `index.vue`.

### Sub-examples

- File names use the two-digit prefixed `NN-name.vue` format (e.g. `01-basic.vue`, `02-size.vue`).
- `NN` only indicates display order; the example key is the prefix-stripped `name`.
- If the prefix-stripped `name` starts with an underscore (e.g. `03-_draft.vue` or `_draft.vue`), the file is ignored by the example discovery logic and excluded from Gallery display and docs example lookup.
- One file, one capability. Titles are rendered by `PlaygroundGallery` via the `playground.examples.{component}.{file}` i18n key.
- Do not write local titles like `<h3 class="playground-title">` inside sub-example files.
- Do not wrap a root node in an extra `<div>` for layout alone; render components directly when possible.
- Layout containers, scroll containers, width constraints, or multi-node grouping may use minimal wrapping.
- An example's own controls configure the demo; they are **not** part of the viewport the device frame simulates. Keep that part out of the frame by declaring the gallery region (`interface Props { playgroundRegion?: string }` + `defineProps<Props>()`) and rendering it through `<Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">`. The gallery reads the declaration, renders a target above the frame (inside the element that also becomes the fullscreen layer) and passes its selector; examples that do not declare the prop are never touched.
- `defer` on that teleport is **required**: the region is mounted by the same subtree as the example, and Vue only inserts a subtree into the document after all its children are mounted — a synchronous lookup runs while the region is still off-document and fails with `Failed to locate Teleport target ...`.
- `to` keeps a string fallback (`?? 'body'`) even when unhosted: the server renderer drops a teleport whose target is missing instead of rendering it inline, which would desync the client from the prerendered HTML.
- Controlled state uses `ref` or `shallowRef`.
- Static data uses `const`.

### Discovery

- Docs discovers all example SFCs through `import.meta.glob` in `apps/docs/src/constants/globs.ts`.
- No manual registration after creating a component directory.
- `PlaygroundGallery` looks up all example files in the same directory except `index.vue`, extracts `order` during glob, and displays in ascending `order`.
- Ordering precedence: two prefixed files compare by number (lowest first), so a `00-*` example leads and `01-basic` follows; the `basic` name pin is only a fallback when the prefix cannot decide (unprefixed `basic.vue` first among unprefixed files, prefixed files before unprefixed ones). `UsageCode` resolves `<UsageCode component="…" />` by that `basic` **name**, so a `basic` example must always exist.
- A cross-component "customizer" demo (`00-customizer.vue`) is the convention for the leading card: one control form per style prop above a preview body.
- `UsageCode`, i18n title keys, and docs-side example lookup all use the prefix-stripped `name`, not the raw filename.

### Quality requirements

- Examples cover major public capabilities; do not repeat the same scenario.
- If the component exposes `color`, `size`, `disabled`, `ui`, etc., examples should reflect those capabilities.
- The `name` part of sub-example filenames must accurately describe the capability point — it drives i18n title keys and display semantics.
- **Capability-demo parity.** Every major public capability has at least one demo. When a capability exists in the component (imperative service methods, controlled two-way bindings, advanced props/options) but no example demonstrates it, that is a delivery gap — file count is not coverage. Rewriting demo copy or data while the capability stays identical does not count as a new demo; when reviewing an example set, distinguish "capability missing" from "copy rewritten".
- Examples are a formal delivery surface, not an optional attachment.

## Docs

Applies to `apps/docs/src/content/**/*.md`.

Add docs after the component API, exports, and playground are basically stable.

### Doc delivery surfaces

- Chinese docs: `apps/docs/src/content/zh/ui/components/{component}.md`
- English docs: `apps/docs/src/content/en/ui/components/{component}.md`

Both files must share the same structure; only the language may differ.

### Recommended structure

The component doc is the single consumer-facing reference for one component. It mirrors the description style of mainstream libraries (Ant Design, Element Plus, Material UI, Mantine, shadcn/ui) while preserving Vean's aria/styled split and generated-data surfaces.

Sections, in order. Sections marked optional are omitted only when they do not apply to the component (e.g. a primitive with a single export has no "Component family").

1. Top-level title (`#`) — the component's localized display name.
2. `## Overview` — positioning + applicable scenarios + key features + relationship to same-category components.
3. `## Usage` — minimal quick-start; always `<UsageCode component="{component}" />`.
4. `## Features` — core characteristics as a concise bullet list.
5. `## Component family` _(optional)_ — only when the component exports multiple `S`-prefixed members.
6. `## Demos` — full demo gallery; always `<PlaygroundGallery component="{component}" />`.
7. `## API` — generated reference; always `<ComponentApi component="{component}" />`.
8. `## Notes` — architecture and benchmark differences, cautions, constraints.
9. `## FAQ` — common questions and solutions.

Both `zh` and `en` files MUST share this exact section order; only the language differs.

### Section content standards

Each section has a concrete content contract. Reviewers check docs against these contracts (see [audit.md -> D6](audit.md#d6-documentation)).

- **Top-level title** — localized component name only (e.g. `# 按钮` / `# Button`). Do not append version, status, or marketing copy.
- **Overview** — answer three questions in ≤ 3 short paragraphs or bullets:
  1. What it is (one-line positioning, e.g. "a button that triggers an action").
  2. When to use it — applicable scenarios (e.g. "form submits, toolbar actions"). Also state when NOT to use it or which sibling to prefer when the boundary is non-obvious, mirroring Ant Design's `何时使用` and Element Plus's overview guidance.
  3. Relationship to same-category components (e.g. "pairs with `form`", "prefer `SButtonLink` for route navigation").
- **Usage** — `<UsageCode component="{component}" />` only. The backing example must be a ≤ 10 line minimal runnable snippet showing the most common API; do not hand-write fenced code here.
- **Features** — 4–8 bullets, each one capability, prefixed with an emoji icon for scannability (follow the `button.md` reference). Cover: variant/color/size/shape counts, loading/link/icon support, a11y, TS type safety, and any signature capability (e.g. `as`/`asChild` polymorphism, `ui` override, `Compact` aggregation). Do not duplicate API table rows verbatim.
- **Component family** _(optional)_ — a bullet list of the component's `S`-prefixed exports with a one-line role for each (e.g. `SButton` - base button; `SButtonLink` - route-aware link button). Omit entirely for single-export components.
- **Demos** — `<PlaygroundGallery component="{component}" />` only. The underlying playground examples must progress basic → advanced (see the Playground section): start with `basic`, then `size`/`color`/`disabled`, then advanced scenarios (async loading, virtual scroll, custom slots, keyboard nav, etc.). Demos double as the basic and advanced usage examples required by industry standards; do not hand-write example code in this section.
- **API** — `<ComponentApi component="{component}" />` only. The generated table is authoritative and already covers type definitions, default values, and required markers; do not hand-write prop/event/slot tables. Only hand-write a `DataTable`/`TypeTable` as an exception when generated API cannot cover a special page. After public API or type-description changes, rerun `pnpm sui gen api`; for non-English locales also `pnpm sui translate api`.
- **Notes** — at minimum:
  - **Architecture and benchmark differences** — a table or short prose contrasting Vean with mainstream libraries (Ant Design / Element Plus / Material UI / Mantine / Naive UI / shadcn/ui). Call out the aria/styled split, `ui` slot override, `as`/`asChild` polymorphism, `Compact` aggregation, or any deliberate API deviation and the rationale (e.g. "no `block` prop — UnoCSS `w-full` covers it").
  - **Cautions** — runtime constraints, SSR caveats, z-index/portal behavior, controlled vs uncontrolled pitfalls, or anything a user is likely to get wrong.
- **FAQ** — 3–6 question/answer pairs covering the questions a user most commonly asks (e.g. "how to make it full-width?", "why is `aria-disabled` kept alongside native `disabled`?", "how to render as a link?"). Each answer links back to the relevant prop/slot/demo when possible. Reference Ant Design / Element Plus / Mantine FAQ patterns.

### Writing order

1. Write the Overview, Features, and minimal Usage.
2. Wire `<UsageCode component="{component}" />`, `<PlaygroundGallery component="{component}" />`, and `<ComponentApi component="{component}" />`.
3. Write Notes (architecture + benchmark differences + cautions) and FAQ.
4. Update `apps/docs/src/constants/menus.ts`.
5. If public API changed, run `pnpm sui gen api`; for non-English locales run `pnpm sui translate api`.
6. If changelog mapping, release display, or changelog locale templates changed, run `pnpm sui gen changelog`; for non-English locales run `pnpm sui translate changelog`.

### Key rules

- Usage and Demos sections write Vue component tags directly; do not use `usage` or `playground` fenced blocks.
- `Usage` section always uses `<UsageCode component="{component}" />`.
- `Demos` section always uses `<PlaygroundGallery component="{component}" />`.
- Only pass `files` to `<PlaygroundGallery>` when you actually need to restrict the displayed subset.
- Even if playground sub-examples use `NN-name.vue` filenames, the example keys passed to `<UsageCode>` and `<PlaygroundGallery>` use the prefix-stripped `name` (e.g. `basic`, `size`).
- `API` section always uses `<ComponentApi component="{component}" />`.
- The `component` value of `<ComponentApi>` defaults to the component directory name. If the doc filename differs from the component export name, pass the real component name (e.g. `input-number`).
- Only hand-write `DataTable` / `TypeTable` as an exception when generated API cannot cover a special page.
- The version log section on the component detail page is provided by generated changelog data; do not hand-write per-version update records in markdown.
- After public API, type descriptions, or export surface changes, run `pnpm sui gen api`.
- API generation output is authoritative; do not hand-edit `apps/docs/src/generated/api/` or `apps/docs/src/generated/api-locales/`.
- Changelog generation output is authoritative; do not hand-edit `apps/docs/src/generated/changelog/` or `apps/docs/src/generated/changelog-locales/`.

### Menu registration

After writing docs, sync `apps/docs/src/constants/menus.ts`:

- Insert the component's camelCase key into the appropriate group's `items`.
- Insert in alphabetical order.

Common groups:

- `general`
- `groupLayout`
- `navigation`
- `forms`
- `dataDisplay`
- `feedback`
- `overlay`
- `utilities`
- `aria`
- `charts` (docs-site TanStack Charts examples — there is no chart package)

AI/chat components live in the core `@vean/aria` / `@vean/ui` packages (unified `S` prefix) and use the core group set above; there is no separate AI package. Component plan and group placement: [docs/roadmap/ui-ai-roadmap.md](../../../docs/roadmap/ui-ai-roadmap.md). The admin shell direction is likewise an in-core domain (`src/shell` aria module + ui composites): [docs/roadmap/ui-shell-roadmap.md](../../../docs/roadmap/ui-shell-roadmap.md).

### Quality requirements

- Doc content stays in sync with the actual component implementation.
- All non-optional sections in the [Recommended structure](#recommended-structure) are present and follow the [Section content standards](#section-content-standards) contract; optional sections are omitted only when they do not apply.
- zh and en docs share the identical section order; a structure diff is empty.
- `<UsageCode>` and `<PlaygroundGallery>` `component` values match the component directory name.
- If playground sub-examples carry order prefixes, the docs still use prefix-stripped example keys — never write raw filenames like `01-basic` into docs.
- `<ComponentApi>` `component` value matches the real API data source; the generated table remains the authoritative source for prop/event/slot type definitions, default values, and required markers.
- Demos progress basic → advanced and cover the component's major public capabilities; no duplicate scenes; an implemented-but-undemonstrated capability is a delivery gap (see Playground [Quality requirements](#quality-requirements)).
- Notes include the architecture/benchmark-difference table and at least one caution; FAQ has 3–6 question/answer pairs.
- Doc demo surfaces match `apps/docs/src/examples/ui/{component}/` real files.
- Titles and API content do not lag behind the implementation.
- New components default to both Chinese and English docs; do not ship single-language only.

## Testing

Applies to `packages/ui/test/specs/components/**/*.ts`.

Test stack: Vitest + `@vue/test-utils` + `axe-core`, running in `happy-dom`.

Add tests after the component body, exports, and major interactions are stable; do not pile test boilerplate while the API is still in flux.

### Basic rules

- All `mount()` calls default to `attachTo: document.body`.
- Each `it()` mounts and unmounts independently; do not share wrappers.
- Each `it()` calls `wrapper.unmount()` before ending.

### Recommended describe structure

- `rendering`
- `{state} state`
- `disabled state`
- `accessibility`

### rendering

- Cover default slot rendering.
- Cover custom class.
- Cover key child element existence.

### state

- `modelValue` or equivalent state must reflect correctly to `aria-*` / `data-state`.
- After interaction, verify the corresponding emit (e.g. `update:modelValue`).

### disabled state

Assert in the way the component actually implements:

- `aria-disabled="true"`
- `element.disabled === true`
- `data-disabled`

Also verify that disabled state does not emit.

### Interaction triggers

- Trigger events based on the component's real implementation; do not write idealized interactions disconnected from the implementation.
- Common cases include `click`, `mousedown`, `mouseenter`, but always check the component's real behavior first.

### accessibility

- Use `getA11yViolations` to verify no violations in major usage scenarios.
- Add `aria-label` for `role="switch"`, icon-only buttons, controls without visible text, etc.
- When a real label relationship is needed, wrap the component to simulate a real usage context.

### Quality requirements

- Test assertions align with real component behavior; do not write idealized assertions disconnected from the implementation.
- When adding or fixing a component capability, sync the corresponding tests.
- New components require tests by default; do not leave tests as future debt.

### Browser e2e (Tier 1)

This section covers the happy-dom unit spec only. For real-browser e2e — pointer/keyboard interaction, real portal/focus behavior, and axe color-contrast with the theme injected — see [e2e.md](e2e.md). Add an e2e spec when the component relies on `ResizeObserver` / pointer capture / `scrollIntoView`, uses `Teleport`, has non-trivial keyboard navigation, or needs real color-contrast verification. Browser e2e lives in `packages/ui/test/browser/**` under a separate config (`vitest.browser.config.ts`, loaded via `--config`) and never overlaps this glob.
