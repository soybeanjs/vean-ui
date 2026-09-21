<script setup lang="ts" generic="T extends CheckboxGroupOptionData = CheckboxGroupOptionData">
import { useOmitProps } from '../../composables';
import CheckboxCompact from './checkbox-compact.vue';
import CheckboxGroupRoot from './checkbox-group-root.vue';
import type { CheckboxGroupCompactProps, CheckboxGroupCompactEmits, CheckboxGroupOptionData } from './types';

defineOptions({
  name: 'CheckboxGroupCompact'
});

const props = withDefaults(defineProps<CheckboxGroupCompactProps<T>>(), {
  rovingFocus: true
});

const emit = defineEmits<CheckboxGroupCompactEmits<T['value']>>();

const forwardedProps = useOmitProps(props, ['items', 'rootProps', 'controlProps', 'indicatorProps', 'labelProps']);
</script>

<template>
  <CheckboxGroupRoot v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <CheckboxCompact
      v-for="item in items"
      v-bind="rootProps"
      :key="item.value"
      :value="item.value"
      :label="item.label"
      :disabled="disabled || item.disabled"
      :control-props="controlProps"
      :indicator-props="indicatorProps"
      :label-props="labelProps"
    />
  </CheckboxGroupRoot>
</template>
