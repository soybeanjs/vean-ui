import type { ComputedRef } from 'vue';
import type {
  ColorChannel,
  ColorChannelRange,
  ColorFormat,
  ColorSpace,
  ColorValue,
  NormalizedColor,
  DataOrientation,
  Direction,
  FormFieldCommonProps,
  ToContext,
  UiClass
} from '../../types';
import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the ColorSliderRoot component.
 */
export interface ColorSliderRootProps extends FormFieldCommonProps, Omit<PrimitiveWithBaseProps, 'onChange'> {
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
   * Channel.
   */
  channel: ColorChannel;
  /**
   * Format.
   */
  format?: ColorFormat;
  /**
   * Orientation of the component.
   */
  orientation?: DataOrientation;
  /**
   * Reading direction of the component.
   */
  dir?: Direction;
  /**
   * Whether inverted.
   */
  inverted?: boolean;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Step.
   */
  step?: number;
}

/**
 * Events for the ColorSliderRoot component.
 */
export type ColorSliderRootEmits = {
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
 * Properties for the ColorSliderTrack component.
 */
export interface ColorSliderTrackProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the ColorSliderThumb component.
 */
export interface ColorSliderThumbProps extends PrimitiveWithBaseProps {}

/**
 * Properties for the ColorSliderCompact component.
 */
export interface ColorSliderCompactProps extends ColorSliderRootProps {
  /**
   * Properties forwarded to the track element.
   */
  trackProps?: ColorSliderTrackProps;
  /**
   * Properties forwarded to the thumb element.
   */
  thumbProps?: ColorSliderThumbProps;
}

/**
 * Events for the ColorSliderCompact component.
 */
export type ColorSliderCompactEmits = ColorSliderRootEmits;

/**
 * Context for the ColorSliderRoot component.
 */
export interface ColorSliderRootContext extends ToContext<
  ColorSliderRootProps,
  'channel' | 'colorSpace' | 'format' | 'orientation' | 'disabled' | 'inverted'
> {
  /**
   * Theme color of the component.
   */
  color: ComputedRef<NormalizedColor>;
  /**
   * Channel value used by the component context.
   */
  channelValue: ComputedRef<number>;
  /**
   * Range used by the component context.
   */
  range: ComputedRef<ColorChannelRange>;
}

/**
 * Available UI slots for the ColorSlider component.
 */
export type ColorSliderUiSlot = 'root' | 'track' | 'thumb';

/**
 * UI class overrides for the ColorSlider component.
 */
export type ColorSliderUi = UiClass<ColorSliderUiSlot>;
