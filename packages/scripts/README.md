# @vean/scripts

English | [中文](./README.zh-CN.md)

[![github stars](https://img.shields.io/github/stars/soybeanjs/vean-ui)](https://github.com/soybeanjs/vean-ui)

Repo-service CLI (`sui`) for the Vean workspace: generators, verification gates, and workspace chores.

> **Private package — never published to npm** (workspace-only). Not to be confused with the consumer-facing [`vean`](../cli/README.md) CLI: `sui` serves this repository, `vean` serves user projects.

## 📖 Introduction

`sui` keeps every committed generated surface reproducible. Each command is declared with [cac](https://github.com/cacjs/cac) in `src/cli.ts`, so `--help` / `--version` / unknown-option / missing-argument handling lives in one place. There are three command groups plus one-off workspace commands:

- **`gen`** — deterministic and offline: regenerates the committed artifacts.
- **`translate`** — the only networked group (DeepL); needs `DEEPL_API_KEY`.
- **`check`** — verification gates that exit `1` when the repository is not release-ready.
- **workspace commands** — `stub`, `reorder-imports`, `sync-template-versions`.

## 🧰 Commands

### gen

```bash
pnpm sui gen <surface> [name] [--force]
```

| Surface              | Artifact                                                                 |
| :------------------- | :----------------------------------------------------------------------- |
| `catalog [aria\|ui]` | Component catalogs (`aria` constants/namespaced + `ui` constants)        |
| `api`                | `apps/docs/src/generated/api/*.json` and locale text                     |
| `changelog`          | `apps/docs/src/generated/changelog/*.json` and locale summaries          |
| `schema`             | `vean` JSON Schemas (`vean.json`, `registry-item.json`, `registry.json`) |
| `skills`             | Skill docs and distribution files                                        |
| `all`                | Every surface above                                                      |

`--force` regenerates even when the `api` source fingerprint still matches. Generators compare the produced payload against the committed file and skip the write when only `generatedAt` would differ, so a no-op regeneration produces no diff.

### translate

```bash
pnpm sui translate <surface> [options]
```

Surfaces: `api` | `changelog` | `locale` | `all`. Options: `--locale <locale>` (default: every non-source locale), `--source-locale <locale>` (default `en`), `--batch-size <number>` (default 20), `--limit <number>`, `--overwrite`, `--dry-run` (report pending counts without calling the API). Requires `DEEPL_API_KEY`.

### check

```bash
pnpm sui check <generated|deps|all>
```

- `generated` — regenerate every surface and diff it against git (also a CI gate).
- `deps` — banned import scan + runtime dependency whitelists.

### Workspace commands

| Command                                | Description                                                                      |
| :------------------------------------- | :------------------------------------------------------------------------------- |
| `stub [--reset]`                       | Switch aria development exports between `src` and `dist`                         |
| `reorder-imports [...paths] [--check]` | Reorder Props before Emits in `.vue` import type blocks (`--check` reports only) |
| `sync-template-versions`               | Sync the `@vean/*` version constant used by project templates                    |

## 🛠 Development

```bash
pnpm sui gen all                                        # run from the repo root
pnpm --filter @vean/scripts test                   # vp test run
pnpm --filter @vean/scripts typecheck              # tsc --noEmit
```

The `sui` binary is `bin/index.js` and loads the TypeScript sources through `tsx`.

## 📖 Documentation

- Workspace architecture and generation flows: [docs/architecture.md](../../docs/architecture.md)
- Repository conventions and command list: [AGENTS.md](../../AGENTS.md)

## 📄 License

MIT (private package)
