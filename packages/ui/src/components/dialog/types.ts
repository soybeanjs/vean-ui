import type { DialogCompactProps, DialogCompactEmits, DialogCompactSlots, DialogUi } from '@vean/aria/dialog';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Dialog component.
 */
export interface DialogProps extends DialogCompactProps {
  /**
   * Whether show the fullscreen toggle button in the header of the dialog.
   *
   * @defaultValue false
   */
  showFullscreen?: boolean;
  /**
   * the popup class of the dialog
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<DialogUi>;
}

/**
 * Events for the Dialog component.
 */
export type DialogEmits = DialogCompactEmits;

/**
 * Slots for the Dialog component.
 */
export type DialogSlots = DialogCompactSlots;
