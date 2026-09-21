# Vean AI 组件路线图（ui-ai-roadmap）

> 本文档是 AI 对话组件族的**唯一现行规划**，取代并废止早期的 `ui-x-roadmap.md`（已删除，git 历史可查）。
>
> 编制依据（2026-09 重新探索）：`vuepont/ai-elements-vue`、`element-plus-x/Element-Plus-X`（v2）、`antdv-next/x`（v1.2）、`assistant-ui` primitives/runtime，以及本仓库 `.agents/skills/vean-ui-develop/` 的 aria 准入纪律（R1–R8）。
>
> 旧 `@soybeanjs/ui-x` 包（单包自治、逻辑与样式共存、`Sx` 前缀）**整包移除**，不做代码迁移；其实现仅作为行为参考（git 历史可查）。全部 AI 组件按组件开发 skill 在 `@vean/aria` + `@vean/ui` 中**重新实现**，统一 `S` 前缀。

---

## 1. 背景与目标

### 1.1 为什么移除 ui-x 重写

旧 `packages/ui-x/` 是「外围单包」模型（ADR-0001），逻辑 composables 与样式 SFC 共存于一个包。审计后确认它系统性偏离组件开发规范：

- **无 aria 准入过程**：20 个组件全部是带样式 SFC，`role="log"`、`role="listbox"`、`aria-label`、键盘提交（IME 判定）、滚动跟随等行为/a11y 逻辑直接写在样式层（见旧 `bubble-list.vue` / `sender.vue`），违反「UI 层不得出现 ARIA/键盘语义」。
- **样式契约不统一**：未使用标准 `cv()` / `scv()` 多槽契约与 `provide{Name}Ui` 注入，`ui` 对象在组件内手工拼装。
- **逻辑复用错位**：`useChat` / `useXStream` / `useTyping` 等纯逻辑被锁在样式包内，且与组件状态耦合松散（如 `useSender` 不感知真实光标位置）。
- **消息模型过薄**：`content: string` 无法表达 assistant-ui 已验证的 parts 模型（文本 / 推理 / 工具调用 / 图片 / 文件分段）。
- **双前缀与双文档树**：`Sx*` + `/ui-x` 文档站分区带来额外的生成管线（api/skills/menu/registry 特判），维护成本高。

### 1.2 目标

1. AI 组件族成为 `@vean/ui` 的**一等成员**：逻辑在 aria、样式在 ui，全部 `S` 前缀，复用现有 90+ 原子族。
2. 每个「组件家族」开工前先过 **aria 准入（deletion test + R1–R8）**；未准入者一律 UI-only 组合，禁止再开空壳 aria 目录。
3. 吸收 assistant-ui 的 parts 消息模型、分支（branching）、工具调用分段等 2026 年共识设计，但不照搬其 React runtime；状态层以**传输无关的 composables** 提供。
4. 核心包聚焦「对话闭环」；画布、artifact、agent IDE 等重场景交给 `vean` 源码组件市场。

### 1.3 数量概览

| 类别                 | 数量 | 说明                                             |
| :------------------- | :--: | :----------------------------------------------- |
| P0 Core（v1 里程碑） |  9   | 对话三元组 + 流式模型 + Markdown，先闭环核心体验 |
| P1 High              |  10  | 会话管理、引用、推理、动作栏、欢迎/推荐          |
| P2 Medium            |  6   | 工具调用、消息分支、分段内容、语音朗读等         |
| P3 Low               |  4   | 语音识别、音频播放、终端堆栈、Agent 容器         |
| 组件市场（延后）     |  8+  | Canvas / Artifact / Agent IDE 等重生态组件       |
| 范围外               |  5+  | 图表、富文本、厂商 SDK、移动端原生特性           |

---

## 2. 参考生态调研结论（2026-09）

### 2.1 四个参考源的形态

| 参考库                    | 形态                                                   | AI 组件 / 原语规模                                      | 特征                                                                                                                    |
| :------------------------ | :----------------------------------------------------- | :------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| `vuepont/ai-elements-vue` | shadcn-vue 注册表，**源码拷贝分发**（对标本仓库 vean） | 30+ 注册项                                              | 与 Vercel `@ai-sdk/vue` 绑定；偏 Agent / Vibe-Coding 场景；无 aria 分层，Tailwind 源码即产品                            |
| `element-plus-x` v2       | 单 npm 包 `@element-plus-x/*`（core）                  | 11 组件 + 6 hooks                                       | 最务实：Bubble/BubbleList/XSender/Conversations/Attachments/ThoughtChain；`useXStream`/`XRequest`/`useSend`/`useRecord` |
| `antdv-next/x` v1.2       | monorepo，5 个子包                                     | 20 组件 + `x-sdk` + `x-markdown` + `x-card` + `x-skill` | 对 Ant Design X 最完整的 Vue 对标；协议能力独立成 `x-sdk`；Markdown / Skill 独立包                                      |
| `assistant-ui`（React）   | Radix 风格 **aria primitives + runtime**               | 12 组 primitives + runtime 抽象                         | parts 消息模型、消息分支/编辑重发、工具调用分段、Thread/Composer/ThreadList 运行时上下文、语音适配器                    |

