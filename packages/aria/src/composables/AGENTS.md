# ARIA COMPOSABLES

**30 hooks** shared across all aria primitives. Pure Vue Composition API.

## CATEGORIES

| Category      | Composables                                                                                           | Purpose                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **State**     | `use-context`, `use-controllable-state`, `use-state-machine`, `use-bool-prop`                         | Provider/consumer, controlled/uncontrolled props, FSM, tri-state bool props                     |
| **Focus**     | `use-focus-scope`, `use-focus-guards`, `use-arrow-navigation`, `use-roving-focus`                     | Trap focus, guard focus escapes, arrow key nav, roving tabindex group nav                       |
| **Layer**     | `use-dismissable-layer`, `use-escape-key-down`, `use-body-scroll-lock`                                | Click-outside, Esc key, scroll lock                                                             |
| **Floating**  | `use-floating`, `use-grace-area`, `use-popup-events`                                                  | Positioning (floating-ui), hover grace zones, popup triggers                                    |
| **DOM**       | `use-forward-element`, `use-exposed-element`, `use-hide-others`                                       | Ref forwarding, `aria-hidden` siblings                                                          |
| **Selection** | `use-selection`, `use-collection`, `use-typeahead`, `use-fuse`                                        | Multi-select state, item registration, type-to-search, fuzzy search                             |
| **Sortable**  | `use-sortable-list`                                                                                   | Pointer + keyboard list reordering, insertion window, FLIP slide                                |
| **Bridge**    | `use-ui-context`, `use-props`, `use-forward-listeners`                                                | UI↔aria class injection, prop utilities, event forwarding                                       |
| **Misc**      | `use-presence`, `use-collapse-height`, `use-image-loading-status`, `use-is-using-keyboard`, `use-kbd` | Enter/exit animation, measured collapse height, image load state, input modality, key constants |

## KEY PATTERNS

- **Factory pattern**: `useContext` returns `[provide, inject]` tuple — used by every component's `context.ts`
- **useUiContext**: High-fanout bridge to the UI layer. Returns `[provideXUi, useXUi]`; changes require direct contract tests plus broad component verification.
- **useControllableState**: If `prop()` returns `undefined` → internal `shallowRef`; otherwise → computed proxy. Deduplicates via `skip` flag + `nextTick`.

## CONVENTIONS

- File naming: `use-[feature].ts` (kebab-case)
- All exported from `composables/index.ts` barrel
- No Vue SFC files — pure `.ts` composables only
- Import shared utilities from `../shared/`, types from `../types/`
