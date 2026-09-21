---
head:
  title: 回到顶部
  description: SBacktop 在滚动目标超过可配置阈值后显示浮动按钮，激活时平滑滚动目标回到顶部。它封装了 SButton，提供滚动位置追踪、基于 requestAnimationFrame 的平滑滚动和 prefers-reduced-motion 支持。用于让用户在长页面或可滚动容器中快速返回顶部。
---

# 回到顶部

## 概述

`SBacktop` 在滚动目标超过可配置阈值后显示浮动按钮，激活时平滑滚动目标回到顶部。它封装了 `SButton`，提供滚动位置追踪、基于 `requestAnimationFrame` 的平滑滚动和 `prefers-reduced-motion` 支持。用于让用户在长页面或可滚动容器中快速返回顶部。

> 注意：除了 `SBacktop`，Aria 层还导出了 `Backtop`，可用于自定义组合。

## 用法

<UsageCode component="backtop" />

## 功能

- 📏 **可见性阈值** — 滚动超过 `visibilityHeight` 像素后按钮才出现（默认 `400`）。
- 🎬 **平滑动画** — 使用 `easeInOutCubic` 缓动在 `duration` 毫秒内滚动到顶部（默认 `300`）。设 `duration={0}` 可即时滚动。
- ♿ **减弱动画** — 尊重 `prefers-reduced-motion: reduce`；用户偏好减弱动画时跳过动画即时滚动。
- 🎯 **灵活目标** — `target` 接受 `window`（默认）、`HTMLElement`、`Ref<HTMLElement>` 或 CSS 选择器字符串。
- 🔧 **Aria 组合** — Aria `Backtop` 单独导出用于自定义按钮样式；`SBacktop` 提供预设 `buttonVariants` + 固定定位。
- 🎨 **完整 Button props** — 继承所有 `ButtonProps`（color、size、variant、shape、shadow、disabled 等）及 `icon`/`iconClass`/`iconProps` 默认图标。
- 📡 **事件** — 发射 `change`（可见性切换）和 `click`（按钮点击）。
- 🌐 **SSR 安全** — 所有浏览器 API（`window`、`document`、`matchMedia`）均有守护；服务端渲染无错误。

## 演示

<PlaygroundGallery component="backtop" />

## API

<ComponentApi component="backtop" />

## 注意事项

### 架构与对标差异

`SBacktop` 拆分为 Aria 层（负责滚动追踪、目标解析、动画和可见性状态）和 styled 层（负责 `backtopVariants` 配方，扩展 `buttonVariants` 加 `fixed z-50` 和基于尺寸的 `bottom-* end-*` 定位）。遵循 VeanUI Aria/styled 分离模式。

| 维度       | VeanUI                                        | Ant Design `BackTop`         | Element Plus `Backtop`       | Naive UI `BackTop`           |
| :--------- | :-------------------------------------------- | :--------------------------- | :--------------------------- | :--------------------------- |
| 架构       | Aria + styled 分离                            | 仅 styled                    | 仅 styled                    | 仅 styled                    |
| 平滑滚动   | `requestAnimationFrame` + `easeInOutCubic`    | `requestAnimationFrame`      | `requestAnimationFrame`      | `requestAnimationFrame`      |
| 减弱动画   | ✅ `prefers-reduced-motion`                   | —                            | —                            | —                            |
| 目标类型   | `window` / `HTMLElement` / `Ref` / CSS 选择器 | `HTMLElement` / 函数         | `HTMLElement` / 字符串       | `HTMLElement` / 字符串       |
| 可见性阈值 | `visibilityHeight`（number）                  | `visibilityHeight`（number） | `visibilityHeight`（number） | `visibilityHeight`（number） |
| 动画时长   | `duration`（ms）                              | —                            | —                            | —                            |
| Aria 导出  | ✅ `Backtop`                                  | —                            | —                            | —                            |
| 禁用状态   | ✅ 继承自 Button                              | —                            | —                            | —                            |

### 运行时注意事项

- **`hidden` 属性**：按钮不可见时，Aria 层在 `<button>` 上设置 `hidden`，应用 `display: none`。这会阻止显示/隐藏的 CSS 过渡。如需淡入淡出过渡，覆盖 `[hidden] { display: block; }` 并在自定义类中使用 opacity/visibility 过渡。
- **焦点管理**：按钮在聚焦状态下变为不可见时（如滚动到顶部后），Aria 层自动失焦，防止焦点被困在隐藏元素上。
- **滚动监听清理**：Aria 层使用 `useEventListener` 配合 `onWatcherCleanup`，在目标变更或组件卸载时移除滚动监听器。无需手动清理。
- **`target` 响应性**：运行时修改 `target` 或 `visibilityHeight` 会触发目标重新解析和通过 `nextTick` 的可见性重检。

### 常见问题

**如何指定特定的可滚动容器作为目标？**
传入元素或 CSS 选择器：`<SBacktop target="#my-scroll-container" />` 或 `<SBacktop :target="scrollRef" />`。组件会解析目标并监听其 `scroll` 事件。

**如何禁用平滑动画？**
设 `duration={0}`：`<SBacktop :duration="0" />`。用户启用 `prefers-reduced-motion: reduce` 时组件也会自动跳过动画。

**可以使用自定义按钮替代默认样式吗？**
可以。从 `@vean/aria/backtop` 导入 Aria `Backtop`，用自定义按钮组合：

```vue
<script setup lang="ts">
import { Backtop } from '@vean/aria/backtop';
</script>

<template>
  <Backtop :visibility-height="200" class="my-custom-button">
    <MyIcon />
  </Backtop>
</template>
```

**为什么点击后按钮立即消失？**
滚动到顶部后，滚动位置低于 `visibilityHeight`，按钮因此隐藏。Aria 层在隐藏前自动失焦按钮，避免焦点被困在隐藏元素上。

**如何更换默认图标？**
传入 `icon` prop：`<SBacktop icon="lucide:chevron-up" />`。使用 `iconClass` 控制图标样式，`iconProps` 传递额外 `SIcon` props。