### 2.2 组件对照矩阵

| 能力主题            | ai-elements-vue                         | Element Plus X          | antdv-next/x                | assistant-ui              | Vean 新规划                             |
| :------------------ | :-------------------------------------- | :---------------------- | :-------------------------- | :------------------------ | :-------------------------------------- |
| 单条消息            | `message`                               | `Bubble`                | `bubble`                    | `Message` + `MessagePart` | `SBubble`（UI-only）                    |
| 消息列表 / 线程     | `conversation`                          | `BubbleList`            | `bubble` list / Bubble.List | `Thread`                  | `SThread`（aria `thread`）              |
| 输入编排            | `prompt-input`                          | `XSender`               | `sender`                    | `Composer`                | `SSender`（aria `sender`）              |
| 流式协议 hooks      | `@ai-sdk/vue`                           | `useXStream`/`XRequest` | `x-sdk`                     | runtime + external store  | `useStream` / `useChat`（aria/ai）      |
| 发送状态            | —                                       | `useSend`               | —                           | Composer runtime          | `useSend`（aria/ai）                    |
| 会话列表            | —                                       | `Conversations`         | `conversations`             | `ThreadList`              | `SConversations`（aria 族）             |
| 附件                | `attachments`                           | `Attachments`           | `attachments`               | `Attachment`              | `SAttachment` + `SAttachmentCard`       |
| 文件卡              | queue 内文件                            | `FilesCard`             | `file-card` / `x-card`      | Attachment parts          | `SAttachmentCard`（UI-only）            |
| Markdown 流式渲染   | `response`（vue-stream-markdown）       | xMarkdown（内置）       | `x-markdown` 包             | text part renderers       | `SMarkdown`（markstream-vue 底座）      |
| 代码块              | `code-block`                            | —                       | `code-highlighter`          | code renderer             | `SCodeBlock`（UI-only）                 |
| Mermaid             | —                                       | —                       | `mermaid`                   | code renderer             | P2（Markdown 插件 / 市场）              |
| 推荐提示            | `suggestion`                            | `Prompts`               | `prompts` / `suggestion`    | `Suggestion`              | `SPrompts` / `SSuggestion`              |
| 欢迎引导            | —                                       | `Welcome`               | `welcome`                   | Thread empty state        | `SWelcome`（UI-only）                   |
| 引用来源列表        | `sources`                               | —                       | `sources`                   | citation renderers        | `SCitations`（UI-only）                 |
| 行内引用            | `inline-citation`                       | —                       | —                           | citation components       | `SInlineCitation`（UI-only）            |
| 动作工具栏          | `actions`                               | —                       | `actions`                   | `ActionBar`               | `SActionBar`（UI-only 组合 toolbar）    |
| 复制 / 赞踩         | actions 内                              | —                       | actions 内                  | copy/reload/feedback      | `SActionBarCopy` / `SActionBarFeedback` |
| 单块推理            | `reasoning`                             | `Thinking`              | `think`                     | `ChainOfThought`          | `SReasoning`（组合 collapsible）        |
| 推理步骤链          | `chain-of-thought`                      | `ThoughtChain`          | `thought-chain`             | `ChainOfThought`          | `SThoughtChain`（aria 族）              |
| 工具调用            | `tool` / `confirmation`                 | —                       | `x-skill`（Skill）          | tool-call part            | `SToolCall`（P2）                       |
| 消息分支            | `branch`                                | —                       | —                           | `BranchPicker`            | `SBranchPicker`（P2）                   |
| 错误展示            | —                                       | —                       | —                           | `Error`（alert 角色）     | 线程错误态（P2，组合 alert）            |
| 划词工具栏          | —                                       | —                       | —                           | `SelectionToolbar`        | P2（市场候选）                          |
| 悬浮助手            | —                                       | —                       | —                           | `AssistantModal`          | 不新增（dialog + thread 配方）          |
| 语音识别            | —                                       | `useRecord`             | —                           | speech adapters           | `useRecord`（P3）                       |
| 音频播放            | `audio-player`                          | —                       | —                           | audio part                | P3                                      |
| 通知                | —                                       | —                       | `notification`              | `Error`                   | **不做**，复用 `toast`                  |
| 文件夹              | —                                       | —                       | `folder`                    | —                         | 市场                                    |
| Agent / Plan / Task | `agent`/`plan`/`task`/`queue`/`context` | —                       | —                           | —                         | 市场 / 配方                             |
| 画布                | `canvas`/`node`/`edge`/`controls`       | —                       | —                           | —                         | 市场（VueFlow）                         |
| Artifact / 网页预览 | `artifact`/`web-preview`                | —                       | —                           | —                         | 市场                                    |
| 模型选择            | `model-selector`                        | —                       | —                           | model context             | 不新增（`SSelect` 用法配方）            |
| 全局配置            | —                                       | `ConfigProvider`        | `x-provider`/`locale`       | runtime provider          | 复用现有 `SConfigProvider`              |

### 2.3 关键结论

