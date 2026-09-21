import type { CSSProperties } from 'vue';
import { keysOf } from '../../shared';
import type { Side, Point, SwipeDirection } from '../../types';
import type { IconValue } from '../_icon/types';
import type { ToastPosition, ToastOrDismiss, ToastDismiss, ToastOffset, ToastIconType } from './types';

export const toasterCssVars = {
  gap: '--gap',
  offsetTop: '--offset-top',
  offsetRight: '--offset-right',
  offsetBottom: '--offset-bottom',
  offsetLeft: '--offset-left',
  mobileOffsetTop: '--mobile-offset-top',
  mobileOffsetRight: '--mobile-offset-right',
  mobileOffsetBottom: '--mobile-offset-bottom',
  mobileOffsetLeft: '--mobile-offset-left',
  frontHeight: '--front-toast-height'
} as const;

export const toastCssVars = {
  index: '--index',
  offset: '--offset',
  beforeIndex: '--toasts-before',
  zIndex: '--z-index',
  swipeAmountX: '--swipe-amount-x',
  swipeAmountY: '--swipe-amount-y',
  swipeDirection: '--swipe-direction',
  swipeOut: '--swipe-out',
  initialHeight: '--initial-height'
} as const;

export const DEFAULT_POSITION: ToastPosition = 'top-right';
export const VISIBLE_TOASTS_AMOUNT = 3;
export const VIEWPORT_OFFSET = 24;
export const TOAST_LIFETIME = 4000;
export const TOAST_WIDTH = 356;
export const GAP = 12;
export const SWIPE_THRESHOLD = 45;
export const TIME_BEFORE_UNMOUNT = 200;
export const ICONS: Record<ToastIconType, IconValue> = {
  info: 'lucide:info',
  success: 'lucide:circle-check',
  warning: 'lucide:circle-alert',
  error: 'lucide:circle-x',
  close: 'lucide:x',
  loading: 'svg-spinners:270-ring'
};

export const ALL_TOAST_POSITIONS: ToastPosition[] = [
  'top-right',
  'top-center',
  'top-left',
  'bottom-right',
  'bottom-center',
  'bottom-left'
];

const sideToDirection: Record<Side, SwipeDirection> = {
  left: 'left',
  right: 'right',
  top: 'up',
  bottom: 'down'
};

export function getDefaultSwipeDirections(position: string): SwipeDirection[] {
  const [y, x] = position.split('-');
  const directions: SwipeDirection[] = [];

  if (y) {
    directions.push(sideToDirection[y as Side]);
  }

  if (x) {
    directions.push(sideToDirection[x as Side]);
  }

  return directions;
}

export const resolveOffset = (offset: ToastOffset) => {
  const cssVars: Record<Side, `--${string}`> = {
    top: toasterCssVars.offsetTop,
    right: toasterCssVars.offsetRight,
    bottom: toasterCssVars.offsetBottom,
    left: toasterCssVars.offsetLeft
  };

  const mobileCssVars: Record<Side, `--mobile-${string}`> = {
    top: toasterCssVars.mobileOffsetTop,
    right: toasterCssVars.mobileOffsetRight,
    bottom: toasterCssVars.mobileOffsetBottom,
    left: toasterCssVars.mobileOffsetLeft
  };

  const style: CSSProperties = {};

  keysOf(cssVars).forEach(side => {
    const value = typeof offset === 'number' ? offset : offset[side];
    const val = value ?? VIEWPORT_OFFSET;
    style[cssVars[side]] = `${val}px`;
    style[mobileCssVars[side]] = `calc(${val}px * 0.67)`;
  });

  return style;
};

export const getSwipeAmount = (el?: HTMLElement | null) => {
  if (!el) return { x: 0, y: 0 };

  const swipeAmountX = el.style.getPropertyValue(toastCssVars.swipeAmountX);
  const swipeAmountY = el.style.getPropertyValue(toastCssVars.swipeAmountY);

  const x = Number(swipeAmountX.replace('px', '')) || 0;
  const y = Number(swipeAmountY.replace('px', '')) || 0;

  return { x, y };
};

export const setSwipeAmount = (el: HTMLElement | null, point: Point) => {
  if (!el) return;

  el.style.setProperty(toastCssVars.swipeAmountX, `${point.x}px`);
  el.style.setProperty(toastCssVars.swipeAmountY, `${point.y}px`);
};

export const resetSwipeAmount = (el: HTMLElement | null) => {
  if (!el) return;

  setSwipeAmount(el, { x: 0, y: 0 });
};

export const isToastDismiss = (toast: ToastOrDismiss): toast is ToastDismiss =>
  'dismiss' in toast && toast.dismiss === true;

type ModifierKey = 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey';

export const isModifierHotkey = (key: string): key is ModifierKey =>
  ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].includes(key);
