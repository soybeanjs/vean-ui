<script setup lang="ts">
import { Portal } from '../portal';
import type { PopperPortalProps } from './types';

defineOptions({
  name: 'PopperPortal'
});

const props = defineProps<PopperPortalProps>();
</script>

<template>
  <Portal v-bind="props">
    <slot />
  </Portal>
</template>
