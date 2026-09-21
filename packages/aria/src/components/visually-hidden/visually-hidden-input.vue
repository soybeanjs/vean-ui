<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { isArrayValue, parseFormValue } from '../../shared';
import type { FormNameValueProps } from '../../types';
import type { VisuallyHiddenInputProps } from './types';
import VisuallyHiddenInputBubble from './visually-hidden-input-bubble.vue';

defineOptions({
  name: 'VisuallyHiddenInput',
  inheritAttrs: false
});

const props = withDefaults(defineProps<VisuallyHiddenInputProps>(), {
  feature: 'fully-hidden',
  checked: undefined
});

const attrs = useAttrs();

const parsedValue = computed<FormNameValueProps[]>(() => {
  const { value, name } = props;

  return parseFormValue(name, value);
});

const isFormArrayEmptyAndRequired = computed(
  () => props.required && isArrayValue(props.value) && props.value.length === 0
);
</script>

<template>
  <!-- We render single input if it's required -->
  <VisuallyHiddenInputBubble
    v-if="isFormArrayEmptyAndRequired"
    :key="name"
    v-bind="{ ...props, ...attrs }"
    data-vean-visually-hidden-input
    :name="name"
    :value="value"
  />
  <template v-else>
    <VisuallyHiddenInputBubble
      v-for="parsed in parsedValue"
      :key="parsed.name"
      v-bind="{ ...props, ...attrs }"
      data-vean-visually-hidden-input
      :name="parsed.name"
      :value="parsed.value"
    />
  </template>
</template>
