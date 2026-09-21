import fs from 'node:fs';
import path from 'node:path';
import type { Preset } from 'unocss';
import type { Theme } from 'unocss/preset-mini';
import { THEME_FONT_HEADING, THEME_FONT_MONO, THEME_FONT_SANS, THEME_FONT_SERIF } from '@vean/theme';
import type { ThemeFont, ThemeOptions } from '@vean/theme';
import type { UiUnocssOptions } from './options';
import { presetUi } from './preset';

// ---------------------------------------------------------------------------
// Vean config → UnoCSS preset bridge
// ---------------------------------------------------------------------------

/**
 * Web font family lookup: vean preset key → CSS family name.
 *
 * Built from the engine's own tables (the four roles share one family catalog),
 * so a family added to the engine resolves here without a second list to keep in
 * sync — and `oxanium`, which the engine knows, no longer falls through.
 */
const WEB_FONT_NAMES: Record<string, string> = Object.fromEntries(
  [THEME_FONT_SANS, THEME_FONT_SERIF, THEME_FONT_MONO, THEME_FONT_HEADING]
    .flatMap(table => Object.entries(table) as [string, string | undefined][])
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
);

/** Options for {@link presetVean}. */
export interface VeanPresetOptions {
  /**
   * Project root directory where `vean.json` lives.
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Override any {@link UiUnocssOptions} that would otherwise be derived from
   * `vean.json`.
   */
  overrides?: UiUnocssOptions;
}

/**
 * The full set of theme configuration items that a `vean.json` `uno` block can
 * carry. It is the single source of truth the preset bridge must cover:
 *
 * - theme keys: `base`, `primary`
 * - base tokens: `size`, `radius`
 *
 * In a generated `vean.json`, `base`/`primary`/`size`/`radius` live in the
 * `uno` block; the bridge forwards them into this shape.
 */
type VeanUnoConfig = Pick<ThemeOptions, 'base' | 'primary' | 'size' | 'radius'>;

interface VeanConfig {
  style?: string;
  uno?: VeanUnoConfig;
  /**
   * The four font roles, matching `ThemeOptions.font`.
   *
   * `heading` additionally accepts `'inherit'`, meaning "follow the sans arm" —
   * the same sentinel shadcn's heading picker offers.
   */
  font?: Omit<Partial<ThemeFont>, 'heading'> & { heading?: string };
}

/**
 * UnoCSS preset that reads theme configuration from `vean.json`.
 *
 * After `vean init`, the user's `uno.config.ts` can be reduced to:
 *
 * ```ts
 * import { defineConfig } from 'unocss'
 * import { presetVean } from '@vean/unocss'
 *
 * export default defineConfig({
 *   presets: [presetVean()],
 * })
 * ```
 *
 * The preset reads `vean.json` and forwards every {@link VeanUnoConfig} item
 * to {@link presetUi}:
 *
 * - `uno.base`, `uno.primary`, `uno.radius` and `uno.size` are passed through
 *   directly;
 * - `font.*` is resolved through the web font name map.
 *
 * If `vean.json` is missing or unreadable, it falls back to the default
 * ui-uno theme (zinc / indigo / md).
 */
export function presetVean(options?: VeanPresetOptions): Preset<Theme>[] {
  const cwd = options?.cwd ?? process.cwd();
  const config = readVeanConfig(cwd);

  // ---- 1. `uno` block → theme keys + base tokens ------------------------
  // Spread the whole `uno` block so `base`/`primary`/`size`/`radius` are
  // captured together.
  const uiUnocssOptions: UiUnocssOptions = {
    ...config?.uno,
    // A `vean` project is expected to render the generated theme (base tokens
    // + light/dark color tokens), so the theme preflight is enabled by default.
    // Callers can still disable it via `overrides`.
    uiCSS: true
  };

  // ---- 2. Fonts ---------------------------------------------------------
  // `vean.json` names the roles by preset key; UnoCSS's web-fonts preset needs
  // the CSS family name, so each arm resolves through `WEB_FONT_NAMES`.
  // `heading: 'inherit'` is the "follow sans" sentinel and loads nothing extra.
  const font = config?.font;
  const fonts: NonNullable<UiUnocssOptions['fonts']> = {};

  if (font) {
    const resolved: Record<string, string | undefined> = {
      sans: font.sans,
      serif: font.serif,
      mono: font.mono,
      heading: font.heading === 'inherit' ? undefined : font.heading
    };

    for (const [role, key] of Object.entries(resolved)) {
      if (key) {
        fonts[role as keyof typeof fonts] = WEB_FONT_NAMES[key] ?? key;
      }
    }
  }

  if (Object.keys(fonts).length > 0) {
    uiUnocssOptions.fonts = fonts;
  }

  // ---- 3. Merge user overrides (take precedence) ------------------------
  if (options?.overrides) {
    Object.assign(uiUnocssOptions, options.overrides);
  }

  return presetUi(uiUnocssOptions);
}

function readVeanConfig(cwd: string): VeanConfig | null {
  const configPath = path.join(cwd, 'vean.json');
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw) as VeanConfig;
  } catch {
    return null;
  }
}
