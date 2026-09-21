---
head:
  title: 菜单
  description: 'Menu 组件家族用于构建复杂的嵌套菜单（支持下拉菜单与右键菜单）。它提供数据驱动方式：通过 SMenuOptions、SMenuCheckboxOptions、SMenuRadioOptions 轻松配置分组、子菜单、复选项、单选项、分隔线、快捷键与链接项。逻辑层复用 @vean/aria/menu，具备完整的 WAI-ARIA 菜单语义与 roving-focus 键盘导航。'
---

# 菜单

## 概述

Menu 组件家族用于构建复杂的嵌套菜单（支持下拉菜单与右键菜单）。它提供数据驱动方式：通过 `SMenuOptions`、`SMenuCheckboxOptions`、`SMenuRadioOptions` 轻松配置分组、子菜单、复选项、单选项、分隔线、快捷键与链接项。逻辑层复用 `@vean/aria/menu`，具备完整的 WAI-ARIA 菜单语义与 roving-focus 键盘导航。

## 功能特性

- **数据驱动的 Compact 组合** — `SMenuOptions` / `SMenuCheckboxOptions` / `SMenuRadioOptions` 从 `items` 数组递归渲染条目；Aria `MenuOptionsCompact` 负责迭代、默认装配与子菜单递归。
- **完整 WAI-ARIA 菜单语义** — `role="menu"` / `menuitem` / `menuitemcheckbox` / `menuitemradio`，`aria-checked`（含 `'mixed'`）、`aria-haspopup`、`aria-expanded`、`aria-controls`、`aria-disabled`。
- **完整键盘导航** — roving focus 方向键移动（dir 感知）、Typeahead 字符搜索（过滤禁用项）、Home/End/PageUp/PageDown 跳转、Enter/Space 选中、Esc 关闭并归还焦点、Tab 在菜单内循环、子菜单方向键打开/关闭。
- **浮层定位** — 基于 `@floating-ui/dom`（`autoUpdate` + `arrow`/`flip`/`hide`/`limitShift`/`offset`/`shift`/`size` 中间件），支持 arrow、placement、sideOffset 与 CSS 变量传递。
- **三种数据形态** — 普通 `MenuOptionData`（图标/快捷键/分隔线/链接/子菜单）、复选 `MenuCheckboxOptionData`（`CheckedState` 含 `'mixed'`）、单选 `MenuRadioOptionData`（`AcceptableBooleanValue`），各带独立 group。
- **分组与分隔** — `isGroupLabel` 渲染 `MenuGroupLabel` 分组标题，`separator` 渲染分隔线，`shortcut` 渲染快捷键提示。
- **浮层生命周期** — dismissable layer（点击外部/Esc 关闭）、Presence（退出动画 + `forceMount`）、body scroll lock、focus scope/trap、modal 模式。
- **禁用项** — 逐项 `disabled` 与 `itemProps.disabled` 全局兜底（显式项值优先），`aria-disabled` + `tabindex="-1"`。
- **隐藏项** — 逐项 `hidden` 将该条目及其整棵子树从渲染结果、激活路径查找与键盘导航中移除；子项全部隐藏的条目按叶子节点渲染。
- **Aria 组合** — `MenuRoot` / `MenuContent` / `MenuItem` / `MenuCheckboxItem` / `MenuRadioItem` / `MenuSub` / `MenuGroup` 等从 `@vean/aria/menu` 导出，供下拉菜单、右键菜单、菜单栏复用。

## 组件家族

- **`SMenuOptions`** — 数据驱动的普通菜单项列表（含子菜单/链接/分隔线/快捷键）。
- **`SMenuOption`** — 递归条目组件，`SMenuOptions` 内部使用（可独立使用）。
- **`SMenuCheckboxOptions`** — 复选菜单项组（`v-model` 绑定数组 / `CheckedState`）。
- **`SMenuRadioOptions`** — 单选菜单项组（`v-model` 绑定 `AcceptableBooleanValue`）。

## 用法

<UsageCode component="menu" />

## 演示

<PlaygroundGallery component="menu" />

## API

<ComponentApi component="menu" />

## 备注

### 架构与行业对标

