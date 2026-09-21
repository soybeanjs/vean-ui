---
head:
  title: 树
  description: 用于展示树形层级数据、并支持选择与展开/折叠的组件。STree 将 Aria 层 TreeRoot 一族基础原语（TreeRoot/TreeItem/TreeVirtualizerRoot/TreeVirtualizerItem，零样式）与 TreeRoot 上下文（受控/非受控选中与展开、单选/多选、级联选择、Roving Focus 键盘导航）组合；STreeVirtualizer 在其上叠加虚拟滚动，可平滑承载 1000+ 节点。节点内容完全由 item 插槽自定义，节点图标、勾选框、缩进与连接线样式均由使用方注入。
---

# 树

## 概述

用于展示树形层级数据、并支持选择与展开/折叠的组件。`STree` 将 Aria 层 `TreeRoot` 一族基础原语（`TreeRoot`/`TreeItem`/`TreeVirtualizerRoot`/`TreeVirtualizerItem`，零样式）与 `TreeRoot` 上下文（受控/非受控选中与展开、单选/多选、级联选择、Roving Focus 键盘导航）组合；`STreeVirtualizer` 在其上叠加虚拟滚动，可平滑承载 1000+ 节点。节点内容完全由 `item` 插槽自定义，节点图标、勾选框、缩进与连接线样式均由使用方注入。

## 用法

<UsageCode component="tree" />

## 特性

- 🌳 层级数据模型 — `items: TreeItemData<T>[]`（`value` + 可选 `children` 递归结构），`TreeItemData<T>` 泛型保留自定义字段类型
- 🎛️ 受控/非受控双通道 — `modelValue` / `defaultValue` 控制选中，`expanded` / `defaultExpanded` 控制展开；均支持 `v-model` 与 `update:*` 事件回写
- ☑️ 单选与多选 — `multiple`（与 `modelValue` 类型联动：单值字符串 ↔ 数组）切换；`selectionBehavior: 'toggle' | 'replace'` 决定多选点击行为；`Shift + 方向键` 连续范围选择
- 🧩 级联选择 — `propagateSelect`（选择父节点时级联选中子孙）、`bubbleSelect`（子节点全部选中后自动选中父节点）、`allowParentSelect`（是否允许直接选中含子节点的父项）
- 📂 展开策略 — `toggleBehavior: 'multiple' | 'single'`（默认多节点展开；`single` 下展开新节点自动折叠旧节点，行为类似手风琴）
- ⌨️ 键盘导航 — Roving Focus：`↑/↓` 移动焦点、`→/←` 展开/折叠或进入/返回父层级、`Enter`/`Space` 选中、字符输入 typeahead 快速定位；`loop`（默认 `true`）首尾循环；完整支持 RTL
- ⚡ 虚拟滚动 — `STreeVirtualizer` + `height` 仅渲染可视节点，1000+ 节点仍保持流畅
- ♿ 无障碍 — `role="tree"`/`treeitem` + `aria-expanded`/`aria-selected`/`aria-level`/`aria-setsize`/`aria-posinset`/`aria-multiselectable`/`aria-disabled`，配合 `data-vean-tree-*` 数据属性

## 组件家族

- `STree`（styled）— 入口包装；`TreeRootProps<T, U, M>` 泛型透传 + `useForwardListeners` 事件合并 + `top`/`item`/`bottom` 插槽；`withDefaults` 镜像 Aria `loop: true` 默认
- `STreeVirtualizer`（styled）— 虚拟滚动包装；`contentProps`/`dynamicContentProps` 转发给 `VirtualizerContent`，`item` 插槽额外暴露 `virtualItem`
- `TreeRoot`（Aria）— 根组件；`useControllableState` 管理选中/展开，`useSelectionBehavior` 处理单选/多选/范围选择，`useRovingFocusGroup` + `useTypeahead` 实现键盘导航；`provideTreeRootContext` 桥接子项
- `TreeItem`（Aria）— 单节点；`useRovingFocusGroupItem` 管理焦点，渲染 `aria-*` 与 `data-*` 属性，`select`/`toggle` 事件经 `handleAndDispatchCustomEvent` 派发
- `TreeVirtualizerRoot`（Aria）— 虚拟化根；`VirtualizerRoot` + TanStack Virtual，转发扁平化 `flattenItems`
- `TreeVirtualizerItem`（Aria）— 虚拟化节点；`TreeItem` + `VirtualizerItem` 组合（`data-vean-tree-virtualizer-item`）

