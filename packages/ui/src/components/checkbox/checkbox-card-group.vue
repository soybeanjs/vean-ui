<script setup lang="ts" generic="T extends CheckboxCardGroupOptionData = CheckboxCardGroupOptionData">
import { computed } from 'vue';
import { CheckboxCardGroupCompact, provideCheckboxCardUi } from '@vean/aria/checkbox';
import { useOmitProps } from '@vean/aria/composables';
import { checkboxCardVariants } from '@/styles/checkbox';
import type { CheckboxCardGroupProps, CheckboxCardGroupEmits, CheckboxCardGroupOptionData } from './types';

defineOptions({
  name: 'SCheckboxCardGroup'
});

const props = withDefaults(defineProps<CheckboxCardGroupProps<T>>(), {
  rovingFocus: true
});

const emit = defineEmits<CheckboxCardGroupEmits<T['value']>>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'color', 'size', 'shape']);

const ui = computed(() =>
  checkboxCardVariants(
    {
      color: props.color,
      size: props.size,
      shape: props.shape
    },
    props.ui,
    { groupRoot: props.class }
  )
);

provideCheckboxCardUi(ui);
</script>

<template>
  <CheckboxCardGroupCompact v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)" />
</template>
