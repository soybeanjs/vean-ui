<script setup lang="ts">
import PopperRoot from './popper-root.vue';
import type { PopperSubProps, PopperOpenChangeReason, PopperSubEmits, PopperSubSlots } from './types';

defineOptions({
  name: 'PopperSub',
  inheritAttrs: false
});

const props = withDefaults(defineProps<PopperSubProps>(), {
  open: undefined,
  defaultOpen: false,
  modal: false
});

const emit = defineEmits<PopperSubEmits>();

defineSlots<PopperSubSlots>();

function onOpenChange(value: boolean, reason: PopperOpenChangeReason) {
  emit('update:open', value, reason);
}
</script>

<template>
  <PopperRoot v-slot="slotProps" v-bind="props" @update:open="onOpenChange">
    <slot v-bind="slotProps" />
  </PopperRoot>
</template>
