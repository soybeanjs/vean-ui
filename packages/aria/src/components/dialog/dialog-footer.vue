<script setup lang="ts">
import { useDialogUi } from './context';
import type { DialogFooterProps } from './types';

defineOptions({
  name: 'DialogFooter'
});

defineProps<DialogFooterProps>();

const cls = useDialogUi('footer');
</script>

<template>
  <div data-vean-dialog-footer :class="cls">
    <slot />
  </div>
</template>
