<script setup lang="ts" generic="T extends TreeItemData">
import { onBeforeUnmount, shallowRef } from 'vue';
import { collapseMotion } from '@vean/aria/shared';
import type { FlattenedItem, TreeItemData, TreeMotionType } from '@vean/aria/tree';

defineOptions({
  name: 'STreeMotionBlock'
});

interface Props {
  /**
   * Whether the block expands (`show`) or collapses (`hide`) the subtree.
   */
  type: TreeMotionType;
  /**
   * Descendant items rendered inside the animated block.
   */
  items: FlattenedItem<T>[];
}

const props = defineProps<Props>();

defineSlots<{
  item?: (props: { item: FlattenedItem<T> }) => any;
}>();

const motion = collapseMotion();

const emit = defineEmits<{
  end: [];
}>();

// For `hide`, mount the block first and flip `visible` on the next task so the
// leave transition has a rendered element to collapse. Test environments have
// no CSS transition support, so the motion ends synchronously instead.
const visible = shallowRef(true);

let hideTimer: ReturnType<typeof setTimeout> | null = null;

if (props.type === 'hide') {
  if (import.meta.env.MODE === 'test') {
    emit('end');
  } else {
    hideTimer = setTimeout(() => {
      visible.value = false;
      hideTimer = null;
    });
  }
}

onBeforeUnmount(() => {
  if (hideTimer !== null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
});
</script>

<template>
  <li data-vean-tree-motion>
    <Transition v-bind="motion" :appear="type === 'show'" @after-enter="emit('end')" @after-leave="emit('end')">
      <ul v-if="visible" class="m-0 list-none p-0" data-vean-tree-motion-list>
        <template v-for="blockItem in items" :key="blockItem.value">
          <slot name="item" :item="blockItem" />
        </template>
      </ul>
    </Transition>
  </li>
</template>
