<p align="center">
  <a href="https://github.com/soybeanjs/soybean-ui">
    <img src="https://img.soybeanjs.dev/logo-soybean-ui.svg?v=202608192144" alt="Logo" width="150" />
  </a>
</p>

# SoybeanUI

English | [中文](./README.zh-CN.md)

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![npm version](https://img.shields.io/npm/v/@soybeanjs/ui)](https://www.npmjs.com/package/@soybeanjs/ui)
[![npm downloads](https://img.shields.io/npm/dt/@soybeanjs/ui)](https://www.npmjs.com/package/@soybeanjs/ui)
[![github stars](https://img.shields.io/github/stars/soybeanjs/soybean-ui)](https://github.com/soybeanjs/soybean-ui)

SoybeanUI is an elegant, modern, accessible and high-quality UI component library with shadcn-like design for Vue 3, built on top of a robust headless foundation. It provides a comprehensive set of accessible, customizable, and performant components.

## 📚 Architecture

SoybeanUI's component runtime uses a strict **two-layer separation**. In the
diagram below, arrows mean “depends on”:

```
Consumer ──> @soybeanjs/ui ──> @soybeanjs/headless
                    │
                    └───────> @soybeanjs/theme

UnoCSS config ──> @soybeanjs/ui-uno
                    └───────> @soybeanjs/theme
```

### Packages

| Package                 | Role                                                                | Current inventory                                    |
| ----------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| **@soybeanjs/headless** | Logic, state, a11y, focus, keyboard interaction, and unstyled parts | 96 directories (94 public groups), 28 composables    |
| **@soybeanjs/ui**       | Styled wrappers using UnoCSS and `@soybeanjs/cva` recipes           | 96 public component groups, 144 `S`-prefixed exports |

The compile-time dependency is strictly one-way: `@soybeanjs/ui` imports public
`@soybeanjs/headless` entry points, while headless never imports UI. At runtime,
styled wrappers inject slot class maps through `provideXUi(computedUi)`, and the
wrapped headless parts read them through `useUiContext()`.

“Headless” means that no visual theme is packaged with the logic layer.
Behavior-critical CSS variables or inline layout values may still be used for
positioning and interaction.

Some multi-slot headless components also expose `Compact` aggregators, such as `AccordionCompact` and `TableCompact`. They keep item iteration and default content/icon composition inside headless, while the UI layer stays focused on styling and prop forwarding.

Current Compact-style coverage also includes flows such as card, date-field, dialog, editable, hover-card, layout, navigation-menu, pagination, popover, and stepper, when those structures are stable enough to live in headless.

### Workspace Overview

The monorepo also publishes `@soybeanjs/theme`,
`@soybeanjs/ui-uno`, the `sbean` source-distribution CLI, and
`@soybeanjs/ui-skills`. Private apps provide the documentation site,
playground, and Nuxt integration fixture.

See [Project architecture](./docs/architecture.md) for the complete workspace
map, dependency graph, build/test flows, and sources of truth. See
[Architecture and quality assessment](./docs/optimize.md) for prioritized
improvements and acceptance criteria.

### Style Injection

Every multi-slot headless component exposes a `provide{Name}Ui` function. The styled wrapper computes classes with `@soybeanjs/cva` recipes and injects them:

```ts
// In the styled wrapper (packages/ui/)
const ui = computed(() => accordionVariants({ size: props.size }, props.ui, { root: props.class }));
provideAccordionUi(ui); // headless reads this via useAccordionUi()
```

### Theme System

- **`ThemeColor`** — 8 semantic colors: `primary` · `destructive` · `success` · `warning` · `info` · `carbon` · `secondary` · `accent`
- **`ThemeSize`** — 6 sizes: `xs` · `sm` · `md` · `lg` · `xl` · `2xl` (base 16px at `md`)
- **`ConfigProvider`** — sets global `dir`, `locale`, `nonce`, and default `tooltip` config for the entire component tree, including RTL layout switching

### Locale Support

`ConfigProvider` supports the following locale bundles:

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

Only `en` and `zh-CN` are pre-registered by default. `registerLocale` supports two registration styles:

- Pass a `LocaleRegistry` object. Built-in locale files from `@soybeanjs/headless/locale/{code}` already export this shape, including `dir` metadata.
- Pass a locale key plus `LocaleMessages` for a lightweight custom locale.

The shorthand `registerLocale(key, messages)` form uses the key as the locale name and falls back to `ltr`. Use the object form when you need explicit metadata such as `rtl`.

```ts
import { en, registerLocale } from '@soybeanjs/headless/locale';
import type { LocaleMessages } from '@soybeanjs/headless/locale';
import ar from '@soybeanjs/headless/locale/ar';

registerLocale(ar);

const customMessages: LocaleMessages = {
  ...en.messages,
  pagination: {
    ...en.messages.pagination,
    nextPage: 'Next →',
    prevPage: '← Prev'
  }
};

registerLocale('custom', customMessages);
```

### Package Exports

**@soybeanjs/headless** ships fine-grained sub-paths:

```ts
import { AccordionRoot } from '@soybeanjs/headless'; // all components
import type { AccordionUiSlot } from '@soybeanjs/headless/accordion'; // per-component
import { useControllableState } from '@soybeanjs/headless/composables'; // 28 composables
import { createMonth } from '@soybeanjs/headless/date'; // shared date helpers
import { registerLocale } from '@soybeanjs/headless/locale'; // locale registry
import * as Headless from '@soybeanjs/headless/namespaced'; // namespace object
import { transformPropsToContext } from '@soybeanjs/headless/shared'; // pure TS utils
import type { UiClass } from '@soybeanjs/headless/types'; // shared type surface
```

Framework integrations are also available from
`@soybeanjs/headless/nuxt` and `@soybeanjs/headless/resolver`.

**@soybeanjs/ui** exports:

```ts
import { SButton, SAccordion } from '@soybeanjs/ui'; // all components
import '@soybeanjs/ui/styles.css'; // pre-built UnoCSS stylesheet
// Also: @soybeanjs/ui/nuxt · @soybeanjs/ui/resolver
```

## 🛠 Development Workflow

If you contribute new public components, exports, or API descriptions, keep generated surfaces in sync through the official scripts instead of editing generated files by hand.

```bash
pnpm sui gen catalog                          # sync component catalogs (headless + ui)
pnpm sui gen api                              # regenerate docs api json + locale template data
pnpm sui gen api --force                      # extract even when the source fingerprint is unchanged
pnpm sui gen changelog                        # regenerate docs changelog json + locale template data
pnpm sui gen schema                           # regenerate the sbean JSON Schemas
pnpm sui gen skills                           # regenerate the skills distribution
pnpm sui translate api --locale zh-CN         # translate pending api descriptions
pnpm sui translate changelog --locale zh-CN   # translate pending changelog summaries
pnpm sui check generated                      # verify the committed generated data matches the sources
```

Generation (`sui gen`) is deterministic and offline; translation (`sui translate`) is the only networked step. Regeneration is content-aware: a generated file whose payload did not change keeps its previous `generatedAt` and is not rewritten, so a no-op run leaves no diff behind. `pnpm sui check generated` regenerates every surface and diffs it against git, and CI runs it, so committed generated data cannot drift silently.

API extraction runs TypeDoc over both packages (~40s), so `gen api` skips it when a fingerprint of its inputs and its on-disk output still matches the last run (~0.15s). The fingerprint lives under `node_modules/.cache/` and is never committed; `--force` bypasses it. Because generation and translation are separate verbs, `sui translate <api|changelog|locale|all>` refreshes the surface it translates and then fills pending entries through DeepL (requires `DEEPL_API_KEY`); add `--dry-run` to see pending counts without spending API calls.

The docs site now renders component docs through `UsageCode`, `PlaygroundGallery`, and `ComponentApi`. Component detail pages and `/releases` also read generated changelog data from `apps/docs/src/generated/changelog/` and `apps/docs/src/generated/changelog-locales/`.

Public API or demo delivery changes should keep docs, component examples (`apps/docs/src/examples/`), and generated API data aligned. Changelog mapping, release presentation, and changelog locale template changes should keep generated changelog data aligned as well.

## 📦 Installation

### Using the Styled UI Library (Recommended)

If you want ready-to-use components with a modern design:

```bash
pnpm add @soybeanjs/ui
```

### Using the Headless Library

If you want to build your own design system from scratch:

```bash
pnpm add @soybeanjs/headless
```

## 🚀 Usage

### @soybeanjs/ui

1. **Import Styles**

   Import the CSS file in your main entry file (e.g., `main.ts`):

```ts
import '@soybeanjs/ui/styles.css';
```

2. **Global Registration (Optional)**

   You can register components globally or import them on demand.

3. **On-demand Import (Recommended)**

   We recommend using `unplugin-vue-components` for auto-importing components.

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite';
import UiResolver from '@soybeanjs/ui/resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: [UiResolver()]
    })
  ]
});
```

4. **Nuxt Module**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@soybeanjs/ui/nuxt']
});
```

