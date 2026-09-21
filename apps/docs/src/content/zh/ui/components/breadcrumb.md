---
head:
  title: Breadcrumb
  description: Breadcrumb（面包屑）允许用户按照页面层级结构进行导航，展示当前在应用结构中的位置。
---

# Breadcrumb

## 概述

Breadcrumb（面包屑）允许用户按照页面层级结构进行导航，展示当前在应用结构中的位置。

## 功能

- **数据驱动的 compact 组合** — `SBreadcrumb` 从 `items` 数组渲染条目；Aria `BreadcrumbCompact` 负责迭代、默认内容与内部组合（root → list → items → separators）。
- **链接 vs 当前页** — 带 `to` / `href` 的条目渲染为 `BreadcrumbLink`（复用 Link 原语）；末尾无目标条目的渲染为 `BreadcrumbPage`，带 `aria-current="page"` 与 `aria-disabled`。
- **省略号折叠** — `ellipsis: true` 在条目数 ≥5 时将所有中间条目折叠为省略号；`ellipsis: [start, end]` 支持自定义折叠范围（自动归一化：`start 0 → 1`、`end length → length - 1`）。
- **带条目数据的点击事件** — `click` 事件携带完整的被激活条目对象；disabled 条目永不触发。
- **完整 ARIA 语义** — `nav` 携带本地化 `aria-label`；分隔符与省略号为 `role="presentation"` + `aria-hidden`；当前页使用 `aria-current="page"`。
- **区域级属性透传** — `listProps`、`itemProps`、`linkProps`、`pageProps`、`separatorProps`、`ellipsisProps` 透传属性到各区域。
- **八个自定义槽** — `default`、`ellipsis`、`ellipsis-icon`、`separator`、`item-leading`、`item-link`、`item-label`、`item-trailing`，带类型化的 scoped props（`item`、`index`、`ellipsisItems`）。
- **图标支持** — 每个条目可携带 `icon`（经 `item-leading` 槽默认内容渲染），使用 `IconValue` 类型。
- **禁用条目** — 条目上的 `disabled: true` 会禁用链接并抑制 click 事件。
- **尺寸缩放** — `size`（xs…2xl）经 `breadcrumbVariants` 缩放字号与间距。
- **Aria 组合** — `BreadcrumbRoot` / `BreadcrumbList` / `BreadcrumbItem` / `BreadcrumbLink` / `BreadcrumbPage` / `BreadcrumbSeparator` / `BreadcrumbEllipsis` 从 `@vean/aria/breadcrumb` 导出，可完全自定义样式构建。

## 用法

<UsageCode component="breadcrumb" />

> `SBreadcrumb` 将列表聚合委托给 Aria `BreadcrumbCompact`。如需无样式的数据驱动组合，请从 `@vean/aria/breadcrumb` 导入 `BreadcrumbCompact`。

## 演示

<PlaygroundGallery component="breadcrumb" />

## API

<ComponentApi component="breadcrumb" />

## 注意事项

### 架构与行业对标

| 关注点               | VeanUI                                          | shadcn-vue `Breadcrumb`                   | Ant Design `Breadcrumb` | Element Plus `Breadcrumb`   |
| :------------------- | :---------------------------------------------- | :---------------------------------------- | :---------------------- | :-------------------------- |
| Aria / 样式分离      | ✅ `@vean/aria/breadcrumb` + `scv()`            | ❌ 单一包                                 | ❌ 单一包               | ❌ 单一包                   |
| 数据驱动 compact API | ✅ `items` + `ellipsis` + `click`               | ❌ 仅槽/组件组合                          | ✅ `routes` / `items`   | ✅ `breadcrumb-item` 循环   |
| 省略号折叠           | ✅ `true`（≥5 条）或自定义 `[start, end]`       | ❌ 手动省略号条目                         | ✅ `ellipsis`（≥4 条）  | ❌ 手动                     |
| 链接 vs 当前页       | ✅ `to`/`href` → Link；末尾 → `aria-current` 页 | ✅ 独立 `BreadcrumbLink`/`BreadcrumbPage` | ✅ 末尾项即当前页       | ✅ 末尾项自动当前           |
| 携带数据的点击事件   | ✅ `click(item)`；disabled 抑制                 | ❌ 仅原生链接                             | ✅ `onClick(route)`     | ✅ `select` 事件            |
| 禁用条目             | ✅ 条目数据上的 `disabled`                      | —                                         | ✅                      | —                           |
| 本地化 `aria-label`  | ✅ locale 注册表                                | 硬编码                                    | 仅 `itemRender`         | —                           |
| 区域级属性透传       | ✅ 6 组 props                                   | 各部件 `asChild`                          | `itemRender`            | `separator` 槽              |
| 自定义槽             | ✅ 8 个类型化槽                                 | ✅ 5 部件 + separator 槽                  | `itemRender`            | ✅ `separator` / `title` 槽 |
| 尺寸缩放             | ✅ xs…2xl                                       | ✅ 固定                                   | ✅ `size`               | —                           |

