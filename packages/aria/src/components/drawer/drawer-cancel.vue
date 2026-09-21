<script setup lang="ts">
import { DialogCancel } from '../dialog';
import type { DrawerCancelProps, DrawerCancelEmits } from './types';

defineOptions({
  name: 'DrawerCancel'
});

const props = defineProps<DrawerCancelProps>();

const emit = defineEmits<DrawerCancelEmits>();
</script>

<template>
  <DialogCancel v-bind="props" data-vean-drawer-cancel @cancel="emit('cancel', $event)">
    <slot />
  </DialogCancel>
</template>
