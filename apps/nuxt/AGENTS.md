# NUXT INTEGRATION FIXTURE — @vean/nuxt

## AI ASSISTANT BRIDGE

This app is deliberately tiny. Only edit it to prove or reproduce a Nuxt integration behavior.

**App:** `apps/nuxt/` → private workspace `@vean/nuxt`. Not published, **not a shippable product**.
**Role:** a minimal fixture that proves three integration paths work end to end. Nothing more should be added here — a real demo belongs in `apps/docs`.

## WHAT IT PROVES

1. **`@vean/ui/nuxt` auto-registration** — S-prefixed components (`SButton`, `SCard`, `SConfigProvider`) resolve with no explicit import in templates.
2. **UnoCSS wiring** — `modules: ['@unocss/nuxt']` plus `css: ['@vean/ui/styles.css']` (the _built_ stylesheet from the UI package).
3. **Theme + i18n context** — first paint uses `createThemeInitScript()` from `@vean/theme/ssr` inlined as a head script (see `nuxt.config.ts`), which removes the theme flash on refresh.

## LOCAL GOTCHAS

- **`imports.transform.exclude: [/aria\/dist\//]`** in `nuxt.config.ts` is intentional: auto-import scanning must not walk into the aria _dist_ output. Removing it re-introduces build noise/failures.
- **The fixture does not own theme state.** `app/theme.ts` keeps only the non-theme context (`dir` / `locale`) and forwards `configProviderProps`; persistence and the theme envelope belong to the library's `SConfigProvider` via `persistTheme: true`. Do not add a second theme store here — that is the exact conflict the docs app avoided by disabling `colorMode`.
- **`theme.ts` imports `useContext` from `@vean/aria/composables`** and types from `@vean/ui` — the intended consumer-side import shape. Keep it that way so the fixture also validates the public sub-path exports.
- **No `test` script and no `version` field.** This workspace is intentionally outside `pnpm -r run test` and the release version bump. Do not "fix" that.
