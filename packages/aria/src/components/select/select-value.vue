<script setup lang="ts">
import { computed } from 'vue';
import { useForwardElement } from '../../composables';
import type { AcceptableValue } from '../../types';
import { useSelectRootContext, useSelectUi } from './context';
import type { SelectValueProps } from './types';

defineOptions({
  name: 'SelectValue'
});

const props = withDefaults(defineProps<SelectValueProps>(), {
  placeholder: ''
});

const { modelValue, options, onValueElementChange } = useSelectRootContext('SelectValue');
const [_, setValueElement] = useForwardElement(onValueElementChange);

const cls = useSelectUi('value');

const selectedLabel = computed(() => {
  let list: string[] = [];

  const getOption = (value?: AcceptableValue) => options.value.find(option => value === option.value);

  if (Array.isArray(modelValue.value)) {
    list = modelValue.value.map(value => getOption(value)?.textContent ?? '');
  } else {
    list = [getOption(modelValue.value)?.textContent ?? ''];
  }
  return list.filter(Boolean);
});

const slotText = computed(() => {
  return selectedLabel.value.length ? selectedLabel.value.join(', ') : props.placeholder;
});
</script>

<template>
  <span
    :ref="setValueElement"
    data-vean-select-value
    :class="cls"
    :data-placeholder="selectedLabel.length ? undefined : props.placeholder"
    style="pointer-events: none"
  >
    <slot :model-value="modelValue" :selected-label="selectedLabel" :slot-text="slotText">
      {{ slotText }}
    </slot>
  </span>
</template>
