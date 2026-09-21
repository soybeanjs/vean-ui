import type { PrimitiveWithBaseProps } from '../primitive/types';

/**
 * Properties for the AspectRatio component.
 */
export interface AspectRatioProps extends PrimitiveWithBaseProps {
  /**
   * The desired ratio. Eg: 16/9
   *
   * @defaultValue 1
   */
  ratio?: number;
}
