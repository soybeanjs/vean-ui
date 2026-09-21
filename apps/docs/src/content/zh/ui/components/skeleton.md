---
head:
  title: 骨架屏
  description: 用于提示内容仍在加载的占位组件。SSkeleton 组合 Aria 层 Skeleton 基础组件（零样式）与 skeletonVariants 样式配方（6 种尺寸 × 2 种形状 × 动画开关），并默认装饰性（aria-hidden）。
---

# 骨架屏

## 概述

用于提示内容仍在加载的占位组件。`SSkeleton` 组合 Aria 层 `Skeleton` 基础组件（零样式）与 `skeletonVariants` 样式配方（6 种尺寸 × 2 种形状 × 动画开关），并默认装饰性（`aria-hidden`）。

适用于在数据加载期间预留空间、减少布局偏移——卡片、表格、列表与详情块。动作上的「请稍候」无限等待请优先使用 `spinner`；最终的空数据状态请优先使用 `empty`。

## 用法

<UsageCode component="skeleton" />

## 特性

- 🧩 Aria/样式分离 — Aria 层 `Skeleton` 负责 `aria-hidden`/`as`/`asChild`；`SSkeleton` 注入 `skeletonVariants`
- 📐 6 种尺寸预设 — xs–2xl，同时设置高度与宽度
- 🟦 2 种形状 — `auto`（圆角）与 `rounded`（胶囊/圆形）
- ⚡ 动画 — 默认 `animate-pulse`；设 `animated=false` 为静态块
- ♿ 默认装饰性 — 默认 `aria-hidden="true"`（可覆盖），不会干扰辅助技术
- 🔧 多态 — `as`/`asChild` 渲染为任意元素
- 🎛️ 自定义尺寸 — 通过 `class` 覆盖尺寸，用于定制占位

## 组件家族

- `SSkeleton`（样式层）— 入口包装组件；`skeletonVariants` 配方
- `Skeleton`（Aria）— 无状态基础组件；`aria-hidden` 默认 + `as`/`asChild`

## 演示

<PlaygroundGallery component="skeleton" />

## API

<ComponentApi component="skeleton" />

## 注意事项

### 架构与对标差异

Aria 层 `Skeleton` 是无状态基础组件，仅负责装饰性 `aria-hidden` 默认与多态；`SSkeleton` 将全部样式收敛于 `skeletonVariants`。这与 shadcn/ui 的 headless/样式分离一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供带 `paragraph`/`avatar`/`title` 组合 prop 的单一样式化骨架屏。VeanUI 保持最小化（单一基础组件），期望使用者以 grid/flex 组合占位——`size` 尺寸体系与 `rounded` 胶囊形状覆盖了单包库作为预设暴露的常见场景。

| 能力               | VeanUI | shadcn/ui | Ant Design Skeleton | Element Plus Skeleton | Mantine Skeleton | Naive UI Skeleton |
| :----------------- | :----: | :-------: | :-----------------: | :-------------------: | :--------------: | :---------------: |
| Aria/样式分离      |   ✅   |    ✅     |          —          |           —           |        —         |         —         |
| 动画 pulse         |   ✅   |    ✅     |         ✅          |          ✅           |        ✅        |        ✅         |
| 尺寸变体（6）      |   ✅   |     —     |          —          |          ✅           |        ✅        |         —         |
| 形状（圆角/胶囊）  |   ✅   |     —     |          —          |           —           |        —         |         —         |
| 默认 `aria-hidden` |   ✅   |     —     |          —          |           —           |        —         |         —         |
| `as`/`asChild`     |   ✅   |    ✅     |          —          |           —           |        —         |         —         |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `SSkeleton` 是装饰性的，默认 `aria-hidden`。若占位具有含义，请在可访问容器中放置视觉隐藏标签（或加载完成后替换为真实内容）。
- `animated` 默认 `true`（`animate-pulse`）。为避免动效可设 `animated="false"`。
- `size` 预设同时设置宽高；自定义尺寸请用 `class`（如 `w-full h-32`）。
- 组合多个 `SSkeleton` 块并使用自己的布局（flex/grid）形成卡片/表格形占位。
- 默认渲染为 `<div>`；需要其他元素时使用 `as`/`asChild`。

### Roadmap

核心骨架屏 API 无阻塞缺口。组合式骨架块（title/avatar/paragraph）交由使用者组合而非内置预设。

## FAQ

### 如何渲染圆形骨架屏？

使用 `shape="rounded"`：

```vue
<SSkeleton shape="rounded" class="size-12" />
```

### 如何关闭动画？

设置 `animated="false"`：

```vue
<SSkeleton :animated="false" />
```

### 如何设置自定义尺寸？

用 `class` 覆盖（预设只提供默认值）：

```vue
<SSkeleton class="h-16 w-full" />
```

### 是否无障碍？

是的——`SSkeleton` 默认 `aria-hidden`，屏幕阅读器会忽略它。若加载状态有意义，请用 `aria-live`/`aria-label` 容器包裹，并在就绪后替换为真实内容。

### 如何构建卡片形占位？

用自定义布局组合多个块：

```vue
<div class="space-y-3 rounded-md border p-4">
  <SSkeleton class="h-6 w-1/3" />
  <SSkeleton class="h-4 w-full" />
  <SSkeleton class="h-4 w-2/3" />
</div>
```