1. **高共识三件套**：Bubble/Message + List/Thread + Sender/Composer，四库全部覆盖，是 v1 必须做到位的核心。
2. **协议层独立是趋势**：antdv-next 拆 `x-sdk`、EPX 提供 hooks 包、assistant-ui 提供 runtime —— 对应本规划的 aria/ai 模块（composables + 类型），但坚持传输无关、不绑定任何厂商 SDK。
3. **assistant-ui 的增量价值在模型而非视觉**：parts 分段、分支、编辑重发、工具调用、attachment adapter。这些应进入数据模型与 composable 设计，而不是搬运 React 组件。
4. **画布 / Agent IDE 一致低共识**：仅 ai-elements-vue（shadcn 源码分发模式）覆盖，适合 vean 市场，不进核心包。
5. **Mermaid / 高亮是渲染插件问题**：跟随 Markdown 渲染器的可选 peer 策略，不做独立重组件。

---

## 3. Aria 准入总表（强制门）

> 依据 `layers.md` 的 deletion test 与 R1–R8。**删除该 aria 模块后，若键盘/焦点/ARIA/定位/选择不变量/跨浏览器几何契约只会在样式层重复出现，则准入；否则拒绝。**
>
> 禁止以 Compact、`provideXUi`、多槽 anatomy 作为准入理由（R4/R7）。

### 3.1 准入的 aria 家族（4 个）

| 家族（目录名）  | UI 组件          | 准入依据（R2）                                                                                                                                                   | 核心契约                                                                                                                               |
| :-------------- | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `thread`        | `SThread`        | `role="log"` live-region 语义；流式内容增长时的自动跟随状态机；跨浏览器滚动几何（R2 第 8 行，参照 virtualizer/affix）                                            | 跟随/暂停判定（at-bottom 哨兵）、scroll-to-bottom、流式 token 增量跟随、`aria-live`、锚点哨兵                                          |
| `sender`        | `SSender`        | 表单提交键盘不变量（Enter/Shift+Enter、**IME 组合态**）、suggestion 弹层的 listbox 键盘导航（roving）、受控/非受控开关状态、附件拾取（隐藏 input + 拖拽 + 粘贴） | textarea autosize 几何契约、提交/中止状态、trigger（`/`、`@`）检测基于**真实 selectionStart**、`aria-expanded`/`aria-activedescendant` |
| `thought-chain` | `SThoughtChain`  | 每步展开/折叠 open 不变量（受控+非受控）；步骤状态机 `pending/loading/success/error`；流式追加                                                                   | 领域包装 collapsible（R6）、步骤状态上下文、data 状态属性                                                                              |
| `conversations` | `SConversations` | 选中不变量（受控+非受控 v-model）；列表 roving tabindex 与方向键；分组语义                                                                                       | activeId、分组顺序、rename/remove 事件编排、`aria-selected`                                                                            |

四个家族均须：`types.ts → context.ts → 基础槽 SFC →（可选 Compact）→ index.ts`，导出全部被 Compact 组合的原语（R5），槽根节点带 `data-vean-{family}-{slot}`。

### 3.2 拒绝准入（UI-only，组合既有族）

| UI 组件                    | 拒绝理由（R3/R6）                                                           | 组合的既有 aria 族 / 资源                              |
| :------------------------- | :-------------------------------------------------------------------------- | :----------------------------------------------------- |
| `SBubble`                  | 纯展示：头像 + 内容 + placement；打字机动画委托 composable；无 widget 角色  | `avatar`、`button`、`icon`、`useTyping`                |
| `SReasoning`               | 就是一块可折叠面板，不拥有独立状态机                                        | `collapsible`（提供 collapsible UiContext 子集）       |
| `SActionBar`               | 工具栏容器，行为即 toolbar/APG toolbar                                      | `toolbar`、`button`、`dropdown-menu`                   |
| `SActionBarCopy`           | 复制按钮                                                                    | `clipboard`、`button`                                  |
| `SActionBarFeedback`       | 赞/踩双态按钮                                                               | `toggle-group`（或 toggle）、`icon`                    |
| `SMarkdown`                | 第三方渲染器薄包装，本身无键盘/焦点契约                                     | markstream-vue                                         |
| `SCodeBlock`               | 展示 + 复制；无独立几何/焦点契约                                            | `clipboard`、`button`；shiki 可选动态导入              |
| `SAttachment`              | 附件列表展示与移除（展示型，类似 tag 列表）                                 | `scroll-area`、`button`、`icon`；拾取逻辑用 composable |
| `SAttachmentCard`          | 文件元信息卡片                                                              | `icon`、`button`                                       |
| `SPrompts` / `SSuggestion` | 推荐卡片网格 / 建议 chips，纯导航/按钮集合                                  | `card`、`button`、`scroll-area`（横向滚动场景）        |
| `SWelcome`                 | 空状态引导面板                                                              | 组合 `SPrompts`，参照 empty                            |
| `SCitations`               | 引用链接列表                                                                | `link`、`popover`、`scroll-area`                       |
| `SInlineCitation`          | 行内引用角标 + 悬浮详情                                                     | `popover`、`link`                                      |
| `SToolCall`（P2）          | 工具调用卡片：展开看参数/结果，状态由消息 part 驱动，不拥有独立 open 状态机 | `collapsible`、`badge`、`SCodeBlock`                   |
| `SBranchPicker`（P2）      | 上一条/下一条切换控件，状态在 useChat branches                              | `icon`、`button`、tooltip                              |

