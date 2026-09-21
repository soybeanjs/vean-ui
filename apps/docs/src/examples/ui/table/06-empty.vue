<script setup lang="ts">
import { SEmpty, STable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';

interface TableData {
  id: number;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumn<TableData>[] = [
  { type: 'index', size: 50 },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Age', accessorKey: 'age', align: 'center' },
  { header: 'Address', accessorKey: 'address' }
];

const data: TableData[] = [];
</script>

<template>
  <div class="space-y-4">
    <STable :columns="columns" :data="data" :row-key="row => row.id" />
    <STable :columns="columns" :data="data" :row-key="row => row.id">
      <template #empty>
        <SEmpty
          title="No matching records"
          description="Try adjusting filters or create the first record from here."
          icon="lucide:file-search"
          media-variant="icon"
        />
      </template>
    </STable>
  </div>
</template>
