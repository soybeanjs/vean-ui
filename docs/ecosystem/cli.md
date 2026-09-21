# vean — 源码分发 CLI 综合开发指南

> 定位：`@vean/cli`（`packages/cli`）CLI 的开发指南——命令面、模块结构、完成度与待办。给 vean 贡献者、生态开发者与 AI Agent 用。
> 状态：🔵 进行中（核心功能已完成，剩余项见 §6）
> 基线：2026-09-06 · 版本：0.31.0
>
> 技术深度文档（ADR / 术语 / shadcn-vue 对标）已在包内独立维护，本文只做索引与摘要：
>
> - 决策记录：[packages/cli/docs/adr.md](../../packages/cli/docs/adr.md)（ADR-001~011）
> - 术语表：[packages/cli/docs/GLOSSARY.md](../../packages/cli/docs/GLOSSARY.md)
> - 对标分析：[packages/cli/docs/comparison-with-shadcn-vue.md](../../packages/cli/docs/comparison-with-shadcn-vue.md)

---

## 1. 概述与技术栈

vean 是 Vean 生态的**源码分发（copy-paste）CLI**，对标 shadcn-ui/shadcn-vue 的 `packages/cli`：从 registry 拉取组件源码并复制进用户项目，同时提供项目脚手架、registry 管理、MCP 工具等。

| 功能层     | shadcn-ui         | vean                            |
| ---------- | ----------------- | ------------------------------- |
| CLI 框架   | Commander         | Commander                       |
| 配置文件   | `components.json` | `vean.json`                     |
| 基础组件库 | radix-ui/base-ui  | `@vean/aria`                    |
| 样式系统   | tailwindcss       | UnoCSS（`@vean/unocss` preset） |
| 变体系统   | cva               | `@soybeanjs/cva`                |
| 验证库     | zod               | **valibot**（tree-shakable）    |
| 框架支持   | React/Next        | Vue 3（Vite）/ Nuxt             |

设计哲学：**vean = 分发系统，主题 token 归 `@vean/theme`**（ADR-003）。只做导入路径重写；CSS 变量 / RTL / Dark Mode 由 UnoCSS 预设提供；图标为 Iconify 组件式（ADR-007，不做 class-icon 子系统）。

## 2. 命令面（16 个）

