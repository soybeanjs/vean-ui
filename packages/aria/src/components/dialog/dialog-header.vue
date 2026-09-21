<script setup lang="ts">
import { useDialogRootContext, useDialogUi } from './context';
import type { DialogHeaderProps } from './types';

defineOptions({
  name: 'DialogHeader'
});

defineProps<DialogHeaderProps>();

const { setHeaderElement, draggable } = useDialogRootContext('DialogHeader');

const cls = useDialogUi('header');
</script>

<template>
  <div :ref="setHeaderElement" data-vean-dialog-header :data-draggable="draggable ? '' : undefined" :class="cls">
    <slot />
  </div>
</template>
