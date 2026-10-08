# 调研报告索引（research）

> 本目录存放市场 / 竞品调研的**原始结论**，作为领域提案与商业化策略的事实依据。每份调研应基于一手来源（官方文档 / 许可页 / 定价页 / GitHub），并内联引用来源 URL；无法核实的事实须标注「未验证」。
>
> **2026-09 注：** 这些调研写于 editor/table/form 为「外围独立包」的规划时期；当前仓库无外围包，报告作为**时点快照**保留，结论与定价事实仍有效，包结构前提请按各文头注与 [../ecosystem/README.md](../ecosystem/README.md) 折算。
>
> 治理规则见 [../GOVERNANCE.md](../GOVERNANCE.md)；导航入口见 [../README.md](../README.md)。

## 索引

| 报告                                                               | 领域                         | 日期       | 结论摘要                                                                                                                                  |
| :----------------------------------------------------------------- | :--------------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| [table-ecosystem.md](./table-ecosystem.md)                         | 高级表格 / 数据网格          | 2026-08-14 | Vue 生态缺「Headless 高级网格 + 服务端数据源抽象」；ProTable `request`+`valueType` 是黄金标准                                             |
| [form-ecosystem.md](./form-ecosystem.md)                           | Schema 驱动高级表单          | 2026-08-14 | Vue 生态「schema 驱动 + 自动渲染」空白；Standard Schema v1 已是事实标准                                                                   |
| [commercialization-ecosystem.md](./commercialization-ecosystem.md) | editor/table/form 商业化     | 2026-08-14 | 「免费核心 + 付费高级层/托管/服务」是验证过的模型（分生态方向已迁至 [ecosystem/commercialization.md](../ecosystem/commercialization.md)） |
| [nuxt-theme.md](./nuxt-theme.md)                                   | Nuxt UI 主题系统（技术调研） | 2026-09-09 | Nuxt UI v4 主题四层结构与 Theme Studio 分享链接机制；与 [theme.md §6.3](../design/theme.md) 方案对比                                      |

## 调研 → 落地的链路

```
research/（原始调研）──► ecosystem/（领域提案；形态待评估）──► commercialization.md（变现策略）
        ▲                                                  │
        └──────────────────────────────────────────────────┘
        （方案与策略须回链到调研出处，保证事实可溯源）
```

## 编写约定

1. 命名：领域/商业化调研用 `<领域>-ecosystem.md`（如 `table-ecosystem.md`）；针对上游或竞品具体实现的技术调研用 `<主题>-<技术>.md`（如 `nuxt-theme.md`）。
2. 结构：结论摘要 → 逐库/逐先例分析 → 能力对比表 → 共性与差距 → 参考来源。
3. 每条事实内联 `[来源](URL)`；定价/许可类信息标注核实状态与日期。
4. 完成调研后：登记本索引，并在 [ecosystem/README.md](../ecosystem/README.md) 关联对应方案文档。
