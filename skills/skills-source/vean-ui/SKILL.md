---
name: vean-ui
description: Helps use Vean in Vue and Nuxt apps, including choosing styled vs aria packages, configuring styles and ConfigProvider, and looking up component docs and generated API summaries. Use when building with @vean/ui or @vean/aria, asking which Vean component to use, or needing props, slots, usage, and theming guidance for a specific component.
license: MIT
---

# Vean

Vue 3 UI library with styled and aria packages.

## Quick start

- Prefer `@vean/ui` for ready-to-use `S*` components.
- Prefer `@vean/aria` when you want Vean logic and accessibility without bundled styles.
- Load [REFERENCE.md](REFERENCE.md) for setup, docs routes, and which deeper reference to open next.
- Load [references/aria-vs-styled.md](references/aria-vs-styled.md) when deciding between `@vean/ui` and `@vean/aria`.
- Load [references/theming.md](references/theming.md) for `SConfigProvider`, theme vocabulary, locale, and direction.
- Load [references/components.md](references/components.md) when you need component categories or are not sure which component fits.
- Then load only the exact `components/*.md` files you need.

## Available guidance

| File                                                         | Topics                                                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [REFERENCE.md](REFERENCE.md)                                 | Setup overview, docs routes, and reference map                                        |
| [references/aria-vs-styled.md](references/aria-vs-styled.md) | Package choice, architecture, component patterns                                      |
| [references/theming.md](references/theming.md)               | `SConfigProvider`, theme tokens, locale, RTL, global config                           |
| [references/components.md](references/components.md)         | Component index grouped by category                                                   |
| `components/*.md`                                            | Per-component overview, features, docs summary, exported symbols, props, emits, slots |

## Loading files

- [ ] [REFERENCE.md](REFERENCE.md) first for setup and the right follow-up reference.
- [ ] [references/aria-vs-styled.md](references/aria-vs-styled.md) when the user is choosing packages or mixing both layers.
- [ ] [references/theming.md](references/theming.md) for theme, `SConfigProvider`, locale, nonce, or direction questions.
- [ ] [references/components.md](references/components.md) if you need to browse the library or narrow down the right component family.
- [ ] `components/*.md` only for the components directly involved in the task.
- [ ] If the local skill files are insufficient, use the docs routes `https://veanui.com/llms.txt` and `https://veanui.com/llms-full.txt` as broader context.

## Key concepts

| Concept            | Description                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Styled package     | `@vean/ui` exposes `SButton`, `SDialog`, and other pre-styled `S*` components                                    |
| Aria package       | `@vean/aria` exposes unstyled primitives, logic, a11y, and Compact aggregations                                  |
| `SConfigProvider`  | Global config for theme, size, locale, direction, nonce, and tooltip defaults                                    |
| Compact components | Data-driven aggregated components such as `AccordionCompact` and `TableCompact`                                  |
| Generated docs     | This skill's component files are generated from `docs/src/docs/en/ui/components` and `docs/src/generated/api/ui` |

## Basic patterns

```ts
import '@vean/ui/styles.css';
```

```ts
import Components from 'unplugin-vue-components/vite';
import UiResolver from '@vean/ui/resolver';

Components({
  resolvers: [UiResolver()]
});
```

```vue
<template>
  <SConfigProvider :theme="{ theme: { primary: 'indigo' }, size: 'md' }" dir="rtl">
    <App />
  </SConfigProvider>
</template>
```

## Notes

- For repo-internal component authoring or Vean source changes, use the `vean-ui-develop` skill instead.
- Regenerate the component reference files with `pnpm sui gen skills` after docs or generated API data changes.
