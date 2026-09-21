# 项目结构与工程质量改进评估

> **评估时间：** 2026-09-06
>
> **适用版本：** `0.31.0`
>
> **详细架构：** [architecture.md](./architecture.md)
>
> **方法：** CodeGraph 1.5.0 全量代码图谱 + workspace 清单、配置、生成物与文档交叉校验
>
> **2026-09 注记：** 本评估反映 2026-09-06 基线（含 admin / chart / ui-x 共 9 个发布包、14 个子 workspace）。其后 `@soybeanjs/ui-x` 整包移除（AI 组件回归核心 aria/ui，见 [ui-ai-roadmap.md](./ui-ai-roadmap.md)），中后台壳方向亦明确为核心内领域（aria `src/shell/` + ui 复合组件，见 [ui-shell-roadmap.md](./ui-shell-roadmap.md)）；当前为 7 packages + 2 apps + skills 共 10 个子 workspace、6 个发布包（含 ui-skills）。下文中涉及外围包的包清单、构建链（`… → ui-x → …`）与生成路径均为当时事实，阅读时按此注记折算。

## 1. 结论摘要

项目的核心架构方向是成立的：

- Aria 与 Styled 两层职责清楚，编译期依赖保持为
  `@vean/ui → @vean/aria`。
- `useUiContext` 把视觉 token 注入与行为实现隔离，是高杠杆的深模块。
- `createTheme` 同时服务运行时主题和 UnoCSS 构建，避免两套 token
  生成逻辑。
- `vean`、组件包、文档站（含示例）、生成脚本均有明确用途。
- TypeScript 严格模式、119 个 UI 单测文件、16 个 vean 测试文件及
  browser e2e 已形成基础质量网。

当前主要风险不在组件目录是否“分得够细”，而在跨 workspace 的工程约束没有
完全机器化：

1. 若干直接依赖未在所属 workspace 声明，由 `shamefullyHoist` 掩盖。
2. PR CI 会构建全部发布包（`pnpm build`），但仍不构建文档站，也不校验生成物
   是否为同一批次。
3. docs 示例目录仍使用全量 eager glob（playground 已并入 docs，双向环已消除）。
4. 两个高影响接口缺少直接契约测试。
5. 文档、聚合索引和逐组件生成文件仍可能部分同步。
6. 仅 Nuxt 缺独立 typecheck，双语 Markdown 文件树也未保持同构。

建议先解决依赖闭包、CI 构建/生成一致性和发布包 smoke test，再进行目录拆分或
引入新的构建编排工具。

## 2. 评估基线

### 2.1 CodeGraph 覆盖

- 索引状态：最新。
- 文件：2,053。
- 节点：19,293。
- 边：55,503。
- 语言分布：1,121 Vue、926 TypeScript、4 YAML、1 JavaScript、1 TSX。
- Git 跟踪文件总数：2,730。未进入代码图谱的 Markdown、JSON、CSS、资源文件
  通过直接读取和内容检索校验。

### 2.2 当前规模

- pnpm 识别 15 个 workspace project：私有根项目、14 个子 workspace。
- 可发布包：5 个（aria、cli、theme、ui、unocss）。
- 私有包：2 个（scripts、shared）。
- 私有应用：2 个（docs、nuxt）。
- Aria：96 个目录、94 个公共组件入口、28 个 composable。
- UI：96 个公共组件组、144 个 `S` 前缀导出。
- Docs 示例：582 个示例 SFC（`apps/docs/src/examples`）。
- Browser e2e：11 个组件级 spec。

### 2.3 证据边界

以下结论区分为：

- **事实：** 由源码、manifest、配置、测试或 CodeGraph 关系直接证明。
- **推断：** 由事实导出的风险判断，需通过构建耗时、bundle 或独立安装实验量化。
- **未知：** 本次静态分析无法确定的运行时/生产数据。

本报告不会把“没有仓库内测试”写成“功能一定有 bug”，也不会在没有基准数据时
承诺某种构建工具能显著提速。

## 3. 已验证的架构优势

### 3.1 分层接口有深度

**事实：** CodeGraph 显示 `useUiContext` 被 67 个组件 context 调用，变更影响
68 个符号。调用方只需要学习 slot→class 接口，不需要了解样式 recipe 的实现。

**判断：** 这是高杠杆接口，不应拆散到各组件，也不应让 UI 层复制行为逻辑。
优化重点应是契约测试和类型收紧，而不是重写该 seam。

### 3.2 主题只有一个生成核心

