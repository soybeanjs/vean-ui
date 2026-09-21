# vean vs shadcn-vue CLI — Technical Comparison & Architectural Audit

> Produced via a `grill-with-docs` session (3 grilling rounds, 11 locked decisions).
> See [adr.md](./adr.md) for decision records and [GLOSSARY.md](./GLOSSARY.md) for terminology.

## 1. Executive summary

`vean` (`packages/cli`, v0.31.0) is the Vean ecosystem's counterpart to `shadcn-vue`'s `packages/cli`. Both are copy-paste component CLIs built on `commander`, with a registry-fetch + file-write core. vean is **UnoCSS-first, Vue-ecosystem-bound, valibot-validated**; shadcn-vue is **Tailwind-first, multi-framework, zod-validated**.

**Headline findings:**

- **Command surface:** vean **exceeds** shadcn-vue — vean adds `template`, `registry`, `preset`, `scan`, and since v0.50.0 `migrate` (`rebrand` migration; see the 2026-09-18 note in §3.1 and ADR-004).
- **MCP surface:** **already at parity** — both expose the identical 7-tool set. But vean **hand-rolls the JSON-RPC protocol** while shadcn uses the official `@modelcontextprotocol/sdk`.
- **Registry schema:** vean covers **9 of 15** item types; **6 typed gaps** remain. vean correctly carries an `uno` field (UnoCSS-native) vs shadcn's `tailwind` field — alignment is **good**, not merely imitative.
- **Tech-stack alignment:** **strong** — vean templates wire `@soybeanjs/cva ^0.0.9`, `@vean/aria`, `@vean/theme`, `@vean/unocss`, `unocss`; registry.json's 90+ components depend on `@vean/aria`; the `Icon` component depends on `@iconify/vue` (component-based icons, not class-based).
- **Architectural inconsistency:** the registry-item `uno` field is **opaque** `{config: object{}}` while the project-config `uno` (in `vean.json`) is **structured** (`base/primary/size/radius`). This split-identity is the single biggest schema smell.
- **Resolver sophistication:** vean's BFS-queue + **file-level source expansion** (auto-pulling co-located files from `SOURCE_ROOT`) is arguably **more advanced** than shadcn's resolver in one dimension; it lacks only deterministic topological ordering.

**Bottom line:** vean is **architecturally reasonable and well-aligned** with the Vean stack. It is not a deficient port — several of its "gaps" are correct divergences (UnoCSS vs Tailwind, Iconify-component vs class icons, valibot vs zod). The genuine work is a focused schema-enrichment + resolver-ordering + base-config-typing effort, not a rewrite.

---

## 2. Scope & method

**Comparison subjects**

|            | vean                                               | shadcn-vue                                    |
| ---------- | -------------------------------------------------- | --------------------------------------------- |
| Path       | `packages/cli/` (in `vean` repo)                   | `packages/cli/` (in `shadcn-vue` repo)        |
| Version    | 0.31.0                                             | (per `package.json`)                          |
| Stack      | UnoCSS + `@soybeanjs/cva` + `@vean/aria` + valibot | Tailwind + zod + `ts-morph` + `vue-metamorph` |
| Frameworks | Vue (Vite)                                         | Vue (Vite/Nuxt/Laravel/Astro)                 |

**Method.** A `grill-with-docs` session: deep parallel exploration of both codebases → 3 grilling rounds producing 11 locked decisions (D1–D11, recorded in [adr.md](./adr.md)) → capability diff matrix + reasonableness evaluation + findings. Every claim cites file:line.

**Parity scope (D1).** Only gaps relevant to the Vean/UnoCSS/`@soybeanjs/cva` stack count as "missing." Tailwind v3→v4 migration, postcss handling, `ts-morph`/`vue-metamorph` AST transforms, and non-Vue framework scaffolds (Laravel/Astro) are **intentionally out-of-scope** — they are peer paths, not targets.

---

## 3. Capability comparison matrix

### 3.1 Commands

