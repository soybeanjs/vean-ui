<script setup lang="ts" generic="T extends RadioGroupCardOptionData">
import { useId } from 'vue';
import { useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import { useRadioGroupCardUi } from './context';
import RadioGroupControl from './radio-group-control.vue';
import RadioGroupIndicator from './radio-group-indicator.vue';
import RadioGroupItem from './radio-group-item.vue';
import RadioGroupLabel from './radio-group-label.vue';
import RadioGroupRoot from './radio-group-root.vue';
import type {
  RadioGroupCardCompactProps,
  RadioGroupCardCompactEmits,
  RadioGroupCardCompactSlots,
  RadioGroupCardOptionData
} from './types';

defineOptions({
  name: 'RadioGroupCardCompact'
});

const props = defineProps<RadioGroupCardCompactProps<T>>();

const emit = defineEmits<RadioGroupCardCompactEmits<T['value']>>();

const slots = defineSlots<RadioGroupCardCompactSlots<T>>();

const forwardedProps = useOmitProps(props, [
  'items',
  'itemProps',
  'controlProps',
  'indicatorProps',
  'labelProps',
  'contentProps',
  'textContentProps',
  'descriptionProps'
]);

const ui = useRadioGroupCardUi();

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
      <div v-bind="contentProps" :class="ui.content">
        <Icon :icon="item.icon" :class="ui.icon" />
        <div v-bind="textContentProps" :class="ui.textContent">
          <RadioGroupLabel v-bind="labelProps">
            {{ item.label }}
          </RadioGroupLabel>
          <p v-if="slots.description || item.description" v-bind="descriptionProps" :class="ui.description">
            <slot name="description" :item="item">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </div>
      <RadioGroupControl v-bind="controlProps" :id="getItemId(index)">
        <Transition name="radio-group-indicator">
          <RadioGroupIndicator v-bind="indicatorProps" />
        </Transition>
      </RadioGroupControl>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>
