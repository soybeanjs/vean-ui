<script setup lang="ts">
import { useTableUi } from './context';
import type { TableFooterProps } from './types';

defineOptions({
  name: 'TableFooter'
});

defineProps<TableFooterProps>();

const cls = useTableUi('footer');
</script>

<template>
  <tfoot data-vean-table-footer :class="cls">
    <slot />
  </tfoot>
</template>
