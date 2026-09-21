<script setup lang="ts">
import { Primitive } from '../primitive';
import { useTreeMenuUi } from './context';
import type { TreeMenuGroupProps } from './types';

defineOptions({
  name: 'TreeMenuGroup'
});

withDefaults(defineProps<TreeMenuGroupProps>(), {
  as: 'ul'
});

const cls = useTreeMenuUi('group');
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="cls" data-vean-tree-menu-group role="group">
    <slot />
  </Primitive>
</template>