**事实：** `createTheme` 同时被 UI `ConfigProvider` 与
`presetUi` 使用；CodeGraph 影响范围为 10 个符号，覆盖四份 UnoCSS 配置。

**判断：** 运行时与构建时共享生成器能降低 token 漂移。应补测试而非建立第二套
主题适配层。

### 3.3 组件交付面已有统一入口

**事实：** `packages/scripts/src/index.ts` 通过 `pnpm sui` 统一暴露 aria/UI 元数据、API、
changelog、locale、schema 和 skills 生成命令。

**判断：** 后续一致性检查应建立在该入口上，不需要再创建一套平行生成 CLI。

### 3.4 vean 的模块边界较清晰

**事实：** vean 将 commands、registry、schema、preset、templates、MCP 和
utils 分开，并有 16 个测试文件及 ADR。

**判断：** vean 已经接近“较小接口 + 较深实现”的结构。当前优先项是依赖声明、
打包验证和 ADR/manifest 对齐，而不是继续拆目录。

## 4. 发现与建议

## P0：优先处理

### F1. Workspace 依赖闭包不完整

**严重度：Major · 置信度：高**

**事实：**

- `pnpm-workspace.yaml` 设置了 `shamefullyHoist: true`。
- `packages/ui` 的运行时代码直接导入 `@vueuse/core`，但 UI manifest 未声明。
- `packages/cli/src/registry/config.ts` 运行时导入
  `@vean/theme`，但 vean manifest 未声明。
- `apps/docs` 直接使用 `@soybeanjs/colord`、
  `@vueuse/core`、`unocss`、`unocss-preset-animations`、
  `@soybeanjs/unocss-preset` 和 `@vean/unocss`，其中多项未在
  docs manifest 声明。
- `apps/nuxt` 的 UnoCSS 配置直接使用三项未声明 preset 依赖。

**推断：**

完整 monorepo 安装会因 hoist 和其他 workspace 的依赖而成功，但 filtered
install、隔离构建、发布 tarball 或不同包管理器消费时，可能出现模块解析失败。
这也让“删除一个看似无关依赖”产生跨 workspace 回归。

**建议：**

1. 为每个直接 import 补充所属 workspace 的 `dependencies` 或
   `devDependencies`；运行时 external 必须是 production dependency 或明确的
   peer dependency。
2. 对五个发布包（aria、cli、theme、ui、unocss）执行 `pnpm pack` 后在临时空项目中安装并 import 每个公共入口。
   （aria、cli、theme、ui、unocss）执行 `pnpm pack` 后在临时空项目中安装并 import 每个公共入口。
3. 为 docs、nuxt 分别执行 filtered install/build smoke test。
4. 完成闭包后再尝试关闭 `shamefullyHoist`；若暂时不能关闭，记录仍依赖 hoist
   的工具和原因。

**验收条件：**

- 直接依赖扫描无未声明项。
- 九个 tarball 在空目录中可安装并导入。
- 三个 app 可在仅安装其声明依赖的条件下构建。
- `shamefullyHoist` 不再是隐式依赖正确性的必要条件，或保留项有明确清单。

### F2. PR CI 未覆盖“可发布/可部署”

**严重度：Major · 置信度：高**

**事实：**

- PR CI 运行 typecheck、`pnpm lint`、unit test 和 browser e2e（browser tests
  为独立 `e2e` job），并在两个 job 中先执行
  `pnpm install --frozen-lockfile && pnpm build` 构建全部发布包。
- PR CI 仍不运行 `pnpm build:docs` 或发布包 smoke test。
- 根 `lint` 脚本包含 `--fix`，CI 后没有 `git diff --exit-code`。
- `v*` tag workflow 中会再次执行构建并发布。
- Tag release workflow 不重新运行 unit/browser tests，并使用
  `pnpm install --no-frozen-lockfile`。

**推断：**

- 类型和测试通过并不能证明 pack entry、CSS 产物、publishConfig、SSG 或 registry
  构建可用。
- lint 在 CI 中修复文件但未检查差异时，可能让未提交的格式修复通过。
- 构建问题可能到打 tag 后才暴露。

**建议：**

1. CI 使用非修改模式 lint；若工具只提供 fix 模式，则之后运行
   `git diff --exit-code`。
2. 保持 package build job 覆盖所有实际发布包（root `pnpm build` 已覆盖
   build:libs 与 aria/ui/ui-x/admin/chart/vean 六个目标，CI 已运行），
   关注其耗时与缓存。
