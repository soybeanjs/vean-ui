<script setup lang="ts">
import Button from '../button/button.vue';
import { useDialogRootContext, useDialogUi } from './context';
import type { DialogConfirmProps, DialogConfirmEmits } from './types';

defineOptions({
  name: 'DialogConfirm'
});

const props = withDefaults(defineProps<DialogConfirmProps>(), {
  as: 'button'
});

const emit = defineEmits<DialogConfirmEmits>();

const cls = useDialogUi('confirm');

const { onOpenChange } = useDialogRootContext('DialogConfirm');

const onConfirm = async (event: MouseEvent) => {
  emit('confirm', event);

  onOpenChange(false);
};
</script>

<template>
  <Button v-bind="props" data-vean-dialog-confirm :class="cls" @click="onConfirm">
    <slot />
  </Button>
</template>
