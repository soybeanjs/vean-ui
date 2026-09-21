<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SSelect, STable, SSwitch } from '@vean/ui';
import type { SelectOptionData, TableColumn, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * `TableVariant` lives in the UI package's style recipe (`styles/table.ts`) and is
 * not re-exported from `@vean/ui`, so the customizer tracks it with a local
 * literal union instead of reaching into package internals.
 */
type TableVariantOption = 'default' | 'simple';

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  variant: TableVariantOption;
  size: ThemeSize;
  bordered: boolean;
  rounded: boolean;
  striped: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  variant: 'default',
  size: 'md',
  bordered: false,
  rounded: false,
  striped: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const VARIANT_KEYS: readonly TableVariantOption[] = ['default', 'simple'];

const variantItems: SelectOptionData<TableVariantOption>[] = toOptions(VARIANT_KEYS);

const variant = shallowRef<TableVariantOption>(DEFAULTS.variant);
const size = shallowRef<ThemeSize>(DEFAULTS.size);
const bordered = shallowRef(DEFAULTS.bordered);
const rounded = shallowRef(DEFAULTS.rounded);
const striped = shallowRef(DEFAULTS.striped);

interface TableData {
  id: number;
  name: string;
  age: number;
  address: string;
  details?: {
    description: string;
    appearance?: string;
  };
}

const columns: TableColumn<TableData>[] = [
  { type: 'index', size: 50 },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Age', accessorKey: 'age', align: 'center' },
  { header: 'Address', accessorKey: 'address' },
  { header: 'Details', accessorKey: 'details.description' }
];

const data: TableData[] = [
  { id: 1, name: 'John Doe', age: 30, address: '123 Main St' },
  { id: 2, name: 'Jane Smith', age: 25, address: '456 Elm St' },
  { id: 3, name: 'Bob Johnson', age: 40, address: '789 Oak St' },
  { id: 4, name: 'Alice Brown', age: 35, address: '321 Pine St' },
  {
    id: 5,
    name: 'Charlie Davis',
    age: 28,
    address: '654 Maple',
    details: { description: 'Detail for Charlie Davis' }
  },
  { id: 6, name: 'Eve White', age: 32, address: '987 Cedar St' },
  { id: 7, name: 'Frank Green', age: 45, address: '246 Birch St' },
  { id: 8, name: 'Grace Lee', age: 27, address: '135 Spruce St' },
  { id: 9, name: 'Hank Miller', age: 38, address: '864 Willow St' },
  { id: 10, name: 'Ivy Wilson', age: 29, address: '753 Aspen St' }
];

const getRowKey = (row: TableData): number => row.id;

const reset = (): void => {
  variant.value = DEFAULTS.variant;
  size.value = DEFAULTS.size;
  bordered.value = DEFAULTS.bordered;
  rounded.value = DEFAULTS.rounded;
  striped.value = DEFAULTS.striped;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-30" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="bordered">
        <div class="h-8 flex items-center">
          <SSwitch v-model="bordered" :control-props="{ 'aria-label': 'Bordered' }" />
        </div>
      </FieldItem>
      <FieldItem label="rounded">
        <div class="h-8 flex items-center">
          <SSwitch v-model="rounded" :control-props="{ 'aria-label': 'Rounded' }" />
        </div>
      </FieldItem>
      <FieldItem label="striped">
        <div class="h-8 flex items-center">
          <SSwitch v-model="striped" :control-props="{ 'aria-label': 'Striped' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <STable
    caption="Table Caption"
    :variant="variant"
    :size="size"
    :bordered="bordered"
    :rounded="rounded"
    :striped="striped"
    :columns="columns"
    :data="data"
    :row-key="getRowKey"
    class="h-80 w-full"
  >
    <template #header-address>Header Address</template>
    <template #address="{ value }">
      <span class="text-red">{{ value }}</span>
    </template>
    <template #details.description="{ value }">
      <span class="text-blue">{{ value }}</span>
    </template>
  </STable>
</template>
