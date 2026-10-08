# Vean Implementation Layer Rules

Implementation rules for the aria and UI layers, plus cross-cutting a11y/RTL. [Aria admission](#aria-admission) is the gate for creating a new aria family. The companion [SKILL.md](SKILL.md) owns pattern classification, phase order, and guardrails; [surfaces.md](surfaces.md) owns delivery surface rules; [process.md](process.md) owns finish and commit rules.

## Aria

Applies to `packages/aria/src/components/**/*.{ts,vue}`.

### Responsibility boundary

- Aria only owns logic, state, a11y, structure aggregation, and default semantics. Structure aggregation does not by itself admit a new family — apply [Aria admission](#aria-admission) first.
- Never add UnoCSS classes, `<style>`, visual token styles, or utility classes (not even `hidden`, `sr-only`). Geometric inline styles that implement a layout contract are allowed; see [R8](#r8-layout-is-behavior).
- Never import from `@vean/ui`.
- Before writing new logic, check `packages/aria/src/composables/`, `packages/aria/src/shared/`, and `packages/aria/src/types/`.
- Use `@vueuse/core` composables as-is (`refAutoReset`, `useDraggable`, `useResizeObserver`, …) — do not reimplement them in-repo. Prefer `packages/aria/src/shared/` for small pure helpers. Date math stays in `packages/aria/src/date/` (self-maintained on `@internationalized/date`); positioning, virtualization, and carousel use the existing runtime deps (`@floating-ui/dom`, `@tanstack/vue-virtual`, `embla-carousel`); drag/drop and motion are self-maintained in-repo (`composables/use-sortable-list.ts` and `shared/collapse-motion.ts`) — do not reintroduce a DnD or auto-animate package. Adding a new third-party dependency requires proving that `shared`, existing runtime deps, and `@vueuse/core` are all insufficient.
- `role`, `aria-*`, `tabindex`, keyboard interaction, focus management, and `dir` semantics are aria responsibilities; concrete rules live in [A11y and RTL](#a11y-and-rtl).

### Aria admission

Gate for **creating a new aria family**. Apply in Phase 0, before `types.ts`. Known-compliant families and the violation shapes they get misread as are catalogued in [Violation shapes and known-compliant families](#violation-shapes-and-known-compliant-families).

#### Deletion test

Delete the proposed aria module. If keyboard, focus, ARIA, positioning, form association, or cross-browser geometry would reappear across N UI wrappers, admit it. If only a `div` plus class injection remains, refuse a new family: implement UI-only or compose an existing primitive.

#### R1–R8

**R1 · Deletion test is the gate.** Every new family must pass it. Compact, `provideXUi`, and slot anatomy are not substitutes.

**R2 · Admit when any one holds:**

| Condition                                                | Typical matches                   |
| :------------------------------------------------------- | :-------------------------------- |
| WAI-ARIA widget role + APG keyboard                      | Tabs, Menu, Listbox, Tree         |
| Focus trap, restore, or roving tabindex                  | Dialog, Toolbar, RovingFocus      |
| Portal + anchor positioning + dismiss                    | Popover, Tooltip, Select          |
| Selection or open invariants (controlled + uncontrolled) | Checkbox, Accordion, Combobox     |
| Form association (hidden input, `name`, `required`)      | Checkbox, Slider, Input           |
| Pointer + keyboard dual input                            | Slider, ColorArea, Splitter       |
| Locale-sensitive parse or format                         | DateField, TimeField, InputNumber |
| Cross-browser layout contract that is not just CSS       | AspectRatio, Virtualizer, Affix   |

**R3 · Refuse a new family when:** the component is visual-only; it can be expressed with CSS and slots and has no state; it is a themed composition of an existing primitive (Card is Collapsible with chrome); or the only reason is that a styled library (Ant Design, Element) ships the same name. Note: a composed family that later grows its own domain state machine is re-admitted on its own merits (Drawer is an independent family from v0.50.0 — snap points / swipe dismiss / drag handle / nested scaling are not Dialog behavior).

**R4 · Anatomy shell is not a template.** A thin aria shell (multi-slot `provideXUi` + Compact) is allowed only when the family already has one real semantic: dismissible state, a landmark/`role`, or a domain wrap of an admitted primitive. Badge, Tag, Skeleton, Empty and List fail this bar — all five are UI-only today, their aria families removed in v0.50.0.

**R5 · Admission is per family; anatomy export follows Compact.** The two-gate rule: first judge whether the family needs aria at all (deletion test, R1–R3). If it passes, export every primitive its Compact composes, and let Compact compose only exported primitives — never re-declaring their markup — so hand-built and Compact composition share one DOM contract (`data-vean-*` lives on the primitive). Additional anatomy primitives (items, portals, providers, arrows) may be exported beyond the Compact composition for hand-built use. Semantic slots keep `aria-labelledby` / `aria-describedby` / widget `role` on their own primitive (DialogTitle, DialogDescription); chrome that carries a real contract is a primitive too (DialogHeader is the drag handle, BottomSheetHandle is the gesture contract). If the family fails admission, it is UI-only: the UI layer composes admitted primitives and owns structure and assembly itself — Card is the exemplar (collapsible wiring from Collapsible primitives, chrome divs in `SCard`). Anatomy export is a consequence of admission, never a path to it (see R7).

**R6 · Compose before a parallel family.** Alias inner slots with no domain semantics; wrap when the slot owns a11y, context, UI, or `data-vean-{family-slot}`. Full rule: [Step 3.1](#step-31-composing-an-existing-family). Password and Command are the correct shape; a second menu family beside an existing one is not.

**R7 · Compact is not admission.** Sink aggregation into `{Name}Compact` only for a family that already passed R1–R2. UI wrappers must not iterate `items` or assemble default content once Compact exists. Adding Compact to an anatomy shell does not make that shell a valid new family.

#### R8 · Layout-is-behavior

Geometric inline styles that implement the contract — aspect-ratio padding, affix placeholder size, watermark canvas `backgroundImage`, measured layout CSS variables — belong in aria. Visual tokens (color, font, shadow, radius, spacing utilities) do not.

#### Violation shapes and known-compliant families

Shipped families are audited against these shapes; the rule beside each one is what judges it.

| Shape                  | Typical form                                                                 | Rule   |
| :--------------------- | :--------------------------------------------------------------------------- | :----- |
| Anatomy shell          | Multi-slot `provideXUi` + Compact with no widget behavior                    | R1, R4 |
| Dismissible thin shell | A controlled `open` and nothing more                                         | R4     |
| Decorative slot        | Exported primitive with no widget logic, kept for Compact and hand-built use | R5     |
| Parallel family        | A second family beside one that already covers the domain                    | R6     |
| Private Compact node   | Compact composes a node the family does not export                           | R5, R7 |

The families below pass the deletion test or R8 and are frequently misjudged as violations — report one only with evidence that its listed contract is gone. Exports beyond the Compact composition (items, portals, providers, arrows) are compliant; see R5.

| Family                                                      | Why it stays                                                                                      |
| :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `drawer`                                                    | Own state machine: snap points, swipe dismiss, drag handle, nested scaling                        |
| `password`                                                  | Compact composes Input + visibility toggle (R6)                                                   |
| `command`                                                   | Compact composes Listbox + filtering (R6)                                                         |
| `button` / `link` / `label` / `separator`                   | Thin leaves with contracts: disabled/polymorphism, router, label double-click, `role="separator"` |
| `avatar` / `progress` / `breadcrumb`                        | Loading fallback state machine, `progressbar` ARIA, `nav` landmark                                |
| `aspect-ratio` / `affix` / `watermark` / `layout`           | R8 — geometry is the contract (padding, placeholder, canvas, measured CSS variables)              |
| `listbox`                                                   | The APG selection list that `list` was mistaken for                                               |
| `kbd`                                                       | Depth lives in `useKbd`; the component is a leaf                                                  |
| `clipboard` / `segment` / `backtop`                         | Clipboard copy state machine, selection state + Tabs indicator, scroll threshold logic            |
| `tree-nav` / `split-nav`                                    | Overflow measurement reflow (ResizeObserver), shell split-navigation composition                  |
| `spinner` / `icon` / `theme-mode-switch` / `palette-picker` | UI-only, or composed from existing primitives (R3)                                                |

Roadmap items expected to be UI-only or a composition — apply the deletion test before opening an aria directory: `Statistic`, `Result`, `Space`, `Banner`, `GradientText`, `Blockquote`, `Descriptions` (definition-list anatomy only), `Typography` (style convention only). `Upload`, `TreeSelect`, `Mention` and `Dropzone` carry real interaction and follow R2 normally. Component evaluation details: [docs/roadmap/README.md](../../../docs/roadmap/README.md).

### Implementation order

1. `types.ts`
2. `context.ts`
3. Base slot SFCs
4. `UiContext`
5. Optional `{Name}Compact`
6. `index.ts` and `packages/aria/src/index.ts`
7. Run `pnpm sui gen catalog`

### Step 1: types.ts

- Multi-slot components use `UiClass<{Name}UiSlot>` to define `{Name}Ui`.
- Props use `interface`, extending `BaseProps` or a more specific HTML attributes type. If the component is based on `Primitive`, extend `PrimitiveWithBaseProps`.
- Reuse existing types from `packages/aria/src/types/common.ts` first; do not redefine `Side`, `Align`, `Direction`, or other shared types.
- Controlled / uncontrolled state uses `useControllableState`.
- Multi-select components prefer `SelectionProps<M>` / `SelectionEmits<M>`.

### Step 2: context.ts

- Context values must be reactive: `ComputedRef` or `ShallowRef`.
- Prop-derived fields prefer `toContext` / `ToContext` (from `shared/vue`); use `fromContext` to snapshot a context back to plain values.
- Need a new composable or state utility? Check `packages/aria/src/shared/` and `packages/aria/src/composables/` first, then existing runtime deps and `@vueuse/core`.
- Direction-sensitive components resolve and propagate `dir` here; follow [A11y and RTL](#a11y-and-rtl).
- Derived values needed outside the provider are computed in the component, then passed to `provideXContext`.
- Infrastructure state for child consumption only (element ref, generated id) can be derived inside the `useContext` callback.
- Consume required context by destructuring; keep the whole object only for optional context.

### Step 3: Base slot SFCs

- Slot components obtain classes via `use{Name}Ui('root')` or `use{Name}Ui()`.
- Every aria slot root element exposes a stable `data-vean-{name}` attribute, named after the slot file (e.g. `data-vean-card-root`).
- Need a DOM handle? Use `useForwardElement`.
- `role`, `aria-*`, `tabindex`, keyboard events, and focus attributes belong on these aria interactive elements, not on UI wrappers.
- State is exposed via `data-state` and other `data-*` attributes, never via class.

### Step 3.1: Composing an existing family

When this family is built on another (Popover on Popper, Autocomplete on Combobox), choose **per slot**, not per component.

**Alias** the inner export (`export { PopperPortal as PopoverPortal }`) when the slot has no domain semantics. Typical matches: Portal, unconditional Arrow, and same-ARIA leaves (DropdownMenu Item is still a menu item).

**Add a domain SFC** that wraps the inner primitive when the slot has domain semantics. Typical matches: a different a11y contract (`role`, `aria-haspopup`, `ariaMode`), domain context or locked defaults, `use{Name}Ui` for a slot the inner family does not own, conditional behavior, or a public `data-vean-{family-slot}` contract.

**Compact only assembles.** `role` / `data-*` / `aria-*` for a publicly exported primitive live on that primitive's SFC so Compact composition and hand-built composition share one DOM contract. Compact may set those attributes on inner nodes only when this family does not export those nodes as primitives (DatePicker Compact composing DateField + Popover).

Empty Root shells that only re-emit may alias the inner Root unless they `provide` domain context or change the emit contract.

### Step 4: UiContext

- Multi-slot components establish `provide{Name}Ui` / `use{Name}Ui` via `useUiContext`.
- Only export `provide{Name}Ui`.
- `use{Name}Ui` is internal to the component family; never expose it from the barrel.

### Step 5: Compact aggregation

Sink aggregation logic into aria only for a family that already passed [Aria admission](#aria-admission), and when:

- Input is list data.
- Structure is stable.
- UI only needs style injection, variant computation, `ui` merge, and prop/listener forwarding — no extra logic.

If UI still needs any non-style logic, the aggregation has not finished sinking; keep building it in aria.

When sinking:

- Add `{Name}CompactProps`, `{Name}CompactEmits`, `{Name}CompactSlots` in aria.
- Add `{component}-compact.vue`.
- Move `items` iteration, `Root/Item/Header/Trigger/Content` composition, default title/description/icon rendering, and any non-style logic affecting structure, state, slot selection, default content, event orchestration, or conditional branching into aria.
- Default icons render through aria `IconRender`, driven by `ConfigProvider.iconRender`.

Typical aria-owned concerns:

- Deciding which slots render and in what order based on data.
- Assembling default title, description, icon, empty state, or fallback content.
- Handling `items`-related conditionals, event dispatch, slot selection, and structure switching.
- Supplying extra props, derived state, or context values to internal sub-components.

### Step 6: Common implementation patterns

- Use `toContext(props, [...])` to keep props reactive in context.
- Use `useControllableState(() => props.xxx, value => emit('update:xxx', value), defaultValue)` for controlled/uncontrolled modes.
- When forwarding part of this component's UI slots to an internal child aria component, map and inject them inside the `useUiContext` callback.
- Only add a new aria composable, shared helper, type, or third-party dependency when `packages/aria/src/shared/`, repository `composables/types`, existing runtime deps, and `@vueuse/core` are all insufficient.

### Step 7: Exports and registration

- `index.ts` exports components, `provide{Name}Ui`, and related types.
- Public exports also go into `packages/aria/src/index.ts`.
- Run `pnpm sui gen catalog` to regenerate files; never hand-edit them.

### Aria anti-patterns

- Adding style classes (including `hidden`, `sr-only`) or visual token inline styles.
- Opening a new aria family that fails the [deletion test](#deletion-test).
- Opening a aria family for a UI-only shape (Badge, Tag, Skeleton, Empty, List) or otherwise cloning a refused family as a template.
- Adding Compact to an anatomy shell to justify a new family.
- Direct DOM manipulation (e.g. `document.querySelector`).
- Storing non-reactive raw values in context.
- Exporting `use{Name}Ui`.
- Leaving stable aggregation structure in the UI wrapper.
- Leaving any non-style logic in the UI wrapper once `{Name}Compact` exists.
- Aliasing a publicly exported slot from another family when that slot has domain a11y, context, UI, or `data-vean-{family-slot}` of its own.
- Putting `role` / `data-*` / `aria-*` for a publicly exported primitive only on `{Name}Compact`.
- Exporting a primitive the family's Compact does not compose, or writing markup inside Compact for a node that exists as an exported primitive (breaks the single DOM contract).
- Treating anatomy export as an admission path: a UI-only family keeps its structure and assembly in the UI layer instead of opening a aria directory for chrome.

### High-frequency regression points

Lessons distilled from shipped-family audits. Self-check item by item; each has produced real regressions:

- **Dependency-first.** Before starting a family, scan its templates, imports, and slots for referenced components (Kbd, Link, Separator, Checkbox…). If a referenced family or its primitives do not exist in-repo yet, build that dependency first. Never ship an intermediate state referencing a missing component, and never downgrade a type contract locally because of it (e.g. widening `KbdValue` to `string` because Kbd is not built yet).
- **Reuse before new code.** Use `@vueuse/core` composables as-is. At composable top level, never call `onWatcherCleanup` — effect scope cleanup uses `onScopeDispose` (or delegates to vueuse); `onWatcherCleanup` is only valid inside a watcher.
- **Shared layer is the single source.** Shared types live in `packages/aria/src/types/common.ts`; families import them, never redeclare locally (e.g. `CheckedState`, `SelectionProps`, `Side`, `Align`). A family-local duplicate that gets re-exported from a barrel or the namespaced entry cements the wrong location — promote it to shared first, then import. Pure helpers reusable across families (`color`, `comparison`, `time-picker`, `tree-navigation`, `dom`) belong in `packages/aria/src/shared/`, not family-local files.
- **Provider defaults must mirror types.** `withDefaults` key names must match the props interface exactly; when renaming a prop, sync both. The default-value chain needs an inheritance regression case (prop → ancestor Provider → built-in defaults).
- **Config resolution order is fixed.** Do not delete or reorder any layer without an explicit recorded decision: prop → ancestor Provider → ConfigProvider global segment → built-in defaults.
- **a11y contract is verified on DOM output.** Check `role`, `aria-*`, and `data-*` state attributes item by item against the rendered DOM — including disabled presentation (behavior-blocking only vs. rendered `aria-disabled` / `data-disabled`). Class-name `toContain` assertions cannot substitute for attribute assertions.

## UI layer

Applies to `packages/ui/src/components/**/*.{ts,vue}`.

### Responsibility boundary

- UI only owns style wrapping, variant computation, UiContext injection, and prop/listener forwarding.
- For a family that failed admission (UI-only component), the wrapper additionally owns structure and assembly — conditionals, default content, slot selection — and may carry its own `data-vean-{name}` attributes for selectors. It still never adds ARIA, keyboard logic, or state semantics: compose admitted aria primitives for anything behavioral (see admission [R5](#r1r8)).
- Never place ARIA, keyboard logic, or state semantics in UI.
- UI consumes `data-state`, `dir`, and slot structure already exposed by aria; it does not rebuild semantics.

### Implementation order

1. `packages/ui/src/styles/{name}.ts`
2. `types.ts`
3. wrapper `.vue`
4. `index.ts` and `packages/ui/src/index.ts`
5. Run `pnpm sui gen catalog`

### Step 1: Style recipe

- First line must be `// @unocss-include`.
- Use `@soybeanjs/cva`'s `cv()` or `scv()` to define the style recipe.
- Same-family recipes reuse via `extend` / `alias` / `extendBase`. Cross-family chrome fragments live in `_*.ts` next to recipes (`_field.ts`, `_overlay.ts`); compose those tokens instead of copying class strings. Do not extract a new `_*.ts` unless the same fragment is copied across unrelated recipes.
- `slots` keys must match aria `{Name}UiSlot` exactly.
- Custom CSS variables use the `--vean-` prefix.
- **Color classes live in compound variants only.** The variant base must not carry color classes that compound variants override: generated CSS renders styles in rule order, so a base color silently wins over later color schemes. This regression is invisible to `toContain` class assertions — assert the compound class structure or computed style directly.
- Direction-related styles follow [A11y and RTL](#a11y-and-rtl): prefer logical properties and logical alignment classes; only use `rtl:` modifiers when logical properties cannot express the intent.

### Step 2: types.ts

- Props use `interface`, not `type`.
- UI component props standard includes `class?: ClassValue`.
- Aria component types for the matching UI component are imported or re-exported from the `@vean/aria/{name}` sub-path.
- `ClassValue`, `UiClass`, and other aria global types are imported from `@vean/aria/types`.
- When the UI layer adds structural elements aria does not have, and those elements also need `ui` override capability, extend `ExtraUiSlot` / `ExtendedUi`.

### Step 3: wrapper `.vue`

- `defineOptions({ name: 'S{Name}' })`.
- Use prop names directly in the template; do not write `props.xxx`.
- `script setup` order follows the global `vue-sfc-structure` skill.
- Wrapper only handles style injection and prop/listener forwarding. Do not add `aria-*`, keyboard logic, or swallow `dir`, `data-*`, or other semantic inputs that must continue to aria.

#### 3.1 Props forwarding strategy

**Use `useOmitProps` when:**

- Downstream should receive most props and the wrapper only consumes a few UI-specific props.
- Common scenario: omit `class`, `color`, `size`, `ui` and forward the rest to the aria root.

**Use `usePickProps` when:**

- One wrapper splits props across two or more child components.
- Each child should receive a clearly defined subset.

**Skip both when:**

- Based on `Primitive`.
- Wrapping a single child component.
- The wrapper truly handles three or fewer extra props.

In simple cases, prefer explicit bindings.

#### 3.2 Component patterns

**Multi-slot wrapper:**

- Compute `ui = computed(() => nameVariants(variantProps, props.ui, { root: props.class }))`.
- Call `provide{Name}Ui(ui)`.
- If aria already provides `{Name}Compact`, render it directly. Do not iterate `items`, assemble default icon/title/content, or orchestrate any non-style logic for Compact in the wrapper.

If the wrapper still needs conditionals, default content decisions, slot selection, event wrapping, structure switching, or other non-style logic for Compact, sink that work back into aria instead of piling it onto UI.

**Single-class component:**

- Direct `{name}Variants(variantProps, props.class)`.
- No UiContext.

**UI-only composition (family refused admission):**

- The wrapper renders admitted aria primitives for behavior and its own structural nodes for chrome.
- It owns conditionals and default content — no aria Compact exists, so the Compact restriction above does not apply.
- Provide the inner family's UiContext with the matching slot subset (e.g. `provideCollapsibleUi`).
- Keep stable `data-vean-{name}` attributes on the wrapper-owned nodes for tests and selectors.

### Step 4: index.ts

- UI component barrel exports the default component.
- Re-export matching aria component types from the `@vean/aria/{component}` sub-path.
- Do not re-export component types from the `@vean/aria` root path; aria global types continue to import from `@vean/aria/types`.
- Re-export UI layer's own `types.ts`.

### Step 5: Register to UI exports

- Update `packages/ui/src/index.ts`.
- Run `pnpm sui gen catalog` to regenerate `packages/ui/src/constants/components.ts` (script-generated; never hand-edit).

### UI anti-patterns

- `packages/ui/src/styles/{name}.ts` missing `// @unocss-include`.
- Color classes on the variant base instead of compound variants (cascade silently eats later color schemes).
- `slots` keys inconsistent with `{Name}UiSlot`.
- `useOmitProps` missing `class`.
- Recipe call missing `props.ui` or `{ root: props.class }`.
- Writing `props.xxx` in the template.
- Component name missing `S` prefix.
- Re-exporting all types from `@vean/aria` root path.
- Mixing component sub-path types and aria global type import sources in UI `types.ts` or `index.ts`.

## A11y and RTL

Applies to `packages/aria/src/components/**/*.{ts,vue}` and `packages/ui/src/components/**/*.{ts,vue}`.

### A11y principles

- All ARIA, `role`, `tabindex`, and keyboard interaction belong to the aria layer.
- UI only handles visual styles; it never adds ARIA logic.

### ARIA and state reflection

- Set `role` and `aria-*` per the relevant WAI-ARIA APG pattern.
- Reflect state through `aria-expanded`, `aria-selected`, `aria-checked`, `aria-disabled`, etc.
- Also expose state via `data-state` for styling and tests.
- Do not rely on class alone to carry state.

### ID association

- Generate unique ids with Vue's `useId()` and associate `aria-labelledby` and `aria-controls` through them.

### Decorative elements

- Purely decorative icons or duplicated content use `aria-hidden="true"`.

### Keyboard and focus

- All interactive elements must be operable by keyboard.
- Complex components maintain a sensible focus order.
- Overlays, dialogs, and similar components need correct focus trap or focus return strategies.

### RTL rules

- Aria: add `dir?: Direction` to `types.ts`, resolve direction with `useDirection(...)` in `context.ts`, and ensure the DOM root can bind `:dir="dir"`.
- UI: in `variants.ts`, prefer UnoCSS logical properties and logical alignment classes — `start-*`, `end-*`, `ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`.
- Only use `rtl:` modifiers when logical properties cannot express the intent.

### Default writing style

- When logical properties work, do not use `left-*`, `right-*`, `ml-*`, `mr-*`, `pl-*`, `pr-*`, `text-left`, `text-right`.
- Positioning prefers `start-*` / `end-*`.
- Spacing prefers `ms-*` / `me-*` / `ps-*` / `pe-*`.
- Text alignment prefers `text-start` / `text-end`.
- Reserve `rtl:` modifiers for cases logical properties cannot cover (e.g. horizontal arrows, chevrons, specific motion directions).

### Common replacements

- `left-0` -> `start-0`
- `right-0` -> `end-0`
- `left-2` -> `start-2`
- `ml-2` -> `ms-2`
- `mr-2` -> `me-2`
- `pl-4` -> `ps-4`
- `pr-4` -> `pe-4`
- `text-left` -> `text-start`
- `text-right` -> `text-end`
- `inset-x-0` and similar direction-agnostic utilities can stay as-is.
- Horizontal arrows, chevrons, and motion directions that logical properties cannot cover still need explicit `rtl:rotate-180`, `rtl:flex-row-reverse`, `rtl:-translate-x-*`, etc.

### Self-check

- UI layer still has no ARIA logic.
- State reflects to both `aria-*` and `data-state`.
- Styles prefer `start-*`, `end-*`, `ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`.
- Directional layout, icons, positioning, and animation flip correctly under RTL.
