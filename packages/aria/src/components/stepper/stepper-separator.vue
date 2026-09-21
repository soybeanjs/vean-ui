<script setup lang="ts">
import { useOmitProps } from '../../composables';
import { SeparatorRoot } from '../separator';
import { useStepperItemContext, useStepperRootContext, useStepperUi } from './context';
import type { StepperSeparatorProps } from './types';

defineOptions({
  name: 'StepperSeparator'
});

const props = withDefaults(defineProps<StepperSeparatorProps>(), {
  decorative: true
});

const forwardedProps = useOmitProps(props, ['orientation', 'decorative']);

const { orientation } = useStepperRootContext('StepperSeparator');
const { state } = useStepperItemContext('StepperSeparator');

const cls = useStepperUi('separator');
</script>

<template>
  <SeparatorRoot
    v-bind="forwardedProps"
    :class="cls"
    data-vean-stepper-separator
    :orientation="orientation"
    :decorative="decorative"
    :data-state="state"
  >
    <slot />
  </SeparatorRoot>
</template>