| 关注点                   | VeanUI                                      | Radix UI Menu  | Ant Design Menu / Dropdown | Element Plus Dropdown |
| :----------------------- | :------------------------------------------ | :------------- | :------------------------- | :-------------------- |
| Aria / 样式分离          | ✅ `@vean/aria/menu` + `scv()`              | ✅ Aria 原语   | ❌ 单一包                  | ❌ 单一包             |
| 数据驱动 Compact API     | ✅ 普通/复选/单选三形态                     | ❌ 仅组件组合  | ✅ 配置驱动（items）       | ✅ 配置驱动           |
| roving focus + typeahead | ✅ 完整键盘模型（Home/End/PageUp/PageDown） | ✅             | 部分                       | 部分                  |
| 子菜单方向键             | ✅ ArrowRight/Left（dir 感知）              | ✅             | 部分                       | 部分                  |
| 复选/单选项              | ✅ `menuitemcheckbox` / `menuitemradio`     | ✅             | ✅                         | 部分                  |
| `'mixed'` 半选           | ✅ `CheckedState`                           | ✅             | ✅                         | —                     |
| 浮层定位                 | ✅ floating-ui（arrow/size/flip/…）         | ✅             | ✅                         | ✅                    |
| 分隔线 / 快捷键          | ✅ `separator` / `shortcut`                 | 组件组合       | ✅（divider / command）    | 部分                  |
| 分组                     | ✅ `isGroupLabel` + `MenuGroupLabel`        | ✅ `MenuGroup` | ✅（type:'group'）         | 部分                  |

`—` = 不支持或采用不同交互模型。

### 运行时注意事项

1. **`items` 数据形态** — `MenuOptionData` 含 `label`/`value`/`icon`/`shortcut`/`separator`/`isGroupLabel`/`children`；`children` 递归渲染子菜单。复选/单选形态各有独立类型。
2. **受控/非受控** — 复选与单选组支持 `modelValue` / `defaultValue`（`useControllableState`）；单选组 `modelValue` 可为 `null`（无选中）。
3. **键盘激活** — roving focus 由 `useRovingFocusGroup` 维护；`typeahead` 在菜单内按字符跳转（过滤禁用项）；`Esc` 经 `useDismissableLayer` 关闭并归还焦点到 trigger。
4. **禁用回退** — 逐项 `disabled` 优先于 `itemProps.disabled` 全局兜底；禁用项 `aria-disabled` + `tabindex="-1"`，保持注册以便 typeahead 跳过。
5. **浮层生命周期** — dismissable layer + Presence（`forceMount` 支持）；body scroll lock 与 focus scope 由 Root 开启 modal 模式时启用。
6. **链接项** — 带 `href`/`to` 的条目渲染为链接（复用 Link 原语），`itemProps` / `linkProps` 透传属性。
7. **`select` 事件载荷** — `select(item, event)` 携带被选条目与原生事件；返回前可通过 `event` 的 `defaultPrevented` 控制菜单是否关闭。

## 常见问题

### 如何创建带子菜单的菜单项？

在 `MenuOptionData` 中提供 `children` 数组即可递归渲染子菜单；子菜单支持再次嵌套。

### 复选项与单选项如何绑定值？

复选使用 `v-model` 绑定数组（`CheckedState[]`，支持 `'mixed'`）；单选使用 `v-model` 绑定 `AcceptableBooleanValue`（可为 `null` 表示无选中）。

### 如何添加分隔线与快捷键？

在条目数据中设置 `separator: true` 在条目后渲染分隔线；设置 `shortcut`（`KbdValue` 或数组）在条目末尾渲染快捷键提示。

### 键盘如何导航？

方向键移动焦点（dir 感知）；输入字母触发 typeahead 跳转；`Home`/`End` 跳首尾；`Enter`/`Space` 选中；`Esc` 关闭并归还焦点；`Tab` 在菜单内循环；子菜单通过 `ArrowRight`/`ArrowLeft` 打开/关闭。

### 可以构建完全自定义的菜单吗？

可以 — 从 `@vean/aria/menu` 组合 `MenuRoot` / `MenuContent` / `MenuItem` / `MenuCheckboxItem` / `MenuRadioItem` / `MenuSub` / `MenuGroup` 等原语，并通过 `provideMenuUi`（或 `SMenuOptions` 的 `ui` prop）注入样式。
