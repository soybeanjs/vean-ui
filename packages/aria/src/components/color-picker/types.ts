import type { ComputedRef } from 'vue';
import type {
  ColorFormat,
  ColorSpace,
  ColorValue,
  NormalizedColor,
  FormFieldCommonProps,
  ToContext,
  UiClass
} from '../../types';
import type { ButtonProps } from '../button/types';
import type { ColorAreaCompactProps } from '../color-area/types';
import type { ColorFieldCompactProps } from '../color-field/types';
import type { ColorSliderCompactProps } from '../color-slider/types';
import type { ColorSwatchPickerCompactProps } from '../color-swatch-picker/types';
import type { ColorSwatchCompactProps } from '../color-swatch/types';
import type { PopoverCompactEmits, PopoverCompactProps } from '../popover/types';
import type { SegmentCompactProps, SegmentOptionData } from '../segment/types';

/**
 * Properties for the ColorPickerRoot component.
 */
export interface ColorPickerRootProps extends FormFieldCommonProps {
  /**
   * Current model value.
   */
  modelValue?: string | ColorValue;
  /**
   * Default value.
   */
  defaultValue?: string | ColorValue;
  /**
   * Format.
   */
  format?: ColorFormat;
  /**
   * Default format.
   */
  defaultFormat?: ColorFormat;
  /**
   * Color space.
   */
  colorSpace?: ColorSpace;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
}

/**
 * Events for the ColorPickerRoot component.
 */
export type ColorPickerRootEmits = {
  /**
   * Emitted when the model value changes.
   */
  'update:modelValue': [value: string];
  /**
   * Emitted when the color value changes.
   */
  'update:color': [value: NormalizedColor];
  /**
   * Emitted when the format value changes.
   */
  'update:format': [value: ColorFormat];
  /**
   * Emitted when change occurs.
   */
  change: [value: string];
};

/**
 * Slot properties for the ColorPickerRoot component.
 */
export interface ColorPickerRootSlotProps {
  /**
   * Theme color of the component.
   */
  color: ComputedRef<ColorValue>;
  /**
   * Formatted value exposed in the slot scope.
   */
  formattedValue: ComputedRef<string>;
  /**
   * Hex value exposed in the slot scope.
   */
  hexValue: ComputedRef<string>;
  /**
   * Display format exposed in the slot scope.
   */
  displayFormat: ComputedRef<ColorFormat>;
  /**
   * Display format label exposed in the slot scope.
   */
  displayFormatLabel: ComputedRef<string>;
  /**
   * X channel exposed in the slot scope.
   */
  areaXChannel: ComputedRef<'chroma' | 'saturation'>;
  /**
   * Y channel exposed in the slot scope.
   */
  areaYChannel: ComputedRef<'brightness' | 'lightness'>;
  /**
   * Set color exposed in the slot scope.
   */
  setColor: (color: ColorValue) => void;
  /**
   * Set format exposed in the slot scope.
   */
  setFormat: (format: ColorFormat) => void;
}

/**
 * Properties for the ColorPickerTrigger component.
 */
export interface ColorPickerTriggerProps extends ButtonProps {}

/**
 * Option data for the ColorPicker format segment.
 */
export interface ColorPickerFormatOptionData extends SegmentOptionData<ColorFormat> {
  /**
   * Color format value of the option.
   */
  value: ColorFormat;
  /**
   * Label of the option.
   */
  label: string;
}

/**
 * Context for the ColorPickerRoot component.
 */
export interface ColorPickerRootContext extends ToContext<ColorPickerRootProps, 'name' | 'required' | 'disabled'> {
  color: ComputedRef<ColorValue>;
  formattedValue: ComputedRef<string>;
  hexValue: ComputedRef<string>;
  displayFormat: ComputedRef<ColorFormat>;
}

/**
 * Properties for the ColorPickerCompact component.
 */
export interface ColorPickerCompactProps extends ColorPickerRootProps, PopoverCompactProps {
  /**
   * Whether to show an alpha.
   */
  showAlpha?: boolean;
  /**
   * Whether to show a fields.
   */
  showFields?: boolean;
  /**
   * Whether to show a swatches.
   */
  showSwatches?: boolean;
  /**
   * Swatches.
   */
  swatches?: string[];
  /**
   * Properties forwarded to the swatch element.
   */
  swatchProps?: ColorSwatchCompactProps;
  /**
   * Properties forwarded to the segment element.
   */
  segmentProps?: SegmentCompactProps<ColorPickerFormatOptionData>;
  /**
   * Properties forwarded to the area element.
   */
  areaProps?: ColorAreaCompactProps;
  /**
   * Properties forwarded to the hue slider element.
   */
  hueSliderProps?: ColorSliderCompactProps;
  /**
   * Properties forwarded to the alpha slider element.
   */
  alphaSliderProps?: ColorSliderCompactProps;
  /**
   * Properties forwarded to the alpha field element.
   */
  alphaFieldProps?: ColorFieldCompactProps;
  /**
   * Properties forwarded to the field element.
   */
  fieldProps?: ColorFieldCompactProps;
  /**
   * Properties forwarded to the swatch picker element.
   */
  swatchPickerProps?: ColorSwatchPickerCompactProps;
}

/**
 * Events for the ColorPickerCompact component.
 */
export type ColorPickerCompactEmits = ColorPickerRootEmits & PopoverCompactEmits;

/**
 * Available UI slots for the ColorPicker component.
 *
 * Nested primitive slots are aliased so colliding names (`root`, `trigger`, `thumb`)
 * can live on one recipe. Aria remaps them back to each child `provide*Ui`.
 */
export type ColorPickerUiSlot =
  | 'positioner'
  | 'popup'
  | 'arrow'
  | 'close'
  | 'popoverTrigger'
  | 'content'
  | 'trigger'
  | 'triggerSwatch'
  | 'triggerValue'
  | 'areaRoot'
  | 'areaSurface'
  | 'areaThumb'
  | 'sliderSwatch'
  | 'sliderRoot'
  | 'sliderControl'
  | 'sliderTrack'
  | 'sliderThumb'
  | 'swatchRoot'
  | 'swatchChecker'
  | 'swatchFill'
  | 'swatch'
  | 'fields'
  | 'fieldRoot'
  | 'fieldInput'
  | 'alphaField'
  | 'segmentRoot'
  | 'segmentList'
  | 'segmentTrigger'
  | 'segmentIndicator'
  | 'segmentIndicatorContent'
  | 'swatchPickerRoot'
  | 'swatchPickerItem'
  | 'swatchPickerItemIndicator'
  | 'swatchPickerSwatchRoot'
  | 'swatchPickerSwatchChecker'
  | 'swatchPickerSwatchFill';

/**
 * UI class overrides for the ColorPicker component.
 */
export type ColorPickerUi = UiClass<ColorPickerUiSlot>;
