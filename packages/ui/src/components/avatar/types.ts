import type { AvatarCompactProps, AvatarImageEmits, AvatarUi } from '@vean/aria/avatar';
import type { ClassValue } from '@vean/aria/types';
import type { ThemeSize } from '@/theme';

/**
 * Properties for the Avatar component.
 */
export interface AvatarProps extends AvatarCompactProps {
  /**
   * root class
   */
  class?: ClassValue;
  /**
   * Visual size of the component.
   */
  size?: ThemeSize;
  /**
   * Per-slot class overrides for the component.
   */
  ui?: Partial<AvatarUi>;
}

/**
 * Events for the Avatar component.
 */
export type AvatarEmits = AvatarImageEmits;
