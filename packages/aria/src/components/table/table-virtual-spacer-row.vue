<script setup lang="ts">
import { computed } from 'vue';
import { getTableSpacerCellStyle } from './shared';
import TableRow from './table-row.vue';
import type { TableVirtualSpacerRowProps } from './types';

defineOptions({
  name: 'TableVirtualSpacerRow',
  inheritAttrs: false
});

const props = defineProps<TableVirtualSpacerRowProps>();

const startStyle = computed(() => getTableSpacerCellStyle(props.paddingStart));
const endStyle = computed(() => getTableSpacerCellStyle(props.paddingEnd));
</script>

<template>
  <TableRow v-if="isVirtual && paddingStart > 0" data-vean-table-virtual-spacer-row aria-hidden="true">
    <td :colspan="colspan" :style="startStyle" />
  </TableRow>
  <slot />
  <TableRow v-if="isVirtual && paddingEnd > 0" data-vean-table-virtual-spacer-row aria-hidden="true">
    <td :colspan="colspan" :style="endStyle" />
  </TableRow>
</template>
