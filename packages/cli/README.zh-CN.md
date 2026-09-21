<p align="center">
  <a href="https://github.com/soybeanjs/vean-ui">
    <img src="https://r2.veanui.com/imgs/logo-vean-ui.svg?v=202609141212" alt="Logo" width="150" />
  </a>
</p>

# @vean/cli

[English](./README.md) | 中文

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/cli)](https://www.npmjs.com/package/@vean/cli)
[![npm downloads](https://img.shields.io/npm/dt/@vean/cli)](https://www.npmjs.com/package/@vean/cli)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

把 Vean 组件加进你的 Vue 应用的 CLI——源码分发(复制粘贴),类似 shadcn/ui。

> 不要与 `sui`(`packages/scripts`)混淆:后者是本仓库私有的服务 CLI。

## 📖 简介

`vean` 是 Vean 生态的**源码分发(复制粘贴)CLI**。它不安装组件库,而是把组件源码直接复制进你的项目,因此每个文件都归你所有、可随意修改。它同时提供项目脚手架、registry 管理与 MCP server。

- 配置文件为 `vean.json`。
- 组件来自 `@vean/aria` + `@vean/ui` registry。
- 样式经 `@vean/unocss` 由 UnoCSS 提供;变体用 `@soybeanjs/cva`;registry schema 用 valibot。
- 框架支持:Vue 3(Vite)与 Nuxt。

## 🚀 使用

```bash
# 初始化项目(生成 vean.json)
npx @vean/cli@latest init

# 添加组件
npx @vean/cli@latest add button

# 搜索组件
npx @vean/cli@latest search dialog

# 查看组件
npx @vean/cli@latest view button
```

## 🧩 命令

| 命令                   | 说明                                                          |
| ---------------------- | ------------------------------------------------------------- |
| `init`(别名 `create`)  | 用 `vean.json` 初始化项目,也可脚手架新项目                    |
| `add <components...>`  | 向项目添加组件(复制粘贴核心)                                  |
| `apply <preset>`       | 把预设应用到已有项目                                          |
| `build [registry]`     | 从 UI 层源码构建 registry JSON                                |
| `diff <component>`     | 对比本地与 registry 组件的行级差异                            |
| `docs <components...>` | 输出 docs / api / registry / source 链接                      |
| `view <component>`     | 查看组件源码                                                  |
| `search [query]`       | 搜索可用组件                                                  |
| `template [name]`      | 列出或脚手架项目模板(`vue-vite`、`nuxt`)                      |
| `info`                 | 显示项目与 registry 信息                                      |
| `list`                 | 列出 registry 条目,可用 `--package` 过滤                      |
| `mcp`                  | 启动 MCP server;`mcp init` 写客户端配置                       |
| `registry`             | `add` 增补命名空间 registry;`validate` 校验 registry.json     |
| `preset`               | `list` / `show <preset>` / `apply <preset>` 管理预设          |
| `scan`                 | 从组件源码树生成 `registry.json`                              |
| `migrate [migration]`  | 把 SoybeanUI 时代的项目（`@soybeanjs/*`、`sbean`）迁移到 Vean |

任意命令的完整选项列表见 `npx @vean/cli@latest <command> --help`。

### `migrate`

就地重写 **SoybeanUI 时代**的项目——包名说明符总是处理,运行时契约、CLI 引用与域名需显式开启。默认只看 diff,不加 `--write` 不会写入任何文件。

```bash
npx @vean/cli@latest migrate rebrand --write                    # 包名 + Nuxt dist 路径
npx @vean/cli@latest migrate rebrand --write --runtime-contract # + data-soybean-* / --soybean-*
npx @vean/cli@latest migrate rebrand --write --cli              # + sbean CLI 引用,并把 sbean.json 重命名为 vean.json
npx @vean/cli@latest migrate rebrand --write --new-domain veanui.com --repo-slug soybeanjs/vean-ui
```

预检会拒绝找不到任何 SoybeanUI 时代痕迹的项目(`@soybeanjs/*` 依赖或说明符、`sbean.json`、运行时契约、`sbean` 调用):此时以退出码 1 结束且不写入任何内容,可用 `-f, --force` 强制覆盖。`--new-domain`、`--new-cdn` 与 `--repo-slug` 相互独立。每次运行结束时会提示仍值得追加的选项,以及仍需手工完成的步骤。

锁文件、`node_modules`、构建产物与 `CHANGELOG` 永远不会被重写,且该命令幂等。完整指南(含命令无法处理的部分)见 [`apps/docs/src/content/{en,zh}/ui/migration/rebrand.md`](../../apps/docs/src/content/zh/ui/migration/rebrand.md)。

## ⚙️ 配置

`vean init` 会生成 `vean.json`:

```json
{
  "iconLibrary": "lucide",
  "uno": { "base": "zinc", "primary": "indigo", "size": "md", "radius": "md" },
  "font": {},
  "aliases": { "ui": "#ui" },
  "registries": {}
}
```

`uno` 块会喂给 `@vean/unocss` 预设,使 UnoCSS 主题与运行时主题保持一致。

## 📚 包结构

```
packages/cli/src/
├── commands/     # 15 个命令实现
├── registry/     # valibot schema、loader / fetcher / cache / search / preset
├── utils/        # 复制粘贴引擎、配置、项目探测、transformer
├── templates/    # vue-vite / nuxt 项目模板
├── mcp/          # MCP server(8 个工具)
├── schema/       # /schema 子路径导出
└── preset/       # /preset 子路径导出
```

编译产物同样以子路径导出:

```ts
import {} from '@vean/cli'; // 编程式 API
// 另有:@vean/cli/registry · @vean/cli/schema · @vean/cli/preset · @vean/cli/utils · @vean/cli/mcp
```

## 📖 文档

- 文档站:[veanui.com](https://veanui.com)
- 贡献者指南:[docs/ecosystem/cli.md](../../docs/ecosystem/cli.md)
- ADR、术语表与 shadcn-vue 对标:[packages/cli/docs](./docs)

## 📄 License

MIT
