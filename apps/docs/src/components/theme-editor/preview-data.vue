<script setup lang="ts">
import { ref } from 'vue';
import { SButton, SCard, SEmpty, SKbd, SPagination, SSeparator, SSkeleton, SSpinner, STable, STabs } from '@vean/ui';
import type { TableColumn, TabsOptionData } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewData'
});

interface Invoice {
  id: number;
  invoice: string;
  status: string;
  amount: string;
}

const columns: TableColumn<Invoice>[] = [
  { header: 'Invoice', accessorKey: 'invoice' },
  { header: 'Status', accessorKey: 'status' },
  { header: 'Amount', accessorKey: 'amount', align: 'end' }
];

const data: Invoice[] = [
  { id: 1, invoice: 'INV-001', status: 'Paid', amount: '$250.00' },
  { id: 2, invoice: 'INV-002', status: 'Pending', amount: '$150.00' },
  { id: 3, invoice: 'INV-003', status: 'Paid', amount: '$350.00' },
  { id: 4, invoice: 'INV-004', status: 'Refunded', amount: '$450.00' }
];

const tabValue = ref('overview');

const tabs: TabsOptionData[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Settings', value: 'settings' }
];

const page = ref(3);
</script>

<template>
  <div class="grid gap-4 xl:grid-cols-2">
    <div class="space-y-4">
      <SCard title="Card title" description="Surface, border, radius and shadow tokens">
        <p class="text-sm text-muted-foreground">
          Card content sits on
          <code class="text-2xs">--card</code>
          with the global radius seed.
        </p>
        <template #footer>
          <div class="flex gap-2">
            <SButton size="sm">Save</SButton>
            <SButton size="sm" variant="outline">Cancel</SButton>
          </div>
        </template>
      </SCard>

      <STabs v-model="tabValue" :items="tabs" :ui="{ content: 'p-4' }">
        <template #content="{ value }">
          <div class="text-sm text-muted-foreground">Tab content: {{ value }}</div>
        </template>
      </STabs>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-3">
        <SPagination v-model:page="page" :total="200" :items-per-page="10" />
        <SSeparator orientation="vertical" class="h-5" />
        <SSpinner />
        <SKbd :value="['ctrl', 'K']" />
      </div>
    </div>

    <div class="space-y-4">
      <STable caption="Invoices" :columns="columns" :data="data" :row-key="row => row.id" class="h-56" />

      <div class="flex flex-col gap-2 rounded-lg border border-border p-3">
        <SSkeleton class="h-4 w-2/3" />
        <SSkeleton class="h-4 w-1/2" />
        <SSkeleton class="h-4 w-3/4" />
      </div>

      <SEmpty class="min-h-40" title="No data" description="Empty state icons and copy follow the text ladder." />
    </div>
  </div>
</template>
