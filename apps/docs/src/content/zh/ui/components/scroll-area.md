---
head:
  title: ScrollArea
  description: 一个带自定义滚动条的滚动容器，在保留原生滚动体验的同时支持垂直和水平方向的样式化滚动条。
---

# ScrollArea

## 概述

一个带自定义滚动条的滚动容器，在保留原生滚动体验的同时支持垂直和水平方向的样式化滚动条。

## 功能

- **原生滚动引擎** — 使用浏览器原生滚动性能，全局样式隐藏原生滚动条。
- **五种可见性模式** — `type="auto"`（溢出时可见）、`"always"`（始终可见）、`"hover"`（悬停可见）、`"scroll"`（滚动时短暂显示）、`"glimpse"`（悬停时短暂闪现）。
- **可配置隐藏延迟** — `scrollHideDelay`（默认 600ms）控制 `scroll` / `glimpse` 模式的滚动条停留时间。
- **水平与垂直滚动条** — 每个方向独立的 `ScrollAreaScrollbar`，通过 `ResizeObserver` + 滚动指标自动检测溢出。
- **可拖拽滑块** — 指针拖拽滑块滚动；点击轨道跳转视口；光标离开滑块后拖拽仍持续。
- **键盘可访问视口** — 视口可聚焦（`tabindex="0"`）且带焦点环，方向键使用原生滚动。
- **RTL 滚动归一化** — 每个 document 一次性探测浏览器三种 RTL `scrollLeft` 模式（`default` / `negative` / `reverse`），用 `WeakMap` 缓存并归一化为一致的 0 → max 坐标系，保证滑块数学与拖拽行为正确。
- **完整 ARIA 语义** — 滚动条与滑块标记 `aria-hidden`（自定义滚动条对 AT 纯装饰性）；根元素通过 `useDirection` 暴露 `dir`。
- **可组合结构** — `ScrollAreaRoot` / `ScrollAreaViewport` / `ScrollAreaScrollbar` / `ScrollAreaThumb` / `ScrollAreaCorner` 均从 `@vean/aria/scroll-area` 导出，另有 `ScrollAreaCompact` 聚合。
- **区域级属性透传** — compact 组件的 `viewportProps`、`verticalScrollbarProps`、`horizontalScrollbarProps`、`thumbProps`、`cornerProps` 透传属性到各区域。
- **角渲染** — 仅当两个滚动条同时可见时渲染角落，尺寸由交叉滚动条厚度决定。
- **尺寸缩放** — `size`（xs…2xl）通过 `scrollAreaVariants` 缩放滚动条粗细。
- **性能** — 全部状态使用 `shallowRef`；派生值经 `computed` 缓存；RTL 模式检测按 document 缓存；滚动监听 `{ passive: true }`；拖拽监听在 `pointerup` / `pointercancel` / 卸载时清理。

## 用法

<UsageCode component="scroll-area" />

## 演示

<PlaygroundGallery component="scroll-area" />

## API

<ComponentApi component="scroll-area" />

## 注意事项

### 架构与行业对标

| 关注点                    | VeanUI                                                                                                    | Radix UI ScrollArea                    | Ant Design `ScrollBar`      |
| :------------------------ | :-------------------------------------------------------------------------------------------------------- | :------------------------------------- | :-------------------------- |
| Aria / 样式分离           | ✅ `@vean/aria/scroll-area` 提供逻辑；`@vean/ui` 提供 `scv()` 配方                                        | ❌ 单一包（仅 Aria 风格核心）          | ❌ 单一样式包               |
| 可见性模式                | `auto` / `always` / `hover` / `scroll` / `glimpse`                                                        | `auto` / `always` / `hover` / `scroll` | `auto` / `always` / `hover` |
| 隐藏延迟控制              | `scrollHideDelay` prop（默认 600ms）                                                                      | `scrollHideDelay` prop（默认 600ms）   | —                           |
| RTL `scrollLeft` 归一化   | ✅ 3 模式探测（`default` / `negative` / `reverse`）+ `WeakMap` 缓存                                       | ✅ 相同方案                            | —                           |
| 滑块拖拽 + 轨道点击       | ✅ 指针拖拽 + 轨道跳转                                                                                    | ✅ 指针拖拽 + 轨道跳转                 | ✅                          |
| 键盘可聚焦视口            | ✅ `tabindex="0"` + 焦点环                                                                                | ✅                                     | —                           |
| 角落自动渲染              | ✅ 仅双滚动条可见时渲染，尺寸随厚度                                                                       | ✅                                     | —                           |
| `dir` 来自 ConfigProvider | ✅ `useDirection` 回退                                                                                    | ✅ `dir` prop                          | —                           |
| 区域级属性透传            | ✅ `viewportProps` / `verticalScrollbarProps` / `horizontalScrollbarProps` / `thumbProps` / `cornerProps` | ✅ 各组件 `asChild`                    | —                           |
| SSR 安全                  | ✅ setup 中无 `window`/`document`                                                                         | ✅                                     | —                           |

