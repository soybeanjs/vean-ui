<script setup lang="ts">
import { usePopperRootContext } from '../popper/context';
import Button from '../button/button.vue';
import { usePopconfirmUi } from './context';
import type { PopconfirmCloseProps, PopconfirmCloseEmits } from './types';

defineOptions({
  name: 'PopconfirmClose'
});

const props = defineProps<PopconfirmCloseProps>();

const emit = defineEmits<PopconfirmCloseEmits>();

const { onOpenChange } = usePopperRootContext('PopconfirmClose');

const cls = usePopconfirmUi('close');

function onClose(event: PointerEvent) {
  emit('close', event);
  onOpenChange(false);
}
</script>

<template>
  <Button data-vean-popconfirm-close v-bind="props" :class="cls" @click="onClose">
    <slot />
  </Button>
</template>
