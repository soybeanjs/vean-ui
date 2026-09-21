<script setup lang="ts">
import { useSelectUi } from './context';
import type { SelectTriggerIconProps } from './types';

defineOptions({
  name: 'SelectTriggerIcon'
});

defineProps<SelectTriggerIconProps>();

const cls = useSelectUi('triggerIcon');
</script>

<template>
  <span data-vean-select-trigger-icon :class="cls" aria-hidden="true">
    <slot />
  </span>
</template>
