<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import type { DefinedValue } from '../../types';
import { isCascaderNodeAncestor } from './shared';
import { useCascaderRootContext, useCascaderUi } from './context';
import CascaderOption from './cascader-option.vue';
import type { CascaderMenuProps, CascaderNode } from './types';

defineOptions({
  name: 'CascaderMenu'
});

const props = withDefaults(defineProps<CascaderMenuProps>(), {
  level: 0,
  optionProps: () => ({})
});

const {
  menus,
  isSearchMode,
  searchResults,
  virtualScroll,
  itemSize,
  height,
  highlighted,
  selectedNodes,
  loadingKeys,
  getOptionId,
  isChecked,
  isIndeterminate,
  isSelected,
  expandNode
} = useCascaderRootContext('CascaderMenu');

const cls = useCascaderUi('menu');

/** The column rendered by the menu: a linked menu level or the flat search results. */
const column = computed(() => {
  if (isSearchMode.value) return searchResults.value;
  return menus.value[props.level] ?? [];
});

const isVirtual = computed(() => Boolean(virtualScroll.value) && column.value.length > 0);

const rowHeight = computed(() => itemSize.value ?? 34);
const viewportHeight = computed(() => height.value ?? 204);

const scrollTop = ref(0);

const startIndex = computed(() => {
  if (!isVirtual.value) return 0;
  return Math.floor(scrollTop.value / rowHeight.value);
});

const visibleCount = computed(() => {
  if (!isVirtual.value) return column.value.length;
  return Math.ceil(viewportHeight.value / rowHeight.value) + 2;
});

const endIndex = computed(() => Math.min(column.value.length, startIndex.value + visibleCount.value));

const visibleNodes = computed(() => column.value.slice(startIndex.value, endIndex.value));

const paddingTop = computed(() => (isVirtual.value ? startIndex.value * rowHeight.value : 0));
const paddingBottom = computed(() => (isVirtual.value ? (column.value.length - endIndex.value) * rowHeight.value : 0));

const onScroll = (event: Event) => {
  scrollTop.value = (event.target as HTMLElement).scrollTop;
};

const menuElement = ref<HTMLElement>();

/**
 * Scrolls the highlighted node into view when it lands outside the rendered
 * window: keyboard navigation and the on-open selection restore can highlight
 * rows that are not currently rendered (virtual) or scrolled out (both modes).
 */
function scrollHighlightedIntoView() {
  const element = menuElement.value;
  const node = highlighted.value;
  if (!element || !node) return;

  if (isVirtual.value) {
    // Virtual columns only render the visible window, so off-screen rows have
    // no element: move the scroll offset instead and sync the reactive offset
    // so the window re-renders immediately (the `scroll` event only confirms).
    const index = column.value.findIndex(item => item.uid === node.uid);
    if (index === -1) return;
    const top = index * rowHeight.value;
    const bottom = top + rowHeight.value;
    if (top < element.scrollTop) {
      element.scrollTop = top;
    } else if (bottom > element.scrollTop + element.clientHeight) {
      element.scrollTop = bottom - element.clientHeight;
    } else {
      return;
    }
    scrollTop.value = element.scrollTop;
    return;
  }

  element.querySelector(`[id="${getOptionId(node)}"]`)?.scrollIntoView({ block: 'nearest' });
}

onMounted(scrollHighlightedIntoView);

watch(highlighted, () => {
  void nextTick(scrollHighlightedIntoView);
});

/** Whether a descendant of the node is currently selected (breadcrumb emphasis). */
const hasChildSelected = (node: CascaderNode<DefinedValue>) =>
  selectedNodes.value.some(selected => isCascaderNodeAncestor(selected, node));

/** Slot props forwarded to every option, matching the option slot contract. */
const getSlotProps = (node: CascaderNode<DefinedValue>) => ({
  node,
  checked: isChecked(node),
  indeterminate: isIndeterminate(node),
  selected: isSelected(node),
  highlighted: highlighted.value?.uid === node.uid,
  childSelected: hasChildSelected(node),
  loading: loadingKeys.value.has(node.uid),
  expand: () => expandNode(node)
});
</script>

<template>
  <div
    ref="menuElement"
    data-vean-cascader-menu
    :class="cls"
    :style="isVirtual ? { height: `${viewportHeight}px`, overflowY: 'auto' } : undefined"
    @scroll="onScroll"
  >
    <div v-if="paddingTop > 0" :style="{ height: `${paddingTop}px` }" aria-hidden="true" />
    <CascaderOption
      v-for="(node, index) in visibleNodes"
      :key="node.uid"
      :node="node"
      :index="startIndex + index"
      :level="level"
      v-bind="optionProps"
    >
      <slot v-bind="getSlotProps(node)" />
    </CascaderOption>
    <div v-if="paddingBottom > 0" :style="{ height: `${paddingBottom}px` }" aria-hidden="true" />
  </div>
</template>
