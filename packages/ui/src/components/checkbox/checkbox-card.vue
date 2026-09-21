<script setup lang="ts">
import { computed } from 'vue';
import { CheckboxCardCompact, provideCheckboxCardUi } from '@vean/aria/checkbox';
import { useOmitProps } from '@vean/aria/composables';
import { checkboxCardVariants } from '@/styles/checkbox';
import type { CheckboxCardProps, CheckboxEmits } from './types';

defineOptions({
  name: 'SCheckboxCard'
});

const props = withDefaults(defineProps<CheckboxCardProps>(), {
  modelValue: undefined
});

const emit = defineEmits<CheckboxEmits>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'color', 'size', 'shape']);

const ui = computed(() =>
  checkboxCardVariants(
    {
      color: props.color,
      size: props.size,
      shape: props.shape
    },
    props.ui,
    { root: props.class }
  )
);

provideCheckboxCardUi(ui);
</script>

<template>
  <CheckboxCardCompact v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <template #description>
      <slot name="description" />
    </template>
    <slot />
  </CheckboxCardCompact>
</template>
