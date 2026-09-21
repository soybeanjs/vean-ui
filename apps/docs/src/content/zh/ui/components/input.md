---
head:
  title: 输入框
  description: 用于输入文本的基础输入框组件，支持标准 input 属性、前后缀插槽与可清除功能。适用于任意短文本录入场景——表单字段、搜索框、过滤器。多行文本请使用 STextarea，敏感值请使用 SPassword，数值请使用 SInputNumber。
---

# 输入框

## 概述

用于输入文本的基础输入框组件，支持标准 input 属性、前后缀插槽与可清除功能。适用于任意短文本录入场景——表单字段、搜索框、过滤器。多行文本请使用 `STextarea`，敏感值请使用 `SPassword`，数值请使用 `SInputNumber`。

## 用法

<UsageCode component="input" />

## 特性

- 📏 6 种尺寸：xs、sm、md、lg、xl、2xl
- 🧹 可清除模式，悬停/聚焦时显示清除按钮（i18n `aria-label`）
- 🔤 `leading` / `trailing` 插槽，用于前缀与后缀内容
- 🔒 `disabled` / `readonly` 状态，交互守卫完整
- 📋 设置 `name` 时通过代理隐藏输入框支持原生表单提交
- ♿ 完整无障碍支持——`aria-roledescription`、清除按钮命名、axe 零违规
- 🎯 TypeScript 类型安全，`type` 属性严格类型化

## 输入框组件系列

- **SInput** - 基础文本输入组件
- **SInputClear** - 清除按钮，`clearable` 时悬停/聚焦显示

## 演示

<PlaygroundGallery component="input" />

## API

<ComponentApi component="input" />

## 注意事项

### 架构与对标差异

VeanUI 将输入框拆分为负责状态、表单代理与清除按钮语义的 Aria 层（`@vean/aria/input`），以及负责变体与 UnoCSS 样式的 styled 层（`@vean/ui`）。Aria `InputCompact` 组合 `InputRoot` / `InputControl` / `InputClear` 并暴露 `leading` / `clear` / `trailing` 插槽，与 Radix 的 headless/styled 分离一致，区别于 Ant Design、Element Plus 等单包方案。

| 能力                 | VeanUI | Ant Design `Input` | Element Plus `Input` | Radix `TextField` |
| :------------------- | :----: | :----------------: | :------------------: | :---------------: |
| Aria/styled 分离     |   ✅   |         —          |          —           |        ✅         |
| 受控/非受控          |   ✅   |         ✅         |          ✅          |        ✅         |
| 清除按钮（悬停显示） |   ✅   |         ✅         |          ✅          |         —         |
| 清除按钮 i18n 标签   |   ✅   |         ✅         |          —           |         —         |
| 前缀/后缀插槽        |   ✅   |         ✅         |          ✅          |        ✅         |
| 原生表单代理         |   ✅   |         —          |          —           |         —         |
| 尺寸变体             |   ✅   |         ✅         |          ✅          |         —         |
| `showCount` 计数器   |   —    |         ✅         |          ✅          |         —         |
| `error` / `loading`  |   —    |         ✅         |          ✅          |         —         |

### 注意事项

- `showCount` 计数器、`error` 态与 `loading` 态未实现，列为增强待办。
- 清除按钮仅在悬停或聚焦时出现（桌面惯例）；触屏场景如需清除入口，可借助 `leading` / `trailing` 插槽自行提供。
- 根节点默认渲染 `role="group"`、`aria-roledescription="Input"` 与 `spellcheck="false"`，属设计意图。

## 常见问题

### 如何添加前缀图标或后缀文本？

使用 `leading` 和 `trailing` 插槽，它们接收根节点上下文并渲染在输入框内部。

### 为什么清除按钮只在悬停时显示？

清除按钮可见性遵循桌面悬停/聚焦惯例（`group-hover` / `group-focus-within`），有意不常驻显示，以保持输入框紧凑并避免误清除。

### 输入框如何参与原生表单提交？

传入 `name` 即可——组件会渲染一个携带当前值的视觉隐藏代理输入框，原生表单提交与校验无需额外接线。

### 如何限制输入长度？

传入 `maxlength` / `minlength`，会透传到原生 input。可见计数器暂未提供（列为增强待办）。
