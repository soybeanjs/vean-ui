# PROJECT KNOWLEDGE BASE

## AI ASSISTANT ENTRYPOINT

Component development rules live in the self-contained skill at `.agents/skills/vean-ui-develop/`:

- [SKILL.md](.agents/skills/vean-ui-develop/SKILL.md) — pattern classification, phase order, workflows, guardrails, delivery surfaces, generation workflow.
- [layers.md](.agents/skills/vean-ui-develop/layers.md) — aria admission, aria/UI layer rules, a11y/RTL.
- [surfaces.md](.agents/skills/vean-ui-develop/surfaces.md) — playground, docs, testing delivery surface rules.
- [e2e.md](.agents/skills/vean-ui-develop/e2e.md) — browser e2e testing (Tier 1 component-level + Tier 2 app-level smoke), env setup, core scenarios, assertion standards.
- [process.md](.agents/skills/vean-ui-develop/process.md) — finish checklist, git commit convention.
- [audit.md](.agents/skills/vean-ui-develop/audit.md) — assessment methodology, seven check dimensions (D1–D7, 106 items), severity, acceptance, regression flows for already-shipped components.
- [EXAMPLES.md](.agents/skills/vean-ui-develop/EXAMPLES.md) — request shapes that trigger the skill.

**Global skill rules (mandatory for all agents, applied before any task):**

- When editing `**/*.{ts,tsx,js,jsx}` files, first `read_skill typescript-functional-style` and follow it.
- When editing `**/*.vue` files, first `read_skill typescript-functional-style` and `read_skill vue-sfc-structure`, and follow both.

Both skills are installed globally in the skills store and can be loaded from any project. They are the single source of truth for TypeScript functional style and Vue SFC structure; the component development skill does not restate their content.

Load the component development skill for any task that creates, migrates, extends, standardizes, fixes, or audits a Vean component. For auditing or re-evaluating already-shipped components, load [audit.md](.agents/skills/vean-ui-develop/audit.md) for the assessment methodology.

If a nearer scoped `AGENTS.md` exists for your target path, use it only to narrow which skill sections apply.

**Version:** all workspaces are versioned in lockstep from the root `package.json` (currently `0.50.0-beta.3`)
**Monorepo:** pnpm workspaces — private root + 8 members (6 packages + 2 apps): 5 publishable packages, 1 private package (`@vean/scripts`), 2 private apps. `skills/` is a **generated distribution**, not a workspace member.
**Stack:** Vue 3 + TypeScript (strict) + UnoCSS + @soybeanjs/cva

## Agent skills

### Issue tracker

