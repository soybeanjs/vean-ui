import type { StepperCompactProps, StepperCompactEmits, StepperCompactSlots, StepperUi } from '@vean/aria/stepper';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the Stepper component.
 */
export interface StepperProps extends StepperCompactProps {
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
  ui?: Partial<StepperUi>;
}

/**
 * Events for the Stepper component.
 */
export type StepperEmits = StepperCompactEmits;

/**
 * Slots for the Stepper component.
 */
export type StepperSlots = StepperCompactSlots;
