import type {
  InputOtpCompactEmits,
  InputOtpCompactProps,
  InputOtpCompactSlots,
  InputOtpUi
} from '@vean/aria/input-otp';
import type { ClassValue, Align } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the InputOtp component.
 */
export interface InputOtpProps extends InputOtpCompactProps {
  /** Root class. */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Align.
   */
  align?: Align;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<InputOtpUi>;
}

/**
 * Events for the InputOtp component.
 */
export type InputOtpEmits = InputOtpCompactEmits;

/**
 * Slots for the InputOtp component.
 */
export type InputOtpSlots = InputOtpCompactSlots;