UI-only 组件由 UI 层负责结构与装配（条件、默认内容、slot 选择），行为一律组合已准入原语；允许在自有节点带 `data-vean-{name}`，但**不得**写 ARIA/键盘/状态语义（R5、UI 层责任边界）。

### 3.3 不新建组件（复用或配方）

- **通知**：复用 `toast`（旧 `SxNotification` 废弃）。
- **模型选择器**：`SSelect` / `SPopover` + 头像列表的文档配方。
- **悬浮助手**：`SDialog`/`SPopover` + `SThread` + `SSender` 的市场配方，不建 `AssistantModal` 等价组件。
- **加载光点 / shimmer**：`SSpinner` / UnoCSS animate 工具类 + Bubble loading 插槽。

---

## 4. 架构决策

### 4.1 包结构（D1）：不新增任何包

```text
packages/aria/src/
├── ai/                       # 新增：AI 域模型 + 传输无关 composables（零样式、零 DOM 样式）
│   ├── types/                #   ThreadMessage / MessagePart / Attachment / Citation ...
│   ├── use-chat.ts           #   线程状态机（发送/中止/重试/重生成/P2 分支）
│   ├── use-stream.ts         #   ReadableStream + SSE 分块解析（旧 useXStream）
│   ├── use-send.ts           #   发送中状态机
│   ├── use-typing.ts         #   打字机/淡入
│   ├── use-attachment-picker.ts  # 文件选择/拖拽/粘贴（P1）
│   ├── use-record.ts         #   Web Speech 识别（P3）
│   └── index.ts
├── components/
│   ├── thread/               # 准入族
│   ├── sender/               # 准入族
│   ├── thought-chain/        # 准入族
│   └── conversations/        # 准入族
└── composables/              # 既有通用 composables（不放 AI 专属逻辑）

packages/ui/src/
├── styles/{bubble,thread,sender,markdown,code-block,attachment,…}.ts
└── components/{bubble,thread,sender,markdown,…}/   # 统一 S 前缀
```

- 子路径导出新增 `@vean/aria/ai`（与现有 `./date`、`./composables` 同级先例），不污染 `./composables` 通用桶。
- 依赖方向保持 `ui → aria` 单向不变；aria/ai 只允许依赖 `shared/`、`@vueuse/core` 与 Vue 响应式 API，**不得**引入 markstream / shiki / mermaid。
- Nuxt 自动注册、resolver、样式构建全部复用 `@vean/ui` 既有管线，无第二套出口。

### 4.2 命名（D2）：统一 `S` 前缀，词汇以 Ant Design X 为基线、assistant-ui 为增量

- 沿用企业用户熟悉的 Bubble / Sender / Conversations / ThoughtChain / Prompts 词汇；线程容器采用 assistant-ui 的 **Thread**（比 BubbleList 更准确表达「滚动跟随的消息线程」）。
- 旧 `Sx*` → 新组件映射见 §10。
- 消息模型采用 assistant-ui 风格的 **parts** 命名（`ThreadMessage` / `MessagePart`），但保持框架中立、无 React runtime 概念。

### 4.3 消息模型（D3）：parts 化、传输无关

```ts
interface ThreadMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | (string & {});
  /** 分段内容：流式期间各 part 独立增量更新 */
  parts: MessagePart[];
  status: MessageStatus; // 'local' | 'streaming' | 'updating' | 'success' | 'error' | 'aborted'
  createdAt: number;
  meta?: Record<string, unknown>; // token 用量、model、provider 等
}

type MessagePart =
  | TextPart // { type: 'text'; text }
  | ReasoningPart // { type: 'reasoning'; text; status }
  | ToolCallPart // { type: 'tool-call'; id; name; args; result?; status }（P2 启用）
  | ImagePart // { type: 'image'; url | source }
  | FilePart; // { type: 'file'; attachment: Attachment }
```

- 提供 `getTextContent(message)` 之类纯函数兼容纯文本场景；`SBubble` 默认按 part 类型分发渲染，允许插槽整体覆盖。
- `useChat` 只产出/维护模型，不认识 OpenAI/Anthropic 报文；厂商报文 → `ThreadMessage` 的适配器以**文档示例/独立包外代码**提供，不进核心。

### 4.4 流式（D4）：composable 三件套

- `useStream(stream, options)`：消费任意 `ReadableStream<Uint8Array>`，可配置 SSE 分隔（默认 `\n\n` / `\n` / `:`），暴露 `data / error / status / abort`。
- `useChat({ onRequest, initialMessages })`：追加 user 消息 → 调用消费者请求函数 → 流式填充 assistant 消息 parts；支持 `stop / retry / regenerate`；P2 增加 branches（同一逻辑位置的多条候选回复 + 切换）。
- `useTyping`：rAF/interval 驱动，纯逻辑无 DOM；支持 `typing | fade-in`、`step/interval/keepPrefix`，**在 Markdown 场景默认关闭**（避免与流式重解析双重动画）。
- 所有 composable SSR-safe（无浏览器 API 顶层访问），`onScopeDispose` 清理。

