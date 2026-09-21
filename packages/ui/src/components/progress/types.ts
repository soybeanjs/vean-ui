import type {
  ProgressCompactProps,
  ProgressCompactEmits,
  ProgressCompactSlots,
  ProgressCircleCompactProps,
  ProgressCircleCompactEmits,
  ProgressCircleCompactSlots,
  ProgressUi
} from '@vean/aria/progress';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the Progress component.
 */
export interface ProgressProps extends ProgressCompactProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<ProgressUi>;
}

/**
 * Events for the Progress component.
 */
export type ProgressEmits = ProgressCompactEmits;

/**
 * Slots for the Progress component.
 */
export type ProgressSlots = ProgressCompactSlots;

/**
 * Properties for the ProgressCircle component.
 */
export interface ProgressCircleProps extends ProgressCircleCompactProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<ProgressUi>;
}

/**
 * Events for the ProgressCircle component.
 */
export type ProgressCircleEmits = ProgressCircleCompactEmits;

/**
 * Slots for the ProgressCircle component.
 */
export type ProgressCircleSlots = ProgressCircleCompactSlots;
