<script setup lang="ts">
import Button from '../button/button.vue';
import { useDialogRootContext } from './context';
import type { DialogTriggerProps, DialogTriggerEmits } from './types';

defineOptions({
  name: 'DialogTrigger'
});

const props = defineProps<DialogTriggerProps>();

const emit = defineEmits<DialogTriggerEmits>();

const { open, onOpenToggle, dataState, popupId, setTriggerElement } = useDialogRootContext('DialogTrigger');

const onTriggerClick = (event: PointerEvent) => {
  emit('click', event);

  onOpenToggle();
};
</script>

<template>
  <Button
    v-bind="props"
    :ref="setTriggerElement"
    data-vean-dialog-trigger
    aria-haspopup="dialog"
    :aria-expanded="open || false"
    :aria-controls="open ? popupId : undefined"
    :data-state="dataState"
    @click="onTriggerClick"
  >
    <slot />
  </Button>
</template>
