<script setup lang="ts">
import { computed } from 'vue';
import { filterHiddenTreeNodes, keysOf } from '../../shared';
import { useRovingFocusGroupItem } from '../../composables';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import DropdownMenuCompact from '../dropdown-menu/dropdown-menu-compact.vue';
import Link from '../link/link.vue';
import type { MenuOptionCompactSlots, MenuOptionData } from '../menu';
import {
  buildTreeNavLinkProps,
  createTreeNavBranchPopupBind,
  createTreeNavPopupSelectHandler,
  hasChildren,
  isLinkItem
} from './shared';
import { useTreeNavRootContext, useTreeNavUi } from './context';
import type { TreeNavOptionCompactProps } from './types';

defineOptions({
  name: 'TreeNavOptionCompact'
});

const props = defineProps<TreeNavOptionCompactProps>();

const slots = defineSlots<MenuOptionCompactSlots>();

const ui = useTreeNavUi();

const rootCtx = useTreeNavRootContext('TreeNavOptionCompact');

const { selected, onSelect, disabled, linkProps } = rootCtx;

// Shape ----------------------------------------------------------------------

const isDisabled = computed(() => disabled.value || Boolean(props.item.disabled));

const isSelected = computed(() => selected.value === props.item.value);

const hasChildSelected = computed(() =>
  !isLinkItem(props.item) && hasChildren(props.item) && props.childSelected ? '' : undefined
);

const linkBind = computed(() => buildTreeNavLinkProps(props.item, linkProps.value, isDisabled.value));

// Stable collection data: a fresh template object would re-register the item
// on every render. The three template branches are mutually exclusive, so a
// single object serves the link, branch, and leaf cases.
const itemData = {
  value: props.item.value,
  isBranch: !isLinkItem(props.item) && hasChildren(props.item)
};

const branchPopupBind = createTreeNavBranchPopupBind(rootCtx, () => props.item.value);

// Roving focus item as a hook: exactly one of the three shape branches renders, and all
// share the same group registration, so one hook call covers the link leaf, the branch
// trigger and the plain leaf.
const { setItemElement, itemProps } = useRovingFocusGroupItem({
  tabStopId: computed(() => props.item.value),
  focusable: computed(() => !isDisabled.value),
  itemData: computed(() => itemData)
});

// Pinned to `MenuOptionData<string>` so the generic dropdown compact resolves
// its `T` to string instead of falling back to `DefinedValue`. Children are
// filtered so a standalone tree-nav item matches the compact list output.
const branchItems = computed<MenuOptionData<string>[]>(() => filterHiddenTreeNodes(props.item.children));

// Link bindings merged after `itemProps` so the href/to props win on the link leaf.
const linkBindings = computed(() => ({ ...itemProps.value, ...linkBind.value }));

const slotNames = computed(() => keysOf(slots));

function handleSelect(event: Event) {
  if (isDisabled.value) return;

  onSelect(props.item, event);
}

// Popup select events arrive as widened `MenuOptionData`; adapt them back.
const handlePopupSelect = createTreeNavPopupSelectHandler(onSelect);
</script>

<template>
  <!-- A. Top-level link leaf -->
  <Link
    v-if="isLinkItem(item)"
    v-slot="{ isHref }"
    v-bind="linkBindings"
    :ref="setItemElement"
    :class="ui.item"
    :data-selected="isSelected"
    @click="handleSelect($event)"
  >
    <slot name="item" :item="item">
      <slot name="item-leading" :item="item">
        <Icon v-if="item.icon" :icon="item.icon" :class="ui.itemIcon" />
      </slot>
      <span>{{ item.label }}</span>
      <slot v-if="isHref" name="item-link-icon" :item="item">
        <Icon icon="lucide:arrow-up-right" :class="ui.itemLinkIcon" />
      </slot>
      <slot name="item-trailing" :item="item" />
    </slot>
  </Link>

  <!-- B. Top-level branch with a DropdownMenu popup -->
  <DropdownMenuCompact
    v-else-if="hasChildren(item)"
    v-bind="branchPopupBind"
    :items="branchItems"
    :disabled="isDisabled"
    :modal="false"
    @select="handlePopupSelect"
  >
    <template #trigger>
      <Button
        v-bind="itemProps"
        :ref="setItemElement"
        :class="ui.item"
        :data-selected="false"
        :data-child-selected="hasChildSelected"
        :disabled="isDisabled"
      >
        <slot name="item" :item="item">
          <slot name="item-leading" :item="item">
            <Icon v-if="item.icon" :icon="item.icon" :class="ui.itemIcon" />
          </slot>
          <span>{{ item.label }}</span>
          <slot name="item-trigger-icon" :item="item">
            <Icon icon="lucide:chevron-down" :class="ui.itemTriggerIcon" />
          </slot>
          <slot name="item-trailing" :item="item" />
        </slot>
      </Button>
    </template>
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </DropdownMenuCompact>

  <!-- C. Top-level plain leaf -->
  <Button
    v-else
    v-bind="itemProps"
    :ref="setItemElement"
    :class="ui.item"
    :data-selected="isSelected"
    :disabled="isDisabled"
    @click="handleSelect($event)"
  >
    <slot name="item" :item="item">
      <slot name="item-leading" :item="item">
        <Icon v-if="item.icon" :icon="item.icon" :class="ui.itemIcon" />
      </slot>
      <span>{{ item.label }}</span>
      <slot name="item-trailing" :item="item" />
    </slot>
  </Button>
</template>
