<script setup lang="ts" generic="M extends boolean = false">
import { shallowRef } from 'vue';
import { toContext } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useSelection } from '../../composables';
import { provideAccordionRootContext, useAccordionUi } from './context';
import type { AccordionRootProps, AccordionRootEmits } from './types';

defineOptions({
  name: 'AccordionRoot'
});

const props = withDefaults(defineProps<AccordionRootProps<M>>(), {
  disabled: false,
  orientation: 'vertical',
  collapsible: true,
  unmountOnHide: true
});

const emit = defineEmits<AccordionRootEmits<M>>();

const cls = useAccordionUi('root');

const rootElement = shallowRef<HTMLElement>();

const dir = useDirection(() => props.dir);

const { modelValue, isMultiple, onModelValueChange } = useSelection(
  () => ({
    ...props,
    clearable: props.collapsible
  }),
  value => {
    emit('update:modelValue', value);
  }
);

provideAccordionRootContext({
  dir,
  rootElement,
  modelValue,
  isMultiple,
  onModelValueChange,
  ...toContext(props, ['collapsible', 'disabled', 'orientation', 'unmountOnHide'])
});
</script>

<template>
  <div ref="rootElement" data-vean-accordion-root :class="cls" :dir="dir">
    <slot :model-value="modelValue" />
  </div>
</template>
