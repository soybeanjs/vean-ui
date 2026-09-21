<script setup lang="ts">
import { DialogConfirm } from '../dialog';
import type { DrawerConfirmProps, DrawerConfirmEmits } from './types';

defineOptions({
  name: 'DrawerConfirm'
});

const props = defineProps<DrawerConfirmProps>();

const emit = defineEmits<DrawerConfirmEmits>();
</script>

<template>
  <DialogConfirm v-bind="props" data-vean-drawer-confirm @confirm="emit('confirm', $event)">
    <slot />
  </DialogConfirm>
</template>
