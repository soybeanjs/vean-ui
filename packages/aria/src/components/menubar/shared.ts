export function isTriggerLink(element: HTMLElement | null | undefined) {
  if (!element) return false;

  return element.tagName === 'A' || element.hasAttribute('href');
}
