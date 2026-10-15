import type { ThemeColor, ThemeSize } from '@vean/ui';
import { transformRecordToOption } from '../shared';

export const themeSizeRatioMap: Record<ThemeSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24
};

export const themeSizeRecord: Record<ThemeSize, string> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl'
};

export const themeSizeOptions = transformRecordToOption(themeSizeRecord);

export const themeColorRecord: Record<ThemeColor, string> = {
  primary: 'primary',
  destructive: 'destructive',
  success: 'success',
  warning: 'warning',
  info: 'info',
  carbon: 'carbon',
  secondary: 'secondary',
  accent: 'accent'
};

export const themeColorOptions = transformRecordToOption(themeColorRecord);
