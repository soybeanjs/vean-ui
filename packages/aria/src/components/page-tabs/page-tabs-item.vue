<script setup lang="ts">
import { computed, mergeProps } from 'vue';
import { toContext } from '../../shared';
import { useRovingFocusGroupItem, useSortableListItem } from '../../composables';
import type { VNodeRef } from '../../types';
import { usePageTabsUi, usePageTabsRootContext, providePageTabsItemContext } from './context';
import type { PageTabsItemProps, PageTabsItemEmits } from './types';

defineOptions({
  name: 'PageTabsItem'
});

const props = withDefaults(defineProps<PageTabsItemProps>(), {
  as: 'button',
  draggable: false
});

const emit = defineEmits<PageTabsItemEmits>();

const cls = usePageTabsUi('item');
const { middleClickClose, modelValue } = usePageTabsRootContext('PageTabsItem');

const isSelected = computed(() => props.value === modelValue.value);
const closable = computed(() => !props.pinned);

// Roving focus item as a hook: registers the tab with the root group and exposes the
// collection item + roving-focus data attributes (alongside `data-vean-page-tabs-item`).
const { setItemElement: setRovingItemElement, itemProps: rovingItemProps } = useRovingFocusGroupItem({
  active: computed(() => isSelected.value)
});

// Drag wiring — the item registers with the `useSortableList` engine owned by the
// compact. A non-draggable tab is `disabled`: it cannot be dragged AND it acts
// as a barrier, so no other tab can be inserted before, onto, or after it.
// Pinned tabs reorder within the pinned zone only — the engine keeps the pinned
// group aggregated by bounding the insertion window at the zone change itself.
const {
  setItemElement: setSortableItemElement,
  itemProps: sortableItemProps,
  dragging,
  consumeDragClick
} = useSortableListItem({
  id: computed(() => props.value),
  index: computed(() => props.index ?? 0),
  group: computed(() => (props.pinned ? 0 : 1)),
  disabled: computed(() => !props.draggable)
});

function setItemRef(nodeRef: VNodeRef) {
  setRovingItemElement(nodeRef);
  setSortableItemElement(nodeRef);
}

// Roving focus owns the item's keyboard/collection bindings, the sortable list
// owns the pointer binding — merge them into a single spread.
const itemProps = computed(() => mergeProps(rovingItemProps.value, sortableItemProps.value));

const onClick = () => {
  // A drag concluded on this tab: the pointerup already placed it, so the
  // trailing click must not also select it.
  if (consumeDragClick()) return;
  if (isSelected.value) return;

  modelValue.value = props.value;
  emit('click');
};

const onClose = async () => {
  if (!closable.value) return;

  emit('close');
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    onClick();

    return;
  }
  if (event.key === 'Backspace') {
    onClose();
  }
};

const onMouseDown = (event: MouseEvent) => {
  if (event.button === 1 && middleClickClose.value) {
    event.preventDefault();
    onClose();
  }
};

const onPin = () => {
  emit('pin', !props.pinned);
};

providePageTabsItemContext({
  ...toContext(props, ['pinned']),
  closable,
  onClose,
  onPin
});
</script>

<template>
  <div
    v-bind="itemProps"
    :ref="setItemRef"
    :class="cls"
    data-vean-page-tabs-item
    :data-value="value"
    :data-selected="isSelected"
    :data-pinned="pinned"
    :data-draggable="draggable"
    :data-dragging="dragging"
    @click="onClick"
    @mousedown="onMouseDown"
    @keydown.enter.backspace="onKeydown"
  >
    <slot />
  </div>
</template>
