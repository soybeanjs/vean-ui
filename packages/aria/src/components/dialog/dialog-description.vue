<script setup lang="ts">
import { useDialogRootContext, useDialogUi } from './context';
import type { DialogDescriptionProps } from './types';

defineOptions({
  name: 'DialogDescription'
});

defineProps<DialogDescriptionProps>();

const { descriptionId, initDescriptionId } = useDialogRootContext('DialogDescription');

const cls = useDialogUi('description');

initDescriptionId();
</script>

<template>
  <p :id="descriptionId" data-vean-dialog-description :class="cls">
    <slot />
  </p>
</template>
