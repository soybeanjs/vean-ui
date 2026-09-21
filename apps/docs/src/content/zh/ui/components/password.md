---
head:
  title: 密码
  description: 带显示/隐藏切换按钮的密码输入框组件。适用于登录表单、注册表单等任何敏感凭据输入场景。它组合输入框族系基座并提供可见性切换，同时支持可清除模式。非敏感文本请使用 SInput。
---

# 密码

## 概述

带显示/隐藏切换按钮的密码输入框组件。适用于登录表单、注册表单等任何敏感凭据输入场景。它组合输入框族系基座并提供可见性切换，同时支持可清除模式。非敏感文本请使用 `SInput`。

## 用法

<UsageCode component="password" />

## 特性

- 📏 6 种尺寸：xs、sm、md、lg、xl、2xl（继承自输入框基座）
- 👁 显示/隐藏切换，带 i18n `aria-label` 与 `aria-pressed` 语义
- 🎛 受控/非受控 `visible` 状态（`v-model:visible` + `defaultVisible`）
- 🧹 可清除模式，清除按钮带 i18n `aria-label`
- 🔒 `disabled` / `readonly` 对 input、切换按钮、清除按钮三元素全守卫
- 📋 设置 `name` 时通过代理隐藏输入框支持原生表单提交
- 🧩 自定义 `visible` 插槽，可定制切换按钮
- ♿ 完整无障碍支持——切换按钮命名、按下态、axe 零违规

## 演示

<PlaygroundGallery component="password" />

## API

<ComponentApi component="password" />

## 注意事项

### 架构与对标差异

VeanUI 通过复用输入框族系基座构建密码输入：`PasswordCompact` 组合 `InputRoot` / `InputControl` / `InputClear`，并新增由 `useControllableState` 支撑的默认 `visible` 插槽。styled 层在 `inputVariants` 基础上扩展 `visible` 插槽覆写，样式为迷你图标按钮。这与 reka-ui、shadcn 的 headless/styled 分离一致，区别于 Element Plus 等单包方案。

| 能力                         | VeanUI | reka-ui `PasswordInput` | shadcn | Element Plus `el-input` |
| :--------------------------- | :----: | :---------------------: | :----: | :---------------------: |
| Aria/styled 分离             |   ✅   |            —            |   —    |            —            |
| 受控/非受控 `visible`        |   ✅   |           ✅            |   —    |            —            |
| 显示/隐藏切换（图标）        |   ✅   |           ✅            |   ✅   |           ✅            |
| i18n 切换标签                |   ✅   |            —            |   —    |           ✅            |
| `aria-pressed` 语义          |   ✅   |            —            |   —    |            —            |
| 可清除模式                   |   ✅   |            —            |   ✅   |           ✅            |
| `disabled` / `readonly` 守卫 |   ✅   |           ✅            |   ✅   |           ✅            |
| 尺寸变体（xs…2xl）           |   ✅   |            —            |   —    |            —            |
| 自定义 `visible` 插槽        |   ✅   |            —            |   —    |            —            |
| 表单代理（隐藏输入框）       |   ✅   |            —            |   —    |            —            |

### 注意事项

- `type` 属性会被可见性状态接管（可见时 `text`、否则 `password`），用户传入的 `type` 不会生效。
- 切换按钮渲染为 `type="button"`，防止误触原生表单提交。
- 光标位置与密码管理器兼容性由原生 input 契约保证。

## 常见问题

### 如何让密码默认显示？

非受控方式传入 `defaultVisible`；受控方式用 `v-model:visible` 绑定 `visible`。

### 如何自定义切换按钮？

使用 `visible` 插槽。它提供 `modelValue`、`visible`、`clear`、`toggle` 等 props，可完全掌控。

### 如何让输入框可清除？

传入 `clearable`。清除按钮会清空值并触发 `clear` 事件；`disabled` / `readonly` 时会同步禁用。

### 为什么传入的 `type` 不生效？

密码输入框必须切换 `text` 与 `password` 以实现可见性切换。该切换由组件持有，因此用户传入的 `type` 会被覆盖——这是设计意图。
