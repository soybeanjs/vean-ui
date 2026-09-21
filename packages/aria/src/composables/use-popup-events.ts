import { toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue';
import type { FocusOutsideEvent, ModalityTier, PointerDownOutsideEvent } from '../types';

export interface UsePopupEventsOptions {
  /**
   * The modality tier of the popup. `true` blocks outside pointer events, `'trap-focus'`
   * only traps focus, `false` is fully non-modal.
   */
  modal: ComputedRef<ModalityTier | undefined>;
  /**
   * The trigger element.
   */
  triggerElement: ShallowRef<HTMLElement | undefined>;
  /**
   * Whether an outside pointerdown landing on the trigger element is swallowed instead of
   * dismissing the layer. Keep it on for triggers that toggle on click: the trigger already
   * closes the popup, so dismissing here would close and immediately reopen. A contextmenu
   * trigger is opened by a right click and never toggled by a left click, so a press on it
   * dismisses like any other outside press and turns this off.
   */
  swallowTriggerPointerDown?: MaybeRefOrGetter<boolean>;
}

export function usePopupEvents(options: UsePopupEventsOptions) {
  const { modal, triggerElement, swallowTriggerPointerDown } = options;

  let hasInteractedOutsideRef = false;
  let hasPointerDownOutsideRef = false;

  const onFocusOutside = (event: FocusOutsideEvent) => {
    // `'trap-focus'` traps focus just like a full modal does.
    if (!modal.value) return;

    // When focus is trapped, a `focusout` event may still happen.
    // We make sure we don't trigger our `onDismiss` in such case.
    event.preventDefault();
  };

  const onInteractOutside = (event: PointerDownOutsideEvent | FocusOutsideEvent) => {
    // Only a full modal swallows outside interaction; `'trap-focus'` lets it through.
    if (modal.value === true) return;

    if (!event.defaultPrevented) {
      hasInteractedOutsideRef = true;
      if (event.detail.originalEvent.type === 'pointerdown') {
        hasPointerDownOutsideRef = true;
      }
    }

    // Prevent dismissing when clicking a trigger that is already setup to close the popup,
    // without doing so it would close and immediately open again.
    const target = event.target as HTMLElement;
    const swallowsTriggerPress = toValue(swallowTriggerPointerDown ?? true);
    const targetIsTrigger = swallowsTriggerPress && Boolean(triggerElement.value?.contains(target));
    if (targetIsTrigger) {
      event.preventDefault();
    }

    // On Safari if the trigger is inside a container with tabIndex={0}, when clicked
    // we will get the pointer down outside event on the trigger, but then a subsequent
    // focus outside event on the container, we ignore any focus outside event when we've
    // already had a pointer down outside event.
    if (event.detail.originalEvent.type === 'focusin' && hasPointerDownOutsideRef) {
      event.preventDefault();
    }
  };

  const onCloseAutoFocus = (event: Event) => {
    if (modal.value) {
      if (!event.defaultPrevented) {
        event.preventDefault();
        triggerElement.value?.focus();
      }

      return;
    }

    if (!event.defaultPrevented) {
      if (!hasInteractedOutsideRef) {
        triggerElement.value?.focus();
      }
      // Always prevent auto focus because we either focus manually or want user agent focus
      event.preventDefault();
    }
    hasInteractedOutsideRef = false;
    hasPointerDownOutsideRef = false;
  };

  return {
    onFocusOutside,
    onInteractOutside,
    onCloseAutoFocus
  };
}
