export const isBrowser = typeof document !== 'undefined';
export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

// iOS detection - lazy calculation and cached result
let cachedIOSResult: boolean | null = null;

function detectIOS(): boolean {
  if (!isClient) {
    return false;
  }

  if (!window?.navigator?.userAgent) {
    return false;
  }

  return (
    /iP(?:ad|hone|od)/.test(window.navigator.userAgent) ||
    // The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
    // https://github.com/vueuse/vueuse/issues/3577
    (window.navigator.maxTouchPoints > 2 && /iPad|Macintosh/.test(window.navigator.userAgent))
  );
}

export function isIOS(): boolean {
  if (cachedIOSResult === null) {
    cachedIOSResult = detectIOS();
  }
  return cachedIOSResult;
}

// Re-detect iOS in special cases (e.g., testing environment)
export function refreshIOSDetection(): boolean {
  cachedIOSResult = null;
  return isIOS();
}

/**
 * Whether the runtime supports the native `inert` attribute (Baseline since 2023).
 * Used by `markOthers` consumers to prefer `inert` over `aria-hidden` so background
 * content leaves both the accessibility tree and the tab order.
 */
export function supportsInert(): boolean {
  return isClient && 'inert' in HTMLElement.prototype;
}
