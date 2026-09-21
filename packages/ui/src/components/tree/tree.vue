<script setup lang="ts" generic="T extends TreeItemData, U extends MaybeArray<string> | undefined, M extends boolean">
import { useForwardListeners } from '@vean/aria/composables';
import { isTreeMotionItem, TreeRoot } from '@vean/aria/tree';
import type { TreeRootProps, TreeItemData, TreeRootEmits } from '@vean/aria/tree';
import type { MaybeArray } from '@vean/aria/types';
import STreeMotionBlock from './tree-motion-block.vue';
import type { TreeSlots } from './types';

defineOptions({
  name: 'STree'
});

const props = withDefaults(defineProps<TreeRootProps<T, U, M>>(), {
  loop: true
});

const emit = defineEmits<TreeRootEmits<TreeRootProps<T, U, M>['multiple']>>();

const listeners = useForwardListeners(emit);

defineSlots<TreeSlots<T>>();
</script>

<template>
  <TreeRoot v-slot="{ flattenItems, modelValue, expanded, motion }" v-bind="props" v-on="listeners">
    <slot name="top" />
    <template
      v-for="listItem in motion ? motion.items : flattenItems"
      :key="isTreeMotionItem(listItem) ? '__soybean_tree_motion__' : listItem.value"
    >
      <STreeMotionBlock
        v-if="motion && isTreeMotionItem(listItem)"
        :type="motion.type"
        :items="motion.blockItems"
        @end="motion.end()"
      >
        <template #item="{ item }">
          <slot name="item" :item="item" :model-value="modelValue" :expanded="expanded" />
        </template>
      </STreeMotionBlock>
      <slot
        v-else-if="!isTreeMotionItem(listItem)"
        name="item"
        :item="listItem"
        :model-value="modelValue"
        :expanded="expanded"
      />
    </template>
    <slot name="bottom" />
  </TreeRoot>
</template>
