<script setup lang="ts" generic="T extends TreeMenuBaseOptionData = TreeMenuBaseOptionData">
import { computed, watch, watchEffect } from 'vue';
import { keysOf, getTreePaths } from '../../shared';
import { usePickProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import { filterHiddenTreeMenuOptions, flattenTreeMenuNavigationNodes, getActiveExpandValues } from './shared';
import { useTreeMenuRootContext } from './context';
import TreeMenuGroupLabel from './tree-menu-group-label.vue';
import TreeMenuGroupRoot from './tree-menu-group-root.vue';
import TreeMenuGroup from './tree-menu-group.vue';
import TreeMenuOptionCompact from './tree-menu-option-compact.vue';
import type {
  TreeMenuBaseOptionData,
  TreeMenuOptionsCompactProps,
  TreeMenuOptionsCompactEmits,
  TreeMenuOptionData
} from './types';

defineOptions({
  name: 'TreeMenuCompactOptions'
});

const props = defineProps<TreeMenuOptionsCompactProps<T>>();

const emit = defineEmits<TreeMenuOptionsCompactEmits>();

type Slots = {
  'group-label': (props: { item: TreeMenuOptionData<T> }) => any;
  item: (props: { item: T }) => any;
  'item-leading': (props: { item: T }) => any;
  'item-trailing': (props: { item: T }) => any;
};

const slots = defineSlots<Slots>();

const optionSlotNames = computed(() => keysOf(slots).filter(slotName => slotName !== 'group-label'));

const forwardedOptionProps = usePickProps(props, [
  'itemProps',
  'buttonProps',
  'linkProps',
  'collapsibleProps',
  'subProps'
]);

const { modelValue, expanded, collapsed, expandStrategy, onExpandedChange, setNavigationNodes } =
  useTreeMenuRootContext('TreeMenuCompactOptions');

const items = computed(() => filterHiddenTreeMenuOptions(props.items));

const selectedPaths = computed(() => getTreePaths(modelValue.value, items.value));

const selectedExpanded = computed(() => {
  if (expandStrategy.value !== 'selected') {
    return [];
  }

  return getActiveExpandValues(modelValue.value, items.value);
});

// Expansion sync --------------------------------------------------------------
//
// `selected` owns the whole expanded set: it is replaced by the selected chain
// whenever the selection, the items, or the strategy changes. `keep` only
// guarantees visibility: the collapsible ancestors of the selected value are
// merged in additively — on mount and whenever the selection changes from
// outside (route-driven navigation). User-managed branches are never
// collapsed, and activating a visible item is a no-op because its ancestors
// are already expanded.

watch(
  [collapsed, expandStrategy, selectedExpanded, modelValue],
  () => {
    if (collapsed.value) {
      return;
    }

    if (expandStrategy.value === 'selected') {
      onExpandedChange(selectedExpanded.value);

      return;
    }

    const value = modelValue.value;

    if (!value) {
      return;
    }

    const ancestors = getActiveExpandValues(value, items.value).filter(item => item !== value);
    const missing = ancestors.filter(item => !expanded.value.includes(item));

    if (missing.length) {
      onExpandedChange([...expanded.value, ...missing]);
    }
  },
  { immediate: true }
);

// Keyboard navigation ---------------------------------------------------------
//
// The root resolves `←`/`→` against the flattened visible tree, but the items
// data lives here — publish it whenever the items or expansion change.

watchEffect(() => {
  setNavigationNodes(flattenTreeMenuNavigationNodes(items.value, value => expanded.value.includes(value)));
});
</script>

<template>
  <template v-for="item in items" :key="item.value">
    <TreeMenuGroupRoot v-if="item.isGroup" v-bind="groupRootProps">
      <TreeMenuGroupLabel v-bind="groupLabelProps">
        <slot name="group-label" :item="item">
          <Icon v-if="showGroupIcon && item.icon" :icon="item.icon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </slot>
      </TreeMenuGroupLabel>
      <TreeMenuGroup v-bind="groupProps">
        <TreeMenuOptionCompact
          v-for="child in item.children"
          :key="child.value"
          v-bind="forwardedOptionProps"
          :item="child"
          :side="side"
          :selected-paths="selectedPaths"
          @select-dropdown="emit('selectDropdown', $event)"
        >
          <template v-for="slotName in optionSlotNames" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </TreeMenuOptionCompact>
      </TreeMenuGroup>
    </TreeMenuGroupRoot>
    <TreeMenuOptionCompact
      v-else
      as="div"
      v-bind="forwardedOptionProps"
      :item="item"
      :side="side"
      :selected-paths="selectedPaths"
      @select-dropdown="emit('selectDropdown', $event)"
    >
      <template v-for="slotName in optionSlotNames" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </TreeMenuOptionCompact>
  </template>
</template>
