<script setup lang="ts" generic="T extends CheckboxCardGroupOptionData = CheckboxCardGroupOptionData">
import { useOmitProps } from '../../composables';
import CheckboxCardCompact from './checkbox-card-compact.vue';
import CheckboxGroupRoot from './checkbox-group-root.vue';
import type {
  CheckboxCardGroupCompactProps,
  CheckboxCardGroupCompactEmits,
  CheckboxCardGroupOptionData
} from './types';

defineOptions({
  name: 'CheckboxCardGroupCompact'
});

const props = withDefaults(defineProps<CheckboxCardGroupCompactProps<T>>(), {
  rovingFocus: true
});

const emit = defineEmits<CheckboxCardGroupCompactEmits<T['value']>>();

const forwardedProps = useOmitProps(props, ['items', 'rootProps', 'controlProps', 'indicatorProps', 'labelProps']);
</script>

<template>
  <CheckboxGroupRoot v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <CheckboxCardCompact
      v-for="item in items"
      v-bind="rootProps"
      :key="item.value"
      :label="item.label"
      :icon="item.icon"
      :description="item.description"
      :value="item.value"
      :disabled="disabled || item.disabled"
      :control-props="controlProps"
      :indicator-props="indicatorProps"
      :label-props="labelProps"
    />
  </CheckboxGroupRoot>
</template>
