<p align="center">
  <a href="https://github.com/soybeanjs/vean-ui">
    <img src="https://r2.veanui.com/imgs/logo-vean-ui.svg?v=202609141212" alt="Logo" width="150" />
  </a>
</p>

# @vean/ui

[English](./README.md) | 中文

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/ui)](https://www.npmjs.com/package/@vean/ui)
[![npm downloads](https://img.shields.io/npm/dt/@vean/ui)](https://www.npmjs.com/package/@vean/ui)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

一套优雅、现代、可访问的、具有 shadcn 风格设计的 Vue 3 UI 组件库，基于 `@vean/aria` 构建。

## 📖 简介

`@vean/ui` 提供开箱即用的带样式组件，由 UnoCSS 和 `@soybeanjs/cva` class-variance 配方驱动。每个组件都是对应 `@vean/aria` 原语的 `S`-前缀包装层，遵循 **样式注入** 模式：样式包装层计算类名并通过 `provide{Name}Ui` 注入，aria 组件通过 `useUiContext()` 读取。

```ts
// 样式注入 — 单向数据流
const ui = computed(() => accordionVariants({ size: props.size }, props.ui, { root: props.class }));
provideAccordionUi(ui); // aria 通过 useAccordionUi() 读取
```

## 📦 安装

```bash
pnpm add @vean/ui
```

## 🚀 使用方法

### 1. 引入样式

在主入口文件（如 `main.ts`）中引入预构建的 UnoCSS 样式表：

```ts
import '@vean/ui/styles.css';
```

### 2. 按需引入（推荐）

使用 `unplugin-vue-components` 配合内置解析器实现自动导入：

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

### 3. Nuxt 模块

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vean/ui/nuxt']
});
```

### 4. 直接引入

```vue
<script setup>
import { SButton, SDialog } from '@vean/ui';
</script>

<template>
  <SDialog>
    <SButton>打开对话框</SButton>
  </SDialog>
</template>
```

## ✨ 特性

- **shadcn 风格设计**: 现代、简洁的美学，受 shadcn/ui 启发。
- **可访问性**: 基于 `@vean/aria` 原语构建，全面支持 WAI-ARIA。
- **RTL 就绪**: 通过 `ConfigProvider` 即可切换 LTR / RTL 布局。
- **多级自定义**: 通过 `ui` prop 覆盖单个插槽类名，也可替换整个样式层。
- **主题系统**: 8 种语义色彩和 6 种尺寸，通过 `ConfigProvider` 控制。
- **轻量可摇树**: 按需引入，每个组件独立 Tree-shakable。
- **类型安全**: 严格 TypeScript 编写，完整类型支持。
- **Nuxt 就绪**: 提供官方 Nuxt 模块，支持自动注册。
- **unplugin 支持**: 提供 `unplugin-vue-components` 自动导入解析器。

## 🎨 主题系统

### 主题色彩

| 色彩            | Token         | 用途                 |
| --------------- | ------------- | -------------------- |
| **Primary**     | `primary`     | 主要操作、激活状态   |
| **Destructive** | `destructive` | 删除、错误、危险操作 |
| **Success**     | `success`     | 确认、成功状态       |
| **Warning**     | `warning`     | 警告、待处理状态     |
| **Info**        | `info`        | 信息提示             |
| **Carbon**      | `carbon`      | 中性背景、表面色     |
| **Secondary**   | `secondary`   | 次要操作、弱化元素   |
| **Accent**      | `accent`      | 高亮、徽章           |

### 主题尺寸

| 尺寸  | 基准 (rem) | 像素对照     |
| ----- | ---------- | ------------ |
| `xs`  | 0.75       | 12px         |
| `sm`  | 0.875      | 14px         |
| `md`  | 1          | 16px（默认） |
| `lg`  | 1.125      | 18px         |
| `xl`  | 1.25       | 20px         |
| `2xl` | 1.5        | 24px         |

```vue
<script setup>
import { SConfigProvider, SButton } from '@vean/ui';
</script>

<template>
  <SConfigProvider :theme="{ color: 'primary', size: 'md' }">
    <SButton>点击我</SButton>
  </SConfigProvider>
</template>
```

## 🌐 语言支持

`@vean/ui` 通过 `ConfigProvider` 继承 `@vean/aria` 的国际化支持：

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

```vue
<template>
  <SConfigProvider :locale="zhCN">
    <App />
  </SConfigProvider>
</template>
```

## 📚 包结构

```
packages/ui/src/
├── components/    # 86 个样式组件目录（SButton、SDialog、SSelect…）
├── styles/        # UnoCSS 样式配方和层级定义
├── theme/         # 主题 Token、色彩梯度和尺寸映射
├── constants/     # 组件和主题常量
├── nuxt/          # Nuxt 模块入口
├── resolver/      # unplugin-vue-components 解析器
└── index.ts       # 主 barrel 导出
```

### 包导出

```ts
import { SButton, SAccordion } from '@vean/ui'; // 所有组件
import '@vean/ui/styles.css'; // 预构建 UnoCSS 样式表
// 另见: @vean/ui/nuxt · @vean/ui/resolver
```

## 🧩 组件

`@vean/ui` 提供 86 个 `S`-前缀样式组件，每个都包装一个 `@vean/aria` 原语：

| 分类         | 组件                                                                |
| ------------ | ------------------------------------------------------------------- |
| **布局**     | `SAccordion`、`SCard`、`SDialog`、`SDrawer`、`SPopover`、`STooltip` |
| **表单**     | `SButton`、`SCheckbox`、`SInput`、`SSelect`、`SSwitch`、`STextarea` |
| **导航**     | `SBreadcrumb`、`SPagination`、`SStepper`、`STabs`                   |
| **数据**     | `STable`、`SDataList`、`STree`                                      |
| **反馈**     | `SAlert`、`SBadge`、`SToast`、`SProgress`                           |
| **排版**     | `SHeading`、`SText`、`SCode`、`SKbd`                                |
| **日期时间** | `SCalendar`、`SDatePicker`、`STimePicker`                           |
| **媒体**     | `SAvatar`、`SCarousel`、`SImage`                                    |

## 🔧 自定义组件

通过 `ui` prop 覆盖单个插槽的类名：

```vue
<template>
  <SAccordion :ui="{ trigger: 'bg-blue-100 hover:bg-blue-200 rounded-lg' }">
    <SAccordionItem value="item-1">
      <SAccordionTrigger>自定义样式的触发器</SAccordionTrigger>
      <SAccordionContent>这里是内容</SAccordionContent>
    </SAccordionItem>
  </SAccordion>
</template>
```

## 📖 文档

完整文档、Playground 示例和组件 API 参考，请访问 [Vean 文档站点](https://veanui.com)。

## 💝 致谢

- [reka-ui](https://github.com/unovue/reka-ui)
- [oku-ui](https://github.com/oku-ui/primitives)
- [shadcn-vue](https://github.com/unovue/shadcn-vue)
- [shadcn/ui](https://github.com/shadcn/ui)
- [nuxt-ui](https://github.com/nuxt/ui)
- [unocss](https://github.com/unocss/unocss)
