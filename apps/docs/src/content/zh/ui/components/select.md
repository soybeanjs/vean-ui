---
head:
  title: 选择器
  description: 用于从选项列表中选择值的选择器组件，由按钮触发。触发器渲染选中值（或占位符），弹层支持键盘导航、typeahead 搜索、分组、多选与可清除模式。适用于从有界集合中选取一个或多个值；需在列表中自由输入搜索请用 SCombobox；层级级联数据请用 SCascader。
---

# 选择器

## 概述

用于从选项列表中选择值的选择器组件，由按钮触发。触发器渲染选中值（或占位符），弹层支持键盘导航、typeahead 搜索、分组、多选与可清除模式。适用于从有界集合中选取一个或多个值；需在列表中自由输入搜索请用 `SCombobox`；层级级联数据请用 `SCascader`。

## 用法

<UsageCode component="select" />

## 特性

- 📊 数据驱动 `SelectCompact` API——传 `items`（选项使用 `label` / `value` 字段）
- ⌨️ 完整 combobox 交互——指针/键盘打开、Arrow/Home/End 导航、typeahead 搜索、Enter/Space 选择、Escape 关闭
- 🗂 分组，支持组标签、分隔符与条目指示器
- ✅ `multiple` 多选，累积与去重
- 🧹 可清除模式——触发器悬停显现清除按钮；`selectionBehavior` 控制再次点击是切换还是重置
- 📍 选中项对齐定位（`position="item-aligned"`）
- 📋 通过隐藏代理 `<select>`（`SelectBubbleSelect`）支持原生表单提交
- 📌 `top` / `bottom` 插槽，可在浮窗内添加固定的顶部与底部内容
- ♿ 完整无障碍支持——`role="combobox"` / `listbox` / `option`、axe 零违规

## 演示

<PlaygroundGallery component="select" />

## API

<ComponentApi component="select" />

## 注意事项

### 架构与对标差异

VeanUI 基于完整 ComboBox 基座构建选择器：`SelectRoot` → `SelectTrigger`（`role="combobox"`）→ `SelectValue`（collection 标签查找）→ `SelectContentImpl`（DismissableLayer + FocusScope + typeahead + 键盘导航）→ `SelectItem`，并由 `SelectBubbleSelect` 代理原生表单提交。`scv()` 配方 `selectVariants` 声明 16 个插槽与 7 个尺寸变体。这与 reka-ui / shadcn 的 select 语义一致，数据驱动 `SelectCompact` 聚合为 VeanUI 的差异化增强。

| 能力                     | VeanUI | reka-ui `Select` | shadcn `Select` | Element Plus `el-select` |
| :----------------------- | :----: | :--------------: | :-------------: | :----------------------: |
| Aria/styled 分离         |   ✅   |        ✅        |        —        |            —             |
| combobox 角色 + 键盘导航 |   ✅   |        ✅        |       ✅        |            ✅            |
| typeahead 搜索           |   ✅   |        ✅        |        —        |            ✅            |
| 受控/非受控 + 多选       |   ✅   |        ✅        |        —        |            ✅            |
| 分组 + 组标签            |   ✅   |        ✅        |       ✅        |            ✅            |
| 表单代理（BubbleSelect） |   ✅   |        ✅        |        —        |            ✅            |
| 选中项对齐定位           |   ✅   |        ✅        |        —        |            —             |
| 数据驱动 Compact API     |   ✅   |        —         |        —        |            —             |
| 虚拟滚动                 |   —    |        —         |        —        |            ✅            |
| axe 零违规（打开态）     |   ✅   |        —         |       ✅        |            —             |

### 注意事项

- 弹层首次打开前，标签查找依赖由 `items` 计算的数据驱动 `fallbackLabel`——请传入 `items`（而非仅组合子节点），否则 `defaultValue` / 受控 `modelValue` 的触发器文本无法渲染。
- 虚拟滚动未实现；超大选项列表可能需要自行虚拟化。
- `multiple` 搭配 `clearable` 时，用 `selectionBehavior` 决定清除是切换关闭还是重置选择。

## 常见问题

### 弹层未打开时如何显示选中标签？

向 `SSelect` 传入 `items`。`SelectCompact` 通过 `fallbackLabel` 从 `items` 解析标签，使 `defaultValue` / 受控 `modelValue` 立即渲染在触发器上。

### 如何启用多选？

传入 `multiple`。选项累积并去重，`modelValue` 变为数组。

### 如何分组？

传入分组的 `items`——分组项携带 `label` 与嵌套 `items` 数组。组头通过 `group-label` 插槽渲染，分隔符通过 `separator` 渲染。

### 选择器如何参与原生表单提交？

组件渲染一个镜像当前值的隐藏原生 `<select>`（`SelectBubbleSelect`），原生表单提交与浏览器自动填充即可工作。

### 如何让触发器显示箭头或自定义内容？

使用 `trigger-icon` / `value` 插槽（及 `showArrow` 对应插槽面）；`SSelect` 会转发全部 16 个配方插槽。

### 如何从触发器清除选中值？

`clearable` 默认为 `true`。有选中值时，悬停或聚焦触发器会显现 ✕ 按钮，点击后将 `modelValue` 重置为 `undefined`（多选时为 `[]`）。传入 `:clearable="false"` 可隐藏该按钮。再次点击已选项仍遵循 `selectionBehavior`。

### 如何在浮窗内添加固定的顶部或底部内容？

使用 `top` 与 `bottom` 插槽。`top` 渲染在可滚动列表上方，`bottom` 渲染在其下方；两者保持固定，仅中间的选项列表滚动。
