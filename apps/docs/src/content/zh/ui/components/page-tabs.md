---
head:
  title: 页面标签
  description: 一个用于在不同页面或视图之间导航的标签页界面。它支持可关闭的标签、上下文菜单和可自定义的样式。
---

# 页面标签

## 概述

一个用于在不同页面或视图之间导航的标签页界面。它支持可关闭的标签、上下文菜单和可自定义的样式。

## 特性

- **数据驱动的 Compact 组合** — `SPageTabs` 将整体结构委托给 Aria 的泛型 `PageTabsCompact<T>`，由它负责标签迭代、固定排序、关闭语义、上下文菜单接线以及默认标签体（图标 + 标签 + 固定 + 关闭 + 指示器）。
- **受控/非受控状态** — `modelValue` / `items` 支持 `v-model` / `v-model:items`（受控）；省略时通过 `useControllableState` 回退到内部状态。
- **带异步守卫的可关闭标签** — 每个未固定的标签都渲染关闭按钮；`beforeClose` 可返回 `false` 或解析为 `false` 的 Promise 来阻止关闭。关闭当前标签会自动激活下一个（或上一个）兄弟标签；`Backspace` 键与中键点击（`middleClickClose`）关闭开箱即用。
- **固定/取消固定与自动排序** — 固定标签在任何变更后自动排到最前（固定分组优先，然后是普通标签；`hidePinnedIcon` 仅控制显示，不影响排序）；内联固定按钮切换固定状态，上下文菜单提供 `固定` / `取消固定`。
- **拖拽调整顺序** — 启用 `draggable` 后，标签可横向拖拽改变位置。重排采用与浏览器标签栏（Chrome / VS Code）一致的分区限制：标签只能在自己所在分区内重排 —— 固定分组最前，然后是普通标签 —— 未固定标签拖到固定区边界时会实时停住，永远不会落到固定标签之前。条目显式设置 `draggable: false` 时该标签被锁定：自身不可拖拽，同时充当屏障，其他标签无法插入到它的位置（如锁定在最首位的主页标签）。拖拽由 Aria 的 `useSortableList` 驱动：被拖标签保留自身占位、只用 `transform` 跟随光标，其余标签通过 FLIP 平滑滑动让位；松手后应用新顺序（触发 `update:items`），被拖标签滑入最终位置。键盘同样可排序：聚焦标签后按 `Space` 拾起、方向键移动、`Space` / `Enter` 落下、`Escape` 取消。`tabDragStart` / `tabDragMove` / `tabDragEnd` 会发出实时的拖拽状态 `{ item, index }`。
- **上下文菜单工厂** — `menuFactory(tab, state)` 接收悬停标签与 `PageTabsState`（close、closeLeft、closeRight、closeOther、closeAll、pin、unpin 及其各自的 `*Closable` 布尔值）来构建自定义菜单；`selectContextMenu` 发出所选动作与标签。
- **完整键盘支持** — `useRovingFocusGroup` 提供方向键移动；`Enter` 激活标签，`Backspace` 关闭标签，`Space` 拾起标签进入键盘排序。
- **活动标签自动滚动** — `usePageTabsScroll` 使活动标签水平居中（平滑 `scrollTo`），并将垂直滚轮转换为水平滚动。
- **三种视觉变体** — `variant`（`chrome` / `card` / `slider`）带各变体指示器（chrome 圆角 SVG / slider 下划线）与 `size`（xs…2xl），通过 `pageTabsVariants` 的 `scv()` 配方应用。
- **六个自定义插槽** — `item`（scoped `{ item, index, active, closable }`）、`icon`、`label`、`indicator`、`pin-icon`、`close-icon`。
- **本地化无障碍文案** — 关闭/固定按钮回退到本地化的 `aria-label`（`closeTab` / `pinTab` / `unpinTab`），内置 13 种语言；每个按钮可通过 `aria-label` 覆盖。
- **Aria 组合** — `PageTabsRoot` / `PageTabsItem` / `PageTabsClose` / `PageTabsPin` / `PageTabsCompact` 均可从 `@vean/aria/page-tabs` 导入，用于完全自定义样式构建。

