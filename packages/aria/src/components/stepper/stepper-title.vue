<script setup lang="ts">
import { useOmitProps } from '../../composables';
import { Primitive } from '../primitive';
import { useStepperItemContext, useStepperUi } from './context';
import type { StepperTitleProps } from './types';

defineOptions({
  name: 'StepperTitle'
});

const props = withDefaults(defineProps<StepperTitleProps>(), {
  as: 'h4'
});

const { titleId } = useStepperItemContext('StepperTitle');

const cls = useStepperUi('title');

const forwardedProps = useOmitProps(props, []);
</script>

<template>
  <Primitive v-bind="forwardedProps" :id="titleId" :as="as" :as-child="asChild" data-vean-stepper-title :class="cls">
    <slot />
  </Primitive>
</template>
