---
head:
  title: VeanUI CLI
  description: 'vean is the command-line tool for VeanUI. It helps you initialize projects, add components, manage your UI configuration, and migrate a project to Vean.'
---

# VeanUI CLI

`vean` is the command-line tool for VeanUI. It helps you initialize projects, add components, manage your UI configuration, and migrate a project to VeanUI.

## Installation

```bash
pnpm add -D @vean/cli
```

Or run directly:

```bash
npx @vean/cli@latest init
```

## Commands

### `vean init`

Initialize a new VeanUI project or add configuration to an existing one.

```bash
vean init [options]
```

| Option                  | Description                                                                 | Default                                      |
| ----------------------- | --------------------------------------------------------------------------- | -------------------------------------------- |
| `-m, --monorepo`        | Use monorepo (pnpm workspaces) structure                                    | `false`                                      |
| `--ui-dir <path>`       | Component output directory                                                  | `src/ui` (single) / `packages/ui` (monorepo) |
| `--size <size>`         | Component size: xs / sm / md / lg / xl / 2xl                                | `md`                                         |
| `--style <style>`       | Style preset: soybean / clean / dense                                       | `soybean`                                    |
| `-b, --base <base>`     | Base color: zinc / neutral / stone / slate / gray                           | `zinc`                                       |
| `--primary <primary>`   | Primary color: indigo / blue / green / ...                                  | `indigo`                                     |
| `--radius <radius>`     | Border radius: none / xs / sm / md / lg / xl / 2xl                          | `md`                                         |
| `-p, --preset <code>`   | Preset code (base62 encoded config)                                         | —                                            |
| `--icon-library <lib>`  | Icon library: lucide / material-symbols / ph / tabler / solar / radix-icons | `lucide`                                     |
| `--font-sans <font>`    | Sans-serif font: inter / roboto / geist / ...                               | —                                            |
| `--font-heading <font>` | Heading font or `inherit`                                                   | —                                            |
| `-y, --yes`             | Skip confirmation prompt                                                    | `false`                                      |
| `-d, --defaults`        | Use default configuration                                                   | `false`                                      |
| `-f, --force`           | Overwrite existing configuration                                            | `false`                                      |

Interactive prompts will guide you through the configuration when no options are provided.

### `vean add`

Add components to your project.

```bash
vean add <component...> [options]
```

| Option              | Description                              |
| ------------------- | ---------------------------------------- |
| `-y, --yes`         | Skip confirmation prompt                 |
| `-o, --overwrite`   | Overwrite existing files                 |
| `-p, --path <path>` | Target path (default: uiDir from config) |
| `--dry-run`         | Preview changes without writing          |
| `--diff`            | Show diff between local and registry     |
| `--view`            | View component source without adding     |
| `-a, --all`         | Add all available components             |
| `-s, --silent`      | Mute output                              |

### `vean build`

Build registry JSON files from a registry.json manifest.

```bash
vean build [registry] [options]
```

| Option                | Description      | Default      |
| --------------------- | ---------------- | ------------ |
| `-o, --output <path>` | Output directory | `./public/r` |

### `vean search`

Search for available components.

```bash
vean search [query] [options]
```

| Option                  | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `-a, --all`             | Show all components                                    |
| `-t, --type <type>`     | Filter by type: component / hook / style / lib / theme |
| `-l, --limit <limit>`   | Max results (default: 50)                              |
| `-o, --offset <offset>` | Pagination offset                                      |

### `vean list`

List registry items, optionally filtered by package.

```bash
vean list [options]
```

| Option             | Description                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `--package <name>` | Filter by package namespace (currently: `ui`; future peripheral packages are added under their own namespace) |
| `--json`           | Output as JSON                                                                                                |

Items are namespaced by package (currently `ui/button`, `ui/accordion`, …; future peripheral packages follow `<package>/<component>`).

### `vean view`

View a component's source code.

```bash
vean view <component>
```

### `vean info`

Show project configuration and available preset values.

```bash
vean info [options]
```

| Option   | Description    |
| -------- | -------------- |
| `--json` | Output as JSON |

### `vean template`

Scaffold a new project from a template.

```bash
vean template [name] [options]
```

| Option               | Description              |
| -------------------- | ------------------------ |
| `-l, --list`         | List available templates |
| `-o, --output <dir>` | Output directory         |

Available templates: `vue-vite`, `nuxt`.

### `vean preset`

Manage configuration presets.

```bash
vean preset <preset>
```

### `vean migrate`

Migrate a **SoybeanUI-era** project — one depending on `@soybeanjs/*` or using the `sbean` CLI — to
VeanUI (`@vean/*`).

