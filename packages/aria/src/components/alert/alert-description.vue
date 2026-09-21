<script setup lang="ts">
import { useAlertUi } from './context';
import type { AlertDescriptionProps } from './types';

defineOptions({
  name: 'AlertDescription'
});

defineProps<AlertDescriptionProps>();

const cls = useAlertUi('description');
</script>

<template>
  <p data-vean-alert-description :class="cls">
    <slot />
  </p>
</template>
