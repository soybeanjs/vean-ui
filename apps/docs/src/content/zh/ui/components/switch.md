---
head:
  title: 开关
  description: 一种带滑动拇指、内建原生表单集成的开关控件，用于在选中与未选中之间切换。适用于立即生效的单一二元设置（如深色模式、消息通知）；当选项属于需要显式提交的表单时，优先考虑 SCheckbox；当需要多选时请改用复选框组。
---

# 开关

## 概述

一种带滑动拇指、内建原生表单集成的开关控件，用于在选中与未选中之间切换。适用于立即生效的单一二元设置（如深色模式、消息通知）；当选项属于需要显式提交的表单时，优先考虑 `SCheckbox`；当需要多选时请改用复选框组。

## 用法

<UsageCode component="switch" />

## 特性

- 🎚 `modelValue` / `defaultValue` —— 基于 `useControllableState` 的受控与非受控双模式
- 🅰 自定义值 —— `trueValue` / `falseValue` 支持布尔、字符串或数字
- ⌨️ 键盘可操作 —— Enter 与 Space 均可切换开关（原生 button 行为）
- ♿ `role="switch"` + `aria-checked` / `data-state` 双通道反射，axe 零违规
- 📋 原生表单代理 —— 隐藏的复选框 input 携带 `name` / `required` / `value`
- 🎨 6 种尺寸、8 种颜色与圆角/直角两种形态（`switchVariants`）
- 🧩 `leading` / `trailing` / 默认（thumb）插槽，可放置标签与图标
- ↔ RTL 感知的拇指动画，由 `dir` 驱动

## 演示

<PlaygroundGallery component="switch" />

## API

<ComponentApi component="switch" />

## 注意事项

### 架构与对标差异

VeanUI 由 Aria 的 `SwitchRoot`（`useControllableState` + `VisuallyHiddenInput` 表单代理）→ `SwitchControl`（`Button` 基座 + `role="switch"` + `aria-checked`/`data-state`，禁用守卫）→ `SwitchThumb`（`Primitive` + `data-state`/`data-disabled`）组成。`SwitchCompact` 聚合 root + control + thumb，持有 `leading`/`trailing` 插槽并生成控件 id；UI 包装器 `SSwitch` 仅通过 `switchVariants` 计算变体类并经由 `provideSwitchUi` 注入 `ui` 映射。

| 能力                             | VeanUI | Ant Design `Switch` | Element Plus `Switch` | Mantine `Switch` | Naive UI `Switch` | shadcn `Switch` |
| :------------------------------- | :----: | :-----------------: | :-------------------: | :--------------: | :---------------: | :-------------: |
| Aria/styled 分离                 |   ✅   |          —          |           —           |        —         |         —         |       ✅        |
| 受控/非受控                      |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| 自定义开/关值                    |   ✅   |         ✅          |          ✅           |        —         |        ✅         |       ✅        |
| leading/trailing 插槽            |   ✅   |          —          |          ✅           |        ✅        |         —         |        —        |
| `loading` 状态                   |   ➕   |         ✅          |          ✅           |        ✅        |        ✅         |        —        |
| 内联标签（`onLabel`/`offLabel`） |   ➕   |          —          |          ✅           |        ✅        |         —         |        —        |
| `beforeChange` 钩子              |   ➕   |          —          |          ✅           |        —         |         —         |        —        |
| 表单代理 / `name` 提交           |   ✅   |         ✅          |          ✅           |        ✅        |        ✅         |       ✅        |
| axe 零违规                       |   ✅   |          —          |           —           |        —         |         —         |        —        |

### 运行约束

- 控件是 `<button role="switch">` —— 独立使用时请通过 `controlProps`（`aria-label`）或可见标签提供可访问名称。
- `trueValue` / `falseValue` 不允许为 nullish，运行时守卫会抛出错误。
- 隐藏 input 在选中时提交 `value`（默认 `'on'`），与 `trueValue` 相互独立。
- 表单代理仅在 `form` 类根节点且设置 `name` 时渲染；请配合原生 `<form>` 或 `SForm` 集成使用。

## 常见问题

### 受控还是非受控？

传入 `modelValue` 配合 `v-model` 即为受控值；传入 `defaultValue` 则让开关内部自行维护状态。两种模式均由 `useControllableState` 支持。

### 可以使用非布尔值吗？

可以 —— 将 `trueValue` / `falseValue` 设为任意字符串或数字（如 `'on'` / `'off'`）；`aria-checked` 与 `data-state` 依据与 `trueValue` 的比较结果反映状态。

### 如何在开关旁边添加标签？

使用 `leading` / `trailing` 插槽，或用原生 `<label>` 关联控件 `id`。

### 开关如何在表单中提交值？

为开关设置 `name`；在 `form` 类根节点下会渲染隐藏的复选框 input，开关选中时携带提交值 `value`。
