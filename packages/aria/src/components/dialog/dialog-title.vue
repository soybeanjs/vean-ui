<script setup lang="ts">
import { useDialogRootContext, useDialogUi } from './context';
import type { DialogTitleProps } from './types';

defineOptions({
  name: 'DialogTitle'
});

defineProps<DialogTitleProps>();

const { titleId, initTitleId } = useDialogRootContext('DialogTitle');

const cls = useDialogUi('title');

initTitleId();
</script>

<template>
  <h2 :id="titleId" data-vean-dialog-title :class="cls">
    <slot />
  </h2>
</template>
