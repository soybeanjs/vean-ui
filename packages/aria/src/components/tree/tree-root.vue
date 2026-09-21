<script setup lang="ts" generic="T extends TreeItemData, U extends MaybeArray<string> | undefined, M extends boolean">
import { computed, nextTick, shallowRef, watch } from 'vue';
import type { ComputedRef, ShallowRef } from 'vue';
import { createEventHook } from '@vueuse/core';
import { MAP_KEY_TO_FOCUS_INTENT } from '../../constants';
import { flattenChildren, getActiveElement, isNullish, toContext } from '../../shared';
import { useControllableState, useRovingFocusGroup, useTypeahead } from '../../composables';
import type { MaybeArray, NavigationKey, VNodeRef } from '../../types';
import { Primitive } from '../primitive';
import { findParentPath, flattenItems } from './shared';
import { provideTreeRootContext } from './context';
import { useSelectionBehavior } from './hooks';
import { findExpandedKeyChange, getMotionRange, spliceMotionSentinel } from './tree-motion';
import type { TreeRootProps, FlattenedItem, TreeItemData, TreeMotionState, TreeRootEmits } from './types';

defineOptions({
  name: 'TreeRoot'
});

const props = withDefaults(defineProps<TreeRootProps<T, U, M>>(), {
  as: 'ul',
  selectionBehavior: 'toggle',
  toggleBehavior: 'multiple',
  loop: true
});

const emit = defineEmits<TreeRootEmits<TreeRootProps<T, U, M>['multiple']>>();

const { handleTypeaheadSearch } = useTypeahead();

const isVirtual = shallowRef(false);
const virtualKeydownHook = createEventHook<KeyboardEvent>();

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value as TreeRootEmits<TreeRootProps<T, U, M>['multiple']>['update:modelValue'][0]);
  },
  getDefaultValue() as Exclude<U, undefined>
);

const selectedKeys = computed(() => {
  if (props.multiple && Array.isArray(modelValue.value)) {
    return modelValue.value;
  }

  return [modelValue.value];
}) as ComputedRef<string[]>;

const { onSelectItem, handleMultipleReplace } = useSelectionBehavior(
  modelValue,
  () => props.multiple,
  () => props.selectionBehavior
);

function getDefaultValue() {
  if (!isNullish(props.defaultValue)) {
    return props.defaultValue;
  }

  return props.multiple ? [] : '';
}

const expanded = useControllableState(
  () => props.expanded,
  value => {
    emit('update:expanded', value ?? []);
  },
  props.defaultExpanded ?? []
) as ShallowRef<string[]>;

const expandedItems = computed(() => flattenItems(props.items, expanded.value));

// Expand/collapse motion state: diffs expanded-key snapshots and exposes a
// transition render list (with the motion sentinel at the subtree position)
// plus the descendant items to animate. UI layers render the sentinel as a
// height-collapsing block and call `end` from the transition finish hooks.
const motionState = shallowRef<TreeMotionState<T> | null>(null);
const prevExpandedKeys = shallowRef<string[]>([]);
const prevExpandedItems = shallowRef<FlattenedItem<T>[]>([]);

prevExpandedKeys.value = [...expanded.value];
prevExpandedItems.value = expandedItems.value;

function endMotion() {
  prevExpandedKeys.value = [...expanded.value];
  prevExpandedItems.value = expandedItems.value;
  motionState.value = null;
}

watch(
  [expanded, () => props.items],
  () => {
    const currentItems = expandedItems.value;
    const change = findExpandedKeyChange(prevExpandedKeys.value, expanded.value);

    if (change.key === null) {
      prevExpandedItems.value = currentItems;
      motionState.value = null;
    } else {
      const shorter = change.add ? prevExpandedItems.value : currentItems;
      const longer = change.add ? currentItems : prevExpandedItems.value;
      const blockItems = getMotionRange(shorter, longer, change.key);

      if (blockItems.length === 0) {
        prevExpandedItems.value = currentItems;
        motionState.value = null;
      } else {
        motionState.value = {
          key: change.key,
          type: change.add ? 'show' : 'hide',
          items: spliceMotionSentinel(shorter, change.key),
          blockItems,
          end: endMotion
        };
      }
    }

    prevExpandedKeys.value = [...expanded.value];
  },
  { flush: 'post' }
);

