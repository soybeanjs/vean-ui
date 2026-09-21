import { DEFAULT_OPTIONS, emitThemeCss, resolveThemeMap } from '@vean/theme';
import type { EmitThemeOptions, ThemeOptions } from '@vean/theme';

/**
 * Bridge from the runtime theme state to the token engine.
 *
 * The runtime theme context produces engine `ThemeOptions` directly, so the
 * bridge only centralizes *how* the alias block is emitted: the options travel
 * to `resolveThemeMap` untouched and the emit options follow the options, so
 * the runtime block, the preset preflight and the first-paint snapshot all use
 * the same prefix / selector / format decisions.
 */
export function buildThemeCss(options: ThemeOptions, emit?: EmitThemeOptions): string {
  return emitThemeCss(resolveThemeMap(options), {
    prefix: options.prefix ?? DEFAULT_OPTIONS.prefix,
    styleTarget: options.styleTarget,
    darkSelector: options.darkSelector,
    format: options.format,
    ...emit
  });
}
