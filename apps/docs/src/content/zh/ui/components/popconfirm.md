---
head:
  title: 气泡确认框
  description: 基于 Popper 的确认框组件，用于轻量级的二次确认操作。SPopconfirm 组合 Aria PopconfirmCompact（构建于 popper 基础组件之上）与 popconfirmVariants 样式配方（13 个槽、6 种尺寸 × 4 种类型）。
---

# 气泡确认框

## 概述

基于 `Popper` 的确认框组件，用于轻量级的二次确认操作。`SPopconfirm` 组合 Aria `PopconfirmCompact`（构建于 popper 基础组件之上）与 `popconfirmVariants` 样式配方（13 个槽、6 种尺寸 × 4 种类型）。

适用于触发器旁快速的内联确认（删除、破坏性操作）。更丰富的阻塞性确认请用 `dialog`；不打扰的提示请用 `tooltip`。

## 用法

<UsageCode component="popconfirm" />

## 特性

- 🧩 基于 `Popper` — 继承定位、箭头、portal、可关闭与焦点行为
- 🎨 4 种类型 — `type="error"`/`"success"`/`"warning"`/`"info"` 驱动前导图标与颜色
- 🏷️ 标题 + 描述 + 内容 — `title`/`description`/`content` prop 或对应插槽
- 🔘 确认/取消 — `confirmText`/`cancelText`（取自 `dialog.confirm`/`dialog.cancel` 本地化消息）；`showCancel` 默认 `onlyWarning`
- 🖼️ 图标开关 — `showIcon` 渲染类型图标；`showArrow` 渲染 popper 箭头
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- ♿ 无障碍 — 弹层暴露由触发器标注的 `role="dialog"`、焦点管理、浏览器 e2e 中 `axe-core` 零违规
- 🔒 禁用 — `disabled` 阻止触发器打开气泡确认框

## 组件家族

- `SPopconfirm`（样式层）— 入口包装组件；`popconfirmVariants` 配方配合动态插槽转发
- `PopconfirmCompact`（Aria）— 构建于 `PopperRoot`/`PopperTrigger`/`PopperPositioner`/`PopperPopup` 之上的聚合组件
- `PopconfirmHeader` / `PopconfirmContent` / `PopconfirmFooter`（Aria）— 布局分区
- `PopconfirmTitle` / `PopconfirmDescription`（Aria）— 标题/描述
- `PopconfirmConfirm` / `PopconfirmCancel`（Aria）— 底部 `<button>`，发出 `confirm`/`cancel`

## 演示

<PlaygroundGallery component="popconfirm" />

## API

<ComponentApi component="popconfirm" />

## 注意事项

### 架构与对标差异

`PopconfirmCompact` 组合 popper 触发器/定位器/弹层与确认式头部、内容、底部，所有基础组件保持零样式，仅由 UI 包装组件注入 `popconfirmVariants` 类。这与 radix-ui/shadcn-ui 的 headless 分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供带 `title`/`description`/`okText`/`cancelText`/`onConfirm` prop 的单一样式化气泡确认框；VeanUI 额外暴露逐槽 `*Props`、`size` 尺寸体系、`type` 颜色/图标系统与本地化操作标签。

| 能力            | VeanUI | shadcn/ui | Ant Design Popconfirm | Element Plus Popconfirm | Mantine Popconfirm | Naive UI Popconfirm |
| :-------------- | :----: | :-------: | :-------------------: | :---------------------: | :----------------: | :-----------------: |
| 基于 Popper     |   ✅   |    ✅     |           —           |            —            |         —          |          —          |
| Aria/样式分离   |   ✅   |    ✅     |           —           |            —            |         —          |          —          |
| 类型图标 + 颜色 |   ✅   |     —     |           —           |           ✅            |         —          |          —          |
| 标题 + 描述     |   ✅   |    ✅     |          ✅           |           ✅            |         ✅         |         ✅          |
| 本地化确认/取消 |   ✅   |     —     |           —           |            —            |         —          |          —          |
| 尺寸（6）       |   ✅   |     —     |           —           |            —            |         —          |          —          |
| 定位（popper）  |   ✅   |    ✅     |          ✅           |           ✅            |         ✅         |         ✅          |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `modal` 默认 `false`（与 dialog 不同），因此不阻塞外部交互、不锁定 body 滚动。
- `showCancel` 默认 `'onlyWarning'` — 仅 `type="warning"` 时显示取消按钮。传显式布尔值可覆盖。
- `confirmText`/`cancelText` 默认取 `dialog.confirm`/`dialog.cancel` 的本地化消息；可按实例覆盖。
- 弹层渲染 `role="dialog"` 并由触发器标注；请提供 `title` 以使对话框有清晰的可访问名称。
- 确认/取消发出 `confirm`/`cancel` 事件；任一操作后弹层关闭（受父级自己的 `beforeClose` 处理影响）。

### Roadmap

不适用——popconfirm 对当前对标集已功能完备。

## FAQ

### 如何显示标题、描述与内容？

传入 `title`/`description`/`content` prop 或对应插槽：

```vue
<SPopconfirm title="删除该项？" description="此操作无法撤销。" content="请先确认再继续。">
  <template #trigger><SButton danger>删除</SButton></template>
</SPopconfirm>
```

### 如何设置类型与图标？

使用 `type`（`error`/`success`/`warning`/`info`）并切换 `show-icon`：

```vue
<SPopconfirm type="warning" title="请注意">
  <template #trigger><SButton>删除</SButton></template>
</SPopconfirm>
```

### 如何自定义操作标签？

设置 `confirm-text`/`cancel-text`，并用 `show-cancel` 控制取消按钮：

```vue
<SPopconfirm confirm-text="删除" cancel-text="保留" :show-cancel="true" title="确认">
  <template #trigger><SButton>删除</SButton></template>
</SPopconfirm>
```

### 如何控制打开状态？

用 `v-model` 绑定 `open` 或使用 `defaultOpen`：

```vue
<SPopconfirm v-model:open="open" title="确认">
  <template #trigger><SButton>删除</SButton></template>
</SPopconfirm>
```

### 如何禁用触发器？

设置 `disabled` 以阻止打开：

```vue
<SPopconfirm disabled title="确认">
  <template #trigger><SButton>删除</SButton></template>
</SPopconfirm>
```
