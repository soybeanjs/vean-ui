---
head:
  title: 主题模式切换按钮
  description: SThemeModeToggle 是一个绑定到当前 SConfigProvider 主题的上下文循环按钮。每次点击在 auto → light → dark → auto 之间推进偏好，图标始终显示当前偏好（显示器 / 太阳 / 月亮）。适合作为头部中单个紧凑控件，且需要能表达并回到 auto。
---

# 主题模式切换按钮

## 概述

`SThemeModeToggle` 是一个绑定到当前 `SConfigProvider` 主题的上下文循环按钮。每次点击在 `auto` → `light` → `dark` → `auto` 之间推进偏好，图标始终显示*当前*偏好（显示器 / 太阳 / 月亮）。当头部或工具栏里下拉太重、而二元开关又无法表达 `auto` 时，用它作为单按钮方案切换。

## 用法

<UsageCode component="theme-mode-toggle" />

## 特性

- 🔁 每次点击在 `auto` → `light` → `dark` → `auto` 之间推进
- 🖼 图标反映*当前*偏好，三种状态都可区分
- 🎚 通过共享主题上下文写入偏好 —— 不接受 `modelValue`
- ♿ 可访问名称为本地化的 `配色方案: <当前>` 文本（可用 `ariaLabel` 覆盖），同时作为提示文字
- 🎨 继承 `SButtonIcon` 的 `size` / `color` / `variant` / `shape`

## 演示

<PlaygroundGallery component="theme-mode-toggle" />

## API

<ComponentApi component="theme-mode-toggle" />

## 注意事项

### 适用范围

与 `SThemeModeSelect`、`SThemeModeSwitch`、`SThemeModeSegment` 类似，`SThemeModeToggle` 属于主题层组件，直接操作父级 `SConfigProvider` 的主题上下文。它不接受 `modelValue`；偏好由 provider 持有并在所有主题组件间共享。它是 `SThemeModeSegment` 的单按钮版本：同样三种偏好，没有下拉也没有可见选项列表。

### 提醒

- 组件必须渲染在提供主题上下文的 `SConfigProvider` 内部，否则 `useTheme` 会抛出异常。
- 与 `SThemeModeSwitch` 不同，它跟踪的是*偏好*而不是生效方案：处于 `auto` 时图标仍是显示器，即使解析出的方案是浅色或深色。
- 循环只向前推进，选中某个特定偏好最多需要点击两次；需要直接选择请用 `SThemeModeSelect` 或 `SThemeModeSegment`。
