<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useArrowNavigation, useForwardElement, useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useStepperItemContext, useStepperRootContext, useStepperUi } from './context';
import type { StepperTriggerProps } from './types';

defineOptions({
  name: 'StepperTrigger'
});

const props = withDefaults(defineProps<StepperTriggerProps>(), {
  as: 'button'
});

const { orientation, dir, stepperItems, changeModelValue, registerStepperItem, unregisterStepperItem } =
  useStepperRootContext('StepperTrigger');
const { step, disabled, state, isFocusable, titleId, descriptionId } = useStepperItemContext('StepperTrigger');

const cls = useStepperUi('trigger');

const forwardedProps = useOmitProps(props, []);

const [triggerElement, setTriggerElement] = useForwardElement();

const onMouseDown = (event: MouseEvent) => {
  if (disabled.value || !isFocusable.value) {
    event.preventDefault();

    return;
  }

  if (event.ctrlKey) {
    event.preventDefault();

    return;
  }

  changeModelValue(step.value);
};

const onKeyDown = (event: KeyboardEvent) => {
  if (disabled.value || !isFocusable.value) {
    event.preventDefault();

    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    changeModelValue(step.value);

    return;
  }

  useArrowNavigation(event, event.currentTarget as HTMLElement, undefined, {
    itemsArray: stepperItems.value,
    focus: true,
    loop: false,
    arrowKeyOptions: orientation.value,
    dir: dir.value
  });
};

onMounted(() => {
  if (triggerElement.value) {
    registerStepperItem(triggerElement.value);
  }
});

onBeforeUnmount(() => {
  unregisterStepperItem(triggerElement.value);
});
</script>

<template>
  <Primitive
    :ref="setTriggerElement"
    v-bind="forwardedProps"
    :as="as"
    :as-child="asChild"
    data-vean-stepper-trigger
    data-vean-collection-item
    :class="cls"
    :type="as === 'button' ? 'button' : undefined"
    :disabled="disabled || !isFocusable ? true : undefined"
    :data-disabled="disabled || !isFocusable ? '' : undefined"
    :data-orientation="orientation"
    :data-state="state"
    :tabindex="isFocusable ? 0 : -1"
    :aria-describedby="descriptionId"
    :aria-labelledby="titleId"
    @mousedown.left="onMouseDown"
    @keydown.enter.space.left.right.up.down.home.end="onKeyDown"
  >
    <slot />
  </Primitive>
</template>
