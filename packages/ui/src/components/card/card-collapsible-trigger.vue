<script setup lang="ts">
import { CollapsibleTrigger } from '@vean/aria/collapsible';
import ButtonIcon from '../button/button-icon.vue';
import type { CardCollapsibleTriggerProps } from './types';

defineOptions({
  name: 'SCardCollapsibleTrigger'
});

const props = withDefaults(defineProps<CardCollapsibleTriggerProps>(), {
  asChild: true
});
</script>

<template>
  <CollapsibleTrigger v-slot="{ open }" v-bind="props" data-vean-card-collapsible-trigger>
    <slot :open="open">
      <ButtonIcon v-if="open" icon="lucide:chevron-down" />
      <ButtonIcon v-else icon="lucide:chevron-right" />
    </slot>
  </CollapsibleTrigger>
</template>