GitHub Issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage roles, label strings equal to the role names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` glossary at the repo root + shared `docs/adr/`. See `docs/agents/domain.md`.

## ARCHITECTURE

The canonical workspace map, labeled dependency graph, build/test flows, and
sources of truth live in [docs/architecture.md](docs/architecture.md).
Prioritized structural findings and acceptance criteria live in
[docs/optimize.md](docs/optimize.md).

Core Aria/Styled separation:

- **@vean/aria** (`packages/aria/`): Logic, state, a11y. Zero styles. ~90 component families (`_common`/`_icon` are internal) and ~30 composables. Includes base primitives, date utilities, and Compact aggregations.
- **@vean/ui** (`packages/ui/`): Styled wrappers. UnoCSS + `cv()` / `scv()`. ~94 family directories / ~140 `S`-prefixed exports; a minority of families are UI-only because they fail aria admission (the list lives under COMPONENT DEVELOPMENT).

The generated catalogs `packages/{aria,ui}/src/constants/components.ts` are the authority for names and counts — read them instead of hand-counting, and refresh with `pnpm sui gen catalog`.

Compile-time dependency direction is **UI → Aria**: UI imports public
aria entry points; aria MUST NOT import UI. Runtime class injection goes
from the styled wrapper to its nested aria parts via `provideXUi(ui)` and
`useUiContext`.

Other publishable modules:

- **@vean/theme** (`packages/theme/`): theme engine — static palette layer + semantic alias layer (a declared mapping table, no measurement or correction), envelope storage + first-paint script. **Docs: [docs/design/theme.md](docs/design/theme.md) (§0 is the AI-agent handbook).**
- **@vean/unocss** (`packages/unocss/`): UnoCSS preset over `@vean/theme`.
- **@vean/cli** (`packages/cli/`, bin `vean`): source-distribution CLI, registry, schemas, templates, and MCP.
- **@vean/skills** (`skills/`): generated consumer-facing agent skills.

> There is **no** `@soybeanjs/admin` or `@soybeanjs/chart` package, and no standalone AI package: AI/chat components ship inside aria + ui under the standard `S` prefix — the component plan lives in [docs/roadmap/ui-ai-roadmap.md](docs/roadmap/ui-ai-roadmap.md). The former admin direction returns as an in-core **shell domain** (aria `src/shell/` + ui composites such as `SLayoutShell`/`SPageHeader`), planned in [docs/roadmap/ui-shell-roadmap.md](docs/roadmap/ui-shell-roadmap.md). Charts are not part of the core library: the docs site shows shadcn-styled demos built directly on [TanStack Charts](https://tanstack.com/charts) (see `apps/docs/src/examples/chart/` + the docs-local `apps/docs/src/components/chart/` theming shell).

Private packages and applications:

- **@vean/scripts** (`packages/scripts/`): private repo-service CLI `sui` (generators, stub, template sync). NOT published; do not merge with the consumer-facing `vean` CLI.
- **@vean/docs** (`apps/docs/`): ubean-based documentation site (SSG, Markdown, i18n). Owns the demo examples under `apps/docs/src/examples/`.
- **@vean/nuxt** (`apps/nuxt/`): Nuxt integration fixture.

## WHERE TO LOOK

| Task                               | Location                                                                  | Key Pattern                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| New component (logic)              | `packages/aria/src/components/[name]/`                                    | types.ts → context.ts → base \*.vue → optional compact/hook files → index.ts                              |
| New component (styled)             | `packages/ui/src/components/[name]/` + `packages/ui/src/styles/[name].ts` | style recipe → types.ts → `*.vue` → index.ts                                                              |
| Variant definitions                | `packages/ui/src/styles/[name].ts`                                        | `cv()` / `scv()` with `// @unocss-include` at top                                                         |
| Shared hooks                       | `packages/aria/src/composables/`                                          | `use-*.ts`, pure Vue composables (~30 total)                                                              |
| Theme engine (design/API/handbook) | `docs/design/theme.md`                                                    | **单一权威**：新旧差异与优势 / token 契约 / 引擎 API / 接入手册（§0）/ 验收                               |
| Theme dimension scale              | `docs/design/space-control-scale.md`                                      | spacing / radius 的取值与实测依据；什么不该成为刻度族（控件高度 / 图标 / 字号 / 阴影动效）                |
| Theme/sizing                       | `packages/ui/src/theme/`                                                  | `ThemeColor` (8 roles), `ThemeSize` (xs…2xl)                                                              |
| Token CSS generation               | `packages/theme/src/`                                                     | `resolveThemeMap(options)` → `emitThemeCss(map)`（Layer 2）/ `generatePaletteCss()`（Layer 1）            |
| UnoCSS adapter                     | `packages/unocss/`                                                        | `presetUi()` / `presetVean()`                                                                             |
| Source-distribution CLI            | `packages/cli/`                                                           | commands → registry/schema/templates/MCP                                                                  |
| Repo-service CLI (`sui`)           | `packages/scripts/`                                                       | `gen` (offline) / `translate` (Azure, DeepL fallback) / `check` groups, `size`, `stub`, `reorder-imports` |
| Utility functions                  | `packages/aria/src/shared/`                                               | Pure TS helpers (DOM, focus, tree, form, guard, comparison)                                               |
| Global types                       | `packages/aria/src/types/`                                                | `ClassValue`, `UiClass<S>`, `PropsToContext<T,K>`, `PrimitiveProps`                                       |
| Generated API data                 | `apps/docs/src/generated/api/`                                            | `pnpm sui gen api` baseline + `pnpm sui translate api --locale <locale>` locale text                      |
| Generated changelog data           | `apps/docs/src/generated/changelog/`                                      | `pnpm sui gen changelog` baseline + `pnpm sui translate changelog` locale summaries                       |
| Docs content                       | `apps/docs/src/content/{en,zh}/`                                          | Markdown rendering `<UsageCode>`, `<PlaygroundGallery>`, `<ComponentApi>`                                 |
| Demo source                        | `apps/docs/src/examples/ui/[component]/`                                  | Vue SFCs referenced by docs (chart demos under `examples/chart/`)                                         |
| Browser e2e tests                  | `packages/ui/test/browser/`                                               | `vitest.browser.config.ts` + `vitest-browser-vue` + `axe-core` (color-contrast on)                        |
| Workspace architecture             | `docs/architecture.md`                                                    | Package/app map, dependency graph, generation/build/test/release flows                                    |
| Size budgets / PR size report      | `size-budget.json` + `packages/scripts/src/commands/size.ts`              | Artifact + consumer-import bytes; PR baseline is the main-branch CI report, not a second build            |
| Architecture assessment            | `docs/optimize.md`                                                        | Evidence-ranked maintainability, scalability, and quality recommendations                                 |
| Component dev skill                | `.agents/skills/vean-ui-develop/`                                         | SKILL.md + layers.md (admission) + surfaces.md + e2e.md + process.md + audit.md                           |
| Aria admission reference           | `.agents/skills/vean-ui-develop/layers.md`                                | Violation shapes, known-compliant families, and pre-classified roadmap items                              |
| Scoped agent rules                 | `packages/**/AGENTS.md`, `apps/*/AGENTS.md`, `skills/AGENTS.md`           | Routing bridges; the nearest file narrows the skill rules                                                 |
| Domain terms                       | `CONTEXT.md`                                                              | Canonical vocabulary; `_Avoid_` lines flag drift                                                          |
| Docs index / governance / ADRs     | `docs/README.md`, `docs/GOVERNANCE.md`, `docs/adr/`                       | Which doc belongs where, how docs are maintained, decision record                                         |
| `sui` command sources              | `packages/scripts/src/cli.ts` + `src/commands/*.ts`                       | One file per command; surface pinned by `test/cli.spec.ts`                                                |
| vean registry & templates          | `packages/cli/registry.json` + `src/{registry,schema,templates,mcp}`      | Registry items, JSON schemas, scaffold templates, MCP server                                              |
| Generated consumer skills          | `skills/skills-source/`                                                   | Hand-edit the source; `pnpm sui gen skills` emits `skills/skills/`                                        |
| Docs site wiring                   | `apps/docs/src/constants/menus.ts` + `apps/docs/src/components/`          | Sidebar entries + `<ComponentApi>` / `<UsageCode>` / `<PlaygroundGallery>` host components                |
| Unit tests (aria / ui)             | `packages/aria/test/specs/`, `packages/ui/test/specs/`                    | happy-dom specs; UI helpers: `test/shared/a11y.ts`, `test/browser/shared/render.ts`                       |
| Code navigation (optional)         | `.codegraph/` (gitignored, local)                                         | `codegraph explore`, `codegraph impact <symbol>`, `codegraph affected <files>`, `codegraph sync`          |

