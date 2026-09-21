import type { Side, SwipeDirection } from '../../types';

export const CLOSE_THRESHOLD = 0.25;

export const NESTED_DISPLACEMENT = 16;

export const NO_DRAG_ATTR = 'data-vean-drawer-no-drag';

export const HANDLE_ATTR = 'data-vean-handle';

/** Tuning constants shared by the drawer gesture layer. */
export const SWIPE_GESTURE = {
  /** Minimum travel (px) before a gesture commits to an axis. */
  AXIS_LOCK_THRESHOLD: 8,
  /** Travel (px) that counts as a full dismiss when no custom threshold is given. */
  DISMISS_DISTANCE: 80,
  /** Pointer velocity (px/ms) above which release dismisses regardless of distance. */
  VELOCITY_THRESHOLD: 0.35,
  /** Size of the sliding velocity sample window (ms). */
  VELOCITY_WINDOW: 80,
  /** Reverse travel (px) from the peak that marks a change of mind. */
  REVERSE_CANCEL_THRESHOLD: 10,
  /** Friction applied when a gesture drags against the permitted side. */
  RESISTANCE: 0.12
} as const;

/** Release constants for snap-point settling. */
export const SNAP_GESTURE = {
  /** Velocity (px/ms) above which the release overrides the distance decision. */
  FAST_SWIPE_VELOCITY: 0.5,
  /** Velocity (px/ms) from which the projection multiplier kicks in. */
  SNAP_VELOCITY_THRESHOLD: 0.5,
  /** Multiplier projecting release velocity onto a target offset. */
  SNAP_VELOCITY_MULTIPLIER: 300,
  /** Upper clamp for the projected velocity (px/ms). */
  MAX_SNAP_VELOCITY: 4,
  /** Minimum travel (px) for a directional release decision. */
  MIN_SWIPE_THRESHOLD: 10
} as const;

/** CSS custom properties written by the drawer gesture layer. */
export const DRAWER_CSS_VARS = {
  snapPointOffset: '--vean-drawer-snap-point-offset',
  snapPointHeight: '--vean-drawer-snap-point-height',
  swipeMovementX: '--vean-drawer-swipe-movement-x',
  swipeMovementY: '--vean-drawer-swipe-movement-y',
  swipeProgress: '--vean-drawer-swipe-progress',
  height: '--vean-drawer-height',
  maxHeight: '--vean-drawer-max-height',
  maxWidth: '--vean-drawer-max-width',
  nestedScale: '--vean-drawer-nested-scale'
} as const;

/** The swipe side that opens a drawer placed on the given side. */
export const SWIPE_TO_OPEN: Record<Side, SwipeDirection> = {
  top: 'down',
  bottom: 'up',
  left: 'right',
  right: 'left'
};

/** The swipe side that dismisses a drawer placed on the given side. */
export const SWIPE_TO_DISMISS: Record<Side, SwipeDirection> = {
  top: 'up',
  bottom: 'down',
  left: 'left',
  right: 'right'
};

export const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1] as const
};

export function isVertical(side: Side) {
  return side === 'top' || side === 'bottom';
}
