<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { getTreeNavigationKey, resolveTreeNavigation } from '../../shared';
import type { TreeNavigationNode } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState, useRovingFocusGroup } from '../../composables';
import type { VNodeRef } from '../../types';
import { treeMenuCssVars } from './shared';
import { provideTreeMenuRootContext, useTreeMenuUi } from './context';
import type { TreeMenuRootProps, TreeMenuCollapsedState, TreeMenuRootEmits } from './types';

defineOptions({
  name: 'TreeMenuRoot'
});

const props = withDefaults(defineProps<TreeMenuRootProps>(), {
  defaultValue: '',
  defaultExpanded: () => [] as string[],
  expandStrategy: 'keep',
  collapsed: undefined,
  defaultCollapsed: false,
  collapsedWidth: 50,
  indent: 16,
  pxToRem: (px: number) => px / 16
});

const emit = defineEmits<TreeMenuRootEmits>();

const cls = useTreeMenuUi('root');

const dir = useDirection();

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue
);

const expanded = useControllableState(
  () => props.expanded,
  value => {
    emit('update:expanded', value);
  },
  props.defaultExpanded
);

const collapsed = useControllableState(
  () => props.collapsed,
  value => {
    emit('update:collapsed', value);
  },
  props.defaultCollapsed
);

const expandStrategy = computed(() => props.expandStrategy);

const dataState = computed<TreeMenuCollapsedState>(() => (collapsed.value ? 'collapsed' : 'expanded'));

const style = computed<CSSProperties>(() => {
  const collapsedWidth = props.pxToRem(props.collapsedWidth);
  const indent = props.pxToRem(props.indent);

  return {
    [treeMenuCssVars.collapsedWidth]: `${collapsedWidth}rem`,
    [treeMenuCssVars.indent]: `${indent}rem`
  };
});

let backupExpanded: string[] | null = null;

watch(collapsed, value => {
  if (value) {
    backupExpanded = [...(expanded.value ?? [])];
    expanded.value = [];

    return;
  }

  if (backupExpanded?.length) {
    expanded.value = [...backupExpanded];
    backupExpanded = null;
  }
});

// Keyboard navigation ---------------------------------------------------------
//
// Roving focus owns the single tab stop and the vertical keys (↑/↓/Home/End
// roam the rendered items). The horizontal keys are resolved here against the
// flattened visible tree published by `TreeMenuOptionsCompact`: `→` expands a
// closed branch or moves into its first child, `←` collapses an expanded
// branch or returns to the parent.

const { setContainerElement, groupProps, getOrderedItems } = useRovingFocusGroup({
  orientation: computed(() => 'vertical' as const),
  dir,
  loop: computed(() => false),
  currentTabStopId: computed(() => undefined),
  defaultCurrentTabStopId: computed(() => undefined),
  preventScrollOnEntryFocus: computed(() => false)
});

function setRootRef(nodeRef: VNodeRef) {
  setContainerElement(nodeRef);
}

const navigationNodes = shallowRef<TreeNavigationNode[]>([]);

const setNavigationNodes = (nodes: TreeNavigationNode[]) => {
  navigationNodes.value = nodes;
};

function toggleExpanded(value: string) {
  expanded.value = expanded.value.includes(value)
    ? expanded.value.filter(item => item !== value)
    : [...expanded.value, value];
}

function onTreeKeydown(event: KeyboardEvent) {
  if (collapsed.value) return;
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;

  // Vertical keys are already handled by the roving focus group.
  const key = getTreeNavigationKey(event);
  if (key !== 'left' && key !== 'right') return;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const items = getOrderedItems();
  if (!items.some(item => item.element === target)) return;

  const currentValue = target.dataset.value ?? '';
  const result = resolveTreeNavigation(navigationNodes.value, currentValue, key, dir.value);

  if (!result) return;

  event.preventDefault();

  if (result.toggleExpand) {
    toggleExpanded(currentValue);
    return;
  }

  if (result.targetValue) {
    items.find(item => item.element.dataset.value === result.targetValue)?.element.focus();
  }
}

provideTreeMenuRootContext({
  modelValue,
  expanded,
  collapsed,
  expandStrategy,
  navigationNodes,
  setNavigationNodes
});
</script>

<template>
  <div
    v-bind="groupProps"
    :ref="setRootRef"
    data-vean-tree-menu-root
    :class="cls"
    :data-state="dataState"
    :style="style"
    role="tree"
    @keydown="onTreeKeydown"
  >
    <slot />
  </div>
</template>
