<script setup lang="ts">
import { TabsRoot } from '../tabs';
import type { SegmentRootProps, SegmentRootEmits } from './types';

defineOptions({
  name: 'SegmentRoot'
});

const props = defineProps<SegmentRootProps>();

const emit = defineEmits<SegmentRootEmits>();
</script>

<template>
  <TabsRoot
    v-slot="slotProps"
    v-bind="props"
    data-vean-segment-root
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot v-bind="slotProps" />
  </TabsRoot>
</template>
