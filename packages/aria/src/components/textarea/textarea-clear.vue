<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { useTextareaRootContext, useTextareaUi } from './context';
import type { TextareaClearProps, TextareaClearEmits } from './types';

defineOptions({
  name: 'TextareaClear'
});

const props = defineProps<TextareaClearProps>();

const emit = defineEmits<TextareaClearEmits>();

const attrs = useAttrs();

const cls = useTextareaUi('clear');
const messages = useLocaleMessages();

const { disabled: rootDisabled, readonly, onClear } = useTextareaRootContext('TextareaClear');

const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? messages.value.textarea.clear);

const disabled = computed(() => props.disabled || rootDisabled.value || readonly.value || false);

const handleClear = (event: PointerEvent) => {
  emit('clear', event);

  onClear();
};
</script>

<template>
  <Button
    v-bind="props"
    data-vean-textarea-clearable
    :class="cls"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="handleClear"
  >
    <slot>
      <Icon icon="lucide:x" :aria-hidden="true" />
    </slot>
  </Button>
</template>
