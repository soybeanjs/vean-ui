import type { Align, FocusIntent, NavigationKey, Side } from '../types';

export const MAP_KEY_TO_FOCUS_INTENT: Record<NavigationKey, FocusIntent> = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last'
};

export const SIDE_OPTIONS: Side[] = ['top', 'right', 'bottom', 'left'];
export const ALIGN_OPTIONS: Align[] = ['start', 'center', 'end'];

export const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right'
};

export const SELECTION_KEYS = ['Enter', ' '];
