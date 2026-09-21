<script setup lang="ts">
import { DialogContent } from '../dialog';
import type { DrawerContentProps } from './types';

defineOptions({
  name: 'DrawerContent'
});

const props = defineProps<DrawerContentProps>();
</script>

<template>
  <DialogContent v-bind="props" data-vean-drawer-content>
    <slot />
  </DialogContent>
</template>
