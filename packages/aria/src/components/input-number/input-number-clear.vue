<script setup lang="ts">
import { computed } from 'vue';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { useInputNumberRootContext, useInputNumberUi } from './context';
import type { InputNumberClearProps, InputNumberClearEmits } from './types';

defineOptions({
  name: 'InputNumberClear'
});

const props = defineProps<InputNumberClearProps>();

const emit = defineEmits<InputNumberClearEmits>();

const cls = useInputNumberUi('clear');
const messages = useLocaleMessages();

const { disabled: rootDisabled, readonly, onClear } = useInputNumberRootContext('InputNumberClear');

const disabled = computed(() => props.disabled || rootDisabled.value || readonly.value || false);

const handleClear = (event: PointerEvent) => {
  emit('clear', event);

  onClear?.();
};
</script>

<template>
  <Button
    v-bind="props"
    data-vean-input-number-clear
    :class="cls"
    :aria-label="messages.inputNumber.clear"
    :disabled="disabled"
    @click="handleClear"
  >
    <slot>
      <Icon icon="lucide:x" :aria-hidden="true" />
    </slot>
  </Button>
</template>
