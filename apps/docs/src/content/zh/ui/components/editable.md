---
head:
  title: 可编辑文本
  description: '用于在预览态与编辑态之间切换的内联文本编辑组件。预览态以可聚焦文本呈现（或占位符），聚焦/双击/点击编辑按钮后切换为编辑态，提交（回车/blur/提交按钮）或取消（Esc/取消按钮）后回到预览态。采用 Aria 核心 + 样式封装的结构：@vean/aria 中的 EditableRoot 等 8 个组件（零样式）实现完整状态机，SEditable 封装注入 editableVariants 样式（8 个插槽：root/area/preview/input/controls/editTrigger/submitTrigger/cancelTrigger）。'
---

# 可编辑文本

## 概述

用于在预览态与编辑态之间切换的内联文本编辑组件。预览态以可聚焦文本呈现（或占位符），聚焦/双击/点击编辑按钮后切换为编辑态，提交（回车/blur/提交按钮）或取消（Esc/取消按钮）后回到预览态。采用 Aria 核心 + 样式封装的结构：`@vean/aria` 中的 `EditableRoot` 等 8 个组件（零样式）实现完整状态机，`SEditable` 封装注入 `editableVariants` 样式（8 个插槽：root/area/preview/input/controls/editTrigger/submitTrigger/cancelTrigger）。

## 用法

<UsageCode component="editable" />

## 特性

- 🔀 双态状态机 —— 预览（preview）/编辑（edit）切换，`update:state` 事件上报 `edit` / `submit` / `cancel`
- 🖱️ 多种激活方式 —— `activationMode`：`focus`（聚焦激活，默认）、`dblclick`（双击激活）、`none`（仅经编辑按钮或 `edit()` 激活）
- ⌨️ 多种提交方式 —— `submitMode`：`blur`（失焦提交，默认）、`enter`（回车提交）、`both`、`none`（失焦仅取消）；Esc 始终取消
- 🔁 受控/非受控 —— `modelValue` + `update:modelValue` 受控，`defaultValue` 非受控；`submit` 事件携带提交值
- 🎛️ 编辑体验 —— `selectOnFocus`（聚焦全选）、`startWithEditMode`（挂载即编辑）、`maxLength`、`autoResize`（inline-grid 自适应宽度）
- 🧩 Aria/styled 分离 —— `EditableCompact` 聚合 8 个原语并暴露 6 个 `*Props` 通道（area/preview/input/editTrigger/submitTrigger/cancelTrigger）
- ♿ 无障碍 —— 预览态 `tabindex="0"` 可聚焦、完整键盘操作（Enter 提交 / Esc 取消）、触发按钮本地化 `aria-label`、输入与表单的隐藏代理（`VisuallyHiddenInput`）
- 🎨 8 槽样式定制 —— root/area/preview/input/controls/editTrigger/submitTrigger/cancelTrigger + `size` 变体（xs~2xl）

## 组件家族

- `SEditable`（styled）—— 入口封装；纯 `defineProps` + `editableVariants`，8 槽动态转发，`useForwardListeners` 合并事件
- `EditableRoot`（Aria）—— 状态机属主：持有 `modelValue`/`inputValue`/`isEditing`/`placeholder`/`isEmpty`，暴露 `edit`/`cancel`/`submit`；渲染 `data-dismissable-layer` 处理失焦/外部点击；表单内（`.form`）且传 `name` 时渲染隐藏输入代理
- `EditableArea`（Aria）—— 区域容器；`autoResize` 时以 inline-grid 布局自适应输入宽度
- `EditablePreview`（Aria）—— 预览文本；`tabindex = disabled ? -1 : 0`，focusin/dblclick 触发激活
- `EditableInput`（Aria）—— 真实输入；激活/取消/提交键盘处理，`selectOnFocus` 聚焦全选
- `EditableEditTrigger` / `EditableSubmitTrigger` / `EditableCancelTrigger`（Aria）—— Button 基座触发按钮；`aria-label` 回退到 `useLocaleMessages` 本地化消息；`disabled || readonly` 时禁用
- `EditableCompact`（Aria）—— 聚合根/区/预览/输入/三触发按钮的复合组件，slot props 提供 `modelValue`/`inputValue`/`isEditing`/`isEmpty`/`edit`/`cancel`/`submit`

## 演示

<PlaygroundGallery component="editable" />

- 01 基础 —— 受控 `v-model` + placeholder + `submit` / `update:state` 事件
- 02 尺寸 —— `size` 变体
- 03 禁用 —— `disabled`
- 04 激活模式 —— `focus` 与 `dblclick`
- 05 自定义样式 —— 8 槽 `ui` 定制

## API

<ComponentApi component="editable" />

## 备注

### 架构与竞品差异

`EditableRoot` 用 `useControllableState` 统一受控/非受控；`inputValue`（编辑缓冲）与 `modelValue`（提交值）分离，`currentValue` 按状态取其一。编辑态下外部 `modelValue` 推送不会覆盖正在输入的内容（提交/取消时才回写），避免受控父组件更新打断输入。激活（focus/dblclick/edit trigger）与提交（blur/enter/提交按钮）双向解耦，`useFocusOutside`/`usePointerdownOutside` 以 `isEditing` 为门控实现失焦提交。`autoResize` 用 inline-grid + `grid-template-columns: auto` 让输入框贴内容宽度。与 reka-ui `Editable` 同源设计（激活/提交模式、`selectOnFocus`、`startWithEditMode`、表单代理一应俱全）；Ant Design 的 `Typography` editable 仅按钮激活 + 受控 editing；Element Plus 与 shadcn/ui 无对应组件；Mantine `EditableText` 覆盖激活/提交的子集。

