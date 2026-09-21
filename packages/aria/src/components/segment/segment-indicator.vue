<script setup lang="ts">
import { TabsIndicator } from '../tabs';
import type { SegmentIndicatorProps } from './types';

defineOptions({
  name: 'SegmentIndicator'
});

const props = defineProps<SegmentIndicatorProps>();
</script>

<template>
  <TabsIndicator v-bind="props" data-vean-segment-indicator>
    <slot />
  </TabsIndicator>
</template>
