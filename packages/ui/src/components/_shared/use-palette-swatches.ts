import { computed, toValue } from 'vue';
import type { Ref, MaybeRefOrGetter } from 'vue';
import { PALETTE_LEVELS, paletteColor } from '@vean/theme';
import type { PaletteLevel, PaletteKey } from '@vean/theme';
import type { SelectOptionData } from '../select/types';

/** the single swatch level rendered by the minimal form. */
const SIMPLE_LEVEL: PaletteLevel = 500;

interface PaletteSwatchesOptions {
  /** the palettes to list as options, in render order. */
  keys: readonly PaletteKey[];
  /** the currently selected palette, read from the theme context. */
  current: Ref<PaletteKey>;
  /**
   * Render a single `500` swatch instead of the shared multi-level stack. A
   * getter keeps it in step with a reactive prop.
   */
  simple: MaybeRefOrGetter<boolean>;
}

/**
 * Shared palette-swatch data for the theme palette selects
 * (`SThemePrimarySelect` / `SThemeBaseSelect`).
 *
 * Both components differ only in which palette family they list and which theme
 * token they write; the swatch rendering, option list and minimal-form
 * collapsing are identical, so they live here instead of in each SFC.
 *
 * Swatch colors come from the palette definition (`paletteColor(…, 'hsl')`), not
 * from computed CSS: a theme `overrides` entry changes the emitted tokens but
 * must not change the palette sample.
 */
export function usePaletteSwatches(options: PaletteSwatchesOptions) {
  const { keys, current, simple } = options;

  /**
   * `undefined` keeps the shared multi-level stack in `ColorDecorator`, so the
   * non-simple form matches the theme customizer's pickers exactly.
   */
  const decorateLevels = computed<PaletteLevel[] | undefined>(() => (toValue(simple) ? [SIMPLE_LEVEL] : undefined));

  /** a single swatch must not be pulled left by the stack's negative margin. */
  const overlap = computed(() => !toValue(simple));

  const swatchOf = (key: PaletteKey): Record<PaletteLevel, string> =>
    Object.fromEntries(PALETTE_LEVELS.map(level => [level, paletteColor(key, level, 'hsl') ?? ''])) as Record<
      PaletteLevel,
      string
    >;

  const currentColors = computed(() => swatchOf(current.value));

  const items = computed<SelectOptionData<PaletteKey>[]>(() =>
    keys.map(key => ({
      label: key,
      value: key
    }))
  );

  return { decorateLevels, overlap, swatchOf, currentColors, items };
}
