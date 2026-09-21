import type { TextareaAutosizeOptions } from './types';

export function calculateLineHeight(element: HTMLTextAreaElement): number {
  const computedStyle = window.getComputedStyle(element);
  const lineHeight = computedStyle.lineHeight;

  if (lineHeight === 'normal') {
    // if it's normal, it's typically about 1.2 times the font size
    const fontSize = Number.parseFloat(computedStyle.fontSize);
    return fontSize * 1.2;
  }

  return Number.parseFloat(lineHeight);
}

export function adjustHeight(textarea?: HTMLTextAreaElement | null, autosizeOptions?: TextareaAutosizeOptions) {
  if (!autosizeOptions || !textarea) return;

  const computedStyle = window.getComputedStyle(textarea);
  const paddingTop = Number.parseFloat(computedStyle.paddingTop);
  const paddingBottom = Number.parseFloat(computedStyle.paddingBottom);

  // Get the line height
  const lineHeight = calculateLineHeight(textarea);

  // Temporarily set height to auto to get the true scrollHeight
  textarea.style.height = 'auto';

  // Get the actual content height
  let height = textarea.scrollHeight;

  // If minRows is set
  if (autosizeOptions.minRows) {
    const minHeight = lineHeight * autosizeOptions.minRows + paddingTop + paddingBottom;
    height = Math.max(height, minHeight);
  }

  // If maxRows is set
  if (autosizeOptions.maxRows) {
    const maxHeight = lineHeight * autosizeOptions.maxRows + paddingTop + paddingBottom;
    height = Math.min(height, maxHeight);
  }

  // Set the final height
  textarea.style.height = `${height}px`;

  // Set overflow based on whether the content exceeds the maximum height
  if (autosizeOptions.maxRows && textarea.scrollHeight > height) {
    textarea.style.overflowY = 'auto';
  } else {
    textarea.style.overflowY = 'hidden';
  }
}
