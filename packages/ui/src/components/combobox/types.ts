import type { ComboboxCompactEmits, ComboboxCompactProps, ComboboxCompactSlots, ComboboxUi } from '@vean/aria/combobox';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Combobox component.
 */
export interface ComboboxProps<M extends boolean = false> extends ComboboxCompactProps<M> {
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
  ui?: Partial<ComboboxUi>;
}

/**
 * Events for the Combobox component.
 */
export type ComboboxEmits<M extends boolean = false> = ComboboxCompactEmits<M>;

/**
 * Slots for the Combobox component.
 */
export type ComboboxSlots<M extends boolean = false> = ComboboxCompactSlots<M>;
