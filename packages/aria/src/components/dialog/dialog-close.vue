<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { useDialogRootContext, useDialogUi } from './context';
import type { DialogCloseProps, DialogCloseEmits } from './types';

defineOptions({
  name: 'DialogClose'
});

const props = withDefaults(defineProps<DialogCloseProps>(), {
  as: 'button'
});

const emit = defineEmits<DialogCloseEmits>();

const attrs = useAttrs();

const cls = useDialogUi('close');

const { onOpenChange } = useDialogRootContext('DialogClose');

const messages = useLocaleMessages();

const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? messages.value.dialog.close);

const onClose = async (event: MouseEvent) => {
  emit('close', event);

  onOpenChange(false);
};
</script>

<template>
  <Button v-bind="props" data-vean-dialog-close :aria-label="ariaLabel" :class="cls" @click="onClose">
    <slot>
      <Icon icon="lucide:x" />
    </slot>
  </Button>
</template>
