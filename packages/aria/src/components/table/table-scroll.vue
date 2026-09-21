<script setup lang="ts">
import { useTableUi } from './context';
import type { TableScrollProps } from './types';

defineOptions({
  name: 'TableScroll'
});

defineProps<TableScrollProps>();

const cls = useTableUi('scroll');
</script>

<template>
  <div data-vean-table-scroll :class="cls">
    <slot />
  </div>
</template>
