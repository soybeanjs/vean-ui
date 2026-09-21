<script setup lang="ts">
import { STable, STableRow, STableCell, SButton } from '@vean/ui';
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

const data: TableData[] = [
  { id: 1, name: 'John Doe', age: 30, address: '123 Main St' },
  { id: 2, name: 'Jane Smith', age: 25, address: '456 Elm St' },
  { id: 3, name: 'Bob Johnson', age: 40, address: '789 Oak St' }
];
</script>

<template>
  <STable :columns="columns" :data="data" :row-key="row => row.id">
    <template #footer="{ columnSize }">
      <STableRow>
        <STableCell :colspan="columnSize" align="center">
          <div class="flex justify-between items-center p-4">
            <span>Total: {{ data.length }} items</span>
            <div class="flex gap-2">
              <SButton size="sm" variant="pure">Previous</SButton>
              <SButton size="sm" variant="pure">Next</SButton>
            </div>
          </div>
        </STableCell>
      </STableRow>
    </template>
  </STable>
</template>
