<script setup lang="ts">
import { MenuSubTrigger } from '../menu';
import type { MenubarSubTriggerProps } from './types';

defineOptions({
  name: 'MenubarSubTrigger'
});

const props = defineProps<MenubarSubTriggerProps>();
</script>

<template>
  <MenuSubTrigger v-bind="props" data-vean-menubar-sub-trigger>
    <slot />
  </MenuSubTrigger>
</template>
