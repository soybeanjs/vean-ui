import { shallowRef } from 'vue';
import { getElFromTemplateRef } from '../shared';
import type { VNodeRef } from '../types';

/**
 * Forward the element ref to the parent component.
 *
 * @returns An object containing the element reference and a function to set the element reference.
 */
export function useForwardElement<T extends HTMLElement = HTMLElement>(callback?: (el: T) => void) {
  const elementRef = shallowRef<T>();

  function setElementRef(nodeRef: VNodeRef) {
    const node = getElFromTemplateRef<T>(nodeRef);
    if (node) {
      elementRef.value = node;
      callback?.(node);
    } else {
      // Element unmounted — clear the ref so watchers (e.g. useDismissableLayer)
      // can detect the removal and run their cleanup logic.
      elementRef.value = undefined;
    }
  }

  return [elementRef, setElementRef] as const;
}
