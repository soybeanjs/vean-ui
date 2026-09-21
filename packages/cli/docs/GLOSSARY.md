# Glossary — vean vs shadcn-vue comparison

> Companion to [comparison-with-shadcn-vue.md](./comparison-with-shadcn-vue.md) and [adr.md](./adr.md).

Terms are grouped by domain. Each entry is grounded in the vean codebase unless noted.

## A–D

**add-components** — vean's core copy-paste engine ([`src/utils/add-components.ts`](../src/utils/add-components.ts)). Implements BFS-queue dependency resolution, file-level source expansion, dry-run/diff, and dependency installation. Distinct from the `add` _command_ ([`src/commands/add.ts`](../src/commands/add.ts)) which is its CLI surface.

**aliases** — Path aliases resolved from project config (`@/ui`, `@/theme`, `@/styles`, `@/components`). vean's `resolveSourceDependencyPath` ([add-components.ts:397-429](../src/utils/add-components.ts#L397-L429)) maps these to `SOURCE_ROOT` paths during file-level expansion.

**BFS-queue resolver** — vean's dependency-resolution model: a breadth-first queue processes components, collecting and enqueuing their dependencies, with `processed`/`queued` Sets for dedup ([add-components.ts:90-146](../src/utils/add-components.ts#L90-L146)). Distinct from shadcn-vue's topological-sort resolver. See ADR-006.