## BUILD & CI

```bash
pnpm dev:docs         # Docs site (ubean dev)
pnpm build            # libs (theme, unocss) → aria → ui → @vean/cli via Vite Plus pack
pnpm build:libs       # theme → unocss
pnpm build:docs       # package build → vean registry → docs SSG + SEO
pnpm lint             # vp lint --fix && pnpm lint:vue (uses @soybeanjs/eslint-config-vue)
pnpm fmt              # vp fmt (formatter)
pnpm test             # recursive unit tests of every workspace that defines `test` (aria, ui, theme, unocss, vean, scripts via `vp test`)
pnpm test:e2e         # browser e2e (Vitest Browser Mode + playwright chromium; run `pnpm exec playwright install chromium` first)
pnpm typecheck        # pnpm -r typecheck (per-workspace vue-tsc / tsc)
pnpm release          # Generate changelog + sync templates + publish (soy release)
pnpm stub             # switch aria development exports to src (`--reset` restores dist exports)
pnpm sui gen catalog           # Regenerate component catalogs: aria constants/namespaced + ui constants
pnpm sui gen catalog ui        # Regenerate only packages/ui/src/constants/components.ts
pnpm sui gen api               # Regenerate apps/docs/src/generated/api/*.json and apps/docs/src/generated/api-locales/*.json
pnpm sui gen api --force       # Regenerate even when the source fingerprint still matches the committed data
pnpm sui gen changelog         # Regenerate apps/docs/src/generated/changelog/*.json and changelog-locales/*.json
pnpm sui gen schema            # Generate vean JSON Schemas (vean.json, registry-item.json, registry.json)
pnpm sui gen skills            # Generate skill docs and distribution files (skills/skills from skills/skills-source)
pnpm sui gen all               # Regenerate every surface above
pnpm sui translate <api|changelog|locale|all> [--locale <locale>]  # Fill pending translations via Azure (fallback: DeepL)
pnpm sui check generated       # Regenerate every surface and diff it against git (also a CI gate)
pnpm sui check deps            # Enforce the dependency gate: banned import scan + runtime dependency whitelists
pnpm sui size                  # Measure shipped artifacts + consumer-import bytes against size-budget.json
pnpm check:deps                # CI alias of `pnpm sui check deps`
pnpm check:generated           # CI alias of `pnpm sui check generated`
pnpm check:size                # CI alias of `pnpm sui check size` (fails on a budget breach, reports deltas)
pnpm sui reorder-imports [--check] [targets...]  # Reorder Props before Emits in .vue import type blocks
pnpm sui sync-template-versions  # Sync the @vean/* version constant used by project templates
```