3. 新增 docs SSG build smoke job。
4. 新增 tarball import smoke job，至少验证根入口、aria 子路径、UI CSS、
   Nuxt module、resolver 和 vean MCP/schema 入口。
5. Release publish 必须依赖已通过的 commit 检查，或在 publish 前重跑必要 tests；
   默认使用 frozen lockfile，确需可变安装时记录原因。
6. 对耗时 job 使用路径过滤和 pnpm store cache；先测量，再决定是否需要远程构建
   缓存。

**验收条件：**

- PR 上能发现 pack、CSS、SSG、exports 和缺失 runtime dependency 错误。
- CI 检查后工作树必须保持干净。
- tag workflow 只重复已在 PR 验证的构建，不首次发现构建错误。
- 发布使用的依赖图与已验证 lockfile 一致。

### F3. 生成物不是原子批次，已有可复现漂移

**严重度：Major · 置信度：高**

**事实：**

- `rating` 已从 aria/UI 根 barrel 导出，并有 docs 示例、单测、API JSON、
  changelog JSON 和 locale 文案。
- **已解决：** 此前 rating 在 API/changelog 聚合 index、docs 菜单、docs
  locale 与中英文组件 Markdown 的缺口均已补齐；生成输出现按包命名空间化
  （`generated/api/ui/rating.json`、`generated/api/ui-x/…` 等），不再使用扁平
  的 `generated/api/rating.json` 路径。
- 英文 Markdown 有 134 个、中文有 140 个，存在 6 个路径级差异：中文仅有
  `month-picker`、`month-range-picker`、`time-picker`、`time-range-picker`、
  `year-picker`、`year-range-picker`；此前 `input-number`/`number-input`
  命名分歧已解决。`DocMd` 按相同 path 切换 locale，剩余差异仍可能导致语言
  切换 404。
- **已解决：** `docs/roadmap.md` 与 `docs/components.md` 曾以不同 shipped
  计数为基线（87/88），现已统一；rating 的应用生成面缺口已消除。（`components.md`
  已于 2026-09 并入 `roadmap.md`，两文档手工双维护的根因随之消除。）
- **已解决：** API/changelog 生成器曾把当前时间写入 `generatedAt`，使“重新生成后
  git diff”不是确定性检查；现在写盘时会先与已提交内容比较，内容未变则保留原
  `generatedAt` 且不重写，生成因此完全确定性，可直接用 git diff 判定漂移。
- **已解决：** `release-execute` 曾只刷新 skills/changelog，不运行 `pnpm sui gen api`；
  现在发版链改用 `pnpm sui translate all`，它在翻译前会先刷新 api/changelog 生成数据
  （`gen api` 指纹命中时约 0.15s），API 新鲜度不再依赖人工记忆。

**推断：**

当前流程允许“逐组件文件更新、聚合 index/文档入口未更新”的半完成状态。时间戳
已不再是噪声来源（见事实），漂移判定可直接依赖 git diff。

**建议：**

1. **已提供：** `pnpm sui check generated` 重新生成全部生成面并与 git 对比，失败时
   列出漂移文件；`ci.yml` 已把它作为独立步骤（依赖上面的 `generatedAt` 与写盘确定性）。
2. 原子批次：生成器曾建议先写临时目录再整体替换。**未采纳：** 逐文件“内容未变则
   不重写”已能达到同样效果，且不需要临时目录。
3. **已解决：** 一致性比较中忽略 `generatedAt`，内容未变时保留原值（见 F3 事实）。
4. **已满足：** 确定性生成检查已进 PR CI；翻译不在 CI 中，`gen` 完全离线，
   不需要翻译服务凭据。
5. 增加 en/zh-CN 文件树集合差检查；先判定中文 picker 文件是兼容别名还是应删除，
   再统一 canonical path。
6. **已解决：** 见上方 `release-execute` 说明；发版前的 API 生成状态由
   `pnpm sui translate all` 的 prepare 阶段保证。
7. 组件完成清单中把“所有交付面集合相等”作为验收项，而不是若干独立人工步骤。

**验收条件：**

- 任何公共组件都不可能只出现在部分生成面。
- 同一源码和固定 epoch 连续生成两次无差异。
- 新增/删除公共组件但未补 docs 或 index 时，CI 给出具体缺失集合。
- 同一路径在 en/zh-CN 均存在，或被显式列为有 owner 的单语言例外。

## P1：近期治理

### F4. 私有 Apps 源码依赖（已收敛）