### 4.5 Markdown（D5）：markstream-vue 2.x 作为唯一底座

- 旧规划锁定 1.x；现网已验证 2.x（`^2`）稳定线可用，`MarkdownRender` 的 `content/final/mode/htmlPolicy/isDark/typewriter/smoothStreaming/parseOptions` 接口满足需求，**锁定 2.x 稳定版**。
- `markstream-vue` 作为 `@vean/ui` 的**直接依赖**（仅 UI 包，不进 aria）；`shiki` / `mermaid` / `katex` 为可选 peer，缺失时优雅降级。
- 流式难点（未闭合围栏、内联数学、流式表格、自定义 `<thinking>` 标签、nodes/content 双输入）全部交由底座，不自研解析器。
- `SCodeBlock` 通过 markstream 的 code renderer 插槽接入；单独使用时 shiki 动态导入。

### 4.6 可访问性基线（D6）

- 线程：容器 `role="log"` + `aria-live="polite"`（静默流式更新不抢占焦点）；错误消息 `role="alert"`。
- 输入：form 语义；Enter 提交必须判定 `event.isComposing`；suggestion 弹层按 combobox/listbox 模式实现 `aria-expanded`、`aria-controls`、`aria-activedescendant` 与 Esc/方向键/Home/End。
- 会话列表：roving tabindex + `aria-selected`；动作栏 `role="toolbar"`；赞踩 `aria-pressed`。
- 所有状态同时反映到 `aria-*` 与 `data-state`；样式只允许读 data 属性。
- 全部交互组件纳入 `packages/ui/test/browser` e2e 与 axe-core（含 color-contrast）。

---

## 5. P0 — Core（v1 里程碑，9 项）

> 目标：核心对话闭环 —— `SThread + SBubble + SSender` + 流式模型 + Markdown/代码 + 附件。

|  #  | 交付物                                                     | 类型                  | 需求度 | 工作量 |
| :-: | :--------------------------------------------------------- | :-------------------- | :----: | :----: |
|  1  | aria/ai 模块：类型 + `useStream` + `useChat` + `useTyping` | 逻辑模块              |  4/4   | Medium |
|  2  | `thread` 族 + `SThread`                                    | aria 族 + UI          |  4/4   |  High  |
|  3  | `SBubble`                                                  | UI-only               |  4/4   | Medium |
|  4  | `sender` 族 + `SSender`                                    | aria 族 + UI          |  4/4   |  High  |
|  5  | `SMarkdown`                                                | UI-only（第三方底座） |  4/4   | Medium |
|  6  | `SCodeBlock`                                               | UI-only               |  3/4   | Medium |
|  7  | `SAttachment` + `SAttachmentCard`                          | UI-only               |  3/4   | Medium |
|  8  | `useSend`                                                  | composable            |  3/4   |  Low   |
|  9  | `useAttachmentPicker`（最小集：隐藏 input + 拖拽）         | composable            |  2/4   | Medium |

### 5.1 aria/ai 模块

- 类型：`ThreadMessage`、`MessageStatus`、`MessagePart`（P0 仅 text/image/file；reasoning 随 P1、tool-call 随 P2 标记预留）、`Attachment`、`AttachmentStatus`、`Citation`。
- composables：`useStream`、`useChat`、`useTyping`、`useSend`；纯函数工具（parts 读写、状态流转）放 `ai/shared`。
- 单测覆盖：SSE 分包边界、abort、retry、parts 增量、IME 无关（键盘在组件层）。

### 5.2 `thread` 族 + `SThread`

- Aria 原语：`ThreadRoot`、`ThreadViewport`（滚动容器，持有跟随状态机）、`ThreadFollowTrigger`（回到底部契约元素）；行为基于底部哨兵 + 内容尺寸观察，**不使用 scroll 事件补偿**。
- 语义：`role="log"`、`aria-live="polite"`、`data-state="following|pinned"`；暴露 `scrollToBottom / atBottom / distance`。
- 不做 Compact（消息行 chrome 是 SBubble，UI-only；由 `SThread` 装配，参照 SCard 模式）。
- 能力：`items` 驱动、user/assistant placement 自动映射、跟随阈值配置、`scrollable` 开关、P2 接入 `virtualizer` 长列表。
- 依赖：aria `scroll-area`（视口结构可别名/包装评估，按 R6 逐槽决定）。

### 5.3 `SBubble`（UI-only）

- `message`（或兼容 `content` 快捷属性）、`placement: start|end`、`variant`（filled/outlined/borderless/shadow）、`shape`、`loading`、`typing: boolean | TypingOptions`。
- 插槽：`avatar / header / content / footer / loading / parts-{type}`；默认按 part 分发（text → `SMarkdown` 可开关，image/file → 对应展示）。
- 多槽 `scv()` 配方 `bubbleVariants`，`provideBubbleUi`。

