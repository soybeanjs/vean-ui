---
head:
  title: 复选框
  description: '用于在选中/未选中之间切换的控件，并支持半选（indeterminate）状态表达部分选中。以独立控件、roving-focus 分组与数据驱动卡片变体等多种形态提供。适用于独立开关、多选列表以及带半选联动的"全选"场景；从集合中单选请用 SRadioGroup。'
---

# 复选框

## 概述

用于在选中/未选中之间切换的控件，并支持半选（indeterminate）状态表达部分选中。以独立控件、roving-focus 分组与数据驱动卡片变体等多种形态提供。适用于独立开关、多选列表以及带半选联动的"全选"场景；从集合中单选请用 `SRadioGroup`。

## 用法

<UsageCode component="checkbox" />

## 特性

- ☑️ 三态模型——`CheckedState` 为 `boolean | 'indeterminate'`，经 `aria-checked`（`mixed`）与 `data-state` 双通道反射
- 🗂 分组支持 roving-focus 键盘导航（`useRovingFocusGroup`，方向键）
- 🏷 可访问标签——`SCheckboxLabel` 将 `for` 关联到控件的 `id`
- 📋 原生表单代理——渲染隐藏输入，携带 `name` / `value`（默认 `'on'`）/ `checked` 参与表单提交
- 🃏 卡片变体（`SCheckboxCard` / `SCheckboxCardGroup`）——icon、label、description 内容
- 🎨 `checkboxVariants` 提供 6 尺寸、8 颜色、2 形状与横/纵排列
- 📊 数据驱动 Compact 聚合——`CheckboxGroupCompact` / `CheckboxCardGroupCompact` 持有迭代与默认组合
- ♿ `role="checkbox"` + 完整 aria 支持，四种形态 axe 零违规

## 复选框组件系列

- `SCheckbox` - 基础复选框，含 label、control 与 indicator
- `SCheckboxGroup` - 纵向/横向分组，支持 roving-focus 导航与表单代理
- `SCheckboxCard` - 卡片复选框，含 icon、label 与 description
- `SCheckboxCardGroup` - 数据驱动的卡片复选框分组

## 演示

<PlaygroundGallery component="checkbox" />

## API

<ComponentApi component="checkbox" />

## 注意事项

### 架构与对标差异

VeanUI 以单一事实源的三态状态机构建复选框：`CheckboxRoot`（`useControllableState` + `CheckedState`）派生 `ariaChecked`（`indeterminate` → `mixed`）与 `dataState`（checked / indeterminate / unchecked），`CheckboxControl` 在 `role="checkbox"` 上双通道反射，`CheckboxIndicator` 经 `usePresence` 条件挂载。组值变更由 `CheckboxGroupRoot` 发出——它包装 `useRovingFocusGroup` 提供方向键导航，并渲染 `VisuallyHiddenInput` 表单代理。`scv()` 配方 `checkboxVariants` / `checkboxCardVariants` 声明 6 尺寸、8 颜色、2 形状；四层 Compact 持有迭代与默认组合，UI 包装器只注入变体类。

| 能力                      | VeanUI | Ant Design `Checkbox` | Element Plus `Checkbox` | Mantine `Checkbox` | shadcn/ui `Checkbox` |
| :------------------------ | :----: | :-------------------: | :---------------------: | :----------------: | :------------------: |
| Aria/styled 分离          |   ✅   |           —           |            —            |         —          |          ✅          |
| 三态（indeterminate）     |   ✅   |          ✅           |           ✅            |         ✅         |          ✅          |
| 独立 `indeterminate` prop |   ➕   |          ✅           |           ✅            |         ✅         |          —           |
| 表单 value 映射           |   ✅   |          ✅           |           ✅            |         ✅         |          ✅          |
| 卡片变体（icon/描述）     |   ✅   |           —           |            —            |         —          |          —           |
| 组 roving-focus 键盘导航  |   ✅   |          ✅           |           ✅            |         ✅         |          —           |
| `button` variant          |   ➕   |          ✅           |           ✅            |         —          |          —           |
| 全选/半选联动辅助         |   ➕   |          ✅           |            —            |         —          |          —           |

### 注意事项

- 半选状态通过 `modelValue="indeterminate"` 驱动；独立 `indeterminate` prop 属于路线图增强项，尚未实现。
- 组根 `disabled` 会禁用全部条目；启用组内的单条目 `disabled` 同样生效。
- 传入 `name` 后表单代理生效——配合原生 `<form>` 或 `SForm` 集成即可提交值。
- indicator 使用 `pointer-events: none`，点击始终落在控件自身。

## 常见问题

### 如何展示半选状态？

传入 `modelValue="indeterminate"`（或 `defaultValue`）；控件会反射 `aria-checked="mixed"` 与 `data-state="indeterminate"`。

### 如何构建"全选"列表？

用主 `SCheckbox` 配合 `modelValue="indeterminate"` 与一个 `SCheckboxGroup`；把组的 `update:modelValue` 回映到主复选框即可驱动半选联动。

### 如何让复选框值随表单提交？

为复选框或分组传入 `name`；组件会渲染隐藏输入，使原生表单提交携带 `value`（默认 `'on'`）或勾选值数组。

### `SCheckboxCard` 与 `SCheckbox` 有什么区别？

`SCheckboxCard` 渲染带边框的卡片，含 `icon` / `label` / `description` 内容槽与 `data-[state=checked]` 边框高亮；`SCheckbox` 是裸控件。
