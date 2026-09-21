<script setup lang="ts">
import { usePopperRootContext } from '../popper/context';
import Button from '../button/button.vue';
import { usePopconfirmUi } from './context';
import type { PopconfirmCancelProps, PopconfirmCancelEmits } from './types';

defineOptions({
  name: 'PopconfirmCancel'
});

const props = defineProps<PopconfirmCancelProps>();

const emit = defineEmits<PopconfirmCancelEmits>();

const cls = usePopconfirmUi('cancel');

const { onOpenChange } = usePopperRootContext('PopconfirmCancel');

const handleClose = async (event: PointerEvent) => {
  emit('cancel', event);
  onOpenChange(false);
};
</script>

<template>
  <Button v-bind="props" data-vean-popconfirm-cancel :class="cls" @click="handleClose">
    <slot />
  </Button>
</template>
