import type { ClassValue } from '@vean/aria/types';
import type { WatermarkCompactProps, WatermarkUi } from '@vean/aria/watermark';

/**
 * Properties for the SWatermark component.
 */
export interface WatermarkProps extends WatermarkCompactProps {
  /**
   * The class attribute for the root element.
   */
  class?: ClassValue;
  /**
   * UI class overrides for each slot.
   */
  ui?: Partial<WatermarkUi>;
  /**
   * When true, the watermark overlay is fixed to the viewport instead of the parent container.
   *
   * @defaultValue false
   */
  fullscreen?: boolean;
}
