import type { AffixTarget } from '../affix/types';
import type { ButtonProps } from '../button/types';

/**
 * Type information for BacktopTarget.
 */
export type BacktopTarget = AffixTarget;

/**
 * State values for BacktopState.
 */
export type BacktopState = 'visible' | 'hidden';

/**
 * Properties for the Backtop component.
 */
export interface BacktopProps extends Omit<ButtonProps, 'onChange'> {
  /**
   * Scroll distance that must be reached before the Backtop button becomes visible.
   *
   * @defaultValue 400
   */
  visibilityHeight?: number;
  /**
   * Scroll target that Backtop listens to and scrolls.
   *
   * @defaultValue window
   */
  target?: BacktopTarget | null;
  /**
   * Duration of the scroll-to-top animation in milliseconds.
   *
   * @defaultValue 300
   */
  duration?: number;
}

/**
 * Events for the Backtop component.
 */
export type BacktopEmits = {
  /**
   * Emitted when change occurs.
   */
  change: [visible: boolean];
  /**
   * Emitted when click occurs.
   */
  click: [event: PointerEvent];
};
