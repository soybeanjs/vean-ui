<script setup lang="ts">
import { TabsTrigger } from '../tabs';
import type { SegmentTriggerProps } from './types';

defineOptions({
  name: 'SegmentTrigger'
});

const props = defineProps<SegmentTriggerProps>();
</script>

<template>
  <TabsTrigger v-slot="slotProps" v-bind="props" data-vean-segment-trigger>
    <slot v-bind="slotProps" />
  </TabsTrigger>
</template>