- **Pre-commit hook** (Vite Plus, `.vite-hooks/pre-commit`): `vp staged`
- **CI** (`.github/workflows/ci.yml`, on PRs and pushes to `main`/`master`): install + `pnpm build` → `pnpm check:deps` → `pnpm check:generated` → typecheck → lint → test → `pnpm check:size`, plus a `size-comment` job (sticky PR comment) and a separate `e2e` job (Playwright chromium). It does not build the docs site; `release.yml` handles tag-triggered build and release.
- **Formatter**: `vp fmt`

**Release** (`pnpm release` → `soy release -e 'pnpm release-execute'`): versions are bumped across all workspaces in lockstep from the root `package.json`, then `release-execute` runs `soy changelog && sui gen skills && sui translate all && sync-template-versions`. Two consequences: never hand-edit a single package's version (they must stay equal), and `sui translate all` means a release **requires** translation credentials (`AZURE_TRANSLATE_KEY` or `DEEPL_API_KEY`) — the chain is not offline. `sync-template-versions` rewrites `packages/cli/src/templates/versions.ts`, a generated constant, so scaffolder versions follow the root bump automatically.

## GIT COMMIT CONVENTION

- **Follow Conventional Commits**: `<type>(<scope>): <subject>`, e.g. `fix(dialog): prevent nested popup from closing on outside click`.
- **`type` and `scope` are both required and must never be omitted**; lowercase kebab-case (write `ci(workflows): …`, never bare `ci: …`).
- **Commit messages must be written in English.**

## LOCAL DEVELOPMENT GOTCHAS

- **Dev and published entry points differ per package.** `packages/{aria,ui,cli}/package.json` `exports` resolve to `./src/...` so the workspace consumes source directly, and `publishConfig.exports` swaps to `./dist/...`. `packages/{theme,unocss}` have **no** dev indirection — they always resolve from `dist/`.
  - Consequence: after editing `packages/theme` or `packages/unocss`, run `pnpm build:libs` **before** any downstream `typecheck` / `test` / docs dev server, or consumers silently read a stale `dist`.
  - For aria, `pnpm stub` rewrites its `exports` between the src map and the `publishConfig` dist map; `pnpm stub --reset` restores dist. Do not hand-edit that `exports` block.
- **Focused test runs** take a positional path filter: `pnpm --filter @vean/ui test accordion`, `pnpm --filter @vean/aria test tree`. The filter matches spec paths, so a non-matching name exits 1 with "No test files found" instead of passing vacuously.
- **The docs site aliases resolve to source, not dist**: in `apps/docs`, `~` → `apps/docs/src` and `@` → `packages/ui/src` (the UI source tree), so UI edits show up in `pnpm dev:docs` without a build. `apps/docs/uno.config.ts` calls `presetUi({ resetCSS, globalCSS, uiCSS })`, which is why the docs page carries the static token preflight.
- **`apps/nuxt` is a fixture, not a shippable app**: it has no `version` field and no `test` script; it exists to prove `@vean/ui/nuxt` auto-registration and the `@vean/theme/ssr` first-paint script work.

