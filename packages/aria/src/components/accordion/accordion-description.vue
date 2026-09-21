<script setup lang="ts">
import { useAccordionUi } from './context';
import type { AccordionDescriptionProps } from './types';

defineOptions({
  name: 'AccordionDescription'
});

defineProps<AccordionDescriptionProps>();

const cls = useAccordionUi('description');
</script>

<template>
  <p data-vean-accordion-description :class="cls">
    <slot />
  </p>
</template>
