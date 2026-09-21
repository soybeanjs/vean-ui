---
head:
  title: VeanUI CLI
  description: vean 是 VeanUI 的命令行工具，用于初始化项目、添加组件、管理 UI 配置与迁移项目。
---

# VeanUI CLI

`vean` 是 VeanUI 的命令行工具，用于初始化项目、添加组件、管理 UI 配置与迁移项目。

## 安装

```bash
pnpm add -D @vean/cli
```

或直接运行：

```bash
npx @vean/cli@latest init
```

## 命令

### `vean init`

初始化 VeanUI 项目或为现有项目添加配置。

```bash
vean init [options]
```

| 选项                    | 描述                                                                  | 默认值                                        |
| ----------------------- | --------------------------------------------------------------------- | --------------------------------------------- |
| `-m, --monorepo`        | 使用 monorepo（pnpm workspaces）结构                                  | `false`                                       |
| `--ui-dir <path>`       | 组件输出目录                                                          | `src/ui`（单仓库）/ `packages/ui`（monorepo） |
| `--size <size>`         | 组件尺寸：xs / sm / md / lg / xl / 2xl                                | `md`                                          |
| `--style <style>`       | 样式预设：soybean / clean / dense                                     | `soybean`                                     |
| `-b, --base <base>`     | 基础色：zinc / neutral / stone / slate / gray                         | `zinc`                                        |
| `--primary <primary>`   | 主色：indigo / blue / green / ...                                     | `indigo`                                      |
| `--radius <radius>`     | 圆角：none / xs / sm / md / lg / xl / 2xl                             | `md`                                          |
| `-p, --preset <code>`   | 预设编码（base62 编码的配置）                                         | —                                             |
| `--icon-library <lib>`  | 图标库：lucide / material-symbols / ph / tabler / solar / radix-icons | `lucide`                                      |
| `--font-sans <font>`    | 无衬线字体：inter / roboto / geist / ...                              | —                                             |
| `--font-heading <font>` | 标题字体或 `inherit`                                                  | —                                             |
| `-y, --yes`             | 跳过确认提示                                                          | `false`                                       |
| `-d, --defaults`        | 使用默认配置                                                          | `false`                                       |
| `-f, --force`           | 覆盖已有配置                                                          | `false`                                       |

不提供选项时将进入交互式引导。

### `vean add`

向项目添加组件。

```bash
vean add <component...> [options]
```

| 选项                | 描述                               |
| ------------------- | ---------------------------------- |
| `-y, --yes`         | 跳过确认提示                       |
| `-o, --overwrite`   | 覆盖已有文件                       |
| `-p, --path <path>` | 目标路径（默认使用配置中的 uiDir） |
| `--dry-run`         | 预览变更而不写入                   |
| `--diff`            | 显示本地与注册表的差异             |
| `--view`            | 查看组件源码而不添加               |
| `-a, --all`         | 添加所有可用组件                   |
| `-s, --silent`      | 静默输出                           |

### `vean build`

从 registry.json 构建注册表 JSON 文件。

```bash
vean build [registry] [options]
```

| 选项                  | 描述     | 默认值       |
| --------------------- | -------- | ------------ |
| `-o, --output <path>` | 输出目录 | `./public/r` |

### `vean search`

搜索可用组件。

```bash
vean search [query] [options]
```

| 选项                    | 描述                                               |
| ----------------------- | -------------------------------------------------- |
| `-a, --all`             | 显示所有组件                                       |
| `-t, --type <type>`     | 按类型筛选：component / hook / style / lib / theme |
| `-l, --limit <limit>`   | 最大结果数（默认：50）                             |
| `-o, --offset <offset>` | 分页偏移量                                         |

### `vean list`

列出 registry 中的条目，可按包过滤。

```bash
vean list [options]
```

| 选项               | 描述                                                          |
| ------------------ | ------------------------------------------------------------- |
| `--package <name>` | 按包命名空间过滤（当前为 `ui`；未来外围包以各自命名空间加入） |
| `--json`           | 以 JSON 格式输出                                              |

条目按包命名空间区分（当前为 `ui/button`、`ui/accordion`、…；未来外围包遵循 `<package>/<component>`）。

### `vean view`

查看组件源码。

```bash
vean view <component>
```

### `vean info`

显示项目配置和可用的预设值。

```bash
vean info [options]
```

| 选项     | 描述             |
| -------- | ---------------- |
| `--json` | 以 JSON 格式输出 |

### `vean template`

从模板快速创建项目。

```bash
vean template [name] [options]
```

| 选项                 | 描述         |
| -------------------- | ------------ |
| `-l, --list`         | 列出可用模板 |
| `-o, --output <dir>` | 输出目录     |

可用模板：`vue-vite`、`nuxt`。

### `vean preset`

管理配置预设。

```bash
vean preset <preset>
```

### `vean migrate`

把 **SoybeanUI 时代**的项目（依赖 `@soybeanjs/*`、或使用 `sbean` CLI）迁移到 Vean（`@vean/*`）。

```bash
vean migrate [migration] [options]
```

