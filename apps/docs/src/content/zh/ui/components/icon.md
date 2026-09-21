---
head:
  title: 图标
  description: SIcon 是基于 Iconify 构建的统一图标组件。支持渲染 Iconify 图标集中的图标，也支持自定义 Vue 组件、VNodes 或字符串。通过与 SConfigProvider 集成，可在应用范围内统一管理图标尺寸。
---

# 图标

## 概述

`SIcon` 是基于 [Iconify](https://iconify.design/) 构建的统一图标组件。支持渲染 Iconify 图标集中的图标，也支持自定义 Vue 组件、VNodes 或字符串。通过与 `SConfigProvider` 集成，可在应用范围内统一管理图标尺寸。

## 特性

- 📦 **Iconify 支持**：渲染来自 Iconify 海量图标库的任意图标。
- 🔧 **自定义图标**：支持 Vue 组件、VNodes 或纯字符串。
- 📏 **全局尺寸**：从 `SConfigProvider` 继承默认尺寸。
- 🎨 **样式定制**：通过 props 或 CSS 类轻松定制。
- ♿ **无障碍支持**：装饰性图标默认 `aria-hidden`，语义图标通过 `aria-label` / `aria-labelledby` 暴露。

## 基础用法

### 使用 Iconify 名称

```vue
<script setup lang="ts">
import { SIcon } from '@vean/ui';
</script>

<template>
  <SIcon icon="lucide:home" />
  <SIcon icon="mdi:account" class="text-primary" />
</template>
```

### 自定义尺寸

```vue
<template>
  <SIcon icon="lucide:settings" width="24" height="24" />
</template>
```

也可通过 `SConfigProvider` 全局设置默认尺寸：

```vue
<script setup lang="ts">
import { SConfigProvider, SIcon } from '@vean/ui';
</script>

<template>
  <SConfigProvider :iconify="{ width: '1.5rem', height: '1.5rem' }">
    <SIcon icon="lucide:home" />
  </SConfigProvider>
</template>
```

### 自定义图标组件

```vue
<script setup lang="ts">
import { SIcon } from '@vean/ui';
import CustomIcon from './CustomIcon.vue';
</script>

<template>
  <SIcon :icon="CustomIcon" />
</template>
```

## 无障碍

- **装饰性图标**（默认）：自动设置 `aria-hidden="true"`，对辅助技术隐藏。
- **语义图标**：传入 `aria-label` 或 `ariaLabelledby` 后，`aria-hidden` 不会设置，图标会对辅助技术可见。

```vue
<template>
  <!-- 装饰性：aria-hidden="true" -->
  <SIcon icon="lucide:check" />

  <!-- 语义性：aria-label 暴露图标 -->
  <SIcon icon="lucide:check" aria-label="已完成" />
</template>
```

## API

<ComponentApi component="icon" />

## 说明

### 架构与基准差异

VeanUI 将图标拆分为 Aria 层（`@vean/aria` 中的 `_icon`，提供 `IconValue` 类型和渲染钩子）和 styled 层（`@vean/ui` 中的 `SIcon`，封装 Iconify 渲染、尺寸继承和无障碍逻辑）。这不同于 Ant Design、Element Plus 等单包方案。

| 方面     | VeanUI                                    | Ant Design / Element Plus / MUI / Mantine / Naive UI |
| :------- | :---------------------------------------- | :--------------------------------------------------- |
| 架构     | Aria + styled 分层                        | 单包                                                 |
| 图标来源 | Iconify（按需加载 200+ 图标集）           | 内置图标集 / 自定义 SVG                              |
| 样式     | UnoCSS 工具类                             | CSS-in-JS / SCSS / CSS 变量                          |
| 尺寸     | prop + `SConfigProvider` 全局继承         | prop / token                                         |
| 无障碍   | 装饰/语义自动区分，`aria-hidden` 智能默认 | 手动设置 `aria-label`                                |

### FAQ

**为什么默认设置了 `aria-hidden="true"`？**
大部分图标是装饰性的，仅作为视觉辅助。默认 `aria-hidden="true"` 可避免屏幕阅读器朗读无意义的图标名称。当图标具有语义时，传入 `aria-label` 或 `ariaLabelledby` 即可自动移除 `aria-hidden`。

**如何使用 Iconify 字符串名称？**
传入 `icon="prefix:name"` 格式的字符串，例如 `icon="lucide:home"`。Iconify 会按需从 API 加载图标数据。也可通过 `addIcon` / `addCollection` 预注册图标数据以实现离线使用。

**如何旋转或翻转图标？**
翻转使用 `hFlip`（水平镜像）或 `vFlip`（垂直镜像），旋转使用 `rotate`，基线对齐使用 `inline`，这些 props 会直接透传给 Iconify：

```vue
<template>
  <SIcon icon="lucide:arrow-right" :h-flip="true" />
  <SIcon icon="lucide:refresh-cw" rotate="90deg" />
  <SIcon icon="lucide:home" inline />
</template>
```

`rotate` 支持字符串（如 `"90deg"`）或数值（90° 的倍数，如 `1` 表示 90°、`2` 表示 180°）。

**`SConfigProvider` 的尺寸优先级如何？**
prop 上直接传入的 `width` / `height` 优先于 `SConfigProvider` 中配置的 `iconify.width` / `iconify.height`。

**支持 SSR 吗？**
支持。Iconify 组件在 SSR 环境下会渲染空占位，客户端水合后加载图标数据。如需 SSR 即时渲染，可预注册图标数据。
