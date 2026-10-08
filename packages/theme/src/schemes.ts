import type { FeedbackSchemeKey, PaletteKey, PaletteLevel, PaletteLevelRef, StatusName } from './types';

/**
 * Scheme data (docs/design/theme.md §3.6).
 *
 * A scheme is plain data: `palette.level` references for the light and dark
 * mode. Keeping schemes as data (not code) is what lets the status dimension
 * stay swappable without touching the engine.
 *
 * Charts are deliberately **not** a scheme: a chart series is a monochrome ramp
 * of the primary palette at fixed levels (`CHART_RAMP`, §4.7), so a chart
 * palette would be a second brand knob that could disagree with the first.
 */

/**
 * a status scheme: the solid color of each status, per mode.
 *
 * Values are `palette.level` references (not bare strings), so a typo in a scheme
 * is a type error and `engine-features.spec.ts` can assert every value resolves
 * against colord's palette table.
 */
export interface FeedbackScheme {
  light: Record<StatusName, PaletteLevelRef>;
  dark: Record<StatusName, PaletteLevelRef>;
}

/** the built-in status schemes. */
export const FEEDBACK_SCHEMES = {
  classic: {
    light: { destructive: 'red.500', success: 'green.500', warning: 'amber.500', info: 'blue.500' },
    dark: { destructive: 'red.400', success: 'green.400', warning: 'amber.400', info: 'blue.400' }
  },
  vivid: {
    light: {
      destructive: 'red.500',
      success: 'emerald.500',
      warning: 'amber.500',
      info: 'sky.500'
    },
    dark: { destructive: 'red.400', success: 'emerald.400', warning: 'amber.400', info: 'sky.400' }
  },
  subtle: {
    light: {
      destructive: 'rose.500',
      success: 'emerald.500',
      warning: 'amber.500',
      info: 'indigo.500'
    },
    dark: {
      destructive: 'rose.300',
      success: 'emerald.300',
      warning: 'amber.300',
      info: 'indigo.300'
    }
  },
  modern: {
    light: {
      destructive: 'red.500',
      success: 'emerald.500',
      warning: 'orange.500',
      info: 'sky.500'
    },
    dark: {
      destructive: 'red.400',
      success: 'emerald.400',
      warning: 'orange.400',
      info: 'sky.400'
    }
  },
  professional: {
    light: { destructive: 'red.500', success: 'green.600', warning: 'amber.600', info: 'blue.600' },
    dark: { destructive: 'red.300', success: 'green.300', warning: 'amber.300', info: 'blue.300' }
  }
} as const satisfies Record<string, FeedbackScheme>;

/** resolve a feedback scheme, falling back to the default. */
export function feedbackScheme(key: FeedbackSchemeKey | undefined): FeedbackScheme {
  return (FEEDBACK_SCHEMES as Record<string, FeedbackScheme>)[key ?? 'classic'] ?? FEEDBACK_SCHEMES.classic;
}

/** split a `palette.level` reference. */
export function splitLevelRef(ref: string): { palette: PaletteKey; level: PaletteLevel } {
  const [palette, level] = ref.split('.');

  return { palette: palette as PaletteKey, level: Number(level) as PaletteLevel };
}
