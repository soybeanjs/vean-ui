---
head:
  title: 对话框
  description: 覆盖在主窗口或其他对话框之上、并使其下层内容失效的窗口。
---

# 对话框

## 概述

覆盖在主窗口或其他对话框之上、并使其下层内容失效的窗口。

`SDialog` 是用于内联场景的声明式包装组件。`dialog(...)` 是用于以编程方式创建警告式对话框的命令式 API。它组合 `DialogRoot`/`DialogTrigger`/`DialogOverlay`/`DialogPopup`/`DialogHeader`/`DialogContent`/`DialogFooter`/`DialogTitle`/`DialogDescription`/`DialogClose`/`DialogFullscreen`/`DialogCancel`/`DialogConfirm` 这一系列 Aria 基础组件（零样式）与 `dialogVariants` 样式配方（12 个槽、6 种尺寸）。

调用命令式 `dialog(...)` API 前，请在应用根部附近挂载一次 `SDialogProvider`。

## 用法

### 声明式

<UsageCode component="dialog" />

### 命令式 API

```vue
<script setup lang="ts">
import { h } from 'vue';
import { SButton, SDialogProvider, dialog } from '@vean/ui';

function openWarningDialog() {
  dialog.warning('删除项目', {
    description: '此操作无法撤销。',
    content: h('div', '请先确认再继续。'),
    confirmText: '删除'
  });
}
</script>

<template>
  <SDialogProvider />

  <SButton color="warning" @click="openWarningDialog">打开对话框</SButton>
</template>
```

## 特性

- 🧩 Aria/样式分离 — `DialogCompact` 聚合基础组件并组合遮罩/弹层/头部/内容/底部；`SDialog` 只注入样式并转发插槽/事件
- 🖱️ 声明式 + 命令式 — 带触发器的内联 `SDialog`，或由 `SDialogProvider` 驱动的 `dialog.*` API
- 🎭 默认模态 — `modal` 渲染 `aria-modal`、`useHideOthers`、外部指针拦截与焦点陷阱；用 `modal={false}` 切换
- ⚠️ 警告模式 — `isAlert` 切换为 `role="alertdialog"`，并加入类型图标与 `aria-live`（`polite`/`assertive`）
- 🏷️ 无障碍标题/描述 — `title`/`description` 连接 `aria-labelledby`/`aria-describedby`
- ❌ 可关闭 — `showClose` 渲染关闭控件；Escape、外部指针/焦点与关闭按钮均可关闭
- 🖐️ 可拖拽 — `draggable` 支持拖动头部移动对话框（基于 `@vueuse/core` 的 `useDraggable`）
- ⛶ 全屏 — `showFullscreen` 渲染切换按钮；`fullscreen`/`defaultFullscreen` 驱动 `v-model:fullscreen` 状态
- 🔘 取消/确认 — `showCancel`/`showConfirm`，`cancelText`/`confirmText` 取自 `dialog.cancel`/`dialog.confirm` 本地化消息
- 🧹 纯净模式 — `pure` 移除头部与底部，用于完全自定义内容
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- ♿ 无障碍 — 真实 `role="dialog"`、焦点陷阱 + 循环、关闭时焦点还原、`axe-core` 零违规

## 组件家族

- `SDialog`（样式层）— 入口包装组件；`dialogVariants` 配方配合动态插槽转发
- `SDialogProvider`（样式层）— 承载命令式 `dialog(...)` API；订阅 `DialogState`
- `DialogRoot`（Aria）— 状态持有者；经 `useControllableState` 维护 `open`，提供 `dir`/`modal` 与 `provideDialogRootContext`
- `DialogTrigger`（Aria）— 打开对话框的 `Button`
- `DialogOverlay`（Aria）— 变暗的背景遮罩
- `DialogPopup` / `DialogPopupImpl`（Aria）— 承载对话框主体的可关闭、焦点陷阱表面
- `DialogTitle` / `DialogDescription`（Aria）— 用于标注/描述的元素
- `DialogClose`（Aria）— 关闭控件，切换 `open` 并发出 `close`
- `DialogFullscreen`（Aria）— 全屏切换按钮，切换 `fullscreen` 状态并发出 `fullscreen`
- `DialogCancel` / `DialogConfirm`（Aria）— 底部操作，发出 `cancel`/`confirm`
- `DialogHeader` / `DialogContent` / `DialogFooter`（Aria）— 布局分区
- `DialogCompact`（Aria）— 聚合组件；组合所有基础组件并暴露各分区插槽

## 演示

<PlaygroundGallery component="dialog" />

## API

