---
head:
  title: 文字提示
  description: 当元素获得键盘焦点或鼠标悬停时，显示与该元素相关信息的弹出层。STooltip 组合 Aria TooltipRoot/TooltipTrigger/TooltipPositioner/TooltipPopup/TooltipArrow 基础组件家族（构建于共享 Popper）与 tooltipVariants 样式配方（3 个槽、6 种尺寸）。
---

# 文字提示

## 概述

当元素获得键盘焦点或鼠标悬停时，显示与该元素相关信息的弹出层。`STooltip` 组合 Aria `TooltipRoot`/`TooltipTrigger`/`TooltipPositioner`/`TooltipPopup`/`TooltipArrow` 基础组件家族（构建于共享 `Popper`）与 `tooltipVariants` 样式配方（3 个槽、6 种尺寸）。

文字提示适合简短、不可交互的提示。丰富的悬停内容请用 `hover-card`；点击触发的内容请用 `popover`；确认请用 `popconfirm`。

## 用法

<UsageCode component="tooltip" />

## 特性

- 🧩 Aria/样式分离 — `TooltipCompact` 聚合 popper 触发器、定位器、弹层与箭头；`STooltip` 只注入样式并转发插槽/事件
- 🖱️ 悬停 + 焦点 — 指针悬停或键盘焦点时打开；Escape 或指针离开时关闭
- ⏱️ 延迟调节 — `delayDuration`（打开）与 `skipDelayDuration`（触发间隔），全局默认值经 `ConfigProvider`
- 🎯 定位 — 完整 popper `placement` 控制，带碰撞避免与按侧滑入动画
- 🔽 箭头 — `showArrow` 渲染定位箭头；经 `arrowProps` 可配置
- 🏷️ 内容 — `content` prop 或默认插槽
- ♿ 行为开关 — `ignoreNonKeyboardFocus`、`disableHoverableContent`、`disableClosingTrigger`、`disabled`
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- ♿ 无障碍 — `role="tooltip"`（视觉隐藏文本节点）、非模态、打开与关闭时 `axe-core` 零违规

## 组件家族

- `STooltip`（样式层）— 入口包装组件；`tooltipVariants` 配方配合动态插槽转发
- `TooltipRoot`（Aria）— 状态持有者；经 `useControllableState` 维护 `open`，提供 `delayDuration`/`skipDelayDuration`/`disabled`/`ignoreNonKeyboardFocus`，合并全局 `ConfigProvider` tooltip 配置
- `TooltipTrigger`（Aria）— 悬停/聚焦打开提示的锚点
- `TooltipPositioner` / `TooltipPositionerImpl`（Aria）— 定位表面（构建于 `PopperPositioner`）
- `TooltipPopup`（Aria）— 弹层主体；暴露视觉隐藏的 `role="tooltip"` 文本节点供屏幕阅读器
- `TooltipArrow`（Aria）— popper 箭头
- `TooltipCompact`（Aria）— 聚合组件；组合触发器/定位器/弹层/箭头并暴露各插槽

## 演示

<PlaygroundGallery component="tooltip" />

## API

<ComponentApi component="tooltip" />

## 注意事项

### 架构与对标差异

`TooltipCompact` 负责触发器/定位器/弹层/箭头组合，所有基础组件保持零样式，仅由 UI 包装组件注入 `tooltipVariants` 类。这与 radix-ui/shadcn-ui 的 headless 分离一致，构建于共享 `Popper` 基础组件之上。Ant Design、Element Plus、Mantine、Naive UI 提供带 `title`/`placement` prop 的单一样式化提示；VeanUI 额外暴露逐槽 `*Props`、`size` 尺寸体系、箭头开关、带 `ConfigProvider` 全局默认的 `delayDuration`/`skipDelayDuration` 调节模型，以及无障碍的视觉隐藏 `role="tooltip"` 节点。

| 能力              | VeanUI | shadcn/ui | Ant Design Tooltip | Element Plus Tooltip | Mantine Tooltip | Naive UI Tooltip |
| :---------------- | :----: | :-------: | :----------------: | :------------------: | :-------------: | :--------------: |
| Aria/样式分离     |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| Popper 定位（12） |   ✅   |    ✅     |         ✅         |          ✅          |       ✅        |        ✅        |
| 延迟调节          |   ✅   |    ✅     |         —          |          ✅          |       ✅        |        —         |
| 箭头              |   ✅   |    ✅     |         —          |          —           |        —        |        —         |
| 尺寸（6）         |   ✅   |     —     |         —          |          —           |        —        |        —         |
| 焦点触发          |   ✅   |    ✅     |         ✅         |          ✅          |       ✅        |        ✅        |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 提示在悬停与键盘焦点时打开；调节 `delayDuration`/`skipDelayDuration`（或 `ConfigProvider` 的 tooltip 默认）以减少误触发。
- `ignoreNonKeyboardFocus`（默认）忽略非键盘焦点（如编程式），符合原生提示语义。
- 弹层经 `Portal` 渲染（传送至 `document.body`）；仅在 `portalProps: { disabled: true }` 时置于相对定位的祖先内。
- `showArrow` 渲染箭头；`arrowProps` 可覆盖其位置/类。
- 提示非模态、不陷阱焦点；Escape 或指针离开时关闭。

### Roadmap

不适用——tooltip 对当前对标集已功能完备。

## FAQ

### 如何给元素添加文字提示？

将元素包进 `trigger` 插槽并设置 `content`：

```vue
<STooltip content="删除此项">
  <template #trigger><SButton>删除</SButton></template>
</STooltip>
```

### 如何定位提示？

使用 `placement`：

```vue
<STooltip placement="top" content="复制">
  <template #trigger><SButton>复制</SButton></template>
</STooltip>
```

### 如何调整打开时机？

设置 `delay-duration`（毫秒），并用 `skip-delay-duration` 控制触发间隔：

```vue
<STooltip :delay-duration="150" :skip-delay-duration="50" content="保存">
  <template #trigger><SButton>保存</SButton></template>
</STooltip>
```

### 如何隐藏箭头？

设置 `show-arrow={false}`：

```vue
<STooltip :show-arrow="false" content="信息">
  <template #trigger><SButton>?</SButton></template>
</STooltip>
```
