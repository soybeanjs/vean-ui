---
head:
  title: NavMenu
  description: 'NavMenu 用于构建站点级横向或纵向导航,共享一个浮层表面。它接替了已退役的 NavigationMenu 家族(见 NavMenu 迁移指南),直接建模在 Popper 原语之上:整个 viewport 就是单个 PopperPositioner,其 reference 动态切换到激活触发器,所有悬停时序运行在单个共享 Popper 悬停状态机上,并通过 pendingValue 做值路由。'
---

# NavMenu

## 概览

NavMenu 用于构建站点级横向或纵向导航,共享一个浮层表面。它接替了已退役的 `NavigationMenu` 家族(见 [NavMenu 迁移指南](/components/navigation-menu)),直接建模在 Popper 原语之上:整个 viewport 就是单个 `PopperPositioner`,其 reference 动态切换到激活触发器,所有悬停时序运行在单个共享 Popper 悬停状态机上,并通过 `pendingValue` 做值路由。

`SNavMenu` 是数据驱动组合:传 `items` 数组即可渲染 `nav > ul > li` 结构、触发器/内容对、指示器与浮动 viewport。样式通过 `scv()` recipe 注入。

> 需要无样式、数据驱动的用法时,导入 `@vean/aria/nav-menu`。

## 功能特性

- **单共享 Popper 模型** — 一个 `PopperRoot`、一个 `PopperPositioner`(即 viewport),reference 动态切换到激活触发器。定位(Floating UI)、grace 走廊与 Escape/外部点击关闭全部由 positioner 免费提供。
- **值路由** — 悬停时序(打开延迟、跳延时窗口)运行在共享状态机上;最近悬停触发器的值路由进 `modelValue`,切换触发器即时完成。
- **点击 / 悬停双触发** — 默认悬停打开、点击切换;`disableClickTrigger` / `disableHoverTrigger` 可单独关闭某一种触发方式。
- **Grace 走廊** — 触发器与打开的 viewport 之间由真实几何走廊保护(无防抖),`skipDelayDuration` 与 `disablePointerLeaveClose` 调节关闭行为。
- **子菜单浮层** — 带 `children` 的项在其触发器旁打开浮动 viewport,支持箭头指示器与 `unmountOnHide` 控制卸载。
- **隐藏项** — `hidden` 将条目及其整棵子树从根列表与嵌套浮层中移除;子项全部隐藏的条目按叶子链接渲染。
- **键盘导航** — 方向键在项间移动焦点;`Enter` / `Space` 激活链接或切换子菜单;入口方向键将焦点送入内容;`Escape` 关闭并归还焦点到触发器。
- **弹层箭头** — viewport 携带 `PopperArrow` 指向激活触发器;其摆放与旋转由 Floating UI 的 `arrow` middleware 决定,切换触发器时随 viewport 一起滑动。
- **受控 / 非受控** — 提供 `modelValue` 时高亮跟随 prop 并触发 `update:modelValue`;否则用 `defaultValue` 做非受控初始值。
- **双向支持** — `orientation` 支持横向 / 纵向;`dir` 支持 LTR / RTL 逻辑定位。
- **六档尺寸** — `size`(xs…2xl)覆盖列表、触发器、viewport 与链接的间距和字号。
- **Aria 组合** — `NavMenuRoot` / `List` / `Item` / `Trigger` / `Content` / `Link` / `Viewport` 及 `Compact` 系列由 `@vean/aria/nav-menu` 导出。

## 用法

<UsageCode component="nav-menu" />

## 示例

<PlaygroundGallery component="nav-menu" />

## API

<ComponentApi component="nav-menu" />

## 注意事项

### 架构

| 能力       | NavMenu(Popper 原生)                                          |
| :--------- | :------------------------------------------------------------ |
| 浮层模型   | 单 `PopperRoot` + viewport 即 `PopperPositioner`              |
| 定位       | Floating UI 锚定激活触发器(动态 reference)                    |
| 悬停延迟   | 共享 Popper 悬停状态机(`delayDuration` / `skipDelayDuration`) |
| grace 走廊 | positioner 的 `useGraceArea` 锚定整个 nav                     |
| 关闭       | positioner 的 `usePopperDismiss`(Escape / 外部点击)           |
| 值路由     | 共享 RootContext 上的 `pendingValue` 槽                       |

### 运行时注意事项

1. **悬停时序** — 菜单在悬停 `delayDuration` 后打开;已打开(或上次关闭后 `skipDelayDuration` 内)时悬停另一触发器即时切换。`disablePointerLeaveClose` 让指针离开内容时保持打开。
2. **点击与悬停互斥** — 悬停打开的子菜单会忽略随后的 click(`hasPointerMoveOpenedRef` 守卫),避免“移动时误关闭”。需要纯点击体验时设置 `disableHoverTrigger: true`。
3. **受控 / 非受控** — 提供 `modelValue` 时,内部写入仅触发 `update:modelValue`;高亮完全跟随 prop。
4. **焦点处理** — 内容通过焦点代理参与 Tab 导航;`Escape` 将焦点归还激活触发器。

## FAQ

### NavMenu 与已退役的 NavigationMenu 家族有何不同?

NavMenu 放弃了共享测量尺寸的 viewport 与每项 hover root,改用 Popper 原生的单 Root + positioner 模型:Floating UI 定位 viewport,grace 走廊与关闭来自 positioner。代价是用标准浮动弹层取代了旧的尺寸/移动方向动画。`NavigationMenu` 与 `SNavigationMenu` 已于 v0.50.0 移除——见[迁移指南](/components/navigation-menu)。

### 如何只保留点击触发?

设置 `disableHoverTrigger: true` —— 悬停不再打开子菜单,点击仍可切换。只要悬停则设置 `disableClickTrigger: true`。

### 父项可以既是链接又带子菜单吗?

可以 —— 同时给项 `href` / `to` 与 `children`。触发器会渲染为链接;点击已打开的链接触发器会先关闭菜单。
