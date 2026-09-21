<script setup lang="ts">
import { useDialogUi } from './context';
import type { DialogContentProps } from './types';

defineOptions({
  name: 'DialogContent'
});

defineProps<DialogContentProps>();

const cls = useDialogUi('content');
</script>

<template>
  <div data-vean-dialog-content :class="cls">
    <slot />
  </div>
</template>
