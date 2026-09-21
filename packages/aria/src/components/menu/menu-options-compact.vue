<script setup lang="ts" generic="T extends DefinedValue = DefinedValue">
import { computed } from 'vue';
import { keysOf, filterHiddenTreeNodes, getTreePaths, toContext } from '../../shared';
import { useForwardListeners, useOmitProps } from '../../composables';
import type { DefinedValue } from '../../types';
import { provideMenuOptionsCompactContext } from './context';
import MenuGroup from './menu-group.vue';
import MenuOptionCompact from './menu-option-compact.vue';
import type { MenuOptionsCompactProps, MenuOptionsCompactEmits, MenuOptionsCompactSlots } from './types';

defineOptions({
  name: 'MenuOptionsCompact',
  inheritAttrs: false
});

const props = defineProps<MenuOptionsCompactProps<T>>();

const emit = defineEmits<MenuOptionsCompactEmits<T>>();

const slots = defineSlots<MenuOptionsCompactSlots<T>>();

const forwardedItemProps = useOmitProps(props, ['items']);

const forwardedListeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

// Hidden options are dropped before rendering so the active path search and the
// rendered items agree on the same visible tree.
const filteredItems = computed(() => filterHiddenTreeNodes(props.items));

const selectedPaths = computed(() => {
  if (props.selectedValue === undefined) {
    return [] as T[];
  }

  return getTreePaths(props.selectedValue, filteredItems.value);
});

provideMenuOptionsCompactContext({
  ...toContext(props, ['selectedValue']),
  selectedPaths
});
</script>

<template>
  <MenuGroup v-bind="groupProps">
    <MenuOptionCompact
      v-for="item in filteredItems"
      :key="item.value"
      v-bind="forwardedItemProps"
      :item="item"
      v-on="forwardedListeners"
    >
      <template v-for="slotName in slotNames" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </MenuOptionCompact>
  </MenuGroup>
</template>
