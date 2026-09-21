---
head:
  title: Splitter
  description: 用于将一个区域拆分为多个可拖拽调整尺寸面板的布局组件。
---

# Splitter

## 概述

用于将一个区域拆分为多个可拖拽调整尺寸面板的布局组件。

## 功能

- **三部分组合** — `SSplitterGroup`（根）、`SSplitterPanel`（内容区域）、`SSplitterResizeHandle`（面板间拖拽手柄）。
- **水平与垂直方向** — `direction="horizontal" | "vertical"` 翻转布局轴；光标与 ARIA orientation 自动适配。
- **面板尺寸约束** — 每个面板支持 `defaultSize`、`minSize`、`maxSize`、`collapsedSize`，精细控制调整边界。
- **可折叠面板** — `collapsible` 面板可通过 Enter 键或命令式 API 折叠到 `collapsedSize`，并触发 `collapse` / `expand` / `resize` 事件。
- **`order` 属性** — 面板声明 `order` 以控制 `defaultLayout` 映射和成对调整的逻辑顺序，独立于 DOM 顺序。
- **`defaultLayout`** — 提供显式初始布局数组（按 `order` 排序后映射到面板）。
- **指针拖拽** — 基于 pointer event 的拖拽，跟踪 `pointerId`，在 owner document 上监听 `pointermove` / `pointerup` / `pointercancel`，卸载时自动清理。
- **键盘调整** — 方向键按 `keyboardResizeBy`（默认 10%）调整；Home / End 跳至最小 / 最大；Enter 切换折叠。
- **RTL 支持** — `dir="rtl"` 同时反转指针增量与方向键方向（水平 splitter）；根 `dir` 属性来自 `useDirection`（回退到 `ConfigProvider`）。
- **命令式面板 API** — `SSplitterPanel` 通过 `defineExpose` 暴露 `collapse()`、`expand()`、`resize(size)`、`getSize()`、`isCollapsed`、`isExpanded`，便于编程控制。
- **完整 ARIA separator 语义** — 手柄使用 `role="separator"`，附带 `aria-controls`、`aria-orientation`、`aria-valuenow`、`aria-valuemin`、`aria-valuemax`、`aria-disabled`。
- **尺寸缩放** — `size`（xs…2xl）通过 `splitterVariants` 缩放手柄视觉握柄宽度。
- **自定义手柄内容** — 向 `SSplitterResizeHandle` 传入默认 slot 实现完全自定义握柄，或使用 `withHandle` 显示内置点状握柄。
- **状态映射** — 面板输出 `data-state="collapsed|expanded"`（可折叠时）、`data-panel-size`、`data-panel-collapsible`；手柄输出 `data-state="drag|hover|inactive"`、`data-disabled`、`data-orientation`。
- **Aria 组合** — `SplitterGroup`、`SplitterPanel`、`SplitterResizeHandle` 从 `@vean/aria/splitter` 导出，可用于自定义样式构建。

## 用法

<UsageCode component="splitter" />

## 演示

<PlaygroundGallery component="splitter" />

## API

<ComponentApi component="splitter" />

## 注意事项

### 架构与行业对标

| 关注点              | VeanUI                                                                                     | react-resizable-panels                                  | Ant Design `ResizeBox` / `Splitter` |
| :------------------ | :----------------------------------------------------------------------------------------- | :------------------------------------------------------ | :---------------------------------- |
| Aria / 样式分离     | ✅ `@vean/aria/splitter` 提供逻辑；`@vean/ui` 提供 `scv()` 配方                            | ❌ 仅 React，无 Aria 层                                 | ❌ 单一样式包                       |
| 面板尺寸约束        | `defaultSize` / `minSize` / `maxSize` / `collapsedSize`                                    | `defaultSize` / `minSize` / `maxSize` / `collapsedSize` | `min` / `max`                       |
| 可折叠面板          | `collapsible` + Enter 键 + 命令式 API                                                      | `collapsible` + `onCollapse` / `onExpand`               | —                                   |
| 面板 `order`        | `order` prop 控制布局映射的逻辑顺序                                                        | `order` prop                                            | —                                   |
| 键盘调整            | 方向键 + Home / End + Enter（折叠切换）                                                    | 方向键 + Home / End + Enter                             | —                                   |
| RTL 支持            | `dir` prop + `useDirection` 回退；反转指针增量与方向键                                     | `direction` prop（RTL 感知）                            | —                                   |
| 命令式面板 API      | `defineExpose`（`collapse` / `expand` / `resize` / `isCollapsed`）                         | `ImperativePanelHandle`                                 | —                                   |
| ARIA separator 语义 | `role="separator"` + `aria-controls` / `aria-valuenow` / `aria-valuemin` / `aria-valuemax` | 相同                                                    | 部分                                |
| 布局持久化          | `layout` 事件（由消费方持久化）                                                            | `autoSaveId` 内置持久化                                 | —                                   |
| 动态挂载/卸载面板   | `registerPanel` / `unregisterPanel` + `refreshLayout`                                      | 支持                                                    | —                                   |
| 拖拽事件            | 手柄 `dragging` 事件                                                                       | `onDragging`                                            | —                                   |