## PACKAGE EXPORTS

**@vean/aria** sub-path exports:

- `.` → all components + types
- `./composables` → ~30 composables (useContext, useControllableState, useCollapseHeight, useUiContext, …)
- `./shared` → pure TS utilities
- `./constants` → ARIA constants, component keys
- `./date` → shared date utilities and calendar helpers
- `./locale` and `./locale/*` → locale registry and language bundles
- `./nuxt` → Nuxt auto-registration module
- `./resolver` → unplugin-vue-components resolver
- `./namespaced` → named-export namespace (e.g. `Aria.AccordionRoot`)
- `./types` → shared type surface for component, DOM, and utility types
- `./*` → `./components/*/index.ts` (per-component sub-path: `@vean/aria/accordion`)

**@vean/ui** sub-path exports:

- `.` → all S-prefixed components + theme utilities
- `./nuxt` → Nuxt auto-registration module
- `./resolver` → unplugin-vue-components resolver
- `./styles.css` → built UnoCSS stylesheet

## DEPENDENCY RULES

- `packages/ui` → imports public `@vean/aria` entry points
- `packages/aria` → MUST NOT import from `@vean/ui` (would create a circular dependency)
- `packages/unocss` → imports `@vean/theme`; token ownership stays in the theme package (its `src/theme.ts` is the single UnoCSS adapter)
- Components re-exported from barrel files: `packages/aria/src/index.ts`, `packages/ui/src/index.ts`

## KEY PATTERNS (verified from source)

