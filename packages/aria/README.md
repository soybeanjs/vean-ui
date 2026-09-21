<p align="center">
  <a href="https://github.com/soybeanjs/vean-ui">
    <img src="https://r2.veanui.com/imgs/logo-vean-aria.svg?v=202609141212" alt="Logo" width="150" />
  </a>
</p>

# @vean/aria

English | [中文](./README.zh-CN.md)

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/aria)](https://www.npmjs.com/package/@vean/aria)
[![npm downloads](https://img.shields.io/npm/dt/@vean/aria)](https://www.npmjs.com/package/@vean/aria)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

A collection of unstyled, accessible UI primitives for Vue 3.

## 📖 Introduction

`@vean/aria` provides the core logic and accessibility features for UI components, without any styles. It is designed for developers who want to build their own design systems with full control over the visual appearance.

Some multi-slot components also expose `Compact` aggregators, such as `AccordionCompact` and `TableCompact`. These aria entry points own item iteration and default content/icon composition, while styled wrappers stay focused on classes and prop forwarding.

Current Compact coverage also includes stable structures such as card, date-field, dialog, editable, hover-card, layout, nav-menu, pagination, popover, and stepper.

## 📦 Installation

```bash
pnpm add @vean/aria
```

## 🚀 Usage

Import the components and compose them to build your UI.

```vue
<script setup>
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@vean/aria';
</script>

<template>
  <DialogRoot>
    <DialogTrigger>Open Dialog</DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/50" />
      <DialogContent class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md">
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Make changes to your profile here.</DialogDescription>
        <DialogClose>Save changes</DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
```

## ✨ Features

- **Unstyled**: No CSS included. You bring your own styles.
- **Accessible**: Handles WAI-ARIA roles, focus management, and keyboard navigation.
- **Composable**: Components are designed to be composed together.
- **Vue 3**: Built for Vue 3 using Composition API.

## 🌐 Locale Support

`@vean/aria` ships locale message files for the following languages:

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

Only `en` and `zh-CN` are pre-registered in the locale registry by default. `registerLocale` supports two registration styles:

- Pass a `LocaleRegistry` object. Built-in locale files from `@vean/aria/locale/{code}` already export this shape, including `dir` metadata.
- Pass a locale key plus `LocaleMessages` for a lightweight custom locale.

The shorthand `registerLocale(key, messages)` form uses the key as the locale name and falls back to `ltr`. Use the object form when you need explicit metadata such as `rtl`.

```ts
import { en, registerLocale } from '@vean/aria/locale';
import type { LocaleMessages } from '@vean/aria/locale';
import ar from '@vean/aria/locale/ar';

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

## 📚 Package Structure

```
aria/src/
├── components/    # 96 dirs: 94 public groups + _common/_icon internals
├── composables/   # 28 shared hooks (state, focus, floating, selection…)
├── shared/        # Pure TS utilities (DOM, focus, tree, form, guard)
├── constants/     # ARIA attributes, component keys
├── date/          # Shared date and calendar helpers
├── locale/        # Locale registry and language bundles
├── nuxt/          # Nuxt auto-registration module
├── resolver/      # unplugin-vue-components resolver
├── types/         # Global types (ClassValue, UiClass, PropsToContext…)
└── index.ts       # Main barrel export
```

### Sub-path Exports

```ts
import { AccordionRoot } from '@vean/aria'; // components + types
import { useControllableState } from '@vean/aria/composables'; // 28 composables
import { transformPropsToContext } from '@vean/aria/shared'; // pure TS utils
import { createMonth } from '@vean/aria/date'; // shared date helpers
import { registerLocale } from '@vean/aria/locale'; // locale registry
import * as H from '@vean/aria/namespaced'; // namespace object
import type { AccordionUiSlot } from '@vean/aria/accordion'; // per-component
import type { UiClass } from '@vean/aria/types'; // shared type surface
```

## 🧩 Composables

28 composables organized by category:

| Category      | Composables                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| **State**     | `useContext`, `useControllableState`, `useStateMachine`, `useBoolProp`, `useProps`                        |
| **Focus**     | `useFocusScope`, `useFocusGuards`, `useArrowNavigation`, `useRovingFocus`, `useKbd`, `useIsUsingKeyboard` |
| **Layer**     | `useDismissableLayer`, `useEscapeKeyDown`, `useBodyScrollLock`, `usePresence`                             |
| **Floating**  | `useFloating`, `useGraceArea`, `usePopupEvents`                                                           |
| **DOM**       | `useForwardElement`, `useExposedElement`, `useHideOthers`, `useImageLoadingStatus`                        |
| **Selection** | `useSelection`, `useCollection`, `useTypeahead`, `useFuse`                                                |
| **Bridge**    | `useUiContext`, `useOmitProps`, `useForwardListeners`                                                     |

## 🎨 Integrating Your Own Styled Layer

Every multi-slot component provides a `provide{Name}Ui` function. Call it at the top of your styled wrapper and pass a computed class map:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { AccordionRoot, provideAccordionUi } from '@vean/aria';

const props = defineProps<{ size?: 'sm' | 'md' | 'lg' }>();

// Compute your own classes however you like (CSS modules, CVA, tv(), etc.)
const ui = computed(() => ({
  root: 'space-y-1',
  item: 'border rounded-md',
  trigger: `flex w-full items-center py-3 px-4 font-medium ${props.size === 'lg' ? 'text-lg' : 'text-sm'}`,
  content: 'px-4 pb-3 text-sm',
  header: 'flex',
  description: ''
}));

provideAccordionUi(ui);
</script>

<template>
  <AccordionRoot v-bind="$props">
    <slot />
  </AccordionRoot>
</template>
```

For single-element components (like `Button`), there is no UiContext — apply your classes directly via `:class`.

## 📖 Documentation

For full documentation and styled components, visit the [Vean repository](https://github.com/soybeanjs/vean-ui).

## 💝 Credits

- [reka-ui](https://github.com/unovue/reka-ui)
- [oku-ui](https://github.com/oku-ui/primitives)
