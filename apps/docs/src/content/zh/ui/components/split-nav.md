---
head:
  title: 分割导航
  description: 用于后台布局的分割导航组件。SSplitNav 将一份菜单树拆到独立的一级菜单与子级面板中，而不是把所有层级嵌进同一个侧边栏。内置四种布局模式：dual-vertical、vertical-horizontal、horizontal-vertical 和 horizontal-dual-vertical。一级菜单是独立的 RovingFocus 列表（与 Menubar 类似的方向键；Enter/Space 激活；有子级时横向 ↓、竖向 ←/→ 展开子面板）。竖向子级复用 TreeMenuCompact，横向子级复用 TreeNavCompact。
---

# 分割导航

## 概述

用于后台布局的分割导航组件。`SSplitNav` 将一份菜单树拆到独立的一级菜单与子级面板中，而不是把所有层级嵌进同一个侧边栏。内置四种布局模式：`dual-vertical`、`vertical-horizontal`、`horizontal-vertical` 和 `horizontal-dual-vertical`。一级菜单是独立的 RovingFocus 列表（与 Menubar 类似的方向键；Enter/Space 激活；有子级时横向 `↓`、竖向 `←`/`→` 展开子面板）。竖向子级复用 `TreeMenuCompact`，横向子级复用 `TreeNavCompact`。

当布局需要「一级切换 + 子级树/横条」（双竖栏、竖轨 + 横条、顶栏 + 侧栏、或顶栏 + 双竖栏）时使用。单一嵌套侧边栏请优先使用 `STreeMenu`；独立横条请使用 `STreeNav`。

## 用法

<UsageCode component="split-nav" />

## 特性

- 🧭 四种模式 — `mode` 选择面板组合，根组件切换对应模式组件
- 🎹 一级键盘 — 竖/横 `useRovingFocusGroup`，支持方向键、Home/End；Enter/Space 激活；横向一级 `ArrowDown`、竖向一级 `ArrowLeft` / `ArrowRight` 展开子面板；面板之间用 Tab 切换
- 🪟 Teleport 挂载 — `verticalMountedId` / `horizontalMountedId` 将面板挂到 `#id` 元素（`dual-vertical` 整块挂载）
- 🪜 路径切分 — `openPath` 控制子面板展开，`modelValue` 只表示选中的叶子
- 🔄 受控/非受控 — `modelValue` / `defaultValue` 只表示选中的叶子；点击父级只展开子面板，不会改 `v-model`，也不会带上选中样式
- 🌲 展开策略 — `expandStrategy`（默认 `keep`，可选 `selected`）透传给嵌套的 `TreeMenuCompact`
- 📢 展开事件 — 激活父级时触发 `open`，携带该父级的完整菜单数据（含子级），可用于同时激活子级第一项
- 🧩 复用 `TreeMenuCompact`（竖向子级）与 `TreeNavCompact`（横向子级）
- 🙈 隐藏项 — `hidden` 将条目及其子树从一级栏与子面板中移除；子项全部隐藏的父级按叶子渲染
- 🎨 6 档尺寸 + 样式注入 — `size` 从 xs 到 2xl；`class` / `ui` 覆盖各命名插槽
- ✏️ 高度可定制 — `first-level-item` / `item` / `item-leading` / `item-trailing` 插槽
- 🧷 菜单顶部插槽 — `top-left` / `top-right` 渲染在双竖栏菜单两列之上：轨道格与轨道同宽，面板格跟随该列的宽度与折叠。两列之间的分割线是面板自己的前缘——贯穿该列整高（含品牌带）——轨道不再自画一条。宿主品牌应放在菜单内，而不是菜单旁边的独立区域
- ♿ 无障碍 — `role="menubar"` / `menuitem`、`data-vean-split-nav-*` 数据属性、RTL `dir`

## 组件家族

- `SSplitNav`（带样式）— 入口包装；组合 `SplitNavRoot` + `splitNavVariants` 模式/尺寸配方 + `provideSplitNavUi` 插槽类注入
- `SplitNavRoot`（无样式）— 数据驱动聚合根；`useControllableState` 管理激活值、按 mode 切换、转发插槽
- 内部模式组件（无样式）— `DualVerticalMenu`、`VerticalHorizontalMenu`、`HorizontalVerticalMenu`、`HorizontalDualVerticalMenu`
- 内部一级菜单（无样式）— `VerticalFirstLevelMenu` / `HorizontalFirstLevelMenu`，共享 RovingFocus 条目

## 示例

<PlaygroundGallery component="split-nav" />

