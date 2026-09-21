<p align="center">
  <samp>
    <a href="#contributing">English</a> ·
    <a href="#参与贡献">中文</a>
  </samp>
</p>

---

# Contributing

Thanks for your interest in contributing to Vean! This guide covers how to set up the project,
follow our conventions, and submit a pull request.

## Table of Contents

- [Project Overview](#project-overview)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [AI Skills & Agents](#ai-skills--agents)
- [Coding Conventions](#coding-conventions)
- [Component Development](#component-development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Commit & Pull Request](#commit--pull-request)

## Project Overview

Vean is a Vue 3 component library built on a **aria / styled separation**:

| Package      | Path             | Responsibility                                                    |
| ------------ | ---------------- | ----------------------------------------------------------------- |
| `@vean/aria` | `packages/aria/` | Logic, state, accessibility, composables. **Zero styles.**        |
| `@vean/ui`   | `packages/ui/`   | Styled wrappers (UnoCSS). Variants, theme, UI injection.          |
| Docs         | `apps/docs/`     | Bilingual docs (en / zh). ubean SSG site; owns interactive demos. |

Data flows one way: `aria` → `ui` (never reverse). The UI layer injects styles via
`provideXUi(ui)`; aria reads them through `useUiContext`.

**Tech stack:** Vue 3 + TypeScript (strict) + UnoCSS + Vitest + pnpm workspaces.

## Development Setup

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (this repo uses `pnpm@11.25.0`)

### Install

```bash
git clone https://github.com/soybeanjs/vean-ui.git
cd vean
pnpm install
```

### Local Development

```bash
# Stub packages for instant source-to-dist linking
pnpm stub

# Start the docs site (hot-reload for component dev)
pnpm dev
```

Open the docs URL shown in the terminal to preview your changes in real time.

### Common Commands

| Command                       | Purpose                                             |
| ----------------------------- | --------------------------------------------------- |
| `pnpm dev`                    | Start docs site dev server                          |
| `pnpm build`                  | Build libs (theme, unocss) → aria → ui → vean       |
| `pnpm lint`                   | vp lint --fix + eslint (Vue)                        |
| `pnpm fmt`                    | vp fmt (formatter)                                  |
| `pnpm test`                   | recursive workspace tests (pnpm -r run test)        |
| `pnpm typecheck`              | recursive typecheck (pnpm -r typecheck)             |
| `pnpm sui gen catalog`        | Regenerate aria + UI barrel constants               |
| `pnpm sui gen api`            | Regenerate API reference data                       |
| `pnpm sui gen changelog`      | Regenerate changelog data                           |
| `pnpm sui translate <target>` | Translate pending locale entries (DeepL)            |
| `pnpm sui check generated`    | Verify committed generated data matches the sources |

## Development Workflow

1. **Pick or create an issue.** Discuss the scope and approach before coding large features.
2. **Create a branch.** Use `codex/` or a descriptive prefix:
   ```bash
   git checkout -b feat/your-feature
   ```
3. **Implement.** Follow the [Component Development](#component-development) phases below.
4. **Verify.** Run typecheck, lint, format, and tests before committing.
5. **Commit.** Follow the [commit convention](#commit--pull-request).
6. **Open a pull request.** Fill the PR template and link the issue.

## AI Skills & Agents

This project provides AI-assisted development tools — **Skills** (workflow shortcuts) and
**Agents** (specialized role prompts) — to help you build components faster and more
consistently.

### Project-Local Skill

| Skill              | Trigger                                                     | What it does                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$vean-ui-develop` | Any component work (new, migrate, fix, extend, standardize) | Classifies the component pattern, enforces aria/UI split, guides through all six delivery phases, and checks boundary rules. Lives at `.agents/skills/vean-ui-develop/`. |

When you invoke `$vean-ui-develop`, the skill:

- Classifies the task (new component / migration / standards alignment).
- Determines the component pattern (multi-slot / compact / single-class).
- Enforces the correct phase order: aria → UI → exports → delivery surfaces → verification.
- Prevents boundary violations (no styles in aria, no ARIA in UI).

### System Skills Useful for Vean

These skills are available in your Codex environment and are especially useful during
Vean development:

| Skill                  | Use when                                                                          |
| ---------------------- | --------------------------------------------------------------------------------- |
| `$a11y-auditor`        | Scanning HTML/JSX output for WCAG violations.                                     |
| `$a11y-checker`        | AI-powered accessibility fix suggestions for components.                          |
| `$a11y-debugging`      | Chrome DevTools-based accessibility debugging (focus, labels, contrast).          |
| `$accessibility-check` | Full semantic structure, keyboard, focus, and label audit with a Markdown report. |
| `$code-review`         | Comprehensive code review across all concerns before opening a PR.                |
| `$ai-slop-cleaner`     | Anti-slop cleanup and refactoring pass.                                           |
| `$analyze`             | Read-only deep repository analysis with ranked synthesis.                         |

### Agent Roles

Codex provides specialized **agent roles** (prompt surfaces) that you can route complex
subtasks to:

| Role              | Best for                                                                  |
| ----------------- | ------------------------------------------------------------------------- |
| `executor`        | Implementation, refactoring, feature work — the default for coding tasks. |
| `architect`       | System design, boundary decisions, long-horizon tradeoffs.                |
| `debugger`        | Root-cause analysis and regression isolation.                             |
| `code-reviewer`   | Comprehensive review before merging.                                      |
| `test-engineer`   | Test strategy, coverage gaps, flaky-test hardening.                       |
| `designer`        | UX/UI architecture and interaction design.                                |
| `verifier`        | Completion evidence, claim validation, test adequacy.                     |
| `explore`         | Fast repo-local file, symbol, and pattern lookup.                         |
| `code-simplifier` | Simplifies recently modified code without changing behavior.              |

**Default routing:** Use `executor` for implementation. Use `code-reviewer` before
opening a PR. Use `explore` to map existing patterns before starting a new component.
Route to specialists only when the task clearly benefits from deeper analysis or
specialized review.

## Coding Conventions

Normative component rules live in the project skill at
`.agents/skills/vean-ui-develop/` (`SKILL.md` + `layers.md` + `surfaces.md` +
`process.md`). TypeScript functional style and Vue SFC structure are owned by the global
`typescript-functional-style` and `vue-sfc-structure` skills (loaded automatically per file type).

| Skill section                                | Applies to                      |
| -------------------------------------------- | ------------------------------- |
| `typescript-functional-style` (global skill) | All `.ts`, `.tsx`, `.vue` files |
| `vue-sfc-structure` (global skill)           | All `.vue` files                |
| `process.md` -> Git commit convention        | Commit messages, changelogs     |
| `SKILL.md` + `layers.md`                     | Component tasks                 |
| `layers.md` -> Aria                          | `packages/aria/src/components/` |
| `layers.md` -> UI layer                      | `packages/ui/src/components/`   |
| `layers.md` -> A11y and RTL                  | ARIA, keyboard, RTL             |
| `surfaces.md` -> Testing                     | `packages/ui/test/`             |
| `surfaces.md` -> Playground / Docs           | `apps/docs/`                    |
| `process.md` -> Finish checklist             | Component completion checklist  |

### Key Rules

- **No styles in aria.** Not even `hidden` or `sr-only`.
- **No ARIA / keyboard logic in UI.** That belongs in aria.
- **UnoCSS utility classes only.** No raw CSS / SCSS.
- **No `as any`, `@ts-ignore`, or `@ts-expect-error`.**
- **Prefer pure functions.** Extract pure logic into `shared.ts` or composables.
- **Check `@vueuse/core` first** before writing a new composable from scratch.
- **Never manually edit generated files** (barrel constants, API JSON, changelog JSON).

## Component Development

A new component goes through six phases. See
`.agents/skills/vean-ui-develop/SKILL.md` for the full specification.

### Phase 0 — Determine Mode & Scope

Decide which pattern the component follows:

- **Multi-slot** (badge, dialog, accordion…) — uses `UiSlot`, `UiClass`, `provideXUi`.
- **Compact aggregation** (AccordionCompact, TableCompact…) — aria owns iteration and structure.
- **Single-class** (button, link…) — no UiContext, direct variant call.

### Phase 1 — Reference Study

Study at least one existing component of the same pattern in both `aria` and `ui`.

### Phase 2 — Aria Implementation

Files in `packages/aria/src/components/<name>/`, in order:

1. `types.ts` — slots, props, emits, context.
2. `context.ts` — provide/inject, reactive context values.
3. Base SFCs — one per slot (Root, Trigger, Content, Item…).
4. Optional `{Name}Compact.vue` — stable aggregation.
5. `index.ts` — re-exports.

### Phase 3 — UI Implementation

Files in `packages/ui/src/components/<name>/`:

1. `packages/ui/src/styles/<name>.ts` — style recipe (first line: `// @unocss-include`).
2. `types.ts` — wrapper props.
3. Wrapper `.vue` — injects styles, forwards props/slots.
4. `index.ts` — re-exports (including aria types).

### Phase 4 — Barrel Exports & Generated Files

```bash
# Update barrel index files
pnpm sui gen catalog

# If public API changed
pnpm sui gen api
pnpm sui translate api --locale zh-CN
```

### Phase 5 — Delivery Surfaces

- **Playground demo:** `apps/docs/src/examples/<component>/`
- **Docs (en):** `apps/docs/src/content/en/ui/components/<component>.md`
- **Docs (zh):** `apps/docs/src/content/zh/ui/components/<component>.md`
- **Menu:** update `apps/docs/src/constants/menus.ts`
- **Tests:** `packages/ui/test/specs/components/<component>.spec.ts`

### Phase 6 — Verification

```bash
pnpm typecheck
pnpm lint
pnpm fmt
pnpm test
```

If any step fails, fix it before opening a PR. See the full checklist in
`.agents/skills/vean-ui-develop/process.md`.

## Testing

- **Framework:** Vitest + `@vue/test-utils` + `happy-dom`
- **Location:** `packages/ui/test/specs/components/<component>.spec.ts`
- **Required sections:** `rendering`, `{state} state`, `disabled state`, `accessibility`
- **Rule:** every `it()` block mounts and unmounts independently.
- **Accessibility:** use `axe-core` via `getA11yViolations`.

```bash
# Run all tests
pnpm test

# Run a specific component test
pnpm --filter @vean/ui exec vitest run test/specs/components/button.spec.ts
```

## Documentation

Docs live under `apps/docs/src/docs/<locale>/components/`. Every component needs both
English (`en`) and Chinese (`zh-CN`) documentation with matching structure.

API reference data is auto-generated. After changing public exports:

```bash
pnpm sui gen api                    # Regenerate baseline
pnpm sui gen api --force            # Re-extract even when the fingerprint matches
pnpm sui translate api --locale zh-CN        # Translate pending descriptions
pnpm sui translate api --dry-run             # Report pending counts without spending API calls
pnpm sui check generated            # Verify the committed generated data is in sync
```

## Commit & Pull Request

### Commit Convention

We follow **Conventional Commits** with mandatory scope:

```
<type>(<scope>): <subject>
```

Examples:

- `feat(button): add loading slot and loading prop`
- `fix(dialog): prevent outside click from closing nested popup`
- `docs(table): document remote pagination`

**Types:** `feat`, `fix`, `perf`, `refactor`, `docs`, `chore`

**Scope:** prefer the exact component name (e.g., `button`, `dialog`). Use broader scopes
(`ui`, `aria`, `composables`, `shared`, `docs`, `build`, `deps`) only when the change
is truly cross-cutting.

**Subject:** imperative, specific, and outcome-oriented. No trailing period.

Full rules: `.agents/skills/vean-ui-develop/process.md`.

### Pull Request Guidelines

- One PR = one logical change. Prefer small, focused PRs.
- Link the related issue.
- Run the formatter locally, then ensure CI passes (typecheck, lint, tests, and browser e2e).
- If the PR adds a new component, include demo examples and bilingual docs.
- Keep the PR description concise: what, why, and how to verify.

---

# 参与贡献

感谢你对 Vean 的关注！本指南涵盖项目搭建、规范遵循和 PR 提交流程。

## 目录

- [项目概览](#项目概览)
- [开发环境搭建](#开发环境搭建)
- [开发流程](#开发流程)
- [AI Skills 与智能体](#ai-skills-与智能体)
- [编码规范](#编码规范)
- [组件开发](#组件开发)
- [测试](#测试)
- [文档](#文档)
- [Commit 与 Pull Request](#commit-与-pull-request)

## 项目概览

Vean 是一个基于 **aria / styled 分层架构** 的 Vue 3 组件库：

| 包           | 路径             | 职责                                         |
| ------------ | ---------------- | -------------------------------------------- |
| `@vean/aria` | `packages/aria/` | 逻辑、状态、无障碍、composable。**零样式。** |
| `@vean/ui`   | `packages/ui/`   | 样式包装（UnoCSS）。变体、主题、UI 注入。    |
| Docs         | `apps/docs/`     | 中英文档（ubean SSG），同时承载交互式示例。  |

数据流单向：`aria` → `ui`（不可反向）。UI 层通过 `provideXUi(ui)` 注入样式；
aria 通过 `useUiContext` 读取。

**技术栈：** Vue 3 + TypeScript (strict) + UnoCSS + Vitest + pnpm workspaces。

## 开发环境搭建

### 前置条件

- **Node.js** ≥ 20
- **pnpm** ≥ 9（本仓库使用 `pnpm@11.25.0`）

### 安装

```bash
git clone https://github.com/soybeanjs/vean-ui.git
cd vean
pnpm install
```

### 本地开发

```bash
# 建立源码到构建产物的软链接
pnpm stub

# 启动文档站（组件开发热更新）
pnpm dev
```

打开终端输出的文档站地址，即可实时预览改动。

### 常用命令

| 命令                          | 用途                                          |
| ----------------------------- | --------------------------------------------- |
| `pnpm dev`                    | 启动文档站开发服务器                          |
| `pnpm build`                  | 构建 libs（theme、unocss）→ aria → ui → vean  |
| `pnpm lint`                   | vp lint --fix + eslint（Vue）                 |
| `pnpm fmt`                    | vp fmt（格式化）                              |
| `pnpm test`                   | 递归运行各 workspace 测试（pnpm -r run test） |
| `pnpm typecheck`              | 递归类型检查（pnpm -r typecheck）             |
| `pnpm sui gen catalog`        | 重新生成 aria + UI barrel 常量                |
| `pnpm sui gen api`            | 重新生成 API 参考数据                         |
| `pnpm sui gen changelog`      | 重新生成 changelog 数据                       |
| `pnpm sui translate <target>` | 翻译待译条目（DeepL）                         |
| `pnpm sui check generated`    | 校验生成数据与源码是否一致                    |

## 开发流程

1. **选择或创建 issue。** 大型功能先讨论范围和方案再动手。
2. **创建分支。** 使用 `codex/` 或描述性前缀：
   ```bash
   git checkout -b feat/你的功能
   ```
3. **实现。** 按照下方 [组件开发](#组件开发) 的阶段顺序推进。
4. **验证。** 提交前运行 typecheck、lint、format 和测试。
5. **Commit。** 遵循 [commit 规范](#commit-与-pull-request)。
6. **提交 PR。** 填写 PR 模板并关联 issue。

## AI Skills 与智能体

本项目提供了 AI 辅助开发工具 —— **Skills**（工作流快捷方式）和 **Agents**（专用角色 prompt）
—— 帮助你更快、更一致地构建组件。

### 项目本地 Skill

| Skill              | 触发条件                                       | 功能                                                                                                                    |
| ------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `$vean-ui-develop` | 任何组件工作（新建、迁移、修复、扩展、规范化） | 分类组件模式，强制执行 aria/UI 分层，引导完成全部六个交付阶段，并检查边界规则。位于 `.agents/skills/vean-ui-develop/`。 |

当你调用 `$vean-ui-develop` 时，该 skill 会：

- 分类任务（新建组件 / 迁移 / 规范化对齐）。
- 确定组件模式（多 slot / compact 聚合 / 单类名）。
- 强制执行正确的阶段顺序：aria → UI → 导出 → 交付面 → 验证。
- 防止边界违规（aria 中无样式，UI 中无 ARIA）。

### Vean 开发相关的系统 Skill

以下 skills 在你的 Codex 环境中可用，在 Vean 开发中尤其有用：

| Skill                  | 使用场景                                                   |
| ---------------------- | ---------------------------------------------------------- |
| `$a11y-auditor`        | 扫描 HTML/JSX 输出中的 WCAG 违规。                         |
| `$a11y-checker`        | AI 驱动的组件无障碍修复建议。                              |
| `$a11y-debugging`      | 基于 Chrome DevTools 的无障碍调试（焦点、标签、对比度）。  |
| `$accessibility-check` | 完整的语义结构、键盘、焦点和标签审计，生成 Markdown 报告。 |
| `$code-review`         | 提 PR 前的全面代码审查。                                   |
| `$ai-slop-cleaner`     | 反 AI slop 清理和重构。                                    |
| `$analyze`             | 只读深度仓库分析，带排序综合报告。                         |

### Agent 角色

Codex 提供专门的 **agent 角色**（prompt 面），你可以将复杂子任务路由给它们：

| 角色              | 最适合                                       |
| ----------------- | -------------------------------------------- |
| `executor`        | 实现、重构、功能开发 —— 编码任务的默认选择。 |
| `architect`       | 系统设计、边界决策、长期权衡。               |
| `debugger`        | 根因分析和回归隔离。                         |
| `code-reviewer`   | 合并前的全面审查。                           |
| `test-engineer`   | 测试策略、覆盖率缺口、flake 测试加固。       |
| `designer`        | UX/UI 架构和交互设计。                       |
| `verifier`        | 完成证据、声明验证、测试充分性。             |
| `explore`         | 快速仓库内文件、符号和模式查找。             |
| `code-simplifier` | 简化最近修改的代码而不改变行为。             |

**默认路由：** 实现用 `executor`。提 PR 前用 `code-reviewer`。开始新组件前用
`explore` 映射已有模式。仅在任务明确受益于更深入分析或专项审查时路由到专家角色。

## 编码规范

组件规范统一位于项目 skill `.agents/skills/vean-ui-develop/`（`SKILL.md` + `layers.md` + `surfaces.md` + `process.md`）。TypeScript 函数式风格与 Vue SFC 结构由全局 skill `typescript-functional-style` 和 `vue-sfc-structure` 负责（按文件类型自动加载）。

| Skill 章节                                  | 适用范围                        |
| ------------------------------------------- | ------------------------------- |
| `typescript-functional-style`（全局 skill） | 所有 `.ts`、`.tsx`、`.vue` 文件 |
| `vue-sfc-structure`（全局 skill）           | 所有 `.vue` 文件                |
| `process.md` -> Git commit 规范             | Commit message、changelog       |
| `SKILL.md` + `layers.md`                    | 组件任务                        |
| `layers.md` -> Aria                         | `packages/aria/src/components/` |
| `layers.md` -> UI layer                     | `packages/ui/src/components/`   |
| `layers.md` -> A11y and RTL                 | ARIA、键盘、RTL                 |
| `surfaces.md` -> Testing                    | `packages/ui/test/`             |
| `surfaces.md` -> Playground / Docs          | `apps/docs/`                    |
| `process.md` -> Finish checklist            | 组件完成清单                    |

### 核心规则

- **aria 中禁止样式。** 连 `hidden` 或 `sr-only` 也不行。
- **UI 层禁止 ARIA / 键盘逻辑。** 这些属于 aria。
- **仅使用 UnoCSS 工具类。** 禁止裸 CSS / SCSS。
- **禁止 `as any`、`@ts-ignore`、`@ts-expect-error`。**
- **优先纯函数。** 将纯逻辑提取到 `shared.ts` 或 composable。
- **新增 composable 前先检查 `@vueuse/core`。** 避免从零重写常见能力。
- **禁止手动编辑生成文件**（barrel 常量、API JSON、changelog JSON）。

## 组件开发

一个新组件经过六个阶段。详见 `.agents/skills/vean-ui-develop/SKILL.md`。

### Phase 0 — 确定模式与范围

判断组件属于哪种模式：

- **多 slot**（badge、dialog、accordion…）—— 使用 `UiSlot`、`UiClass`、`provideXUi`。
- **Compact 聚合**（AccordionCompact、TableCompact…）—— aria 负责迭代与结构。
- **单类名**（button、link…）—— 无 UiContext，直接调用 variant。

### Phase 1 — 参照学习

至少阅读一个同模式的 aria 参考和一个 UI 参考。

### Phase 2 — Aria 实现

文件在 `packages/aria/src/components/<name>/`，按顺序：

1. `types.ts` — slots、props、emits、context。
2. `context.ts` — provide/inject，响应式 context 值。
3. 基础 SFC — 每个 slot 一个文件（Root、Trigger、Content、Item…）。
4. 可选 `{Name}Compact.vue` — 稳定聚合。
5. `index.ts` — 重导出。

### Phase 3 — UI 实现

文件在 `packages/ui/src/components/<name>/`：

1. `packages/ui/src/styles/<name>.ts` — 样式配方（首行：`// @unocss-include`）。
2. `types.ts` — wrapper props。
3. wrapper `.vue` — 注入样式，转发 props/slots。
4. `index.ts` — 重导出（含 aria 类型）。

### Phase 4 — Barrel 导出与生成文件

```bash
# 更新 barrel index 文件
pnpm sui gen catalog

# 如果公开 API 有变化
pnpm sui gen api
pnpm sui translate api --locale zh-CN
```

### Phase 5 — 交付面

- **Playground 示例：** `apps/docs/src/examples/<component>/`
- **英文文档：** `apps/docs/src/content/en/ui/components/<component>.md`
- **中文文档：** `apps/docs/src/content/zh/ui/components/<component>.md`
- **菜单：** 更新 `apps/docs/src/constants/menus.ts`
- **测试：** `packages/ui/test/specs/components/<component>.spec.ts`

### Phase 6 — 验证

```bash
pnpm typecheck
pnpm lint
pnpm fmt
pnpm test
```

任一步骤失败，请在提 PR 前修复。完整清单见
`.agents/skills/vean-ui-develop/process.md`。

## 测试

- **框架：** Vitest + `@vue/test-utils` + `happy-dom`
- **位置：** `packages/ui/test/specs/components/<component>.spec.ts`
- **必须覆盖：** `rendering`、`{state} state`、`disabled state`、`accessibility`
- **规则：** 每个 `it()` 块独立挂载和卸载。
- **无障碍：** 使用 `axe-core` 通过 `getA11yViolations` 检查。

```bash
# 运行全部测试
pnpm test

# 运行指定组件测试
pnpm --filter @vean/ui exec vitest run test/specs/components/button.spec.ts
```

## 文档

文档位于 `apps/docs/src/content/<locale>/`。每个组件需要中英文文档，结构一致。

API 参考数据自动生成。公开导出变化后：

```bash
pnpm sui gen api                    # 重新生成基线
pnpm sui translate api --locale zh-CN   # 翻译描述
pnpm sui translate api --dry-run             # 只报告待译数量，不花费翻译额度
pnpm sui gen api --force            # 即使指纹匹配也重新抽取
```

## Commit 与 Pull Request

### Commit 规范

遵循 **Conventional Commits**，scope 必填：

```
<type>(<scope>): <subject>
```

示例：

- `feat(button): add loading slot and loading prop`
- `fix(dialog): prevent outside click from closing nested popup`
- `docs(table): document remote pagination`

**类型：** `feat`、`fix`、`perf`、`refactor`、`docs`、`chore`

**Scope：** 优先精确组件名（如 `button`、`dialog`）。仅在真正跨领域时使用宽 scope
（`ui`、`aria`、`composables`、`shared`、`docs`、`build`、`deps`）。

**Subject：** 祈使语气，具体，面向结果。不以句号结尾。

完整规范：`.agents/skills/vean-ui-develop/process.md`。

### Pull Request 指南

- 一个 PR = 一个逻辑变更。优先小 PR。
- 关联相关 issue。
- 先在本地运行格式化，再确保 CI 通过（typecheck、lint、tests 与 browser e2e）。
- 新增组件须包含 playground 示例和中英文档。
- PR 描述简洁：做了什么、为什么、如何验证。