| Command    | vean | shadcn-vue | Notes                                                                                                                                                                                                                                                                                                                             |
| ---------- | :--: | :--------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init`     |  ✓   |     ✓      | shadcn `init` offers base/style/icon/font/CSS-vars/RTL/pointer; vean `init` wires `uno.config.ts` + `@vean/unocss`                                                                                                                                                                                                                |
| `add`      |  ✓   |     ✓      | Both support `--overwrite/--dry-run/--diff/--all`. vean uses BFS-queue + file-level expansion ([add.ts:90-146](../src/utils/add-components.ts#L90-L146)); shadcn uses topological resolver                                                                                                                                        |
| `apply`    |  ✓   |     ✓      | shadcn `apply` has **backup/restore** of presets ([apply.ts:25-220](https://github.com/unovue/shadcn-vue)); vean `apply` present — backup/restore depth unverified                                                                                                                                                                |
| `build`    |  ✓   |     ✓      | shadcn `build` validates registry JSON, transforms file contents, writes published registry JSON; vean `build` present                                                                                                                                                                                                            |
| `diff`     |  ✓   |     ✓      | Both present                                                                                                                                                                                                                                                                                                                      |
| `docs`     |  ✓   |     ✓      | Both present                                                                                                                                                                                                                                                                                                                      |
| `view`     |  ✓   |     ✓      | Both present                                                                                                                                                                                                                                                                                                                      |
| `search`   |  ✓   |     ✓      | vean uses Levenshtein fuzzy ([search.ts:29-169](../src/registry/search.ts#L29-L169)); shadcn uses `searchRegistries`                                                                                                                                                                                                              |
| `info`     |  ✓   |     ✓      | vean `info` prints `uno.base/primary/size/radius` ([info.ts:77-82](../src/commands/info.ts#L77-L82))                                                                                                                                                                                                                              |
| `mcp`      |  ✓   |     ✓      | **Identical 7-tool surface**, divergent impl (see 3.4)                                                                                                                                                                                                                                                                            |
| `migrate`  |  ✓   |     ✓      | vean migrated only its own rename until v0.50.0; now ships `migrate [migration]` with `rebrand` ([commands/migrate.ts](../src/commands/migrate.ts)), rule-based rather than AST. shadcn has `icons` + `rtl` migrations ([migrate.ts:12-114](https://github.com/unovue/shadcn-vue/blob/main/packages/cli/src/commands/migrate.ts)) |
| `template` |  ✓   |     ✗      | vean-only — generates `uno.config.ts`/Vite config/resolver ([templates.ts:42-184](../src/templates/templates.ts#L42-L184))                                                                                                                                                                                                        |
| `registry` |  ✓   |     ✗      | vean-only — `@namespace=url` management, `{name}` placeholder validation ([registry.ts:19-138](../src/commands/registry.ts#L19-L138))                                                                                                                                                                                             |
| `preset`   |  ✓   |     ✗      | vean-only — preset application mutates `uno` config ([preset.ts:53-57](../src/commands/preset.ts#L53-L57))                                                                                                                                                                                                                        |
| `scan`     |  ✓   |     ✗      | vean-only — detects `unocss`/`@unocss/core`/`@vean/unocss` ([scan.ts:31-35](../src/commands/scan.ts#L31-L35))                                                                                                                                                                                                                     |

**Net:** vean **+5 unique commands** (`template`, `registry`, `preset`, `scan`, plus the ecosystem-specific `migrate`), **no missing command**. Per D4, `migrate` was **deferred** until a real breaking Vean change demanded it — that trigger arrived with the v0.50.0 rebrand, and the command shipped on 2026-09-18 (ADR-004, now Accepted). AST transforms remain out of scope for now: the rebrand is a string-level rewrite.

### 3.2 Registry item types

vean defines 9 types ([schema.ts:27-37](../src/registry/schema.ts#L27-L37)); shadcn defines 15 ([schema.ts:85-103](https://github.com/unovue/shadcn-vue/blob/main/packages/cli/src/registry/schema.ts)). Per D2, the 6 missing types are **to be adopted verbatim**.

| Type                  | vean | shadcn-vue | Disposition                                                                                                     |
| --------------------- | :--: | :--------: | --------------------------------------------------------------------------------------------------------------- |
| `registry:ui`         |  ✓   |     ✓      | —                                                                                                               |
| `registry:component`  |  ✓   |     ✓      | —                                                                                                               |
| `registry:style`      |  ✓   |     ✓      | —                                                                                                               |
| `registry:lib`        |  ✓   |     ✓      | —                                                                                                               |
| `registry:hook`       |  ✓   |     ✓      | —                                                                                                               |
| `registry:theme`      |  ✓   |     ✓      | —                                                                                                               |
| `registry:base`       |  ✓   |     ✓      | vean's base config is **opaque** → D9 mandates typed Vean-native shape                                          |
| `registry:font`       |  ✓   |     ✓      | vean font schema is **lean** (no `provider/import/variable/subsets`) → D3 keeps it lean (theme pkg owns tokens) |
| `registry:block`      |  ✓   |     ✓      | —                                                                                                               |
| `registry:composable` |  ✗   |     ✓      | **GAP** → adopt (D2)                                                                                            |
| `registry:page`       |  ✗   |     ✓      | **GAP** → adopt (D2); shadcn enforces mandatory `target` for this type                                          |
| `registry:file`       |  ✗   |     ✓      | **GAP** → adopt (D2); mandatory `target`                                                                        |
| `registry:item`       |  ✗   |     ✓      | **GAP** → adopt (D2)                                                                                            |
| `registry:example`    |  ✗   |     ✓      | **GAP** → adopt (D2); internal-only                                                                             |
| `registry:internal`   |  ✗   |     ✓      | **GAP** → adopt (D2); internal-only                                                                             |

### 3.3 Schema fields (per registry item)

| Field                       | vean                                                                                                                                          | shadcn-vue                                                  | Disposition                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `tailwind` / `uno`          | `uno: {config: object{}}` **opaque**                                                                                                          | `tailwind: {config:{content,theme,plugins}}` **structured** | **GAP** → D5 mandates structuring `uno` to `{presets, rules, shortcuts, theme, safelist}`          |
| `cssVars`                   | `{light, dark}` (2 scopes)                                                                                                                    | `{theme, light, dark}` (3 scopes)                           | **GAP** (theme scope) → D3: stays lean in vean; theme scopes owned by `@vean/theme`                |
| `css`                       | `string` (plain)                                                                                                                              | recursive nested object (`z.lazy`)                          | **GAP** → D3: stays `string` in vean; recursive css modeling owned by theme pkg                    |
| `envVars`                   | ✗                                                                                                                                             | `z.record(string,string)`                                   | **OUT-OF-SCOPE** (D1): env-var injection is a Tailwind/v0 concern; UnoCSS path doesn't need it     |
| `font` (item)               | `family/weight/style/display/src`                                                                                                             | `family/provider/google/import/variable/subsets`            | **GAP** (Google-font provider) → D3: lean font schema stays; rich font delivery owned by theme pkg |
| `meta`                      | structured `registryItemMetaSchema`                                                                                                           | `z.record(string, any)`                                     | vean is **richer** (typed namespace/url/tags/author/source)                                        |
| `registries` (config-level) | ✓ (`registry.ts` command)                                                                                                                     | `registryConfigSchema` with `{url, params, headers}`        | shadcn supports per-registry **headers + params** (auth) → vean gap                                |
| `aliases`                   | unverified                                                                                                                                    | `components/utils/ui/lib/hooks/composables`                 | verify vean parity                                                                                 |
| Dependency-graph validation | **✓** `validateRegistryDependencies` with circular-dep DFS + missing-dep detection ([schema.ts:220-261](../src/registry/schema.ts#L220-L261)) | ✗ (not in schema.ts)                                        | **vean advantage**                                                                                 |

### 3.4 MCP implementation

| Aspect              | vean                                                                                                                                           | shadcn-vue                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool count          | 7                                                                                                                                              | 7                                                                                                                                                                      |
| Tool names          | identical set                                                                                                                                  | identical set                                                                                                                                                          |
| Protocol impl       | **Hand-rolled** JSON-RPC over stdio ([mcp/index.ts:307-413](../src/mcp/index.ts#L307-L413)) — manual `Content-Length` framing, stdin buffering | Official `@modelcontextprotocol/sdk` `Server` + `zodToJsonSchema` ([mcp/index.ts:20-31](https://github.com/unovue/shadcn-vue/blob/main/packages/cli/src/mcp/index.ts)) |
| Input schema typing | hand-written JSON Schema objects                                                                                                               | `zodToJsonSchema(z.object({...}))` (typed source of truth)                                                                                                             |
| Error handling      | `writeError` codes                                                                                                                             | `ZodError` + `RegistryError` mapping with suggestions                                                                                                                  |

**Surface = parity. Implementation = divergent.** Per D11, lock the 7 existing tools + add `explain_gap` (compares installed vs registry, suggests missing). **Recommendation:** migrate the hand-rolled transport to `@modelcontextprotocol/sdk` to inherit protocol evolution — this is an implementation-quality gap, not a feature gap.

### 3.5 Subsystems

| Subsystem               | vean                                                                                       | shadcn-vue                                                                          | Disposition                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Icons**               | ✗                                                                                          | `lucide` + `tabler` fetching via `src/icons/`                                       | **OUT-OF-SCOPE (D7).** Vean's `Icon` uses `@iconify/vue` (component-based, arbitrary Iconify collections), not class-based icons. shadcn's class-icon model is structurally inapplicable.     |
| **Styles transform**    | ✗                                                                                          | Tailwind v4 migration, CSS-var transforms, CSS→Tailwind (`src/styles/transform.ts`) | **OUT-OF-SCOPE (D1).** Tailwind-specific. UnoCSS has no equivalent need.                                                                                                                      |
| **AST transforms**      | ✗                                                                                          | `ts-morph` + `vue-metamorph`                                                        | **DEFERRED (D4).** vean uses regex import extraction ([add-components.ts:479-484](../src/utils/add-components.ts#L479-L484)). Adopt AST only when a real breaking Vean API change demands it. |
| **Transformers**        | 1 (`transform-import` only, [transformers/index.ts:1](../src/utils/transformers/index.ts)) | `transform.ts` (styles) + `transform-import`                                        | vean parity for import-rewriting; no styles transform (correct for UnoCSS)                                                                                                                    |
| **Resolver**            | BFS-queue + file-level source expansion + regex + dedup                                    | topological sort + recursive dep-tree + metadata merge                              | **D6:** keep BFS+regex; **add topo sort for write ordering only**                                                                                                                             |
| **Templates**           | Vite + UnoCSS config + resolver                                                            | Vite/Nuxt/Laravel/Astro scaffolds                                                   | **D10:** add **Nuxt** template (Vue-ecosystem, in-scope); skip Laravel/Astro                                                                                                                  |
| **Schema library**      | valibot                                                                                    | zod                                                                                 | **D8:** keep valibot; **emit + publish JSON schemas** via new `pnpm sui gen schema` task                                                                                                      |
| **Public JSON schemas** | `scripts/schema.ts` exists, no published schema                                            | `registry-item.json`, `schema.json` published                                       | **GAP** → D8 closes it                                                                                                                                                                        |
| **Framework detection** | `scan` recognizes `unocss`/`@unocss/core`/`@vean/unocss` + `uno.config.{ts,js,mjs}`        | `frameworks.ts` detects Nuxt/Vite/Laravel/Astro                                     | vean is UnoCSS-focused; **D10** adds Nuxt awareness                                                                                                                                           |

---

## 4. Architectural reasonableness evaluation

**Question to answer:** Is vean's current architecture reasonable given alignment with `@vean/ui`, UnoCSS, and `@soybeanjs/cva`?

### 4.1 `@vean/ui` alignment — **STRONG**

- vean `registry.json` (90+ components) declares `@vean/aria` as the universal dependency — matches the monorepo's aria→ui data flow.
- `templates.ts` wires `@vean/ui` via the resolver ([index.ts:225-254](../src/templates/index.ts#L225-L254)): rewrites `from: '@vean/ui'` to the local ui directory. This is the correct "copy-paste the styled wrapper into the user's project" model.
- `WRITABLE_FILE_TYPES` ([add-components.ts:22](../src/utils/add-components.ts#L22)) = `registry:ui/style/lib/theme` — correctly restricts writes to the four types a user project should receive. `registry:component/block/hook/base/font` are **not** directly writable — sensible.
- `includeBarrelFiles` ([add-components.ts:260-305](../src/utils/add-components.ts#L260-L305)) auto-pulls `index.ts` barrels from component source dirs — this preserves the aria barrel-export contract when copying.

### 4.2 UnoCSS alignment — **STRONG, with one schema smell**

- vean `get-project-info.ts` detects `uno.config.{ts,js,mjs}` ([get-project-info.ts:61-78](../src/utils/get-project-info.ts#L61-L78)) — correct detection.
- `scan.ts` recognizes `unocss`, `@unocss/core`, `@vean/unocss` ([scan.ts:31-35](../src/commands/scan.ts#L31-L35)).
- `templates.ts` generates `uno.config.ts` with `presetVean` from `@vean/unocss` ([templates.ts:45](../src/templates/templates.ts#L45)).
- **Schema smell:** the registry-item `uno` field is **opaque** `{config: v.optional(v.object({}))}` ([schema.ts:72-76](../src/registry/schema.ts#L72-L76)) while the project-config `uno` (in `vean.json` / `registry/config.ts:61`) is **structured** (`base/primary/size/radius`). This split-identity means registry items **cannot** declaratively ship UnoCSS config fragments (presets/rules/shortcuts). **D5** mandates structuring the registry-item `uno` field to mirror UnoCSS's actual config shape.

### 4.3 `@soybeanjs/cva` alignment — **STRONG**

- `templates.ts` pins `@soybeanjs/cva: ^0.0.9` as a project dependency ([templates.ts:171, 241](../src/templates/templates.ts#L171)).
- Test fixture `dialog.json` declares `["@vean/aria", "@soybeanjs/cva"]` ([test/fixtures/registry/dialog.json:5](../test/fixtures/registry/dialog.json#L5)) — confirms `cva` is treated as a first-class component dependency.
- `registry/config.ts` imports from `@vean/theme` ([config.ts:7](../src/registry/config.ts#L7)) — the theme package (built on `cva`) owns tokens, consistent with **D3** (vean = delivery system; theme pkg = token owner).
- **Gap:** vean has no schema-level awareness of `cv()`/`scv()` recipes, `UiSlot`/`UiClass`, or the multi-slot vs compact vs single-class component taxonomy from the monorepo's AGENTS.md. Registry items are type-tagged (`registry:ui`) but do not express which component pattern they implement. **Not a blocker** — the taxonomy lives in the component source, not the registry — but a future enhancement could add a `meta.componentPattern` hint for tooling.

### 4.4 Overall reasonableness verdict

**Reasonable.** vean is not a defective shadcn port — it makes several **correct divergences** (UnoCSS over Tailwind, Iconify-component over class icons, valibot over zod, file-level source expansion over AST). The genuine issues are localized:

1. **Schema enrichment** (D5, D9) — structure `uno` field; type `registry:base` config.
2. **Taxonomy completion** (D2) — add 6 missing item types.
3. **Resolver ordering** (D6) — add topological sort for deterministic diffs.
4. **MCP transport** (D11) — adopt `@modelcontextprotocol/sdk`; add `explain_gap`.
5. **Public schemas** (D8) — emit + publish JSON schemas.
6. **Nuxt scaffold** (D10) — extend `template` command.

---

## 5. Architectural inconsistencies

| #   | Inconsistency                                                                                                                                       | Evidence                                                                                                       | Severity                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| I-1 | **`uno` field dual identity** — registry-item `uno` is opaque `{config: object{}}` while project-config `uno` is structured                         | [schema.ts:72-76](../src/registry/schema.ts#L72-L76) vs [registry/config.ts:61](../src/registry/config.ts#L61) | High — blocks registry:base/style items from carrying UnoCSS config |
| I-2 | **`registry:base` config opaque** — cannot declaratively represent a project variant                                                                | [schema.ts:123-128](../src/registry/schema.ts#L123-L128)                                                       | High — gates full project bootstrapping via a base item             |
| I-3 | **MCP hand-rolled transport** — diverges from official SDK; fragile to protocol evolution                                                           | [mcp/index.ts:307-413](../src/mcp/index.ts#L307-L413)                                                          | Medium — surface is at parity but impl is maintenance-heavy         |
| I-4 | **Non-deterministic write ordering** — BFS-queue produces diffs in fetch order, not dependency order                                                | [add-components.ts:90-146](../src/utils/add-components.ts#L90-L146)                                            | Medium — `vean add` runs differ across invocations                  |
| I-5 | **No public JSON schema** — users get no IDE autocompletion/validation of `registry.json`                                                           | `scripts/schema.ts` exists, unpublished                                                                        | Medium — DX gap vs shadcn                                           |
| I-6 | **Per-registry auth missing** — shadcn supports `{url, params, headers}` for private registries; vean registry command parses `@namespace=url` only | [registry.ts:19-138](../src/commands/registry.ts#L19-L138) vs shadcn `registryConfigSchema`                    | Low-Medium — affects private/authenticated registries               |
| I-7 | **`registry:font` lean schema** — no Google-font `provider/import/variable`                                                                         | [schema.ts:82-88](../src/registry/schema.ts#L82-L88)                                                           | Low — D3 defers to theme pkg; intentional                           |

---

## 6. Implementation gaps (detailed)

### G-1 `migrate` command (deferred — D4)

shadcn-vue ships `migrate` with `icons` and `rtl` migrations. vean has none. **Decision:** defer until a concrete Vean breaking change (e.g., `@soybeanjs/cva` v0→v1 recipe API, aria context API evolution) demands it. No speculative infrastructure.

### G-2 Registry item-type taxonomy (6 types — D2)

Missing `registry:composable`, `registry:page`, `registry:file`, `registry:item`, `registry:example`, `registry:internal`. **Action:** add to `registryItemTypeSchema` ([schema.ts:27-37](../src/registry/schema.ts#L27-L37)). Enforce mandatory `target` for `registry:file`/`registry:page` (parity with shadcn's discriminated file schema).

### G-3 `uno` field structuring (D5)

Replace `registryItemUnoSchema` opaque object with `{presets, rules, shortcuts, theme, safelist}` mirroring UnoCSS's `UserConfig` shape. Enables `registry:base`/`registry:style` items to ship real UnoCSS config fragments that merge deterministically.

### G-4 `registry:base` typed config (D9)

Replace opaque `config: v.optional(v.object({}))` with a typed `veanBaseConfigSchema`: `uno` (base/primary/size/radius), `aliases` (ui/theme/styles/components/composables), `themePackage` (`@vean/theme`), `resolver`, `iconLibrary`, `rtl`, `pointer`. Base items carry `.deepPartial()` of this.

### G-5 Resolver topological ordering (D6)

Keep BFS-queue + file-level expansion + regex extraction. Add a topological-sort pass **only** for deterministic file-write ordering — so identical `vean add` runs produce identical diffs. No AST, no recursive metadata merge.

### G-6 MCP SDK adoption + `explain_gap` tool (D11)

Migrate hand-rolled JSON-RPC transport to `@modelcontextprotocol/sdk` `Server`. Add 8th tool `explain_gap` — compares a project's installed components against the registry and suggests missing ones. Lock the existing 7 as the parity minimum.

### G-7 Public JSON schema publishing (D8)

Keep valibot. Add a valibot→JSON-Schema emitter (via `@valibot/to-json-schema`). Publish `vean.json` + `registry-item.json` schemas via a new `pnpm sui gen schema` task, integrated with the monorepo's existing `pnpm sui` generation flow.

### G-8 Nuxt template (D10)

Extend `template` command with `--framework nuxt|vite` flag. Nuxt template wires `@vean/ui/nuxt` module + `uno.config.ts`. Skip Laravel/Astro (out-of-scope, D1).

### G-9 Per-registry auth (open — not yet decided)

shadcn's `registryConfigSchema` supports `{url, params, headers}` for private/authenticated registries. vean's `registry` command accepts `@namespace=url` only. **Status:** open; recommend adopting the object form as an optional advanced shape.

---

## 7. Areas for improvement — prioritized roadmap

Tied to ADRs; priority reflects dependency + user-impact.

| Priority | Work                                          | ADR     | Effort shape                                    |
| -------- | --------------------------------------------- | ------- | ----------------------------------------------- |
| P0       | Structure `uno` field (I-1, G-3)              | ADR-005 | Schema change + transformer update              |
| P0       | Type `registry:base` config (I-2, G-4)        | ADR-009 | Schema change + init/template refactor          |
| P1       | Adopt 6 missing item types (G-2)              | ADR-002 | Schema additive; enforce `target` for file/page |
| P1       | Add resolver topo-sort (I-4, G-5)             | ADR-006 | Localized to `add-components.ts` write path     |
| P1       | Publish JSON schemas (I-5, G-7)               | ADR-008 | New `pnpm sui gen schema` task + emitter        |
| P2       | Migrate MCP to SDK + `explain_gap` (I-3, G-6) | ADR-011 | Replace transport; preserve tool surface        |
| P2       | Add Nuxt template (G-8)                       | ADR-010 | New template variant + framework flag           |
| P3       | Per-registry auth object form (I-6, G-9)      | open    | `registry` command + config schema              |
| Deferred | `migrate` command + AST (G-1)                 | ADR-004 | Wait for a real breaking change                 |

---

## 8. vean-only strengths (not gaps)

To avoid framing vean as merely "behind," these capabilities are **vean advantages**:

- **`template`/`registry`/`preset`/`scan` commands** — shadcn has none of these as standalone commands.
- **Dependency-graph validation** — `validateRegistryDependencies` with circular-dep DFS + missing-dep detection ([schema.ts:220-261](../src/registry/schema.ts#L220-L261)); shadcn's schema.ts has no equivalent.
- **File-level source expansion** — `expandRegistryItemFiles` auto-pulls co-located source files from `SOURCE_ROOT` ([add-components.ts:212-254](../src/utils/add-components.ts#L212-L254)); shadcn's resolver does not auto-expand co-located source.
- **Barrel `index.ts` inclusion** — `includeBarrelFiles` preserves aria barrel-export contract ([add-components.ts:260-305](../src/utils/add-components.ts#L260-L305)).
- **UnoCSS-native schema** — `uno` field + `presetVean` wiring is the idiomatic UnoCSS path; shadcn's `tailwind` field is structurally bound to Tailwind.

---

## 9. References

- vean schema: [packages/cli/src/registry/schema.ts](../src/registry/schema.ts)
- vean resolver: [packages/cli/src/utils/add-components.ts](../src/utils/add-components.ts)
- vean MCP: [packages/cli/src/mcp/index.ts](../src/mcp/index.ts)
- vean templates: [packages/cli/src/templates/templates.ts](../src/templates/templates.ts)
- vean registry.json: [packages/cli/registry.json](../registry.json)
- shadcn-vue schema: `packages/cli/src/registry/schema.ts`
- shadcn-vue resolver: `packages/cli/src/registry/resolver.ts`
- shadcn-vue MCP: `packages/cli/src/mcp/index.ts`
- Decisions: [adr.md](./adr.md) | Terminology: [GLOSSARY.md](./GLOSSARY.md)
