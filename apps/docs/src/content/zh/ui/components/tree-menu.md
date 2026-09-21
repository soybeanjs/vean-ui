---
head:
  title: 树形菜单
  description: 用于展示可折叠侧边导航树形菜单的组件。STreeMenu 将 Aria 层 TreeMenuCompact 一族组合组件（TreeMenuRoot/TreeMenuOptionCompact/TreeMenuSlotCompact 等，零样式）与 TreeMenuRoot 上下文（受控/非受控激活与展开、折叠侧边栏模式、折叠时子菜单弹出、操作菜单）组合；UI 层仅注入 8 档尺寸配方与插槽类。items 递归数据模型内建 icon/badge/tag/actions/isGroup/链接等字段，节点内容可经 item/item-leading/item-trailing 插槽自由定制。
---

# 树形菜单

## 概述

用于展示可折叠侧边导航树形菜单的组件。`STreeMenu` 将 Aria 层 `TreeMenuCompact` 一族组合组件（`TreeMenuRoot`/`TreeMenuOptionCompact`/`TreeMenuSlotCompact` 等，零样式）与 `TreeMenuRoot` 上下文（受控/非受控激活与展开、折叠侧边栏模式、折叠时子菜单弹出、操作菜单）组合；UI 层仅注入 8 档尺寸配方与插槽类。`items` 递归数据模型内建 `icon`/`badge`/`tag`/`actions`/`isGroup`/链接等字段，节点内容可经 `item`/`item-leading`/`item-trailing` 插槽自由定制。

## 用法

<UsageCode component="tree-menu" />

## 特性

- 🧭 层级数据模型 — `items: TreeMenuOptionData<T>[]`（`value`/`label` + 递归 `children`），`TreeMenuOptionData<T>` 泛型保留自定义字段；内建 `isGroup`/`hidden`/`icon`/`badge`/`tag`/`disabled`/`actions`/`to`/`href` 等字段
- 🎛️ 受控/非受控双通道 — `modelValue` / `defaultValue`（激活项）、`expanded` / `defaultExpanded`（展开项）、`collapsed` / `defaultCollapsed`（折叠态）；均支持 `v-model` 与 `update:*` 事件回写
- 🎯 展开策略 — `expandStrategy="keep"`（默认）保留手动展开，无论选中哪个菜单都不会改变展开/折叠状态；`expandStrategy="selected"` 只展开当前选中菜单及其所有父级菜单，选中项变化时非选中分支自动折叠
- 📉 折叠侧边栏模式 — `collapsed` + `collapsedWidth`（默认 50px）/ `indent` 一键收缩；折叠时含子项的菜单以弹出菜单呈现子级，展开状态暂存并在恢复时自动还原
- 🧩 操作菜单 — `actions` + `actionMenuProps` + `onActionSelect` 为菜单项附加悬停操作（ellipsis 按钮），操作按钮 aria-label 经 13 语言包本地化
- 🏷️ 徽标/标签/图标 — 内建 `icon`/`badge`/`tag` 字段，配合 `item-leading`/`item-trailing` 插槽自由扩展
- 🔗 链接项 — `to`/`href` 渲染为路由链接或外链（`external` 控制），外链自动显示跳转图标
- 🗂️ 分组 — `isGroup` 分组 + `group-label` 插槽；`top`/`bottom` 插槽承载菜单首尾内容
- 🎨 8 档尺寸 + 样式注入 — `size` xs~2xl，`class`/`ui` 按 20+ 命名插槽覆盖样式
- ⌨️ 键盘导航 — 遵循 WAI-ARIA tree 模式：根元素为单一 Tab 停留点并携带 `role="tree"`，↑/↓ 在可见条目间漫游，→ 展开分支或进入首个子项，← 折叠分支或回到父项，Home/End 跳转首尾项，Enter/Space 显式激活（方向键只漫游焦点，不改变选中项）
- ♿ 无障碍 — `role="tree"`/`treeitem` 语义 + `aria-expanded`/`aria-controls`/`aria-selected`、roving tabindex、`data-vean-tree-menu-*` 数据属性，axe 扫描零违规

## 组件家族

