<script setup lang="ts">
import { computed } from 'vue';
import { useRovingFocusGroup } from '../../composables';
import type { VNodeRef } from '../../types';
import { Primitive } from '../primitive';
import { flattenFirstLevelItems, hasVisibleChildren } from './shared';
import { useSplitNavRootContext, useSplitNavUi } from './context';
import FirstLevelItem from './first-level-item.vue';
import type { FirstLevelMenuProps, SplitNavOptionData, SplitNavRootSlots } from './types';

defineOptions({
  name: 'SplitNavFirstLevelMenu'
});

const props = defineProps<FirstLevelMenuProps>();

const slots = defineSlots<Pick<SplitNavRootSlots, 'first-level-item'>>();

const cls = useSplitNavUi('firstLevel');

const { dir, loop, modelValue, openPath } = useSplitNavRootContext('SplitNavFirstLevelMenu');

const visibleItems = computed(() => flattenFirstLevelItems(props.items));

const hasFirstLevelItemSlot = computed(() => Boolean(slots['first-level-item']));

// The first-level strip is a roving focus group rendered as the menu container itself.
const { setContainerElement, groupProps } = useRovingFocusGroup({
  orientation: computed(() => props.orientation),
  dir,
  loop,
  currentTabStopId: computed(() => undefined),
  defaultCurrentTabStopId: computed(() => undefined),
  preventScrollOnEntryFocus: computed(() => false)
});

function setMenuRef(nodeRef: VNodeRef) {
  setContainerElement(nodeRef);
}

const dataAttr = computed(() =>
  props.orientation === 'vertical'
    ? { 'data-vean-split-nav-vertical-first-level': '' }
    : { 'data-vean-split-nav-horizontal-first-level': '' }
);

// `groupProps` (roving focus container bindings incl. listeners) and the orientation data marker
// are merged into a single binding set because a Vue element accepts only one `v-bind`.
const menuBindings = computed(() => ({ ...groupProps.value, ...dataAttr.value }));

function isItemSelected(item: SplitNavOptionData) {
  return !hasVisibleChildren(item) && modelValue.value === item.value;
}

function isItemOpen(item: SplitNavOptionData) {
  return hasVisibleChildren(item) && openPath.value.includes(item.value);
}
</script>

<template>
  <Primitive
    v-bind="menuBindings"
    :ref="setMenuRef"
    data-vean-split-nav-first-level
    :class="cls"
    role="menubar"
    :aria-label="orientation === 'vertical' ? 'Vertical navigation' : 'Horizontal navigation'"
    :aria-orientation="orientation"
  >
    <FirstLevelItem v-for="item in visibleItems" :key="item.value" :item="item" :orientation="orientation">
      <template v-if="hasFirstLevelItemSlot">
        <slot name="first-level-item" :item="item" :selected="isItemSelected(item)" :open="isItemOpen(item)" />
      </template>
    </FirstLevelItem>
  </Primitive>
</template>
