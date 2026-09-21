---
head:
  title: 菜单栏
  description: Menubar 用于构建常驻应用顶部的横向菜单栏：顶层为一组可横向漫游焦点的触发器，点击或悬停展开下拉菜单，支持任意层级嵌套子菜单与完整键盘导航。
---

# 菜单栏

## 概述

Menubar 用于构建常驻应用顶部的横向菜单栏：顶层为一组可横向漫游焦点的触发器，点击或悬停展开下拉菜单，支持任意层级嵌套子菜单与完整键盘导航。

`SMenubar` 是数据驱动的聚合组件：传入 `items` 数组即可渲染完整的 `role="menubar"` 结构、触发器、下拉内容与嵌套子菜单。顶层项既可以是"展开下拉"的触发器，也可以是直接跳转的链接（提供 `href` / `to` 即可）。逻辑与无障碍语义由 Aria `MenubarCompact` 承载，样式通过 `scv()` 配方注入。

> `SMenubar` 把全部结构组合委托给 Aria `MenubarCompact`。无样式的数据驱动用法可导入 `@vean/aria/menubar`；下拉菜单部分复用 `@vean/aria/menu` 的 `MenuOptionsCompact`。

## 功能特性

- **数据驱动组合** — 传 `items`（`MenuOptionData`）即可渲染菜单栏；顶层项通过 `children` 声明下拉菜单，子项支持 `label` / `icon` / `shortcut` / `disabled` / `separator` / `href` / `to`，子项可继续嵌套。
- **横向 Roving Focus** — 根节点保持单一 Tab 停止点，`ArrowLeft` / `ArrowRight` 在触发器间移动焦点，`loop` 开启时首尾循环；禁用触发器被移出焦点顺序。
- **完整键盘导航** — `Enter` / `Space` 切换菜单、`ArrowDown` 打开；菜单内方向键漫游条目、`ArrowRight` / `ArrowLeft` 切换相邻顶层菜单；`Escape` 关闭并归还焦点。
- **悬停 / 指针切换** — 菜单打开后悬停其他触发器即切换打开的菜单；悬停链接型触发器会收起菜单并聚焦该链接。
- **点击 / 悬停触发模式** — `trigger` 支持 `click`（默认）与 `hover`：`click` 模式点击展开菜单，菜单打开后悬停其他触发器仍可切换；`hover` 模式悬停即展开（可用 `delayDuration` / `skipDelayDuration` 控制延迟与连开窗口），并带指针宽限区，可在菜单栏与内容之间平滑移动而不误关。
- **溢出折叠** — `collapsible` 开启后，当菜单栏内容超出容器宽度时，末尾的顶层项自动合并进一个"更多"菜单，始终保证内容宽度不超过容器宽度；可用 `moreLabel` / `moreIcon` / `moreProps` / `more-trigger` 插槽定制。
- **链接型顶层项** — 提供 `href` / `to` 的顶层项渲染为链接（不展开下拉），与导航菜单模式一致；链接保留 `target` / `external` / `disabled` 语义。
- **嵌套子菜单** — 子项通过 `MenuSub` 组合渲染任意层级子菜单，支持方向键进入 / 退出、指针宽限区防抖（100ms 打开延迟）。
- **受控 / 非受控** — 提供 `modelValue` 时打开的菜单跟随 prop 并触发 `update:modelValue`；否则使用 `defaultValue` 做非受控初始值。
- **逐项与整体禁用** — `item.disabled` 使单个顶层项完全惰性（`aria-disabled` + 移出 Tab 顺序 + 阻断交互）；紧凑组件级 `disabled` 一次禁用全部触发器（含链接型）。
- **隐藏项** — `item.hidden` 移除整个顶层项及其下拉菜单；隐藏项在溢出计算之前就被过滤，因此 `collapsible` 只统计可见触发器。子项标记 `hidden` 则从其下拉菜单中移除。
- **双向方向** — `dir` 支持 LTR / RTL，方向键与子菜单滑入方向均按逻辑方向处理；`portalProps` 控制内容是否传送到 body。
- **六种尺寸** — `size`（xs…2xl）变体覆盖根节点与触发器的间距、内边距与字号。
- **菜单槽位透传** — `item-leading` / `item-trailing` / `trigger` / `item-link-icon` 等插槽透传至菜单层，可按项定制内容；`ui` prop 覆盖根节点与触发器槽位。
- **Aria 组合** — `MenubarRoot` / `MenubarMenu` / `MenubarTrigger` / `MenubarContent` / `MenubarSubTrigger` / `MenubarSubContent` 及 `Compact` 均可从 `@vean/aria/menubar` 导出，菜单基础件复用 `@vean/aria/menu`。

