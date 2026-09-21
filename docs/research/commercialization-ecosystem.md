# SoybeanJS 三大生态包商业化调研报告

> **调研目的**：为 `@soybeanjs/editor`（富文本/块编辑器）、`@soybeanjs/table`（高级数据表格）、`@soybeanjs/form`（Schema 驱动表单）三个外围生态包寻找可落地的商业变现方向。
> **调研日期**：2026-08-14（本地时区 Asia/Shanghai）。所有价格/许可信息基于 2025–2026 年公开资料核实，**价格可能随时变动**，下文对每条事实均标注来源与「已核实/待核实」状态。
> **方法**：以 WebSearch + WebFetch 抓取一手来源（官方定价页、许可页、公司官网、GitHub 官方仓库）；二手来源（第三方对比文、行业综述）仅作佐证并明确标注。
>
> **2026-09 注**：下文引用的 `@soybeanjs/ui-x` / `SxSender` / `use-x-stream` 已随 ui-x 包移除，AI 流式能力改为核心 headless/ui 的 `useStream` / `SSender`（见 [../ui-ai-roadmap.md](../ui-ai-roadmap.md)）；`@soybeanjs/admin` / `SAppLayout` 亦已取消，中后台壳方向改为核心内 shell 领域（见 [../ui-shell-roadmap.md](../ui-shell-roadmap.md)）；editor/table/form 的独立包前提同步失效（见 [../ecosystem/README.md](../ecosystem/README.md)）。调研结论与定价事实不受影响，引用按此折算。**分生态商业化方向与横向建议自 2026-09 起收敛到 [ecosystem/commercialization.md](../ecosystem/commercialization.md)，本报告只保留调研事实（§1–§2）与来源清单（§5）**，见 [§3](#3-分生态商业化方向) 的迁移映射。

---

## 1. 调研范围与结论摘要

### 1.1 结论摘要（TL;DR）

1. **「免费核心 + 付费高级能力」是最被验证的组件库商业模式**：AG Grid（社区 MIT / 企业版 $999 每开发者）、Handsontable（非商业免费 / 商业 $999）、Tiptap（编辑器 MIT / Cloud $49–$999 月）三个最接近 Vean 定位的先例全部采用此模型，且**「收费的恰恰是那些难做、可量化、面向企业级场景的高级功能」**——协同、文档转换、服务端渲染、AI、导出。
2. **三个生态中，editor 的变现路径最清晰**（直接对标 Tiptap Cloud / Pro 扩展），**table 的变现天花板最高**（对标 AG Grid，$999/开发者、对 Fortune 500 渗透），**form 的差异化机会在「托管表单设计器 SaaS + 低代码联动」**（对标 Jotform/Retool 与 Formily Designable）。
3. **商业化必须与「开源免费边界」严格切割**：Vean 核心（headless/ui/theme）保持 MIT；外围包的**基础能力保持 MIT**，**付费能力放入独立包/独立子路径**（如 `*-pro` 或 `*/pro` 子路径），用 license key 本地校验（参考 Handsontable/Zeta 先例），不破坏开源信任。
4. **中国背景 = 差异化机会也是约束**：中国政企市场（私有化部署、信创、等保、发票合规、source escrow）是国外商业组件库服务不到/服务不好的空白；同时中国市场对「开源免费」的支付意愿低于欧美，需要**本地化定价（人民币）+ 企业服务**补足（参考 Univer 与 Element Plus 赞助模式）。
5. **「赞助 + 生态位」只能作为起步收入**：Element Plus / Naive UI / TanStack 的赞助收入规模有限（Element Plus GitHub Sponsors 当前仅 3 个 sponsor 在档），TanStack 依赖企业合作赞助；真正的可持续收入必须来自企业付费产品/服务，而不是捐赠。
6. **AI 是 2025–2026 年所有先例都在追加的付费点**：AG Grid 新出 AI Toolkit/MCP Server（企业版内）、Tiptap 的 AI Toolkit 为 add-on、Retool 卖 AI credits、Jotform 卖 AI Agent——Vean 可复用核心 headless/ui 的流式 AI 能力（`useStream` / `SSender`，见 [../ui-ai-roadmap.md](../ui-ai-roadmap.md)），把「AI 功能订阅」作为横切付费项。
7. **风险预警**：头部先例（Tiptap）已在 2025-06 移除免费云计划并持续抬高付费墙（二手来源）；组件库赛道同质化严重，免费替代品（Lexical/BlockNote 等）众多；付费产品一旦上线，维护承诺（SLA、安全补丁、source escrow）会显著抬高运营成本，**需要先验证需求信号再投入**。

### 1.2 先例商业模式汇总表

| 先例                    | 免费层                                               | 付费层                                                                                          | 关键计价单位                    | 核心付费点                                           | 来源                                                                                                                                                   |
| :---------------------- | :--------------------------------------------------- | :---------------------------------------------------------------------------------------------- | :------------------------------ | :--------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| AG Grid                 | 社区版（MIT）                                        | Enterprise 从 $999/开发者；Enterprise Bundle $1,498                                             | 开发者数 + 单/多应用 + 部署许可 | 分组/透视/服务端行模型/图表/AI/导出                  | [官方定价页](https://www.ag-grid.com/license-pricing/)                                                                                                 |
| Tiptap                  | 编辑器 MIT + 8 个原 Pro 扩展开源                     | Start $49 / Team $149 / Business $999（月付年缴）                                               | Cloud 文档数 + 开发者席位数     | 协作、文档历史、转换、AI、官方 UI 组件               | [官方定价页](https://tiptap.dev/pricing)                                                                                                               |
| Handsontable            | Hobby（非商业）免费                                  | Standard $999 / Priority $1,299 / Enterprise                                                    | 开发者数（可转让）+ 支持等级    | 全部高级功能 + 支持/维护/SLA                         | [官方购买页](https://dev.handsontable.com/pricing)                                                                                                     |
| Syncfusion              | Community License（收入<$1M 且 ≤5 开发者）           | JS 套件 $995/开发者·年；Essential Studio $2,495/开发者·年；Project License $495/月              | 开发者数 或 项目团队            | 1,600+ 控件、季度更新、24/5 支持                     | [官网](https://www.syncfusion.com/jquery-ui-widgets)、[EULA](https://www.syncfusion.com/license/studio/20.1.0.47/syncfusion_essential_studio_eula.pdf) |
| DevExpress / DevExtreme | 无（仅试用 30 天；开源项目可申请免费授权）           | Universal $2,299.99；DXperience $1,699.99；ASP.NET+Blazor(含 DevExtreme) $1,099.99              | 开发者数（多买打折 5%–15%）     | 全套件 + 年度更新 + 支持                             | [官网](https://www.devexpress.com/products/net/controls/asp/)                                                                                          |
| Kendo UI (Progress)     | 无                                                   | Kendo UI $999；DevCraft UI $1,299 / Complete $1,499 / Ultimate $2,199（每开发者，royalty-free） | 开发者数                        | 全套件 + 优先支持                                    | [TrustRadius（二手）](https://www.trustradius.com/compare-products/kendo-ui-vs-trigger-dev)                                                            |
| Formily / Designable    | 全 MIT                                               | 无直接收费（阿里内部工具 + 生态资产）                                                           | —                               | 以 OSS 换取生态位，变现靠围绕它的企业服务/低代码平台 | [GitHub](https://github.com/alibaba/formily)                                                                                                           |
| shadcn/ui 生态          | 全 MIT（registry 复制源码）                          | 第三方付费：Figma 套件、blocks、模板、私有 registry                                             | 一次性或订阅                    | 组件源码之外的设计资产与服务                         | [分析](https://www.shadcndesign.com/blog/is-shadcn-ui-free)、[Zeta](https://github.com/rbadillap/zeta/)                                                |
| TanStack                | 全免费（"forever free"）                             | 无付费产品                                                                                      | —                               | 赞助 + 企业合作（Cloudflare/Netlify/Webflow 赞助）   | [官方](https://tanstack.com/ads)、[Cloudflare](https://blog.cloudflare.com/cloudflare-astro-tanstack/)                                                 |
| Element Plus / Naive UI | MIT                                                  | 无                                                                                              | —                               | 赞助商位（白金/金牌）+ GitHub Sponsors               | [官网](https://element-plus.org/zh-CN/)、[Ant Design 赞助页](https://ant-design.antgroup.com/docs/react/sponsor-cn)                                    |
| Keenthemes / Metronic   | 无（模板不是开源）                                   | Solo $99 / Team $299 一次性；ThemeForest Standard / All-in 等许可                               | 项目数 / 开发者数（一次性）     | 后台管理模板 + 免费更新 + 6 个月支持                 | [官网](https://keenthemes.com/products/metronic-composer)                                                                                              |
| Jotform（表单 SaaS）    | Starter 免费（5 表单/100 提交/月）                   | Bronze $34 / Silver $39 / Gold $99（月付年缴）                                                  | 表单数 + 提交数 + 存储          | 托管表单、支付、电子签名、HIPAA                      | [官网定价](https://www.jotform.com/pricing/)                                                                                                           |
| Retool（低代码）        | Free                                                 | Team $12/构建者/月 + $7/内部用户；Business $65 + $18；外部用户 $10→$5                           | 构建者数 + 用户数 + AI credits  | 托管 App 构建 + 工作流 + AI                          | [官网定价](https://retool.com/pricing)                                                                                                                 |
| Univer / Luckysheet     | Luckysheet MIT（已归档）；Univer Apache-2.0 基础功能 | Univer 非 OSS 功能（透视、协同）付费升级                                                        | 按功能分版                      | 高级表格能力（中国 OSS 商业化代表）                  | [GitHub](https://github.com/dream-num/Luckysheet/)、[二手综述](https://www.aipuzi.cn/ai-news/univer.html)                                              |

> 注：表中「已核实」指直接来自官方页面；标注「二手」的条目来自第三方聚合站，仅作参考，价格可能有滞后。

---

## 2. 商业模式先例分析

### 2.1 AG Grid — MIT 社区 + 商业 Enterprise（数据表格双轨制标杆）

**事实（已核实，官方页面 2026-08 抓取）**：

- **双版本**：`ag-grid-community` 为 MIT 免费；`ag-grid-enterprise` 为商业许可 [GitHub README](https://github.com/ag-grid/ag-grid)（注：搜索返回的是 fork，内容与官方一致）。
- **定价**：Enterprise 从 **$999/开发者**；Enterprise Bundle（AG Grid + AG Charts Enterprise）从 **$1,498/开发者** [官方定价页](https://www.ag-grid.com/license-pricing/)、[landing page](https://www.ag-grid.com/landing-pages/enterprise-data-grid/)。
- **许可维度**：按「开发者数」+「单应用 / 多应用」计价；构建客户可见/对外售卖的应用需**额外购买 Deployment License Add-on**；**项目上所有前端 JS 开发者都要持许可**（不只是直接写 grid 的人）；不允许把软件再包装成自定义组件对外分发 [许可配置页](https://www.ag-grid.com/ecommerce/)。
- **企业版 gating 的高级功能**：AI Toolkit + MCP Server、集成图表（Integrated Charts）、Sparklines、AG Charts Enterprise、Set Filter / Multi Filter / Advanced Filter、单元格范围选择与填充柄、公式（Formulas）、查找（Find）、单元格批注（Cell Notes）、行分组与聚合、透视（Pivoting）、Master/Detail、服务端行模型（Server-Side Row Model）、Excel 导出、右键上下文菜单 [官方对比表](https://www.ag-grid.com/landing-pages/enterprise-data-grid/)。
- **市场数据（官方自述）**：90% 的 Fortune 500 使用、每周 1M+ npm 下载、GitHub 13K+ stars [官方定价页](https://www.ag-grid.com/license-pricing/)。

**对 Vean 的启示**：

- 数据表格是**企业级采购意愿最高**的组件品类之一（Fortune 500 渗透），按开发者收费被市场验证多年。
- 「免费做基础（排序/过滤/分页/编辑），收费做高级（分组/透视/服务端/导出/AI）」是成熟可照搬的 gating 模板。
- **关键提醒**：AG Grid 许可条款明确禁止「把我们的软件包装成自定义 UI 组件再分发」——这意味着若我们基于第三方付费内核（如 AG Grid）做 `@soybeanjs/table` 并对外售卖，会有许可冲突；因此 table 必须**自建内核**（基于 STable 原语），而非套壳 AG Grid。

### 2.2 Tiptap — MIT 内核 + 付费 Cloud Platform（编辑器商业化的最直接对标）

**事实（已核实，官方页面 2026-08 抓取）**：

- **定位原话**："The Tiptap Editor is open source (MIT) and free. Only platform features and Cloud documents are priced." [官方 feature-comparison](https://tiptap.dev/feature-comparison)。
- **付费档位（月付/年缴 8 折）**：
  - Start **$49/月**（年缴 $588）：500 Cloud 文档、2 环境、2 开发者许可
  - Team **$149/月**（年缴 $1,788）：5,000 Cloud 文档、3 环境、5 开发者许可
  - Business **$999/月**（年缴 $11,988）：50,000 Cloud 文档、5 环境、10 开发者许可
  - Enterprise 定制（云或本地、自有 auth/存储/AI 模型、SLA、SOC 2）[官方定价页](https://tiptap.dev/pricing)、[feature-comparison](https://tiptap.dev/feature-comparison)
- **开发者许可 add-on**：从 $39/开发者/月起 [feature-comparison](https://tiptap.dev/feature-comparison)。
- **付费能力清单**：实时协作 + 评论 + 文档历史（需要 Cloud Documents）；Content AI / In-line AI；Conversion（DOCX/Markdown 导入、多格式导出、注释往返）；**官方 UI Components**；Tracked Changes（add-on）；AI Toolkit（联系销售）[官方定价页](https://tiptap.dev/pricing)、[editor.md 调研](../ecosystem/editor.md)。
- **计价核心 = Cloud 文档数**：只有存在 Tiptap 平台的文档才计入配额，「文档存在自己数据库不计入」[官方 FAQ](https://tiptap.dev/docs/pricing)。
- **Pro 扩展需订阅**：`@tiptap-pro/extension-*`（AI、FileHandler、NodeRange、UniqueID 等）需有效付费订阅；AI/Pro 扩展「需要订阅验证，但可不依赖 Cloud 文档运行」[二手综述](https://eddyter.com/blogs/tiptap-alternative)、[foresightiq 情报](https://www.foresightiq.co/competitive-landscape/tiptap)。
- **历史变化（二手）**：免费 Cloud 计划于 2025-06 移除，仅剩 30 天试用 [二手综述](https://eddyter.com/blogs/tiptap-vs-quill-2026)；2024 年营收约 $2.3M、团队规模小（二手情报，置信度标记 UNCERTAIN）[inkeep 证据文档](https://github.com/inkeep/open-knowledge-legacy/blob/bffda4d6c330c65b84f7b732520ea077b428b4b8/reports/tiptap-2026-direction-overlap/evidence/d1-product-business.md)。

**对 Vean 的启示**：

- Tiptap 证明**「MIT 编辑器 + 收费的托管协同/转换/AI/官方 UI」能同时成立**——且 2025-06 把 8 个原 Pro 扩展转 MIT 后，UI 层（正是我们要自建的部分）成为官方唯一保留的付费 UI 资产，这给了我们**自建 Vue3 + UnoCSS UI 层的市场空间**（详见 `docs/ecosystem/editor.md` §1.1）。
- 计价上「文档数/连接数」适合托管服务；「开发者席位 add-on」适合工具型订阅。
- **风险警示**：Tiptap 正不断把曾经免费的 Pro 功能转为付费，且官方 UI Components 与我们正面竞争——必须差异化（Vue3/UnoCSS/中文文档/免费 AI 集成路径）。

### 2.3 Syncfusion / Kendo UI / DevExtreme — 商业组件库订阅制

**事实（已核实 / 部分二手）**：

- **Syncfusion**（已核实）：
  - JavaScript 套件（155+ 控件）**$995/开发者·首年**；Developer Platform / Essential Studio（1,600+ 控件）**$2,495/开发者·首年**；另有 **Project License $495/月**（覆盖整个项目团队，最多 5 开发者，年度折扣）[官网](https://www.syncfusion.com/jquery-ui-widgets)、[Project License datasheet PDF](https://syncfusion.info/wp-content/uploads/2026/01/Project-License-Datasheet-Limited-plan-FINAL.pdf)。
  - **Community License 免费**：年收入 < $1M 且 ≤ 5 开发者 [EULA](https://www.syncfusion.com/license/studio/20.1.0.47/syncfusion_essential_studio_eula.pdf)。
  - **纯订阅制**：不续费则需从系统移除产品（强制续费机制）；所有「接触/依赖产品」的开发者都必须持证、许可不可共享 [datasheet](https://syncfusion.info/wp-content/uploads/2026/01/Project-License-Datasheet-Limited-plan-FINAL.pdf)。
  - 每年 4 次大版本更新 + 24/5 支持 [datasheet](https://syncfusion.info/wp-content/uploads/2026/01/Project-License-Datasheet-Limited-plan-FINAL.pdf)。
- **DevExpress / DevExtreme**（已核实）：
  - Universal **$2,299.99**、DXperience **$1,699.99**、ASP.NET and Blazor（**含 DevExtreme**）**$1,099.99**，均为每开发者首年价；续费价显著更低（如 Universal 续费 $1,149.99，2025-07-11 生效）[WinForms 页](https://www.devexpress.com/products/net/controls/winforms/)、[ASP.NET 页](https://www.devexpress.com/products/net/controls/asp/)。
  - 多开发者折扣：2–5 张 5%、6–10 张 10%、11+ 张 15% [ASP.NET 页](https://www.devexpress.com/products/net/controls/asp/)。
  - 60 天无条件退款保证；每位开发者须单独购证 [ASP.NET 页](https://www.devexpress.com/products/net/controls/asp/)。
  - 开源项目（MIT/Apache）可申请免费授权（二手转述，未在本轮直接核实）[二手](https://wenku.csdn.net/answer/55zpz5wt0c)。
- **Kendo UI（Progress）**（二手，TrustRadius 聚合）：Kendo UI with Priority Support **$999/开发者（royalty-free）**；DevCraft UI $1,299 / Complete $1,499 / Ultimate $2,199 [TrustRadius](https://www.trustradius.com/compare-products/kendo-ui-vs-trigger-dev)。

**为什么团队愿意付费（归纳）**：一次性买到「大量成熟控件 + 年度更新 + 官方支持 + 合规（EULA/发票）」，省下自研数月的成本；「每个开发者都要持证 + 纯订阅 + 强制续费」保证了可持续收入。

**对 Vean 的启示**：纯商业套件模式收入天花板高但社区信任成本高（无免费层）；Vean 应走「有免费层的混合模式」，但在企业客户侧可借鉴 Syncfusion 的「项目级订阅（覆盖整个团队）」与 DevExpress 的「多开发者阶梯折扣」。

### 2.4 Handsontable — 非商业免费 + 商业订阅（license key 校验范本）

**事实（已核实）**：

- **两许可**：非商业（Hobby）许可免费，限个人/探索/非商业用途；商业许可按开发者购买（可转让）[购买页](https://dev.handsontable.com/pricing)、[文档 software-license](https://handsontable.com/docs/15.0/javascript-data-grid/software-license)。
- **定价**：Standard **$999/开发者**；Priority **$1,299/开发者**；Enterprise 定制 [购买页](https://dev.handsontable.com/pricing)。
- **付费差异 = 支持/维护等级，而非功能 gating**（与 AG Grid 相反）：Standard 每月 2 个支持请求、Priority 5 个、Enterprise 无限 + 专属 CSM + 可选 source code escrow + 安全补丁 + SLA [购买页](https://dev.handsontable.com/pricing)。
- **license key 机制**：客户端传入 licenseKey 字符串，本地校验（比较 build date 与 key creation date，**不联网**）；缺失/过期会显示水印与 console 警告；非商业用固定 key `'non-commercial-and-evaluation'` [文档](https://handsontable.com/docs/15.1/react-data-grid/license-key)。
- **历史**：2018-12-19 的 6.2.2 是最后一个 MIT 版本，之后转为专有双许可 [文档](https://handsontable.com/docs/15.0/javascript-data-grid/software-license)。
- **支持计划细节**：支持版本范围（Standard/Priority 12 个月、Enterprise 24 个月）、代码评审小时数（2h/5h 每年）、转卖商网络 [购买页](https://dev.handsontable.com/pricing)。

**对 Vean 的启示**：

- **「免费功能 + 付费支持」也是一种可行模型**，且实现成本最低（不 gate 功能，只 gate 支持）。
- **license key 本地校验（不联网）**是实现付费功能的低成本、隐私友好、离线可用的机制——非常适合开源项目做 Pro 门控，Vean 可参考（配合 vean registry 分发）。
- 警示：从 MIT 转为专有的先例（Handsontable、部分 Tiptap Pro 扩展）会引发社区反弹，Vean 若要做 Pro，应在**立项时就明确免费/付费边界**，避免「事后收窄」。

### 2.5 Formily / form-create / Formily Designable — 阿里系 OSS 表单生态

**事实（已核实 / 部分二手）**：

- **Formily** 是阿里巴巴开源的跨端表单解决方案，MIT 许可 [GitHub](https://github.com/alibaba/formily)。分层：`@formily/core`（状态/校验/联动内核）→ `@formily/react` / `@formily/vue`（框架适配）→ `@formily/antd`、`@formily/element-plus`、`@formily/next`、`@formily/vant` 等（UI 适配）[综述](https://jishuzhan.net/article/1903766617417396226)。
- **Designable** 是可视化表单设计器引擎（`@designable/core` / `@designable/react` / `@designable/formily-antd`），模块化可替换、无硬编码插槽 [综述](https://jishuzhan.net/article/1903766617417396226)。
- 社区衍生包 `@formily-design/formily-designer` 提供开箱即用的 React 表单设计器组件（拖拽 + Schema 编辑 + 预览三视图）[npm](https://www.npmjs.com/package/@formily-design/formily-designer)。
- **Monetization 观察（推断 + 二手）**：Formily 本身**无直接收费**——它是阿里「低代码/中后台体系」的生态资产，价值在内部复用与对外品牌，变现落在**基于它的企业服务、低代码平台（如钉钉宜搭类产品）与咨询**上。这是「大厂 OSS = 生态飞轮，而非收入中心」的典型形态。

**对 Vean 的启示**：

- **表单 Schema 本身几乎无法直接收费**（MIT 竞争激烈：Formily、React Hook Form、VueUse form 生态皆免费）——价值在**设计器体验、渲染能力、联动复杂度、与后台/工作流集成**。
- 中国低代码/表单市场巨大（Jotform 类产品本地化弱），**「开源 Formily 式内核 + 商业化托管表单设计器 SaaS」**是已验证的组合（详见 §3.3）。
- 复用 Formily 生态经验：UI 适配层多、协议标准（JSON Schema 扩展）是生态护城河；Vean 的 `@soybeanjs/form` 应以标准 Schema + 强类型为核心卖点。

### 2.6 shadcn/ui registry / Radix UI / TanStack — headless 开源生态

**事实（已核实 / 部分二手）**：

- **shadcn/ui**：MIT，免费商用、无 Pro 档位、无席位限制；通过 CLI 把源码复制进你的仓库（`npx shadcn@latest add button`），用户「拥有代码」；作者现在 Vercel 工作、由 Vercel 赞助开发 [二手分析](https://www.shadcndesign.com/blog/is-shadcn-ui-free)。
- **围绕 shadcn 长出的付费生态（第三方）**：Figma 套件、premium blocks、模板、设计系统工具——都是**第三方**（非项目本体）在收费 [同上](https://www.shadcndesign.com/blog/is-shadcn-ui-free)。
- **registry 商业模式雏形**：`Zeta`（开源私有/高级组件 registry）集成 **Polar.sh 做 license key 管理与校验**——即「registry 分发 + 付费条目 + 自动发 key」的基础设施已存在 [GitHub](https://github.com/rbadillap/zeta/)；Kibo UI（约 41 组件 + 1,000+ blocks，MIT，2025-10 被 Shadcnblocks 收购）证明「高级组件 registry」本身有商业价值 [二手](https://designrevision.com/alternatives/kibo-ui)。
- **TanStack**：明确「forever free、无 VC、无付费产品」；收入 = 企业合作赞助 + GitHub Sponsors + 直接企业协作；2025-10 Cloudflare/Netlify/Webflow 联合赞助（Netlify 赞助 TanStack）[官方](https://tanstack.com/ads)、[ethos](https://tanstack.com/ethos)、[Cloudflare 公告](https://blog.cloudflare.com/cloudflare-astro-tanstack/)。
- **Radix UI**：MIT 开源（WorkOS 团队维护），本身不收费（本调研未直接核实其财务结构，列为一般性观察）。

**对 Vean 的启示**：

- **registry = 分发与商业化的天然载体**：Vean 已有 `vean` registry 且已命名空间化（见 [docs/ecosystem/cli.md](../ecosystem/cli.md)），可扩展为「免费条目 + 付费条目（license key 校验）」两级 registry——这是 shadcn 生态（Zeta/Polar）已验证、但国内尚无玩家做到位的位点。
- 「免费做基础组件/源码，收费做设计资产/模板/高级 registry 内容」对 headless-first 项目尤其顺滑——因为用户已习惯「源码进仓库」，付费点自然落在「更高级的源码包与配套服务」。
- 纯赞助（TanStack 路线）只适合极少数头部项目，不适合作为 Vean 的长期收入支柱。

### 2.7 Element Plus / Ant Design Pro / Naive UI — 免费 Vue 生态的资金来源

**事实（已核实）**：

- **Element Plus**：MIT 免费；首页设**白金赞助商**（JNPF 低代码、CRMEB 开源商城）与**金牌赞助商**（Fantastic-admin、UnAIMyText、bit.dev）[官网](https://element-plus.org/zh-CN/)；GitHub Sponsors 当前 3 位 sponsor 在档、目标 10 位/月（收入规模很小）[GitHub Sponsors](https://github.com/sponsors/element-plus)。
- **Ant Design**：MIT 永久免费；通过 **OpenCollective + GitHub Sponsors + IssueHunt** 接受赞助，主张「社区与赞助支持长期可持续发展」[官方赞助页](https://ant-design.antgroup.com/docs/react/sponsor-cn)。
- **Naive UI**：MIT；核心维护者（如 Talljack）开放 GitHub Sponsors（档位 $5–$256/月，含优先修 bug、1:1 咨询）[GitHub Sponsors](https://github.com/sponsors/Talljack)。
- **免费 Vue 后台模板**（vue-element-admin、Naive Ui Admin、SoybeanAdmin、vue-vben-admin 等）均为 MIT 免费商用 [二手清单](https://blog.csdn.net/weixin_33087827/article/details/148572788)。

**归纳**：头部免费 Vue 生态的资金来源 = **大厂赞助/雇工（Ant/Element 背后是蚂蚁与社区）+ 赞助商位 + 个人 Sponsors**，规模普遍不大；「模板类」生态靠免费引流、不直接收费。

**对 Vean 的启示**：

- 赞助只能作为「品牌与运营收入的补充」，不能作为商业计划的支柱。
- 但**赞助商位**对国内 SaaS/低代码厂商有真实投放价值（Element Plus 的 JNPF/CRMEB 即为明证）——可作为早期收入与生态联动。
- 免费的「中后台模板 + 生态包」可大量引流（SoybeanAdmin 已是国内知名模板），引流后的转化点应在「企业服务 / Pro 能力 / 模板市场」而非赞助。

### 2.8 Keenthemes / 管理后台模板市场（ThemeForest 风格）

**事实（已核实）**：

- **Metronic Composer**：Solo Developer License **$99**（1 开发者、无限项目、终身访问、免费更新、6 个月 48/5 支持）；Team License **$299**（≤15 开发者）；另有 All-Access 打包 [官方](https://keenthemes.com/products/metronic-composer)。
- **许可分层**：ThemeForest Standard（单项目）、Keenthemes **All-in License**（无限终端产品含 SaaS、可转移给客户、不可开源）、Getbootstrap 系（Standard/Multisite/Extended）[同上](https://keenthemes.com/products/metronic-composer)。
- 一次买断、无订阅、30 天退款保证；卖的是**完整源码** [同上](https://keenthemes.com/products/metronic-composer)。

**对 Vean 的启示**：

- 模板市场是「一次性收入 + 大量长尾客户」的成熟形态；Vean 的 `@soybeanjs/admin` 生态（SAppLayout 等）天然可产出「基于 Vean 的中后台壳模板」售卖给想快速起盘的中小团队。
- 定价参考：单项目 $19–$99、全许可 $99–$299（一次性）——**远低于组件库订阅**，但适合作为生态包的冷启动收入与品牌曝光。
- 注意：模板市场客户对「开源免费」高度敏感，Vean 的免费核心 + 付费模板/壳产品是可行组合（很多用户愿为「开箱即用的完整壳 + 免费更新」买单）。

### 2.9 开发者工具商业模式（hosted SaaS / per-seat / design-to-code / AI builder）

**事实（已核实）**：

- **Hosted 表单 SaaS**：Jotform（2006 年创立，宣称 15M–35M 用户）免费 Starter（5 表单/100 提交/月），付费 Bronze **$34** / Silver **$39** / Gold **$99**（月付年缴），Enterprise 定制；按**表单数 + 提交数 + 存储**计费；Gold 起支持 HIPAA；另有 AI Agent 功能与 20,000+ 模板 [官网定价](https://www.jotform.com/pricing/)、[二手评测](https://formester.com/blog/jotform-review/)。
- **低代码平台**：Retool Free → Team **$12/构建者/月 + $7/内部用户/月** → Business $65 + $18 → Enterprise 定制；外部用户按量 $10→$5/月；**AI credits** 作为叠加计费单元 [官网定价](https://retool.com/pricing)。
- **design-to-code / AI builder**：Figma 官方 MCP 正在吞并独立 design-to-code 插件的市场（第三方图库作者观点）；付费 kits 主打「design-to-code 插件、主题适配、pro blocks、视频教程」[Obra 分析](https://shadcn.obra.studio/blog/our-business-model-a-few-words-about-other-shadcn-ui-kits)。

**对 Vean 的启示**：

- **per-seat（IDE/构建者席位）与 usage（提交数/文档数/credits）是开发者工具的两种成熟计费**；Vean 的付费产品可混合使用（Pro 席位 + 用量额度）。
- **hosted SaaS 是「组件库知识资产」的第二变现曲线**：组件免费引流 → 托管服务（表单托管、表格数据托管、编辑器协同）按用量收费——这正是 Jotform/Retool/Tiptap Cloud 的路径，且与开源免费边界不冲突（卖的是托管与运维，不是代码）。
- AI builder / design-to-code 是当前增量热点，但竞争激烈（Figma MCP、Vercel v0 等），Vean 应把 AI 作为**付费附加能力**而非主卖点。

### 2.10 补充案例：Univer（中国 OSS 商业化）与 Novel（Tiptap 之上的编辑器）

- **Univer / Luckysheet**（中国 OSS 商业化代表，二手 + GitHub）：Luckysheet（dream-num，MIT）已进入维护期/归档，团队转向商业化更强的 Univer；Univer 以 **Apache-2.0** 开放基础办公能力，**数据透视、协同编辑等高级能力放入非 OSS 版本付费升级** [GitHub](https://github.com/dream-num/Luckysheet/)、[二手综述](https://www.aipuzi.cn/ai-news/univer.html)。→ 启示：中国团队完全可以在「宽松开源（Apache-2.0/MIT）+ 高级功能闭源收费」上走通，Univer 是直接同乡先例。
- **Novel**（shadcn + Tiptap 的 Notion 风格编辑器）：Apache-2.0（一说是 MIT），Next.js + Tiptap + OpenAI + Vercel AI SDK，AI 用 BYOK（自带 OpenAI key）[二手对比](https://eddyter.com/blogs/tiptap-alternative)、[二手解析](https://blog.csdn.net/gitblog_01265/article/details/143036210)。→ 启示：编辑器 UI 层开源免费 + AI 带 key（BYOK）可做「免后端成本」的免费方案；Novel 本身未跑出独立商业模式，说明**纯开源编辑器 UI 层较难直接收费，价值要靠托管/AI/企业服务**。

---

## 3. 分生态商业化方向

> **2026-09 迁移：** 本节原列出的分生态方向已收敛到 [ecosystem/commercialization.md](../ecosystem/commercialization.md)，那里是**策略建议的唯一来源**（含 E1–E5 / T1–T5 / F1–F5 完整条目）。本报告自此只保留调研事实（§1–§2）与来源清单（§5）；原条目的引用来源均已收入 §5。

| 原方向                                                                                            | 现维护位置                                                                                |
| :------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------- |
| editor：E1 Pro 能力订阅 · E2 Editor Cloud · E3 AI 写作/编辑 · E4 企业定制与支持 · E5 行业模板市场 | [commercialization.md §2](../ecosystem/commercialization.md#2-soybeanjseditor-商业化方向) |
| table：T1 Table Pro · T2 Table Cloud · T3 企业性能与支持 · T4 行业套件包 · T5 AI 数据网格         | [commercialization.md §3](../ecosystem/commercialization.md#3-soybeanjsstable-商业化方向) |
| form：F1 托管表单设计器 SaaS · F2 Form Pro · F3 企业/低代码集成 · F4 行业方案包 · F5 AI 表单生成  | [commercialization.md §4](../ecosystem/commercialization.md#4-soybeanjsform-商业化方向)   |

## 4. 横向建议（cross-cutting）

> **2026-09 迁移：** 同 §3，横向建议已收敛到 [commercialization.md §5](../ecosystem/commercialization.md#5-横向执行建议)。

| 原小节                                                                                               | 现维护位置                                                                  |
| :--------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| 4.1 许可策略 · 4.2 lockstep 与双轨发布 · 4.3 registry + 付费分发 · 4.4 企业服务运营 · 4.5 风险与合规 | [commercialization.md §5](../ecosystem/commercialization.md#5-横向执行建议) |

---

## 5. 参考来源

### 官方一手来源（定价/许可）

- AG Grid — 官方定价页：https://www.ag-grid.com/license-pricing/
- AG Grid — 许可配置（开发者数/部署许可/许可条款）：https://www.ag-grid.com/ecommerce/
- AG Grid — Enterprise landing（功能对比）：https://www.ag-grid.com/landing-pages/enterprise-data-grid/
- AG Grid — GitHub README（Community MIT / Enterprise 商业）：https://github.com/ag-grid/ag-grid
- Tiptap — 官方定价：https://tiptap.dev/pricing
- Tiptap — 功能对比（MIT 边界、开发席位 add-on、AI Toolkit）：https://tiptap.dev/feature-comparison
- Tiptap — 定价 FAQ（Cloud 文档计费口径）：https://tiptap.dev/docs/pricing
- Handsontable — 购买页（$999/$1299/支持分级/escrow）：https://dev.handsontable.com/pricing
- Handsontable — license key 文档（本地校验）：https://handsontable.com/docs/15.1/react-data-grid/license-key
- Handsontable — 软件许可（MIT→专有历史）：https://handsontable.com/docs/15.0/javascript-data-grid/software-license
- Syncfusion — JS 套件定价（$995/$2,495）：https://www.syncfusion.com/jquery-ui-widgets
- Syncfusion — Essential Studio EULA（Community License 条款）：https://www.syncfusion.com/license/studio/20.1.0.47/syncfusion_essential_studio_eula.pdf
- Syncfusion — Project License datasheet（$495/月、纯订阅）：https://syncfusion.info/wp-content/uploads/2026/01/Project-License-Datasheet-Limited-plan-FINAL.pdf
- DevExpress — WinForms 定价（Universal $2,299 等、续费价）：https://www.devexpress.com/products/net/controls/winforms/
- DevExpress — ASP.NET+Blazor 含 DevExtreme（$1,099、多开发者折扣）：https://www.devexpress.com/products/net/controls/asp/
- Keenthemes — Metronic Composer 定价与许可（Solo $99/Team $299）：https://keenthemes.com/products/metronic-composer
- Jotform — 官方定价：https://www.jotform.com/pricing/
- Retool — 官方定价（per-builder/用户/AI credits）：https://retool.com/pricing
- TanStack — Ads & Partnerships（赞助+合作模式）：https://tanstack.com/ads
- TanStack — Ethos：https://tanstack.com/ethos
- Cloudflare — 赞助 Astro 与 TanStack 公告：https://blog.cloudflare.com/cloudflare-astro-tanstack/
- Element Plus — 官网（白金/金牌赞助商位）：https://element-plus.org/zh-CN/
- Element Plus — GitHub Sponsors：https://github.com/sponsors/element-plus
- Ant Design — 官方赞助页（MIT + OpenCollective + GitHub Sponsors + IssueHunt）：https://ant-design.antgroup.com/docs/react/sponsor-cn
- Naive UI 维护者 — GitHub Sponsors（Talljack）：https://github.com/sponsors/Talljack
- alibaba/formily — GitHub（MIT）：https://github.com/alibaba/formily
- @formily-design/formily-designer — npm：https://www.npmjs.com/package/@formily-design/formily-designer
- dream-num/Luckysheet — GitHub（MIT，已归档）：https://github.com/dream-num/Luckysheet/
- Zeta — 安全 shadcn registry（Polar license key）：https://github.com/rbadillap/zeta/

### 二手来源（佐证/综述，价格可能滞后，仅作参考）

- DZone — 表格库许可综述（AG Grid/Handsontable）：https://dzone.com/articles/5-popular-standalone-javascript-spreadhsheet-libra
- TrustRadius — Kendo UI 定价对比：https://www.trustradius.com/compare-products/kendo-ui-vs-trigger-dev
- inkeep — Tiptap 产品与商业情报（2024 营收 $2.3M）：https://github.com/inkeep/open-knowledge-legacy/blob/bffda4d6c330c65b84f7b732520ea077b428b4b8/reports/tiptap-2026-direction-overlap/evidence/d1-product-business.md
- foresightiq — Tiptap 竞品情报（Pro 扩展收费、产品线）：https://www.foresightiq.co/competitive-landscape/tiptap
- eddyter — TipTap vs Quill 2026（免费云计划移除、AI Toolkit 价格估计）：https://eddyter.com/blogs/tiptap-vs-quill-2026
- eddyter — TipTap 替代品对比（Novel/BlockNote 许可）：https://eddyter.com/blogs/tiptap-alternative
- shadcndesign — shadcn/ui 是否免费（MIT + 生态收费）：https://www.shadcndesign.com/blog/is-shadcn-ui-free
- Obra — shadcn 生态商业模式观察（design-to-code/赞助）：https://shadcn.obra.studio/blog/our-business-model-a-few-words-about-other-shadcn-ui-kits
- designrevision — Kibo UI 与 shadcn registry 综述（registry 商业模式）：https://designrevision.com/alternatives/kibo-ui
- formester — Jotform 评测与定价：https://formester.com/blog/jotform-review/
- aipuzi — Univer 开源与商业化综述：https://www.aipuzi.cn/ai-news/univer.html
- 技术站 — Formily/Designable 综述：https://jishuzhan.net/article/1903766617417396226
- CSDN — 免费 Vue 后台模板清单：https://blog.csdn.net/weixin_33087827/article/details/148572788
- CSDN — DevExpress 付费/免费政策（开源授权）综述：https://wenku.csdn.net/answer/55zpz5wt0c
- CSDN — Novel 技术栈解析：https://blog.csdn.net/gitblog_01265/article/details/143036210

### 仓库内既有资料

- [docs/ecosystem/cli.md](../ecosystem/cli.md) — vean registry 命名空间机制
- [docs/ecosystem/editor.md](../ecosystem/editor.md) — editor 提案（含 Tiptap 收费边界调研）
- [docs/adr/0001-peripheral-package-layering.md](../adr/0001-peripheral-package-layering.md) — 外围包分层模型 ADR（已 superseded，仅历史参考）
