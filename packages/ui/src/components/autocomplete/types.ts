import type {
  AutocompleteCompactEmits,
  AutocompleteCompactProps,
  AutocompleteCompactSlots,
  AutocompleteSingleOptionData,
  AutocompleteUi
} from '@vean/aria/autocomplete';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Autocomplete component.
 */
export interface AutocompleteProps<
  T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData
> extends AutocompleteCompactProps<T> {
  /** Root class. */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<AutocompleteUi>;
}

/**
 * Events for the Autocomplete component.
 */
export type AutocompleteEmits<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData> =
  AutocompleteCompactEmits<T>;

/**
 * Slots for the Autocomplete component.
 */
export type AutocompleteSlots<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData> =
  AutocompleteCompactSlots<T>;
