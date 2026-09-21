---
head:
  title: 列表
  description: '用于展示垂直列表项列表的语义化容器。SList 与 SListItem 是 UI-only 组件：自绘 <ul>/<li> 与 item/content/title/description 解剖节点，样式来自 listVariants 配方（5 个槽：root/item/content/title/description；6 种尺寸）。'
---

# 列表

## 概述

用于展示垂直列表项列表的语义化容器。`SList` 与 `SListItem` 是 **UI-only** 组件：自绘 `<ul>`/`<li>` 与 item/content/title/description 解剖节点，并通过 UI 层的小型上下文共享 `listVariants` 样式配方（5 个槽：root/item/content/title/description；6 种尺寸）。

适用于用户列表、设置/菜单分组、通知流，或任何简单的垂直集合。表格化、带列与排序的数据请优先使用 `table`；层级数据请优先使用 `tree`；可选的选项列表请优先使用 `select`/`combobox`。

Aria 层不存在 `list` 家族：纯 `ul`/`li` 不含自身的键盘、焦点或 ARIA widget 逻辑，不应留在 Aria 层。需要交互的列表请改用已准入的 `listbox` / `tree` 家族。

## 用法

<UsageCode component="list" />

## 特性

- 🧩 UI-only 解剖壳 — `SList`/`SListItem` 自持结构，通过 UI 层的 `provideListUi` 上下文共享 `listVariants` 类；Aria 层没有 `list` 家族
- 📋 语义化标记 — 渲染真实的 `<ul>`/`<li>`，带 `data-vean-list-*` 钩子
- 🏷️ 条目组合 — `SListItem` 通过 `title`/`description` prop 或插槽渲染可选的标题 + 描述区块
- ↔️ 前导 / 尾随 — `SListItem` 上的 `leading`/`trailing` 插槽，用于图标、徽标、头像或操作
- 🎨 6 种尺寸 — 匹配 `ThemeSize` 的 xs–2xl `size`
- 🎛️ 逐槽控制 — `contentProps`/`titleProps`/`descriptionProps` 转发到各条目部件
- ♿ 无障碍友好 — 语义化列表结构，`axe-core` 零违规

## 组件家族

- `SList` — 列表容器；渲染带 `root` 槽的 `<ul>`，并向条目下发 `listVariants`
- `SListItem` — 条目行；渲染 `<li>` 及 `item`/`content`/`title`/`description` 节点，暴露 `leading`/`trailing`/`title`/`description`/默认插槽

## 演示

<PlaygroundGallery component="list" />

## API

<ComponentApi component="list" />

## 注意事项

### 架构与对标差异

`SList`/`SListItem` 是 UI-only 组件：纯 `ul`/`li` 解剖壳未通过 Aria 删除测试，因此该家族已从 Aria 层移除，结构留在 UI 层，样式全部收敛于 `listVariants`，槽位类通过 `provideListUi` 下发。这与 shadcn/ui 的「组合优先」一致；而 Ant Design、Element Plus、Mantine、Naive UI 则提供配置驱动的列表（`dataSource`/`renderItem`）。VeanUI 刻意将 `SList` 保持为展示型容器——数据迭代由使用者负责——因此超大数据的虚拟滚动由独立的 `virtualizer` 组件承担，而非内置虚拟滚动。需要交互的列表请使用 `listbox` / `tree`，而非 `SList`。

| 能力             | VeanUI | shadcn/ui | Ant Design List | Element Plus | Mantine List | Naive UI |
| :--------------- | :----: | :-------: | :-------------: | :----------: | :----------: | :------: |
| Aria/样式分离    |   ✅   |    ✅     |        —        |      —       |      —       |    —     |
| 语义化 `ul`/`li` |   ✅   |    ✅     |       ✅        |      ✅      |      ✅      |    ✅    |
| 标题 + 描述条目  |   ✅   |     —     |       ✅        |      ✅      |      ✅      |    ✅    |
| 前导 / 尾随插槽  |   ✅   |     —     |       ✅        |      ✅      |      ✅      |    ✅    |
| 尺寸变体（6）    |   ✅   |     —     |       ✅        |      ✅      |      ✅      |    ✅    |
| 内置虚拟滚动     |   ➕   |     —     |       ✅        |      —       |      ✅      |    ✅    |

`—` = 不支持或采用不同交互模型；`➕` = 有价值增强项（交由 `virtualizer` 承担）。

### 运行时注意

- `SList` 是展示型容器：不持有数据迭代或虚拟滚动。1k+ 条目请直接渲染条目，或与独立的 `virtualizer` 组件组合。
- 条目渲染为 `<ul>` 内的 `<li>`。请保持直接子节点为列表项，避免嵌套会破坏列表语义的完整交互块。
- 需要「标题 + 描述」行时使用 `SListItem`；简单列表也可直接在 `SList` 中放置原生 `<li>` 元素。
- 条目标题渲染为 `<h3>`、描述渲染为 `<p>`；若列表属于文档大纲，请通过 `size`/`class` 或自定义结构让标题层级保持合理。

### Roadmap

内置虚拟化列表或 `dataSource`/`renderItem` 配置模式为已评估增强项，当前交由独立的 `virtualizer` 承担（见 `docs/roadmap.md`）。

## FAQ

### 如何构建带标题与描述的列表？

使用带 `title`/`description` 的 `SListItem`：

```vue
<SList>
  <SListItem title="更新日志" description="查看 v0.29 的新内容" />
  <SListItem title="指南" description="一步步教程" />
</SList>
```

### 如何在条目中添加图标或头像？

使用 `leading` 插槽（操作用 `trailing`）：

```vue
<SListItem title="Jenny" description="产品设计师">
  <template #leading><SAvatar src="/jenny.png" fallback-label="J" /></template>
  <template #trailing><SIcon icon="lucide:chevron-right" /></template>
</SListItem>
```

### 如何改变列表尺寸？

传入 `size`（xs–2xl）：

```vue
<SList size="lg">
  <SListItem title="大号列表" />
</SList>
```

### 如何高效渲染超大列表？

`SList` 是展示型容器——1k+ 行请直接渲染条目，或使用独立的 `virtualizer` 仅保留可见行在 DOM 中。

### 如何让条目可点击？

列表项默认不可交互，请自行包裹可点击表面（链接或 `SButton`）：

```vue
<SList>
  <SListItem title="打开资料">
    <template #trailing><a href="/profile" class="text-primary">查看</a></template>
  </SListItem>
</SList>
```
