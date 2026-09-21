export function getVirtualizerPadding(parentElement?: HTMLElement | null) {
  if (!parentElement) {
    return { start: 0, end: 0 };
  }

  const { paddingBlockStart, paddingTop, paddingBlockEnd, paddingBottom } = window.getComputedStyle(parentElement);

  return {
    start: Number.parseFloat(paddingBlockStart || paddingTop),
    end: Number.parseFloat(paddingBlockEnd || paddingBottom)
  };
}
