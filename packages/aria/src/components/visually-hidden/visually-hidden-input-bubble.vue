<script setup lang="ts">
import { computed, watch } from 'vue';
import { useForwardElement } from '../../composables';
import type { VisuallyHiddenInputProps } from './types';
import VisuallyHidden from './visually-hidden.vue';

defineOptions({
  name: 'VisuallyHiddenInputBubble'
});

const props = withDefaults(defineProps<VisuallyHiddenInputProps>(), {
  feature: 'fully-hidden',
  checked: undefined
});

const [element, setElement] = useForwardElement<HTMLInputElement>();

const valueState = computed(() => props.checked ?? props.value);

watch(valueState, (newValue, prevValue) => {
  const input = element.value;

  if (!input) return;
  if (newValue === prevValue) return;

  const inputProto = window.HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'value');
  const setValue = descriptor?.set;
  if (!setValue) return;

  const inputEvent = new Event('input', { bubbles: true });
  const changeEvent = new Event('change', { bubbles: true });
  setValue.call(input, newValue);
  input.dispatchEvent(inputEvent);
  input.dispatchEvent(changeEvent);
});
</script>

<template>
  <VisuallyHidden
    :ref="setElement"
    as="input"
    data-vean-visually-hidden-input-bubble
    :feature="feature"
    :name="name"
    :value="value"
    :checked="checked"
    :required="required"
    :disabled="disabled"
  />
</template>
