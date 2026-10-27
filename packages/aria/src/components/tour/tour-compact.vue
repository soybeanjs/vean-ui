<script setup lang="ts">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { useForwardListeners, useOmitProps } from '../../composables';
import TourContent from './tour-content.vue';
import TourRoot from './tour-root.vue';
import type { TourCompactProps, TourCompactEmits, TourCompactSlots } from './types';

defineOptions({
  name: 'TourCompact',
  inheritAttrs: false
});

const props = withDefaults(defineProps<TourCompactProps>(), {
  open: undefined,
  defaultOpen: false,
  modelValue: undefined,
  current: undefined,
  defaultCurrent: 0,
  lockScroll: true,
  autoScroll: true,
  spotlightPadding: 6,
  spotlightRadius: 2,
  showMask: true,
  maskClosable: false,
  showArrow: true,
  showClose: true,
  showProgress: true
});

const emit = defineEmits<TourCompactEmits>();

const slots = defineSlots<TourCompactSlots>();

const rootProps = useOmitProps(props, [
  'showMask',
  'maskClosable',
  'showArrow',
  'showClose',
  'showProgress',
  'previousText',
  'nextText',
  'finishText',
  'closeLabel',
  'portalProps',
  'positionerProps',
  'popupProps',
  'arrowProps'
]);
const listeners = useForwardListeners(emit);
const slotNames = computed(() => keysOf(slots).filter(slotName => slotName !== 'default'));
</script>

<template>
  <TourRoot v-bind="rootProps" v-on="listeners">
    <template v-if="slots.default" #steps>
      <slot />
    </template>
    <template #default>
      <TourContent v-bind="props">
        <template v-for="slotName in slotNames" :key="slotName" #[slotName]="contentProps">
          <slot :name="slotName" v-bind="contentProps" />
        </template>
      </TourContent>
    </template>
  </TourRoot>
</template>
