import { toValue } from 'vue';
import type { BacktopTarget } from './types';

export function getDefaultTarget(): Window | null {
  return typeof window === 'undefined' ? null : window;
}

export function queryTargetSelector(selector: string): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    return document.querySelector<HTMLElement>(selector);
  } catch {
    return null;
  }
}

export function resolveBacktopTarget(target?: BacktopTarget | null) {
  if (!target) {
    return getDefaultTarget();
  }

  if (typeof target === 'string') {
    return queryTargetSelector(target);
  }

  return toValue(target) ?? null;
}

export function isWindow(target: Window | HTMLElement): target is Window {
  return 'document' in target;
}

export function getScrollTop(target: Window | HTMLElement) {
  if (!isWindow(target)) {
    return target.scrollTop;
  }

  const scrollingElement = target.document.scrollingElement ?? target.document.documentElement;

  return target.scrollY || scrollingElement?.scrollTop || target.document.body?.scrollTop || 0;
}

export function setScrollTop(target: Window | HTMLElement, top: number) {
  if (!isWindow(target)) {
    if (typeof target.scrollTo === 'function') {
      try {
        target.scrollTo({ top, behavior: 'auto' });
      } catch {
        target.scrollTo(0, top);
      }
    }

    target.scrollTop = top;

    return;
  }

  const scrollingElement = target.document.scrollingElement ?? target.document.documentElement;

  if (typeof target.scrollTo === 'function') {
    try {
      target.scrollTo({ top, behavior: 'auto' });
    } catch {
      target.scrollTo(0, top);
    }
  }

  if (scrollingElement) {
    scrollingElement.scrollTop = top;
  }

  if (target.document.body) {
    target.document.body.scrollTop = top;
  }
}

export function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - (-2 * value + 2) ** 3 / 2;
}

export { prefersReducedMotion } from '../../shared';