## 用法

<UsageCode component="page-tabs" />

> `SPageTabs` 将标签管理委托给 Aria 的 `PageTabsCompact`。如需无样式、数据驱动的组合，请从 `@vean/aria/page-tabs` 导入 `PageTabsCompact`。

## 演示

<PlaygroundGallery component="page-tabs" />

## API

<ComponentApi component="page-tabs" />

## 备注

### 架构与竞品对比

| 关注点                                 | VeanUI                                           | Ant Design `Tabs`                   | Element Plus `Tabs`            | tags-view（vue-element-admin 风格） |
| :------------------------------------- | :----------------------------------------------- | :---------------------------------- | :----------------------------- | :---------------------------------- |
| Aria / 样式双层分离                    | ✅ `@vean/aria/page-tabs` + `scv()`              | ❌ 单一包                           | ❌ 单一包                      | ❌ 各应用自研                       |
| 数据驱动 Compact API                   | ✅ 泛型 `PageTabsCompact<T>` + `items`           | ✅ 配置驱动（items）                | ✅ 配置驱动                    | ✅ 各应用自研                       |
| 受控/非受控                            | ✅ `modelValue`/`items` + `useControllableState` | ✅ `activeKey` / `defaultActiveKey` | ✅ `v-model`                   | —                                   |
| 可关闭 + 异步守卫                      | ✅ `beforeClose`（false / Promise\<false>）      | ✅ `onEdit` + `beforeChange`        | ✅ `closable` / `before-leave` | ✅ `before-close`                   |
| 固定/取消固定 + 自动排序               | ✅ 固定标签排到最前                              | ❌（仅自定义 tabLabel）             | ❌                             | ✅（各应用，如 affix-tab）          |
| 拖拽调整顺序                           | ✅ `draggable` + `tabDragStart/Move/End`         | ❌                                  | ❌                             | ✅（各应用）                        |
| 上下文菜单（左/右/其他/全部关闭）      | ✅ `menuFactory` + `PageTabsState`               | ❌（仅 `more` 的下拉菜单）          | ❌                             | ✅（各应用）                        |
| 中键点击关闭                           | ✅ `middleClickClose`                            | ❌                                  | ❌                             | ✅（各应用）                        |
| 键盘（roving focus + Enter/Backspace） | ✅ `useRovingFocusGroup`                         | ✅ 方向键 / Home / End              | ✅ 方向键                      | ❌                                  |
| 活动标签自动滚动                       | ✅ 居中 `scrollTo` + 滚轮转横向                  | ✅ tabBar `auto`                    | ❌                             | ✅（各应用）                        |
| 变体系统                               | ✅ `chrome`/`card`/`slider` × xs…2xl             | ✅ `line`/`card`/`editable-card`    | ✅ `card`/`border-card`        | —                                   |
| 本地化 `aria-label`                    | ✅ locale 注册表（13 种语言）                    | 部分支持                            | —                              | —                                   |
| 插槽                                   | ✅ 6 个类型化插槽                                | ✅ `label`/`closeIcon`/…            | ✅ `label`/`icon`/…            | —                                   |

### 运行时注意事项