## 用法

<UsageCode component="menubar" />

## 演示

<PlaygroundGallery component="menubar" />

## API

<ComponentApi component="menubar" />

## 备注

### 架构与行业对标

| 能力                 | VeanUI                                                | Ant Design `Menu`              | Element Plus `Menu` | Radix `Menubar`              |
| :------------------- | :---------------------------------------------------- | :----------------------------- | :------------------ | :--------------------------- |
| Aria/styled 分离     | ✅ `@vean/aria/menubar` + `scv()`                     | ❌ 单包                        | ❌ 单包             | ✅ `@radix-ui/react-menubar` |
| 数据驱动 compact API | ✅ `MenubarCompact` + 嵌套 `items`                    | ✅ `items`                     | ✅ `items`          | ❌ 面向 JSX 组合             |
| 顶层触发             | ✅ 点击 / 悬停切换 + 方向键                           | ✅ 点击 / 悬停                 | ✅ 点击 / 悬停      | ✅ 点击 / 悬停 + 方向键      |
| 横向键盘漫游         | ✅ Roving Focus + `loop`                              | ✅                             | ✅                  | ✅                           |
| 菜单间切换           | ✅ `ArrowRight` / `ArrowLeft` 跨菜单切换              | ✅                             | ✅                  | ✅                           |
| 嵌套子菜单           | ✅ 任意层级（复用 menu 层）                           | ✅ `SubMenu`                   | ✅ `el-sub-menu`    | ✅                           |
| 链接型顶层项         | ✅ `href` / `to` + `target` / `external` / `disabled` | ✅ `danger` 等                 | —                   | ✅ `LinkItem`                |
| 禁用                 | ✅ 逐项 + 紧凑级整体禁用                              | ✅ `disabled`                  | ✅ `disabled`       | ✅ `disabled`                |
| 受控模式             | ✅ `modelValue` / `defaultValue`                      | ✅ `openKeys` / `selectedKeys` | ✅ `default-active` | ✅ `value` / `onValueChange` |
| 方向                 | ✅ LTR / RTL + 逻辑方向键                             | ✅ RTL                         | ✅ RTL              | ✅ RTL                       |
| 尺寸变体             | ✅ `size` xs…2xl                                      | ✅ `size`                      | ✅ `size`           | —                            |
| 菜单项类型           | ✅ 复选框 / 单选 / 分隔符 / 快捷键（复用 menu 层）    | ✅ 全类型                      | ✅ 全类型           | ✅ 全类型                    |

### 运行时注意事项