| 命令                    | 说明                                                       | 主要选项                                                                                                                                                                                                                   |  状态   |
| ----------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: |
| `init`（别名 `create`） | 初始化 `vean.json`，可脚手架新项目                         | `-c/--cwd` `-m/--monorepo` `--nuxt` `--ui-dir` `--size` `-b/--base` `--primary` `--radius` `-p/--preset` `--icon-library` `--font-sans` `--font-heading` `-y/--yes` `-d/--defaults` `-f/--force` `-n/--name` `-s/--silent` | ✅ 完整 |
| `add`                   | 添加组件（copy-paste 核心引擎）                            | `-y` `-o/--overwrite` `-c/--cwd` `-p/--path` `--dry-run` `--diff` `--view` `-a/--all` `-s/--silent`                                                                                                                        | ✅ 完整 |
| `apply <preset>`        | 将预设应用到已有项目（改写 `vean.json`）                   | `-c/--cwd`                                                                                                                                                                                                                 | ✅ 完整 |
| `build [registry]`      | 构建 registry：逐 item JSON + catalog                      | `-o/--output` `-c/--cwd`                                                                                                                                                                                                   | ✅ 完整 |
| `diff <component>`      | 本地与 registry 行级差异对比                               | `-c/--cwd`                                                                                                                                                                                                                 | ✅ 完整 |
| `docs <components...>`  | 输出 docs / api / registry / source 链接                   | `--json`                                                                                                                                                                                                                   | ✅ 完整 |
| `view <component>`      | 查看组件源码（本地优先，远程兜底）                         | `-c/--cwd`                                                                                                                                                                                                                 | ✅ 完整 |
| `search [query]`        | 搜索组件（Levenshtein 模糊 + 相关性）                      | `-a/--all` `-t/--type` `-l/--limit` `-o/--offset` `-c/--cwd`                                                                                                                                                               | ✅ 完整 |
| `template [name]`       | 列出 / 脚手架项目模板                                      | `-l/--list` `-o/--output` `-f/--framework <vite\|nuxt>` `-c/--cwd`                                                                                                                                                         | ✅ 完整 |
| `info`                  | 项目与配置信息                                             | `-c/--cwd` `--json`                                                                                                                                                                                                        | ✅ 完整 |
| `list`                  | 列出 registry 条目，可按包过滤                             | `--package <name>` `--json` `-c/--cwd`                                                                                                                                                                                     | ✅ 完整 |
| `mcp`                   | 启动 MCP server；`mcp init` 写各客户端配置                 | `--client <claude\|cursor\|vscode\|codex\|opencode>`                                                                                                                                                                       | ✅ 完整 |
| `registry`              | `add` 增补命名空间 registry；`validate` 校验 registry.json | —                                                                                                                                                                                                                          | ✅ 完整 |
| `preset`                | `list` / `show <preset>` / `apply <preset>` 管理预设       | —                                                                                                                                                                                                                          | ✅ 完整 |
| `scan`                  | 从组件源码树自动生成 registry.json（合并保留手填元数据）   | `-c/--cwd` `-o/--output` `-p/--package <name>` `--no-merge`                                                                                                                                                                | ✅ 完整 |
| `migrate [migration]`   | 消费者项目迁移（`rebrand`：SoybeanUI → Vean 规则式改写）   | `-c/--cwd` `-w/--write` `--runtime-contract` `--cli` `--new-domain` `--new-cdn` `--repo-slug` `-f/--force` `-q/--quiet`                                                                                                    | ✅ 完整 |

> 与 shadcn-vue（11 命令）对比：vean 独有 `template` / `registry` / `preset` / `scan`；`migrate` 已于 v0.50.0 落地（`rebrand` 迁移，规则式文本改写而非 AST），补齐此前的唯一缺口。见对标文档 §3.1 与 ADR-004。

## 3. 模块结构

```
packages/cli/src/
├── index.ts                    # CLI 入口（commander 注册 16 命令）
├── bin.js                      # tsx 加载入口
├── commands/                   # 16 个命令实现
├── migrate/                    # 迁移引擎：rules（规则表 + 改写）/ walk（文件发现）/ preview（终端预览）/ rebrand（SoybeanUI → Vean）
├── registry/
│   ├── schema.ts               # valibot schema：15 类型 / package / meta / uno(ADR-005) / base(ADR-009) / font / 依赖环验证
│   ├── config.ts               # rawConfigSchema/configSchema + PRESET_* 常量（取自 @vean/theme）
│   ├── constants.ts            # REGISTRY_URL / DOCS_URL / UI_SOURCE_PATH / BUILTIN_REGISTRIES
│   ├── loader.ts               # registry 读取 + include 合并（深度 32）
│   ├── fetcher.ts              # 远程获取（缓存优先 + ETag + 304 + 命名空间解析）
│   ├── cache.ts                # TTL 本地缓存（~/.vean/cache，24h）
│   ├── search.ts               # 全文/模糊/相关性/筛选/分页
│   └── preset.ts               # base62 预设编码（版本 'b'）
├── utils/
│   ├── add-components.ts       # copy-paste 核心：BFS 依赖解析 + 文件级展开 + barrel + topo 排序(ADR-006)
│   ├── get-config.ts           # vean.json 查找/读写/默认配置
│   ├── get-project-info.ts     # 框架/TS/UnoCSS/包管理器检测
│   ├── scan-installed.ts       # 扫描已装组件（供 MCP explain_gap）
│   ├── transformers/transform-import.ts  # transformImports（#ui 单别名）+ transformIcons
│   └── updaters/               # update-files（写/预览/diff/silent）、update-dependencies（按 PM 安装）
├── templates/                  # templates.ts（vue-vite/nuxt 2 模板）+ index.ts（脚手架/变量插值）
├── mcp/index.ts                # MCP server（@modelcontextprotocol/sdk，8 tools）
├── schema/index.ts             # 子路径导出 registry/schema + config
└── preset/index.ts             # 子路径导出 registry/preset + config
```

