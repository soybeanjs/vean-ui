<script setup lang="ts">
import { DialogTitle } from '../dialog';
import type { DrawerTitleProps } from './types';

defineOptions({
  name: 'DrawerTitle'
});

const props = defineProps<DrawerTitleProps>();
</script>

<template>
  <DialogTitle v-bind="props" data-vean-drawer-title>
    <slot />
  </DialogTitle>
</template>
