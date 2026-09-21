<script setup lang="ts">
import { computed, defineComponent } from 'vue';
import { SBadge, STable } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { typeToVNode } from './type-anchor';
import { useApiI18n } from './use-api-i18n';

type PropsPreset = 'props' | 'emits' | 'slots';

export type DataTableColumn<Row> = {
  key: string;
  title: string;
  cellWrapperClass?: string;
  render?: (row: Row) => any;
};

type PropsRow = {
  name: string;
  required?: boolean;
  default?: string | boolean;
  type: string;
  typeSimple?: string;
  description: string;
  descriptionKey?: string | null;
};

type EmitsOrSlotsRow = {
  name: string;
  parameters?: string;
  description: string;
  descriptionKey?: string | null;
  required?: boolean;
};

interface Props<Row = any> {
  preset?: PropsPreset;
  columns?: DataTableColumn<Row>[];
  data: Row[];
}

const props = defineProps<Props>();
const { resolveApiText, t } = useApiI18n();

type TableRow = Record<string, unknown> & {
  __rowKey: string;
};

const CellRenderer = defineComponent({
  name: 'DataTableCellRenderer',
  props: {
    render: {
      type: Function,
      required: true
    },
    row: {
      type: Object,
      required: true
    }
  },
  setup(cellProps) {
    return () => (cellProps.render as any)(cellProps.row);
  }
});

function getCellValue(row: any, key: string) {
  return row?.[key] ?? '—';
}

function buildPresetColumns(preset: PropsPreset | undefined): DataTableColumn<any>[] {
  if (preset === 'props') {
    const cols: DataTableColumn<PropsRow>[] = [
      {
        key: 'name',
        title: t('api.columns.prop_name'),
        render: row => row.name
      },
      {
        key: 'type',
        title: t('api.columns.type'),
        render: row => typeToVNode(row.type)
      },
      {
        key: 'defaultValue',
        title: t('api.columns.default'),
        render: row => row.default ?? '—'
      },
      {
        key: 'description',
        title: t('api.columns.description'),
        cellWrapperClass: 'max-w-[20rem] whitespace-pre-wrap break-words'
      }
    ];

    return cols;
  }

  if (preset === 'emits' || preset === 'slots') {
    const title = preset === 'emits' ? t('api.columns.emit_name') : t('api.columns.slot_name');
    const cols: DataTableColumn<EmitsOrSlotsRow>[] = [
      {
        key: 'name',
        title,
        render: row => row.name
      },
      {
        key: 'parameters',
        title: t('api.columns.parameters'),
        render: row => typeToVNode(row.parameters)
      },
      {
        key: 'description',
        title: t('api.columns.description'),
        cellWrapperClass: 'max-w-[20rem] whitespace-pre-wrap break-words'
      }
    ];
    return cols;
  }

  return [];
}

const resolvedColumns = computed<DataTableColumn<any>[]>(() => {
  if (props.columns?.length) {
    return props.columns;
  }

  return buildPresetColumns(props.preset);
});

const columnMinWidthMap: Record<string, number> = {
  name: 144,
  type: 176,
  parameters: 176,
  defaultValue: 136,
  description: 240
};

const tableColumns = computed<TableColumn<TableRow>[]>(() => {
  return resolvedColumns.value.map(column => ({
    accessorKey: column.key,
    header: column.title,
    minSize: columnMinWidthMap[column.key] ?? 140
  }));
});

const tableData = computed<TableRow[]>(() => {
  return props.data.map((item, index) => ({
    ...(item as Record<string, unknown>),
    __rowKey: `${index}`
  }));
});

const customRenderedColumns = computed(() => {
  return resolvedColumns.value.filter(
    column => !['name', 'type', 'parameters', 'defaultValue', 'description'].includes(column.key)
  );
});

function getColumnRender(column: DataTableColumn<any>) {
  return column.render ?? ((row: TableRow) => getCellValue(row, column.key));
}

function getDescriptionText(row: TableRow) {
  return (
    resolveApiText(
      typeof row.description === 'string' ? row.description : undefined,
      typeof row.descriptionKey === 'string' || row.descriptionKey === null ? row.descriptionKey : undefined
    ) || '—'
  );
}
</script>

<template>
  <div class="min-w-0 overflow-x-auto">
    <STable :columns="tableColumns" :data="tableData" :row-key="row => row.__rowKey" size="sm" bordered>
      <template #name="{ row: tableRow }">
        <div class="flex flex-wrap items-center gap-2">
          <SBadge size="xs" color="destructive" :open="Boolean(tableRow.required) && preset === 'props'">
            <div class="code-btn">{{ getCellValue(tableRow, 'name') }}</div>
          </SBadge>
        </div>
      </template>

      <template #type="{ row: tableRow }">
        <div class="code-btn-outline">
          <CellRenderer
            :render="getColumnRender(resolvedColumns.find(column => column.key === 'type')!)"
            :row="tableRow"
          />
        </div>
      </template>

      <template #parameters="{ row: tableRow }">
        <div class="code-btn-outline">
          <CellRenderer
            :render="getColumnRender(resolvedColumns.find(column => column.key === 'parameters')!)"
            :row="tableRow"
          />
        </div>
      </template>

      <template #defaultValue="{ row: tableRow }">
        <div class="flex flex-wrap items-center gap-2">
          <div v-if="getCellValue(tableRow, 'default') !== '—'" class="code-btn-outline">
            {{ getCellValue(tableRow, 'default') }}
          </div>
          <span v-else class="text-sm text-muted-foreground">—</span>
        </div>
      </template>

      <template v-for="col in customRenderedColumns" :key="col.key" #[col.key]="{ row: tableRow }">
        <div v-if="col.cellWrapperClass" :class="col.cellWrapperClass">
          <CellRenderer :render="getColumnRender(col)" :row="tableRow" />
        </div>
        <CellRenderer v-else :render="getColumnRender(col)" :row="tableRow" />
      </template>

      <template #description="{ row: tableRow }">
        <div class="max-w-[22rem] whitespace-pre-wrap break-words py-1 text-muted-foreground">
          {{ getDescriptionText(tableRow) }}
        </div>
      </template>
    </STable>
  </div>
</template>
