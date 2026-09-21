<script setup lang="ts">
import { usePopperRootContext } from '../popper/context';
import { useForwardListeners, useHideOthers } from '../../composables';
import { PopperPositioner } from '../popper';
import type { PopconfirmPositionerProps, PopconfirmPositionerEmits } from './types';

defineOptions({
  name: 'PopconfirmPositioner'
});

const props = withDefaults(defineProps<PopconfirmPositionerProps>(), {
  avoidCollisions: true,
  prioritizePosition: true
});

const emit = defineEmits<PopconfirmPositionerEmits>();

const listeners = useForwardListeners(emit);

const { modal, positionerElement } = usePopperRootContext('PopconfirmPositioner');

useHideOthers(positionerElement, modal);
</script>

<template>
  <PopperPositioner v-bind="props" data-vean-popconfirm-positioner v-on="listeners">
    <slot />
  </PopperPositioner>
</template>
