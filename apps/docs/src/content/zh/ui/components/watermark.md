---
head:
  title: Watermark 水印
  description: SWatermark 在页面内容上方叠加重复的文字或图片图案，用于标识所有权、机密性或品牌。它生成平铺的 canvas data URL 作为 overlay 的 background-image，支持文字和图片水印，可配置旋转、间距、偏移和交叉图案，并提供可选的防篡改机制——当 overlay 被通过 DevTools 删除或修改时自动恢复。
---

# Watermark 水印

## 概述

`SWatermark` 在页面内容上方叠加重复的文字或图片图案，用于标识所有权、机密性或品牌。它生成平铺的 canvas data URL 作为 overlay 的 `background-image`，支持文字和图片水印，可配置旋转、间距、偏移和交叉图案，并提供可选的防篡改机制——当 overlay 被通过 DevTools 删除或修改时自动恢复。

> 提示：除了 `SWatermark` 外，Aria 层还导出了 `WatermarkCompact` 作为默认的 root/overlay 结构，以及 `WatermarkRoot`、`WatermarkOverlay` 和 `provideWatermarkUi` 用于完全自定义组合和样式注入。

## 用法

<UsageCode component="watermark" />

## 功能

- 📝 **文字水印** — 渲染重复文字，可配置字号、字体、颜色和粗细。
- 🖼️ **图片水印** — 传入 `image` URL 平铺图片图案；支持 `crossOrigin: 'anonymous'` 处理 CORS 源。
- 🔄 **旋转** — 任意角度旋转水印（默认 `-22°`）。
- 📐 **间距与偏移** — 通过 `gap: [x, y]` 控制平铺间距，`offset: [x, y]` 控制定位。
- ✖️ **交叉图案** — 设 `cross: true` 沿两条对角线渲染两个重叠水印。
- 🛡️ **防篡改** — 当 `defense: true` 时，`MutationObserver` 检测 overlay 删除或属性篡改，自动重新渲染 overlay。
- 🖥️ **全屏模式** — 设 `fullscreen: true` 将 overlay 固定到视口而非父容器。
- 🔧 **Aria 组合** — 导出 `WatermarkRoot` + `WatermarkOverlay` + `WatermarkCompact` 用于自定义布局；通过 `provideWatermarkUi` 注入样式。
- 🌐 **SSR 安全** — Canvas 生成由 `typeof window === 'undefined'` 守护；服务端不渲染 overlay。

## 示例

<PlaygroundGallery component="watermark" />

## API

<ComponentApi component="watermark" />

## 注意事项

### 架构与对标差异

`SWatermark` 拆分为 Aria 层（负责 canvas 生成、overlay 状态和防篡改逻辑）和 styled 层（负责 `watermarkVariants` `scv()` 配方，root: `relative`，overlay: `absolute inset-0 pointer-events-none bg-repeat`）。Aria `WatermarkCompact` 组合 `WatermarkRoot` + `WatermarkOverlay`，并提供 `repairOverlay` 函数用于防篡改。

| 维度            | VeanUI                               | Ant Design `Watermark` | Element Plus `Watermark` | MUI Watermark |
| :-------------- | :----------------------------------- | :--------------------- | :----------------------- | :------------ |
| 架构            | Aria + styled 分离                   | 仅 styled              | 仅 styled                | 仅 styled     |
| 文字水印        | ✅                                   | ✅                     | ✅                       | ✅            |
| 图片水印        | ✅ `crossOrigin: anonymous`          | ✅                     | ✅                       | —             |
| 交叉图案        | ✅ `cross` prop                      | —                      | —                        | —             |
| 防篡改          | ✅ `MutationObserver`（删除 + 属性） | ✅ `MutationObserver`  | ✅ `MutationObserver`    | —             |
| 全屏模式        | ✅ `fullscreen` prop                 | ✅ `inherit`           | ✅ `content` slot        | —             |
| Aria 导出       | ✅ Root + Overlay + Compact          | —                      | —                        | —             |
| gap/offset 控制 | ✅ `gap` + `offset`                  | ✅ `gap` + `offset`    | ✅ `gap` + `offset`      | ✅ `gap`      |

### 运行时注意事项

- **Canvas 依赖**：水印生成使用 `<canvas>` 和 `canvas.toDataURL()`。在不支持 canvas 的环境（如某些 SSR 设置）中，overlay 不会渲染——`generateWatermarkDataUrl` 返回 `undefined`。
- **图片 CORS**：图片水印使用 `crossOrigin = 'anonymous'`。图片服务器必须发送适当的 CORS 头（`Access-Control-Allow-Origin`），否则 canvas 会被污染，`toDataURL()` 会抛错。
- **防篡改默认关闭**：`defense` prop 默认 `false`。设 `defense: true` 启用基于 `MutationObserver` 的篡改检测。防篡固有较小的性能开销（observer 回调）。
- **防篡改范围**：防篡改机制检测 overlay 删除（通过 root 的 `childList` observer）和属性篡改（通过 overlay 的 `attributes` observer）。检查 `aria-hidden`、`class`、`style`、`hidden` 和 `data-vean-watermark-overlay` 属性。如发现修改，通过 `:key` 递增重新渲染 overlay。
- **`fullscreen` 定位**：当 `fullscreen: true` 时，overlay 从 `absolute inset-0`（相对父容器）切换到 `fixed inset-0 z-9999`（固定视口），覆盖整个屏幕。

### Aria 组合

如果默认的 root/overlay 结构足够使用，可以从 `@vean/aria/watermark` 导入 `WatermarkCompact`。如果需要独立控制 root 和 overlay 元素，可以直接组合 Aria 原语：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { WatermarkOverlay, WatermarkRoot, provideWatermarkUi } from '@vean/aria';

const ui = computed(() => ({
  root: 'relative',
  overlay: 'absolute inset-0 pointer-events-none bg-repeat'
}));

provideWatermarkUi(ui);
</script>

<template>
  <WatermarkRoot content="机密" :rotate="-22">
    <slot />
    <WatermarkOverlay />
  </WatermarkRoot>
</template>
```

### 常见问题

**如何给整个页面加水印？**
设 `fullscreen: true`：`<SWatermark content="机密" fullscreen />`。overlay 切换到 `fixed inset-0 z-9999`，覆盖视口。

**如何防止用户通过 DevTools 删除水印？**
启用防篡改：`<SWatermark content="机密" defense />`。组件使用 `MutationObserver` 检测 overlay 删除或属性篡改，自动重新渲染 overlay。注意这不是万无一失的——有决心的用户仍可禁用 JavaScript 或阻止 observer。

**可以使用图片作为水印图案吗？**
可以。传入 `image` prop：`<SWatermark image="/logo.png" />`。图片使用 `crossOrigin = 'anonymous'` 加载，因此服务器必须发送 CORS 头。当 `content` 和 `image` 同时提供时，`image` 优先。

**`cross` 交叉图案是什么？**
设 `cross: true` 渲染两个重叠水印——一个沿主对角线，一个沿反对角线（反向旋转）。这会创建更密集的交叉图案。

**如何控制平铺间距？**
使用 `gap` prop：`<SWatermark content="草稿" :gap="[200, 150]" />`。第一个值是水平间距，第二个是垂直间距。使用 `offset` 在每个平铺块内偏移水印。
