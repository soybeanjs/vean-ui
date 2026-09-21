---
head:
  title: 悬停卡片
  description: 当鼠标悬停或元素获得焦点时，显示可承载更丰富内容的预览卡片。SHoverCard 组合 Aria HoverCardRoot/HoverCardTrigger/HoverCardPositioner/HoverCardPopup/HoverCardArrow 基础组件家族（构建于共享 Popper）与 hoverCardVariants 样式配方（3 个槽、6 种尺寸）。
---

# 悬停卡片

## 概述

当鼠标悬停或元素获得焦点时，显示可承载更丰富内容的预览卡片。`SHoverCard` 组合 Aria `HoverCardRoot`/`HoverCardTrigger`/`HoverCardPositioner`/`HoverCardPopup`/`HoverCardArrow` 基础组件家族（构建于共享 `Popper`）与 `hoverCardVariants` 样式配方（3 个槽、6 种尺寸）。

悬停卡片适合非阻塞、悬停触发的预览（用户资料、仓库预览、内联元数据）。小的文本提示请用 `tooltip`；点击触发的丰富内容请用 `popover`。

## 用法

<UsageCode component="hover-card" />

## 特性

- 🧩 Aria/样式分离 — `HoverCardCompact` 聚合 popper 触发器、定位器、弹层与箭头；`SHoverCard` 只注入样式并转发插槽/事件
- ⏱️ 打开/关闭延迟 — `openDelay`（默认 700ms）/ `closeDelay`（默认 300ms）调节悬停延迟
- 🎯 定位 — 完整 popper `placement` 控制，带碰撞避免与按侧滑入动画
- 🔽 箭头 — `showArrow` 渲染定位箭头；经 `arrowProps` 可配置
- ⌨️ 焦点触发 — 除指针悬停外，键盘焦点也会打开
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- ♿ 无障碍 — Escape/外部交互关闭，打开与关闭时 `axe-core` 零违规

## 组件家族

- `SHoverCard`（样式层）— 入口包装组件；`hoverCardVariants` 配方配合动态插槽转发
- `HoverCardRoot`（Aria）— 状态持有者；经 `useControllableState` 维护 `open`，提供 `openDelay`/`closeDelay` 与 popper root
- `HoverCardTrigger`（Aria）— 悬停/聚焦打开卡片的锚点
- `HoverCardPositioner` / `HoverCardPositionerImpl`（Aria）— 可关闭、定位表面（构建于 `PopperPositioner`）
- `HoverCardPopup`（Aria）— 弹层主体
- `HoverCardArrow`（Aria）— popper 箭头
- `HoverCardCompact`（Aria）— 聚合组件；组合触发器/定位器/弹层/箭头并暴露各插槽

## 演示

<PlaygroundGallery component="hover-card" />

## API

<ComponentApi component="hover-card" />

## 注意事项

### 架构与对标差异

`HoverCardCompact` 负责触发器/定位器/弹层/箭头组合，所有基础组件保持零样式，仅由 UI 包装组件注入 `hoverCardVariants` 类。这与 radix-ui/shadcn-ui 的 headless 分离一致，构建于共享 `Popper` 基础组件之上。Ant Design、Element Plus、Mantine、Naive UI 用单一样式化 popover 做悬停预览；VeanUI 提供专用的悬停卡片，带可配置 `openDelay`/`closeDelay`、逐槽 `*Props`、箭头开关与单包库通常缺失的 `size` 尺寸体系。

| 能力              | VeanUI | shadcn/ui | Ant Design | Element Plus | Mantine | Naive UI |
| :---------------- | :----: | :-------: | :--------: | :----------: | :-----: | :------: |
| Aria/样式分离     |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 打开/关闭延迟     |   ✅   |    ✅     |     —      |      —       |   ✅    |    —     |
| Popper 定位（12） |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    ✅    |
| 箭头              |   ✅   |    ✅     |     —      |      —       |    —    |    —     |
| 尺寸（6）         |   ✅   |     —     |     —      |      —       |    —    |    —     |
| 焦点触发          |   ✅   |    ✅     |     ✅     |      ✅      |   ✅    |    ✅    |

`—` = 不支持或采用不同交互模型（悬停预览并入通用 popover）。

### 运行时注意

- 卡片在悬停与键盘焦点时打开；调节 `openDelay`/`closeDelay` 以减少误触发（默认 700ms/300ms）。
- 弹层经 `Portal` 渲染（传送至 `document.body`）；仅在 `portalProps: { disabled: true }` 时置于相对定位的祖先内。
- `showArrow` 渲染箭头；`arrowProps` 可覆盖其位置/类。
- 悬停卡片非模态，Escape 或外部交互关闭；它不陷阱焦点。

### Roadmap

不适用——hover-card 对当前对标集已功能完备。

## FAQ

### 如何调整打开/关闭时机？

设置 `open-delay` 与 `close-delay`（毫秒）：

```vue
<SHoverCard :open-delay="200" :close-delay="100">
  <template #trigger><SButton>悬停我</SButton></template>
  <div>预览内容</div>
</SHoverCard>
```

### 如何定位卡片？

使用 `placement`：

```vue
<SHoverCard placement="top">
  <template #trigger><SButton>悬停我</SButton></template>
  <div>预览内容</div>
</SHoverCard>
```

### 如何隐藏箭头？

设置 `show-arrow={false}`：

```vue
<SHoverCard :show-arrow="false">
  <template #trigger><SButton>悬停我</SButton></template>
  <div>预览内容</div>
</SHoverCard>
```

### 如何控制打开状态？

用 `v-model` 绑定 `open` 或使用 `defaultOpen`：

```vue
<SHoverCard v-model:open="open">
  <template #trigger><SButton>悬停我</SButton></template>
  <div>预览内容</div>
</SHoverCard>
```
