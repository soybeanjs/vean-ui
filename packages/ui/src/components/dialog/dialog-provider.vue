<script setup lang="ts">
import { computed } from 'vue';
import { DialogProvider, provideDialogUi } from '@vean/aria/dialog';
import { dialogVariants } from '@/styles/dialog';

defineOptions({
  name: 'SDialogProvider'
});

const ui = computed(() => dialogVariants({ size: 'md' }));

provideDialogUi(ui);
</script>

<template>
  <DialogProvider />
</template>
