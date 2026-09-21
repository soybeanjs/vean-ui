<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SInputNumber, SPagination, SSelect, SSwitch } from '@vean/ui';
import type { SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * `PaginationVariant` / `PaginationShape` 未被 ui 包导出（只在 `packages/ui/src/styles/pagination.ts`
 * 内部定义），这里用本地字面量联合并与其保持同步，不改 packages。
 */
type PaginationVariant = 'pure' | 'solid' | 'outline' | 'soft';
type PaginationShape = 'rounded' | 'square';

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  variant: PaginationVariant;
  shape: PaginationShape;
  size: ThemeSize;
  total: number;
  pageSize: number;
  siblingCount: number;
  page: number;
  showEdges: boolean;
  showFirstOrLast: boolean;
  actionVariant: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  variant: 'pure',
  shape: 'square',
  size: 'md',
  total: 200,
  pageSize: 10,
  siblingCount: 1,
  page: 8,
  showEdges: true,
  showFirstOrLast: true,
  actionVariant: false,
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免多份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const VARIANT_KEYS: readonly PaginationVariant[] = ['pure', 'solid', 'outline', 'soft'];
const SHAPE_KEYS: readonly PaginationShape[] = ['rounded', 'square'];

const variantItems: SelectOptionData<PaginationVariant>[] = toOptions(VARIANT_KEYS);
const shapeItems: SelectOptionData<PaginationShape>[] = toOptions(SHAPE_KEYS);

/** 数值控件允许空输入：`SInputNumber` 的模型是 `number | null`，空值回落到默认快照。 */
const variant = shallowRef(DEFAULTS.variant);
const shape = shallowRef(DEFAULTS.shape);
const size = shallowRef(DEFAULTS.size);
const total = shallowRef<number | null>(DEFAULTS.total);
const pageSize = shallowRef<number | null>(DEFAULTS.pageSize);
const siblingCount = shallowRef<number | null>(DEFAULTS.siblingCount);
const page = shallowRef<number | null>(DEFAULTS.page);
const showEdges = shallowRef(DEFAULTS.showEdges);
const showFirstOrLast = shallowRef(DEFAULTS.showFirstOrLast);
const actionVariant = shallowRef(DEFAULTS.actionVariant);
const disabled = shallowRef(DEFAULTS.disabled);

const resolvedTotal = computed(() => total.value ?? DEFAULTS.total);
const resolvedPageSize = computed(() => pageSize.value ?? DEFAULTS.pageSize);
const resolvedSiblingCount = computed(() => siblingCount.value ?? DEFAULTS.siblingCount);
const resolvedPage = computed(() => page.value ?? DEFAULTS.page);

function handlePageUpdate(value: number) {
  page.value = value;
}

const reset = (): void => {
  variant.value = DEFAULTS.variant;
  shape.value = DEFAULTS.shape;
  size.value = DEFAULTS.size;
  total.value = DEFAULTS.total;
  pageSize.value = DEFAULTS.pageSize;
  siblingCount.value = DEFAULTS.siblingCount;
  page.value = DEFAULTS.page;
  showEdges.value = DEFAULTS.showEdges;
  showFirstOrLast.value = DEFAULTS.showFirstOrLast;
  actionVariant.value = DEFAULTS.actionVariant;
  disabled.value = DEFAULTS.disabled;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-28" />
      </FieldItem>
      <FieldItem label="shape">
        <SSelect v-model="shape" :items="shapeItems" :trigger-props="{ 'aria-label': 'Shape' }" class="w-30" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="total">
        <SInputNumber v-model="total" :min="1" :step="50" :control-props="{ 'aria-label': 'Total' }" class="w-30" />
      </FieldItem>
      <FieldItem label="pageSize">
        <SInputNumber
          v-model="pageSize"
          :min="1"
          :step="5"
          :control-props="{ 'aria-label': 'Page size' }"
          class="w-25"
        />
      </FieldItem>
      <FieldItem label="siblingCount">
        <SInputNumber v-model="siblingCount" :min="0" :control-props="{ 'aria-label': 'Sibling count' }" class="w-25" />
      </FieldItem>
      <FieldItem label="page">
        <SInputNumber v-model="page" :min="1" :control-props="{ 'aria-label': 'Page' }" class="w-25" />
      </FieldItem>
      <FieldItem label="showEdges">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showEdges" :control-props="{ 'aria-label': 'Show edges' }" />
        </div>
      </FieldItem>
      <FieldItem label="showFirstOrLast">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showFirstOrLast" :control-props="{ 'aria-label': 'Show first or last' }" />
        </div>
      </FieldItem>
      <FieldItem label="actionVariant">
        <div class="h-8 flex items-center">
          <SSwitch v-model="actionVariant" :control-props="{ 'aria-label': 'Action variant' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SPagination
      class="max-w-2xl"
      :page="resolvedPage"
      :total="resolvedTotal"
      :page-size="resolvedPageSize"
      :sibling-count="resolvedSiblingCount"
      :variant="variant"
      :shape="shape"
      :size="size"
      :show-edges="showEdges"
      :show-first-or-last="showFirstOrLast"
      :action-variant="actionVariant"
      :disabled="disabled"
      @update:page="handlePageUpdate"
    />
  </div>
</template>
