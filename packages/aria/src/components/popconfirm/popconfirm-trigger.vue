<script setup lang="ts">
import { PopperTrigger } from '../popper';
import type { PopconfirmTriggerProps } from './types';

defineOptions({
  name: 'PopconfirmTrigger'
});

const props = defineProps<PopconfirmTriggerProps>();
</script>

<template>
  <PopperTrigger v-bind="props" data-vean-popconfirm-trigger aria-haspopup="dialog">
    <slot />
  </PopperTrigger>
</template>
