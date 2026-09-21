---
head:
  title: 手势抽屉
  description: 从屏幕边缘滑入的手势面板。它拥有独立的 Aria 家族——吸附点、滑动关闭、拖拽手柄与嵌套缩放——并在模态、焦点与关闭语义上复用 dialog 原语。
---

# 手势抽屉

## 概述

从屏幕边缘滑入的手势面板。与 `SSheet`（"带方向侧边的 dialog"）不同，抽屉拥有真实的领域状态机：**吸附点**、**滑动进度**、**拖拽手柄**与**嵌套缩放**都是 dialog 家族不具备的行为。

`SDrawer` 组合 Aria `drawer` 基础组件家族与 `drawerVariants` 样式配方（继承 `sheetVariants`，新增拖拽 `handle` 与可选的 `swipeArea`；6 种尺寸 × 4 个方向）。模态、焦点陷阱与关闭语义仍来自共享的 dialog 原语。

## 用法

<UsageCode component="drawer" />

## 特性

- 🧩 dialog 基座承载模态 — 继承 dialog 契约（`open`/`defaultOpen`、焦点陷阱、焦点还原、Escape/外部关闭），并叠加抽屉状态机
- 🧭 4 个方向 — `side="top"`/`"bottom"`/`"left"`/`"right"`（默认 `bottom`）；左右方向在 RTL 下镜像，上下方向限制高度并让内容区滚动
- 📏 吸附点 — `snapPoints` 接受分数（`0.5`）、像素偏移或 CSS 长度；用 `v-model:snap-point` 绑定当前等级；抽屉默认打开在第一个吸附点，关闭后重置回第一档
- 🪜 顺序吸附 — `snapToSequentialPoints` 逐级移动，而不是跳到最近点
- 🖐️ 滑动关闭 — 拖拽面板或手柄超过 `closeThreshold` 即关闭；`dismissible={false}` 强制显式操作；`swipeDirection` 可覆盖关闭方向
- 👉 滑动打开 — 通过 `swipeable` 启用边缘手势条（`DrawerSwipeArea`），具备轴锁定、方向阻尼、速度采样与滚动让位
- 🖼️ 页面缩进 — `DrawerIndent` / `DrawerIndentBackground` 让抽屉背后的页面随实时滑动进度缩放、位移与圆角（CSS 变量驱动）
- 🧲 仅手柄拖拽 — `handleOnly` 限制仅手柄可拖；`fixed` 固定面板同时内部内容滚动
- 🪗 嵌套抽屉 — `nested` 经 `DrawerRootNested` 渲染，拖拽、释放与打开状态与父级联动
- 🎛️ 模态三层级 — `modal` 支持 `true`（完全模态）、`'trap-focus'`（陷阱焦点但保留外部指针事件）或 `false`
- 🔘 dialog 底部 — `showClose`/`showCancel`/`showConfirm`，`cancelText`/`confirmText` 本地化
- 📐 6 种尺寸 — xs–2xl `size`；逐槽 `ui` 覆盖
- ⛶ 全屏 — `fullscreen`/`defaultFullscreen`（或 `v-model:fullscreen`）让面板从所锚定的那条边撑满视口；全屏期间吸附与拖拽均暂停生效
- ♿ 无障碍 — `role="dialog"`、焦点移入面板、`axe-core` 零违规

## 组件家族

