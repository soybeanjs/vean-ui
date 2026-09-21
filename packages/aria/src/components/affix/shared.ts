import { toValue } from 'vue';
import type { AffixTarget } from './types';

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

export function resolveAffixTarget(target?: AffixTarget | null) {
  if (!target) {
    return getDefaultTarget();
  }

  if (typeof target === 'string') {
    return queryTargetSelector(target);
  }

  return toValue(target) ?? null;
}

export function getTargetRect(target: Window | HTMLElement): DOMRect {
  if (target && target !== getDefaultTarget() && 'getBoundingClientRect' in target) {
    return target.getBoundingClientRect();
  }

  return {
    bottom: window.innerHeight,
    height: window.innerHeight,
    left: 0,
    right: window.innerWidth,
    top: 0,
    width: window.innerWidth,
    x: 0,
    y: 0,
    toJSON() {
      return {};
    }
  } as DOMRect;
}

export function getFixedTop(placeholderRect: DOMRect, targetRect: DOMRect, offsetTop?: number) {
  if (offsetTop !== undefined && Math.round(targetRect.top) > Math.round(placeholderRect.top) - offsetTop) {
    return offsetTop + targetRect.top;
  }

  return undefined;
}

export function getFixedBottom(placeholderRect: DOMRect, targetRect: DOMRect, offsetBottom?: number) {
  if (offsetBottom !== undefined && Math.round(targetRect.bottom) < Math.round(placeholderRect.bottom) + offsetBottom) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;

    return offsetBottom + targetBottomOffset;
  }

  return undefined;
}

export function isZeroRect(rect: DOMRect) {
  return rect.top === 0 && rect.left === 0 && rect.width === 0 && rect.height === 0;
}
