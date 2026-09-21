---
head:
  title: 分页
  description: 分页用于将内容或数据拆分为多个页面，并提供用于跳转到上一页/下一页的导航控件。
---

# 分页

## 概述

分页用于将内容或数据拆分为多个页面，并提供用于跳转到上一页/下一页的导航控件。

## 特性

- **数据驱动的 Compact 组合** — `SPagination` 将整体结构委托给 Aria 的 `PaginationCompact`，由它负责页码窗口计算、默认内容和内部组合（root → list → 页码项/操作按钮 → 省略号）。
- **受控/非受控页码状态** — `page` / `pageSize` 支持 `v-model`（受控）；`defaultPage` / `defaultPageSize` 提供非受控用法，底层基于 `useControllableState`。
- **智能页码窗口** — `siblingCount` 控制当前页两侧显示的页码按钮数量；`showEdges: true` 时始终固定首页与末页，并根据当前页位置自动渲染单个或双省略号。
- **边界自动禁用** — 第一页时 prev/first 禁用、最后一页时 next/last 禁用；`disabled: true` 会禁用整个控件并抑制所有交互。
- **四种视觉变体** — `variant`（`pure` / `solid` / `outline` / `soft`）、`shape`（`rounded` / `square`）与 `size`（xs…2xl）通过 `paginationVariants` 的 `scv()` 配方应用。
- **`actionVariant`** — 开启后，first/prev/next/last 操作按钮也套用当前 `variant` 样式；该样式默认只作用于选中页码。
- **八个自定义插槽** — `default`（列表）、`leading`、`trailing`、`first`、`prev`、`next`、`last`、`ellipsis`；动态插槽转发保证样式包装器可触达所有 Aria 插槽。
- **分区属性转发** — `listProps`、`listItemProps`、`ellipsisProps`、`firstProps`、`prevProps`、`nextProps`、`lastProps` 可将属性转发到对应区域。
- **完整 ARIA 语义** — 根元素为 `nav`；当前页带有 `aria-current="page"` 与选中态属性；每个按钮都有本地化的 `aria-label`。
- **本地化无障碍文案** — 操作按钮文案与页码标签模板来自 locale 注册表（`pageLabel` 支持 `{value}` 占位符），内置 13 种语言。
- **RTL 支持** — 操作按钮图标通过 `rtl:[&>svg]:rotate-180` 自动镜像。
- **Aria 组合** — `PaginationRoot` / `PaginationList` / `PaginationListItem` / `PaginationEllipsis` / `PaginationFirst` / `PaginationPrev` / `PaginationNext` / `PaginationLast` 均可从 `@vean/aria/pagination` 导入，用于完全自定义样式构建。

## 用法

<UsageCode component="pagination" />

> `SPagination` 将页码窗口计算委托给 Aria 的 `PaginationCompact`。如需无样式、数据驱动的组合，请从 `@vean/aria/pagination` 导入 `PaginationCompact`。

## 演示

<PlaygroundGallery component="pagination" />

## API

<ComponentApi component="pagination" />

## 备注

### 架构与竞品对比

| 关注点               | SoybeanUI                                                        | shadcn-vue `Pagination`                 | Ant Design `Pagination`         | Element Plus `Pagination`    |
| :------------------- | :--------------------------------------------------------------- | :-------------------------------------- | :------------------------------ | :--------------------------- |
| Aria / 样式双层分离  | ✅ `@vean/aria/pagination` + `scv()`                             | ❌ 单一包                               | ❌ 单一包                       | ❌ 单一包                    |
| 数据驱动 Compact API | ✅ `PaginationCompact` + 8 个类型化插槽                          | ✅ `Pagination` + `PaginationItem` 部件 | ✅ 配置驱动（total, current）   | ✅ layout / components       |
| 受控/非受控          | ✅ `page`/`defaultPage`、`pageSize`/`defaultPageSize`            | ✅ `v-model`                            | ✅ `current` / `defaultCurrent` | ✅ `v-model`                 |
| 省略号与固定首尾页   | ✅ `showEdges` + 自动单/双省略号                                 | ✅ `PaginationItem` 的 `showEdges`      | ✅ `showLessItems` / 自动省略号 | ✅ `pager-count`             |
| 边界自动禁用         | ✅ 第一页禁用 prev/first，末页禁用 next/last                     | ✅ 部件级 `disabled`                    | ✅ `prevIcon`/`nextIcon` 处理   | ✅ 自动                      |
| 整体禁用             | ✅ `disabled`                                                    | ✅                                      | ✅ `disabled`                   | ✅ `disabled`                |
| 选中页样式           | ✅ `data-[selected]` + `actionVariant`                           | ✅ `data-[active]`                      | ✅ `current` 项 class           | ✅ `active`                  |
| 本地化 `aria-label`  | ✅ locale 注册表（13 种语言，`{value}` 插值）                    | 硬编码 / `aria-label` prop              | 部分支持                        | —                            |
| 变体系统             | ✅ `pure`/`solid`/`outline`/`soft` × `rounded`/`square` × xs…2xl | ✅ 仅尺寸                               | ✅ `size`                       | ✅ `small`/`default`/`large` |
| 分区属性转发         | ✅ 7 组 props                                                    | ✅ 部件级 `asChild`                     | ✅ `itemRender`                 | ✅ 分区 props                |
| RTL 图标镜像         | ✅ 自动                                                          | —                                       | ✅                              | ✅                           |