**严重度：Low · 置信度：高**

**事实：**

- playground 已删除，demo catalog（examples、排序规则、共享类型）与 docs 页面
  统一归 `apps/docs` 所有，docs/playground 双向源码环已消除。
- Nuxt fixture 已自包含（本地 `theme.ts` + 最小演示页），不再导入 docs 或
  playground 源码。
- `apps/docs/src/constants/globs.ts` 仍以 eager `import.meta.glob` 引入全部
  example SFC（见 F5）。

**建议：**

- 明确 Nuxt 是独立示例 fixture；补 locale 文件与可重复的 build smoke。
- 在 root task graph 中显式表达 docs 对 package build 的依赖。

**验收条件：**

- app 之间不存在源码级相互 import。
- Nuxt i18n 配置引用的文件可解析，且 fixture 有可重复的 build smoke。

### F5. Docs 构建图一次性 eager 引入过多源码

**严重度：Moderate · 置信度：高（影响量需测量）**

**事实：**

- Demo catalog 使用 eager glob 载入 582 个 Vue 示例及其 raw code。
- `generated-api.ts` 使用 eager raw glob 载入 aria 的 438 个 TS 文件和 UI
  的 297 个 TS 文件，共 735 个源码文件。
- `apps/docs/src/components/tables/generated-api.ts` 共 1,489 行，内部还包含
  TypeScript 文本解析、类型 registry、cache、preview model 和展示适配。

**推断：**

这会扩大 Vite/SSG module graph，并可能增加构建内存、构建时间和客户端 chunk。
本次没有运行 bundle analyzer，因此不宣称具体字节或性能损失。

**建议：**

1. 记录 docs build time、峰值内存、入口 chunk 与各 route chunk 基线。
2. Demo 按 component 生成 manifest，组件页面只加载对应示例；raw code 可独立
   lazy chunk 或构建时写入 JSON。
3. 把类型源码解析移到 `pnpm sui gen api`，生成 UI 直接消费的 normalized preview
   model。
4. 将 1,489 行模块收敛为三个深模块：
   - generated document loader；
   - build-time type normalizer；
   - presentation model/query interface。
5. 设置可解释的 docs build budget，避免示例数量增长与构建成本线性绑定。

**验收条件：**

- 组件详情路由不再 eager 引入全部 demo 与 735 份 raw TS。
- runtime/SSG 展示层不解析 TypeScript 声明文本。
- 基线指标和允许回归阈值写入 CI 或工程文档。

### F6. 高影响 seam 缺直接契约测试

**严重度：Moderate · 置信度：高**

**事实：**

- `createTheme` 影响 10 个符号，CodeGraph 找不到受影响测试。
- `packages/theme` 和 `packages/unocss` 无测试目录。
- `useUiContext` 影响 68 个符号；CodeGraph 能关联 7 个下游测试，但没有
  `use-ui-context` 的直接单测。
- Browser e2e 当前有 11 个组件级 spec（button、combobox、dialog、drawer、
  menu、menubar、nav-menu、select、split-nav、textarea、tooltip）；浮层、
  键盘导航和颜色对比场景仍按风险清单扩展。
- `packages/aria`（以及 ui-x/admin/chart）已定义 `vue-tsc --noEmit
--skipLibCheck` 的 workspace `typecheck` script；仅 `apps/nuxt` 仍未定义，
  递归 typecheck 不能证明它可作为独立单元通过。

**建议：**

- 为 `createTheme` 增加 CSS 合约测试：light/dark selector、size/radius、
  preset override、菜单/feedback token 和格式输出。
- 为 `presetUi` 增加 preflight/preset 组合测试，并覆盖
  `resetCSS/globalCSS/uiCSS` 开关。
- 为 `useUiContext` 增加 slot/full-map、响应式更新、默认空值和 provider
  缺失行为测试。
- 为 Nuxt 增加独立 typecheck（aria 已具备 `vue-tsc` 门禁）或等价
  集成检查。
- 按浮层/focus/keyboard 风险清单扩展 browser e2e，不按组件数量平均铺测试。

**验收条件：**

- 高影响 seam 的行为由小而稳定的直接测试锁定。
- Theme/UnoCSS 改动能在 package 级测试失败，而不是依赖下游人工发现。
- Browser e2e 优先覆盖平台 API 和真实焦点行为。
- 根递归 typecheck 覆盖每个需要独立发布或验证的 workspace。

### F7. 构建图与 workspace 依赖图未完全对齐

