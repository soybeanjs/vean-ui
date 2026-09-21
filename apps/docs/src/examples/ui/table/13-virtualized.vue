<script setup lang="ts">
import { STable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';

interface TableRowData {
  id: number;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumn<TableRowData>[] = [
  { type: 'index', size: 56 },
  { header: 'Name', accessorKey: 'name', size: 180 },
  { header: 'Age', accessorKey: 'age', align: 'center', size: 100 },
  { header: 'Address', accessorKey: 'address', size: 260 }
];

const data: TableRowData[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  age: 20 + (index % 30),
  address: `Block ${index + 1}, Soybean Street`
}));
</script>

<template>
  <STable
    virtual
    height="280px"
    bordered
    :estimate-size="40"
    :columns="columns"
    :data="data"
    :row-key="row => row.id"
  />
</template>