### 运行时注意事项

1. **窗口数学** — `getRange` 仅当当前页远离两端时（`leftSiblingIndex > firstPageIndex + 2` 且 `rightSiblingIndex < lastPageIndex - 2`）才显示双省略号；靠近任一端时退化为单个省略号，否则渲染完整范围。
2. **`total` 页数** — `pageCount` 为 `Math.max(1, Math.ceil(total / pageSize))`，空列表也至少有一页；`page` 超过 `pageCount` 时渲染最后一个窗口且不会崩溃。
3. **受控状态同步** — 使用 `v-model:page` 绑定时，点击页码会发出 `update:page`；内部窗口跟随 prop，因此外部页码变化（如数据请求后）会自动重新渲染正确窗口。
4. **`showFirstOrLast`** — 设为 `false` 时移除 first/last 按钮但保留 prev/next；页数计算不受影响。
5. **`actionVariant`** — 仅让操作按钮复用 `variant` 配方；选中页码始终使用 `data-[selected]` 样式，与该开关无关。
6. **Locale 回退** — 按钮文案来自 `useLocaleMessages`；缺失的 key 回退到默认英文包；`pageLabel` 通过 `interpolate` 支持 `{value}` 占位符。
7. **无障碍输出** — 当前页带有 `aria-current="page"` 与 `data-selected` 属性；禁用的操作按钮保留 `disabled`，因此会被辅助技术与键盘导航跳过。

## FAQ

### 省略号什么时候出现？

`showEdges: true` 时，首页与末页始终固定。当前页位于窗口任一端 → 单个省略号；深居中间（如 100 页中的第 50 页）→ 双省略号，两侧各有 `siblingCount` 个页码。`showEdges: false` 时只渲染当前窗口，不显示省略号。

### 如何区分受控与非受控分页？

传入 `page`（可选 `pageSize`）并配合 `@update:page` 处理函数，或直接使用 `v-model:page`。非受控用法依赖 `defaultPage` / `defaultPageSize`，让组件自行管理状态。

### `actionVariant` 有什么用？

默认情况下 first/prev/next/last 操作按钮使用中性操作样式。开启 `actionVariant` 后，这些按钮也套用 `variant` 样式（即选中页码所用的样式，如实心主色外观），适用于当前页与操作按钮视觉融合的场景。

### 为什么第一页时 prev/first 被禁用？

`page === 1` 时 first/prev 自动禁用，`page === pageCount` 时 next/last 自动禁用，防止越界导航。设置 `disabled: true` 可禁用整个控件。

### 能完全自定义按钮吗？

可以 — `first`、`prev`、`next`、`last`、`ellipsis`、`leading`、`trailing` 插槽可替换默认内容；`firstProps` / `prevProps` / `nextProps` / `lastProps` 可将属性（包括样式）转发到对应区域。默认列表插槽通过 Aria list 接收感知 `{ page, pageCount }` 的条目。

### 无障碍是如何处理的？

根元素是 `nav` 地标；每个按钮都有本地化的 `aria-label`（页码按钮使用 `pageLabel` 模板，如 "第 5 页"）；当前页通过 `aria-current="page"` 播报；禁用按钮使用原生 `disabled` 属性，被辅助技术跳过。

### 能构建完全自定义的分页吗？

可以 — 从 `@vean/aria/pagination` 组合 `PaginationRoot` / `PaginationList` / `PaginationListItem` / `PaginationEllipsis` / `PaginationFirst` / `PaginationPrev` / `PaginationNext` / `PaginationLast`，并通过 `providePaginationUi`（或 `SPagination` 的 `ui` prop）注入样式。
