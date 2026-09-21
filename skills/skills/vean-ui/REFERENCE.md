# Vean Reference Map

Use this file as the entrypoint before loading narrower references.

## Start here when

- you need installation or setup commands
- you want the right docs route for broader context
- you are not sure whether to load package-choice guidance, theming guidance, or component references next

## Setup essentials

Install the styled package:

```bash
pnpm add @vean/ui
```

Install the aria package:

```bash
pnpm add @vean/aria
```

Import styles once when using the styled package:

```ts
import '@vean/ui/styles.css';
```

Use the resolver for auto imports:

```ts
import Components from 'unplugin-vue-components/vite';
import UiResolver from '@vean/ui/resolver';

Components({
  resolvers: [UiResolver()]
});
```

For Nuxt:

```ts
export default defineNuxtConfig({
  modules: ['@vean/ui/nuxt']
});
```

## Which reference next

- Load [references/aria-vs-styled.md](references/aria-vs-styled.md) for architecture, package choice, component patterns, and when to use `@vean/aria` instead.
- Load [references/theming.md](references/theming.md) for `SConfigProvider`, theme tokens, locale registration, RTL, and global provider questions.
- Load [references/components.md](references/components.md) for component discovery.
- Then load the exact `components/*.md` files you need.

## Documentation routes

- `https://veanui.com/llms.txt`: compact docs index for general navigation.
- `https://veanui.com/llms-full.txt`: larger generated docs bundle with API summaries.
- `https://veanui.com/components/{name}`: rendered component page.
- `https://veanui.com/components/{name}.md`: page-level markdown route.

## Regeneration

This skill's per-component references are generated from English component docs and generated API metadata:

```bash
pnpm sui gen skills
```
