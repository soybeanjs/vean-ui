<p align="center">
  <a href="https://github.com/soybeanjs/vean-ui">
    <img src="https://r2.veanui.com/imgs/logo-vean-ui.svg?v=202609141212" alt="Logo" width="150" />
  </a>
</p>

# @vean/cli

English | [中文](./README.zh-CN.md)

[![license](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)
[![npm version](https://img.shields.io/npm/v/@vean/cli)](https://www.npmjs.com/package/@vean/cli)
[![npm downloads](https://img.shields.io/npm/dt/@vean/cli)](https://www.npmjs.com/package/@vean/cli)
[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

CLI tool for adding Vean components to your Vue apps — copy-paste, like shadcn/ui.

> Not to be confused with `sui` (`packages/scripts`), the private repo-service CLI for this workspace.

## 📖 Introduction

`vean` is the **source-distribution (copy-paste) CLI** of the Vean ecosystem. Instead of installing a component library, it copies component source directly into your project, so you own and can edit every file. It also provides project scaffolding, registry management, and an MCP server.

- Configuration lives in `vean.json`.
- Components come from the `@vean/aria` + `@vean/ui` registry.
- Styles come from UnoCSS via `@vean/unocss`; variants use `@soybeanjs/cva`; registry schemas use valibot.
- Frameworks: Vue 3 (Vite) and Nuxt.

## 🚀 Usage

```bash
# Initialize your project (writes vean.json)
npx @vean/cli@latest init

# Add a component
npx @vean/cli@latest add button

# Search components
npx @vean/cli@latest search dialog

# View a component
npx @vean/cli@latest view button
```

## 🧩 Commands

| Command                 | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `init` (alias `create`) | Initialize your project with `vean.json`, or scaffold a new one   |
| `add <components...>`   | Add components to your project (the copy-paste core)              |
| `apply <preset>`        | Apply a preset to an existing project                             |
| `build [registry]`      | Build registry JSON from the UI layer source                      |
| `diff <component>`      | Show diff between local and registry components                   |
| `docs <components...>`  | Print docs / api / registry / source links                        |
| `view <component>`      | View component source code                                        |
| `search [query]`        | Search available components                                       |
| `template [name]`       | List or scaffold project templates (`vue-vite`, `nuxt`)           |
| `info`                  | Show project and registry information                             |
| `list`                  | List registry entries, filterable with `--package`                |
| `mcp`                   | Start the MCP server; `mcp init` writes client config             |
| `registry`              | `add` extra namespace registries; `validate` `registry.json`      |
| `preset`                | `list` / `show <preset>` / `apply <preset>` presets               |
| `scan`                  | Generate `registry.json` from the component source tree           |
| `migrate [migration]`   | Migrate a SoybeanUI-era project (`@soybeanjs/*`, `sbean`) to Vean |

Run `npx @vean/cli@latest <command> --help` for the full option list of any command.

### `migrate`

Rewrites a **SoybeanUI-era** project in place — package specifiers always, runtime contracts, CLI
references and hostnames opt-in. Dry run by default; nothing is written without `--write`.

```bash
npx @vean/cli@latest migrate rebrand --write                    # packages + Nuxt dist path
npx @vean/cli@latest migrate rebrand --write --runtime-contract # + data-soybean-* / --soybean-*
npx @vean/cli@latest migrate rebrand --write --cli              # + sbean CLI refs, renames sbean.json
npx @vean/cli@latest migrate rebrand --write --new-domain veanui.com --repo-slug soybeanjs/vean-ui
```

The preflight refuses projects with no SoybeanUI-era trace (`@soybeanjs/*` dependencies or
specifiers, `sbean.json`, runtime contracts, `sbean` invocations) — the run exits 1 and writes
nothing; pass `-f, --force` to override. `--new-domain`, `--new-cdn` and `--repo-slug` work
independently of each other. Each run ends with the opt-in flags still worth adding and the manual
steps that actually apply.

Lock files, `node_modules`, build output and the `CHANGELOG` are never rewritten, and the run is
idempotent. See [`apps/docs/src/content/{en,zh}/ui/migration/rebrand.md`](../../apps/docs/src/content/en/ui/migration/rebrand.md)
for the full guide, including the steps the command cannot do.

## ⚙️ Configuration

`vean init` generates a `vean.json`:

```json
{
  "iconLibrary": "lucide",
  "uno": { "base": "zinc", "primary": "indigo", "size": "md", "radius": "md" },
  "font": {},
  "aliases": { "ui": "#ui" },
  "registries": {}
}
```

The `uno` block feeds the `@vean/unocss` preset, so the UnoCSS theme and the runtime theme stay in sync.

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
import {} from '@vean/cli'; // programmatic API
// Also: @vean/cli/registry · @vean/cli/schema · @vean/cli/preset · @vean/cli/utils · @vean/cli/mcp
```

## 📖 Documentation

- Docs site: [veanui.com](https://veanui.com)
- Contributor guide: [docs/ecosystem/cli.md](../../docs/ecosystem/cli.md)
- ADRs, glossary, and the shadcn-vue comparison: [packages/cli/docs](./docs)

## 📄 License

MIT
