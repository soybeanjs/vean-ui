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

const groupedColumns: TableColumn<GroupedTableData>[] = [
  {
    id: 'profile',
    header: 'Profile',
    columns: [
      { header: 'Name', accessorKey: 'name' },
      { header: 'City', accessorKey: 'city' }
    ]
  },
  {
    id: 'metrics',
    header: 'Metrics',
    columns: [
      { header: 'Age', accessorKey: 'age', align: 'center' },
      { header: 'Score', accessorKey: 'score', align: 'center' }
    ]
  }
];
</script>

<template>
  <STable :columns="groupedColumns" :data="groupedTableData" :row-key="row => row.id" />
</template>
