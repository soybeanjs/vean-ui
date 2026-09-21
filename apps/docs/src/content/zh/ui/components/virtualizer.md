---
head:
  title: 虚拟列表
  description: '虚拟滚动组件：仅渲染视口内的条目，从而高效渲染超长列表。SVirtualizer 包装 Aria VirtualizerRoot/VirtualizerContent 基础组件（构建于 @tanstack/vue-virtual）——只把当前可见窗口的条目挂载进 DOM，使长列表保持流畅。'
---

# 虚拟列表

## 概述

虚拟滚动组件：仅渲染视口内的条目，从而高效渲染超长列表。`SVirtualizer` 包装 Aria `VirtualizerRoot`/`VirtualizerContent` 基础组件（构建于 `@tanstack/vue-virtual`）——只把当前可见窗口的条目挂载进 DOM，使长列表保持流畅。

虚拟列表适合行数过多、全部渲染会变慢的长列表/表格。listbox/树的虚拟滚动请使用更上层的集成组件（如 `select`、`tree`）。

## 用法

<UsageCode component="virtualizer" />

## 特性

- ⚡ 虚拟滚动 — 构建于 `@tanstack/vue-virtual`；仅渲染视口内可见条目
- 📊 数据驱动 — 传入 `items`（任意记录结构）与行高 `estimateSize`
- 📏 滚动容器 — `height` 设置根滚动视口（带 `overflow: auto`）
- ↔️ 方向 — `options.horizontal` 渲染水平滚动行
- 🎚️ TanStack 选项 — 传入 `options`（`overscan`、`scrollMargin`、`paddingStart/End`、测量覆盖、…）
- 🔁 动态模式 — `dynamic` 启用可变高度条目测量
- 🧩 条目插槽 — `item` 插槽接收 `{ virtualItem, index, item }` 用于自定义渲染
- ♿ 无障碍 — 根可键盘滚动（`tabindex="-1"`）并暴露虚拟化内容

## 组件家族

- `SVirtualizer`（样式层）— 入口包装组件；将 `virtualItems` 迭代进 `item` 插槽
- `VirtualizerRoot`（Aria）— 滚动容器；持有 `useVirtualizer` 实例，计算 `virtualItems`/`totalSize`/`contentStyle`
- `VirtualizerContent`（Aria）— 定位虚拟条目的带尺寸内层内容
- `VirtualizerItem`（Aria）— 定位的虚拟条目（用于高级自定义构建）

## 演示

<PlaygroundGallery component="virtualizer" />

## API

<ComponentApi component="virtualizer" />

## 注意事项

### 架构与对标差异

`VirtualizerRoot` 持有 `@tanstack/vue-virtual` 实例并计算 `virtualItems`/`totalSize`/`contentStyle`，`SVirtualizer` 只把虚拟条目迭代进 `item` 插槽。这把测量/定位引擎委托给行业标准的 TanStack Virtual（shadcn-ui/TanStack 亦采用同一引擎）。Ant Design（`rc-virtual-list`）、Element Plus（`el-table-v2`）、Mantine（`ListVirtualization`）与 Naive UI（`virtual-list`）提供各自虚拟引擎；VeanUI 暴露薄封装、引擎无关的包装组件，任意 `@tanstack/vue-virtual` 选项均可透传。

| 能力         | VeanUI | TanStack | Ant Design | Element Plus | Mantine | Naive UI |
| :----------- | :----: | :------: | :--------: | :----------: | :-----: | :------: |
| 虚拟引擎     |   ✅   |    ✅    |     ✅     |      ✅      |   ✅    |    ✅    |
| 数据驱动条目 |   ✅   |    ✅    |     ✅     |      ✅      |   ✅    |    ✅    |
| 水平模式     |   ✅   |    ✅    |     ✅     |      ✅      |    —    |    —     |
| 动态测量     |   ✅   |    ✅    |     —      |      —       |    —    |    —     |
| 完整引擎选项 |   ✅   |    ✅    |     —      |      —       |    —    |    —     |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `height` 设置根滚动视口；`estimateSize` 提供测量前的行尺寸。
- `items` 可为任意记录结构；`item` 插槽接收 `{ virtualItem, index, item }`。
- 传入 `options`（来自 `@tanstack/vue-virtual`）以配置 `overscan`、`horizontal`、`scrollMargin`、测量覆盖等。
- `dynamic` 启用可变高度条目测量；否则行测量一次后复用。
- 这是底层基础组件——listbox/tree 虚拟滚动请使用包装它的更高层组件。

### Roadmap

不适用——virtualizer 对当前对标集已功能完备。

## FAQ

### 如何渲染长列表？

传入 `items`、行 `estimate-size` 与 `height`，并提供 `item` 插槽：

```vue
<SVirtualizer :items="rows" :estimate-size="40" :height="400">
  <template #item="{ item }">{{ item.label }}</template>
</SVirtualizer>
```

### 如何水平滚动？

设置 `options.horizontal`：

```vue
<SVirtualizer :items="cols" :estimate-size="120" :height="300" :options="{ horizontal: true }" />
```

### 如何调节 overscan？

在 `options` 中传 `overscan`：

```vue
<SVirtualizer :items="rows" :estimate-size="40" :height="400" :options="{ overscan: 10 }" />
```

### 如何支持可变高度条目？

设置 `dynamic`：

```vue
<SVirtualizer :items="rows" dynamic :estimate-size="40" :height="400">
  <template #item="{ item, virtualItem }">{{ item.label }}</template>
</SVirtualizer>
```
