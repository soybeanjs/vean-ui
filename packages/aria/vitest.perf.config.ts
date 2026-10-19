import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

/**
 * Perf tier for `@vean/aria` — loaded explicitly via
 * `vitest --config vitest.perf.config.ts`, run by
 * `pnpm --filter @vean/aria test:perf`.
 *
 * Separate from the other two aria configs on purpose:
 *
 * - `vite.config.ts` is the build config (it carries `pack`) and owns the
 *   happy-dom unit tier. Perf assertions must not run in the default `pnpm test`
 *   pass: they are observational, they print tables, and a timing threshold in a
 *   unit-test run turns every loaded CI runner into a red build.
 * - `vitest.browser.config.ts` owns behaviour assertions. Those must stay fast
 *   and deterministic, so they do not share a run with 50-iteration loops.
 *
 * Browser mode rather than happy-dom, for one reason: the number that matters is
 * mount cost under a real layout and paint pipeline. happy-dom has no layout, so
 * a mount that reflows 500 rows looks free there and is not. Pure-function
 * benchmarks would run in either; keeping one tier means one mental model.
 *
 * `vitest bench` is not used: `tinybench` drives its loop from Node, so it cannot
 * time browser work. See `test/perf/shared/benchmark.ts`.
 */
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    include: ['test/perf/**/*.perf.spec.ts'],
    // No setup file: a perf run must not inherit mocks or per-test cleanup that
    // the behaviour tiers need, and `vitest-browser-vue` cleans up after itself.
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    }
  }
});
