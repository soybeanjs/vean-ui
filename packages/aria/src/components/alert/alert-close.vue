<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Button from '../button/button.vue';
import { useAlertRootContext, useAlertUi } from './context';
import type { AlertCloseProps, AlertCloseEmits } from './types';

defineOptions({
  name: 'AlertClose'
});

const props = defineProps<AlertCloseProps>();

const emit = defineEmits<AlertCloseEmits>();

const attrs = useAttrs();

const messages = useLocaleMessages();

const { onOpenChange } = useAlertRootContext('AlertClose');

const cls = useAlertUi('close');

const ariaLabel = computed(() => {
  const label = attrs['aria-label'];
  return typeof label === 'string' && label.trim() ? label : messages.value.alert.close;
});

const onClose = (event: PointerEvent) => {
  emit('close', event);

  onOpenChange(false);
};
</script>

<template>
  <Button v-bind="props" data-vean-alert-close :class="cls" :aria-label="ariaLabel" @click="onClose">
    <slot />
  </Button>
</template>
