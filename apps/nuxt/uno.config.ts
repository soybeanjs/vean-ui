import { defineConfig, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss';
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
    presetWind3({ dark: 'class' }),
    presetSoybean(),
    presetUi({
      resetCSS: true,
      globalCSS: true
    })
  ]
});
