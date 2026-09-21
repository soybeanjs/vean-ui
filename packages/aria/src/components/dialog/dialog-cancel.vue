<script setup lang="ts">
import Button from '../button/button.vue';
import { useDialogRootContext, useDialogUi } from './context';
import type { DialogCancelProps, DialogCancelEmits } from './types';

defineOptions({
  name: 'DialogCancel'
});

const props = withDefaults(defineProps<DialogCancelProps>(), {
  as: 'button'
});

const emit = defineEmits<DialogCancelEmits>();

const cls = useDialogUi('cancel');

const { setCancelElement, onOpenChange } = useDialogRootContext('DialogCancel');

const onCancel = async (event: MouseEvent) => {
  emit('cancel', event);

  onOpenChange(false);
};
</script>

<template>
  <Button :ref="setCancelElement" v-bind="props" data-vean-dialog-cancel :class="cls" @click="onCancel">
    <slot />
  </Button>
</template>
