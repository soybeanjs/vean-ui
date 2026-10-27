<script setup lang="ts">
import { TourStepRoot } from '@vean/aria/tour';
import type { TourStepProps, TourStepSlots } from '@vean/aria/tour';

defineOptions({
  name: 'STourStep'
});

const props = withDefaults(defineProps<TourStepProps>(), {
  showMask: undefined,
  showArrow: undefined,
  showClose: undefined
});

const slots = defineSlots<TourStepSlots>();
</script>

<template>
  <TourStepRoot v-bind="props">
    <template v-if="slots.default" #default>
      <slot />
    </template>
  </TourStepRoot>
</template>
