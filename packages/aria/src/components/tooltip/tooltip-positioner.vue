<script setup lang="ts">
import { computed, onWatcherCleanup, watchPostEffect } from 'vue';
import { defu } from '../../shared';
import { usePopperRootContext } from '../popper/context';
import { useForwardListeners } from '../../composables';
import type { PointerDownOutsideEvent } from '../../types';
import { PopperPositioner } from '../popper';
import { TOOLTIP_OPEN } from './shared';
import type { TooltipOpenEventDetail } from './shared';
import { useTooltipRootContext } from './context';
import type { TooltipPositionerProps, TooltipPositionerEmits } from './types';

defineOptions({
  name: 'TooltipPositioner'
});

const props = withDefaults(defineProps<TooltipPositionerProps>(), {
  avoidCollisions: true,
  prioritizePosition: true
});

const emit = defineEmits<TooltipPositionerEmits>();

const listeners = useForwardListeners<keyof TooltipPositionerEmits>(emit);

const {
  positionerProps: contextPositionerProps,
  disableHoverableContent,
  disableClosingTrigger,
  popupId
} = useTooltipRootContext('TooltipPositioner');

const { open, triggerElement, onOpenChange } = usePopperRootContext('TooltipPositioner');

function close() {
  onOpenChange(false, 'trigger-hover');
}

/**
 * Cross-root coordination: any tooltip opening broadcasts `tooltip.open` on
 * `document` (see `TooltipTrigger`); every OTHER open tooltip closes in
 * response. The opener is identified by its popup id so a tooltip never
 * closes itself — popups stay mounted here, so the listener cannot be scoped
 * to the open state.
 */
watchPostEffect(() => {
  const handleOpenBroadcast = (event: Event) => {
    const sourceId = (event as CustomEvent<TooltipOpenEventDetail>).detail?.sourceId;
    if (sourceId && sourceId !== popupId) {
      close();
    }
  };

  document.addEventListener(TOOLTIP_OPEN, handleOpenBroadcast);
  onWatcherCleanup(() => {
    document.removeEventListener(TOOLTIP_OPEN, handleOpenBroadcast);
  });
});

// With `disableClosingTrigger`, a pointer down landing on the trigger must not dismiss.
function onPointerDownOutside(event: PointerDownOutsideEvent) {
  if (disableClosingTrigger.value && triggerElement.value?.contains(event.target as Node)) {
    event.preventDefault();
  }

  emit('pointerDownOutside', event);
}

listeners.pointerDownOutside = onPointerDownOutside;

const resolvedProps = computed(() =>
  defu(props, contextPositionerProps.value ?? {}, {
    side: 'top',
    sideOffset: 0,
    align: 'center',
    avoidCollisions: true,
    disableHoverableContent: disableHoverableContent.value,
    onGracePointerExit: close
  } satisfies TooltipPositionerProps)
);

// Close on scroll of any ancestor scroll container of the trigger. Observed only while open.
watchPostEffect(() => {
  if (!open.value) return;

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target?.contains(triggerElement.value!)) {
      close();
    }
  };

  window.addEventListener('scroll', handleScroll);
  onWatcherCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<template>
  <PopperPositioner v-bind="resolvedProps" data-vean-tooltip-positioner v-on="listeners">
    <slot />
  </PopperPositioner>
</template>
