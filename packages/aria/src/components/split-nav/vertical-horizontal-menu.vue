<script setup lang="ts">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { TreeNavCompact } from '../tree-nav';
import { toMountedTarget, toTreeNavOptions } from './shared';
import { useSplitNavRootContext, useSplitNavUi } from './context';
import { useSplitNavDerived, useSplitNavPaneFallback } from './hooks';
import type { SplitNavRootSlots } from './types';
import VerticalFirstLevelMenu from './vertical-first-level-menu.vue';

defineOptions({
  name: 'SplitNavVerticalHorizontalMenu'
});

const slots = defineSlots<SplitNavRootSlots>();

const ui = useSplitNavUi();

const { dir, modelValue, verticalMountedId, horizontalMountedId, onItemActivate } = useSplitNavRootContext(
  'SplitNavVerticalHorizontalMenu'
);

const { activeItem, firstLevelItems, childItems } = useSplitNavDerived();

const { onPaneKeydownCapture } = useSplitNavPaneFallback(activeItem);

const navItems = computed(() => toTreeNavOptions(childItems.value));

const verticalTarget = computed(() => toMountedTarget(verticalMountedId.value));

const horizontalTarget = computed(() => toMountedTarget(horizontalMountedId.value));

const treeNavSlotNames = computed(() =>
  keysOf(slots).filter(
    name =>
      name === 'item' ||
      name === 'item-leading' ||
      name === 'item-trailing' ||
      name === 'item-trigger-icon' ||
      name === 'item-link-icon'
  )
);
</script>

<template>
  <Teleport defer :to="verticalTarget" :disabled="!verticalTarget">
    <VerticalFirstLevelMenu :items="firstLevelItems">
      <template v-if="slots['first-level-item']" #first-level-item="slotProps">
        <slot name="first-level-item" v-bind="slotProps" />
      </template>
    </VerticalFirstLevelMenu>
  </Teleport>
  <Teleport defer :to="horizontalTarget" :disabled="!horizontalTarget">
    <div
      v-if="navItems.length"
      data-vean-split-nav-sub-horizontal
      :class="ui.subHorizontal"
      @keydown-capture="onPaneKeydownCapture"
    >
      <TreeNavCompact :items="navItems" :model-value="modelValue" :dir="dir" @update:model-value="onItemActivate">
        <template v-for="slotName in treeNavSlotNames" :key="slotName" #[slotName]="slotProps">
          <!-- @vue-expect-error ignore slot type -->
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </TreeNavCompact>
    </div>
  </Teleport>
</template>
