import { defineConfig } from 'unocss';
import type { Theme } from 'unocss/preset-mini';
import { presetUi } from '@vean/unocss';

export default defineConfig<Theme>({
  cli: {
    entry: [
      {
        patterns: ['src/styles/**/*.ts', 'src/components/**/*.vue'],
        outFile: 'dist/styles.css'
      }
    ]
  },
  presets: [
    presetUi({
      resetCSS: true,
      globalCSS: true,
      uiCSS: true
    })
  ]
});
