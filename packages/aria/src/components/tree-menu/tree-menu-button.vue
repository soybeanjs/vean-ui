<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps, useRovingFocusGroupItem } from '../../composables';
import Button from '../button/button.vue';
import { useTreeMenuItemContext, useTreeMenuUi } from './context';
import type { TreeMenuButtonProps } from './types';

defineOptions({
  name: 'TreeMenuButton'
});

const props = defineProps<TreeMenuButtonProps>();

const forwardedProps = useOmitProps(props, ['disabledSelect']);

const cls = useTreeMenuUi('button');

const { isSelected, onSelect, value } = useTreeMenuItemContext('TreeMenuButton');

// Stable collection data: a fresh template object would re-register the item
// on every render.
const itemData = { value };

// Roving focus item as a hook: exposes the collection item + roving-focus data attributes
// (alongside `data-vean-tree-menu-button`) merged into the button bindings.
const { itemProps, setItemElement } = useRovingFocusGroupItem({
  tabStopId: computed(() => value),
  focusable: computed(() => !props.disabled),
  active: isSelected,
  itemData: computed(() => itemData)
});

const buttonBindings = computed(() => ({ ...forwardedProps.value, ...itemProps.value }));

const onClick = () => {
  if (props.disabledSelect) return;

  onSelect();
};
</script>

<template>
  <Button
    :ref="setItemElement"
    v-bind="buttonBindings"
    data-vean-tree-menu-button
    :class="cls"
    :data-selected="isSelected"
    :data-value="value"
    @click="onClick"
  >
    <slot />
  </Button>
</template>
