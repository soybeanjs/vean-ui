<script setup lang="ts">
import type { ArrowProps } from './types';

defineOptions({
  name: 'Arrow'
});

defineProps<ArrowProps>();
</script>

<template>
  <svg data-vean-arrow viewBox="0 0 12 6" preserveAspectRatio="none" :aria-hidden="true" focusable="false">
    <path d="M 0,0 L 6,6 L 12,0" />
  </svg>
</template>
