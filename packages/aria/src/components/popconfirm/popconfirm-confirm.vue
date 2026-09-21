<script setup lang="ts">
import { usePopperRootContext } from '../popper/context';
import Button from '../button/button.vue';
import { usePopconfirmUi } from './context';
import type { PopconfirmConfirmProps, PopconfirmConfirmEmits } from './types';

defineOptions({
  name: 'PopconfirmConfirm'
});

const props = defineProps<PopconfirmConfirmProps>();

const emit = defineEmits<PopconfirmConfirmEmits>();

const cls = usePopconfirmUi('confirm');

const { onOpenChange } = usePopperRootContext('PopconfirmConfirm');

const handleClose = (event: PointerEvent) => {
  emit('confirm', event);
  onOpenChange(false);
};
</script>

<template>
  <Button v-bind="props" data-vean-popconfirm-confirm :class="cls" @click="handleClose">
    <slot />
  </Button>
</template>
