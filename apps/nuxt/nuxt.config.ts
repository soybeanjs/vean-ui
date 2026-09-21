import { createThemeInitScript } from '@vean/theme/ssr';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: 'https://r2.veanui.com/imgs/logo-vean-ui.svg?v=202609141212'
        }
      ],
      // Applies the persisted theme (from localStorage) to <html> before first
      // paint — this removes the theme flash on refresh.
      script: [{ innerHTML: createThemeInitScript(), tagPosition: 'head' }]
    }
  },
  devtools: { enabled: true },
  css: ['@vean/ui/styles.css'],
  modules: ['@nuxt/icon', '@nuxtjs/i18n', '@unocss/nuxt', '@vean/ui/nuxt'],
  imports: {
    transform: {
      exclude: [/aria\/dist\//]
    }
  },
  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      { code: 'zh-CN', name: '中文', file: 'zh-CN.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ]
  },
  vite: {
    resolve: {
      tsconfigPaths: true
    },
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    }
  }
});
