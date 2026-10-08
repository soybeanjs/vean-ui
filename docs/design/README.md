# design — 设计原理与设计交付

> 本目录收录框架**设计域**的契约与交付文档：主题引擎、维度刻度、Figma 设计资源导出。读者：主题维护者、设计维护者、组件作者、AI Agent。
> 导航入口见 [docs/README.md](../README.md)；目录规范见 [GOVERNANCE.md](../GOVERNANCE.md)。

## 索引

| 文档                                               | 定位                                                                                                      | 状态          |
| :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------ |
| [theme.md](./theme.md)                             | 主题引擎唯一权威：新旧引擎差异与优势 / token 契约 / 引擎 API / 运行时接线 / AI Agent 接入手册（§0）/ 验收 | 📌 常驻权威   |
| [space-control-scale.md](./space-control-scale.md) | 维度刻度契约：spacing / radius 两条刻度族的取值、实测依据，以及「什么不该成为刻度族」                     | ✅ 与代码同步 |
| [figma.md](./figma.md)                             | Figma 设计资源：`sui gen figma` 的 DTCG token 与组件取值词汇表导出、导入步骤与已知边界                    | ✅ 已实施     |

## 与其他目录的关系

- **roadmap/**：路线与规划评估组件取舍时，以本目录的 token / 刻度契约为准入依据。
- **research/**：主题相关的历史调研结论（如 nuxt 主题集成）在 `research/`，现状以 [theme.md](./theme.md) 为准。
- **info/**：主题引擎重构前的审计快照见 [info/theme-system-audit.md](../info/theme-system-audit.md)。
