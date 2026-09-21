import type { ComputedRef, CSSProperties, ShallowRef } from 'vue';
import type {
  ColorChannel,
  ColorChannelRange,
  ColorFormat,
  ColorSpace,
  ColorValue,
  NormalizedColor,
  FormFieldCommonProps,
  ToContext,
  UiClass
} from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Type information for ColorAreaAxisChannel.
 */
export type ColorAreaAxisChannel = Extract<ColorChannel, 'hue' | 'saturation' | 'lightness' | 'brightness' | 'chroma'>;

/**
 * Properties for the ColorAreaRoot component.
 */
export interface ColorAreaRootProps extends FormFieldCommonProps, Omit<PrimitiveWithBaseProps, 'onChange'> {
  /**
   * Current model value.
   */
  modelValue?: string | ColorValue;
  /**
   * Default value.
   */
  defaultValue?: string | ColorValue;
  /**
   * Color space.
   */
  colorSpace?: ColorSpace;
  /**
   * Format.
   */
  format?: ColorFormat;
  /**
   * X channel.
   */
  xChannel?: ColorAreaAxisChannel;
  /**
   * Y channel.
   */
  yChannel?: ColorAreaAxisChannel;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * X name.
   */
  xName?: string;
  /**
   * Y name.
   */
  yName?: string;
}

/**
 * Events for the ColorAreaRoot component.
 */
export type ColorAreaRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when the color value changes.
   */
  'update:color': [value: NormalizedColor];
  /**
   * Emitted when change occurs.
   */
  change: [value: string];
  /**
   * Emitted when change end occurs.
   */
  changeEnd: [value: string];
};

/**
 * Properties for the ColorAreaArea component.
 */
export interface ColorAreaAreaProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the ColorAreaThumb component.
 */
export interface ColorAreaThumbProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the ColorAreaCompact component.
 */
export interface ColorAreaCompactProps extends ColorAreaRootProps {
  /**
   * Properties forwarded to the area element.
   */
  areaProps?: ColorAreaAreaProps;
  /**
   * Properties forwarded to the thumb element.
   */
  thumbProps?: ColorAreaThumbProps;
}

/**
 * Events for the ColorAreaCompact component.
 */
export type ColorAreaCompactEmits = ColorAreaRootEmits;

/**
 * Context for the ColorAreaRoot component.
 */
export interface ColorAreaRootContext extends ToContext<
  ColorAreaRootProps,
  'colorSpace' | 'format' | 'xChannel' | 'yChannel' | 'disabled'
> {
  /**
   * Theme color of the component.
   */
  color: ComputedRef<NormalizedColor>;
  /**
   * X value used by the component context.
   */
  xValue: ShallowRef<number>;
  /**
   * Y value used by the component context.
   */
  yValue: ShallowRef<number>;
  /**
   * X range used by the component context.
   */
  xRange: ComputedRef<ColorChannelRange>;
  /**
   * Y range used by the component context.
   */
  yRange: ComputedRef<ColorChannelRange>;
  /**
   * Area style used by the component context.
   */
  areaStyle: ComputedRef<CSSProperties>;
  /**
   * Thumb element used by the component context.
   */
  thumbElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Set thumb element used by the component context.
   */
  setThumbElement: (element: HTMLElement) => void;
  /**
   * Update values used by the component context.
   */
  updateValues: (x: number, y: number) => void;
  /**
   * Commit values used by the component context.
   */
  commitValues: () => void;
}

/**
 * Available UI slots for the ColorArea component.
 */
export type ColorAreaUiSlot = 'root' | 'area' | 'thumb';

/**
 * UI class overrides for the ColorArea component.
 */
export type ColorAreaUi = UiClass<ColorAreaUiSlot>;
