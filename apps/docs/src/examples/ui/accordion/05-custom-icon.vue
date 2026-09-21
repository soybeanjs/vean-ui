<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { SAccordion } from '@vean/ui';
import type { AccordionOptionData } from '@vean/ui';

const multi = ref<string[]>([]);

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
  <SAccordion v-model="multi" multiple :items="items">
    <template #trigger-icon="{ open }">
      <Icon v-if="open" icon="lucide:minus" class="ms-auto" />
      <Icon v-else icon="lucide:plus" class="ms-auto" />
    </template>
  </SAccordion>
</template>
