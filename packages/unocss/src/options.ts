import type { Preflight } from 'unocss';
import type { WebFontsOptions } from 'unocss/preset-web-fonts';
import type { PresetWind3Options } from 'unocss/preset-wind3';
import type { ThemeOptions } from '@vean/theme';
import type { PresetAnimationsOptions } from './animations';
import type { PresetScrollbarOptions } from './scrollbar';

/**
 * Options for {@link presetUi}.
 *
 * Extends the engine's `ThemeOptions` (`base`/`primary`/`surfaceStyle`/`size`/
 * `radius`/etc.) so a single options object can fully drive the generated
 * theme — the preset forwards it to `@vean/theme` untouched.
 *
 * The built-in presets of the returned stack (`presetWind3` / `presetAnimations` /
 * `presetScrollbar` / `presetWebFonts`) can be configured via the `wind3` /
 * `animations` / `scrollbar` / `webFonts` injection options.
 */
export interface UiUnocssOptions extends ThemeOptions {
  /**
   * Whether to include the reset CSS preflight (box-sizing, border-width, etc.).
   *
   * @default false
   */
  resetCSS?: boolean;
  /**
   * Whether to include the global CSS preflight (border color, background, etc.).
   *
   * @default false
   */
  globalCSS?: boolean;
  /**
   * Whether to include the UI CSS preflight (buttons, inputs, etc.).
   *
   * @default false
   */
  uiCSS?: boolean;
  /**
   * Simple font configuration forwarded to `@unocss/preset-web-fonts`.
   * Keys (sans / heading / mono / serif) map to web font names understood
   * by the configured provider (default: 'fontsource').
   *
   * Ignored when {@link UiUnocssOptions.webFonts} is provided.
   */
  fonts?: {
    sans?: string;
    heading?: string;
    mono?: string;
    serif?: string;
  };
  /**
   * Web font provider.
   *
   * Uses `@fontsource-variable/*` npm packages (self-hosted, no CDN requests).
   * Also acts as the default provider for {@link UiUnocssOptions.webFonts}.
   *
   * @default 'fontsource'
   */
  fontProvider?: 'google' | 'bunny' | 'fontshare' | 'fontsource' | 'coollabs' | 'none';
  /**
   * Options injected into `@unocss/preset-web-fonts` (full control over
   * providers, font metas, `extendTheme`, etc.).
   *
   * When provided it takes precedence over the simple config derived from
   * `fonts`; `provider` falls back to `fontProvider` if omitted.
   */
  webFonts?: Partial<WebFontsOptions>;
  /**
   * Options injected into `presetWind3` (`important`, `dark`, `content`...).
   *
   * `dark` takes precedence over `darkSelector`.
   */
  wind3?: PresetWind3Options;
  /**
   * Options injected into the local animation preset
   * (duration / delay / timingFunction...). See {@linkcode PresetAnimationsOptions}.
   */
  animations?: PresetAnimationsOptions;
  /**
   * Options injected into the local scrollbar preset
   * (default sizes / colors / `varPrefix` / `compatible`...).
   * See {@linkcode PresetScrollbarOptions}.
   */
  scrollbar?: PresetScrollbarOptions;
  /**
   * Additional preflights to include in the stack.
   */
  preflights?: Preflight[];
}
