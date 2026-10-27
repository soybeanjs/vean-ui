<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { provideTourUi, TourCompact } from '@vean/aria/tour';
import { tourVariants } from '@/styles/tour';
import type { TourProps, TourEmits, TourSlots } from './types';

defineOptions({
  name: 'STour'
});

const props = withDefaults(defineProps<TourProps>(), {
  modelValue: undefined,
  open: undefined,
  size: 'md',
  lockScroll: true,
  showMask: true,
  maskClosable: false,
  showArrow: true,
  showClose: true,
  showProgress: true
});

const emit = defineEmits<TourEmits>();

const slots = defineSlots<TourSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'type', 'ui']);
const listeners = useForwardListeners(emit);
const slotNames = computed(() => keysOf(slots).filter(slotName => slotName !== 'default'));
const ui = computed(() =>
  tourVariants({ size: props.size, type: props.type ?? 'default' }, props.ui, { popup: props.class })
);

provideTourUi(ui);
</script>

<template>
  <TourCompact v-bind="forwardedProps" v-on="listeners">
    <slot />
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </TourCompact>
</template>
