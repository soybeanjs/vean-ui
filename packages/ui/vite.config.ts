import { globSync } from 'node:fs';
import { defineConfig } from 'vite-plus';
import vue from '@vitejs/plugin-vue';
import unpluginVue from 'unplugin-vue/rolldown';
import ariaPkg from '../aria/package.json' with { type: 'json' };

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  plugins: [vue()],
  pack: {
    entry: [...globSync('src/components/**/index.ts'), 'src/index.ts', 'src/nuxt/index.ts', 'src/resolver/index.ts'],
    platform: 'browser',
    deps: {
      neverBundle: ['@nuxt/kit', '@nuxt/schema', ...Object.keys(ariaPkg.dependencies)]
    },
    dts: {
      vue: true
    },
    unbundle: true,
    plugins: [unpluginVue({ isProduction: true })],
    minify: true,
    define: {
      'import.meta.env.DEV': 'undefined',
      'import.meta.env.MODE': 'undefined'
    }
  },
  test: {
    globals: true,
    include: ['test/specs/**/*.spec.ts'],
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts']
  }
});
