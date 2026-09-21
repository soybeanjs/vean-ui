import type { AnyColor, HslColor, HsvColor, OklchColor, RgbColor } from '@soybeanjs/colord';

export type ColorValue = AnyColor;

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

export type ColorSpace = 'hsl' | 'hsv' | 'oklch';

export type ColorObjectSpace = 'rgb' | ColorSpace;

export type ColorChannel =
  | 'hue'
  | 'saturation'
  | 'lightness'
  | 'brightness'
  | 'red'
  | 'green'
  | 'blue'
  | 'alpha'
  | 'chroma';

export interface ColorChannelRange {
  min: number;
  max: number;
  step: number;
}

export type NormalizedColor = RgbColor | HslColor | HsvColor | OklchColor;
