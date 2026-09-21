<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { STable } from '@vean/ui';
import type { TableColumn, TableRowEventPayload } from '@vean/ui';

interface TableData {
  id: number;
  name: string;
  role: string;
  region: string;
}

type RowEventName = 'rowClick' | 'rowDblclick' | 'rowContextmenu';

interface RowEventState {
  type: RowEventName;
  payload: TableRowEventPayload<TableData, number>;
}

const columns: TableColumn<TableData>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Role', accessorKey: 'role' },
  { header: 'Region', accessorKey: 'region' }
];

const data: TableData[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Architect', region: 'London' },
  { id: 2, name: 'Linus Torvalds', role: 'Maintainer', region: 'Helsinki' },
  { id: 3, name: 'Grace Hopper', role: 'Compiler Lead', region: 'New York' }
];

const lastEvent = shallowRef<RowEventState>();

const eventHint = computed(() => {
  if (!lastEvent.value) {
    return 'Click, double click, or right click a row to inspect the emitted payload.';
  }

  return `${lastEvent.value.type} on ${lastEvent.value.payload.rowData.name}`;
});

const rowDataPreview = computed(() => {
  if (!lastEvent.value) {
    return '{\n  "rowData": null\n}';
  }

  return JSON.stringify(lastEvent.value.payload.rowData, null, 2);
});

function updateLastEvent(type: RowEventName, event: MouseEvent, payload: TableRowEventPayload<TableData, number>) {
  if (type === 'rowContextmenu') {
    event.preventDefault();
  }

  lastEvent.value = {
    type,
    payload
  };
}

function handleRowClick(event: MouseEvent, payload: TableRowEventPayload<TableData, number>) {
  updateLastEvent('rowClick', event, payload);
}

function handleRowDblclick(event: MouseEvent, payload: TableRowEventPayload<TableData, number>) {
  updateLastEvent('rowDblclick', event, payload);
}

function handleRowContextmenu(event: MouseEvent, payload: TableRowEventPayload<TableData, number>) {
  updateLastEvent('rowContextmenu', event, payload);
}
</script>

<template>
  <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
    <STable
      :columns="columns"
      :data="data"
      :row-key="row => row.id"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @row-contextmenu="handleRowContextmenu"
    />

    <div class="rounded-lg border border-border bg-muted/30 p-4 text-sm space-y-3">
      <div class="space-y-1">
        <p class="font-medium text-foreground">Latest row event</p>
        <p class="text-muted-foreground">{{ eventHint }}</p>
      </div>

      <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs text-muted-foreground">
        <dt>rowKey</dt>
        <dd>{{ lastEvent?.payload.rowKey ?? '-' }}</dd>
        <dt>index</dt>
        <dd>{{ lastEvent?.payload.index ?? '-' }}</dd>
        <dt>level</dt>
        <dd>{{ lastEvent?.payload.level ?? '-' }}</dd>
      </dl>

      <div class="space-y-1">
        <p class="text-xs font-medium text-foreground">rowData</p>
        <pre class="overflow-auto rounded-md bg-background p-3 text-xs leading-5 text-foreground">{{
          rowDataPreview
        }}</pre>
      </div>

      <p class="text-xs text-muted-foreground">
        rowMouseenter and rowMouseleave use the same payload shape when you need hover-driven behavior.
      </p>
    </div>
  </div>
</template>
