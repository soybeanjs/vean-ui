---
head:
  title: 单选框组
  description: 一组可勾选的单选框按钮，同一时刻最多只有一个按钮处于选中态。以数据驱动分组与带 icon/description 内容的卡片变体提供，两者均基于 roving-focus 键盘导航。适用于从小型互斥集合中单选；允许多选时请用 SCheckboxGroup；选项集合过大无法一眼扫尽时，优先用 SSelect。
---

# 单选框组

## 概述

一组可勾选的单选框按钮，同一时刻最多只有一个按钮处于选中态。以数据驱动分组与带 icon/description 内容的卡片变体提供，两者均基于 roving-focus 键盘导航。适用于从小型互斥集合中单选；允许多选时请用 `SCheckboxGroup`；选项集合过大无法一眼扫尽时，优先用 `SSelect`。

## 用法

<UsageCode component="radio-group" />

## 特性

- ☑️ 单选模型——`modelValue` / `defaultValue`，受控与非受控双模式
- ⌨️ Roving-focus 键盘导航——方向键移动并选中、Enter/Space 选择、可选 `loop` 循环
- 🏷 可访问标签——`RadioGroupLabel` 将 `for` 关联到每个控件的 `id`
- 📋 原生表单代理——隐藏输入携带当前值，支持 `name` / `required`
- 🃏 卡片变体（`SRadioGroupCard`）——icon、label、description 内容
- 🎨 `radioGroupVariants` 提供 6 尺寸、8 颜色与 dot/outline 变体
- 📊 Aria 数据驱动聚合——`RadioGroupCompact` / `RadioGroupCardCompact`
- ♿ `role="radiogroup"` + `role="radio"`，`aria-checked` / `data-state` 双通道反射，axe 零违规

## 单选框组组件系列

- `SRadioGroup` - 数据驱动单选框组，支持 dot/outline 变体
- `SRadioGroupCard` - 卡片单选框组，含 icon、label 与 description

## 演示

<PlaygroundGallery component="radio-group" />

## API

<ComponentApi component="radio-group" />

## 注意事项

### 架构与对标差异

VeanUI 以 Aria 链路构建单选框组：`RadioGroupRoot`（`useControllableState` + `useRovingFocusGroup`）→ `RadioGroupItem`（选中派生 + `VisuallyHiddenInput` 表单代理）→ `RadioGroupControl`（`Button` 基座 + `role="radio"` + `aria-checked`/`data-state`，聚焦派生选中）→ `RadioGroupIndicator`（`usePresence` 条件挂载）→ `RadioGroupLabel`（`for` ↔ 控件 `id`）。`RadioGroupCompact` / `RadioGroupCardCompact` 持有条目迭代与默认组合，UI 包装器只注入变体类。`scv()` 配方 `radioGroupVariants` / `radioGroupCardVariants` 声明 6 尺寸、8 颜色与 dot/outline 变体。

| 能力                    | VeanUI | Ant Design `Radio` | Element Plus `Radio` | Mantine `Radio` | Naive UI `Radio` | shadcn `RadioGroup` |
| :---------------------- | :----: | :----------------: | :------------------: | :-------------: | :--------------: | :-----------------: |
| Aria/styled 分离        |   ✅   |         —          |          —           |        —        |        —         |         ✅          |
| 单选互斥                |   ✅   |         ✅         |          ✅          |       ✅        |        ✅        |         ✅          |
| Roving-focus 键盘导航   |   ✅   |         ✅         |          ✅          |       ✅        |        ✅        |         ✅          |
| 受控/非受控             |   ✅   |         ✅         |          ✅          |       ✅        |        ✅        |         ✅          |
| 卡片变体（icon/描述）   |   ✅   |         —          |          —           |        —        |        —         |          —          |
| `button` variant        |   ➕   |         ✅         |          ✅          |        —        |        —         |          —          |
| `Radio.Button` 组合子   |   ➕   |         ✅         |          —           |        —        |        —         |          —          |
| 表单代理 / `name` 提交  |   ✅   |         ✅         |          ✅          |       ✅        |        ✅        |         ✅          |
| axe 零违规（组 + 卡片） |   ✅   |         —          |          —           |        —        |        —         |          —          |

### 注意事项

- 方向键选中经控件上的"聚焦派生 click"提交，与鼠标点击走同一条 `radio.select` / `update:modelValue` 链路。
- 根元素带 `form` 类且传入 `name` 时渲染表单代理；配合原生 `<form>` 或 `SForm` 集成即可提交值。
- `select` 是可取消的自定义事件——调用 `event.preventDefault()` 即可否决本次值变更。
- Enter 显式接入选中处理器（与 checkbox 族系一致）；Space 依赖原生 button 的点击行为。

## 常见问题

### 键盘导航如何工作？

分组使用 roving focus：组内一个 radio 可 tab 到，方向键移动焦点（并选中聚焦项），Enter/Space 选择。设置 `loop` 可首尾循环。

### 用受控还是非受控？

受控：传入 `modelValue` 并配合 `v-model`；非受控：传入 `defaultValue` 让分组内部自行维护状态。两者经 `useControllableState` 统一支持。

### 如何让选中值随表单提交？

为分组传入 `name`；在带 `form` 类的根内，隐藏输入会携带当前值参与原生表单提交。

### `SRadioGroup` 与 `SCheckboxGroup` 有什么区别？

`SRadioGroup` 强制单选——选中一个会取消其他；`SCheckboxGroup` 允许多个勾选值。互斥选项用 radio，多选用 checkbox。
