import { getCurrentInstance, shallowRef } from 'vue';
import type { VNodeRef } from '../types';
import { useForwardElement } from './use-forward-element';

/** Expose the element ref to the parent component. */
export function useExposedElement(callback?: (el: HTMLElement) => void) {
  const instance = getCurrentInstance();
  if (!instance) {
    console.warn('useExposedElement must be called within setup()');
    return [shallowRef<HTMLElement>(), () => {}] as const;
  }

  const [elementRef, setElementRef] = useForwardElement(callback);

  // Ensure exposed object exists
  if (!instance.exposed) {
    Object.defineProperty(instance, 'exposed', {
      value: {},
      writable: true,
      configurable: true
    });
  }

  const setExposedElement = (nodeRef: VNodeRef) => {
    setElementRef(nodeRef);

    // Use Object.defineProperty to ensure reactivity
    Object.defineProperty(instance.exposed!, '$el', {
      enumerable: true,
      configurable: true,
      get: () => elementRef.value
    });
  };

  return [elementRef, setExposedElement] as const;
}
