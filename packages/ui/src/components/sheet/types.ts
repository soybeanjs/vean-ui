import type { Side } from '@vean/aria/types';
import type { DialogEmits, DialogProps, DialogSlots } from '../dialog/types';

/**
 * Properties for the Sheet component.
 */
export interface SheetProps extends DialogProps {
  /**
   * Side placement of the component.
   */
  side?: Side;
}

/**
 * Events for the Sheet component.
 */
export type SheetEmits = DialogEmits;

/**
 * Slots for the Sheet component.
 */
export type SheetSlots = DialogSlots;
