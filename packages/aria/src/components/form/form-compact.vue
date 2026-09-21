<script setup lang="ts">
import { toContext } from '../../shared';
import { provideFormCompactContext, useFormUi } from './context';
import type { FormCompactProps } from './types';

defineOptions({
  name: 'FormCompact'
});

const props = withDefaults(defineProps<FormCompactProps>(), {
  orientation: 'vertical'
});

const cls = useFormUi('form');

provideFormCompactContext({
  ...toContext(props, [
    'orientation',
    'fieldProps',
    'fieldArrayProps',
    'labelProps',
    'controlProps',
    'descriptionProps',
    'errorProps'
  ])
});
</script>

<template>
  <form data-vean-form :class="cls" :data-orientation="orientation">
    <slot />
  </form>
</template>
