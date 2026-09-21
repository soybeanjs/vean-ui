<script setup lang="ts">
import { computed } from 'vue';
import { keysOf } from '../../shared';
import { Primitive } from '../primitive';
import { TreeMenuCompact } from '../tree-menu';
import { toMountedTarget, toTreeMenuOptions, isPaneBoundaryKey } from './shared';
import { useSplitNavRootContext, useSplitNavUi } from './context';
import { useSplitNavDerived, useSplitNavPaneFallback, useSplitNavTreePane } from './hooks';
import type { DualVerticalMenuProps, SplitNavRootSlots } from './types';
import VerticalFirstLevelMenu from './vertical-first-level-menu.vue';

defineOptions({
  name: 'SplitNavDualVerticalMenu'
});

const props = defineProps<DualVerticalMenuProps>();

const slots = defineSlots<SplitNavRootSlots>();

const ui = useSplitNavUi();

const { dir, mode, openPath, railItemElements, rootAttrs, verticalMountedId } =
  useSplitNavRootContext('SplitNavDualVerticalMenu');

const isStandalone = computed(() => mode.value === 'dual-vertical');

const standaloneBind = computed(() => {
  if (!isStandalone.value) {
    return {};
  }

  return {
    ...rootAttrs.value,
    'data-vean-split-nav-root': '',
    'data-mode': mode.value
  };
});

const { activeItem, firstLevelItems, childItems } = useSplitNavDerived(() => props.items);

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

const mountTarget = computed(() => toMountedTarget(verticalMountedId.value));

const treeSlotNames = computed(() =>
  keysOf(slots).filter(name => name === 'item' || name === 'item-leading' || name === 'item-trailing')
);

// ArrowUp is swallowed by the vertical roving groups even at their boundary, so
// the nested rail's first item falls back to the parent rail (capture phase).
// The standalone layout renders the top-level rail inside this element, so its
// own items are excluded from the fallback.
function handlePaneKeydownCapture(event: KeyboardEvent) {
  const paneElement = event.currentTarget as HTMLElement;

  if (!isPaneBoundaryKey(event, paneElement, key => key === 'ArrowUp')) return;

  const firstItem = paneElement.querySelector<HTMLElement>('[data-vean-collection-item]');

  if (
    paneElement.hasAttribute('data-vean-split-nav-root') &&
    firstItem?.closest('[data-vean-split-nav-first-level-item]')
  ) {
    return;
  }

  const ownerValue =
    firstItem?.getAttribute('data-value') === activeItem.value?.value ? openPath.value[0] : activeItem.value?.value;

  if (!ownerValue) return;

  event.preventDefault();
  railItemElements.get(ownerValue)?.focus();
}
</script>

<template>
  <Teleport defer :to="mountTarget" :disabled="!mountTarget">
    <Primitive
      v-bind="standaloneBind"
      :class="ui.verticalPane"
      :dir="dir"
      data-vean-split-nav-dual-vertical
      @keydown="onPaneKeydown"
      @keydown-capture="handlePaneKeydownCapture"
    >
      <!--
        The first-level rail sits in a column of its own so `top-left` can head it
        with a brand: the rail draws no divider, because the column after it owns
        the one between them.

        The rail keeps its height through a box of its own: the rail is
        `shrink-0` on its width for the row layouts it is also used in, which
        would leave it unshrinkable here and push it past the column's bottom.
      -->
      <div data-vean-split-nav-vertical-rail :class="ui.verticalRail">
        <div v-if="slots['top-left']" data-vean-split-nav-top-left :class="ui.topLeft">
          <slot name="top-left" :collapsed="collapsed" />
        </div>
        <div :class="ui.verticalRailMenu">
          <VerticalFirstLevelMenu :items="firstLevelItems">
            <template v-if="slots['first-level-item']" #first-level-item="slotProps">
              <slot name="first-level-item" v-bind="slotProps" />
            </template>
          </VerticalFirstLevelMenu>
        </div>
      </div>
      <div
        v-if="treeItems.length"
        data-vean-split-nav-sub-vertical
        data-vean-split-nav-dual-vertical-pane
        :class="ui.subVertical"
        :data-state="treePaneState"
        :style="treePaneStyle"
      >
        <!--
          `top-right` rides the pane column, so it appears exactly while that
          column does and follows its width, folded state included.
        -->
        <div v-if="slots['top-right']" data-vean-split-nav-top-right :class="ui.topRight">
          <slot name="top-right" :collapsed="collapsed" />
        </div>
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
    </Primitive>
  </Teleport>
</template>
