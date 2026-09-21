# BROWSER E2E TESTS

This scoped AGENTS file is a routing bridge for assistants editing
`packages/ui/test/browser/**`.

Before editing files here:

1. Load the component development skill at `.agents/skills/vean-ui-develop/` — specifically [e2e.md](../../../../../.agents/skills/vean-ui-develop/e2e.md) for browser e2e design principles, core scenarios, assertion standards, and env setup.
2. For `**/*.{ts,tsx,js,jsx}` edits, also load the global `typescript-functional-style` skill.

## LOCAL CONTEXT

- Browser e2e tests are a SEPARATE tier from the happy-dom unit specs in `packages/ui/test/specs/**`. The two never overlap: browser suite glob is `test/browser/**/*.e2e.spec.ts`; unit suite glob is `test/specs/**/*.spec.ts`.
- Browser config is `packages/ui/vitest.browser.config.ts`, loaded explicitly via `--config`. Do NOT add browser config to `packages/ui/vite.config.ts` (that file is also the build config via the `pack` field and must stay untouched).
- Run the browser suite with `pnpm --filter @vean/ui test:e2e` (or a single file with `pnpm --filter @vean/ui test:e2e <file>`).
- First-time setup on a machine: `pnpm exec playwright install chromium` (browser binaries are not installed by `pnpm install`).
- Helpers: `test/browser/shared/render.ts` (`renderComponent`, opt-in `withTheme`) and `test/browser/shared/a11y.ts` (`getA11yViolations` with `color-contrast` ENABLED, unlike the happy-dom helper).
- Use `page` and `userEvent` from `vitest/browser` for locators and real interactions; use `expect.element(locator)` for retryable assertions. Prefer role-based locators (`page.getByRole`).
- Do NOT mock `ResizeObserver`, pointer capture, or `scrollIntoView` here — the whole point of browser e2e is to exercise the real implementations that the happy-dom select spec has to mock.

Use this file only as routing and local path context. Normative e2e rules live in [e2e.md](../../../../../.agents/skills/vean-ui-develop/e2e.md).
