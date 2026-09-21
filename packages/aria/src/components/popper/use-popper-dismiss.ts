import { computed, nextTick, onWatcherCleanup, watchEffect } from 'vue';
import type { ShallowRef } from 'vue';
import {
  useBodyScrollLock,
  useDismissableLayer,
  useFocusGuards,
  useFocusScope,
  usePopupEvents
} from '../../composables';
import type { FocusOutsideEvent, PointerDownOutsideEvent } from '../../types';
import type { PopperOpenChangeReason, PopperRootContext } from './types';

interface UsePopperDismissOptions {
  layerElement: ShallowRef<HTMLElement | undefined>;
  context: PopperRootContext;
  /**
   * Whether focus is trapped inside the layer while open. Defaults to `modal` at the call site;
   * when false (hover popups) open/close auto focus is suppressed entirely.
   */
  trapFocus: () => boolean;
  onEscapeKeyDown: (event: KeyboardEvent) => void;
  onPointerDownOutside: (event: PointerDownOutsideEvent) => void;
  onFocusOutside: (event: FocusOutsideEvent) => void;
  onInteractOutside: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void;
  onOpenAutoFocus: (event: Event) => void;
  onCloseAutoFocus: (event: Event) => void;
}

export function usePopperDismiss(options: UsePopperDismissOptions) {
  const { layerElement, context } = options;
  const popupEvents = usePopupEvents({
    modal: context.modal,
    triggerElement: context.triggerElement,
    // A contextmenu trigger opens on a right click and is never toggled by a left click, so a
    // left press on it is an ordinary outside press and has to dismiss the layer.
    swallowTriggerPointerDown: computed(() => context.triggerType.value !== 'contextmenu')
  });

  let dismissReason: Extract<PopperOpenChangeReason, 'dismiss-outside' | 'dismiss-escape'> = 'dismiss-outside';

  function onEscapeKeyDown(event: KeyboardEvent) {
    dismissReason = 'dismiss-escape';
    options.onEscapeKeyDown(event);
  }

  function onPointerDownOutside(event: PointerDownOutsideEvent) {
    dismissReason = 'dismiss-outside';
    options.onPointerDownOutside(event);
  }

  function onFocusOutside(event: FocusOutsideEvent) {
    dismissReason = 'dismiss-outside';
    popupEvents.onFocusOutside(event);

    if (context.triggerType.value === 'hover') {
      event.preventDefault();
    }

    options.onFocusOutside(event);
  }

  function onInteractOutside(event: PointerDownOutsideEvent | FocusOutsideEvent) {
    popupEvents.onInteractOutside(event);
    options.onInteractOutside(event);
  }

  function onDismiss() {
    // A sub layer's outside dismissal closes only itself: the pointerdown landed inside the
    // parent popup, so the parent layer does not treat it as outside and must stay open.
    if (dismissReason === 'dismiss-outside' && context.isSub.value) {
      context.onOpenChange(false, 'dismiss-outside');
      return;
    }

    const shouldRestoreFocus = dismissReason === 'dismiss-escape' || context.modal.value;
    context.onOpenChange(false, dismissReason);

    if (shouldRestoreFocus) {
      nextTick(() => {
        context.triggerElement.value?.focus();
      });
    }
  }

  // Focus infrastructure (guards + scope + auto-focus events). Scope registration happens for
  // EVERY popup layer: the mount/open-auto-focus dispatch and the unmount/close-auto-focus
  // contract (`AUTOFOCUS_ON_OPEN` / `AUTOFOCUS_ON_CLOSE` consumer hooks) must be alive even
  // when trapping is off — non-modal layers (e.g. menubar menus) rely on close-auto-focus to
  // restore trigger focus. Stealing focus is prevented per-event below, not by skipping
  // registration.
  const focusLayerElement = computed(() => layerElement.value);

  // Body-level guards stay limited to previously-enabled shapes (trapped layers and sub layers)
  // so non-modal single popups don't change tab-edge behavior.
  useFocusGuards(() => options.trapFocus() || context.isSub.value);

  const { onKeydown } = useFocusScope(focusLayerElement, {
    trapped: options.trapFocus,
    loop: true,
    onOpenAutoFocus: event => {
      // Non-trapped layers (hover popups, submenus) must never steal focus on open.
      if (!options.trapFocus()) {
        event.preventDefault();
        return;
      }

      options.onOpenAutoFocus(event);
    },
    onCloseAutoFocus: event => {
      // Hover popups never move DOM focus on open or close.
      if (context.triggerType.value === 'hover') {
        event.preventDefault();
        return;
      }

      // Consumer hook first: preventing the event opts out of the default trigger refocus.
      options.onCloseAutoFocus(event);
      popupEvents.onCloseAutoFocus(event);
    }
  });

  // Lock body scroll while a modal layer is open. Gated on `open` — not on presence/unmount —
  // so the lock is released as soon as the layer closes, even while exit animations keep the
  // impl mounted (mirrors DialogOverlay).
  watchEffect(() => {
    if (!context.modal.value || !context.open.value) return;

    const cleanup = useBodyScrollLock();
    onWatcherCleanup(cleanup);
  });

  return {
    ...useDismissableLayer(layerElement, {
      disableOutsidePointerEvents: context.modal,
      // A closed (still exit-animating) layer must not dismiss the interaction that re-opens it.
      enable: context.open,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss
    }),
    onKeydown
  };
}
