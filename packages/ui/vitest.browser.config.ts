import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vitest/config';

/**
 * Browser e2e config — loaded explicitly via `vitest --config vitest.browser.config.ts`.
 *
 * This file is intentionally NOT named `vitest.config.ts` so Vitest does not
 * auto-discover it; it stays disjoint from the build + unit-test config in
 * `vite.config.ts`. Uses `defineConfig` from `vitest/config` (not `vite-plus`)
 * because this is a test-only config and must not carry the `pack` field.
 *
 * Run with `pnpm test:e2e` (or `pnpm --filter @vean/ui test:e2e`).
 */
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    include: ['test/browser/**/*.e2e.spec.ts'],
    setupFiles: ['./test/browser/setup.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      expect: {
        toMatchScreenshot: {
          /**
           * Visual-regression baselines are committed, so they must NOT live in the
           * default `__screenshots__/` folder: the root `.gitignore` ignores that
           * name wholesale, and it still catches legacy failure-artifact folders
           * from older Vitest versions. Keeping baselines in `__vrt__/` separates
           * the two concerns by path instead of by ignore-rule negation.
           *
           * This value is a folder name joined relative to each test file's
           * directory (not to the repo root), so a spec at
           * `test/browser/specs/components/x.e2e.spec.ts` stores its baselines in
           * `test/browser/specs/components/__vrt__/x.e2e.spec.ts/`.
           *
           * Baselines are suffixed with browser + platform (`-chromium-darwin`),
           * so a baseline generated on macOS is not reused on Linux CI. Generate
           * or refresh them with `pnpm test:e2e:update`.
           */
          screenshotDirectory: '__vrt__'
        }
      }
    }
  }
});
