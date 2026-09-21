import type { AlertUi, AlertCompactEmits, AlertCompactProps, AlertCompactSlots } from '@vean/aria/alert';
import type { ClassValue } from '@vean/aria/types';
import type { AlertVariant } from '@/styles/alert';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Extended UI class overrides for the Alert component.
 */
export type AlertExtendedUi = AlertUi;

/**
 * Properties for the Alert component.
 */
export interface AlertProps extends AlertCompactProps {
  /**
   * root class
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual variant of the component.
   */
  variant?: AlertVariant;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<AlertExtendedUi>;
}

/**
 * Events for the Alert component.
 */
export type AlertEmits = AlertCompactEmits;

/**
 * Slots for the Alert component.
 */
export type AlertSlots = AlertCompactSlots;

export type { AlertVariant };