### 运行时注意事项

1. **布局基于百分比** — 所有尺寸为组主轴尺寸的百分比。`getGroupSize()` 读取组元素的 `getBoundingClientRect()`，在拖拽时将像素增量转换为百分比增量。
2. **`order` 影响布局映射，不影响 DOM 位置** — 面板按 `order` 排序后进行 `defaultLayout` 分配和成对调整，但视觉位置由模板顺序决定。当需要布局数组按特定逻辑顺序映射面板时使用 `order`。
3. **`defaultLayout` 映射到排序后的面板** — 提供时，`defaultLayout[i]` 分配给排序位置 `i`（按 `order`，然后注册索引）的面板。未提供时，每个面板使用各自的 `defaultSize`。
4. **折叠阈值** — 当可折叠面板被拖拽到 `collapsedSize` 与 `minSize` 中点以下时，面板吸附到 `collapsedSize`；中点以上则吸附到 `minSize`。
5. **`distributeDelta` 保护** — 增量分配循环上限 20 次迭代，防止面板约束过紧时死循环。剩余增量由回退过程分配给首个可用面板。
6. **指针监听挂在 owner document 上** — `pointermove` / `pointerup` / `pointercancel` 挂在 `handleElement.ownerDocument`（非手柄本身），确保光标离开手柄后拖拽继续。监听在 `pointerup` / `pointercancel` 和组件卸载时清理。
7. **`useDirection` 回退** — 如 `dir` prop 未设置，方向回退到 `ConfigProvider` 的 `dir`，再回退到 `'ltr'`。解析后的 `dir` 设置在组根元素上。

## 常见问题

### 如何让面板可折叠？

在 `SSplitterPanel` 上设置 `collapsible` 并提供 `collapsedSize`（默认 `0`）。用户可在相邻调整手柄上按 Enter 切换折叠。也可通过 `panelRef.value.collapse()` / `expand()` 编程调用。

### `order` 如何工作？

`order` 控制面板在布局计算中的逻辑顺序。`defaultLayout` 数组索引按 `order` 排序后映射到面板（相同 order 按注册索引）。当 DOM 顺序与期望的逻辑顺序不一致时使用，例如侧边栏面板视觉在前但逻辑上应为第二。

### 如何持久化布局？

监听 `SSplitterGroup` 的 `layout` 事件并保存数组（如存入 `localStorage`）。下次挂载时将保存的数组作为 `defaultLayout` 传入。与 react-resizable-panels 的 `autoSaveId` 不同，VeanUI 将持久化留给消费方以保持灵活性。

### 可以禁用调整手柄吗？

可以 — 在 `SSplitterResizeHandle` 上设置 `disabled`。手柄会获得 `aria-disabled="true"`、`data-disabled`，移除 `tabindex`，并阻止指针 / 键盘交互。

### RTL 如何工作？

在 `SSplitterGroup` 上设置 `dir="rtl"`（或依赖 `ConfigProvider`）。RTL 模式下，向右拖拽会缩小第一个面板（与 LTR 相反），ArrowLeft / ArrowRight 方向反转。根元素获得 `dir="rtl"`。

### 如何自定义调整手柄？

向 `SSplitterResizeHandle` 传入默认 slot 实现完全自定义内容。或设置 `withHandle` 显示内置点状握柄。两者都不设置时，手柄为纯线条。

### 可以动态增删面板吗？

可以 — 面板在挂载时注册、卸载时注销。布局通过 `refreshLayout` 自动重新计算。面板卸载时，其尺寸会重新分配给剩余面板。
