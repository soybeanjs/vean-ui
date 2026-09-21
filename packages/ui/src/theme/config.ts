import { THEME_SIZE } from '@vean/theme';
import type { ThemeSize } from './types';

/**
 * px value per size preset. The table lives in `@vean/theme` (it drives the
 * density tokens on the engine side); the UI layer maps it to its own name so
 * the two layers can never disagree on what `md` means.
 */
export const themeSizeMap: Record<ThemeSize, number> = THEME_SIZE;
export const miniSizeMap: Record<ThemeSize, ThemeSize> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
  '2xl': 'xl'
};

export const themeSizeRatio = Object.fromEntries(
  Object.entries(themeSizeMap).map(([key, value]) => [key, value / themeSizeMap.md])
) as Record<ThemeSize, number>;
