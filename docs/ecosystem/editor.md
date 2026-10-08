# editor — 富文本编辑器技术方案（提案）

> **2026-09 前提变更：** 本文写于「外围包单包自治」时期，标题中的 `@soybeanjs/editor` 是当时设想的包名；当前仓库无外围包，文中包结构、lockstep、跨包依赖等设定已不适用。**市场调研结论与能力设计仍然有效**；立项时须先按 [README §立项时必须回答的问题](./README.md#立项时必须回答的问题) 确定落地形态（并入核心 aria/ui、独立包、或 vean 源码配方）。

> 定位（提案）：提供与主题 token 深度集成的**富文本 / 块编辑器**组件——基于 Tiptap 内核的 styled 封装层，对标社区 shadcn + Tiptap 方案（NiazMorhed2007/shadcn-tiptap、minimal-tiptap、Novel）在 Vue 3 + UnoCSS 体系下的等价物。
>
> 状态：**立项提案**（本文档），无任何代码。原核心库路线图中 `RichTextEditor` 延后至组件市场，本提案论证其升级为正式领域方向的理由（见 §1.3）。

## 1. 市场调研结论

### 1.1 Tiptap 的收费边界（2026-08 核实）

**免费（MIT 开源）：**

- Tiptap Editor 本体（`@tiptap/core`、`@tiptap/vue-3` 等框架绑定）与全部基础扩展（StarterKit、Table、TaskList、Placeholder、Link、Image、TextStyle、Color、Highlight、TextStyle、TextAlign、YouTube 等）。
- **2025-06-06 官方公告将 8 个原 Pro 扩展开源为 MIT**：`Details / DetailsContent / DetailsSummary`、`Emoji`、`DragHandle`、`FileHandler`、`InvisibleCharacters`、`Mathematics`、`TableOfContents`、`UniqueID`。
- 官方定位原话："The Tiptap Editor is open source (MIT) and free. Only platform features and cloud documents are priced."

**收费（Cloud Platform 订阅，Start $49 / Team $149 / Business $999 月付年缴）：**

| 收费项                  | 内容                                                           |
| :---------------------- | :------------------------------------------------------------- |
| Cloud Documents         | 托管协作文档（实时协作、评论、文档历史、版本比较），按档位限额 |
| Content AI / In-line AI | 行内 AI 生成与改写                                             |
| Conversion              | DOCX / Markdown 导入、多格式导出（`prosemirror-docx` 级能力）  |
| **官方 UI Components**  | 官方预构建的 shadcn 风格编辑器 UI 组件库——**属于付费计划**     |
| Tracked Changes         | 修订跟踪                                                       |
| AI Toolkit（定制报价）  | 面向 AI 代理的文档读写能力                                     |

**结论：做一个 shadcn 风格的 Tiptap 编辑器 UI 层，内核与所需扩展 100% 落在 MIT 范围内**——需要付费的官方 UI Components 恰恰是我们自建的部分。

### 1.2 shadcn + Tiptap 生态现状

| 项目                                                                                   | 技术栈                     | 许可         | 参考价值                                                                           |
| :------------------------------------------------------------------------------------- | :------------------------- | :----------- | :--------------------------------------------------------------------------------- |
| [NiazMorhed2007/shadcn-tiptap](https://github.com/NiazMorhed2007/shadcn-tiptap)        | React + shadcn/ui + Tiptap | MIT          | **主要蓝本**：自定义扩展集 + 工具栏 + 气泡菜单 + AI 辅助 + 文件上传 + 数学公式     |
| [Aslam97/minimal-tiptap](https://github.com/Aslam97/minimal-tiptap)                    | React + shadcn/ui + Tiptap | MIT          | 极简封装的组件切分方式（单一 drop-in 组件）                                        |
| [Novel](https://novel.sh)                                                              | React + shadcn/ui + Tiptap | MIT          | Notion 风格块编辑体验、slash 菜单、AI 补全交互范式                                 |
| 官方 [Tiptap UI Components](https://tiptap.dev/docs/ui-components/components/overview) | React + Tailwind           | **付费订阅** | 只作视觉与交互参考，**禁止复制其代码**                                             |
| Vue 3 侧                                                                               | —                          | —            | **空白**：以上全部为 React 实现，Vue 3 + UnoCSS 生态无成熟等价物——这正是本包的机会 |

### 1.3 内核选型对比

| 候选                      | Vue 3 支持                                                      |    许可     | 判断                                                                            |
| :------------------------ | :-------------------------------------------------------------- | :---------: | :------------------------------------------------------------------------------ |
| **Tiptap**（ProseMirror） | **官方一等公民**（`@tiptap/vue-3`，Tiptap 起家即 Vue 项目）     |  核心 MIT   | **首选**：headless 架构与 Vean 理念同构，扩展生态最大                           |
| Milkdown（ProseMirror）   | 有 Vue 绑定                                                     |     MIT     | 备选：Markdown-first，适合文档/笔记场景；社区较小。可作为 `markdown` 模式的参考 |
| Lexical（Meta）           | 仅社区 [lexical-vue](https://github.com/wobsoriano/lexical-vue) |     MIT     | 不推荐：官方绑定 React-only，第三方维护是长期风险                               |
| BlockNote（ProseMirror）  | React only                                                      |     MIT     | 排除：无 Vue 支持                                                               |
| Quill / Slate             | Quill 有 Vue 封装；Slate React only                             | BSD-3 / MIT | 排除：Quill 扩展模型弱；Slate 无 Vue 支持                                       |
| 裸 ProseMirror            | 无                                                              |     MIT     | 排除：Tiptap 已是其最佳封装，不重复造轮子                                       |

### 1.4 为什么从「组件市场条目」升级为独立包

核心库路线图原判断 RichTextEditor「体量大、通常独立成包」延后至市场。用户需求与市场调研支持升级：

1. **源码分发不合适**：编辑器需要跟随 Tiptap 上游持续适配（扩展 API 变更频繁），市场模式的「复制源码自持」会让用户背负升级成本。
2. **体量是子领域级**：工具栏、气泡菜单、slash 命令、图片上传、表格交互、markdown 双向——相当于一个完整组件族（预计 15+ 导出），超出单条市场条目的合理粒度。
3. **与生态包协同**：图片上传挂接核心库 `Upload`、数学公式复用 `Equation`（KaTeX peer）、主题走 `@vean/theme` token——正外围包形态。

## 2. 架构设计

### 2.1 分层与依赖

```
Layer 4  @soybeanjs/editor ──► @soybeanjs/{ui, headless, theme}
```

- 单包自治（ADR-0001）：不建 headless-editor 中间层——Tiptap 本身就是 headless 内核，本包是「styled + 组合」层，角色类似 `packages/ui` 之于 aria，但内生于单包。
- 跨包依赖：默认无；未来若需在 admin 表单中嵌入，由 admin 声明 `editor` optional peerDep（需先在 CONTEXT.md 白名单加边）。
- **内核 peer 策略**：`@tiptap/core`、`@tiptap/vue-3` 为 peer dependency（用户自选版本）；`@tiptap/starter-kit` 等扩展按需 peer 或 optional peer（对齐核心 AI markdown 组件对 shiki/mermaid 的 optional peer 模式，见 [../ui-ai-roadmap.md](../roadmap/ui-ai-roadmap.md)）。

### 2.2 包结构（目标形态）

```
packages/editor/
├── src/
│   ├── components/
│   │   ├── editor/              # SEditor：容器，封装 useEditor + SEditorContent + Provider
│   │   ├── editor-content/      # SEditorContent：ProseMirror 挂载点 + 主题化 prose 样式
│   │   ├── editor-toolbar/      # SEditorToolbar + SEditorButton 系列（复用 SButton/SButtonIcon/SIcon）
│   │   ├── editor-bubble-menu/  # 气泡菜单（复用 SPopover 定位）
│   │   ├── editor-floating-menu/# 浮动菜单
│   │   ├── editor-link/ · editor-image/ · editor-table/   # 子编辑交互
│   │   └── editor-slash-command/# slash 命令菜单（复用 combobox 模式）
│   ├── extensions/              # 预置 Tiptap 扩展组合（starter 预设：bold/italic/heading/link/image/table/task/code/math…）
│   ├── composables/             # use-editor-image-upload / use-editor-markdown / use-editor-selection
│   ├── styles/                  # scv() recipe + prose 主题类（@unocss-include）
│   ├── constants/components.ts  # SEditor* 名称注册表
│   ├── resolver/ · nuxt/
│   └── types.ts                 # EditorPreset / EditorToolbarConfig / EditorImageUploadOption
└── test/                        # 单测（happy-dom）+ browser e2e（含 axe）
```

### 2.3 前缀与命名

`S` + `Editor*`（`SEditor`、`SEditorToolbar`…）——对齐 admin（`S`+`App*`）与 chart（`S`+`Chart*`）的「S + 领域名词」二级语义段模式。registry 命名空间 `editor/*`。

### 2.4 免费边界策略（硬约束）

| 层            | 策略                                                                                                                                                                                         |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 内核与扩展    | **仅使用 MIT 部分**：core / vue-3 / 全部基础扩展 + 2025-06 已开源的 8 个原 Pro 扩展（DragHandle、FileHandler、Mathematics、Emoji、Details、TableOfContents、InvisibleCharacters、UniqueID）  |
| UI 层         | 全部自建（参考 MIT 社区项目 shadcn-tiptap / minimal-tiptap 的组件切分；官方付费 UI Components 仅作视觉参考，禁止抄代码）                                                                     |
| 协作          | 官方 Collaboration / Cloud Documents 为付费 bundle——**不依赖**；提供 Y.js 集成点（用户自建 Hocuspocus OSS 或购买 Tiptap Cloud 均可，`@tiptap/extension-collaboration` 当前许可在立项时验证） |
| AI            | Content AI 付费——不依赖；slash 命令与 ai-elements 式交互留集成点（可对接核心库 `SSender` / `useStream` 流式能力自建免费方案，见 [ui-ai-roadmap](../roadmap/ui-ai-roadmap.md)）               |
| DOCX 导入导出 | Conversion 付费——不依赖；Markdown 双向自建（markdown-it / tiptap markdown 扩展，MIT）；DOCX 留待需求信号                                                                                     |

## 3. 核心功能

| 优先级 | 组件 / 能力                                                                                      | 说明                                                                                                          |
| :----: | :----------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
|   P0   | `SEditor` + `SEditorContent`                                                                     | 容器与内容挂载；`EditorPreset` 预设驱动（basic / docs / full）；主题化 prose 样式（走 theme token，亮暗联动） |
|   P0   | `SEditorToolbar`                                                                                 | 分组工具栏（加粗 / 标题 / 列表 / 链接 / 图片 / 表格 / 代码块 / 数学），复用 SButton/SIcon/SDropdownMenu       |
|   P0   | `SEditorBubbleMenu`                                                                              | 选中文本气泡（复用 SPopover 定位 + floating-ui）                                                              |
|   P1   | `SEditorFloatingMenu` · `SEditorSlashCommand`                                                    | 空行浮动菜单 + `/` 命令面板（复用 combobox）                                                                  |
|   P1   | `useEditorImageUpload` + `SEditorImage`                                                          | 图片上传（挂接核心库 `Upload` / `Dropzone`）；FileHandler 扩展（拖放/粘贴）                                   |
|   P1   | `useEditorMarkdown`                                                                              | Markdown ↔ HTML 双向（notes / docs 场景，参考 Milkdown 交互）                                                 |
|   P2   | `SEditorTable` 增强交互 · `SEditorDragHandle`                                                    | 表格行列操作、块拖拽排序                                                                                      |
|   P2   | 数学（KaTeX peer，复用核心 `Equation` 路线）、Emoji、Details 折叠、目录 `SEditorTableOfContents` | 基于 8 个已开源扩展封装                                                                                       |

## 4. 实现路径

|        阶段        | 内容                                                                                    | 时间窗（建议） | 前置                      |
| :----------------: | :-------------------------------------------------------------------------------------- | :------------- | :------------------------ |
|   ED-0 立项确认    | 本方案评审；验证 `@tiptap/extension-collaboration` 许可与 Tiptap 版本兼容矩阵；输出 ADR | 1 周           | 生态首发 M-EC5            |
|    ED-1 包骨架     | 复用 chart/admin 骨架模板 + registry `packages` 元数据 + docs/playground 命名空间接线   | 1 周           | ED-0、EC-M2/M4 模式已固化 |
|    ED-2 P0 组件    | SEditor / SEditorContent / SEditorToolbar / SEditorBubbleMenu + basic 预设              | 2–3 周         | ED-1                      |
|    ED-3 P1 能力    | slash 命令、图片上传（依赖核心库 `Upload` CMP-1.9）、markdown 双向                      | 2–3 周         | ED-2、CMP-1.9             |
| ED-4 P2 与生态联动 | 表格增强、DragHandle、数学（联动 `Equation` CMP-4）、admin 表单嵌入评估                 | 按需           | ED-3                      |

## 5. 技术选型

| 选型        | 决策                                                                           | 理由                                                  |
| :---------- | :----------------------------------------------------------------------------- | :---------------------------------------------------- |
| 内核        | Tiptap（peer dep，锁定主版本兼容矩阵）                                         | Vue 3 官方支持 + headless 同构 + 最大扩展生态（§1.3） |
| UI 底座     | `@vean/ui` 原子组件（SButton / SIcon / SPopover / SDropdownMenu / combobox）   | 与 admin 的复用规范一致：查询优先、禁止重复造原子     |
| 蓝本        | shadcn-tiptap（扩展集与工具栏）+ minimal-tiptap（组件切分）+ Novel（交互范式） | 全 MIT，规避官方付费 UI 组件的代码风险                |
| Markdown    | markdown-it 系 MIT 方案封装为 `useEditorMarkdown`                              | Conversion 付费，自建覆盖 90% 场景                    |
| 数学        | KaTeX（peer）复用核心库 `Equation` 组件路线                                    | 不重复实现                                            |
| 样式        | `scv()` + prose 主题类由 `@vean/theme` token 派生                              | 亮暗联动，禁原始 CSS                                  |
| 构建 / 测试 | `vp pack` + vitest + Playwright + axe（编辑器键盘可达性是重点）                | 对齐 packages/ui                                      |

## 6. 兼容性考虑

- **SSR / Nuxt**：Tiptap 编辑器依赖 DOM，SSR 首帧输出只读序列化 HTML（`editor.getHTML()`），客户端 hydrate 后挂载——提供 `<SEditor ssr>` 模式；Nuxt module 与 resolver 对齐其他包。
- **体积**：Tiptap core + starter-kit ≈ 150–300KB（按扩展裁剪）；预设按需引入（basic 预设明显小于 full），内核 peer 不进包体积。
- **键盘可达性**：富文本编辑器是 a11y 重灾区——ProseMirror 自带 ARIA 支持，工具栏 / 气泡菜单 / slash 菜单的焦点管理复用核心库浮层原语；纳入 browser e2e 必测项。
- **版本**：lockstep 同版本；Tiptap 大版本升级（v2 → v3 已发生）需维护兼容矩阵并在包文档标注支持的 `@tiptap/*` 版本范围。
- **许可**：依赖闭包仅 MIT/BSD 等宽松许可；付费组件零依赖（§2.4 硬约束），并在 CI 依赖审计（联动 OPT-F1）中防止误引入 `@tiptap/pro-*` 收费包。

## 7. 风险

| 风险                                      | 缓解                                                                                                     |
| :---------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| Tiptap 上游大版本破坏性变更（v2→v3 先例） | peer dep + 兼容矩阵 + 升级专项测试（13+ 单测 + e2e 回归）                                                |
| 官方未来收紧已开源扩展                    | 锁定具体版本范围；关键扩展（DragHandle/FileHandler）评估 fork 预案                                       |
| 与官方付费 UI Components 的同质竞争       | 差异化：UnoCSS / theme token / Vue3 / 中文文档 / 与核心 AI 组件（`SSender` / `useStream`）的免费集成路径 |
| 编辑器交互复杂度导致交付面不完整          | P0 严格限定为「容器 + 内容 + 工具栏 + 气泡」最小闭环，其余渐进                                           |
