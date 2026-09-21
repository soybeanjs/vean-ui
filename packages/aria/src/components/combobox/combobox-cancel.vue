<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { useComboboxRootContext, useComboboxUi } from './context';
import type { ComboboxCancelProps } from './types';

defineOptions({
  name: 'ComboboxCancel'
});

const props = withDefaults(defineProps<ComboboxCancelProps>(), {
  as: 'button'
});

const cls = useComboboxUi('cancel');

const { disabled: rootDisabled, inputElement, filterSearch } = useComboboxRootContext('ComboboxCancel');

const disabled = computed(() => props.disabled || rootDisabled.value || false);
const tag = computed(() => (props.as === 'button' ? 'button' : undefined));
const tabindex = computed(() => {
  if (disabled.value) {
    return -1;
  }

  return props.as === 'button' ? undefined : 0;
});

const onClick = () => {
  if (disabled.value) {
    return;
  }

  filterSearch.value = '';

  const input = inputElement.value;

  if (input) {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.focus();
  }
};
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-combobox-cancel
    :class="cls"
    :type="tag"
    :aria-disabled="disabled || undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-normal="disabled ? undefined : ''"
    :disabled="disabled"
    :tabindex="tabindex"
    @click="onClick"
  >
    <slot />
  </Primitive>
</template>
