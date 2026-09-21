import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The lock keeps module-level reference count, so every test must load a fresh module
 * instance via `vi.resetModules()` + dynamic import. Load AFTER the window/document
 * mocks are in place (iOS detection is lazily evaluated against the mocked globals).
 */
async function loadLock() {
  vi.resetModules();

  const [{ useBodyScrollLock }, { refreshIOSDetection }] = await Promise.all([
    import('../../../../aria/src/composables/use-body-scroll-lock'),
    import('../../../../aria/src/shared/env')
  ]);

  return { useBodyScrollLock, refreshIOSDetection };
}

describe('useBodyScrollLock', () => {
  let originalWindow: any;
  let originalDocument: any;
  let mockBody: any;
  let mockDocumentElement: any;

  beforeEach(() => {
    // Store original globals
    originalWindow = globalThis.window;
    originalDocument = globalThis.document;

    // Create mock DOM elements
    mockBody = {
      hasAttribute: vi.fn(),
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      style: {},
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      },
      scrollHeight: 1000,
      clientHeight: 800,
      clientWidth: 800,
      scrollWidth: 800,
      tagName: 'BODY'
    };

    mockDocumentElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      }
    };

    // Setup window mock
    globalThis.window = {
      scrollY: 100,
      innerHeight: 800,
      scrollTo: vi.fn(),
      navigator: {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        maxTouchPoints: 0
      },
      getComputedStyle: vi.fn()
    } as any;

    // Setup document mock
    globalThis.document = {
      body: mockBody,
      documentElement: mockDocumentElement,
      getElementById: vi.fn(),
      createElement: vi.fn(),
      head: {
        appendChild: vi.fn()
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as any;
  });

  afterEach(() => {
    // Restore original globals
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  });

  describe('basic functionality', () => {
    it('should apply scroll lock to body', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(mockBody.hasAttribute).mockReturnValue(false);
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(mockBody.style.top).toBe('-100px');
      expect(mockBody.classList.add).toHaveBeenCalledWith('scroll-lock-body');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('scroll-lock-html');
      expect(mockBody.setAttribute).toHaveBeenCalledWith('data-scroll-lock', 'true');
      expect(typeof unlock).toBe('function');

      unlock();
    });

    it('should unlock scroll when unlock function is called', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(mockBody.hasAttribute).mockReturnValue(false);
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();
      unlock();

      expect(mockBody.classList.remove).toHaveBeenCalledWith('scroll-lock-body', 'scroll-lock-body-with-scrollbar');
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('scroll-lock-html');
      expect(mockBody.style.top).toBe('');
      expect(mockBody.removeAttribute).toHaveBeenCalledWith('data-scroll-lock');
      expect(globalThis.window.scrollTo).toHaveBeenCalledWith(0, 100);
    });

    it('should add scrollbar class when vertical scrollbar is needed', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(mockBody.hasAttribute).mockReturnValue(false);
      mockBody.scrollHeight = 1200; // Greater than window.innerHeight (800)
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(mockBody.classList.add).toHaveBeenCalledWith('scroll-lock-body-with-scrollbar');

      unlock();
    });

    it('should not add scrollbar class when no vertical scrollbar is needed', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(mockBody.hasAttribute).mockReturnValue(false);
      mockBody.scrollHeight = 600; // Less than window.innerHeight (800)
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(mockBody.classList.add).not.toHaveBeenCalledWith('scroll-lock-body-with-scrollbar');

      unlock();
    });
  });

  describe('CSS injection', () => {
    it('should inject CSS styles when not already present', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(mockBody.hasAttribute).mockReturnValue(false);
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);

      const mockStyleElement = {
        id: '',
        textContent: ''
      };
      const createElement = vi.fn().mockReturnValue(mockStyleElement);
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(createElement).toHaveBeenCalledWith('style');
      expect(mockStyleElement.id).toBe('scroll-lock-styles');
      expect(mockStyleElement.textContent).toContain('.scroll-lock-body');
      expect(globalThis.document.head.appendChild).toHaveBeenCalledWith(mockStyleElement);

      unlock();
    });

    it('should not inject CSS styles when already present', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(mockBody.hasAttribute).mockReturnValue(false);
      vi.mocked(globalThis.document.getElementById).mockReturnValue({
        id: 'scroll-lock-styles'
      } as any);

      const createElement = vi.fn();
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(createElement).not.toHaveBeenCalled();
      expect(globalThis.document.head.appendChild).not.toHaveBeenCalled();

      unlock();
    });
  });

  describe('reference counting', () => {
    it('should apply the lock only once for overlapping locks', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);
      globalThis.document.createElement = vi.fn().mockReturnValue({ id: '', textContent: '' });

      const unlockA = useBodyScrollLock();
      const unlockB = useBodyScrollLock();

      // `setAttribute` fires exactly once per apply, unlike `classList.add` (body + scrollbar classes).
      expect(mockBody.setAttribute).toHaveBeenCalledTimes(1);

      unlockA();
      unlockB();
    });

    it('should keep the lock until the last overlapping lock is released', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);
      globalThis.document.createElement = vi.fn().mockReturnValue({ id: '', textContent: '' });

      const unlockA = useBodyScrollLock();
      const unlockB = useBodyScrollLock();

      // Releasing the first owner must not unlock the body while the second is still open.
      unlockA();

      expect(mockBody.classList.remove).not.toHaveBeenCalled();
      expect(mockBody.removeAttribute).not.toHaveBeenCalled();
      expect(globalThis.window.scrollTo).not.toHaveBeenCalled();

      unlockB();

      expect(mockBody.classList.remove).toHaveBeenCalledWith('scroll-lock-body', 'scroll-lock-body-with-scrollbar');
      expect(mockBody.removeAttribute).toHaveBeenCalledWith('data-scroll-lock');
      expect(globalThis.window.scrollTo).toHaveBeenCalledWith(0, 100);
    });

    it('should not re-apply the lock while at least one lock is held', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);
      globalThis.document.createElement = vi.fn().mockReturnValue({ id: '', textContent: '' });

      const unlockA = useBodyScrollLock();
      const unlockB = useBodyScrollLock();
      unlockA();

      // Acquiring again while B is still held: count goes 1→2, no re-apply.
      const unlockC = useBodyScrollLock();

      expect(mockBody.setAttribute).toHaveBeenCalledTimes(1);

      unlockB();
      expect(mockBody.classList.remove).not.toHaveBeenCalled();

      unlockC();
      expect(mockBody.classList.remove).toHaveBeenCalled();
    });

    it('should be idempotent when the same unlock is invoked twice', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);
      globalThis.document.createElement = vi.fn().mockReturnValue({ id: '', textContent: '' });

      const unlock = useBodyScrollLock();
      unlock();

      // The second invocation must not trigger a second release.
      unlock();
      expect(mockBody.classList.remove).toHaveBeenCalledTimes(1);

      // Nor over-decrement: the count is 0 (not -1), so the next lock re-applies the body
      // lock instead of assuming someone else still holds it.
      const unlockOther = useBodyScrollLock();
      expect(mockBody.setAttribute).toHaveBeenCalledTimes(2);

      unlockOther();
      expect(mockBody.classList.remove).toHaveBeenCalledTimes(2);
    });
  });

  describe('iOS touch handling', () => {
    beforeEach(async () => {
      // Mock iOS user agent - use a user agent that matches /iP(?:ad|hone|od)/
      Object.defineProperty(globalThis.window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15',
        writable: true,
        configurable: true
      });
    });

    it('should setup touch event listeners on iOS devices', async () => {
      const { useBodyScrollLock, refreshIOSDetection } = await loadLock();
      // Refresh iOS detection to clear cache and re-detect with new user agent
      refreshIOSDetection();

      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(globalThis.document.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), {
        passive: false
      });

      // Clean up should remove event listener
      unlock();
      expect(globalThis.document.removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
    });

    it('leaves the body unstyled on iOS so the browser chrome stays put', async () => {
      const { useBodyScrollLock, refreshIOSDetection } = await loadLock();
      refreshIOSDetection();

      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);
      globalThis.document.createElement = vi.fn().mockReturnValue({ id: '', textContent: '' });

      const unlock = useBodyScrollLock();

      // `position: fixed` collapses the document height, which makes iOS Safari
      // reveal its toolbar and shift every fixed layer by the chrome height
      // mid-open. The document touchmove guard already blocks background
      // scrolling there, so the body itself is left alone.
      expect(mockBody.style.top).toBeUndefined();
      expect(mockBody.classList.add).not.toHaveBeenCalledWith('scroll-lock-body');
      expect(mockDocumentElement.classList.add).not.toHaveBeenCalledWith('scroll-lock-html');
      expect(mockBody.setAttribute).not.toHaveBeenCalled();

      unlock();

      // The page never moved, so the scroll position must not be rewritten.
      expect(globalThis.window.scrollTo).not.toHaveBeenCalled();
      expect(mockBody.classList.remove).not.toHaveBeenCalled();
    });
  });

  describe('non-iOS devices', () => {
    beforeEach(() => {
      // Mock non-iOS user agent
      Object.defineProperty(globalThis.window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        writable: true,
        configurable: true
      });
      Object.defineProperty(globalThis.window.navigator, 'maxTouchPoints', {
        value: 0,
        writable: true,
        configurable: true
      });
    });

    it('should not setup touch event listeners on non-iOS devices', async () => {
      const { useBodyScrollLock, refreshIOSDetection } = await loadLock();
      // Refresh iOS detection to clear cache and re-detect with new user agent
      refreshIOSDetection();

      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(globalThis.document.addEventListener).not.toHaveBeenCalled();

      // Clean up should not try to remove non-existent listener
      unlock();
      expect(globalThis.document.removeEventListener).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle missing window properties gracefully', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);
      globalThis.window.scrollY = undefined as any;

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(() => unlock()).not.toThrow();
    });

    it('should handle zero scroll position', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);
      globalThis.window.scrollY = 0;

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(mockBody.style.top).toBe('-0px');

      unlock();
      expect(globalThis.window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should handle large scroll position', async () => {
      const { useBodyScrollLock } = await loadLock();
      vi.mocked(globalThis.document.getElementById).mockReturnValue(null);
      globalThis.window.scrollY = 500;

      const createElement = vi.fn().mockReturnValue({
        id: '',
        textContent: ''
      });
      globalThis.document.createElement = createElement;

      const unlock = useBodyScrollLock();

      expect(mockBody.style.top).toBe('-500px');

      unlock();
      expect(globalThis.window.scrollTo).toHaveBeenCalledWith(0, 500);
    });
  });
});