关键设计点（详见 GLOSSARY / ADR）：

- **BFS-queue 依赖解析 + 文件级源展开**：`expandRegistryItemFiles` 自动拉取同目录被 import 的源文件，`includeBarrelFiles` 补 barrel `index.ts`（保留 aria barrel 契约），`topologicallySortItems`（ADR-006）保证写入顺序确定、`--diff` 可复现。
- **写入门控**：`WRITABLE_FILE_TYPES` 仅放行 `registry:ui/style/lib/theme`；`registry:component/block/hook/base/font` 及内部类型不可直接写入。
- **依赖图验证**：`validateRegistryDependencies` 做 DFS 环检测 + 缺失依赖检测（shadcn 无此能力，见对标 §8）。
- **命名空间 registry（EC-E02/E04）**：item 名形如 `<package>/<component>`（当前仅有 `ui/button` 等；未来外围包按其包名扩展，如 `<pkg>/<component>`）并附 `package` 字段；`build` 按子路径落盘 `r/ui/button.json`；CLI 支持命名空间寻址，**核心 `ui` 包裸名免前缀（`vean add button`），其他包必须带前缀（`vean add <package>/<component>`）**，裸名命中非核心包时抛 `PackageNamespaceRequiredError` 提示；`list --package` / `search --package` 按包过滤。
- **多包落地路径（shadcn-vue 多别名方式，EC-E03）**：`vean.json` 增 `aliases`（包名 → import 别名，如 `<package>: "#<package>"`），经 tsconfig `paths` 解析为各包输出目录（默认 `src/<package>`）；`resolveTargetPath` 按 `packages/<pkg>/src/` 段路由到对应包目录，并支持 shadcn v4.7 式 alias-aware `target`（`#<package>/foo/bar.vue`）。核心 `ui` 保持 `src/ui` 不变。
- **预设 code**：base62 位打包设计参数，`init --preset` / `preset show` 可用；版本 `b` 已移除 menu 体系。
- **模板**：`vue-vite` / `nuxt` 两模板共享 `uno.config.ts` 与 `vean.json` 片段，变量插值 `{{projectName}}/{{uiDir}}/{{resolverPath}}`，并复制 resolver / Nuxt module 进用户 `uiDir`。
- **MCP**：官方 `@modelcontextprotocol/sdk` transport（ADR-011 已落地），8 个工具（7 个对标 parity + `explain_gap` 独有）。
- **迁移引擎（ADR-004 恢复）**：`migrate/` 是**规则式文本改写**而非 AST，且**只面向消费者项目**（原脚本的 `--profile=repo` 自改层——私有包名、品牌文案、logo 资产名——刻意未移植）。四层规则：包名（由 `PACKAGE_RENAMES` 表生成，`(?![\w-])` 负向前瞻保证 `@soybeanjs/ui-uno`、`@soybeanjs/ui-x` 不被半替换）、运行时契约、CLI、域名。破坏性三层一律 opt-in，默认 dry-run + 幂等；`--new-domain` / `--new-cdn` / `--repo-slug` 三者独立。`detect.ts` 做 preflight：从 `package.json` 依赖、`sbean.json`、源码标识符、契约与 `sbean` 调用判断「这是不是 SoybeanUI 时代的项目」，没有痕迹就拒绝执行（退出码 1、不落盘，`--force` 可覆盖），只匹配到旧域名链接时同样拒绝，除非显式传了域名类选项。`walk.ts` 决定哪些文件可改写（跳过 `node_modules` / 构建产物 / lockfile / `CHANGELOG.md`，含二进制与 4 MB 上限），`preview.ts` 负责终端 diff 预览，`rebrand.ts` 先全量在内存改写、过 preflight 后再落盘。报告的 **Worth adding**（本次没开但项目里仍有对应改动的开关）与 **Still manual**（按实际探测结果生成的人工步骤，换包命令直接取自 `package.json`）都是按项目内容生成，不再无条件打印；`--cli` 额外把 `sbean.json` 重命名为 `vean.json`（已存在同名目标则不覆盖）。
- **JSON Schema 发布**（ADR-008）：`scripts/schema.ts` 用 `@valibot/to-json-schema` 生成 `apps/docs/public/schema/{vean,registry-item,registry}.json`（`pnpm --filter @vean/cli build:schema`）。