- `STreeMenu`（styled）— 入口包装；`TreeMenuCompact` 组合 + `treeMenuVariants` 尺寸配方 + `provideTreeMenuUi` 注入插槽类，`useForwardListeners` 合并事件
- `STreeMenuStyledItem`（styled）— 用菜单项配方画出的单独一行，供非菜单节点的内容使用（品牌区、触发器、页脚行）；经 `Primitive` 渲染，因此 `as` / `asChild` 可指定元素、`disabled` 可标记禁用
- `TreeMenuCompact`（Aria）— 组合根；`TreeMenuRoot` 状态根 + `TreeMenuOptionsCompact` 分组/递归渲染 + `top`/`bottom` 插槽
- `TreeMenuRoot`（Aria）— 状态根；`useControllableState` 管理激活/展开/折叠，折叠时 `backupExpanded` 暂存展开状态并在恢复时还原
- `TreeMenuOptionsCompact`（Aria）— 分组/递归渲染；`expandStrategy="selected"` 时按选中菜单路径同步展开状态
- `TreeMenuOptionCompact`（Aria）— 单节点组合；叶子渲染按钮/链接 + 操作菜单，父项渲染 `TreeMenuCollapsible` 触发器 + `TreeMenuSub` 递归 + 折叠弹出 `DropdownMenuCompact`
- `TreeMenuSlotCompact`（Aria）— 节点内容编排（图标/标签/badge/tag/外链图标/chevron）
- 基础原语（Aria）— `TreeMenuButton`/`TreeMenuItem`/`TreeMenuCollapsible`/`TreeMenuSub`/`TreeMenuGroup`/`TreeMenuGroupLabel`/`TreeMenuTooltipCompact`，全部零样式

## 演示

<PlaygroundGallery component="tree-menu" />

- 01 Basic — 侧边栏自定义器：`expandStrategy` / `collapsed` / `collapsedWidth` / `indent` / `size` 控件，配分组/图标/badge/tag/操作菜单/链接项数据

## API

<ComponentApi component="tree-menu" />

## 说明

### 架构与对标差异

`TreeMenuRoot` 持有全部状态（激活/展开/折叠经 `useControllableState` 受控/非受控双通道）；折叠切换时用 `backupExpanded` 暂存展开分支、清空展开并触发折叠弹出菜单，恢复折叠时原样还原——折叠/展开无损往返。紧凑组合在 Aria 层完成：`TreeMenuOptionCompact` 编排叶子（按钮/链接 + 操作菜单）与父项（Collapsible 触发器 + 递归 `TreeMenuSub` + 折叠弹出菜单），UI 层 `STreeMenu` 只注入尺寸配方与插槽类，不承载任何状态。操作菜单与折叠弹出菜单均复用数据驱动的 `DropdownMenuCompact`（`MenuOptions` 渲染）。根元素遵循 WAI-ARIA tree 模式——单一 roving 停留点、`role="tree"`、`treeitem` 条目与 `group` 子列表，axe 扫描零违规。对比主流侧边菜单库，VeanUI 在 Aria 分离、内建操作菜单、折叠弹出、外链项与 13 语言本地化上更完整。

| 能力                         | VeanUI | Ant Design | Element Plus | Naive UI |
| :--------------------------- | :----: | :--------: | :----------: | :------: |
| Aria/样式分离                |   ✅   |     —      |      —       |    —     |
| 受控激活/展开/折叠           |   ✅   |     ✅     |      ✅      |    ✅    |
| 折叠侧边栏（collapsed 宽度） |   ✅   |     ✅     |      ✅      |    ⚠️    |
| 折叠时子菜单弹出             |   ✅   |     ✅     |      ✅      |    ⚠️    |
| 内建操作菜单（actions）      |   ✅   |     —      |      —       |    —     |
| 徽标/标签（badge/tag）       |   ✅   |     ⚠️     |      —       |    —     |
| 分组/图标/外链               |   ✅   |     ✅     |      ✅      |    ✅    |
| 本地化 aria-label            |   ✅   |     ✅     |      ✅      |    ✅    |

`⚠️` = 部分支持（Naive UI 折叠弹出需额外配置 `collapsed` + 自定义弹出内容；Ant Design 的徽标经 `label` 自定义节点实现）。

### 注意事项

- 键盘导航遵循 WAI-ARIA tree 模式：↑/↓（及 Home/End）在可见条目间漫游且首尾不循环，→ 展开闭合分支、再次按下进入首个子项，← 折叠已展开分支或回到父项，Enter/Space 显式激活；方向键只移动焦点，选中项仅在显式激活时变化。
- 折叠模式下弹出子菜单由 Menu 机制接管键盘，树漫游只作用于侧栏条目本身。
- 折叠模式（`collapsed`）下隐藏操作菜单（`actions`），操作按钮仅在展开模式渲染。
- 折叠时子菜单弹出默认 `hover` 触发，可经 `dropdownMenuProps.trigger` 切换为 `click`。
- `collapsed` 切换会暂存并恢复展开状态；从折叠返回后仍保留原有展开分支。
- 操作按钮的可访问名称来自 `treeMenu.openActions` 模板（`{label}` 占位符），随 `ConfigProvider` locale 在 13 种语言间切换。
- 节点 `disabled` 阻止激活/展开/操作；禁用项渲染 `data-disabled` 与原生 `disabled` 语义。
- 叶子项点击激活并派发 `update:modelValue`；含子项点击切换展开并派发 `update:expanded`。
- `expandStrategy="selected"` 时，展开状态会在选中项变化或切换到 `selected` 策略时按选中菜单路径重新同步；此前手动展开的非选中分支会保持到下一次选中。
- 数据属性仅使用 `data-vean-tree-menu-*`（D1-07），不附加冗余属性。
- `size` 支持 xs~2xl 8 档；样式覆盖经 `ui`（20+ 命名插槽）与根 `class` 注入。

