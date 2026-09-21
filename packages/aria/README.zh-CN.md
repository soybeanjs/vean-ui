<p align="center">
  <a href="https://github.com/soybeanjs/vean-ui">
    <img src="https://r2.veanui.com/imgs/logo-vean-aria.svg?v=202609141212" alt="Logo" width="150" />
  </a>
</p>

# @vean/aria

[English](./README.md) | 中文

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/aria)](https://www.npmjs.com/package/@vean/aria)
[![npm downloads](https://img.shields.io/npm/dt/@vean/aria)](https://www.npmjs.com/package/@vean/aria)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

一套用于 Vue 3 的无样式、可访问的 UI 组件集合。

## 📖 简介

`@vean/aria` 为 UI 组件提供了核心逻辑和可访问性功能，但不包含任何样式。它专为希望构建自己的设计系统并完全控制视觉外观的开发者而设计。

部分多插槽组件还会暴露 `Compact` 聚合层，例如 `AccordionCompact` 和 `TableCompact`。这些 aria 入口负责条目遍历以及默认内容 / 图标组合，而样式包装层只专注于类名和 props 转发。

目前这类 Compact 约定式组合还覆盖了 card、date-field、dialog、editable、hover-card、layout、nav-menu、pagination、popover、stepper 等稳定结构。

## 📦 安装

```bash
pnpm add @vean/aria
```

## 🚀 使用方法

引入组件并组合它们以构建您的 UI。

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

## ✨ 特性

- **无样式**: 不包含 CSS。您可以使用自己的样式。
- **可访问性**: 处理 WAI-ARIA 角色、焦点管理和键盘导航。
- **可组合**: 组件设计为可组合使用。
- **Vue 3**: 使用 Composition API 为 Vue 3 构建。

## 🌐 语言支持

`@vean/aria` 当前提供以下语言的 locale 文案文件：

| 代码    | 语言         |
| ------- | ------------ |
| `zh-CN` | 简体中文     |
| `zh-TW` | 繁體中文     |
| `en`    | 英语         |
| `ar`    | 阿拉伯语     |
| `ja`    | 日语         |
| `ko`    | 韩语         |
| `de`    | 德语         |
| `fr`    | 法语         |
| `es`    | 西班牙语     |
| `pt-BR` | 巴西葡萄牙语 |
| `ru`    | 俄语         |
| `tr`    | 土耳其语     |
| `id`    | 印度尼西亚语 |

默认只有 `en` 和 `zh-CN` 会在 locale 注册表中预注册。`registerLocale` 支持两种注册方式：

- 直接传入 `LocaleRegistry` 对象。`@vean/aria/locale/{code}` 导出的内置语言文件已经是这种结构，并且自带 `dir` 元数据。
- 传入 locale key 和 `LocaleMessages`，用于快速注册一个轻量自定义语言。

简写形式 `registerLocale(key, messages)` 会将 key 作为语言名，并在未显式提供方向时回退到 `ltr`。如果你需要像 `ar` 这样的 `rtl` 元数据，请优先使用对象形式。

```ts
import { en, registerLocale } from '@vean/aria/locale';
import type { LocaleMessages } from '@vean/aria/locale';
import ar from '@vean/aria/locale/ar';

registerLocale(ar);

const customMessages: LocaleMessages = {
  ...en.messages,
  pagination: {
    ...en.messages.pagination,
    nextPage: '下一页 →',
    prevPage: '← 上一页'
  }
};

registerLocale('custom', customMessages);
```

## 📚 包结构

```
aria/src/
├── components/    # 96 个目录：94 个公共组件组 + _common/_icon 内部目录
├── composables/   # 28 个共享 hook（状态、焦点、浮层、选择…）
├── shared/        # 纯 TS 工具函数（DOM、焦点、树、表单、守卫）
├── constants/     # ARIA 属性常量、组件标识键
├── date/          # 共享日期与日历工具
├── locale/        # locale 注册表与语言包
├── nuxt/          # Nuxt 自动注册模块
├── resolver/      # unplugin-vue-components resolver
├── types/         # 全局类型（ClassValue、UiClass、PropsToContext…）
└── index.ts       # 主 barrel 导出
```

### 子路径导出

```ts
import { AccordionRoot } from '@vean/aria'; // 组件 + 类型
import { useControllableState } from '@vean/aria/composables'; // 28 个 composable
import { transformPropsToContext } from '@vean/aria/shared'; // 纯 TS 工具
import { createMonth } from '@vean/aria/date'; // 日期工具
import { registerLocale } from '@vean/aria/locale'; // locale 注册表
import * as H from '@vean/aria/namespaced'; // 命名空间导入
import type { AccordionUiSlot } from '@vean/aria/accordion'; // 单组件类型
import type { UiClass } from '@vean/aria/types'; // 共享类型导出
```

## 🧩 Composables

28 个 composable，按功能分类：

| 分类     | Composables                                                                                               |
| -------- | --------------------------------------------------------------------------------------------------------- |
| **状态** | `useContext`、`useControllableState`、`useStateMachine`、`useBoolProp`、`useProps`                        |
| **焦点** | `useFocusScope`、`useFocusGuards`、`useArrowNavigation`、`useRovingFocus`、`useKbd`、`useIsUsingKeyboard` |
| **层叠** | `useDismissableLayer`、`useEscapeKeyDown`、`useBodyScrollLock`、`usePresence`                             |
| **浮层** | `useFloating`、`useGraceArea`、`usePopupEvents`                                                           |
| **DOM**  | `useForwardElement`、`useExposedElement`、`useHideOthers`、`useImageLoadingStatus`                        |
| **选择** | `useSelection`、`useCollection`、`useTypeahead`、`useFuse`                                                |
| **桥接** | `useUiContext`、`useOmitProps`、`useForwardListeners`                                                     |

## 🎨 接入自定义样式层

每个多插槽组件都提供 `provide{Name}Ui` 函数。在样式包装组件中调用它并传入计算好的类名 map：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { AccordionRoot, provideAccordionUi } from '@vean/aria';

const props = defineProps<{ size?: 'sm' | 'md' | 'lg' }>();

// 用任何方式计算类名（CSS Modules、CVA、tv() 等）
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

对于单元素组件（如 `Button`），没有 UiContext，直接在组件上绑定 `:class` 即可。

## 📖 文档

完整文档和带样式的组件，请访问 [Vean 仓库](https://github.com/soybeanjs/vean-ui)。

## 💝 致谢

- [reka-ui](https://github.com/unovue/reka-ui)
- [oku-ui](https://github.com/oku-ui/primitives)
