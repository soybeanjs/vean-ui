<script setup lang="ts">
import { shallowRef } from 'vue';
import { useForwardListeners, usePresence } from '../../composables';
import { usePopperRootContext } from './context';
import PopperPositionerImpl from './popper-positioner-impl.vue';
import type { PopperPositionerProps, PopperPositionerEmits } from './types';

defineOptions({
  name: 'PopperPositioner'
});

const props = withDefaults(defineProps<PopperPositionerProps>(), {
  avoidCollisions: true,
  prioritizePosition: true
});

const emit = defineEmits<PopperPositionerEmits>();

const listeners = useForwardListeners(emit);

const { open, popupElement } = usePopperRootContext('PopperPositioner');
const isPresent = props.forceMount ? shallowRef(true) : usePresence(popupElement, open);
</script>

<template>
  <PopperPositionerImpl v-if="isPresent" v-bind="props" data-vean-popper-positioner v-on="listeners">
    <slot />
  </PopperPositionerImpl>
</template>