- 01 基础 — `dual-vertical` 双竖栏，含 TreeMenu 栏宽与折叠
- 02 竖横 — 一级竖轨 + 子级 TreeNav
- 03 横竖 — 一级横条 + 子级 TreeMenu
- 04 横双竖 — 顶部横条 + 嵌套 dual-vertical
- 05 挂载 — 将面板挂载到外部 `#id` 元素
- 06 定制 — 通过插槽自定义一级与子级内容
- 07 展开事件 — 监听 `open`，点击父级时同时激活子级第一项
- 08 展开策略 — 在 `keep` 与 `selected` 之间切换嵌套 `TreeMenuCompact` 的展开行为
- 09 顶部插槽 — 把品牌放进双竖栏菜单的 `top-left` / `top-right` 格，并在面板折叠时通过 `collapsed` 插槽参数移除标题

## API

<ComponentApi component="split-nav" />

## 备注

### 架构

`SSplitNav` 是薄样式包装。无样式的 `SplitNavRoot` 负责 mode 切换、激活路径（`findActivePath`）以及叶子/父级选择语义。一级菜单是独立的 RovingFocus 列表，而不是 TreeMenu，因此父级用于切换子面板而不是就地展开，也**不会**把自己写成选中叶子。竖向一级是「上图标、下文本」的紧凑轨道（超出文本省略）；横向一级仍是图标+文本横排。竖向子级交给 `TreeMenuCompact`，用 `treeMenuVariants` 注入，并带独立栏宽、`v-model:collapsed` 以及从根传下来的 `expandStrategy`；横向子级交给 `TreeNavCompact`，用 `treeNavVariants` 注入，外观与 `STreeNav` 一致。`class` 作用在独立的 `dual-vertical` 面板上；混合模式以各自 Teleport 片段渲染。

| 能力           | VeanUI | Ant Design | Element Plus | Naive UI |
| :------------- | :----: | :--------: | :----------: | :------: |
| 多种布局模式   |   ✅   |     ⚠️     |      ⚠️      |    —     |
| 挂载到外部元素 |   ✅   |     —      |      —       |    —     |
| Aria/样式分离  |   ✅   |     —      |      —       |    —     |
| 一级方向键导航 |   ✅   |     ⚠️     |      ⚠️      |    —     |

### 注意事项

- 面板默认原地渲染；仅在需要挂到外部元素时才设置 `horizontalMountedId` / `verticalMountedId`（传不带 `#` 的 id）。
- `dual-vertical` 以及 `horizontal-dual-vertical` 里嵌套的 dual-vertical，两列竖栏会通过 `verticalMountedId` **整块**挂载。混合模式则一级与子级独立挂载。
- 点击父级只会展开子面板（`data-state="open"`），不会改 `v-model`，也不会设置 `data-selected`；点击叶子才会更新 `v-model` 并触发 `select`，选中的叶子渲染 `data-selected="true"`。
- 激活父级（点击或键盘）会触发 `open` 事件，携带该父级的完整菜单数据（含子级）；只有带可见子级的父级会触发，叶子不会。
- 只要子面板还挂载着，它就会保留自己的展开状态：默认 `expandStrategy="keep"` 下，你在某个一级项里展开过的分支，切回来时仍是展开的。当激活的一级项没有可见子级时子面板会卸载，该状态随之重置。
- 各 `mode` 的 flex 布局定义在 UI 样式配方中；无样式层不携带任何布局类。
- `top-left` / `top-right` 只属于双竖栏形态：其它模式不会渲染这两个格子。`top-left` 是轨道列自己的顶部格（与轨道同宽），`top-right` 属于面板列，因此面板的前缘分割线也贯穿这条品牌带。`top-right` 只在该列存在（即当前一级项有可见子级）时渲染。两者都会收到 `collapsed`，宿主若在其中渲染标题，可在面板折叠时据此移除。
- 竖向一级轨道不再自画分割线：分割线由它后面那一列的前缘提供。因此侧栏只剩轨道时（`vertical-horizontal`，以及双竖栏形态尚未展开面板时）内部没有分割线——那条边界归布局或轨道所在的容器负责。
- 侧栏里的竖栏只在当前状态真的装得下东西时才存在。`resolveSplitNavSidebarColumns({ mode, items, modelValue, openPath })` 直接回答某个模式下"轨道列 / 面板列"各自是否存在：`dual-vertical` 与 `horizontal-dual-vertical` 最多占两列（后者的两列分别是二级与三级），`vertical-horizontal` 侧栏只有轨道，`horizontal-vertical` 侧栏只有面板。需要在渲染前就定下容器宽度的消费者（例如 `SAppShell` 为布局预留侧栏宽度）用它推导，而不是去量 DOM——服务端渲染时量不到。

