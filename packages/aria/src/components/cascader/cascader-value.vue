<script setup lang="ts">
import { computed } from 'vue';
import { useCascaderRootContext, useCascaderUi } from './context';
import type { CascaderValueProps } from './types';

defineOptions({
  name: 'CascaderValue'
});

const props = withDefaults(defineProps<CascaderValueProps>(), {
  placeholder: ''
});

const { modelValue, selectedLabels, placeholder, multiple, separator } = useCascaderRootContext('CascaderValue');

const cls = useCascaderUi('value');

const isPlaceholder = computed(() => selectedLabels.value.length === 0);

const slotText = computed(() => {
  if (selectedLabels.value.length === 0) {
    return props.placeholder || placeholder.value || '';
  }
  // `selectedLabels` of a single selection is already the joined path labels.
  return selectedLabels.value.join(multiple.value ? ', ' : (separator.value ?? ' / '));
});
</script>

<template>
  <span
    data-vean-cascader-value
    :class="cls"
    :data-placeholder="isPlaceholder ? slotText : undefined"
    style="pointer-events: none"
  >
    <slot :model-value="modelValue" :selected-labels="selectedLabels" :slot-text="slotText">
      {{ slotText }}
    </slot>
  </span>
</template>
