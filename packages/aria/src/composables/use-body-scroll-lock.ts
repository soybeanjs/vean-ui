import { isClient, isIOS } from '../shared';

const DATA_SCROLL_LOCK = 'data-scroll-lock';
const SCROLL_LOCK_STYLE_ID = 'scroll-lock-styles';

// CSS classes for scroll lock
const CSS_CLASSES = {
  BODY: 'scroll-lock-body',
  BODY_WITH_SCROLLBAR: 'scroll-lock-body-with-scrollbar',
  HTML: 'scroll-lock-html'
} as const;

// Optimized CSS with better performance
const SCROLL_LOCK_CSS = `
  .${CSS_CLASSES.BODY} {
    position: fixed !important;
    overflow-x: hidden !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: auto !important;
  }

  .${CSS_CLASSES.BODY_WITH_SCROLLBAR} {
    overflow-y: scroll !important;
  }

  .${CSS_CLASSES.HTML} {
    scroll-behavior: auto !important;
  }
`;

// Reference-counted lock state: the lock is applied when the count goes 0→1 and released
// when it returns to 0. Each caller owns exactly one count, so overlapping modal layers
// (e.g. a Select inside a Dialog) never unlock each other prematurely.
let lockCount = 0;
let releaseLock: (() => void) | undefined;

/**
 * High-performance scroll lock using CSS classes
 *
 * @returns A function to unlock the scroll
 */
export function useBodyScrollLock(): () => void {
  if (!isClient) {
    return () => {};
  }

  lockCount += 1;

  if (lockCount === 1) {
    const body = document.body;
    const locksBodyStyles = shouldLockBodyStyles();

    let scrollY = 0;

    if (locksBodyStyles) {
      ensureScrollLockCSS();

      scrollY = window.scrollY;

      // Apply scroll lock
      applyScrollLock(body, scrollY, shouldShowVerticalScrollbar());
    }

    // Setup iOS-specific touch prevention
    const stopTouchMoveListener = isIOS() ? setupIOSTouchPrevention() : undefined;

    releaseLock = () => {
      if (locksBodyStyles) {
        unlockScroll(body, scrollY);
      }

      stopTouchMoveListener?.();
    };
  }

  // Idempotent: a double-invoked cleanup must not over-decrement the count.
  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount === 0) {
      releaseLock?.();
      releaseLock = undefined;
    }
  };
}

/**
 * iOS Safari reveals its browser chrome once the body stops being scrollable —
 * `position: fixed` collapses the document height and the toolbar slides back
 * in, shrinking the visual viewport under every fixed layer. Opening a drawer
 * would therefore shift the page (and the drawer) by the chrome height, and
 * re-frame the snap geometry mid-open. Background touch scrolling is already
 * blocked by {@link setupIOSTouchPrevention}, so iOS keeps its scroll state —
 * and its chrome — untouched.
 */
function shouldLockBodyStyles(): boolean {
  return !isIOS();
}

/** Apply scroll lock to the body element */
function applyScrollLock(body: HTMLElement, scrollY: number, showScrollbar: boolean): void {
  body.style.top = `-${scrollY}px`;
  body.classList.add(CSS_CLASSES.BODY);

  if (showScrollbar) {
    body.classList.add(CSS_CLASSES.BODY_WITH_SCROLLBAR);
  }

  document.documentElement.classList.add(CSS_CLASSES.HTML);
  body.setAttribute(DATA_SCROLL_LOCK, 'true');
}

/** Remove scroll lock from the body element */
function unlockScroll(body: HTMLElement, scrollY: number): void {
  // Remove CSS classes
  body.classList.remove(CSS_CLASSES.BODY, CSS_CLASSES.BODY_WITH_SCROLLBAR);
  document.documentElement.classList.remove(CSS_CLASSES.HTML);

  // Reset inline styles
  body.style.top = '';
  body.removeAttribute(DATA_SCROLL_LOCK);

  // Restore scroll position
  window.scrollTo(0, scrollY);
}

/** Determines if vertical scrollbar should be shown */
function shouldShowVerticalScrollbar(): boolean {
  return document.body.scrollHeight > window.innerHeight;
}

/** Sets up touch event prevention for iOS devices */
function setupIOSTouchPrevention(): () => void {
  const onTouchMove = (event: TouchEvent) => {
    if (shouldPreventTouchMove(event)) {
      event.preventDefault();
    }
  };

  document.addEventListener('touchmove', onTouchMove, { passive: false });

  return () => {
    document.removeEventListener('touchmove', onTouchMove);
  };
}

/** Determines if touch move event should be prevented */
function shouldPreventTouchMove(event: TouchEvent): boolean {
  // Allow multi-touch gestures (pinch to zoom, etc.)
  if (event.touches.length > 1) {
    return false;
  }

  const target = event.target as Element;

  // Allow scrolling in scrollable containers
  return !hasScrollableOverflow(target);
}

/** Checks if element or its parents have scrollable overflow */
function hasScrollableOverflow(element: Element): boolean {
  let currentElement: Element | null = element;

  while (currentElement && currentElement.tagName !== 'BODY') {
    const style = window.getComputedStyle(currentElement);

    if (isElementScrollable(style, currentElement)) {
      return true;
    }

    currentElement = currentElement.parentElement;
  }

  return false;
}

/** Determines if a single element is scrollable based on its computed styles */
function isElementScrollable(style: CSSStyleDeclaration, element: Element): boolean {
  const hasScrollOverflow = style.overflowX === 'scroll' || style.overflowY === 'scroll';
  const hasAutoOverflowWithContent =
    (style.overflowX === 'auto' && element.clientWidth < element.scrollWidth) ||
    (style.overflowY === 'auto' && element.clientHeight < element.scrollHeight);

  return hasScrollOverflow || hasAutoOverflowWithContent;
}

/** Injects CSS for scroll lock if not already present */
function ensureScrollLockCSS(): void {
  if (!document.getElementById(SCROLL_LOCK_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = SCROLL_LOCK_STYLE_ID;
    style.textContent = SCROLL_LOCK_CSS;
    document.head.appendChild(style);
  }
}
