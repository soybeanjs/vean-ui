<script setup lang="ts" generic="T extends RadioGroupOptionData">
import { useId } from 'vue';
import { useOmitProps } from '../../composables';
import RadioGroupControl from './radio-group-control.vue';
import RadioGroupIndicator from './radio-group-indicator.vue';
import RadioGroupItem from './radio-group-item.vue';
import RadioGroupLabel from './radio-group-label.vue';
import RadioGroupRoot from './radio-group-root.vue';
import type { RadioGroupCompactProps, RadioGroupCompactEmits, RadioGroupOptionData } from './types';

defineOptions({
  name: 'RadioGroupCompact'
});

const props = defineProps<RadioGroupCompactProps<T>>();

const emit = defineEmits<RadioGroupCompactEmits<T['value']>>();

const forwardedProps = useOmitProps(props, ['items', 'itemProps', 'controlProps', 'indicatorProps', 'labelProps']);

const defaultId = useId();

const getItemKey = (item: T) => String(item.value);

const getItemId = (index: number) => `${props.itemProps?.id || `radio-${defaultId}`}-${index}`;
</script>

<template>
  <RadioGroupRoot v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <RadioGroupItem
      v-for="(item, index) in items"
      :key="getItemKey(item)"
      v-bind="itemProps"
      :value="item.value"
      :disabled="disabled || item.disabled"
    >
      <RadioGroupControl v-bind="controlProps" :id="getItemId(index)">
        <Transition name="radio-group-indicator">
          <RadioGroupIndicator v-bind="indicatorProps" />
        </Transition>
      </RadioGroupControl>
      <RadioGroupLabel v-bind="labelProps">
        {{ item.label }}
      </RadioGroupLabel>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>
