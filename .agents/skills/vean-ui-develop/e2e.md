# Vean Browser E2E Testing Rules

This file owns the **browser e2e** testing surface: when to use it, how the environment is wired, which scenarios it must cover, and the assertion standards that separate a useful e2e test from a flaky one. The companion [surfaces.md -> Testing](surfaces.md#testing) owns the happy-dom unit spec surface; the two tiers are complementary, not substitutes.

Load this file whenever work touches `packages/ui/test/browser/**`, or when a component change would benefit from real-browser verification (see [When to add an e2e spec](#when-to-add-an-e2e-spec)).

## Two-tier testing model

Vean runs two Vitest tiers. Both stay in Vitest so tooling stays unified.

### Tier 1 — Component-level browser tests (owned by this file)

- Location: `packages/ui/test/browser/specs/components/{component}.e2e.spec.ts`
- Config: `packages/ui/vitest.browser.config.ts` (loaded via `--config`, NOT auto-discovered by name)
- Glob: `test/browser/**/*.e2e.spec.ts` (disjoint from the happy-dom glob `test/specs/**/*.spec.ts`)
- Stack: Vitest Browser Mode + `@vitest/browser-playwright` + `vitest-browser-vue` + `axe-core`
- Render: `renderComponent(component, { props, slots, withTheme })` from `test/browser/shared/render.ts`
- Locators/interactions: `page` and `userEvent` from `vitest/browser`
- Assertions: `expect.element(locator)` (retryable) plus standard `expect()`
- a11y: `getA11yViolations()` from `test/browser/shared/a11y.ts` with `color-contrast` ENABLED
- Run: `pnpm --filter @vean/ui test:e2e` (or `pnpm test:e2e` from repo root)

### Tier 2 — App-level smoke harness (documented, minimal)

- Runs against the docs app (`apps/docs`, ubean SSG) as a real built/dev server — the playground was merged into docs in v0.40.0; examples live under `apps/docs/src/examples/`. There is no separate playground app.
- Owns cross-cutting flows no single component can verify: route navigation, theme switching via `SConfigProvider`, global providers (dialog/toast/progress/icon), and page-level a11y.
- Keep this tier intentionally small. It is a smoke harness, not a feature matrix. Add a smoke test only when a behavior genuinely spans multiple components or the provider tree.
- Scope and commands for tier 2 live in [Tier 2 — app-level smoke harness](#tier-2--app-level-smoke-harness). Tier 1 is the default; do not jump to tier 2 when tier 1 suffices.

## Why browser e2e exists

The happy-dom unit spec (`packages/ui/test/specs/**/*.spec.ts`) is fast and good for rendering, emit wiring, and structural a11y. It cannot faithfully exercise:

- **Real input devices.** `userEvent.click` dispatches real pointer + click sequences; `userEvent.keyboard` produces real key events with correct `key`/`code`/`keyCode`. The unit spec's `wrapper.trigger('click')` is a synthetic Vue event, not a browser event.
- **Platform APIs the components depend on.** `ResizeObserver`, pointer capture (`setPointerCapture` / `releasePointerCapture`), `scrollIntoView`, `focus()`, `getComputedStyle`, and IntersectionObserver are real in a browser. The happy-dom select spec has to mock all of them — that mock surface is a maintenance cost and a source of false confidence.
- **Portal / overlay behavior.** `Teleport` to `document.body`, real stacking context, real focus traps, and real scroll locking only behave truthfully in a browser. The happy-dom dialog spec disables the portal (`portalProps: { disabled: true }`) to keep content inline; e2e keeps the portal real.
- **Color-contrast a11y.** axe's `color-contrast` rule needs computed styles, which happy-dom does not produce. In a real browser with `SConfigProvider` injecting theme CSS vars, color-contrast runs for real — and surfaces the most common real-world a11y issue.

## When to add an e2e spec

Add a Tier 1 e2e spec when at least one of these is true:

- The component relies on `ResizeObserver`, pointer capture, `scrollIntoView`, or focus management that the happy-dom spec has to mock. (Today: select. Tomorrow: combobox, popover, hover-card, menu, date-field.)
- The component uses `Teleport` / portals and the open/close lifecycle matters (dialog, popover, hover-card, tooltip, select, menu, command).
- Real keyboard navigation is part of the contract (select, combobox, menu, tabs, tree, stepper, pagination).
- Color-contrast or theme-dependent styling is a likely failure mode and the component renders text or interactive controls (button, badge, link, alert, input, checkbox, radio, switch).

Do NOT add an e2e spec just to "also test" what the unit spec already covers. e2e is slower; reserve it for behaviors the unit spec cannot faithfully verify.

## Environment setup

### One-time per machine

```bash
pnpm install
pnpm --filter @vean/ui exec playwright install chromium
```

`pnpm install` does NOT install browser binaries; `playwright install chromium` is a separate, explicit step. CI does this automatically (see [Automation integration](#automation-integration)).

### Config file rules

- Browser config is `packages/ui/vitest.browser.config.ts`, loaded explicitly via `--config`. It is NOT named `vitest.config.ts`, so Vitest does not auto-discover it — this is intentional, to keep it disjoint from the build/test config in `vite.config.ts`.
- Use `defineConfig` from `vitest/config` (NOT `vite-plus`). This file is not a build config and must not carry the `pack` field.
- Plugins: `vue()` + `UnoCSS()`. UnoCSS must be wired so styled UI components get real generated classes, and so `SConfigProvider` can inject theme CSS vars that resolve to real colors.
- `@` alias mirrors `vite.config.ts` (`@` -> `packages/ui/src`) so specs import components identically.
- `browser.aria: true` by default. Override on the CLI for debugging: `vitest --config vitest.browser.config.ts --browser.aria=false`.
- Default to `chromium` only. Adding `firefox` / `webkit` is allowed for a component with a known cross-browser quirk, but is not the default because it multiplies CI cost.
- Do NOT add browser config to `packages/ui/vite.config.ts`. That file is also the build config (via the `pack` field) and must stay untouched.

### Helpers

- `test/browser/shared/render.ts` -> `renderComponent(component, { props, slots, withTheme })`. Wraps `vitest-browser-vue`'s `render`. `withTheme` opts into `SConfigProvider` so theme CSS vars are present (required for color-contrast a11y).
- `test/browser/shared/a11y.ts` -> `getA11yViolations(element?, options?)`. Browser counterpart of `packages/ui/test/shared/a11y.ts`. `color-contrast` is ENABLED here (it is disabled in the happy-dom helper). No `frame-tested` / `preload` / `iframes` workarounds — those exist only to silence happy-dom abort noise.
- `test/browser/setup.ts` is intentionally near-empty. No `fetch` mock (a real browser handles Iconify CDN natively), no `ResizeObserver` / pointer-capture / `scrollIntoView` mocks (those are the whole point of running here). `vitest-browser-vue` registers its own `afterEach` cleanup.

## Core scenarios

A Tier 1 e2e spec for an interactive component should cover, as applicable:

### 1. Real pointer interaction

- Open / toggle / select via `userEvent.click`.
- For components that open on `pointerdown` (select, popover, menu), `userEvent.click` is sufficient — it dispatches the full pointer + click sequence, so the `pointerdown` handler fires.
- Assert the visible outcome via role-based locators (e.g. `page.getByRole('listbox')`, `page.getByRole('dialog')`), not via DOM structure.

### 2. Keyboard interaction

- Activate buttons with `{Enter}` and `{Space}` (Space is a single space character: `userEvent.keyboard(' ')`).
- Navigate lists / options / menus with `{ArrowDown}`, `{ArrowUp}`, `{Home}`, `{End}`.
- Confirm with `{Enter}`; dismiss overlays with `{Escape}`.
- For keyboard-selection tests, do NOT assert the exact landing option when initial highlight varies. Assert that SOME commit happened (e.g. the trigger no longer shows the placeholder). Asserting an exact option is brittle and turns a behavior test into a coincidence test.

### 3. Portal / overlay lifecycle

- Let `Teleport` run real. Do NOT pass `portalProps: { disabled: true }` in e2e (that is a happy-dom-only convenience).
- Assert the overlay appears via `page.getByRole('dialog' | 'listbox' | 'menu' | 'tooltip')` and `toBeVisible()`.
- Assert closure via either: focus restoration to the trigger (`await expect.element(trigger).toBeFocused()`), or the overlay leaving the DOM. Prefer focus-restoration — it is robust whether the overlay unmounts or hides via CSS.

### 4. Focus management

- After opening an overlay, assert focus moves into it (or to the first focusable item) if the component's contract says so.
- After closing, assert focus restores to the trigger.
- Use `await expect.element(locator).toBeFocused()`.

### 5. Accessibility (color-contrast for real)

- Render with `withTheme: true` for any a11y check that involves color (which is most of them).
- Call `getA11yViolations()` and assert `toHaveLength(0)`.
- When a component needs a label relationship to be accessible, wrap it in a template that simulates real usage (`<label for="…">` + `trigger-props` carrying `id` and `aria-label`), mirroring the happy-dom select spec's pattern.
- For icon-only or textless controls, assert `aria-label` is present and reflects intent — do not rely on axe alone, since axe cannot judge label quality.

## Assertion standards

### DO

- Use **role-based locators**: `page.getByRole('button', { name: 'Submit' })`, `page.getByRole('option', { name: 'Banana' })`, `page.getByRole('dialog')`, `page.getByRole('combobox')`. They mirror how assistive tech sees the component and stay stable across markup refactors.
- Use **`expect.element(locator)`** for DOM assertions. It is retryable and respects the action timeout, so it tolerates async render / animation delays without manual `await nextTick()` chains.
- Use **`toBeVisible()`** for "is this shown to the user" and **`toBeInTheDocument()`** for "is this in the DOM at all". They answer different questions; pick the right one.
- Use **`toBeFocused()`** for focus assertions instead of reading `document.activeElement` manually.
- Assert **observable user-facing outcomes** (trigger text changed, overlay visible, focus moved) rather than internal state.
- Pass event handlers as `onClick` / `onChange` props (Vue compiles `@click` to `onClick`) and assert with a `vi.fn()` spy when you only care that the listener fired.
- For components that declare `emits`, prefer `emitted()` on the render result: `const { emitted } = await renderComponent(X); expect(emitted('confirmed')).toEqual([['payload']])`. This IS supported — `vitest-browser-vue` 3.1.0 exposes `emitted()` and it was verified working in this repo. Two traps: `render` is **async** in v3, so destructuring `emitted` without `await` yields `undefined` (this is almost certainly the origin of the older "does not reliably expose `emitted()`" note); and `emitted()` also records bubbled native DOM events (`pointerdown`, `click`, …), so assert on a specific event name rather than the whole map.

### DON'T

- Do NOT use `wrapper.trigger('click')` — that is a `@vue/test-utils` API and does not exist in browser mode. Use `userEvent.click(...)`.
- Do NOT query by CSS class or test-id when a role locator exists. Reserve `data-testid` for cases with no semantic role (rare).
- Do NOT assert exact keyboard-landing positions when the initial highlight is not part of the contract (see Keyboard interaction).
- Do NOT disable the portal in e2e. Keep `Teleport` real.
- Do NOT mock `ResizeObserver`, pointer capture, `scrollIntoView`, or `fetch` here. If you find yourself reaching for those mocks, the test belongs in the happy-dom tier, not here.
- Do NOT share state across `it()` blocks. Each test renders and unmounts independently; call `unmount()` at the end of each `it()` even though `vitest-browser-vue` auto-cleans, to keep the DOM clean within a single test that renders multiple times.
- Do NOT write `await nextTick()` chains to wait for render. `expect.element(...)` is retryable; let it wait.

## Visual regression baselines

Visual regression is available via `expect(locator).toMatchScreenshot()`, but it is opt-in and currently unused by the committed suite. Read this before adding the first one.

- **Baselines live in `__vrt__/`, not `__screenshots__/`.** `browser.expect.toMatchScreenshot.screenshotDirectory` is set to `__vrt__` in `vitest.browser.config.ts`. The default `__screenshots__` name is gitignored repo-wide (it still catches legacy failure-artifact folders), so baselines placed there could never be committed. Keeping the two in separate folders separates committed references from disposable artifacts by path rather than by ignore-rule negation.
- **The configured value is a folder name joined relative to each test file's directory**, not to the repo root. A spec at `test/browser/specs/components/x.e2e.spec.ts` writes to `test/browser/specs/components/__vrt__/x.e2e.spec.ts/`.
- **Baseline filenames carry browser + platform** (`…-chromium-darwin.png`). A baseline generated on macOS is therefore NOT reused on Linux CI — CI generates its own and fails on the first run unless those baselines are also committed. This is the single biggest operational cost of VRT here; treat it as a deliberate trade, not a bug.
- **Refresh with `pnpm --filter @vean/ui test:e2e:update`** (`vitest run --config vitest.browser.config.ts --update`) and review the diff before committing. Deleting or renaming a test leaves a stale baseline behind; clean it up by hand.
- **Do not reach for VRT for everything.** It answers "did the pixels change", which is the right question for a design-system component's rendered geometry and the wrong question for interaction behavior. Prefer it for stable, presentational surfaces with theme-dependent styling; keep behavior in role-based assertions.
- **CLI gotcha:** `--update` swallows the following positional argument, so `vitest run --config … --update some-spec` silently runs the WHOLE suite instead of filtering. Update first, then filter, or pass the filter before `--update`.

## Recommended describe structure

Mirror the happy-dom spec's structure where it makes sense, but bias toward user-facing flows:

- `interactions` — pointer and keyboard
- `focus` — focus management for overlays
- `accessibility` — `getA11yViolations` with `withTheme: true`

Not every spec needs all three. A button needs `interactions` + `accessibility`; a select needs all three; a presentational badge needs only `accessibility`.

## Tier 2 — app-level smoke harness

Tier 2 is intentionally minimal and documented rather than heavily tooled. Add a tier 2 smoke test only when a flow spans the provider tree or multiple routes.

### Scope

- Docs route navigation (`apps/docs` routes from `src/pages/**` and renders examples from `src/examples/**`).
- `SConfigProvider` theme switching (base / primary / feedback / radius / size / dir / locale) reflected in rendered components.
- Global providers: dialog / toast / progress / icon providers.
- Page-level a11y (no axe violations on a rendered docs page).

### Suggested approach (when first introduced)

- Drive the docs dev (or built) server with Playwright directly (`@playwright/test`), NOT Vitest browser mode. Tier 2 is app-level; the Vitest browser config is component-level and not appropriate for a running app server.
- Keep the suite to a handful of smoke tests. Do not enumerate every component page.
- Place tier 2 tests under `apps/docs/e2e/` and add a `test:smoke` script on the docs package. Wire CI to run it as a separate job.

Tier 2 is out of scope for the initial e2e introduction. The Tier 1 suite currently covers 11 components (`button`, `combobox`, `dialog`, `drawer`, `menu`, `menubar`, `nav-menu`, `select`, `split-nav`, `textarea`, `tooltip`); expand Tier 1 per [When to add an e2e spec](#when-to-add-an-e2e-spec) as components are touched. Introduce Tier 2 only when an actual cross-provider flow needs verifying.

## Automation integration

### Local

```bash
pnpm test:e2e                                       # whole browser suite
pnpm --filter @vean/ui test:e2e                # same, explicit
pnpm --filter @vean/ui test:e2e:update         # refresh VRT baselines + snapshots
pnpm --filter @vean/ui test:e2e:watch          # watch mode
pnpm --filter @vean/ui test:e2e:ui             # Vitest UI
# single file:
pnpm --filter @vean/ui test:e2e \
  test/browser/specs/components/button.e2e.spec.ts
```

### CI

`.github/workflows/ci.yml` has a dedicated `e2e` job (separate from the typecheck/lint/test job) that:

1. Installs deps with `--frozen-lockfile`.
2. Runs `pnpm --filter @vean/ui exec playwright install --with-deps chromium` to install the browser binary and OS dependencies.
3. Runs `pnpm test:e2e`.

The browser-binary install is explicit because `pnpm install` does not fetch Playwright browsers. Any new job that runs browser tests must repeat this step.

## Relationship to the unit spec

| Concern             | Happy-dom unit spec (`test/specs/**`)            | Browser e2e spec (`test/browser/**`)                         |
| ------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| Render              | `mount()` from `@vue/test-utils`                 | `renderComponent()` from `vitest-browser-vue`                |
| Interaction         | `wrapper.trigger('click' \| 'pointerdown' \| …)` | `userEvent.click` / `userEvent.keyboard`                     |
| Assertion           | `wrapper.find/attributes/emitted`                | `expect.element(page.getByRole(...))`                        |
| Portal              | disabled (`portalProps: { disabled: true }`)     | real `Teleport`                                              |
| Platform APIs       | mocked (ResizeObserver, pointer capture, …)      | real                                                         |
| a11y color-contrast | disabled                                         | enabled (with `withTheme: true`)                             |
| Speed               | fast                                             | slower                                                       |
| Purpose             | rendering + emit wiring + structural a11y        | real input + overlay lifecycle + focus + color-contrast a11y |

The two tiers answer different questions. Keep both. Do not migrate unit specs into e2e; do not duplicate e2e-only assertions back into the unit spec.

## Guardrails summary

- Browser config is a separate file loaded via `--config`; never merge it into `vite.config.ts`.
- Glob is disjoint from the unit spec glob; the two suites never overlap.
- `withTheme: true` for any color-dependent a11y check.
- Role-based locators only; no CSS-class queries when a role exists.
- `expect.element(...)` for retryable DOM assertions; no manual `nextTick` wait chains.
- No `ResizeObserver` / pointer-capture / `scrollIntoView` / `fetch` mocks.
- No portal disabling in e2e.
- Call `unmount()` at the end of each `it()`.
- chromium by default; add browsers only for known cross-browser quirks.
