<script setup lang="ts" generic="T extends AcceptableBooleanValue = boolean">
import { computed } from 'vue';
import { isFormControl, toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState, useForwardElement } from '../../composables';
import type { AcceptableBooleanValue } from '../../types';
import { VisuallyHiddenInput } from '../visually-hidden';
import { provideSwitchRootContext, useSwitchUi } from './context';
import type { SwitchRootProps, SwitchRootEmits } from './types';

const DEFAULT_TRUE_VALUE: NonNullable<AcceptableBooleanValue> = true;
const DEFAULT_FALSE_VALUE: NonNullable<AcceptableBooleanValue> = false;

defineOptions({
  name: 'SwitchRoot'
});

const props = withDefaults(defineProps<SwitchRootProps<T>>(), {
  modelValue: undefined,
  value: 'on'
});

const emit = defineEmits<SwitchRootEmits<T>>();

const [rootElement, setRootElement] = useForwardElement();

const cls = useSwitchUi('root');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value as NonNullable<T>);
  },
  (props.defaultValue ?? null) as unknown as Exclude<T, undefined>
);

const direction = useDirection(() => props.dir);

const formControl = computed(() => isFormControl(rootElement.value));

const resolvedTrueValue = computed<NonNullable<T>>(() => props.trueValue ?? (DEFAULT_TRUE_VALUE as NonNullable<T>));
const resolvedFalseValue = computed<NonNullable<T>>(() => props.falseValue ?? (DEFAULT_FALSE_VALUE as NonNullable<T>));

function checkSwitchValue() {
  if (props.trueValue === null || props.falseValue === null) {
    throw new Error('trueValue and falseValue cannot be nullish');
  }
}

checkSwitchValue();

const { dataState } = provideSwitchRootContext({
  ...toContext(props, ['modelValue', 'disabled', 'required']),
  trueValue: resolvedTrueValue,
  falseValue: resolvedFalseValue,
  modelValue
});
</script>

<template>
  <div :ref="setRootElement" data-vean-switch-root :class="cls" :data-state="dataState" :dir="direction">
    <slot :model-value="modelValue" />
    <VisuallyHiddenInput
      v-if="formControl && name"
      type="checkbox"
      :name="name"
      :disabled="disabled"
      :required="required"
      :value="value"
      :checked="modelValue === resolvedTrueValue"
    />
  </div>
</template>
