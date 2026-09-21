<p align="center">
  <a href="https://github.com/soybeanjs/vean-ui">
    <img src="https://r2.veanui.com/imgs/logo-vean-ui.svg?v=202609141212" alt="Logo" width="150" />
  </a>
</p>

# @vean/ui

English | [中文](./README.zh-CN.md)

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/ui)](https://www.npmjs.com/package/@vean/ui)
[![npm downloads](https://img.shields.io/npm/dt/@vean/ui)](https://www.npmjs.com/package/@vean/ui)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

An elegant, modern, accessible UI component library with shadcn-like design for Vue 3, built on top of `@vean/aria`.

## 📖 Introduction

`@vean/ui` provides ready-to-use styled components powered by UnoCSS and `@soybeanjs/cva` class-variance recipes. Each component is an `S`-prefixed wrapper around the corresponding `@vean/aria` primitive, following the **style injection** pattern: styled wrappers compute classes and inject them via `provide{Name}Ui`, which aria components read through `useUiContext()`.

```ts
// Style injection — one-way data flow
const ui = computed(() => accordionVariants({ size: props.size }, props.ui, { root: props.class }));
provideAccordionUi(ui); // aria reads this via useAccordionUi()
```

## 📦 Installation

```bash
pnpm add @vean/ui
```

## 🚀 Usage

### 1. Import Styles

Import the pre-built UnoCSS stylesheet in your main entry file (e.g., `main.ts`):

```ts
import '@vean/ui/styles.css';
```

### 2. On-demand Import (Recommended)

Use `unplugin-vue-components` with the built-in resolver for auto-importing:

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite';
import UiResolver from '@vean/ui/resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: [UiResolver()]
    })
  ]
});
```

### 3. Nuxt Module

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vean/ui/nuxt']
});
```

### 4. Direct Import

```vue
<script setup>
import { SButton, SDialog } from '@vean/ui';
</script>

<template>
  <SDialog>
    <SButton>Open Dialog</SButton>
  </SDialog>
</template>
```

## ✨ Features

- **shadcn-like design**: Modern, clean aesthetic inspired by shadcn/ui.
- **Accessible**: Built on `@vean/aria` primitives with full WAI-ARIA support.
- **RTL ready**: Switch between LTR and RTL layouts with `ConfigProvider`.
- **Customizable at every level**: Override individual slot classes via the `ui` prop, or swap the entire style layer.
- **Theme system**: 8 semantic colors and 6 sizes, controlled via `ConfigProvider`.
- **Lightweight & Tree-shakable**: Import only the components you use.
- **Type Safe**: Fully typed in strict TypeScript.
- **Nuxt ready**: First-class Nuxt module with auto-registration.
- **unplugin support**: Auto-import resolver for `unplugin-vue-components`.

## 🎨 Theme System

### Theme Colors

| Color           | Token         | Usage                             |
| --------------- | ------------- | --------------------------------- |
| **Primary**     | `primary`     | Primary actions, active states    |
| **Destructive** | `destructive` | Delete, error, danger actions     |
| **Success**     | `success`     | Confirm, positive status          |
| **Warning**     | `warning`     | Caution, pending status           |
| **Info**        | `info`        | Information, hints                |
| **Carbon**      | `carbon`      | Neutral backgrounds, surfaces     |
| **Secondary**   | `secondary`   | Secondary actions, muted elements |
| **Accent**      | `accent`      | Highlights, badges                |

### Theme Sizes

| Size  | Base (rem) | Pixel equivalent |
| ----- | ---------- | ---------------- |
| `xs`  | 0.75       | 12px             |
| `sm`  | 0.875      | 14px             |
| `md`  | 1          | 16px (default)   |
| `lg`  | 1.125      | 18px             |
| `xl`  | 1.25       | 20px             |
| `2xl` | 1.5        | 24px             |

```vue
<script setup>
import { SConfigProvider, SButton } from '@vean/ui';
</script>

<template>
  <SConfigProvider :theme="{ color: 'primary', size: 'md' }">
    <SButton>Click me</SButton>
  </SConfigProvider>
</template>
```

## 🌐 Locale Support

`@vean/ui` inherits locale support from `@vean/aria` via `ConfigProvider`:

| Code    | Language            |
| ------- | ------------------- |
| `zh-CN` | Simplified Chinese  |
| `zh-TW` | Traditional Chinese |
| `en`    | English             |
| `ar`    | Arabic              |
| `ja`    | Japanese            |
| `ko`    | Korean              |
| `de`    | German              |
| `fr`    | French              |
| `es`    | Spanish             |
| `pt-BR` | Portuguese (Brazil) |
| `ru`    | Russian             |
| `tr`    | Turkish             |
| `id`    | Indonesian          |

```vue
<template>
  <SConfigProvider :locale="zhCN">
    <App />
  </SConfigProvider>
</template>
```

## 📚 Package Structure

```
packages/ui/src/
├── components/    # 86 styled component dirs (SButton, SDialog, SSelect…)
├── styles/        # UnoCSS style recipes and layer definitions
├── theme/         # Theme tokens, color scales, and size mappings
├── constants/     # Component and theme constants
├── nuxt/          # Nuxt module entry
├── resolver/      # unplugin-vue-components resolver
└── index.ts       # Main barrel export
```

### Package Exports

```ts
import { SButton, SAccordion } from '@vean/ui'; // all components
import '@vean/ui/styles.css'; // pre-built UnoCSS stylesheet
// Also: @vean/ui/nuxt · @vean/ui/resolver
```

## 🧩 Components

`@vean/ui` ships 86 `S`-prefixed styled components, each wrapping a `@vean/aria` primitive:

| Category        | Components                                                          |
| --------------- | ------------------------------------------------------------------- |
| **Layout**      | `SAccordion`, `SCard`, `SDialog`, `SDrawer`, `SPopover`, `STooltip` |
| **Form**        | `SButton`, `SCheckbox`, `SInput`, `SSelect`, `SSwitch`, `STextarea` |
| **Navigation**  | `SBreadcrumb`, `SPagination`, `SStepper`, `STabs`                   |
| **Data**        | `STable`, `SDataList`, `STree`                                      |
| **Feedback**    | `SAlert`, `SBadge`, `SToast`, `SProgress`                           |
| **Typography**  | `SHeading`, `SText`, `SCode`, `SKbd`                                |
| **Date & Time** | `SCalendar`, `SDatePicker`, `STimePicker`                           |
| **Media**       | `SAvatar`, `SCarousel`, `SImage`                                    |

## 🔧 Customizing Components

Override individual slot classes via the `ui` prop:

```vue
<template>
  <SAccordion :ui="{ trigger: 'bg-blue-100 hover:bg-blue-200 rounded-lg' }">
    <SAccordionItem value="item-1">
      <SAccordionTrigger>Custom styled trigger</SAccordionTrigger>
      <SAccordionContent>Content here</SAccordionContent>
    </SAccordionItem>
  </SAccordion>
</template>
```

## 📖 Documentation

For full documentation, playground examples, and component API references, visit the [Vean docs site](https://veanui.com).

## 💝 Credits

- [reka-ui](https://github.com/unovue/reka-ui)
- [oku-ui](https://github.com/oku-ui/primitives)
- [shadcn-vue](https://github.com/unovue/shadcn-vue)
- [shadcn/ui](https://github.com/shadcn/ui)
- [nuxt-ui](https://github.com/nuxt/ui)
- [unocss](https://github.com/unocss/unocss)
