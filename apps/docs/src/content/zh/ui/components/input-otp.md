---
head:
  title: InputOtp
  description: 基于真实原生 input 的一次性密码（OTP / 验证码）输入组件。它保留了 vue-input-otp 中成熟的选区、粘贴、移动端自动填充与密码管理器适配行为，同时提供 VeanUI 默认样式和可完全自定义的 scoped slot。适用于短信验证码、邮箱验证码、双因素认证等任意定长验证码输入场景。
---

# InputOtp

## 概述

基于真实原生 input 的一次性密码（OTP / 验证码）输入组件。它保留了 vue-input-otp 中成熟的选区、粘贴、移动端自动填充与密码管理器适配行为，同时提供 VeanUI 默认样式和可完全自定义的 scoped slot。适用于短信验证码、邮箱验证码、双因素认证等任意定长验证码输入场景。

## 用法

<UsageCode component="input-otp" />

## 特性

- 📏 6 种尺寸：xs、sm、md、lg、xl、2xl
- 🔤 真实原生 input 透明叠加——原生选区、粘贴、移动端自动填充/密码管理器行为
- 📐 `align` 对齐：start / center / end
- 🎨 每个字符可完全自定义的 `default` 插槽，支持占位字符与 fake caret
- 🔢 `maxlength` 截断 + `pattern` 校验（`beforeinput` 拦截 + 回滚双层防护）
- 📋 `pasteTransformer` 归一化粘贴内容，填满时触发 `complete` 事件
- 🔐 密码管理器 badge 检测（可用 `pushPasswordManagerStrategy` 关闭）
- ♿ 完整无障碍支持——`aria-label`、`inputmode`、axe 零违规

## 演示

<PlaygroundGallery component="input-otp" />

## API

<ComponentApi component="input-otp" />

## 注意事项

### 架构与对标差异

VeanUI 将 input-otp 拆分为负责透明输入叠加、选区镜像与校验的 Aria 层（`@vean/aria/input-otp`），以及负责变体与 UnoCSS 样式的 styled 层（`@vean/ui`）。Aria `InputOtpCompact` 组合 `InputOtpRoot` / `InputOtpPositioner` / `InputOtpInput`。这是 reka-ui 与 shadcn 所用 vue-input-otp 方案的移植，尺寸变体与 `align` 三态为 VeanUI 的差异化增强。

| 能力                       | VeanUI | reka-ui `InputOtp` | shadcn `InputOTP` | Element Plus |
| :------------------------- | :----: | :----------------: | :---------------: | :----------: |
| Aria/styled 分离           |   ✅   |         —          |         —         |      —       |
| 受控/非受控                |   ✅   |         ✅         |        ✅         |      —       |
| `maxlength` / `pattern`    |   ✅   |         ✅         |        ✅         |      —       |
| 真实 input 透明叠加        |   ✅   |         ✅         |        ✅         |      —       |
| 选区镜像                   |   ✅   |         ✅         |        ✅         |      —       |
| 粘贴转换                   |   ✅   |         ✅         |        ✅         |      —       |
| 密码管理器 badge 适配      |   ✅   |         ✅         |        ✅         |      —       |
| iOS 自动填充               |   ✅   |         ✅         |        ✅         |      —       |
| `complete` 事件            |   ✅   |         ✅         |        ✅         |      —       |
| 尺寸变体（xs…2xl）         |   ✅   |         —          |         —         |      —       |
| `align` 三态               |   ✅   |         ✅         |        ✅         |      —       |
| 自定义视觉槽（fake caret） |   ✅   |         ✅         |        ✅         |      —       |

### 注意事项

- `maxlength` 为必填——它决定渲染的字符个数。
- `aria-label` 属性以 `ariaLabel`（camelCase）声明；kebab-case 属性与 camelCase prop 均可生效，未传入时回退本地化默认文案「One-time password」。
- locale 化默认 `aria-label` 与 `contextmenu` 处理列为增强待办。

## 常见问题

### 如何自定义字符格子？

使用 `default` 插槽。每个字符会获得 `char`、`placeholderChar`、`isActive`、`hasFakeCaret`，可自由渲染方框、分隔符或自定义光标。

### 如何在校验码填满后触发动作？

监听 `complete` 事件，它会在所有格子填满时触发一次。

### 如何限制可输入的字符？

`maxlength` 控制长度，`pattern` 提供逐字符校验正则。非法输入会被 `beforeinput` 拦截，并在 `input` 时回滚。

### 如何让 OTP 参与原生表单？

传入 `name`——透明 input 携带值并参与原生表单提交与自动填充。
