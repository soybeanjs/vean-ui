<script setup lang="ts">
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useStepperItemContext, useStepperUi } from './context';
import type { StepperDescriptionProps } from './types';

defineOptions({
  name: 'StepperDescription'
});

const props = withDefaults(defineProps<StepperDescriptionProps>(), {
  as: 'p'
});

const { descriptionId } = useStepperItemContext('StepperDescription');

const cls = useStepperUi('description');

const forwardedProps = useOmitProps(props, []);
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    :id="descriptionId"
    :as="as"
    :as-child="asChild"
    data-vean-stepper-description
    :class="cls"
  >
    <slot />
  </Primitive>
</template>