```bash
vean migrate [migration] [options]
```

| Option                     | Description                                                                     | Default     |
| -------------------------- | ------------------------------------------------------------------------------- | ----------- |
| `-c, --cwd <cwd>`          | Working directory                                                               | Current dir |
| `-w, --write`              | Apply the changes (without it the run is a dry run)                             | `false`     |
| `--runtime-contract`       | Also rewrite `data-soybean-*` attributes and `--soybean-*` CSS variables        | `false`     |
| `--cli`                    | Also rewrite `sbean` CLI references and rename `sbean.json` to `vean.json`      | `false`     |
| `--new-domain <host>`      | Also rewrite `ui.soybeanjs.cn` to `<host>` (CDN target becomes `assets.<host>`) | —           |
| `--new-cdn <host>`         | Rewrite only the `r2.soybeanjs.tech` CDN host                                   | —           |
| `--repo-slug <owner/repo>` | Rewrite only `github.com/soybeanjs/soybean-ui`                                  | —           |
| `-f, --force`              | Run even when the project shows no SoybeanUI-era trace                          | `false`     |
| `-q, --quiet`              | Print the summary only, without per-file previews                               | `false`     |

Available migrations: `rebrand` (SoybeanUI → Vean). Package specifier rewrites always apply; the
runtime-contract, CLI and hostname tiers are opt-in, and `--new-domain`, `--new-cdn` and
`--repo-slug` are independent of each other.

```bash
vean migrate rebrand                       # preview
vean migrate rebrand --write               # apply
vean migrate rebrand -w --runtime-contract --cli --new-domain veanui.com
```

**Preflight.** After scanning, the command looks for SoybeanUI-era traces: `@soybeanjs/*`
dependencies in `package.json`, a `sbean.json`, `@soybeanjs/*` specifiers in source, `data-soybean-*`
/ `--soybean-*` contracts and `sbean` invocations. When **none** are found — the directory is wrong,
or the project is already migrated — it refuses to run, exits 1 and writes nothing. A project with
only old hostname links is refused too, unless you asked for a hostname rewrite explicitly. Use
`--force` to run regardless.

Every run ends with two project-specific blocks: **Worth adding** (opt-in flags that still match
something in the project, e.g. "12 `data-soybean-*` references → add `--runtime-contract`") and
**Still manual** (only the steps that apply, such as a dependency swap built from the actual
`package.json`). Lock files, `node_modules`, build output and `CHANGELOG.md` are never rewritten, and
the run is idempotent. See the **[brand migration guide](/overview/migration/rebrand)** for the
complete walkthrough.

## Configuration

The `vean.json` file stores your project configuration:

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

| Field          | Type     | Description                                                                                                                                             |
| -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `iconLibrary`  | `string` | Icon library prefix                                                                                                                                     |
| `uno.base`     | `string` | Base (neutral) color                                                                                                                                    |
| `uno.primary`  | `string` | Primary (brand) color                                                                                                                                   |
| `uno.size`     | `string` | Base component size                                                                                                                                     |
| `uno.radius`   | `string` | Border radius                                                                                                                                           |
| `font.sans`    | `string` | Sans-serif font name                                                                                                                                    |
| `font.heading` | `string` | Heading font or `"inherit"`                                                                                                                             |
| `aliases`      | `object` | Import aliases per package (e.g. `ui`; future peripheral packages likewise) — each maps to an output dir via `tsconfig` paths (default `src/<package>`) |
| `registries`   | `object` | Additional registry namespace → URL mappings                                                                                                            |

## Project Structure

### Single Package

```
project/
├── src/
│   └── ui/           ← component output (uiDir)
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

### Monorepo (pnpm workspaces)

```
project/
├── packages/
│   └── ui/           ← component output (uiDir)
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

## Alias System

VeanUI uses the `#ui` TypeScript path alias for all component imports:

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

All component imports use this namespace:

```ts
import { SButton } from '#ui/components/button';
import { buttonVariants } from '#ui/styles/button';
```

## Registry

Vean fetches component source from the VeanUI registry at `https://veanui.com/r/<package>/<component>.json` — the core `ui` package from `r/ui/{name}.json` (e.g. `r/ui/button.json`) and the catalog index from `r/registry.json`. Registry items are **namespaced by package**, so `{name}` in a registry URL template is the qualified item name (`ui/button`), not the bare component name. Core `ui` components can be referenced without a prefix (`vean add button`); components from any future peripheral package will require the namespace prefix (`vean add <package>/<component>`). A local cache (`~/.vean/cache`) is maintained with 24-hour TTL and ETag support for efficient updates.
