<script setup lang="ts">
import { PopperTrigger } from '../popper';
import type { PopoverTriggerProps } from './types';

defineOptions({
  name: 'PopoverTrigger'
});

const props = withDefaults(defineProps<PopoverTriggerProps>(), {
  as: 'button'
});
</script>

<template>
  <PopperTrigger v-bind="props" data-vean-popover-trigger aria-haspopup="dialog">
    <slot />
  </PopperTrigger>
</template>
