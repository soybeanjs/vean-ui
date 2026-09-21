# CONSUMER CLI — @vean/cli

## AI ASSISTANT BRIDGE

For any AI assistant editing files under `packages/cli/`:

1. For `**/*.{ts,tsx,js,jsx}` edits, load the global `typescript-functional-style` skill.
2. Read [adr.md](./docs/adr.md) before changing scope or adding a command — the parity boundary with shadcn-vue is a recorded decision (stack-relevant only; Tailwind/non-Vue scaffolds are intentionally out of scope), and [GLOSSARY.md](./docs/GLOSSARY.md) / [comparison-with-shadcn-vue.md](./docs/comparison-with-shadcn-vue.md) define the vocabulary.

**Package:** `packages/cli/` → publishes as **`@vean/cli`** (bin `vean`), the _consumer-facing_ copy-paste CLI.
**NOT to be confused with `sui`** (`packages/scripts/`, private repo-service CLI). They are separate packages with separate audiences; never merge them or cross-import.

## ROLE

Source-distribution CLI: rather than installing a component library, it copies component source into the user's project so they own and can edit it. Also does project scaffolding, registry management, and an MCP server.

- Config lives in `vean.json` (valibot-validated via `src/registry/config.ts`).
- Components come from the registry built out of `packages/ui/src` + `packages/aria`.
- Uses **`commander`**, not cac (that is `sui`'s choice) and **valibot**, not zod.

## BUILD / PUBLISH SHAPE (unusual — read before touching package.json)

This package's dev and published layouts differ more than any other workspace:

- `bin` → `./src/bin.js`, which is a `tsx/cjs` shim that `require`s `./index.ts`. The published bin is remapped by `publishConfig.bin` to `./dist/index.js`. Do not "fix" the src bin to a built path — it exists so `npx`-style local runs work without a build.
- `exports` all point at `./src/*.ts`; `publishConfig.exports` remaps each one to `./dist/<name>/index.js`. Adding a new sub-path export means updating **both**.
- `build:registry` is a repo-level step, not a package one: it writes the registry JSON into `apps/docs/public/r` (`--cwd ../..`, so run it from the workspace root). It is invoked by `apps/docs` `build:registry`, so the docs site build depends on this package building first.
- `build:schema` converts the valibot schemas to JSON Schema (draft-07) and writes `apps/docs/public/schema/` for IDE validation. `sui gen schema` imports the same generator, so the two entry points must stay in sync.

## REGISTRY

- `registry.json` at the package root is the checked-in item catalog (`ui/*` entries mapping component files to `registry:ui` / `registry:lib` types).
- URLs are env-overridable in `src/registry/constants.ts`: `REGISTRY_URL` (default `https://veanui.com/r`), `DOCS_URL`, and the built-in namespaces `@soybean` / `@sbean` (legacy aliases kept for pre-rename configs). Tests that need a registry use the local server helper, not the network.
- `vean scan` generates `registry.json` from the source tree, extracting npm `dependencies`, cross-component `registryDependencies`, and preserving descriptions/categories from an existing file. `UI_SOURCE_PATH` (`packages/ui/src`) is hard-coded — a component directory move breaks the scan silently, so check it when you relocate files.

## ANTI-PATTERNS

- **NO imports from `packages/scripts`** (`sui`) — private repo tooling must not leak into a published package.
- **NO network calls in the default path.** The fetching commands are `add` / `view` / `search` / `docs` / `list` (all via `registry/fetcher.ts`); keep new commands offline-clean or explicitly networked.
- **NO second name/type catalog** that duplicates the registry schema. Presets (`base` / `primary` / `size` / `radius` / `font` families in `src/registry/config.ts`) are pulled straight from `@vean/theme` so a family added to the engine reaches the CLI without a second edit — preserve that.
- **NO zod** — the repo standard here is valibot; JSON Schema is derived from it, not hand-written.
