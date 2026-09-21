<script setup lang="ts">
import { ref } from 'vue';
import { SAccordion } from '@vean/ui';
import type { AccordionOptionData } from '@vean/ui';

const single = ref('');

const items: AccordionOptionData[] = [
  {
    value: '1',
    title: 'Is it accessible?',
    description: 'Yes. It adheres to the WAI-ARIA design pattern.',
    icon: 'lucide:info'
  },
  {
    value: '2',
    title: 'Is it unstyled?',
    description: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
    icon: 'lucide:rocket'
  },
  {
    value: '3',
    title: 'Can it be animated?',
    description: 'Yes! You can use the transition prop to configure the animation.',
    icon: 'lucide:earth'
  }
];
</script>

<template>
  <SAccordion
    v-model="single"
    type="single"
    :items="items"
    :ui="{
      item: 'border-b-0',
      content: 'px-3 leading-8',
      trigger: `mb-2 rounded-md px-3 text-start underline-offset-2 data-[state=closed]:(bg-muted/50 no-underline) data-[state=open]:(bg-secondary-foreground/20 underline hover:bg-secondary-foreground/20 hover:underline) hover:bg-muted`
    }"
  />
</template>
