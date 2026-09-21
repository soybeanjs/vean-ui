<script setup lang="ts">
import { useTableUi } from './context';
import type { TableBodyProps } from './types';

defineOptions({
  name: 'TableBody'
});

defineProps<TableBodyProps>();

const cls = useTableUi('body');
</script>

<template>
  <tbody data-vean-table-body :class="cls">
    <slot />
  </tbody>
</template>
