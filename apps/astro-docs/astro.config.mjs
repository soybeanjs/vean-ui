import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import UnoCSS from 'unocss/astro';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import UiResolver from '../../packages/ui/src/resolver';
import { docsRoutes } from './src/plugin/integration';
import { rehypeDocsCode } from './src/plugin/rehype-code.mjs';

/**
 * Static mirror of the ubean docs site (`apps/docs`), built from the *same*
 * markdown tree (`src/content` is a symlink into `apps/docs/src/content`) and the
 * same UnoCSS theme (`@vean/unocss` presetUi, shared `uno.config.ts`).
 *
 * Rendering choices that differ from the ubean build are deliberate and are the
 * point of the comparison — see `PERF-COMPARISON.md`.
 */
export default defineConfig({
  site: process.env.DOCS_SITE_URL || 'https://veanui.com',
  output: 'static',
  outDir: './dist',
  build: {
    // One HTML file per route, matching `apps/docs/dist/public` layout.
    format: 'directory'
  },
  markdown: {
    // Dual-theme pair mirrored from `apps/docs/build/highlight.ts`; `defaultColor:
    // false` emits the `--shiki-light` / `--shiki-dark` vars that the shared
    // `styles/global.css` consumes.
    shikiConfig: {
      themes: { light: 'one-light', dark: 'one-dark-pro' },
      defaultColor: false,
      wrap: false
    },
    rehypePlugins: [rehypeDocsCode]
  },
  integrations: [
    UnoCSS(),
    vue({
      // `appEntrypoint` installs the docs' i18n tables on every hydrated island
      // root (same as ubean's global plugin registration).
      appEntrypoint: './src/vue-entry.ts',
      // Only the explicitly marked islands become client components.
      template: { compilerOptions: { isCustomElement: tag => tag.startsWith('ubean-') } }
    }),
    docsRoutes()
  ],
  vite: {
    plugins: [
      // The docs' example SFCs are written for ubean's auto-import setup:
      // `useI18n()`/`ref()`/... without imports, and `<FieldItem>`/`<SButton>` as
      // bare tags. Both plugins are needed for the same examples to compile here.
      AutoImport({ imports: ['vue', 'vue-i18n'], dts: false }),
      Components({
        dirs: ['src/components'],
        extensions: ['vue'],
        resolvers: [UiResolver()],
        dts: false
      })
    ],
    resolve: {
      alias: {
        '~': new URL('./src/', import.meta.url).pathname,
        '@': new URL('../../packages/ui/src/', import.meta.url).pathname
      }
    },
    optimizeDeps: {
      exclude: ['@vean/ui', '@vean/aria']
    },
    ssr: {
      // `vue-i18n` has to be bundled (not externalized) or the SSR renderer loads
      // its ESM build straight from node_modules, where Vue's compile-time flags are
      // still bare identifiers and the module throws on install.
      noExternal: [
        '@vean/ui',
        '@vean/aria',
        '@vean/theme',
        '@iconify/vue',
        '@vueuse/core',
        '@tanstack/charts',
        'vue-i18n',
        '@intlify/core-base',
        '@intlify/message-compiler',
        '@intlify/shared'
      ]
    },
    define: {
      // `vue-i18n`'s ESM build reads Vue's compile-time feature flags directly.
      // Astro's SSR renderer has no `define` for them, so the module throws
      // `__VUE_PROD_DEVTOOLS__ is not defined` while an island renders.
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      __VUE_OPTIONS_API__: 'true',
      __VUE_I18N_LEGACY_API__: 'false',
      __VUE_I18N_FULL_INSTALL__: 'false',
      __VUE_I18N_PROD_DEVTOOLS__: 'false',
      __INTLIFY_PROD_DEVTOOLS__: 'false'
    }
  }
});
