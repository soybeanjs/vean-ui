<script setup lang="ts">
import { computed } from 'vue';
import { useControllableState, useOmitProps } from '../../composables';
import Button from '../button/button.vue';
import type { ToggleProps, ToggleEmits, ToggleState } from './types';

defineOptions({
  name: 'Toggle'
});

const props = withDefaults(defineProps<ToggleProps>(), {
  modelValue: undefined,
  defaultValue: false
});

const emit = defineEmits<ToggleEmits>();

const forwardedProps = useOmitProps(props, ['defaultValue', 'modelValue']);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue
);

const dataState = computed<ToggleState>(() => (modelValue.value ? 'on' : 'off'));

const onClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();

    return;
  }

  modelValue.value = !modelValue.value;
};
</script>

<template>
  <Button
    v-bind="forwardedProps"
    data-vean-toggle
    :disabled="disabled"
    :aria-pressed="modelValue"
    :data-state="dataState"
    @click="onClick"
  >
    <slot :model-value="modelValue" :pressed="modelValue" :state="dataState" :disabled="disabled" />
  </Button>
</template>
