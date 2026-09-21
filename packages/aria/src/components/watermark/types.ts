import type { ComputedRef, ShallowRef } from 'vue';
import type { BaseProps, UiClass } from '../../types';

/**
 * Properties for the WatermarkRoot component.
 */
export interface WatermarkRootProps extends BaseProps {
  /**
   * The text content of the watermark.
   */
  content?: string;
  /**
   * The image URL of the watermark.
   * When both content and image are provided, image takes priority.
   */
  image?: string;
  /**
   * The font size of the watermark text in pixels.
   *
   * @defaultValue 16
   */
  fontSize?: number;
  /**
   * The font family of the watermark text.
   *
   * @defaultValue 'sans-serif'
   */
  fontFamily?: string;
  /**
   * The font color of the watermark text.
   *
   * @defaultValue 'rgba(0, 0, 0, 0.15)'
   */
  fontColor?: string;
  /**
   * The font weight of the watermark text.
   *
   * @defaultValue 'normal'
   */
  fontWeight?: number | string;
  /**
   * The rotation angle of the watermark in degrees.
   *
   * @defaultValue -22
   */
  rotate?: number;
  /**
   * The gap between watermark tiles in pixels, as [x, y].
   *
   * @defaultValue [100, 100]
   */
  gap?: [number, number];
  /**
   * The offset of the watermark within each tile in pixels, as [x, y].
   *
   * @defaultValue [0, 0]
   */
  offset?: [number, number];
  /**
   * The width of a single watermark tile in pixels.
   * When not provided, it is calculated automatically based on text dimensions and gap.
   */
  width?: number;
  /**
   * The height of a single watermark tile in pixels.
   * When not provided, it is calculated automatically based on text dimensions and gap.
   */
  height?: number;
  /**
   * When true, renders a diagonal cross pattern with two overlapping watermarks.
   *
   * @defaultValue false
   */
  cross?: boolean;
  /**
   * When true, observes and restores the watermark overlay if it is tampered with or removed.
   *
   * @defaultValue false
   */
  defense?: boolean;
}

/**
 * Properties for the WatermarkOverlay component.
 */
export interface WatermarkOverlayProps extends BaseProps {}

/**
 * Properties for the WatermarkCompact component.
 */
export interface WatermarkCompactProps extends WatermarkRootProps {
  /**
   * Properties forwarded to the overlay element.
   */
  overlayProps?: WatermarkOverlayProps;
}

/**
 * Context for the WatermarkRoot component.
 */
export interface WatermarkRootContext {
  /**
   * The generated background-image data URL for the watermark pattern.
   */
  overlayStyle: ShallowRef<Record<string, string> | undefined>;
  /**
   * Whether overlay defense is enabled.
   */
  defense: ComputedRef<boolean>;
}

/**
 * Internal context shared by the WatermarkCompact composition.
 */
export interface WatermarkCompactContext {
  /**
   * A render key used to recreate the overlay from the parent composition.
   */
  overlayRenderKey: ShallowRef<number>;
  /**
   * Recreates the overlay when it is removed from the DOM or tampered with.
   */
  repairOverlay: () => void;
}

/**
 * Available UI slots for the Watermark component.
 */
export type WatermarkUiSlot = 'root' | 'overlay';

/**
 * UI class overrides for the Watermark component.
 */
export type WatermarkUi = UiClass<WatermarkUiSlot>;
