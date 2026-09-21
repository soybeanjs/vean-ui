<script setup lang="ts">
import { useSelectUi } from './context';
import type { SelectSeparatorProps } from './types';

defineOptions({
  name: 'SelectSeparator'
});

defineProps<SelectSeparatorProps>();

const cls = useSelectUi('separator');
</script>

<template>
  <div data-vean-select-separator :class="cls" role="separator" aria-orientation="horizontal">
    <slot />
  </div>
</template>
