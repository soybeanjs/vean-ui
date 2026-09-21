<script setup lang="ts">
import { interpolate } from '../../shared';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import { Primitive } from '../primitive';
import { useStepperItemContext, useStepperUi } from './context';
import type { StepperIndicatorProps } from './types';

defineOptions({
  name: 'StepperIndicator'
});

const props = withDefaults(defineProps<StepperIndicatorProps>(), {
  as: 'span'
});

const { step } = useStepperItemContext('StepperIndicator');
const messages = useLocaleMessages();

const cls = useStepperUi('indicator');

const forwardedProps = useOmitProps(props, []);
</script>

<template>
  <Primitive v-bind="forwardedProps" :as="as" :as-child="asChild" data-vean-stepper-indicator :class="cls">
    <slot :step="step">{{ interpolate(messages.stepper.step, { step: String(step) }) }}</slot>
  </Primitive>
</template>
