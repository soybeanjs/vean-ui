<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed, nextTick } from 'vue';
import { handleAndDispatchCustomEvent } from '../../shared';
import type { DefinedValue } from '../../types';
import { Primitive } from '../primitive';
import { CASCADER_EXPAND_EVENT, CASCADER_SELECT_EVENT, isCascaderNodeAncestor } from './shared';
import { useCascaderRootContext, useCascaderUi } from './context';
import type { CascaderOptionProps, CascaderOptionEmits, CascaderSelectEvent, CascaderExpandEvent } from './types';

defineOptions({
  name: 'CascaderOption'
});

const props = defineProps<CascaderOptionProps<T>>();

const emit = defineEmits<CascaderOptionEmits<T>>();

const {
  menus,
  highlighted,
  selectedNodes,
  loadingKeys,
  expandTrigger,
  getOptionId,
  isChecked,
  isIndeterminate,
  isSelected,
  onOptionSelect,
  onOptionHover,
  setHighlighted,
  expandNode
} = useCascaderRootContext('CascaderOption');

const cls = useCascaderUi('option');

const isHighlighted = computed(() => highlighted.value?.uid === props.node.uid);
const isLoading = computed(() => loadingKeys.value.has(props.node.uid));
const isExpanded = computed(() => menus.value[props.node.level + 1] === props.node.children);
// Breadcrumb emphasis follows the selection, not the transient hover highlight,
// so merely hovering a deep node never recolors its ancestors.
const hasChildSelected = computed(() => selectedNodes.value.some(node => isCascaderNodeAncestor(node, props.node)));

const dataState = computed(() => {
  if (isSelected(props.node)) return 'selected';
  if (isChecked(props.node)) return 'checked';
  if (isIndeterminate(props.node)) return 'indeterminate';
  return 'unchecked';
});

async function onSelect(event: CascaderSelectEvent<T>) {
  await nextTick();
  emit('select', event);
  if (event.defaultPrevented) return;
  if (props.node.disabled) return;

  onOptionSelect(props.node, event.detail.originalEvent);
}

function onCustomSelect(event: PointerEvent | MouseEvent) {
  if (event.defaultPrevented) return;
  handleAndDispatchCustomEvent<CascaderSelectEvent<T>, PointerEvent | KeyboardEvent>(CASCADER_SELECT_EVENT, onSelect, {
    originalEvent: event as PointerEvent | KeyboardEvent,
    node: props.node
  });
}

async function onExpand(event: CascaderExpandEvent<T>) {
  await nextTick();
  emit('expand', event);
  if (event.defaultPrevented) return;
  if (props.node.disabled) return;

  // Highlights the node and expands its children column.
  onOptionHover(props.node);
}

function onPointerMove(event: PointerEvent) {
  if (props.node.disabled) return;

  // Hover only highlights when the node is a leaf or the expand trigger is `click`.
  if (props.node.isLeaf || expandTrigger.value === 'click') {
    setHighlighted(props.node);
    return;
  }

  handleAndDispatchCustomEvent(CASCADER_EXPAND_EVENT, onExpand, {
    originalEvent: event,
    node: props.node
  });
}

function onClick(event: MouseEvent) {
  onCustomSelect(event);
}

/**
 * Expands the children column without toggling the selection. Used by the expand
 * arrow of non-leaf nodes so that expanding and selecting stay independent.
 */
function onExpandClick() {
  if (props.node.disabled) return;
  setHighlighted(props.node);
  expandNode(props.node);
}
</script>

<template>
  <Primitive
    :id="getOptionId(node)"
    data-vean-cascader-option
    :class="cls"
    role="treeitem"
    :aria-selected="isSelected(node) || isChecked(node) || undefined"
    :aria-disabled="node.disabled || undefined"
    :aria-expanded="node.isLeaf ? undefined : isExpanded"
    :data-state="dataState"
    :data-selected="isSelected(node) ? '' : undefined"
    :data-highlighted="isHighlighted ? '' : undefined"
    :data-child-selected="hasChildSelected ? '' : undefined"
    :data-leaf="node.isLeaf ? '' : undefined"
    :data-disabled="node.disabled ? '' : undefined"
    :data-loading="isLoading ? '' : undefined"
    @pointermove="onPointerMove"
    @click="onClick"
  >
    <slot
      :node="node"
      :checked="isChecked(node)"
      :indeterminate="isIndeterminate(node)"
      :selected="isSelected(node)"
      :highlighted="isHighlighted"
      :child-selected="hasChildSelected"
      :loading="isLoading"
      :expand="onExpandClick"
    />
  </Primitive>
</template>
