---
head:
  title: 标签输入
  description: '用于输入、展示和删除多个标签值的组合式多值输入组件。支持受控/非受控的 string[] 值、通过 Enter/Tab/失焦/分隔符输入/粘贴创建标签、完整的键盘选中与删除（含 RTL 反转）、max/duplicate 约束以及隐藏表单输入序列化。适用于关键词列表、邮件收件人等需要快速键盘操作而非纯文本输入的小型标记集合场景。'
---

# 标签输入

## 概述

用于输入、展示和删除多个标签值的组合式多值输入组件。支持受控/非受控的 `string[]` 值、通过 `Enter`/`Tab`/失焦/分隔符输入/粘贴创建标签、完整的键盘选中与删除（含 RTL 反转）、`max`/`duplicate` 约束以及隐藏表单输入序列化。适用于关键词列表、邮件收件人等需要快速键盘操作而非纯文本输入的小型标记集合场景。

## 用法

<UsageCode component="tags-input" />

## 特性

- 🏷 标签模型 — 经 `useControllableState` 支持受控/非受控 `string[]`；清空事件 + 逐动作的 `addTag`/`removeTag` 事件
- ⌨️ 完整键盘支持 — `ArrowLeft`/`ArrowRight` 选中相邻标签（逻辑方向，RTL 反转），`Backspace`/`Delete` 删除选中标签，`Home`/`End` 跳转首/末标签，输入即取消选中
- ✂️ 分隔符与粘贴 — 输入分隔符（字符串或 `RegExp`）时提交已输入内容，或对粘贴文本按分隔符拆分（`addOnPaste`）
- ⏎ 提交触发 — `Enter` 始终提交；`Tab` 与失焦仅在开启 `addOnTab`/`addOnBlur` 时提交
- 🚦 约束 — `max` 限制总数，`duplicate` 允许重复值，`displayValue` 改写标签文案；被拒绝的值触发 `invalid` 事件
- 🧩 可组合部件 — `Root`/`Control`/`Item`/`ItemText`/`ItemDelete`/`Clear`，compact 支持 `*Props` 透传与可完全替换的 `item` 插槽
- 📋 表单集成 — `name`/`required`/`disabled` 经视觉隐藏输入序列化；`aria-controls` 将输入与标签列表容器关联
- 🔤 本地化 UI — 默认 `aria-label` 来自 locale 文案，且每个部件均可覆盖
- 🚫 禁用 / 只读 — `disabled` 阻止全部交互；`readonly` 阻止输入但保留标签删除与清空

## 组件家族

- `STagsInput` — 样式包装层，将 props 转发给 Aria compact 并注入 `tagsInputVariants` 类（6 个 slot：root/item/itemText/itemDelete/control/clear）
- `TagsInputCompact`（Aria）— `TagsInputRoot` + 每个值一个 `TagsInputItem`（默认 item 文本/删除）+ `Control` + `Clear`（由 `clearable` 门控）的数据驱动组合；无样式用法从 `@vean/aria/tags-input` 导入
- `TagsInputRoot`（Aria）— 状态所有者：`useControllableState` 管理值数组、集合注册、键盘/删除/清空逻辑与视觉隐藏表单输入
- `TagsInputControl`（Aria）— 提交型输入：分隔符输入、粘贴拆分、`Enter`/`Tab`/失焦提交、输入法组合保护
- `TagsInputItem` / `TagsInputItemText` / `TagsInputItemDelete`（Aria）— 注册到集合的标签项、其文本 span 与可键盘操作的删除按钮
- `TagsInputClear`（Aria）— 清空按钮，默认样式在根组件有值时显示，渲染由 `clearable` 门控

## 演示

<PlaygroundGallery component="tags-input" />

## API

<ComponentApi component="tags-input" />

## 注意事项

### 架构与对标差异

