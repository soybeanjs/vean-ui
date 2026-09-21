<script setup lang="ts">
import { ref } from 'vue';
import { STable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';

interface DepartmentRow {
  id: number;
  name: string;
  age: number;
  role: string;
  children?: DepartmentRow[];
}

const columns: TableColumn<DepartmentRow>[] = [
  { header: 'Name', accessorKey: 'name', size: 220 },
  { header: 'Age', accessorKey: 'age', align: 'center', size: 100 },
  { header: 'Role', accessorKey: 'role', size: 180 }
];

const expanded = ref<Record<string, boolean>>({ '1': true });

const data: DepartmentRow[] = [
  {
    id: 1,
    name: 'Engineering',
    age: 12,
    role: 'Department',
    children: [
      {
        id: 11,
        name: 'Platform Team',
        age: 6,
        role: 'Team',
        children: [
          { id: 111, name: 'Ada', age: 32, role: 'Engineer' },
          { id: 112, name: 'Linus', age: 28, role: 'Engineer' }
        ]
      },
      { id: 12, name: 'Design Team', age: 4, role: 'Team' }
    ]
  },
  { id: 2, name: 'Operations', age: 8, role: 'Department' }
];
</script>

<template>
  <STable v-model:expanded="expanded" bordered :columns="columns" :data="data" :row-key="row => row.id" />
</template>
