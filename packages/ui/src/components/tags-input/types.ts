import type {
  TagsInputCompactProps,
  TagsInputCompactEmits,
  TagsInputCompactSlots,
  TagsInputUi
} from '@vean/aria/tags-input';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the TagsInput component.
 */
export interface TagsInputProps extends TagsInputCompactProps {
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
  ui?: Partial<TagsInputUi>;
}

/**
 * Events for the TagsInput component.
 */
export type TagsInputEmits = TagsInputCompactEmits;

/**
 * Slots for the TagsInput component.
 */
export type TagsInputSlots = TagsInputCompactSlots;
