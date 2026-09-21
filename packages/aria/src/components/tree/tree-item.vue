<script setup lang="ts">
import { computed } from 'vue';
import { flattenChildren, getActiveElement, handleAndDispatchCustomEvent } from '../../shared';
import { useRovingFocusGroupItem } from '../../composables';
import type { HorizontalSide, TreeSelectEvent, TreeToggleEvent } from '../../types';
import { Primitive } from '../primitive';
import { TREE_SELECT, TREE_TOGGLE, recurseCheckChildren } from './shared';
import { useTreeRootContext } from './context';
import type { TreeItemProps, TreeItemEmits } from './types';

defineOptions({
  name: 'TreeItem'
});

const props = withDefaults(defineProps<TreeItemProps>(), {
  as: 'li'
});

const emit = defineEmits<TreeItemEmits>();

const {
  modelValue,
  disabled: rootDisabled,
  dir,
  selectedKeys,
  expanded,
  expandedItems,
  propagateSelect,
  bubbleSelect,
  onSelect,
  onToggle,
  getItems
} = useTreeRootContext('TreeItem');

const itemData = { value: props.value };

// Roving focus item as a hook: registers the item with the root collection and exposes the
// collection item + roving-focus data attributes (alongside `data-vean-tree-item`).
const { setItemElement, itemProps } = useRovingFocusGroupItem({
  itemData: computed(() => itemData),
  allowShiftKey: computed(() => true)
});

const currentItem = computed(() => expandedItems.value.find(item => item.value === props.value));

const disabled = computed(() => rootDisabled.value || props.disabled);

const hasChildren = computed(() => Boolean(currentItem.value?.hasChildren));

const isExpanded = computed(() => expanded.value?.includes(props.value) ?? false);

const isSelected = computed(() => selectedKeys.value.includes(props.value));

const hasSelectedChildren = computed(() => recurseCheckChildren(selectedKeys.value, currentItem.value?.data?.children));

const isIndeterminate = computed(() => {
  if (!currentItem.value || !hasChildren.value || !Array.isArray(modelValue.value)) return undefined;

  const children = flattenChildren(currentItem.value.data.children);

  if (bubbleSelect.value) {
    return (
      children.some(child => selectedKeys.value.includes(child.value)) &&
      !children.every(child => selectedKeys.value.includes(child.value))
    );
  } else if (propagateSelect.value && isSelected.value) {
    return !children.every(child => selectedKeys.value.includes(child.value));
  }

  return undefined;
});

const ariaSetsize = computed(() => currentItem.value?.bind?.['aria-setsize']);

const ariaPosinset = computed(() => currentItem.value?.bind?.['aria-posinset']);

const onKeydownRight = (event: KeyboardEvent) => {
  if (disabled.value || !hasChildren.value) return;

  if (isExpanded.value) {
    const nextElement = getNextElement('right');
    nextElement?.focus?.();
  } else {
    handleToggleCustomEvent(event);
  }
};

const onKeydownLeft = (event: KeyboardEvent) => {
  if (disabled.value) return;

  if (isExpanded.value) {
    handleToggleCustomEvent(event);
  } else {
    const nextElement = getNextElement('left');
    nextElement?.focus?.();
  }
};

const onKeydownByDirection = (event: KeyboardEvent, direction: HorizontalSide) => {
  if (disabled.value) return;

  if (direction === 'right') {
    if (dir.value === 'ltr') {
      onKeydownRight(event);
    } else {
      onKeydownLeft(event);
    }

    return;
  }

  if (dir.value === 'ltr') {
    onKeydownLeft(event);
  } else {
    onKeydownRight(event);
  }
};

function getNextElement(direction: HorizontalSide) {
  const collection = getItems?.()?.map(item => item.element) ?? [];
  const currentElement = getActiveElement() as HTMLElement;
  const currentIndex = collection.indexOf(currentElement);
  let list = [...collection];
  if (direction === 'left') {
    list = list.slice(0, currentIndex).reverse();
  } else {
    list = list.slice(currentIndex);
  }

  const nextLevel = direction === 'left' ? props.level - 1 : props.level + 1;

  const nextElement = list.find(el => Number(el.getAttribute('data-indent')) === nextLevel);

  return nextElement;
}

async function handleSelect(event: TreeSelectEvent<string>) {
  emit('select', event);
  if (event?.defaultPrevented) return;

  onSelect(props.value);
}

function handleToggle(event: TreeToggleEvent<string>) {
  emit('toggle', event);
  if (event?.defaultPrevented) return;

  onToggle(props.value);
}

async function handleSelectCustomEvent(event?: PointerEvent | KeyboardEvent) {
  if (props.disabledSelect) return;
  if (!event) return;

  const eventDetail = {
    originalEvent: event,
    value: props.value,
    isExpanded: isExpanded.value,
    isSelected: isSelected.value
  };
  handleAndDispatchCustomEvent(TREE_SELECT, handleSelect, eventDetail);
}

function handleToggleCustomEvent(event?: PointerEvent | KeyboardEvent) {
  if (props.disabledToggle) return;
  if (!event) return;

  const eventDetail = {
    originalEvent: event,
    value: props.value,
    isExpanded: isExpanded.value,
    isSelected: isSelected.value
  };
  handleAndDispatchCustomEvent(TREE_TOGGLE, handleToggle, eventDetail);
}

const onClick = (event: PointerEvent | KeyboardEvent) => {
  if (disabled.value) return;

  handleSelectCustomEvent(event);
  handleToggleCustomEvent(event);
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') {
    onKeydownByDirection(event, 'right');
    return;
  }
  if (event.key === 'ArrowLeft') {
    onKeydownByDirection(event, 'left');
    return;
  }

  onClick(event);
};
</script>

<template>
  <Primitive
    v-bind="itemProps"
    :ref="setItemElement"
    :as="as"
    :as-child="asChild"
    data-vean-tree-item
    :aria-disabled="disabled ? true : undefined"
    :aria-selected="isSelected"
    :aria-expanded="hasChildren ? isExpanded : undefined"
    :aria-level="level"
    :aria-setsize="ariaSetsize"
    :aria-posinset="ariaPosinset"
    :data-disabled="disabled ? '' : undefined"
    :data-indent="level"
    :data-selected="isSelected ? '' : undefined"
    :data-expanded="isExpanded ? '' : undefined"
    :data-contains-selected="hasSelectedChildren ? '' : undefined"
    role="treeitem"
    @keydown.enter.space.self.right.left.prevent="onKeydown"
    @click.stop="onClick"
  >
    <slot
      :is-expanded="isExpanded"
      :is-selected="isSelected"
      :is-indeterminate="isIndeterminate"
      :has-children="hasChildren"
    />
  </Primitive>
</template>
