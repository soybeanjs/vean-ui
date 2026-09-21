import type { ColorFormat } from '../../types';
import type { ColorPickerFormatOptionData } from './types';

const COLOR_PICKER_FORMATS: readonly ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch'];

export const colorFormats: ColorPickerFormatOptionData[] = COLOR_PICKER_FORMATS.map(format => ({
  value: format,
  label: format.toUpperCase()
}));
