---
head:
  title: 弹出层
  description: 用于在 portal 中展示与触发元素相关联的丰富内容，由按钮触发。SPopover 组合 Aria PopoverRoot/PopoverTrigger/PopoverPositioner/PopoverPopup/PopoverArrow/PopoverClose 基础组件家族（构建于共享 Popper + dialog 式可关闭/焦点层之上）与 popoverVariants 样式配方（5 个槽、6 种尺寸）。
---

# 弹出层

## 概述

用于在 portal 中展示与触发元素相关联的丰富内容，由按钮触发。`SPopover` 组合 Aria `PopoverRoot`/`PopoverTrigger`/`PopoverPositioner`/`PopoverPopup`/`PopoverArrow`/`PopoverClose` 基础组件家族（构建于共享 `Popper` + dialog 式可关闭/焦点层之上）与 `popoverVariants` 样式配方（5 个槽、6 种尺寸）。

弹出层适合非关键、上下文相关的丰富内容（操作菜单、设置、帮助）。导航菜单请用 `dropdown-menu`；小的悬停提示请用 `tooltip`；阻塞性确认请用 `popconfirm` 或 `dialog`。

## 用法

<UsageCode component="popover" />

## 特性

- 🧩 Aria/样式分离 — `PopoverCompact` 聚合 popper 定位器、弹层、箭头与关闭；`SPopover` 只注入样式并转发插槽/事件
- 🎯 定位 — 完整 popper `placement` 控制（12 个方向），带碰撞避免与按侧滑入动画
- 🎭 模态切换 — `modal` 控制外部指针拦截、`useHideOthers`、body 滚动锁定与焦点陷阱
- 🔽 箭头 — `showArrow` 渲染定位箭头；经 `arrowProps` 可配置
- ❌ 可关闭 — 可选 `close` 插槽，内置 `lucide:x` 图标；Escape 与外部交互关闭
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- ♿ 无障碍 — `role="dialog"`、焦点陷阱 + 循环、带 `aria-label` 的关闭按钮、`axe-core` 零违规

## 组件家族

- `SPopover`（样式层）— 入口包装组件；`popoverVariants` 配方配合动态插槽转发
- `PopoverRoot`（Aria）— 状态持有者；经 `useControllableState` 维护 `open`，提供 `dir`/`modal`/`disabled` 与 popper root
- `PopoverTrigger`（Aria）— 切换弹出层的 `Button`
- `PopoverPositioner` / `PopoverPositionerImpl`（Aria）— 焦点陷阱、可关闭、定位表面（构建于 `PopperPositioner`）
- `PopoverPopup`（Aria）— 弹层主体
- `PopoverArrow`（Aria）— popper 箭头
- `PopoverClose`（Aria）— 关闭 `<button>`，发出 `close` 并切换 `open`
- `PopoverCompact`（Aria）— 聚合组件；组合定位器/弹层/箭头/关闭并暴露各插槽

## 演示

<PlaygroundGallery component="popover" />

## API

<ComponentApi component="popover" />

## 注意事项

### 架构与对标差异

`PopoverCompact` 负责定位器/弹层/箭头/关闭组合，所有基础组件保持零样式，仅由 UI 包装组件注入 `popoverVariants` 类。这与 radix-ui/shadcn-ui 的 headless/样式分离一致，构建于共享 `Popper` 基础组件之上。Ant Design、Element Plus、Mantine、Naive UI 提供带 `placement`/`trigger`/`width` prop 的单一样式化弹出层；VeanUI 额外暴露逐槽 `*Props`、`size` 尺寸体系、箭头开关与单包库弹出层通常缺失的 `modal` 模式。

| 能力              | VeanUI | shadcn/ui | Ant Design Popover | Element Plus Popover | Mantine Popover | Naive UI Popover |
| :---------------- | :----: | :-------: | :----------------: | :------------------: | :-------------: | :--------------: |
| Aria/样式分离     |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| Popper 定位（12） |   ✅   |    ✅     |         ✅         |          ✅          |       ✅        |        ✅        |
| 箭头              |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| 模态模式          |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| 关闭按钮          |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| 尺寸（6）         |   ✅   |     —     |         —          |          —           |        —        |        —         |
| 焦点陷阱 + 循环   |   ✅   |    ✅     |         —          |          —           |        —        |        —         |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `PopoverRoot` 默认模态（`true`）：打开时拦截外部指针事件并锁定 body 滚动。传 `modal={false}` 获得轻量、非阻塞的弹出层。
- 弹层经 `Portal` 渲染（传送至 `document.body`）；仅在 `portalProps: { disabled: true }` 时置于相对定位的祖先内。
- `showArrow` 渲染箭头；`arrowProps` 可覆盖其位置/类。
- 提供 `close` 插槽以显示关闭控件；默认使用 `lucide:x` 图标。
- 与 `tooltip` 不同，弹出层不会在指针离开时自动关闭；它会保持打开直至被关闭。

### Roadmap

不适用——popover 对当前对标集已功能完备。

## FAQ

### 如何定位弹出层？

使用 `placement`（来自 popper），例如 `top`、`bottom-start`、`right-end`：

```vue
<SPopover placement="top">
  <template #trigger><SButton>信息</SButton></template>
</SPopover>
```

### 如何添加关闭按钮？

提供 `close` 插槽：

```vue
<SPopover>
  <template #trigger><SButton>更多</SButton></template>
  <template #close>关闭</template>
</SPopover>
```

### 如何制作非阻塞弹出层？

设置 `modal={false}`：

```vue
<SPopover :modal="false">
  <template #trigger><SButton>打开</SButton></template>
</SPopover>
```

### 如何控制打开状态？

用 `v-model` 绑定 `open` 或使用 `defaultOpen`：

```vue
<SPopover v-model:open="open">
  <template #trigger><SButton>打开</SButton></template>
</SPopover>
```
