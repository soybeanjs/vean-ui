# Theming and Global Config

Use this reference for `SConfigProvider`, theme tokens, locale, direction, and app-level Vean setup.

## `SConfigProvider`

`SConfigProvider` is the styled package's global configuration entrypoint. Use it when you need app-level theme, size, locale, direction, nonce, or default tooltip behavior.

```vue
<script setup>
const themeConfig = {
  theme: {
    base: 'gray',
    primary: 'indigo',
    feedback: 'classic',
    radius: '0.625rem'
  },
  size: 'md'
};
</script>

<template>
  <SConfigProvider :theme="themeConfig" dir="rtl">
    <YourApp />
  </SConfigProvider>
</template>
```

## Theme vocabulary

- Semantic colors: `primary`, `destructive`, `success`, `warning`, `info`, `carbon`, `secondary`, `accent`
- Sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- Common styled variants across the library include `solid`, `outline`, `soft`, `ghost`, `pure`, `link`, `plain`, and `dashed`

## Locale and direction

- `dir="rtl"` enables right-to-left layout behavior for supported components
- Locale can be set globally through `SConfigProvider`
- For aria-only locale registration details, use the `vean-aria` skill

## Nuxt and app entry setup

Import styles once in the app entry file:

```ts
import '@vean/ui/styles.css';
```

For Nuxt:

```ts
export default defineNuxtConfig({
  modules: ['@vean/ui/nuxt']
});
```

## When not to use this file

- If the question is really about package choice, load [aria-vs-styled.md](aria-vs-styled.md) first.
- If the question is really about one component's props or slots, load the exact `components/*.md` file instead.
