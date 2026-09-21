<script setup lang="ts" generic="T extends PageTabsOptionData = PageTabsOptionData">
import { computed, mergeProps, shallowRef, watchEffect } from 'vue';
import type { ShallowRef } from 'vue';
import { arrayMove } from '../../shared';
import { useControllableState, useOmitProps, useSortableList } from '../../composables';
import Icon from '../_icon/icon.vue';
import ContextMenuCompact from '../context-menu/context-menu-compact.vue';
import type { MenuOptionData } from '../menu/types';
import { usePageTabsUi } from './context';
import { usePageTabsState } from './hooks';
import PageTabsClose from './page-tabs-close.vue';
import PageTabsItem from './page-tabs-item.vue';
import PageTabsPin from './page-tabs-pin.vue';
import PageTabsRoot from './page-tabs-root.vue';
import type {
  PageTabsCompactItemSlotProps,
  PageTabsCompactProps,
  PageTabsCompactEmits,
  PageTabsCompactSlots,
  PageTabsContextMenuOptionData,
  PageTabsDragEvent,
  PageTabsOptionData
} from './types';

defineOptions({
  name: 'PageTabsCompact'
});

const props = withDefaults(defineProps<PageTabsCompactProps<T>>(), {
  modelValue: undefined,
  beforeClose: () => true
});

const emit = defineEmits<PageTabsCompactEmits<T>>();

defineSlots<PageTabsCompactSlots<T>>();

const forwardedProps = useOmitProps(props, ['items', 'menuFactory', 'beforeClose']);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  ''
);

const items = useControllableState(
  () => props.items,
  value => {
    emit('update:items', value);
  },
  []
);

const { closeTab, pinTab, sortTabs, getState } = usePageTabsState<T>({
  items,
  modelValue,
  beforeClose: props.beforeClose
});

const currentTab: ShallowRef<T | null> = shallowRef(null);
const reference = shallowRef<HTMLElement | null>(null);

const ui = usePageTabsUi();

const contextMenus = computed(() => {
  if (!currentTab.value || !props.menuFactory) {
    return [];
  }

  return props.menuFactory(currentTab.value, getState(currentTab.value));
});

function toDragPayload(id: string, index: number): PageTabsDragEvent<T> | null {
  const item = items.value.find(tab => tab.value === id);

  return item ? { item, index } : null;
}

// Horizontal drag sorting via the Aria `useSortableList` engine. The engine
// reports projected indices only — the tab array stays the single source of
// truth and is reordered here, which keeps the pinned group in front because
// the engine bounds each tab's insertion window at its own zone.
const { listProps } = useSortableList({
  onReorder: (fromIndex, toIndex) => {
    items.value = arrayMove(items.value, fromIndex, toIndex);

    const item = items.value[toIndex];

    if (item) {
      emit('tabDragReorder', { item, index: toIndex });
    }
  },
  onDragStart: event => {
    const payload = toDragPayload(event.id, event.index);

    if (payload) {
      emit('tabDragStart', payload);
    }
  },
  onDragMove: event => {
    const payload = toDragPayload(event.id, event.index);

    if (payload) {
      emit('tabDragMove', payload);
    }
  },
  onDragEnd: event => {
    const payload = toDragPayload(event.id, event.index);

    if (payload) {
      emit('tabDragEnd', payload);
    }
  }
});

// Forwarded component props and the sortable list bindings land on the same
// root element, so merge them into a single spread.
const rootProps = computed(() => mergeProps(forwardedProps.value, listProps.value));

const getItemSlotProps = (item: T, index: number): PageTabsCompactItemSlotProps<T> => ({
  item,
  index,
  selected: modelValue.value === item.value,
  closable: !item.pinned
});

const handleItemClick = (item: T) => {
  emit('click', item);
};

const handleItemClose = (item: T) => {
  closeTab(item.value, () => {
    emit('close', item);
  });
};

const handleItemPin = (item: T, pinned: boolean) => {
  pinTab(item, pinned);
  emit('pin', item);
};

const handleItemPointerEnter = (event: PointerEvent, item: T) => {
  reference.value = event.currentTarget as HTMLElement;
  currentTab.value = item;

  emit('contextmenu', item);
};

const handleSelect = async (menu: MenuOptionData<string | number>, _event: Event) => {
  if (!currentTab.value) {
    return;
  }

  const item = menu as PageTabsContextMenuOptionData;

  await item.action?.();

  emit('selectContextMenu', item, currentTab.value);
};

watchEffect(() => {
  sortTabs();
});
</script>

<template>
  <PageTabsRoot v-bind="rootProps" v-model="modelValue">
    <PageTabsItem
      v-for="(item, index) in items"
      v-bind="props.itemProps"
      :key="item.value"
      :value="item.value"
      :pinned="item.pinned"
      :draggable="props.draggable && item.draggable !== false"
      :index="index"
      @click="handleItemClick(item)"
      @close="handleItemClose(item)"
      @pin="handleItemPin(item, $event)"
      @pointerenter="handleItemPointerEnter($event, item)"
    >
      <slot name="item" v-bind="getItemSlotProps(item, index)">
        <slot name="icon" v-bind="getItemSlotProps(item, index)">
          <Icon v-if="item.icon" :icon="item.icon" />
        </slot>
        <slot name="label" v-bind="getItemSlotProps(item, index)">
          <span :class="ui.itemText">{{ item.label }}</span>
        </slot>
        <PageTabsPin v-if="!item.hidePinnedIcon" v-bind="props.pinProps">
          <slot name="pin-icon">
            <Icon icon="lucide:pin" />
          </slot>
        </PageTabsPin>
        <PageTabsClose v-bind="props.closeProps">
          <slot name="close-icon">
            <Icon icon="lucide:x" />
          </slot>
        </PageTabsClose>
        <slot name="indicator" v-bind="getItemSlotProps(item, index)" />
      </slot>
    </PageTabsItem>

    <ContextMenuCompact
      v-if="contextMenus.length"
      v-bind="contextMenuProps"
      :modal="false"
      :items="contextMenus"
      :trigger-props="{ reference }"
      @select="handleSelect"
    />
  </PageTabsRoot>
</template>
