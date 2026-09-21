import type { PaletteColorLevel, SimplePaletteKey, TailwindPaletteKey } from '@soybeanjs/colord/palette';
import type { ColorFormat, ColorValue } from '@vean/theme';
import type { ThemeSize } from '@/theme';

/**
 * The value of the top-level selector: a custom color, a tailwind palette key,
 * or a simple palette key.
 */
export type PaletteSelectValue = 'custom' | TailwindPaletteKey | SimplePaletteKey;

/**
 * The payload emitted by the `paletteChange` event, exposing the full generated
 * palette so consumers can register it as a theme preset.
 */
export interface PaletteChangePayload {
  /**
   * The current `ColorValue` (the committed model value).
   */
  value: ColorValue;
  /**
   * The full palette colors indexed by level, in the configured `format`.
   * Empty when a simple palette key is selected.
   */
  palette: Partial<Record<PaletteColorLevel, string>>;
  /**
   * Whether the custom palette is snapped to the nearest tailwind palette
   * (`generateNearestPalette`) — the recommended palette.
   */
  recommended: boolean;
}

/**
 * Properties for the PalettePicker component.
 */
export interface PalettePickerProps {
  /**
   * Visual size of the component.
   *
   * @default 'md'
   */
  size?: ThemeSize;
  /**
   * Output color space used to serialize the custom color into a `ColorValue`.
   *
   * @default 'hsl'
   */
  format?: ColorFormat;
}

/**
 * Events for the PalettePicker component.
 */
export interface PalettePickerEmits {
  /**
   * Emitted when the model value changes.
   */
  (e: 'update:modelValue', value: ColorValue): void;
  /**
   * Emitted with the full generated palette whenever the active color changes.
   */
  (e: 'paletteChange', payload: PaletteChangePayload): void;
}