1. **固定标签不可关闭** — `closable` 由 `!pinned` 推导；固定标签不渲染关闭按钮，中键 / `Backspace` / 上下文菜单关闭动作对其禁用。
2. **关闭活动标签的回退** — 关闭活动标签时激活下一个兄弟标签，若为最后一个则回退到上一个；关闭最后一个标签时 `modelValue` 变为 `''`（无活动标签）。
3. **异步 `beforeClose`** — 可为同步函数或返回 Promise；只有解析为 `false` 才会阻止关闭。`close` 事件在守卫通过且标签被移除后触发。
4. **固定排序** — `sortTabs` 按 固定 → 普通 顺序稳定重排（保持各组内相对顺序），顺序变化时发出 `update:items`；受控模式下父组件需接受新顺序才能看到重排。
5. **受控与非受控** — 提供了 `modelValue` / `items` prop 时，内部写入只发出 `update:modelValue` / `update:items`；DOM 跟随 prop，外部变更会自动重新渲染。
6. **上下文菜单目标** — 悬停标签（pointerenter）会将其设为上下文目标并发出 `contextmenu`；菜单仅在 `menuFactory` 返回非空选项时渲染。
7. **拖拽调整顺序的边界** — 拖拽重排是 `PageTabsCompact` 层面的特性（`draggable`）。排序按分区限制：标签只能在自己所在分区内重排（固定 → 普通；所有固定标签 —— 含 `hidePinnedIcon` —— 同属一个分区），因此未固定标签永远无法拖到固定标签之前 —— 实时重排在边界处被阻断，`sortTabs` 始终维护该分区不变量。条目显式设置 `draggable: false` 时被完全锁定：不可拖拽且不参与碰撞检测，其他标签无法落到它的位置。受控模式（`v-model:items`）下父组件需接受重排后的 `update:items` 才能看到新顺序。单独组合 `PageTabsRoot` / `PageTabsItem` 不支持拖拽。
8. **Locale 回退** — 关闭/固定按钮的 `aria-label` 来自 `useLocaleMessages`；缺失 key 回退到默认英文包；按钮上的显式 `aria-label` 优先。

## FAQ

### 如何阻止关闭标签？

从 `beforeClose` 返回 `false`（或解析为 `false` 的 Promise）。该守卫适用于关闭按钮、中键点击、`Backspace` 与上下文菜单关闭动作。固定标签只需标记 `pinned: true`——固定标签永不可关闭。

### 为什么固定标签排在最前？

固定是为了让重要页面始终可达；`sortTabs` 将固定标签作为一组（含 `hidePinnedIcon`）移到普通标签之前，同时保持各组内的相对顺序。若以任意顺序传入 `pinned` 条目，组件会在挂载时重排并通过 `update:items` 发出排序后的数组。

### 能自定义上下文菜单吗？

可以——实现 `menuFactory(tab, state)`。`state` 暴露 `close`、`closeLeft`、`closeRight`、`closeOther`、`closeAll`、`pin`、`unpin` 及对应的 `*Closable` 标志，可禁用无关动作（如第一个标签上的"关闭左侧"）。选择菜单项会执行其 `action` 并发出 `selectContextMenu(menu, tab)`。

### 如何优雅地关闭活动标签？

关闭活动标签会自动激活下一个兄弟标签（若关闭的是最后一个则激活上一个）。若关闭最后一个剩余标签，`modelValue` 变为 `''`，无标签处于活动状态。

### 支持哪些键盘快捷键？

方向键在标签间移动焦点（roving focus），`Enter` 激活聚焦的标签，`Backspace` 关闭它（除非固定或被 `beforeClose` 阻止）。开启 `middleClickClose` 时中键点击也可关闭。

### 能构建完全自定义的页面标签吗？

可以——从 `@vean/aria/page-tabs` 组合 `PageTabsRoot` / `PageTabsItem` / `PageTabsClose` / `PageTabsPin` / `PageTabsCompact`，并通过 `providePageTabsUi`（或 `SPageTabs` 的 `ui` prop）注入样式。`item` 插槽接收 `{ item, index, active, closable }` scoped props 用于逐标签渲染。

### 如何启用拖拽调整顺序？

在 `SPageTabs`（或 `PageTabsCompact`）上设置 `draggable`。标签即可横向拖拽，带浮动预览与平滑滑动动画；新顺序通过 `v-model:items` 写回。与浏览器标签栏一致，重排按分区限制：固定标签（含 `hidePinnedIcon`）在最前方自行重排，未固定标签无法拖过固定区 —— 拖到边界时会实时停住。要锁定单个标签（如保持主页标签在最首位），在该条目上设置 `draggable: false`：它自身不可拖拽，其他标签也无法落到它的位置。
