import { onWatcherCleanup, toValue, watch, watchEffect } from 'vue';
import type { MaybeRefOrGetter, Ref } from 'vue';
import {
  arrayRemove,
  focus,
  focusFirstAndSelect,
  getActiveElement,
  getTabbableCandidates,
  getTabbableEdges,
  isClient,
  removeLinks
} from '../shared';
import type { EmitsToHookProps, FocusScopeEmits } from '../types';

export interface UseFocusScopeOptions extends EmitsToHookProps<FocusScopeEmits> {
  /**
   * When `true`, tabbing from last item will focus first tabbable and shift+tab from first item will focus last
   * tabbable.
   *
   * @defaultValue false
   */
  loop?: MaybeRefOrGetter<boolean>;
  /**
   * When `true`, focus cannot escape the focus scope via keyboard, pointer, or a programmatic focus.
   *
   * @defaultValue false
   */
  trapped?: MaybeRefOrGetter<boolean>;
}

const AUTOFOCUS_ON_OPEN = 'focusScope.autoFocusOnOpen';
const AUTOFOCUS_ON_CLOSE = 'focusScope.autoFocusOnClose';
const AUTOFOCUS_EVENT_OPTIONS = { bubbles: false, cancelable: true };
const focusScopesStack = createFocusScopesStack();