### 5.4 `sender` 族 + `SSender`

- Aria 原语：`SenderRoot`、`SenderTextarea`（autosize 几何内联样式属 R8 允许范围）、`SenderSubmit`、`SenderContent` + `SenderItem` + `SenderGroup`（suggestion 弹层，领域包装 popover + listbox 键盘契约）、`SenderAttachmentTrigger`。
- 行为：受控 `modelValue`；`submitType: enter | shiftEnter`，IME 组合态不提交；Esc 关闭弹层；trigger 检测基于 `selectionStart`（修正旧实现只看文本尾部的缺陷），支持词首 `/`、`@`；查询过滤、高亮、键盘选择。
- 状态：`loading`（发送中变停止按钮）、`disabled`、`read-only`；`abort` emit。
- UI `SSender`：多槽 scv；附件区、动作区、prefix/suffix 插槽；默认组合 `SAttachment`。
- 依赖：aria `popover`、`command`（键盘导航复用评估）、`textarea`、`button`。

### 5.5 `SMarkdown` / `SCodeBlock` / 附件

- `SMarkdown`：单类/多槽轻包装；转发底座 props + 渲染插槽；样式 token 映射 UnoCSS；深浅色跟随 `SConfigProvider`。
- `SCodeBlock`：代码头部（语言标签 + 复制按钮 + 成功反馈），shiki 动态导入，失败降级 `<pre>`。
- `SAttachment`：列表（名称/大小/状态/移除）、网格与行内两种布局；`SAttachmentCard`：类型图标（IconRender）、图片缩略图、上传进度/错误态；数据模型复用 aria/ai `Attachment`。
- `useAttachmentPicker`：隐藏 file input、点击/拖拽/粘贴拾取、accept/multiple、返回响应式附件集合与状态；上传本身由消费者实现。

---

## 6. P1 — High（10 项）

|  #  | 交付物                                    | 类型                       | 需求度 | 工作量 |
| :-: | :---------------------------------------- | :------------------------- | :----: | :----: |
| 10  | `thought-chain` 族 + `SThoughtChain`      | aria 族 + UI（含 Compact） |  3/4   | Medium |
| 11  | `SReasoning`                              | UI-only（collapsible）     |  3/4   |  Low   |
| 12  | `conversations` 族 + `SConversations`     | aria 族 + UI（含 Compact） |  3/4   | Medium |
| 13  | `SActionBar` + Copy + Feedback            | UI-only 组合               |  3/4   | Medium |
| 14  | `SCitations` + `SInlineCitation`          | UI-only 组合               |  2/4   | Medium |
| 15  | `SPrompts`（含单个 prompt 卡）            | UI-only                    |  2/4   |  Low   |
| 16  | `SSuggestion`                             | UI-only                    |  2/4   |  Low   |
| 17  | `SWelcome`                                | UI-only                    |  2/4   |  Low   |
| 18  | ReasoningPart 接入 Bubble/Thread 渲染     | 模型贯通                   |  2/4   | Medium |
| 19  | 行内引用与 part 关联（citation 编号角标） | 渲染贯通                   |  2/4   | Medium |

要点：

- **ThoughtChain**：`ThoughtChainRoot/Item/ItemTrigger/ItemContent` 领域包装 collapsible；步骤 `status` 驱动 `data-state` 与默认图标（IconRender）；Compact 接收 `steps: ThoughtStep[]` 完成迭代与默认标题/描述装配，UI 包装保持薄。
- **Reasoning**：单块推理面板（流式显示 reasoning part 文本 + 折叠），UI-only 提供 `SCollapsible` UiContext 子集；不设 aria 目录。
- **Conversations**：分组（吸顶组标题）、`v-model:active`、键盘上下移动、rename/dropdown 操作插槽、滚动加载事件；Compact 数据驱动；UI 组合 `dropdown-menu`、`tooltip`、`avatar`、`button`。
- **ActionBar**：`role="toolbar"` 由 aria toolbar 承担；Copy 组合 clipboard；Feedback 为双态 toggle；预留 reload/edit/speak 插槽，消息上下文通过 `SBubble`/`SThread` 插槽提供，不做全局 runtime。
- **Citations / InlineCitation**：来源脚注列表（序号、标题、站点、可跳转）与正文角标（popover 悬浮摘要），纯展示组合 popover/link。

---

## 7. P2 — Medium（6 项）

|  #  | 交付物                                 | 说明                                                                              |
| :-: | :------------------------------------- | :-------------------------------------------------------------------------------- |
| 20  | `ToolCallPart` 模型 + `SToolCall`      | 工具调用卡：名称/状态/参数/结果折叠查看、流式 JSON；组合 collapsible + code-block |
| 21  | `useChat` branches + `SBranchPicker`   | 重生成产生候选分支，键盘可切换上一/下一版（对齐 BranchPicker）                    |
| 22  | Thread 错误态 + 重试                   | `role="alert"` 错误块 + retry 按钮（组合 alert/button）                           |
| 23  | 划词引用/提问（SelectionToolbar 形态） | 选区捕获 + 浮动按钮把选中文本送入 Sender；先做技术预研，可能转市场                |
| 24  | `SThread` 虚拟滚动                     | 长消息列表接入既有 `virtualizer`（@tanstack/vue-virtual）                         |
| 25  | Mermaid / KaTeX 渲染插件接线           | 经 markstream peer 启用；`SMermaid` 是否独立组件视插件复杂度再决策                |

