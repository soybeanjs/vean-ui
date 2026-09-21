<script setup lang="ts">
import { PopperRoot } from '../popper';
import type { PopoverRootProps, PopoverRootEmits } from './types';

defineOptions({
  name: 'PopoverRoot',
  inheritAttrs: false
});

const props = defineProps<PopoverRootProps>();

const emit = defineEmits<PopoverRootEmits>();

function onOpenChange(value: boolean) {
  emit('update:open', value);
}
</script>

<template>
  <PopperRoot v-slot="slotProps" v-bind="props" @update:open="onOpenChange">
    <slot v-bind="slotProps" />
  </PopperRoot>
</template>
