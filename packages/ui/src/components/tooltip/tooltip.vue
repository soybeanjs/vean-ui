<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { TooltipCompact, provideTooltipUi } from '@vean/aria/tooltip';
import { tooltipVariants } from '@/styles/tooltip';
import type { TooltipProps, TooltipEmits, TooltipSlots } from './types';

defineOptions({
  name: 'STooltip'
});

const props = withDefaults(defineProps<TooltipProps>(), {
  open: undefined,
  defaultOpen: false,
  avoidCollisions: true,
  showArrow: true
});

const emit = defineEmits<TooltipEmits>();

defineSlots<TooltipSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const ui = computed(() => tooltipVariants({ size: props.size }, props.ui, { popup: props.class }));

provideTooltipUi(ui);
</script>

<template>
  <TooltipCompact v-bind="forwardedProps" v-on="listeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <slot />
  </TooltipCompact>
</template>
