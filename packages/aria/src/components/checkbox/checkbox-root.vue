<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { isFormControl, isNullish, isValueEqualOrExist, toContext } from '../../shared';
import { useControllableState } from '../../composables';
import type { CheckedState } from '../../types';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideCheckboxRootContext, useCheckboxGroupRootContext, useCheckboxUi } from './context';
import type { CheckboxRootProps, CheckboxRootEmits } from './types';

defineOptions({
  name: 'CheckboxRoot'
});

const props = withDefaults(defineProps<CheckboxRootProps>(), {
  modelValue: undefined,
  value: 'on'
});

const emit = defineEmits<CheckboxRootEmits>();

const cls = useCheckboxUi('root');

const rootElement = useTemplateRef<HTMLDivElement>('rootElement');

const groupContext = useCheckboxGroupRootContext();

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? null
);

const formControl = computed(() => isFormControl(rootElement.value));
const disabled = computed(() => groupContext?.disabled?.value || props.disabled);
const state = computed<CheckedState>(() => {
  if (!isNullish(groupContext?.modelValue?.value)) {
    return isValueEqualOrExist(groupContext?.modelValue.value, props.value);
  }

  if (isNullish(modelValue.value)) {
    return false;
  }

  return modelValue.value === 'indeterminate' ? 'indeterminate' : modelValue.value;
});

const { dataState } = provideCheckboxRootContext({
  ...toContext(props, ['value', 'name', 'required']),
  modelValue,
  disabled,
  state
});
</script>

<template>
  <div ref="rootElement" data-vean-checkbox-root :class="cls" :data-state="dataState">
    <slot :model-value="modelValue" :state="state" />

    <VisuallyHiddenInput
      v-if="formControl && name && !groupContext"
      type="checkbox"
      :checked="!!state"
      :name="name"
      :value="value"
      :disabled="disabled"
      :required="required"
    />
  </div>
</template>
