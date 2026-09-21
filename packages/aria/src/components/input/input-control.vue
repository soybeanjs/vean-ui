<script setup lang="ts">
import { useInputRootContext, useInputUi } from './context';
import type { InputControlProps } from './types';

defineOptions({
  name: 'InputControl'
});

defineProps<InputControlProps>();

const { modelValue, disabled, readonly, inputAttrs } = useInputRootContext('InputControl');

const cls = useInputUi('control');

const onInput = (event: Event) => {
  modelValue.value = (event.target as HTMLInputElement).value;
};
</script>

<template>
  <input
    v-bind="inputAttrs"
    data-vean-input-control
    :class="cls"
    :aria-disabled="disabled ?? undefined"
    aria-roledescription="Input"
    autocorrect="off"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :disabled="disabled"
    :readonly="readonly"
    spellcheck="false"
    tabindex="0"
    :value="modelValue"
    @input="onInput"
  />
</template>
