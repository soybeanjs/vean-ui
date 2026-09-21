---
head:
  title: Aria
  description: 'Unstyled, fully accessible component logic — the foundation @vean/ui is built on.'
---

# Aria

> Unstyled, fully accessible component logic — the foundation `@vean/ui` is built on.

`@vean/aria` is the logic layer of Vean. State, keyboard interaction, focus management and accessibility semantics live here, with zero visual styling. The styled components in `@vean/ui` are thin wrappers on top of it.

## Installation

```bash
pnpm add @vean/aria
```

## Layer split

| Layer  | Package      | Owns                                                 |
| ------ | ------------ | ---------------------------------------------------- |
| Logic  | `@vean/aria` | State, a11y, keyboard navigation, focus, zero styles |
| Styled | `@vean/ui`   | UnoCSS variants, class injection, slot forwarding    |

The compile-time dependency direction is **UI → Aria**. Aria never imports UI.

## Exports

- `.` — every component and type
- `./composables` — 28 reusable composables (`useControllableState`, `useContext`, `useUiContext`, …)
- `./shared` — pure TypeScript utilities (DOM, focus, tree, form, guard, comparison)
- `./types` — shared types such as `ClassValue`, `UiClass` and `ToContext`
- `./date`, `./locale`, `./constants`
- `./nuxt` and `./resolver` — Nuxt auto-registration and the `unplugin-vue-components` resolver
- `./namespaced` — namespace export (for example `Aria.Accordion.Root`)
- `./<component>` — per-component sub-path (for example `@vean/aria/accordion`)

## Scope

- 96 component directories, 94 of them publicly exported
- 28 composables and 20 pure-utility modules

`@vean/aria` ships no styles at all — not even `hidden` or `sr-only`. Layout-contract geometry is the only structural output, and presentation belongs to the styled layer.
