import type { TextareaCompactEmits, TextareaCompactProps, TextareaCompactSlots, TextareaUi } from '@vean/aria/textarea';
import type { ClassValue } from '@vean/aria/types';
import type { TextareaResize } from '@/styles/textarea';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Textarea component.
 */
export interface TextareaProps extends TextareaCompactProps {
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
  ui?: Partial<TextareaUi>;
  /**
   * The resize of the textarea
   *
   * if autosize is true, the resize will be ignored
   */
  resize?: TextareaResize;
}

/**
 * Events for the Textarea component.
 */
export type TextareaEmits = TextareaCompactEmits;

/**
 * Slots for the Textarea component.
 */
export type TextareaSlots = TextareaCompactSlots;

export type { TextareaResize };
