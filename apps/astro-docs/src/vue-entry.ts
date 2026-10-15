import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import zh from './locales/zh.json';

/**
 * Vue plugin entry for every hydrated island. `@astrojs/vue` calls this once per
 * island root, so the docs' own `src/locales/*.json` tables (the same files the
 * ubean site loads) are available to `useI18n()` inside example SFCs.
 *
 * The active locale is read off `<html lang>` — the static page already carries the
 * correct value, so islands do not need a separate locale prop. During SSR the
 * island markup is produced by the same renderer, and the message tree is identical
 * for both locales, so falling back to `en` while server-rendering is safe.
 *
 * Note the deliberate **static** `import { createI18n } from 'vue-i18n'`. Reaching
 * for the package through `createRequire`/`require.resolve` and loading the CJS
 * build instead made the bundler keep both copies; the ESM build is the one the
 * client bundle uses, and the flags it reads are declared in `astro.config.mjs`.
 */
export default (app: App): void => {
  const locale = typeof document === 'undefined' ? 'en' : document.documentElement.lang || 'en';

  app.use(
    createI18n({
      legacy: false,
      locale,
      fallbackLocale: 'en',
      messages: { en, zh }
    })
  );
};
