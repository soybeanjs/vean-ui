import type { BaseProps, DataOrientation, UiClass } from '../../types';

/**
 * Properties for the SeparatorLabel component.
 */
export interface SeparatorLabelProps extends BaseProps {}

/**
 * Properties for the SeparatorRoot component.
 */
export interface SeparatorRootProps extends BaseProps {
  /**
   * Orientation of the component.
   *
   * Either `vertical` or `horizontal`. Defaults to `horizontal`.
   */
  orientation?: DataOrientation;
  /**
   * Whether or not the component is purely decorative. <br>When `true`, accessibility-related attributes are updated so
   * that that the rendered element is removed from the accessibility tree.
   */
  decorative?: boolean;
}

/**
 * Properties for the SeparatorCompact component.
 */
export interface SeparatorCompactProps extends SeparatorRootProps {
  /**
   * Label text rendered by the component.
   */
  label?: string;
  /**
   * Properties forwarded to the label element.
   */
  labelProps?: SeparatorLabelProps;
}

/**
 * Slots for the SeparatorCompact component.
 */
export type SeparatorCompactSlots = {
  /**
   * Custom content for the label slot.
   */
  label?: () => any;
};

/**
 * Available UI slots for the Separator component.
 */
export type SeparatorUiSlot = 'root' | 'label';

/**
 * UI class overrides for the Separator component.
 */
export type SeparatorUi = UiClass<SeparatorUiSlot>;