- `SDrawer`（样式层）— 入口包装组件；`drawerVariants` 配方配合动态插槽转发
- `DrawerRoot` / `DrawerRootNested`（Aria）— 状态持有者；`open`、`snapPoints`、`snapPoint`、`dismissible`、`nested`、拖拽/滑动状态
- `DrawerTrigger`（Aria）— 打开者，接入 `aria-haspopup`/`aria-expanded`
- `DrawerPortal`（Aria）— 传送边界
- `DrawerOverlay`（Aria）— 变暗的背景遮罩；透明度随实时滑动进度衰减
- `DrawerPopup`（Aria）— 焦点陷阱表面与拖拽手势宿主；位置完全由 CSS 变量驱动（`--vean-drawer-snap-point-offset` + `--vean-drawer-swipe-movement-x/y`）
- `DrawerViewport`（Aria）— 携带吸附点状态的可滚动区域
- `DrawerSwipeArea`（Aria）— 可选边缘手势条，滑动打开抽屉
- `DrawerHandle`（Aria）— 抓手柄；双击循环吸附点。`DrawerCompact` 仅在 `side="bottom"` 时渲染
- `DrawerIndent` / `DrawerIndentBackground`（Aria）— 包裹抽屉背后的页面获得缩进效果；`data-active` 标记打开状态，`--vean-drawer-swipe-progress` 承载实时进度
- `DrawerHeader` / `DrawerContent` / `DrawerFooter` / `DrawerTitle` / `DrawerDescription` / `DrawerClose` / `DrawerCancel` / `DrawerConfirm`（Aria）— 包装 Dialog 的 chrome 基元；DOM 使用 `data-vean-drawer-*`
- `DrawerCompact`（Aria）— 聚合组件；组合手柄、手势条、头部、内容与底部并暴露各插槽

## 演示

<PlaygroundGallery component="drawer" />

## API

<ComponentApi component="drawer" />

## 注意事项

### 架构与对标差异

`DrawerCompact` 负责手柄/手势条/遮罩/弹层/头部/内容/底部组合与拖拽/吸附状态流（经 `useDrawerSnapPoints` 与 `useSwipeDismiss`），所有基础组件保持零样式，仅由 UI 包装组件注入 `drawerVariants` 类。弹层 transform 完全由 CSS 变量驱动——手势层只写变量、从不写内联 transform——吸附归位、松手回弹与关闭退出都由 CSS transition 承接。这与 Base UI Drawer 的模型一致。Ant Design、Element Plus、Mantine、Naive UI 提供单一样式化抽屉；带 `snapPoints` 的专用可拖拽面板通常是独立库（vaul、Base UI Drawer）。VeanUI 内联暴露逐槽 `*Props`、`size` 尺寸体系与吸附/缩进/拖拽/滑动模型。

| 能力             | VeanUI | shadcn/ui + vaul | reka-ui Drawer | Base UI | Ant Design | Element Plus | Mantine |
| :--------------- | :----: | :--------------: | :------------: | :-----: | :--------: | :----------: | :-----: |
| 复用 dialog 原语 |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |    —    |
| Aria/样式分离    |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |    —    |
| 拖拽关闭         |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |   ✅    |
| 吸附点           |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |    —    |
| 滑动打开区域     |   ✅   |        —         |       ✅       |   ✅    |     —      |      —       |    —    |
| 页面缩进效果     |   ✅   |        ✅        |       —        |   ✅    |     —      |      —       |    —    |
| 嵌套抽屉         |   ✅   |        ✅        |       ✅       |   ✅    |     —      |      —       |    —    |
| 模态三层级       |   ✅   |        —         |       ✅       |   ✅    |     —      |      —       |    —    |
| 尺寸（6）        |   ✅   |        —         |       —        |    —    |     —      |      —       |    —    |

`—` = 不支持或采用不同交互模型。

### 运行时注意

