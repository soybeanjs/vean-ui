<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useForwardListeners } from '@vean/aria/composables';
import { SplitterPanel } from '@vean/aria/splitter';
import type { SplitterPanelProps, SplitterPanelEmits, SplitterPanelExposed } from './types';

defineOptions({
  name: 'SSplitterPanel'
});

const props = defineProps<SplitterPanelProps>();

const emit = defineEmits<SplitterPanelEmits>();

const listeners = useForwardListeners(emit);

const panelRef = useTemplateRef('panelRef');

defineExpose<SplitterPanelExposed>({
  collapse: () => panelRef.value?.collapse(),
  expand: () => panelRef.value?.expand(),
  resize: (size: number) => panelRef.value?.resize(size),
  getSize: () => panelRef.value?.getSize(),
  get isCollapsed() {
    return panelRef.value?.isCollapsed ?? false;
  },
  get isExpanded() {
    return panelRef.value?.isExpanded ?? false;
  }
});
</script>

<template>
  <SplitterPanel ref="panelRef" v-slot="slotProps" v-bind="props" v-on="listeners">
    <slot v-bind="slotProps" />
  </SplitterPanel>
</template>
