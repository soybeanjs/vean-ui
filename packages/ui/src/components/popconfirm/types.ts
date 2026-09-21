import type {
  PopconfirmCompactProps,
  PopconfirmCompactEmits,
  PopconfirmCompactSlots,
  PopconfirmUi
} from '@vean/aria/popconfirm';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Popconfirm component.
 */
export interface PopconfirmProps extends PopconfirmCompactProps {
  /**
   * class of popup
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<PopconfirmUi>;
}

/**
 * Events for the Popconfirm component.
 */
export type PopconfirmEmits = PopconfirmCompactEmits;

/**
 * Slots for the Popconfirm component.
 */
export type PopconfirmSlots = PopconfirmCompactSlots;