1. **打开状态与指针** — 默认模式（`trigger="click"`）下，顶层触发器在 `pointerdown` 时打开菜单；菜单已打开时再次点击同一触发器会通过 dismissable layer 关闭（"再次点击收起"）。悬停其他触发器则切换打开的菜单。`trigger="hover"` 模式悬停即展开，`delayDuration`（默认 150ms）控制展开延迟，`skipDelayDuration`（默认 300ms）控制连开窗口内的无延迟切换。
2. **链接型顶层项** — 提供 `href` / `to` 的项不渲染下拉内容，其点击 / 键盘激活直接导航；在菜单打开时悬停到链接项会收起当前菜单并把焦点移到链接。
3. **禁用语义** — `item.disabled` 作用于单个顶层项：渲染 `aria-disabled`、`tabindex="-1"` 并阻断点击与键盘激活；紧凑组件级 `disabled` 会禁用全部触发器（含链接型）。子菜单中的禁用项遵循 menu 层语义。
4. **Portal 与定位** — 下拉内容默认通过 `Teleport` 传送到 body（可用 `portalProps.disabled` 关闭）。若内容出现在错误位置，请检查是否处于 `transform` / 动画容器祖先内；定位依赖 `getBoundingClientRect` 测量。
5. **受控 / 非受控** — 提供 `modelValue` 时，内部写入仅触发 `update:modelValue`，打开的菜单完全跟随 prop；未受控时 `defaultValue` 指定初始打开项。
6. **焦点归还** — 键盘路径（`Escape` / 方向键切换）会精确归还焦点到触发器；指针路径（点击外部关闭）不主动移动焦点，符合"指针交互不劫持焦点"的惯例。
7. **RTL** — 设置 `dir="rtl"` 后方向键语义镜像（`ArrowLeft` 变为"下一个"），菜单布局依赖逻辑属性自动翻转。
8. **溢出折叠** — 开启 `collapsible` 后，菜单栏内容超出容器宽度时末尾项合并进"更多"菜单；测量基于渲染后的真实布局，容器的父级需提供固定/受限宽度（例如 `max-w-*`）。若菜单栏处于 flex 容器且未收缩，请给父容器设置 `min-w-0` 或宽度约束。

## 常见问题

### 如何让顶层项直接跳转而不展开下拉？

给项设置 `href` 或 `to` 即可——链接型顶层项渲染为 `<a>`，不渲染下拉内容；同时可用 `target` / `external` 控制打开方式。

### 如何精确控制当前打开的菜单？

使用 `v-model` 绑定 `modelValue`。顶层项的 `value` 成为受控值，切换即触发 `update:modelValue`；外部改值会同步打开对应菜单。未受控时用 `defaultValue` 指定初始打开的项。

### 如何禁用整个菜单栏或单个项？

整体禁用传 `disabled` 给 `SMenubar`；单个顶层项禁用在该项上设置 `disabled: true`。禁用项渲染 `aria-disabled`、移出 Tab 顺序，并阻断点击与键盘激活。

### 键盘如何操作？

`Tab` 进入菜单栏后，`ArrowLeft` / `ArrowRight` 在触发器间移动；`Enter` / `Space` 切换菜单、`ArrowDown` 打开；菜单内方向键漫游条目，`ArrowRight` / `ArrowLeft` 切换相邻顶层菜单，`Escape` 关闭。禁用项不在 Tab 顺序中。

### 能在子菜单里用复选框或单选吗？

可以——下拉内容复用 menu 层的能力：`item-checked` 槽位、`MenuCheckboxItem` / `MenuRadioItem` 以及 `separator` / `shortcut` 均可用；紧凑用法中给子项传对应字段即可。

### 为什么悬停链接型项时菜单会收起？

链接型顶层项没有下拉内容，指针进入时菜单栏会收起当前打开的菜单并把焦点移到该链接——这与 Radix Menubar 的链接项行为一致，避免焦点停留在已关闭菜单的触发器上。

### 如何让菜单在悬停时自动展开（而不是点击）？

给 `SMenubar` 传 `trigger="hover"` 即可。悬停触发器会展开菜单（`delayDuration` 控制展开延迟，`skipDelayDuration` 控制连开窗口）；指针可在菜单栏与菜单内容之间移动而不误关。键盘操作（方向键 / Enter / Space / Escape）在两种模式下完全一致。

### 菜单项太多放不下怎么办？

给 `SMenubar` 传 `collapsible`。当菜单栏内容超出容器宽度时，末尾的顶层项会自动合并进一个"更多"菜单（默认标签 `More`，可用 `moreLabel` / `moreIcon` / `moreProps` 定制），保证内容宽度不超过容器。容器宽度变化时折叠状态自动重算。
