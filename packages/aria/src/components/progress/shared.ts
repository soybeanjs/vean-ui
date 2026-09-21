import { isNullish } from '../../shared';
import type { Direction } from '../../types';
import type { ProgressState } from './types';

export const DEFAULT_MAX = 100;
export const PROGRESS_CIRCLE_VIEWBOX_SIZE = 100;
export const PROGRESS_CIRCLE_CENTER = PROGRESS_CIRCLE_VIEWBOX_SIZE / 2;
export const DEFAULT_PROGRESS_CIRCLE_STROKE_WIDTH = 8;

const MIN_PROGRESS_CIRCLE_STROKE_WIDTH = 1;
const INDETERMINATE_PROGRESS_CIRCLE_RATIO = 0.35;
const INDETERMINATE_PROGRESS_CIRCLE_OFFSET_RATIO = 0.25;
const MAX_PROGRESS_CIRCLE_STROKE_WIDTH = PROGRESS_CIRCLE_VIEWBOX_SIZE / 4;

function isValidPositiveNumber(value: number | undefined): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && value > 0;
}

export function getValueLabel(value: number | null | undefined, max: number): string | undefined {
  if (typeof value !== 'number') {
    return undefined;
  }

  const safeMax = typeof max === 'number' && max > 0 ? max : DEFAULT_MAX;

  return `${Math.round((value / safeMax) * 100)}%`;
}

export function getValidMax(value: number | undefined) {
  if (isValidPositiveNumber(value)) {
    return value;
  }

  return DEFAULT_MAX;
}

export function getValidModelValue(value: number | null | undefined, maxValue: number) {
  if (isNullish(value)) {
    return value ?? null;
  }

  if (!isValidPositiveNumber(value) && value !== 0) {
    return null;
  }

  if (value < 0 || value > maxValue) {
    return null;
  }

  return value;
}

export function getValidProgressCircleStrokeWidth(value: number | undefined) {
  if (
    !isValidPositiveNumber(value) ||
    value < MIN_PROGRESS_CIRCLE_STROKE_WIDTH ||
    value > MAX_PROGRESS_CIRCLE_STROKE_WIDTH
  ) {
    return DEFAULT_PROGRESS_CIRCLE_STROKE_WIDTH;
  }

  return value;
}

export function getProgressCircleRadius(strokeWidth: number) {
  return (PROGRESS_CIRCLE_VIEWBOX_SIZE - strokeWidth) / 2;
}

export function getProgressCircleDasharray(circumference: number, progressState: ProgressState) {
  if (progressState === 'indeterminate') {
    return `${circumference * INDETERMINATE_PROGRESS_CIRCLE_RATIO} ${circumference}`;
  }

  return `${circumference} ${circumference}`;
}

export function getProgressCircleDashoffset(
  valuePercent: number | null,
  circumference: number,
  progressState: ProgressState
) {
  if (progressState === 'indeterminate') {
    return circumference * INDETERMINATE_PROGRESS_CIRCLE_OFFSET_RATIO;
  }

  if (valuePercent === null) {
    return circumference;
  }

  return circumference * (1 - valuePercent / 100);
}

export function getValuePercent(valuePercent: number | null, dir: Direction = 'ltr') {
  if (valuePercent === null) {
    return undefined;
  }

  return dir === 'rtl' ? 100 - valuePercent : -(100 - valuePercent);
}
