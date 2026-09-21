import { onWatcherCleanup, toValue, watchPostEffect } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { isClient } from '../shared';

/** Number of components which have requested interest to have focus guards */
let count = 0;

const FOCUS_GUARD_ATTRIBUTE = 'data-vean-focus-guard';

export function useFocusGuards(enabled: MaybeRefOrGetter<boolean> = true) {
  watchPostEffect(() => {
    // Ensure we're in a browser environment
    if (!isClient || !toValue(enabled)) {
      return;
    }

    const existingGuards = document.querySelectorAll(`[${FOCUS_GUARD_ATTRIBUTE}]`);

    // If this is the first component using focus guards or guards don't exist
    if (count === 0 || existingGuards.length === 0) {
      // Create or reuse focus guards
      const firstGuard = existingGuards[0] ?? createFocusGuard();
      const lastGuard = existingGuards[1] ?? createFocusGuard();

      // Insert guards at the beginning and end of the body
      if (!firstGuard.parentNode) {
        document.body.insertAdjacentElement('afterbegin', firstGuard);
      }
      if (!lastGuard.parentNode) {
        document.body.insertAdjacentElement('beforeend', lastGuard);
      }
    }

    count++;

    onWatcherCleanup(() => {
      count--;

      // If this is the last component using focus guards, remove them
      if (count === 0) {
        document.querySelectorAll(`[${FOCUS_GUARD_ATTRIBUTE}]`).forEach(node => node.remove());
      }
    });
  });
}

function createFocusGuard() {
  const element = document.createElement('span');
  element.setAttribute(FOCUS_GUARD_ATTRIBUTE, '');
  element.tabIndex = 0;
  Object.assign(element.style, {
    outline: 'none',
    opacity: '0',
    position: 'fixed',
    pointerEvents: 'none'
  });
  return element;
}
