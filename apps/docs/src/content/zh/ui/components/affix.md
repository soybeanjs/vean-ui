---
head:
  title: Affix
  description: Affix 可以在页面或自定义滚动容器滚动时，将内容固定在顶部或底部边缘。
---

# Affix

## 概述

Affix 可以在页面或自定义滚动容器滚动时，将内容固定在顶部或底部边缘。

> 注意：除了 SAffix，Aria 层现在还导出了用于默认占位/内容结构组合的 AffixCompact，同时也保留了 AffixRoot、AffixPlaceholder、AffixContent 和 provideAffixUi，便于完全自定义组合与样式注入。

## 功能

- **固定顶部或底部** — `offsetTop` 在占位元素滚过阈值后将内容固定到目标顶部边缘；`offsetBottom` 固定到底部边缘。两者都未设置时，内容固定到目标顶部偏移 `0` 处。
- **自定义滚动目标** — `target` 接受 `HTMLElement`、CSS 选择器字符串或 `window`（默认）。目标上的 scroll、touch、resize、`load`、`pageshow` 事件均触发重新定位。
- **占位元素保留** — 固定时隐藏的占位节点（`role="presentation"`、`aria-hidden`）保留布局空间，下方内容不跳动。
- **响应式状态** — 根节点与内容节点输出 `data-state="fixed|static"`，`change` 事件仅在状态切换时触发（固定时 `true`，释放时 `false`）。
- **零尺寸保护** — 占位元素 rect 全为零（如 `display: none` 或尚未渲染）时跳过定位，避免错误固定。
- **宽度与 left 保留** — 固定元素继承占位元素的 `width` 与 `left`，切换时布局与对齐保持一致。
- **rAF 节流更新** — scroll/touch/resize 处理通过 `useRafFn` 帧合并（每帧最多测量一次），避免快速滚动时布局抖动。
- **动态目标切换** — `target` prop 变化时，监听器从旧目标解绑并绑定到新目标（`onWatcherCleanup`）。
- **命令式 API** — `AffixRoot` 通过 `defineExpose` 暴露 `affixed` 与 `updatePosition()`。
- **SSR 安全** — `window` / `document` 访问均有守卫（`getDefaultTarget` / `queryTargetSelector` / `measurePosition`），监听器仅客户端激活。
- **Aria 组合** — `AffixRoot` / `AffixPlaceholder` / `AffixContent` / `AffixCompact` 从 `@vean/aria/affix` 导出，可完全自定义样式构建。

## 用法

<UsageCode component="affix" />

## 演示

<PlaygroundGallery component="affix" />

## API

<ComponentApi component="affix" />

## 注意事项

### 架构与行业对标

| 关注点                | VeanUI                               | Ant Design `Affix`              | Element Plus `Affix`  |
| :-------------------- | :----------------------------------- | :------------------------------ | :-------------------- |
| Aria / 样式分离       | ✅ `@vean/aria/affix` + `scv()` 配方 | ❌ 单一样式包                   | ❌ 单一样式包         |
| 固定顶部 / 底部       | ✅ `offsetTop` / `offsetBottom`      | ✅ `offsetTop` / `offsetBottom` | ✅ `offset`           |
| 自定义 target         | ✅ 元素 / 选择器 / window            | ✅ `target`（函数）             | ✅ `target`（函数）   |
| 占位保留              | ✅ 隐藏占位节点保留空间              | ✅ `placeholder` 节点           | ✅ `placeholder` 节点 |
| `change` 状态切换事件 | ✅ 仅在状态变化时触发                | ✅ `onChange`                   | ✅ `on-change`        |
| rAF 节流测量          | ✅ `useRafFn` 帧合并                 | ✅ rAF 循环                     | ✅ rAF 循环           |
| 触摸事件              | ✅ scroll + touchstart/move/end      | ✅ 触摸支持                     | —                     |
| 动态目标切换          | ✅ `onWatcherCleanup` 清理监听       | ✅ `updatePosition` 重新初始化  | ✅ `update`           |
| 零尺寸保护            | ✅ rect 全零时跳过                   | —                               | —                     |
| 命令式 API            | ✅ `affixed` + `updatePosition()`    | ✅ `updatePosition`             | —                     |
| SSR 安全              | ✅ `window` / `document` 守卫        | 部分                            | 部分                  |

### 运行时注意事项

1. **偏移相对于目标 rect** — `top = offsetTop + targetRect.top`，`bottom = offsetBottom + (window.innerHeight - targetRect.bottom)`。两者可同时设置，阈值都通过时后者生效。
2. **零尺寸保护** — `isZeroRect` 在占位元素 rect 全零（未渲染、`display: none`、隐藏）时跳过定位，避免 SSR 水合或动画期间错误固定。
3. **测量 rAF 合并** — `useRafFn({ immediate: false, once: true })` 每动画帧最多执行一次 `measurePosition`，滚动事件突发仅触发一次布局读取。
4. **监听器生命周期** — scroll/touch 监听绑定到解析后的目标（变化时 `onWatcherCleanup` 清理）；`load` / `pageshow` / `resize` 绑定 `window`；卸载时全部移除。
5. **`internalOffsetTop`** — `offsetTop` 与 `offsetBottom` 都未提供时 `offsetTop` 默认为 `0`，内容贴齐目标顶部边缘。
6. **目标缺失时无操作** — 选择器目标无法解析（或 SSR 期间无 `window`）时，`measurePosition` 重置为 static 并等待下一次解析机会。

## 常见问题

### 内容何时开始固定？

当占位元素顶部滚过 `targetRect.top - offsetTop`（顶部固定）或占位元素底部越过 `targetRect.bottom + offsetBottom`（底部固定）时开始固定。固定后元素切换为 `position: fixed`，占位节点保留原空间。

### 如何用自定义滚动容器替代 window？

将滚动容器传给 `target`——可以是 DOM 元素或 CSS 选择器字符串（如 `target="#scroll-container"`）。该容器上的 scroll 与 touch 事件驱动测量。

### 为什么固定后元素保留宽度？

固定样式从占位元素 rect 复制 `width` 与 `left`，使固定元素与流内位置视觉对齐。占位节点保留 `height` 与 `width` 防止布局偏移。

### `change` 事件每次滚动都会触发吗？

不会 — `change` 仅在固定状态实际切换时触发（固定时 `true`，释放时 `false`）。已固定状态下滚动不触发任何事件。

### 占位节点会被屏幕阅读器播报吗？

不会 — 占位节点是 `role="presentation"` 且 `aria-hidden="true"`，对辅助技术不可见，仅保留布局空间。

### 如何编程触发重新定位？

`AffixRoot` 暴露 `affixed` 与 `updatePosition()`。在组件无法观察到的布局变化后（如固定元素内部内容尺寸变化）调用 `updatePosition()`。

### 支持 SSR 吗？

支持 — 所有 `window` / `document` 访问均有守卫。服务端仅渲染静态内容；客户端元素与目标存在后激活定位。

## Aria 组合

当默认的占位/内容结构已经满足需求时，可以直接从 `@vean/aria/affix` 使用 `AffixCompact`。如果你需要分别控制根节点、占位节点和内容节点，则可以直接组合 Aria 原语组件：

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { AffixContent, AffixPlaceholder, AffixRoot, provideAffixUi } from '@vean/aria';

const ui = computed(() => ({
  content: 'data-[state=fixed]:z-50'
}));

provideAffixUi(ui);
</script>

<template>
  <AffixRoot :offset-top="24">
    <AffixPlaceholder />
    <AffixContent>
      <button type="button">返回顶部</button>
    </AffixContent>
  </AffixRoot>
</template>
```