**`@soybeanjs/cva`** — Class-variant-authority package for the Vean stack. Provides `cv()` (single-class variants) and `scv()` (multi-slot variants). Pinned at `^0.0.9` in vean templates ([templates.ts:171](../src/templates/templates.ts#L171)). Used by `packages/ui` style recipes.

**`@vean/aria`** — Aria logic package (state, a11y, zero styles). The universal dependency declared by every component in vean's `registry.json` (90+ components). Data flow: aria → ui, never reverse.

**`@vean/theme`** — Theme token package for the Vean stack. Imported by vean ([registry/config.ts:7](../src/registry/config.ts#L7)). Per ADR-003, owns all rich token modeling (recursive css, Google-font provider, theme-scoped cssVars); vean references it but does not replicate it.

**`@vean/unocss`** — UnoCSS preset providing the shadcn-style token system for UnoCSS. Wired by vean `init`/`templates` ([templates.ts:45](../src/templates/templates.ts#L45)) via `presetVean`. Recognized by `vean scan` ([scan.ts:35](../src/commands/scan.ts#L35)).

**`@vean/ui`** — Styled-wrapper package. S-prefixed components built on `@vean/aria` + UnoCSS + `cv()`/`scv()`. vean templates rewrite `from: '@vean/ui'` to the local ui directory ([index.ts:253-254](../src/templates/index.ts#L253-L254)).

**barrel file** — `index.ts` re-export file. vean's `includeBarrelFiles` ([add-components.ts:260-305](../src/utils/add-components.ts#L260-L305)) auto-includes barrel files from component source directories during `add`, preserving the aria barrel-export contract.

## E–I

**file-level expansion** — vean's mechanism for auto-pulling co-located source files: `expandRegistryItemFiles` ([add-components.ts:212-254](../src/utils/add-components.ts#L212-L254)) BFS-traverses import specifiers in a registry item's files, reads the actual source from `SOURCE_ROOT`, and includes them. Arguably more advanced than shadcn-vue's resolver, which does not auto-expand co-located source.

**Iconify-component icon** — Vean's icon model: the `Icon` component (`packages/aria/src/components/_icon/`) uses `@iconify/vue` directly, accepting arbitrary Iconify collections as component props — **not** CSS class-based icons. The `Icon` registry entry declares `["@iconify/vue", "@vean/aria"]` ([registry.json:863](../registry.json#L863)). Per ADR-007, this makes shadcn's `icons` subsystem structurally inapplicable.

**`init`** — Command that scaffolds a new Vean project: generates `uno.config.ts`, Vite config, resolver, and installs `@soybeanjs/cva`/`aria`/`theme`/`unocss`/`unocss`. See [`src/commands/init.ts`](../src/commands/init.ts).

## M–R

**MCP (Model Context Protocol)** — JSON-RPC protocol over stdio for tool exposure to AI agents. vean hand-rolls the transport ([mcp/index.ts:307-413](../src/mcp/index.ts#L307-L413)); shadcn-vue uses `@modelcontextprotocol/sdk`. Both expose the identical 7-tool surface. See ADR-011.

**migration** — A named, rule-based project rewrite shipped by `vean migrate`; `rebrand` (SoybeanUI → Vean) is the first. Rules live in tiered tables ([migrate/rules.ts](../src/migrate/rules.ts)); a run is preview-by-default and idempotent. Distinct from a _registry item's_ `dependencies`, which are installed rather than rewritten. See ADR-004.

**preset** — A declarative project configuration applied via `vean preset`. Mutates the `uno` config (`base`/`primary`/`radius`) of an existing `vean.json` ([preset.ts:53-57](../src/commands/preset.ts#L53-L57)). Distinct from a _template_ (which scaffolds new projects).

**registry** — A JSON catalog of registry items. vean's `registry.json` (package root) lists 90+ Vean components. Resolved via `readRegistryWithIncludes` ([loader.ts](../src/registry/loader.ts)) which merges `include` references up to depth 32.

**registry item** — A single addressable unit in a registry. Validated by `registryItemSchema` ([schema.ts:123-148](../src/registry/schema.ts#L123-L148)), a valibot discriminated union on `type` (`registry:base` | `registry:font` | others). Carries `files`, `dependencies`, `registryDependencies`, `uno`, `cssVars`, `css`, `meta`, `docs`.

**registry item type** — The `type` discriminator on a registry item. vean defines 9 ([schema.ts:27-37](../src/registry/schema.ts#L27-L37)); shadcn-vue defines 15. Per ADR-002, vean adopts the 6 missing types verbatim.

**registry namespace** — A `@`-prefixed alias for a registry URL (e.g., `@vean=https://veanui.com/r/{name}.json`, where `{name}` is the namespace-qualified item name such as `ui/button`). Managed by `vean registry` ([registry.ts:19-138](../src/commands/registry.ts#L19-L138)). shadcn-vue additionally supports `{url, params, headers}` object form for auth (gap, G-9).

## S–U

**`scan`** — vean-only command that detects the project's stack by recognizing `unocss`/`@unocss/core`/`@vean/unocss` and `uno.config.{ts,js,mjs}` ([scan.ts:31-35](../src/commands/scan.ts#L31-L35), [get-project-info.ts:61-78](../src/utils/get-project-info.ts#L61-L78)).

**schema (valibot)** — vean uses valibot (not zod) for all runtime validation. `registryItemSchema`, `registrySchema`, `registryItemFileSchema` live in [`src/registry/schema.ts`](../src/registry/schema.ts). Per ADR-008, vean keeps valibot and emits JSON Schemas for IDE validation.

**`SOURCE_ROOT`** — The workspace source root discovered by `findWorkspaceSourceRoot` ([add-components.ts:509-525](../src/utils/add-components.ts#L509-L525)). File-level expansion reads co-located source from here. Only available in monorepo dev; falls back to remote fetch in user projects.

**`template`** — vean-only command that generates project scaffolding (`uno.config.ts`, Vite config, resolver). Currently Vite-only; per ADR-010, gains a `--framework nuxt|vite` flag with a Nuxt variant wiring `@vean/ui/nuxt`.

**`uno` field (registry item)** — Currently opaque `{config: v.optional(v.object({}))}` ([schema.ts:72-76](../src/registry/schema.ts#L72-L76)). Per ADR-005, restructured to `{presets, rules, shortcuts, theme, safelist}` mirroring UnoCSS's `UserConfig`. Distinct from the project-config `uno` (in `vean.json`), which is already structured (`base`/`primary`/`size`/`radius`).

**`uno` field (project config)** — The structured UnoCSS theme settings in `vean.json`: `base`, `primary`, `size`, `radius`. Printed by `vean info` ([info.ts:77-82](../src/commands/info.ts#L77-L82)). See ADR-009.

**UnoCSS** — Atomic CSS engine (superset of Tailwind) used by the Vean stack. vean is UnoCSS-first, in contrast to shadcn-vue's Tailwind-first stance. Configured via `uno.config.ts` with `presetVean` from `@vean/unocss`.

## V–Z

**valibot** — Schema-validation library used by vean (alternative to zod). Chosen for smaller bundle size. See ADR-008.

**`WRITABLE_FILE_TYPES`** — The set of registry item file types that `add-components` writes to disk: `registry:ui`, `registry:style`, `registry:lib`, `registry:theme` only ([add-components.ts:22](../src/utils/add-components.ts#L22)). `registry:component`/`block`/`hook`/`base`/`font` are not directly writable — a deliberate design choice restricting what lands in user projects.

**zod** — Schema-validation library used by shadcn-vue. vean uses valibot instead (ADR-008); the two ecosystems' schemas diverge on `uno` vs `tailwind` regardless.
