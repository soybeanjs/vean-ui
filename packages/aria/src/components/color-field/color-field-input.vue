<script setup lang="ts">
import { shallowRef } from 'vue';
import { useColorFieldRootContext, useColorFieldUi } from './context';
import type { ColorFieldInputProps } from './types';

defineOptions({
  name: 'ColorFieldInput'
});

defineProps<ColorFieldInputProps>();

const cls = useColorFieldUi('input');

const {
  updateValue,
  commit,
  handleWheel: onWheelChange,
  increment,
  decrement,
  incrementPage,
  decrementPage,
  incrementToMax,
  decrementToMin,
  channel,
  inputValue,
  placeholder,
  disabled,
  readonly
} = useColorFieldRootContext('ColorFieldInput');

const isFocused = shallowRef(false);

function handleInput(event: Event) {
  updateValue((event.target as HTMLInputElement).value);
}

function handleBlur() {
  isFocused.value = false;
  commit();
}

function handleFocus() {
  isFocused.value = true;
}

function handleWheel(event: WheelEvent) {
  if (!isFocused.value) {
    return;
  }

  onWheelChange(event);
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      increment();
      break;
    case 'ArrowDown':
      event.preventDefault();
      decrement();
      break;
    case 'PageUp':
      event.preventDefault();
      incrementPage();
      break;
    case 'PageDown':
      event.preventDefault();
      decrementPage();
      break;
    case 'Home':
      event.preventDefault();
      decrementToMin();
      break;
    case 'End':
      event.preventDefault();
      incrementToMax();
      break;
    case 'Enter':
      event.preventDefault();
      commit();
      break;
  }
}

function handleBeforeInput(event: InputEvent) {
  if (!channel.value) {
    return;
  }

  const data = event.data;

  if (data && !/[\d.-]/.test(data)) {
    event.preventDefault();
  }
}
</script>

<template>
  <input
    data-vean-color-field-input
    :class="cls"
    type="text"
    :inputmode="channel ? 'decimal' : 'text'"
    :value="inputValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
    @keydown="handleKeydown"
    @wheel="handleWheel"
    @beforeinput="handleBeforeInput"
  />
</template>
