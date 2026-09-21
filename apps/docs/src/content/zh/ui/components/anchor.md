---
head:
  title: 锚点
  description: Anchor 用于长内容区域的页内导航，并会在滚动时自动高亮当前所在的章节。
---

# 锚点

## 概述

Anchor 用于长内容区域的页内导航，并会在滚动时自动高亮当前所在的章节。

滚动激活项变化时，地址栏中的 hash 也会同步更新；滚动同步使用 `history.replaceState`，避免产生过多历史记录。

如果页面初始化时地址栏已经带有 hash，Anchor 会在挂载后自动滚动到对应章节；当自定义滚动容器稍后才就绪时，也会在容器可用后重新同步一次。

> `SAnchor` 现在会把递归的锚点项渲染委托给 Aria `AnchorCompact`。`SAnchor` 与 `@vean/aria/anchor` 共享同一组 6 个 `ui` 槽位。

## 功能特性

- **滚动侦测高亮** — 根组件监听滚动容器（默认 `window`，可用 `getContainer` 指定自定义元素），将最近一个越过 `offsetTop + bounds` 阈值的章节标记为激活，并在对应链接上输出 `aria-current="location"`。
- **Hash 同步** — 点击链接通过 `history.pushState` 写入 hash（设置 `replace` 时改用 `replaceState`）；滚动驱动的高亮更新始终使用 `replaceState`；挂载时若 URL 已带 hash 会先滚动到对应章节。
- **平滑页内滚动** — 点击 hash 链接以 `behavior: 'smooth'` 滚动容器，并在动画收敛前（300ms 守卫）暂停滚动侦测，避免中间态抖动。
- **自定义滚动容器** — `getContainer` 返回任意可滚动的 `HTMLElement`；锚点位置相对该容器测量，且容器替换初始 `window` 兜底后会自动重新同步。
- **偏移控制** — `offsetTop`（默认 `0`）与 `targetOffset`（优先级更高）调整滚动目标，使标题落在吸顶头部下方；该值同时以 `--vean-anchor-offset-top` 暴露给吸顶根节点。
- **激活判定调优** — `bounds`（默认 `5`）为判定章节是否越过的像素容差；`getCurrentAnchor` 可在值对外发出前重新映射。
- **递归数据驱动组合** — `SAnchor` 通过泛型 Aria `AnchorCompact` 渲染任意层级的嵌套 `items`，每层包裹自己的 `AnchorLink`、指示器、标题与嵌套 `sub` 列表。
- **吸顶导轨** — `sticky`（默认 `true`）将锚点列表钉在容器顶部（`top: var(--vean-anchor-offset-top)`）并把高度限制在视口内。
- **逐项与全局链接属性** — `disabled` 与 `target` 既可按项设置，也可通过 `linkProps` 全局兜底；显式的项值始终优先，`linkProps.href` 被刻意排除在类型之外（目标地址由项的 `href` 决定）。
- **八种主题色 + 六种尺寸** — `color`（primary…accent）与 `size`（xs…2xl）变体来自 `anchorVariants` `scv()` 配方，另支持纵向 / 横向 `orientation`。
- **默认无障碍** — 根节点渲染带本地化 `aria-label`（可覆盖）的 `<nav>` 地标；禁用链接携带 `aria-disabled` 并移出 Tab 顺序；指示器 `aria-hidden`。
- **Aria 组合** — `AnchorRoot` / `AnchorLink` / `AnchorCompact` / `AnchorItemCompact` 均可从 `@vean/aria/anchor` 导出，用于完全自定义样式。

## 用法

<UsageCode component="anchor" />

> `SAnchor` 现在将递归项渲染委托给 Aria `AnchorCompact`。无样式的数据驱动用法可导入 `@vean/aria/anchor` 的 `AnchorCompact`。

## 演示

<PlaygroundGallery component="anchor" />

## API

<ComponentApi component="anchor" />

## 备注

### 架构与行业对标