<ComponentApi component="dialog" />

## 注意事项

### 架构与对标差异

`DialogCompact` 负责遮罩/弹层/头部/内容/底部组合与命令式 `dialog(...)` 状态流，所有基础组件保持零样式，仅由 UI 包装组件注入 `dialogVariants` 类。这与 radix-ui/shadcn-ui 的 headless/样式分离一致。Ant Design、Element Plus、Mantine、Naive UI 提供带 `mask`/`closable`/`keyboard`/`width` prop 的单一样式化对话框；VeanUI 额外暴露逐槽 `*Props` 通道、`size` 尺寸体系，以及单包库通常收敛为静态服务的命令式 provider API（`dialog.*`）。

| 能力                    | VeanUI | shadcn/ui | Ant Design Modal | Element Plus Dialog | Mantine Modal | Naive UI Dialog |
| :---------------------- | :----: | :-------: | :--------------: | :-----------------: | :-----------: | :-------------: |
| Aria/样式分离           |   ✅   |    ✅     |        —         |          —          |       —       |        —        |
| 命令式 API              |   ✅   |     —     |        ✅        |         ✅          |      ✅       |       ✅        |
| 模态（aria-modal+陷阱） |   ✅   |    ✅     |        ✅        |         ✅          |      ✅       |       ✅        |
| 警告模式（alertdialog） |   ✅   |    ✅     |        ✅        |          —          |       —       |       ✅        |
| 关闭时焦点还原          |   ✅   |    ✅     |        ✅        |         ✅          |      ✅       |       ✅        |
| 尺寸（6）               |   ✅   |     —     |        —         |          —          |       —       |        —        |
| 本地化取消/确认文本     |   ✅   |     —     |        —         |          —          |       —       |        —        |
| 纯净（无头/底部）       |   ✅   |     —     |        —         |          —          |       —       |        —        |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `DialogCompact` 默认 `modal`（`true`）；portal 将弹层传送至 `document.body`，body 滚动由 hide-others 层管理。
- 警告对话框的 `showConfirm` 默认为 `true`；`showCancel` 默认为 `'onlyWarning'`（仅 `alertType="warning"` 时显示取消）。传显式布尔值可覆盖。
- `cancelText`/`confirmText` 默认取 `dialog.cancel`/`dialog.confirm` 的本地化消息；可按实例覆盖。
- `isAlert` 需要提供 `DialogTitle` 以保证无障碍（`role="alertdialog"` 必须被标注）。设置 `title` 或 `title` 插槽。
- `pure` 会移除头部与底部，因此 `title`/`description` 不再渲染——该模式下请自行提供可访问的标注。
- 命令式 `dialog(...)` API 需要挂载 `SDialogProvider`；未挂载时调用为 no-op。

## FAQ

### 如何控制打开状态？

用 `v-model` 绑定 `open`，或传 `defaultOpen` 使用非受控对话框：

```vue
<SDialog v-model:open="open" title="偏好设置">...</SDialog>
```

### 如何显示警告式对话框？

设置 `is-alert` 与 `alert-type`。弹层会获得 `role="alertdialog"` 及对应类型图标：

```vue
<SDialog is-alert alert-type="warning" title="删除" description="此操作无法撤销。">
  <template #trigger><SButton>删除</SButton></template>
</SDialog>
```

### 如何使用命令式 API？

挂载一次 `SDialogProvider`，然后在任意位置调用 `dialog.*`（完整示例见「概述」）：

```ts
import { dialog } from '@vean/ui';
dialog.warning('磁盘已满', { description: '请释放空间。' });
```

### 如何构建完全自定义的对话框？

使用 `pure` 并填充默认插槽：

```vue
<SDialog v-model:open="open" pure>
  <div class="custom">...</div>
</SDialog>
```

### 如何制作非模态对话框？

设置 `modal={false}` 以允许与对话框外部内容交互：

```vue
<SDialog v-model:open="open" :modal="false" title="面板">...</SDialog>
```

### 如何制作可拖拽对话框？

设置 `draggable`，拖动头部即可移动对话框。位置会保持到对话框关闭：

```vue
<SDialog draggable title="面板">
  <template #trigger><SButton>打开</SButton></template>
  <div>拖动头部即可移动此对话框。</div>
</SDialog>
```

### 如何使用全屏模式？

通过头部按钮切换（`showFullscreen`，默认隐藏，需显式传 `show-fullscreen` 开启），或用 `v-model:fullscreen` 驱动：

```vue
<SDialog v-model:fullscreen="fullscreen" title="面板">...</SDialog>
```
