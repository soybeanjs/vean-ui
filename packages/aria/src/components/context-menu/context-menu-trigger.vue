<script setup lang="ts">
import { PopperTrigger } from '../popper';
import { useContextMenuRootContext } from './context';
import type { ContextMenuTriggerProps } from './types';

defineOptions({
  name: 'ContextMenuTrigger'
});

const props = withDefaults(defineProps<ContextMenuTriggerProps>(), {
  as: 'span'
});

const { pressOpenDelay } = useContextMenuRootContext('ContextMenuTrigger');
</script>

<template>
  <PopperTrigger
    v-bind="props"
    trigger="contextmenu"
    :reference="props.reference ?? undefined"
    :press-open-delay="pressOpenDelay"
    aria-mode="none"
    data-vean-context-menu-trigger
  >
    <slot />
  </PopperTrigger>
</template>
