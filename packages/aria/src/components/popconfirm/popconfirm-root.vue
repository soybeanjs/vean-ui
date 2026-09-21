<script setup lang="ts">
import { PopperRoot } from '../popper';
import type { PopperOpenChangeReason } from '../popper/types';
import type { PopconfirmRootProps, PopconfirmRootEmits } from './types';

defineOptions({
  name: 'PopconfirmRoot',
  inheritAttrs: false
});

const props = defineProps<PopconfirmRootProps>();

const emit = defineEmits<PopconfirmRootEmits>();

function onOpenChange(value: boolean, reason: PopperOpenChangeReason) {
  emit('update:open', value, reason);
}
</script>

<template>
  <PopperRoot v-slot="slotProps" v-bind="props" @update:open="onOpenChange">
    <slot v-bind="slotProps" />
  </PopperRoot>
</template>
