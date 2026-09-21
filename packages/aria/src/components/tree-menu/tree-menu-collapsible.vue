<script setup lang="ts">
import { computed } from 'vue';
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '../collapsible';
import { useTreeMenuItemContext } from './context';
import type { TreeMenuCollapsibleProps } from './types';

defineOptions({
  name: 'TreeMenuCollapsible'
});

const props = defineProps<TreeMenuCollapsibleProps>();

const { isExpanded, onExpandedToggle } = useTreeMenuItemContext('TreeMenuCollapsible');

const open = computed(() => !props.disabledCollapsible && isExpanded.value);
</script>

<template>
  <CollapsibleRoot :as="as" :open="open" data-vean-tree-menu-collapsible-root @update:open="onExpandedToggle">
    <CollapsibleTrigger as-child data-vean-tree-menu-collapsible-trigger :disabled-collapsible="disabledCollapsible">
      <slot name="trigger" />
    </CollapsibleTrigger>
    <slot name="extra" />
    <CollapsibleContent data-vean-tree-menu-collapsible-content>
      <slot />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
