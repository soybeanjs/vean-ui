---
head:
  title: 布局
  description: 用于后台管理面板或复杂应用的布局组件结构。它负责管理侧边栏、头部、底部、标签栏以及主内容区域。
---

# 布局

## 概述

用于后台管理面板或复杂应用的布局组件结构。它负责管理侧边栏、头部、底部、标签栏以及主内容区域。

## 功能

- **统一布局** — `SLayout` 融合现代侧边栏外壳与管理后台经典能力：滚动容器、固定头部/底部、方向切换。
- **三种变体** — `sidebar`（带边框）、`floating`（圆角阴影）、`inset`（内容带外边距和圆角）。
- **可折叠侧边栏** — `collapsible="icon"` 折叠到 rail 宽度；`collapsible="offcanvas"` 滑出视口但保留布局占位。
- **侧边控制** — `side="left"` 或 `side="right"` 翻转侧边栏位置，全量使用 RTL 友好的逻辑属性。
- **移动端抽屉** — `isMobile` 不传时跟随视口，将桌面侧边栏切换为基于 `Dialog` 的抽屉，自带遮罩与焦点陷阱；传入布尔值可覆盖断点。
- **槽位级覆盖** — 每个区域（sidebar、header、tab、content、footer）都接受对应的 `*Props`，用于精细化的属性透传。
- **CSS 变量驱动** — 尺寸（`sidebarWidth`、`headerHeight`、`tabHeight`、`footerHeight`）以 rem 形式输出 CSS 变量，便于运行时定制。
- **尺寸缩放** — `size`（xs…2xl）通过 `themeSizeRatio` 缩放布局间距与基础字号。
- **`fullContent` 模式** — 将内容区域固定铺满视口，同时保留标签栏置于其上。
- **方向** — `Layout` 支持 horizontal（侧边栏在内容旁）与 vertical（侧边栏在 header 下方）两种方向。
- **滚动行为** — `scrollBehavior="content"` 仅滚动内容区域；`scrollBehavior="wrapper"` 滚动整个 main 容器。
- **固定头部/底部** — `fixedTop` 与 `fixedFooter` 在内容滚动时保持头部/底部固定，并自动渲染占位元素防止重叠。
- **基础 z-index 控制** — `baseZIndex` 派生 sidebar、header、tab、footer 的堆叠顺序，多布局组合时表现一致。
- **Aria 组合** — 每个区域（`LayoutRoot`、`LayoutSidebar`、`LayoutRail`、`LayoutHeader`、`LayoutTab`、`LayoutContent`、`LayoutFooter`、`LayoutMobile`、`LayoutTrigger`）都从 `@vean/aria/layout` 导出，可用于自定义样式构建。
- **SSR 安全** — setup 中无 `window`/`document` 访问；`useId()` 为服务端渲染生成稳定的滚动 id。

## 用法

<UsageCode component="layout" />

## 演示

<PlaygroundGallery component="layout" />

## API

<ComponentApi component="layout" />

## 注意事项

### 架构与行业对标

| 关注点          | VeanUI                                                                    | Ant Design `Layout`/`Header`/`Sider`/`Content`/`Footer` | Element Plus `ElContainer`/`ElHeader`/`ElAside`/`ElMain`/`ElFooter` |
| :-------------- | :------------------------------------------------------------------------ | :------------------------------------------------------ | :------------------------------------------------------------------ |
| Aria / 样式分离 | ✅ `@vean/aria/layout` 提供逻辑 + 结构；`@vean/ui` 提供 `scv()` 配方      | ❌ 单一样式包                                           | ❌ 单一样式包                                                       |
| 侧边栏变体      | `sidebar` / `floating` / `inset`                                          | 仅 `sider`                                              | 仅 `aside`                                                          |
| 折叠模式        | `icon`（rail）+ `offcanvas`（滑出）                                       | `collapsible` + `collapsedWidth`                        | —                                                                   |
| 移动端抽屉      | 内置基于 `Dialog` 的抽屉（默认跟随视口）                                  | 需要组合 `Drawer`                                       | 需要组合 `Drawer`                                                   |
| 固定头部/底部   | `Layout` 的 `fixedTop` / `fixedFooter` + 自动占位元素                     | 需要手动 sticky CSS                                     | 需要手动 sticky CSS                                                 |
| 方向            | `Layout` `orientation="horizontal" \| "vertical"`                         | —                                                       | —                                                                   |
| 滚动行为        | `Layout` 的 `wrapper` / `content`                                         | —                                                       | —                                                                   |
| CSS 变量尺寸    | `--vean-sidebar-width`、`--vean-layout-header-height` 等                  | `Sider` 内联宽度                                        | `Aside` 内联宽度                                                    |
| RTL 支持        | 逻辑属性（`start-*`、`end-*`、`ps-*`、`pe-*`）+ rail 的 `rtl:` 变体       | —                                                       | —                                                                   |
| Z-index 协调    | `baseZIndex` 派生 sidebar/header/tab/footer 的 z-index                    | 手动                                                    | 手动                                                                |
| 区域可见性      | `sidebarVisible` / `headerVisible` / `tabVisible` / `footerVisible` props | 移除组件                                                | 移除组件                                                            |