| 选项                       | 描述                                                                       | 默认值   |
| -------------------------- | -------------------------------------------------------------------------- | -------- |
| `-c, --cwd <cwd>`          | 工作目录                                                                   | 当前目录 |
| `-w, --write`              | 写入改动（不加时只预览，不落盘）                                           | `false`  |
| `--runtime-contract`       | 同时改写 `data-soybean-*` 属性与 `--soybean-*` CSS 变量                    | `false`  |
| `--cli`                    | 同时改写 `sbean` CLI 引用，并把 `sbean.json` 重命名为 `vean.json`          | `false`  |
| `--new-domain <host>`      | 同时把 `ui.soybeanjs.cn` 改写为 `<host>`（CDN 目标随之为 `assets.<host>`） | —        |
| `--new-cdn <host>`         | 只改写 `r2.soybeanjs.tech` CDN 主机                                        | —        |
| `--repo-slug <owner/repo>` | 只改写 `github.com/soybeanjs/soybean-ui`                                   | —        |
| `-f, --force`              | 项目里没有任何 SoybeanUI 痕迹时也照常运行                                  | `false`  |
| `-q, --quiet`              | 只输出汇总，不逐文件打印 diff                                              | `false`  |

可用迁移：`rebrand`（SoybeanUI → Vean）。包名 / import 改写始终生效；运行时契约、CLI 引用、域名三类需显式开启，`--new-domain`、`--new-cdn`、`--repo-slug` 三者各自独立、可单独使用。

```bash
vean migrate rebrand                       # 预览
vean migrate rebrand --write               # 落地
vean migrate rebrand -w --runtime-contract --cli --new-domain veanui.com
```

**preflight（先判断该不该迁移）**：扫描后先看项目里有没有 SoybeanUI 时代的痕迹——`package.json` 里的 `@soybeanjs/*` 依赖、`sbean.json`、源码里的 `@soybeanjs/*` 标识符、`data-soybean-*` / `--soybean-*` 契约、`sbean` 调用。**都没有**（例如目录指错了，或项目已经迁移完）就拒绝执行、退出码 1、不写任何文件；只匹配到旧域名链接时也拒绝，除非你明确传了域名类选项。确实要强制运行用 `--force`。

运行结束还会给出两组按项目实际情况生成的提示：**Worth adding**（本次没开启、但项目里确实还有对应改动的开关，如「检测到 12 处 `data-soybean-*` → 加 `--runtime-contract`」）与 **Still manual**（只列真正适用的人工步骤，例如按 `package.json` 实际依赖拼出的换包命令）。lockfile、`node_modules`、构建产物与 `CHANGELOG.md` 永不改写，且命令是幂等的。完整步骤见**[品牌迁移指南](/overview/migration/rebrand)**。

## 配置

`vean.json` 存储项目配置：

```json
{
  "iconLibrary": "lucide",
  "uno": {
    "base": "zinc",
    "primary": "indigo",
    "size": "md",
    "radius": "md"
  },
  "font": {
    "sans": "inter",
    "heading": "inherit"
  },
  "aliases": {
    "ui": "#ui"
  },
  "registries": {}
}
```

| 字段           | 类型     | 描述                                                                                                    |
| -------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `iconLibrary`  | `string` | 图标库前缀                                                                                              |
| `uno.base`     | `string` | 基础（中性）色                                                                                          |
| `uno.primary`  | `string` | 主（品牌）色                                                                                            |
| `uno.size`     | `string` | 基础组件尺寸                                                                                            |
| `uno.radius`   | `string` | 圆角大小                                                                                                |
| `font.sans`    | `string` | 无衬线字体名称                                                                                          |
| `font.heading` | `string` | 标题字体或 `"inherit"`                                                                                  |
| `aliases`      | `object` | 各包 import 别名（如 `ui`；未来外围包同理）——经 `tsconfig` paths 映射到输出目录（默认 `src/<package>`） |
| `registries`   | `object` | 额外 registry 命名空间 → URL 映射                                                                       |

## 项目结构

### 单仓库

```
project/
├── src/
│   └── ui/           ← 组件输出目录 (uiDir)
│       ├── components/
│       ├── styles/
│       ├── theme/
│       ├── constants/
│       ├── resolver/
│       └── nuxt/
├── vean.json
├── tsconfig.json
└── uno.config.ts
```

### Monorepo（pnpm workspaces）

```
project/
├── packages/
│   └── ui/           ← 组件输出目录 (uiDir)
│       ├── components/
│       ├── styles/
│       ├── theme/
│       ├── constants/
│       ├── resolver/
│       └── nuxt/
├── vean.json
├── tsconfig.json
├── uno.config.ts
└── pnpm-workspace.yaml
```

## 别名系统

VeanUI 使用 `#ui` TypeScript 路径别名进行所有组件导入：

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "#ui/*": ["./src/ui/*"]
    }
  }
}
```

所有组件导入都使用此命名空间：

```ts
import { SButton } from '#ui/components/button';
import { buttonVariants } from '#ui/styles/button';
```

## 注册表

Vean 从 VeanUI 注册表获取组件源码，地址为 `https://veanui.com/r/<package>/<component>.json`——核心 `ui` 包由 `r/ui/{name}.json` 提供（如 `r/ui/button.json`），目录索引在 `r/registry.json`。注册表条目**按包命名空间区分**，因此注册表 URL 模板里的 `{name}` 是带命名空间的条目名（`ui/button`），而不是裸组件名。核心 `ui` 组件可省略前缀（`vean add button`）；未来外围包的组件必须带命名空间前缀（`vean add <package>/<component>`）。本地缓存（`~/.vean/cache`）保持 24 小时 TTL 并支持 ETag 条件请求。
