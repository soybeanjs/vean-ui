<script setup lang="ts">
import { useForwardElement, useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import InputNumberClear from './input-number-clear.vue';
import InputNumberControl from './input-number-control.vue';
import InputNumberDecrement from './input-number-decrement.vue';
import InputNumberIncrement from './input-number-increment.vue';
import InputNumberRoot from './input-number-root.vue';
import type { InputNumberCompactProps, InputNumberCompactEmits, InputNumberCompactSlots } from './types';

defineOptions({
  name: 'InputNumberCompact'
});

const props = defineProps<InputNumberCompactProps>();

const emit = defineEmits<InputNumberCompactEmits>();

defineSlots<InputNumberCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'inputRef',
  'controlProps',
  'clearable',
  'clearProps',
  'incrementProps',
  'decrementProps'
]);

const [_, setInputElement] = useForwardElement(el => props.inputRef?.(el as HTMLInputElement));
</script>

<template>
  <InputNumberRoot v-slot="slotProps" v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <slot name="leading" v-bind="slotProps" />
    <InputNumberControl v-bind="controlProps" :ref="setInputElement" />
    <template v-if="clearable">
      <slot name="clear" v-bind="slotProps">
        <InputNumberClear v-bind="clearProps" @clear="emit('clear', $event)" />
      </slot>
    </template>
    <slot name="trailing" v-bind="slotProps" />
    <slot name="decrement" v-bind="slotProps">
      <InputNumberDecrement v-bind="decrementProps">
        <Icon icon="lucide:minus" :aria-hidden="true" />
      </InputNumberDecrement>
    </slot>
    <slot name="increment" v-bind="slotProps">
      <InputNumberIncrement v-bind="incrementProps">
        <Icon icon="lucide:plus" :aria-hidden="true" />
      </InputNumberIncrement>
    </slot>
  </InputNumberRoot>
</template>
