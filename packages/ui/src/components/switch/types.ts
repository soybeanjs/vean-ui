import type { SwitchCompactEmits, SwitchCompactProps, SwitchCompactSlots, SwitchUi } from '@vean/aria/switch';
import type { AcceptableBooleanValue, ClassValue } from '@vean/aria/types';
import type { SwitchShape } from '@/styles/switch';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the Switch component.
 */
export interface SwitchProps<T extends AcceptableBooleanValue = boolean> extends SwitchCompactProps<T> {
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<SwitchUi>;
  /**
   * Theme color of the component.
   */
  color?: ThemeColor;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Shape of the component.
   */
  shape?: SwitchShape;
}

/**
 * Events for the Switch component.
 */
export type SwitchEmits<T extends AcceptableBooleanValue = boolean> = SwitchCompactEmits<T>;

/**
 * Slots for the Switch component.
 */
export type SwitchSlots<T extends AcceptableBooleanValue = boolean> = SwitchCompactSlots<T>;

export type { SwitchShape };
