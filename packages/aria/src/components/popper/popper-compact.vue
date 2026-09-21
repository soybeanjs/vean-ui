<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import PopperArrow from './popper-arrow.vue';
import PopperPopup from './popper-popup.vue';
import PopperPortal from './popper-portal.vue';
import PopperPositioner from './popper-positioner.vue';
import PopperRoot from './popper-root.vue';
import PopperTrigger from './popper-trigger.vue';
import type { PopperCompactProps, PopperCompactEmits, PopperCompactSlots, PopperOpenChangeReason } from './types';

defineOptions({
  name: 'PopperCompact',
  inheritAttrs: false
});

const props = withDefaults(defineProps<PopperCompactProps>(), {
  open: undefined,
  defaultOpen: false,
  modal: undefined,
  trigger: 'click',
  openOnFocus: undefined,
  showArrow: true
});

const emit = defineEmits<PopperCompactEmits>();

defineSlots<PopperCompactSlots>();

const forwardedRootProps = useOmitProps(props, [
  'trigger',
  'openDelay',
  'closeDelay',
  'skipDelayDuration',
  'pressOpenDelay',
  'openOnFocus',
  'placement',
  'showArrow',
  'triggerProps',
  'portalProps',
  'positionerProps',
  'popupProps',
  'arrowProps'
]);

const listeners = useForwardListeners(emit);

const triggerProps = computed(() => ({
  ...props.triggerProps,
  trigger: props.triggerProps?.trigger ?? props.trigger,
  openDelay: props.triggerProps?.openDelay ?? props.openDelay,
  closeDelay: props.triggerProps?.closeDelay ?? props.closeDelay,
  skipDelayDuration: props.triggerProps?.skipDelayDuration ?? props.skipDelayDuration,
  pressOpenDelay: props.triggerProps?.pressOpenDelay ?? props.pressOpenDelay,
  openOnFocus: props.triggerProps?.openOnFocus ?? props.openOnFocus,
  asChild: props.triggerProps?.asChild ?? true
}));

const positionerProps = computed(() => ({
  ...props.positionerProps,
  placement: props.placement ?? props.positionerProps?.placement
}));

function onOpenChange(value: boolean, reason: PopperOpenChangeReason) {
  emit('update:open', value, reason);
}
</script>

<template>
  <PopperRoot v-slot="slotProps" v-bind="forwardedRootProps" @update:open="onOpenChange">
    <PopperTrigger v-bind="triggerProps">
      <slot name="trigger" />
    </PopperTrigger>

    <PopperPortal v-bind="portalProps">
      <PopperPositioner v-bind="positionerProps" v-on="listeners">
        <PopperPopup v-bind="popupProps">
          <slot v-bind="slotProps" />
          <PopperArrow v-if="showArrow" v-bind="arrowProps" />
        </PopperPopup>
      </PopperPositioner>
    </PopperPortal>
  </PopperRoot>
</template>
