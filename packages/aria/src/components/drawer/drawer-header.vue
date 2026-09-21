<script setup lang="ts">
import { DialogHeader } from '../dialog';
import type { DrawerHeaderProps } from './types';

defineOptions({
  name: 'DrawerHeader'
});

const props = defineProps<DrawerHeaderProps>();
</script>

<template>
  <DialogHeader v-bind="props" data-vean-drawer-header>
    <slot />
  </DialogHeader>
</template>
