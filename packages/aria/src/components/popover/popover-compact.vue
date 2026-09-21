<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import PopperArrow from '../popper/popper-arrow.vue';
import PopperPortal from '../popper/popper-portal.vue';
import PopoverClose from './popover-close.vue';
import PopoverPopup from './popover-popup.vue';
import PopoverPositioner from './popover-positioner.vue';
import PopoverRoot from './popover-root.vue';
import PopoverTrigger from './popover-trigger.vue';
import type { PopoverCompactProps, PopoverCompactEmits, PopoverCompactSlots } from './types';

defineOptions({
  name: 'PopoverCompact',
  inheritAttrs: false
});

const props = withDefaults(defineProps<PopoverCompactProps>(), {
  open: undefined,
  defaultOpen: false,
  showArrow: true
});

const emit = defineEmits<PopoverCompactEmits>();

const slots = defineSlots<PopoverCompactSlots>();

const forwardedRootProps = useOmitProps(props, [
  'placement',
  'showArrow',
  'triggerProps',
  'portalProps',
  'positionerProps',
  'popupProps',
  'arrowProps',
  'closeProps'
]);

const listeners = useForwardListeners(emit);

const triggerProps = computed(() => {
  return {
    ...props.triggerProps,
    asChild: props.triggerProps?.asChild ?? true
  };
});

const positionerProps = computed(() => {
  return {
    ...props.positionerProps,
    placement: props.placement ?? props.positionerProps?.placement
  };
});
</script>

<template>
  <PopoverRoot v-slot="slotProps" v-bind="forwardedRootProps" @update:open="emit('update:open', $event)">
    <PopoverTrigger v-bind="triggerProps">
      <slot name="trigger" />
    </PopoverTrigger>
    <PopperPortal v-bind="portalProps">
      <PopoverPositioner v-bind="positionerProps" v-on="listeners">
        <PopoverPopup v-bind="popupProps">
          <slot v-bind="slotProps" />
          <PopperArrow v-if="showArrow" v-bind="arrowProps" />
        </PopoverPopup>
        <PopoverClose v-if="slots.close" v-bind="closeProps">
          <slot name="close">
            <Icon icon="lucide:x" />
          </slot>
        </PopoverClose>
      </PopoverPositioner>
    </PopperPortal>
  </PopoverRoot>
</template>