| 能力                 | VeanUI                                                        | Ant Design `Anchor`             | Element Plus `Anchor` |
| :------------------- | :------------------------------------------------------------ | :------------------------------ | :-------------------- |
| Aria/styled 分离     | ✅ `@vean/aria/anchor` + `scv()`                              | ❌ 单包                         | ❌ 单包               |
| 数据驱动 compact API | ✅ 泛型 `AnchorCompact` + 递归 `items`                        | ✅ `items`                      | ✅ `items`            |
| 滚动容器             | ✅ `getContainer`（元素或 window）                            | ✅ `getContainer`               | ✅ `container`        |
| 滚动偏移             | ✅ `offsetTop` + `targetOffset`                               | ✅ `offsetTop` + `targetOffset` | ✅ `offset`           |
| 激活容差             | ✅ `bounds`                                                   | ✅ `bounds`                     | ✅ `bound`            |
| 激活值映射           | ✅ `getCurrentAnchor`                                         | ✅ `getCurrentAnchor`           | —                     |
| Hash 同步            | ✅ 点击 pushState / 滚动 replaceState                         | ✅                              | ✅                    |
| 初始 hash 滚动       | ✅                                                            | ✅                              | —                     |
| 吸顶导轨             | ✅ CSS `sticky` + 偏移变量                                    | ✅ `affix` 包裹层               | ✅ CSS sticky         |
| 嵌套项               | ✅ 递归（任意层级）                                           | ❌ 扁平                         | ✅ 2 层               |
| 禁用项               | ✅ 逐项 + `linkProps` 兜底                                    | ❌                              | ❌                    |
| 自定义链接属性       | ✅ `linkProps` / `indicatorProps` / `titleProps` / `subProps` | —                               | —                     |
| 方向                 | ✅ 纵向 / 横向                                                | ❌ 仅纵向                       | ✅ `direction`        |
| 主题色 / 尺寸        | ✅ 8 色 × 6 尺寸                                              | ❌                              | ❌                    |
| 事件                 | ✅ `activeChange` / `itemSelect`                              | ✅ `onChange` / `onClick`       | ✅ `change`           |

### 运行时注意事项

1. **测量时机** — 每次滚动事件都会基于当前滚动容器重新测量锚点位置；尚未渲染或未注册的链接会被跳过，激活项只从已注册链接中推导。
2. **受控 / 非受控** — 提供 `modelValue` 时，内部写入仅触发 `update:modelValue`；高亮跟随 prop，外部改值不会触发滚动。
3. **`getContainer` 稳定性** — 容器引用变化时会重新同步；若每次调用都返回新元素会反复重同步，异步创建元素时请做好记忆化。
4. **仅 hash 链接** — 只有以 `#` 开头的链接参与滚动与 hash 更新；普通/外链交由浏览器默认导航（`itemSelect` 事件仍然触发）。
5. **滚动动画守卫** — 程序化滚动后的 300ms 内暂停滚动侦测，避免中间位置误切激活项或改写 hash。
6. **吸顶导轨** — `sticky` 需要存在可滚动的祖先才能真正钉住；偏移变量让导轨位于吸顶头部下方。不需要钉住时可设 `sticky: false`。
7. **禁用链接** — 禁用项完全惰性：`aria-disabled="true"`、`tabindex="-1"`，点击与键盘激活均被阻断（不触发 `itemSelect`）；仍保持注册以便子项高亮。

## 常见问题

### 如何滚动内部容器而不是 window？

传入 `getContainer={() => myScrollableEl}`。锚点位置将相对该元素测量，滚动也作用于它。当元素在挂载后才可用时，Anchor 会自动重新同步。

### 如何让标题落在吸顶头部下方？

把 `offsetTop` 设为头部高度。`SAnchor` 会滚动到 `元素顶部 - offsetTop`，并把同一值暴露为 `--vean-anchor-offset-top`，吸顶锚点导轨也会避开头部。若锚点偏移需要与滚动偏移不同，使用 `targetOffset`。

### 为什么滚动时地址栏会更新？

这是刻意设计——滚动驱动的高亮变化使用 `history.replaceState`，让 URL hash 始终与视口内章节一致且不刷历史；点击跳转默认使用 `pushState`（除非设置 `replace`）。

### 激活章节是如何选中的？

章节的测量顶部达到 `offsetTop + bounds` 即视为已越过；在所有已越过章节中取最接近阈值（最近越过）的一个高亮。`bounds` 增大容差；`getCurrentAnchor` 可在值发出前重映射。

### 可以禁用或自定义单个链接吗？

可以——每个项支持 `disabled` 与 `target`，全局默认通过 `linkProps` 设置。由于目标地址由项的 `href` 决定，`linkProps.href` 不在类型中。`indicatorProps` / `titleProps` / `subProps` 会把 HTML 属性转发到对应元素。

### 嵌套组合长什么样？

每个项渲染一个 `AnchorLink`（指示器 + 标题），有 `children` 时再渲染一个 `sub` 容器，内部递归渲染 `AnchorItemCompact` 层级。包装层带 `data-vean-anchor-item`，其 `data-state` 反映该项或其任一后代是否激活。