## 演示

<PlaygroundGallery component="tree" />

- 01 Basic — 基础目录树（`items` + `default-expanded` + `top` 插槽）
- 02 Virtualizer — `STreeVirtualizer` 虚拟滚动渲染 1000+ 节点

## API

<ComponentApi component="tree" />

## 说明

### 架构与对标差异

`TreeRoot` 拥有全部状态（选中/展开经 `useControllableState` 受控/非受控双通道）与选择策略（`useSelectionBehavior` 的 toggle/replace/范围选择），所有基础原语保持零样式；`STree`/`STreeVirtualizer` 仅负责 `loop` 默认值镜像与插槽透传，节点视觉完全由 `item` 插槽内的 `STreeItem`/`STreeVirtualizerItem` 组合实现（缩进、图标、勾选框、焦点态均经类名注入）。键盘导航基于 Roving Focus（`↑/↓` 移动、`→/←` 展开/折叠、typeahead 定位），并额外支持 `Shift` 范围选择——该交互超出多数主流库的树组件默认契约。虚拟滚动基于 `@vean/aria` 内置 virtualizer，仅渲染可视节点。

| 能力                                   | VeanUI | Ant Design | Element Plus | Naive UI |
| :------------------------------------- | :----: | :--------: | :----------: | :------: |
| Aria/样式分离                          |   ✅   |     —      |      —       |    —     |
| 单选/多选（multiple + toggle/replace） |   ✅   |     ✅     |      ✅      |    ✅    |
| 展开策略（single/multiple toggle）     |   ✅   |     ✅     |      ✅      |    ✅    |
| 级联选择（propagate/bubble/parent）    |   ✅   |     ✅     |      ✅      |    ⚠️    |
| 键盘导航（方向键 + 循环 + typeahead）  |   ✅   |     ✅     |      ✅      |    ⚠️    |
| 虚拟滚动（1k 节点）                    |   ✅   |     ✅     |      ⚠️      |    ✅    |
| 可勾选模式（checkable 复选框）         |   ⚠️   |     ✅     |      ✅      |    ✅    |
| 拖拽排序（draggable）                  |   —    |     ✅     |      ✅      |    ✅    |
| 异步加载子节点（loadData）             |   —    |     ✅     |      ✅      |    ✅    |
| 搜索过滤（searchValue）                |   —    |     ✅     |      ✅      |    —     |

`⚠️` = 部分支持（VeanUI 的 checkable 可经 `multiple` + 自定义 `item` 插槽勾选图标 + `data-selected`/`data-contains-selected` 状态实现；Naive UI 无内置范围选择与字符定位）。

### 注意事项

