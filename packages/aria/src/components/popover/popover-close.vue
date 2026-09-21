<script setup lang="ts">
import { usePopperRootContext } from '../popper/context';
import Button from '../button/button.vue';
import { usePopoverUi } from './context';
import type { PopoverCloseProps, PopoverCloseEmits } from './types';

defineOptions({
  name: 'PopoverClose'
});

const props = defineProps<PopoverCloseProps>();

const emit = defineEmits<PopoverCloseEmits>();

const { onOpenChange } = usePopperRootContext('PopoverClose');

const cls = usePopoverUi('close');

const onClose = (event: PointerEvent) => {
  emit('close', event);
  onOpenChange(false);
};
</script>

<template>
  <Button data-vean-popover-close v-bind="props" :class="cls" @click="onClose">
    <slot />
  </Button>
</template>
