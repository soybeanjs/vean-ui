<script setup lang="ts">
import { STable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';

interface GroupedTableData {
  id: number;
  name: string;
  age: number;
  city: string;
  score: number;
}

const groupedTableData: GroupedTableData[] = [
  { id: 1, name: 'Ada Lovelace', age: 36, city: 'London', score: 96 },
  { id: 2, name: 'Linus Torvalds', age: 28, city: 'Helsinki', score: 88 },
  { id: 3, name: 'Grace Hopper', age: 41, city: 'New York', score: 92 }
];

const filterableColumns: TableColumn<GroupedTableData>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    enableColumnFilter: true,
    filterPlaceholder: 'Filter by name'
  },
  { header: 'City', accessorKey: 'city', enableColumnFilter: true },
  { header: 'Score', accessorKey: 'score', align: 'center' }
];
</script>

<template>
  <STable :columns="filterableColumns" :data="groupedTableData" :row-key="row => row.id" />
</template>