### 运行时注意事项

1. **滑块数学基于比例** — `getThumbSize` 将 `viewportSize / contentSize` 映射到轨道尺寸，钳制在 `MIN_THUMB_SIZE`（18px）以上。`getThumbOffset` 将滚动比例钳制在 `[0, 1]`，水平 RTL 时反转。
2. **指标更新触发** — 滑块尺寸与偏移在视口/内容/滚动条的 `ResizeObserver` 回调和每次视口 `scroll`（passive）时重算。`onScrollbarSizeChange` 保持根组件滚动条尺寸 ref 同步，供角落尺寸计算。
3. **拖拽可离开滑块** — `pointermove` / `pointerup` / `pointercancel` 挂在 `window`（非滑块），光标离开滑块后拖拽仍持续。监听在 `pointerup` / `pointercancel` 与卸载时移除。
4. **RTL 模式一次性探测** — `detectRtlScrollType` 在每个 `Document` 上通过临时滚动容器探测一次，结果缓存于 `WeakMap`。三种模式归一化后内部数学始终使用 0 → max 坐标系。
5. **`type` 仅影响可见性** — 溢出检测、拖拽与滚动事件在所有模式下行为一致；`type` 只决定滚动条何时绘制（`data-state="visible|hidden"`）。
6. **SSR 安全** — setup 中无 `window` / `document` 访问。RTL 探测与 `ResizeObserver` 仅在客户端元素存在后运行。

## 常见问题

### 应该使用哪种 `type`？

- `auto` — 仅内容溢出时显示滚动条。
- `always` — 存在溢出时始终绘制滚动条。
- `hover` — 指针悬停时淡入（适合桌面端）。
- `scroll` — 滚动时短暂显示，之后按 `scrollHideDelay` 隐藏。
- `glimpse` — 悬停时短暂闪现，适合极简 UI。

### 为什么滚动条是 `aria-hidden`？

自定义滚动条纯属视觉装饰；视口本身是原生滚动容器，辅助技术可依赖原生滚动语义与可聚焦视口。标记装饰为 `aria-hidden` 可避免冗余播报。

### RTL 如何工作？

在根组件上设置 `dir="rtl"`（或依赖 `ConfigProvider`）。组件在每个 document 上探测浏览器 RTL `scrollLeft` 模式并归一化滑块位置、拖拽增量与轨道点击，使其在 LTR 与 RTL 下行为一致。

### 可以自定义滚动条外观吗？

可以 — 向 `SScrollArea` 传入 `ui`（区域级类），或通过 `verticalScrollbarProps` / `horizontalScrollbarProps` / `thumbProps` 透传属性。如需完全控制，可用 `@vean/aria/scroll-area` 自行组合 `ScrollAreaRoot` / `ScrollAreaViewport` / `ScrollAreaScrollbar` / `ScrollAreaThumb`。

### 如何让视口键盘可聚焦？

默认已可聚焦 — 视口默认设置 `tabindex="0"`（可通过 `viewportProps.tabindex` 覆盖），并显示 `focus-visible` 焦点环。

### 为什么角落有时不出现？

仅当水平与垂直滚动条同时可见时才渲染角落，其尺寸与交叉滚动条厚度匹配。

### 支持 SSR 吗？

支持 — setup 不访问 `window` / `document`。RTL 探测与 `ResizeObserver` 仅在客户端视口挂载后激活。
