import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Type information for VisuallyHiddenFeature.
 */
export type VisuallyHiddenFeature = 'focusable' | 'fully-hidden';

/**
 * Properties for the VisuallyHidden component.
 */
export interface VisuallyHiddenProps extends PrimitiveWithBaseProps {
  /**
   * Feature.
   */
  feature?: VisuallyHiddenFeature;
}

/**
 * Properties for the VisuallyHiddenInput component.
 */
export interface VisuallyHiddenInputProps {
  /**
   * Name.
   */
  name: string;
  /**
   * Value associated with the current item.
   */
  value: any;
  /**
   * Whether the item is checked.
   */
  checked?: boolean;
  /**
   * Whether the value is required.
   */
  required?: boolean;
  /**
   * Whether the component is disabled.
   */
  disabled?: boolean;
  /**
   * Feature.
   */
  feature?: VisuallyHiddenFeature;
}
