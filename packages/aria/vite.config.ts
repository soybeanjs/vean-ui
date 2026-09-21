import { globSync } from 'node:fs';
import { defineConfig } from 'vite-plus';
import unpluginVue from 'unplugin-vue/rolldown';

export default defineConfig({
  pack: {
    entry: [
      ...globSync('src/components/**/index.ts'),
      ...globSync('src/*/index.ts'),
      'src/locale/langs/*.ts',
      'src/index.ts'
    ],
    platform: 'browser',
    dts: {
      vue: true
    },
    deps: {
      neverBundle: ['@nuxt/kit', '@nuxt/schema']
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
    environment: 'happy-dom',
    include: ['test/specs/**/*.spec.ts']
  }
});
