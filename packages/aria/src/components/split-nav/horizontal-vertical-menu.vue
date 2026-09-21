<script setup lang="ts">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { TreeMenuCompact } from '../tree-menu';
import { toMountedTarget, toTreeMenuOptions } from './shared';
import { useSplitNavRootContext, useSplitNavUi } from './context';
import { useSplitNavDerived, useSplitNavPaneFallback, useSplitNavTreePane } from './hooks';
import HorizontalFirstLevelMenu from './horizontal-first-level-menu.vue';
import type { SplitNavRootSlots } from './types';

defineOptions({
  name: 'SplitNavHorizontalVerticalMenu'
});

const slots = defineSlots<SplitNavRootSlots>();

const ui = useSplitNavUi();

const { verticalMountedId, horizontalMountedId } = useSplitNavRootContext('SplitNavHorizontalVerticalMenu');

const { activeItem, firstLevelItems, childItems } = useSplitNavDerived();

const { onPaneKeydown } = useSplitNavPaneFallback(activeItem);

const {
  collapsed,
  collapsedWidth,
  expandStrategy,
  modelValue,
  treePaneState,
  treePaneStyle,
  handleTreeSelect,
  handleCollapsedChange
} = useSplitNavTreePane();

const treeItems = computed(() => toTreeMenuOptions(childItems.value));

const verticalTarget = computed(() => toMountedTarget(verticalMountedId.value));

const horizontalTarget = computed(() => toMountedTarget(horizontalMountedId.value));

const treeSlotNames = computed(() =>
  keysOf(slots).filter(name => name === 'item' || name === 'item-leading' || name === 'item-trailing')
);
</script>

<template>
  <Teleport defer :to="horizontalTarget" :disabled="!horizontalTarget">
    <HorizontalFirstLevelMenu :items="firstLevelItems">
      <template v-if="slots['first-level-item']" #first-level-item="slotProps">
        <slot name="first-level-item" v-bind="slotProps" />
      </template>
    </HorizontalFirstLevelMenu>
  </Teleport>
  <Teleport defer :to="verticalTarget" :disabled="!verticalTarget">
    <div
      v-if="treeItems.length"
      data-vean-split-nav-sub-vertical
      :class="ui.subVertical"
      :data-state="treePaneState"
      :style="treePaneStyle"
      @keydown="onPaneKeydown"
    >
      <TreeMenuCompact
        :items="treeItems"
        :model-value="modelValue"
        :expand-strategy="expandStrategy"
        :collapsed="collapsed"
        :collapsed-width="collapsedWidth"
        @update:model-value="handleTreeSelect"
        @update:collapsed="handleCollapsedChange"
      >
        <template v-for="slotName in treeSlotNames" :key="slotName" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </TreeMenuCompact>
    </div>
  </Teleport>
</template>
