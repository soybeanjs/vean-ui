import { presetWind3, presetWebFonts } from 'unocss';
import type { Preflight, Preset } from 'unocss';
import type { Theme } from 'unocss/preset-mini';
import { presetAnimations } from './animations';
import { buildGlobalCss } from './global-css';
import type { UiUnocssOptions } from './options';
import resetStyle from './reset.css?raw';
import { presetScrollbar } from './scrollbar';
import uiStyles from './styles.css?raw';
import { buildThemeColors, buildThemeEntries, buildThemePreflight } from './theme';

/**
 * The Vean unocss preset.
 *
 * Returns **multiple presets** so that a single call composes the full
 * recommendation stack:
 *
 * ```ts
 * // uno.config.ts
 * import { defineConfig } from 'unocss'
 * import { presetUi } from '@vean/unocss'
 *
 * export default defineConfig({
 *   presets: [presetUi({ base: 'zinc', primary: 'indigo', resetCSS: true, globalCSS: true, uiCSS: true })],
 * })
 * ```
 *
 * The returned array is:
 *   [
 *     presetWind3({ dark, ...wind3 }),
 *     presetAnimations(animations),
 *     presetScrollbar(scrollbar),
 *     presetWebFonts({ ... }),        // only when `fonts` or `webFonts` option is provided
 *     ui-uno-theme + preflights,
 *   ]
 *
 * The `wind3` / `animations` / `scrollbar` / `webFonts` options inject the
 * config into the corresponding preset (see {@link UiUnocssOptions}).
 */
export function presetUi(options?: UiUnocssOptions): Preset<Theme>[] {
  const {
    resetCSS = false,
    globalCSS = false,
    uiCSS = false,
    fonts,
    fontProvider = 'fontsource',
    format = 'hsl',
    wind3,
    animations,
    scrollbar,
    webFonts,
    ...themeOptions
  } = options ?? {};

  const engineOptions = { ...themeOptions, format };

  // ---- ui-uno preflights --------------------------------------------
  const preflights: Preflight[] = [];

  if (resetCSS || globalCSS || uiCSS) {
    preflights.push({
      getCSS: () => {
        let css = '';

        if (resetCSS) {
          css += `${resetStyle}\n`;
        }

        if (globalCSS) {
          css += `${buildGlobalCss(format)}\n`;
        }

        if (uiCSS) {
          // The static token preflight: palette layer + the default theme's
          // alias block, both derived from the same options the runtime reads.
          css += buildThemePreflight(engineOptions);
        }

        // 不在 preset 内压缩：preflight CSS 体量小，最终产物在 Vite
        // `build.cssMinify` / uno CLI 构建时会统一压缩。
        return css;
      }
    });
  }

  if (options?.preflights?.length) {
    preflights.push(...options.preflights);
  }

  // ---- Self preset (theme layer) ----------------------------------------
  const selfPreset: Preset = {
    name: 'vean-uno',
    preflights: [...preflights, { getCSS: () => uiStyles }],
    theme: {
      animation: {
        keyframes: {
          'collapsible-down': '{from{ height: 0 } to { height: var(--vean-collapsible-content-height)}}',
          'collapsible-up': '{from{ height: var(--vean-collapsible-content-height)} to { height: 0 }}'
        },
        durations: {
          'collapsible-down': '200ms',
          'collapsible-up': '200ms'
        },
        timingFns: {
          'collapsible-down': 'ease-out',
          'collapsible-up': 'ease-out'
        }
      },
      colors: buildThemeColors(format, themeOptions.prefix),
      // The token contract owns the dimension / motion / layering keys
      // (visually neutral subset, see `buildThemeEntries`).
      ...buildThemeEntries(themeOptions.prefix)
    }
  };

  // ---- Build the presets array ------------------------------------------

  const presets: Preset[] = [
    // 1. Wind3 — required for utility classes (`wind3.dark` overrides `darkSelector`)
    presetWind3({ dark: resolveWind3Dark(options?.darkSelector), ...wind3 }),
    // 2. Animations (local implementation, replaces `unocss-preset-animations`)
    presetAnimations(animations),
    // 3. Scrollbar (local implementation, replaces `unocss-preset-scrollbar`)
    presetScrollbar(scrollbar)
  ];

  // 4. Web fonts (only when fonts are explicitly configured; `webFonts` wins over `fonts`)
  if (webFonts) {
    presets.push(presetWebFonts({ provider: fontProvider, ...webFonts }));
  } else if (fonts) {
    presets.push(
      presetWebFonts({
        provider: fontProvider,
        fonts: fonts as Record<string, string>
      })
    );
  }

  // 5. Self — shadcn theme layer
  presets.push(selfPreset);

  return presets as Preset<Theme>[];
}

/** theme darkSelector → presetWind3 dark 配置 */
export function resolveWind3Dark(darkSelector: string | undefined | null): 'class' | 'media' | { dark: string[] } {
  if (!darkSelector || darkSelector === 'class') {
    return 'class';
  }

  if (darkSelector === 'media') {
    return 'media';
  }

  // Custom dark selector — e.g. ".dark", "[data-theme=dark]"
  return { dark: [darkSelector] };
}
