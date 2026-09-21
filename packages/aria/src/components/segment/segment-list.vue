<script setup lang="ts">
import { TabsList } from '../tabs';
import type { SegmentListProps } from './types';

defineOptions({
  name: 'SegmentList'
});

const props = defineProps<SegmentListProps>();
</script>

<template>
  <TabsList v-bind="props" data-vean-segment-list>
    <slot />
  </TabsList>
</template>
