<script setup lang="ts">
import { computed } from 'vue';
import { toContext } from '../../shared';
import { useControllableState, useRovingFocusGroup } from '../../composables';
import type { VNodeRef } from '../../types';
import { providePageTabsRootContext, usePageTabsUi } from './context';
import { usePageTabsScroll } from './hooks';
import type { PageTabsRootProps, PageTabsRootEmits } from './types';

defineOptions({
  name: 'PageTabsRoot'
});

const props = withDefaults(defineProps<PageTabsRootProps>(), {
  modelValue: undefined,
  loop: true,
  draggable: false
});

const emit = defineEmits<PageTabsRootEmits>();

const cls = usePageTabsUi('root');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  ''
);

const { setRootElement, onWheel } = usePageTabsScroll(modelValue);

providePageTabsRootContext({
  ...toContext(props, ['middleClickClose', 'draggable']),
  modelValue
});

// The tab strip is a horizontal roving focus group rendered as a plain container: the
// returned `groupProps` carries the entry-focus/keyboard bindings for the tab items.
const { setContainerElement, groupProps } = useRovingFocusGroup({
  orientation: computed(() => 'horizontal' as const),
  dir: computed(() => props.dir),
  loop: computed(() => props.loop ?? true),
  currentTabStopId: computed(() => props.currentTabStopId),
  defaultCurrentTabStopId: computed(() => props.defaultCurrentTabStopId),
  preventScrollOnEntryFocus: computed(() => props.preventScrollOnEntryFocus ?? false)
});

function setRootRef(nodeRef: VNodeRef) {
  setContainerElement(nodeRef);
  setRootElement(nodeRef);
}
</script>

<template>
  <div v-bind="groupProps" :ref="setRootRef" data-vean-page-tabs-root :class="cls" @wheel="onWheel">
    <slot />
  </div>
</template>
