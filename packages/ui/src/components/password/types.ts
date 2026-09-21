import type { PasswordCompactEmits, PasswordCompactProps, PasswordCompactSlots, PasswordUi } from '@vean/aria/password';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Password component.
 */
export interface PasswordProps extends PasswordCompactProps {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<PasswordUi>;
}

/**
 * Events for the Password component.
 */
export type PasswordEmits = PasswordCompactEmits;

/**
 * Slots for the Password component.
 */
export type PasswordSlots = PasswordCompactSlots;
