---
head:
  title: Clipboard
  description: SClipboard 是一个基于 SButton 的剪贴板动作组件，用于将一段纯文本值复制到系统剪贴板，并提供无障碍按钮语义与「已复制」状态反馈。
---

# Clipboard

## 概述

`SClipboard` 是一个基于 `SButton` 的剪贴板动作组件，用于将一段纯文本值复制到系统剪贴板，并提供无障碍按钮语义与「已复制」状态反馈。

适用于复制短文本值（安装命令、邀请码、短链接、ID 等），或在代码块、表格行、卡片旁提供一键复制入口；不适用于复制富文本、图片或大段格式化内容——组件仅处理 `string`。

基于 `SButton` 实现，继承其 `color`/`size`/`variant`/`shape` 主题能力与 `as`/`asChild` 多态，常与 `kbd`、`code` 等展示组件搭配作为旁路复制入口。

## 用法

<UsageCode component="clipboard" />

## 特性

- 📋 点击即可复制必填文本值
- 🧩 内置默认图标与文本，可通过 `leading`/`default`/`trailing` 插槽覆盖
- 🌐 `copyText`/`copiedText` 默认使用 `ConfigProvider` 中 `clipboard.copy`/`clipboard.copied` 的多语言文案
- ✅ 暴露 `ready`、`copied`、`unsupported` 三种状态
- 🎨 复用 `SButton` 的 8 种变体、8 种颜色、6 种尺寸、4 种形状
- 🔌 继承 `SButton` 的 `as`/`asChild` 多态与 `class` 覆盖
- 🛡️ 异步 Clipboard API 不可用时自动降级到 `execCommand('copy')`（可通过 `legacy` 关闭）
- ♿ 在 Aria 层保留按钮语义、禁用行为与 `data-state`
- 🎯 TypeScript 类型安全，`ClipboardSlotProps` 提供完整插槽参数类型

## 演示

<PlaygroundGallery component="clipboard" />

## API

<ComponentApi component="clipboard" />

## 注意事项

### 架构与对标差异

VeanUI 将 clipboard 拆分为 Aria 层（`@vean/aria/clipboard`，负责复制状态、按钮语义与插槽参数）和 styled 层（`@vean/ui`，复用 button 的 variant recipe）。这与 `shadcn/ui` 的 headless/styled 分离思路一致，不同于 Ant Design、Element Plus、MUI、Mantine、Naive UI 等单包组件库。

| 维度 | VeanUI                                                                   | Ant Design / Element Plus / MUI / Mantine / Naive UI |
| :--- | :----------------------------------------------------------------------- | :--------------------------------------------------- |
| 架构 | 基于 `Button` 的 Aria + styled 分离                                      | 单包 `CopyButton` / `Typography.Paragraph copyable`  |
| 样式 | 通过共享 `buttonVariants` recipe 使用 UnoCSS                             | CSS-in-JS / SCSS / CSS 变量                          |
| 定制 | `class`、`as` / `asChild`、`leading` / `default` / `trailing` 插槽       | `icon`、`text`、`format`、组件覆写                   |
| 降级 | `legacy` 属性启用自实现的 `execCommand('copy')` 回退（位于 `shared.ts`） | 各库自有降级策略                                     |
| 反馈 | `data-state`、插槽参数、`copied` / `copyError` 事件                      | tooltip、message 或行内文本切换                      |

### 运行约束

- **安全上下文**：异步 Clipboard API（`navigator.clipboard.writeText`）仅在安全上下文（HTTPS 或 `localhost`）下可用。非安全上下文中 API 不可用，组件会降级到 `legacy` 的 `execCommand('copy')`（`legacy` 默认 `true`），或在 `legacy={false}` 时进入 `unsupported` 状态。
- **legacy 降级已废弃**：`document.execCommand('copy')` 已被规范废弃。`legacy` 默认为 `true` 以最大化兼容性；如仅需依赖异步 API，可设置 `legacy={false}`。
- **SSR 与水合**：服务端无 `navigator`，`isClipboardWriteSupported()` 返回 `false`。默认 `legacy=true` 时 SSR 渲染为 `ready` 并能一致水合；若设置 `legacy={false}`，SSR 会渲染为 `unsupported`，在支持的客户端上水合为 `ready`——若该差异敏感，请用 `<ClientOnly>` 包裹或保留默认 `legacy=true`。
- **计时器清理**：`copied` 状态在 `copiedDuration`（默认 2000ms）后通过 `useTimeoutFn` 自动重置，组件卸载时自动清理，无需手动管理计时器。

## 常见问题

**如何自定义复制后的界面？**
使用 `leading`、默认或 `trailing` 插槽。每个插槽都会收到包含 `copied`、`disabled`、`icon`、`supported`、`state`、`text` 和 `copy()` 的 `ClipboardSlotProps`。

**如何制作仅图标的复制按钮？**
清空默认插槽，并显式传入 `aria-label`（或在其他插槽中保留可见文本）。可参考 playground 中的 `icon-only` 示例。

**Clipboard API 不可用时会发生什么？**
当异步 Clipboard API 与 legacy 回退都无法工作时，组件会暴露 `data-state="unsupported"` 并禁用交互。若不希望使用 `execCommand('copy')` 回退，可设置 `legacy={false}`。

**如何处理复制失败？**
监听 `copyError` 事件。失败时组件会保持 `data-state="ready"`，避免进入错误的已复制状态，便于用户重试。

**如何本地化内置的复制文案？**
`copyText`/`copiedText` 默认取自 `ConfigProvider` 所选语言的 `clipboard.copy`/`clipboard.copied` 文案（回退为 `en`）。可通过传入 `copy-text`/`copied-text` 属性，或在 `ConfigProvider` 上通过 `messages` 覆盖自定义。

**能否以编程方式触发复制？**
可以。调用插槽参数中的 `copy()`，或触发按钮并监听 `copied` 事件。
