<script setup lang="ts">
import { computed } from 'vue';
import { Primitive } from '../primitive';
import { getSelectedLabels } from './shared';
import { useComboboxRootContext, useComboboxUi } from './context';
import type { ComboboxValueProps } from './types';

defineOptions({
  name: 'ComboboxValue'
});

const props = withDefaults(defineProps<ComboboxValueProps>(), {
  as: 'span',
  asChild: false,
  items: () => [],
  placeholder: '',
  separator: ', '
});

const { modelValue } = useComboboxRootContext('ComboboxValue');

const cls = useComboboxUi('value');

const selectedLabels = computed(() => getSelectedLabels(modelValue.value, props.items));

const displayText = computed(() =>
  selectedLabels.value.length ? selectedLabels.value.join(props.separator) : props.placeholder
);
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-combobox-value
    :class="cls"
    :data-placeholder="!selectedLabels.length ? '' : undefined"
  >
    <slot :model-value="modelValue" :selected-labels="selectedLabels">
      {{ displayText }}
    </slot>
  </Primitive>
</template>