### 运行时注意事项

1. **CSS 变量以 rem 为单位** — `sidebarWidth`、`collapsedSidebarWidth`、`headerHeight`、`tabHeight`、`footerHeight`、`mobileSidebarWidth` 通过 `pxToRem` 转换（默认 `px / 16`）。如根字号非 16px，请传入自定义 `pxToRem`。
2. **`size` 缩放间距与字号** — UI 包装层将像素尺寸乘以 `themeSizeRatio[size] / themeSizeMap.md`，因此 `size="xs"` 会同时缩小文字与侧边栏宽度。
3. **`isMobile` 分三级解析** — 依次是组件 prop、宿主通过 `provideViewportContext` 发布的视口（文档站的设备画框、被嵌入的外壳），最后是 `useMediaQuery(mobileViewportQuery)`；该断点与样式层隐藏桌面侧栏的 `lt-md` 规则共用同一个值（`767.9px`）。生效来源会以 `data-mobile-source="explicit|viewport"` 输出，样式层的 `lt-md` 兜底只对 `viewport` 生效：断点以下显式传 `isMobile="false"` 时，内联侧栏**连同它占用的宽度**都会保留，而不是「CSS 把侧栏藏了、布局却仍为它留出空槽」。抽屉会被传送到布局之外，因此移动端侧栏不占布局空间：起点间距（`--vean-layout-start-gap`、`--vean-layout-header-start-gap`、`--vean-layout-footer-start-gap`）归零，各变体回落到自身的末端间距 —— `sidebar`/`floating` 变为通栏，`inset` 则前后两侧对称内嵌。同一套回落规则也覆盖桌面端的 `sidebarVisible="false"`：隐藏的侧栏同样不占布局空间，`floating`/`inset` 在侧栏宽度之外多加的那一个间距随之收回，主区域与固定的 header/footer 保持一致对齐。宿主若把侧栏解析为「一列都不占」（`SAppShell` 的 split 模式在一级叶子激活时就是这样），传 `sidebarWidth="0"` 即可：根元素会输出 `data-sidebar-flow="false"`，样式层同样收回那个间距并完全不绘制这一列；因为区域本身仍在树里（它的挂载点要接收传送进来的面板），消失的只是这一列，而不是整棵子树。
4. **`sidebar` 插槽按模式感知的 `collapsed` 渲染** — 该插槽除了 `open` 还会给出 `collapsed`：移动端为 `false`，因为此时的侧边栏是永远展示展开态导航的抽屉，桌面端选的折叠不会跟着内容进抽屉。侧栏内容请基于 `collapsed` 渲染（菜单的 `collapsed`、品牌标题的显隐）；`open` 仍报告桌面端状态，模式切回后折叠也会随之恢复。
5. **`LayoutTrigger` 与 `LayoutRail` 的区别** — `LayoutTrigger` 是头部中可聚焦的按钮，面向键盘用户；`LayoutRail` 是边缘拖拽热区，`tabindex="-1"`（仅可点击）。两者的 `aria-expanded` 反映的都是当前模式实际渲染的那个侧边栏 —— 移动端是抽屉状态，而不是桌面端的 `open`。
6. **`Layout` 占位元素** — 启用 `fixedTop` 或 `fixedFooter` 时，`LayoutPlaceholder` 渲染空的占位 div（`data-vean-layout-{header|tab|footer}-placeholder`），防止内容滑入固定区域下方。隐藏某个区域会连同它的占位一起移除，下方的固定区域随之上移补位：头部隐藏后 tab 直接顶到布局顶部（`inset` 只保留自身的半间距），不再保留头部高度。
7. **`scrollId` 用于滚动恢复** — `Layout` 在滚动元素（wrapper 或 content，取决于 `scrollBehavior`）上生成稳定的 `soybean-layout-scroll-{id}`。传入 `scrollId` 可使其在 SSR/CSR 间确定一致。

