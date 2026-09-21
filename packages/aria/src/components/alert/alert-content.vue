<script setup lang="ts">
import { useAlertUi } from './context';
import type { AlertContentProps } from './types';

defineOptions({
  name: 'AlertContent'
});

defineProps<AlertContentProps>();

const cls = useAlertUi('content');
</script>

<template>
  <div data-vean-alert-content :class="cls">
    <slot />
  </div>
</template>
