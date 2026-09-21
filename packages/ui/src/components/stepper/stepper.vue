<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { StepperCompact, provideStepperUi } from '@vean/aria/stepper';
import { stepperVariants } from '@/styles/stepper';
import type { StepperProps, StepperEmits, StepperSlots } from './types';

defineOptions({
  name: 'SStepper'
});

const props = withDefaults(defineProps<StepperProps>(), {
  // Mirror the Aria default so an absent Boolean prop is not cast to `false`
  // and then forwarded, which would override StepperRoot's `linear: true` default.
  linear: true
});

const emit = defineEmits<StepperEmits>();

const slots = defineSlots<StepperSlots>();

const forwardedProps = useOmitProps(props, ['class', 'color', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() =>
  stepperVariants(
    {
      color: props.color,
      size: props.size,
      orientation: props.orientation
    },
    props.ui,
    { root: props.class }
  )
);

provideStepperUi(ui);
</script>

<template>
  <StepperCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps" :key="slotName">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </StepperCompact>
</template>