---

## 8. P3 — Low（4 项）

|  #  | 交付物               | 说明                                                                                     |
| :-: | :------------------- | :--------------------------------------------------------------------------------------- |
| 26  | `useRecord`          | Web Speech Recognition 包装（start/stop/transcript/error），SSR-safe，供 Sender 语音按钮 |
| 27  | 音频消息 part/播放器 | 原生 audio 封装（播放/进度），与 speech TTS 复用                                         |
| 28  | 朗读（TTS）action    | `speechSynthesis` 适配器 + ActionBar 朗读按钮（可取消/切换语速）                         |
| 29  | 堆栈/终端文本展示    | ANSI 渲染评估（第三方轻库或自研最小解析），作为消息 part 的 code 变体                    |

---

## 9. 组件市场与范围外

### 9.1 延后至 vean 市场（源码分发）

- **工作流画布**：`Canvas / Node / Edge / Connection / Controls / Toolbar / Panel`（VueFlow 生态，体量与独立依赖决定不进核心）。
- **Artifact / WebPreview / Terminal / FileTree**：代码/文档产物、iframe 预览、终端、文件树。
- **Agent IDE 形态**：`Plan / Task / Queue / Checkpoint / Commit / EnvironmentVariables / Context`、Agent 容器 —— 以市场模板组合核心 part 原语实现。
- **悬浮助手、模型选择器**：以「配方 + 示例」提供，不新增组件。

市场组件从 `@vean/ui` 与 `@vean/aria/ai` 导入，registry namespace 统一回归 `ui`（组件名即 `ui/thread`、`ui/sender`…），不再有 `ui-x` 命名空间。

### 9.2 范围外

- 图表/数据可视化（文档站 TanStack Charts 示例策略不变）。
- 富文本编辑器（Tiptap/ProseMirror 独立生态）。
- 任何厂商 SDK 与鉴权（OpenAI/DeepSeek 适配器仅出现在文档示例）。
- iOS/原生语音、PWA 专属交互。
- 业务专属看板/知识库后台组件。

---

## 10. 旧 → 新迁移映射

| 旧 ui-x（删除，仅参考）                            | 新实现                                                     | 准入结论                                 |
| :------------------------------------------------- | :--------------------------------------------------------- | :--------------------------------------- |
| `SxBubble`                                         | `SBubble`（ui/components/bubble）                          | UI-only                                  |
| `SxBubbleList` + `useBubbleListScroll`             | `SThread` + aria `thread` 族                               | 准入                                     |
| `SxSender` + `useSender`                           | `SSender` + aria `sender` 族                               | 准入                                     |
| `SxMarkdown`                                       | `SMarkdown`（ui，markstream-vue 2.x）                      | UI-only                                  |
| `SxCodeBlock`                                      | `SCodeBlock`                                               | UI-only                                  |
| `SxAttachments` / `SxFileCard`                     | `SAttachment` / `SAttachmentCard` + `useAttachmentPicker`  | UI-only + 逻辑                           |
| `SxConversations` + `useConversations`             | `SConversations` + aria `conversations` 族                 | 准入                                     |
| `SxThink` + `useThink`                             | `SReasoning`（组合 collapsible）                           | UI-only（拒绝）                          |
| `SxThoughtChain` + `useThoughtChain`               | `SThoughtChain` + aria `thought-chain` 族                  | 准入                                     |
| `SxActions`/`ActionsCopy`/`ActionsFeedback`        | `SActionBar`/`SActionBarCopy`/`SActionBarFeedback`         | UI-only（组合 toolbar/clipboard/toggle） |
| `SxPrompts` / `SxWelcome` / `SxSuggestion`         | 同名去前缀 `SPrompts`/`SWelcome`/`SSuggestion`             | UI-only                                  |
| `SxSources`                                        | `SCitations` + `SInlineCitation`                           | UI-only                                  |
| `SxNotification`                                   | **废弃**，复用 `toast`                                     | 不做                                     |
| `SxFolder`                                         | 市场                                                       | 不进核心                                 |
| `SxMermaid`                                        | Markdown peer 插件 / 市场（P2 评估）                       | 暂缓                                     |
| `useChat` / `useXStream` / `useTyping` / `useSend` | aria/ai：`useChat` / `useStream` / `useTyping` / `useSend` | 逻辑模块                                 |
| `useRecord`（未实现）                              | aria/ai `useRecord`（P3）                                  | 逻辑模块                                 |
| `ChatMessage`（string content）                    | `ThreadMessage` + `MessagePart[]`                          | 模型升级                                 |

---

## 11. 里程碑与实施顺序

> 遵守 skill「依赖先行」：被引用的原子族/类型不存在时先建依赖；每个家族按 Phase 0–6 完整交付，不留中间态。

