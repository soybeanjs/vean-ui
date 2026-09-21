<script setup lang="ts" generic="T extends CheckboxGroupOptionData = CheckboxGroupOptionData">
import { computed } from 'vue';
import { CheckboxGroupCompact, provideCheckboxUi } from '@vean/aria/checkbox';
import { useOmitProps } from '@vean/aria/composables';
import { checkboxVariants } from '@/styles/checkbox';
import type { CheckboxGroupProps, CheckboxGroupEmits, CheckboxGroupOptionData } from './types';

defineOptions({
  name: 'SCheckboxGroup'
});

const props = withDefaults(defineProps<CheckboxGroupProps<T>>(), {
  rovingFocus: true
});

const emit = defineEmits<CheckboxGroupEmits<T['value']>>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'color', 'size', 'shape']);

const ui = computed(() =>
  checkboxVariants(
    {
      color: props.color,
      size: props.size,
      shape: props.shape,
      orientation: props.orientation
    },
    props.ui,
    { groupRoot: props.class }
  )
);

provideCheckboxUi(ui);
</script>

<template>
  <CheckboxGroupCompact v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)" />
</template>
