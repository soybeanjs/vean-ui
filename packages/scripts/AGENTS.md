# REPO SERVICE CLI — @vean/scripts (`sui`)

## AI ASSISTANT BRIDGE

For any AI assistant editing files under `packages/scripts/`:

1. For `**/*.{ts,tsx,js,jsx}` edits, load the global `typescript-functional-style` skill.
2. Before changing a command's surface (name, argument, option), read `test/cli.spec.ts` — it asserts the declaration itself and will fail on any rename or drop.

**Package:** `packages/scripts/` → private, **never published**. Bin `sui`, run in-repo as `pnpm sui <command>`.
**NOT to be confused with `vean`** (`packages/cli/`), the published consumer CLI. Do not merge them or import across.

## COMMAND MODEL

Declared with **cac** in `src/cli.ts` — not hand-dispatched. Every action receives parsed options, so no command re-parses `process.argv`, and `--help` / `--version` / unknown-option / missing-argument handling lives in exactly one place. `src/index.ts` only parses and awaits.

`createCli()` returns the `CAC` instance so `test/cli.spec.ts` can inspect `commands.map(c => c.name)` and each command's `args` / `options` arrays. Adding a command means: add the declaration in `cli.ts`, add a `src/commands/<name>.ts`, and pin the new surface in `cli.spec.ts`.

Three groups plus workspace commands:

| Group                                               | Nature                                                                                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gen`                                               | **Deterministic, offline.** Never touches the network.                                                                                                        |
| `translate`                                         | **The only networked group** (Azure Translate, DeepL fallback); needs `AZURE_TRANSLATE_KEY` or `DEEPL_API_KEY`. Paces Azure by characters/hour, not requests. |
| `check`                                             | Verification gates; exit 1 on drift.                                                                                                                          |
| `size`                                              | Measures shipped artifacts and consumer imports; `check size` is the gate form.                                                                               |
| `stub`, `reorder-imports`, `sync-template-versions` | One-off workspace helpers.                                                                                                                                    |

## DETERMINISM IS A CONTRACT, NOT A NICETY

`check generated` regenerates every surface (`--force`) and compares **content hashes of the on-disk files before and after**, instead of diffing against a git revision. That makes the verdict independent of what happens to be committed or staged, so the same command is meaningful locally and in CI.

Two mechanisms make it work, and both must be preserved when you touch generation:

- **Stable `generatedAt`** — generators compare the produced payload against the committed file and skip the write when only `generatedAt` would differ, so a no-op regeneration produces no diff and the field keeps meaning "when the data last changed". Never hand-edit a generated timestamp.
- **Content-aware writes** — otherwise a no-op `gen` run would always touch mtimes and every gate would report drift.

**Register every new output.** `generatedDataPaths` in `src/commands/gen.ts` is the declared drift set (`packages/{aria,ui}/src/constants/components.ts`, `packages/aria/src/namespaced/index.ts`, `apps/docs/src/generated`, `apps/docs/public/schema`, `skills`). A generator that writes somewhere else is invisible to the CI gate — add the path.

## FINGERPRINT CACHE

`gen api` hashes its inputs (ui/aria/theme/scripts sources, tsconfigs, lockfile) plus the on-disk output, and skips the TypeDoc pass (**~40s → ~0.15s**) only when both match the recorded entry. The entry lives in `node_modules/.cache/sui/` and is never committed. `--force` bypasses the check — which is exactly what `check generated` passes.

Consequence: if you change what `gen api` _consumes_ without changing those hashed inputs, a stale cache entry can serve old output. Add the new input to the fingerprint rather than relying on `--force`.

## SIZE MEASUREMENT (`size` / `check size`)

`size` measures two layers, and `check size` gates on the same numbers:

- **artifact layer** — `dist/styles.css`, entry chunks, `pnpm pack` tarballs;
- **consumer layer** — a real `esbuild` bundle of `import { SButton } from '@vean/ui'`, tree-shaken and minified, in two views: `deps: bundled` (what a consumer's app pays) and `deps: external` (the library layer alone, always `gate: false`).

`size-budget.json` (hand-authored, one entry per check, calibrated with ~20 % headroom) is the only thing that can fail a run. Growth is judged separately against a baseline report: warn past `delta.warnRatio`/`warnBytes`, fail past `delta.failRatio`/`failBytes`, with the byte floor keeping small checks quiet. A baseline whose bundler version differs is reported but never gated, so a toolchain bump does not read as a regression.

Two rules to preserve:

- **Measure published output, never source.** `packages/{ui,aria,cli}` `exports` point at `./src/*.ts`, so resolution is derived from `publishConfig.exports` by `resolvePublishedSpecifier`, and the bundler plugin refuses a path under `src/`. A specifier absent from the exports map is an error, not a silent fallback to source.
- **Layering.** `shared/size.ts` is pure (parsing, resolution, verdicts, rendering) and unit tested; `shared/size-measure.ts` owns the I/O (zlib, `pnpm pack`, esbuild); `commands/size.ts` only wires them together and sets the exit code. Keep new rules in the pure module so they stay testable without a build.

CI reuses the report written by the previous main-branch run as a pull request's baseline (Actions cache keyed by the base SHA), so no second build is needed, and a missing baseline degrades to budget-only reporting. The command also appends the Markdown table to `$GITHUB_STEP_SUMMARY` whenever that variable is set, which is what makes fork pull requests work without a write token.

**Not the same thing as the ui bundle fixture.** `packages/ui/test/specs/bundle/bundle-fixture.spec.ts` bundles the same `import { SButton } from '@vean/ui'` **from source** with Vite/Rolldown and asserts the retained _module graph_ contains no heavy-engine code (table, form, date-fns, embla, markstream). This command measures **bytes** from published `dist`. A tree-shaking regression fails both; a slow size creep only shows up here, and a module-graph leak shows up there first. Do not merge them.

## SCHEMA GENERATION IS NOT HERE

`gen schema` imports the generator from `packages/cli/scripts/schema.ts` (ADR-008) so it reuses the exact same code path as `pnpm --filter @vean/cli build:schema`. Schema logic lives next to the valibot schemas it converts; do not reimplement it in this package.

## ANTI-PATTERNS

- **NO network in `gen`.** Translation lives only in `translate`.
- **NO `process.argv` parsing** in a command file — add the option to the `cli.ts` declaration.
- **NO hand-edited generated output.** The gates exist precisely because those files have one author.
- **NO unregistered output paths** (see above).
- **NO printing secrets.** `translate` reads `AZURE_TRANSLATE_KEY` / `DEEPL_API_KEY` from the env; never log them.
