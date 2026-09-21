---
head:
  title: 加载指示器
  description: 'SSpinner 是基于 SIcon 封装的轻量级加载指示器，默认使用 Iconify 的 svg-spinners 图标集合，适合按钮加载、内容占位、异步请求指示等内联加载场景。通过 color 和 size prop 匹配周围 UI，或通过 icon prop 替换为任意 svg-spinners:* 动画。'
---

# 加载指示器

## 概述

`SSpinner` 是基于 `SIcon` 封装的轻量级加载指示器，默认使用 Iconify 的 `svg-spinners` 图标集合，适合按钮加载、内容占位、异步请求指示等内联加载场景。通过 `color` 和 `size` prop 匹配周围 UI，或通过 `icon` prop 替换为任意 `svg-spinners:*` 动画。

## 用法

<UsageCode component="spinner" />

## 功能

- 🎬 **Iconify svg-spinners** — 默认 `svg-spinners:270-ring`；通过 `icon` prop 替换为 `svg-spinners` 集合中的任意图标。
- 🎨 **主题色** — 八种颜色（`current`、`primary`、`destructive`、`success`、`warning`、`info`、`carbon`、`secondary`、`accent`），使用语义化 token。
- 📐 **尺寸缩放** — 六档尺寸（`xs`–`2xl`）控制指示器尺寸。
- 🔧 **图标透传** — 除 `icon` 和 `color` 外的所有 `SIcon` props 均透传，`width`、`height`、`ssr` 和 ARIA 属性自然传递。
- ♿ **按需无障碍** — 传入 `aria-label="Loading"` 可让屏幕阅读器播报；默认 `aria-hidden` 适用于内嵌在含文本元素中的场景。
- 🌐 **暗色模式** — 使用语义化颜色 token，自动适配暗色主题。

## 演示

<PlaygroundGallery component="spinner" />

## API

<ComponentApi component="spinner" />

## 注意事项

### 架构与对标差异

`SSpinner` 是 UI-only 组件——无 Aria 层，因为它是 `SIcon`（已有 Aria 层）的轻量预设。它应用 `spinnerVariants` `cv()` 配方（color/size）并将其他 `IconProps` 转发给 `SIcon`。这与 shadcn/ui `Spinner` 以图标封装预设样式的做法一致。

| 维度       | VeanUI                                    | shadcn/ui `Spinner` | MUI `CircularProgress` | Mantine `Loader` | Ant Design `Spin` |
| :--------- | :---------------------------------------- | :------------------ | :--------------------- | :--------------- | :---------------- |
| 架构       | UI-only 预设，封装 `SIcon`                | styled SVG          | styled SVG             | styled SVG       | 组件 + 提示文字   |
| 图标来源   | Iconify `svg-spinners`（可替换）          | 内联 SVG（固定）    | 内联 SVG（固定）       | 内联 SVG（固定） | 内联 SVG（固定）  |
| 颜色变体   | 8 个语义 token                            | —                   | `color` prop           | `color` prop     | —                 |
| 尺寸缩放   | `xs`–`2xl`（6 档）                        | `sm`–`lg`           | `size` prop            | `xs`–`xl`        | `small`/`default` |
| 自定义图标 | `icon` prop 接受任意 `svg-spinners:*`     | —                   | —                      | —                | `indicator` slot  |
| 无障碍     | 默认 `aria-hidden`；`aria-label` 按需启用 | `role="status"`     | `aria-label`           | —                | `tip` 文字        |

### 运行时注意事项

- **无障碍**：Spinner 默认从 `SIcon` 继承 `aria-hidden="true"`。这是有意为之——最常见的场景是 spinner 内嵌在已有文本的按钮中（如 "Loading..."）。对于独立加载指示器，请传入 `aria-label="Loading"` 让屏幕阅读器播报加载状态。
- **图标可替换性**：`icon` prop 类型为 `` `svg-spinners:${string}` ``，确保仅使用有效的 Iconify spinner 图标。如需使用非 spinner 图标，请直接使用 `SIcon`。
- **color 与 `text-*`**：`color` prop 应用语义化主题色类名（如 `text-primary`）。如需自定义颜色，传入 `class` 覆盖（如 `class="text-orange-500"`）；`class` prop 通过 `cv()` 与变体类名合并。

### 常见问题

**如何让 spinner 对屏幕阅读器可见？**
传入 `aria-label`：`<SSpinner aria-label="加载中" />`。不传则 spinner 为 `aria-hidden`，辅助技术不可见。当 spinner 位于已有描述文字的按钮或文本旁时，`aria-hidden` 是正确行为。

**可以使用不同的 spinner 动画吗？**
可以。传入 Iconify `svg-spinners` 集合中的任意图标：`<SSpinner icon="svg-spinners:ring-resize" />`。可在 [icones.js.org](https://icones.js.org/collection/svg-spinners) 浏览可用图标。

**如何超越 `size` prop 控制 spinner 尺寸？**
`size` prop 映射到固定尺寸（`size-3` 到 `size-10`）。如需自定义尺寸，传入 `width` 和 `height` props（透传到 `SIcon`）或用 `class="w-8 h-8"` 覆盖。

**为什么 Spinner 没有 Aria 层？**
Spinner 是纯展示性图标预设——无状态、无交互、无超出 `SIcon` 已有能力的 ARIA 逻辑。添加 Aria 层是不必要的间接层。Aria/styled 分离已在 `SIcon` 中实现。
