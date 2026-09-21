<script setup lang="ts">
import { useTreeMenuUi } from './context';
import type { TreeMenuGroupRootProps } from './types';

defineOptions({
  name: 'TreeMenuGroupRoot'
});

defineProps<TreeMenuGroupRootProps>();

const cls = useTreeMenuUi('groupRoot');
</script>

<template>
  <div data-vean-tree-menu-group-root :class="cls">
    <slot />
  </div>
</template>
