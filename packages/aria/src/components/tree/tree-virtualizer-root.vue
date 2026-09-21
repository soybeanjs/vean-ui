<script setup lang="ts" generic="T extends TreeItemData, U extends MaybeArray<string> | undefined, M extends boolean">
import { useForwardListeners, useOmitProps } from '../../composables';
import type { MaybeArray } from '../../types';
import VirtualizerRoot from '../virtualizer/virtualizer-root.vue';
import TreeRoot from './tree-root.vue';
import type { TreeVirtualizerRootProps, TreeItemData, TreeVirtualizerRootEmits } from './types';

defineOptions({
  name: 'TreeVirtualizerRoot'
});

const props = withDefaults(defineProps<TreeVirtualizerRootProps<T, U, M>>(), {
  items: () => [],
  // 镜像 TreeRoot 的 loop: true 默认，避免缺失的 Boolean prop 被 cast 为 false 后透传覆盖
  loop: true
});

const emit = defineEmits<TreeVirtualizerRootEmits<TreeVirtualizerRootProps<T, U, M>['multiple']>>();

const forwardedProps = useOmitProps(props, ['as', 'asChild', 'options', 'height']);

const listeners = useForwardListeners(emit);
</script>

<template>
  <TreeRoot v-slot="{ flattenItems, modelValue, expanded, motion }" v-bind="forwardedProps" as-child v-on="listeners">
    <VirtualizerRoot
      v-slot="{ virtualItems, totalSize }"
      :as="as"
      :as-child="asChild"
      data-vean-tree-virtualizer-root
      :items="flattenItems"
      :options="options"
      :height="height"
      :dynamic="dynamic"
    >
      <slot
        :virtual-items="virtualItems"
        :total-size="totalSize"
        :flatten-items="flattenItems"
        :model-value="modelValue"
        :expanded="expanded"
        :motion="motion"
      />
    </VirtualizerRoot>
  </TreeRoot>
</template>
