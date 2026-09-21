---
head:
  title: 侧边面板
  description: 从屏幕边缘滑出的面板。它复用 SDialog 的声明式 API 与插槽契约（同一 Aria DialogCompact 基座，相同的模态/焦点/可关闭行为），并新增 side 控制面板进入方向——top/bottom/left/right（默认 right）。
---

# 侧边面板

## 概述

从屏幕边缘滑出的面板。它复用 `SDialog` 的声明式 API 与插槽契约（同一 Aria `DialogCompact` 基座，相同的模态/焦点/可关闭行为），并新增 `side` 控制面板进入方向——`top`/`bottom`/`left`/`right`（默认 `right`）。

`SSheet` 组合 Aria dialog 基础组件家族与 `sheetVariants` 样式配方（继承 `dialogVariants`，6 种尺寸 × 4 个方向）。

> 需要带吸附点与滑动关闭的手势面板？那是 [Drawer](/components/drawer)——侧边面板刻意保持"带侧边的 dialog"定位。

## 用法

<UsageCode component="sheet" />

## 特性

- 🧩 复用 dialog 基座 — 构建于 `DialogCompact`，继承 `SDialog` 的插槽、事件、逐部分 `*Props`、`pure`、`isAlert` 与命令式 `dialog(...)` API
- 🧭 4 个方向 — `side="top"`/`"bottom"`/`"left"`/`"right"`（默认 `right`）；左右方向支持 RTL 镜像滑动
- 🎭 默认模态 — `aria-modal`、`useHideOthers`、外部指针拦截与焦点陷阱，与 `SDialog` 相同
- ❌ 可关闭 — `showClose`、Escape、外部指针/焦点与关闭按钮均可关闭
- 🎞️ 动画 — 进入/退出过渡（`slide-in-from-*` / `slide-out-to-*`）由打开状态驱动
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- ⛶ 全屏 — `showFullscreen` 渲染切换按钮；`fullscreen`/`defaultFullscreen` 驱动 `v-model:fullscreen` 状态，使面板撑满视口
- 🔘 取消/确认底部 — `showCancel`/`showConfirm`，`cancelText`/`confirmText` 本地化
- ♿ 无障碍 — `role="dialog"`、焦点陷阱 + 循环、关闭时焦点还原、`axe-core` 零违规

## 组件家族

- `SSheet`（样式层）— 入口包装组件；`sheetVariants` 配方（`size` + `side`）配合动态插槽转发
- 其余部分均来自 Aria dialog 家族（见 `Dialog`）：`DialogRoot`、`DialogTrigger`、`DialogOverlay`、`DialogPopup`、`DialogHeader`、`DialogContent`、`DialogFooter`、`DialogTitle`、`DialogDescription`、`DialogClose`、`DialogCancel`、`DialogConfirm`、`DialogCompact`

## 演示

<PlaygroundGallery component="sheet" />

## API

<ComponentApi component="sheet" />

## 注意事项

### 架构与对标差异

`SSheet` 是薄样式包装组件：它把每个 prop/插槽/事件转发给 Aria `DialogCompact`，仅提供继承 `dialogVariants` 并按方向定制 `popup` 类的 `sheetVariants` 配方。这使得侧边面板与对话框行为一致而仅表现不同——与 shadcn-ui/vaul 式面板相同的 headless/样式分离；而 Ant Design 的 `drawer`（带 `placement`/`width`/`closable`/`mask` prop 的单一样式化组件）及 Element Plus/Mantine/Naive UI 为另一模型。

| 能力                    | VeanUI | shadcn/ui | Ant Design Drawer | Element Plus Drawer | Mantine Drawer | Naive UI Drawer |
| :---------------------- | :----: | :-------: | :---------------: | :-----------------: | :------------: | :-------------: |
| 复用 dialog 基座        |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| Aria/样式分离           |   ✅   |    ✅     |         —         |          —          |       —        |        —        |
| 4 个方向（side）        |   ✅   |    ✅     |        ✅         |         ✅          |       ✅       |       ✅        |
| 模态（aria-modal+陷阱） |   ✅   |    ✅     |        ✅         |         ✅          |       ✅       |       ✅        |
| 关闭时焦点还原          |   ✅   |    ✅     |        ✅         |         ✅          |       ✅       |       ✅        |
| 尺寸（6）               |   ✅   |     —     |         —         |          —          |       —        |        —        |
| 纯净（无头/底部）       |   ✅   |     —     |         —         |          —          |       —        |        —        |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- 侧边面板继承 dialog 契约：默认模态，弹层传送至 `document.body`；Escape/外部交互关闭。
- `side` 只改变滑动方向与位置类；可访问 `role` 仍为 `dialog`（侧边面板没有独立的 ARIA 角色）。
- 左右面板沿逻辑方向滑动，并在 RTL（`dir`）下镜像。
- 全屏时面板从所锚定的那条边撑满视口，`side` 只决定是哪条边；各方向自身的尺寸上限（`w-3/4`/`sm:max-w-sm`、以及 `100dvh - 2rem` 的高度上限）会被解除。
- 命令式 `dialog(...)` API 在传入匹配选项时同样能渲染侧边面板——无需独立的 sheet 服务。

### 从 `SDrawer` 迁移（v0.50.0）

`SDrawer` 这一名称现已归属手势驱动的 [Drawer](/components/drawer)。侧边面板以新名称保留完全一致的行为：

| 旧名                                          | 新名                                       |
| :-------------------------------------------- | :----------------------------------------- |
| `SDrawer`（侧边面板）                         | `SSheet`                                   |
| `@vean/ui` → `SDrawer`                        | `@vean/ui` → `SSheet`                      |
| `drawerVariants`                              | `sheetVariants`                            |
| `DrawerProps` / `DrawerEmits` / `DrawerSlots` | `SheetProps` / `SheetEmits` / `SheetSlots` |

```vue
<!-- 旧 -->
<SDrawer v-model:open="open" side="left" title="筛选">...</SDrawer>

<!-- 新 -->
<SSheet v-model:open="open" side="left" title="筛选">...</SSheet>
```

## FAQ

### 如何从特定边缘滑出面板？

设置 `side` 为 `top`/`bottom`/`left`/`right`：

```vue
<SSheet v-model:open="open" side="left" title="筛选">...</SSheet>
```

### 如何控制打开状态？

用 `v-model` 绑定 `open`，或使用 `defaultOpen` 实现非受控面板：

```vue
<SSheet v-model:open="open" title="设置">...</SSheet>
```

### 如何添加取消/确认操作？

使用 `footer` 插槽，或依赖带本地化文本的 `showCancel`/`showConfirm`：

```vue
<SSheet v-model:open="open" show-confirm confirm-text="应用" title="偏好设置">
  <template #trigger><SButton>打开</SButton></template>
</SSheet>
```

### 如何制作自定义面板？

使用 `pure` 并填充默认插槽：

```vue
<SSheet v-model:open="open" pure side="bottom">
  <div class="custom">...</div>
</SSheet>
```

### 如何让面板全屏？

用 `show-fullscreen` 渲染头部切换按钮，或用 `v-model:fullscreen` 直接驱动状态。两种方式都会让面板从 `side` 所在一侧撑满视口：

```vue
<SSheet v-model:open="open" v-model:fullscreen="fullscreen" show-fullscreen side="right" title="设置">
  <template #trigger><SButton>打开</SButton></template>
</SSheet>
```
