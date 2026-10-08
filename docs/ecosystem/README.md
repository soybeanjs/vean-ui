# Vean 领域提案与生态工具链

> 本目录存放**未来领域提案**（editor / table / form / ui-pro）、商业化策略建议，以及 vean 源码分发工具链文档，是 [roadmap.md](../roadmap/README.md)「领域扩展路线」的展开。
>
> **现状（2026-09）：仓库不包含任何外围 npm 包。**
>
> - AI/chat 与中后台壳已确定为**核心内领域**，在 `@vean/aria` + `@vean/ui` 内实现，分别见 [ui-ai-roadmap.md](../roadmap/ui-ai-roadmap.md) 与 [ui-shell-roadmap.md](../roadmap/ui-shell-roadmap.md)。
> - `@soybeanjs/ui-x`（2026-09 移除）、`@soybeanjs/admin` / `@soybeanjs/chart`（v0.40.0 取消）均不再存在；图表改为文档站基于 [TanStack Charts](https://tanstack.com/charts) 的 shadcn 风格示例（`apps/docs/src/examples/chart/`）。
> - 下列提案写于「外围包单包自治」时期，**包形态、lockstep、跨包白名单等前提已不适用**：每个提案立项时必须先做形态决策（并入核心 ui / 独立包 / vean 源码配方，三选一），必要时新立 ADR。调研结论与竞品分析仍然有效。
>
> 导航：docs 总入口见 [../README.md](../README.md)；调研依据见 [../research/README.md](../research/README.md)；文档治理规范见 [../GOVERNANCE.md](../GOVERNANCE.md)。

## 文档索引

| 文档                                           | 方向                             | 状态               | 说明                                                                                             |
| :--------------------------------------------- | :------------------------------- | :----------------- | :----------------------------------------------------------------------------------------------- |
| [editor.md](./editor.md)                       | 富文本编辑器（Tiptap，MIT 边界） | 提案（调研已完成） | 内核 peer 策略、工具栏/斜杠命令、AI 集成点                                                       |
| [table.md](./table.md)                         | 高级数据网格 / ProTable          | 提案（调研已完成） | 表格内核已于 v0.50.0 更换为 `@tanstack/vue-table`；服务端数据源/查询/分页/编辑/列管理            |
| [form.md](./form.md)                           | Schema 驱动高级表单              | 提案（调研已完成） | ISchema 渲染层 + 组件注册表 + 声明式联动/查询表单                                                |
| [ui-pro.md](./ui-pro.md)                       | 增值 / 高级组件                  | 探索性预留         | 收录标准（S1–S5）与前缀候选；与商业化一并评估                                                    |
| [commercialization.md](./commercialization.md) | 增值订阅 / 托管服务 / AI 用量等  | 策略建议           | editor/table/form 方向的商业化选项与执行节奏；AI 流式能力引用以核心 `useStream` / `SSender` 为准 |
| [cli.md](./cli.md)                             | 源码分发 CLI / registry / MCP    | 核心功能已落地     | 多命名空间 registry 与多包落地路径的通用机制（当前 registry 仅含 `ui` 命名空间）                 |

## 当前分层（无外围包）

```
Layer 3  样式组件层      @vean/ui（S 前缀；AI、shell 领域组件加入此层）
Layer 2  无头逻辑层      @vean/aria（唯一逻辑层；/ai、/shell 域模块加入此层）
Layer 1  主题与样式引擎  @vean/theme · @vean/unocss
横切     源码分发与文档  @vean/cli（CLI / registry / MCP，非运行时依赖）
```

依赖铁律：**ui → aria 单向**；aria 零样式；ARIA / 键盘语义不出 aria。[ADR-0001](../adr/0001-peripheral-package-layering.md) 的「单包自治外围层」模型已对 ui-x / admin 全部 superseded，仅作为未来若再出现独立领域包时的历史参考。

## 立项时必须回答的问题

任一提案启动前，需给出书面决策：

1. **形态**：并入核心 aria/ui（须过 aria 准入 R1–R8）、独立 npm 包（须新立 ADR，不能默认复用 ADR-0001），还是仅以 vean 源码配方分发？
2. **重依赖**：Tiptap / 表格内核等是否作为 peer / optional peer，核心库依赖树不被强绑定。
3. **命名**：核心内实现统一 `S` 前缀；独立包需论证独立前缀（历史 `Sx`、`S`+`App*` 均已废止）。
4. **vean 接线**：若产出可分发组件，registry 按 `<namespace>/<component>` 登记，核心 `ui` 裸名免前缀。

## 术语

| 术语                            | 含义                                                                                           |
| :------------------------------ | :--------------------------------------------------------------------------------------------- |
| 核心内领域（in-core domain）    | 通过 aria 准入、逻辑在 `aria` 域模块、样式组件在 `ui` 的领域（当前：AI/chat、中后台壳）        |
| 领域提案（domain proposal）     | 本目录中 editor / table / form / ui-pro 等方向调研，落地形态待立项决策                         |
| 包装型组件（wrapper component） | 基于核心原子组件组合出的复合组件（如壳路线的 `SShellMenu` 组合 nav/tree 菜单族）               |
| 命名空间 registry item          | vean registry 条目的 `<namespace>/<component>` 形式（当前全部为 `ui/*`；核心 `ui` 裸名免前缀） |