export function useFocusScope(elRef: Ref<HTMLElement | undefined>, options?: UseFocusScopeOptions) {
  const { loop, trapped, onOpenAutoFocus, onCloseAutoFocus } = options || {};

  let lastFocusedElementRef: HTMLElement | null | undefined;

  const focusScope: FocusScopeStackItem = {
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    }
  };

  // Takes care of trapping focus if focus is moved outside programmatically for example
  if (isClient) {
    function handleFocusIn(event: FocusEvent) {
      if (focusScope.paused || !elRef.value) return;

      const target = event.target as HTMLElement | null;

      if (elRef.value.contains(target)) {
        lastFocusedElementRef = target;
      } else {
        focus(lastFocusedElementRef, { select: true });
      }
    }

    function handleFocusOut(event: FocusEvent) {
      if (focusScope.paused || !elRef.value) return;
      const relatedTarget = event.relatedTarget as HTMLElement | null;

      // A `focusout` event with a `null` `relatedTarget` will happen in at least two cases:
      //
      // 1. When the user switches app/tabs/windows/the browser itself loses focus.
      // 2. In Google Chrome, when the focused element is removed from the DOM.
      //
      // We let the browser do its thing here because:
      //
      // 1. The browser already keeps a memory of what's focused for when the page gets refocused.
      // 2. In Google Chrome, if we try to focus the deleted focused element (as per below), it
      //    throws the CPU to 100%, so we avoid doing anything for this reason here too.
      if (relatedTarget === null) return;

      // If the focus has moved to an actual legitimate element (`relatedTarget !== null`)
      // that is outside the container, we move focus to the last valid focused element inside.
      if (!elRef.value.contains(relatedTarget)) {
        focus(lastFocusedElementRef, { select: true });
      }
    }

    // When the focused element gets removed from the DOM, browsers move focus
    // back to the document.body. In this case, we move focus to the container
    // to keep focus trapped correctly.
    // -- related: https://github.com/unovue/reka-ui/issues/518
    // Reka UI tentative solution:
    // instead of leaning on document.activeElement, we use lastFocusedElementRef.value to check
    // if the element still exist inside the container,
    // if not then we focus to the container
    function handleMutations() {
      const isLastFocusedElementExist = elRef.value?.contains(lastFocusedElementRef as HTMLElement);
      if (isLastFocusedElementExist) return;

      focus(elRef.value);
    }

    watchEffect(() => {
      if (!toValue(trapped)) return;

      document.addEventListener('focusin', handleFocusIn);
      document.addEventListener('focusout', handleFocusOut);
      const mutationObserver = new MutationObserver(handleMutations);

      if (elRef.value) {
        mutationObserver.observe(elRef.value, { childList: true, subtree: true });
      }

      onWatcherCleanup(() => {
        document.removeEventListener('focusin', handleFocusIn);
        document.removeEventListener('focusout', handleFocusOut);
        mutationObserver.disconnect();
      });
    });

    /**
     * The callback must stay SYNCHRONOUS: registration onto the shared scope
     * stack (pausing the previous top scope) has to happen inside the same
     * scheduler flush that mounts the container. An inner `await nextTick()`
     * defers registration past any focus call made right after the container
     * mounts (e.g. an opening submenu moving focus into its popup), letting a
     * paused-too-late parent trap yank focus back.
     */
    watch(elRef, (container, _, onCleanup) => {
      if (!container) return;
      focusScopesStack.add(focusScope);

      const previouslyFocusedElement = getActiveElement();
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);

      if (onOpenAutoFocus) {
        container.addEventListener(AUTOFOCUS_ON_OPEN, onOpenAutoFocus);
      }

      if (onCloseAutoFocus) {
        container.addEventListener(AUTOFOCUS_ON_CLOSE, onCloseAutoFocus);
      }

      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_OPEN, AUTOFOCUS_EVENT_OPTIONS);
        container.dispatchEvent(mountEvent);

        if (!mountEvent.defaultPrevented) {
          focusFirstAndSelect(removeLinks(getTabbableCandidates(container)), { select: true });

          if (getActiveElement() === previouslyFocusedElement) {
            focus(container);
          }
        }
      }

      onCleanup(() => {
        if (onOpenAutoFocus) {
          container.removeEventListener(AUTOFOCUS_ON_OPEN, onOpenAutoFocus);
        }

        const closeEvent = new CustomEvent(AUTOFOCUS_ON_CLOSE, AUTOFOCUS_EVENT_OPTIONS);
        container.dispatchEvent(closeEvent);

        window.setTimeout(() => {
          if (!closeEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true });
          }

          if (onCloseAutoFocus) {
            container.removeEventListener(AUTOFOCUS_ON_CLOSE, onCloseAutoFocus);
          }

          focusScopesStack.remove(focusScope);
        }, 0);
      });
    });
  }

  // Takes care of looping focus (when tabbing whilst at the edges)
  function onKeydown(event: KeyboardEvent) {
    const isLoop = toValue(loop);
    const isTrapped = toValue(trapped);

    if (!isLoop && !isTrapped) return;
    if (focusScope.paused) return;

    const isTabKey = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey;
    const focusedElement = getActiveElement();

    if (!isTabKey || !focusedElement) return;

    const container = event.currentTarget as HTMLElement;
    const [first, last] = getTabbableEdges(container);
    const hasTabbableElementsInside = first && last;

    // we can only wrap focus if we have tabbable edges
    if (!hasTabbableElementsInside) {
      if (focusedElement === container) {
        event.preventDefault();
      }
    } else if (!event.shiftKey && focusedElement === last) {
      event.preventDefault();

      if (isLoop) {
        focus(first, { select: true });
      }
    } else if (event.shiftKey && focusedElement === first) {
      event.preventDefault();

      if (isLoop) {
        focus(last, { select: true });
      }
    }
  }

  return {
    onKeydown
  };
}

interface FocusScopeStackItem {
  paused: boolean;
  pause: () => void;
  resume: () => void;
}

function createFocusScopesStack() {
  /** A stack of focus scopes, with the active one at the top */
  let stack: FocusScopeStackItem[] = [];

  return {
    add(focusScope: FocusScopeStackItem) {
      // pause the currently active focus scope (at the top of the stack)
      const activeFocusScope = stack[0];

      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause();
      }

      // remove in case it already exists (because we'll re-add it at the top of the stack)
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },

    remove(focusScope: FocusScopeStackItem) {
      stack = arrayRemove(stack, focusScope);
      stack[0]?.resume();
    }
  };
}
