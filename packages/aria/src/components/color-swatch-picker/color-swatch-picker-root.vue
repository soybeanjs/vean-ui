<script setup lang="ts" generic="M extends boolean">
import { useControllableState, useOmitProps } from '../../composables';
import { ListboxContent, ListboxRoot } from '../listbox';
import type { ColorSwatchPickerRootProps, ColorSwatchPickerRootEmits } from './types';

defineOptions({
  name: 'ColorSwatchPickerRoot'
});

const props = withDefaults(defineProps<ColorSwatchPickerRootProps<M>>(), {
  defaultValue: undefined,
  disabled: false,
  loop: false,
  orientation: 'horizontal'
});

const emit = defineEmits<ColorSwatchPickerRootEmits<M>>();

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value as M extends true ? string[] : string);
  },
  // @ts-expect-error ignore default value type mismatch since it can be string or string[]
  props.defaultValue ?? (props.multiple ? [] : '')
);

const forwardedProps = useOmitProps(props, ['modelValue', 'defaultValue', 'class']);
</script>

<template>
  <ListboxRoot
    v-bind="forwardedProps"
    v-model="modelValue"
    data-vean-color-swatch-picker-root
    @highlight="emit('highlight', $event)"
    @entry-focus="emit('entryFocus', $event)"
    @leave="emit('leave', $event)"
  >
    <ListboxContent>
      <slot :model-value="modelValue" />
    </ListboxContent>
  </ListboxRoot>
</template>
