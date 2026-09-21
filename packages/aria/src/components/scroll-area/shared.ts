import type { Direction } from '../../types';
import type { ScrollAreaOrientation } from './types';

const MIN_THUMB_SIZE = 18;
/**
 * Browser RTL `scrollLeft` behavior:
 * - `default`: leftmost = 0, rightmost = max
 * - `negative`: leftmost = 0, rightmost = -max
 * - `reverse`: leftmost = max, rightmost = 0
 */
type RtlScrollType = 'default' | 'negative' | 'reverse';
const rtlScrollTypeCache = new WeakMap<Document, RtlScrollType>();

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getAxisValue(orientation: ScrollAreaOrientation, sizes: { horizontal: number; vertical: number }) {
  return orientation === 'horizontal' ? sizes.horizontal : sizes.vertical;
}

export function getThumbSize(viewportSize: number, contentSize: number, trackSize: number) {
  if (viewportSize <= 0 || contentSize <= 0 || trackSize <= 0) {
    return 0;
  }

  return clamp((viewportSize / contentSize) * trackSize, MIN_THUMB_SIZE, trackSize);
}

export function getThumbOffset(
  scrollPosition: number,
  maxScrollPosition: number,
  maxThumbOffset: number,
  orientation: ScrollAreaOrientation,
  dir: Direction
) {
  if (maxScrollPosition <= 0 || maxThumbOffset <= 0) {
    return 0;
  }

  const ratio = clamp(scrollPosition / maxScrollPosition, 0, 1);

  if (orientation === 'horizontal' && dir === 'rtl') {
    return maxThumbOffset - ratio * maxThumbOffset;
  }

  return ratio * maxThumbOffset;
}

/**
 * Detect the RTL `scrollLeft` mode once per document by probing a temporary
 * scroll container and caching the result for subsequent reads/writes.
 */
function detectRtlScrollType(doc: Document) {
  const cachedRtlScrollType = rtlScrollTypeCache.get(doc);

  if (cachedRtlScrollType) {
    return cachedRtlScrollType;
  }

  const dummy = doc.createElement('div');
  const child = doc.createElement('div');

  dummy.dir = 'rtl';
  dummy.style.width = '4px';
  dummy.style.height = '1px';
  dummy.style.position = 'absolute';
  dummy.style.top = '-1000px';
  dummy.style.overflow = 'scroll';
  child.style.width = '8px';
  child.style.height = '1px';

  dummy.appendChild(child);
  doc.body.appendChild(dummy);

  const rtlScrollType: RtlScrollType =
    dummy.scrollLeft > 0
      ? 'default'
      : (() => {
          dummy.scrollLeft = 1;
          return dummy.scrollLeft === 0 ? 'negative' : 'reverse';
        })();

  doc.body.removeChild(dummy);
  rtlScrollTypeCache.set(doc, rtlScrollType);

  return rtlScrollType;
}

/**
 * Browsers expose horizontal RTL scrolling in three different raw `scrollLeft` modes:
 * - `default`: leftmost = 0, rightmost = max
 * - `negative`: leftmost = 0, rightmost = -max
 * - `reverse`: leftmost = max, rightmost = 0
 *
 * Normalize them so the scroll area logic can always reason about RTL positions
 * using a consistent 0 → max coordinate space.
 */
function getNormalizedScrollLeft(viewport: HTMLElement) {
  const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);

  switch (detectRtlScrollType(viewport.ownerDocument)) {
    case 'negative':
      return -viewport.scrollLeft;
    case 'reverse':
      return maxScrollLeft - viewport.scrollLeft;
    default:
      return viewport.scrollLeft;
  }
}

/** Convert a normalized RTL horizontal scroll position back to the browser-specific `scrollLeft` value. */
function setNormalizedScrollLeft(viewport: HTMLElement, scrollPosition: number) {
  const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);

  switch (detectRtlScrollType(viewport.ownerDocument)) {
    case 'negative':
      viewport.scrollLeft = -scrollPosition;
      break;
    case 'reverse':
      viewport.scrollLeft = maxScrollLeft - scrollPosition;
      break;
    default:
      viewport.scrollLeft = scrollPosition;
      break;
  }
}

export function getScrollPosition(viewport: HTMLElement, orientation: ScrollAreaOrientation, dir: Direction) {
  if (orientation === 'horizontal' && dir === 'rtl') {
    return getNormalizedScrollLeft(viewport);
  }

  return orientation === 'horizontal' ? viewport.scrollLeft : viewport.scrollTop;
}

export function setViewportScroll(
  viewport: HTMLElement,
  orientation: ScrollAreaOrientation,
  scrollPosition: number,
  dir: Direction
) {
  if (orientation === 'horizontal') {
    if (dir === 'rtl') {
      setNormalizedScrollLeft(viewport, scrollPosition);
      return;
    }

    viewport.scrollLeft = scrollPosition;
    return;
  }

  viewport.scrollTop = scrollPosition;
}

export function getScrollSize(viewport: HTMLElement, content: HTMLElement, orientation: ScrollAreaOrientation) {
  const viewportSize = getAxisValue(orientation, {
    horizontal: viewport.clientWidth,
    vertical: viewport.clientHeight
  });
  const contentSize = getAxisValue(orientation, {
    horizontal: Math.max(content.scrollWidth, content.offsetWidth),
    vertical: Math.max(content.scrollHeight, content.offsetHeight)
  });

  return {
    viewportSize,
    contentSize,
    maxScrollPosition: Math.max(contentSize - viewportSize, 0)
  };
}