1. **M0 地基**：aria/ai 类型与 composables（`useStream`/`useChat`/`useTyping`/`useSend`）+ 单测。
2. **M1 输入**：`sender` 族 → `SSender`（依赖 popover/command/textarea，已存在）。
3. **M2 线程**：`thread` 族 → `SThread`；`SBubble`；打通 useChat 端到端流式 demo。
4. **M3 渲染**：`SMarkdown` + `SCodeBlock`（引入 markstream 2.x / shiki peer）。
5. **M4 附件**：`SAttachment`/`SAttachmentCard` + `useAttachmentPicker`，接入 Sender。**→ v1 发布候选**
6. **M5 P1**：thought-chain → reasoning → conversations → action-bar → citations → prompts/welcome/suggestion。
7. **M6 P2/P3**：tool-call/branches/错误态/虚拟滚动/语音，按容量排期。

每个组件的完整交付面（缺一不可，按 surfaces.md）：

- `packages/aria/src/components/{family}/`（仅准入族）+ `packages/ui/src/components/{name}/`
- 桶导出 + `pnpm sui gen catalog aria` / `pnpm sui gen catalog ui`
- `apps/docs/src/examples/ui/{name}/`、`content/{en,zh}/ui/components/{name}.md`
- `apps/docs/src/constants/menus.ts` 新增 AI 菜单分组（替代旧 `ui-x-*` 分组键）
- `packages/ui/test/specs/components/{name}.spec.ts`；交互族另加 browser e2e
- `pnpm sui gen api`（+ `--translate --locale zh-CN`）、`pnpm sui gen skills`

---

## 12. ui-x 移除清单（本次同步执行）

| 范围             | 处理                                                                                                                                             |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui-x/` | 整包删除（含 20 组件、9 composables、styles、test、README、AGENTS.md、vite/uno 配置）                                                            |
| 根构建           | `package.json` 删除 `build:ui-x` 及 build 链中的步骤                                                                                             |
| docs 应用        | 删除 `pages/ui-x/`、`examples/ui-x/`、`content/{en,zh}/ui-x/`、`generated/api/ui-x/`                                                             |
| docs 接线        | menus 分组、header-nav、sider-menu、layouts、component-api、generated-api 表、content-route、llms.ts、vite.config、`apps/docs/package.json` 依赖 |
| 生成数据         | 重跑 `sui gen api` / `sui gen skills`；registry 删除 ui-x 包与 items（`packages/cli/registry.json` 与 `apps/docs/public/r/registry.json`）       |
| 文档             | 删除 `docs/ui-x-roadmap.md`、`docs/ecosystem/ui-x.md`；更新 architecture/ecosystem/GOVERNANCE/AGENTS 等现行文档；ADR-0001 标注废止               |
| playground       | 移除 ui-x 分区与 i18n 文案                                                                                                                       |
| 锁文件           | `pnpm install` 更新 lock（markstream-vue 随 ui-x 移除，M3 重新加在 ui 包）                                                                       |

历史 Changelog / 已发布版本说明属于不可变历史记录，保留事实文字；此后不再出现 ui-x 的现行规划内容。

---

## 13. 决策记录（ADR）

| 编号 | 决策                                                                                            | 依据                                                                               |
| :--: | :---------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
|  A1  | 不新增包；AI 组件全部在 aria/ui 重实现，统一 `S` 前缀；删除 `@soybeanjs/ui-x`                   | 消除双前缀/双文档树/双生成管线；逻辑回归 aria 准入纪律                             |
|  A2  | 仅 `thread` / `sender` / `thought-chain` / `conversations` 四族准入 aria，其余 UI-only          | deletion test + R1–R8；Bubble/Reasoning/ActionBar 等在既有族上组合即可，拒绝空壳族 |
|  A3  | 新增 aria/ai 域模块（`@vean/aria/ai` 子路径）承载模型与协议 composables                         | 对齐 `./date` 先例；AI 专属逻辑不污染通用 composables 桶；零样式、零渲染依赖       |
|  A4  | `ThreadMessage` + `MessagePart[]` parts 模型，传输无关；不收厂商 SDK                            | assistant-ui 验证的分段/分支/工具调用方向；antdv/EPX 验证的协议无关 hooks 方向     |
|  A5  | Markdown 底座锁定 markstream-vue 2.x；shiki/mermaid/katex 可选 peer                             | 流式正确性不自研；2.x 接口已在旧包验证                                             |
|  A6  | 画布/Artifact/Agent IDE 进 vean 市场；通知/模型选择器/悬浮助手不新建组件                        | 低共识、重生态依赖；核心包保持聚焦对话闭环                                         |
|  A7  | 词汇以 Ant Design X 为基线（Bubble/Sender/Conversations），线程容器与模型采用 assistant-ui 命名 | 企业用户迁移成本最低，同时表达 parts/thread 的增量设计                             |

_本路线图编制于 2026-09-11。旧 `docs/ui-x-roadmap.md` 同步删除；实现完成前，旧代码仅可在 git 历史中作为行为参考，不得作为架构模板。_
