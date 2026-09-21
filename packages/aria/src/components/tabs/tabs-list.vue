<script setup lang="ts">
import { computed } from 'vue';
import { useForwardElement, useRovingFocusGroup } from '../../composables';
import type { VNodeRef } from '../../types';
import { useTabsRootContext, useTabsUi } from './context';
import type { TabsListProps } from './types';

defineOptions({
  name: 'TabsList'
});

defineProps<TabsListProps>();

const { orientation, dir, loop, onListElementChange } = useTabsRootContext('TabsList');

const { setContainerElement, groupProps } = useRovingFocusGroup({
  orientation,
  dir,
  loop,
  currentTabStopId: computed(() => undefined),
  defaultCurrentTabStopId: computed(() => undefined),
  preventScrollOnEntryFocus: computed(() => false)
});

const [_, setListElement] = useForwardElement(onListElementChange);

function setRootRef(nodeRef: VNodeRef) {
  setListElement(nodeRef);
  setContainerElement(nodeRef);
}

const cls = useTabsUi('list');
</script>

<template>
  <div
    v-bind="groupProps"
    :ref="setRootRef"
    data-vean-tabs-list
    :class="cls"
    role="tablist"
    :aria-orientation="orientation"
  >
    <slot />
  </div>
</template>
