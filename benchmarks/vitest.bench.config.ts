import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

/**
 * Cross-library benchmark config.
 *
 * Three framework plugins in one project, because the point is to time the same
 * two component shapes across four libraries in one process on one machine. Four
 * separate runs would put four different amounts of background load behind the
 * numbers and make the comparison meaningless.
 *
 * `svelte()` runs with HMR off in `svelte.config.js` beside this file: the HMR
 * transform injects runtime wrappers into component constructors, which is
 * exactly the kind of overhead that would land in a mount measurement.
 */
export default defineConfig({
  plugins: [vue(), react(), svelte()],
  test: {
    globals: true,
    include: ['bench/*.bench.ts'],
    // The whole output *is* `console.log` from `afterAll`. Vitest 5 in browser
    // mode swallows console output unless this is explicit, and the run then
    // looks like it produced nothing.
    silent: false,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    }
  }
});
