<script setup lang="ts" generic="T extends AccordionOptionData = AccordionOptionData, M extends boolean = false">
import { computed } from 'vue';
import { AccordionCompact, provideAccordionUi } from '@vean/aria/accordion';
import type { AccordionOptionData } from '@vean/aria/accordion';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { accordionVariants } from '@/styles/accordion';
import type { AccordionProps, AccordionEmits, AccordionSlots } from './types';

defineOptions({
  name: 'SAccordion'
});

const props = withDefaults(defineProps<AccordionProps<T, M>>(), {
  collapsible: true,
  unmountOnHide: true
});

const emit = defineEmits<AccordionEmits<M>>();

const slots = defineSlots<AccordionSlots<T, M>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots).filter(name => name !== 'item'));

const ui = computed(() =>
  accordionVariants(
    {
      size: props.size
    },
    props.ui,
    { root: props.class }
  )
);

provideAccordionUi(ui);
</script>

<template>
  <AccordionCompact v-bind="forwardedProps" v-on="listeners">
    <template #item="slotProps">
      <slot name="item" v-bind="slotProps" />
    </template>
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </AccordionCompact>
</template>