- `modal` 默认 `true`；面板传送至 `document.body`，body 滚动由 hide-others 层锁定。`'trap-focus'` 层级保留外部指针事件，但仍然陷阱焦点。
- `side` 决定锚定边缘。上下方向（`top`/`bottom`）将面板高度限制在 `calc(100dvh - 2rem)`，长内容在 `content` 槽内滚动而不会溢出视口；左右方向铺满视口高度并限制宽度。
- 拖拽关闭使用指针捕获；`dismissible`（默认 `true`）允许超过 `closeThreshold` 松手关闭。设 `false` 以强制显式操作。`swipeDirection` 可覆盖关闭方向（默认为入场边的反方向）。
- 横向 side 本版本**仅支持纵向吸附**——`snapPoints` 按纵向轴解析，`left`/`right` 的吸附行为尚未支持。
- `snapPoints` 接受分数（0–1）、像素值（> 1）或 CSS 长度字符串；`snapPoint` 追踪当前等级，用 `v-model:snap-point` 绑定。抽屉默认打开在第一个吸附点，关闭后重置回第一档。
- `DrawerCompact` 仅在 `side="bottom"` 时渲染拖拽手柄；其他方向请手动组合 `DrawerHandle`。
- `handleOnly` 限制仅手柄可拖；`fixed` 保持面板固定同时内部内容滚动。
- `swipeable` 在抽屉边缘渲染手势条；抽屉打开时该区域不生效。
- `nested` 经 `DrawerRootNested` 渲染；每个嵌套抽屉与父级协调拖拽与释放。
- 全屏会定义面板的尺寸**并冻结拖拽**（与 dialog 在全屏时禁用 draggable 一致）：低于「完全打开」的静止吸附档会把面板重新向下平移，使其越过锚定边的那一半落到屏幕外，而把面板拖离该边缘也与这个 prop 的语义相矛盾。关闭全屏后吸附与拖拽恢复；`snapPoints` 始终保留配置。
- 由于拖拽被暂停，全屏下的关闭只能走显式路径：关闭按钮、Escape，以及非模态抽屉的外部点击。因此「模态 + 全屏 + `showClose={false}` + `dismissible={false}`」会让用户无法退出——需要可退出时请保留关闭按钮（或使用 `modal={false}`）。
- 全屏期间手柄不再循环档位，因此不会在背后改写 `snapPoint`。
- 抽屉自身**不渲染**全屏按钮，因此 dialog 的 `showFullscreen` 在这里无效——请用 `v-model:fullscreen`/`defaultFullscreen` 驱动状态，或在面板内自行放置控件。
- 非受控的全屏状态不会跨关闭保留：重新打开时回到 `defaultFullscreen`（与 dialog 的重置行为一致）。

### 从 `BottomSheet` 迁移

v0.50.0 对整个家族做了更名——`bottom-sheet` 名称已退役。

| 旧名                                                                                   | 新名                                                               |
| :------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `SBottomSheet`                                                                         | `SDrawer`                                                          |
| `BottomSheetRoot` / `BottomSheetRootNested`                                            | `DrawerRoot` / `DrawerRootNested`                                  |
| `BottomSheetPopup` / `BottomSheetOverlay`                                              | `DrawerPopup` / `DrawerOverlay`                                    |
| `BottomSheetHandle` / `BottomSheetCompact`                                             | `DrawerHandle` / `DrawerCompact`                                   |
| `BottomSheetTitle` / `BottomSheetDescription`                                          | `DrawerTitle` / `DrawerDescription`                                |
| `BottomSheetHeader` / `BottomSheetContent` / `BottomSheetFooter`                       | `DrawerHeader` / `DrawerContent` / `DrawerFooter`                  |
| `BottomSheetTrigger` / `BottomSheetClose` / `BottomSheetCancel` / `BottomSheetConfirm` | `DrawerTrigger` / `DrawerClose` / `DrawerCancel` / `DrawerConfirm` |
| `v-model:active-snap-point`                                                            | `v-model:snap-point`                                               |
| `direction` prop（Aria）                                                               | `side` prop                                                        |
| `@vean/aria/bottom-sheet`                                                              | `@vean/aria/drawer`                                                |
| `data-vean-bottom-sheet-*`、`soybean-bottom-sheet-dragging`                            | `data-vean-drawer-*`、`soybean-drawer-dragging`                    |
| `data-vean-bottom-sheet-scale`                                                         | 随 scale-background 引擎移除（见下）                               |

原 `SDrawer`（带侧边的 dialog）已更名为 `SSheet`。侧边面板 API 见 [Sheet](/components/sheet)。

### 从 vaul 式引擎迁移

v0.50.0 以 Base UI 风格引擎替换了 vaul 式内核，公开面变化：

