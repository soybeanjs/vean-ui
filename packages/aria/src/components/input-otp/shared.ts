import type { InputOtpSlotProps } from './types';

export type InputOtpSelectionDirection = 'none' | 'forward' | 'backward' | null | undefined;

export interface InputOtpResolvedSelection {
  start: number | null;
  end: number | null;
  direction: InputOtpSelectionDirection;
}

export function resolveInputOtpPattern(pattern: string | RegExp | undefined) {
  if (!pattern) {
    return null;
  }

  return typeof pattern === 'string' ? new RegExp(pattern) : pattern;
}

export function getClampedOtpValue(value: string, maxlength: number) {
  return value.slice(0, Math.max(maxlength, 0));
}

export function isInputOtpValueValid(value: string, pattern: RegExp | null) {
  if (!value || !pattern) {
    return true;
  }

  pattern.lastIndex = 0;
  return pattern.test(value);
}

export function createInputOtpSlots(params: {
  value: string;
  maxlength: number;
  placeholder?: string;
  isFocused: boolean;
  selectionStart: number | null;
  selectionEnd: number | null;
}) {
  const { value, maxlength, placeholder, isFocused, selectionStart, selectionEnd } = params;

  return Array.from({ length: maxlength }).map<InputOtpSlotProps>((_, index) => {
    const isActive =
      isFocused &&
      selectionStart !== null &&
      selectionEnd !== null &&
      ((selectionStart === selectionEnd && index === selectionStart) ||
        (index >= selectionStart && index < selectionEnd));

    const char = value[index] ?? null;
    const placeholderChar = char ?? placeholder?.[index] ?? null;

    return {
      char,
      placeholderChar,
      isActive,
      hasFakeCaret: isActive && char === null
    };
  });
}

export function resolveInputOtpSelection(params: {
  selectionStart: number | null;
  selectionEnd: number | null;
  selectionDirection: InputOtpSelectionDirection;
  maxlength: number;
  value: string;
  previousSelection: [number | null | undefined, number | null | undefined, InputOtpSelectionDirection];
}) {
  const { selectionStart, selectionEnd, selectionDirection, maxlength, value, previousSelection } = params;

  let start = -1;
  let end = -1;
  let direction: InputOtpSelectionDirection;

  if (value.length !== 0 && selectionStart !== null && selectionEnd !== null) {
    const isSingleCaret = selectionStart === selectionEnd;
    const isInsertMode = selectionStart === value.length && value.length < maxlength;

    if (isSingleCaret && !isInsertMode) {
      const caret = selectionStart;

      if (caret === 0) {
        start = 0;
        end = 1;
        direction = 'forward';
      } else if (caret === maxlength) {
        start = caret - 1;
        end = caret;
        direction = 'backward';
      } else if (maxlength > 1 && value.length > 1) {
        let offset = 0;
        const previousEnd = previousSelection[1];

        if (previousSelection[0] !== null && previousEnd != null) {
          direction = caret < previousEnd ? 'backward' : 'forward';
          const wasPreviouslyInserting =
            previousSelection[0] === previousSelection[1] && Number(previousSelection[0]) < maxlength;

          if (direction === 'backward' && !wasPreviouslyInserting) {
            offset = -1;
          }
        }

        start = offset + caret;
        end = offset + caret + 1;
      }
    }
  }

  return {
    start: start !== -1 ? start : selectionStart,
    end: end !== -1 ? end : selectionEnd,
    direction: direction ?? selectionDirection
  } satisfies InputOtpResolvedSelection;
}

export function syncTimeouts(callback: () => void) {
  if (typeof window === 'undefined') {
    return [];
  }

  return [0, 10, 50].map(delay => window.setTimeout(callback, delay));
}
