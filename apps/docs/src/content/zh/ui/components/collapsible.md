---
head:
  title: 折叠面板
  description: 用于展开/收起面板的交互组件。SCollapsible 包裹 Aria 层 CollapsibleRoot，并注入 collapsibleVariants 样式配方（3 个槽：root/trigger/content；6 种尺寸）；Aria 层 CollapsibleTrigger/CollapsibleContent 基础组件提供切换按钮与带动画的面板。
---

# 折叠面板

## 概述

用于展开/收起面板的交互组件。`SCollapsible` 包裹 Aria 层 `CollapsibleRoot`，并注入 `collapsibleVariants` 样式配方（3 个槽：root/trigger/content；6 种尺寸）；Aria 层 `CollapsibleTrigger`/`CollapsibleContent` 基础组件提供切换按钮与带动画的面板。

适用于单个「展开显示」区块、FAQ 项或内联可折叠筛选。需要多个协调区块（单开/多开）时请优先使用 `accordion`；浮动表面请优先使用 `dialog`/`popover`。

## 用法

<UsageCode component="collapsible" />

## 特性

- 🧩 Aria/样式分离 — `SCollapsible` 注入 `collapsibleVariants`；Aria 基础组件负责状态、无障碍与动画
- 🎛️ 受控 / 非受控 — `v-model:open` 或 `defaultOpen`
- 📜 带动画面板 — `CollapsibleContent` 测量真实尺寸，并依据 `data-state` 播放展开/收起动画
- 🗑️ `unmountOnHide` — 移除已关闭的内容，或保持其挂载（隐藏）
- 🧲 `forceMount` — 关闭时仍保持内容存在（用于测量/自定义动画）
- 🔗 无障碍接线 — 触发器暴露 `aria-expanded`/`aria-controls`；root/content 反映 `data-state`/`data-disabled`
- 🔧 多态 — root、trigger、content 均支持 `as`/`asChild`

## 组件家族

- `SCollapsible`（样式层）— 根包装组件；`collapsibleVariants` 配方与 `provideCollapsibleUi`
- `CollapsibleRoot`（Aria）— 状态所有者；`useControllableState` + `provideCollapsibleRootContext`
- `CollapsibleTrigger`（Aria）— 基于 `Button` 的触发器；`aria-expanded`/`aria-controls`/`data-state`
- `CollapsibleContent`（Aria）— 带动画面板；基于 presence 的尺寸测量与 `data-state`

## 演示

<PlaygroundGallery component="collapsible" />

## API

<ComponentApi component="collapsible" />

## 注意事项

### 架构与对标差异

`SCollapsible` 是薄样式包装；Aria 基础组件负责打开状态（`useControllableState`）、presence/动画循环（`usePresence` + `getBoundingClientRect` 尺寸测量）与无障碍接线（`aria-expanded`/`aria-controls`/`data-state`）。这与 shadcn/ui 及 Radix 的 headless `Collapsible` 一致；而 Ant Design、Element Plus、Mantine 则提供配置驱动的折叠。VeanUI 将触发器接入其 `Button` 基础组件，从而复用样式化 `Button` 变体，而非自造切换控件。

| 能力              | VeanUI | shadcn/ui | Radix Collapsible | Ant Design | Element Plus | Mantine |
| :---------------- | :----: | :-------: | :---------------: | :--------: | :----------: | :-----: |
| Aria/样式分离     |   ✅   |    ✅     |        ✅         |     —      |      —       |    —    |
| 受控 / 非受控     |   ✅   |    ✅     |        ✅         |     ✅     |      ✅      |   ✅    |
| 高度动画          |   ✅   |    ✅     |        ✅         |     ✅     |      ✅      |   ✅    |
| `unmountOnHide`   |   ✅   |    ✅     |        ✅         |     —      |      —       |    —    |
| `forceMount`      |   ✅   |    ✅     |        ✅         |     —      |      —       |    —    |
| `as`/`asChild`    |   ✅   |    ✅     |        ✅         |     —      |      —       |    —    |
| 触发器复用 Button |   ✅   |     —     |         —         |     —      |      —       |    —    |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 折叠动画用 `getBoundingClientRect` 测量真实尺寸，因此仅在客户端运行；SSR 下首帧直接渲染开/合状态而不播放动画。
- `unmountOnHide: true`（默认）会从 DOM 移除已关闭内容；`false` 时保持挂载但隐藏（`hidden="until-found"`）。
- `forceMount` 关闭时仍保留内容元素——请配合自己的动画/过渡来控制展示。
- 请通过 Aria 层 `CollapsibleTrigger`（`Button`）接线触发器，以保持 `aria-expanded`/`aria-controls` 正确；自定义按钮需手动设置这些属性。
- 内容元素带有 `data-state`/`data-disabled`，配方的 `data-[state=open]:animate-*` 类驱动过渡。

### Roadmap

核心折叠 API 无阻塞缺口。

## FAQ

### 如何构建带切换按钮的折叠面板？

使用 `SCollapsible` 与 Aria 层 `CollapsibleTrigger`（样式化按钮触发器）：

```vue
<SCollapsible v-model:open="open">
  <template #default="{ open }">
    <SCollapsibleTrigger>切换（{{ open ? '开' : '关' }}）</SCollapsibleTrigger>
    <SCollapsibleContent>隐藏的面板内容</SCollapsibleContent>
  </template>
</SCollapsible>
```

### 如何控制打开状态？

用 `v-model` 绑定 `open`（或使用 `default-open`）：

```vue
<SCollapsible v-model:open="open">…</SCollapsible>
```

### 如何让内容在关闭时保持挂载？

设置 `unmount-on-hide="false"`，使其保留在 DOM 中（隐藏）而非被移除：

```vue
<SCollapsible :unmount-on-hide="false">…</SCollapsible>
```

### 如何使用自己的过渡动画？

使用 `force-mount`，并用自定义类或 `<Transition>` 驱动展示：

```vue
<SCollapsible force-mount>…</SCollapsible>
```

### 面板是否支持键盘无障碍？

支持——`CollapsibleTrigger` 是真实的 `<button>`，会设置指向内容 id 的 `aria-expanded` 与 `aria-controls`，内容反映 `data-state`；切换后焦点停留在触发器上。