## 4. 完成度核对（对照旧 SBEAN_GUIDE 待办）

以下为旧 `markdown/SBEAN_GUIDE.md`（2026-06-11，80%）中列出的待办，与当前代码逐条核对：

| 旧待办                                             | 优先级 | 当前状态  | 落点                                                             |
| -------------------------------------------------- | ------ | :-------: | ---------------------------------------------------------------- |
| Fetcher 集成缓存（ETag 条件请求）                  | P1     |  ✅ 完成  | `registry/fetcher.ts` + `cache.ts`                               |
| Search 命令使用新引擎（`--type/--limit/--offset`） | P1     |  ✅ 完成  | `commands/search.ts` + `registry/search.ts`                      |
| Registry 类型完善（Meta/依赖/文件依赖验证）        | P1     |  ✅ 完成  | `registry/schema.ts`（15 类型 + `validateRegistryDependencies`） |
| Transformer 集成                                   | P2     |  ✅ 完成  | `utils/updaters/update-files.ts`                                 |
| Template 命令                                      | P2     |  ✅ 完成  | `commands/template.ts`（模板收敛为 2 种，见 §5）                 |
| 文档更新                                           | P2     |  ⚠️ 部分  | README 仍精简；权威技术文档已沉淀到 `packages/cli/docs/`         |
| 测试补齐                                           | P3     |  ✅ 完成  | `packages/cli/test/` 17 个 spec（含 `migrate.spec.ts`）          |
| 性能优化                                           | P3     | ⚠️ 未专项 | —                                                                |

**结论**：旧指南的 P1/P2 待办已全部落地；P3 测试已补齐。旧指南整体过时，已被本文 + 包内 docs 取代。

## 5. 与旧指南不一致的修正点

- 版本/完成度：0.29.0-beta.7 / 80% → **0.31.0 / 核心功能完整**。
- 命令数：10 → **16**（在 `template`/`mcp`/`registry`/`scan` 之外新增 `diff`/`apply`/`docs`；v0.50.0 再补 `migrate`）。
- 模板数：旧指南称 4 种（Vue Bare / Library 未实现）→ 实际 **2 种**（`vue-vite`、`nuxt`，ADR-010）。
- `vean.json` 结构：旧示例含 `style`/`menu` 等已删除字段 → 当前为 `iconLibrary` / `uno{base,primary,size,radius}` / `font{sans,heading}` / `registries`。
- 缓存 API：`getCacheStats()` → `getRegistryCacheStats()`；`getCachedRegistryItem(namespace, name)` 实际需 namespace + itemName。
- 目录结构：实际含 `mcp/`、`schema/`、`preset/` 子路径导出；`types/` 目录不存在（类型内联在各 schema）。

## 6. 真实剩余待办

