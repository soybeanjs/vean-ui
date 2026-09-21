<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import { useInputRootContext, useInputUi } from './context';
import type { InputClearProps, InputClearEmits } from './types';

defineOptions({
  name: 'InputClear'
});

const props = defineProps<InputClearProps>();

const emit = defineEmits<InputClearEmits>();

const attrs = useAttrs();

const cls = useInputUi('clear');

const messages = useLocaleMessages();

const { disabled: rootDisabled, readonly, onClear } = useInputRootContext('InputClear');

const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? messages.value.input.clear);

const disabled = computed(() => props.disabled || rootDisabled.value || readonly.value || false);

const handleClear = (event: PointerEvent) => {
  emit('clear', event);

  onClear?.();
};
</script>

<template>
  <Button
    v-bind="props"
    data-vean-input-clearable
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
