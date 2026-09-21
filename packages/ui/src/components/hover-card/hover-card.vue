<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { HoverCardCompact, provideHoverCardUi } from '@vean/aria/hover-card';
import { hoverCardVariants } from '@/styles/hover-card';
import type { HoverCardProps, HoverCardEmits, HoverCardSlots } from './types';

defineOptions({
  name: 'SHoverCard'
});

const props = withDefaults(defineProps<HoverCardProps>(), {
  open: undefined,
  showArrow: true
});

const emit = defineEmits<HoverCardEmits>();

defineSlots<HoverCardSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const ui = computed(() => hoverCardVariants({ size: props.size }, props.ui, { popup: props.class }));

provideHoverCardUi(ui);
</script>

<template>
  <HoverCardCompact v-bind="forwardedProps" v-on="listeners">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <slot />
  </HoverCardCompact>
</template>
