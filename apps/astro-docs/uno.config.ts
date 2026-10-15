import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss';
import { presetSoybean } from '@soybeanjs/unocss-preset';
import { presetUi } from '@vean/unocss';

/**
 * Byte-identical preset stack to `apps/docs/uno.config.ts` so both sites generate
 * the same utility CSS. The only addition is Astro's content pipeline
 * (`content.pipeline.include`), because this site's markup lives in `.astro` /
 * `.md` files rather than only `.vue`.
 */
export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|astro|md|mdx|ts|tsx|html)($|\?)/]
    }
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetSoybean(),
    presetUi({
      resetCSS: true,
      globalCSS: true,
      uiCSS: true
    })
  ],
  shortcuts: {
    'docs-card': `bg-card/25! border-border/50! dark:border-border! divide-border/50! dark:divide-border! rounded-xl! shadow!`,
    'docs-subtle-card': `bg-gray-1/30! dark:bg-transparent! border border-border/50! dark:border-border! rounded-xl!`
  }
});