| 项                                                          | 优先级 |    状态     | 说明                                                                                                                                   |
| ----------------------------------------------------------- | :----: | :---------: | -------------------------------------------------------------------------------------------------------------------------------------- |
| `migrate` 命令                                              |   —    |  ✅ 已完成  | ADR-004 因品牌改名（SoybeanUI → Vean，v0.50.0）恢复：`vean migrate rebrand` 规则式改写，2026-09-18 落地（`migrate/` 模块 + 20 条单测） |
| `migrate` 的 AST 能力（`ts-morph` / `vue-metamorph`）       |  延后  | 📋 Deferred | 品牌改名是字符串级改写，用不上 AST；等出现**语法级**破坏性变更（如 `@soybeanjs/cva` v1、aria 上下文 API 演进）再引入                   |
| 每 registry 认证（`{url,params,headers}` 对象形式）         |   P3   |   💡 Open   | 对标 G-9：私有/带认证 registry 尚不支持                                                                                                |
| registry 命名空间化（items → `ui/<name>` + `package` 字段） |   P0   |  ✅ 已完成  | 已落地：当前 registry 条目均为 `ui/*`，CLI 支持命名空间寻址与 `--package` 过滤，见本文档 registry 小节                                 |
| README.md 精简补全                                          |   P2   |  📋 待排期  | 仅列 7 命令表，缺 init/apply/template/preset/scan/migrate 等                                                                           |
| 性能优化专项                                                |   P3   |  📋 待排期  | 无明确计划                                                                                                                             |

## 7. 快速参考

### 常用命令

```bash
vean init --defaults -y          # 默认配置初始化
vean init --preset <code>        # 用预设 code 初始化
vean template --list             # 列出模板
vean template nuxt --output my-app   # 脚手架 Nuxt 项目
vean add button --dry-run        # 预览
vean add button --diff           # 行级差异
vean add --all -y                # 批量添加
vean search button -t component # 按类型搜索
vean view button                 # 查看源码
vean docs accordion --json       # 文档链接
vean diff button                 # 对比本地与 registry
vean info --json                 # 项目信息
vean scan -o registry.json       # 源码树生成 registry
vean registry add @acme=https://example.com/r/{name}.json
vean preset show soybean         # 预设详情
vean mcp init --client claude    # 写 MCP 客户端配置
vean migrate rebrand             # 预览 SoybeanUI → Vean 迁移
vean migrate rebrand -w --runtime-contract --cli --new-domain veanui.com
```

### vean.json

```json
{
  "iconLibrary": "lucide",
  "uno": { "base": "zinc", "primary": "indigo", "size": "md", "radius": "md" },
  "font": {},
  "aliases": { "ui": "#ui" },
  "registries": {}
}
```

> `aliases` 按包声明 import 别名（shadcn-vue 风格），经 tsconfig `paths` 解析为输出目录；默认 `src/<package>`。`vean info` 会列出各包解析后的路径。

### 子路径导出

`@vean/cli` 暴露 CLI 与 `/registry`、`/schema`、`/preset`、`/utils`、`/mcp` 五个子路径（见 [architecture.md §9](../architecture.md)）。

## 8. 相关文档索引

| 文档                                                                                                     | 内容                                       |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [packages/cli/docs/adr.md](../../packages/cli/docs/adr.md)                                               | ADR-001~011 决策记录（状态与实现逐条对应） |
| [packages/cli/docs/GLOSSARY.md](../../packages/cli/docs/GLOSSARY.md)                                     | 术语表（附 file:line）                     |
| [packages/cli/docs/comparison-with-shadcn-vue.md](../../packages/cli/docs/comparison-with-shadcn-vue.md) | vs shadcn-vue 能力对标与审计               |
| [packages/cli/README.md](../../packages/cli/README.md)                                                   | 用户侧入门 README（精简）                  |
| [roadmap.md §配套基础设施](../roadmap.md)                                                                | vean 在整体路线中的定位                    |
| [optimize.md §3.4](../optimize.md)                                                                       | vean 模块边界评估与依赖声明改进项          |
