# @vean/scripts

[English](./README.md) | 中文

[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

Vean 工作仓的服务 CLI(`sui`):生成器、校验门与工作区杂务。

> **私有包——永不发布到 npm**(仅本仓库使用)。不要与消费端的 [`vean`](../cli/README.zh-CN.md) CLI 混淆:`sui` 服务本仓库,`vean` 服务用户项目。

## 📖 简介

`sui` 保证每一处提交进仓库的生成产物都可复现。所有命令都在 `src/cli.ts` 用 [cac](https://github.com/cacjs/cac) 声明,因此 `--help` / `--version` / 未知选项 / 缺失参数的处理只有一处。共有三个命令组和若干一次性工作区命令:

- **`gen`** —— 确定性、离线:重新生成已提交的产物。
- **`translate`** —— 唯一联网的命令组(DeepL),需要 `DEEPL_API_KEY`。
- **`check`** —— 仓库未达发布状态时以退出码 `1` 失败的校验门。
- **工作区命令** —— `stub`、`reorder-imports`、`sync-template-versions`。

## 🧰 命令

### gen

```bash
pnpm sui gen <surface> [name] [--force]
```

| 产物面               | 产物                                                                      |
| :------------------- | :------------------------------------------------------------------------ |
| `catalog [aria\|ui]` | 组件目录(aria 的 constants/namespaced + ui 的 constants)                  |
| `api`                | `apps/docs/src/generated/api/*.json` 与本地化文本                         |
| `changelog`          | `apps/docs/src/generated/changelog/*.json` 与本地化摘要                   |
| `schema`             | `vean` 的 JSON Schema(`vean.json`、`registry-item.json`、`registry.json`) |
| `skills`             | 技能文档与分发包文件                                                      |
| `all`                | 以上全部                                                                  |

`--force` 会在 `api` 源指纹仍然匹配时也强制重算。生成器会把产物与已提交文件对比,若只有 `generatedAt` 不同就跳过写入,因此无变化的重新生成不会产生 diff。

### translate

```bash
pnpm sui translate <surface> [options]
```

产物面:`api` | `changelog` | `locale` | `all`。选项:`--locale <locale>`(默认所有非源语言)、`--source-locale <locale>`(默认 `en`)、`--batch-size <number>`(默认 20)、`--limit <number>`、`--overwrite`、`--dry-run`(只报告待翻译数量,不调用 API)。需要 `DEEPL_API_KEY`。

### check

```bash
pnpm sui check <generated|deps|all>
```

- `generated` —— 重新生成所有产物面并与 git 对比(同时是 CI 门禁)。
- `deps` —— 禁用导入扫描 + 运行时依赖白名单。

### 工作区命令

| 命令                                   | 说明                                                                 |
| :------------------------------------- | :------------------------------------------------------------------- |
| `stub [--reset]`                       | 在 `src` 与 `dist` 之间切换 aria 开发期导出                          |
| `reorder-imports [...paths] [--check]` | 重排 `.vue` import type 块中的 Props 与 Emits 顺序(`--check` 只报告) |
| `sync-template-versions`               | 同步项目模板使用的 `@vean/*` 版本常量                                |

## 🛠 开发

```bash
pnpm sui gen all                                        # 在仓库根目录运行
pnpm --filter @vean/scripts test                   # vp test run
pnpm --filter @vean/scripts typecheck              # tsc --noEmit
```

`sui` 的二进制入口是 `bin/index.js`,通过 `tsx` 加载 TypeScript 源码。

## 📖 文档

- 工作区架构与生成流程:[docs/architecture.md](../../docs/architecture.md)
- 仓库约定与命令清单:[AGENTS.md](../../AGENTS.md)

## 📄 License

MIT(私有包)
