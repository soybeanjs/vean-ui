# CONSUMER AGENT SKILLS — @vean/skills

## AI ASSISTANT BRIDGE

**`skills/skills/` is a GENERATED DISTRIBUTION — never hand-edit it.** Edit `skills/skills-source/` and run `pnpm sui gen skills`.

**Directory:** `skills/` → publishes as `@vean/skills`. It is **not a pnpm workspace member** (`pnpm-workspace.yaml` covers only `packages/**` and `apps/**`), so it is excluded from `pnpm -r run test`, `typecheck`, and the release version bump. Its `version` is written by the release chain, not by hand.

## THE SOURCE → DISTRIBUTION SPLIT

| Path                    | Nature                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `skills/skills-source/` | **Hand-edited source.** `vean-ui/` and `vean-aria/`, each with `SKILL.md` + `REFERENCE.md` + `references/*.md`.            |
| `skills/skills/`        | **Generated output.** Adds one `components/<name>.md` per component, plus the distribution manifest and `.claude-plugin/`. |

The generator is `packages/scripts/src/commands/skills-docs.ts` (+ `skills.ts` for the distribution assembly).

## THE IMPLICIT DEPENDENCY CHAIN (this is the thing to know)

The generator assembles the component docs from **three repo sources**, so the skills output is downstream of surfaces you might not associate with it:

1. `apps/docs/src/constants/menus.ts` (`menuData`) — supplies category grouping and ordering.
2. `apps/docs/src/content/en/ui/components/*.md` — supplies the prose.
3. `apps/docs/src/generated/api/*.json` — supplies the structured props / emits / slots / slotProps summary.

Consequence: adding a component, renaming one, re-categorizing it in the sidebar, or editing its English component doc means the skills distribution goes stale. `pnpm sui gen all` covers it, and `sui check generated` treats `skills` as part of the drift set — so a docs-only change can fail the CI gate until skills are regenerated.

## CONSUMER-FACING, NOT REPO-FACING

Everything here is written for a _consumer_ of the published packages, not for someone working in this repo:

- `vean-ui` — styled usage, theming, component reference.
- `vean-aria` — aria primitives, Compact patterns, composition guidance.

Do not state repo-internal paths, workspace build commands, or generator details inside a skill's prose, and do not reference the project-local `.agents/skills/vean-ui-develop/` skill (that one is for developing this repo). The two catalogs have different audiences.

## ANTI-PATTERNS

- **NO hand edits in `skills/skills/`** — they are overwritten on the next `gen skills`, and the drift gate will flag the diff.
- **NO new `references/*.md` under `skills/skills/`** — add it under `skills-source/` so it survives regeneration.
- **NO repo-internal guidance** in a consumer skill (see above).
