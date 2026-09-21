---
head:
  title: 导航菜单（已移除）
  description: 'NavigationMenu 已于 v0.50.0 移除 —— SNavigationMenu 与整个 navigation-menu 家族不再发布。NavMenu 是唯一导航菜单家族；本页保留一个版本周期,记录组件/类型映射与行为差异。'
---

# 导航菜单（v0.50.0 已移除）

> **⚠️ 已移除:** `NavigationMenu` / `SNavigationMenu` 与整个 `navigation-menu` 家族已在 **v0.50.0 移除**，不再导出任何符号 —— 请改用 [`NavMenu`](/components/nav-menu)。

该家族先冻结一个版本，随后在 v0.50.0 的 breaking 窗口内随日期 / Table / Form 引擎更替一并移除。本页保留一个版本周期，供存量代码集中查阅迁移信息，仅说明移除范围与到 `NavMenu` 的映射。

## 移除范围

| 公开面                                     | 状态                                        |
| :----------------------------------------- | :------------------------------------------ |
| `@vean/aria/navigation-menu` 子路径        | 已移除 —— 全部 `NavigationMenu*` 原语与类型 |
| headless 根导出的 `NavigationMenu*` 符号   | 已移除（`Headless.*` 命名空间导出同步移除） |
| `@vean/ui` 的 `SNavigationMenu`            | 已移除 —— 不再提供样式层对应组件            |
| `provideNavigationMenuUi`                  | 已移除 —— 使用 `provideNavMenuUi`           |
| 文档示例、组件 API 数据、组件 changelog 页 | 已移除                                      |
| `vean` 注册表项 `ui/navigation-menu`       | 已移除                                      |

## 迁移到 NavMenu

[`NavMenu`](/components/nav-menu) 建模同一领域 —— 站点级导航、悬停/点击双触发、键盘导航、定位视口与数据驱动 `items` API —— 但建立在单一共享 Popper 表面上：整个 viewport 就是单个 `PopperPositioner`，其 reference 动态切换到激活触发器，悬停时序由单个共享状态机驱动。Root props 基本同构（`modelValue` / `defaultValue`、`orientation`、`dir`、`delayDuration`、`skipDelayDuration`、`disableClickTrigger`、`disableHoverTrigger`、`disablePointerLeaveClose`）。

```diff
- import { SNavigationMenu } from '@vean/ui';
+ import { SNavMenu } from '@vean/ui';

- <SNavigationMenu :items="items" />
+ <SNavMenu :items="items" />
```

```diff
- import { NavigationMenuRoot, NavigationMenuItem } from '@vean/aria/navigation-menu';
+ import { NavMenuRoot, NavMenuItem } from '@vean/aria/nav-menu';
```

### 组件映射

| 已移除                                                                               | NavMenu                                         |
| :----------------------------------------------------------------------------------- | :---------------------------------------------- |
| `SNavigationMenu` / `NavigationMenuCompact`                                          | `SNavMenu` / `NavMenuCompact`                   |
| `NavigationMenuRoot` / `List` / `Item` / `Trigger` / `Content` / `Link` / `Viewport` | 同名加 `NavMenu` 前缀                           |
| `NavigationMenuSubList`                                                              | `NavMenuSubTrigger` + `NavMenuSubContent`       |
| `NavigationMenuIndicator`                                                            | —（共享 `NavMenu` viewport 自带 `PopperArrow`） |
| `provideNavigationMenuUi`                                                            | `provideNavMenuUi`                              |

### 类型映射

每个已移除的 `NavigationMenu*` 类型都有同名后缀的 `NavMenu*` 对应项：`NavigationMenuRootProps` → `NavMenuRootProps`、`NavigationMenuOptionData` → `NavMenuOptionData`、`NavigationMenuUiSlot` → `NavMenuUiSlot`，以此类推。

### 行为差异

- **子菜单浮层** —— `NavigationMenu` 把子项渲染在「指示器 + 视口」中；`NavMenu` 在条目触发器旁打开嵌套浮层（`NavMenuSubTrigger` / `NavMenuSubContent`），`NavMenuViewport` 与 `NavMenuSubContent` 均支持 `sideOffset`。
- **指示器** —— `NavMenu` 没有独立指示器原语；箭头挂在共享 viewport 上并跟随激活触发器。
- **挂载控制** —— `NavigationMenuRoot` 暴露 `unmountOnHide`；`NavMenu` 改为在内容原语上遵循 `forceMount`。
- **UI 槽位** —— 槽位集合不同（已移除的 `NavigationMenuUiSlot` 声明 19 个槽，`NavMenuUiSlot` 声明 20 个，含 `subTrigger` / `subContent` / `positioner`）；`class`、`size` 与 `ui` prop 语义不变。
