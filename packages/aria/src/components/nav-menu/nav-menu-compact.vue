<script setup lang="ts">
import { computed } from 'vue';
import { filterHiddenTreeNodes, keysOf } from '../../shared';
import { useForwardListeners, useOmitProps, usePickProps } from '../../composables';
import NavMenuList from './nav-menu-list.vue';
import NavMenuOptionCompact from './nav-menu-option-compact.vue';
import NavMenuRoot from './nav-menu-root.vue';
import NavMenuViewport from './nav-menu-viewport.vue';
import type { NavMenuCompactProps, NavMenuCompactEmits, NavMenuCompactSlots } from './types';

defineOptions({
  name: 'NavMenuCompact'
});

const props = defineProps<NavMenuCompactProps>();

const emit = defineEmits<NavMenuCompactEmits>();

const slots = defineSlots<NavMenuCompactSlots>();

const optionPropKeys = [
  'itemProps',
  'linkProps',
  'triggerProps',
  'contentProps',
  'viewportProps',
  'listProps',
  'subTriggerProps',
  'subContentProps'
] as const;

const forwardedRootProps = useOmitProps(props, ['items', ...optionPropKeys]);

const forwardedOptionProps = usePickProps(props, [...optionPropKeys]);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

// Hidden options are dropped before rendering so the root list, the nested
// flyouts and the active value all agree on the same visible tree.
const filteredItems = computed(() => filterHiddenTreeNodes(props.items));
</script>

<template>
  <NavMenuRoot v-bind="forwardedRootProps" @update:model-value="emit('update:modelValue', $event)">
    <NavMenuList v-bind="listProps">
      <NavMenuOptionCompact
        v-for="item in filteredItems"
        :key="item.value"
        v-bind="forwardedOptionProps"
        :item="item"
        v-on="listeners"
      >
        <template v-for="slotName in slotNames" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </NavMenuOptionCompact>
    </NavMenuList>
    <NavMenuViewport v-bind="viewportProps" />
  </NavMenuRoot>
</template>
