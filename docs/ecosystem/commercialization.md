# Vean 生态商业化策略（editor / table / form）

> 本文档针对 `@soybeanjs/editor`（富文本/块编辑器）、`@soybeanjs/table`（高级数据网格）、`@soybeanjs/form`（Schema 驱动表单）三个外围生态包，基于市场与商业先例调研，给出**分生态的商业化方向（每生态 3–5 个）**与横向执行建议。
>
> 事实依据：完整调研见 [research/commercialization-ecosystem.md](../research/commercialization-ecosystem.md)（先例定价/许可一手核实；该报告自 2026-09 起只保留调研事实与来源清单）；editor 的 Tiptap 收费边界见 [editor.md](./editor.md) §1.1；table/form 的 Pro 能力边界见 [table.md](./table.md) 与 [form.md](./form.md)。
> **本文档是分生态商业化方向与横向建议的唯一来源**（2026-09 起，research 报告中的同名小节已收敛至此）。
> 状态：**策略建议**（非执行承诺）。所有方向需先经需求信号验证（GitHub issue/讨论、企业询单）再立项。
>
> **2026-09 前提变更：** 本文写于 editor/table/form 为「外围独立包」的规划时期；当前仓库无外围包（`@soybeanjs/ui-x` 已移除，AI 流式能力 `useStream` / `SSender` 改在核心 aria/ui 实现，见 [../ui-ai-roadmap.md](../roadmap/ui-ai-roadmap.md)；`@soybeanjs/admin` 已取消，壳方向见 [../ui-shell-roadmap.md](../roadmap/ui-shell-roadmap.md)）。下文市场调研、定价先例与免费/付费边界结论仍然有效；包结构、lockstep 发布、跨包依赖等设定失效，商业化载体（核心内能力 / 独立增值包 / vean 付费条目 / 模板资产）须在立项时按 [README §立项时必须回答的问题](./README.md#立项时必须回答的问题) 重新决策。

## 0. 总原则

1. **核心永久 MIT**：`@vean/aria` / `ui` / `theme` 与外围包的基础能力保持宽松许可（对齐 Ant Design「MIT 永久免费」[官方](https://ant-design.antgroup.com/docs/react/sponsor-cn)）。
2. **付费 = 高级能力（Pro 包）/ 托管服务 / 企业服务 / 模板资产 / AI 用量**，且**付费能力独立成包或独立子路径**（`*-pro` 或 `*/pro`），与 MIT 源码分离，避免破坏「MIT = 干净」的品牌。
3. **尽早明确免费/付费边界**：Handsontable 从 MIT 转专有（2018）与 Tiptap 移除免费云档（2025-06，二手）均引发社区反弹——从立项第一天就在 README/文档写明边界，并承诺已开源能力永久免费。
4. **license key 本地校验（不联网）**：参考 Handsontable「build-date vs key-date」本地校验 [文档](https://handsontable.com/docs/15.1/react-data-grid/license-key)，成本低、离线可用、隐私友好；配合 vean registry 分发。
5. **中国市场特化是差异化**：私有化部署、信创适配（麒麟/统信/国产化浏览器）、等保/个保法合规、发票/合同流程、source escrow——国外竞品服务不好，是本土空白（参考 [Univer 案例](../research/commercialization-ecosystem.md) §2.10）。

## 1. 商业化先例速览

| 先例                            | 免费层                             | 付费层                                         | 核心付费点                                                                                |
| :------------------------------ | :--------------------------------- | :--------------------------------------------- | :---------------------------------------------------------------------------------------- |
| AG Grid                         | Community（MIT）                   | Enterprise $999/开发者，Bundle $1,498          | 分组/透视/服务端行模型/导出/图表/AI（[定价页](https://www.ag-grid.com/license-pricing/)） |
| Tiptap                          | 编辑器 MIT                         | Cloud Start $49 / Team $149 / Business $999 月 | 托管协同/转换/AI/官方 UI（[定价页](https://tiptap.dev/pricing)）                          |
| Handsontable                    | Hobby 非商业免费                   | Standard $999 / Priority $1,299 / 开发者       | 支持/维护/SLA/escrow（功能全开）（[购买页](https://dev.handsontable.com/pricing)）        |
| Syncfusion                      | Community（收入<$1M 且 ≤5 人）     | JS $995 / Essential Studio $2,495 / 年         | 1,600+ 控件 + 更新 + 支持（[官网](https://www.syncfusion.com/jquery-ui-widgets)）         |
| Jotform                         | Starter 免费（5 表单/100 提交/月） | Bronze $34 / Silver $39 / Gold $99 / 月        | 托管表单 + 提交数 + 存储（[定价](https://www.jotform.com/pricing/)）                      |
| Retool                          | Free                               | Team $12/构建者/月 + $7/用户                   | App 构建 + AI credits（[定价](https://retool.com/pricing)）                               |
| Keenthemes                      | —                                  | Solo $99 / Team $299 一次性                    | 后台模板源码（[官网](https://keenthemes.com/products/metronic-composer)）                 |
| Element Plus / Naive / TanStack | MIT                                | 赞助商位 + GitHub Sponsors                     | 品牌曝光 + 小额赞助（规模有限）                                                           |

> 核心结论：**「免费核心 + 付费高级能力/托管/服务」是被市场反复验证的模型**；收费的恰恰是难做、可量化、面向企业级场景的能力（协同、转换、服务端模型、导出、AI）——见 [research/commercialization-ecosystem.md](../research/commercialization-ecosystem.md) §1。

---

## 2. `@soybeanjs/editor` 商业化方向

技术定位：Tiptap（MIT 内核）+ 自建 Vue 3 + UnoCSS UI 层（详见 [editor.md](./editor.md)）。

### E1 · Editor Pro 高级能力模块订阅（对标 Tiptap Pro 扩展）

- **目标客户**：SaaS 中嵌入富文本/文档编辑的中型及以上团队（知识库、CMS、协作工具、HR/法务文书）。
- **价值主张**：基础编辑器 MIT 免费；Pro 提供「协作（Y.js/Hocuspocus）、DOCX/PDF 转换、修订跟踪、目录/数学/拖拽增强」等难做能力，一次集成。
- **定价建议**：类 Tiptap 按开发者席位或项目订阅（如 $49/$149/$999 三档），或一次性 per-project（$500–$5,000）。
- **免费边界**：`SEditor`/`SEditorToolbar`/`SEditorBubbleMenu`/图片上传/Markdown 双向等 P0–P1 能力 MIT（[editor.md](./editor.md) §2.4）；Pro = 协同/转换/修订跟踪/AI 等 P2+。
- **风险**：Tiptap 官方同类能力已定价且 2025-06 起收紧（免费云计划移除 [二手](https://eddyter.com/blogs/tiptap-vs-quill-2026)）；用户可能直接用 Tiptap Cloud——以「Vue3 + UnoCSS + 中文 + 免费 UI 层」差异化。

### E2 · Editor Cloud 托管协作服务（对标 Tiptap Cloud）

- **目标客户**：不想自建协同后端的开发者/SaaS 团队。
- **价值主张**：Y.js + Hocuspocus 托管协同、文档存储、历史版本、评论通知、Webhook——按需付费，免运维。
- **定价建议**：按「Cloud 文档数 + 连接数 + 开发者席位」订阅（参考 Tiptap Start $49 → Business $999/月）；**本地文档不计入配额**（复制 Tiptap 计费口径 [FAQ](https://tiptap.dev/docs/pricing)）。
- **免费边界**：本地单机编辑器免费；只有托管文档/协同连接计入配额。
- **风险**：云基础设施运营成本高（SLA/数据驻留/合规）；**建议先做企业自托管版（on-prem）再上云**，规避合规与带宽成本。

### E3 · AI 写作/编辑功能订阅（对接核心 AI 流式能力 `useStream` / `SSender`）

- **目标客户**：内容密集型产品（文档、博客、客服、法务）团队。
- **价值主张**：AI 续写/改写/翻译/摘要/校对；免费集成点（slash 命令 + 流式渲染，复用核心库 `SSender` / `useStream`）；**BYOK（自带 key）免费档 + 托管 AI 档**。
- **定价建议**：BYOK 免费（参考 Novel [二手](https://eddyter.com/blogs/tiptap-alternative)）；托管 AI 按 credits/月（参考 Retool），如 $19/$49/$199/月；AI Toolkit 级（面向 Agent 的文档读写）联系销售。
- **免费边界**：AI 交互组件 MIT；**模型调用与用量**付费。
- **风险**：AI 成本 pass-through 难定价（防滥用）；OpenAI/各家 SDK 降价竞争；合规（内容安全、个保法）在中国是硬要求。

### E4 · 企业定制集成 + 专业支持服务

- **目标客户**：政企、知识库/CMS 厂商、需深度定制（自定义块、业务 schema、私有化）的团队。
- **价值主张**：实施、定制扩展开发、a11y/性能优化、培训、SLA 响应、私有化部署支持。
- **定价建议**：实施项目一次性 $5k–$50k（第三方「Tiptap 定制 UI build $20,000、维护 $2,400/年」[二手](https://eddyter.com/blogs/tiptap-vs-quill-2026)）；年维护合同 = 首年费用 20%–30%（参考 DevExpress 续费率形态 [官网](https://www.devexpress.com/products/net/controls/winforms/)）。
- **免费边界**：全部编辑器组件 MIT；**服务与定制产物**付费。
- **风险**：人力密集型、规模化难；需建立可复用定制模板/预设库摊薄成本。

### E5 · 行业模板/预设市场（编辑器壳产品）

- **目标客户**：需要「开箱即用编辑器页面」的中小团队、模板买家。
- **价值主张**：简历编辑器、合同/文书编辑器、Markdown 文档、博客写作台、政务表单文书等**行业化预设 + 中文排版主题**，配 `SEditor` 一键嵌入。
- **定价建议**：单模板 $19–$99、全量包 $199–$299 一次性（参考 Keenthemes Metronic $99–$299 [官方](https://keenthemes.com/products/metronic-composer)）。
- **免费边界**：通用 preset（basic/docs/full）MIT；行业化模板/主题为付费资产（可走 vean registry 付费条目，见 §5.3）。
- **风险**：模板市场利润低、易被复制；靠「持续更新 + 与主题 token 深度集成」维持付费意愿。

---

## 3. `@soybeanjs/table` 商业化方向

技术定位：基于核心 `STable` 自建内核的 Pro 级数据网格（详见 [table.md](./table.md)）。**硬约束：不得套壳 AG Grid / Handsontable 等商业内核再分发**（AG Grid 许可禁止 [ecommerce](https://www.ag-grid.com/ecommerce/)）。

### T1 · Table Pro 高级功能模块（对标 AG Grid Enterprise gating）

- **目标客户**：数据密集型产品（金融、ERP、BI、运营中后台）与需要百万行渲染的团队。
- **价值主张**：在 `STable` 之上提供**分组/聚合、树形、服务端行模型、透视、Excel 导出、单元格范围选择/公式**等企业级能力；免费版做基础排序/过滤/分页/编辑（对标 AG Grid Community）。
- **定价建议**：**每开发者 $499–$999 + 部署许可**（参考 AG Grid Enterprise $999、Bundle $1,498）；或按项目一次性 $1k–$5k；多开发者阶梯折扣（参考 DevExpress 5%/10%/15%）。
- **免费边界**：`STable` + 基础表格能力 MIT；Pro = 分组/透视/服务端行模型/导出/AI 等。
- **风险**：自建内核成本极高（虚拟滚动/服务端模型/透视是硬骨头）；**Pro 边界先从较易的导出/树形/分组切入，逐步加码**。

### T2 · Table Cloud 托管数据服务（远期）

- **目标客户**：不想自建服务端分页/排序/过滤/实时推送的团队。
- **价值主张**：托管数据代理层（sort/filter/paginate/virtualization on server）+ 实时数据推送（WebSocket）+ 权限审计；表格组件免费，云端数据服务付费。
- **定价建议**：按 QPS/月 或 行数/月 或 连接数 订阅（参考 Retool 用量计价 [官网](https://retool.com/pricing)）。
- **免费边界**：组件 MIT；**数据服务与带宽/存储**付费。
- **风险**：表格是纯前端组件，托管数据服务需强后端能力，超出组件库团队基因；建议远期，优先做 on-prem 数据服务（企业内网）契合政企。

### T3 · 企业性能与定制服务（对标 Handsontable 付费支持）

- **目标客户**：已用免费版但有性能/合规诉求的政企客户。
- **价值主张**：不 gate 功能、gate **支持与维护**：大表性能优化、定制渲染器、专属支持通道、代码评审、source escrow、SLA。
- **定价建议**：Standard $999/开发者·年 → Priority $1,299 → Enterprise 定制（含 SLAs、escrow、CSM）。
- **免费边界**：全部功能 MIT；**支持/维护/安全补丁/escrow** 付费。
- **风险**：中国团队对「为支持付费」接受度低（更愿为功能付费）；需绑定合规（等保、信创、私有化）抬升付费价值。

### T4 · 行业套件包（金融/供应链/BI 中后台预配置）

- **目标客户**：金融、供应链、政务、电商等有固定表格形态的行业团队。
- **价值主张**：预配置列方案、行情/财务/权限渲染器、行业字段字典、导出版式、主题——围绕 `STable` 的行业化「盒装表格」。
- **定价建议**：行业包一次性 $999–$4,999 + 年维护。
- **免费边界**：通用表格能力 MIT；行业套件/渲染器资产付费（可走 registry 付费条目）。
- **风险**：行业碎片化、需持续跟进法规/字段变化；先聚焦 1–2 个高付费行业（金融/政务）验证。

### T5 · AI 数据网格（对标 AG Grid AI Toolkit）

- **目标客户**：报表/BI 与运营分析团队。
- **价值主张**：自然语言→查询/聚合、AI 洞察生成、异常标注、智能列建议、MCP Server 集成（参考 AG Grid AI Toolkit [官方](https://www.ag-grid.com/landing-pages/enterprise-data-grid/)）；复用核心 AI 流式能力。
- **定价建议**：AI credits/月 或并入 Table Pro 高级档。
- **免费边界**：AI 交互组件 MIT；**模型调用与用量**付费。
- **风险**：AI 分析与数据安全在政企场景敏感（数据不出域）；大厂（Copilot/各家 BI）挤压。

---

## 4. `@soybeanjs/form` 商业化方向

技术定位：Schema 驱动高级表单 + 查询表单（详见 [form.md](./form.md)）。

### F1 · 托管表单设计器 SaaS（对标 Jotform + Formily Designable）

- **目标客户**：需要「可视化设计 + 托管收集 + 通知/存储」但不想要重型低代码平台的团队与非技术运营。
- **价值主张**：拖拽表单设计器（基于 `SForm` + Schema）→ 生成 JSON Schema → 前端用 `@soybeanjs/form` 渲染；托管提交存储、邮件/Webhook 通知、统计、电子签名对接；**开源内核免费，托管服务付费**。
- **定价建议**：按「表单数 + 提交数 + 存储」订阅：Free（5 表单/100 提交）→ $19/$49/$99/月（参考 Jotform Bronze/Silver/Gold [官网](https://www.jotform.com/pricing/)）；Enterprise 定制（SSO/SLA/数据驻留）。
- **免费边界**：`SForm`/`useForm`/Schema 渲染 100% MIT；设计器（若做成 Pro 能力）与**托管服务**付费。
- **风险**：SaaS 运营重（存储/通知/合规/防滥用）；国内已有问卷星/金数据等——差异化在**面向开发者/低代码集成**而非大众问卷。

### F2 · Form Pro 高级能力模块

- **目标客户**：复杂表单（多步、动态增删、条件联动、跨字段校验）的开发者。
- **价值主张**：Pro = 复杂联动引擎增强、动态渲染优化、可视化校验规则构建器、自动生成代码/TS 类型、布局（FormGrid/分组折叠）——对标 Formily 的深度，以**类型安全 + Vue3 一等公民 + 中文生态**差异化。
- **定价建议**：订阅 $49–$299/月（按席位）或一次性 per-project。
- **免费边界**：基础 Schema 渲染 + 常见组件映射 MIT；Pro = 联动/动态/设计器/代码生成。
- **风险**：Formily（MIT）能力覆盖深、社区强——需在类型安全 + Vue3 + 中文上做深护城河。

### F3 · 企业表单/低代码集成服务（BPM/后台联动）

- **目标客户**：政企、需要「表单 + 审批流 + 后台管理」一体的团队（与中后台壳领域联动，见 [../ui-shell-roadmap.md](../roadmap/ui-shell-roadmap.md)）。
- **价值主张**：将 `SForm`/`useForm` 与后台壳（`SLayoutShell`）、工作流引擎集成，交付「业务表单应用」；含权限、审计、私有化部署。
- **定价建议**：项目制 $10k–$100k + 年维护；或「表单+表格+后台」生态企业订阅（参考 Syncfusion Project License $495/月 [datasheet](https://syncfusion.info/wp-content/uploads/2026/01/Project-License-Datasheet-Limited-plan-FINAL.pdf)）。
- **免费边界**：组件 MIT；**集成方案、工作流适配、私有化交付**付费。
- **风险**：项目制重、交付周期长；需样板工程（starter kit）降低重复成本。

### F4 · 行业表单方案包（政务申报/金融 KYC/HR 入职/供应链）

- **目标客户**：有固定合规表单形态的行业团队。
- **价值主张**：预置表单模板 + 校验规则 + 合规字段（个保法/等保/KYC）+ 中文场景化组件（身份证、银行、发票、地址联动）。
- **定价建议**：行业包 $499–$2,999 一次性 + 年维护。
- **免费边界**：通用表单能力 MIT；行业模板/校验库/合规组件付费。
- **风险**：法规变动需持续维护；模板易被复制（registry 付费 + 授权条款可部分缓解）。

### F5 · AI 表单生成与智能校验（横切付费点）

- **目标客户**：希望「一句话建表 / 从数据库 Schema 自动出表单」的团队。
- **价值主张**：自然语言/字段清单 → 生成 JSON Schema + 校验规则 + 联动；AI 校验规则补全、错误提示润色、自动填充组件选择——复用核心 AI 流式能力。
- **定价建议**：AI credits/月 或并入 Pro 档（参考 Retool [官网](https://retool.com/pricing)、Jotform AI Agent）。
- **免费边界**：生成结果渲染 MIT；**模型调用与用量**付费。
- **风险**：AI 生成 Schema 的可信度（需人工复核兜底）；与低代码大厂（钉钉宜搭等）竞争。

---

## 5. 横向执行建议

### 5.1 许可与双轨发布

- **付费能力独立包/子路径**：`editor-pro` / `table-pro` / `form-pro`（或同包 `*/pro` 子路径），与免费包同 lockstep 版本但**源码分离**（私有 registry 或遮蔽），付费逻辑不混入 MIT 包。
- **license key 本地校验**（不联网）：参考 Handsontable 机制，配合 vean registry 分发。
- **CI 依赖审计**（延续 editor.md §6 的 OPT-F1 思路）：免费包 CI 强制检查依赖闭包不含付费内核（`ag-grid-enterprise`、`@tiptap/pro-*`），防止免费包误绑定付费能力与许可风险。
- **双轨维护承诺**：免费包社区节奏；付费包 SLA（响应时效、安全补丁、支持窗口 12–24 个月）。

### 5.2 vean registry + 付费内容分发

- 现有 registry 已命名空间化（当前仅有 `ui/*`；未来外围包按 `<package>/*` 扩展，见 [cli.md](./cli.md)）。扩展两级模式：
  - **免费条目**：`vean add <ns>/<name>` 直接拉源码。
  - **付费条目**：`type: "registry:ui-paid"` + 元数据（price/license/支持窗口），`vean add` 时触发 license key 本地校验；可复用 Zeta + Polar「registry + 自动发 key」思路 [GitHub](https://github.com/rbadillap/zeta/)。
- **文档站付费内容区**：docs 命名空间下新增 Pro 徽章 + 免费 vs 付费 feature matrix（参考 AG Grid Community vs Enterprise 对比 [官方](https://www.ag-grid.com/landing-pages/enterprise-data-grid/)），公开透明。
- **注意**：付费条目源码进用户仓库后防拷贝极难（shadcn 模型下用户本就「拥有代码」）——**付费点放在托管服务/支持/AI 用量/持续更新承诺**，而非单纯卖源码。

### 5.3 企业服务三步走

1. **阶段一（0→1）**：赞助商位 + 模板市场（Metronic 式 $99–$299 一次性）+ 早期企业询单定制——验证付费信号。
2. **阶段二（1→10）**：Pro 能力订阅（每开发者/月 或 项目一次性）+ license key；积累付费用户支持 SLA。
3. **阶段三（10→100）**：托管服务（Editor Cloud / Table Cloud / 表单 SaaS）与 AI credits——复用核心 AI 流式能力，边际成本可控。

### 5.4 定价与生态联动

- **美元 + 人民币双轨**：国内开发者对美元订阅敏感，人民币 + 发票合规是采购门槛。
- **三档结构**：社区免费 / 小团队 Pro / 企业年订阅（参考 Tiptap Start/Team/Business）。
- **生态全家桶**：editor/table/form 三个 Pro 可打包「生态企业订阅」（类似 Syncfusion Essential Studio $2,495 或 Project License $495/月 [官网](https://www.syncfusion.com/jquery-ui-widgets)），提高客单价与留存。

### 5.5 风险与合规

- **法律**：不基于第三方商业内核套壳再分发；editor 仅用 Tiptap MIT 部分、勿抄官方付费 UI 组件（[editor.md](./editor.md) §2.4）。
- **市场**：免费替代品（TanStack、el-table-v2、Formily、Lexical/BlockNote）活跃——付费产品必须有**性能/类型安全/Vue3 一等公民/中文生态/合规**上的真实差距。
- **运营**：托管与 AI 用量成本侵蚀利润——用「免费额度 + 用量上限」防滥用（参考 Jotform 提交上限）。
- **信任**：商业化宣传透明（README 放「商业版 vs 免费版」对比表），先开源后商业，收益反哺开源维护，形成正循环（TanStack ethos [官方](https://tanstack.com/ethos)）。

---

## 6. 参考来源

- 本策略的事实依据与全部 URL 见 [research/commercialization-ecosystem.md](../research/commercialization-ecosystem.md)（§5 参考来源）。
- 关键官方页面：AG Grid [定价](https://www.ag-grid.com/license-pricing/) · Tiptap [定价](https://tiptap.dev/pricing) · Handsontable [购买](https://dev.handsontable.com/pricing) · Syncfusion [官网](https://www.syncfusion.com/jquery-ui-widgets) · Jotform [定价](https://www.jotform.com/pricing/) · Retool [定价](https://retool.com/pricing) · Keenthemes [Metronic](https://keenthemes.com/products/metronic-composer)。
- 仓库内既有资料：[editor.md](./editor.md)（Tiptap 收费边界）· [table.md](./table.md) · [form.md](./form.md) · [cli.md](./cli.md)（registry 命名空间化）。
