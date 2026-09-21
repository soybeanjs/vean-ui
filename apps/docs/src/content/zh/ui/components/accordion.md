---
head:
  title: 手风琴
  description: 一组垂直（或水平）堆叠的交互式标题，每个标题可展开一块内容，支持单选或多选展开。SAccordion 组合 AccordionRoot/AccordionItem/AccordionHeader/AccordionTrigger/AccordionContent/AccordionDescription 这一系列 Aria 基础组件（零样式）与 accordionVariants 样式配方（8 个槽、6 种尺寸）。
---

# 手风琴

## 概述

一组垂直（或水平）堆叠的交互式标题，每个标题可展开一块内容，支持单选或多选展开。`SAccordion` 组合 `AccordionRoot`/`AccordionItem`/`AccordionHeader`/`AccordionTrigger`/`AccordionContent`/`AccordionDescription` 这一系列 Aria 基础组件（零样式）与 `accordionVariants` 样式配方（8 个槽、6 种尺寸）。

适用于 FAQ、设置分组、可折叠导航，或任何「展开显示」的模式（一次打开一个或多个区块）。当一次只需显示一个面板且每个面板有持久标签时请优先使用 `tabs`；单个独立折叠区块请优先使用 `collapsible`。

`SAccordion` 通过 `AccordionCompact` 聚合这些基础组件，并以 `items` 数据驱动，提供 `item`/`leading`/`title`/`trigger-icon`/`content` 插槽。需要完全自定义组合时，可直接使用 Aria 层的 `AccordionRoot` 系列基础组件。

## 用法

<UsageCode component="accordion" />

## 特性

- 🧩 Aria/样式分离 — `AccordionCompact` 聚合 6 个基础组件并以 `items` 驱动；`SAccordion` 只注入样式并转发插槽/事件
- 🎚️ 单选 / 多选 — `multiple` 切换单开/多开（`M extends boolean` 泛型）；`collapsible` 允许全部关闭
- ⌨️ 键盘导航 — 方向键在触发器间移动（`useArrowNavigation`），遵循 `orientation` 与 `dir`；触发器暴露 `aria-expanded`/`aria-disabled`/`data-state`
- 🧭 方向 — `vertical`（默认）或 `horizontal`
- ⛔ 禁用条目 — 逐条 `disabled` 与根 `disabled` 传播
- 🎨 6 种尺寸 — 匹配 `ThemeSize` 的 xs–2xl `size`
- 🔧 完全可定制 — 触发器支持 `as`/`asChild`，`leading`/`title`/`trigger-icon`/`content`/`item` 插槽，以及逐槽 `ui` 覆盖
- ♿ 无障碍友好 — 真实 `<button>` 触发器带 `aria-expanded`，经 `data-state` 实现折叠动画，`axe-core` 零违规

## 组件家族

- `SAccordion`（样式层）— 入口包装组件；`accordionVariants` 配方配合动态插槽转发
- `AccordionRoot`（Aria）— 状态所有者；`useSelection` 管理单选/多选 `modelValue`，暴露 `dir`/`orientation`
- `AccordionItem`（Aria）— 单个区块；从根派生 open/disabled 状态并接入方向键导航
- `AccordionHeader`（Aria）— 承载触发器的头部容器
- `AccordionTrigger`（Aria）— `<button>` 触发器；`aria-expanded`/`aria-disabled`/`data-state` 与点击切换
- `AccordionContent`（Aria）— 带动画的折叠内容（`CollapsibleContent`）
- `AccordionDescription`（Aria）— 内容中的默认描述文本
- `AccordionCompact`（Aria）— 聚合组件；将 `items` 迭代为条目并暴露自定义插槽

## 演示

<PlaygroundGallery component="accordion" />

## API

<ComponentApi component="accordion" />

## 注意事项

### 架构与对标差异