// Roving focus group as a hook: the tree container doubles as the group container and items
// self-register against it (typeahead + shift-range selection read the ordered collection).
const { setContainerElement, groupProps, getOrderedItems } = useRovingFocusGroup({
  orientation: computed(() => 'vertical' as const),
  dir: computed(() => props.dir),
  loop: computed(() => props.loop ?? true),
  currentTabStopId: computed(() => undefined),
  defaultCurrentTabStopId: computed(() => undefined),
  preventScrollOnEntryFocus: computed(() => false)
});

function setRootRef(nodeRef: VNodeRef) {
  setContainerElement(nodeRef);
}

const onKeydownNavigation = (event: KeyboardEvent) => {
  const intent = MAP_KEY_TO_FOCUS_INTENT[event.key as NavigationKey];
  nextTick(() => {
    handleMultipleReplace(
      intent,
      getActiveElement(),
      expandedItems.value.map(item => item.value),
      getOrderedItems
    );
  });
};

const onKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return;

  if (isVirtual.value) {
    virtualKeydownHook.trigger(event);

    return;
  }

  if (['ArrowUp', 'ArrowDown', 'Shift'].includes(event.key)) {
    onKeydownNavigation(event);
    return;
  }

  const collections = getOrderedItems();
  handleTypeaheadSearch(event.key, collections);
};

const onBubbleSelect = (item: FlattenedItem<T>) => {
  if (props.disabled || !item.parent || !props.multiple || !Array.isArray(modelValue.value)) return;

  const parentItem = expandedItems.value.find(i => {
    return item.parent && i.value === item.parent.value;
  });

  if (!parentItem) return;

  const mValue = modelValue.value as string[];

  const isAllSelected = parentItem.data.children?.every(i => mValue.find(v => v === i.value));

  if (isAllSelected) {
    modelValue.value = [...mValue, parentItem.data.value] as U;
  } else {
    modelValue.value = mValue.filter(v => v !== parentItem.data.value) as U;
  }

  onBubbleSelect(parentItem);
};

const onSelect = (value: string) => {
  if (props.disabled) return;

  const item = expandedItems.value.find(i => i.value === value);

  if (item?.hasChildren && !props.allowParentSelect) return;

  // 捕获点击前的选中状态，避免 onSelectItem 切换后再判定导致 propagate 行为反转
  const wasSelected =
    props.propagateSelect && props.multiple && Array.isArray(modelValue.value)
      ? modelValue.value.includes(value)
      : false;

  onSelectItem(value);

  if (props.bubbleSelect && props.multiple && Array.isArray(modelValue.value)) {
    if (item) {
      onBubbleSelect(item);
    }
  }

  if (props.propagateSelect && props.multiple && Array.isArray(modelValue.value)) {
    if (!item) return;

    const children = flattenChildren(item.data.children);

    if (wasSelected) {
      modelValue.value = modelValue.value.filter(v => !children.some(child => child.value === v)) as U;
    } else {
      modelValue.value = [...modelValue.value, ...children.map(child => child.value)] as U;
    }
  }
};

const onToggle = (value: string) => {
  if (props.disabled) return;

  const item = expandedItems.value.find(i => i.value === value);

  if (!item?.data?.children) return;

  if (expanded.value.includes(value)) {
    expanded.value = expanded.value.filter(v => v !== value);

    return;
  }

  if (props.toggleBehavior === 'single') {
    const parentPath = findParentPath(value, props.items);

    if (parentPath) {
      expanded.value = [...parentPath, value];
    } else {
      expanded.value = [value];
    }
  } else {
    expanded.value = [...expanded.value, value];
  }
};

provideTreeRootContext({
  modelValue,
  expanded,
  selectedKeys,
  onSelect,
  onToggle,
  expandedItems,
  isVirtual,
  virtualKeydownHook,
  getItems: () => getOrderedItems(),
  handleMultipleReplace,
  ...toContext(props, ['items', 'multiple', 'disabled', 'dir', 'selectionBehavior', 'propagateSelect', 'bubbleSelect'])
});
</script>

<template>
  <Primitive
    v-bind="groupProps"
    :ref="setRootRef"
    :as="as"
    :as-child="asChild"
    data-vean-tree-root
    :aria-disabled="disabled ? true : undefined"
    :aria-multiselectable="multiple ? true : undefined"
    :data-disabled="disabled ? '' : undefined"
    role="tree"
    @keydown="onKeydown"
  >
    <slot
      :flatten-items="expandedItems"
      :model-value="modelValue"
      :expanded="expanded"
      :motion="motionState"
      :select="onSelect"
      :toggle="onToggle"
    />
  </Primitive>
</template>