### 运行时注意事项

1. **省略号索引数学** — `getEllipsisRange` 在条目 <5 时返回 `null`；`true` 对应 `[1, len-2]`；用户范围被归一化（`start 0 → 1`、`end length → length - 1`）以保证首尾条目始终可见。
2. **省略号位置** — 折叠的省略号渲染在新数组索引等于 `start` 的位置，即首个折叠后可见条目之前；省略号后跟随一个分隔符。
3. **禁用点击抑制** — `handleItemClick` 忽略 `disabled: true` 的条目，因此 `click` 事件永不携带禁用条目（链接点击也被 Link 原语拦截）。
4. **链接路由** — `BreadcrumbLink` 继承 Link 原语，`to`（router-link）与 `href` / `external`（锚点）均可用；`target` 生效。
5. **当前页语义** — 末尾无 `to`/`href` 的条目渲染为 `BreadcrumbPage`（`role="link"` + `aria-disabled="true"` + `aria-current="page"`），辅助技术用户可识别其不可导航。
6. **Locale 回退** — `nav` 的 `aria-label` 来自 `useLocaleMessages`；缺失的 locale 键回退到默认英文包。

## 常见问题

### 省略号何时出现？

使用 `ellipsis: true` 时，仅当条目数 ≥5 才渲染省略号；首尾条目始终可见，中间折叠。使用 `ellipsis: [start, end]` 可精确指定折叠范围（两个端点均被归一化以保持边缘可见）。

### 如何区分链接条目与当前页？

带 `to`（路由）或 `href`/`external`（锚点）的条目渲染为链接。末尾无目标的条目渲染为带 `aria-current="page"` 的当前页。若要让非末尾条目也显示为纯标签，请省略其 `to`/`href`。

### 为什么点击 disabled 条目不触发任何事件？

禁用条目有意保持惰性：链接被 Link 原语禁用，compact 组件对 `disabled: true` 条目抑制 `click` 事件，符合预期的面包屑行为。

### 可以自定义分隔符吗？

可以 — 使用 `separator` 槽。每个分隔符（含省略号后的那个）都会渲染你的内容。如需区域级样式，可传入 `separatorProps` 或 `ui` 配方类。

### 条目槽接收哪些 scoped props？

`item-leading`、`item-link`、`item-label`、`item-trailing` 与默认槽接收 `{ item, index }`；`ellipsis` 槽接收 `{ ellipsisItems }`。UI wrapper 原样转发给你的自定义槽内容。

### 面包屑可访问吗？

可以 — 根为带本地化 `aria-label` 的 `nav`，列表为 `ol`，分隔符与省略号对辅助技术隐藏，当前页通过 `aria-current="page"` 播报。

### 可以构建完全自定义的面包屑吗？

可以 — 用 `@vean/aria/breadcrumb` 组合 `BreadcrumbRoot` / `BreadcrumbList` / `BreadcrumbItem` / `BreadcrumbLink` / `BreadcrumbPage` / `BreadcrumbSeparator` / `BreadcrumbEllipsis`，并通过 `provideBreadcrumbUi`（或 `SBreadcrumb` 的 `ui` prop）注入样式。
