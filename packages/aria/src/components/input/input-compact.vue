<script setup lang="ts">
import { useForwardElement, useOmitProps } from '../../composables';
import InputClear from './input-clear.vue';
import InputControl from './input-control.vue';
import InputRoot from './input-root.vue';
import type { InputCompactProps, InputCompactEmits, InputCompactSlots } from './types';

defineOptions({
  name: 'InputCompact'
});

const props = defineProps<InputCompactProps>();

const emit = defineEmits<InputCompactEmits>();

defineSlots<InputCompactSlots>();

const forwardedProps = useOmitProps(props, ['inputRef', 'clearable', 'controlProps', 'clearProps']);

const [_, setInputElement] = useForwardElement(el => props.inputRef?.(el as HTMLInputElement));
</script>

<template>
  <InputRoot
    v-slot="{ clear, modelValue }"
    v-bind="forwardedProps"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot name="leading" :clear="clear" :model-value="modelValue" />
    <InputControl v-bind="controlProps" :ref="setInputElement" />
    <template v-if="clearable">
      <slot name="clear" :clear="clear" :model-value="modelValue">
        <InputClear v-bind="clearProps" @clear="emit('clear', $event)" />
      </slot>
    </template>
    <slot name="trailing" :clear="clear" :model-value="modelValue" />
  </InputRoot>
</template>
