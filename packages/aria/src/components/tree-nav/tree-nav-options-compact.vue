<script setup lang="ts">
import { computed } from 'vue';
import { keysOf, getTreePaths } from '../../shared';
import { useRovingFocusGroupItem } from '../../composables';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import DropdownMenuCompact from '../dropdown-menu/dropdown-menu-compact.vue';
import type { MenuOptionData, MenuOptionsCompactSlots } from '../menu';
import {
  TREE_NAV_MORE_VALUE,
  createTreeNavBranchPopupBind,
  createTreeNavPopupSelectHandler,
  filterHiddenTreeNavOptions
} from './shared';
import { useTreeNavRootContext, useTreeNavUi } from './context';
import TreeNavOptionCompact from './tree-nav-option-compact.vue';
import type { TreeNavOptionData, TreeNavOptionsCompactProps, TreeNavOptionsCompactSlots } from './types';

defineOptions({
  name: 'TreeNavOptionsCompact'
});

const props = defineProps<TreeNavOptionsCompactProps>();

const slots = defineSlots<MenuOptionsCompactSlots & Pick<TreeNavOptionsCompactSlots, 'more-trigger'>>();

const ui = useTreeNavUi();

const rootCtx = useTreeNavRootContext('TreeNavOptionsCompact');

const { selected, onSelect, disabled } = rootCtx;

// Hidden filtering ------------------------------------------------------------

const filteredItems = computed(() => filterHiddenTreeNavOptions(props.items));

// Active path derivation -----------------------------------------------------

const selectedPaths = computed(() =>
  selected.value === undefined ? [] : getTreePaths(selected.value, filteredItems.value)
);

const hasChildSelected = (item: TreeNavOptionData) => selectedPaths.value.includes(item.value);

// More trigger ---------------------------------------------------------------

// Pinned to `MenuOptionData<string>` so the generic dropdown compacts resolve
// their `T` to string instead of falling back to `DefinedValue`.
const moreList = computed<MenuOptionData<string>[]>(() => filterHiddenTreeNavOptions(props.moreItems));

const hasMoreItems = computed(() => Boolean(moreList.value.length));

// Collapsed items live outside the visible `filteredItems` path search, so the
// "more" trigger derives its own active-path state from `moreList`.
const moreHasChildSelected = computed(() =>
  selected.value !== undefined && getTreePaths(selected.value, moreList.value).length > 0 ? '' : undefined
);

const moreEntry = computed(() => ({
  label: props.moreLabel ?? 'More',
  icon: props.moreIcon ?? 'lucide:ellipsis'
}));

const moreDisabled = computed(() => disabled.value || Boolean(props.moreProps?.disabled));

// Stable collection data: a fresh template object would re-register the item
// on every render.
const moreItemData = { value: TREE_NAV_MORE_VALUE, isBranch: true };

// Roving focus item as a hook: registers the trailing "more" trigger with the root group
// and exposes the collection item + roving-focus data attributes.
const { setItemElement, itemProps } = useRovingFocusGroupItem({
  tabStopId: computed(() => TREE_NAV_MORE_VALUE),
  focusable: computed(() => !moreDisabled.value),
  itemData: computed(() => moreItemData)
});

const moreTriggerBind = computed(() => ({ ...props.moreProps, disabled: moreDisabled.value }));

const moreBindings = computed(() => ({ ...moreTriggerBind.value, ...itemProps.value }));

const branchPopupBind = createTreeNavBranchPopupBind(rootCtx, () => TREE_NAV_MORE_VALUE);

// Slots ----------------------------------------------------------------------

const optionSlotNames = computed(() => keysOf(slots).filter(key => key !== 'more-trigger'));

// Popup select events arrive as widened `MenuOptionData`; adapt them back.
const handlePopupSelect = createTreeNavPopupSelectHandler(onSelect);
</script>

<template>
  <template v-for="item in filteredItems" :key="item.value">
    <TreeNavOptionCompact :item="item" :child-selected="hasChildSelected(item)">
      <template v-for="slotName in optionSlotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </TreeNavOptionCompact>
  </template>

  <!-- Trailing "more" branch for collapsed overflow items -->
  <DropdownMenuCompact
    v-if="hasMoreItems"
    v-bind="branchPopupBind"
    :modal="false"
    :items="moreList"
    :disabled="disabled"
    @select="handlePopupSelect"
  >
    <template #trigger>
      <slot name="more-trigger" :label="moreEntry.label" :icon="moreEntry.icon">
        <Button
          v-bind="moreBindings"
          :ref="setItemElement"
          :class="ui.item"
          :data-selected="false"
          :data-child-selected="moreHasChildSelected"
        >
          <Icon v-if="moreEntry.icon" :icon="moreEntry.icon" :class="ui.itemIcon" />
          <span v-if="moreEntry.label">{{ moreEntry.label }}</span>
        </Button>
      </slot>
    </template>
    <template v-for="slotName in optionSlotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </DropdownMenuCompact>
</template>
