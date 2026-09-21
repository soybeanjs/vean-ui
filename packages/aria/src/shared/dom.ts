import { COLLECTION_ITEM_ATTRIBUTE } from '../constants';

export function removeLinks(items: HTMLElement[]) {
  return items.filter(item => item.tagName !== 'A');
}

export function getActiveElement<T extends Element = HTMLElement>() {
  let activeElement = document.activeElement;
  if (activeElement === null) {
    return null;
  }

  while (
    activeElement !== null &&
    activeElement.shadowRoot !== null &&
    activeElement.shadowRoot.activeElement !== null
  ) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement as T;
}

export function isElementHasAttribute(element: HTMLElement, attribute: string) {
  const value = element.getAttribute(attribute);
  const dataValue = element.getAttribute(`data-${attribute}`);

  return [value, dataValue].some(item => item === '' || item === 'true');
}

export function getCollectionItemElements(element: HTMLElement) {
  return Array.from(element.querySelectorAll(`[${COLLECTION_ITEM_ATTRIBUTE}]`)) as HTMLElement[];
}

export function getAriaLabel(element?: HTMLElement | null, id?: string, ariaLabel?: string) {
  if (ariaLabel) {
    return ariaLabel;
  }

  if (!id || !element) {
    return undefined;
  }

  const labelElement = document.querySelector(`[for="${id}"]`) as HTMLLabelElement;

  return labelElement?.textContent ?? undefined;
}

export function isHTMLElement(node: any): node is HTMLElement {
  return node.nodeType === node.ELEMENT_NODE;
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