| 能力                             | VeanUI | reka-ui | Ant Design Typography | Mantine EditableText | Element Plus | shadcn/ui |
| :------------------------------- | :----: | :-----: | :-------------------: | :------------------: | :----------: | :-------: |
| Aria/styled 分离                 |   ✅   |   ✅    |           —           |          —           |      —       |     —     |
| 激活模式（focus/dblclick/none）  |   ✅   |   ✅    |           —           |          ⚠️          |      —       |     —     |
| 提交模式（blur/enter/none/both） |   ✅   |   ✅    |           —           |          ⚠️          |      —       |     —     |
| Esc 取消                         |   ✅   |   ✅    |          ⚠️           |          ✅          |      —       |     —     |
| `selectOnFocus`                  |   ✅   |   ✅    |           —           |          ✅          |      —       |     —     |
| `startWithEditMode`              |   ✅   |   ✅    |          ⚠️           |          ✅          |      —       |     —     |
| `autoResize`（自适应宽度）       |   ✅   |   ✅    |           —           |          —           |      —       |     —     |
| 表单代理（name + form 隐藏输入） |   ✅   |   ✅    |           —           |          —           |      —       |     —     |
| 触发按钮本地化 `aria-label`      |   ✅   |   ⚠️    |           —           |          —           |      —       |     —     |
| 受控/非受控 + 提交事件           |   ✅   |   ✅    |          ✅           |          ✅          |      —       |     —     |

`⚠️` = 部分支持（Mantine 经 `activateOnFocus`/`submitOnBlur` 覆盖激活与提交子集；AntD 经受控 `editing` 覆盖 `startWithEditMode` 类行为；reka-ui 触发按钮 `aria-label` 硬编码，VeanUI 用 `useLocaleMessages` 本地化）。

### 注意事项

- 编辑态下外部受控更新不会覆盖输入内容：`modelValue` 的推送不会写入正在编辑的缓冲，输入在提交/取消时统一回写——避免受控场景下「打字被覆盖」；非编辑态仍保持同步。
- blur 提交依赖焦点移出组件根：`useFocusOutside` 监听 document `focusin`，焦点移到组件外才触发 `submitMode` 逻辑；`submitMode: 'none'` 时失焦仅取消。
- 表单集成：只有当组件位于带 `.form` class 的容器内（`isFormControl` 判定）且传入 `name` 时才渲染 `VisuallyHiddenInput` 代理，值随表单提交；否则不会输出隐藏输入。
- `placeholder` 支持字符串或 `{ edit, preview }` 对象——可分别指定编辑态与预览态占位文案。
- `readonly` 与 `disabled` 有别：`readonly` 阻止进入编辑（`edit()` 守卫 + 触发按钮禁用 + 输入只读），但不改变值本身；`disabled` 额外禁用预览聚焦与隐藏代理。
- 自定义 `preview` 插槽时默认无 `tabindex`——需自行提供可聚焦元素或改由 `EditableEditTrigger` 激活。
- `activationMode: 'none'` 时聚焦不会进入编辑——必须经编辑按钮或暴露的 `edit()`（`defineExpose`）激活。
- 受控场景请监听 `submit` 取最终提交值（回车/blur/提交按钮路径一致），`update:modelValue` 在提交时同步触发。

## 常见问题

### 如何改为双击激活而不是聚焦激活？

设置 `activationMode="dblclick"`：

```vue
<SEditable activation-mode="dblclick" default-value="双击编辑" />
```

### 如何让失焦取消而不是提交？

设置 `submitMode="none"`——失焦时执行 `cancel()`（不触发 `submit`/`update:modelValue`），仅 Esc 可取消，回车仍提交：

```vue
<SEditable submit-mode="none" default-value="失焦取消" />
```

### 如何用按钮显式触发编辑？

使用 `EditableEditTrigger`（Aria 复合下可直接声明），或通过 `ref` 调用暴露方法：

```vue
<SEditable ref="editableRef" default-value="按钮编辑" />
<button @click="editableRef?.edit()">编辑</button>
```

### 如何拿到编辑提交后的值？

监听 `submit` 事件（与 `update:modelValue` 同步触发）：

```vue
<SEditable v-model="value" @submit="onSubmit" />
```

```ts
function onSubmit(value: string) {
  // 提交后的最终值
}
```

### 如何让输入框随内容自适应宽度？

设置 `autoResize`——输入容器以 inline-grid 布局，宽度跟随内容：

```vue
<SEditable auto-resize default-value="自适应宽度" />
```

### 如何与原生表单一起提交？

将组件放入带 `.form` class 的表单容器并传入 `name`，组件渲染隐藏输入代理随表单提交：

```vue
<form class="form" @submit.prevent>
  <SEditable name="nickname" default-value="昵称" />
  <button type="submit">提交</button>
</form>
```

### 如何在编辑开始时全选文本？

设置 `selectOnFocus`——进入编辑后聚焦输入并全选既有内容，便于直接覆盖：

```vue
<SEditable select-on-focus default-value="聚焦全选" />
```