### @soybeanjs/headless

The headless components provide the functionality without the styles.

For data-driven multi-slot patterns, prefer the exported `Compact` variant when it exists. It is the headless entry point for opinionated composition, while the regular parts remain available for fully manual assembly.

```vue
<script setup>
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from '@soybeanjs/headless';
</script>

<template>
  <AccordionRoot>
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
```

## ✨ Features

- **Accessible**: Follows WAI-ARIA patterns for roles, focus management, and keyboard navigation.
- **RTL ready**: Switch supported components between LTR and RTL layouts with `ConfigProvider`.
- **Headless-first**: Logic and styles are fully separated — use `@soybeanjs/headless` alone to build any design system.
- **Type Safe**: Written in strict TypeScript. All props, emits, slots, and context values are typed.
- **Customizable at every level**: Override individual slot classes via the `ui` prop, or swap the entire style layer.
- **Lightweight & Tree-shakable**: Import only the components you use. Each component is individually tree-shakable.
- **Nuxt ready**: First-class Nuxt module with auto-registration (`@soybeanjs/ui/nuxt`).
- **unplugin support**: Auto-import resolver for `unplugin-vue-components` (`@soybeanjs/ui/resolver`).

## 🤝 How to Contribute

We welcome contributions of all kinds! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, coding conventions, and the pull request process.

## 💝 Credits

- [reka-ui](https://github.com/unovue/reka-ui)
- [oku-ui](https://github.com/oku-ui/primitives)
- [shadcn-vue](https://github.com/unovue/shadcn-vue)
- [shadcn/ui](https://github.com/shadcn/ui)
- [nuxt-ui](https://github.com/nuxt/ui)
- [unocss](https://github.com/unocss/unocss)
