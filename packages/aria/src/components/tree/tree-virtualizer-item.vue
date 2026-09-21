<script setup lang="ts">
import { useForwardListeners } from '../../composables';
import VirtualizerItem from '../virtualizer/virtualizer-item.vue';
import TreeItem from './tree-item.vue';
import type { TreeVirtualizerItemProps, TreeVirtualizerItemEmits } from './types';

defineOptions({
  name: 'TreeVirtualizerItem'
});

defineProps<TreeVirtualizerItemProps>();

const emit = defineEmits<TreeVirtualizerItemEmits>();

const listeners = useForwardListeners(emit);
</script>

<template>
  <TreeItem v-slot="slotProps" :value="value" :level="level" as-child v-on="listeners">
    <VirtualizerItem
      :as="as"
      :as-child="asChild"
      data-vean-tree-virtualizer-item
      :data="data"
      :custom-style="customStyle"
    >
      <slot v-bind="slotProps" />
    </VirtualizerItem>
  </TreeItem>
</template>
