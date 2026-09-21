<script setup lang="ts">
import { computed, shallowRef, useAttrs } from 'vue';
import { getCollectionItemElements, interpolate, isElementHasAttribute, toContext } from '../../shared';
import { useControllableState, useForwardElement, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import { Primitive } from '../primitive';
import { VisuallyHidden } from '../visually-hidden';
import { provideStepperRootContext, useStepperUi } from './context';
import type { StepperRootProps, StepperRootEmits } from './types';

defineOptions({
  name: 'StepperRoot'
});

const props = withDefaults(defineProps<StepperRootProps>(), {
  modelValue: undefined,
  defaultValue: 1,
  orientation: 'horizontal',
  linear: true
});

const emit = defineEmits<StepperRootEmits>();

const attrs = useAttrs();

const cls = useStepperUi('root');

const messages = useLocaleMessages();

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue
);

const forwardedProps = useOmitProps(props, ['defaultValue', 'modelValue', 'orientation', 'dir', 'linear']);

const [rootElement, setRootElement] = useForwardElement();

const registeredStepperItems = shallowRef<HTMLElement[]>([]);

const stepperItems = computed(() => {
  if (!rootElement.value) {
    return registeredStepperItems.value;
  }

  const orderedItems = getCollectionItemElements(rootElement.value);

  return orderedItems.filter(item => registeredStepperItems.value.includes(item));
});

const totalSteps = computed(() => stepperItems.value.length);
const currentStep = computed(() => modelValue.value ?? 1);

const isFirstStep = computed(() => currentStep.value === 1);
const isLastStep = computed(() => totalSteps.value > 0 && currentStep.value === totalSteps.value);

const nextStepperItem = computed(() => stepperItems.value[currentStep.value]);
const prevStepperItem = computed(() => stepperItems.value[currentStep.value - 2]);

const isNextDisabled = computed(() => {
  if (!nextStepperItem.value) return true;

  return isElementHasAttribute(nextStepperItem.value, 'disabled');
});

const isPrevDisabled = computed(() => {
  if (!prevStepperItem.value) return true;

  return isElementHasAttribute(prevStepperItem.value, 'disabled');
});

const canGoToStep = (step: number) => {
  if (step < 1 || step > totalSteps.value) {
    return false;
  }

  const item = stepperItems.value[step - 1];

  if (!item || isElementHasAttribute(item, 'disabled')) {
    return false;
  }

  if (props.linear && step > currentStep.value + 1) {
    return false;
  }

  return true;
};

const goToStep = (step: number) => {
  if (!canGoToStep(step)) return;

  modelValue.value = step;
};

const nextStep = () => {
  goToStep(currentStep.value + 1);
};

const prevStep = () => {
  goToStep(currentStep.value - 1);
};

const hasNext = () => currentStep.value < totalSteps.value;
const hasPrev = () => currentStep.value > 1;

function toNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

const ariaLabel = computed(() => toNonEmptyString(attrs['aria-label']) ?? messages.value.stepper.ariaLabel);

const registerStepperItem = (element: HTMLElement) => {
  if (registeredStepperItems.value.includes(element)) return;

  registeredStepperItems.value = [...registeredStepperItems.value, element];
};

const unregisterStepperItem = (element: HTMLElement | undefined) => {
  if (!element) return;

  registeredStepperItems.value = registeredStepperItems.value.filter(item => item !== element);
};

const { dir } = provideStepperRootContext({
  ...toContext(props, ['orientation', 'dir', 'linear']),
  modelValue,
  stepperItems,
  totalSteps,
  changeModelValue: goToStep,
  registerStepperItem,
  unregisterStepperItem
});

defineExpose({
  modelValue,
  totalSteps,
  isNextDisabled,
  isPrevDisabled,
  isFirstStep,
  isLastStep,
  goToStep,
  nextStep,
  prevStep,
  hasNext,
  hasPrev,
  registerStepperItem,
  unregisterStepperItem
});
</script>

<template>
  <Primitive
    :ref="setRootElement"
    v-bind="forwardedProps"
    :as="as"
    :as-child="asChild"
    data-vean-stepper-root
    :class="cls"
    :dir="dir"
    role="group"
    :aria-label="ariaLabel"
    :data-linear="linear ? '' : undefined"
    :data-orientation="orientation"
  >
    <slot
      :model-value="modelValue"
      :total-steps="totalSteps"
      :is-next-disabled="isNextDisabled"
      :is-prev-disabled="isPrevDisabled"
      :is-first-step="isFirstStep"
      :is-last-step="isLastStep"
      :go-to-step="goToStep"
      :next-step="nextStep"
      :prev-step="prevStep"
      :has-next="hasNext"
      :has-prev="hasPrev"
    />

    <VisuallyHidden v-if="totalSteps > 0" as="span" role="status" aria-live="polite" aria-atomic="true">
      {{
        interpolate(messages.stepper.stepOf, {
          current: String(currentStep),
          total: String(totalSteps)
        })
      }}
    </VisuallyHidden>
  </Primitive>
</template>
