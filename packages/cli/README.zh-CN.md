<p align="center">
  <a href="https://github.com/soybeanjs/soybean-ui">
    <img src="https://img.soybeanjs.dev/logo-sbean.svg?v=202608192144" alt="Logo" width="150" />
  </a>
</p>

# sbean

[English](./README.md) | 中文

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/sbean)](https://www.npmjs.com/package/sbean)
[![npm downloads](https://img.shields.io/npm/dt/sbean)](https://www.npmjs.com/package/sbean)
[![github stars](https://img.shields.io/github/stars/soybeanjs/soybean-ui)](https://github.com/soybeanjs/soybean-ui)

把 SoybeanUI 组件加进你的 Vue 应用的 CLI——源码分发(复制粘贴),类似 shadcn/ui。

> 不要与 `sui`(`packages/scripts`)混淆:后者是本仓库私有的服务 CLI。

## 📖 简介

`sbean` 是 SoybeanUI 生态的**源码分发(复制粘贴)CLI**。它不安装组件库,而是把组件源码直接复制进你的项目,因此每个文件都归你所有、可随意修改。它同时提供项目脚手架、registry 管理与 MCP server。

- 配置文件为 `sbean.json`。
- 组件来自 `@soybeanjs/headless` + `@soybeanjs/ui` registry。
- 样式经 `@soybeanjs/ui-uno` 由 UnoCSS 提供;变体用 `@soybeanjs/cva`;registry schema 用 valibot。
- 框架支持:Vue 3(Vite)与 Nuxt。

## 🚀 使用

```bash
# 初始化项目(生成 sbean.json)
npx sbean init

# 添加组件
npx sbean add button

# 搜索组件
npx sbean search dialog

# 查看组件
npx sbean view button
```

## 🧩 命令

| 命令                   | 说明                                                      |
| ---------------------- | --------------------------------------------------------- |
| `init`(别名 `create`)  | 用 `sbean.json` 初始化项目,也可脚手架新项目               |
| `add <components...>`  | 向项目添加组件(复制粘贴核心)                              |
| `apply <preset>`       | 把预设应用到已有项目                                      |
| `build [registry]`     | 从 UI 层源码构建 registry JSON                            |
| `diff <component>`     | 对比本地与 registry 组件的行级差异                        |
| `docs <components...>` | 输出 docs / api / registry / source 链接                  |
| `view <component>`     | 查看组件源码                                              |
| `search [query]`       | 搜索可用组件                                              |
| `template [name]`      | 列出或脚手架项目模板(`vue-vite`、`nuxt`)                  |
| `info`                 | 显示项目与 registry 信息                                  |
| `list`                 | 列出 registry 条目,可用 `--package` 过滤                  |
| `mcp`                  | 启动 MCP server;`mcp init` 写客户端配置                   |
| `registry`             | `add` 增补命名空间 registry;`validate` 校验 registry.json |
| `preset`               | `list` / `show <preset>` / `apply <preset>` 管理预设      |
| `scan`                 | 从组件源码树生成 `registry.json`                          |

任意命令的完整选项列表见 `npx sbean <command> --help`。

## ⚙️ 配置

`sbean init` 会生成 `sbean.json`:

```json
{
  "iconLibrary": "lucide",
  "uno": { "base": "zinc", "primary": "indigo", "size": "md", "radius": "md" },
  "font": {},
  "aliases": { "ui": "#ui" },
  "registries": {}
}
```

`uno` 块会喂给 `@soybeanjs/ui-uno` 预设,使 UnoCSS 主题与运行时主题保持一致。

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
import {} from 'sbean'; // 编程式 API
// 另有:sbean/registry · sbean/schema · sbean/preset · sbean/utils · sbean/mcp
```

## 📖 文档

- 文档站:[ui.soybeanjs.cn](https://ui.soybeanjs.cn)
- 贡献者指南:[docs/ecosystem/cli.md](../../docs/ecosystem/cli.md)
- ADR、术语表与 shadcn-vue 对标:[packages/cli/docs](./docs)

## 📄 License

MIT
