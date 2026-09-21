<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table';
import { toContext } from '../../shared';
import { useTableCompactHead } from './hooks';
import TableHead from './table-head.vue';
import type { TableCompactHeadProps } from './types';

defineOptions({
  name: 'TableCompactHead'
});

const props = defineProps<TableCompactHeadProps>();

const {
  bindProps,
  setElementRef,
  headerSlotProps,
  headerSelectionSlotProps,
  headerFilterSlotProps,
  sortSlotProps,
  resizeSlotProps,
  header,
  column,
  columnLabel,
  hasHeaderRenderer,
  columnSlotName,
  sortable,
  filterable,
  resizable
} = useTableCompactHead(toContext(props));
</script>

<template>
  <TableHead :ref="setElementRef" v-bind="bindProps">
    <slot name="header" v-bind="headerSlotProps">
      <slot :name="`header-${columnSlotName}`" v-bind="headerSlotProps">
        <template v-if="column.type === 'index'">
          {{ columnLabel }}
        </template>
        <template v-else-if="column.type === 'selection'">
          <slot name="header-selection" v-bind="headerSelectionSlotProps" />
        </template>
        <template v-else-if="column.type === 'expand'">
          {{ columnLabel }}
        </template>
        <template v-else>
          <FlexRender v-if="hasHeaderRenderer" :header="header" />
          <span v-else>{{ columnLabel }}</span>
          <slot v-if="sortable" name="header-sort" v-bind="sortSlotProps" />
          <slot v-if="filterable" name="header-filter" v-bind="headerFilterSlotProps" />
          <slot v-if="resizable" name="header-resize" v-bind="resizeSlotProps" />
        </template>
      </slot>
    </slot>
  </TableHead>
</template>