- `modelValue` 类型与 `multiple` 联动：`modelValue` 为单值字符串时强制单选；为数组且 `multiple` 为真时启用多选（`IsMultiple<U, M>` 条件类型约束）。
- `item` 插槽是**自由组合**模式：必须由使用方渲染 `STreeItem`（或 `STreeVirtualizerItem`）并传入 `item.value`/`item.level`；插槽同时暴露 `item.data`（原始节点数据）、`isExpanded`/`isSelected`/`isIndeterminate`/`hasChildren` 等状态。
- 含子节点的父项默认**不可选中**（`allowParentSelect` 默认 `false`）；需要父项可选中时显式开启。
- `propagateSelect`/`bubbleSelect` 仅在多选（`multiple` + 数组值）下生效；两者同时开启时以 `data-contains-selected`/`isIndeterminate` 表达半选态。
- `toggleBehavior: 'single'` 下展开行为类似手风琴——每次仅保留一个展开分支（`findParentPath` 重建路径）。
- `loop` 默认 `true`（键盘焦点首尾循环），`STree` 与 `STreeVirtualizer` 均已在包装层镜像该默认，直接使用 Aria `TreeRoot` 时无需额外处理。
- 虚拟滚动需要设置 `height`；`STreeVirtualizer` 的 `item` 插槽额外提供 `virtualItem`（用于 `:data` 透传与绝对定位样式）。
- 展开/折叠时对移动子树做高度塌缩过渡动画。`STreeVirtualizer` 提供可选的 `animated` 属性，让可见项按普通文档流渲染（dynamic 模式），展开/折叠时无需绝对定位偏移即可保持项位置正确——默认关闭，因为动态测量对超大数据集开销更重；动画运行期间过渡列表会临时以完整文档流渲染，结束后恢复窗口化。
- 节点文本完全由插槽提供，组件内无硬编码文案，因此无需本地化处理。

## 常见问题

### 如何实现可勾选（checkable）的树？

使用 `multiple` 多选 + 自定义 `item` 插槽渲染勾选图标，并消费 `isSelected`/`isIndeterminate` 状态：

```vue
<STree :items="items" multiple>
  <template #item="{ item, isSelected, isIndeterminate }">
    <STreeItem :value="item.value" :level="item.level">
      <SIcon :icon="isIndeterminate ? 'lucide:minus' : isSelected ? 'lucide:check-square' : 'lucide:square'" />
      {{ item.data.label }}
    </STreeItem>
  </template>
</STree>
```

需要「选中父级联动子孙」时叠加 `propagateSelect`，需要「子孙全选联动父级」时叠加 `bubbleSelect`。

### 如何控制树的展开状态？

受控：`v-model:expanded="expandedKeys"`（字符串数组）；或非受控初始值 `:default-expanded="['node-1']"`。展开状态事件为 `update:expanded`。

### 大数据量下如何优化？

使用 `STreeVirtualizer` 并设置 `height`：仅渲染可视节点（配合自定义 `options.estimateSize` 控制行高），1000+ 节点仍保持流畅。

```vue
<STreeVirtualizer height="360px" :items="items">
  <template #item="{ item, virtualItem }">
    <STreeVirtualizerItem :value="item.value" :level="item.level" :data="virtualItem">
      {{ item.data.label }}
    </STreeVirtualizerItem>
  </template>
</STreeVirtualizer>
```

### 如何阻止选择父节点？

`allowParentSelect` 默认 `false`——点击含子节点的父项仅触发展开/折叠而不选中；需要选中父项时显式设置 `:allow-parent-select="true"`。

### 如何实现异步加载子节点？

组件未内置 `loadData` 契约，可在 `toggle` 事件中懒加载后更新 `items`：

```vue
<STree :items="items" @toggle="event => loadChildren(event.value)">
  <!-- item 插槽 -->
</STree>
```

加载完成后向 `items` 对应节点写入 `children` 即可（展开状态由 `expanded` 维护）。

### 如何自定义节点图标与缩进？

`item` 插槽自由组合：缩进用 `item.level` 计算 `padding-left`，图标按 `item.hasChildren`/`isExpanded` 切换，焦点态用 `focus:ring-*` 类名——参见演示 01。

### 键盘如何操作？

`↑/↓` 在可见节点间移动焦点；`→` 展开折叠节点（或进入子级）、`←` 折叠（或返回父级）；`Enter`/`Space` 选中当前节点；连续输入字符触发 typeahead 定位；多选下 `Shift + ↑/↓` 进行范围选择；`loop` 开启时首尾循环（默认开启）。
