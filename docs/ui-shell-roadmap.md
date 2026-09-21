# Vean 中后台壳组件路线图（ui-shell-roadmap）

> 状态：**Accepted · 2026-09**（§11 为 2026-09 实施修订：四个 ui 复合组件收窄为一个 `SAppShell`）
> 适用仓库：`@vean/aria` + `@vean/ui`（核心两层，不新增任何包）
> 规范约束：组件开发 skill（[.agents/skills/vean-ui-develop/](../.agents/skills/vean-ui-develop/SKILL.md)），尤其是 [layers.md Aria admission（R1–R8）](../.agents/skills/vean-ui-develop/layers.md#aria-admission)
> 关联文档：[ui-ai-roadmap.md](./ui-ai-roadmap.md)（AI 域同款决策）· [roadmap.md](./roadmap.md)（原子组件评估）

## 1. 背景与目标

### 1.1 为什么不再建 admin 包

- `@soybeanjs/admin` 中后台复合层提案已于 **v0.40.0 取消，包已删除**；`@soybeanjs/chart` 同步取消（图表改为文档站基于 [TanStack Charts](https://tanstack.com/charts) 的 shadcn 风格示例）。
- 原 `admin` 分支（2026-08，6 个 `SApp*` 壳组件 + 6 种菜单模式）验证了交互范式，但它是**独立第三层包**：独立依赖树、独立前缀叙事、与核心包 lockstep 发布，收益不抵维护成本。ADR-0001 的单包自治模型对 AI 域已 [superseded](./adr/0001-peripheral-package-layering.md)，本路线图对中后台壳域作出同样决策。
- 与 AI 域（见 [ui-ai-roadmap.md](./ui-ai-roadmap.md)）相同的结论：**壳组件今后全部在核心 aria/ui 内实现，统一 `S` 前缀，不使用 `App*` 命名**。

### 1.2 目标

1. 让用户用核心库组件即可组装出 soybean-admin 级别的中后台应用壳（多模式布局、菜单联动、面包屑、多页签、移动端响应式）。
2. 严格按两层契约落地：**交互/状态/派生逻辑进 aria（零样式），纯组合与样式进 ui**；不平行克隆既有布局原语。
3. 路由无关：库不依赖 `vue-router`，导航与页签模型接受任意数据输入；路由绑定以文档示例交付。

### 1.3 数量概览

| 分类                                          | 数量 | 内容                                                                                                  |
| :-------------------------------------------- | :--: | :---------------------------------------------------------------------------------------------------- |
| aria 逻辑（`src/shell/` 域模块 + composable） |  3   | `useMediaQuery`、shell 导航模型与派生、`useTabs` 标签集合状态                                         |
| ui 新增复合组件（统一 `S` 前缀）              |  4   | `SLayoutShell`、`SShellMenu`、`SPageHeader`、`SLogo`                                                  |
| 配方/示例（不新增库组件）                     |  4   | 命令面板、主题抽屉、面包屑溢出、vue-router 多页签适配                                                 |
| 既有原子直接复用                              | 12+  | layout 全家、page-tabs、nav-menu/tree-menu、breadcrumb、command、splitter、empty、theme-customizer 等 |
| 范围外（本路线不收录）                        | 3 类 | `ProTable`/`ProForm`（另见 table/form 提案）、权限按钮、应用级业务功能（通知中心等）                  |

## 2. 现状盘点：核心库已有什么

原 admin 分支的绝大多数底座**已经存在于核心库**，这是回迁而非重建。

| 能力         | 核心库现状                                                                                                                                                                                                                                                                                                                                      | 原 admin 对应物                                |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- |
| 布局骨架     | aria `layout`：root / sidebar / rail / header / tab / content / main / footer / mobile / placeholder / trigger + `LayoutCompact`；ui `SLayout`、`SLayoutTrigger`。支持 `orientation`、`variant(sidebar/floating/inset)`、`collapsible(offcanvas/icon)`、`isMobile`、显隐开关、固定头尾、尺寸 token、插槽 Teleport 挂载点（`LayoutPlaceholder`） | `SAppLayout`（双引擎 6 模式）                  |
| 页签原语     | aria `page-tabs`：root / item / close / pin / compact；ui `SPageTabs`                                                                                                                                                                                                                                                                           | `SAppMultiTab`（缺的是路由状态模型，不是原语） |
| 菜单族       | `SMenu` / `SNavMenu` / `SNavigationMenu` / `STreeMenu` / `SMenubar`                                                                                                                                                                                                                                                                             | `SAppMenu`                                     |
| 面包屑       | `SBreadcrumb` + `SDropdownMenu`（子级溢出可组合）                                                                                                                                                                                                                                                                                               | `SAppBreadcrumb`                               |
| 命令面板底座 | `SCommand`（fuzzy 过滤已内置，`useFuse` 在 aria）、`SCombobox`、`SDialog`                                                                                                                                                                                                                                                                       | `SAppCommandPalette`                           |
| 分栏         | `SSplitter`                                                                                                                                                                                                                                                                                                                                     | `SAppSplitPanel`                               |
| 空态/结果    | `SEmpty`；`SResult` 在 [roadmap.md](./roadmap.md) P1 计划中                                                                                                                                                                                                                                                                                     | `SAppEmptyState`、`SAppResult`                 |
| 主题         | `SThemeCustomizer`、`SThemeModeSelect`、`SThemeModeSwitch`                                                                                                                                                                                                                                                                                      | `SAppThemeDrawer`                              |
| 页脚         | `SLayoutFooter`（layout 插槽）                                                                                                                                                                                                                                                                                                                  | `SAppFooter`                                   |

**真正的缺口只有四类：**

1. **G1 模式编排**——一个 `mode` 同时驱动布局骨架与菜单挂载（侧栏 / 顶栏 / 混合 / 双栏 6 种形态），含折叠状态、双菜单挂载点、移动端断点联动。
2. **G2 统一导航模型**——菜单、面包屑、命令面板共用的导航树：规范化、`hideInMenu` 裁剪、激活项匹配、激活路径（面包屑）派生、混合模式一二级拆分。
3. **G3 多页签状态模型**——与路由无关的标签集合状态（打开/激活/关闭/固定/affix），vue-router 绑定属适配层。
4. **G4 小型复合与配方**——页头、Logo，以及命令面板/主题抽屉这类"组合即得"的配方。

## 3. Aria 准入总表（强制门）

准入依据 [layers.md R1–R8](../.agents/skills/vean-ui-develop/layers.md#aria-admission)。aria 零样式（连 `hidden` / `sr-only` 都不允许），UI 层不写任何 ARIA/键盘语义。

### 3.1 准入：3 项纯逻辑（无新 DOM 组件家族）

逻辑放 `packages/aria/src/shell/`（域模块，参照 AI 域 `src/ai/` 的做法），通过子路径 `@vean/aria/shell` 导出；可复用钩子同时从 `./composables` 导出。

|  #  | 准入项                                                                                                                                | 形态               | 为什么是 aria                                                                                                                                   |
| :-: | :------------------------------------------------------------------------------------------------------------------------------------ | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| H1  | `useMediaQuery(query)`                                                                                                                | composable         | matchMedia 订阅 + SSR 安全降级（无 window 时回退桌面态），是通用响应式原语，shell 与未来任何响应式组件共用。当前 aria 28 个 composable 中无此项 |
| H2  | shell 导航模型：`ShellNavNode` 类型 + 纯函数 `filterNavTree` / `findActiveTrail` / `splitNavLevels` + `useShellNav(nodes, activeKey)` | 纯 TS + composable | 数据规范化、权限/隐藏裁剪、最长前缀激活匹配、面包屑路径派生、混合模式拆树——全部是无样式、无 DOM 的数据变换                                      |
| H3  | `useTabs(items, options)`                                                                                                             | composable         | 标签集合状态：受控/非受控、激活、关闭（含最后一页保护）、固定/affix 规则；不 import vue-router，不碰 `<keep-alive>`（缓存策略由宿主决定）       |

### 3.2 拒绝准入：4 个 UI-only 复合组件

| 组件           | 理由（R1–R8 判定）                                                                                                                                                |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SLayoutShell` | 模式矩阵是**对已准入 layout 家族的组合配方**（LayoutCompact + Placeholder + 插槽 + mode 分支），不产生新的可访问性交互原子。样式（侧栏宽度、反色、顶栏分割）属 UI |
| `SShellMenu`   | 组合 `SNavMenu` / `STreeMenu` 到 shell 挂载点，模式分支数据来自 H2；自身无新键盘/ARIA 语义（由菜单族承担）                                                        |
| `SPageHeader`  | 面包屑 + 标题 + 操作区 + 返回按钮的版式复合，纯展示组装                                                                                                           |
| `SLogo`        | 图标 + 标题 + 折叠态，纯版式                                                                                                                                      |

> **Compact 下沉条款**：P1 收口时，若 `SLayoutShell` 的模式矩阵演化为稳定的数据驱动结构（迭代渲染默认内容而非纯插槽），按既有规则评估下沉为 aria `layout` 家族的 `LayoutShellCompact`。**只能扩展现有 layout 家族，不另立 `shell` 布局组件家族。**

### 3.3 不新建组件：复用或配方交付

- 页脚 → `SLayoutFooter` 插槽；分栏 → `SSplitter`；空态 → `SEmpty`；结果页 → 已在 [roadmap.md](./roadmap.md) P1 的 `SResult`。
- `SCommandPalette` / 主题抽屉 / 面包屑溢出 / router-tabs 适配 → 以文档示例 + 可选 vean 源码配方交付，不进库导出（见 §7.2）。
- 面包屑激活路径不新增组件：`useShellNav` 的 `activeTrail` 输出直接喂给既有 `SBreadcrumb`。

## 4. 架构决策

### 4.1 包结构（S1）：不新增包，逻辑走 shell 域模块

```
packages/aria/src/shell/
├── types.ts            # ShellMode / ShellNavNode / ShellTab / 派生结果类型
├── nav.ts              # filterNavTree / findActiveTrail / splitNavLevels（纯函数）
├── use-shell-nav.ts    # useShellNav（reactive 包装）
├── use-tabs.ts         # useTabs
└── index.ts            # @vean/aria/shell
packages/ui/src/components/layout-shell/   # SLayoutShell（UI-only 复合）
packages/ui/src/components/shell-menu/     # SShellMenu
packages/ui/src/components/page-header/    # SPageHeader
packages/ui/src/components/logo/           # SLogo
packages/ui/src/styles/{layout-shell,shell-menu,page-header,logo}.ts
```

依赖方向不变：**ui → aria**；shell 模块零 DOM 样式依赖，不引入 `vue-router`。

### 4.2 命名（S2）：统一 `S` 前缀

沿用核心库词汇，不使用 `App*`：`SLayoutShell`、`SShellMenu`、`SPageHeader`、`SLogo`。类型命名空间 `Shell.*`（`ShellMode`、`ShellNavNode`、`ShellTab`），不沿用 `App.*`。

### 4.3 模式词汇（S3）：沿用已验证的 6 模式

```ts
type ShellMode =
  | 'vertical' // 侧栏完整菜单
  | 'vertical-mix' // 侧栏一级（图标）+ 子面板二级
  | 'vertical-hybrid' // 侧栏一级 + 内嵌二级
  | 'horizontal' // 顶栏一级 + 弹出二级
  | 'top-sidebar' // 顶栏一级 + 侧栏二级
  | 'top-header'; // 顶栏混合 + 侧栏
```

`mode` 是 `SLayoutShell` 的单一编排输入，同步驱动布局骨架与 `SShellMenu` 形态；P0 只交付 `vertical` / `horizontal` 两种主模式跑通契约，其余 4 种 P1 跟进（避免一次性固化 6 套实现）。

### 4.4 导航模型（S4）：输入与路由无关

```ts
interface ShellNavNode {
  key: string; // 唯一键（路由场景可传 fullPath/routeName）
  label: string;
  icon?: string; // iconify 名称或渲染插槽键
  children?: ShellNavNode[];
  href?: string; // 链接型（组件库只负责渲染与激活匹配）
  disabled?: boolean;
  badge?: string | number;
  meta?: {
    hideInMenu?: boolean; // 裁剪但保留在激活匹配/面包屑中
    affixTab?: boolean; // 联动 useTabs 固定页签
    iconOnlyWhenCollapsed?: boolean;
    [key: string]: unknown;
  };
}
```

`useShellNav(nodes, activeKey)` 返回：

- `visibleTree`——裁剪后的渲染树；
- `flatMap`——id→node 索引；
- `activeTrail`——激活节点到根的路径（面包屑数据源）；
- `primaryLevels` / `secondaryOf(activePrimaryKey)`——混合模式一二级拆分结果。

### 4.5 响应式（S5）：useMediaQuery + 受控 isMobile

- `useMediaQuery('(max-width: 768px)')` 供组件与宿主共用；SSR 首屏按桌面态，hydrate 后切换，文档明确标注。
- `SLayoutShell` 的 `isMobile` 支持受控传入（宿主可接任意断点方案），非受控时内部用 `useMediaQuery(mobileBreakpoint)`。

### 4.6 多页签（S6）：状态在库，路由绑定在适配层

- `useTabs` 管理 `ShellTab { key, label, closable, pinned, affix }` 集合与打开/关闭/激活/固定规则；
- vue-router 适配（路由表 → tabs、afterEach 自动开页、affix 初始化、`<keep-alive :include>` 同步）以**文档示例**交付（`apps/docs/src/examples/` 或后续 vean 配方），库不因此新增路由依赖。

### 4.7 范围边界（S7）：ProTable / ProForm 不进本路线

schema 驱动的查询表格 / 表单依赖 table/form 引擎（v0.50.0 已完成 `@tanstack/vue-table` / `@tanstack/vue-form` 更换，另见 [ecosystem/table.md](./ecosystem/table.md)、[ecosystem/form.md](./ecosystem/form.md) 提案），不搭壳组件便车，避免 schema 过早固化。权限按钮含业务/指令语义，收录标准 S1–S5 不通过，列为范围外。

## 5. P0 — 主链路（5 项）

|  #  | 交付物                                                                          | 层                | 验收要点                                                                                                 |
| :-: | :------------------------------------------------------------------------------ | :---------------- | :------------------------------------------------------------------------------------------------------- |
|  1  | `useMediaQuery`                                                                 | aria composable   | 单测覆盖订阅/清理/SSR 回退；从 `./composables` 导出                                                      |
|  2  | shell 导航模型 + `useShellNav`（`ShellNavNode`、裁剪、激活匹配、`activeTrail`） | aria `shell` 模块 | 纯函数单测（嵌套、隐藏节点仍参与匹配、最长前缀）；`@vean/aria/shell` 子路径 + barrel/catalog 生成        |
|  3  | `SLayoutShell`（`vertical` + `horizontal`）                                     | ui 复合           | 复用 LayoutCompact/Placeholder；受控 `mode`/`isMobile`/`open`；零新增 ARIA；recipe 走 `scv()`            |
|  4  | `SShellMenu`（两模式）                                                          | ui 复合           | 消费 `useShellNav` 输出；侧栏折叠联动；顶栏挂载点渲染；键盘语义由菜单族保证                              |
|  5  | `SPageHeader`                                                                   | ui 单类/少槽复合  | 标题/描述/面包屑插槽/返回事件/操作区；同步从 [roadmap.md](./roadmap.md) 「延后市场」表移除 PageHeader 行 |

每个组件按 skill 流程交付：aria 单测 → ui 包装 → playground → docs 示例（en/zh）→ browser e2e（Tier 1）→ `gen catalog/api`。

## 6. P1 — 完整模式与页签（5 项）

|  #  | 交付物                                                                         | 说明                                                                                            |
| :-: | :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
|  6  | 其余 4 模式：`vertical-mix` / `vertical-hybrid` / `top-sidebar` / `top-header` | 一二级拆分（`splitNavLevels`）、侧栏/顶栏双挂载点、折叠态保持；Tier 2 shell 冒烟 e2e            |
|  7  | `useTabs` + 与 `SPageTabs` 的接线示例                                          | 库内纯状态 + 文档站 router 适配示例（开/关/固定/affix/keep-alive）                              |
|  8  | 面包屑派生落地                                                                 | `activeTrail` → `SBreadcrumb`；深层级溢出接 `SDropdownMenu` 的示例                              |
|  9  | `SLogo`                                                                        | 图标/标题/仅图标折叠态                                                                          |
| 10  | Compact 下沉评估（§3.2 条款）                                                  | 达标则在 aria `layout` 家族新增 `LayoutShellCompact`，ui 包装变薄；不达标保留 UI 复合并记录原因 |

## 7. P2 与范围外

### 7.1 P2 配方（2 项）

11. **命令面板配方**——`SDialog` + `SCommand`（fuzzy 已内置）组合，数据源即 `useShellNav().flatMap`；先以 docs 示例交付，出现稳定默认内容再评估收录为 `SCommandPalette`。
12. **主题抽屉配方**——`SDrawer` + `SThemeCustomizer` 的文档示例，不新增导出。

### 7.2 延后至 vean 组件市场（源码分发）

- 完整后台启动模板（壳 + router tabs 适配 + 菜单数据转换 + 主题初始化）以 **vean 源码配方**分发，不进 npm 包；
- 与业务数据耦合的壳变体（标签页右键菜单策略、多标签缓存策略等）。

### 7.3 范围外

- `SProTable` / `SProForm`：跟随已随 v0.50 落地的 table/form 引擎（`@tanstack/vue-table` / `@tanstack/vue-form`）与 [ecosystem/table.md](./ecosystem/table.md)、[ecosystem/form.md](./ecosystem/form.md) 提案；
- `SPermissionButton` / 权限指令：业务语义，应由宿主鉴权层实现；
- 通知中心、全局搜索后端、水印业务封装等应用级功能（`SWatermark` 等原子已在核心库）。

## 8. 旧 → 新迁移映射

| 旧 admin 分支（已删除）        | 新归属                        | 形态                                        |
| :----------------------------- | :---------------------------- | :------------------------------------------ |
| `SAppLayout`                   | `SLayoutShell`                | ui 复合（P1 评估下沉 `LayoutShellCompact`） |
| `SAppMenu`                     | `SShellMenu`                  | ui 复合                                     |
| `SAppLogo`                     | `SLogo`                       | ui 复合                                     |
| `SAppBreadcrumb`               | `SBreadcrumb` + `activeTrail` | 既有组件 + 数据接线                         |
| `SAppPageHeader`               | `SPageHeader`                 | ui 复合（P0）                               |
| `SAppFooter`                   | `SLayoutFooter`               | 既有插槽                                    |
| `SAppMultiTab`                 | `SPageTabs` + `useTabs`       | 既有原语 + aria 状态 + 适配示例             |
| `SAppCommandPalette`           | 命令面板配方（P2）            | docs 示例，待定是否收录                     |
| `SAppThemeDrawer`              | 主题抽屉配方（P2）            | docs 示例                                   |
| `SAppSplitPanel`               | `SSplitter`                   | 已有                                        |
| `SAppEmptyState`               | `SEmpty`                      | 已有                                        |
| `SAppResult`                   | `SResult`                     | 已在 roadmap.md P1                          |
| `SAppPermissionButton`         | —                             | 范围外                                      |
| `SAppProTable` / `SAppProForm` | —                             | 引擎已随 v0.50 落地，另见 table/form 提案   |

## 9. 实施顺序与里程碑

> 只定依赖顺序，不预设发布月份（历史路线图因绑死日期迅速过期）。v0.50.0 重构窗口已关闭，可按容量随时启动。

- **M1（aria 先行）**：H1 `useMediaQuery` → H2 导航模型与纯函数（先纯函数单测驱动）→ H3 `useTabs`；子路径 `@vean/aria/shell` 打通 + catalog/namespaced 生成。
- **M2（P0 组件）**：`SLayoutShell`（2 模式）→ `SShellMenu` → `SPageHeader`；playground + 双语 docs + Tier 1 e2e。
- **M3（P1 收口）**：4 个混合模式 + router tabs 示例 + 面包屑/Logo；Tier 2 shell 冒烟；Compact 下沉评估结论。
- **M4（配方）**：命令面板、主题抽屉示例；vean 壳配方登记。

## 10. 决策记录

| ID  | 决策                                                                                                                                                                                                                         |
| :-- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | 不新增包；壳逻辑放 aria `src/shell/` 域模块（`./shell` 子路径），组件在 ui，统一 `S` 前缀                                                                                                                                    |
| S2  | 不使用 `App*` / `App.*` 命名；采用 `SLayoutShell` 等核心词汇与 `Shell.*` 类型空间                                                                                                                                            |
| S3  | 6 模式词汇沿用 admin 分支已验证成果；P0 只交付 2 主模式，契约先行                                                                                                                                                            |
| S4  | 导航模型路由无关（`ShellNavNode` + href/key），vue-router 仅出现在文档适配示例                                                                                                                                               |
| S5  | 响应式由通用 `useMediaQuery` 承担，`isMobile` 可受控；SSR 桌面态回退                                                                                                                                                         |
| S6  | `useTabs` 只管标签集合状态；keep-alive/路由同步属宿主适配层                                                                                                                                                                  |
| S7  | ProTable/ProForm/权限按钮不搭车，分别由已落地的 table/form 引擎与各提案决策、或列范围外                                                                                                                                      |
| S8  | **修订（§11）**：四个 ui 复合组件合并为一个聚合组件 `SAppShell`；命名例外采用 `App*`（`SAppShell`、`app-shell`），不再新增 `SLayoutShell` / `SShellMenu` / `SPageHeader` / `SLogo`                                           |
| S9  | **修订（§11）**：AppShell 仅落 UI 层，H1–H3 aria 准入项本期不实现；`isMobile` 只受控、面包屑与页签为纯数据输入                                                                                                               |
| S10 | **修订（§11）**：模式词汇直接继承 `SplitNavMode`（4 值逐字复用）+ 两个单面板模式 `sidebar` / `top`；`AppShellMode ⊇ SplitNavMode`                                                                                            |
| S11 | **修订（§11.4）**：单面板模式归属 `SAppShell`，不并入 `SSplitNav`；两个模式名固定为 `sidebar` / `top`（评估过 `tree` / `nav` 与 `vertical` / `horizontal`）；`SSplitNav` 保留 4 个分栏模式与原名，改名属破坏性变更，本次不做 |

> ADR 状态：[ADR-0001 外围包单包分层](./adr/0001-peripheral-package-layering.md) 对 admin 域同样标记为 superseded；若未来出现真正独立的领域包提案，须新立 ADR 而非复用该模型。

## 11. 交付记录：AppShell（2026-09 修订）

§3–§9 的原始规划（aria shell 域模块 + 四个 ui 复合组件）在实施前被收窄为**一个 UI 层聚合组件**。本节记录实际交付与偏差依据。

### 11.1 实际交付

| 交付物             | 位置                                                                                                                                                                                   | 形态                                                                  |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| `SAppShell`        | `packages/ui/src/components/app-shell/`（`app-shell.vue` + 内部 `app-shell-menu.vue` + `shared.ts` + `types.ts`）                                                                      | UI 层聚合组件，模式驱动布局骨架 + 菜单渲染器                          |
| 样式配方           | `packages/ui/src/styles/app-shell.ts`                                                                                                                                                  | `scv()`，含注入给 `layoutVariants` 的 `layout*` 槽位                  |
| 分栏面板度量       | `packages/ui/src/styles/split-nav.ts` 的 `splitNavPaneMetrics`                                                                                                                         | rail/tree rem 数值导出，供侧栏宽度推导；单测断言与配方字面量同步      |
| 示例 / 文档 / 测试 | `apps/docs/src/examples/ui/app-shell/`、`content/{en,zh}/ui/components/app-shell.md`、`test/specs/components/app-shell.spec.ts`、`test/browser/specs/components/app-shell.e2e.spec.ts` | 7 个示例、双语文档、20 项单测、7 项浏览器 e2e（含侧栏几何与传送落点） |

### 11.2 偏差与理由

| 原始规划                                                         | 实际做法                                                                 | 理由                                                                                                                |
| :--------------------------------------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| H1 `useMediaQuery`（aria）                                       | 不做；`isMobile` 只接受受控属性                                          | `packages/ui` 运行时依赖白名单（`sui check deps`）不含 `@vueuse/core`；`isMobile` 受控与 `SLayout` 既有契约一致     |
| H2 shell 导航模型 + `useShellNav`                                | 不做；菜单为 `items` 数据输入，面包屑为 `breadcrumbs` 数据输入           | 激活路径/裁剪/拆分属逻辑，未建 aria 模块；宿主可从路由推导，后续可无破坏性下沉                                      |
| H3 `useTabs`                                                     | 不做；`tabs` 数组 + `v-model:tabs` + `v-model:tab-value`                 | 页签集合状态（关闭/固定/affix）由宿主决定，`SPageTabs` 已内置固定与右键菜单                                         |
| `SLayoutShell` / `SShellMenu` / `SPageHeader` / `SLogo` 四个组件 | 合并为一个 `SAppShell`，品牌区改为插槽注入；不提供 `SPageHeader`         | 一次编排即可覆盖全部能力，拆分为四个组件会重复传递同一份模式与折叠状态；页头未纳入范围                              |
| 6 模式词汇（S3）                                                 | 采用，且 4 个分栏模式**逐字复用 `SplitNavMode`**；新增 `sidebar` / `top` | 用户在 `SSplitNav` 学到的 4 个值在外壳中语义一致；`vertical`/`horizontal` 会与 `SLayout.orientation` 的反向语义撞名 |
| P0 只交付 2 主模式（S3）                                         | 6 模式一次性交付                                                         | 4 个分栏模式只是 `SSplitNav` 的委托 + 挂载点/宽度推导，分阶段反而会发布「类型允许但运行时不支持」的假契约           |

### 11.3 新增模式映射

| `AppShellMode`             | 一级位置 | 渲染器      | `SLayout.orientation` | 侧栏宽度                      | 品牌区 | 菜单挂载                       |
| :------------------------- | :------- | :---------- | :-------------------- | :---------------------------- | :----- | :----------------------------- |
| `sidebar`                  | 侧栏     | `STreeMenu` | `horizontal`          | 布局默认（240 / 50）          | 侧栏   | 就地                           |
| `top`                      | 顶栏     | `SNavMenu`  | `vertical`            | 无侧栏                        | 顶栏   | 就地                           |
| `dual-vertical`            | 侧栏     | `SSplitNav` | `horizontal`          | rail + tree / rail + 折叠面板 | 侧栏   | 就地（`dual-vertical` 独立块） |
| `vertical-horizontal`      | 侧栏     | `SSplitNav` | `horizontal`          | rail（`offcanvas` 折叠）      | 顶栏   | 传送：纵向→侧栏、横向→顶栏     |
| `horizontal-vertical`      | 顶栏     | `SSplitNav` | `vertical`            | tree / 折叠面板               | 顶栏   | 传送：横向→顶栏、纵向→侧栏     |
| `horizontal-dual-vertical` | 顶栏     | `SSplitNav` | `vertical`            | rail + tree / rail + 折叠面板 | 顶栏   | 传送：横向→顶栏、纵向→侧栏     |

侧栏宽度按 `size` 从 `splitNavPaneMetrics` 反推像素入参（`rem * 16 / themeSizeRatio[size]`），并由外壳统一注入的 `pxToRem` 换算回原 rem，从而与菜单面板逐像素对齐；浏览器 e2e 断言 `rail + tree === sidebar`。

### 11.4 决策：单面板模式不并入 SplitNav（S11）

评审时提出过一个替代方案：把 `sidebar` / `top` 也实现进 `SSplitNav`，让一个组件承载 6 种形态（并把它们命名为 `vertical` / `horizontal`），`mode` 词汇全库统一。**结论是维持现状**，理由如下。

1. **事件语义不同，不能共用一套状态机。** `SplitNavRoot` 的四个分栏模式共享 `openPath` + `firstLevelItems`/`childItems` 切片 + rail 注册表 + panes 焦点回退，并有一条硬语义：点有可见子节点的父级只展开面板并 `emit('open')`，不写 `modelValue`。`sidebar`（单棵嵌套树）里点父级应由 `TreeMenuCompact` 就地展开、不发 `open`；`top`（单条弹出菜单）连 `openPath` / rail 都不存在，`verticalMountedId` / `horizontalMountedId` / `collapsed` / `collapsedWidth` 全数失效。并入即意味着按模式分叉事件语义与"部分 prop 失效"的文档负担。
2. **两个模式是既有能力的别名。** `sidebar` ≈ `STreeMenu` 固定默认值，`top` ≈ `SNavMenu`；不新增任何能力，却让库内出现两条通往同一 DOM 契约的入口。而"单一 mode 词汇"的需求来自 `SAppShell` 只有一个 `mode` prop——需求属于 shell。
3. **命名会二次撞车。** `vertical` / `horizontal` 已是共享类型 `DataOrientation` 的字面量，且 `SLayout.orientation` 的 `horizontal`（侧栏满高）与"顶栏横向菜单"含义相反；同名不同义会把 AppShell 文档注意事项 1 的坑复制到菜单组件。`sidebar` / `top` 描述落点，无歧义。
4. **改名是破坏性变更而收益纯属命名。** `SSplitNav` 已随 0.40.1 发布，波及约 40 个手写文件（aria 家族 12 + ui 包装/配方 + 双语文档 + 迁移指南 + 7 个示例 + 2 个测试 + AppShell 三处）与生成物，并按 `process.md` 需要 `breaking` 说明与 en/zh 升级指南。

**若未来重新评估**：只有当 `SSplitNav` 的产品定位升级为"可独立分发的六形态后台导航组件"（而非 `SAppShell` 的零件）时，吸收单面板形态才值回成本；届时应同时选定中性名（避免 `AppMenu` 这类与 `SMenu` / `SNavMenu` / `SMenubar` / `STreeMenu` 家族无区分度的名字），并单独走破坏性变更流程。

### 11.5 交付后修复（2026-09-15）

评审发现三个问题，均已修复并补测试。

1. **布局根的裸 `group` 泄漏（跨组件）**：`layoutVariants` 的 root 是裸 `group` 且带 `data-orientation` / `data-state` / `data-variant`，而 CSS 的 `group-data-*` 是"任意匹配祖先"而非"最近祖先"，因此布局内部任何组件的裸 `group-data-[orientation=…]` 都会被布局根匹配。后果：`top` 模式下 `SNavMenu` 的列表被翻成纵向列（本次报告的问题 2），`horizontal-*` 模式的横向面板同样中招，侧栏折叠时 `data-state=collapsed` 还会污染内层树菜单的折叠样式。修复：布局根改为命名组 `group/layout`，并把 `layout.ts` 中 55 处 `group-data-…` 全部限定为 `group-data-…/layout`。这是**跨组件修复**（不改任何 API），受影响的其它族无需改动；未做的是反向清理——其它配方里仍有裸 `group-data-`，只要不再有"带同名 data 属性的通用祖先"就不会再撞。
2. **面包屑改为由菜单数据推导**：省略 `breadcrumbs` 时，外壳用 `items` + 激活值推导"根 → 激活菜单"的路径；其中每个自身有子菜单的上级渲染为下拉触发器，下拉项即该上级的子菜单（也就包含了激活项的同级），选中效果与点菜单一致（叶子发 `select` / `update:modelValue`，父级发 `open`）。显式传 `breadcrumbs` 仍是纯数据渲染，`#breadcrumb` 插槽可完全接管。实现落在 `app-shell/shared.ts` 的纯函数 `findMenuTrail` / `findMenuItem` / `hasVisibleChild`（`ui` 层，不新增 aria 模块）。
3. **分栏模式的侧栏宽度改为跟随面板**：原先按 mode+size 静态推导（`rail + tree` 恒定），导致激活无子菜单的一级菜单时仍保留一列空面板。现在 `resolveShellWidths` 按"面板当前是否存在"推导：`dual-vertical` / `horizontal-dual-vertical` 有子菜单时 `rail + tree`、否则仅 `rail`；`horizontal-vertical` 有内容时为 `tree`、否则为 `0`。侧栏折叠时只保留轨道，嵌套面板脱离文档流以浮层贴在轨道外侧（`ui.menuOverlay` + `menu-region data-overlay`），因此折叠状态下点另一个有子菜单的一级菜单仍能看到面板——与参考实现 `soybean-admin/src/layouts/modules/global-menu/modules/vertical-mix-menu.vue` 的 `hasChildMenus` 行为一致。代价：外壳需要镜像 `SSplitNav` 的 `openPath`（其内部状态），只镜像"面板归属的一级菜单 key"，并在 `modelValue` 变化时按 `SSplitNav` 自身的重置规则清空。

### 11.6 遗留项（未纳入本次交付）

1. **Compact 下沉评估**（§3.2 条款）：外壳的模式矩阵已是稳定数据表（`appShellSkeletons`），但默认内容仍由插槽注入，暂不满足下沉条件；如后续演化出数据驱动的默认内容，按既有规则只扩 `layout` 家族。
2. **H1–H3 的后续下沉**：三个 aria 准入项仍可按原规划实现，且能在不改动 `SAppShell` 公共 API 的前提下接管 `isMobile`、面包屑派生与页签集合状态。
3. **sbean 注册表登记**：`SAppShell` 未加入 `packages/cli/registry.json`（手工清单，83 条目）。外壳的源码分发需先定清 `registryDependencies`（layout / menu / split-nav / tree-menu / nav-menu / page-tabs / breadcrumb 等），否则 `sbean add` 会缺件；按 §7.2 在 sbean 组件市场配方阶段处理。
4. **上游组件发现（本次未修，属其他族）**：
   - `SPageTabs` 选中项为 `text-primary` on `bg-primary-50`，默认 indigo 调色板下对比度 3.99:1，低于 WCAG AA 4.5:1。
   - `SPageTabs` 关闭页签 / 切换 `pinned`（`usePageTabsState` 的 `removeTab` / `pinTab`）直接修改传入的 `items` 数组，不触发 `update:items`；只有 `removeTabs` / `sortTabs` 的赋值路径才 emit。
   - aria `layout` 的侧栏区域没有地标角色（`<main>`/`<header>` 有），因此侧栏插槽内容不被任何地标包含，axe `region` 规则会报错。
   - `SSplitNav` 的折叠面板宽度用固定 `px / 16`（`useSplitNavTreePane`），而嵌套 `STreeMenu` 的折叠宽度按 `size` 缩放，`size` 非 `md` 时面板会裁剪内部轨道。

### 11.7 交互整改：折叠时面板与侧栏同步（2026-09-17）

§11.5.3 的浮层方案在上手体验中被判定为不合理：侧栏折叠后，`data-soybean-split-nav-sub-vertical` 面板仍然渲染**展开的整棵树**（`dual-vertical` / `horizontal-dual-vertical` 里以浮层贴在轨道外侧，`horizontal-vertical` 里侧栏宽度归零、面板同样以浮层贴在内容左边缘），于是"折叠"看起来没有折叠——用户点折叠开关后仍能看到一棵完整的二级树。

**结论：面板改为跟随侧栏的折叠状态就地收折，浮层方案整体移除。** 三种含嵌套面板的模式（`horizontal-vertical` / `dual-vertical` / `horizontal-dual-vertical`）统一为：

1. 外壳把 `!open` 直接作为菜单的 `collapsed`（不再按模式分叉成"面板被抑制"），`SSplitNav` 原有能力即可让面板折成自己的图标栏（`data-state=collapsed`、宽度取 `--soybean-split-nav-tree-collapsed-width`）。
2. 侧栏宽度按"它真正渲染的列"推导：展开态 `rail + tree`（无轨道模式为 `tree`），折叠态 `rail + 折叠面板`（无轨道模式为折叠面板），无面板内容时只剩轨道。`resolveShellWidths` 的两个返回值各自描述自己的状态，由 `SLayout` 按 `data-state` 取值，外壳不必再把折叠状态镜像进数字，`AppShellPaneState` 因此只剩 `hasPane`。
3. 删除浮层机制：`ui.menuOverlay` / `ui.menuPaneHidden` 两个插槽、`menu-region` 的 `data-overlay`、`AppShellMenu` 的 `paneClass` 一并移除（同时删除已无用的 `modeHasNestedPane`）。

**为什么不用"折叠时隐藏面板 + 轨道飞行菜单"（Ant Design Pro 的 `mix` 折叠行为）**：`SplitNav` 的一级轨道项没有弹出层，隐藏面板会让有子菜单的一级菜单在折叠状态下彻底不可达，需要先在 aria 里新增一级飞行菜单；而"折叠树菜单"本就是本库既有能力（`sidebar` 模式的 `STreeMenu` 折叠态即图标轨道 + 叶子提示 + 父级浮层），复用它既无新增 API，也让四种分栏模式的折叠语义与单面板模式一致。

**已知落差**：与参考实现 `soybean-admin/src/layouts/modules/global-menu/modules/vertical-mix-menu.vue` 不再一致——参考实现的二级面板是"悬停/固定"抽屉，折叠态仍显示完整二级菜单（`hasChildMenus` + `mouseleave` 收起）。本库选择与自身 `sidebar` 模式的折叠语义对齐，代价是折叠后二级菜单只保留图标（更深层级靠浮层）。§11.6 第 4 条的 `SSplitNav` 折叠宽度不随 `size` 缩放的问题在此方案下更显眼（外壳按该变量逐像素预留，所以不会错位，但 `size` 较大时折叠面板内部可能偏挤）；修的时候应同时改 `useSplitNavTreePane` 与 `splitNavCollapsedPaneWidth`。

### 11.8 修复：`horizontal-dual-vertical` 侧栏列推导（2026-09-17）

§11.5.3 + §11.7 之后，`horizontal-dual-vertical` 暴露两个宽度错误，根因是**外壳用单个"最后激活的父级 key"猜测侧栏列**，而这个模式的侧栏列不在第一级：

1. 激活值为一级叶子（如 `Overview`）时，侧栏里其实既不渲染轨道也不渲染面板，但外壳按"`rail+pane` 恒有轨道"预留了 5rem 空列。
2. 点开一级父级（如 `Workbench`）时，侧栏轨道渲染其子级（`Projects` / `Tasks`），面板尚未打开，但外壳按"该父级有子级 → 预留 `rail + tree`"多留了 15rem 空列。

**修复方式：不再由外壳猜，而是把"某个模式下侧栏两列各自是否存在"变成 split-nav 家族导出的纯函数。**

- aria：新增 `resolveSplitNavLevels`（`useSplitNavDerived` 的纯函数内核：可见化 → 层级扁平化 → 按 `openPath` 优先、`selectionPath` 兜底选激活项 → 子级面板项）与公开的 `resolveSplitNavSidebarColumns({ mode, items, modelValue, openPath })`，按模式回答 `{ rail, pane }`：`dual-vertical` 为一二级、`vertical-horizontal` 只有轨道、`horizontal-vertical` 只有面板、`horizontal-dual-vertical` 为二三级。`useSplitNavDerived` 改为调用同一内核，渲染与推导**同源**，不再可能各自漂移。
- ui：外壳改为镜像 **`openPath` 路径**（`open` 事件 → `findMenuTrail` 得到完整路径；`modelValue` 变化时清空，与 `SplitNavRoot` 的重置规则同步），宽度由 `resolveShellWidths(size, columns, override)` 按 `rail + pane`（各自是否存在）算出。`AppShellSidebarComposition`（`default` / `rail` / `rail+pane` / `pane`）、`AppShellPaneState`、`modeHasNestedPane` 一并删除——模式表不再需要"侧栏构成"这一列，是否推导宽度只看 `splitNavMode !== undefined`。
- 验证：aria 新增 `split-nav-sidebar-columns.spec.ts`（四模式 × 叶子/展开态、隐藏子级、`isGroup` 扁平化共 9 例）；外壳单测新增三种 `horizontal-dual-vertical` 状态（一级叶子 0、展开一级父级 5rem、选中孙级 20rem）；浏览器 e2e 新增两条真实几何断言（一级叶子不占列、展开一级父级只有轨道列）。

**为什么不是外壳自行推导**：外壳若要自己算，就得复刻 `toVisibleOptions` / `flattenFirstLevelItems` / `findActiveInLevel` 及 `openPath → selectionPath` 的优先级——本轮的 1、2 两个 bug 正是"复刻走样"的结果。把推导放进 aria 后，宽度与渲染从构造上一致。**代价**：aria 新增一个公开纯函数（不涉及组件契约变更），外壳仍需镜像 `openPath`（这是"渲染前定宽"的固有代价，已在文档中写明）。

**同日追加修复：镜像 `openPath` 的信号不完整。** 在 `dual-vertical` 上复现出"展开 → 收起 → 再展开 → 再点同一个叶子却不收起"的偶发问题（文档示例 03-split-modes 的浏览顺序）。根因：`SplitNavRoot` 在**每一次激活**都会重写 `openPath = toOpenPath(items, value)`，而外壳只在两个信号上重置镜像——`open` 事件与 `modelValue` 变化。当用户重复激活"当前已激活的叶子"时，`modelValue` 不发生变化（受控模式下 host 写入同值不触发 prop 变化），于是菜单内部路径已清空、外壳却仍在预留面板列，表现为面板消失但空列不走。修复：`select`（叶子激活，路径为该叶子的祖先链）也写入镜像，并把 `mode` 变化加入重置信号（切换模式会重建菜单实例，其路径重新由 `modelValue` 起步）。两条回归守卫：单测 `folds the pane again when the active leaf is activated a second time`、`drops the mirrored open path when the mode changes`，浏览器 e2e `folds and unfolds the pane across a browse sequence`（真实几何，逐步断言 rail-only / rail+pane），全部在修复前失败、修复后通过。
