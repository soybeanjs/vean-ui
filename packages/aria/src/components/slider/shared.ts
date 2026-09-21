import { clamp, interpolate, snapValueToStep } from '../../shared';
import type { LocaleSliderMessages } from '../../locale/types';
import type { DataOrientation, Direction, Side } from '../../types';
import type { SliderSlideDirection } from './types';

export const DEFAULT_SLIDER_MIN = 0;

export const DEFAULT_SLIDER_MAX = 100;

export const DEFAULT_SLIDER_STEP = 1;

export const DEFAULT_SLIDER_VALUE = [DEFAULT_SLIDER_MIN];

export const PAGE_KEYS = ['PageUp', 'PageDown'];

export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export const BACK_KEYS: Record<SliderSlideDirection, string[]> = {
  'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
  'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-top': ['Home', 'PageUp', 'ArrowUp', 'ArrowLeft']
};

export function getValidSliderMin(value: number | undefined) {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  return DEFAULT_SLIDER_MIN;
}

export function getValidSliderMax(value: number | undefined, min: number) {
  if (typeof value === 'number' && !Number.isNaN(value) && value > min) {
    return value;
  }

  return Math.max(DEFAULT_SLIDER_MAX, min + DEFAULT_SLIDER_STEP);
}

export function getValidSliderStep(value: number | undefined) {
  if (typeof value === 'number' && !Number.isNaN(value) && value > 0) {
    return value;
  }

  return DEFAULT_SLIDER_STEP;
}

export function getValidMinStepsBetweenThumbs(value: number | undefined) {
  if (typeof value === 'number' && !Number.isNaN(value) && value >= 0) {
    return Math.floor(value);
  }

  return 0;
}

function resolveSliderValues(values: number[] | undefined, defaultValue?: number[]) {
  if (Array.isArray(values) && values.length > 0) {
    return values;
  }

  if (defaultValue?.length) {
    return defaultValue;
  }

  return DEFAULT_SLIDER_VALUE;
}

export function normalizeSliderValues(
  values: number[] | undefined,
  options: { min: number; max: number; step: number; defaultValue?: number[] }
) {
  const source = resolveSliderValues(values, options.defaultValue);

  return [...source].map(value => snapValueToStep(value, options.min, options.max, options.step)).sort((a, b) => a - b);
}

export function isSliderValuesEqual(a: number[] | undefined, b: number[] | undefined) {
  if (a === b) {
    return true;
  }

  if (!a || !b || a.length !== b.length) {
    return false;
  }

  return a.every((value, index) => value === b[index]);
}

export function getNextSortedValues(values: number[], nextValue: number, atIndex: number) {
  const nextValues = [...values];

  nextValues[atIndex] = nextValue;

  return nextValues.sort((a, b) => a - b);
}

export function getClosestValueIndex(values: number[], nextValue: number) {
  if (values.length <= 1) {
    return 0;
  }

  const distances = values.map(value => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);

  return distances.indexOf(closestDistance);
}

export function linearScale(input: readonly [number, number], output: readonly [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) {
      return output[0];
    }

    const ratio = (output[1] - output[0]) / (input[1] - input[0]);

    return output[0] + ratio * (value - input[0]);
  };
}

export function getStepsBetweenValues(values: number[]) {
  return values.slice(0, -1).map((value, index) => values[index + 1]! - value);
}

export function hasMinStepsBetweenValues(values: number[], minStepsBetweenValues: number) {
  if (minStepsBetweenValues <= 0) {
    return true;
  }

  const stepsBetweenValues = getStepsBetweenValues(values);

  return Math.min(...stepsBetweenValues) >= minStepsBetweenValues;
}

export function convertValueToPercentage(value: number, min: number, max: number) {
  const maxSteps = max - min;

  if (maxSteps <= 0) {
    return 0;
  }

  return clamp(((value - min) / maxSteps) * 100, 0, 100);
}

export function getThumbInBoundsOffset(size: number, percentage: number, direction: 1 | -1) {
  const halfSize = size / 2;
  const offset = linearScale([0, 50], [0, halfSize]);

  return (halfSize - offset(percentage) * direction) * direction;
}

export function getThumbLabel(
  index: number,
  totalValues: number,
  messages: Pick<LocaleSliderMessages, 'valueN' | 'minimum' | 'maximum'>
): string | undefined {
  if (totalValues > 2) {
    return interpolate(messages.valueN, { index: String(index + 1), total: String(totalValues) });
  }

  if (totalValues === 2) {
    return [messages.minimum, messages.maximum][index];
  }

  return undefined;
}

export function getSliderSideState(
  orientation: DataOrientation,
  dir: Direction,
  inverted: boolean
): {
  startEdge: Side;
  endEdge: Side;
  slideDirection: SliderSlideDirection;
} {
  if (orientation === 'vertical') {
    return inverted
      ? { startEdge: 'top', endEdge: 'bottom', slideDirection: 'from-top' }
      : { startEdge: 'bottom', endEdge: 'top', slideDirection: 'from-bottom' };
  }

  const isSlidingFromLeft = (dir === 'ltr' && !inverted) || (dir === 'rtl' && inverted);

  return isSlidingFromLeft
    ? { startEdge: 'left', endEdge: 'right', slideDirection: 'from-left' }
    : { startEdge: 'right', endEdge: 'left', slideDirection: 'from-right' };
}

export function getSliderValueFromPointer(
  event: PointerEvent,
  rect: DOMRect,
  options: { min: number; max: number; orientation: DataOrientation; startEdge: Side }
) {
  const total = options.orientation === 'horizontal' ? rect.width : rect.height;

  if (total <= 0) {
    return options.min;
  }

  const position =
    options.orientation === 'horizontal'
      ? options.startEdge === 'left'
        ? event.clientX - rect.left
        : rect.right - event.clientX
      : options.startEdge === 'bottom'
        ? rect.bottom - event.clientY
        : event.clientY - rect.top;

  const ratio = clamp(position / total, 0, 1);

  return options.min + ratio * (options.max - options.min);
}
