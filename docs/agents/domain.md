# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — this repo's glossary (canonical domain vocabulary; terms are Chinese with English aliases, and `_Avoid_` lines flag vocabulary that must not drift).
- **`docs/adr/`** — read ADRs that touch the area you're about to work in. Index and maintenance rules: `docs/README.md`, `docs/GOVERNANCE.md`.

If either is missing for your topic, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. New terms belong in `CONTEXT.md`; new decisions get an ADR in `docs/adr/`.

## File structure

Single-context repo — one shared vocabulary and one shared decision record:

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── README.md
│   └── 0001-peripheral-package-layering.md
└── packages/
```

There is no `GLOSSARY-MAP.md` and no per-package glossary: one `CONTEXT.md` serves the whole workspace.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids — its `_Avoid_` lines are the drift markers.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`, which adds terms to `CONTEXT.md`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0001 (peripheral package layering), but worth reopening because…_