`TagsInputRoot` 经 `useControllableState` 持有值数组与集合注册表（每个 `Item` 通过 `useCollectionItem` 注册）。`TagsInputControl` 只负责提交：监听分隔符/粘贴/Enter/Tab/失焦，经根组件的 `onAddValue` 校验并归一化，被拒绝时通过 `invalid` 事件上报。键盘选中状态（`selectedElement`）位于根组件，控制层的 keydown 处理器据此用方向键移动选中（逻辑方向，RTL 感知）并用 `Backspace`/`Delete`/`Home`/`End` 删除标签。compact 以 `index-value` 键迭代值数组，使重复值保持稳定且避免原地值修补。多数对标库把标签作为某个 Select 的一种模式提供；Aria/styled 分离、逐部件 `*Props` 透传、插槽驱动的标签渲染以及 `invalid`/`addTag`/`removeTag` 事件面是本组件的差异点。

| 能力                      | VeanUI | Ant Design | Element Plus | Mantine | Naive UI | shadcn |
| :------------------------ | :----: | :--------: | :----------: | :-----: | :------: | :----: |
| Aria/styled 分离          |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 受控 / 非受控             |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| Enter / 分隔符 / 粘贴添加 |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   ✅   |
| 键盘选中 + 删除           |   ✅   |     —      |      —       |   ✅    |    —     |   —    |
| RTL 方向反转              |   ✅   |     —      |      —       |    —    |    —     |   —    |
| `max` / `duplicate` 约束  |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |
| `RegExp` 分隔符           |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 逐部件 `*Props` 透传      |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 自定义标签插槽            |   ✅   |     ✅     |      ✅      |   ✅    |    —     |   ✅   |
| 表单隐藏输入序列化        |   ✅   |     —      |      —       |    —    |    —     |   —    |
| 本地化 `aria-label`       |   ✅   |     ✅     |      ✅      |   ✅    |    ✅    |   —    |

### 注意事项

- 值始终是 `string[]`；除非设置 `duplicate`，否则重复值会被拒绝。`displayValue` 只改标签文案——存储值保持原始字符串。
- `max={0}` 表示不限制；任何正数都会限制数量，被拒绝的添加以尝试值触发 `invalid` 事件。
- `addOnBlur` 会在失焦时提交待输入文本，但落在标签列表内删除/清空按钮上的失焦会被跳过（经 `aria-controls` 守卫）。
- `addOnTab` 会阻止默认的 Tab 移出并改为提交；若需离开字段请关闭该选项或改为失焦提交。
- compact 在 `clearable` 不为 `false` 时渲染清空触发器；默认样式在根组件有值前将其隐藏。
- 受控模式（绑定 `modelValue`）下，父级必须更新绑定的数组——组件只触发 `update:modelValue`。
- `readonly` 保持输入只读但允许标签删除与清空；需要完全禁止交互请使用 `disabled`。
- 输入的 `aria-controls` 指向派生的标签列表容器 id（`{id}-tags-list`）；传入 `id` 可启用失焦守卫与表单 label 关联。

## 常见问题

### 如何只在 Enter 时添加标签？

默认即如此——输入值后按 `Enter`。`Tab`/失焦只有在开启 `addOnTab`/`addOnBlur` 时才提交。

### 如何让用户一次粘贴多个标签？

开启 `addOnPaste` 并保持默认 `delimiter=","`——粘贴 `"a,b,c"` 会创建三个标签。需要灵活拆分时使用 `RegExp` 分隔符，例如 `:delimiter="/[,，]/"`。

### 如何禁止重复标签？

重复值默认被拒绝并触发 `invalid` 事件（携带被拒绝的值）。传入 `duplicate` 可允许重复（compact 按位置为每项设键，重复项保持稳定）。

### 值如何进入表单提交？

设置 `name` 后，值序列化为视觉隐藏输入（每标签一个）。配合 `required`，空标签列表会将控件标记为无效。

### 为什么受控值没有更新？

受控模式下组件只触发 `update:modelValue`；必须重新绑定（如 `v-model`）使 prop 变化，否则 UI 停留在之前的数组上。