`AccordionCompact` 负责 `items` 迭代与默认内容装配，所有基础组件保持零样式，仅由 UI 包装组件注入 `accordionVariants` 类。这与 shadcn/ui 的 headless 分离及 Radix 的 `Accordion` 原语一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供 `defaultActiveKey`/`activeKey` 配置驱动的折叠。VeanUI 的根使用 `useSelection`，使单选/多选共享同一状态模型，方向键导航复用菜单家族一致的 `useArrowNavigation` 组合式函数。

| 能力                        | VeanUI | shadcn/ui | Ant Design Collapse | Element Plus Collapse | Mantine Accordion | Naive UI Collapse |
| :-------------------------- | :----: | :-------: | :-----------------: | :-------------------: | :---------------: | :---------------: |
| Aria/样式分离               |   ✅   |    ✅     |          —          |           —           |         —         |         —         |
| 单选 / 多选                 |   ✅   |    ✅     |         ✅          |          ✅           |        ✅         |        ✅         |
| 可全部关闭                  |   ✅   |    ✅     |         ✅          |          ✅           |        ✅         |        ✅         |
| 方向键导航                  |   ✅   |    ✅     |         ✅          |          ✅           |        ✅         |        ✅         |
| 自定义触发器图标            |   ✅   |     —     |         ✅          |          ✅           |        ✅         |        ✅         |
| 数据驱动 `items`（Compact） |   ✅   |     —     |         ✅          |          ✅           |        ✅         |        ✅         |
| 禁用条目                    |   ✅   |    ✅     |         ✅          |          ✅           |        ✅         |        ✅         |
| 方向（v/h）                 |   ✅   |     —     |         ✅          |          ✅           |         —         |         —         |
| `as`/`asChild` 触发器       |   ✅   |    ✅     |          —          |           —           |         —         |         —         |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 单选模式（`multiple: false`）下仅保持一个区块展开；`collapsible`（默认 `true`）时点击已展开的触发器会关闭它，使所有区块都关闭。
- 方向键导航要求某个触发器已聚焦；按键遵循 `orientation`（纵向 `ArrowUp`/`ArrowDown`，横向 `ArrowLeft`/`ArrowRight`），并在 RTL 下经 `dir` 交换。
- `unmountOnHide`（默认 `true`）卸载已关闭的内容；设为 `false` 可使其保留在 DOM 中（例如保留内部表单状态）。
- 默认触发器 chevron 依据 `data-state` 由 CSS 旋转；需要不同指示符时通过 `trigger-icon` 插槽替换。
- 禁用条目忽略点击、被方向键导航跳过，但仍在 DOM 顺序中可被辅助技术触达。

### Roadmap

核心手风琴 API 无阻塞缺口。边框 `variant` 变体与 `left` 图标触发器布局为已评估增强项，记录在 `docs/roadmap.md`。

## FAQ

### 如何只允许一次展开一个区块？

单选为默认——将 `modelValue` 绑定为单个值：

```vue
<SAccordion v-model="open" :items="items" />
```

### 如何允许多个区块同时展开？

设置 `multiple` 并绑定数组：

```vue
<SAccordion v-model="openList" multiple :items="items" />
```

### 如何允许所有区块关闭？

`collapsible` 默认 `true`，点击已展开的触发器即关闭：

```vue
<SAccordion collapsible :items="items" />
```

### 如何自定义触发器图标？

使用 `trigger-icon` 插槽（左侧图标用 `leading`）：

```vue
<SAccordion :items="items">
  <template #trigger-icon="{ open }">
    <SIcon :icon="open ? 'lucide:minus' : 'lucide:plus'" />
  </template>
</SAccordion>
```

### 如何构建完全自定义的条目？

使用 `item` 插槽自行组合 Aria 部件：

```vue
<SAccordion :items="items">
  <template #item="{ item, open }">
    <div class="border-b">
      <button type="button" :aria-expanded="open">{{ item.title }}</button>
      <div v-if="open">{{ item.description }}</div>
    </div>
  </template>
</SAccordion>
```
