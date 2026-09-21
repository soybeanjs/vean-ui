import type { AnchorCompactEmits, AnchorCompactProps, AnchorUiSlot } from '@vean/aria/anchor';
import type { ClassValue, UiClass } from '@vean/aria/types';
import type { ThemeColor, ThemeSize } from '@/theme';

/**
 * Additional UI slots for the anchor component.
 */
export type AnchorExtraUiSlot = Exclude<AnchorUiSlot, 'root' | 'link'>;

/**
 * Extended UI class overrides for the Anchor component.
 */
export type AnchorExtendedUi = UiClass<AnchorUiSlot>;

/**
 * Properties for the Anchor component.
 */
export interface AnchorProps extends AnchorCompactProps {
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
  ui?: Partial<AnchorExtendedUi>;
  /**
   * Additional class names applied to the root element.
   */
  class?: ClassValue;
  /**
   * Whether sticky.
   */
  sticky?: boolean;
}

/**
 * Events for the Anchor component.
 */
export type AnchorEmits = AnchorCompactEmits;