## 常见问题

### 该使用哪种布局模式？

使用 `SLayout` 即可覆盖现代应用外壳与管理后台两类场景。它通过单一组件统一处理固定头部/底部、方向切换（`horizontal` / `vertical`）以及容器级滚动 + 占位间距。

### 如何控制侧边栏的展开状态？

使用 `v-model:open`（受控）或 `default-open`（非受控）。状态通过根元素的 `data-state="expanded|collapsed"` 以及 `LayoutTrigger`/`LayoutRail` 的 `aria-expanded` 反映。

移动端的内联侧栏会换成抽屉，抽屉有自己的状态：用 `v-model:mobileOpen`（或非受控的 `default-mobile-open`）驱动它。`open` 始终只管桌面侧栏，因此把 `isMobile` 固定下来的宿主需要通过 `mobileOpen` 才能控制用户实际看到的东西 —— trigger 报的也是它。二者不能合成一个 `open` 绑定：桌面侧栏默认展开，而抽屉必须默认关闭。

### 如何让侧边栏折叠为图标而非滑出？

设置 `collapsible="icon"`（默认）并将 `collapsedSidebarWidth` 设为 rail 宽度。侧边栏会收缩到折叠宽度，`sidebarGapHandler` 相应调整主区域。使用 `collapsible="offcanvas"` 可改为滑出视口。

### 移动端模式如何工作？

不传 `isMobile`（默认）时布局跟随视口，自动把桌面侧边栏换成基于 `Dialog` 的抽屉；传入布尔值可自行固定模式。抽屉继承 `mobileSidebarWidth` 并复用同一个 `sidebar` slot 内容。遮罩与焦点陷阱由底层 `Dialog` 组件提供。

### 宿主可以替整棵子树决定模式吗？

可以。已经知道答案的宿主 —— 按手机宽度渲染的设备预览画框、嵌在桌面应用里的外壳、带设备判断的 SSR —— 只需用 `@vean/aria/composables` 的 `provideViewportContext({ isMobile })` 发布一次，它下面的每个布局都会跟随，同时单个实例上的显式 `isMobile` 仍然优先。把决定发布在「画框」而不是每个组件上，也是让文档预览诚实的前提：画框可以模拟手机视口，而浏览器窗口仍然是宽屏。注意 `lt-md:hidden`、`sm:`、`md:` 这类视口前缀工具类仍然看浏览器窗口，所以模拟视口改变的是 JS 结构（抽屉 vs 内联侧栏）与 prop 驱动的间距，而不是这些断点类。

### 可以把侧边栏放在右侧吗？

可以 — 设置 `side="right"`。布局使用 RTL 友好的逻辑属性（`start-*`、`end-*`、`border-s`、`border-e`），因此侧边栏、间距处理器、rail 光标以及固定头部/底部的 inset 都会正确翻转。

### z-index 如何协调？

`Layout` 接受 `baseZIndex`（默认 `50`）。sidebar、header、tab、footer 的 z-index 均由此基础值派生，确保堆叠可预测。派生值通过 `--layout-{sidebar|header|tab|footer}-z-index` CSS 变量暴露。

### 如何定制区域级属性？

每个区域在 compact 组件上接受一个 `*Props` prop（如 `sidebarProps`、`headerProps`、`tabProps`、`contentProps`、`footerProps`、`mainProps`、`railProps`、`mobileProps`），这些属性会透传到对应的 Aria 区域组件。
