# docs — 项目文档中心

> 本文档是 `docs/` 目录的**唯一导航入口**：说明目录分层、各类文档的定位与索引，并指向维护规范。
> 文档更新规范、命名约定与版本控制机制见 [GOVERNANCE.md](./GOVERNANCE.md)。
>
> `apps/docs/` 是**用户文档站**（组件 API/示例/多语言内容，独立于本目录），不在本索引范围。

## 目录分层

```
docs/
├── README.md            # 本文档：导航入口
├── GOVERNANCE.md        # 文档治理：更新规范 / 命名 / 版本控制
├── architecture.md      # 工作区架构（唯一架构真相源）
├── optimize.md          # 工程质量评估（F1–F11 改进项与验收，2026-09-06 基线）
├── roadmap/             # 路线与规划
│   ├── README.md        # 总路线图 + 组件评估明细（核心组件 / 核心内领域 / 未来提案 / 优化）
│   ├── ui-ai-roadmap.md     # AI/chat 组件路线图（核心 aria/ui 内实现）
│   └── ui-shell-roadmap.md  # 中后台壳组件路线图（核心 aria/ui 内实现）
├── design/              # 设计原理与设计交付
│   ├── README.md        # 设计域索引（theme / 刻度 / figma）
│   ├── theme.md                 # 主题引擎唯一权威文档（token 契约 + 引擎 API + 接入手册 + 验收）
│   ├── space-control-scale.md   # 维度刻度契约：spacing / radius 取值与实测依据
│   └── figma.md                 # Figma 设计资源：DTCG token + 组件取值词汇导出
├── adr/                 # 架构决策记录（ADR）
│   ├── README.md        # ADR 索引与模板
│   └── NNNN-*.md
├── agents/              # AI Agent 协作约定（issue / triage / 领域文档）
│   └── README.md        # 约定索引
├── ecosystem/           # 未来提案（editor / table / form / ui-pro / cli / 商业化）
│   └── README.md        # 提案索引（主入口；包形态待立项评估）
├── research/            # 市场/竞品调研报告
│   └── README.md        # 调研报告索引
└── info/                # 一次性 / 周期审计与报告
    └── README.md        # 报告索引与归档规则
```

## 文档分类速查

| 分类           | 文件                                                                                                  | 定位                                                                                                                                    | 典型读者                     |
| :------------- | :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| **架构与质量** | [architecture.md](./architecture.md) · [optimize.md](./optimize.md)                                   | 仓库现状真相源 + 工程质量评估                                                                                                           | 架构师、新成员               |
| **主题引擎**   | [theme.md](./design/theme.md)                                                                         | 唯一权威：新旧引擎差异与优势 / token 契约 / 引擎 API / 运行时接线 / 验收（首帧见 §6.3、为何没有对比度护栏见 §4.3）                      | 主题维护者、架构师、AI Agent |
| **维度刻度**   | [space-control-scale.md](./design/space-control-scale.md)                                             | ✅ 与代码同步：spacing / radius 两条刻度族的取值、与 UnoCSS 的关系、实测覆盖率，以及"什么不该成为刻度族"（字面量全表见 theme.md §3.11） | 主题维护者、组件作者         |
| **设计交付**   | [figma.md](./design/figma.md)                                                                         | ✅ 已实施：`sui gen figma` 的产物清单 / 分组结构 / Figma 变量导入步骤 / 投影决定与已知边界（token 契约见 theme.md）                     | 设计维护者、前端维护者       |
| **路线与规划** | [roadmap.md](./roadmap/README.md)                                                                     | 总路线图 + 组件评估明细                                                                                                                 | 规划者、贡献者               |
| **核心内领域** | [ui-ai-roadmap.md](./roadmap/ui-ai-roadmap.md) · [ui-shell-roadmap.md](./roadmap/ui-shell-roadmap.md) | AI/chat 与中后台壳组件的回迁规划（aria 准入）                                                                                           | 组件开发者                   |
| **决策记录**   | [adr/](./adr/README.md)                                                                               | 架构决策（含已 superseded 的外围包分层 ADR）                                                                                            | 架构师                       |
| **Agent 协作** | [agents/](./agents/README.md)                                                                         | issue 流程 / triage 标签 / 领域文档消费约定（根 AGENTS.md 在此路由）                                                                    | 维护者、AI Agent             |
| **未来提案**   | [ecosystem/](./ecosystem/README.md)（editor / table / form / ui-pro / cli / 商业化）                  | 方向调研；落地形态（核心内 / 独立包 / vean 配方）立项时评估                                                                             | 规划者、生态开发者           |
| **调研报告**   | [research/](./research/README.md)                                                                     | 市场/竞品调研原始结论                                                                                                                   | 规划者                       |
| **一次性报告** | [info/](./info/README.md)                                                                             | 周期审计、同步/适配报告                                                                                                                 | 维护者                       |

