# ARIA SHARED UTILITIES

**22 helper files** of mostly pure TypeScript utilities. Only `vue.ts` imports Vue.

## MODULES

| File                 | Contents                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom.ts`             | `getActiveElement`, `isHTMLElement`, `getCollectionItemElements`, `getAriaLabel`, `removeLinks`                                                            |
| `focus.ts`           | Focus detection, focusable element queries, focus movement                                                                                                 |
| `form.ts`            | Form field helpers, validation trigger utilities                                                                                                           |
| `tree.ts`            | Tree data traversal (flatten, find, walk) — used by Tree/TreeMenu                                                                                          |
| `tree-navigation.ts` | Flattened visible-tree nodes and logical navigation keys (up/down/left/right/home/end) for WAI-ARIA tree keyboard nav                                      |
| `geometry.ts`        | Point-in-polygon, rect intersection — used by grace area calculations                                                                                      |
| `event.ts`           | Event helper functions                                                                                                                                     |
| `guard.ts`           | Type guards: `isNullish`, `isString`, `isFunction`, etc.                                                                                                   |
| `object.ts`          | Object utilities (pick, omit, deep merge)                                                                                                                  |
| `array.ts`           | Array utilities: `filterNullish`, `arrayMove`                                                                                                              |
| `collapse-motion.ts` | `collapseMotion()` — Vue `TransitionProps` for measured enter/exit height, plus `COLLAPSE_MOTION_DEFAULTS`                                                 |
| `number.ts`          | `createNumberFormatter` / `createNumberParser` — locale-aware `Intl.NumberFormat` wrappers                                                                 |
| `string.ts`          | String manipulation helpers                                                                                                                                |
| `time-picker.ts`     | Shared time-picker normalization and segment helpers                                                                                                       |
| `value.ts`           | Value comparison, normalization                                                                                                                            |
| `comparison.ts`      | Generic comparison functions                                                                                                                               |
| `color.ts`           | Color parsing/normalization across rgb/hsl/hsv/oklch formats, format detection and validation                                                              |
| `fuzzy.ts`           | Dependency-free fuzzy search scoring (exact > prefix > substring > subsequence)                                                                            |
| `mark-others.ts`     | `markOthers` — hides everything outside given elements from assistive tech for open overlay layers (dependency-free `aria-hidden` scheme)                  |
| `env.ts`             | Environment detection (SSR, browser, platform)                                                                                                             |
| `viewport.ts`        | `mobileViewportMaxWidth` / `mobileViewportQuery` — the shared mobile breakpoint that keeps a JS `isMobile` decision and the CSS `lt-md` rules on one width |
| `vue.ts`             | Vue-specific utilities (the one file that imports Vue)                                                                                                     |
| `index.ts`           | Barrel re-export                                                                                                                                           |

## CONVENTIONS

- **No Vue imports** for shared helpers except `vue.ts` — keeps most utilities testable and portable
- **No side effects** — pure functions only
- Consumed by both `composables/` and `components/` via `../shared/`
- Exported as `@vean/aria/shared` sub-path
