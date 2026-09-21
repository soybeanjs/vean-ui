<script setup lang="ts" generic="T extends DefinedValue, M extends boolean = false">
import { computed } from 'vue';
import { isFormControl, isNullish, toContext } from '../../shared';
import { useControllableState, useSelection } from '../../composables';
import type { DefinedValue } from '../../types';
import { PopperPositioningRoot } from '../popper';
import { provideCollectionContext, provideSelectRootContext } from './context';
import SelectBubbleSelect from './select-bubble-select.vue';
import type { SelectRootProps, SelectRootEmits } from './types';

defineOptions({
  name: 'SelectRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<SelectRootProps<T, M>>(), {
  modelValue: undefined,
  open: undefined
});

const emit = defineEmits<SelectRootEmits<T, M>>();

const { modelValue, isMultiple, onModelValueChange, isEmptyModelValue, resetModelValue } = useSelection<
  boolean,
  DefinedValue
>(props, value => {
  emit('update:modelValue', value as NonNullable<SelectRootProps<T, M>['modelValue']>);
});

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  props.defaultOpen
);

const { dir, triggerElement, options, nativeSelectKey } = provideSelectRootContext({
  ...toContext(props, ['dir', 'autocomplete', 'disabled', 'required', 'clearable']),
  open,
  modelValue,
  onModelValueChange,
  isMultiple,
  isEmptyModelValue,
  resetModelValue
});

provideCollectionContext();

const formControl = computed(() => isFormControl(triggerElement.value));
</script>

<template>
  <PopperPositioningRoot :dir="dir">
    <slot :model-value="modelValue" :open="Boolean(open)" />

    <SelectBubbleSelect
      v-if="formControl"
      :key="nativeSelectKey"
      aria-hidden="true"
      tabindex="-1"
      :multiple="multiple"
      :required="required"
      :name="name"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :value="modelValue"
    >
      <option v-if="isNullish(modelValue)" :value="nullableValue" />
      <option v-for="option in options" :key="option.value ?? ''" v-bind="option" />
    </SelectBubbleSelect>
  </PopperPositioningRoot>
</template>
