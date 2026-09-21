<script setup lang="ts">
import { DialogDescription } from '../dialog';
import type { DrawerDescriptionProps } from './types';

defineOptions({
  name: 'DrawerDescription'
});

const props = defineProps<DrawerDescriptionProps>();
</script>

<template>
  <DialogDescription v-bind="props" data-vean-drawer-description>
    <slot />
  </DialogDescription>
</template>
