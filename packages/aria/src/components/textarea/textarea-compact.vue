<script setup lang="ts">
import { useForwardElement, useOmitProps } from '../../composables';
import TextareaClear from './textarea-clear.vue';
import TextareaControl from './textarea-control.vue';
import TextareaCounter from './textarea-counter.vue';
import TextareaRoot from './textarea-root.vue';
import type { TextareaCompactProps, TextareaCompactEmits, TextareaCompactSlots } from './types';

defineOptions({
  name: 'TextareaCompact'
});

const props = defineProps<TextareaCompactProps>();

const emit = defineEmits<TextareaCompactEmits>();

defineSlots<TextareaCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'textareaRef',
  'clearable',
  'showCounter',
  'controlProps',
  'clearProps',
  'counterProps'
]);

const [_, setTextareaElement] = useForwardElement(el => props.textareaRef?.(el as HTMLTextAreaElement));
</script>

<template>
  <TextareaRoot v-slot="slotProps" v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <TextareaControl v-bind="controlProps" :ref="setTextareaElement" />
    <template v-if="clearable">
      <slot name="clear" v-bind="slotProps">
        <TextareaClear v-bind="clearProps" @clear="emit('clear', $event)" />
      </slot>
    </template>
    <template v-if="showCounter">
      <slot name="counter" v-bind="slotProps">
        <TextareaCounter v-bind="counterProps" />
      </slot>
    </template>
    <slot name="footer" v-bind="slotProps" />
  </TextareaRoot>
</template>
