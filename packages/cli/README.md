<p align="center">
  <a href="https://github.com/soybeanjs/soybean-ui">
    <img src="https://img.soybeanjs.dev/logo-sbean.svg?v=202608192144" alt="Logo" width="150" />
  </a>
</p>

# sbean

English | [中文](./README.zh-CN.md)

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/sbean)](https://www.npmjs.com/package/sbean)
[![npm downloads](https://img.shields.io/npm/dt/sbean)](https://www.npmjs.com/package/sbean)
[![github stars](https://img.shields.io/github/stars/soybeanjs/soybean-ui)](https://github.com/soybeanjs/soybean-ui)

CLI tool for adding SoybeanUI components to your Vue apps — copy-paste, like shadcn/ui.

> Not to be confused with `sui` (`packages/scripts`), the private repo-service CLI for this workspace.

## 📖 Introduction

`sbean` is the **source-distribution (copy-paste) CLI** of the SoybeanUI ecosystem. Instead of installing a component library, it copies component source directly into your project, so you own and can edit every file. It also provides project scaffolding, registry management, and an MCP server.

- Configuration lives in `sbean.json`.
- Components come from the `@soybeanjs/headless` + `@soybeanjs/ui` registry.
- Styles come from UnoCSS via `@soybeanjs/ui-uno`; variants use `@soybeanjs/cva`; registry schemas use valibot.
- Frameworks: Vue 3 (Vite) and Nuxt.

## 🚀 Usage

```bash
# Initialize your project (writes sbean.json)
npx sbean init

# Add a component
npx sbean add button

# Search components
npx sbean search dialog

# View a component
npx sbean view button
```

## 🧩 Commands

| Command                 | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| `init` (alias `create`) | Initialize your project with `sbean.json`, or scaffold a new one |
| `add <components...>`   | Add components to your project (the copy-paste core)             |
| `apply <preset>`        | Apply a preset to an existing project                            |
| `build [registry]`      | Build registry JSON from the UI layer source                     |
| `diff <component>`      | Show diff between local and registry components                  |
| `docs <components...>`  | Print docs / api / registry / source links                       |
| `view <component>`      | View component source code                                       |
| `search [query]`        | Search available components                                      |
| `template [name]`       | List or scaffold project templates (`vue-vite`, `nuxt`)          |
| `info`                  | Show project and registry information                            |
| `list`                  | List registry entries, filterable with `--package`               |
| `mcp`                   | Start the MCP server; `mcp init` writes client config            |
| `registry`              | `add` extra namespace registries; `validate` `registry.json`     |
| `preset`                | `list` / `show <preset>` / `apply <preset>` presets              |
| `scan`                  | Generate `registry.json` from the component source tree          |

Run `npx sbean <command> --help` for the full option list of any command.

## ⚙️ Configuration

`sbean init` generates a `sbean.json`:

```json
{
  "iconLibrary": "lucide",
  "uno": { "base": "zinc", "primary": "indigo", "size": "md", "radius": "md" },
  "font": {},
  "aliases": { "ui": "#ui" },
  "registries": {}
}
```

The `uno` block feeds the `@soybeanjs/ui-uno` preset, so the UnoCSS theme and the runtime theme stay in sync.

## 📚 Package Structure

```
packages/cli/src/
├── commands/     # 15 command implementations
├── registry/     # valibot schemas, loader / fetcher / cache / search / preset
├── utils/        # copy-paste engine, config, project detection, transformers
├── templates/    # vue-vite / nuxt project templates
├── mcp/          # MCP server (8 tools)
├── schema/       # /schema sub-path exports
└── preset/       # /preset sub-path exports
```

Compiled entry points are also exposed as sub-path exports:

```ts
import {} from 'sbean'; // programmatic API
// Also: sbean/registry · sbean/schema · sbean/preset · sbean/utils · sbean/mcp
```

## 📖 Documentation

- Docs site: [ui.soybeanjs.cn](https://ui.soybeanjs.cn)
- Contributor guide: [docs/ecosystem/cli.md](../../docs/ecosystem/cli.md)
- ADRs, glossary, and the shadcn-vue comparison: [packages/cli/docs](./docs)

## 📄 License

MIT
