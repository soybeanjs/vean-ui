<script setup lang="ts">
import { computed, reactive, watchPostEffect } from 'vue';
import { usePopperRootContext } from '../popper/context';
import { useForwardElement } from '../../composables';
import { PopperAnchor } from '../popper';
import type { PopperTriggerProps } from '../popper/types';
import { usePopperTrigger } from '../popper/use-popper-trigger';
import { TOOLTIP_OPEN } from './shared';
import type { TooltipOpenEventDetail } from './shared';
import { useTooltipRootContext } from './context';
import type { TooltipTriggerProps } from './types';

defineOptions({
  name: 'TooltipTrigger'
});

withDefaults(defineProps<TooltipTriggerProps>(), {
  as: 'button'
});

const { delayDuration, disableClosingTrigger, ignoreNonKeyboardFocus, disabled, popupId, provider } =
  useTooltipRootContext('TooltipTrigger');
const popperContext = usePopperRootContext('TooltipTrigger');

const [, setTriggerElement] = useForwardElement(popperContext.onTriggerElementChange);

// All hover timing (open delay, skip-delay window, focus gating) runs on the shared Popper
// trigger machine. Sibling skip-delay coordination comes from the delay group provided by
// `TooltipProvider`; without one the per-root machine keeps working standalone.
const shellTriggerProps: PopperTriggerProps = reactive({
  trigger: 'hover',
  get openDelay() {
    return delayDuration.value;
  },
  closeDelay: 0,
  focusOpenDelay: 0,
  get skipDelayDuration() {
    return provider.skipDelayDuration.value;
  },
  openOnFocus: true,
  get focusVisibleOnly() {
    return ignoreNonKeyboardFocus.value;
  },
  get disabled() {
    return disabled.value;
  }
});

const { onBlur, onFocus, onPointerCancel, onPointerDown, onPointerEnter, onPointerLeave, onPointerMove, onPointerUp } =
  usePopperTrigger(shellTriggerProps, popperContext, { onVirtualPointChange: () => {} });

const dataState = computed(() => {
  if (!popperContext.open.value) return 'closed' as const;
  return popperContext.wasOpenDelayed.value ? ('delayed-open' as const) : ('instant-open' as const);
});

// Pointer down on an open trigger closes the tooltip unless `disableClosingTrigger` is set;
// the dismiss layer alone won't, because it prevents dismissal for trigger targets.
function onTriggerPointerDown(event: PointerEvent) {
  onPointerDown(event);

  if (popperContext.open.value && !disableClosingTrigger.value) {
    popperContext.onOpenChange(false, 'imperative');
  }
}

/**
 * Cross-root coordination broadcast: independent tooltips don't share a Vue
 * ancestor beyond `document`, so every open announces itself there and each
 * open tooltip (positioner listener) closes on broadcasts from other roots.
 */
watchPostEffect(() => {
  if (!popperContext.open.value) return;

  document.dispatchEvent(
    new CustomEvent<TooltipOpenEventDetail>(TOOLTIP_OPEN, {
      detail: { sourceId: popupId }
    })
  );
});
</script>

<template>
  <PopperAnchor
    :ref="setTriggerElement"
    :as="as"
    :as-child="asChild"
    :reference="reference"
    data-vean-tooltip-trigger
    data-grace-area-trigger
    :aria-describedby="popperContext.open.value ? popupId : undefined"
    :data-state="dataState"
    :data-disabled="disabled ? '' : undefined"
    @blur="onBlur"
    @focus="onFocus"
    @pointercancel="onPointerCancel"
    @pointerdown="onTriggerPointerDown"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <slot />
  </PopperAnchor>
</template>
