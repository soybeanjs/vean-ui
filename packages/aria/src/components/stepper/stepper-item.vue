<script setup lang="ts">
import { computed } from 'vue';
import { toContext } from '../../shared';
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { provideStepperItemContext, useStepperRootContext, useStepperUi } from './context';
import type { StepperItemProps, StepperState } from './types';

defineOptions({
  name: 'StepperItem'
});

const props = withDefaults(defineProps<StepperItemProps>(), {
  disabled: false,
  completed: false
});

const cls = useStepperUi('item');

const forwardedProps = useOmitProps(props, ['step', 'disabled', 'completed']);

const { modelValue, linear, orientation } = useStepperRootContext('StepperItem');

const currentStep = computed(() => modelValue.value ?? 1);

const state = computed<StepperState>(() => {
  if (props.completed) {
    return 'completed';
  }

  if (currentStep.value === props.step) {
    return 'active';
  }

  if (currentStep.value > props.step) {
    return 'completed';
  }

  return 'inactive';
});

const isFocusable = computed(() => {
  if (props.disabled) {
    return false;
  }

  if (!linear.value) {
    return true;
  }

  return props.step <= currentStep.value || props.step === currentStep.value + 1;
});

const dataDisabled = computed(() => (props.disabled || !isFocusable.value ? '' : undefined));

provideStepperItemContext({
  ...toContext(props, ['step', 'disabled', 'completed']),
  state,
  isFocusable,
  dataDisabled
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :as="as"
    :as-child="asChild"
    data-vean-stepper-item
    :class="cls"
    :aria-current="state === 'active' ? 'step' : undefined"
    :data-disabled="dataDisabled"
    :data-orientation="orientation"
    :data-state="state"
  >
    <slot :state="state" />
  </Primitive>
</template>
