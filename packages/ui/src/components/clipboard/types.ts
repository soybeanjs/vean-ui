import type { ClipboardEmits, ClipboardProps as _ClipboardProps, ClipboardSlotProps } from '@vean/aria/clipboard';
import type { ClassValue } from '@vean/aria/types';
import type { ClipboardShape, ClipboardVariant } from '@/styles/clipboard';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Properties for the Clipboard component.
 */
export interface ClipboardProps extends _ClipboardProps {
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
   * Visual variant of the component.
   */
  variant?: ClipboardVariant;
  /**
   * Shape of the component.
   */
  shape?: ClipboardShape;
  /**
   * Whether the component should fit its content width.
   */
  fitContent?: boolean;
}

export type { ClipboardEmits, ClipboardSlotProps, ClipboardVariant, ClipboardShape };
