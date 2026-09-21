---
head:
  title: 标签
  description: 'SLabel 组件渲染原生 <label> 元素，为表单控件提供无障碍标题。通过 for prop 将标签与输入框的 id 关联——点击标签即可聚焦关联控件。组件在双击时阻止文本选中以提供更干净的交互体验，并支持设计系统的尺寸缩放。'
---

# 标签

## 概述

`SLabel` 组件渲染原生 `<label>` 元素，为表单控件提供无障碍标题。通过 `for` prop 将标签与输入框的 `id` 关联——点击标签即可聚焦关联控件。组件在双击时阻止文本选中以提供更干净的交互体验，并支持设计系统的尺寸缩放。

## 用法

<UsageCode component="label" />

## 功能

- 🏷️ **原生 `<label>`** — 使用语义正确的 HTML 元素作为表单标签。
- 🔗 **`for` 关联** — 传入 `for="input-id"` 将标签链接到表单控件；点击标签即可聚焦控件。
- 📐 **尺寸缩放** — 六档尺寸（`xs`–`2xl`）控制标签字号。
- 🖱️ **阻止选中** — 双击标签不会选中文本，避免与关联输入框交互时的误选。
- ♿ **无障碍** — 原生 `<label>` 天然无障碍；`peer-disabled` 样式在关联控件禁用时降低标签透明度。
- 🎨 **类名覆盖** — `class` prop 支持在变体默认值之上自定义样式。

## 演示

<PlaygroundGallery component="label" />

## API

<ComponentApi component="label" />

## 注意事项

### 架构与对标差异

VeanUI 将 `Label` 拆分为 Aria 层（`@vean/aria/label`，负责 `<label>` 元素、`for` 关联、双击阻止文本选中）与 styled 层（`@vean/ui`，负责 `cv()` 变体配方（size））。这与 shadcn/ui 的 headless/styled 分离一致，后者源自 Radix UI 的 Label 原语。

| 维度           | VeanUI                        | shadcn/ui `Label` | Ant Design `Form.Label` | Element Plus `FormLabel` | MUI `InputLabel` |
| :------------- | :---------------------------- | :---------------- | :---------------------- | :----------------------- | :--------------- |
| 架构           | Aria + styled 分离            | Aria + styled     | 表单耦合                | 表单耦合                 | 仅 styled        |
| 原生 `<label>` | ✅                            | ✅                | ✅（Form 内）           | ✅（Form 内）            | ✅               |
| `for` 关联     | ✅ 独立使用                   | ✅ 独立使用       | Form 自动关联           | Form 自动关联            | Form 自动关联    |
| 尺寸缩放       | `xs`–`2xl`                    | —                 | —                       | —                        | `size`           |
| 阻止双击选中   | ✅ `mousedown` + `detail > 1` | ✅                | —                       | —                        | —                |
| 禁用态样式     | `peer-disabled:opacity-50`    | ✅                | —                       | —                        | —                |

### 运行时注意事项

- **独立使用**：与 Ant Design 和 Element Plus 中标签与 `<Form>` 耦合不同，`SLabel` 可独立使用——传入 `for="input-id"` 即可关联任意输入框。这与 shadcn/ui 的模式一致。
- **禁用状态**：标签使用 `peer-disabled:opacity-50` 在同级输入框禁用时视觉变暗。要生效，输入框必须是带有 `peer` 类和 `disabled` 属性的同级元素。
- **双击**：`mousedown` 处理器在 `event.detail > 1`（双击）时调用 `event.preventDefault()`。这阻止文本选中但不干扰单击或标签到输入框的聚焦行为。

### 常见问题

**如何将标签关联到输入框？**
将输入框的 `id` 传给标签的 `for` prop：`<SLabel for="email">Email</SLabel>` 然后 `<SInput id="email" />`。点击标签会聚焦输入框。

**可以在表单中不带 `for` 使用 `SLabel` 吗？**
可以。如果将输入框包裹在标签内（`<SLabel>Email <SInput /></SLabel>`），浏览器会自动关联它们。`for` prop 仅在标签和输入框为同级元素时需要。

**为什么输入框禁用时标签变暗？**
基础类包含 `peer-disabled:opacity-50`。当同级输入框（带 `peer` 类）禁用时，标签透明度降为 50%。这是 shadcn/ui 的 UX 约定。

**如何取消双击阻止选中的行为？**
阻止选中逻辑内置于 Aria 层。如需标准文本选中行为，直接使用 Aria `Label` 并省略 `@mousedown` 处理器，或在自定义 wrapper 中覆盖。
