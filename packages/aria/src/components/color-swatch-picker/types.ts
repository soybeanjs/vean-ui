import type { ComputedRef } from 'vue';
import type { UiClass } from '../../types';
import type { ColorSwatchCompactProps } from '../color-swatch/types';
import type {
  ListboxItemEmits,
  ListboxItemIndicatorProps,
  ListboxItemProps,
  ListboxRootEmits,
  ListboxRootProps
} from '../listbox/types';

/**
 * Properties for the ColorSwatchPickerRoot component.
 */
export interface ColorSwatchPickerRootProps<M extends boolean = false> extends ListboxRootProps<M> {}

/**
 * Events for the ColorSwatchPickerRoot component.
 */
export type ColorSwatchPickerRootEmits<M extends boolean = false> = ListboxRootEmits<M>;

/**
 * Properties for the ColorSwatchPickerItem component.
 */
export interface ColorSwatchPickerItemProps extends ListboxItemProps {}

/**
 * Events for the ColorSwatchPickerItem component.
 */
export type ColorSwatchPickerItemEmits = ListboxItemEmits;

/**
 * Properties for the ColorSwatchPickerItemIndicator component.
 */
export interface ColorSwatchPickerItemIndicatorProps extends ListboxItemIndicatorProps {}

/**
 * Properties for the ColorSwatchPickerItemSwatch component.
 */
export interface ColorSwatchPickerItemSwatchProps extends ColorSwatchCompactProps {}

/**
 * Context for the ColorSwatchPickerItem component.
 */
export interface ColorSwatchPickerItemContext {
  /**
   * Theme color of the component.
   */
  color: ComputedRef<string>;
}

/**
 * Slot properties for the ColorSwatchPickerCompact component.
 */
export interface ColorSwatchPickerCompactSlotProps<M extends boolean = false> {
  /**
   * Current model value.
   */
  modelValue: M extends true ? string[] : string;
}

/**
 * Slot properties for color-specific ColorSwatchPickerCompact slots.
 */
export interface ColorSwatchPickerCompactColorSlotProps {
  /**
   * Current swatch color.
   */
  color: string;
}

/**
 * Properties for the ColorSwatchPickerCompact component.
 */
export interface ColorSwatchPickerCompactProps<M extends boolean = false> extends ColorSwatchPickerRootProps<M> {
  /**
   * Colors.
   */
  colors?: string[];
  /**
   * Properties forwarded to the item element.
   */
  itemProps?: Omit<ColorSwatchPickerItemProps, 'value'>;
  /**
   * Properties forwarded to the indicator element.
   */
  indicatorProps?: ColorSwatchPickerItemIndicatorProps;
  /**
   * Properties forwarded to the swatch element.
   */
  swatchProps?: ColorSwatchPickerItemSwatchProps;
}

/**
 * Events for the ColorSwatchPickerCompact component.
 */
export type ColorSwatchPickerCompactEmits<M extends boolean = false> = ColorSwatchPickerRootEmits<M> &
  ColorSwatchPickerItemEmits;

/**
 * Slots for the ColorSwatchPickerCompact component.
 */
export type ColorSwatchPickerCompactSlots<M extends boolean = false> = {
  /**
   * Custom content rendered when colors are not provided.
   */
  default?: (props: ColorSwatchPickerCompactSlotProps<M>) => any;
  /**
   * Custom content rendered inside each swatch.
   */
  swatch?: (props: ColorSwatchPickerCompactColorSlotProps) => any;
  /**
   * Custom content rendered inside each indicator.
   */
  indicator?: (props: ColorSwatchPickerCompactColorSlotProps) => any;
};

/**
 * Available UI slots for the ColorSwatchPicker component.
 */
export type ColorSwatchPickerUiSlot = 'root' | 'item' | 'itemIndicator' | 'swatchRoot' | 'swatchChecker' | 'swatchFill';

/**
 * UI class overrides for the ColorSwatchPicker component.
 */
export type ColorSwatchPickerUi = UiClass<ColorSwatchPickerUiSlot>;