| 旧                                                    | 新                                                                                |
| :---------------------------------------------------- | :-------------------------------------------------------------------------------- |
| `shouldScaleBackground` / `setBackgroundColorOnScale` | 已移除。在 `DrawerRoot` 内用 `DrawerIndent` + `DrawerIndentBackground` 包裹页面   |
| `fadeFromIndex`                                       | 已移除；遮罩透明度随滑动进度连续衰减                                              |
| `snapPoint` 默认 `null`                               | 默认取 `snapPoints` 第一项（打开即定位在吸附点上）                                |
| 拖拽方向从 `side` 隐式推导                            | 仍为默认行为，可用 `swipeDirection` 覆盖                                          |
| 命令式 transform                                      | CSS 变量（`--vean-drawer-snap-point-offset`、`--vean-drawer-swipe-movement-x/y`） |

```vue
<!-- 旧 -->
<SBottomSheet v-model:open="open" v-model:active-snap-point="snap" :snap-points="[0.5, 1]">
  <template #trigger><SButton>打开</SButton></template>
  内容
</SBottomSheet>

<!-- 新 -->
<SDrawer v-model:open="open" v-model:snap-point="snap" :snap-points="[0.5, 1]">
  <template #trigger><SButton>打开</SButton></template>
  内容
</SDrawer>
```

背景缩放的迁移示例：

```vue
<!-- 旧 -->
<SBottomSheet v-model:open="open" should-scale-background>
  <div data-vean-drawer-scale>页面</div>
</SBottomSheet>

<!-- 新 -->
<SDrawer v-model:open="open">
  <DrawerIndent class="page-indent">页面</DrawerIndent>
  <template #trigger><SButton>打开</SButton></template>
</SDrawer>
```

### Roadmap

横向吸附点、触摸管线的真机验证（iOS Safari / Android Chrome），以及 iOS 虚拟键盘协调。

## FAQ

### 如何把抽屉锚定到其他边缘？

设置 `side` 为 `top`/`bottom`/`left`/`right`：

```vue
<SDrawer v-model:open="open" side="left" title="筛选">
  <template #trigger><SButton>打开</SButton></template>
  <div>抽屉内容</div>
</SDrawer>
```

### 如何启用吸附点？

传入分数、像素或 CSS 长度数组，并绑定当前等级：

```vue
<SDrawer v-model:open="open" v-model:snap-point="snapPoint" :snap-points="[0.4, 0.8, 1]" title="筛选">
  <template #trigger><SButton>打开</SButton></template>
  <div>抽屉内容</div>
</SDrawer>
```

### 如何用滑动手势打开抽屉？

设置 `swipeable`。会在面板 `side` 所在边缘渲染手势条，滑动方向与之相反：

```vue
<SDrawer v-model:open="open" swipeable title="详情">
  <template #trigger><SButton>打开</SButton></template>
  <div>抽屉内容</div>
</SDrawer>
```

### 如何禁用拖拽关闭？

设置 `dismissible={false}` 以要求显式操作：

```vue
<SDrawer :dismissible="false" title="确认">
  <template #trigger><SButton>打开</SButton></template>
  <div>抽屉内容</div>
</SDrawer>
```

### 如何限制仅手柄可拖？

设置 `handle-only`：

```vue
<SDrawer handle-only title="详情">
  <template #trigger><SButton>打开</SButton></template>
  <div>抽屉内容</div>
</SDrawer>
```

### 如何构建仍陷阱焦点的非模态侧面板？

使用 `'trap-focus'` 层级：

```vue
<SDrawer v-model:open="open" modal="trap-focus" title="检查器">
  <template #trigger><SButton>打开</SButton></template>
  <div>抽屉内容</div>
</SDrawer>
```

### 如何让抽屉全屏？

绑定 `v-model:fullscreen`，或用 `default-fullscreen` 让它初始即全屏。面板会从 `side` 那侧撑满视口且不再响应拖拽，因此吸附与拖拽都要等关闭全屏后才恢复：

```vue
<SDrawer v-model:open="open" v-model:fullscreen="fullscreen" :snap-points="[0.6, 1]" title="详情">
  <template #trigger><SButton>打开</SButton></template>
  <div>抽屉内容</div>
</SDrawer>
```