**严重度：Moderate · 置信度：高**

**事实：**

- 根 `pnpm build` 已覆盖 build:libs（theme → unocss）与 aria → ui →
  ui-x → admin → chart → vean。
- UI CSS 构建依赖 unocss；UI runtime 又依赖 theme。
- 根 `vite.config.ts` 已有部分 Vite Plus task dependency，但 package scripts
  未统一通过该图执行。

**推断：**

根 build 已包含 build:libs 前置；但绕过根 build 直接执行包级脚本时仍可能
复用旧 dist，构建顺序知识仍部分泄漏给调用者。

**建议：**

- 选择一个现有编排入口作为单一事实源：pnpm 拓扑递归或 Vite Plus task graph。
- 保持 `build` 覆盖所有发布包，并由依赖图推导顺序。
- `build:docs` 和 Nuxt smoke 应依赖相同 package build
  任务。
- 先采集构建 profile；只有现有增量机制不足时再评估 Turbo 等额外系统。

**验收条件：**

- 从 clean checkout 执行一个根 build 命令即可得到所有发布产物。
- 修改 theme 后无需人工记忆额外前置命令。
- 同一依赖顺序不在 package.json 和 Vite Plus config 重复维护。

### F8. TypeScript 声明版本与实际锁定版本分裂

**严重度：Moderate · 置信度：高**

**事实：**

- 此前的 TypeScript 声明版本冲突已消除：manifest 现按两个 catalog 显式
  拆分——`catalog:` 请求 `^7.0.2`（theme、shared、vean、unocss），
  `catalog:ts6` 锁定 `^6.0.3`（其余多数包）。
- lockfile 按分组分别解析为 `6.0.3` 与 `7.x`，与声明一致。

**推断：**

版本分裂已从“隐性 override”变为“显式双轨”，属有意设计；但仓库仍同时运行
两个 TypeScript 主版本，升级验证与工具链兼容性（Vue/TypeDoc/Vite Plus）需
按分组分别确认。

**建议：**

- 记录 `catalog:ts6` 分组的收敛条件，逐步把其余包迁移到 TypeScript 7 后删除
  该分组。
- 增加一个 toolchain report/check，输出 Node、pnpm、TypeScript、vue-tsc、
  Vite Plus 和 Vitest 实际版本。

**验收条件：**

- manifest、catalog 和 lockfile 对有效 TypeScript 主版本表达一致（已满足）。
- 双轨分组有原因、owner 和删除条件。

## P2：持续改进

### F9. 类型逃逸与书面约束不一致

**严重度：Minor · 置信度：高**

**事实：**

- 生产源码中至少有 28 行 `as any` / `@ts-expect-error` / `@ts-ignore`
  匹配，分布于 17 个文件：aria 19 行、UI 4 行、vean 5 行。
- 根 AGENTS 把新增这些写法列为 anti-pattern；部分 scoped 文档曾把例外描述为
  单一文件，但实际不止一个。

**建议：**

- 建立现有例外清单，记录原因和可移除条件。
- CI 采用“禁止新增”基线，而不是在一次重构中强行清零。
- 优先处理公共泛型默认值、DOM style 索引和 schema JSON 三类可复用问题，
  通过 typed helper 集中复杂度。
- 测试 mock 中的 escape 与发布源码分开统计。

**验收条件：**

- 每个发布源码例外都有局部说明或被 typed helper 替代。
- 新 PR 不增加未解释的 escape。

### F10. 文档事实有多个手写副本

**严重度：Minor（已造成实际漂移） · 置信度：高**

**事实：**

- 组件数、composable 数、CI、hook 和版本信息散布在多个 README、AGENTS、
  roadmap/check/components 文档。
- 本轮更新前的 README 曾记录 95/25/91，实际为 96/28/96 groups + 144 exports。
- Hook 实际来源是 `.vite-hooks/pre-commit`，不是 simple-git-hooks；本轮已修正根
  AGENTS 与 component skill。
- `packages/aria/src/composables/AGENTS.md` 的 25 hooks 与唯一
  `@ts-expect-error` 描述也已在本轮按 28 个实际导出修正。
- 本轮发现的本机绝对 `file:///Users/...` 文档链接已替换为仓库相对链接。

**建议：**

- 数量由 generated constants 或专用 metadata JSON 生成，README 只引用。
- 架构事实集中在 `docs/architecture.md`；评估集中在本文件；组件方法论集中在
  component skill。
