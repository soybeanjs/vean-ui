<script setup lang="ts">
import { DialogTrigger } from '../dialog';
import type { DrawerTriggerProps, DrawerTriggerEmits } from './types';

defineOptions({
  name: 'DrawerTrigger'
});

const props = defineProps<DrawerTriggerProps>();

const emit = defineEmits<DrawerTriggerEmits>();
</script>

<template>
  <DialogTrigger v-bind="props" data-vean-drawer-trigger @click="emit('click', $event)">
    <slot />
  </DialogTrigger>
</template>