## 常见问题

### 如何在四种模式间切换？

设置 `mode` 属性：`dual-vertical`（双竖栏）、`vertical-horizontal`（竖轨 + 横条）、`horizontal-vertical`（横条 + 竖栏）或 `horizontal-dual-vertical`（顶部横条 + 双竖栏）。

### 如何把面板挂载到指定元素？

给目标元素一个 `id` 并传给 `horizontalMountedId` / `verticalMountedId`：

```vue
<SSplitNav
  mode="horizontal-vertical"
  :items="items"
  horizontal-mounted-id="app-header"
  vertical-mounted-id="app-sider"
/>
```

面板会通过 `Teleport` 渲染到 `#app-header` / `#app-sider`（`defer` 保证晚出现的挂载点也安全）。

### 如何给面板容器定宽？

`resolveSplitNavSidebarColumns` 会告诉你某个模式下竖栏的构成，容器就能在渲染前先留好宽度：

```ts
import { computed } from 'vue';
import { resolveSplitNavSidebarColumns } from '@vean/aria/split-nav';

// rail 与 pane 分别表示侧栏的两列是否存在
const columns = computed(() => resolveSplitNavSidebarColumns({ mode, items, modelValue: active.value }));
```

只按激活值推导，适用于由路由驱动的容器。若还要跟随"只是被展开、尚未选中叶子"的菜单，再传 `openPath`：这条路径由 `SplitNavRoot` 内部维护，因此需要从 `open` 事件镜像，并在 `modelValue` 变化时清空——`SAppShell` 就是这样做来为布局预留侧栏宽度的。

### 如何知道叶子被选中？

`select` 事件会带上叶子值；`v-model` 只反映当前选中的叶子。点击父级只会展开子面板（`data-state="open"`），不会触发 `select`，也不会设置 `data-selected`。若该父级下已有选中叶子，会带上 `data-child-selected`。

### 点击父级时如何同时激活子级第一项？

监听 `open` 事件：它携带被激活父级的完整菜单数据（含子级）。从中取第一个可见子级，把它的值写入 `v-model` 即可：

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { SSplitNav } from '@vean/ui';
import type { SplitNavOptionData } from '@vean/ui';

const active = shallowRef('');

function handleOpen(item: SplitNavOptionData) {
  const firstChild = item.children?.find(child => !child.hidden);

  if (firstChild) {
    active.value = firstChild.value;
  }
}
</script>

<template>
  <SSplitNav v-model="active" :items="items" @open="handleOpen" />
</template>
```

`open` 只在带可见子级的父级被激活（点击或键盘）时触发，叶子仍然走 `select`。

### 能否自定义每项内容？

可以 — 用 `first-level-item` 自定义一级，用 `item` / `item-leading` / `item-trailing` 自定义嵌套 TreeMenu 与 TreeNav。

### 子面板里哪些分支会保持展开？

`expandStrategy` 控制嵌套的 `TreeMenuCompact`，默认值为 `keep`。

- `keep`（默认）— 手动展开的分支会保持展开：选中别的叶子、或切换到别的一级项再切回来，都不会把它收起。同时，选中叶子的祖先分支会在挂载时以及选中值被外部改变时（例如由路由驱动 `v-model`）自动展开，保证当前叶子可见。
- `selected` — 展开集合始终跟随选中项：只有选中叶子及其祖先保持展开，选中项一旦变化，其它分支立即收起。

```vue
<SSplitNav v-model="active" expand-strategy="selected" :items="items" />
```

只有竖向子面板（`TreeMenuCompact`）有展开策略；横向子面板（`TreeNavCompact`）没有该概念。

### 是否支持路由链接？

每个节点都可以带 `to` / `href`（继承自 `LinkBaseProps`）。一级项以及嵌套的 TreeMenu / TreeNav 会负责链接渲染。

### 一级菜单的键盘如何工作？

一级列表是 `menubar`：方向键移动焦点（竖向用 ↑↓，横向用 ←→，并感知 RTL），Home/End 跳到两端，Enter/Space 激活当前焦点项。有子级时，横向一级按 `↓`、竖向一级按 `←` / `→` 展开子面板。嵌套的 TreeMenu 与 TreeNav 保留各自的键盘约定；面板之间用 Tab 切换。
