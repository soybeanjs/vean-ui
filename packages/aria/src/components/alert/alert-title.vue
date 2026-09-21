<script setup lang="ts">
import { useAlertUi } from './context';
import type { AlertTitleProps } from './types';

defineOptions({
  name: 'AlertTitle'
});

defineProps<AlertTitleProps>();

const cls = useAlertUi('title');
</script>

<template>
  <h3 data-vean-alert-title :class="cls">
    <slot />
  </h3>
</template>
