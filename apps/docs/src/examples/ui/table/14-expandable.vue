<script setup lang="ts">
import { STable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';

interface TableData {
  id: number;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumn<TableData>[] = [
  { type: 'expand', size: 50 },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Age', accessorKey: 'age', align: 'center' },
  { header: 'Address', accessorKey: 'address' }
];

const data: TableData[] = [
  { id: 1, name: 'John Doe', age: 30, address: '123 Main St' },
  { id: 2, name: 'Jane Smith', age: 25, address: '456 Elm St' },
  { id: 3, name: 'Bob Johnson', age: 40, address: '789 Oak St' }
];
</script>

<template>
  <STable :columns="columns" :data="data" :row-key="row => row.id">
    <template #expanded-row="{ row }">
      <!-- 展开详情是静态弱化块：静态面用 `muted`，行 hover 的交互面才是 `accent` -->
      <div class="p-4 bg-muted">
        <p>
          <strong>Name:</strong>
          {{ row.name }}
        </p>
        <p>
          <strong>Age:</strong>
          {{ row.age }}
        </p>
        <p>
          <strong>Address:</strong>
          {{ row.address }}
        </p>
      </div>
    </template>
  </STable>
</template>
