<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../_icon/icon.vue';
import { useComboboxRootContext, useComboboxUi } from './context';
import type { ComboboxClearProps } from './types';

defineOptions({
  name: 'ComboboxClear'
});

const props = withDefaults(defineProps<ComboboxClearProps>(), {
  ariaLabel: '',
  disabled: false
});

const { modelValue, disabled: rootDisabled, filterSearch, resetModelValue } = useComboboxRootContext('ComboboxClear');

const cls = useComboboxUi('clear');

const hasValue = computed(() => {
  const value = modelValue.value;

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null;
});

const disabled = computed(() => props.disabled || rootDisabled.value || false);

const onClear = () => {
  if (disabled.value) {
    return;
  }

  filterSearch.value = '';
  resetModelValue();
};
</script>

<template>
  <button
    v-if="hasValue"
    type="button"
    data-vean-combobox-clear
    :class="cls"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-normal="disabled ? undefined : ''"
    :disabled="disabled || undefined"
    tabindex="-1"
    @click.prevent.stop="onClear"
    @pointerdown.prevent.stop
  >
    <slot>
      <Icon icon="lucide:x" />
    </slot>
  </button>
</template>
