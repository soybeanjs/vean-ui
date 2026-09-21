import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss';
import type { Theme } from 'unocss/preset-mini';
import { presetSoybean } from '@soybeanjs/unocss-preset';
import { presetUi } from '@vean/unocss';

export default defineConfig<Theme>({
  content: {
    pipeline: {
      include: [/\.vue($|\?)/]
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