## 核心文档关系图

```
roadmap/README.md（组件路线图 + 评估明细）◄──► optimize.md（工程质量评估）
                  ▲
                  │
    roadmap/ui-ai-roadmap.md · roadmap/ui-shell-roadmap.md（核心内领域，遵循 aria 准入）
                        │
                        ▼
        ecosystem/（未来提案）◄── research/（调研依据）
                        │
                        └── adr/（决策固化；过期决策标记 superseded）
```

> 依赖方向：**调研/评估（源）→ 方案/路线（规划）→ 决策（固化）**。设计原理（theme / 刻度 / figma 交付）是规划与评估共用的契约层，单独归档于 design/。任务拆解与状态跟踪不设常驻文档，按需要使用临时计划 / issue；已完成或已取消的历史规划不在 docs 保留（可经 git 历史追溯）。新增文档时按此链路落位，避免「多份手工副本」漂移（对应 optimize.md F10）。

## 常用查询路径

- **「某组件要不要做 / 排期如何」** → [roadmap.md](./roadmap/README.md)（高/中/低优先级 + 组件评估明细）
- **「AI 对话组件怎么做」** → [ui-ai-roadmap.md](./roadmap/ui-ai-roadmap.md)
- **「后台壳 / 多模式布局 / 菜单 / 多页签怎么做」** → [ui-shell-roadmap.md](./roadmap/ui-shell-roadmap.md)
- **「v0.50.0 升级怎么迁移 / 旧 API 对照」** → 文档站升级指南（`apps/docs/src/content/{en,zh}/ui/migration/v0.50.0.md`，入口在 `/releases` 页）
- **「这个组件该不该做 aria / 哪些家族已判定合规」** → skill [layers.md Aria admission](../.agents/skills/vean-ui-develop/layers.md#aria-admission)（含违规形态与已合规对照表）
- **「为什么没有外围包了」** → [adr/0001](./adr/0001-peripheral-package-layering.md)（superseded 说明）+ 两份领域路线图
- **「editor/table/form 等提案现状」** → [ecosystem/](./ecosystem/README.md)
- **「issue 怎么提 / triage 标签怎么打」** → [agents/issue-tracker.md](./agents/issue-tracker.md) · [agents/triage-labels.md](./agents/triage-labels.md)
- **「词汇表 / ADR 怎么维护」** → [agents/domain.md](./agents/domain.md)
- **「竞品/市场依据」** → [research/](./research/README.md)
- **「质量改进项」** → [optimize.md](./optimize.md)
- **「主题怎么改 / token 怎么加 / 代码在哪 / 有什么禁区」** → [theme.md](./design/theme.md)（§0 是 AI Agent 接入手册）
- **「刷新时主题闪一下怎么解决 / SSR 与 SSG 主题差异」** → [theme.md §6.3](./design/theme.md)
- **「主题 token 怎么设计 / 该参照哪个组件库 / 为什么这么分层」** → [theme.md](./design/theme.md)
- **「主题引擎重构前有哪些问题 / 当时的实测数据」** → [info/theme-system-audit.md](./info/theme-system-audit.md)（重构前快照，现状以 [theme.md](./design/theme.md) 为准）
- **「间距 / 控件高度该用哪个值 / 刻度为什么这么定」** → [space-control-scale.md](./design/space-control-scale.md)（§3.1 为什么控件高度不是刻度族）
- **「设计资源怎么来 / token 怎么导进 Figma 变量 / 导进去颜色不对」** → [figma.md](./design/figma.md)（§3 导入步骤、§4 投影决定、§5 已知边界、§6 排查）

## 命名规范（摘要）

完整规范见 [GOVERNANCE.md](./GOVERNANCE.md)：

- **根目录**：仅保留跨领域、被全局引用的核心文档（架构 / 质量评估 / 治理）。
- **子目录**：按领域归类（roadmap / design / adr / agents / ecosystem / research / info），每子目录必带 `README.md` 索引。
- **文件名**：`kebab-case`；带序号的（ADR `NNNN-`、检查报告 `CXX-`）必须左对齐补零。
- **迁移**：移动/重命名文档必须同步更新全部交叉引用（见 GOVERNANCE §3）。
