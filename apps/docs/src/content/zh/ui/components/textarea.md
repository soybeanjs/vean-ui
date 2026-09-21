---
head:
  title: 文本域
  description: 用于输入多行文本的组件，支持自动高度、字符计数与可清除功能。适用于描述、评论、留言等跨行内容。单行输入请使用 SInput。
---

# 文本域

## 概述

用于输入多行文本的组件，支持自动高度、字符计数与可清除功能。适用于描述、评论、留言等跨行内容。单行输入请使用 `SInput`。

## 用法

<UsageCode component="textarea" />

## 特性

- 📏 6 种尺寸：xs、sm、md、lg、xl、2xl
- 📐 自动高度，支持 `minRows` / `maxRows` 边界与 overflow 切换
- 🧹 可清除模式，清除按钮带 i18n `aria-label`
- 🔢 字符计数器（`count / maxlength`），有无 `maxlength` 两种形态
- 🔄 `resize` 控制：none / vertical / horizontal（autosize 启用时忽略）
- 📋 设置 `name` 时通过代理隐藏输入框支持原生表单提交
- 🧩 `clear` / `counter` / `footer` 插槽，可按需定制各部分
- ♿ 完整无障碍支持——`aria-roledescription`、清除按钮命名、axe 零违规

## 文本域组件系列

- **STextarea** - 基础多行文本域组件
- **STextareaClear** - 清除按钮，`clearable` 时悬停/聚焦显示

## 演示

<PlaygroundGallery component="textarea" />

## API

<ComponentApi component="textarea" />

## 注意事项

### 架构与对标差异

VeanUI 将文本域拆分为负责状态、自动高度测量与表单代理的 Aria 层（`@vean/aria/textarea`），以及负责变体与 UnoCSS 样式的 styled 层（`@vean/ui`）。Aria `TextareaCompact` 组合 `TextareaRoot` / `TextareaControl` / `TextareaClear` / `TextareaCounter` 并暴露 `clear` / `counter` / `footer` 插槽。这与 Radix 的 headless/styled 分离一致，区别于 Ant Design、Element Plus、Mantine 等单包方案。

| 能力                   | VeanUI | Ant Design `Input.TextArea` | Element Plus `Input` | Mantine `Textarea` |
| :--------------------- | :----: | :-------------------------: | :------------------: | :----------------: |
| Aria/styled 分离       |   ✅   |              —              |          —           |         —          |
| 受控/非受控            |   ✅   |             ✅              |          ✅          |         ✅         |
| autosize（min/max 行） |   ✅   |             ✅              |          ✅          |         ✅         |
| 清除按钮（悬停显示）   |   ✅   |              —              |          ✅          |         —          |
| 字符计数器 `count/max` |   ✅   |             ✅              |          ✅          |         —          |
| `resize` 控制          |   ✅   |              —              |          ✅          |         ✅         |
| 原生表单代理           |   ✅   |              —              |          —           |         —          |
| `footer` 插槽          |   ✅   |              —              |          —           |         —          |
| `error` 态             |   —    |              —              |          ✅          |         ✅         |

### 注意事项

- autosize 依赖真实布局（`scrollHeight` / `getComputedStyle`），相关行为通过浏览器 e2e 验证，而非 happy-dom 单测。
- `error` 态、`loading` 态、`showCount`、IME 组合事件与 `change` 事件未实现，列为增强待办。
- 计数器本身不做 `aria-live` 播报；如需实时播报，可在 `counter` 插槽内自行添加 `aria-live` 区域。

## 常见问题

### 如何让文本域随内容自动增高？

传入 `autosize`（布尔值）或 `autosizeOptions`（含 `minRows` / `maxRows`）。高度会在输入时自动调整，到达 `maxRows` 后切换为 `overflow-y: auto`。

### 如何显示字符计数器？

传入 `showCounter`：配合 `maxlength` 显示 `count / maxlength`，不传 `maxlength` 则显示原始计数。可通过 `counter` 插槽自定义呈现。

### 如何控制缩放？

使用 `resize` 属性（`none` / `vertical` / `horizontal`）。`autosize` 启用时 `resize` 被忽略，因为高度由组件自动管理。

### 文本域如何参与原生表单提交？

传入 `name` 即可——组件会渲染一个携带当前值的视觉隐藏代理输入框，原生表单提交无需额外接线。