## 常见问题

### 树菜单支持哪些键盘快捷键？

菜单是单一 Tab 停留点并遵循 WAI-ARIA tree 模式：进入树时聚焦选中项（否则首项），↑/↓ 在可见条目间漫游（自动跳过禁用项），→ 展开闭合分支、再次按下进入首个子项，← 折叠或回到父项，Home/End 跳转首尾可见项，Enter/Space 显式激活。

### 如何实现可折叠的侧边栏菜单？

`v-model:collapsed` 绑定折叠态，`collapsedWidth`（默认 50px）控制收缩宽度，`indent` 控制子级缩进：

```vue
<STreeMenu v-model:collapsed="collapsed" :items="items" />
```

### 折叠时如何弹出子菜单？

含子项的菜单在折叠模式下自动渲染弹出菜单（默认 `hover` 触发，可经 `dropdownMenuProps.trigger: 'click'` 切换）。弹出菜单的激活态与 `modelValue` 联动。

### 如何为菜单项添加操作按钮？

```vue
<STreeMenu :items="items" />
<!-- items 中： -->
{ label: 'Design Engineering', value: 'design-engineering', actions: [ { label: 'Edit', value: 'edit', icon:
'lucide:pencil' }, { label: 'Delete', value: 'delete', icon: 'lucide:trash' } ], onActionSelect: action =>
console.log('select', action.value) }
```

悬停菜单项时末端显示 ellipsis 按钮，点击展开操作菜单；按钮 aria-label 自动本地化（`Open {label} actions`）。

### 如何控制激活项与展开项？

受控：`v-model:modelValue="active"`、`v-model:expanded="expandedKeys"`、`v-model:collapsed="collapsed"`；非受控初始值使用 `default-value` / `default-expanded` / `default-collapsed`。激活事件为 `update:modelValue`，展开事件为 `update:expanded`。

### `keep` 与 `active` 两种展开策略有什么区别？

`expandStrategy` 决定展开状态与激活菜单的关系。`keep`（默认）下展开完全由手动控制：激活其他菜单不会改变任何展开/折叠状态。`active` 下菜单跟随激活项——每当激活项变化（或切换到 `active`）时，只保留激活菜单及其所有父级菜单展开，其余分支自动折叠：

```vue
<STreeMenu :items="items" expand-strategy="selected" />
```

适合自由浏览、由用户完全掌控每个分支时使用 `keep`；需要侧边栏始终展示当前路由路径时使用 `active`。

### 如何做分组？

节点设置 `isGroup: true` 并携带 `children` 即成为分组；分组标题可经 `group-label` 插槽自定义：

```vue
<STreeMenu :items="items">
  <template #group-label="{ item }">{{ item.label }} ({{ item.children.length }})</template>
</STreeMenu>
```

### 如何添加链接项？

```vue
{ label: 'Vean', value: 'vean', href: 'https://veanui.com' } { label: 'About', value: 'about', to: '/about' }
```

外链自动显示跳转图标；`external: true` 强制按外链处理。

### 如何自定义图标/徽标/标签？

内建字段：`icon`（图标）、`badge` + `badgeProps`（徽标）、`tag` + `tagProps`（标签）。更自由的内容可用 `item-leading`/`item-trailing`/`item` 插槽：

```vue
<STreeMenu :items="items">
  <template #item-leading="{ item }">
    <span class="text-primary">{{ item.label.slice(0, 1) }}</span>
  </template>
</STreeMenu>
```

### 如何禁用菜单项？

节点设置 `disabled: true` 即不可激活/展开/操作；禁用项渲染 `data-disabled` 与原生 `disabled` 语义。

### 如何让自定义行拥有菜单项的样式？

渲染 `STreeMenuStyledItem` —— 菜单项本身就用这一行，因此它共享同一套尺寸配方、同一个图标列与同一种折叠：身处于折叠祖先（`group` + `data-state="collapsed"`）内时，该行会收窄到菜单项的图标宽度。传入 `size` 与菜单对齐；该行不是按钮时用 `as` / `asChild`（非交互品牌区用 `div`，`asChild` 则合并到你自己的链接上）；用 `disabled` 标记禁用。折叠后该行只放图标，因此请自行隐藏标签并居中图标——比折叠后内容盒更宽的标记图否则会贴着行尾：`:ui="{ button: 'group-data-[state=collapsed]:justify-center' }"`。

### 操作按钮的 aria-label 如何本地化？

经 `ConfigProvider` 切换 locale（内置 13 种语言包），操作按钮使用 `treeMenu.openActions` 模板：`Open {label} actions`，其中 `{label}` 替换为菜单项文案。
