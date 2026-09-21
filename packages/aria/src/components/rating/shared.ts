import { clamp, snapValueToStep } from '../../shared';
import type { DataOrientation, Direction } from '../../types';
import type { RatingItemState } from './types';

export const DEFAULT_RATING_MAX = 5;

export const DEFAULT_RATING_VALUE = 0;

export const RATING_HALF_THRESHOLD = 0.5;

export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

type RatingBackKey = 'ltr-horizontal' | 'rtl-horizontal' | 'vertical';

const RATING_BACK_KEYS: Record<RatingBackKey, string[]> = {
  'ltr-horizontal': ['Home', 'ArrowDown', 'ArrowLeft'],
  'rtl-horizontal': ['Home', 'ArrowDown', 'ArrowRight'],
  vertical: ['Home', 'ArrowDown', 'ArrowLeft']
};

function getRatingBackKey(dir: Direction, orientation: DataOrientation): RatingBackKey {
  if (orientation === 'vertical') return 'vertical';

  return dir === 'rtl' ? 'rtl-horizontal' : 'ltr-horizontal';
}

export function isRatingBackKey(key: string, dir: Direction, orientation: DataOrientation): boolean {
  return RATING_BACK_KEYS[getRatingBackKey(dir, orientation)].includes(key);
}

export function getValidRatingMax(value: number | undefined) {
  if (typeof value === 'number' && !Number.isNaN(value) && value > 0) {
    return Math.floor(value);
  }

  return DEFAULT_RATING_MAX;
}

export function clampRatingValue(value: number, max: number) {
  return clamp(value, 0, max);
}

export function snapRatingToStep(value: number, allowHalf: boolean) {
  return allowHalf ? snapValueToStep(value, 0, undefined, 0.5) : Math.round(value);
}

export function getRatingItemState(
  value: number,
  hoverValue: number | null,
  index: number,
  allowHalf: boolean
): RatingItemState {
  const active = hoverValue ?? value;
  const position = index + 1;

  if (active >= position) return 'full';
  if (allowHalf && active >= position - RATING_HALF_THRESHOLD) return 'half';

  return 'empty';
}

export function getRatingValueFromPointer(
  event: { clientX: number },
  rect: DOMRect,
  index: number,
  allowHalf: boolean,
  dir: Direction
) {
  const total = rect.width;

  if (total <= 0) return index + 1;

  const position = dir === 'rtl' ? rect.right - event.clientX : event.clientX - rect.left;
  const ratio = clamp(position / total, 0, 1);

  return allowHalf ? index + Math.round(ratio * 2) / 2 : index + 1;
}
