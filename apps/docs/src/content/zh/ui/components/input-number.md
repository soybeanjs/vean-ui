---
head:
  title: 数字输入框
  description: 用于输入数值的输入框组件，支持步进按钮、键盘交互与 min/max 边界控制。适用于数量、价格、年龄等必须是数字且处于一定范围的场景。通用文本请使用 SInput。
---

# 数字输入框

## 概述

用于输入数值的输入框组件，支持步进按钮、键盘交互与 min/max 边界控制。适用于数量、价格、年龄等必须是数字且处于一定范围的场景。通用文本请使用 `SInput`。

## 用法

<UsageCode component="input-number" />

## 特性

- 📏 6 种尺寸：xs、sm、md、lg、xl、2xl
- 🎚 步进按钮，支持按住加速（400ms → 60ms 循环）
- ⌨️ 完整键盘支持——方向键、Page Up/Down、Home/End、Enter、滚轮
- ⚖️ `min` / `max` 钳制（边界处按钮禁用）、`step`、`formatOptions` 精度
- 🌐 基于 `Intl.NumberFormat` 的本地化数字格式
- 🧹 可清除模式，清除按钮带 i18n `aria-label`
- 📋 设置 `name` 时通过代理隐藏输入框支持原生表单提交
- ♿ 完整无障碍支持——`aria-valuemin/max/now`、清除按钮命名、axe 零违规

## 演示

<PlaygroundGallery component="input-number" />

## API

<ComponentApi component="input-number" />

## 注意事项

### 架构与对标差异

VeanUI 将数字输入框拆分为负责状态、数字解析/格式化、边界逻辑与表单代理的 Aria 层（`@vean/aria/input-number`），以及负责变体与 UnoCSS 样式的 styled 层（`@vean/ui`）。Aria `InputNumberCompact` 组合 `InputNumberRoot` / `InputNumberControl` / `InputNumberIncrement` / `InputNumberDecrement` / `InputNumberClear` 并暴露 `increment` / `decrement` / `clear` 插槽。这与 Aria/styled 分离一致，区别于 Ant Design、Element Plus、Mantine 等单包方案。

| 能力                     | VeanUI | Ant Design `InputNumber` | Element Plus `input-number` | Mantine `NumberInput` |
| :----------------------- | :----: | :----------------------: | :-------------------------: | :-------------------: |
| Aria/styled 分离         |   ✅   |            —             |              —              |           —           |
| 受控/非受控              |   ✅   |            ✅            |             ✅              |          ✅           |
| step / min / max / 精度  |   ✅   |            ✅            |             ✅              |          ✅           |
| 键盘 Arrow/Page/Home/End |   ✅   |            ✅            |             ✅              |          ✅           |
| 按住触发加速             |   ✅   |            ✅            |              —              |           —           |
| 边界按钮禁用             |   ✅   |            —             |             ✅              |           —           |
| 清除按钮（i18n 标签）    |   ✅   |            —             |             ✅              |           —           |
| 本地化数字格式（Intl）   |   ✅   |            —             |              —              |           —           |
| 尺寸变体（xs…2xl）       |   ✅   |            —             |              —              |          ✅           |
| `center` 布局            |   ✅   |            ✅            |             ✅              |           —           |

### 注意事项

- `formatter` / `parser` 钩子、`controls` 显隐开关与 `compact` 模式未实现，列为增强待办。
- 输入过程中组件接受中间状态，失焦或按 Enter 时会回弹为合法数字。
- 清除按钮仅在悬停或聚焦时出现（桌面惯例）。

## 常见问题

### 如何限制数值范围？

传入 `min` 和 `max`。值在变化时会被钳制，且步进按钮在边界处自动禁用。

### 如何控制小数位数？

通过 `formatOptions.maximumFractionDigits` 控制显示与解析的小数位数（如 `{ maximumFractionDigits: 2 }`）。格式化与步进计算都会遵循配置的精度。

### 键盘如何操作？

方向键上/下按 `step` 步进；Page Up/Down 按 `step * 10` 步进；Home/End 跳到 `min` / `max`；Enter 提交；悬停时滚轮可调整数值。

### 如何本地化显示的数字？

组件使用 `Intl.NumberFormat` 结合当前 locale（以及可选的 `formatOptions`）。千分位与小数点符号随 locale 自动适配。