- **UiClass**: Use `UiClass<UiSlot>` (from `packages/aria/src/types`), not `Record<UiSlot, ClassValue>`
- **Props**: Always `extends /** @vue-ignore */ HTMLAttributes` to suppress IDE noise
- **Context values**: Must be reactive — use `toContext(props, keys)` (from aria `shared/vue`) to wrap in `ComputedRef`; `fromContext(context, keys)` snapshots back to plain values
- **ui() two forms**: `use{Name}Ui('root')` → `ComputedRef<ClassValue>` (single slot); `use{Name}Ui()` → full map
- **Recipe merges**: For multi-slot wrappers, pass `props.ui` and `{ root: props.class }` directly into the `scv()` recipe call
- **Multi-slot**: `provide{Name}Ui(ui)` pattern; only export `provide`, not `use`
- **Compact aggregations**: For stable, data-driven composites, aria owns iteration, default content, and internal composition; UI wrappers stay thin and only handle variants, class injection, and prop/slot forwarding. A family has one when its directory contains `<name>-compact.vue` (~60 families today: accordion, dialog, table, select, menu, tree, date-field, pagination, …); the file, not a list here, is the authority.
- **Single-class**: No UiContext; use `{name}Variants({...}, props.class)` directly
- **index.ts re-exports**: UI component barrels re-export aria types from sub-path `@vean/aria/{component}`; `types.ts` should follow the established import style of neighboring components instead of mixing arbitrary paths
- **Generated metadata**: after public export, API, or changelog mapping/docs-surface changes, rerun `pnpm sui gen all` (or the specific `gen` target) as needed; for non-English generated text also run `pnpm sui translate <api|changelog>`, and `pnpm sui check generated` proves the committed data matches the sources.
- **CLI declaration**: `packages/scripts/src/cli.ts` declares every `sui` command with [cac](https://github.com/cacjs/cac) and passes parsed options into each action, so no command re-parses `process.argv` and `--help` / `--version` / unknown-option / missing-argument handling lives in one place. Add a command there and pin its surface in `packages/scripts/test/cli.spec.ts`; `index.ts` only parses and awaits.
- **Offline generation**: `gen` is deterministic and never touches the network; `translate` is the only networked group (Azure Translate preferred, DeepL fallback) and the only one that needs translation credentials.
- **Stable `generatedAt`**: generators compare the produced payload against the committed file and skip the write when only `generatedAt` would differ, so a no-op regeneration produces no diff and the field keeps meaning "when the data last changed". Never hand-edit generated timestamps.
- **Fingerprint-guarded extraction**: `gen api` hashes its inputs (ui/aria/theme/scripts sources, tsconfigs, lockfile) plus the on-disk output, and skips the TypeDoc pass (~40s → ~0.15s) only when both match the recorded entry. The entry lives in `node_modules/.cache/sui/` and is never committed; `--force` bypasses the check.
- **The drift set is declared, not discovered**: `generatedDataPaths` in `packages/scripts/src/commands/gen.ts` lists every committed path `gen` writes and `check generated` diffs exactly that set — `packages/{aria,ui}/src/constants/components.ts`, `packages/aria/src/namespaced/index.ts`, `apps/docs/src/generated`, `apps/docs/public/schema`, `skills`. A new generator that is not registered there is invisible to the CI gate.
- **`gen api` output is consumed at runtime by the docs site**, not just rendered as Markdown: `apps/docs/build/llms.ts` reads the same generated API JSON to emit LLM-facing docs, so an un-regenerated API surface also drifts the `/llms.txt` output.

## CHANGE-SENSITIVE SURFACES

Highest fan-in in the repo, measured with the CodeGraph index (`.codegraph/` is local and gitignored). Edits here ripple across most families — run the broad `pnpm test` + `pnpm typecheck`, not one component's specs.

- `packages/aria/src/types/common.ts` (`ClassValue`, `UiClass`, `Direction`) — ~700 dependents
- `packages/theme/src/types.ts` (`ThemeSize`, `ThemeColor`) — ~340
- `packages/aria/src/composables/use-props.ts` (`useOmitProps`) — ~260
- `packages/aria/src/date/types.ts` (`DateValue`) — ~180
- `packages/aria/src/components/{table,menu}/types.ts` — ~150 / ~140
- `packages/aria/src/types/vue.ts`, `shared/guard.ts`, `shared/vue.ts` (`keysOf`, `toContext`) — ~140 / ~130 / ~80
- `packages/aria/src/composables/{use-forward-listeners,use-forward-element,use-ui-context}.ts` — ~130 / ~120 / ~70 component contexts
- `packages/aria/src/components/{primitive/primitive.ts,button/button.vue,_icon/icon.vue}` — ~115 each

## ANTI-PATTERNS

- **DO NOT** add styles/classes to `packages/aria` components (not even `hidden`, `sr-only`)
- **DO NOT** put ARIA/state logic in `packages/ui` (UI) layer
- **DO NOT** use raw CSS/SCSS — UnoCSS utility classes only
- **DO NOT** use `as any` / `@ts-ignore` / `@ts-expect-error`
- **DO NOT** store non-reactive values in context (breaks reactivity)
- **DO NOT** modify `typed-router.d.ts` (auto-generated)
- **DO NOT** export `use{Name}Ui` from aria index (internal only; export only `provide{Name}Ui`)
- **DO NOT** omit `class` from `useOmitProps` list (causes double-binding)

## COMPONENT DEVELOPMENT

组件开发规范入口：`.agents/skills/vean-ui-develop/SKILL.md`。

Minimal flow: aria types → aria context → aria base SFCs → optional Compact SFCs/hooks → UI style recipe in `packages/ui/src/styles` → UI wrapper → barrel exports.

Component patterns:

- **Multi-slot base components** (accordion, dialog, table…): has `UiSlot` + `UiClass`, uses `scv()` results merged directly in the wrapper
- **Compact aggregations** (`AccordionCompact`, `TableCompact`): live in aria, compose base primitives, and expose `*CompactProps` / `*CompactEmits` / `*CompactSlots`
- **Single-class** (button, link…): no UiContext, uses `{name}Variants({...}, props.class)` directly
- **UI-only families** (badge, card, empty, icon, list, skeleton, spinner, tag, sheet, app-shell, palette-picker, `theme-*`): no aria counterpart — they compose aria composables directly. Confirm with the directory diff of `packages/aria/src/components/` vs `packages/ui/src/components/` before adding one.
