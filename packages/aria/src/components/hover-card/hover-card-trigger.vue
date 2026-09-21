<script setup lang="ts">
import { usePopperRootContext } from '../popper/context';
import { PopperTrigger } from '../popper';
import { useHoverCardRootContext } from './context';
import type { HoverCardTriggerProps } from './types';

defineOptions({
  name: 'HoverCardTrigger'
});

const props = withDefaults(defineProps<HoverCardTriggerProps>(), {
  as: 'button'
});

const { openDelay, closeDelay, hasSelectionRef, isPointerDownOnPopupRef } = useHoverCardRootContext('HoverCardTrigger');
const popperContext = usePopperRootContext('HoverCardTrigger');

// Text selection / active pointer press inside the popup vetoes delayed hover closes; the guard
// runs when the shell close timer fires, so late selections are honored too.
popperContext.registerHoverCloseGuard(() => hasSelectionRef.value || isPointerDownOnPopupRef.value);
</script>

<template>
  <PopperTrigger
    v-bind="props"
    trigger="hover"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :skip-delay-duration="0"
    aria-mode="none"
    data-vean-hover-card-trigger
  >
    <slot />
  </PopperTrigger>
</template>