- 增加 Markdown link check，并禁止仓库文档出现 `file:///Users/`。
- release 只更新一个版本源，其他文档不硬编码，或由脚本同步。

**验收条件：**

- 自动检查能发现计数、版本、hook 命令和绝对本机链接漂移。
- 每类事实只有一个权威来源。

### F11. 覆盖率策略尚未量化

**严重度：Enhancement · 置信度：高**

**事实：**

- UI 提供 `test:coverage`，但仓库配置未定义项目级 coverage threshold。
- 不同模块风险差异很大：纯 recipe、DOM/focus、theme generator、CLI 文件更新
  不适合使用同一目标解释。

**建议：**

1. 先保存当前 package/目录级基线。
2. 对新增代码采用 diff coverage；对高影响纯函数/生成器设更高目标。
3. Browser e2e 以关键行为清单作为门禁，不用 line coverage 替代。
4. 不直接采用缺乏基线依据的统一“80%”阈值。

**验收条件：**

- coverage 目标能对应具体风险，并有逐步提升计划。
- 不因低价值 wrapper 行数挤占高价值行为测试投入。

## 5. 推荐执行顺序

### 阶段 A：依赖与发布安全（1–2 周）

1. 完成 direct dependency audit。
2. 添加九个 package 的 pack/install/import smoke。
3. 将 CI lint 改为非修改检查并验证 clean tree。
4. PR CI 已包含 package build；补 docs SSG build。
5. 为 Nuxt 增加独立 typecheck（aria 已具备），并收紧 release
   lockfile/test gate。

### 阶段 B：生成一致性（1–2 周）

1. 让 API/changelog 生成可确定重放。
2. 实现公共组件交付面集合校验。
3. 修复当前 Rating 的 index/menu/docs 缺口。
4. 对齐 en/zh-CN canonical 文件树。
5. 在 CI 中阻断部分生成状态。

### 阶段 C：高影响 seam（2–4 周）

1. 增加 theme、UnoCSS preset、`useUiContext` 直接测试。
2. 扩展真实浏览器场景（浮层、键盘导航、颜色对比）。
3. 统一 root build dependency graph。

### 阶段 D：Docs 可扩展性（需要基准数据后）

1. Demo catalog 分组件 lazy load。
2. 将 raw TypeScript 解析迁移到 API generator。
3. 明确 Nuxt fixture 所有权并补齐 locale/build smoke。
4. 建立 docs build/bundle budget。

## 6. 不建议立即执行的方案

- **不建议立即引入 Turbo。** 仓库已经有 pnpm 和 Vite Plus task 能力；先统一现有
  构建图并测量瓶颈。
- **不建议自动生成所有 barrel。** 目前 barrel 是有意维护的公共接口，生成脚本
  从它派生 metadata。应校验遗漏，而不是让目录结构自动决定公共接口。
- **不建议为两个消费者立刻新建 shared package。** 先把 demo catalog 所有权
  保持在 docs 内；出现第二个稳定消费者后再提包。
- **不建议用统一覆盖率数字代替风险测试。** Focus、Teleport、keyboard 和
  package exports 需要行为/安装测试。
- **不建议把现有类型 escape 一次性全部重写。** 先禁止新增并按可复用问题簇收敛。

## 7. 未知项与后续量化

本次静态分析尚不能确定：

- Docs eager glob 对最终客户端 JS、SSG 峰值内存和构建时间的具体影响。
- CI 各 job 的实际耗时分布和缓存命中率。
- 发布 tarball 在 npm、pnpm strict、Yarn PnP 下的真实兼容情况。
- 关闭 `shamefullyHoist` 后仍需兼容的第三方工具限制。
- Nuxt i18n 在缺少本地 locale fixture 时的实际 fallback/错误行为。

在选择缓存系统、拆包策略或性能目标前，应先完成以下基线：

- clean/cached package build time；
- docs SSG build time、峰值内存、route chunk 大小；
- 九个 tarball 的独立安装矩阵；
- package/目录级 unit coverage；
- browser e2e 场景与耗时清单。

## 8. 完成定义

本轮建议全部落地后，项目应满足：

- 每个 workspace 的 manifest 构成真实依赖闭包。
- PR CI 同时证明“能检查、能测试、能打包、能构建文档”。
- 公共组件的代码、metadata、API、changelog、docs、demo 集合自动一致。
- 示例目录所有权单一且在任务图中可见。
- 高影响深模块有直接契约测试。
- 构建与文档规模增长有可观察指标，而不是靠人工感觉判断。
