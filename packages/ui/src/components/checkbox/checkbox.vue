<script setup lang="ts">
import { computed } from 'vue';
import { CheckboxCompact, provideCheckboxUi } from '@vean/aria/checkbox';
import { useOmitProps } from '@vean/aria/composables';
import { checkboxVariants } from '@/styles/checkbox';
import type { CheckboxProps, CheckboxEmits } from './types';

defineOptions({
  name: 'SCheckbox'
});

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: undefined
});

const emit = defineEmits<CheckboxEmits>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'color', 'size', 'shape']);

const ui = computed(() =>
  checkboxVariants(
    {
      color: props.color,
      size: props.size,
      shape: props.shape
    },
    props.ui,
    { root: props.class }
  )
);

provideCheckboxUi(ui);
</script>

<template>
  <CheckboxCompact v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <slot />
  </CheckboxCompact>
</template>
