import type { AnchorContainer, AnchorHistoryMode, AnchorSection } from './types';

export interface AnchorLocationHashSyncTarget {
  hash: string;
  container: AnchorContainer;
  shouldScroll: boolean;
}

export function isHashAnchor(href: string) {
  return href.startsWith('#');
}

export function resolveAnchorTargetElement(href: string) {
  if (typeof document === 'undefined' || !isHashAnchor(href)) {
    return null;
  }

  const id = decodeURIComponent(href.slice(1));

  if (!id) {
    return null;
  }

  return document.getElementById(id);
}

export function resolveAnchorContainer(getContainer?: () => AnchorContainer | null) {
  if (typeof window === 'undefined') {
    return null;
  }

  if (getContainer) {
    return getContainer() ?? null;
  }

  return window;
}

export function getLocationHash() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.hash || '';
}

export function updateAnchorHistory(href: string, mode: AnchorHistoryMode) {
  if (typeof window === 'undefined' || !isHashAnchor(href)) {
    return;
  }

  const method = mode === 'replace' ? 'replaceState' : 'pushState';
  // Preserve the existing history.state (e.g. Vue Router's navigation state);
  // passing `null` wipes it and triggers VUE_ROUTER_R0121 on the next router.push.
  window.history[method]({ ...window.history.state }, '', href);
}

export function getContainerScrollTop(container: AnchorContainer) {
  if (isWindowContainer(container)) {
    return window.scrollY || window.pageYOffset || 0;
  }

  return container.scrollTop;
}

export function getAnchorOffsetTop(offsetTop: number, targetOffset?: number) {
  return targetOffset ?? offsetTop;
}

export function getElementOffsetTop(element: HTMLElement, container: AnchorContainer) {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (isWindowContainer(container)) {
    return rect.top - element.ownerDocument.documentElement.clientTop;
  }

  return rect.top - container.getBoundingClientRect().top;
}

export function isAnchorSection(section: AnchorSection | null): section is AnchorSection {
  return Boolean(section);
}

export function getAnchorSections(links: string[], container: AnchorContainer) {
  return links
    .map(href => {
      const element = resolveAnchorTargetElement(href);

      if (!element) {
        return null;
      }

      return {
        href,
        top: getElementOffsetTop(element, container)
      };
    })
    .filter(isAnchorSection);
}

export function getCurrentAnchorHref(sections: AnchorSection[], maxTop: number) {
  const visibleSections = sections.filter(section => section.top <= maxTop);

  if (!visibleSections.length) {
    return '';
  }

  return visibleSections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev)).href;
}

export function getAnchorScrollTop(element: HTMLElement, container: AnchorContainer, offsetTop: number) {
  return getContainerScrollTop(container) + getElementOffsetTop(element, container) - offsetTop;
}

export function resolveLocationHashSyncTarget(
  hash: string,
  registeredLinks: string[],
  container: AnchorContainer | null,
  syncedHash: string,
  syncedContainer: AnchorContainer | null
): AnchorLocationHashSyncTarget | null {
  if (!hash || !container || !registeredLinks.includes(hash)) {
    return null;
  }

  return {
    hash,
    container,
    shouldScroll: syncedHash !== hash || syncedContainer !== container
  };
}

export function shouldSyncAnchorFromHash(
  hash: string,
  registeredLinks: string[],
  container: AnchorContainer | null,
  syncedHash: string,
  syncedContainer: AnchorContainer | null
) {
  if (!hash || !container || !registeredLinks.includes(hash)) {
    return false;
  }

  return syncedHash !== hash || syncedContainer !== container;
}

export function scrollContainerTo(container: AnchorContainer, top: number, behavior: ScrollBehavior = 'smooth') {
  const options: ScrollToOptions = {
    behavior,
    top
  };

  if (container === window) {
    window.scrollTo(options);
    return;
  }

  container.scrollTo(options);
}

function isWindowContainer(container: AnchorContainer): container is Window {
  return container === window;
}
