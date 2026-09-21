<script setup lang="ts">
import { computed } from 'vue';
import { defu } from '../../shared';
import { usePopperRootContext } from '../popper/context';
import { useForwardListeners } from '../../composables';
import { PopperPositioner } from '../popper';
import type { HoverCardPositionerProps, HoverCardPositionerEmits } from './types';

defineOptions({
  name: 'HoverCardPositioner'
});

const props = withDefaults(defineProps<HoverCardPositionerProps>(), {
  avoidCollisions: true,
  prioritizePosition: true
});

const emit = defineEmits<HoverCardPositionerEmits>();

const listeners = useForwardListeners<keyof HoverCardPositionerEmits>(emit);

const { onOpenChange } = usePopperRootContext('HoverCardPositioner');

const resolvedProps = computed(() =>
  defu(props, {
    side: 'bottom',
    sideOffset: 4,
    align: 'center',
    avoidCollisions: true,
    onGracePointerExit: () => onOpenChange(false, 'trigger-hover')
  } satisfies HoverCardPositionerProps)
);
</script>

<template>
  <PopperPositioner v-bind="resolvedProps" data-vean-hover-card-positioner v-on="listeners">
    <slot />
  </PopperPositioner>
</template>
